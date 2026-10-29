import { Character, ItemStats } from "../types";
import { PASSIVE_EFFECTS, SUPPORT_EFFECTS } from "../data/skills";
import { VIALS } from "../data/vials";

export function getBaseStats(level: number): ItemStats {
  // Mais HP e dano base para aguentar o early game
  return { 
    hp: 150 + (level - 1) * 30, 
    mp: 50 + (level - 1) * 15, 
    atk: 15 + Math.floor((level - 1) * 3), 
    matk: 10 + Math.floor((level - 1) * 2), 
    def: 3 + Math.floor((level - 1) * 0.8), 
    arm: 3 + Math.floor((level - 1) * 0.8), 
    spd: 0, crit: 0.05, hit: 0.90, dge: 0.05, blk: 0 
  };
}

export function recalcStats(char: Character): void {
  const base = getBaseStats(char.level);
  const fromGear: any = {};
  const fromRace: any = {};
  const fromVials: any = {};

  for (const slot of Object.keys(char.equipped)) {
    const item = char.equipped[slot as keyof typeof char.equipped];
    if (!item?.stats) continue;
    for (const [k, v] of Object.entries(item.stats)) fromGear[k] = (fromGear[k] || 0) + v;
    for (const affix of item.affixes ?? []) fromGear[affix.stat] = (fromGear[affix.stat] || 0) + affix.value;
  }

  if (char.activeRace && char.activeRace.bonus) {
    for (const [k, v] of Object.entries(char.activeRace.bonus)) fromRace[k] = v;
  }

  const now = Date.now();
  if (char.activeVials) {
    for (const [vialId, expiry] of Object.entries(char.activeVials)) {
      if (expiry > now) {
        const vial = VIALS[vialId];
        if (vial) {
          for (const [k, v] of Object.entries(vial.stats)) fromVials[k] = (fromVials[k] || 0) + v;
        }
      }
    }
  }

  const passive = char.activeRace ? PASSIVE_EFFECTS[char.activeRace.passivaId] : undefined;
  const support = char.activeRace ? SUPPORT_EFFECTS[char.activeRace.suporteId] : undefined;
  const fromPassive: any = passive?.stats ?? {};

  const skills = char.skills || { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  const isUsingBow = char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO");

  const skillAtkBonus = skills.melee * 3;
  const skillDistBonus = isUsingBow ? skills.distance * 3 : 0;
  const skillMatkBonus = skills.magic * 3;
  const skillArmBonus = skills.defense * 2;
  const skillDefBonus = skills.defense * 1;
  const skillHitBonus = isUsingBow ? skills.distance * 0.005 : 0;

  const atkMult = 1 + (support?.permAtkPct ?? 0);
  const armMult = 1 + (passive?.armPct ?? 0) + (support?.permArmPct ?? 0);
  const hpMult = 1 + (passive?.hpPct ?? 0);

  const sum = (k: string) => (fromGear[k] ?? 0) + (fromRace[k] ?? 0) + (fromPassive[k] ?? 0) + (fromVials[k] ?? 0);

  char.baseStats = {
    hp: Math.floor((base.hp! + sum("hp")) * hpMult), mp: base.mp! + sum("mp"),
    atk: Math.floor((base.atk! + sum("atk") + skillAtkBonus + skillDistBonus) * atkMult), 
    matk: base.matk! + sum("matk") + skillMatkBonus,
    def: base.def! + sum("def") + skillDefBonus, 
    arm: Math.floor((base.arm! + sum("arm") + skillArmBonus) * armMult),
    spd: Math.min(base.spd! + sum("spd"), 0.8), 
    crit: Math.min(base.crit! + sum("crit") + (support?.critBonus ?? 0), 0.85),
    hit: Math.min(base.hit! + sum("hit") + (support?.hitBonus ?? 0) + skillHitBonus, 1.0),
    dge: Math.min(base.dge! + sum("dge"), 0.5), 
    blk: Math.min(base.blk! + sum("blk"), 0.5),
    resFisico: Math.min(sum("resFisico"), 0.5), resMagico: Math.min(sum("resMagico"), 0.5),
  };
  char.hpMax = char.baseStats.hp!; char.mpMax = char.baseStats.mp!;
  char.hp = Math.min(char.hp || char.hpMax, char.hpMax); char.mp = Math.min(char.mp || char.mpMax, char.mpMax);
}

export function xpToNextLevel(level: number): number {
  // Tutorial rápido até o nível 25
  if (level <= 25) return Math.floor(100 * Math.pow(1.25, level - 1));
  // Curva mais difícil após o tutorial
  return Math.floor(10000 * Math.pow(level / 25, 3.5));
}

export function skillXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.25, level));
}