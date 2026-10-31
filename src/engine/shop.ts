import { Character, Item, Rarity } from "../types";
import { removeItem } from "./inventory";
import { RARITY_ORDER } from "./drops";
import { getPotionUsePrice } from "../data/potionEconomy";

const TIER_BASE = [5, 20, 70, 220, 700];
const RARITY_SELL: Record<Rarity, number> = { COMUM: 1, INCOMUM: 2, RARO: 5, EPICO: 12, LENDARIO: 40 };
const EQUIP_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "ESCUDO"];

export function sellValue(item: Item): number {
  switch (item.category) {
    case "COMPONENTE": return 8;
    case "POCAO": return Math.floor(getPotionUsePrice(item.templateId) * 0.4);
    case "BACKPACK": return (item.slots ?? 50) * 5;
    case "MATERIAL": return 10 * item.tier;
    default: {
      const affixBonus = 1 + (item.affixes?.length ?? 0) * 0.25;
      return Math.max(1, Math.floor(TIER_BASE[item.tier - 1] * RARITY_SELL[item.rarity] * affixBonus));
    }
  }
}

export function sellItem(char: Character, uid: string, qty = 1): { success: boolean; gold: number; count: number; error?: string } {
  const item = char.inventory.items.find((i) => i.uid === uid);
  if (!item) return { success: false, gold: 0, count: 0, error: "Item não encontrado" };
  const n = Math.min(qty, item.quantity);
  const gold = sellValue(item) * n;
  removeItem(char.inventory, uid, n);
  char.gold += gold;
  return { success: true, gold, count: n };
}

export function sellAllEquipment(char: Character, maxRarity: Rarity): { count: number; gold: number } {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  let count = 0, gold = 0;
  const keep: Item[] = [];
  for (const item of char.inventory.items) {
    const sellable = EQUIP_CATEGORIES.includes(item.category) && item.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(item.rarity) <= limit;
    if (sellable) { gold += sellValue(item) * item.quantity; count += item.quantity; } else keep.push(item);
  }
  char.inventory.items = keep;
  char.gold += gold;
  return { count, gold };
}

