import { Character, Item } from "../types";
import { removeItem, countByTemplate, canAddItem, addItem } from "./inventory";
import { recalcStats } from "./stats";
import { generateRandomAffixes } from "./drops";
import { FRAGMENT_TEMPLATES, ALL_ITEM_TEMPLATES, createItem } from "../data/items";
import { buildItemEnchantment, enchantmentForZone, enchantmentRuneTemplateId } from "../data/enchantments";

export const FORGE_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"] as const;

export function getEnchantmentCost(item: Item, zoneId?: string): { runes: number; gold: number; runeTemplateId: string } {
  // O custo cresce com o tier e com o nível de afiação/aprimoramento, sem
  // depender de valores enviados pelo cliente.
  const safeUpgradeLevel = Number.isFinite(Number(item.upgradeLevel)) ? Math.max(0, Number(item.upgradeLevel)) : 0;
  return {
    runes: 100,
    gold: Math.floor(1000 * item.tier * Math.max(1, safeUpgradeLevel + 1)),
    runeTemplateId: zoneId ? enchantmentRuneTemplateId(zoneId) : "",
  };
}

export function enchantItem(char: Character, itemUid: string, zoneId: string): { success: boolean; error?: string; enchantment?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  const definition = enchantmentForZone(zoneId);
  if (!item) return { success: false, error: "Item não encontrado no inventário." };
  if (!definition) return { success: false, error: "Este mapa ainda não possui um encantamento descoberto." };
  if (!FORGE_CATEGORIES.includes(item.category as typeof FORGE_CATEGORIES[number])) return { success: false, error: "Escolha um equipamento válido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Encantamentos exigem um item Incomum ou superior." };
  if (item.enchantment) return { success: false, error: "Este item já possui um Encantamento Único." };

  const cost = getEnchantmentCost(item, zoneId);
  const ownedRunes = countByTemplate(char.inventory, cost.runeTemplateId);
  if (ownedRunes < cost.runes) return { success: false, error: `Faltam runas. Você possui ${ownedRunes}; precisa de ${cost.runes}.` };
  if (char.gold < cost.gold) return { success: false, error: `Ouro insuficiente. Você precisa de ${cost.gold.toLocaleString("pt-BR")} gold.` };

  const enchantment = buildItemEnchantment(zoneId, item.tier);
  if (!enchantment) return { success: false, error: "Não foi possível materializar este aspecto." };
  char.gold -= cost.gold;
  let remaining = cost.runes;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== cost.runeTemplateId || remaining <= 0) continue;
    const amount = Math.min(entry.quantity, remaining);
    removeItem(char.inventory, entry.uid, amount);
    remaining -= amount;
  }
  item.enchantment = enchantment;
  recalcStats(char);
  return { success: true, enchantment: enchantment.name };
}

function hydrateLegacyStats(item: Item) {
  const template = ALL_ITEM_TEMPLATES[item.templateId];
  if (!template) return;
  for (const [key, value] of Object.entries(template.stats ?? {})) {
    const current = Number((item.stats as any)?.[key]);
    if (!Number.isFinite(current) || current === 0) (item.stats as any)[key] = Math.round(Number(value) * Math.pow(1.1, item.upgradeLevel ?? 0) * 100) / 100;
  }
}

// ─── CUSTO DE UPGRADE (+1, +2...) ───
export function getUpgradeCost(item: Item): { fragments: number; gold: number; fragmentType: string } {
  const nextLevel = item.upgradeLevel + 1;
  let fragmentType = "FRAGMENTO_COMUM";
  let fragmentsNeeded = 5 * nextLevel;

  if (item.tier >= 3) { fragmentType = "FRAGMENTO_RARO"; fragmentsNeeded = 3 * nextLevel; }
  if (item.tier >= 5) { fragmentType = "FRAGMENTO_EPICO"; fragmentsNeeded = 2 * nextLevel; }

  // Custo em ouro aumenta exponencialmente com o nível do item
  const goldCost = Math.floor((100 * item.tier * Math.pow(nextLevel, 2)));

  return { fragments: fragmentsNeeded, gold: goldCost, fragmentType };
}

export function forgeFragments(char: Character, fromTemplateId: string): { success: boolean; error?: string; crafted?: number } {
  const recipes: Record<string, { to: string; input: number; output: number }> = {
    FRAGMENTO_COMUM: { to: "FRAGMENTO_EPICO", input: 100, output: 10 },
    FRAGMENTO_RARO: { to: "FRAGMENTO_EPICO", input: 25, output: 10 },
  };
  const recipe = recipes[fromTemplateId];
  if (!recipe) return { success: false, error: "Esse fragmento não possui receita de fusão." };
  const available = countByTemplate(char.inventory, fromTemplateId);
  if (available < recipe.input) return { success: false, error: `Você precisa de ${recipe.input} fragmentos; possui ${available}.` };
  const crafted = createItem({ ...FRAGMENT_TEMPLATES[recipe.to], quantity: recipe.output });
  if (!canAddItem(char.inventory, crafted)) return { success: false, error: "Não há espaço para os fragmentos forjados." };
  let remaining = recipe.input;
  for (const item of [...char.inventory.items]) {
    if (item.templateId !== fromTemplateId || remaining <= 0) continue;
    const amount = Math.min(item.quantity, remaining);
    removeItem(char.inventory, item.uid, amount);
    remaining -= amount;
  }
  addItem(char.inventory, crafted);
  return { success: true, crafted: recipe.output };
}

// ─── APLICAR UPGRADE ───
export function upgradeItemLevel(char: Character, itemUid: string): { success: boolean; error?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado no inventário." };
  if (!FORGE_CATEGORIES.includes(item.category as typeof FORGE_CATEGORIES[number])) return { success: false, error: "Escolha um equipamento válido para o Ferreiro." };
  hydrateLegacyStats(item);
  if (item.upgradeLevel >= 10) return { success: false, error: "O item já atingiu o nível máximo (+10)." };

  const cost = getUpgradeCost(item);
  const fragmentsOwned = countByTemplate(char.inventory, cost.fragmentType);

  if (fragmentsOwned < cost.fragments) {
    return { success: false, error: `Fragmentos insuficientes. Você tem ${fragmentsOwned}, precisa de ${cost.fragments}.` };
  }
  if (char.gold < cost.gold) {
    return { success: false, error: `Ouro insuficiente. Você tem ${char.gold}, precisa de ${cost.gold}.` };
  }

  // Cobra o Ouro
  char.gold -= cost.gold;

  // Remove os fragmentos
  let remainingToRemove = cost.fragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === cost.fragmentType && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }

  // Aumenta o nível
  item.upgradeLevel += 1;
  
  // Aumenta os stats base em 10% por nível
  for (const [k, v] of Object.entries(item.stats)) {
    (item.stats as any)[k] = Math.round((v as number) * 1.10 * 100) / 100;
  }

  // Recalcula os stats do personagem
  recalcStats(char);
  return { success: true };
}

// ─── REENCANTAR ATRIBUTOS (REROLL) ───
export function rerollItemAffixes(char: Character, itemUid: string): { success: boolean; error?: string; newAffixes?: any[] } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category as typeof FORGE_CATEGORIES[number])) return { success: false, error: "Escolha um equipamento válido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns não possuem atributos para reencantar." };

  // Custo
  const costFragments = 20;
  const costGold = 500 * item.tier;
  const fragmentsOwned = countByTemplate(char.inventory, "FRAGMENTO_RARO");

  if (fragmentsOwned < costFragments) {
    return { success: false, error: `Faltam Fragmentos Raros. Você tem ${fragmentsOwned}, precisa de ${costFragments}.` };
  }
  if (char.gold < costGold) {
    return { success: false, error: `Ouro insuficiente. Você tem ${char.gold}, precisa de ${costGold}.` };
  }

  // Cobra
  char.gold -= costGold;
  let remainingToRemove = costFragments;
  for (const invItem of char.inventory.items) {
    if (invItem.templateId === "FRAGMENTO_RARO" && remainingToRemove > 0) {
      const remove = Math.min(invItem.quantity, remainingToRemove);
      removeItem(char.inventory, invItem.uid, remove);
      remainingToRemove -= remove;
    }
  }

  // Gera novos atributos
  const newAffixes = generateRandomAffixes(item.category, item.rarity, item.tier);
  item.affixes = newAffixes;
  recalcStats(char);
  
  return { success: true, newAffixes };
}

export function elevateItemTier(char: Character, itemUid: string): { success: boolean; error?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category as typeof FORGE_CATEGORIES[number])) return { success: false, error: "Escolha um equipamento válido para o Ferreiro." };
  if (item.tier >= 5) return { success: false, error: "Este item já está no Tier máximo." };
  const nextTier = item.tier + 1;
  const fragments = 15 * nextTier;
  const gold = 2500 * nextTier * nextTier;
  const owned = countByTemplate(char.inventory, "FRAGMENTO_EPICO");
  if (owned < fragments) return { success: false, error: `Faltam Fragmentos Épicos. Você tem ${owned}, precisa de ${fragments}.` };
  if (char.gold < gold) return { success: false, error: `Ouro insuficiente. Você tem ${char.gold}, precisa de ${gold}.` };
  char.gold -= gold;
  let left = fragments;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== "FRAGMENTO_EPICO" || left <= 0) continue;
    const amount = Math.min(entry.quantity, left); removeItem(char.inventory, entry.uid, amount); left -= amount;
  }
  item.tier = nextTier as Item["tier"];
  for (const [key, value] of Object.entries(item.stats)) (item.stats as any)[key] = Math.round(Number(value) * 1.22 * 100) / 100;
  item.name = item.name.replace(/ · T[1-5]$/, "") + ` · T${nextTier}`;
  recalcStats(char);
  return { success: true };
}

export function rerollSpecificAffix(char: Character, itemUid: string, stat: keyof Item["stats"]): { success: boolean; error?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado." };
  if (!FORGE_CATEGORIES.includes(item.category as typeof FORGE_CATEGORIES[number])) return { success: false, error: "Escolha um equipamento válido para o Ferreiro." };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns não possuem atributos para reencantar." };
  const costFragments = 100;
  const costGold = 2500 * item.tier;
  if ((char.mythreonCoins ?? 0) < 1) return { success: false, error: "É necessária 1 Mythreon Coin para sortear um atributo específico." };
  if (countByTemplate(char.inventory, "FRAGMENTO_RARO") < costFragments) return { success: false, error: `Faltam Fragmentos Raros. Você precisa de ${costFragments}.` };
  if (char.gold < costGold) return { success: false, error: `Ouro insuficiente. Você precisa de ${costGold}.` };
  const generated = generateRandomAffixes(item.category, item.rarity, item.tier);
  const replacement = generated.find(affix => affix.stat === stat) ?? generated[0];
  if (!replacement) return { success: false, error: "Nenhum atributo compatível foi encontrado." };
  char.gold -= costGold; char.mythreonCoins = (char.mythreonCoins ?? 0) - 1;
  let left = costFragments;
  for (const entry of [...char.inventory.items]) {
    if (entry.templateId !== "FRAGMENTO_RARO" || left <= 0) continue;
    const amount = Math.min(entry.quantity, left); removeItem(char.inventory, entry.uid, amount); left -= amount;
  }
  const index = item.affixes.findIndex(affix => affix.stat === stat);
  if (index >= 0) item.affixes[index] = replacement; else item.affixes.push(replacement);
  recalcStats(char);
  return { success: true };
}
