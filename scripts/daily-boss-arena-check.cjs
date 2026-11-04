const {app,BrowserWindow}=require('electron');
const {build}=require('esbuild');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'node_modules/.cache/boss-arena');
app.setPath('userData',path.join(cache,'profile'));
let server,win;
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{
 try{
  await fs.mkdir(cache,{recursive:true});
  const compiled=await build({absWorkingDir:root,stdin:{contents:`
import React,{useState,useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {DailyBossArena} from './src/ui/DailyBossArena';
import {createNewCharacter} from './src/engine/save';
import {ALL_ITEM_TEMPLATES,createItem} from './src/data/items';
const hero=createNewCharacter('Guardião de Lyss');hero.id='self';hero.activeRace={ataqueId:'A10'};hero.cosmeticLoadout={bossAddonTemplateId:'ADDON_BOSS_LUMINESCENTE'};hero.inventory.items.push(createItem(ALL_ITEM_TEMPLATES.ADDON_BOSS_LUMINESCENTE));
const initialRoster=[{character_id:'self',name:hero.name,damage:320},{character_id:'ally',name:'Mirelle',damage:450,attack_id:'A2'},{character_id:'ally2',name:'Sinax',damage:190,cosmetics:{skinTemplateId:'SKIN_CAPA_PRIMEIRO_CANTO'}}];
function Preview(){const [roster,setRoster]=useState(initialRoster);const [combat,setCombat]=useState({runId:'preview',hp:460,hpMax:700,damageTaken:240,knockouts:0,recoveryUntil:0,lastDamage:0});const [hit,setHit]=useState(null),[now,setNow]=useState(Date.now());useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),100);return()=>clearInterval(timer)},[]);return <><h1>Mythreon · Boss Diário</h1><DailyBossArena run={{id:'preview',boss_template_id:'DAILY_COLOSSO',boss_name:'Colosso de Dhor',hp_total:10000,hp_remaining:6450,status:'open'}} sprite="/assets/monsters/COLOSSO.png" character={hero} roster={roster} participants={3} combat={combat} hit={hit} now={now} joined/><button id="strike" onClick={()=>setHit({id:crypto.randomUUID(),runId:'preview',damage:320,damageTaken:55,at:Date.now()})}>Golpe confirmado de teste</button><button id="ally" onClick={()=>setRoster(current=>current.map(entry=>entry.character_id==='ally'?{...entry,damage:entry.damage+120}:entry))}>Sincronizar aliado</button><button id="ko" onClick={()=>setCombat(current=>({...current,hp:0,knockouts:1,recoveryUntil:Date.now()+30000}))}>Prévia de nocaute</button></>};createRoot(document.getElementById('root')).render(<Preview/>);
`,loader:'tsx',resolveDir:root},bundle:true,write:false,outfile:path.join(cache,'preview.js')});
  const js=compiled.outputFiles.find(file=>file.path.endsWith('.js')).contents;
  const gameCssFile=(await fs.readdir(path.join(root,'dist/assets'))).find(file=>/^index-.*\.css$/.test(file));
  const css=Buffer.concat([await fs.readFile(path.join(root,'dist/assets',gameCssFile)),compiled.outputFiles.find(file=>file.path.endsWith('.css')).contents]);
  const html='<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><style>body{margin:0;padding:16px;box-sizing:border-box;background:#071116;color:#f9e2a1;font-family:Arial}#root{max-width:1000px;margin:auto}h1{font-size:20px}button{background:#e8cb76;border:0;padding:14px;border-radius:8px;margin-top:16px}</style><link rel="stylesheet" href="/preview.css"/><div id="root"></div><script src="/preview.js"></script>';
  server=http.createServer(async(req,res)=>{try{
   const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.setHeader('Content-Type','text/html');res.end(html);return;}
   if(url.pathname==='/preview.js'){res.setHeader('Content-Type','application/javascript');res.end(js);return;}if(url.pathname==='/preview.css'){res.setHeader('Content-Type','text/css');res.end(css);return;}
   const file=path.resolve(root,'public','.'+decodeURIComponent(url.pathname));if(!file.startsWith(path.join(root,'public')+path.sep)){res.writeHead(403).end();return;}const mime={'.png':'image/png','.gif':'image/gif','.giff':'image/gif','.jpg':'image/jpeg'};res.setHeader('Content-Type',mime[path.extname(file)]??'application/octet-stream');res.end(await fs.readFile(file));
  }catch{res.writeHead(404).end();}});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  win=new BrowserWindow({show:false,width:1100,height:820,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false,offscreen:true}});
  const errors=[];win.webContents.on('console-message',(_event,level,message)=>{if(level===3&&!message.includes('404')&&!message.includes('Failed to load resource'))errors.push(message);});
  await win.loadURL('http://127.0.0.1:'+server.address().port+'/');
  for(let n=0;n<80;n++){if(await win.webContents.executeJavaScript('!!document.querySelector(".boss-arena")'))break;await pause(100);}
  for(let n=0;n<100;n++){if(await win.webContents.executeJavaScript('Array.from(document.querySelectorAll(".boss-arena img")).every(img=>img.complete&&img.naturalWidth>0)'))break;await pause(100);}
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena-backdrop").naturalWidth>0'),true,'Fundo deve carregar antes da captura');
  assert.equal(await win.webContents.executeJavaScript('document.querySelectorAll(".boss-arena-ally").length'),2);
  assert.equal(await win.webContents.executeJavaScript('document.querySelectorAll(".boss-arena .hero-art-addon").length'),1,'Addon possuído deve aparecer no Boss');
  assert.equal(await win.webContents.executeJavaScript('Array.from(document.querySelectorAll(".boss-arena-ally .hero-art")).some(el=>el.dataset.heroSource.includes("SKIN_PREMIUM_MES_01"))'),true,'Skin humana de aliado deve aparecer no roster público');
  assert.equal(await win.webContents.executeJavaScript('document.querySelector("[role=progressbar]").getAttribute("aria-valuenow")'),'65');
  assert.equal(await win.webContents.executeJavaScript('!!document.querySelector(".boss-arena-activity")'),false,'Não animar contribuições antigas no carregamento inicial');
  await win.webContents.executeJavaScript('document.getElementById("ally").click()');await pause(150);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena-activity").textContent.includes("+120")'),true);
  await win.webContents.executeJavaScript('document.getElementById("strike").click()');await pause(450);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena-damage").textContent.includes("320")'),true);
  await win.webContents.executeJavaScript('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena-retaliation").textContent.includes("55")'),true);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector("progress").value'),460);
  await fs.writeFile(path.join(cache,'desktop.png'),(await win.webContents.capturePage()).toPNG());
  win.setSize(390,820);await pause(400);
  assert.equal(await win.webContents.executeJavaScript('document.documentElement.scrollWidth<=window.innerWidth'),true,'Arena não pode causar rolagem horizontal no celular');
  await fs.writeFile(path.join(cache,'mobile.png'),(await win.webContents.capturePage()).toPNG());
  await win.webContents.executeJavaScript('localStorage.setItem("mythreon_animations_enabled","false");window.dispatchEvent(new Event("mythreon-settings-change"));document.getElementById("strike").click()');await pause(200);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena").classList.contains("boss-arena-still")'),true);
  await win.webContents.executeJavaScript('document.getElementById("ko").click()');await pause(100);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector(".boss-arena-player-health").textContent.includes("Recuperando")'),true);
  assert.equal(await win.webContents.executeJavaScript('document.querySelector("progress").value'),0);
  assert.deepEqual(errors,[]);
  console.log('PASS arena: sprites, 2 aliados, HP, golpe confirmado, viewport 390px sem overflow e modo sem animação. Imagens: '+cache);
  await new Promise(resolve=>server.close(resolve));app.exit(0);
 }catch(error){console.error(error);app.exit(1);}
});
setTimeout(()=>{console.error('Timeout da prévia da arena');app.exit(2)},45000);
