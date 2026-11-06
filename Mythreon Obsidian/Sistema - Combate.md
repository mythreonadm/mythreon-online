# Combate

> Índice automático. Edite as notas originais em docs/conhecimento; este arquivo pode ser recriado.

## Conhecimento relacionado

- [[docs/conhecimento/Balanceamento-Combate-Economia|Balanceamento de combate e economia]]
- [[docs/conhecimento/Comunidade-no-Registro-de-Combate-2026-11-03|Comunidade no Registro de Combate — 2026-11-03]]
- [[docs/conhecimento/Pack-40-PvP-Combate-por-Turnos-2026-11-04|Pack 40 — PvP por turnos e combate autoritativo]]
- [[docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04|Pack 50 — Arena visual do Boss Diário]]
- [[docs/conhecimento/PvP-Arena-Movel-e-Caca-2026-11-05|Arena móvel, registro PvP e recuperação de caça — 2026-11-05]]

## Código e recursos

- [docs/conhecimento/Balanceamento-Combate-Economia.md](../docs/conhecimento/Balanceamento-Combate-Economia.md)
- [docs/conhecimento/Comunidade-no-Registro-de-Combate-2026-11-03.md](../docs/conhecimento/Comunidade-no-Registro-de-Combate-2026-11-03.md)
- [docs/conhecimento/Pack-40-PvP-Combate-por-Turnos-2026-11-04.md](../docs/conhecimento/Pack-40-PvP-Combate-por-Turnos-2026-11-04.md)
- [docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04.md](../docs/conhecimento/Pack-50-Arena-Visual-Boss-Cooperativo-2026-11-04.md)
- [docs/conhecimento/PvP-Arena-Movel-e-Caca-2026-11-05.md](../docs/conhecimento/PvP-Arena-Movel-e-Caca-2026-11-05.md)
- [public/assets/backgrounds/duel.png](../public/assets/backgrounds/duel.png)
- [scripts/daily-boss-arena-check.cjs](../scripts/daily-boss-arena-check.cjs)
- [src/data/beastCombat.ts](../src/data/beastCombat.ts) — getBeastCombat, beastGrowth
- [src/engine/cardArena.ts](../src/engine/cardArena.ts) — ArenaSize, ArenaStrategy, ArenaFighter, ArenaLogEntry, ArenaBattleResult, toFighter, makeOpponentDeck, simulateArenaDuel
- [src/engine/combat.ts](../src/engine/combat.ts) — buildProfile, processTick
- [src/ui/ArenaDuelos.tsx](../src/ui/ArenaDuelos.tsx) — ArenaDuelos
- [src/ui/CombatCommunity.tsx](../src/ui/CombatCommunity.tsx) — CombatCommunity
- [src/ui/CombatLog.tsx](../src/ui/CombatLog.tsx) — CombatLog
- [src/ui/CombatLogCompact.tsx](../src/ui/CombatLogCompact.tsx) — CombatLogCompact
- [src/ui/DailyBossArena.tsx](../src/ui/DailyBossArena.tsx) — BossArenaParticipant, BossArenaRun, BossArenaHit, DailyBossArena
- [src/ui/Duelos.tsx](../src/ui/Duelos.tsx) — Duelos
- [src/ui/dailyBossArena.css](../src/ui/dailyBossArena.css)
- [src/utils/combatVisuals.ts](../src/utils/combatVisuals.ts) — getSpellEffect, getWeaponAnimation
- [supabase/migrations/016_pvp_turn_combat.sql](../supabase/migrations/016_pvp_turn_combat.sql)

## Relações encontradas

- [[Mythreon Obsidian/Sistema - Divine Beasts|Divine Beasts]]
- [[Mythreon Obsidian/Sistema - Elementos|Elementos]]
- [[Mythreon Obsidian/Sistema - Motor do jogo|Motor do jogo]]
- [[Mythreon Obsidian/Sistema - Dados do jogo|Dados do jogo]]
- [[Mythreon Obsidian/Sistema - Telas|Telas]]
- [[Mythreon Obsidian/Sistema - Itens e Ferreiro|Itens e Ferreiro]]
- [[Mythreon Obsidian/Sistema - Conhecimento e documentação|Conhecimento e documentação]]
- [[Mythreon Obsidian/Sistema - Outros arquivos|Outros arquivos]]
- [[Mythreon Obsidian/Sistema - Estado|Estado]]
- [[Mythreon Obsidian/Sistema - Atributos e progressão|Atributos e progressão]]
- [[Mythreon Obsidian/Sistema - Tipos|Tipos]]
- [[Mythreon Obsidian/Sistema - Artes e recursos|Artes e recursos]]

[[Mythreon Obsidian/Mapa de Sistemas|Mapa técnico]]
