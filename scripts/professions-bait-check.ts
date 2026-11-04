import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { freshWorld, executeGame, type WorldState } from "../server/game";
import { createItem, ALL_ITEM_TEMPLATES, PROFESSION_TOOL_TEMPLATES } from "../src/data/items";
import { FISHING_BAIT } from "../src/data/professions";
import { createGameStore } from "../src/store/gameStore";
import { countByTemplate } from "../src/engine/inventory";
const clock = Date.now;let now=clock();Date.now=()=>now;
const bait=FISHING_BAIT.templateId;
function fixture(quantity=2) {
 const w=freshWorld("Iscas",randomUUID());w.character.tutorialCompleted=true;w.character.introSeen=true;
 w.character.professions={mining:80,fishing:80,lastMiningAt:0,lastFishingAt:0};
 w.character.equippedFishingRod=createItem(PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T5);
 w.character.equippedMiningTool=createItem(PROFESSION_TOOL_TEMPLATES.PICARETA_T5);
 w.character.inventory.items=quantity?[createItem({...ALL_ITEM_TEMPLATES[bait],quantity})]:[];return w;
}
const count=(w:WorldState,id:string)=>countByTemplate(w.character.inventory,id);
function begin(w:WorldState,chosen:string|undefined=bait) { return executeGame(w,"beginProfessionChallenge",["PESCA","corrego_lyss",...(chosen?[chosen]:[])]); }
function finish(w:WorldState) {
 const c=w.professionChallenge!;now=c.startsAt+Math.round(c.target*3000);
 return executeGame(w,"finishProfessionChallenge",[c.id]);
}
try {
 const plain=finish(begin(fixture(),"").world);assert.equal((plain.result as any).quantity,3);assert.equal(count(plain.world,bait),2);
 const begun=begin(fixture());assert.equal(count(begun.world,bait),2,"Preparar não gasta isca");assert.equal(begun.world.professionChallenge!.baitId,bait);
 const usedId=begun.world.professionChallenge!.id,won=finish(begun.world),result=won.result as any;
 assert.equal(result.quantity,4);assert.equal(result.bonusQuantity,1);assert.equal(result.baitConsumed,bait);
 assert.equal(count(won.world,bait),1);assert.equal(count(won.world,"PEIXE_RIO"),4);assert.equal(won.world.character.professions!.fishing,82);
 const before=JSON.stringify(won.world.character.inventory),repeat=executeGame(won.world,"finishProfessionChallenge",[usedId]);
 assert.equal((repeat.result as any).success,false);assert.equal(JSON.stringify(repeat.world.character.inventory),before);
 const cancelled=begin(fixture()).world;const cancelledId=cancelled.professionChallenge!.id;
 const cancellation=executeGame(cancelled,"cancelProfessionChallenge",[cancelledId]);assert.equal(count(cancellation.world,bait),2);assert.equal(count(cancellation.world,"PEIXE_RIO"),0);
 const expired=begin(fixture()).world,expiredId=expired.professionChallenge!.id;now=expired.professionChallenge!.expiresAt;
 const expiration=executeGame(expired,"finishProfessionChallenge",[expiredId]);assert.equal((expiration.result as any).success,false);assert.equal(count(expiration.world,bait),2);
 assert.equal((begin(fixture(0)).result as any).success,false);
 assert.equal((begin(fixture(),"FAKE").result as any).success,false);
 assert.equal((executeGame(fixture(),"beginProfessionChallenge",["MINERACAO","veio_lyss",bait]).result as any).success,false);
 const moved=begin(fixture()).world;moved.character.depot.push(...moved.character.inventory.items);moved.character.inventory.items=[];
 const missing=finish(moved);assert.equal((missing.result as any).success,false);assert.equal(count(missing.world,"PEIXE_RIO"),0);assert.equal(missing.world.character.professions!.lastFishingAt,0);
 const full=begin(fixture()).world;full.character.inventory.backpack.slots=2;full.character.inventory.items.push(createItem({...ALL_ITEM_TEMPLATES.PEIXE_RIO,quantity:998}));
 const fullBefore=JSON.stringify(full.character.inventory),noRoom=finish(full);assert.equal((noRoom.result as any).success,false);
 assert.equal(JSON.stringify(noRoom.world.character.inventory),fullBefore,"Rejeição não gasta isca nem preenche stack parcialmente");
 const one=fixture(1);one.character.inventory.backpack.slots=1;const freed=finish(begin(one).world);
 assert.equal((freed.result as any).success,true);assert.equal(count(freed.world,bait),0);assert.equal(count(freed.world,"PEIXE_RIO"),4,"Última isca libera o slot para o peixe");
 const split=begin(fixture()).world;split.character.inventory.items.push(createItem({...ALL_ITEM_TEMPLATES.PEIXE_RIO,quantity:998}));const stacked=finish(split);
 assert.equal(count(stacked.world,"PEIXE_RIO"),1002);assert(stacked.world.character.inventory.items.every(item=>item.quantity<=999));assert.equal(count(stacked.world,bait),1);
 const local=createGameStore({server:true,persist:()=>{},notify:()=>{},now:()=>now});local.setState({character:fixture().character});
 const offline=local.getState().fishSpot("corrego_lyss",1.5,bait);assert.equal(offline.quantity,4);assert.equal(offline.bonusQuantity,1);
 assert.equal(countByTemplate(local.getState().character!.inventory,bait),1);
 const localSnapshot=JSON.stringify(local.getState().character);assert.equal(local.getState().fishSpot("corrego_lyss",1.5,bait).success,false);assert.equal(JSON.stringify(local.getState().character),localSnapshot);
 console.log("Iscas: opcionais, bônus exato, consumo atômico, cancelamento/expiração sem gasto, vínculo ao pulso, falta de isca, bolsa cheia, último slot, stacks999, replay e offline aprovados.");
} finally {Date.now=clock;}
