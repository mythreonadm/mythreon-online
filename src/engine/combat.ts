import { Character, Enemy, TickResult, Zone, CardInstance, HuntEncounterRecord, HuntLootEntry } from "../types";
import { addItem } from "./inventory";
import { rollDrops, rollAmbient, RARITY_ORDER } from "./drops";
import { recalcStats, xpToNextLevel } from "./stats";
import { sellValue } from "./shop";
import { salvageItem } from "./salvage";
import { isDebug, TICK_MS, OFFLINE_MAX_HOURS } from "../config";
import { ATTACK_SKILLS, ATTACK_SKILL_COOLDOWN, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";
import { rollCardDrop, CARD_TEMPLATES } from "../data/cards";
import { DIVINE_BEASTS } from "../data/divineBeasts";
import { POTION_TEMPLATES } from "../data/items";
import { getPotionUsePrice } from "../data/potionEconomy";

interface Profile { xpPct: number; goldPct: number; dropPct: number; rarePct: number; healPct: number; skillDmgPct: number; cdReduce: number; lifesteal: number; }

export function buildProfile(char: Character): Profile {
  const bp = char.inventory.backpack;
  const p: Profile = { xpPct: bp.xpBonus ?? 0, goldPct: 0, dropPct: bp.dropBonus ?? 0, rarePct: bp.rareDropBonus ?? 0, healPct: 0, skillDmgPct: 0, cdReduce: 0, lifesteal: 0 };
  for (const [slot, item] of Object.entries(char.equipped)) {
    if (!item || slot === "BACKPACK") continue;
    p.xpPct += item.xpBonus ?? 0; p.goldPct += item.goldBonus ?? 0; p.dropPct += item.dropBonus ?? 0; p.rarePct += item.rareDropBonus ?? 0; p.lifesteal += item.lifesteal ?? 0;
  }
  const race = char.activeRace;
  const passive = race ? PASSIVE_EFFECTS[race.passivaId] : undefined;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : undefined;
  if (passive) {
    p.xpPct += passive.xpPct ?? 0; p.goldPct += passive.goldPct ?? 0; p.dropPct += passive.dropPct ?? 0;
    p.rarePct += passive.rareDropPct ?? 0; p.healPct += passive.healPct ?? 0;
    p.skillDmgPct += passive.skillDmgPct ?? 0; p.cdReduce += passive.cdReduce ?? 0;
  }
  if (support) p.lifesteal += support.lifesteal ?? 0;
  return p;
}

const EQUIP_CATEGORIES = ["ARMA", "ARMADURA", "JOIA", "ESCUDO"];

export function processTick(char: Character, zone: Zone, isOffline: boolean): TickResult {
  const result: TickResult = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, zoneId: zone.id, killed: {}, bossKills: {}, dropCounts: {}, potionsUsed: 0, goldSpentPotions: 0, soldGold: 0, salvagedItems: 0, attacked: false, usedMp: false, cardsDropped: [], divineBeastsDropped: [], damageDealt: 0, damageTaken: 0, combatDurationMs: 0, encounters: [] };
  const debug = isDebug();
  const offlineLimitSeconds = OFFLINE_MAX_HOURS * 3600 + Math.max(0, char.skills?.soul ?? 0) * 15 * 60;
  const ticks = isOffline ? Math.min(Math.floor((Date.now() - char.lastTick) / TICK_MS), offlineLimitSeconds / (TICK_MS / 1000)) : 1;
  const baseEnemy: Enemy | undefined = zone.enemies.find((e) => e.id === char.activeEnemyId) || zone.enemies[0];
  if (!baseEnemy) return result;

  const fightId = `${zone.id}:${baseEnemy.id}`;
  if (char.fightEnemyId !== fightId) {
    char.fightEnemyId = fightId;
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
  }
  let encounterDamageDealt = char.fightDamageDealt ?? 0;
  let encounterDamageTaken = char.fightDamageTaken ?? 0;
  let encounterPotionGoldSpent = char.fightPotionGoldSpent ?? 0;
  let simulatedTicks = 0;
  const recordDeathEncounter = () => {
    if (encounterDamageDealt <= 0 && encounterDamageTaken <= 0) return;
    result.encounters!.push({
      id: `${Date.now()}-${result.encounters!.length}-${baseEnemy.id}`,
      timestamp: Date.now(), zoneId: zone.id, enemyId: baseEnemy.id, enemyName: baseEnemy.name,
      damageDealt: encounterDamageDealt, damageTaken: encounterDamageTaken, xp: 0, gold: 0, soldGold: 0,
      goldSpentPotions: encounterPotionGoldSpent, lootValue: 0, loot: [], outcome: "death",
    });
    char.fightDamageDealt = 0;
    char.fightDamageTaken = 0;
    char.fightPotionGoldSpent = 0;
    encounterPotionGoldSpent = 0;
  };

  const diff = baseEnemy.difficulty || 1;
  const enemy = { ...baseEnemy, hp: baseEnemy.hp * diff, atk: baseEnemy.atk * diff, arm: baseEnemy.arm * diff, xp: baseEnemy.xp * diff, goldMin: baseEnemy.goldMin * diff, goldMax: baseEnemy.goldMax * diff };

  if (char.enemyHpId !== baseEnemy.id || char.enemyHp === undefined || char.enemyHp <= 0) {
    char.enemyHp = enemy.hp; char.enemyHpId = baseEnemy.id;
  }
  let enemyHp = Math.min(char.enemyHp, enemy.hp);
  let playerHp = char.hp;
  let playerMp = char.mp;
  let tickCount = char.tickCount ?? 0;

  const prof = buildProfile(char);
  const race = char.activeRace;
  const support = race ? SUPPORT_EFFECTS[race.suporteId] : undefined;
  const skill = race ? ATTACK_SKILLS[race.ataqueId] : undefined;
  const skillCd = Math.max(1, ATTACK_SKILL_COOLDOWN - prof.cdReduce);
  
  const hpPotId = char.autoHpPotionEnabled ? char.autoHpPotionId || null : null;
  const hpPotPct = char.autoHpPotionPercent || 50;
  const mpPotId = char.autoMpPotionEnabled ? char.autoMpPotionId || null : null;
  const mpPotPct = char.autoMpPotionPercent || 50;
  const warnInsufficientPotionGold = (cost: number) => {
    if (Date.now() < (char.potionGoldWarningUntil ?? 0)) return;
    char.potionGoldWarningUntil = Date.now() + 30_000;
    result.log.push(`🪙 Gold insuficiente para usar a poção (custo: ${cost.toLocaleString("pt-BR")}g).`);
  };

  let bagFullWarned = false;

  const hasDoubleAtkBuff = char.doubleAtkUntil && char.doubleAtkUntil > Date.now();
  const buffMultiplier = hasDoubleAtkBuff ? 2 : 1;

  const heal = (amount: number) => { playerHp = Math.min(char.hpMax, playerHp + Math.round(amount * (1 + prof.healPct))); };

  for (let i = 0; i < ticks; i++) {
    tickCount++;
    simulatedTicks++;
    const t = tickCount;
    const s = char.baseStats;
    const hpMax = char.hpMax;
    const mpMax = char.mpMax;
    result.attacked = false; result.lastDamage = 0; result.lastCrit = false; result.lastMiss = false; result.usedMp = false;

    if (playerHp <= 0) {
      recordDeathEncounter();
      result.death = true;
      const xpLossPct = (char.blesses && char.blesses > 0) ? 0.05 : 0.15;
      const xpLost = Math.floor(char.xp * xpLossPct);
      const goldLost = Math.floor(char.gold * 0.10);
      char.xp -= xpLost; char.gold -= goldLost; char.hp = 0;
      result.deathData = { xpLost, goldLost };
      result.log.push(`☠️ Você morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
      break;
    }

    if (hpPotId && (playerHp / hpMax) * 100 <= hpPotPct) {
      const potion = POTION_TEMPLATES[hpPotId];
      const cost = getPotionUsePrice(hpPotId);
      if (potion && char.gold >= cost) { char.gold -= cost; result.goldSpentPotions! += cost; encounterPotionGoldSpent += cost; char.fightPotionGoldSpent = encounterPotionGoldSpent; heal(potion.stats.hp ?? 0); result.potionsUsed!++; result.log.push(`🧪 ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`); }
      else if (potion) warnInsufficientPotionGold(cost);
    }

    if (mpPotId && (playerMp / mpMax) * 100 <= mpPotPct) {
      const potion = POTION_TEMPLATES[mpPotId];
      const cost = getPotionUsePrice(mpPotId);
      if (potion && char.gold >= cost) { char.gold -= cost; result.goldSpentPotions! += cost; encounterPotionGoldSpent += cost; char.fightPotionGoldSpent = encounterPotionGoldSpent; playerMp = Math.min(mpMax, playerMp + (potion.stats.mp ?? 0)); result.potionsUsed!++; result.log.push(`🔮 ${potion.name}: -${cost.toLocaleString("pt-BR")}g.`); }
      else if (potion) warnInsufficientPotionGold(cost);
    }

    const triggered = !!support && t % support.cd === 0;
    const buffOn = !!support?.dur && (t % support.cd) < support.dur;
    if (triggered && support?.healPct) { heal(hpMax * support.healPct); result.log.push(`💚 Suporte curou você.`); }
    const atkMult = 1 + (buffOn ? support?.atkPct ?? 0 : 0);
    const armMult = 1 + (buffOn ? support?.armPct ?? 0 : 0);
    const ignoreArmor = buffOn ? support?.ignoreArmor ?? 0 : 0;

    const strike = (multiplier = 1): number => {
      result.attacked = true;
      if (debug) { result.lastDamage = 99999; return 99999; }
      if (Math.random() > (s.hit ?? 1)) { result.lastMiss = true; return 0; }
      const base = (s.atk ?? 0) * atkMult * multiplier;
      let dmg = Math.max(Math.ceil(base * 0.1), base - enemy.arm * (1 - ignoreArmor));
      if (Math.random() < (s.crit ?? 0)) { dmg *= 1.5; result.lastCrit = true; }
      if (support?.executeBonus && enemyHp < enemy.hp * 0.4) dmg *= 1 + support.executeBonus;
      dmg = Math.max(1, Math.round(dmg));
      result.lastDamage = (result.lastDamage ?? 0) + dmg;
      return dmg;
    };

    let dealt = strike();
    if (hasDoubleAtkBuff) { dealt += strike(); result.log.push(`⚡ Ataque Duplo!`); }
    if (triggered && support?.doubleStrike) dealt += strike();
    if (Math.random() < (s.spd ?? 0)) dealt += strike();

    if (skill && t % skillCd === 0 && !debug) {
      const manaCost = skill.manaCost + (char.level * 2);
      if (playerMp >= manaCost) {
        playerMp -= manaCost;
        result.usedMp = true;
        const raw = ((s.matk ?? 0) + (s.atk ?? 0) * 0.5) * skill.mult * (1 + prof.skillDmgPct);
        const armor = enemy.arm * (1 - skill.pierce) * (1 - ignoreArmor);
        const sd = Math.max(Math.ceil(raw * 0.1), Math.round(raw - armor));
        dealt += sd; result.lastDamage = (result.lastDamage ?? 0) + sd;
        if (skill.lifesteal) heal(sd * skill.lifesteal);
        result.log.push(`✨ ${skill.desc.split(':')[0]} causou ${sd} de dano mágico!`);
      } else {
        result.log.push(`⚠️ Mana insuficiente!`);
      }
    }

    if (debug) result.log.push(`[TESTE] Você obliterou o ${enemy.name} (${diff}⭐).`);
    else if (dealt > 0) result.log.push(`Você causou ${dealt} de dano físico no ${enemy.name}.${result.lastCrit ? " 💥 CRÍTICO!" : ""}`);

    result.damageDealt! += dealt;
    encounterDamageDealt += dealt;
    char.fightDamageDealt = encounterDamageDealt;
    
    enemyHp -= dealt;
    if (prof.lifesteal > 0 && !debug) heal(dealt * prof.lifesteal);

    if (enemyHp <= 0) {
      result.kills++; char.killsInZone++; char.totalKills = (char.totalKills ?? 0) + 1;
      result.killed![enemy.id] = (result.killed![enemy.id] ?? 0) + 1;
      if (enemy.isBoss) result.bossKills![enemy.id] = (result.bossKills![enemy.id] ?? 0) + 1;
      const g = Math.floor((enemy.goldMin + Math.floor(Math.random() * (enemy.goldMax - enemy.goldMin + 1))) * (1 + prof.goldPct));
      const xpGained = Math.floor(enemy.xp * (1 + prof.xpPct)) * (debug ? 10 : 1);
      result.gold += g; char.gold += g; result.xp += xpGained; char.xp += xpGained;
      const loot: HuntLootEntry[] = [];
      const soldGoldBefore = result.soldGold ?? 0;
      heal(hpMax * 0.1);

      // ─── DROP DE CARTA (NOVO) ───
      const cardDrop = rollCardDrop(enemy.id, zone.tier, enemy.isBoss);
      if (cardDrop) {
        if (!char.cards) char.cards = [];
        char.cards.push(cardDrop);
        result.cardsDropped!.push(cardDrop);
        const template = CARD_TEMPLATES[cardDrop.templateId];
        result.log.push(`🃏 CARTA DROPADA: ${template?.emoji} ${template?.name}!`);
        if (template) loot.push({ name: template.name, icon: template.emoji, quantity: 1, sellValue: 0, kind: "card" });
      }

      let bondedBeastName: string | null = null;
      const availableBeasts = enemy.isBoss
        ? Object.values(DIVINE_BEASTS).filter(candidate => candidate.bossId === enemy.id && !(char.divineBeasts ?? []).some(owned => owned.id === candidate.id))
        : [];
      if (availableBeasts.length > 0 && Math.random() < availableBeasts[0].dropChance) {
        const beast = availableBeasts[Math.floor(Math.random() * availableBeasts.length)];
        if (!char.divineBeasts) char.divineBeasts = [];
        char.divineBeasts.push({ id: beast.id, obtainedAt: Date.now() });
        result.divineBeastsDropped!.push(beast.id);
        bondedBeastName = beast.name;
      }
      // ─── FIM DO DROP DE CARTA ───
      
      const drops = rollDrops(enemy, zone, char, { dropBonus: prof.dropPct, rareBonus: prof.rarePct, force: debug });
      if (debug || char.killsInZone % 10 === 0 || enemy.isBoss) drops.push(rollAmbient(zone));
      
      const autoSell = char.autoSell ?? null;
      const autoSalvage = char.autoSalvage ?? null;

      for (const d of drops) {
        loot.push({ name: d.name, icon: d.icon, quantity: d.quantity, sellValue: sellValue(d), kind: "item" });
        const isEquip = EQUIP_CATEGORIES.includes(d.category);
        if (autoSell && isEquip && d.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSell)) {
          const v = sellValue(d); char.gold += v; result.gold += v; result.soldGold! += v; continue;
        }
        if (autoSalvage && isEquip && d.rarity !== "LENDARIO" && RARITY_ORDER.indexOf(d.rarity) <= RARITY_ORDER.indexOf(autoSalvage)) {
           salvageItem(char, d); result.salvagedItems!++; continue; 
        }
        if (addItem(char.inventory, d)) { result.drops.push(d); result.dropCounts![d.templateId] = (result.dropCounts![d.templateId] ?? 0) + d.quantity; }
        else if (!bagFullWarned) { bagFullWarned = true; result.log.push("🎒 Bolsa cheia!"); }
      }

      const encounter: HuntEncounterRecord = {
        id: `${Date.now()}-${result.encounters!.length}-${enemy.id}`,
        timestamp: Date.now(), zoneId: zone.id, enemyId: enemy.id, enemyName: enemy.name,
        damageDealt: encounterDamageDealt, damageTaken: encounterDamageTaken, xp: xpGained, gold: g,
        goldSpentPotions: encounterPotionGoldSpent, soldGold: (result.soldGold ?? 0) - soldGoldBefore,
        lootValue: loot.reduce((total, item) => total + item.sellValue * item.quantity, 0), loot, outcome: "victory",
      };
      result.encounters!.push(encounter);
      encounterDamageDealt = 0;
      encounterDamageTaken = 0;
      char.fightPotionGoldSpent = 0;
      encounterPotionGoldSpent = 0;
      char.fightDamageDealt = 0;
      char.fightDamageTaken = 0;
      
      while (char.xp >= char.xpToNext) {
        char.xp -= char.xpToNext; char.level++; char.xpToNext = xpToNextLevel(char.level); result.levelsGained++;
        char.statPoints = (char.statPoints ?? 0) + 1;
        result.log.push("🌟 Você recebeu 1 ponto de status!");
        char.hp = playerHp; recalcStats(char); playerHp = char.hpMax; char.mp = char.mpMax;
        result.log.push(`✨ Subiu para nível ${char.level}!`);
      }
      result.log.push(`Você derrotou o ${enemy.name} (${diff}⭐)! (+${g} ouro, +${xpGained} XP)`);
      if (bondedBeastName) result.log.push(`🐾 Ressonância Divina! ${bondedBeastName} criou um vínculo com você.`);
      enemyHp = enemy.hp;
    } else {
      const e = support;
      const dodgedBySkill = !!e?.dodgeEvery && t % e.dodgeEvery === 0;
      if (dodgedBySkill || Math.random() < (s.dge ?? 0)) { result.log.push(`Você esquivou do ataque de ${enemy.name}.`); }
      else {
        const armor = (s.arm ?? 0) * armMult;
        const reduction = armor + (s.def ?? 0) * 0.5;
        const raw = Math.max(Math.ceil(enemy.atk * 0.1), enemy.atk - reduction);
        const res = enemy.damageType === "MAGICO" ? (s.resMagico ?? 0) : (s.resFisico ?? 0);
        let mult = (1 - Math.min(0.5, res)) * (1 - (buffOn ? e?.dmgReduction ?? 0 : 0) - (e?.permDmgReduction ?? 0));
        if (Math.random() < (s.blk ?? 0)) mult *= 0.5;
        const eDmg = debug ? 0 : Math.max(1, Math.round(raw * Math.max(0.2, mult)));
        playerHp -= eDmg;
        result.damageTaken! += eDmg;
        encounterDamageTaken += eDmg;
        char.fightDamageTaken = encounterDamageTaken;
        if (eDmg > 0) result.log.push(`${enemy.name} causou ${eDmg} de dano em você.`);
      }
      if (playerHp > 0) heal(hpMax * 0.015);
      else {
        recordDeathEncounter();
        result.death = true;
        const xpLossPct = (char.blesses && char.blesses > 0) ? 0.05 : 0.15;
        const xpLost = Math.floor(char.xp * xpLossPct);
        const goldLost = Math.floor(char.gold * 0.10);
        char.xp -= xpLost; char.gold -= goldLost; char.hp = 0;
        result.deathData = { xpLost, goldLost };
        result.log.push(`☠️ Você morreu! Perdeu ${xpLost} XP e ${goldLost} de Ouro.`);
        break;
      }
    }
  }

  char.tickCount = tickCount;
  char.hp = Math.max(0, Math.min(char.hpMax, playerHp));
  char.mp = Math.max(0, Math.min(char.mpMax, playerMp));
  char.enemyHp = enemyHp; char.enemyHpId = baseEnemy.id;
  char.lastTick = Date.now();
  result.log = result.log.slice(-10);
  result.combatDurationMs = simulatedTicks * TICK_MS;
  result.enemyHp = Math.max(0, Math.round(enemyHp));
  result.enemyMaxHp = enemy.hp;
  return result;
}
