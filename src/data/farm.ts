import { Item } from "../types";

export interface FarmSeed { id: string; name: string; icon: string; growMs: number; yieldId: string; yieldName: string; yieldIcon: string; yieldQty: number; cost: number; }
export const FARM_SEEDS: FarmSeed[] = [
  { id: "SEMENTE_CENOURA", name: "Semente de Cenoura", icon: "🥕", growMs: 5 * 60_000, yieldId: "COLHEITA_CENOURA", yieldName: "Cenoura", yieldIcon: "🥕", yieldQty: 2, cost: 30 },
  { id: "SEMENTE_MELANCIA", name: "Semente de Melancia", icon: "🍉", growMs: 15 * 60_000, yieldId: "COLHEITA_MELANCIA", yieldName: "Melancia", yieldIcon: "🍉", yieldQty: 2, cost: 90 },
  { id: "SEMENTE_TRIGO", name: "Semente de Trigo", icon: "🌾", growMs: 30 * 60_000, yieldId: "COLHEITA_TRIGO", yieldName: "Trigo de Lyss", yieldIcon: "🌾", yieldQty: 3, cost: 160 },
  { id: "SEMENTE_LUMINA", name: "Semente Lumina", icon: "✨", growMs: 60 * 60_000, yieldId: "COLHEITA_LUMINA", yieldName: "Fruto Lumina", yieldIcon: "🔆", yieldQty: 2, cost: 400 },
];
export const farmSeed = (id: string) => FARM_SEEDS.find(seed => seed.id === id);
export function farmYield(seed: FarmSeed): Item { return { uid: `farm-${seed.yieldId}-${Date.now()}-${Math.random()}`, templateId: seed.yieldId, name: seed.yieldName, category: "MATERIAL", tier: 1, rarity: "COMUM", stats: {}, affixes: [], upgradeLevel: 0, stackable: true, maxStack: 999, quantity: seed.yieldQty, icon: seed.yieldIcon }; }
