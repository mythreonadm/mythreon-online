import { Character, Item, Rarity } from "../types";
import { BACKPACKS, BACKPACK_PRICES } from "../data/backpacks";
import { ALL_EQUIPMENT_TEMPLATES, POTION_TEMPLATES } from "../data/items";
import { addItem, canAddItem, removeItem } from "./inventory";
import { makeEquipment, makeBackpack, RARITY_ORDER } from "./drops";

const TIER_BASE = [5, 20, 70, 220, 700];
const RARITY_SELL: Record<Rarity, number> = { COMUM: 1, INCOMUM: 2, RARO: 5, EPICO: 12, LENDARIO: 40 };
const POTION_PRICE = [30, 110, 320, 900, 2600];
const TIER_MIN_LEVEL = [1, 11, 26, 46, 71];
const EQUIP_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "ESCUDO"];

export function sellValue(item: Item): number {
  switch (item.category) {
    case "COMPONENTE": return 8;
    case "POCAO": return Math.floor(POTION_PRICE[item.tier - 1] * 0.4);
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

export interface ShopEntry {
  id: string; kind: "POCAO" | "EQUIP" | "MOCHILA"; templateId: string;
  name: string; icon: string; price: number; minLevel: number; tier: number; info: string;
}

export function getShopStock(): ShopEntry[] {
  const stock: ShopEntry[] = [];
  Object.values(POTION_TEMPLATES).forEach((p) => {
    stock.push({ id: `buy:${p.templateId}`, kind: "POCAO", templateId: p.templateId, name: p.name, icon: p.icon, tier: p.tier,
      price: POTION_PRICE[p.tier - 1], minLevel: TIER_MIN_LEVEL[p.tier - 1], info: `Cura ${p.stats.hp} HP` });
  });
  Object.values(ALL_EQUIPMENT_TEMPLATES).forEach((e) => {
    const stats = Object.entries(e.stats).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(" · ");
    stock.push({ id: `buy:${e.templateId}`, kind: "EQUIP", templateId: e.templateId, name: e.name, icon: e.icon, tier: e.tier,
      price: TIER_BASE[e.tier - 1] * 8, minLevel: TIER_MIN_LEVEL[e.tier - 1], info: stats });
  });
  Object.entries(BACKPACK_PRICES).forEach(([key, price]) => {
    const bp = BACKPACKS[key];
    const bonus = [bp.xpBonus && `+${Math.round(bp.xpBonus * 100)}% XP`, bp.dropBonus && `+${Math.round(bp.dropBonus * 100)}% drops`, bp.rareDropBonus && `+${Math.round(bp.rareDropBonus * 100)}% raridade`].filter(Boolean).join(" · ");
    stock.push({ id: `buy:${bp.templateId}`, kind: "MOCHILA", templateId: key, name: bp.name, icon: "🎒", tier: 1,
      price, minLevel: 1, info: `${bp.slots} espaços${bonus ? " · " + bonus : ""}` });
  });
  return stock;
}

export function buyEntry(char: Character, entry: ShopEntry, qty = 1): { success: boolean; error?: string } {
  if (char.level < entry.minLevel) return { success: false, error: `Requer nível ${entry.minLevel}.` };
  const total = entry.price * qty;
  if (char.gold < total) return { success: false, error: "Ouro insuficiente." };

  if (entry.kind === "POCAO") {
    const potion = makeEquipment(entry.templateId);
    if (!potion) return { success: false, error: "Item indisponível." };
    potion.quantity = qty;
    if (!canAddItem(char.inventory, potion)) return { success: false, error: "Bolsa cheia!" };
    addItem(char.inventory, potion);
  } else if (entry.kind === "MOCHILA") {
    if (BACKPACKS[entry.templateId].slots <= char.inventory.backpack.slots) return { success: false, error: "Você já tem uma mochila igual ou melhor." };
    const bp = makeBackpack(entry.templateId, 1);
    if (!bp || !addItem(char.inventory, bp)) return { success: false, error: "Bolsa cheia!" };
  } else {
    for (let i = 0; i < qty; i++) {
      const item = makeEquipment(entry.templateId, "COMUM");
      if (!item || !addItem(char.inventory, item)) return { success: false, error: "Bolsa cheia!" };
    }
  }
  char.gold -= total;
  return { success: true };
}