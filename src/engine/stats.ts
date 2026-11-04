import { masteryBonus, trainingXpNeeded } from "./training";
import { BALANCE } from "../data/balance";
import { Character, ItemStats } from "../types";
import { ELEMENTS } from "../data/elementalChart";
import { PASSIVE_EFFECTS, SUPPORT_EFFECTS } from "../data/skills";
import { VIALS } from "../data/vials";
import { beastGrowth } from "../data/beastCombat";
import { DIVINE_BEASTS } from "../data/divineBeasts";
import { formationBonus } from "./cardCollection";

export function getBaseStats(level: number): ItemStats {
  level = Number.isFinite(Number(level)) ? Math.max(1, Math.floor(Number(level))) : 1;
  return {
    hp: 150 + (level - 1) * 25,
    mp: 50 + (level - 1) * 15,
    atk: 12 + Math.floor((level - 1) * 2.5),
    matk: 12 + Math.floor((level - 1) * 2.5),
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
  const numeric = (value: unknown): number => { const n = Number(value); return Number.isFinite(n) ? n : 0; };
  const fromGear: any = {};
  const fromRace: any = {};
  const fromVials: any = {};
  const fromBeast: any = {};
  const fromCards: any = {};
  const elementalResistances: Character["elementalResistances"] = {};

  // 1. Soma os stats de Equipamentos e Afixos
  const isUsingBow = char.equipped.ARMA_PRINCIPAL?.templateId.includes("ARCO") ?? false;
  for (const slot of Object.keys(char.equipped)) {
    const item = char.equipped[slot as keyof typeof char.equipped];
    if (!item?.stats) continue;
    if (item.category === "FLECHA" && !isUsingBow) continue;
    for (const [k, v] of Object.entries(item.stats)) fromGear[k] = (fromGear[k] || 0) + numeric(v);
    for (const affix of item.affixes ?? []) fromGear[affix.stat] = (fromGear[affix.stat] || 0) + numeric(affix.value);
    for (const [element, value] of Object.entries(item.elementalResistances ?? {})) elementalResistances[element as keyof typeof elementalResistances] = (elementalResistances[element as keyof typeof elementalResistances] ?? 0) + numeric(value);
  }

  // 2. Soma os stats da Raça Equipada
  if (char.activeRace && char.activeRace.bonus) {
    for (const [k, v] of Object.entries(char.activeRace.bonus)) fromRace[k] = numeric(v);
  }

  // 3. Soma os stats dos Vials Ativos
  const now = Date.now();
  if (char.activeVials) {
    for (const [vialId, expiry] of Object.entries(char.activeVials)) {
      const family = vialId.replace(/_[0-9]+$/, '');
      const superseded = Object.entries(char.activeVials).some(([other, until]) => until > now && other.replace(/_[0-9]+$/, '') === family && Number(other.split('_').at(-1)) > Number(vialId.split('_').at(-1)));
      if (expiry > now && !superseded) {
        const vial = VIALS[vialId];
        if (vial) {
          for (const [k, v] of Object.entries(vial.stats)) fromVials[k] = (fromVials[k] || 0) + numeric(v);
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
    for (const [k, v] of Object.entries(beastGrowth(char.level))) fromBeast[k] = v;
    for (const [k, v] of Object.entries(activeBeast.bonus)) fromBeast[k] = (fromBeast[k] ?? 0) + numeric(v);
  }

  // Formação de Cards: bônus moderados entram na hunt e no PvP.
  // A escala evita que uma carta substitua equipamento, Matriz ou Pet.
  Object.assign(fromCards, formationBonus(char));

  // 5. Skills de Treino
  const skills = char.skills || { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  const skillAtkBonus = (isUsingBow ? 0 : skills.melee * 1.5);
  const skillDistBonus = isUsingBow ? skills.distance * 1.5 : 0;
  const skillMatkBonus = skills.magic * 1.5;
  const skillArmBonus = skills.defense;
  const skillDefBonus = skills.defense * 0.5;
  const skillHitBonus = isUsingBow ? skills.distance * 0.005 : 0;

  // 6. Multiplicadores (Passivas/Suportes)
  const atkMult = (1 + (support?.permAtkPct ?? 0)) * (1 + masteryBonus(char, isUsingBow ? "distance" : "melee"));
  const armMult = 1 + (passive?.armPct ?? 0) + (support?.permArmPct ?? 0);
  const hpMult = 1 + numeric(passive?.hpPct);

  const sum = (k: string) => numeric(fromGear[k]) + numeric(fromRace[k]) + numeric(fromPassive[k]) + numeric(fromVials[k]) + numeric(fromBeast[k]) + numeric(fromCards[k]);

  // 7. Junta tudo e aplica os limites (Caps)
  char.baseStats = {
    hp: Math.max(1, Math.floor((base.hp! + sum("hp")) * hpMult)),
    mp: Math.max(0, Math.floor(base.mp! + sum("mp"))),
    atk: Math.floor((base.atk! + sum("atk") + skillAtkBonus + skillDistBonus) * atkMult),
    matk: Math.floor((base.matk! + sum("matk") + skillMatkBonus) * (1 + masteryBonus(char, "magic"))),
    def: base.def! + sum("def") + skillDefBonus,
    arm: Math.floor((base.arm! + sum("arm") + skillArmBonus) * armMult * (1 + masteryBonus(char, "defense"))),
    spd: Math.min(base.spd! + sum("spd"), 0.8),
    crit: Math.min(base.crit! + sum("crit") + (support?.critBonus ?? 0), 0.85),
    hit: Math.min(base.hit! + sum("hit") + (support?.hitBonus ?? 0) + skillHitBonus, 1.0),
    dge: Math.min(base.dge! + sum("dge"), 0.5),
    blk: Math.min(base.blk! + sum("blk"), 0.5),
    resFisico: Math.max(0, Math.min(sum("resFisico"), BALANCE.resistanceCap)),
    resMagico: Math.max(0, Math.min(sum("resMagico"), BALANCE.resistanceCap)),

    // NOVOS ATRIBUTOS
    hpRegen: (base.hpRegen ?? 0) + sum("hpRegen"),
    mpRegen: (base.mpRegen ?? 0) + sum("mpRegen") + Math.min(5, Math.floor((char.trainingMastery?.soul ?? 0) / 5)),
    luck: Math.min((base.luck ?? 0) + sum("luck"), 0.5),
    critDmg: (base.critDmg ?? 0.5) + sum("critDmg"),
  };
  for (const element of ELEMENTS) elementalResistances[element.id] = Math.max(0, Math.min(BALANCE.resistanceCap, elementalResistances[element.id] ?? 0));
  char.elementalResistances = elementalResistances;

  char.hpMax = char.baseStats.hp!;
  char.mpMax = char.baseStats.mp!;
  char.hp = Math.min(Number.isFinite(char.hp) ? Math.max(0, char.hp) : char.hpMax, char.hpMax);
  char.mp = Math.min(Number.isFinite(char.mp) ? Math.max(0, char.mp) : char.mpMax, char.mpMax);
}

// CURVA DE XP DO PERSONAGEM (Rápida até o 25, difícil depois)
export function xpToNextLevel(level: number): number {
  const safeLevel = Math.max(1, Math.floor(level));
  if (safeLevel <= 25) return Math.floor(Math.max(200 * Math.pow(safeLevel, 1.35), 100 * Math.pow(1.25, safeLevel - 1)));
  return Math.floor((100 * Math.pow(1.25, 24)) * Math.pow(safeLevel / 25, 3.5));
}

// CURVA DE XP DAS SKILLS DE TREINO
export function skillXpToNextLevel(level: number): number {
  return trainingXpNeeded(level);
}
