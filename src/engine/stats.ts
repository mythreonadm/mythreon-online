import { Character, ItemStats } from "../types";
import { ELEMENTS } from "../data/elementalChart";
import { PASSIVE_EFFECTS, SUPPORT_EFFECTS } from "../data/skills";
import { VIALS } from "../data/vials";
import { DIVINE_BEASTS } from "../data/divineBeasts";

export function getBaseStats(level: number): ItemStats {
  return { 
    hp: 150 + (level - 1) * 30, 
    mp: 50 + (level - 1) * 15, 
    atk: 15 + Math.floor((level - 1) * 3), 
    matk: 10 + Math.floor((level - 1) * 2), 
    def: 3 + Math.floor((level - 1) * 0.8), 
    arm: 3 + Math.floor((level - 1) * 0.8), 
    spd: 0, crit: 0.05, hit: 0.90, dge: 0.05, blk: 0,
    // NOVOS ATRIBUTOS BASE
    hpRegen: 1,
    mpRegen: 1,
    luck: 0,
    critDmg: 0.5
  };
}

export function recalcStats(char: Character): void {
  const base = getBaseStats(char.level);
  const fromGear: any = {};
  const fromRace: any = {};
  const fromVials: any = {};
  const fromBeast: any = {};
  const elementalResistances: Character["elementalResistances"] = {};

  // 1. Soma os stats de Equipamentos e Afixos
  for (const slot of Object.keys(char.equipped)) {
    const item = char.equipped[slot as keyof typeof char.equipped];
    if (!item?.stats) continue;
    for (const [k, v] of Object.entries(item.stats)) fromGear[k] = (fromGear[k] || 0) + v;
    for (const affix of item.affixes ?? []) fromGear[affix.stat] = (fromGear[affix.stat] || 0) + affix.value;
    for (const [element, value] of Object.entries(item.elementalResistances ?? {})) elementalResistances[element as keyof typeof elementalResistances] = (elementalResistances[element as keyof typeof elementalResistances] ?? 0) + (value ?? 0);
  }

  // 2. Soma os stats da Raça Equipada
  if (char.activeRace && char.activeRace.bonus) {
    for (const [k, v] of Object.entries(char.activeRace.bonus)) fromRace[k] = v;
  }

  // 3. Soma os stats dos Vials Ativos
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

  // 4. Passivas e Suportes
  const passive = char.activeRace ? PASSIVE_EFFECTS[char.activeRace.passivaId] : undefined;
  const support = char.activeRace ? SUPPORT_EFFECTS[char.activeRace.suporteId] : undefined;
  const fromPassive: any = passive?.stats ?? {};
  const activeBeast = char.activeDivineBeastId ? DIVINE_BEASTS[char.activeDivineBeastId] : undefined;
  if (activeBeast && (char.divineBeasts ?? []).some(beast => beast.id === activeBeast.id)) {
    for (const [k, v] of Object.entries(activeBeast.bonus)) fromBeast[k] = v;
  }

  // 5. Skills de Treino
  const skills = char.skills || { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  const isUsingBow = char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO");

  const skillAtkBonus = skills.melee * 3;
  const skillDistBonus = isUsingBow ? skills.distance * 3 : 0;
  const skillMatkBonus = skills.magic * 3;
  const skillArmBonus = skills.defense * 2;
  const skillDefBonus = skills.defense * 1;
  const skillHitBonus = isUsingBow ? skills.distance * 0.005 : 0;

  // 6. Multiplicadores (Passivas/Suportes)
  const atkMult = 1 + (support?.permAtkPct ?? 0);
  const armMult = 1 + (passive?.armPct ?? 0) + (support?.permArmPct ?? 0);
  const hpMult = 1 + (passive?.hpPct ?? 0);

  const sum = (k: string) => (fromGear[k] ?? 0) + (fromRace[k] ?? 0) + (fromPassive[k] ?? 0) + (fromVials[k] ?? 0) + (fromBeast[k] ?? 0);

  // 7. Junta tudo e aplica os limites (Caps)
  char.baseStats = {
    hp: Math.floor((base.hp! + sum("hp")) * hpMult), 
    mp: base.mp! + sum("mp"),
    atk: Math.floor((base.atk! + sum("atk") + skillAtkBonus + skillDistBonus) * atkMult), 
    matk: base.matk! + sum("matk") + skillMatkBonus,
    def: base.def! + sum("def") + skillDefBonus, 
    arm: Math.floor((base.arm! + sum("arm") + skillArmBonus) * armMult),
    spd: Math.min(base.spd! + sum("spd"), 0.8), 
    crit: Math.min(base.crit! + sum("crit") + (support?.critBonus ?? 0), 0.85),
    hit: Math.min(base.hit! + sum("hit") + (support?.hitBonus ?? 0) + skillHitBonus, 1.0),
    dge: Math.min(base.dge! + sum("dge"), 0.5), 
    blk: Math.min(base.blk! + sum("blk"), 0.5),
    resFisico: Math.min(sum("resFisico"), 0.8), 
    resMagico: Math.min(sum("resMagico"), 0.8),
    
    // NOVOS ATRIBUTOS
    hpRegen: (base.hpRegen ?? 0) + sum("hpRegen"),
    mpRegen: (base.mpRegen ?? 0) + sum("mpRegen"),
    luck: Math.min((base.luck ?? 0) + sum("luck"), 0.5),
    critDmg: (base.critDmg ?? 0.5) + sum("critDmg"),
  };
  for (const element of ELEMENTS) elementalResistances[element.id] = Math.min(0.8, elementalResistances[element.id] ?? 0);
  char.elementalResistances = elementalResistances;
  
  char.hpMax = char.baseStats.hp!; 
  char.mpMax = char.baseStats.mp!;
  char.hp = Math.min(char.hp || char.hpMax, char.hpMax); 
  char.mp = Math.min(char.mp || char.mpMax, char.mpMax);
}

// CURVA DE XP DO PERSONAGEM (Rápida até o 25, difícil depois)
export function xpToNextLevel(level: number): number {
  if (level <= 25) return Math.floor(100 * Math.pow(1.25, level - 1));
  return Math.floor(10000 * Math.pow(level / 25, 3.5));
}

// CURVA DE XP DAS SKILLS DE TREINO
export function skillXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.25, level));
}
