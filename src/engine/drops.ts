import { BALANCE, clamp } from "../data/balance";
import { Affix, Character, Enemy, Item, ItemStats, Rarity, Zone, Law } from "../types";
import { ALL_COMPONENTS } from "../data/components";
import { ALL_EQUIPMENT_TEMPLATES, ALL_ITEM_TEMPLATES, ARROW_TEMPLATES, UNIQUE_TEMPLATES, createItem } from "../data/items";
import { BACKPACKS } from "../data/backpacks";
import { generateId } from "../utils/id";
import { getPoolForCategory, AffixPoolDef, PERCENT_AFFIX_RANGES } from "../data/affixes";
import { ELEMENTS } from "../data/elementalChart";

export const RARITY_ORDER: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
export const RARITY_MULT: Record<Rarity, number> = { COMUM: 1.0, INCOMUM: 1.3, RARO: 1.7, EPICO: 2.2, LENDARIO: 3.0 };
const ZONE_BACKPACK_DROPS: Record<number, string> = { 1: "OLD", 2: "COURO", 3: "REFORCADA", 4: "EXPLORADOR", 5: "ARCANA" };
const AFFIX_COUNT: Record<Rarity, number> = { COMUM: 1, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 4 };
const FLAT_AFFIX_MULT: Record<Rarity, number> = { COMUM: 0.8, INCOMUM: 1, RARO: 1.35, EPICO: 1.75, LENDARIO: 2.2 };

export function rollRarity(bonus = 0): Rarity {
  const r = Math.random() / (1 + clamp(bonus, 0, 1));
  if (r < 0.002) return "LENDARIO"; if (r < 0.02) return "EPICO"; if (r < 0.10) return "RARO"; if (r < 0.35) return "INCOMUM"; return "COMUM";
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

    // Percentuais usam faixas explícitas por raridade; valores inteiros escalam
    // suavemente por tier e raridade para não tornar um afixo raro obrigatório.
    const tierMult = selected.isPercent ? 1 + (tier - 1) * 0.12 : 1 + (tier - 1) * 0.35;
    const rarityRange = selected.isPercent ? PERCENT_AFFIX_RANGES[rarity]?.[selected.stat] : undefined;
    const min = rarityRange?.[0] ?? selected.minBase;
    const max = rarityRange?.[1] ?? selected.maxBase;
    const rawValue = (min + Math.random() * (max - min)) * tierMult * (selected.isPercent ? 1 : FLAT_AFFIX_MULT[rarity]);
    
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

  const elementalChance: Partial<Record<Rarity, number>> = { COMUM: 0, INCOMUM: 0.35, RARO: 0.60, EPICO: 0.80, LENDARIO: 1 };
  const getsElement = base.category === "ARMA" && Math.random() < (elementalChance[rarity] ?? 0);
  const element = getsElement ? ELEMENTS.filter(item => item.id !== "BASE")[Math.floor(Math.random() * 11)].id : undefined;
  const elementalDamagePct = getsElement ? ({ INCOMUM: 0.08, RARO: 0.12, EPICO: 0.16, LENDARIO: 0.20 } as Partial<Record<Rarity, number>>)[rarity] : undefined;
  return { ...base, uid: generateId(), rarity, stats, affixes, upgradeLevel: 0, element, elementalDamagePct };
}

export function makeComponent(templateId: string): Item {
  const t = ALL_COMPONENTS[templateId];
  return createItem({ templateId: t.id, name: t.name, category: "COMPONENTE", tier: 1, componentType: t.type, law: t.law, icon: t.icon, stackable: true, maxStack: 999, quantity: 1, upgradeLevel: 0 });
}

export function makeMaterial(templateId: string): Item | null {
  const t = ALL_ITEM_TEMPLATES[templateId];
  if (!t || t.category !== "MATERIAL") return null;
  return { ...t, uid: generateId(), stats: { ...t.stats }, quantity: 1, upgradeLevel: 0 };
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
  const chance = (p: number) => mods.force || Math.random() < Math.min(1, p * (1 + clamp(mods.dropBonus, 0, 1)));

  // Componentes e essências são a progressão das Matrizes: mobs comuns não devem
  // completar uma build em poucos minutos. Chefes mantêm a taxa integral.
  const progressionScale = enemy.isBoss ? 1 : 0.68;
  if (chance(enemy.componentChance * progressionScale)) drops.push(makeComponent(enemy.componentId));
  if (enemy.essenceId && chance((enemy.essenceChance ?? 0) * (enemy.isBoss ? 1 : 0.58))) drops.push(makeComponent(enemy.essenceId));
  if (enemy.materialDropId && chance(enemy.materialChance ?? 0.35)) {
    const material = makeMaterial(enemy.materialDropId);
    if (material) drops.push(material);
  }

  if (chance(enemy.isBoss ? 0.25 : 0.08)) {
    const arrow = ARROW_TEMPLATES[`FLECHA_T${zone.tier}`];
    if (arrow) drops.push({ ...arrow, uid: generateId(), quantity: 1 });
  }

  if (chance(enemy.isBoss ? BALANCE.bossEquipmentDrop : BALANCE.equipmentDrop)) {
    const pool = enemy.equipmentDropIds?.length
      ? enemy.equipmentDropIds.map(id => ALL_EQUIPMENT_TEMPLATES[id]).filter(Boolean)
      : Object.values(ALL_EQUIPMENT_TEMPLATES).filter((t) => t.tier === zone.tier);
    if (pool.length > 0) {
      const base = pool[Math.floor(Math.random() * pool.length)];
      const eq = makeEquipment(base.templateId, rollRarity(mods.rareBonus + (enemy.isBoss ? 0.5 : 0)));
      if (eq) drops.push(eq);
    }
  }

  // Bolsas são drops de progressão: chefes mantêm as chances configuradas;
  // encontros Elite e criaturas de 3+ estrelas também podem revelar a bolsa
  // regional, para que ela não fique presa a um único boss.
  const regionalBackpack = enemy.backpackDrop ?? ((enemy.isBoss || enemy.isElite || enemy.difficulty >= 3) ? ZONE_BACKPACK_DROPS[zone.tier] : undefined);
  const regionalBackpackChance = enemy.backpackChance ?? (enemy.isBoss ? 0.08 : enemy.isElite ? 0.04 : enemy.difficulty >= 3 ? 0.012 : 0);
  if (regionalBackpack && chance(regionalBackpackChance)) {
    const bp = makeBackpack(regionalBackpack, zone.tier);
    if (bp) drops.push(bp);
  }

  if (enemy.uniqueDropId && chance(enemy.uniqueDropChance ?? 0)) {
    const u = makeEquipment(enemy.uniqueDropId);
    if (u) drops.push(u);
  }
  if (enemy.protectionRingChance && chance(enemy.protectionRingChance)) {
    const ring = makeEquipment("UNICO_ANEL_GUARDIA");
    if (ring) drops.push(ring);
  }
  return drops;
}
