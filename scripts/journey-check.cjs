const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  new Function('require','module','exports',source)(name => {
    if (!name.startsWith('.')) return require(name);
    const base = path.resolve(path.dirname(file), name);
    const target = [base+'.ts',base+'.tsx',path.join(base,'index.ts')].find(p => fs.existsSync(p));
    return target ? load(target) : require(base);
  },module,module.exports);
  return module.exports;
}

const saved=new Map();global.localStorage={getItem:k=>saved.get(k)??null,setItem:(k,v)=>saved.set(k,v)};global.alert=()=>{};
const {createNewCharacter,loadGame,saveGame}=load(path.join(root,'src/engine/save.ts'));
const {ZONES}=load(path.join(root,'src/data/zones.ts'));
const {QUESTS}=load(path.join(root,'src/data/quests.ts'));
const {JOURNEY_CHAPTERS}=load(path.join(root,'src/data/worldJourney.ts'));
const {ALL_COMPONENTS}=load(path.join(root,'src/data/components.ts'));
const {getAvailableQuests}=load(path.join(root,'src/utils/questSignals.ts'));
const {trackQuestAction,claimQuestReward,trackRaceDiscovery}=load(path.join(root,'src/engine/questEngine.ts'));
const {canUseTab,canEnterZone,canTutorialHunt,unlockJourneyZone}=load(path.join(root,'src/engine/journey.ts'));
const {makeComponent,makeEquipment,rollDrops}=load(path.join(root,'src/engine/drops.ts'));
const {xpToNextLevel,recalcStats}=load(path.join(root,'src/engine/stats.ts'));
const {processTick}=load(path.join(root,'src/engine/combat.ts'));
const c=createNewCharacter('Novo eco');assert.equal(c.introSeen,false);assert.equal(canTutorialHunt(c),false);assert.equal(canUseTab(c,'matriz'),false);trackRaceDiscovery(c,[]);assert.equal(Object.keys(c.quests.active).length,0);
assert.deepEqual(getAvailableQuests(c).map(q=>q.id),['TUT_WIKI']);
c.introSeen=true;const order=['TUT_WIKI','TUT_POTIONS','TUT_1','TUT_MATRIX','TUT_2','TUT_3','TUT_FORGE_VISIT','TUT_4','TUT_FORGE','TUT_SELL','TUT_PATHS','TUT_TRAIN','TUT_LAB','TUT_BACKPACK'];
for(const id of order){assert.deepEqual(getAvailableQuests(c).filter(q=>q.category==='TUTORIAL').map(q=>q.id),[id]);const q=QUESTS.find(q=>q.id===id);c.quests.active[id]={progress:q.objectives.map(o=>o.count)};assert.equal(claimQuestReward(c,id).success,true);if(id==='TUT_MATRIX')for(const comp of ['A1','S1','P1'])assert(c.inventory.items.some(i=>i.templateId===comp));if(id==='TUT_3')assert.equal(c.inventory.items.filter(i=>i.templateId==='ESPADA_T1').length,3);}
assert(c.inventory.items.some(i=>i.templateId==='UNICO_SIGILO_INICIACAO'));assert.equal(claimQuestReward(c,'TUT_BACKPACK').success,false);
for(const ch of JOURNEY_CHAPTERS){const z=ZONES[ch.id];assert(z,ch.id);assert(z.enemies.some(e=>e.id===ch.bossId),ch.bossId);for(const h of ch.hunts)assert(z.enemies.some(e=>e.id===h.id),h.id);if(!ch.pass)continue;assert(QUESTS.some(q=>q.id===ch.pass.requires),'prereq '+ch.id);for(const req of ch.pass.items){assert(ALL_COMPONENTS[req.id],req.id);assert(Object.values(ZONES).filter(z=>z.minLevel<ch.pass.level).some(z=>z.enemies.some(e=>e.componentId===req.id||e.essenceId===req.id)||z.ambientPool?.includes(req.id)), 'unreachable material '+req.id);}
 const fresh=createNewCharacter('Contrato');fresh.level=ch.pass.level;fresh.tutorialCompleted=true;fresh.introSeen=true;fresh.quests.completed=[ch.pass.requires];fresh.quests.active[ch.pass.questId]={progress:[0]};let before=JSON.stringify(fresh);assert.equal(unlockJourneyZone(fresh,ch.id).success,false);assert.equal(JSON.stringify(fresh),before,'partial debit');fresh.gold=ch.pass.gold;fresh.inventory.items=ch.pass.items.map(i=>({...makeComponent(i.id),quantity:i.count}));assert(unlockJourneyZone(fresh,ch.id).success);assert.equal(fresh.gold,0);assert.equal(fresh.inventory.items.length,0);assert(canEnterZone(fresh,ch.id));before=JSON.stringify(fresh);assert.equal(unlockJourneyZone(fresh,ch.id).success,false);assert.equal(JSON.stringify(fresh),before,'double charge');}
for(const z of Object.values(ZONES))for(const e of z.enemies){assert(ALL_COMPONENTS[e.componentId],e.id);if(e.essenceId)assert(ALL_COMPONENTS[e.essenceId],e.id);if(z.id==='PANTANO_VEYRA'||z.id==='DESERTO_KAELOR')assert(rollDrops(e,z,c,{force:true,dropBonus:0,rareBonus:0}).length>0);}
const legacy=createNewCharacter('Legado');delete legacy.journeyVersion;delete legacy.introSeen;delete legacy.unlockedZoneIds;legacy.level=30;legacy.xpToNext=1000;legacy.xp=500;saveGame(legacy,[]);const migrated=loadGame().character;assert.equal(migrated.introSeen,true);assert(canEnterZone(migrated,'MAR_AZHAR'));assert(!canEnterZone(migrated,'PANTANO_VEYRA'));assert(Math.abs(migrated.xp/migrated.xpToNext-.5)<.001);
const oldClock=Date.now,oldRandom=Math.random;let time=1800000000000,seed=781;Date.now=()=>time;Math.random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const samples=[];
try{for(let trial=0;trial<5;trial++){const sim=createNewCharacter('5min');recalcStats(sim);let kills=0;for(let tick=0;tick<100;tick++){time+=3000;sim.hp=sim.hpMax;const r=processTick(sim,ZONES.BOSQUE_LYSS,false);kills+=r.kills;recalcStats(sim);}assert(sim.level<6,'Fast early progression');samples.push({level:sim.level,xp:sim.xp,gold:sim.gold,kills});}}finally{Date.now=oldClock;Math.random=oldRandom;}
assert(xpToNextLevel(2)>xpToNextLevel(1));assert(xpToNextLevel(26)>xpToNextLevel(25));
const evidence={ok:true,tutorialSteps:order.length,biomes:Object.keys(ZONES).length,newMonsters:10,contracts:6,conditions:'100 ticks de 3s, lobos, sem equipamento/poções, HP restaurado a cada tick para medir ritmo máximo de abates sem mortes; não é uma previsão de sobrevivência.',initialFiveMinuteSamples:samples};
fs.mkdirSync(path.join(root,'node_modules/.cache/journey-audit'),{recursive:true});fs.writeFileSync(path.join(root,'node_modules/.cache/journey-audit/result.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));

// Integration: tutorial cannot start by API before intro; real training seconds pause automatically.
const {useGameStore}=load(path.join(root,'src/store/gameStore.ts'));
const nativeSet=global.setInterval,nativeClear=global.clearInterval,realNow=Date.now;let createdTimers=0,trainingTime=1800100000000;
global.setInterval=()=>{createdTimers++;return 123;};global.clearInterval=()=>{};Date.now=()=>trainingTime;
try {
 useGameStore.getState().newGame('Integração');useGameStore.getState().startHunting('BOSQUE_LYSS');assert.equal(useGameStore.getState().isTickRunning,false);useGameStore.getState().acceptQuest('TUT_MATRIX');assert(!useGameStore.getState().character.quests.active.TUT_MATRIX);
 const trainee=createNewCharacter('Treino de iniciação');trainee.introSeen=true;trainee.quests.active.TUT_TRAIN={progress:[0]};useGameStore.setState({character:trainee,isTickRunning:false,isTraining:false});useGameStore.getState().startTraining('melee');assert.equal(useGameStore.getState().character.quests.active.TUT_TRAIN.progress[0],0);
 for(let n=0;n<10;n++){trainingTime+=3000;useGameStore.getState().tick();}
 assert.equal(useGameStore.getState().character.quests.active.TUT_TRAIN.progress[0],30);assert.equal(useGameStore.getState().isTraining,false);assert.equal(useGameStore.getState().character.trainingSeconds.melee,30);
 const completed=createNewCharacter('Pausa');completed.introSeen=true;completed.quests.active.TUT_1={progress:[10]};useGameStore.setState({character:completed,isTickRunning:false,isTraining:false});const timersBefore=createdTimers;useGameStore.getState().startHunting('BOSQUE_LYSS');assert.equal(useGameStore.getState().isTickRunning,false);assert.equal(createdTimers,timersBefore,'intervalo recriado após pausa');
 for(let lv=1;lv<=100;lv++){const old=lv<=25?Math.floor(100*1.25**(lv-1)):Math.floor(100*1.25**24*(lv/25)**3.5);assert(xpToNextLevel(lv)>=old);}
 console.log('PASS integração: intro obrigatória, aceite validado, treino real de 30s e pausa sem recriar intervalo.');
} finally {global.setInterval=nativeSet;global.clearInterval=nativeClear;Date.now=realNow;}

const full=createNewCharacter('Bolsa cheia');full.inventory.backpack.slots=1;const fragment=makeEquipment('FRAGMENTO_COMUM');fragment.quantity=998;full.inventory.items=[fragment];full.quests.active.TUT_4={progress:[1]};assert(claimQuestReward(full,'TUT_4').success);assert.equal(full.inventory.items[0].quantity,998);assert.equal(full.depot[0].quantity,10);console.log('PASS recompensa com bolsa cheia: depósito sem duplicar stack parcial.');
