import { canEnterZone, canTutorialHunt, isGuided, repairLegacyJourney, unlockJourneyZone } from '../engine/journey';
import { getAvailableQuests } from '../utils/questSignals';
import { checkQuestCompletion } from '../engine/questEngine';
import { applyTraining } from "../engine/training";
import { create } from "zustand";
import { Character, Race, TickResult, CharacterSkills, OfflineReportData, BuffVialTemplate, DeathReportData, HuntZoneStats, DivineBeastId, QuestObjectiveType, CharacterAppearance, Rarity, DivineBeastNeeds, CardInstance } from "../types";
import { ZONES } from "../data/zones";
import { createNewCharacter, loadGame, saveGame } from "../engine/save";
import { processTick } from "../engine/combat";
import { equipItem, unequipItem, addItem, removeItem, countByTemplate } from "../engine/inventory";
import { makeEquipment, makeMaterial } from "../engine/drops";
import { recalcStats, skillXpToNextLevel } from "../engine/stats";
import { findNamedRace, generateRaceName, generateRaceId, generateRaceBonus } from "../data/races";
import { sellItem, sellSelectedItems } from "../engine/shop";
import { salvageAllEquipment, salvageSelectedEquipment } from "../engine/salvage";
import { updateQuestProgress, claimQuestReward, trackRaceDiscovery, trackQuestAction } from "../engine/questEngine";
import { upgradeItemLevel, rerollItemAffixes, forgeFragments, elevateItemTier, rerollSpecificAffix, enchantItem } from "../engine/forge";
import { depositItem as engineDeposit, withdrawItem as engineWithdraw, depositMany as engineDepositMany, withdrawMany as engineWithdrawMany } from "../engine/depot";
import { FRAGMENT_TEMPLATES, DIVINE_BEAST_EGG_TEMPLATES, UNIQUE_TEMPLATES, ALL_ITEM_TEMPLATES, PROFESSION_TOOL_TEMPLATES, createItem } from "../data/items";
import { divineBeastSellValue, DIVINE_BEASTS } from "../data/divineBeasts";
import { QUESTS } from "../data/quests";
import { getMythreonOffer, MYTHREON_ECONOMY } from "../data/mythreonEconomy";
import { farmSeed, farmYield, FARM_SEEDS, farmExpansionCost, farmRecipe, farmRecipeOutput, FARM_RECIPES, FARM_FERTILITY_MAX, FARM_FERTILITY_MIN, FARM_FERTILITY_LOSS_PER_HARVEST, FARM_FERTILITY_COMPOST_GAIN } from "../data/farm";
import { generateId } from "../utils/id";
import { MINING_NODES, FISHING_SPOTS, PROFESSION_RECIPES, PROFESSION_TOOL_SHOP, FISHING_BAIT, professionCooldown } from "../data/professions";

import { calendarUnlockedSkins, CALENDAR_COUPON_PRICE } from "../data/dailyCalendar";
import { claimCalendarReward, recoverCalendarDay, recoverCalendarWeek } from "../engine/dailyCalendar";
import { COSMETIC_DEFINITIONS, COSMETIC_SLOTS, type CosmeticSlot } from "../data/cosmetics";
import { ownedCosmeticLoadout } from "../engine/cosmeticOwnership";
import { evolveCard as engineEvolveCard, recycleCardCopies as engineRecycleCardCopies } from "../engine/cardCollection";
import { CARD_TEMPLATES } from "../data/cards";
import { normalizeOnlineChest, nextOnlineChest } from "../data/onlineChest";
import { STAMINA_COIN_REFILL_MINUTES, STAMINA_GOLD_REFILL_MINUTES, STAMINA_ONLINE_MAX, STAMINA_PRETEST_UNLIMITED, staminaDayKey, staminaGoldCost } from "../data/stamina";

export interface GameState {
  character: Character | null;
  races: Race[];
  currentZoneId: string;
  lastTickResult: TickResult | null;
  isTickRunning: boolean;
  isTraining: boolean;
  offlineReport: OfflineReportData | null;
  deathReport: DeathReportData | null;
  healingUntil: number | null;

  finishIntro: () => void;
  unlockZone: (id: string) => {success:boolean;error?:string};
  newGame: (name: string, appearance?: CharacterAppearance) => void;
  updateAppearance: (appearance: CharacterAppearance) => { success: boolean; error?: string };
  equipCosmetic: (templateId: string) => { success: boolean; error?: string };
  unequipCosmetic: (slot: CosmeticSlot) => { success: boolean; error?: string };
  loadFromSave: () => boolean;
  save: () => void;
  spendStatPoint: (stat: keyof CharacterSkills) => boolean;
  clearOfflineReport: () => void;
  clearDeathReport: () => void;
  healFull: () => void;
  startHealing: () => void;
  cancelHealing: () => void;
  tick: () => void;
  startHunting: (zoneId: string) => void;
  stopHunting: () => void;
  startTraining: (skill: keyof CharacterSkills) => void;
  stopTraining: () => void;
  armSpecialCombo: (power?: 1.5 | 1 | 0.5) => { success: boolean; error?: string };
  setActiveEnemy: (enemyId: string) => void;
  setCurrentZone: (zoneId: string) => void;
  equip: (uid: string, force?: boolean) => { success: boolean; error?: string };
  unequip: (slot: any) => { success: boolean; error?: string };
  synthesize: (a: string, s: string, p: string) => { success: boolean; error?: string };
  equipRace: (race: Race) => void;
  unequipRace: () => void;
  equipDivineBeast: (id: DivineBeastId) => { success: boolean; error?: string };
  hatchEgg: (uid: string) => { success: boolean; started?: boolean; readyAt?: number; remainingMs?: number; beastId?: DivineBeastId; rarity?: Rarity; error?: string };
  combineBeast: (id: DivineBeastId) => { success: boolean; rarity?: Rarity; error?: string };
  sellDivineBeast: (id: DivineBeastId, instanceId?: string) => { success: boolean; gold?: number; error?: string };
  feedDivineBeast: (id: DivineBeastId, foodUid: string) => { success: boolean; error?: string };
  unequipDivineBeast: () => void;
  sellItem: (uid: string, qty?: number) => void;
  sellSelected: (uids: string[]) => void;
  discardItem: (uid: string, qty?: number) => { success: boolean; error?: string };
  salvageAll: (maxRarity: any) => void;
  salvageSelected: (uids: string[]) => void;
  updateSettings: (settings: any) => void;
  activateBuff: () => void;
  acceptQuest: (id: string) => void;
  claimQuest: (id: string) => void;
  recordQuestAction: (action: QuestObjectiveType) => void;
  buyTrainingBoost: () => { success: boolean; error?: string };
  useVial: (vial: BuffVialTemplate) => void;
  buyBless: () => void;
  buyStaminaGold: () => { success: boolean; minutesAdded?: number; error?: string };
  buyStaminaCoins: () => { success: boolean; minutesAdded?: number; error?: string };
  refreshCompendium: () => void;
  upgradeItem: (uid: string) => { success: boolean; error?: string };
  rerollItem: (uid: string) => { success: boolean; error?: string };
  elevateItemTier: (uid: string) => { success: boolean; error?: string };
  rerollSpecificAffix: (uid: string, stat: keyof Character["baseStats"]) => { success: boolean; error?: string };
  enchantItem: (uid: string, zoneId: string) => { success: boolean; error?: string; enchantment?: string };
  forgeFragments: (fromTemplateId: string) => { success: boolean; error?: string; crafted?: number };
  refineMythreonCoins: (amount?: number) => { success: boolean; coins?: number; error?: string };
  buyMythreonOffer: (offerId: string) => { success: boolean; error?: string };
  buyMythreonBoost: (offerId: string) => { success: boolean; error?: string };
  openMythreonRoulette: () => { success: boolean; reward?: string; error?: string };
  buyCalendarCoupon: () => { success: boolean; error?: string };
  claimDailyCalendar: () => { success: boolean; reward?: string; error?: string };
  recoverCalendarDay: (day: string) => { success: boolean; reward?: string; error?: string };
  recoverCalendarWeek: () => { success: boolean; reward?: string; error?: string };

  claimOnlineChest: () => { success: boolean; reward?: string; error?: string };
  setCardLoadout: (uids: string[]) => { success: boolean; error?: string };
  evolveCard: (uid: string, materialUids: string[], expectedLevel: number) => { success: boolean; error?: string; level?: number; spentGold?: number; consumed?: string[] };
  recycleCards: (sourceTemplateId: string, materialUids: string[]) => { success: boolean; error?: string; reward?: CardInstance; consumed?: string[]; sourceRarity?: Rarity; rewardRarity?: Rarity };
  plantFarmSeed: (plotId: string, seedId: string) => { success: boolean; error?: string };
  waterFarmPlot: (plotId: string) => { success: boolean; error?: string; secondsReduced?: number };
  fertilizeFarmPlot: (plotId: string) => { success: boolean; error?: string; fertility?: number };
  harvestFarmPlot: (plotId: string) => { success: boolean; error?: string; quantity?: number };
  unlockFarmPlot: () => { success: boolean; error?: string };
  cookFarmRecipe: (recipeId: string) => { success: boolean; error?: string; quantity?: number };
  mineResource: (nodeId: string, precision?: 0.5 | 1 | 1.5) => { success: boolean; error?: string; quantity?: number };
  fishSpot: (spotId: string, precision?: 0.5 | 1 | 1.5, baitId?: string) => { success: boolean; error?: string; quantity?: number; baitConsumed?: string; bonusQuantity?: number };
  equipProfessionTool: (uid: string) => { success: boolean; error?: string };
  buyProfessionTool: (templateId: string) => { success: boolean; error?: string };
  refineProfessionRecipe: (recipeId: string) => { success: boolean; error?: string; quantity?: number };
  
  depositItem: (uid: string) => { success: boolean; error?: string };
  withdrawItem: (uid: string) => { success: boolean; error?: string };
  depositMany: (uids: string[]) => { success: boolean; moved: number; error?: string };
  withdrawMany: (uids: string[]) => { success: boolean; moved: number; error?: string };
  claimArenaReward: (teamSize: 1 | 3 | 5) => { success: boolean; gold?: number; fragment?: string; remaining?: number; error?: string };
}



function recordHuntMetrics(character: Character, zoneId: string, result: TickResult) {
  const previous = character.huntStatsByZone?.[zoneId] ?? {
    activeMs: 0, kills: 0, damageDealt: 0, damageTaken: 0, xp: 0, gold: 0, goldSpentPotions: 0, soldGold: 0, lootValue: 0, history: [],
  } satisfies HuntZoneStats;
  const encounters = result.encounters ?? [];
  const updated: HuntZoneStats = {
    activeMs: previous.activeMs + (result.combatDurationMs ?? 0),
    kills: previous.kills + result.kills,
    damageDealt: previous.damageDealt + (result.damageDealt ?? 0),
    damageTaken: previous.damageTaken + (result.damageTaken ?? 0),
    xp: previous.xp + result.xp,
    gold: previous.gold + result.gold,
    goldSpentPotions: (previous.goldSpentPotions ?? 0) + (result.goldSpentPotions ?? 0),
    soldGold: previous.soldGold + (result.soldGold ?? 0),
    lootValue: previous.lootValue + encounters.reduce((sum, encounter) => sum + encounter.lootValue, 0),
    history: [...previous.history, ...encounters].slice(-100),
  };
  character.huntStatsByZone = { ...(character.huntStatsByZone ?? {}), [zoneId]: updated };
}

const EGG_RARITY_TABLES: Record<number, [number, number, number, number, number]> = {
  1: [95, 4, 1, 0, 0], 2: [75, 18, 6, 1, 0], 3: [50, 30, 15, 4, 1], 4: [25, 35, 25, 12, 3], 5: [8, 25, 35, 24, 8],
};
const RARITY_ORDER: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
function rollEggRarity(tier: number): Rarity {
  const roll = Math.random() * 100; let cursor = 0;
  for (const [index, chance] of (EGG_RARITY_TABLES[Math.max(1, Math.min(5, tier))] ?? EGG_RARITY_TABLES[1]).entries()) { cursor += chance; if (roll < cursor) return RARITY_ORDER[index]; }
  return "COMUM";
}
function eggIncubationMs(tier: number): number {
  // Tempo curto para o beta, mas suficiente para transformar a eclosão em uma
  // decisão de progressão, sem bloquear o primeiro ciclo de testes.
  return [0, 60, 180, 480, 1200, 2400][Math.max(1, Math.min(5, Math.floor(tier)))] * 1000;
}

export function createGameStore(runtime: {server?: boolean; persist?: (character: Character,races: Race[])=>void; notify?: (message:string)=>void; now?: () => number} = {}) {
const runtimeNow = runtime.now ?? (() => Date.now());
let tickInterval: ReturnType<typeof setInterval> | null = null;
const notify = runtime.notify ?? ((message:string)=>{if(typeof alert !== 'undefined') alert(message);});
const warn=(message:string)=>{if(runtime.server)throw Error(message);notify(message);};
return create<GameState>((set, get) => ({
  character: null, races: [], currentZoneId: "BOSQUE_LYSS", lastTickResult: null, isTickRunning: false, isTraining: false, offlineReport: null, deathReport: null, healingUntil: null,

  finishIntro: () => { const c=get().character; if(!c)return; set({character:{...c,introSeen:true}}); get().save(); },
  unlockZone: id => { const c=get().character; if(!c)return {success:false}; const next=structuredClone(c); const result=unlockJourneyZone(next,id); if(result.success){set({character:next});get().save();} return result; },
  newGame: (name, appearance) => {
    const char = createNewCharacter(name, appearance);
    const races: Race[] = [];
    trackRaceDiscovery(char, races);
    set({ character: char, races, currentZoneId: "BOSQUE_LYSS" });
    get().save();
  },

  updateAppearance: (appearance) => {
    const { character } = get();
    if (!character) return { success: false, error: "Personagem indisponível." };
    const next = JSON.parse(JSON.stringify(character));
    next.appearance = appearance;
    set({ character: next });
    get().save();
    return { success: true };
  },

  equipCosmetic: (templateId) => {
    const { character } = get();
    if (!character) return { success: false, error: "Personagem indisponível." };
    const template = ALL_ITEM_TEMPLATES[templateId];
    const definition = COSMETIC_DEFINITIONS[templateId];
    if (!template || !definition) return { success: false, error: "Cosmético inválido." };
    const owned = [...(character.inventory.items ?? []), ...(character.depot ?? []), ...Object.values(character.equipped ?? {})].some(item => item.templateId === templateId);
    if (!owned && !calendarUnlockedSkins(character).includes(templateId)) return { success: false, error: "Você ainda não possui este cosmético." };
    const next = structuredClone(character);
    next.cosmeticLoadout ??= {};
    next.cosmeticLoadout[definition.slot] = templateId;
    set({ character: next }); get().save();
    return { success: true };
  },

  unequipCosmetic: (slot) => {
    const { character } = get();
    if (!character) return { success: false, error: "Personagem indisponível." };
    if (!COSMETIC_SLOTS.some(entry => entry.key === slot)) return { success: false, error: "Espaço cosmético inválido." };
    const next = structuredClone(character);
    next.cosmeticLoadout = { ...(next.cosmeticLoadout ?? {}) };
    delete next.cosmeticLoadout[slot];
    set({ character: next }); get().save();
    return { success: true };
  },

  loadFromSave: () => {
    const save = loadGame();
    if (!save) return false;
    const timeAway = (runtimeNow() - save.character.lastTick) / 1000;
    let report = null;
    if (timeAway > 60 && !isGuided(save.character)) {
      report = { timeAwaySeconds: timeAway, xpGained: Math.floor(timeAway * 10), goldGained: Math.floor(timeAway * 2), itemsDropped: Math.floor(timeAway / 60), levelsGained: 0 };
    }

    const races = save.races || [];
    trackRaceDiscovery(save.character, races);

    set({ character: save.character, races, currentZoneId: save.character.currentZoneId ?? "BOSQUE_LYSS", offlineReport: report });
    get().save();
    return true;
  },

  refreshCompendium: () => {
    const { character, races } = get();
    if (!character) return;
    trackRaceDiscovery(character, races);
    set({ character: { ...character } });
    get().save();
  },

  clearOfflineReport: () => set({ offlineReport: null }),

  clearDeathReport: () => {
    const { character } = get();
    if (character) {
      character.hp = 1;
      set({ character: { ...character }, deathReport: null });
      get().save();
    }
  },

  healFull: () => {
    const { character } = get();
    if (!character) return;
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.hp = newChar.hpMax;
    newChar.mp = newChar.mpMax;
    set({ character: newChar, healingUntil: null });
    get().save();
  },

  startHealing: () => {
    const { character, healingUntil } = get();
    if (!character || healingUntil) return;
    set({ healingUntil: runtimeNow() + 15000 });
  },

  cancelHealing: () => {
    set({ healingUntil: null });
  },

  save: () => {
    const { character, races } = get();
    if (!character) return;
    const valid = ownedCosmeticLoadout(character);
    const next = character.cosmeticLoadout && JSON.stringify(valid) !== JSON.stringify(character.cosmeticLoadout) ? { ...character, cosmeticLoadout: valid } : character;
    if (next !== character) set({ character: next });
    if (runtime.persist) runtime.persist(next, races); else saveGame(next, races);
  },
  spendStatPoint: (stat) => {
    const { character } = get();
    if (!character || (character.statPoints ?? 0) < 1) return false;
    const updated: Character = {
      ...character,
      statPoints: character.statPoints - 1,
      skills: { ...character.skills, [stat]: character.skills[stat] + 1 },
    };
    recalcStats(updated);
    set({ character: updated });
    get().save();
    return true;
  },

  tick: () => {
    const { character, currentZoneId, isTickRunning, isTraining } = get();
    if (!character || (!isTickRunning && !isTraining)) return;

    // O relógio do baú é diário. A normalização acontece antes de qualquer
    // ganho para que uma sessão atravessando meia-noite não carregue o saldo
    // do dia anterior.
    normalizeOnlineChest(character, runtimeNow());

    if (isTraining) {
      const newCharacter = JSON.parse(JSON.stringify(character));
      const skill = newCharacter.trainingSkill;
      if (skill) {
        const beforeSeconds = Number(newCharacter.trainingSeconds?.[skill] ?? 0);
        const trainingLog = applyTraining(newCharacter, runtimeNow());
        newCharacter.onlineChestSeconds = (newCharacter.onlineChestSeconds ?? 0) + 3;
        trackQuestAction(newCharacter,"TRAIN",Number(newCharacter.trainingSeconds?.[skill] ?? 0)-beforeSeconds);
        recalcStats(newCharacter);
        const result: TickResult = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: trainingLog, enemyHp: 0, enemyMaxHp: 0, skillLevelUp: trainingLog.length ? trainingLog.join(' · ') : undefined };
        set({ character: newCharacter, lastTickResult: result });
        get().save();
        if (isGuided(newCharacter) && newCharacter.quests.active.TUT_TRAIN && checkQuestCompletion(newCharacter,"TUT_TRAIN")) get().stopTraining();
      }
      return;
    }

    // A zona persistida no personagem é a fonte de verdade no modo online.
    // Durante a reconciliação pode existir um frame em que currentZoneId ainda
    // aponta para o refúgio; usar o valor do personagem evita parar a caça.
    const activeZoneId = character.currentZoneId || currentZoneId;
    const zone = ZONES[activeZoneId];
    if (!zone || character.level < zone.minLevel) { get().stopHunting(); return; }

    if (isGuided(character)) character.lastTick = runtimeNow() - 3000;
    const result = processTick(character, zone, !isGuided(character) && runtimeNow() - character.lastTick > 15000);
    recordHuntMetrics(character, zone.id, result);

    if (result.death && result.deathData) {
      get().stopHunting();
      set({ deathReport: result.deathData, lastTickResult: result, character: { ...character } });
      get().save();
      return;
    }

    updateQuestProgress(character, result);
    character.onlineChestSeconds = (character.onlineChestSeconds ?? 0) + 3;
    recalcStats(character);
    set({ character: { ...character }, currentZoneId: activeZoneId, lastTickResult: result });
    get().save();
    // Concluir uma etapa do tutorial não encerra a caça. O jogador precisa
    // poder continuar no mapa e abrir a missão quando quiser; só a stamina
    // esgotada (ou morte, tratada acima) deve interromper o ciclo automático.
    if (result.staminaDepleted) get().stopHunting();
  },

  startHunting: (zoneId) => {
    const { character, healingUntil } = get();
    if (!character) return;
    // Migra contas antigas que ficaram com a introdução marcada como pendente
    // embora já tenham progresso real. Isso não altera quests nem recompensas;
    // apenas remove um portão de tutorial impossível de concluir.
    const repairedJourney = repairLegacyJourney(character);
    if (healingUntil) return warn("Você está meditando! Termine antes de caçar.");
    if (character.hp <= 0) return warn("Você precisa se curar na Casa antes de caçar!");
    if (!Number.isFinite(character.staminaOnline)) character.staminaOnline = 120;
    if ((character.staminaOnline ?? 120) <= 0) return warn("Sua stamina online acabou. Continue sua jornada offline para recuperar essa reserva.");

    const zone = ZONES[zoneId];
    if (!zone || !canEnterZone(character,zoneId)) return warn('Abra a travessia com a missão e o NPC em Jornadas.');
    if (!canTutorialHunt(character)) return warn('Abra a missão da iniciação e siga a próxima etapa antes de caçar.');
    if (character.level < zone.minLevel) return;

    if (tickInterval) clearInterval(tickInterval);
    character.currentZoneId = zoneId;
    character.trainingSkill = null;

    if (!character.activeEnemyId || !zone.enemies.find(e => e.id === character.activeEnemyId)) {
      character.activeEnemyId = zone.enemies[0].id;
      character.enemyHp = zone.enemies[0].hp * zone.enemies[0].difficulty;
    }
    set({ isTickRunning: true, isTraining: false, currentZoneId: zoneId, character: { ...character } });
    if (repairedJourney) get().save();
    if (!runtime.server) { get().tick();
    if (get().isTickRunning || get().isTraining) tickInterval = setInterval(() => get().tick(), 3000); }
  },

  startTraining: (skill) => {
    const { character, healingUntil } = get();
    if (!character) return;
    if (isGuided(character) && !character.quests.active.TUT_TRAIN) return warn("O treino será apresentado na etapa Disciplina antes da força.");
    if (healingUntil) return warn("Termine sua meditação primeiro!");

    if (tickInterval) clearInterval(tickInterval);
    character.trainingSkill = skill;
    character.trainingLastTick = runtimeNow();
    character.lastTick = runtimeNow();
    set({ isTickRunning: false, isTraining: true, character: { ...character } });
    if (!runtime.server) { get().tick();
    tickInterval = setInterval(() => get().tick(), 3000); }
  },

  armSpecialCombo: (power = 1.5) => {
    const { character, isTickRunning } = get();
    if (!character || !isTickRunning) return { success: false, error: "O combo só pode ser armado durante a caça." };
    const now = runtimeNow();
    if ((character.comboCooldownUntil ?? 0) > now) return { success: false, error: `Aguarde ${Math.ceil((character.comboCooldownUntil! - now) / 1000)}s para recarregar.` };
    const updated = JSON.parse(JSON.stringify(character));
    updated.comboReadyUntil = now + 12_000;
    updated.comboPower = power;
    set({ character: updated }); get().save();
    // No modo local, resolve o próximo golpe imediatamente. Antes disso o
    // combo ficava aguardando o próximo intervalo de caça (até 3s), fazendo
    // o toque parecer atrasado. O servidor já executa o tick na mesma
    // transação de `armSpecialCombo`, portanto esta aceleração só vale para
    // a sessão local e não altera o balanceamento online.
    if (!runtime.server) queueMicrotask(() => { if (get().isTickRunning) get().tick(); });
    return { success: true };
  },

  stopHunting: () => {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = null;
    set({ isTickRunning: false });
  },

  stopTraining: () => {
    if (tickInterval) clearInterval(tickInterval);
    tickInterval = null;
    const { character } = get();
    if (character) { character.trainingSkill = null; character.trainingLastTick = undefined; character.lastTick = runtimeNow(); set({ isTraining: false, character: { ...character } }); get().save(); }
  },

  setActiveEnemy: (enemyId) => {
    const { character, currentZoneId } = get(); if (!character) return;
    const zone = ZONES[currentZoneId];
    const enemy = zone.enemies.find(e => e.id === enemyId);
    if (!enemy || character.level < (enemy.minLevel ?? 1)) return;
    character.activeEnemyId = enemyId;
    character.enemyHp = (enemy?.hp || 0) * (enemy?.difficulty || 1);
    character.enemyHpId = enemyId;
    set({ character: { ...character } }); get().save();
  },

  setCurrentZone: (zoneId) => {
    if (!ZONES[zoneId] || (get().character && !canEnterZone(get().character!,zoneId))) return;
    set({ currentZoneId: zoneId });
    const { character } = get();
    if (character) { character.currentZoneId = zoneId; character.activeEnemyId = ZONES[zoneId].enemies[0]?.id; character.enemyHp = undefined; character.enemyHpId = undefined; set({ character: { ...character } }); get().save(); }
  },

  equip: (uid, force = false) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const result = equipItem(newCharacter, uid, force);
    if (result.success) { set({ character: newCharacter }); get().save(); }
    return result;
  },

  unequip: (slot) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const result = unequipItem(newCharacter, slot);
    if (result.success) { set({ character: newCharacter }); get().save(); }
    return result;
  },

  synthesize: (a, s, p) => {
    const { character, races } = get();
    if (!character) return { success: false, error: "Sem personagem" };

    const namedRace = findNamedRace(a, s, p);
    const raceId = namedRace ? namedRace.id : generateRaceId(a, s, p);

    const alreadyExists = races.find(r => r.id === raceId);
    if (alreadyExists) {
      return { success: false, error: `Você já descobriu "${alreadyExists.name}"! Escolha uma combinação diferente.` };
    }

    const newCharacter = JSON.parse(JSON.stringify(character));
    const hasA = newCharacter.inventory.items.find((i: any) => i.componentType === "ATAQUE" && i.templateId === a);
    const hasS = newCharacter.inventory.items.find((i: any) => i.componentType === "SUPORTE" && i.templateId === s);
    const hasP = newCharacter.inventory.items.find((i: any) => i.componentType === "PASSIVA" && i.templateId === p);

    if (!hasA || !hasS || !hasP) return { success: false, error: "Faltam componentes no inventário." };

    removeItem(newCharacter.inventory, hasA.uid, 1);
    removeItem(newCharacter.inventory, hasS.uid, 1);
    removeItem(newCharacter.inventory, hasP.uid, 1);

    let newRace: Race;
    if (namedRace) {
      newRace = { ...namedRace };
    } else {
      newRace = {
        id: raceId,
        name: generateRaceName(a, s, p),
        tier: "COMUM",
        ataqueId: a, suporteId: s, passivaId: p,
        skills: { ataque: "Ataque Sintetizado", suporte: "Suporte Sintetizado", passiva: "Passiva Sintetizada" },
        bonus: generateRaceBonus(a, s, p),
      };
    }

    const newRaces = [...races, newRace];
    trackRaceDiscovery(newCharacter, newRaces);
    trackQuestAction(newCharacter, "SYNTHESIZE");

    set({ character: newCharacter, races: newRaces });
    get().save();
    return { success: true };
  },

  equipRace: (race) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.raceId = race.id; newCharacter.activeRace = race;
    trackQuestAction(newCharacter, "EQUIP_RACE");
    recalcStats(newCharacter); set({ character: newCharacter }); get().save();
  },

  unequipRace: () => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.raceId = undefined;
    newCharacter.activeRace = undefined;
    recalcStats(newCharacter);
    set({ character: newCharacter });
    get().save();
  },

  equipDivineBeast: (id) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    if (!DIVINE_BEASTS[id] || !(character.divineBeasts ?? []).some(beast => beast.id === id)) {
      return { success: false, error: "Essa Besta Divina ainda não foi vinculada." };
    }
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.activeDivineBeastId = id;
    recalcStats(newCharacter);
    set({ character: newCharacter });
    get().save();
    return { success: true };
  },

  hatchEgg: (uid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const egg = character.inventory.items.find(item => item.uid === uid);
    if (!egg || !DIVINE_BEAST_EGG_TEMPLATES[egg.templateId]) return { success: false, error: "Escolha um Ovo de Besta Divina." };
    const now = runtimeNow();
    const incubator = character.divineBeastIncubator;
    if (!incubator) {
      const next = structuredClone(character);
      next.divineBeastIncubator = { eggUid: uid, tier: egg.tier, startedAt: now, completesAt: now + eggIncubationMs(egg.tier) };
      set({ character: next }); get().save();
      notify(`Incubação iniciada. O ovo estará pronto em ${Math.ceil(eggIncubationMs(egg.tier) / 1000)}s.`);
      return { success: true, started: true, readyAt: next.divineBeastIncubator.completesAt };
    }
    if (incubator.eggUid !== uid) return { success: false, error: "Já existe um ovo na incubadora. Aguarde a eclosão antes de iniciar outro." };
    if (now < incubator.completesAt) return { success: false, error: `A incubação termina em ${Math.ceil((incubator.completesAt - now) / 1000)}s.`, remainingMs: incubator.completesAt - now };
    const rarity = rollEggRarity(egg.tier);
    const ids = Object.keys(DIVINE_BEASTS) as DivineBeastId[];
    const beastId = ids[Math.floor(Math.random() * ids.length)];
    const next = structuredClone(character);
    removeItem(next.inventory, uid, 1);
    next.divineBeastIncubator = undefined;
    next.divineBeasts = [...(next.divineBeasts ?? []), { id: beastId, instanceId: generateId(), rarity, obtainedAt: runtimeNow() }];
    set({ character: next }); get().save();
    notify(`O ovo eclodiu: ${DIVINE_BEASTS[beastId].name} · ${rarity}!`);
    return { success: true, beastId, rarity };
  },

  combineBeast: (id) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const copies = (character.divineBeasts ?? []).filter(beast => beast.id === id);
    const ration = character.inventory.items.find(item => item.templateId === "RACAO_DOMADOR");
    if (copies.length < 5) return { success: false, error: "São necessárias 4 cópias excedentes no cativeiro; o melhor exemplar é preservado." };
    if (!ration) return { success: false, error: "É necessária uma Ração Especial do Domador." };
    const rank: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
    const next = structuredClone(character);
    const indexed = (next.divineBeasts ?? []).map((beast, index) => ({ beast, index })).filter(entry => entry.beast.id === id);
    indexed.sort((a, b) => (rank.indexOf(b.beast.rarity ?? "COMUM") - rank.indexOf(a.beast.rarity ?? "COMUM")) || (b.beast.obtainedAt - a.beast.obtainedAt));
    const captive = indexed.slice(1);
    const current = Math.max(...captive.slice(0, 4).map(entry => rank.indexOf(entry.beast.rarity ?? "COMUM")));
    if (current >= rank.length - 1) return { success: false, error: "Esta linhagem já está no ápice lendário." };
    const consume = new Set(captive.slice(0, 4).map(entry => entry.index));
    next.divineBeasts = (next.divineBeasts ?? []).filter((_, index) => !consume.has(index));
    removeItem(next.inventory, ration.uid, 1);
    const rarity = rank[current + 1];
    next.divineBeasts.push({ id, instanceId: generateId(), rarity, obtainedAt: runtimeNow() });
    set({ character: next }); get().save();
    notify(`A linhagem foi aprimorada para ${rarity}!`);
    return { success: true, rarity };
  },

  sellDivineBeast: (id, instanceId) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const copies = (character.divineBeasts ?? []).filter(beast => beast.id === id);
    if (copies.length < 2) return { success: false, error: "O melhor exemplar precisa permanecer na coleção. Encontre outra cópia para vender." };
    const rank: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
    const next = structuredClone(character);
    const indexed = (next.divineBeasts ?? []).map((beast, index) => ({ beast, index })).filter(entry => entry.beast.id === id);
    indexed.sort((a, b) => (rank.indexOf(a.beast.rarity ?? "COMUM") - rank.indexOf(b.beast.rarity ?? "COMUM")) || (a.beast.obtainedAt - b.beast.obtainedAt));
    const candidate = instanceId ? indexed.find(entry => entry.beast.instanceId === instanceId) : indexed[0];
    if (!candidate) return { success: false, error: "Pet não encontrado no cativeiro." };
    const gold = divineBeastSellValue(candidate.beast.rarity);
    next.divineBeasts = (next.divineBeasts ?? []).filter((_, index) => index !== candidate.index);
    next.gold += gold;
    set({ character: next }); get().save();
    notify(`Pet enviado ao Mercado do Domador por ${gold.toLocaleString("pt-BR")} gold.`);
    return { success: true, gold };
  },

  feedDivineBeast: (id, foodUid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Nenhum personagem ativo." };
    if (character.activeDivineBeastId !== id) return { success: false, error: "Ative esta Besta antes de alimentá-la." };
    const item = character.inventory.items.find(entry => entry.uid === foodUid);
    if (!item) return { success: false, error: "Alimento não encontrado na mochila." };
    const food = ({
      CENOURA_PET: { minutes: 5, mood: 2 },
      FRUTA_MEL: { minutes: 10, mood: 5 },
      MELANCIA_LUNAR: { minutes: 15, mood: 8 },
      RACAO_DOMADOR: { minutes: 30, mood: 12 },
      CALDO_MARCA_DAGUA: { minutes: 20, mood: 10 },
    } as Record<string, { minutes: number; mood: number }>)[item.templateId];
    if (!food) return { success: false, error: "Este item não é alimento para Bestas Divinas." };
    const now = runtimeNow();
    const previous = character.divineBeastNeeds?.[id] ?? { nutrition: 0, mood: 70, updatedAt: now };
    const elapsedMinutes = Math.max(0, (now - previous.updatedAt) / 60000);
    const needs: DivineBeastNeeds = {
      nutrition: Math.max(0, Math.min(100, previous.nutrition - elapsedMinutes * 0.5 + food.minutes * 2)),
      mood: Math.max(0, Math.min(100, previous.mood - elapsedMinutes * 0.15 + food.mood)),
      updatedAt: now,
    };
    if ((item.quantity ?? 1) > 1) item.quantity -= 1; else character.inventory.items = character.inventory.items.filter(entry => entry.uid !== foodUid);
    character.divineBeastNeeds = { ...(character.divineBeastNeeds ?? {}), [id]: needs };
    set({ character: { ...character } }); get().save();
    return { success: true };
  },

  unequipDivineBeast: () => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.activeDivineBeastId = undefined;
    recalcStats(newCharacter);
    set({ character: newCharacter });
    get().save();
  },

  sellItem: (uid, qty = 1) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = sellItem(newCharacter, uid, qty);
    if (!res.success) return;
    trackQuestAction(newCharacter, "SELL", res.count);
    set({ character: newCharacter }); get().save();
  },

  sellSelected: (uids) => {
    const { character } = get(); if (!character || !uids.length) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = sellSelectedItems(newCharacter, uids);
    if (!res.count) return;
    trackQuestAction(newCharacter, "SELL", res.count);
    set({ character: newCharacter }); get().save(); notify(`Vendeu ${res.count} itens por ${res.gold.toLocaleString("pt-BR")} gold.`);
  },

  discardItem: (uid, qty = 1) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const item = newCharacter.inventory.items.find((entry: any) => entry.uid === uid);
    if (!item) return { success: false, error: "Item não encontrado na mochila." };
    if (!Number.isInteger(qty) || qty < 1 || qty > 999) return { success: false, error: "Quantidade inválida." };
    removeItem(newCharacter.inventory, uid, Math.min(qty, item.quantity));
    set({ character: newCharacter }); get().save();
    return { success: true };
  },

  plantFarmSeed: (plotId, seedId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const seed = farmSeed(seedId); if (!seed) return { success: false, error: "Semente inválida." };
    const next = JSON.parse(JSON.stringify(character)); next.farm ??= { plots: [], unlockedPlots: 1, lastActionAt: runtimeNow(), skills: { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 } }; next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 };
    const plot = next.farm.plots.find((entry: any) => entry.id === plotId);
    if (!plot || next.farm.plots.indexOf(plot) >= next.farm.unlockedPlots) return { success: false, error: "Canteiro bloqueado." };
    if (plot.seedId) return { success: false, error: "Este canteiro já está plantado." };
    if (next.gold < seed.cost) return { success: false, error: "Gold insuficiente para comprar esta semente." };
    const fertility = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX)));
    const skill = Number(next.farm.skills.planting ?? 0); const speedBonus = Math.min(0.25, skill * 0.01); const fertilityPenalty = (FARM_FERTILITY_MAX - fertility) / 200; const growMs = Math.max(30_000, Math.round(seed.growMs * (1 - speedBonus + fertilityPenalty)));
    next.gold -= seed.cost; plot.fertility = fertility; plot.seedId = seed.id; plot.plantedAt = runtimeNow(); plot.readyAt = runtimeNow() + growMs; plot.wateredAt = runtimeNow(); plot.waterCount = 0; next.farm.skills.planting += 1; next.farm.lastActionAt = runtimeNow(); set({ character: next }); get().save(); return { success: true };
  },
  waterFarmPlot: (plotId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const next = JSON.parse(JSON.stringify(character)); const plot = next.farm?.plots?.find((entry: any) => entry.id === plotId);
    if (!plot?.seedId || !plot.readyAt) return { success: false, error: "Este canteiro não possui uma plantação ativa." };
    const now = runtimeNow(); if (now >= plot.readyAt) return { success: false, error: "A plantação já está pronta para colher." };
    const waterCount = Number(plot.waterCount ?? 0); if (waterCount >= 3) return { success: false, error: "Esta plantação já recebeu toda a irrigação possível." };
    if (plot.wateredAt && now - plot.wateredAt < 60_000) return { success: false, error: `A terra ainda está úmida. Aguarde ${Math.ceil((60_000 - (now - plot.wateredAt)) / 1000)}s.` };
    const remaining = Math.max(30_000, plot.readyAt - now); const reduction = Math.max(5_000, Math.round(remaining * 0.08));
    plot.readyAt = Math.max(now + 30_000, plot.readyAt - reduction); plot.wateredAt = now; plot.waterCount = waterCount + 1;
    next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }; next.farm.skills.irrigation = Number(next.farm.skills.irrigation ?? 0) + 1; next.farm.lastActionAt = now;
    set({ character: next }); get().save(); return { success: true, secondsReduced: Math.round(reduction / 1000) };
  },
  fertilizeFarmPlot: (plotId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const next = JSON.parse(JSON.stringify(character)); const plot = next.farm?.plots?.find((entry: any) => entry.id === plotId);
    if (!plot) return { success: false, error: "Canteiro não encontrado." };
    if (plot.seedId) return { success: false, error: "Adube o canteiro entre colheitas, antes de plantar novamente." };
    const current = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX)));
    if (current >= FARM_FERTILITY_MAX) return { success: false, error: "Este canteiro já está com fertilidade máxima." };
    const compost = next.inventory.items.find((item: any) => item.templateId === "COMPOSTO_LYSS");
    if (!compost) return { success: false, error: "É necessário um Composto Fértil de Lyss." };
    removeItem(next.inventory, compost.uid, 1); plot.fertility = Math.min(FARM_FERTILITY_MAX, current + FARM_FERTILITY_COMPOST_GAIN);
    next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }; next.farm.skills.fertility = Number(next.farm.skills.fertility ?? 0) + 1; next.farm.lastActionAt = runtimeNow(); set({ character: next }); get().save(); return { success: true, fertility: plot.fertility };
  },
  harvestFarmPlot: (plotId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const next = JSON.parse(JSON.stringify(character)); const plot = next.farm?.plots?.find((entry: any) => entry.id === plotId); const seed = plot?.seedId ? farmSeed(plot.seedId) : undefined;
    if (!plot || !seed) return { success: false, error: "Não há cultivo neste canteiro." }; if (!plot.readyAt || runtimeNow() < plot.readyAt) return { success: false, error: "A plantação ainda está crescendo." };
    next.farm.skills ??= { planting: 0, harvesting: 0, irrigation: 0, fertility: 0 }; const fertility = Math.max(FARM_FERTILITY_MIN, Math.min(FARM_FERTILITY_MAX, Number(plot.fertility ?? FARM_FERTILITY_MAX))); const quantity = farmYield(seed, fertility, Number(next.farm.skills.harvesting ?? 0)); addItem(next.inventory, quantity); plot.fertility = Math.max(FARM_FERTILITY_MIN, fertility - FARM_FERTILITY_LOSS_PER_HARVEST); plot.seedId = undefined; plot.plantedAt = undefined; plot.readyAt = undefined; plot.wateredAt = undefined; plot.waterCount = undefined; next.farm.skills.harvesting += 1; next.farm.lastActionAt = runtimeNow(); set({ character: next }); get().save(); return { success: true, quantity: quantity.quantity };
  },
  unlockFarmPlot: () => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const next = JSON.parse(JSON.stringify(character)); next.farm ??= { plots: [], unlockedPlots: 1, lastActionAt: runtimeNow() };
    const cost = farmExpansionCost(next.farm.unlockedPlots);
    if (!cost) return { success: false, error: "Todos os terrenos já foram liberados." };
    if (cost.kind === "gold") {
      if (next.gold < cost.amount) return { success: false, error: `Você precisa de ${cost.label}.` };
      next.gold -= cost.amount;
    } else {
      if ((next.mythreonCoins ?? 0) < cost.amount) return { success: false, error: `Você precisa de ${cost.label}.` };
      next.mythreonCoins = (next.mythreonCoins ?? 0) - cost.amount;
    }
    next.farm.unlockedPlots += 1;
    next.farm.plots.push({ id: `plot-${next.farm.unlockedPlots}`, fertility: FARM_FERTILITY_MAX });
    set({ character: next }); get().save(); return { success: true };
  },
  cookFarmRecipe: (recipeId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const recipe = farmRecipe(recipeId); if (!recipe) return { success: false, error: "Receita inválida." };
    const next = JSON.parse(JSON.stringify(character));
    for (const ingredient of recipe.ingredients) { const total = next.inventory.items.filter((item: any) => item.templateId === ingredient.templateId).reduce((sum: number, item: any) => sum + item.quantity, 0); if (total < ingredient.quantity) return { success: false, error: `Faltam materiais para ${recipe.name}.` }; }
    for (const ingredient of recipe.ingredients) { let remaining = ingredient.quantity; for (const item of [...next.inventory.items]) { if (item.templateId !== ingredient.templateId || remaining <= 0) continue; const take = Math.min(remaining, item.quantity); removeItem(next.inventory, item.uid, take); remaining -= take; } }
    addItem(next.inventory, farmRecipeOutput(recipe)); set({ character: next }); get().save(); return { success: true, quantity: recipe.outputQuantity };
  },

  equipProfessionTool: (uid) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const next = structuredClone(character);
    const item = next.inventory.items.find(entry => entry.uid === uid);
    if (!item || item.category !== "FERRAMENTA" || !item.profession) return { success: false, error: "Escolha uma ferramenta de profissão válida." };
    const skill = item.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
    if (skill < Number(item.requiredSkill ?? 0)) return { success: false, error: `Requer ${item.profession === "MINERACAO" ? "mineração" : "pesca"} ${item.requiredSkill ?? 0}.` };
    removeItem(next.inventory, uid, 1);
    const field = item.profession === "MINERACAO" ? "equippedMiningTool" : "equippedFishingRod";
    const previous = next[field];
    if (previous) addItem(next.inventory, previous);
    next[field] = item;
    set({ character: next }); get().save();
    return { success: true };
  },

  buyProfessionTool: (templateId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const offer = PROFESSION_TOOL_SHOP.find(entry => entry.templateId === templateId);
    const template = PROFESSION_TOOL_TEMPLATES[templateId];
    if (!offer || !template) return { success: false, error: "Ferramenta indisponível." };
    const next = structuredClone(character);
    if ([...next.inventory.items, ...next.depot, next.equippedMiningTool, next.equippedFishingRod].some(item => item?.templateId === templateId)) return { success: false, error: "Você já possui esta ferramenta na mochila, no depósito ou equipada." }; const skill = offer.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
    if (skill < offer.requiredSkill) return { success: false, error: `Requer ${offer.profession === "MINERACAO" ? "mineração" : "pesca"} ${offer.requiredSkill}.` };
    if (next.gold < offer.gold) return { success: false, error: `Você precisa de ${offer.gold.toLocaleString("pt-BR")} gold.` };
    const item = createItem({ ...template, uid: generateId() });
    if (!addItem(next.inventory, item)) return { success: false, error: "Bolsa cheia. Libere espaço antes de comprar." };
    next.gold -= offer.gold;
    set({ character: next }); get().save(); notify(`${template.name} entregue. Equipe-a para liberar o próximo veio ou ponto.`);
    return { success: true, templateId };
  },

  refineProfessionRecipe: (recipeId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const recipe = PROFESSION_RECIPES.find(entry => entry.id === recipeId);
    if (!recipe) return { success: false, error: "Receita de profissão inválida." };
    const next = structuredClone(character);
    const skill = recipe.profession === "MINERACAO" ? Number(next.professions?.mining ?? 0) : Number(next.professions?.fishing ?? 0);
    if (skill < recipe.requiredSkill) return { success: false, error: `Requer ${recipe.profession === "MINERACAO" ? "mineração" : "pesca"} ${recipe.requiredSkill}.` };
    for (const ingredient of recipe.ingredients) if (countByTemplate(next.inventory, ingredient.templateId) < ingredient.quantity) return { success: false, error: `Faltam materiais para ${recipe.name}.` };
    for (const ingredient of recipe.ingredients) {
      let remaining = ingredient.quantity;
      for (const item of [...next.inventory.items]) {
        if (item.templateId !== ingredient.templateId || remaining <= 0) continue;
        const take = Math.min(remaining, item.quantity); removeItem(next.inventory, item.uid, take); remaining -= take;
      }
    }
    const output = makeMaterial(recipe.outputTemplateId);
    if (!output) return { success: false, error: "Produto de refino indisponível." };
    output.quantity = recipe.outputQuantity;
    if (!addItem(next.inventory, output)) return { success: false, error: "Bolsa cheia. Libere espaço antes de refinar." };
    set({ character: next }); get().save(); notify(`${recipe.name} concluído: ${recipe.outputQuantity} unidade(s).`);
    return { success: true, quantity: recipe.outputQuantity };
  },

  mineResource: (nodeId, precision = 1) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const node = MINING_NODES.find(entry => entry.id === nodeId); if (!node) return { success: false, error: "Veio de mineração inválido." };
    if (!canEnterZone(character, node.zoneId)) return { success: false, error: "Conclua a travessia deste bioma em Jornadas para minerar aqui." };
    const next = JSON.parse(JSON.stringify(character)); next.professions ??= { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
    const skill = Number(next.professions.mining ?? 0); if (skill < node.requiredSkill) return { success: false, error: `Mineração ${node.requiredSkill} necessária.` };
    const tool = next.equippedMiningTool; if (!tool || Number(tool.tier ?? 0) < node.tier) return { success: false, error: `Equipe uma picareta T${node.tier} ou superior.` };
    const now = runtimeNow(); const cooldown = professionCooldown(skill); if (now - Number(next.professions.lastMiningAt ?? 0) < cooldown) return { success: false, error: `A picareta precisa descansar ${Math.ceil((cooldown - (now - Number(next.professions.lastMiningAt ?? 0))) / 1000)}s.` };
    const quality = precision === 1.5 ? 1.25 : precision === 0.5 ? 0.85 : 1; const quantity = Math.max(1, Math.floor((1 + Math.floor(skill / 30)) * quality)); const template = ALL_ITEM_TEMPLATES[node.dropTemplateId]; const drop = createItem({ ...(template ?? { templateId: node.dropTemplateId, name: node.dropName, category: "MATERIAL", tier: node.tier, rarity: node.tier >= 4 ? "EPICO" : node.tier >= 3 ? "RARO" : "COMUM", icon: node.dropIcon, stackable: true, maxStack: 999 }), uid: generateId(), quantity, stackable: true, maxStack: 999 });
    if (!addItem(next.inventory, drop)) return { success: false, error: "Bolsa cheia. Libere espaço para guardar o minério." };
    next.professions.mining = skill + (precision === 1.5 ? 2 : 1); next.professions.lastMiningAt = now; set({ character: next }); get().save(); return { success: true, quantity };
  },
  fishSpot: (spotId, precision = 1, baitId) => {
    const { character } = get(); if (!character) return { success: false, error: "Personagem indisponível." };
    const spot = FISHING_SPOTS.find(entry => entry.id === spotId); if (!spot) return { success: false, error: "Ponto de pesca inválido." };
    if (!canEnterZone(character, spot.zoneId)) return { success: false, error: "Conclua a travessia deste bioma em Jornadas para pescar aqui." };
    const next = JSON.parse(JSON.stringify(character)); next.professions ??= { mining: 0, fishing: 0, lastMiningAt: 0, lastFishingAt: 0 };
    const skill = Number(next.professions.fishing ?? 0); if (skill < spot.requiredSkill) return { success: false, error: `Pesca ${spot.requiredSkill} necessária.` };
    const rod = next.equippedFishingRod; if (!rod || Number(rod.tier ?? 0) < spot.rodTier) return { success: false, error: `Equipe uma vara T${spot.rodTier} ou superior.` };
    if (baitId !== undefined && baitId !== FISHING_BAIT.templateId) return { success: false, error: "Isca inválida." };
    if (baitId && countByTemplate(next.inventory, baitId) < FISHING_BAIT.quantity) return { success: false, error: "A isca escolhida não está mais na mochila." };
    const now = runtimeNow(); const cooldown = professionCooldown(skill); if (now - Number(next.professions.lastFishingAt ?? 0) < cooldown) return { success: false, error: `A linha ainda está na água. Aguarde ${Math.ceil((cooldown - (now - Number(next.professions.lastFishingAt ?? 0))) / 1000)}s.` };
    const quality = precision === 1.5 ? 1.25 : precision === 0.5 ? 0.85 : 1; const quantity = Math.max(1, Math.floor((1 + Math.floor(skill / 35)) * quality)); const template = ALL_ITEM_TEMPLATES[spot.dropTemplateId]; const drop = createItem({ ...(template ?? { templateId: spot.dropTemplateId, name: spot.dropName, category: "MATERIAL", tier: spot.rodTier, rarity: spot.rodTier >= 4 ? "EPICO" : spot.rodTier >= 3 ? "RARO" : "COMUM", icon: spot.dropIcon, stackable: true, maxStack: 999 }), uid: generateId(), quantity, stackable: true, maxStack: 999 });
    if (baitId) {
      const baitStack = next.inventory.items.find((item: import("../types").Item) => item.templateId === baitId && item.quantity > 0)!;
      removeItem(next.inventory, baitStack.uid, FISHING_BAIT.quantity);
      drop.quantity += FISHING_BAIT.bonusFish;
    }
    if (!addItem(next.inventory, drop)) return { success: false, error: "Bolsa cheia. Libere espaço para guardar o peixe." };
    next.professions.fishing = skill + (precision === 1.5 ? 2 : 1); next.professions.lastFishingAt = now; set({ character: next }); get().save(); return { success: true, quantity: drop.quantity, ...(baitId ? { baitConsumed: baitId, bonusQuantity: FISHING_BAIT.bonusFish } : {}) };
  },

  salvageAll: (maxRarity) => {
    const { character } = get(); if (!character) return;
    const newChar = JSON.parse(JSON.stringify(character));
    const res = salvageAllEquipment(newChar, maxRarity);
    newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
    updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
    set({ character: newChar }); get().save(); notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
  },

  salvageSelected: (uids) => {
    const { character } = get(); if (!character || uids.length === 0) return;
    const newChar = JSON.parse(JSON.stringify(character));
    const res = salvageSelectedEquipment(newChar, uids);
    if (!res.items) return;
    newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
    updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
    set({ character: newChar }); get().save(); notify(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
  },

  updateSettings: (settings) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    if (settings.autoPotion !== undefined) newCharacter.autoPotion = settings.autoPotion;
    const premiumAutomation = Boolean(newCharacter.premium);
    if (settings.autoSell !== undefined && premiumAutomation) newCharacter.autoSell = settings.autoSell;
    if (settings.autoSellTemplateIds !== undefined && !premiumAutomation) notify("Auto-venda por raridade e por item é um benefício do Premium Account.");
    if (settings.autoSalvage !== undefined) newCharacter.autoSalvage = settings.autoSalvage;
    if (settings.autoSellTemplateIds !== undefined && premiumAutomation) {
      newCharacter.autoSellTemplateIds = settings.autoSellTemplateIds;
      newCharacter.autoSalvageTemplateIds = (newCharacter.autoSalvageTemplateIds ?? []).filter((id: string) => !settings.autoSellTemplateIds.includes(id));
    }
    if (settings.autoSalvageTemplateIds !== undefined) {
      newCharacter.autoSalvageTemplateIds = settings.autoSalvageTemplateIds;
      newCharacter.autoSellTemplateIds = (newCharacter.autoSellTemplateIds ?? []).filter((id: string) => !settings.autoSalvageTemplateIds.includes(id));
    }
    if (settings.ignoredLootTemplateIds !== undefined) newCharacter.ignoredLootTemplateIds = settings.ignoredLootTemplateIds;
    if (settings.autoHpPotionId !== undefined) newCharacter.autoHpPotionId = settings.autoHpPotionId;
    if (settings.autoHpPotionPercent !== undefined) newCharacter.autoHpPotionPercent = settings.autoHpPotionPercent;
    if (settings.autoHpPotionEnabled !== undefined) newCharacter.autoHpPotionEnabled = settings.autoHpPotionEnabled;
    if (settings.autoMpPotionId !== undefined) newCharacter.autoMpPotionId = settings.autoMpPotionId;
    if (settings.autoMpPotionPercent !== undefined) newCharacter.autoMpPotionPercent = settings.autoMpPotionPercent;
    if (settings.autoMpPotionEnabled !== undefined) newCharacter.autoMpPotionEnabled = settings.autoMpPotionEnabled;
    if (["autoHpPotionId", "autoHpPotionPercent", "autoHpPotionEnabled", "autoMpPotionId", "autoMpPotionPercent", "autoMpPotionEnabled"].some(key => settings[key] !== undefined)) {
      trackQuestAction(newCharacter, "CONFIGURE_POTIONS");
    }
    set({ character: newCharacter }); get().save();
  },

  activateBuff: () => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    const durationMs = newCharacter.premium ? 30 * 60 * 1000 : 5 * 60 * 1000;
    const currentBuff = newCharacter.doubleAtkUntil && newCharacter.doubleAtkUntil > runtimeNow() ? newCharacter.doubleAtkUntil : runtimeNow();
    newCharacter.doubleAtkUntil = currentBuff + durationMs;
    set({ character: newCharacter }); get().save();
  },

  acceptQuest: (id) => {
    const { character, races } = get(); if (!character) return;
    if (!getAvailableQuests(character).some(q=>q.id===id)) return;
    const newChar = JSON.parse(JSON.stringify(character));
    if (!newChar.quests) newChar.quests = { active: {}, completed: [] };
    if (!newChar.quests.active[id]) {
      newChar.quests.active[id] = { progress: [] };
      trackRaceDiscovery(newChar, races);
      set({ character: newChar }); get().save();
    }
  },

  claimQuest: (id) => {
    const { character } = get(); if (!character) return;
    const newChar = JSON.parse(JSON.stringify(character));
    const res = claimQuestReward(newChar, id);
    if (res.success) {
      if (id === "TUT_BACKPACK") { newChar.tutorialCompleted = true; newChar.tutorialRelicGranted = true; }
      trackRaceDiscovery(newChar, get().races);
      set({ character: newChar }); get().save(); notify(res.msg);
    }
  },

  recordQuestAction: (action) => {
    const { character } = get(); if (!character) return;
    const hasPendingTutorialAction = Object.entries(character.quests?.active ?? {}).some(([id, state]) => {
      const quest = QUESTS.find(template => template.id === id && template.category === "TUTORIAL");
      return quest?.objectives.some((objective, index) => objective.type === action && (state.progress[index] ?? 0) < objective.count);
    });
    if (!hasPendingTutorialAction) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    let forgeRecoveryGranted = false;
    // Recuperação segura para veteranos que desmontaram/venderam todo o equipamento
    // antes de concluir TUT_FORGE. Ao reabrir o Ferreiro, entrega uma espada de
    // prática apenas se não houver nenhum equipamento aprimorável na mochila.
    if (action === "VISIT_FORGE" && newCharacter.quests?.active.TUT_FORGE) {
      const forgeable = newCharacter.inventory.items.some((item: any) => ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(item.category));
      if (!forgeable) {
        const starter = makeEquipment("ESPADA_T1", "COMUM");
        if (starter) {
          starter.quantity = 1;
          addItem(newCharacter.inventory, starter);
          forgeRecoveryGranted = true;
        }
      }
    }
    trackQuestAction(newCharacter, action);
    set({ character: newCharacter }); get().save();
    if (forgeRecoveryGranted) notify("O Ferreiro separou uma Espada de Prática para concluir sua missão de aprimoramento.");
  },

  buyTrainingBoost: () => {
 const {character} = get(); if (!character) return {success:false};
 const day = new Date().toISOString().slice(0,10);
 if (character.trainingBoostDay === day) return {success:false,error:'Já adquirido hoje. Reinicia às 00:00 UTC.'};
 if (character.gold < 250) return {success:false,error:'Gold insuficiente (250).'};
 set({character:{...character,gold:character.gold-250,trainingBoostDay:day,trainingBoostUntil:runtimeNow()+1800000}});
 get().save(); return {success:true};
 },
 useVial: (vial) => {
    const { character } = get(); if (!character) return;
    if (character.gold < vial.price) return;
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= vial.price;
    if (!newChar.activeVials) newChar.activeVials = {};
    const now = runtimeNow();

    const family = vial.id.replace(/_[0-9]+$/, '');
 for (const id of Object.keys(newChar.activeVials)) if (id.replace(/_[0-9]+$/, '') === family) delete newChar.activeVials[id];
 newChar.activeVials[vial.id] = now + vial.durationMinutes * 60000;
    recalcStats(newChar);
    set({ character: newChar }); get().save();
    notify(`Você bebeu ${vial.name}!`);
  },

  buyBless: () => {
    const { character } = get(); if (!character) return;
      const price = Math.max(100, character.level * 250);
    if (character.gold < price) return warn("Ouro insuficiente para comprar Bless.");
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= price;
    newChar.blesses = Math.min(5, (newChar.blesses || 0) + 1);
    set({ character: newChar }); get().save();
    notify(`Você comprou uma Bless! (${newChar.blesses}/5)`);
  },

  buyStaminaGold: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const now = runtimeNow();
    const day = staminaDayKey(now);
    const cost = staminaGoldCost(character.level);
    const current = Math.max(0, Number(character.staminaOnline ?? STAMINA_ONLINE_MAX));
    if (current >= STAMINA_ONLINE_MAX) return { success: false, error: "Sua stamina online já está cheia." };
    if (!STAMINA_PRETEST_UNLIMITED && character.staminaGoldPurchaseDay === day) return { success: false, error: "A compra com Gold já foi usada hoje." };
    if (character.gold < cost) return { success: false, error: `Gold insuficiente. Você precisa de ${cost.toLocaleString("pt-BR")} Gold.` };
    const next = JSON.parse(JSON.stringify(character));
    next.gold -= cost;
    next.staminaOnline = Math.min(STAMINA_ONLINE_MAX, current + STAMINA_GOLD_REFILL_MINUTES);
    if (!STAMINA_PRETEST_UNLIMITED) next.staminaGoldPurchaseDay = day;
    next.staminaUpdatedAt = now;
    set({ character: next }); get().save();
    notify(`⚡ Stamina recuperada: +${STAMINA_GOLD_REFILL_MINUTES} min.`);
    return { success: true, minutesAdded: STAMINA_GOLD_REFILL_MINUTES };
  },

  buyStaminaCoins: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const now = runtimeNow();
    const day = staminaDayKey(now);
    const current = Math.max(0, Number(character.staminaOnline ?? STAMINA_ONLINE_MAX));
    if (current >= STAMINA_ONLINE_MAX) return { success: false, error: "Sua stamina online já está cheia." };
    if (!STAMINA_PRETEST_UNLIMITED && character.staminaCoinPurchaseDay === day) return { success: false, error: "A compra com Mythreon Coin já foi usada hoje." };
    if ((character.mythreonCoins ?? 0) < 1) return { success: false, error: "Você precisa de 1 Mythreon Coin." };
    const next = JSON.parse(JSON.stringify(character));
    next.mythreonCoins = Math.max(0, Number(next.mythreonCoins ?? 0) - 1);
    next.staminaOnline = Math.min(STAMINA_ONLINE_MAX, current + STAMINA_COIN_REFILL_MINUTES);
    if (!STAMINA_PRETEST_UNLIMITED) next.staminaCoinPurchaseDay = day;
    next.staminaUpdatedAt = now;
    set({ character: next }); get().save();
    notify(`⚡ Stamina recuperada: +${STAMINA_COIN_REFILL_MINUTES} min.`);
    return { success: true, minutesAdded: STAMINA_COIN_REFILL_MINUTES };
  },

  upgradeItem: (uid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = upgradeItemLevel(newCharacter, uid);
    if (res.success) { trackQuestAction(newCharacter, "FORGE"); set({ character: newCharacter }); get().save(); }
    return res;
  },

  rerollItem: (uid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = rerollItemAffixes(newCharacter, uid);
    if (res.success) { trackQuestAction(newCharacter, "FORGE"); set({ character: newCharacter }); get().save(); }
    return res;
  },
  elevateItemTier: (uid) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const next = structuredClone(character); const result = elevateItemTier(next, uid); if (!result.success) return result;
    set({ character: next }); get().save(); return result;
  },
  rerollSpecificAffix: (uid, stat) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const next = structuredClone(character); const result = rerollSpecificAffix(next, uid, stat); if (!result.success) return result;
    set({ character: next }); get().save(); return result;
  },

  enchantItem: (uid, zoneId) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem." };
    const next = structuredClone(character);
    const result = enchantItem(next, uid, zoneId);
    if (!result.success) return result;
    trackQuestAction(next, "FORGE");
    set({ character: next }); get().save();
    notify(`✨ ${result.enchantment} gravado no equipamento.`);
    return result;
  },

  forgeFragments: (fromTemplateId) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const updated = JSON.parse(JSON.stringify(character));
    const result = forgeFragments(updated, fromTemplateId);
    if (result.success) { set({ character: updated }); get().save(); }
    return result;
  },

  refineMythreonCoins: (amount = 1) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const coins = Math.max(1, Math.min(100, Math.floor(amount)));
    const shards = coins * MYTHREON_ECONOMY.shardsPerCoin;
    const gold = coins * MYTHREON_ECONOMY.goldPerCoin;
    if ((character.mythreonShards ?? 0) < shards) return { success: false, error: `Você precisa de ${shards} Shards.` };
    if (character.gold < gold) return { success: false, error: `Refinar custa ${gold.toLocaleString("pt-BR")} gold.` };
    const next = { ...character, mythreonShards: (character.mythreonShards ?? 0) - shards, mythreonCoins: (character.mythreonCoins ?? 0) + coins, gold: character.gold - gold };
    set({ character: next }); get().save(); notify(`✨ ${coins} Mythreon Coin${coins > 1 ? "s" : ""} refinada(s).`); return { success: true, coins };
  },

  buyMythreonOffer: (offerId) => {
    const { character } = get();
    const offer = getMythreonOffer(offerId);
    if (!character || !offer || offer.kind === "BOOST") return { success: false, error: "Oferta de item inválida." };
    if ((character.mythreonCoins ?? 0) < offer.priceCoins) return { success: false, error: `Você precisa de ${offer.priceCoins} Mythreon Coins.` };
    const next = JSON.parse(JSON.stringify(character));
    const template = offer.templateId ? ALL_ITEM_TEMPLATES[offer.templateId] : undefined;
    const item = template?.category === "MATERIAL" ? makeMaterial(template.templateId) : template ? makeEquipment(template.templateId, template.rarity) : null;
    if (!item || !addItem(next.inventory, item)) return { success: false, error: "Bolsa cheia. Libere um espaço antes de comprar." };
    next.mythreonCoins = (next.mythreonCoins ?? 0) - offer.priceCoins;
    set({ character: next }); get().save(); notify(`${offer.name} foi entregue na mochila.`); return { success: true };
  },

  buyMythreonBoost: (offerId) => {
    const { character } = get();
    const offer = getMythreonOffer(offerId);
    if (!character || !offer || offer.kind !== "BOOST" || !offer.boostKey) return { success: false, error: "Boost inválido." };
    if ((character.mythreonCoins ?? 0) < offer.priceCoins) return { success: false, error: `Você precisa de ${offer.priceCoins} Mythreon Coins.` };
    const next = structuredClone(character);
    next.mythreonCoins = (next.mythreonCoins ?? 0) - offer.priceCoins;
    next.mythreonBoosts ??= {};
    const now = runtimeNow();
    const current = next.mythreonBoosts[offer.boostKey];
    if (offer.durationHours === 0) next.mythreonBoosts[offer.boostKey] = 0;
    else {
      const base = current !== undefined && (current === 0 || current > now) ? current : now;
      next.mythreonBoosts[offer.boostKey] = base + (offer.durationHours ?? 1) * 60 * 60 * 1000;
    }
    set({ character: next }); get().save(); notify(`${offer.name} ativado. A Essência reconhece seu foco.`); return { success: true };
  },

  openMythreonRoulette: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const key = character.inventory.items.find(item => item.templateId === "CHAVE_ROLETA_ARCANA");
    if (!key) return { success: false, error: "Você precisa de uma Chave da Roleta Arcana." };
    const rewards = [
      { label: "1.500 gold", gold: 1500 },
      { label: "5 Fragmentos Raros", templateId: "FRAGMENTO_RARO", quantity: 5 },
      { label: "20 Fragmentos Comuns", templateId: "FRAGMENTO_COMUM", quantity: 20 },
      { label: "Ovo de Besta Divina Raro", templateId: "OVO_BESTA_T3", quantity: 1 },
      { label: "Ovo de Besta Divina Épico", templateId: "OVO_BESTA_T4", quantity: 1 },
      { label: "Baú de Suprimentos Mythreon", templateId: "BAU_SUPRIMENTOS_MYTHREON", quantity: 1 },
    ];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    const next = structuredClone(character);
    removeItem(next.inventory, key.uid, 1);
    if (reward.gold) next.gold += reward.gold;
    if (reward.templateId) {
      const template = ALL_ITEM_TEMPLATES[reward.templateId];
      const item = template?.category === "MATERIAL" ? makeMaterial(reward.templateId) : template ? makeEquipment(reward.templateId, template.rarity) : null;
      if (!item) return { success: false, error: "Prêmio indisponível." };
      item.quantity = reward.quantity ?? 1;
      if (!addItem(next.inventory, item)) return { success: false, error: "Libere espaço na mochila antes de abrir a roleta." };
    }
    set({ character: next }); get().save(); notify(`🎰 Roleta Arcana: ${reward.label}!`); return { success: true, reward: reward.label };
  },

  buyCalendarCoupon: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    if (!Number.isSafeInteger(character.mythreonCoins) || Number(character.mythreonCoins) < CALENDAR_COUPON_PRICE) return { success: false, error: "Você precisa de 1 Mythreon Coin por cupom." };
    const next = { ...character, mythreonCoins: (character.mythreonCoins ?? 0) - CALENDAR_COUPON_PRICE, calendarCoupons: (character.calendarCoupons ?? 0) + 1 };
    set({ character: next }); get().save(); return { success: true };
  },

  claimDailyCalendar: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const result = claimCalendarReward(character);
    if (!result.success) return result;
    set({ character: result.character }); get().save();
    return { success: true, reward: result.reward };
  },

  recoverCalendarDay: (day) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const result = recoverCalendarDay(character, day);
    if (!result.success) return result;
    set({ character: result.character }); get().save();
    return { success: true, reward: result.reward };
  },

  recoverCalendarWeek: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    const result = recoverCalendarWeek(character);
    if (!result.success) return result;
    set({ character: result.character }); get().save();
    return { success: true, reward: result.reward };
  },

  claimOnlineChest: () => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    normalizeOnlineChest(character, runtimeNow());
    const milestone = nextOnlineChest(character);
    if (!milestone) return { success: false, error: "Você já abriu todos os baús de hoje. A trilha reinicia amanhã." };
    if ((character.onlineChestSeconds ?? 0) < milestone.seconds) return { success: false, error: `Fique online por mais ${Math.ceil((milestone.seconds - (character.onlineChestSeconds ?? 0)) / 60)} min para abrir o baú de ${milestone.label}.` };
    const next = structuredClone(character);
    normalizeOnlineChest(next, runtimeNow());
    next.onlineChestClaims = [...new Set([...(next.onlineChestClaims ?? []), milestone.id])];
    next.onlineChestsOpened = (next.onlineChestsOpened ?? 0) + 1;
    const gold = milestone.gold + next.level * Math.max(20, Math.floor(milestone.gold / 100));
    const shards = milestone.shards + Math.floor(next.level / 40);
    next.gold += gold; next.mythreonShards = (next.mythreonShards ?? 0) + shards;
    const reward = `${milestone.label}: ${gold.toLocaleString("pt-BR")} gold + ${shards} Mythreon Shard${shards === 1 ? "" : "s"}`;
    set({ character: next }); get().save(); notify(`Baú do Refúgio: ${reward}`); return { success: true, reward };
  },

  setCardLoadout: (uids) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    if (!Array.isArray(uids) || uids.length > 5 || uids.some(uid => typeof uid !== "string")) return { success: false, error: "A formação aceita até cinco cartas." };
    const unique = [...new Set(uids)];
    const owned = new Set((character.cards ?? []).filter(card => CARD_TEMPLATES[card.templateId]).map(card => card.uid));
    if (unique.some(uid => !owned.has(uid))) return { success: false, error: "Uma das cartas não pertence à sua coleção." };
    const next = structuredClone(character);
    next.cardLoadout = unique;
    recalcStats(next);
    set({ character: next }); get().save();
    return { success: true };
  },

  evolveCard: (uid, materialUids, expectedLevel) => {
    const { character } = get();if (!character) return { success: false, error: "Sem personagem." };
    if (typeof uid !== "string" || !Array.isArray(materialUids) || materialUids.some(id => typeof id !== "string") || !Number.isInteger(expectedLevel)) return { success: false, error: "Dados de evolução inválidos." };
    const next = structuredClone(character), result = engineEvolveCard(next, uid, materialUids, expectedLevel);
    if (!result.success) return result;
    recalcStats(next);set({ character: next });get().save();return result;
  },

  recycleCards: (sourceTemplateId, materialUids) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem." };
    if (typeof sourceTemplateId !== "string" || !Array.isArray(materialUids) || materialUids.some(id => typeof id !== "string")) {
      return { success: false, error: "Dados da roleta inválidos." };
    }
    const next = structuredClone(character);
    const result = engineRecycleCardCopies(next, sourceTemplateId, materialUids);
    if (!result.success) return result;
    recalcStats(next);
    set({ character: next }); get().save();
    notify(`🎰 Bolsa de Cards: ${CARD_TEMPLATES[result.reward?.templateId ?? ""]?.name ?? "nova memória"} recebida.`);
    return result;
  },

  depositItem: (uid) => {
    const { character } = get(); 
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = engineDeposit(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },

  withdrawItem: (uid) => {
    const { character } = get(); 
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = engineWithdraw(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },

  depositMany: (uids) => {
    const { character } = get(); 
    if (!character) return { success: false, moved: 0, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = engineDepositMany(newCharacter, uids);
    if (res.moved > 0) { set({ character: newCharacter }); get().save(); }
    return { success: res.moved > 0, moved: res.moved, error: res.error };
  },

  withdrawMany: (uids) => {
    const { character } = get(); 
    if (!character) return { success: false, moved: 0, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = engineWithdrawMany(newCharacter, uids);
    if (res.moved > 0) { set({ character: newCharacter }); get().save(); }
    return { success: res.moved > 0, moved: res.moved, error: res.error };
  },

  claimArenaReward: (teamSize) => {
    const { character, currentZoneId } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const today = new Date().toISOString().slice(0, 10);
    const earnedToday = character.arenaRewardDay === today ? (character.arenaRewardsToday ?? 0) : 0;
    if (earnedToday >= 3) return { success: false, error: "Você já recebeu as 3 recompensas diárias da Arena." };
    const tier = ZONES[currentZoneId]?.tier ?? 1;
    const gold = (teamSize === 1 ? 30 : teamSize === 3 ? 70 : 130) * tier;
    const newCharacter: Character = {
      ...character,
      gold: character.gold + gold,
      arenaRewardDay: today,
      arenaRewardsToday: earnedToday + 1,
      inventory: { ...character.inventory, items: [...character.inventory.items] },
    };
    let fragment: string | undefined;
    if (teamSize === 3 || (teamSize === 5 && character.arenaRareRewardDay !== today)) {
      const fragmentId = teamSize === 3 ? "FRAGMENTO_COMUM" : "FRAGMENTO_RARO";
      const template = FRAGMENT_TEMPLATES[fragmentId];
      if (addItem(newCharacter.inventory, { ...template, uid: `arena-${runtimeNow()}-${Math.random()}`, quantity: 1 })) {
        fragment = fragmentId;
        if (teamSize === 5) newCharacter.arenaRareRewardDay = today;
      }
    }
    set({ character: newCharacter });
    get().save();
    return { success: true, gold, fragment, remaining: 2 - earnedToday };
  },
}));
}

export const useGameStore = createGameStore();
