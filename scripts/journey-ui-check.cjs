
const {app,BrowserWindow}=require('electron');const fs=require('node:fs/promises');const path=require('node:path');const http=require('node:http');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),cache=path.join(root,'node_modules/.cache/journey-ui');app.setPath('userData',path.join(cache,'profile'));let server,win;
const pause=ms=>new Promise(r=>setTimeout(r,ms));let errors=[];
async function js(source){return win.webContents.executeJavaScript(source,true);}
async function wait(source){for(let i=0;i<100;i++){if(await js(source))return;await pause(100);}throw Error('Timeout: '+source);}
async function click(text){await js('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==='+JSON.stringify(text)+')?.click()');await pause(120);}
app.whenReady().then(async()=>{try{
 await fs.mkdir(cache,{recursive:true});server=http.createServer(async(req,res)=>{try{const rel=decodeURIComponent(req.url.split('?')[0]);const file=path.resolve(root,'dist','.'+rel);if(!file.startsWith(path.join(root,'dist')+path.sep)){res.writeHead(403).end();return;}const ext=path.extname(file);const mime={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.gif':'image/gif','.giff':'image/gif','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.setHeader('Content-Type',mime[ext]||'application/octet-stream');res.end(await fs.readFile(file));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
 win=new BrowserWindow({show:false,width:1360,height:900,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,backgroundThrottling:false}});win.webContents.on('console-message',(_e,level,message)=>{if(level===3&&!message.includes('404')&&!message.includes('ERR_FILE'))errors.push(message);});
 const url='http://127.0.0.1:'+server.address().port+'/index.html';await win.loadURL(url);await js('localStorage.clear();localStorage.setItem("mythreon_account_session_v1",JSON.stringify({id:"journey-ui",email:"teste@mythreon.local"}))');await win.loadURL(url);await wait('!!document.querySelector("input")');await js('window.alert=()=>{};const input=document.querySelector("input");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(input,"Novo Eco");input.dispatchEvent(new Event("input",{bubbles:true}));');await pause(150);await click('Começar Jornada');await wait('!!document.querySelector("[role=dialog]")');
 const intro=await js('JSON.parse(localStorage.getItem("mythreon_save_v1_account_journey-ui"))');assert.equal(intro.character.xp,0);assert.equal(intro.character.introSeen,false);await fs.writeFile(path.join(cache,'intro.png'),(await win.webContents.capturePage()).toPNG());
 // A introdução pode ganhar novas cenas sem quebrar o teste: avance até o botão final.
 for(let i=0;i<20;i++){const finished=await js('!!Array.from(document.querySelectorAll("button")).find(b=>b.textContent.trim()==="Conhecer a primeira missão →")');if(finished){await click('Conhecer a primeira missão →');break;}await click('Continuar →');}
 await wait('!!document.getElementById("quest-card-TUT_WIKI")');assert.equal(await js('document.querySelector("[role=dialog]")===null'),true);assert.equal(await js('Array.from(document.querySelectorAll("nav button")).find(b=>b.textContent.includes("Matriz")).disabled'),true);
 await js('document.querySelector("#quest-card-TUT_WIKI button").click()');await pause(150);await click('Seguir objetivo →');await wait('JSON.parse(localStorage.getItem("mythreon_save_v1_account_journey-ui")).character.quests.active.TUT_WIKI.progress[0]===1');await click('Resgatar missão');await js('document.querySelector("#quest-card-TUT_WIKI button").click()');await wait('!!document.getElementById("quest-card-TUT_POTIONS")');assert.equal(await js('!!document.getElementById("quest-card-TUT_MATRIX")'),false);await fs.writeFile(path.join(cache,'missoes.png'),(await win.webContents.capturePage()).toPNG());
 // Test missing enemy artwork cannot hide the transparent matrix sprite.
 await js('const data=JSON.parse(localStorage.getItem("mythreon_save_v1_account_journey-ui"));const c=data.character;c.introSeen=true;c.tutorialCompleted=true;c.level=30;c.hp=5000;c.hpMax=5000;c.currentZoneId="PANTANO_VEYRA";c.unlockedZoneIds.push("PANTANO_VEYRA");c.activeEnemyId="SAPO_MIASMA";c.activeRace={id:"ui-lupino",name:"Lupino de teste",tier:"COMUM",ataqueId:"A1",suporteId:"S1",passivaId:"P1",bonus:{}};localStorage.setItem("mythreon_save_v1_account_journey-ui",JSON.stringify(data));');await win.loadURL(url);await wait('!!document.querySelector(".combat-sprite-player img")');await wait('document.querySelector(".combat-sprite-player img")?.complete && document.querySelector(".combat-sprite-player img")?.naturalWidth>0');await wait('!!document.querySelector(".combat-sprite-enemy img, .combat-sprite-enemy span, [data-monster-atlas]")');assert((await js('document.querySelector(".combat-sprite-player img").src')).endsWith('/lupino.png'));await fs.writeFile(path.join(cache,'bioma.png'),(await win.webContents.capturePage()).toPNG());

 if (process.argv.includes('--hunt')) {
   await js(`const key="mythreon_save_v1_account_journey-ui"; const data=JSON.parse(localStorage.getItem(key)); const c=data.character;
     Object.assign(c,{level:42,currentZoneId:"BOSQUE_LYSS",activeEnemyId:"LOBO",huntWaveProgress:{},enemyHpId:null,fightEnemyId:null,tickCount:0,lastTick:Date.now(),staminaOnline:120,hp:5000,mp:1000,comboCooldownUntil:0});
     localStorage.setItem(key,JSON.stringify(data));`);
   await win.loadURL(url);
   await wait('!!document.querySelector("button[title=Falcão-Ruivo]")');
   await js('document.querySelector("button[title=Falcão-Ruivo]").click()');
   await js('document.querySelector(".combat-scene").scrollIntoView({block:"center"})');
   for(const suffix of ['W1','W2','W3A','W3B','BOSS']) {
     await wait(`!!document.querySelector('[data-monster-atlas="FALCAO_${suffix}"]')`);
     if (suffix==='W3A'||suffix==='BOSS') await fs.writeFile(path.join(cache,`hunt-falcao-${suffix}.png`),(await win.webContents.capturePage()).toPNG());
   }
   await js('document.querySelector(\'button[title="Espectro de Brasa"]\').click()');
   await wait('!!document.querySelector(\'[data-monster-atlas="ESPECTRO"]\')');
   await fs.writeFile(path.join(cache,'hunt-espectro.png'),(await win.webContents.capturePage()).toPNG());
   win.setContentSize(390,820);
   await wait(`document.querySelector('[aria-label="Controles de toque do combo"] button')?.offsetWidth>0`);
   assert.equal(await js('getComputedStyle(document.querySelector(".game-header")).position'),'relative');
   await js('document.querySelector(".combat-scene").scrollIntoView({block:"start"})');
   await js(`window.comboFrames=[];
     new MutationObserver(() => {
       const target=document.querySelector(".combat-sprite-enemy")?.dataset.encounter;
       for(const node of document.querySelectorAll('[data-hunt-impact^="combo-"]')){
         const id=node.dataset.huntImpact;
         if(!window.comboFrames.some(entry=>entry.id===id))window.comboFrames.push({id,target});
       }
     }).observe(document.querySelector(".combat-scene"),{subtree:true,childList:true});`);
   for(let i=0;i<3;i++) {
     await js(`document.querySelectorAll('[aria-label="Controles de toque do combo"] button')[${i}].click()`);
     await pause(45);
   }
   await wait('window.comboFrames.length === 2');
   const combo=await js('window.comboFrames');
   assert.deepEqual(combo.map(x=>x.id),['combo-1','combo-2']);
   assert(combo[0].target && combo[0].target===combo[1].target);
   await fs.writeFile(path.join(cache,'hunt-mobile.png'),(await win.webContents.capturePage()).toPNG());
   await js('localStorage.setItem("mythreon_video_mode","reduced"); window.dispatchEvent(new Event("mythreon-settings-change"))');
   await wait('!document.querySelector(".combat-sprite-enemy")?.dataset.pose');
   assert.deepEqual(errors,[]);
   console.log('PASS: cinco variantes do Falcão, Espectro, combo por toque no mesmo alvo e movimento reduzido.');
   app.exit(0);
   return;
 }

 await js('const d=JSON.parse(localStorage.getItem("mythreon_save_v1_account_journey-ui"));const ch=d.character;ch.level=5;ch.introSeen=true;ch.tutorialCompleted=false;ch.journeyVersion=1;ch.hp=999999999;ch.hpMax=999999999;ch.mp=999999999;ch.mpMax=999999999;ch.activeRace=null;ch.activeDivineBeastId=null;ch.currentZoneId="BOSQUE_LYSS";ch.equipped={};ch.activeVials={};ch.quests={active:{},completed:["TUT_WIKI","TUT_1","TUT_2"]};ch.inventory.items=["COMUM","INCOMUM","RARO","EPICO","LENDARIO"].map((rarity,i)=>({uid:"rarity-"+i,templateId:"ESPADA_T1",name:"Espada "+rarity,category:"ARMA",slot:"ARMA_PRINCIPAL",tier:1,rarity,stats:{atk:10},quantity:1,maxStack:1,stackable:false,upgradeLevel:0,icon:"⚔️"}));localStorage.setItem("mythreon_save_v1_account_journey-ui",JSON.stringify(d));');
 await win.loadURL(url);await wait('Array.from(document.querySelectorAll("nav button")).some(b=>b.textContent.trim()==="Mochila")');
 await js('Array.from(document.querySelectorAll("nav button")).find(b=>b.textContent.trim()==="Mochila").click()');
 await wait('document.querySelectorAll("[data-rarity]").length===5');
 const values=await js('JSON.parse(localStorage.getItem("mythreon_save_v1_account_journey-ui")).character');assert.equal(values.hpMax,250);assert.equal(values.mpMax,110);
 assert.equal(await js('getComputedStyle(document.querySelector(".rarity-frame.rarity-incomum")).borderTopColor'),'rgb(56, 184, 107)');
 assert.equal(await js('getComputedStyle(document.querySelector(".rarity-art.rarity-comum")).filter'),'none');
 assert.notEqual(await js('getComputedStyle(document.querySelector(".rarity-frame.rarity-raro")).boxShadow'),await js('getComputedStyle(document.querySelector(".rarity-frame.rarity-epico")).boxShadow'));
 assert.equal(await js('getComputedStyle(document.querySelector(".rarity-art.rarity-lendario"),"::before").animationName'),'legendary-aura');
 await pause(1600);await fs.writeFile(path.join(cache,'raridades.png'),(await win.webContents.capturePage()).toPNG());
 assert.deepEqual(errors,[]);await fs.writeFile(path.join(cache,'result.json'),JSON.stringify({ok:true,intro:true,firstMission:true,stagedMatrix:true,pngPriority:true,missingMonsterDoesNotHidePlayer:true,vitalsRebuilt:true,rarityEffects:true,consoleErrors:errors},null,2));console.log('PASS: intro, navegação de missão, Matriz por etapa e PNG transparente com fallback independente.');app.exit(0);
 }catch(e){await fs.mkdir(cache,{recursive:true});await fs.writeFile(path.join(cache,'result.json'),JSON.stringify({ok:false,error:String(e),stack:e.stack,errors},null,2));console.error(e);app.exit(1);}});
setTimeout(()=>app.exit(2),55000);
