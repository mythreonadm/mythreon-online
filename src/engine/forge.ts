import { Character, Item } from "../types";
import { removeItem, countByTemplate } from "./inventory";
import { recalcStats } from "./stats";
import { generateRandomAffixes } from "./drops";

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

// ─── APLICAR UPGRADE ───
export function upgradeItemLevel(char: Character, itemUid: string): { success: boolean; error?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado no inventário." };
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