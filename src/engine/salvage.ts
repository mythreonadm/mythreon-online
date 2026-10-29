import { Character, Item, Rarity } from "../types";
import { addItem, removeItem } from "./inventory";
import { RARITY_ORDER } from "./drops";
import { FRAGMENT_TEMPLATES } from "../data/items";

export function salvageItem(char: Character, item: Item): number {
  if (item.category === "COMPONENTE" || item.category === "FRAGMENTO" || item.category === "POCAO") return 0;

  let fragmentId = "FRAGMENTO_COMUM";
  let amount = 1;

  if (item.rarity === "RARO") { fragmentId = "FRAGMENTO_RARO"; amount = 2; }
  else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") { fragmentId = "FRAGMENTO_EPICO"; amount = 3; }

  const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: amount };
  addItem(char.inventory, frag);

  removeItem(char.inventory, item.uid, 1);

  return amount;
}

export function salvageAllEquipment(char: Character, maxRarity: Rarity): { items: number, frags: number } {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  let salvagedCount = 0;
  let fragsGained = 0;
  const keep: Item[] = [];

  for (const item of char.inventory.items) {
    const isEquip = ["ARMA", "ARMADURA", "JOIA", "ESCUDO"].includes(item.category);
    const canSalvage = isEquip && item.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(item.rarity) <= limit;
    
    if (canSalvage) {
      const f = salvageItem(char, item);
      salvagedCount += item.quantity;
      fragsGained += f * item.quantity;
    } else {
      keep.push(item);
    }
  }
  char.inventory.items = keep;
  return { items: salvagedCount, frags: fragsGained };
}