export type Rarity = "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
export type SlotType = "CAPACETE" | "ARMADURA" | "LUVAS" | "CALCAS" | "BOTAS" | "COLAR" | "ANEL_I" | "ANEL_II" | "ARMA_PRINCIPAL" | "OFF_HAND" | "MUNICAO" | "BACKPACK";
export type ItemCategory = "ARMA" | "ARMADURA" | "JOIA" | "ESCUDO" | "BACKPACK" | "FLECHA" | "COMPONENTE" | "POCAO" | "MATERIAL" | "FRAGMENTO";
export type ComponentType = "ATAQUE" | "SUPORTE" | "PASSIVA";
export type Law = "PRIME" | "VORO" | "LOGHIS" | "EMOHNA" | "RAAN" | "SYNTHES" | "CHRONOS" | "LYSS" | "DHOR" | "KAELOR" | "NOCTHAR" | "VEYRA" | "ASTER";
export type Element = "FOGO" | "GELO" | "TROVAO" | "TERRA" | "SAGRADO" | "SOMBRIO";

// ── TIPOS DE CARTAS ──
export type CardTrait = 
  | "FURIA" | "VENENO" | "ESPINHOS" | "PRECISAO" | "INVESTIDA"
  | "REGENERACAO" | "ESCUDO" | "SANGRAMENTO" | "MEDO" | "SILENCIO";

export type CardRarity = "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";

export interface CardStats {
  hp: number;
  atk: number;
  def: number;
  spd: number;
}

export interface CardTemplate {
  monsterId: string;
  name: string;
  region: string;
  rarity: CardRarity;
  trait: CardTrait;
  baseStats: CardStats;
  ability: string;
  abilityDesc: string;
  emoji: string;
  sprite?: string;
}

export interface CardInstance {
  uid: string;
  templateId: string;
  level: number;
  obtainedAt: number;
}
// ── FIM TIPOS DE CARTAS ──

export interface ItemStats {
  atk?: number; matk?: number; def?: number; arm?: number;
  hp?: number; mp?: number; spd?: number; crit?: number;
  hit?: number; dge?: number; blk?: number;
  resFisico?: number; resMagico?: number;
  hpRegen?: number; mpRegen?: number; luck?: number; critDmg?: number;
}

export interface Affix { law: Law; stat: keyof ItemStats; value: number; }

export interface Item {
  uid: string; templateId: string; name: string; category: ItemCategory; slot?: SlotType;
  tier: 1 | 2 | 3 | 4 | 5; rarity: Rarity; stats: ItemStats; affixes: Affix[];
  upgradeLevel: number;
  uniqueEffect?: string; stackable: boolean; maxStack: number; quantity: number;
  componentType?: ComponentType; law?: Law; element?: Element; icon: string;
  slots?: number; dropBonus?: number; rareDropBonus?: number; xpBonus?: number;
  goldBonus?: number; lifesteal?: number;
}

export interface ComponentTemplate {
  id: string; name: string; type: ComponentType; law: Law; icon: string;
  skillName: string; skillDescription: string;
}

export interface Race {
  id: string; name: string; tier: "COMUM" | "NOMEADA" | "ASCENDIDA";
  ataqueId: string; suporteId: string; passivaId: string;
  skills: { ataque: string; suporte: string; passiva: string; };
  bonus: ItemStats;
}

export type DivineBeastId = "LYSS_STAG" | "DHOR_GRIFFIN" | "AZHAR_SERPENT" | "ASTERION_OWL" | "VOID_FOX"
  | "ASTER_PHOENIX" | "NOCTHAR_MOTH" | "KAELOR_SALAMANDER" | "VEYRA_TORTOISE" | "DHOR_BEETLE" | "LYSS_MOTH" | "NYR_SKY_RAY";

export interface DivineBeastTemplate {
  id: DivineBeastId;
  name: string;
  title: string;
  region: string;
  bossId: string;
  rarity: "RARO" | "EPICO" | "LENDARIO";
  emoji: string;
  sprite: string;
  lore: string;
  bond: string;
  bonus: Partial<ItemStats>;
  dropChance: number;
}

export interface DivineBeastInstance {
  id: DivineBeastId;
  obtainedAt: number;
}

export interface Backpack {
  templateId: string; name: string; slots: number; dropBonus: number; rareDropBonus: number; xpBonus: number;
}

export interface Enemy {
  id: string; name: string; hp: number; atk: number; arm: number; xp: number;
  goldMin: number; goldMax: number; componentId: string; componentChance: number;
  essenceId?: string; essenceChance?: number; isBoss: boolean;
  backpackDrop?: string; backpackChance?: number;
  uniqueDropId?: string; uniqueDropChance?: number;
  minLevel?: number;
  damageType?: "FISICO" | "MAGICO";
  sprite?: string; emoji?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

export interface Zone {
  id: string; name: string; tier: 1 | 2 | 3 | 4 | 5;
  minLevel: number; maxLevel: number; enemies: Enemy[]; ambientDrop: string;
  ambientPool?: string[];
  theme: "forest" | "mountain" | "ocean" | "ruins" | "abyss";
}

export interface Inventory { backpack: Backpack; items: Item[]; }

export interface CharacterSkills {
  melee: number; defense: number; magic: number; distance: number; soul: number;
}

export type QuestObjectiveType = "KILL" | "KILL_BOSS" | "COLLECT" | "REACH_LEVEL" | "EARN_GOLD" | "SYNTHESIZE" | "SELL" | "SALVAGE" | "FORGE" | "VISIT_WIKI" | "VISIT_MATRIX" | "VISIT_FORGE" | "VISIT_BACKPACK" | "DISCOVER_TOTAL" | "DISCOVER_NAMED";
export type QuestCategory = "TUTORIAL" | "HISTORIA" | "CACA" | "COLETA" | "DESAFIO" | "REPETIVEL" | "COMPENDIO";

export interface QuestObjective { type: QuestObjectiveType; target?: string; count: number; description: string; }
export interface QuestReward { gold?: number; xp?: number; items?: { templateId: string; quantity?: number; rarity?: Rarity }[]; }
export interface QuestTemplate { id: string; name: string; description: string; giver: string; category: QuestCategory; zoneId?: string; minLevel: number; requires?: string[]; objectives: QuestObjective[]; rewards: QuestReward; repeatable?: boolean; }
export interface QuestProgress { progress: number[]; }
export interface QuestState { active: Record<string, QuestProgress>; completed: string[]; }

export interface OfflineReportData {
  timeAwaySeconds: number; xpGained: number; goldGained: number; itemsDropped: number; levelsGained: number;
}

export interface BuffVialTemplate {
  id: string; name: string; description: string; durationMinutes: number; icon: string; stats: ItemStats; price: number;
}

export interface DeathReportData {
  xpLost: number;
  goldLost: number;
}

export interface Character {
  id: string; name: string; level: number; xp: number; xpToNext: number; gold: number;
  hp: number; hpMax: number; mp: number; mpMax: number; baseStats: ItemStats;
  equipped: Partial<Record<SlotType, Item>>; inventory: Inventory;
  raceId?: string; activeRace?: Race; killsInZone: number; currentZoneId?: string;
  activeEnemyId?: string;
  premium: boolean; lastTick: number;
  
  quests: QuestState;
  blesses: number;
  
  autoPotion?: number;
  autoHpPotionId?: string | null;
  autoHpPotionPercent?: number;
  autoHpPotionEnabled?: boolean;
  autoMpPotionId?: string | null;
  autoMpPotionPercent?: number;
  autoMpPotionEnabled?: boolean;
  potionGoldWarningUntil?: number;
  tutorialCompleted?: boolean;
  
  autoSell?: Rarity | null;
  autoSalvage?: Rarity | null;
  
  tickCount?: number;
  totalKills?: number;
  totalSalvaged?: number;
  enemyHp?: number; enemyHpId?: string;
  doubleAtkUntil?: number;
  
  activeVials: Record<string, number>;
  
  skills: CharacterSkills;
  skillXp: CharacterSkills;
  statPoints: number;
  trainingSkill?: keyof CharacterSkills | null;
  
  cards: CardInstance[];
  arenaRewardDay?: string;
  arenaRewardsToday?: number;
  arenaRareRewardDay?: string;
  divineBeasts?: DivineBeastInstance[];
  activeDivineBeastId?: DivineBeastId;
  huntStatsByZone?: Record<string, HuntZoneStats>;
  fightEnemyId?: string;
  fightDamageDealt?: number;
  fightDamageTaken?: number;
  fightPotionGoldSpent?: number;
  
  depot: Item[];       // NOVO
  depotMax: number;    // NOVO
}

export interface HuntLootEntry {
  name: string;
  icon: string;
  quantity: number;
  sellValue: number;
  kind: "item" | "card";
}

export interface HuntEncounterRecord {
  id: string;
  timestamp: number;
  zoneId: string;
  enemyId: string;
  enemyName: string;
  damageDealt: number;
  damageTaken: number;
  xp: number;
  gold: number;
  goldSpentPotions?: number;
  soldGold: number;
  lootValue: number;
  loot: HuntLootEntry[];
  outcome?: "victory" | "death";
}

export interface HuntZoneStats {
  activeMs: number;
  kills: number;
  damageDealt: number;
  damageTaken: number;
  xp: number;
  gold: number;
  goldSpentPotions?: number;
  soldGold: number;
  lootValue: number;
  history: HuntEncounterRecord[];
}

export interface SaveFile {
  version: number; character: Character; races: Race[];
  settings: { autoSellCommon: boolean; soundEnabled: boolean; };
  stats: { totalKills: number; totalDrops: number; totalGold: number; };
}

export interface TickResult {
  kills: number; gold: number; xp: number; drops: Item[];
  levelsGained: number; death: boolean; log: string[];
  enemyHp: number; enemyMaxHp: number;
  zoneId?: string; attacked?: boolean; lastDamage?: number; lastCrit?: boolean; lastMiss?: boolean;
  killed?: Record<string, number>;
  bossKills?: Record<string, number>;
  dropCounts?: Record<string, number>;
  potionsUsed?: number; goldSpentPotions?: number; soldGold?: number;
  salvagedItems?: number;
  skillLevelUp?: string;
  usedMp?: boolean;
  deathData?: DeathReportData;
  cardsDropped?: CardInstance[];
  damageDealt?: number;
  damageTaken?: number;
  combatDurationMs?: number;
  encounters?: HuntEncounterRecord[];
  divineBeastsDropped?: DivineBeastId[];
}
