import { Character, Item, ItemStats, SlotType } from "../types";

// Pesos de comparação de itens (score)
// Atributos brutos valem 1 ponto por unidade. Percentuais valem peso fixo por 1.0 (i.e. 1% = 0.01 * peso).
// HP vale 0.3, MP 0.1
export const STAT_WEIGHTS: Record<keyof ItemStats, number> = {
  atk: 1, matk: 1, def: 1, arm: 1,
  hp: 0.3, mp: 0.1,
  crit: 4, critDmg: 4, hit: 4, dge: 4, blk: 4,
  spd: 2, resFisico: 3, resMagico: 3,
  hpRegen: 2, mpRegen: 2, luck: 5,
};

export function getItemScore(item?: Item | null): number {
  if (!item) return 0;
  let score = 0;
  for (const [k, v] of Object.entries(item.stats)) {
    if (typeof v === "number") score += v * (STAT_WEIGHTS[k as keyof ItemStats] ?? 1);
  }
  for (const affix of item.affixes ?? []) {
    score += affix.value * (STAT_WEIGHTS[affix.stat] ?? 1);
  }
  // +10% por nível de upgrade
  score *= 1 + (item.upgradeLevel ?? 0) * 0.1;
  return score;
}

// Replica a lógica atual de equipItem para decidir qual slot será alvo
// (Anéis: preenche vazios antes de substituir; se ambos cheios, substitui ANEL_I)
export function getBestTargetSlot(char: Character, item: Item): SlotType | undefined {
  if (!item.slot) return undefined;
  if (item.slot !== "ANEL_I") return item.slot;
  if (!char.equipped.ANEL_I) return "ANEL_I";
  if (!char.equipped.ANEL_II) return "ANEL_II";
  return "ANEL_I";
}

export function getEquippedForTarget(char: Character, item: Item): Item | undefined {
  const slot = getBestTargetSlot(char, item);
  return slot ? char.equipped[slot] : undefined;
}

export function isUpgrade(item: Item, char: Character): boolean {
  const slot = getBestTargetSlot(char, item);
  if (!slot) return false;
  const equipped = char.equipped[slot];
  return getItemScore(item) > getItemScore(equipped);
}