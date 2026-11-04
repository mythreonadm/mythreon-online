import assert from "node:assert/strict";
import {randomUUID} from "node:crypto";
import {freshWorld,executeGame} from "../server/game";
import {createCardInstance,CARD_TEMPLATES,getCardStats,cardDropChance,rollCardDrop,PACK60_CARD_TEMPLATE_IDS,seasonCardCatalogSize,seasonUniqueCards} from "../src/data/cards";
import {ZONES} from "../src/data/zones";
import {cardEvolutionQuote,evolveCard,equippedCards,formationBonus,cardFormationScore,cardHeroBonus} from "../src/engine/cardCollection";
import {recalcStats} from "../src/engine/stats";
import {scoreCards,getGearScore} from "../src/engine/gearScore";
function fixture(copies=30) {
 const w=freshWorld("Memórias",randomUUID());w.character.tutorialCompleted=true;w.character.introSeen=true;w.character.gold=100000;
 const base={...createCardInstance("CARD_LOBO"),uid:"main",obtainedAt:123};
 w.character.cards=[base,...Array.from({length:copies},(_,i)=>({...createCardInstance("CARD_LOBO"),uid:"copy-"+i,obtainedAt:1000+i}))];
 w.character.cardLoadout=["main"];recalcStats(w.character);w.character.hp=100;return w;
}
const card=CARD_TEMPLATES.CARD_LOBO;
const orphaned=Object.entries(CARD_TEMPLATES).filter(([,template])=>!ZONES[template.region]?.enemies.some(enemy=>enemy.id===template.monsterId));
assert.deepEqual(orphaned.map(([id])=>id),[],"Toda carta do catálogo precisa de criatura de origem");
assert.equal(Object.keys(CARD_TEMPLATES).length,48,"O Pack 60 deve completar o catálogo com 10 cartas dos biomas Veyra/Kaelor");
assert.equal(PACK60_CARD_TEMPLATE_IDS.length,10);
assert.equal(new Set(PACK60_CARD_TEMPLATE_IDS).size,10);
assert(PACK60_CARD_TEMPLATE_IDS.every(id=>CARD_TEMPLATES[id]?.region==='PANTANO_VEYRA'||CARD_TEMPLATES[id]?.region==='DESERTO_KAELOR'));
assert.equal(seasonCardCatalogSize("2026-11"),38,"A temporada em andamento conserva o denominador original");
assert.equal(seasonCardCatalogSize("2026-12"),48,"A expansão entra na próxima temporada");
const catalogCards=PACK60_CARD_TEMPLATE_IDS.map(templateId=>({uid:templateId,templateId,level:1,obtainedAt:1}));
assert.equal(seasonUniqueCards(catalogCards,"2026-11"),0);
assert.equal(seasonUniqueCards(catalogCards,"2026-12"),10);
const random=Math.random;try {
  for(const tier of [1,2,3,4,5])for(const boss of [false,true]){
    const chance=cardDropChance(tier,boss);Math.random=()=>chance;assert.equal(rollCardDrop("LOBO",tier,boss),null);
    Math.random=()=>chance-.000001;assert(rollCardDrop("LOBO",tier,boss));
  }
  assert.equal(rollCardDrop("NOT_A_CARD",1,false),null);
}finally{Math.random=random;}
assert.deepEqual(getCardStats(card,999),getCardStats(card,5));assert.deepEqual(getCardStats(card,NaN),getCardStats(card,1));
assert.deepEqual(getCardStats(card,-3),getCardStats(card,1));assert.deepEqual(getCardStats(card,2.8),getCardStats(card,2));
const base=fixture().character;
assert.deepEqual(formationBonus(base),{hp:15,atk:5,def:1.5,spd:.06});
assert.equal(scoreCards(base),cardFormationScore(base));assert.deepEqual(cardHeroBonus(base.cards[0]),formationBonus(base));
const damaged=structuredClone(base);damaged.cardLoadout=["main","main","unknown",...damaged.cards.slice(1,8).map(card=>card.uid)];
assert.equal(equippedCards(damaged).length,5);assert.equal(formationBonus(damaged).hp,75);
const one=structuredClone(base);one.cardLoadout=["main","main","unknown"];recalcStats(one);
const clean=structuredClone(base);recalcStats(clean);assert.deepEqual(one.baseStats,clean.baseStats);assert.equal(scoreCards(one),scoreCards(clean));
let world=fixture(),previousGear=getGearScore(world.character),totalGold=0;
for(let level=1;level<5;level++){
 const quote=cardEvolutionQuote(world.character,"main")!;assert.equal(quote.copiesNeeded,2**level);assert.equal(quote.gold,600*level**2);
 const count=world.character.cards.length,unique=new Set(world.character.cards.map(card=>card.templateId)).size,hp=world.character.hp;
 const result=executeGame(world,"evolveCard",["main",quote.suggested,level]);world=result.world;const receipt=result.result as any;
 assert.equal(receipt.success,true);assert.equal(receipt.level,level+1);totalGold+=quote.gold;
 assert.equal(world.character.cards.length,count-quote.copiesNeeded);assert.equal(world.character.cards[0].uid,"main");assert.equal(world.character.cards[0].obtainedAt,123);
 assert.deepEqual(world.character.cardLoadout,["main"]);assert.equal(new Set(world.character.cards.map(card=>card.templateId)).size,unique);
 assert.equal(world.character.hp,hp,"Evoluir não cura");assert(getGearScore(world.character)>previousGear);previousGear=getGearScore(world.character);
}
assert.equal(world.character.cards.length,1);assert.equal(world.character.gold,100000-totalGold);assert.equal(totalGold,18000);assert.equal(cardEvolutionQuote(world.character,"main")!.maxed,true);
const maxBefore=JSON.stringify(world.character);assert.equal(evolveCard(world.character,"main",[],5).success,false);assert.equal(JSON.stringify(world.character),maxBefore);
function rejected(change:(c:typeof base)=>void,uid="main",materials=["copy-0","copy-1"],expected=1) {
 const c=fixture(5).character;change(c);const before=JSON.stringify(c);const result=evolveCard(c,uid,materials,expected);
 assert.equal(result.success,false);assert.equal(JSON.stringify(c),before,"Falha deve preservar gold, cartas, IDs e atributos");return result;
}
rejected(()=>{},"foreign");rejected(()=>{},"main",["copy-0","copy-0"]);rejected(()=>{},"main",["copy-0"]);rejected(()=>{},"main",["main","copy-0"]);
rejected(c=>{c.gold=599});rejected(c=>{c.cardLoadout!.push("copy-0")});rejected(c=>{c.cards[1].level=2});
rejected(c=>{c.cards[1].templateId="CARD_VESPA"});rejected(c=>{c.cards.push({...c.cards[1]})});rejected(()=>{},"main",["copy-0","copy-1"],2);
const twice=fixture(8),quote=cardEvolutionQuote(twice.character,"main")!,first=executeGame(twice,"evolveCard",["main",quote.suggested,1]);
const firstSnapshot=JSON.stringify(first.world.character.cards),gold=first.world.character.gold;
const duplicate=executeGame(first.world,"evolveCard",["main",["copy-2","copy-3","copy-4","copy-5"],1]);
assert.equal((duplicate.result as any).success,false);assert.equal(JSON.stringify(duplicate.world.character.cards),firstSnapshot);assert.equal(duplicate.world.character.gold,gold);
assert.throws(()=>executeGame(fixture(),"evolveCard",["main",[],0]),/Dados/);
assert.throws(()=>executeGame(fixture(),"evolveCard",["main",Array(17).fill("copy-0"),1]),/Dados/);
const unknown=fixture();unknown.character.cards.push({uid:"unknown",templateId:"FAKE",level:1,obtainedAt:0});
assert.throws(()=>executeGame(unknown,"setCardLoadout",[["unknown"]]),/pertence/);
const formation=executeGame(fixture(),"setCardLoadout",[["main","main"]]);assert.deepEqual(formation.world.character.cardLoadout,["main"]);
console.log("Cards: custos/níveis1–5, cópias livres, preservação de UID/espécie/formação, sem cura, rollback, nível esperado, limite5, stats compartilhados e Gear aprovados.");
