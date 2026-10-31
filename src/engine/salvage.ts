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

/**
 * FIX N1: antes iterávamos `char.inventory.items` enquanto `salvageItem` fazia `splice`
 * no mesmo array — o iterador pulava o próximo elemento e o item se perdia.
 *
 * Nova abordagem (3 etapas, sem mutar o array durante o for):
 *  1) Decide `toSalvage` vs `keep`.
 *  2) Substitui `char.inventory.items = keep`.
 *  3) Adiciona fragmentos DEPOIS da substituição (senão eles seriam apagados junto).
 */
export function salvageAllEquipment(char: Character, maxRarity: Rarity): { items: number, frags: number } {
  const limit = RARITY_ORDER.indexOf(maxRarity);
  const fragCounts: Record<string, number> = {};
  const keep: Item[] = [];
  let salvagedCount = 0;

  // Etapa 1 — decidir sem mutar
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

  // Etapa 2 — trocar o array ANTES de adicionar fragmentos
  char.inventory.items = keep;

  // Etapa 3 — adicionar fragmentos (agora eles não serão apagados)
  let fragsGained = 0;
  for (const [fragmentId, total] of Object.entries(fragCounts)) {
    const frag = { ...FRAGMENT_TEMPLATES[fragmentId], quantity: total };
    addItem(char.inventory, frag);
    fragsGained += total;
  }

  return { items: salvagedCount, frags: fragsGained };
}