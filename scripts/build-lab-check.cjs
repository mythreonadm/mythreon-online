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
global.localStorage = { getItem: () => null, setItem: () => { throw new Error('Laboratório tentou salvar dados reais.'); } };
const { createNewCharacter } = load(path.join(root,'src/engine/save.ts'));
const { analyzeBuild, simulateEnemy } = load(path.join(root,'src/engine/buildLab.ts'));
const { xpToNextLevel } = load(path.join(root,'src/engine/stats.ts'));
const { ZONES } = load(path.join(root,'src/data/zones.ts'));
const { makeEquipment } = load(path.join(root,'src/engine/drops.ts'));
const c = createNewCharacter('Teste do laboratório');
c.level=15;c.xpToNext=xpToNextLevel(15);c.gold=0;c.hp=1;
c.inventory.items.push(makeEquipment('ESPADA_T1','RARO'));
const before = JSON.stringify(c), clock=Date.now, random=Math.random;
Date.now=()=>1793610000000;
const fixedClock=Date.now;
try {
  const report=analyzeBuild(c,'BOSQUE_LYSS');
  assert.equal(JSON.stringify(c),before,'O save foi modificado.');
  assert.equal(Date.now,fixedClock);assert.equal(Math.random,random);
  assert.equal(report.enemies.length,ZONES.BOSQUE_LYSS.enemies.length);
  assert.ok(report.needsRest);assert.ok(report.plans.some(p=>p.id==='owned'));
  assert.ok(report.plans.some(p=>p.trainingMinutes>0));
  assert.ok(report.enemies.every(r=>r.potionGold===0),'Gold foi criado para comprar poções.');
  assert.deepEqual(analyzeBuild(c,'BOSQUE_LYSS'),report,'Mesma build/semente não reproduziu resultados.');
  const low=createNewCharacter('Bloqueado');const locked=analyzeBuild(low,'PICO_DHOR');
  assert.ok(locked.enemies.every(r=>r.locked && r.trials===0));assert.equal(locked.plans.length,0);
  const immortalZone=structuredClone(ZONES.BOSQUE_LYSS);immortalZone.enemies[0].hp=100000000;
  const timeout=simulateEnemy(c,immortalZone,immortalZone.enemies[0]);
  assert.ok(timeout.wins===0);assert.ok(timeout.seconds<=360);
  assert.ok(report.endurance.trials===20);
  const smoke=createNewCharacter('Windows');smoke.level=15;smoke.xpToNext=xpToNextLevel(15);smoke.gold=2000;
  const folder=path.join(root,'node_modules/.cache/desktop-smoke');fs.mkdirSync(folder,{recursive:true});
  fs.writeFileSync(path.join(folder,'fixture.json'),JSON.stringify({character:smoke,zoneId:'BOSQUE_LYSS'}));
  console.log('PASS: save intocado, RNG/relógio restaurados, resultados reproduzíveis, níveis bloqueados, orçamento real, treino projetado, timeout e resistência; fixture Windows criada.');
} finally { Date.now=clock;Math.random=random; }
