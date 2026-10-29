import { Character, Inventory, Item, SlotType } from "../types";
import { recalcStats } from "./stats";
import { DEFAULT_BACKPACK } from "../data/backpacks";

export function getUsedSlots(inv: Inventory): number { return inv.items.length; }

export function canAddItem(inv: Inventory, item: Item): boolean {
  if (item.stackable) {
    const existing = inv.items.find(i => i.templateId === item.templateId && i.quantity < i.maxStack);
    if (existing) return true;
  }
  return getUsedSlots(inv) < inv.backpack.slots;
}

export function addItem(inv: Inventory, item: Item): boolean {
  if (item.stackable) {
    let remaining = item.quantity;
    for (const existing of inv.items) {
      if (existing.templateId !== item.templateId || existing.quantity >= existing.maxStack) continue;
      const add = Math.min(existing.maxStack - existing.quantity, remaining);
      existing.quantity += add;
      remaining -= add;
      if (remaining === 0) return true;
    }
    if (remaining < item.quantity) item = { ...item, quantity: remaining };
  }
  if (getUsedSlots(inv) >= inv.backpack.slots) return false;
  inv.items.push({ ...item, uid: item.uid || Math.random().toString() });
  return true;
}

export function removeItem(inv: Inventory, uid: string, qty = 1): boolean {
  const idx = inv.items.findIndex((i) => i.uid === uid);
  if (idx === -1) return false;
  if (inv.items[idx].stackable && inv.items[idx].quantity > qty) inv.items[idx].quantity -= qty;
  else inv.items.splice(idx, 1);
  return true;
}

export function countByTemplate(inv: Inventory, templateId: string): number {
  return inv.items.filter((i) => i.templateId === templateId).reduce((n, i) => n + i.quantity, 0);
}

function equipBackpack(char: Character, item: Item): { success: boolean; error?: string } {
  const current = char.inventory.backpack;
  if ((item.slots ?? 0) <= current.slots) return { success: false, error: "Você já usa uma mochila igual ou melhor." };
  const prev = char.equipped.BACKPACK;
  removeItem(char.inventory, item.uid);
  if (prev) addItem(char.inventory, prev);
  char.inventory.backpack = { templateId: item.templateId, name: item.name, slots: item.slots ?? current.slots, dropBonus: item.dropBonus ?? 0, rareDropBonus: item.rareDropBonus ?? 0, xpBonus: item.xpBonus ?? 0 };
  char.equipped.BACKPACK = item;
  return { success: true };
}

export function equipItem(char: Character, itemUid: string): { success: boolean; error?: string } {
  const item = char.inventory.items.find((i) => i.uid === itemUid);
  if (!item || !item.slot) return { success: false, error: "Item inválido" };
  if (item.slot === "BACKPACK") return equipBackpack(char, item);
  let slot: SlotType = item.slot;
  if (slot === "ANEL_I" && char.equipped.ANEL_I && !char.equipped.ANEL_II) slot = "ANEL_II";
  const current = char.equipped[slot];
  if (current) {
    if (!canAddItem(char.inventory, current)) return { success: false, error: "Bolsa cheia! Jogue algo fora antes de trocar." };
    addItem(char.inventory, current);
  }
  removeItem(char.inventory, itemUid);
  char.equipped[slot] = item;
  recalcStats(char);
  return { success: true };
}

export function unequipItem(char: Character, slot: SlotType): { success: boolean; error?: string } {
  const item = char.equipped[slot];
  if (!item) return { success: false, error: "Nenhum item equipado" };
  if (slot === "BACKPACK") {
    if (getUsedSlots(char.inventory) + 1 > DEFAULT_BACKPACK.slots) return { success: false, error: "Esvazie a bolsa para voltar à mochila padrão." };
    addItem(char.inventory, item);
    char.inventory.backpack = { ...DEFAULT_BACKPACK };
    delete char.equipped[slot];
    return { success: true };
  }
  if (!canAddItem(char.inventory, item)) return { success: false, error: "Bolsa cheia! Libere espaço." };
  addItem(char.inventory, item);
  delete char.equipped[slot];
  recalcStats(char);
  return { success: true };
}