import { ItemStats } from "../types";

export interface AttackSkill { 
  mult: number;       // Multiplicador de dano Mágico
  pierce: number;     // Penetração de armadura
  manaCost: number;   // Custo de Mana base (escala com level)
  lifesteal?: number; 
  desc: string;
}

export const ATTACK_SKILLS: Record<string, AttackSkill> = {
  A1: { mult: 2.0, pierce: 0.1, manaCost: 10, desc: "Mordida Feral: Dano físico pesado." },
  A2: { mult: 1.8, pierce: 0.3, manaCost: 12, desc: "Ferrão Venenoso: Dano com veneno." },
  A3: { mult: 2.2, pierce: 0.5, manaCost: 15, desc: "Chama Espectral: Dano mágico em área." },
  A4: { mult: 2.1, pierce: 0.4, manaCost: 15, desc: "Garra Perfurante: Ignora defesa." },
  A5: { mult: 1.9, pierce: 0.2, manaCost: 12, desc: "Peçonha: Dano e lentidão." },
  A6: { mult: 2.0, pierce: 0.35, manaCost: 14, desc: "Corte: Dano perfurante rápido." },
  A7: { mult: 1.8, pierce: 0.2, manaCost: 12, desc: "Espinho: Causa sangramento." },
  A8: { mult: 2.2, pierce: 0.2, manaCost: 16, desc: "Mordida Medonha: Causa medo." },
  A9: { mult: 2.5, pierce: 0.0, manaCost: 18, desc: "Impacto: Dano em cone brutal." },
  A10:{ mult: 2.0, pierce: 0.3, manaCost: 14, desc: "Corte Silencioso: Dano e silêncio." },
  A11:{ mult: 2.3, pierce: 0.4, manaCost: 16, desc: "Lança Gélida: Congela o alvo." },
  A12:{ mult: 2.4, pierce: 0.8, manaCost: 20, desc: "Chicote Abissal: Ignora quase toda armadura." },
  A13:{ mult: 2.6, pierce: 0.5, manaCost: 22, desc: "Descarga: Dano de trovão em cadeia." },
  A14:{ mult: 2.2, pierce: 0.3, manaCost: 18, lifesteal: 0.4, desc: "Devorar: Drena vida do alvo." },
  A15:{ mult: 3.0, pierce: 0.6, manaCost: 25, desc: "Julgamento Estelar: Dano sagrado devastador." },
};

export const ATTACK_SKILL_COOLDOWN = 3; // A cada 3 ticks (9s)

export interface SupportEffect {
  cd: number; dur?: number; healPct?: number; atkPct?: number; armPct?: number;
  dmgReduction?: number; ignoreArmor?: number; dodgeEvery?: number; doubleStrike?: boolean;
  critBonus?: number; hitBonus?: number; permAtkPct?: number; permArmPct?: number; 
  permDmgReduction?: number; lifesteal?: number; executeBonus?: number; desc: string;
}

export const SUPPORT_EFFECTS: Record<string, SupportEffect> = {
  S1: { cd: 5, healPct: 0.15, desc: "Bênção de Lyss: Cura 15% do HP a cada 15s." },
  S2: { cd: 6, dur: 3, atkPct: 0.15, armPct: 0.15, desc: "Vínculo: +15% ATK/ARM por 9s a cada 18s." },
  S3: { cd: 6, healPct: 0.12, desc: "Aurora: Cura 12% do HP a cada 18s." },
  S4: { cd: 6, dur: 2, dmgReduction: 0.35, desc: "Véu: Escudo de -35% de dano por 6s." },
  S5: { cd: 4, doubleStrike: true, desc: "Aceleração: Ataque duplo a cada 12s." },
  S6: { cd: 5, dur: 3, ignoreArmor: 0.3, desc: "Revelação: Ignora 30% da armadura inimiga." },
  S7: { cd: 5, dur: 3, armPct: 0.25, desc: "Baluarte: +25% armadura por 9s." },
  S8: { cd: 4, dodgeEvery: 4, desc: "Passo: Esquiva 1 ataque a cada 12s." },
  S9: { cd: 1, permDmgReduction: 0.10, desc: "Adaptação: -10% de dano recebido." },
  S10: { cd: 1, critBonus: 0.08, hitBonus: 0.05, desc: "Cálculo: +8% crítico, +5% precisão." },
  S11: { cd: 1, permAtkPct: 0.10, permArmPct: 0.10, desc: "Equilíbrio: +10% ATK e ARM." },
  S12: { cd: 1, lifesteal: 0.10, desc: "Fusão: Rouba 10% do dano causado." },
  S13: { cd: 1, executeBonus: 0.50, desc: "Predação: +50% dano em alvos com <40% HP." },
};

export interface PassiveEffect {
  stats?: ItemStats; hpPct?: number; armPct?: number;
  xpPct?: number; goldPct?: number; dropPct?: number; rareDropPct?: number;
  healPct?: number; skillDmgPct?: number; cdReduce?: number; desc: string;
}

export const PASSIVE_EFFECTS: Record<string, PassiveEffect> = {
  P1: { healPct: 0.25, desc: "+25% de cura recebida." },
  P2: { armPct: 0.15, stats: { def: 5 }, desc: "+15% armadura, +5 DEF." },
  P3: { stats: { resMagico: 0.10, resFisico: 0.05 }, desc: "+10% resist. mágica, +5% física." },
  P4: { stats: { spd: 0.15 }, desc: "+15% de chance de ataque extra." },
  P5: { healPct: 0.20, hpPct: 0.10, desc: "+20% cura recebida, +10% HP." },
  P6: { stats: { dge: 0.08 }, desc: "+8% esquiva." },
  P7: { skillDmgPct: 0.30, desc: "+30% de dano nas habilidades." },
  P8: { cdReduce: 1, desc: "Habilidade recarrega 1 tick mais rápido." },
  P9: { stats: { crit: 0.10 }, desc: "+10% de crítico." },
  P10:{ xpPct: 0.15, desc: "+15% de XP." },
  P11:{ rareDropPct: 0.20, desc: "+20% de chance de raridade alta." },
  P12:{ goldPct: 0.20, desc: "+20% de ouro." },
};