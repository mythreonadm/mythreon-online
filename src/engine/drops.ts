import { Affix, Character, Enemy, Item, ItemStats, Rarity, Zone, Law } from "../types";
import { ALL_COMPONENTS } from "../data/components";
import { ALL_EQUIPMENT_TEMPLATES, ALL_ITEM_TEMPLATES, UNIQUE_TEMPLATES, createItem } from "../data/items";
import { BACKPACKS } from "../data/backpacks";
import { generateId } from "../utils/id";

export const RARITY_ORDER: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
export const RARITY_MULT: Record<Rarity, number> = { COMUM: 1.0, INCOMUM: 1.3, RARO: 1.7, EPICO: 2.2, LENDARIO: 3.0 };
const AFFIX_COUNT: Record<Rarity, number> = { COMUM: 0, INCOMUM: 0, RARO: 1, EPICO: 2, LENDARIO: 3 };

export function rollRarity(bonus = 0): Rarity {
  const r = Math.random() / (1 + bonus);
  if (r < 0.01) return "LENDARIO"; if (r < 0.05) return "EPICO"; if (r < 0.15) return "RARO"; if (r < 0.40) return "INCOMUM"; return "COMUM";
}

interface AffixDef { stat: keyof ItemStats; law: Law; base: number; perTier: number; round?: number; }
const AFFIX_POOL: Record<string, AffixDef[]> = {
  ARMA: [{ stat: "atk", law: "RAAN", base: 2, perTier: 5 }, { stat: "matk", law: "KAELOR", base: 2, perTier: 5 }, { stat: "crit", law: "VORO", base: 0.02, perTier: 0.01, round: 100 }, { stat: "hit", law: "LOGHIS", base: 0.01, perTier: 0.01, round: 100 }, { stat: "spd", law: "RAAN", base: 0.02, perTier: 0.01, round: 100 }],
  ARMADURA: [{ stat: "hp", law: "LYSS", base: 10, perTier: 30 }, { stat: "arm", law: "DHOR", base: 2, perTier: 6 }, { stat: "dge", law: "NOCTHAR", base: 0.01, perTier: 0.01, round: 100 }, { stat: "resFisico", law: "DHOR", base: 0.01, perTier: 0.01, round: 100 }, { stat: "resMagico", law: "VEYRA", base: 0.01, perTier: 0.01, round: 100 }],
  JOIA: [{ stat: "hp", law: "LYSS", base: 10, perTier: 30 }, { stat: "mp", law: "ASTER", base: 5, perTier: 15 }, { stat: "atk", law: "RAAN", base: 2, perTier: 4 }, { stat: "matk", law: "KAELOR", base: 2, perTier: 4 }, { stat: "crit", law: "VORO", base: 0.02, perTier: 0.01, round: 100 }],
  ESCUDO: [{ stat: "arm", law: "DHOR", base: 2, perTier: 5 }, { stat: "blk", law: "DHOR", base: 0.01, perTier: 0.01, round: 100 }, { stat: "resMagico", law: "VEYRA", base: 0.01, perTier: 0.01, round: 100 }, { stat: "hp", law: "LYSS", base: 10, perTier: 30 }],
};

function rollAffixes(category: string, tier: number, count: number): Affix[] {
  const pool = AFFIX_POOL[category];
  if (!pool || count <= 0) return [];
  const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
  return chosen.map((d) => {
    const raw = d.base + d.perTier * (tier - 1) * (0.8 + Math.random() * 0.4);
    const value = d.round ? Math.round(raw * d.round) / d.round : Math.max(1, Math.round(raw));
    return { law: d.law, stat: d.stat, value };
  });
}

export function makeEquipment(templateId: string, rarity: Rarity = "COMUM"): Item | null {
  const base = ALL_ITEM_TEMPLATES[templateId];
  if (!base) return null;
  if (UNIQUE_TEMPLATES[templateId] || base.category === "POCAO") return { ...base, uid: generateId(), stats: { ...base.stats } };
  const mult = RARITY_MULT[rarity];
  const stats: any = {};
  for (const [k, v] of Object.entries(base.stats)) stats[k] = Math.round((v as number) * mult * 100) / 100;
  return { ...base, uid: generateId(), rarity, stats, affixes: rollAffixes(base.category, base.tier, AFFIX_COUNT[rarity]) };
}

export function makeComponent(templateId: string): Item {
  const t = ALL_COMPONENTS[templateId];
  // PROTEÇÃO: Se o ID não existir, retorna um item vazio para não quebrar o jogo
  if (!t) {
    console.error(`Componente não encontrado: ${templateId}`);
    return createItem({ templateId: "ERRO", name: "Item Desconhecido", category: "MATERIAL", tier: 1, icon: "❓" });
  }
  return createItem({ templateId: t.id, name: t.name, category: "COMPONENTE", tier: 1, componentType: t.type, law: t.law, icon: t.icon, stackable: true, maxStack: 100, quantity: 1 });
}

export function makeBackpack(key: string, tier: 1 | 2 | 3 | 4 | 5 = 1): Item | null {
  const bp = BACKPACKS[key];
  if (!bp) return null;
  return createItem({ templateId: bp.templateId, name: bp.name, category: "BACKPACK", slot: "BACKPACK", tier, icon: "🎒", slots: bp.slots, dropBonus: bp.dropBonus, rareDropBonus: bp.rareDropBonus, xpBonus: bp.xpBonus });
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

  if (chance(enemy.isBoss ? 0.5 : 0.06)) {
    const p = makeEquipment(`POCAO_VIDA_${zone.tier}`);
    if (p) drops.push(p);
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