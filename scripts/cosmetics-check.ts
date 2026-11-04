import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { freshWorld, executeGame } from "../server/game";
import { ALL_ITEM_TEMPLATES, createItem } from "../src/data/items";
import { COSMETIC_DEFINITIONS, COSMETIC_SLOTS } from "../src/data/cosmetics";
import { getCosmeticVisual } from "../src/utils/cosmetics";
import { ownedCosmeticLoadout, normalizeCosmeticOwnership } from "../src/engine/cosmeticOwnership";
import { getGearScore } from "../src/engine/gearScore";

function fixture() {
  const world = freshWorld("Guardião", randomUUID());
  world.character.introSeen = true;world.character.tutorialCompleted = true;
  world.character.mythreonCoins = 1000;world.character.inventory.items = [];
  return executeGame(world).world;
}
function combatSnapshot(world: ReturnType<typeof fixture>) {
  const c = world.character;
  return JSON.stringify({ stats: c.baseStats, hp: c.hp, mp: c.mp, hpMax: c.hpMax, mpMax: c.mpMax, skills: c.skills, equipped: c.equipped, activeRace: c.activeRace, activeDivineBeastId: c.activeDivineBeastId, gear: getGearScore(c) });
}
let world = fixture();const unchanged = combatSnapshot(world);
for (const [id, definition] of Object.entries(COSMETIC_DEFINITIONS)) {
  assert(ALL_ITEM_TEMPLATES[id], id + " precisa de template");
  world.character.inventory.items.push(createItem({ ...ALL_ITEM_TEMPLATES[id], uid: id }));
  const equipped = executeGame(world, "equipCosmetic", [id]);
  assert.equal((equipped.result as any).success, true);
  world = equipped.world;
  assert.equal(world.character.cosmeticLoadout![definition.slot], id);
  assert.equal(combatSnapshot(world), unchanged, "Cosmético não pode alterar poder ou loadout de combate");
}
assert.equal(world.character.cosmeticLoadout!.petAuraTemplateId, "LUMINESCENCIA_PET");
assert.equal(world.character.cosmeticLoadout!.matrixGlowTemplateId, "LUMINESCENCIA_MATRIZ");
assert(getCosmeticVisual(world.character.cosmeticLoadout).petClassName);
assert(getCosmeticVisual(world.character.cosmeticLoadout).skinSprite?.includes("SKIN_PREMIUM_MES_01"));
for (const slot of COSMETIC_SLOTS) {
  const before = structuredClone(world.character.cosmeticLoadout), items = JSON.stringify(world.character.inventory);
  const removed = executeGame(world, "unequipCosmetic", [slot.key]);world = removed.world;
  assert.equal((removed.result as any).success, true);
  delete before[slot.key];assert.deepEqual(world.character.cosmeticLoadout, before);
  assert.equal(JSON.stringify(world.character.inventory), items, "Remover visual não remove itens");
  assert.equal(combatSnapshot(world), unchanged);
}
assert.throws(() => executeGame(world, "unequipCosmetic", ["ARMA_PRINCIPAL"]), /Espaço cosmético inválido/);
assert.throws(() => executeGame(fixture(), "equipCosmetic", ["LUMINESCENCIA_PET"]), /não possui/);
const bought = executeGame(fixture(), "buyMythreonOffer", ["PET_LUMINESCENCE"]);
assert.equal((bought.result as any).success, true);
assert.equal(bought.world.character.mythreonCoins, 880);
assert.equal(bought.world.character.inventory.items.filter(item => item.templateId === "LUMINESCENCIA_PET").length, 1);
assert.equal((executeGame(bought.world, "equipCosmetic", ["LUMINESCENCIA_PET"]).result as any).success, true);

world = fixture();
world.character.inventory.items.push(createItem({ ...ALL_ITEM_TEMPLATES.SKIN_MANTO_NEBULOSA, uid: "skin" }));
world = executeGame(world, "equipCosmetic", ["SKIN_MANTO_NEBULOSA"]).world;
const deposited = executeGame(world, "depositItem", ["skin"]).world;
assert.equal(deposited.character.cosmeticLoadout!.skinTemplateId, "SKIN_MANTO_NEBULOSA", "Depósito preserva propriedade");
const sold = executeGame(world, "sellItem", ["skin", 1]).world;
assert.equal(sold.character.cosmeticLoadout!.skinTemplateId, undefined, "Venda do último item desativa visual físico");
const permanent = fixture();permanent.character.calendarMonthlySkinKey = "2026-11";
const skin = executeGame(permanent, "equipCosmetic", ["SKIN_CAPA_PRIMEIRO_CANTO"]).world;
assert.equal(skin.character.cosmeticLoadout!.skinTemplateId, "SKIN_CAPA_PRIMEIRO_CANTO");
assert.equal(skin.character.inventory.items.some(item => item.templateId === "SKIN_CAPA_PRIMEIRO_CANTO"), false, "Conquista não precisa de item físico da skin");
const wrongSlot = fixture().character;
wrongSlot.inventory.items = [createItem(ALL_ITEM_TEMPLATES.LUMINESCENCIA_PET)];
wrongSlot.cosmeticLoadout = { skinTemplateId: "LUMINESCENCIA_PET", petAuraTemplateId: "LUMINESCENCIA_PET", bossAddonTemplateId: "INEXISTENTE" };
assert.deepEqual(ownedCosmeticLoadout(wrongSlot), { petAuraTemplateId: "LUMINESCENCIA_PET" });
assert.equal(getCosmeticVisual({ skinTemplateId: "LUMINESCENCIA_PET" }).skinClassName, "");
normalizeCosmeticOwnership(wrongSlot);const once = JSON.stringify(wrongSlot);
normalizeCosmeticOwnership(wrongSlot);assert.equal(JSON.stringify(wrongSlot), once);
console.log("Cosméticos: catálogo/slots, equipar/remover, compra da aura de Pet, propriedade, depósito/venda, conquista mensal e invariância de stats/Gear aprovados.");
