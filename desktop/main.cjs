const { app, BrowserWindow, protocol, net, shell, session } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const smoke = process.argv.includes('--smoke-test');
let smokeDeadline;
if (smoke) smokeDeadline = setTimeout(() => app.exit(1), 90000);
if (smoke && process.env.MYTHREON_SMOKE_DIR) app.setPath('userData', process.env.MYTHREON_SMOKE_DIR);
protocol.registerSchemesAsPrivileged([{ scheme: 'mythreon', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, corsEnabled: true } }]);
const origin = 'mythreon://game';
let mainWindow;
const external = url => {
  try { if (new URL(url).protocol === 'https:') void shell.openExternal(url); } catch {}
};
async function createWindow() {
  const dist = path.join(app.getAppPath(), 'dist');
  protocol.handle('mythreon', async request => {
    try {
      const url = new URL(request.url);
      if (url.hostname !== 'game') return new Response('Not found', { status: 404 });
      const pathname = decodeURIComponent(url.pathname);
      const file = path.resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
      const relative = path.relative(dist, file);
      if (relative.startsWith('..') || path.isAbsolute(relative) || !(await fs.stat(file)).isFile()) return new Response('Not found', { status: 404 });
      const response = await net.fetch(pathToFileURL(file).toString());
      const headers = new Headers(response.headers);
      headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; worker-src 'self' blob:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-src 'none'");
      return new Response(response.body, { status: response.status, headers });
    } catch { return new Response('Not found', { status: 404 }); }
  });
  session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
  mainWindow = new BrowserWindow({
    width: 1440, height: 940, minWidth: 920, minHeight: 680,
    title: 'Mythreon Online', backgroundColor: '#0a1013', show: !smoke,
    icon: path.join(dist, 'assets', 'branding', 'mythreon-logo-mark.png'),
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true, webSecurity: true },
  });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setWindowOpenHandler(({ url }) => { if (!smoke) external(url); return { action: 'deny' }; });
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(origin + '/')) { event.preventDefault(); if (!smoke) external(url); }
  });
  await mainWindow.loadURL(origin + '/index.html');
  if (smoke) {
    let timer;
    try {
      timer = setTimeout(() => app.exit(1), 90000);
      const basic = await mainWindow.webContents.executeJavaScript(`(async () => {
        for(let n=0;n<50 && !document.getElementById('root')?.textContent?.length;n++) await new Promise(r=>setTimeout(r,100));
        const logo=await fetch('/assets/branding/mythreon-logo-mark.png');
        return { title:document.title, rendered:!!document.getElementById('root')?.textContent?.length, crypto:!!globalThis.crypto?.subtle, asset:logo.ok, isolated:typeof process==='undefined' && typeof require==='undefined' };
      })()`);
      if (!basic.rendered || !basic.crypto || !basic.asset || !basic.isolated) throw new Error('Falha na abertura: '+JSON.stringify(basic));
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
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on('second-instance', () => { if (mainWindow) { if(mainWindow.isMinimized()) mainWindow.restore(); mainWindow.focus(); } });
  app.whenReady().then(createWindow).catch(error => { console.error(error); app.exit(1); });
  app.on('window-all-closed', () => app.quit());
}
