import { ItemStats, ItemCategory } from "../types";

export interface AffixPoolDef {
  stat: keyof ItemStats;
  minBase: number;
  maxBase: number;
  isPercent: boolean;
  weight: number;
}

// Armas: Foco em dano, crítico e velocidade. Sem resistências.
export const WEAPON_AFFIXES: AffixPoolDef[] = [
  { stat: "atk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "matk", minBase: 2, maxBase: 5, isPercent: false, weight: 20 },
  { stat: "crit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 15 },
  { stat: "critDmg", minBase: 0.05, maxBase: 0.10, isPercent: true, weight: 15 },
  { stat: "hit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 10 },
  { stat: "spd", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "luck", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 }, // Lucky = chance de drop raro
];

// Armaduras (Capacete, Peitoral, Calças, Botas, Luvas): Foco em defesa, vida e regeneração. Sem ATK.
export const ARMOR_AFFIXES: AffixPoolDef[] = [
  { stat: "hp", minBase: 10, maxBase: 30, isPercent: false, weight: 20 },
  { stat: "arm", minBase: 1, maxBase: 3, isPercent: false, weight: 20 },
  { stat: "def", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "hpRegen", minBase: 1, maxBase: 5, isPercent: false, weight: 15 },
  { stat: "resFisico", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 10 },
  { stat: "dge", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 10 },
];

// Escudos: Defesa pesada e bloqueio.
export const SHIELD_AFFIXES: AffixPoolDef[] = [
  { stat: "arm", minBase: 2, maxBase: 6, isPercent: false, weight: 30 },
  { stat: "blk", minBase: 0.01, maxBase: 0.03, isPercent: true, weight: 30 },
  { stat: "hp", minBase: 10, maxBase: 20, isPercent: false, weight: 20 },
  { stat: "resFisico", minBase: 0.02, maxBase: 0.04, isPercent: true, weight: 10 },
  { stat: "resMagico", minBase: 0.02, maxBase: 0.04, isPercent: true, weight: 10 },
];

// Joias: Stats mistos, regeneração e sorte.
export const JEWELRY_AFFIXES: AffixPoolDef[] = [
  { stat: "hp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mp", minBase: 5, maxBase: 20, isPercent: false, weight: 15 },
  { stat: "mpRegen", minBase: 1, maxBase: 3, isPercent: false, weight: 15 },
  { stat: "crit", minBase: 0.01, maxBase: 0.02, isPercent: true, weight: 15 },
  { stat: "atk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "matk", minBase: 1, maxBase: 3, isPercent: false, weight: 10 },
  { stat: "luck", minBase: 0.01, maxBase: 0.05, isPercent: true, weight: 20 },
];

export function getPoolForCategory(category: ItemCategory): AffixPoolDef[] {
  switch (category) {
    case "ARMA": return WEAPON_AFFIXES;
    case "ARMADURA": return ARMOR_AFFIXES;
    case "ESCUDO": return SHIELD_AFFIXES;
    case "JOIA": return JEWELRY_AFFIXES;
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