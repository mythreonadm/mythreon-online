import { Character, Race, SaveFile, CharacterSkills, CardInstance } from "../types";
import { DEFAULT_BACKPACK } from "../data/backpacks";
import { getBaseStats, xpToNextLevel, recalcStats } from "./stats";
import { makeEquipment } from "./drops";
import { addItem } from "./inventory";
import { ALL_ITEM_TEMPLATES } from "../data/items";

const LEGACY_SAVE_KEY = "mythreon_save_v1";
const MIGRATION_KEY = "mythreon_save_account_migrated_v1";
let SAVE_KEY = LEGACY_SAVE_KEY;

export function activateSaveAccount(accountId?: string) {
  if (!accountId) { SAVE_KEY = LEGACY_SAVE_KEY; return; }
  const accountKey = `${LEGACY_SAVE_KEY}_account_${accountId}`;
  if (localStorage.getItem(MIGRATION_KEY) !== "1") {
    const legacySave = localStorage.getItem(LEGACY_SAVE_KEY);
    if (legacySave && !localStorage.getItem(accountKey)) localStorage.setItem(accountKey, legacySave);
    localStorage.setItem(MIGRATION_KEY, "1");
  }
  SAVE_KEY = accountKey;
}

export function createNewCharacter(name: string): Character {
  const base = getBaseStats(1);
  const zeroSkills: CharacterSkills = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
  return {
    id: Math.random().toString(), name, level: 1, xp: 0, xpToNext: xpToNextLevel(1), gold: 0,
    hp: base.hp!, hpMax: base.hp!, mp: base.mp!, mpMax: base.mp!, baseStats: base,
    mythreonShards: 0, mythreonCoins: 0,
    equipped: {}, inventory: { backpack: { ...DEFAULT_BACKPACK }, items: [] }, killsInZone: 0,
    currentZoneId: "BOSQUE_LYSS", premium: false, lastTick: Date.now(),
    quests: { active: {}, completed: [] },
    blesses: 0,
    skills: { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 },
    statPoints: 0,
    skillXp: { ...zeroSkills },
    trainingSkill: null,
    autoSalvage: null,
    autoSell: null,
    autoSellTemplateIds: [],
    autoSalvageTemplateIds: [],
    ignoredLootTemplateIds: [],
    bestiaryKills: {},
    autoHpPotionId: "POCAO_VIDA_1",
    autoHpPotionPercent: 50,
    autoHpPotionEnabled: false,
    autoMpPotionId: "POCAO_MANA_1",
    autoMpPotionPercent: 30,
    autoMpPotionEnabled: false,
    introSeen: false, journeyVersion: 1, unlockedZoneIds: ["BOSQUE_LYSS"],
    tutorialCompleted: false,
    tutorialRelicGranted: false,
    staminaOnline: 120,
    staminaOffline: 480,
    staminaUpdatedAt: Date.now(),
    activeVials: {},
    cards: [],
    divineBeasts: [],
    depot: [],
    depotMax: 300,
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
      if (data.character.journeyVersion === undefined) {
        data.character.journeyVersion = 0; data.character.introSeen = true;
        data.character.unlockedZoneIds = ["BOSQUE_LYSS", ...[["PICO_DHOR",11],["MAR_AZHAR",26],["RUINAS_ASTERION",46],["CICATRIZ_PROFUNDA",71]].filter(([,level]) => data.character.level >= Number(level)).map(([id]) => String(id))];
        if (data.character.currentZoneId && !data.character.unlockedZoneIds.includes(data.character.currentZoneId)) data.character.unlockedZoneIds.push(data.character.currentZoneId);
      }
      const legacyPasses: Record<string,string> = {PICO_DHOR:'PASS_DHOR',MAR_AZHAR:'PASS_AZHAR',RUINAS_ASTERION:'PASS_ASTERION',CICATRIZ_PROFUNDA:'PASS_CICATRIZ'};
      if (data.character.journeyVersion === 0) {
        data.character.quests ??= {active:{},completed:[]};
        for(const id of data.character.unlockedZoneIds ?? []) { const q=legacyPasses[id]; if(q && !data.character.quests.completed.includes(q)) { data.character.quests.completed.push(q); delete data.character.quests.active[q]; } }
      }
      const targetXp = xpToNextLevel(data.character.level || 1);
      const previousTarget = data.character.xpToNext;
      if (Number.isFinite(previousTarget) && previousTarget > 0 && previousTarget !== targetXp) {
        data.character.xp = Math.floor(Math.max(0, data.character.xp || 0) / previousTarget * targetXp);
      }
      data.character.xpToNext = targetXp;
      if (!data.character.skills) data.character.skills = { melee: 10, defense: 10, magic: 10, distance: 10, soul: 10 };
      if (!Number.isFinite(data.character.statPoints)) data.character.statPoints = Math.max(0, (data.character.level || 1) - 1);
      if (typeof data.character.skillXp === "number") data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      else if (!data.character.skillXp) data.character.skillXp = { melee: 0, defense: 0, magic: 0, distance: 0, soul: 0 };
      if (data.character.trainingSkill === undefined) data.character.trainingSkill = null;
      if (!data.character.quests) data.character.quests = { active: {}, completed: [] };
      if (data.character.blesses === undefined) data.character.blesses = 0;
      if (!Number.isFinite(data.character.mythreonShards)) data.character.mythreonShards = 0;
      if (!Number.isFinite(data.character.mythreonCoins)) data.character.mythreonCoins = 0;
      
      if (data.character.autoSalvage === undefined) data.character.autoSalvage = null;
      if (data.character.autoSell === undefined) data.character.autoSell = null;
      if (!Array.isArray(data.character.autoSellTemplateIds)) data.character.autoSellTemplateIds = [];
      if (!Array.isArray(data.character.autoSalvageTemplateIds)) data.character.autoSalvageTemplateIds = [];
      if (!Array.isArray(data.character.ignoredLootTemplateIds)) data.character.ignoredLootTemplateIds = [];
      if (!data.character.bestiaryKills || typeof data.character.bestiaryKills !== "object") data.character.bestiaryKills = {};
      
      if (!data.character.autoHpPotionId) data.character.autoHpPotionId = "POCAO_VIDA_1";
      if (data.character.autoHpPotionPercent === undefined) data.character.autoHpPotionPercent = 50;
      if (data.character.autoHpPotionEnabled === undefined) data.character.autoHpPotionEnabled = false;
      if (!data.character.autoMpPotionId) data.character.autoMpPotionId = "POCAO_MANA_1";
      if (data.character.autoMpPotionPercent === undefined) data.character.autoMpPotionPercent = 30;
      if (data.character.autoMpPotionEnabled === undefined) data.character.autoMpPotionEnabled = false;
      if (data.character.tutorialCompleted === undefined) {
        data.character.tutorialCompleted = (data.character.level ?? 1) > 1;
      }
      if (data.character.tutorialRelicGranted === undefined) data.character.tutorialRelicGranted = false;
      if (data.character.quests?.completed?.includes("TUT_BACKPACK") && !data.character.tutorialRelicGranted) {
        const alreadyOwnsRelic = [...(data.character.inventory?.items ?? []), ...(data.character.depot ?? []), ...Object.values(data.character.equipped ?? {})]
          .some((item: any) => item?.templateId === "UNICO_SIGILO_INICIACAO");
        if (alreadyOwnsRelic) data.character.tutorialRelicGranted = true;
        else {
          const relic = makeEquipment("UNICO_SIGILO_INICIACAO");
          const placed = relic && addItem(data.character.inventory, relic);
          if (relic && !placed) (data.character.depot ??= []).push(relic);
          if (relic) data.character.tutorialRelicGranted = true;
        }
      }
      if (!data.character.activeVials) data.character.activeVials = {};
      if (!Number.isFinite(data.character.staminaOnline)) data.character.staminaOnline = 120;
      if (!Number.isFinite(data.character.staminaOffline)) data.character.staminaOffline = 480;
      if (!Number.isFinite(data.character.staminaUpdatedAt)) data.character.staminaUpdatedAt = Date.now();
      
      // Migração para cartas
      if (!data.character.cards) data.character.cards = [];
      if (!Array.isArray(data.character.divineBeasts)) data.character.divineBeasts = [];
      
      // Migração para o Depot
      if (!data.character.depot) data.character.depot = [];
      // Migra saves antigos: itens não empilháveis (especialmente flechas) são sempre unidades únicas.
      if (Array.isArray(data.character.inventory?.items)) {
        const normalized: any[] = [];
        for (const item of data.character.inventory.items) {
          const quantity = item.stackable ? Math.max(1, Number(item.quantity) || 1) : Math.max(1, Number(item.quantity) || 1);
          if (item.stackable || quantity === 1) normalized.push({ ...item, quantity: item.stackable ? quantity : 1, maxStack: item.stackable ? item.maxStack : 1 });
          else for (let i = 0; i < quantity; i++) normalized.push({ ...item, uid: `${item.uid}-${i + 1}`, quantity: 1, maxStack: 1 });
        }
        data.character.inventory.items = normalized;
      }
      if (data.character.depotMax === undefined) data.character.depotMax = 300;
      // Atualiza stacks antigos de componentes salvos antes do limite 999.
      for (const item of [...(data.character.inventory?.items ?? []), ...(data.character.depot ?? [])]) {
        if (item.category === "COMPONENTE" && item.stackable) item.maxStack = 999;
        if (item.templateId === "UNICO_BRASA_ETERNA") { item.category = "PULSEIRA"; item.slot = "PULSEIRA"; }
      }
      // Hidrata atributos de equipamentos criados por versões antigas e
      // preserva os níveis de upgrade já aplicados (incluindo flechas).
      for (const item of [...(data.character.inventory?.items ?? []), ...(data.character.depot ?? []), ...Object.values(data.character.equipped ?? {})] as any[]) {
        const template = ALL_ITEM_TEMPLATES[item.templateId];
        if (!template) continue;
        item.stats ??= {};
        for (const [key, value] of Object.entries(template.stats ?? {})) {
          const current = Number(item.stats[key]);
          if (!Number.isFinite(current) || current === 0) item.stats[key] = Math.round(Number(value) * Math.pow(1.1, item.upgradeLevel ?? 0) * 100) / 100;
        }
      }
      // A Brasa Eterna era criada como anel em versões antigas. Corrige também itens equipados.
      const equipped = data.character.equipped ?? {};
      for (const key of ["ANEL_I", "ANEL_II"] as const) {
        if (equipped[key]?.templateId !== "UNICO_BRASA_ETERNA") continue;
        const brasa = equipped[key]; brasa.category = "PULSEIRA"; brasa.slot = "PULSEIRA";
        if (!equipped.PULSEIRA) { equipped.PULSEIRA = brasa; delete equipped[key]; }
        else { (data.character.inventory.items ??= []).push({ ...brasa, uid: `${brasa.uid}-pulseira` }); delete equipped[key]; }
      }
    }
    // Derived limits are rebuilt from level + current bonuses, never trusted from an old cache.
    if (data.character) recalcStats(data.character);
    return data; 
  } catch (e) { 
    console.error("Erro ao carregar save:", e);
    return null; 
  }
}
