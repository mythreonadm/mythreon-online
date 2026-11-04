import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { executeGame, freshWorld, type WorldState } from "../server/game";
import { createItem, PROFESSION_TOOL_TEMPLATES, ALL_ITEM_TEMPLATES } from "../src/data/items";
import { PROFESSION_PULSE_MS } from "../src/engine/professionPrecision";
const clock = Date.now;let now = clock();Date.now = () => now;
function fixture() {
 const w=freshWorld("Pulso",randomUUID());w.character.tutorialCompleted=true;w.character.introSeen=true;
 w.character.professions={mining:80,fishing:80,lastMiningAt:0,lastFishingAt:0};
 w.character.equippedMiningTool=createItem(PROFESSION_TOOL_TEMPLATES.PICARETA_T5);
 w.character.equippedFishingRod=createItem(PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T5);return w;
}
const begin=(world:WorldState,kind="MINERACAO",point="veio_lyss")=>executeGame(world,"beginProfessionChallenge",[kind,point]);
const finish=(world:WorldState,id=world.professionChallenge!.id)=>executeGame(world,"finishProfessionChallenge",[id]);
try {
 let w=fixture();const inventory=JSON.stringify(w.character.inventory);
 assert.throws(()=>executeGame(w,"mineResource",["veio_lyss",1.5]),/pulso/);
 const denied=begin(w,"MINERACAO","eclipse_profundo");assert.equal((denied.result as any).success,false);
 assert.equal(denied.world.professionChallenge,undefined);
 const prepared=begin(w);w=prepared.world;const pulse=w.professionChallenge!;
 assert.match(pulse.id,/^[0-9a-f-]{36}$/);assert.equal(JSON.stringify(w.character.inventory),inventory);
 assert.equal((begin(w,"PESCA","corrego_lyss").result as any).success,false,"Só um pulso por personagem");
 const foreign=finish(w,randomUUID());assert.equal((foreign.result as any).success,false);assert.equal(foreign.world.professionChallenge!.id,pulse.id);
 assert.equal((finish(fixture(),pulse.id).result as any).success,false,"Outro personagem não usa o pulso");
 assert.throws(()=>executeGame(w,"finishProfessionChallenge",[pulse.id,1.5]),/Parâmetros/);
 const early=finish(w);assert.equal((early.result as any).success,false);assert.equal(early.world.professionChallenge,undefined);
 assert.equal(early.world.character.professions!.mining,80);
 w=begin(early.world).world;const perfect=w.professionChallenge!;now=perfect.startsAt+Math.round(perfect.target*PROFESSION_PULSE_MS);
 const won=finish(w);assert.equal((won.result as any).precision,1.5);assert.equal(won.world.character.professions!.mining,82);
 assert.equal(won.world.professionChallenge,undefined);
 const count=JSON.stringify(won.world.character.inventory);const repeated=finish(won.world,perfect.id);
 assert.equal((repeated.result as any).success,false);assert.equal(JSON.stringify(repeated.world.character.inventory),count);
 assert.equal((begin(won.world).result as any).success,false,"Recarga após coleta confirmada");
 now+=6000;w=begin(won.world,"PESCA","corrego_lyss").world;
 const fishing=w.professionChallenge!;now=fishing.startsAt+Math.round((fishing.target+0.08)*3000);
 const good=finish(w);assert.equal((good.result as any).precision,1);assert.equal(good.world.character.professions!.fishing,81);
 now+=6000;w=begin(good.world).world;const expired=w.professionChallenge!;now=expired.expiresAt;
 assert.equal((finish(w).result as any).success,false);assert.equal(w.character.professions!.mining,82);
 w=begin(fixture()).world;const cancelled=executeGame(w,"cancelProfessionChallenge",[w.professionChallenge!.id]);assert.equal(cancelled.world.professionChallenge,undefined);
 assert.equal(cancelled.world.character.professions!.mining,80);
 w=begin(fixture()).world;w.character.equippedMiningTool=undefined;now=w.professionChallenge!.startsAt+Math.round(w.professionChallenge!.target*3000);
 const unequipped=finish(w);assert.equal((unequipped.result as any).success,false);assert.equal(unequipped.world.character.professions!.mining,80);
 w=begin(fixture()).world;w.character.inventory.backpack.slots=1;w.character.inventory.items=[createItem({...ALL_ITEM_TEMPLATES.MINERIO_FERRO,quantity:998})];
 now=w.professionChallenge!.startsAt+Math.round(w.professionChallenge!.target*3000);const fullBefore=JSON.stringify(w.character.inventory),full=finish(w);
 assert.equal((full.result as any).success,false);assert.equal(JSON.stringify(full.world.character.inventory),fullBefore);assert.equal(full.world.professionChallenge,undefined);
 console.log("Pulso autoritativo: acesso, nonce por personagem, um desafio, tempo real, score não confiado, recarga, cancelamento, expiração, ferramenta removida, bolsa cheia e uso único aprovados.");
} finally { Date.now=clock; }
