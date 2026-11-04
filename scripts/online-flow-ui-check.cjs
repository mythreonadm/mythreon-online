const {app,BrowserWindow}=require('electron'),{build}=require('esbuild');
const fs=require('node:fs/promises'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'node_modules/.cache/online-flow');
app.setPath('userData',path.join(cache,'profile'));app.disableHardwareAcceleration();
let server,win;const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{try{
 await fs.mkdir(cache,{recursive:true});
 const backend=await build({bundle:true,write:false,platform:'node',format:'cjs',packages:'external',stdin:{resolveDir:root,sourcefile:'flow-backend.ts',loader:'ts',contents:`
export {freshWorld,executeGame} from './server/game';export {ALL_ITEM_TEMPLATES,createItem} from './src/data/items';export {DIVINE_BEASTS} from './src/data/divineBeasts';
`}});const Module=require('node:module'),backendModule=new Module(path.join(root,'flow-fixture.cjs'),module);backendModule.filename=path.join(root,'flow-fixture.cjs');backendModule.paths=module.paths;backendModule._compile(backend.outputFiles[0].text,backendModule.filename);
 const {freshWorld,executeGame,ALL_ITEM_TEMPLATES,createItem,DIVINE_BEASTS}=backendModule.exports;
 let world=freshWorld('Explorador da Fila',require('node:crypto').randomUUID()),revision=1;
 world.character.tutorialCompleted=true;world.character.introSeen=true;world.character.gold=10000;world.character.mythreonCoins=1000;
 world.character.equippedMiningTool=createItem(ALL_ITEM_TEMPLATES.PICARETA_T1);world.character.equippedFishingRod=createItem(ALL_ITEM_TEMPLATES.VARA_PESCA_T1);
 world.character.cards=['card-main','card-protected','card-feed-a','card-feed-b'].map(uid=>({uid,templateId:'CARD_LOBO',level:1,obtainedAt:1}));world.character.cardLoadout=['card-main','card-protected'];
 world.character.inventory.items=[createItem({...ALL_ITEM_TEMPLATES.OVO_BESTA_T1,uid:'ready-egg'}),createItem({...ALL_ITEM_TEMPLATES.ISCA_CICATRIZ,uid:'bait-stack',quantity:2})];
 world.character.divineBeastIncubator={eggUid:'ready-egg',tier:1,startedAt:Date.now()-100000,completesAt:Date.now()-1};
 world.character.farm={unlockedPlots:3,lastActionAt:0,skills:{planting:0,harvesting:0},plots:[{id:'plot-1'},{id:'plot-2'},{id:'plot-3'}]};
 const requests=[],receipts=new Map();let lastReceipt;
 const snapshot=()=>({ok:true,current:{revision,state:world}});
 const release=(index,uncertain=false)=>{
  const request=requests[index];assert(request,'Requisição '+index+' deve estar pendente');
  let result=receipts.get(request.body.requestId);
  if(!result){
   const random=Math.random;try{if(request.body.payload.action==='hatchEgg')Math.random=()=>0.999;const applied=executeGame(world,request.body.payload.action,request.body.payload.args);world=applied.world;revision++;result=JSON.parse(JSON.stringify({...snapshot(),result:applied.result}));receipts.set(request.body.requestId,result);}finally{Math.random=random;}
  }
  lastReceipt=result;request.res.writeHead(uncertain?503:200,{'Content-Type':'application/json'}).end(JSON.stringify(uncertain?{error:'Resposta perdida; confirmar a ação.'}:result));
 };
 const bundle=await build({bundle:true,write:false,platform:'browser',format:'iife',outfile:'preview.js',define:{'import.meta.env':'{}'},loader:{'.jpg':'dataurl','.png':'dataurl'},stdin:{resolveDir:root,sourcefile:'online-flow-preview.tsx',loader:'tsx',contents:`
import React,{useState} from 'react';import {createRoot} from 'react-dom/client';import {Farm} from './src/ui/Farm';import {Professions} from './src/ui/Professions';import {CardAlbum} from './src/ui/CardAlbum';import {Personagem} from './src/ui/Personagem';import {ArenaDuelos} from './src/ui/ArenaDuelos';import {DivineBeasts} from './src/ui/DivineBeasts';import {OnlineNotice} from './src/ui/OnlineCommunity';import {connectCharacter,disconnectCharacter,useOnlineState,retryOnlineConnection} from './src/online/controller';import {useGameStore} from './src/store/gameStore';
window.__store=useGameStore;window.__online=useOnlineState;window.__disconnect=disconnectCharacter;window.__retry=retryOnlineConnection;window.__states=[];window.__alerts=[];window.alert=message=>window.__alerts.push(message);Math.random=()=>0;
useGameStore.subscribe(state=>{if(state.character)window.__states.push(state.character.farm.plots.map(plot=>plot.seedId??''))});
function Preview(){const [tab,setTab]=useState('farm');window.__tab=setTab;return <><div hidden><ArenaDuelos/></div><OnlineNotice/><nav><button onClick={()=>setTab('farm')}>Fazenda</button><button onClick={()=>setTab('pets')}>Pets</button><button onClick={()=>setTab('wiki')}>Wiki</button></nav><main>{tab==='farm'?<Farm/>:tab==='pets'?<DivineBeasts/>:tab==='professions'?<Professions/>:tab==='cards'?<CardAlbum/>:tab==='personagem'?<Personagem/>:<p>Wiki disponível durante a confirmação.</p>}</main></>};createRoot(document.getElementById('root')).render(<Preview/>);
connectCharacter('${world.character.id}').then(()=>window.__ready=true);
`},plugins:[{name:'local-world',setup(plugin){
 plugin.onResolve({filter:/online\/client$/},args=>({path:args.path,namespace:'local-world'}));
 plugin.onResolve({filter:/^\.\/client$/},args=>args.importer.endsWith('controller.ts')?{path:args.path,namespace:'local-world'}:null);
 plugin.onLoad({filter:/.*/,namespace:'local-world'},()=>({loader:'js',contents:`
export const onlineConfigured=true;export function supabase(){return {channel(){const c={on(){return c},subscribe(){return c}};return c},removeChannel(){return Promise.resolve()}}};
export async function worldRequest(operation,payload={},characterId,requestId=crypto.randomUUID()){const response=await fetch('/api/test',{method:'POST',body:JSON.stringify({operation,payload,characterId,requestId})});const result=await response.json();if(!response.ok)throw Object.assign(Error(result.error),{uncertain:response.status>=500});return result}
`}));
 }}]});
 const compiled=bundle.outputFiles.find(file=>file.path.endsWith('.js')).contents,cssFile=(await fs.readdir(path.join(root,'dist/assets'))).find(file=>/^index-.*\.css$/.test(file)),css=await fs.readFile(path.join(root,'dist/assets',cssFile));
 const html='<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><link rel="stylesheet" href="/style.css"/><style>body{padding:16px;background:#071116;color:white;font-family:Arial}#root{max-width:1100px;margin:auto}nav{display:flex;gap:12px;margin:12px 0}nav button{padding:10px;background:#234039;border-radius:8px}</style><div id="root"></div><script src="/preview.js"></script>';
 server=http.createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname;if(pathname==='/api/test'){
  let raw='';for await(const part of req)raw+=part;const body=JSON.parse(raw);
  if(body.operation==='world.read'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(snapshot()));return;}
  if(body.operation==='cards.season.read'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,cards:{seasonKey:'2026-11',uniqueCards:1,totalCards:38}}));return;}
  if(body.operation==='social.read'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true,social:{}}));return;}
  requests.push({body,res});if(receipts.has(body.requestId))release(requests.length-1);return;
 }if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end(html);return;}if(pathname==='/preview.js'){res.setHeader('Content-Type','application/javascript');res.end(compiled);return;}if(pathname==='/style.css'){res.setHeader('Content-Type','text/css');res.end(css);return;}const file=path.resolve(root,'public','.'+decodeURIComponent(pathname));if(!file.startsWith(path.join(root,'public')+path.sep)){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.png':'image/png','.gif':'image/gif','.jpg':'image/jpeg'})[path.extname(file)]??'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));win=new BrowserWindow({show:false,width:1180,height:1000,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,offscreen:true,backgroundThrottling:false}});
 const errors=[];win.webContents.on('console-message',event=>{if(event.level==='error'&&!/404|503|Failed to load resource/.test(event.message))errors.push(event.message)});
 const js=async source=>{const result=await win.webContents.executeJavaScript('(()=>{try{return eval('+JSON.stringify(source)+')}catch(error){return {__error:String(error)}}})()',true);if(result?.__error)throw Error(result.__error+' '+source);return result};
 const until=async predicate=>{for(let i=0;i<100;i++){if(await predicate())return;await pause(50)}throw Error('Condição de teste não satisfeita')};
 const capture=()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{win.webContents.removeListener('paint',paint);reject(Error('Sem frame'));},5000);const paint=(_e,_r,image)=>{if(image.isEmpty())return;clearTimeout(timer);win.webContents.removeListener('paint',paint);resolve(image.toPNG())};win.webContents.on('paint',paint);win.webContents.invalidate()});
 await win.loadURL('http://127.0.0.1:'+server.address().port+'/');await until(()=>js('window.__ready===true'));
 await until(()=>js('Array.from(document.querySelectorAll("article")).some(el=>el.innerText.includes("Canteiro 1"))'));
 await js('const cards=Array.from(document.querySelectorAll("article"));cards.find(el=>el.innerText.includes("Canteiro 1")).querySelector("button").click()');await pause(80);
 await js('Array.from(document.querySelectorAll("article")).find(el=>el.innerText.includes("Canteiro 2")).querySelector("button").click()');await pause(80);
 assert.equal(requests.length,1);assert.equal(await js('window.__online.getState().syncing'),2);
 assert.deepEqual(await js('window.__store.getState().character.farm.plots.slice(0,2).map(plot=>plot.seedId)'),['SEMENTE_CENOURA','SEMENTE_CENOURA']);
 const trace=await js('window.__states.length');release(0);await until(async()=>requests.length===2);
 assert.equal(await js('window.__states.slice('+trace+').every(state=>state[1]==="SEMENTE_CENOURA")'),true,'Primeiro recibo não pode apagar o segundo plantio');
 release(1);await until(()=>js('window.__online.getState().syncing===0'));
 assert.equal(world.character.gold,9940);assert.equal(world.character.farm.skills.planting,2);
 await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');await fs.writeFile(path.join(cache,'desktop.png'),await capture());
 win.setSize(390,1000);await pause(200);assert.equal(await js('document.documentElement.scrollWidth<=innerWidth'),true);await fs.writeFile(path.join(cache,'mobile.png'),await capture());
 await js('window.__tab("pets")');await pause(150);
 await js('Array.from(document.querySelectorAll("button")).find(el=>el.textContent==="Eclodir agora").click()');await until(async()=>requests.length===3);
 assert.equal(await js('document.body.innerText.includes("Eclosão concluída:")'),false,'Não anunciar resultado aleatório da prévia');
 release(2);await until(()=>js('document.body.innerText.includes("Eclosão concluída:")'));
 const expected='Eclosão concluída: '+DIVINE_BEASTS[lastReceipt.result.beastId].name+' · '+lastReceipt.result.rarity;
 assert.equal(await js('document.body.innerText.includes('+JSON.stringify(expected)+')'),true);assert.equal(world.character.divineBeasts.length,1);
 await js('void window.__store.getState().buyCalendarCoupon()');await until(async()=>requests.length===4);release(3,true);
 await until(()=>js('window.__online.getState().pending===true'));await js('window.__tab("wiki")');await pause(100);
 assert.equal(await js('document.body.innerText.includes("Wiki disponível durante")'),true);
 assert.equal(await js('window.__store.getState().buyCalendarCoupon().success'),false,'Nova mutação aguarda confirmação incerta');
 await js('window.__retry()');await until(()=>js('window.__online.getState().syncing===0'));
 assert.equal(requests[3].body.requestId,requests[4].body.requestId);assert.equal(world.character.calendarCoupons,1);assert.equal(world.character.mythreonCoins,999);
 // Real online profession UI: prepare, server-clock score, early release and unmount.
 win.setSize(1180,1000);await js('window.__tab("professions")');await pause(100);
 await js('window.__gather=Array.from(document.querySelectorAll("button")).find(el=>el.textContent.includes("Segure: Extrair minério"));window.__gather.focus();window.__gather.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}))');
 await until(async()=>requests.length===6);assert.equal(requests[5].body.payload.action,'beginProfessionChallenge');
 release(5);await until(()=>js('document.querySelectorAll("[aria-label^=Pulso]").length===1'));
 await until(()=>js('document.querySelectorAll(".profession-avatar img").length===2&&Array.from(document.querySelectorAll(".profession-avatar img")).every(image=>image.complete&&image.naturalWidth>0)'));
 assert.equal(await js('Array.from(document.querySelectorAll(".profession-avatar")).every(el=>getComputedStyle(el).position==="absolute")'),true,"Herói deve ficar dentro da cena");
 await js('window.__gather.scrollIntoView({block:"center",behavior:"instant"})');await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');assert.equal(await js('window.__gather.getBoundingClientRect().top<innerHeight'),true);await fs.writeFile(path.join(cache,'profession-desktop.png'),await capture());
 await pause(Math.max(0,world.professionChallenge.startsAt+world.professionChallenge.target*3000-Date.now()));
 await js('window.__gather.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",bubbles:true}))');
 await until(async()=>requests.length===7);release(6);
 await until(()=>js('window.__online.getState().syncing===0'));assert.equal(lastReceipt.result.precision,1.5);
 assert.equal(world.character.professions.mining,2);assert.equal(await js('document.body.innerText.includes("Perfeito · +2 de skill")'),true);
 await until(()=>js('document.querySelector("[data-profession-scene=MINERACAO]").dataset.phase==="success"'));await js('document.querySelector("[data-profession-scene=MINERACAO]").scrollIntoView({block:"center",behavior:"instant"})');await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');await pause(450);await fs.writeFile(path.join(cache,'profession-scene-desktop.png'),await capture());
 // Release before preparation returns: only cancellation is sent after the delayed receipt.
 await js('window.__fish=Array.from(document.querySelectorAll("button")).find(el=>el.textContent.includes("Segure: Lançar linha"));window.__fish.focus();window.__fish.dispatchEvent(new KeyboardEvent("keydown",{key:" ",bubbles:true}))');
 await until(async()=>requests.length===8);
 await js('window.__fish.dispatchEvent(new KeyboardEvent("keyup",{key:" ",bubbles:true}))');release(7);
 await until(async()=>requests.length===9);assert.equal(requests[8].body.payload.action,'cancelProfessionChallenge');release(8);
 await until(()=>js('window.__online.getState().syncing===0'));assert.equal(world.character.professions.fishing,0);assert.equal(world.professionChallenge,undefined);
 // Leaving the page while preparation is in flight cancels the late challenge.
 await js('window.__fish.dispatchEvent(new KeyboardEvent("keydown",{key:" ",bubbles:true}))');await until(async()=>requests.length===10);
 await js('window.__tab("wiki")');await pause(50);release(9);await until(async()=>requests.length===11);release(10);
 await until(()=>js('window.__online.getState().syncing===0'));assert.equal(world.professionChallenge,undefined);
 // Touch at 390px with late release must show the server's lower grade.
 win.setSize(390,1000);await js('window.__tab("professions")');await pause(100);
 await js('document.querySelector("input[type=checkbox]").click()');await pause(50);
 await js('window.__fish=Array.from(document.querySelectorAll("button")).find(el=>el.textContent.includes("Segure: Lançar linha"));window.__fish.setPointerCapture=()=>{};window.__fish.dispatchEvent(new PointerEvent("pointerdown",{button:0,bubbles:true,pointerId:11,pointerType:"touch"}))');
 await until(async()=>requests.length===12);assert.equal(requests[11].body.payload.args[2],'ISCA_CICATRIZ');release(11);
 await until(()=>js('document.querySelectorAll("[aria-label^=Pulso]").length===1'));
 assert.equal(await js('document.documentElement.scrollWidth<=innerWidth'),true);await js('window.__fish.scrollIntoView({block:"center",behavior:"instant"})');await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');assert.equal(await js('window.__fish.getBoundingClientRect().top<innerHeight'),true);await fs.writeFile(path.join(cache,'profession-mobile.png'),await capture());
 await pause(Math.max(0,world.professionChallenge.startsAt+(world.professionChallenge.target+0.17)*3000-Date.now()));
 await js('window.__fish.dispatchEvent(new PointerEvent("pointerup",{button:0,bubbles:true,pointerId:11,pointerType:"touch"}))');
 await until(async()=>requests.length===13);release(12);await until(()=>js('window.__online.getState().syncing===0'));
 assert.equal(lastReceipt.result.precision,0.5);assert.equal(world.character.professions.fishing,1);
 assert.equal(await js('document.body.innerText.includes("Fora do pulso · +1 de skill")'),true);
 assert.equal(lastReceipt.result.quantity,2);assert.equal(lastReceipt.result.bonusQuantity,1);assert.equal(world.character.inventory.items.find(item=>item.templateId==='ISCA_CICATRIZ').quantity,1);
 await until(()=>js('document.querySelector("[data-profession-scene=PESCA]").dataset.phase==="success"'));
 await js('document.querySelector("[data-profession-scene=PESCA]").scrollIntoView({block:"center",behavior:"instant"})');await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
 assert.equal(await js('document.documentElement.scrollWidth<=innerWidth'),true);await pause(450);await fs.writeFile(path.join(cache,'profession-scene-mobile.png'),await capture());
 await js('localStorage.setItem("mythreon_animations_enabled","false");localStorage.setItem("mythreon_effects_enabled","false");window.dispatchEvent(new Event("mythreon-settings-change"))');
 await until(()=>js('document.querySelector("[data-profession-scene=PESCA]").dataset.motion==="false"'));
 assert.equal(await js('document.querySelector("[data-profession-scene=PESCA]").dataset.effects'),"false");
 assert.equal(await js('getComputedStyle(document.querySelector(".profession-bite")).display'),"none");

 // Card album uses the real store/controller/protocol; the season read is a display fixture.
 await js('window.__tab("cards")');await pause(100);
 assert.equal(await js('document.querySelector("[data-card-formation] [data-card-stat=hp]").textContent'),"+30");
 await js('document.querySelector("button[data-card-template=CARD_LOBO]").click()');await until(()=>js('!!document.querySelector("[role=dialog]")'));
 assert.equal(await js('document.querySelector("[role=dialog] [data-card-stat=hp]").textContent'),"+15");
 assert.equal(await js('document.querySelectorAll("[role=dialog] input[type=checkbox]").length'),2,'Cópia equipada fica fora dos materiais');
 await js('Array.from(document.querySelectorAll("[role=dialog] button")).find(el=>el.textContent.includes("Revisar evolução")).click()');
 await js('document.querySelector("[data-card-evolve]").click();document.querySelector("[data-card-evolve]").click()');
 await until(async()=>requests.length===14);assert.equal(requests[13].body.payload.action,'evolveCard');
 assert.equal(world.character.cards.find(card=>card.uid==='card-main').level,1);assert.equal(world.character.gold,9940);
 release(13);await until(()=>js('window.__online.getState().syncing===0'));await until(()=>js('document.body.innerText.includes("Carta evoluída para o nível 2")'));
 assert.equal(world.character.cards.length,2);assert.equal(world.character.gold,9340);assert.equal(world.character.cards.find(card=>card.uid==='card-main').level,2);
 assert.deepEqual(world.character.cardLoadout,['card-main','card-protected']);assert.equal(await js('document.querySelector("[data-card-formation] [data-card-stat=hp]").textContent'),"+33");
 await until(()=>js('document.querySelector("[role=dialog] img")?.naturalWidth>0'));
 assert.equal(await js('document.documentElement.scrollWidth<=innerWidth'),true);await js('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');await pause(150);await fs.writeFile(path.join(cache,'cards-mobile.png'),await capture());
 win.setSize(1180,1000);await pause(200);await fs.writeFile(path.join(cache,'cards-desktop.png'),await capture());
 await js('Array.from(document.querySelectorAll("[role=dialog] button")).find(el=>el.textContent==="Retirar da formação").click()');await until(async()=>requests.length===15);release(14);await until(()=>js('window.__online.getState().syncing===0'));
 assert.deepEqual(world.character.cardLoadout,['card-protected']);
 await js('Array.from(document.querySelectorAll("[role=dialog] button")).find(el=>el.textContent==="Equipar carta").click()');await until(async()=>requests.length===16);release(15);await until(()=>js('window.__online.getState().syncing===0'));
 assert(world.character.cardLoadout.includes('card-main'));assert(world.character.cardLoadout.includes('card-protected'));
 await js('const copies=document.querySelector("[role=dialog] select");copies.value="card-protected";copies.dispatchEvent(new Event("change",{bubbles:true}))');await pause(50);
 assert.equal(await js('document.querySelector("[role=dialog] [data-card-stat=hp]").textContent'),"+15");
 await js('Array.from(document.querySelectorAll("[role=dialog] button")).find(el=>el.getAttribute("aria-label")==="Fechar carta").focus();document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}))');await pause(50);
 assert.equal(await js('!!document.querySelector("[role=dialog]")'),false);
 await js('window.__tab("personagem")');await until(()=>js('!!document.querySelector("[data-character-card-bonus]")'));
 assert.equal(await js('document.querySelector("[data-character-card-bonus]").textContent.includes("+3,3 DEF")'),true,"Personagem não deve truncar o bônus compartilhado");
 assert.deepEqual(await js('window.__alerts'),[]);assert.deepEqual(errors,[]);await js('window.__disconnect()');
 console.log('PASS Fluxo online: Farm real + controlador + HTTP/motor, latência/fila sem rollback, eclosão autoritativa, navegação durante recuperação e cupom exatamente uma vez, pulso online PC/toque, cancelamento tardio, cenas, isca atômica, Cards/evolução/bonificação, vídeo e navegação; PC/390px.');
 await new Promise(resolve=>server.close(resolve));app.exit(0);
}catch(error){console.error(error);app.exit(1)}});
setTimeout(()=>{console.error('Timeout Fluxo online');app.exit(2)},60000);
