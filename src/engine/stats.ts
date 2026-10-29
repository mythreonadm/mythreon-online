// Em getBaseStats(), deixe assim:
export function getBaseStats(level: number): ItemStats {
  return { 
    hp: 150 + (level - 1) * 30, mp: 50 + (level - 1) * 15, atk: 15 + Math.floor((level - 1) * 3), 
    matk: 10 + Math.floor((level - 1) * 2), def: 3 + Math.floor((level - 1) * 0.8), 
    arm: 3 + Math.floor((level - 1) * 0.8), spd: 0, crit: 0.05, hit: 0.90, dge: 0.05, blk: 0,
    hpRegen: 1, mpRegen: 1, luck: 0, critDmg: 0.5
  };
}

// Em recalcStats(), adicione os novos stats no cálculo final:
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
    // NOVOS ATRIBUTOS:
    hpRegen: (base.hpRegen ?? 0) + sum("hpRegen"),
    mpRegen: (base.mpRegen ?? 0) + sum("mpRegen"),
    luck: Math.min(sum("luck"), 0.5),
    critDmg: (base.critDmg ?? 0.5) + sum("critDmg"),
  };