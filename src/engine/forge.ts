import { Character, Item, ItemStats } from "../types";
import { addItem, removeItem, countByTemplate } from "./inventory";
import { recalcStats } from "./stats";
import { FRAGMENT_TEMPLATES } from "../data/items";
import { generateRandomAffixes } from "./drops";

// ─── UPGRADE DE NÍVEL (+1, +2...) ───
export function getUpgradeCost(item: Item): { fragments: number; gold: number; fragmentType: string } {
  const nextLevel = item.upgradeLevel + 1;
  let fragmentType = "FRAGMENTO_COMUM";
  let fragmentsNeeded = 5 * nextLevel;

  if (item.tier >= 3) { fragmentType = "FRAGMENTO_RARO"; fragmentsNeeded = 3 * nextLevel; }
  if (item.tier >= 5) { fragmentType = "FRAGMENTO_EPICO"; fragmentsNeeded = 2 * nextLevel; }

  // Custo em ouro baseado no tier e nível atual
  const goldCost = Math.floor((100 * item.tier * Math.pow(nextLevel, 2)));

  return { fragments: fragmentsNeeded, gold: goldCost, fragmentType };
}

export function upgradeItemLevel(char: Character, itemUid: string): { success: boolean; error?: string } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado" };
  if (item.upgradeLevel >= 10) return { success: false, error: "Nível máximo atingido (+10)." };

  const cost = getUpgradeCost(item);
  const fragmentsOwned = countByTemplate(char.inventory, cost.fragmentType);

  if (fragmentsOwned < cost.fragments) return { success: false, error: `Faltam fragmentos (${fragmentsOwned}/${cost.fragments}).` };
  if (char.gold < cost.gold) return { success: false, error: `Ouro insuficiente (${char.gold}/${cost.gold}).` };

  // Consome
  char.gold -= cost.gold;
  // Remove os fragmentos (precisa achar o uid do stack)
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

  recalcStats(char);
  return { success: true };
}

// ─── REFINAR ATRIBUTOS (REROLL) ───
export function rerollItemAffixes(char: Character, itemUid: string): { success: boolean; error?: string; newAffixes?: any[] } {
  const item = char.inventory.items.find(i => i.uid === itemUid);
  if (!item) return { success: false, error: "Item não encontrado" };
  if (item.rarity === "COMUM") return { success: false, error: "Itens Comuns não possuem atributos." };

  // Custo: 20 Fragmentos Raros + 500 * Tier de Ouro
  const costFragments = 20;
  const costGold = 500 * item.tier;
  const fragmentsOwned = countByTemplate(char.inventory, "FRAGMENTO_RARO");

  if (fragmentsOwned < costFragments) return { success: false, error: `Faltam Fragmentos Raros (${fragmentsOwned}/${costFragments}).` };
  if (char.gold < costGold) return { success: false, error: `Ouro insuficiente (${char.gold}/${costGold}).` };

  // Consome
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