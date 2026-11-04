const { app, BrowserWindow, protocol, net, shell, session, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const packageVersion = require('../package.json').version;
const { DEFAULT_MANIFEST_URL, checkForUpdate, stageUpdate } = require('./updater.cjs');
const { runUpdaterHelper } = require('./update-helper.cjs');

const smoke = process.argv.includes('--smoke-test');
let smokeDeadline;
if (smoke) smokeDeadline = setTimeout(() => app.exit(1), 90000);
if (smoke && process.env.MYTHREON_SMOKE_DIR) app.setPath('userData', process.env.MYTHREON_SMOKE_DIR);
protocol.registerSchemesAsPrivileged([{ scheme: 'mythreon', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } }]);
const origin = 'mythreon://game';
let mainWindow;
let stagedUpdate = null;
const manifestUrl = process.env.MYTHREON_UPDATE_MANIFEST_URL || DEFAULT_MANIFEST_URL;
const external = url => {
  try { if (new URL(url).protocol === 'https:') void shell.openExternal(url); } catch {}
};
async function createWindow() {
  const dist = path.join(app.getAppPath(), 'dist');
  let onlineOrigins=[];try{onlineOrigins=JSON.parse(await fs.readFile(path.join(dist,'online-origins.json'),'utf8')).origins.filter(origin=>{try{return new URL(origin).origin===origin&&new URL(origin).protocol==='https:';}catch{return false;}});}catch{}
  const connectSources=["'self'",...onlineOrigins,...onlineOrigins.map(origin=>origin.replace('https://','wss://'))].join(' ');
  protocol.handle('mythreon', async request => {
    try {
      const url = new URL(request.url);
      if (url.hostname !== 'game') return new Response('Not found', { status: 404 });
      const pathname = decodeURIComponent(url.pathname);
      // OAuth retorna para o deep-link customizado; a SPA precisa receber o
      // hash/query para o Supabase concluir a sessão no mesmo executável.
      const appPath = pathname === '/' || pathname === '/auth/callback' ? '/index.html' : pathname;
      const file = path.resolve(dist, '.' + appPath);
      const relative = path.relative(dist, file);
      if (relative.startsWith('..') || path.isAbsolute(relative) || !(await fs.stat(file)).isFile()) return new Response('Not found', { status: 404 });
      const response = await net.fetch(pathToFileURL(file).toString());
      const headers = new Headers(response.headers);
      headers.set('Content-Security-Policy', `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; worker-src 'self' blob:; connect-src ${connectSources}; object-src 'none'; base-uri 'none'; frame-src 'none'`);
      return new Response(response.body, { status: response.status, headers });
    } catch { return new Response('Not found', { status: 404 }); }
  });
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  mainWindow = new BrowserWindow({
    width: 1440, height: 940, minWidth: 920, minHeight: 680,
    title: 'Mythreon Online', backgroundColor: '#0a1013', show: !smoke,
    icon: path.join(dist, 'assets', 'branding', 'mythreon-logo-mark.png'),
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true, preload: path.join(app.getAppPath(), 'desktop', 'preload.cjs') },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { if (!smoke) external(url); return { action: 'deny' }; });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(origin + '/')) { event.preventDefault(); if (!smoke) external(url); }
  });
  await mainWindow.loadURL(origin + '/index.html');
  if (!smoke) void checkDesktopUpdate();
  if (smoke) {
    let timer;
    try {
      timer = setTimeout(() => app.exit(1), 90000);
      const basic = await mainWindow.webContents.executeJavaScript(`(async () => {
        for(let n=0;n<50 && !document.getElementById('root')?.textContent?.length;n++) await new Promise(r=>setTimeout(r,100));
        const logo=await fetch('/assets/branding/mythreon-logo-mark.png');
        return { title:document.title, rendered:!!document.getElementById('root')?.textContent?.length, crypto:!!globalThis.crypto?.subtle, asset:logo.ok, isolated:typeof process==='undefined' && typeof require==='undefined', updaterBridge:typeof globalThis.mythreonDesktop?.checkForUpdate==='function' };
      })()`);
      if (!basic.rendered || !basic.crypto || !basic.asset || !basic.isolated || !basic.updaterBridge) throw new Error('Falha na abertura: '+JSON.stringify(basic));
      const workerFile = (await fs.readdir(path.join(dist, 'assets'))).find(name => /^buildLab\.worker-.*\.js$/.test(name));
      if (!workerFile) throw new Error('Worker do laboratório ausente no pacote.');
      if (process.env.MYTHREON_SMOKE_FIXTURE) {
        const fixture = JSON.parse(await fs.readFile(process.env.MYTHREON_SMOKE_FIXTURE, 'utf8'));
        basic.lab = await mainWindow.webContents.executeJavaScript(`new Promise((resolve,reject)=>{
          const worker=new Worker(${JSON.stringify(origin + '/assets/' + workerFile)},{type:'module'});
          const timeout=setTimeout(()=>{worker.terminate();reject(new Error('Timeout do laboratório'));},60000);
          worker.onerror=()=>{clearTimeout(timeout);worker.terminate();reject(new Error('Falha no worker'));};
          worker.onmessage=event=>{if(event.data.type==='result'){clearTimeout(timeout);worker.terminate();resolve({enemies:event.data.report.enemies.length,plans:event.data.report.plans.length});}else if(event.data.type==='error'){clearTimeout(timeout);worker.terminate();reject(new Error(event.data.message));}};
          worker.postMessage(${JSON.stringify(fixture)});
        })`);
        if (!basic.lab.enemies || !basic.lab.plans) throw new Error('Laboratório sem resultados.');
      }
      if (process.env.MYTHREON_SMOKE_RESULT) await fs.writeFile(process.env.MYTHREON_SMOKE_RESULT, JSON.stringify({ success: true, ...basic }, null, 2));
      clearTimeout(timer); clearTimeout(smokeDeadline); app.exit(0);
    } catch (error) {
      if (process.env.MYTHREON_SMOKE_RESULT) await fs.writeFile(process.env.MYTHREON_SMOKE_RESULT, JSON.stringify({ success: false, error: String(error) }));
      clearTimeout(timer); clearTimeout(smokeDeadline); app.exit(1);
    }
  }
}

async function checkDesktopUpdate() {
  if (!mainWindow || mainWindow.isDestroyed()) return { status: 'unavailable' };
  try {
    const result = await checkForUpdate({ manifestUrl, currentVersion: packageVersion });
    const payload = { status: result.available ? 'available' : 'unavailable', ...result };
    if (result.available) mainWindow.webContents.send('mythreon:update', payload);
    return payload;
  } catch (error) {
    // A missing manifest must never block the game. The launcher will simply
    // try again on the next start.
    console.warn('[updater] manifesto indisponível:', error?.message || error);
    return { status: 'unavailable' };
  }
}

ipcMain.handle('mythreon:check-update', () => checkDesktopUpdate());
ipcMain.handle('mythreon:download-update', async () => {
  try {
    const result = await stageUpdate({ manifestUrl, currentVersion: packageVersion, userDataPath: app.getPath('userData') });
    stagedUpdate = result.downloaded ? result : null;
    const payload = { status: result.downloaded ? 'downloaded' : 'unavailable', ...result };
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('mythreon:update', payload);
    return payload;
  } catch (error) {
    const payload = { status: 'error', error: error?.message || 'Falha no download da atualização.' };
    if (mainWindow && !mainWindow.isDestroyed()) mainWindow.webContents.send('mythreon:update', payload);
    return payload;
  }
});
ipcMain.handle('mythreon:open-update', async () => {
  if (!stagedUpdate?.downloadPath) return { ok: false, error: 'Baixe a atualização antes de abrir o atualizador.' };
  if (!app.isPackaged) {
    const error = await shell.openPath(stagedUpdate.downloadPath);
    return error ? { ok: false, error } : { ok: true, development: true };
  }
  try {
    const child = spawn(process.execPath, ['--mythreon-updater-helper', JSON.stringify({
      pid: process.pid,
      targetPath: process.execPath,
      packagePath: stagedUpdate.downloadPath,
      sha256: stagedUpdate.manifest.sha256,
    })], { detached: true, stdio: 'ignore', windowsHide: true });
    child.unref();
    setTimeout(() => app.quit(), 120);
    return { ok: true, restarting: true };
  } catch (error) {
    return { ok: false, error: error?.message || 'Não foi possível iniciar o atualizador.' };
  }
});
const helperArgumentIndex = process.argv.indexOf('--mythreon-updater-helper');
if (helperArgumentIndex >= 0) {
  let helperPayload = {};
  try { helperPayload = JSON.parse(process.argv[helperArgumentIndex + 1] || '{}'); } catch {}
  app.whenReady().then(async () => {
    try { await runUpdaterHelper(helperPayload); app.exit(0); }
    catch (error) { console.error('[updater-helper]', error); app.exit(1); }
  });
} else if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (mainWindow) { if(mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
  app.whenReady().then(createWindow).catch(error => { console.error(error); app.exit(1); });
  app.on('window-all-closed', () => app.quit());
}
