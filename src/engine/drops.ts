import { Affix, Character, Enemy, Item, ItemStats, Rarity, Zone, Law } from "../types";
import { ALL_COMPONENTS } from "../data/components";
import { ALL_EQUIPMENT_TEMPLATES, ALL_ITEM_TEMPLATES, UNIQUE_TEMPLATES, createItem } from "../data/items";
import { BACKPACKS } from "../data/backpacks";
import { generateId } from "../utils/id";
import { getPoolForCategory, AffixPoolDef } from "../data/affixes";

export const RARITY_ORDER: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
export const RARITY_MULT: Record<Rarity, number> = { COMUM: 1.0, INCOMUM: 1.3, RARO: 1.7, EPICO: 2.2, LENDARIO: 3.0 };
const AFFIX_COUNT: Record<Rarity, number> = { COMUM: 0, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 3 };

export function rollRarity(bonus = 0): Rarity {
  const r = Math.random() / (1 + bonus);
  if (r < 0.01) return "LENDARIO"; if (r < 0.05) return "EPICO"; if (r < 0.15) return "RARO"; if (r < 0.40) return "INCOMUM"; return "COMUM";
}

// ESSA É A FUNÇÃO QUE ESTAVA FALTANDO O EXPORT
export function generateRandomAffixes(category: string, rarity: Rarity, tier: number): Affix[] {
  const pool = getPoolForCategory(category as any);
  if (!pool || pool.length === 0) return [];
  
  const count = AFFIX_COUNT[rarity];
  if (count === 0) return [];

  const chosen: Affix[] = [];
  const usedStats = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Filtra os que já foram escolhidos para não repetir o mesmo stat
    const available = pool.filter(p => !usedStats.has(p.stat));
    if (available.length === 0) break;

    // Sorteio ponderado
    const totalWeight = available.reduce((acc, p) => acc + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let selected = available[0];

    for (const p of available) {
      rand -= p.weight;
      if (rand <= 0) { selected = p; break; }
    }

    usedStats.add(selected.stat);

    // Valor base escalado pelo Tier
    const tierMult = 1 + (tier - 1) * 0.5;
    const rawValue = (selected.minBase + Math.random() * (selected.maxBase - selected.minBase)) * tierMult;
    
    // Arredonda dependendo do tipo (percentual ou número inteiro)
    const value = selected.isPercent ? Math.round(rawValue * 100) / 100 : Math.round(rawValue);

    chosen.push({
      law: "PRIME", 
      stat: selected.stat,
      value
    });
  }

  return chosen;
}

export function makeEquipment(templateId: string, rarity: Rarity = "COMUM"): Item | null {
  const base = ALL_ITEM_TEMPLATES[templateId];
  if (!base) return null;
  
  if (UNIQUE_TEMPLATES[templateId] || base.category === "POCAO") {
    return { ...base, uid: generateId(), stats: { ...base.stats }, upgradeLevel: 0 };
  }

  const mult = RARITY_MULT[rarity];
  const stats: any = {};
  for (const [k, v] of Object.entries(base.stats)) stats[k] = Math.round((v as number) * mult * 100) / 100;
  
  const affixes = generateRandomAffixes(base.category, rarity, base.tier);

  return { ...base, uid: generateId(), rarity, stats, affixes, upgradeLevel: 0 };
}

export function makeComponent(templateId: string): Item {
  const t = ALL_COMPONENTS[templateId];
  return createItem({ templateId: t.id, name: t.name, category: "COMPONENTE", tier: 1, componentType: t.type, law: t.law, icon: t.icon, stackable: true, maxStack: 999, quantity: 1, upgradeLevel: 0 });
}

export function makeBackpack(key: string, tier: 1 | 2 | 3 | 4 | 5 = 1): Item | null {
  const bp = BACKPACKS[key];
  if (!bp) return null;
  return createItem({ templateId: bp.templateId, name: bp.name, category: "BACKPACK", slot: "BACKPACK", tier, icon: "🎒", slots: bp.slots, dropBonus: bp.dropBonus, rareDropBonus: bp.rareDropBonus, xpBonus: bp.xpBonus, upgradeLevel: 0 });
}

export function rollAmbient(zone: Zone): Item {
  const pool = zone.ambientPool && zone.ambientPool.length ? zone.ambientPool : [zone.ambientDrop];
  return makeComponent(pool[Math.floor(Math.random() * pool.length)]);
}

export interface DropMods { dropBonus: number; rareBonus: number; force?: boolean; }

export function rollDrops(enemy: Enemy, zone: Zone, _char: Character, mods: DropMods = { dropBonus: 0, rareBonus: 0 }): Item[] {
  const drops: Item[] = [];
  const chance = (p: number) => mods.force || Math.random() < Math.min(1, p * (1 + mods.dropBonus));

  if (chance(enemy.componentChance)) drops.push(makeComponent(enemy.componentId));
  if (enemy.essenceId && chance(enemy.essenceChance ?? 0)) drops.push(makeComponent(enemy.essenceId));

  if (chance(enemy.isBoss ? 0.6 : 0.15)) {
    const pool = Object.values(ALL_EQUIPMENT_TEMPLATES).filter((t) => t.tier === zone.tier);
    if (pool.length > 0) {
      const base = pool[Math.floor(Math.random() * pool.length)];
      const eq = makeEquipment(base.templateId, rollRarity(mods.rareBonus + (enemy.isBoss ? 0.5 : 0)));
      if (eq) drops.push(eq);
    }
  }

  if (enemy.backpackDrop && chance(enemy.backpackChance ?? 0)) {
    const bp = makeBackpack(enemy.backpackDrop, zone.tier);
    if (bp) drops.push(bp);
  }

  if (enemy.uniqueDropId && chance(enemy.uniqueDropChance ?? 0)) {
    const u = makeEquipment(enemy.uniqueDropId);
    if (u) drops.push(u);
  }
  return drops;
}
