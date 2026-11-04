# Pack 40 — PvP por turnos e combate autoritativo

Data: 04/11/2026  
Estado: implementado e validado localmente/online

## Objetivo

Substituir a resolução instantânea do duelo por uma sequência curta de ações server-side. Cada ataque agora tem dono do turno, dano calculado a partir do poder PvP, cooldown anti-spam, HP persistido e log auditável.

## Implementado

- Migration `supabase/migrations/016_pvp_turn_combat.sql`:
  - `round`, `turn_owner`, `challenger_hp`, `opponent_hp`, `combat_log` e `last_action_at` em `world_pvp_matches`.
  - FK do dono do turno e índice para localizar partidas abertas.
- `server/world.ts`:
  - operação `pvp.turn` autenticada e idempotente por turno;
  - validação de partida, expiração, dono do turno e intervalo mínimo de 800 ms;
  - dano, troca de turno, incremento de rodada e log calculados no servidor;
  - vitória, rating, histórico da temporada e recompensa finalizados na mesma transação lógica;
  - operação antiga `pvp.resolve` mantida para compatibilidade.
- `src/ui/OnlinePvP.tsx`:
  - HP de ambos os combatentes, rodada, indicação de turno e botão de ataque;
  - botão bloqueado enquanto o adversário é o dono do turno;
  - feedback do dano/vitória sem depender de estado local como fonte de verdade.
- `scripts/online-check.ts`:
  - desafio, aceite e sequência alternada de turnos até a conclusão;
  - verificação de dano positivo e log persistido.

## Verificação

- `npm run typecheck` passou.
- `npm run online:check` passou, incluindo PvP por turnos, temporadas e recompensas.
- Migration `016_pvp_turn_combat` aplicada no Supabase de produção e confirmada pela listagem de migrations/tabela.
- Build de produção executado após a alteração.

## Próximo passo seguro

Implementar reconexão/resumo de partida e executar playtest com duas contas reais em navegadores separados. Não liberar recompensa adicional nem alterar rating no cliente.
