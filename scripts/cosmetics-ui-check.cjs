const {app,BrowserWindow}=require('electron'),{build}=require('esbuild');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'node_modules/.cache/cosmetics-ui');
app.setPath('userData',path.join(cache,'profile'));
app.disableHardwareAcceleration(); // Deterministic offscreen captures; real GPU devices are verified separately.
let server,win,lastSource="",pageErrors=[];const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{try{
 await fs.mkdir(cache,{recursive:true});
 const bundle=await build({bundle:true,write:false,platform:'browser',format:'iife',outfile:'preview.js',define:{'import.meta.env':'{}'},loader:{'.png':'dataurl','.jpg':'dataurl'},stdin:{resolveDir:root,sourcefile:'cosmetics-preview.tsx',loader:'tsx',contents:`
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';
import {Personagem} from './src/ui/Personagem';import {ZoneView} from './src/ui/Zone';import {HeroArt} from './src/ui/HeroArt';
import {useGameStore} from './src/store/gameStore';import {createNewCharacter} from './src/engine/save';import {ALL_ITEM_TEMPLATES,createItem} from './src/data/items';
window.__store=useGameStore;window.__alerts=[];window.alert=message=>window.__alerts.push(message);localStorage.setItem('mythreon_animations_enabled','false');
window.__load=()=>{const character=createNewCharacter('Guardião do Primeiro Canto');character.level=30;character.tutorialCompleted=true;character.introSeen=true;character.calendarMonthlySkinKey='2026-11';
character.inventory.items=['LUMINESCENCIA_MATRIZ','LUMINESCENCIA_PET','ADDON_BOSS_LUMINESCENTE'].map(id=>createItem(ALL_ITEM_TEMPLATES[id]));character.cosmeticLoadout={skinTemplateId:'SKIN_CAPA_PRIMEIRO_CANTO',matrixGlowTemplateId:'LUMINESCENCIA_MATRIZ',petAuraTemplateId:'LUMINESCENCIA_PET',bossAddonTemplateId:'ADDON_BOSS_LUMINESCENTE'};
character.activeDivineBeastId='LYSS_STAG';character.divineBeasts=[{id:'LYSS_STAG',rarity:'RARO',acquiredAt:Date.now()}];character.divineBeastNeeds={LYSS_STAG:{nutrition:100,mood:90,updatedAt:Date.now()}};
useGameStore.setState({character,isTickRunning:true,isTraining:false,currentZoneId:'BOSQUE_LYSS',lastTickResult:null})};
window.__transform=()=>{const character=structuredClone(useGameStore.getState().character);character.activeRace={id:'preview-race',name:'Aviário',ataqueId:'A10',suporteId:'S1',passivaId:'P1',bonus:{},skills:{ataque:'Corte',suporte:'Vigor',passiva:'Raiz'}};useGameStore.setState({character})};
function Preview(){const [view,setView]=useState('character');window.__show=setView;return <><h1>Mythreon · Cosméticos</h1>{view==='character'?<Personagem/>:view==='hunt'?<ZoneView onOpenQuest={()=>{}}/>:<div id="art-gallery" style={{display:'flex',gap:32,flexWrap:'wrap'}}>
<div id="monthly"><h2>Skin mensal e addon</h2><HeroArt name="Skin mensal" cosmetics={{skinTemplateId:'SKIN_CAPA_PRIMEIRO_CANTO',bossAddonTemplateId:'ADDON_BOSS_LUMINESCENTE'}} context="boss" className="h-48 w-36"/></div>
<div id="matrix"><h2>Matriz preservada</h2><HeroArt name="Aviário" attackId="A10" cosmetics={{skinTemplateId:'SKIN_CAPA_PRIMEIRO_CANTO',matrixGlowTemplateId:'LUMINESCENCIA_MATRIZ'}} className="h-48 w-36"/></div>
<div id="missing"><h2>Arte ausente: aparência base</h2><HeroArt name="Fallback" appearance={{body:'FEMININO',skin:'MORENA',hair:'LONGO',hairColor:'RUIVO',outfit:'MISTICO',outfitColor:'AZUL'}} cosmetics={{skinTemplateId:'SKIN_MANTO_NEBULOSA'}} className="h-48 w-36"/></div></div>}</>};
createRoot(document.getElementById('root')).render(<Preview/>);
`}});const compiled=bundle.outputFiles.find(file=>file.path.endsWith('.js')).contents;
 const cssFile=(await fs.readdir(path.join(root,'dist/assets'))).find(file=>/^index-.*\.css$/.test(file)),css=await fs.readFile(path.join(root,'dist/assets',cssFile));
 const html='<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><link rel="stylesheet" href="/style.css"/><style>body{margin:0;padding:16px;background:#071116;color:white;font-family:Arial}#root{max-width:1100px;margin:auto}h1{font-size:20px;margin-bottom:12px}</style><div id="root"></div><script src="/preview.js"></script>';
 server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end(html);return;}if(pathname==='/preview.js'){res.setHeader('Content-Type','application/javascript');res.end(compiled);return;}if(pathname==='/style.css'){res.setHeader('Content-Type','text/css');res.end(css);return;}const file=path.resolve(root,'public','.'+decodeURIComponent(pathname));if(!file.startsWith(path.join(root,'public')+path.sep)){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.png':'image/png','.gif':'image/gif','.giff':'image/gif','.jpg':'image/jpeg'})[path.extname(file)]??'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 win=new BrowserWindow({show:false,width:1180,height:1080,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,offscreen:true,backgroundThrottling:false}});
 const errors=pageErrors;win.webContents.on('console-message',event=>{if(event.level==='error'&&!event.message.includes('404')&&!event.message.includes('Failed to load resource'))errors.push(event.message);});
 const js=async source=>{lastSource=source;const value=await win.webContents.executeJavaScript('(()=>{try{return eval('+JSON.stringify(source)+')}catch(error){return {__testError:String(error)}}})()',true);if(value?.__testError)throw Error(value.__testError+' SOURCE '+source);return value;};
 const captureFrame=()=>new Promise((resolve,reject)=>{
   const timer=setTimeout(()=>{win.webContents.removeListener('paint',paint);reject(Error('Nenhum frame da prévia foi pintado'));},5000);
   const paint=(_event,_dirty,frame)=>{if(frame.isEmpty())return;clearTimeout(timer);win.webContents.removeListener('paint',paint);resolve(frame.toPNG());};
   win.webContents.on('paint',paint);win.webContents.invalidate();
 });
 await win.loadURL('http://127.0.0.1:'+server.address().port+'/');await pause(200);
 await js('window.__load()');await pause(150);
 assert.equal(await js('document.querySelector("[data-hero-context=portrait]").dataset.heroSource'),'/assets/items/SKIN_PREMIUM_MES_01.png');
 await js('Array.from(document.querySelectorAll("button")).find(el=>el.textContent.includes("Personalização de Personagem")).click()');await pause(100);
 await js('document.querySelector("[data-cosmetic-slot=skinTemplateId] button").click()');await pause(100);
 assert.equal(await js('document.querySelector("[data-hero-context=portrait]").dataset.heroSource'),'/assets/players/humano-v2.png');
 await js('document.querySelector("[data-cosmetic-item=SKIN_CAPA_PRIMEIRO_CANTO]").click()');await pause(100);
 assert.equal(await js('document.querySelector("[data-hero-context=portrait]").dataset.heroSource'),'/assets/items/SKIN_PREMIUM_MES_01.png');
 assert.equal(await js('document.querySelector("[data-hero-context=portrait] img").style.filter'),'');
 await js('document.querySelector("[data-cosmetic-slot=petAuraTemplateId] button").click()');await pause(100);
 assert.equal(await js('window.__store.getState().character.cosmeticLoadout.petAuraTemplateId'),undefined);
 assert.equal(await js('window.__store.getState().character.cosmeticLoadout.matrixGlowTemplateId'),'LUMINESCENCIA_MATRIZ');
 await js('document.querySelector("[data-cosmetic-item=LUMINESCENCIA_PET]").click()');await pause(100);
 await js('window.__show("hunt")');await pause(150);
 assert.equal(await js('document.querySelector("[data-hero-context=hunt]").dataset.heroSource'),'/assets/items/SKIN_PREMIUM_MES_01.png');
 assert.equal(await js('document.querySelectorAll(".hero-art-addon").length'),0,'Addon do Boss não aparece na hunt');
 assert.equal(await js('document.querySelector(".combat-pet-companion").classList.contains("cosmetic-pet-luminescence")'),true);
 await js('window.__transform()');await pause(150);
 assert.equal(await js('document.querySelector("[data-hero-context=hunt]").dataset.heroSource'),'/assets/players/aviario.png');
 assert.equal(await js('document.querySelector("[data-hero-context=hunt]").classList.contains("cosmetic-matrix-luminescence")'),true);
 win.setSize(390,1080);await pause(250);
 for(let i=0;i<80;i++){if(await js('Array.from(document.querySelectorAll(".combat-scene img")).every(img=>img.complete&&img.naturalWidth>0)'))break;await pause(100);}
 await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');await pause(200);
 assert.equal(await js('document.documentElement.scrollWidth<=window.innerWidth'),true,'Hunt deve caber em 390px');
 lastSource="capture hunt mobile";
 await fs.writeFile(path.join(cache,'hunt-mobile.png'),await captureFrame());
 await js('window.__show("gallery")');await pause(150);
 for(let i=0;i<70;i++){if(await js('document.querySelector("#missing .hero-art").dataset.heroSource==="/assets/players/humano-v2.png"'))break;await pause(100);}
 assert.equal(await js('document.querySelector("#missing .hero-art").dataset.heroSource'),'/assets/players/humano-v2.png');
 assert.equal(await js('document.querySelector("#missing img").style.filter.includes("hue-rotate")'),true,'Fallback deve manter cores da aparência');
 assert.equal(await js('document.querySelectorAll("#monthly .hero-art-addon").length'),1);
 assert.equal(await js('document.querySelector("#matrix .hero-art").dataset.heroSource'),'/assets/players/aviario.png');
 win.setSize(1180,800);await pause(200);
 await js('window.scrollTo({top:0,behavior:"instant"});new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 await fs.writeFile(path.join(cache,'gallery-desktop.png'),await captureFrame());
 assert.deepEqual(await js('window.__alerts'),[]);assert.deepEqual(errors,[]);
 console.log('PASS Cosméticos UI: Personagem nulo/carregado, skin real, remover/equipar, aura do Pet, hunt com Matriz, addon restrito, fallback com cores e 390px sem overflow.');
 await new Promise(resolve=>server.close(resolve));app.exit(0);
}catch(error){console.error(error);console.error({lastSource,pageErrors});app.exit(1)}});
setTimeout(()=>{console.error('Timeout Cosméticos UI');app.exit(2)},45000);
