import { Character, Item } from "../types";
import { addItem, removeItem, getUsedSlots } from "./inventory";
import { recalcStats } from "./stats";

export function getDepotUsedSlots(char: Character): number {
  return char.depot?.length || 0;
}

export function depositItem(char: Character, uid: string): { success: boolean; error?: string } {
  if (!char.depot) char.depot = [];
  if (!char.depotMax) char.depotMax = 300;

  const item = char.inventory.items.find(i => i.uid === uid);
  if (!item) return { success: false, error: "Item não encontrado na Backpack." };
  if (getDepotUsedSlots(char) >= char.depotMax) return { success: false, error: "O Depot está cheio!" };

  removeItem(char.inventory, uid, item.quantity);
  char.depot.push({ ...item });
  
  // Se o item estava equipado (por segurança), desequipa
  for (const [slot, eq] of Object.entries(char.equipped)) {
    if (eq && eq.uid === uid) {
      delete char.equipped[slot as keyof typeof char.equipped];
    }
  }
  
  recalcStats(char);
  return { success: true };
}

export function withdrawItem(char: Character, uid: string): { success: boolean; error?: string } {
  const item = char.depot.find(i => i.uid === uid);
  if (!item) return { success: false, error: "Item não encontrado no Depot." };
  if (getUsedSlots(char.inventory) >= char.inventory.backpack.slots) {
    return { success: false, error: "Sua Backpack está cheia!" };
  }

  char.depot = char.depot.filter(i => i.uid !== uid);
  addItem(char.inventory, item);
  recalcStats(char);
  return { success: true };
}