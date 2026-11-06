# Dados do jogo

> Índice automático. Edite as notas originais em docs/conhecimento; este arquivo pode ser recriado.

## Conhecimento relacionado

- [[docs/conhecimento/00 - Fonte de conhecimento|Consultar as notas autorais]]

## Código e recursos

- [src/data/affixes.ts](../src/data/affixes.ts) — AffixPoolDef, PERCENT_AFFIX_RANGES, WEAPON_AFFIXES, ARMOR_AFFIXES, SHIELD_AFFIXES, JEWELRY_AFFIXES, getPoolForCategory, STAT_NAMES
- [src/data/balance.ts](../src/data/balance.ts) — BALANCE, clamp, mitigatedDamage
- [src/data/cards.ts](../src/data/cards.ts) — TRAITS, CARD_TEMPLATES, PACK60_CARD_TEMPLATE_IDS, CARD_SEASON_EXPANSION_KEY, seasonCardTemplateIds, seasonCardCatalogSize, seasonUniqueCards, getCardStats, createCardInstance, cardDropChance, rollCardDrop
- [src/data/cosmetics.ts](../src/data/cosmetics.ts) — CosmeticSlot, COSMETIC_SLOTS, CosmeticDefinition, COSMETIC_DEFINITIONS
- [src/data/dailyBoss.ts](../src/data/dailyBoss.ts) — DailyBossStatus, DailyBossTemplate, DAILY_BOSS_TEMPLATES, dailyCycleKey, dailyBossTemplate, findBossEnemy
- [src/data/dailyCalendar.ts](../src/data/dailyCalendar.ts) — CALENDAR_COUPON_PRICE, CALENDAR_WEEK_DAYS, CALENDAR_WEEK_FRAGMENTS, CALENDAR_MAX_GOLD_STREAK, CalendarDailyReward, CALENDAR_DAILY_REWARDS, CALENDAR_MONTHLY_REWARDS, calendarDayKey, validCalendarDay, calendarMonthInfo, calendarClaimedDays, calendarUnlockedSkins
- [src/data/enchantments.ts](../src/data/enchantments.ts) — UniqueEnchantmentDefinition, UNIQUE_ENCHANTMENTS, RESERVED_ENCHANTMENT_ELEMENTS, ENCHANTMENT_RUNE_TEMPLATE, enchantmentForZone, buildItemEnchantment, enchantmentRuneTemplateId
- [src/data/farm.ts](../src/data/farm.ts) — FarmSeed, FARM_SEEDS, FARM_RECIPES, farmRecipe, FARM_MAX_PLOTS, FARM_FERTILITY_MAX, FARM_FERTILITY_MIN, FARM_FERTILITY_LOSS_PER_HARVEST, FARM_FERTILITY_COMPOST_GAIN, FarmExpansionCost, farmExpansionCost, farmSeed
- [src/data/journal-releases.json](../src/data/journal-releases.json)
- [src/data/mythreonEconomy.ts](../src/data/mythreonEconomy.ts) — MYTHREON_ECONOMY, MythreonOfferKind, MythreonOffer, MYTHREON_OFFERS, getMythreonOffer, MYTHREON_DONATION_PACKS, PREMIUM_BENEFITS, MYTHREON_PREMIUM_PLANS, shardChance
- [src/data/mythreonJournal.ts](../src/data/mythreonJournal.ts) — JournalKind, JournalEntry, MYTHREON_JOURNAL, journalKindClass
- [src/data/onlineChest.ts](../src/data/onlineChest.ts) — ONLINE_CHEST_MILESTONES, OnlineChestMilestone, onlineChestDayKey, normalizeOnlineChest, nextOnlineChest
- [src/data/potionEconomy.ts](../src/data/potionEconomy.ts) — getPotionUsePrice
- [src/data/professions.ts](../src/data/professions.ts) — ProfessionAction, FISHING_BAIT, MiningNode, FishingSpot, ProfessionToolOffer, PROFESSION_TOOL_SHOP, MINING_NODES, FISHING_SPOTS, professionCooldown, PROFESSION_RECIPES
- [src/data/vials.ts](../src/data/vials.ts) — VIALS
- [src/data/worldJourney.ts](../src/data/worldJourney.ts) — JourneyChapter, JOURNEY_CHAPTERS

## Relações encontradas

- [[Mythreon Obsidian/Sistema - Itens e Ferreiro|Itens e Ferreiro]]
- [[Mythreon Obsidian/Sistema - Tipos|Tipos]]
- [[Mythreon Obsidian/Sistema - Utilitários|Utilitários]]
- [[Mythreon Obsidian/Sistema - Mundo e História|Mundo e História]]

[[Mythreon Obsidian/Mapa de Sistemas|Mapa técnico]]
