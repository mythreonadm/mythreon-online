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
  const localRequire = name => {
    if (!name.startsWith('.')) return require(name);
    const base = path.resolve(path.dirname(file), name);
    const target = [base + '.ts', base + '.tsx', path.join(base, 'index.ts')].find(p => fs.existsSync(p));
    return target ? load(target) : require(base);
  };
  new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
  return module.exports;
}
global.localStorage = { getItem: () => null, setItem: () => {} };
global.alert = () => {};
const stats = load(path.join(root, 'src/engine/stats.ts'));
const { createNewCharacter } = load(path.join(root, 'src/engine/save.ts'));
const { processTick, buildProfile } = load(path.join(root, 'src/engine/combat.ts'));
const { makeEquipment, rollRarity } = load(path.join(root, 'src/engine/drops.ts'));
const { ZONES } = load(path.join(root, 'src/data/zones.ts'));
const { NAMED_RACES } = load(path.join(root, 'src/data/races.ts'));
const { DIVINE_BEAST_ORDER, DIVINE_BEASTS } = load(path.join(root, 'src/data/divineBeasts.ts'));
let seed = 20261102;
Math.random = () => ((seed = (Math.imul(seed,1664525)+1013904223) >>> 0) / 4294967296);
const rows = [];
for (const zone of Object.values(ZONES)) for (const enemy of zone.enemies) {
  for (const route of ['Humano', 'Matriz', 'Beast']) {
    let wins=0, turns=0, dealt=0, taken=0, gold=0, xp=0, potionCost=0;
    for (let sample=0; sample<12; sample++) {
      const c=createNewCharacter('Audit'); c.level=enemy.minLevel || zone.minLevel;
      c.gold=process.argv.includes('--prepared')?100000:0; c.autoHpPotionEnabled=process.argv.includes('--prepared'); c.autoMpPotionEnabled=process.argv.includes('--prepared'); c.autoHpPotionId='POCAO_VIDA_'+zone.tier; c.autoMpPotionId='POCAO_MANA_'+Math.min(3,zone.tier); c.autoHpPotionPercent=65; c.autoMpPotionPercent=40; c.activeEnemyId=enemy.id; c.autoSell=null; c.autoSalvage=null;
      for (const key of ['ESPADA','CAPACETE','PEITORAL','LUVAS','CALCAS','BOTAS','COLAR','ANEL','ESCUDO','PULSEIRA']) {
        const item=makeEquipment(key+'_T'+zone.tier,process.argv.includes('--prepared')?'RARO':'COMUM'); if(item) c.equipped[item.slot]=item;
      }
      if(route==='Matriz') c.activeRace=structuredClone(NAMED_RACES[sample % NAMED_RACES.length]);
      if(route==='Beast') { const id=DIVINE_BEAST_ORDER[sample % DIVINE_BEAST_ORDER.length]; c.divineBeasts=[{id,obtainedAt:0}]; c.activeDivineBeastId=id; }
      stats.recalcStats(c); c.hp=c.hpMax; c.mp=c.mpMax;
      for(let tick=0;tick<120;tick++) {
        const result=processTick(c,zone,false); turns++; potionCost+=result.goldSpentPotions||0; dealt+=result.damageDealt||0; taken+=result.damageTaken||0;
        if(result.kills || result.death) { wins+=result.kills; gold+=result.gold; xp+=result.xp; break; }
      }
    }
    rows.push({zone:zone.name,enemy:enemy.name,route,level:enemy.minLevel||zone.minLevel,winPct:Math.round(wins/12*100),seconds:Math.round(turns/12*3),dealt:Math.round(dealt/12),taken:Math.round(taken/12),gold:Math.round(gold/12),potionCost:Math.round(potionCost/12),netGold:Math.round((gold-potionCost)/12),xp:Math.round(xp/12)});
  }
}
const rarity={};for(let i=0;i<100000;i++){const r=rollRarity();rarity[r]=(rarity[r]||0)+1;}
const assertions=[];
if(process.argv.includes('--check')) {
  const {applyTraining, masteryBonus}=load(path.join(root,'src/engine/training.ts'));
  const trainee=createNewCharacter('Training');trainee.trainingSkill='melee';trainee.trainingLastTick=1000000;
  applyTraining(trainee,1000000);assert.equal(trainee.trainingSeconds?.melee,undefined);
  for(let i=1;i<=10;i++)applyTraining(trainee,1000000+i*30000);
  assert.equal(trainee.trainingSeconds.melee,300);assert.equal(trainee.trainingAchievements.length,1);assert.equal(trainee.gold,100);assert.equal(trainee.trainingMastery.melee,1);
  applyTraining(trainee,1300000);assert.equal(trainee.gold,100);assert.equal(trainee.trainingSeconds.melee,300);
  trainee.skills.magic=100;assert.equal(masteryBonus(trainee,'magic'),0);trainee.trainingMastery.magic=100;assert.equal(masteryBonus(trainee,'magic'),0.30);
  assertions.push('Treino sem ticks gratuitos, conquista única de 5 min, maestria só por prática e limite de 30%');
  const {mitigatedDamage}=load(path.join(root,'src/data/balance.ts'));
  assert.ok(mitigatedDamage(100,100)<mitigatedDamage(100,10));assert.ok(mitigatedDamage(100,100000)>=30);assert.equal(mitigatedDamage(0,10),0);assertions.push('Armadura tem redução crescente limitada a 70%');
  const c=createNewCharacter('Checks'); c.hp=0;c.mp=0;stats.recalcStats(c);assert.equal(c.hp,0);assert.equal(c.mp,0);assertions.push('Recalcular não ressuscita nem recarrega mana zero');
  for(let level=2;level<=150;level++)assert.ok(stats.xpToNextLevel(level)>=stats.xpToNextLevel(level-1));assertions.push('XP necessário monotônico nos níveis 1–150');
  c.premium=false;const free=buildProfile(c).xpPct;c.premium=true;assert.ok(Math.abs(buildProfile(c).xpPct-free-0.1)<1e-9);assertions.push('Premium adiciona exatamente 10 pontos percentuais de bônus de XP');
  for(const id of DIVINE_BEAST_ORDER){const p=createNewCharacter(id);p.level=70;p.divineBeasts=[{id,obtainedAt:0}];p.activeDivineBeastId=id;p.tickCount=2;stats.recalcStats(p);p.hp=p.hpMax;p.mp=p.mpMax;const z=structuredClone(ZONES.BOSQUE_LYSS);z.enemies[0].hp=100000;const r=processTick(p,z,false);assert.ok(r.usedMp);assert.ok(Object.values(r.damageBreakdown.elemental).some(v=>v>0));}assertions.push('As 12 Beasts usam seu ataque elemental e consomem MP');
}
const report={seed:20261102,samplesPerScenario:12,gear:process.argv.includes('--prepared')?'Raro do tier com poções pagas, sem upgrades/vials; HP e MP cheios, orçamento inicial 100000 gold':'Comum do tier sem poções/upgrades/vials; HP e MP cheios',rarity,assertions,rows};
const name=process.argv.includes('--baseline')?'balanceamento-antes':process.argv.includes('--prepared')?'balanceamento-preparado':'balanceamento-depois';
fs.mkdirSync(path.join(root,'docs/conhecimento'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/conhecimento',name+'.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(root,'docs/conhecimento',name+'.md'),'# Auditoria '+name+'\n\nAmostra determinística: 12 encontros por cenário. Matriz/Beast alternam 12 modelos; não é uma avaliação exaustiva de builds. '+(process.argv.includes('--prepared')?'Equipamento raro, poções pagas, orçamento inicial 100000 gold.':'Equipamento comum, sem poções.')+' Sem vials. Limite de 120 ticks por encontro.\n\n'+assertions.map(a=>'- PASS: '+a).join('\n')+'\n\n| Zona | Mob | Caminho | Nível | Vitórias % | Segundos médios | Dano recebido | Gold bruto | Poções | Gold líquido | XP |\n|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|\n'+rows.map(r=>`| ${r.zone} | ${r.enemy} | ${r.route} | ${r.level} | ${r.winPct} | ${r.seconds} | ${r.taken} | ${r.gold} | ${r.potionCost} | ${r.netGold} | ${r.xp} |`).join('\n'));
console.log(JSON.stringify({scenarios:rows.length,encounters:rows.length*12,assertions,rarity}));
