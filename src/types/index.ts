import type { HuntBeat } from "../engine/huntPresentation";

export type Rarity = "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
export type SlotType = "CAPACETE" | "ARMADURA" | "LUVAS" | "CALCAS" | "BOTAS" | "COLAR" | "ANEL_I" | "ANEL_II" | "PULSEIRA" | "ARMA_PRINCIPAL" | "OFF_HAND" | "MUNICAO" | "BACKPACK";
export type ItemCategory = "ARMA" | "ARMADURA" | "JOIA" | "PULSEIRA" | "ESCUDO" | "BACKPACK" | "FLECHA" | "FERRAMENTA" | "COMPONENTE" | "POCAO" | "MATERIAL" | "FRAGMENTO";
export type ComponentType = "ATAQUE" | "SUPORTE" | "PASSIVA";
export type Law = "PRIME" | "VORO" | "LOGHIS" | "EMOHNA" | "RAAN" | "SYNTHES" | "CHRONOS" | "LYSS" | "DHOR" | "KAELOR" | "NOCTHAR" | "VEYRA" | "ASTER";
export type Element = "FOGO" | "ELETRICIDADE" | "VENTO" | "TERRA" | "AGUA" | "GELO" | "MORTE" | "SAGRADO" | "PSIQUICO" | "VENENO" | "METAL" | "BASE";

// ── TIPOS DE CARTAS ──
export type CardTrait = 
  | "FURIA" | "VENENO" | "ESPINHOS" | "PRECISAO" | "INVESTIDA"
  | "REGENERACAO" | "ESCUDO" | "SANGRAMENTO" | "MEDO" | "SILENCIO";

export type CardRarity = "COMUM" | "INCOMUM" | "RARO" | "EPICO" | "LENDARIO";
export type Precision = 0.5 | 1 | 1.5;

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

/** Encantamento único aplicado no Ferreiro. Fica persistido no próprio item. */
export interface ItemEnchantment {
  id: string;
  name: string;
  zoneId: string;
  tier: 1 | 2 | 3 | 4 | 5;
  element?: Element;
  weaponDamagePct: number;
  armorResistancePct: number;
  luckBonus?: number;
  statusEffect: string;
  visualKey: string;
}

export interface Item {
  uid: string; templateId: string; name: string; category: ItemCategory; slot?: SlotType;
  tier: 1 | 2 | 3 | 4 | 5; rarity: Rarity; stats: ItemStats; affixes: Affix[];
  upgradeLevel: number;
  uniqueEffect?: string; stackable: boolean; maxStack: number; quantity: number;
  /** No máximo um encantamento único por equipamento. */
  enchantment?: ItemEnchantment;
  componentType?: ComponentType; law?: Law; element?: Element; icon: string;
  elementalDamagePct?: number; preventsDeathDrop?: boolean;
  elementalResistances?: Partial<Record<Element, number>>;
  slots?: number; dropBonus?: number; rareDropBonus?: number; xpBonus?: number;
  goldBonus?: number; lifesteal?: number;
  profession?: "MINERACAO" | "PESCA";
  requiredSkill?: number;
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
  instanceId?: string;
  obtainedAt: number;
  rarity?: Rarity;
}

export interface DivineBeastNeeds {
  nutrition: number;
  mood: number;
  updatedAt: number;
}

export interface DivineBeastIncubator {
  eggUid: string;
  tier: 1 | 2 | 3 | 4 | 5;
  startedAt: number;
  completesAt: number;
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
  element?: Element;
  elementalResistances?: Partial<Record<Element, number>>;
  protectionRingChance?: number;
  /** Drop opcional específico da região, usado por rotas laterais como Veyra. */
  equipmentDropIds?: string[];
  materialDropId?: string;
  materialChance?: number;
  sprite?: string; emoji?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** Variante especial rara, com melhor recompensa e bestiário separado. */
  isElite?: boolean;
  waveRole?: "CAPANGA" | "BOSS";
  waveStage?: number;
  waveBaseId?: string;
}

export interface Zone {
  id: string; name: string; tier: 1 | 2 | 3 | 4 | 5;
  minLevel: number; maxLevel: number; enemies: Enemy[]; ambientDrop: string;
  ambientPool?: string[];
  theme: "forest" | "mountain" | "ocean" | "ruins" | "abyss" | "swamp" | "desert";
}

export interface Inventory { backpack: Backpack; items: Item[]; }

export interface FarmPlot { id: string; seedId?: string; plantedAt?: number; readyAt?: number; wateredAt?: number; waterCount?: number; fertility?: number; }
export interface FarmSkills { planting: number; harvesting: number; irrigation?: number; fertility?: number; }
export interface FarmRecipe { id: string; name: string; icon: string; ingredients: { templateId: string; name: string; quantity: number; icon: string }[]; outputTemplateId: string; outputName: string; outputIcon: string; outputQuantity: number; sellValue: number; }
export interface FarmState { plots: FarmPlot[]; unlockedPlots: number; lastActionAt: number; skills?: FarmSkills; }
export interface ProfessionState { mining: number; fishing: number; lastMiningAt?: number; lastFishingAt?: number; }
export interface ProfessionRecipe {
  id: string;
  name: string;
  icon: string;
  profession: "MINERACAO" | "PESCA";
  requiredSkill: number;
  ingredients: { templateId: string; quantity: number }[];
  outputTemplateId: string;
  outputQuantity: number;
}

export interface CharacterSkills {
  melee: number; defense: number; magic: number; distance: number; soul: number;
}

export interface CharacterAppearance {
  body: "MASCULINO" | "FEMININO";
  skin: "CLARA" | "MORENA" | "ESCURA" | "AZUL_ESSENCIA";
  hair: "CURTO" | "LONGO" | "TRANCAS" | "ARCANO";
  hairColor: "NEGRO" | "CASTANHO" | "RUIVO" | "PRATEADO" | "AZUL";
  outfit: "VIAJANTE" | "GUARDIAO" | "MISTICO";
  outfitColor: "OCRE" | "AZUL" | "VIOLETA" | "VERDE";
}
export interface CosmeticLoadout {
  skinTemplateId?: string;
  matrixGlowTemplateId?: string;
  petAuraTemplateId?: string;
  bossAddonTemplateId?: string;
}

export type QuestObjectiveType = "KILL" | "KILL_BOSS" | "COLLECT" | "REACH_LEVEL" | "EARN_GOLD" | "SYNTHESIZE" | "EQUIP_RACE" | "CONFIGURE_POTIONS" | "SELL" | "SALVAGE" | "FORGE" | "VISIT_WIKI" | "VISIT_MATRIX" | "VISIT_FORGE" | "VISIT_BACKPACK" | "VISIT_CHARACTER" | "VISIT_BEASTS" | "VISIT_SHOP" | "VISIT_LAB" | "VISIT_DEPOT" | "TRAIN" | "UNLOCK_ZONE" | "DISCOVER_TOTAL" | "DISCOVER_NAMED";
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
  id: string; name: string; description: string; durationMinutes: number; icon: string; stats: ItemStats; price: number; xpPct?: number;
}

export interface DeathReportData {
  xpLost: number;
  goldLost: number;
  blessed?: boolean;
  protectedByRing?: boolean;
  lostBackpack?: string;
  lostItems?: string[];
}

export interface DailyBossPvpEvent {
  id: string;
  at: number;
  kind: "basic" | "attack" | "support";
  attackerId: string;
  attackerName: string;
  targetId: string;
  targetName: string;
  damage: number;
  healed?: number;
  targetHp: number;
  targetHpMax: number;
  knockedOut?: boolean;
}

export interface DailyBossBattle {
  runId: string;
  hp: number;
  hpMax: number;
  damageTaken: number;
  knockouts: number;
  recoveryUntil: number;
  lastDamage: number;
  /** Estado da arena online. Coordenadas em uma grade de 1000 x 560. */
  position?: { x: number; y: number };
  targetId?: string | null;
  pvpEnabled?: boolean;
  cooldowns?: Record<string, number>;
  lastAttackKind?: "basic" | "attack" | "support";
  /** Último evento PvP confirmado pelo servidor, visível para os dois lados. */
  lastPvpEvent?: DailyBossPvpEvent;
  /** Histórico curto para o registro de combate dos dois jogadores. */
  pvpLog?: DailyBossPvpEvent[];
}

export interface Character {
  id: string; name: string; level: number; xp: number; xpToNext: number; gold: number;
  hp: number; hpMax: number; mp: number; mpMax: number; baseStats: ItemStats;
  appearance?: CharacterAppearance;
  cosmeticLoadout?: CosmeticLoadout;
  /** Cosméticos já convertidos em propriedade permanente; não ocupam a mochila. */
  unlockedCosmetics?: string[];
  mythreonShards?: number; mythreonCoins?: number;
  /** Buffs da Loja Mythreon: chave -> timestamp de expiração; 0 significa eterno. */
  mythreonBoosts?: Record<string, number>;
  equipped: Partial<Record<SlotType, Item>>; inventory: Inventory;
  raceId?: string; activeRace?: Race; killsInZone: number; currentZoneId?: string;
  activeEnemyId?: string;
  huntWaveProgress?: Record<string, number>;
  fightWaveKey?: string;
  fightWaveStage?: number;
  elementalResistances?: Partial<Record<Element, number>>;
  staminaOnline?: number;
  staminaOffline?: number;
  staminaUpdatedAt?: number;
  staminaGoldPurchaseDay?: string;
  staminaCoinPurchaseDay?: string;
  premium: boolean; /** Entitlement comercial sincronizado do servidor; nunca é ativado pelo cliente. */
  premiumPlanId?: string; premiumUntil?: number;
  lastTick: number; trainingBoostUntil?: number; trainingBoostDay?: string;
  /** Bônus de participação no Boss Diário, válido até o próximo ciclo. */
  dailyBossXpUntil?: number;
  /** Vida isolada do Boss cooperativo, calculada exclusivamente pelo servidor. */
  dailyBossBattle?: DailyBossBattle;
  /** Identidade futura da guild; não bloqueia a arena durante os testes. */
  guildId?: string;
  /** Classificação do PvP ranqueado online. */
  pvpRating?: number; pvpWins?: number; pvpLosses?: number;
  
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
  introSeen?: boolean;
  journeyVersion?: number;
  unlockedZoneIds?: string[];
  tutorialCompleted?: boolean;
  tutorialRelicGranted?: boolean;
  
  autoSell?: Rarity | null;
  autoSalvage?: Rarity | null;
  autoSellTemplateIds?: string[];
  autoSalvageTemplateIds?: string[];
  /** Itens explicitamente ignorados pelo autoloot após liberar o bestiário. */
  ignoredLootTemplateIds?: string[];
  /** Abates registrados por criatura para liberar o catálogo de drops. */
  bestiaryKills?: Record<string, number>;
  
  tickCount?: number;
  huntEncounterStartedAtTick?: number;
  totalKills?: number;
  totalSalvaged?: number;
  enemyHp?: number; enemyHpId?: string;
  doubleAtkUntil?: number;
  onlineBalloonUntil?: number;
  
  activeVials: Record<string, number>;
  
  skills: CharacterSkills;
  skillXp: CharacterSkills;
  statPoints: number;
  trainingSkill?: keyof CharacterSkills | null;
  trainingMastery?: Partial<CharacterSkills>;
  trainingSeconds?: Partial<CharacterSkills>;
  trainingAchievements?: string[];
  trainingLastTick?: number;
  /** Combo especial: fica armado por poucos segundos e é consumido no próximo tick. */
  comboReadyUntil?: number;
  comboCooldownUntil?: number;
  /** Multiplicador total do próximo combo: 1.5, 1.0 ou 0.5 conforme a precisão. */
  comboPower?: 1.5 | 1 | 0.5;
  
  cards: CardInstance[];
  /** Formação persistente da Arena: até cinco cartas que também compõem o poder da build. */
  cardLoadout?: string[];
  arenaRewardDay?: string;
  arenaRewardsToday?: number;
  arenaRareRewardDay?: string;
  calendarCoupons?: number;
  calendarClaimedDays?: string[];
  calendarStreak?: number;
  calendarLastClaimDay?: string;
  /** Marco da sequência já entregue (início YYYY-MM-DD:número); aceita chave ISO legada. */
  calendarWeeklyRewardKey?: string;
  /** Marco mensal da skin exclusiva já entregue (chave YYYY-MM). */
  calendarMonthlySkinKey?: string;
  /** Skins de calendário permanentemente conquistadas, independentes da mochila. */
  calendarUnlockedSkins?: string[];
  /** Tempo acumulado em atividade online para abrir o Baú do Refúgio. */
  onlineChestSeconds?: number;
  onlineChestsOpened?: number;
  /** Trilha diária de marcos do Baú do Refúgio, reiniciada em UTC. */
  onlineChestDay?: string;
  onlineChestClaims?: string[];
  divineBeasts?: DivineBeastInstance[];
  activeDivineBeastId?: DivineBeastId;
  divineBeastNeeds?: Partial<Record<DivineBeastId, DivineBeastNeeds>>;
  divineBeastAttackTimerMs?: number;
  divineBeastIncubator?: DivineBeastIncubator;
  huntStatsByZone?: Record<string, HuntZoneStats>;
  fightEnemyId?: string;
  fightDamageDealt?: number;
  fightDamageTaken?: number;
  fightPotionGoldSpent?: number;
  fightDamageBreakdown?: DamageBreakdown;
  fightDamageTakenBreakdown?: DamageBreakdown;
  
  depot: Item[];       // NOVO
  depotMax: number;    // NOVO
  farm?: FarmState;
  professions?: ProfessionState;
  equippedMiningTool?: Item;
  equippedFishingRod?: Item;
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
  damageBreakdown?: DamageBreakdown;
  damageTakenBreakdown?: DamageBreakdown;
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

export interface DamageBreakdown {
  physical: number;
  elemental: Partial<Record<Element, number>>;
  lifestealHealing: number;
}

export interface SaveFile {
  version: number; character: Character; races: Race[];
  settings: { autoSellCommon: boolean; soundEnabled: boolean; };
  stats: { totalKills: number; totalDrops: number; totalGold: number; };
}

export interface TickResult {
  huntBeat?: HuntBeat;
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
  comboHitDamage?: [number, number];
  comboRank?: "ouro" | "prata" | "bronze";
  /** Dano separado da Besta/Pet para que a interface mostre o ataque auxiliar. */
  beastDamage?: number;
  beastElement?: Element;
  beastName?: string;
  deathData?: DeathReportData;
  cardsDropped?: CardInstance[];
  damageDealt?: number;
  damageTaken?: number;
  damageBreakdown?: DamageBreakdown;
  damageTakenBreakdown?: DamageBreakdown;
  combatDurationMs?: number;
  encounters?: HuntEncounterRecord[];
  divineBeastsDropped?: DivineBeastId[];
  staminaDepleted?: boolean;
  mythreonShards?: number;
  mythreonCoins?: number;
}
