import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { executeGame as executeServerGame, freshWorld, type WorldState } from "../server/game";
import { ALL_ITEM_TEMPLATES, PROFESSION_TOOL_TEMPLATES, createItem } from "../src/data/items";
import { FISHING_SPOTS, MINING_NODES, PROFESSION_RECIPES } from "../src/data/professions";
import { professionPrecisionAt, PROFESSION_PULSE_MS } from "../src/engine/professionPrecision";
import { sellValue } from "../src/engine/shop";
import { ZONES } from "../src/data/zones";

// Exercise the real start/finish protocol at a controlled server time, without sleeping.
function executeGame(world: WorldState, action: string, args: unknown[] = []) {
  if (!["mineResource", "fishSpot"].includes(action)) return executeServerGame(world, action, args);
  const prepared = executeServerGame(world, "beginProfessionChallenge", [action === "mineResource" ? "MINERACAO" : "PESCA", args[0]]);
  if (!(prepared.result as any).success) return prepared;
  const challenge = prepared.world.professionChallenge!, clock = Date.now;
  const position = args[1] === 1.5 ? challenge.target : args[1] === 0.5 ? 0 : challenge.target + 0.08;
  try {
    Date.now = () => challenge.startsAt + Math.round(position * PROFESSION_PULSE_MS);
    return executeServerGame(prepared.world, "finishProfessionChallenge", [challenge.id]);
  } finally { Date.now = clock; }
}

function fixture(skill = 80) {
  const world = freshWorld("Coletor", randomUUID());
  world.character.introSeen = true; world.character.tutorialCompleted = true;
  world.character.professions = { mining: skill, fishing: skill, lastMiningAt: 0, lastFishingAt: 0 };
  world.character.unlockedZoneIds = Object.keys(ZONES);
  world.character.inventory.items = [];
  world.character.equippedMiningTool = createItem({ ...PROFESSION_TOOL_TEMPLATES.PICARETA_T5, uid: randomUUID() });
  world.character.equippedFishingRod = createItem({ ...PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T5, uid: randomUUID() });
  return world;
}
function amount(world: ReturnType<typeof fixture>, id: string) {
  return world.character.inventory.items.filter(item => item.templateId === id).reduce((sum, item) => sum + item.quantity, 0);
}
assert.deepEqual(MINING_NODES.map(node => node.tier), [1, 2, 3, 4, 5]);
assert.deepEqual(FISHING_SPOTS.map(spot => spot.rodTier), [1, 2, 3, 4, 5]);
for (const [action, points] of [["mineResource", MINING_NODES], ["fishSpot", FISHING_SPOTS]] as const) {
  for (const point of points) {
    const tier = "tier" in point ? point.tier : point.rodTier;
    assert(ZONES[point.zoneId]);
    assert.equal(point.requiredSkill, (tier - 1) * 20);
    assert.equal(ALL_ITEM_TEMPLATES[point.dropTemplateId].tier, tier);
    const world = fixture(point.requiredSkill);
    const result = executeGame(world, action, [point.id, 1.5]);
    assert.equal((result.result as any).success, true, point.id);
    assert(amount(result.world, point.dropTemplateId) > 0);
    const field = action === "mineResource" ? "mining" : "fishing";
    assert.equal(result.world.character.professions![field], point.requiredSkill + 2);
    assert.equal(result.world.character.hp, world.character.hp);
    const retry = executeGame(result.world, action, [point.id, 1]);
    assert.equal((retry.result as any).success, false, "A recarga precisa ser validada no domínio");
    assert.equal(amount(retry.world, point.dropTemplateId), amount(result.world, point.dropTemplateId));
    if (tier > 1) {
      const blocked = fixture(); blocked.character.unlockedZoneIds = ["BOSQUE_LYSS"];
      const locked = executeGame(blocked, action, [point.id]);
      assert.equal((locked.result as any).success, false);
      assert.match((locked.result as any).error, /travessia/);
      const underSkill = fixture(point.requiredSkill - 1);
      assert.equal((executeGame(underSkill, action, [point.id]).result as any).success, false);
      const underTool = fixture();
      if (action === "mineResource") underTool.character.equippedMiningTool = createItem(PROFESSION_TOOL_TEMPLATES.PICARETA_T1);
      else underTool.character.equippedFishingRod = createItem(PROFESSION_TOOL_TEMPLATES.VARA_PESCA_T1);
      assert.equal((executeGame(underTool, action, [point.id]).result as any).success, false);
    }
  }
}
const full = fixture();
full.character.inventory.backpack.slots = 1;
full.character.inventory.items = [createItem({ ...ALL_ITEM_TEMPLATES.MINERIO_FERRO, quantity: 998 })];
const inventoryBefore = JSON.stringify(full.character.inventory);
const denied = executeGame(full, "mineResource", ["veio_lyss", 1.5]);
assert.equal((denied.result as any).success, false);
assert.equal(JSON.stringify(denied.world.character.inventory), inventoryBefore, "Não pode preencher parcialmente uma stack ao rejeitar a coleta");
assert.equal(denied.world.character.professions!.mining, 80);
assert.equal(denied.world.character.professions!.lastMiningAt, 0);

for (const recipe of PROFESSION_RECIPES) {
  const world = fixture();
  world.character.inventory.items = recipe.ingredients.map(ingredient => createItem({
    ...(ALL_ITEM_TEMPLATES[ingredient.templateId] ?? { templateId: ingredient.templateId, name: ingredient.templateId, category: "MATERIAL", tier: 1, rarity: "COMUM", icon: "🍉", stackable: true, maxStack: 999 }),
    uid: randomUUID(), quantity: ingredient.quantity,
  }));
  const ingredientValue = world.character.inventory.items.reduce((sum, item) => sum + sellValue(item) * item.quantity, 0);
  assert(recipe.outputQuantity * sellValue(ALL_ITEM_TEMPLATES[recipe.outputTemplateId]) > ingredientValue, recipe.id + " deve ter margem de refino positiva");
  const crafted = executeGame(world, "refineProfessionRecipe", [recipe.id]);
  assert.equal((crafted.result as any).success, true, recipe.id);
  assert.equal(amount(crafted.world, recipe.outputTemplateId), recipe.outputQuantity);
  for (const ingredient of recipe.ingredients) assert.equal(amount(crafted.world, ingredient.templateId), 0);
  assert.throws(() => executeGame(crafted.world, "refineProfessionRecipe", [recipe.id]), /Faltam materiais/);
}
const crowded = fixture();
crowded.character.inventory.backpack.slots = 2;
crowded.character.inventory.items = [
  createItem({ ...ALL_ITEM_TEMPLATES.LINGOTE_FERRO, uid: "output", quantity: 998 }),
  createItem({ ...ALL_ITEM_TEMPLATES.MINERIO_FERRO, uid: "input", quantity: 20 }),
];
// One output fits a stack, two do not. Ingredients remain after a rejected operation.
crowded.character.inventory.items[1] = createItem({ ...ALL_ITEM_TEMPLATES.MINERIO_COBRE, uid: "copper", quantity: 10 });
crowded.character.inventory.items.push(createItem({ ...ALL_ITEM_TEMPLATES.MINERIO_FERRO, uid: "iron", quantity: 10 }));
crowded.character.inventory.backpack.slots = 3;
const crowdedBefore = JSON.stringify(crowded.character.inventory);
assert.throws(() => executeGame(crowded, "refineProfessionRecipe", ["LIGA_COBRE"]), /Bolsa cheia/);
assert.equal(JSON.stringify(crowded.character.inventory), crowdedBefore);

const pet = fixture(); pet.character.activeDivineBeastId = "ELARION";
pet.character.divineBeastNeeds = { ELARION: { nutrition: 0, mood: 50, updatedAt: Date.now() } };
pet.character.inventory.items.push(createItem({ ...ALL_ITEM_TEMPLATES.CALDO_MARCA_DAGUA, uid: "caldo", quantity: 2 }));
const fed = executeGame(pet, "feedDivineBeast", ["ELARION", "caldo"]);
assert.equal((fed.result as any).success, true);
assert.equal(amount(fed.world, "CALDO_MARCA_DAGUA"), 1);
assert(fed.world.character.divineBeastNeeds!.ELARION.nutrition >= 39.9);
assert(fed.world.character.divineBeastNeeds!.ELARION.mood > 59);
assert.equal(professionPrecisionAt(PROFESSION_PULSE_MS * 0.6, 0.6), 1.5);
assert.equal(professionPrecisionAt(PROFESSION_PULSE_MS * 0.68, 0.6), 1);
assert.equal(professionPrecisionAt(0, 0.6), 0.5);
assert.equal(professionPrecisionAt(PROFESSION_PULSE_MS, 0.6), 0.5);
assert.equal(professionPrecisionAt(NaN, 0.6), 0.5);
console.log("Profissões: tiers, travessias, ferramentas, skills, recarga, receitas, conservação de itens e alimento aprovados.");
