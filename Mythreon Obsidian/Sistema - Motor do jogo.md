# Motor do jogo

> Índice automático. Edite as notas originais em docs/conhecimento; este arquivo pode ser recriado.

## Conhecimento relacionado

- [[docs/conhecimento/00 - Fonte de conhecimento|Consultar as notas autorais]]

## Código e recursos

- [src/engine/cardCollection.ts](../src/engine/cardCollection.ts) — CARD_LOADOUT_LIMIT, CARD_MAX_LEVEL, CARD_HERO_WEIGHTS, CARD_EVOLUTION_GOLD, equippedCards, cardHeroBonus, formationBonus, cardFormationScore, cardEvolutionQuote, evolveCard
- [src/engine/cosmeticOwnership.ts](../src/engine/cosmeticOwnership.ts) — ownedCosmeticLoadout, normalizeCosmeticOwnership
- [src/engine/dailyBossBattle.ts](../src/engine/dailyBossBattle.ts) — BOSS_KNOCKOUT_RECOVERY_MS, bossBattleFor, bossRetaliation
- [src/engine/dailyCalendar.ts](../src/engine/dailyCalendar.ts) — CalendarClaimResult, claimCalendarReward
- [src/engine/drops.ts](../src/engine/drops.ts) — RARITY_ORDER, RARITY_MULT, rollRarity, generateRandomAffixes, makeEquipment, makeComponent, makeMaterial, makeBackpack, rollAmbient, DropMods, rollDrops
- [src/engine/gearScore.ts](../src/engine/gearScore.ts) — getGearScore, scoreCards
- [src/engine/journey.ts](../src/engine/journey.ts) — isGuided, canUseTab, canEnterZone, canTutorialHunt, unlockJourneyZone
- [src/engine/professionChallenge.ts](../src/engine/professionChallenge.ts) — GatheringKind, ProfessionChallenge, PreparedProfessionChallenge, PROFESSION_LEAD_MS, PROFESSION_DELIVERY_GRACE_MS, gatheringAccessError, prepareGathering, resolveGathering
- [src/engine/professionPrecision.ts](../src/engine/professionPrecision.ts) — PROFESSION_PULSE_MS, PERFECT_PULSE_RADIUS, GOOD_PULSE_RADIUS, professionPrecisionAt

## Relações encontradas

- [[Mythreon Obsidian/Sistema - Elementos|Elementos]]
- [[Mythreon Obsidian/Sistema - Dados do jogo|Dados do jogo]]
- [[Mythreon Obsidian/Sistema - Itens e Ferreiro|Itens e Ferreiro]]
- [[Mythreon Obsidian/Sistema - Matrizes|Matrizes]]
- [[Mythreon Obsidian/Sistema - Tipos|Tipos]]
- [[Mythreon Obsidian/Sistema - Utilitários|Utilitários]]

[[Mythreon Obsidian/Mapa de Sistemas|Mapa técnico]]
