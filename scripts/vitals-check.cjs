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


const store=new Map();global.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
const {createNewCharacter,saveGame,loadGame}=load(path.join(root,'src/engine/save.ts'));
const {recalcStats,getBaseStats}=load(path.join(root,'src/engine/stats.ts'));
const {makeEquipment}=load(path.join(root,'src/engine/drops.ts'));
const {formatVital,vitalPercent}=load(path.join(root,'src/utils/vitals.ts'));
const c=createNewCharacter('HP sem cache');c.level=5;c.hpMax=1e12;c.mpMax=1e12;c.hp=1e12;c.mp=1e12;c.baseStats.hp=1e12;c.baseStats.mp=1e12;saveGame(c,[]);const restored=loadGame().character;
assert.equal(restored.hpMax,250);assert.equal(restored.mpMax,110);assert.equal(restored.hp,250);assert.equal(restored.mp,110);
const gear=makeEquipment('ESPADA_T1');gear.stats={hp:'40',mp:'20'};restored.equipped.ARMA_PRINCIPAL=gear;recalcStats(restored);assert.equal(restored.hpMax,290);assert.equal(restored.mpMax,130);
for(let n=0;n<1000;n++)recalcStats(restored);assert.equal(restored.hpMax,290);assert.equal(restored.mpMax,130);
restored.equipped={};recalcStats(restored);assert.equal(restored.hpMax,250);assert.equal(restored.mpMax,110);
assert.equal(formatVital(89.99999999999),'89');assert.equal(formatVital(12345.678),'12.345');assert.equal(formatVital(Infinity),'0');assert.equal(vitalPercent(200,100),100);assert.equal(vitalPercent(-2,100),0);assert.equal(vitalPercent(1,0),0);assert.equal(vitalPercent(NaN,100),0);
assert.equal(getBaseStats(1).hp,150);assert.equal(getBaseStats(10).hp,375);assert.equal(getBaseStats(10).mp,185);
console.log('PASS: HP/MP por nível, cache antigo descartado, bônus numéricos preservados, sem acúmulo em 1.000 recálculos e barras válidas sem casas decimais.');
