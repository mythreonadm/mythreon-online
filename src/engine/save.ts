import { Character, Race, SaveFile, CharacterSkills } from "../types";
import { DEFAULT_BACKPACK } from "../data/backpacks";
import { getBaseStats, xpToNextLevel } from "./stats";

const SAVE_KEY = "mythreon_save_v1";

export function createNewCharacter(name: string): Character {
  const base = getBaseStats(1);
  const zeroSkills: CharacterSkills = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  return {
    id: Math.random().toString(), name, level: 1, xp: 0, xpToNext: xpToNextLevel(1), gold: 0,
    hp: base.hp!, hpMax: base.hp!, mp: base.mp!, mpMax: base.mp!, baseStats: base,
    equipped: {}, inventory: { backpack: { ...DEFAULT_BACKPACK }, items: [] }, killsInZone: 0,
    currentZoneId: "BOSQUE_LYSS", premium: false, lastTick: Date.now(),
    quests: { active: {}, completed: [] },
    blesses: 0,
    skills: { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 },
    skillXp: { ...zeroSkills },
    trainingSkill: null,
    autoSalvage: null,
    autoSell: null,
    autoHpPotionId: "POCAO_VIDA_1",
    autoHpPotionPercent: 50,
    autoMpPotionId: "POCAO_MANA_1",
    autoMpPotionPercent: 30,
    activeVials: {},
  };
}

export function saveGame(char: Character, races: Race[]) {
  localStorage.setItem(SAVE_KEY, JSON.stringify({ version: 1, character: char, races, settings: {}, stats: {} }));
}

export function loadGame(): SaveFile | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try { 
    const data = JSON.parse(raw);
    if (data.character) {
      if (!data.character.skills) data.character.skills = { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 };
      if (typeof data.character.skillXp === "number") data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      else if (!data.character.skillXp) data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      if (data.character.trainingSkill === undefined) data.character.trainingSkill = null;
      if (!data.character.quests) data.character.quests = { active: {}, completed: [] };
      if (data.character.blesses === undefined) data.character.blesses = 0;
      
      if (data.character.autoSalvage === undefined) data.character.autoSalvage = null;
      if (data.character.autoSell === undefined) data.character.autoSell = null;
      
      if (!data.character.autoHpPotionId) data.character.autoHpPotionId = "POCAO_VIDA_1";
      if (data.character.autoHpPotionPercent === undefined) data.character.autoHpPotionPercent = 50;
      if (!data.character.autoMpPotionId) data.character.autoMpPotionId = "POCAO_MANA_1";
      if (data.character.autoMpPotionPercent === undefined) data.character.autoMpPotionPercent = 30;
      if (!data.character.activeVials) data.character.activeVials = {};
    }
    return data; 
  } catch (e) { 
    console.error("Erro ao carregar save:", e);
    return null; 
  }
}