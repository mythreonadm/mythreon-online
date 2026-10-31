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

// FIX N1: Evita que itens sumam ao iterar e dar splice no mesmo array
export function salvageAllEquipment(char: Character, maxRarity: Rarity): { items: number, frags: number } {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  const fragCounts: Record<string, number> = {};
  const keep: Item[] = [];
  let salvagedCount = 0;

  for (const item of char.inventory.items) {
    const isEquip = ["ARMA", "ARMADURA", "JOIA", "ESCUDO"].includes(item.category);
    const canSalvage = isEquip && item.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(item.rarity) <= limit;
    
    if (!canSalvage) { keep.push(item); continue; }

    let fragmentId = "FRAGMENTO_COMUM";
    let amount = 1;
    if (item.rarity === "RARO") { fragmentId = "FRAGMENTO_RARO"; amount = 2; }
    else if (item.rarity === "EPICO" || item.rarity === "LENDARIO") { fragmentId = "FRAGMENTO_EPICO"; amount = 3; }

    fragCounts[fragmentId] = (fragCounts[fragmentId] || 0) + amount * item.quantity;
    salvagedCount += item.quantity;
  }

  char.inventory.items = keep;

  let fragsGained = 0;
  for (const [fragmentId, total] of Object.entries(fragCounts)) {
    const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: total };
    addItem(char.inventory, frag);
    fragsGained += total;
  }

  return { items: salvagedCount, frags: fragsGained };
}

export function salvageSelectedEquipment(char: Character, uids: string[]): { items: number, frags: number } {
  const selected = new Set(uids);
  const chosen = char.inventory.items.filter(item => selected.has(item.uid) && ["ARMA", "ARMADURA", "JOIA", "ESCUDO"].includes(item.category));
  let items = 0;
  let frags = 0;
  for (const item of chosen) {
    const quantity = item.quantity;
    for (let count = 0; count < quantity; count++) {
      const current = char.inventory.items.find(candidate => candidate.uid === item.uid);
      if (!current) break;
      const amount = salvageItem(char, current);
      if (amount > 0) { items += 1; frags += amount; }
    }
  }
  return { items, frags };
}
