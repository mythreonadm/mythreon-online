import { ItemStats, ItemCategory } from "../types";

export interface AffixPoolDef {
  stat: keyof ItemStats;
  minBase: number;
  maxBase: number;
  isPercent: boolean;
  weight: number;
}

/** Faixas percentuais por raridade. Os valores são armazenados como fração (0.01 = 1%). */
export const PERCENT_AFFIX_RANGES: Record<string, Record<string, [number, number]>> = {
  COMUM: { crit: [.005, .015], critDmg: [.05, .10], hit: [.005, .015], spd: [.005, .015], luck: [.005, .015], dge: [.005, .015], blk: [.005, .015], resFisico: [.005, .015], resMagico: [.005, .015] },
  INCOMUM: { crit: [.012, .025], critDmg: [.08, .15], hit: [.012, .025], spd: [.012, .025], luck: [.012, .025], dge: [.012, .025], blk: [.012, .025], resFisico: [.012, .025], resMagico: [.012, .025] },
  RARO: { crit: [.020, .040], critDmg: [.12, .22], hit: [.020, .040], spd: [.020, .040], luck: [.020, .040], dge: [.020, .040], blk: [.020, .040], resFisico: [.020, .040], resMagico: [.020, .040] },
  EPICO: { crit: [.035, .060], critDmg: [.18, .30], hit: [.035, .060], spd: [.035, .060], luck: [.035, .060], dge: [.035, .060], blk: [.035, .060], resFisico: [.035, .060], resMagico: [.035, .060] },
  LENDARIO: { crit: [.055, .090], critDmg: [.25, .40], hit: [.055, .090], spd: [.055, .090], luck: [.055, .090], dge: [.055, .090], blk: [.055, .090], resFisico: [.055, .090], resMagico: [.055, .090] },
};

// Armas: Foco em dano, crítico e velocidade. Sem resistências.
export const WEAPON_AFFIXES: AffixPoolDef[] = [
  { stat: "atk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "matk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "crit", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "critDmg", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "hit", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "spd", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "luck", minBase: 0, maxBase: 0, isPercent: true, weight: 10 }, // Sorte = chance de drop raro
];

// Armaduras (Capacete, Peitoral, Calças, Botas, Luvas): Foco em defesa, vida e regeneração. Sem ATK.
export const ARMOR_AFFIXES: AffixPoolDef[] = [
  { stat: "hp", minBase: 10, maxBase: 30, isPercent: false, weight: 20 },
  { stat: "arm", minBase: 1, maxBase: 3, isPercent: false, weight: 20 },
  { stat: "def", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "hpRegen", minBase: 1, maxBase: 5, isPercent: false, weight: 15 },
  { stat: "resFisico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "dge", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
];

// Escudos: Defesa pesada e bloqueio.
export const SHIELD_AFFIXES: AffixPoolDef[] = [
  { stat: "arm", minBase: 2, maxBase: 6, isPercent: false, weight: 30 },
  { stat: "blk", minBase: 0, maxBase: 0, isPercent: true, weight: 30 },
  { stat: "hp", minBase: 10, maxBase: 20, isPercent: false, weight: 20 },
  { stat: "resFisico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0, maxBase: 0, isPercent: true, weight: 10 },
];

// Joias: Stats mistos, regeneração e sorte.
export const JEWELRY_AFFIXES: AffixPoolDef[] = [
  { stat: "hp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mpRegen", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "crit", minBase: 0, maxBase: 0, isPercent: true, weight: 15 },
  { stat: "atk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "matk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "luck", minBase: 0, maxBase: 0, isPercent: true, weight: 20 },
];

export function getPoolForCategory(category: ItemCategory): AffixPoolDef[] {
  switch (category) {
    case "ARMA": return WEAPON_AFFIXES;
    case "ARMADURA": return ARMOR_AFFIXES;
    case "ESCUDO": return SHIELD_AFFIXES;
    case "JOIA": return JEWELRY_AFFIXES;
    case "PULSEIRA": return JEWELRY_AFFIXES;
    default: return [];
  }
}

// Helper para formatar o nome do atributo na UI
export const STAT_NAMES: Record<string, string> = {
  atk: "Ataque", matk: "Atq. Mágico", def: "Defesa", arm: "Armadura",
  hp: "Vida", mp: "Mana", spd: "Velocidade", crit: "Crítico",
  hit: "Precisão", dge: "Esquiva", blk: "Bloqueio",
  resFisico: "Res. Física", resMagico: "Res. Mágica",
  hpRegen: "Regen. Vida", mpRegen: "Regen. Mana",
  luck: "Sorte", critDmg: "Dano Crítico"
};
