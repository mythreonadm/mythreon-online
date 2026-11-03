import { canEnterZone, canTutorialHunt, isGuided, unlockJourneyZone } from '../engine/journey';
import { getAvailableQuests } from '../utils/questSignals';
import { checkQuestCompletion } from '../engine/questEngine';
import { applyTraining } from "../engine/training";
import { create } from "zustand";
import { Character, Race, TickResult, CharacterSkills, OfflineReportData, BuffVialTemplate, DeathReportData, HuntZoneStats, DivineBeastId, QuestObjectiveType } from "../types";
import { ZONES } from "../data/zones";
import { createNewCharacter, loadGame, saveGame } from "../engine/save";
import { processTick } from "../engine/combat";
import { equipItem, unequipItem, addItem, removeItem } from "../engine/inventory";
import { makeEquipment } from "../engine/drops";
import { recalcStats, skillXpToNextLevel } from "../engine/stats";
import { findNamedRace, generateRaceName, generateRaceId, generateRaceBonus } from "../data/races";
import { sellItem, sellSelectedItems } from "../engine/shop";
import { salvageAllEquipment, salvageSelectedEquipment } from "../engine/salvage";
import { updateQuestProgress, claimQuestReward, trackRaceDiscovery, trackQuestAction } from "../engine/questEngine";
import { upgradeItemLevel, rerollItemAffixes, forgeFragments } from "../engine/forge";
import { depositItem as engineDeposit, withdrawItem as engineWithdraw, depositMany as engineDepositMany, withdrawMany as engineWithdrawMany } from "../engine/depot";
import { FRAGMENT_TEMPLATES } from "../data/items";
import { DIVINE_BEASTS } from "../data/divineBeasts";
import { QUESTS } from "../data/quests";

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
  newGame: (name: string) => void;
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
  unequipDivineBeast: () => void;
  sellItem: (uid: string, qty?: number) => void;
  sellSelected: (uids: string[]) => void;
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
  refreshCompendium: () => void;
  upgradeItem: (uid: string) => { success: boolean; error?: string };
  rerollItem: (uid: string) => { success: boolean; error?: string };
  forgeFragments: (fromTemplateId: string) => { success: boolean; error?: string; crafted?: number };
  
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

export function createGameStore(runtime: {server?: boolean; persist?: (character: Character,races: Race[])=>void; notify?: (message:string)=>void} = {}) {
let tickInterval: ReturnType<typeof setInterval> | null = null;
const notify = runtime.notify ?? ((message:string)=>{if(typeof alert !== 'undefined') alert(message);});
const warn=(message:string)=>{if(runtime.server)throw Error(message);notify(message);};
return create<GameState>((set, get) => ({
  character: null, races: [], currentZoneId: "BOSQUE_LYSS", lastTickResult: null, isTickRunning: false, isTraining: false, offlineReport: null, deathReport: null, healingUntil: null,

  finishIntro: () => { const c=get().character; if(!c)return; set({character:{...c,introSeen:true}}); get().save(); },
  unlockZone: id => { const c=get().character; if(!c)return {success:false}; const next=structuredClone(c); const result=unlockJourneyZone(next,id); if(result.success){set({character:next});get().save();} return result; },
  newGame: (name) => {
    const char = createNewCharacter(name);
    const races: Race[] = [];
    trackRaceDiscovery(char, races);
    set({ character: char, races, currentZoneId: "BOSQUE_LYSS" });
    get().save();
  },

  loadFromSave: () => {
    const save = loadGame();
    if (!save) return false;
    const timeAway = (Date.now() - save.character.lastTick) / 1000;
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
    set({ healingUntil: Date.now() + 15000 });
  },

  cancelHealing: () => {
    set({ healingUntil: null });
  },

  save: () => { const { character, races } = get(); if (character) { if(runtime.persist) runtime.persist(character,races); else saveGame(character, races); } },
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

    if (isTraining) {
      const newCharacter = JSON.parse(JSON.stringify(character));
      const skill = newCharacter.trainingSkill;
      if (skill) {
        const beforeSeconds = Number(newCharacter.trainingSeconds?.[skill] ?? 0);
        const trainingLog = applyTraining(newCharacter, Date.now());
        trackQuestAction(newCharacter,"TRAIN",Number(newCharacter.trainingSeconds?.[skill] ?? 0)-beforeSeconds);
        recalcStats(newCharacter);
        const result: TickResult = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: trainingLog, enemyHp: 0, enemyMaxHp: 0, skillLevelUp: trainingLog.length ? trainingLog.join(' · ') : undefined };
        set({ character: newCharacter, lastTickResult: result });
        get().save();
        if (isGuided(newCharacter) && newCharacter.quests.active.TUT_TRAIN && checkQuestCompletion(newCharacter,"TUT_TRAIN")) get().stopTraining();
      }
      return;
    }

    const zone = ZONES[currentZoneId];
    if (!zone || character.level < zone.minLevel) { get().stopHunting(); return; }

    if (isGuided(character)) character.lastTick = Date.now() - 3000;
    const result = processTick(character, zone, !isGuided(character) && Date.now() - character.lastTick > 15000);
    recordHuntMetrics(character, zone.id, result);

    if (result.death && result.deathData) {
      get().stopHunting();
      set({ deathReport: result.deathData, lastTickResult: result, character: { ...character } });
      get().save();
      return;
    }

    updateQuestProgress(character, result);
    recalcStats(character);
    set({ character: { ...character }, lastTickResult: result });
    get().save();
    if (result.staminaDepleted || (isGuided(character) && QUESTS.some(q=>q.category==='TUTORIAL' && character.quests.active[q.id] && checkQuestCompletion(character,q.id)))) get().stopHunting();
  },

  startHunting: (zoneId) => {
    const { character, healingUntil } = get();
    if (!character) return;
    if (healingUntil) return warn("Você está meditando! Termine antes de caçar.");
    if (character.hp <= 0) return warn("Você precisa se curar na Casa antes de caçar!");
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
    character.trainingLastTick = Date.now();
    character.lastTick = Date.now();
    set({ isTickRunning: false, isTraining: true, character: { ...character } });
    if (!runtime.server) { get().tick();
    tickInterval = setInterval(() => get().tick(), 3000); }
  },

  armSpecialCombo: (power = 1.5) => {
    const { character, isTickRunning } = get();
    if (!character || !isTickRunning) return { success: false, error: "O combo só pode ser armado durante a caça." };
    const now = Date.now();
    if ((character.comboCooldownUntil ?? 0) > now) return { success: false, error: `Aguarde ${Math.ceil((character.comboCooldownUntil! - now) / 1000)}s para recarregar.` };
    const updated = JSON.parse(JSON.stringify(character));
    updated.comboReadyUntil = now + 12_000;
    updated.comboPower = power;
    set({ character: updated }); get().save();
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
    if (character) { character.trainingSkill = null; character.trainingLastTick = undefined; character.lastTick = Date.now(); set({ isTraining: false, character: { ...character } }); get().save(); }
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
    newCharacter.raceId = race.id; newCharacter.activeRace = race; newCharacter.activeDivineBeastId = undefined;
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
      return { success: false, error: "Essa Divine Beast ainda não foi vinculada." };
    }
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.activeDivineBeastId = id;
    newCharacter.raceId = undefined;
    newCharacter.activeRace = undefined;
    recalcStats(newCharacter);
    set({ character: newCharacter });
    get().save();
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
    if (settings.autoSell !== undefined) newCharacter.autoSell = settings.autoSell;
    if (settings.autoSalvage !== undefined) newCharacter.autoSalvage = settings.autoSalvage;
    if (settings.autoSellTemplateIds !== undefined) {
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
    const currentBuff = newCharacter.doubleAtkUntil && newCharacter.doubleAtkUntil > Date.now() ? newCharacter.doubleAtkUntil : Date.now();
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
 set({character:{...character,gold:character.gold-250,trainingBoostDay:day,trainingBoostUntil:Date.now()+1800000}});
 get().save(); return {success:true};
 },
 useVial: (vial) => {
    const { character } = get(); if (!character) return;
    if (character.gold < vial.price) return;
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= vial.price;
    if (!newChar.activeVials) newChar.activeVials = {};
    const now = Date.now();

    const family = vial.id.replace(/_[0-9]+$/, '');
 for (const id of Object.keys(newChar.activeVials)) if (id.replace(/_[0-9]+$/, '') === family) delete newChar.activeVials[id];
 newChar.activeVials[vial.id] = now + vial.durationMinutes * 60000;
    recalcStats(newChar);
    set({ character: newChar }); get().save();
    notify(`Você bebeu ${vial.name}!`);
  },

  buyBless: () => {
    const { character } = get(); if (!character) return;
    const price = character.level * 5000;
    if (character.gold < price) return warn("Ouro insuficiente para comprar Bless.");
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= price;
    newChar.blesses = Math.min(5, (newChar.blesses || 0) + 1);
    set({ character: newChar }); get().save();
    notify(`Você comprou uma Bless! (${newChar.blesses}/5)`);
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

  forgeFragments: (fromTemplateId) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const updated = JSON.parse(JSON.stringify(character));
    const result = forgeFragments(updated, fromTemplateId);
    if (result.success) { set({ character: updated }); get().save(); }
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
      if (addItem(newCharacter.inventory, { ...template, uid: `arena-${Date.now()}-${Math.random()}`, quantity: 1 })) {
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
