import { create } from "zustand";
import { Character, Race, TickResult, CharacterSkills, OfflineReportData, BuffVialTemplate, DeathReportData } from "../types";
import { ZONES } from "../data/zones";
import { createNewCharacter, loadGame, saveGame } from "../engine/save";
import { processTick } from "../engine/combat";
import { equipItem, unequipItem, addItem, removeItem } from "../engine/inventory";
import { recalcStats, skillXpToNextLevel } from "../engine/stats";
import { findNamedRace, generateRaceName, generateRaceId, generateRaceBonus } from "../data/races";
import { ShopEntry, buyEntry, sellItem, sellAllEquipment } from "../engine/shop";
import { salvageAllEquipment } from "../engine/salvage";
import { updateQuestProgress, claimQuestReward, trackRaceDiscovery } from "../engine/questEngine";
import { upgradeItemLevel, rerollItemAffixes } from "../engine/forge";
import { depositItem as engineDeposit, withdrawItem as engineWithdraw, depositMany as engineDepositMany, withdrawMany as engineWithdrawMany } from "../engine/depot";

interface GameState {
  character: Character | null;
  races: Race[];
  currentZoneId: string;
  lastTickResult: TickResult | null;
  isTickRunning: boolean;
  isTraining: boolean;
  offlineReport: OfflineReportData | null;
  deathReport: DeathReportData | null;
  healingUntil: number | null;

  newGame: (name: string) => void;
  loadFromSave: () => boolean;
  save: () => void;
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
  setActiveEnemy: (enemyId: string) => void;
  equip: (uid: string) => { success: boolean; error?: string };
  unequip: (slot: any) => { success: boolean; error?: string };
  synthesize: (a: string, s: string, p: string) => { success: boolean; error?: string };
  equipRace: (race: Race) => void;
  unequipRace: () => void;
  buyItem: (entry: ShopEntry, qty?: number) => { success: boolean; error?: string };
  sellItem: (uid: string, qty?: number) => void;
  salvageAll: (maxRarity: any) => void;
  updateSettings: (settings: any) => void;
  activateBuff: () => void;
  acceptQuest: (id: string) => void;
  claimQuest: (id: string) => void;
  useVial: (vial: BuffVialTemplate) => void;
  buyBless: () => void;
  refreshCompendium: () => void;
  upgradeItem: (uid: string) => { success: boolean; error?: string };
  rerollItem: (uid: string) => { success: boolean; error?: string };
  
  depositItem: (uid: string) => { success: boolean; error?: string };
  withdrawItem: (uid: string) => { success: boolean; error?: string };
  depositMany: (uids: string[]) => { success: boolean; moved: number; error?: string };
  withdrawMany: (uids: string[]) => { success: boolean; moved: number; error?: string };
}

let tickInterval: ReturnType<typeof setInterval> | null = null;

export const useGameStore = create<GameState>((set, get) => ({
  character: null, races: [], currentZoneId: "BOSQUE_LYSS", lastTickResult: null, isTickRunning: false, isTraining: false, offlineReport: null, deathReport: null, healingUntil: null,

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
    if (timeAway > 60) {
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

  save: () => { const { character, races } = get(); if (character) saveGame(character, races); },

  tick: () => {
    const { character, currentZoneId, isTickRunning, isTraining } = get();
    if (!character || (!isTickRunning && !isTraining)) return;

    if (isTraining) {
      const newCharacter = JSON.parse(JSON.stringify(character));
      const skill = newCharacter.trainingSkill;
      if (skill) {
        newCharacter.skillXp[skill] += 15;
        const xpNeeded = skillXpToNextLevel(newCharacter.skills[skill]);
        const result: TickResult = { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0 };
        if (newCharacter.skillXp[skill] >= xpNeeded) {
          newCharacter.skillXp[skill] -= xpNeeded;
          newCharacter.skills[skill] += 1;
          recalcStats(newCharacter);
          result.skillLevelUp = `✨ Skill ${skill.toUpperCase()} subiu para o nível ${newCharacter.skills[skill]}!`;
        }
        set({ character: newCharacter, lastTickResult: result });
        get().save();
      }
      return;
    }

    const zone = ZONES[currentZoneId];
    if (!zone || character.level < zone.minLevel) { get().stopHunting(); return; }

    const result = processTick(character, zone, Date.now() - character.lastTick > 15000);

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
  },

  startHunting: (zoneId) => {
    const { character, healingUntil } = get();
    if (!character) return;
    if (healingUntil) return alert("Você está meditando! Termine antes de caçar.");
    if (character.hp <= 0) return alert("Você precisa se curar na Casa antes de caçar!");

    const zone = ZONES[zoneId];
    if (character.level < zone.minLevel) return;

    if (tickInterval) clearInterval(tickInterval);
    character.currentZoneId = zoneId;
    character.trainingSkill = null;

    if (!character.activeEnemyId || !zone.enemies.find(e => e.id === character.activeEnemyId)) {
      character.activeEnemyId = zone.enemies[0].id;
      character.enemyHp = zone.enemies[0].hp * zone.enemies[0].difficulty;
    }
    set({ isTickRunning: true, isTraining: false, currentZoneId: zoneId, character: { ...character } });
    get().tick();
    tickInterval = setInterval(() => get().tick(), 3000);
  },

  startTraining: (skill) => {
    const { character, healingUntil } = get();
    if (!character) return;
    if (healingUntil) return alert("Termine sua meditação primeiro!");

    if (tickInterval) clearInterval(tickInterval);
    character.trainingSkill = skill;
    set({ isTickRunning: false, isTraining: true, character: { ...character } });
    get().tick();
    tickInterval = setInterval(() => get().tick(), 3000);
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
    if (character) { character.trainingSkill = null; set({ isTraining: false, character: { ...character } }); }
  },

  setActiveEnemy: (enemyId) => {
    const { character, currentZoneId } = get(); if (!character) return;
    const zone = ZONES[currentZoneId];
    const enemy = zone.enemies.find(e => e.id === enemyId);
    character.activeEnemyId = enemyId;
    character.enemyHp = (enemy?.hp || 0) * (enemy?.difficulty || 1);
    character.enemyHpId = enemyId;
    set({ character: { ...character } }); get().save();
  },

  equip: (uid) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const result = equipItem(newCharacter, uid);
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

    set({ character: newCharacter, races: newRaces });
    get().save();
    return { success: true };
  },

  equipRace: (race) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    newCharacter.raceId = race.id; newCharacter.activeRace = race;
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

  buyItem: (entry, qty = 1) => {
    const { character } = get(); if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = buyEntry(newCharacter, entry, qty);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },

  sellItem: (uid, qty = 1) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    sellItem(newCharacter, uid, qty); set({ character: newCharacter }); get().save();
  },

  salvageAll: (maxRarity) => {
    const { character } = get(); if (!character) return;
    const newChar = JSON.parse(JSON.stringify(character));
    const res = salvageAllEquipment(newChar, maxRarity);
    newChar.totalSalvaged = (newChar.totalSalvaged || 0) + res.items;
    updateQuestProgress(newChar, { kills: 0, gold: 0, xp: 0, drops: [], levelsGained: 0, death: false, log: [], enemyHp: 0, enemyMaxHp: 0, salvagedItems: res.items });
    set({ character: newChar }); get().save(); alert(`Desmanchou ${res.items} itens e ganhou ${res.frags} fragmentos!`);
  },

  updateSettings: (settings) => {
    const { character } = get(); if (!character) return;
    const newCharacter = JSON.parse(JSON.stringify(character));
    if (settings.autoPotion !== undefined) newCharacter.autoPotion = settings.autoPotion;
    if (settings.autoSell !== undefined) newCharacter.autoSell = settings.autoSell;
    if (settings.autoSalvage !== undefined) newCharacter.autoSalvage = settings.autoSalvage;
    if (settings.autoHpPotionId !== undefined) newCharacter.autoHpPotionId = settings.autoHpPotionId;
    if (settings.autoHpPotionPercent !== undefined) newCharacter.autoHpPotionPercent = settings.autoHpPotionPercent;
    if (settings.autoMpPotionId !== undefined) newCharacter.autoMpPotionId = settings.autoMpPotionId;
    if (settings.autoMpPotionPercent !== undefined) newCharacter.autoMpPotionPercent = settings.autoMpPotionPercent;
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
    if (res.success) { set({ character: newChar }); get().save(); alert(res.msg); }
  },

  useVial: (vial) => {
    const { character } = get(); if (!character) return;
    if (character.gold < vial.price) return;
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= vial.price;
    if (!newChar.activeVials) newChar.activeVials = {};
    const now = Date.now();
    const currentExpiry = newChar.activeVials[vial.id] && newChar.activeVials[vial.id] > now ? newChar.activeVials[vial.id] : now;
    newChar.activeVials[vial.id] = currentExpiry + (vial.durationMinutes * 60 * 1000);
    recalcStats(newChar);
    set({ character: newChar }); get().save();
    alert(`Você bebeu ${vial.name}!`);
  },

  buyBless: () => {
    const { character } = get(); if (!character) return;
    const price = character.level * 5000;
    if (character.gold < price) return alert("Ouro insuficiente para comprar Bless.");
    const newChar = JSON.parse(JSON.stringify(character));
    newChar.gold -= price;
    newChar.blesses = Math.min(5, (newChar.blesses || 0) + 1);
    set({ character: newChar }); get().save();
    alert(`Você comprou uma Bless! (${newChar.blesses}/5)`);
  },

  upgradeItem: (uid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = upgradeItemLevel(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
  },

  rerollItem: (uid) => {
    const { character } = get();
    if (!character) return { success: false, error: "Sem personagem" };
    const newCharacter = JSON.parse(JSON.stringify(character));
    const res = rerollItemAffixes(newCharacter, uid);
    if (res.success) { set({ character: newCharacter }); get().save(); }
    return res;
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
}));