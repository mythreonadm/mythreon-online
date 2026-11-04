# Pack 34 — Histórico auditável do Boss Diário

Data: 04/11/2026  
Status: implementado localmente e coberto pelo teste integrado.

## O que entrou

- Nova tabela `world_daily_boss_rewards`, com uma linha única por Boss e personagem.
- Registro de dano, participação, estado do Boss, gold, XP, Shards e loot recebido.
- Consulta dos dez últimos resgates do próprio jogador no `dailyBoss.read`.
- Painel do Boss Diário com histórico visual de recompensas.
- O insert do histórico e a marcação `claimed_at` acontecem na mesma transação do resgate.

## Segurança

O histórico é protegido por RLS e só pode ser lido pelo dono da conta. A restrição `unique(run_id, character_id)` e o bloqueio do participante impedem que um retry entregue ou registre a mesma recompensa duas vezes.

## Arquivos

- `supabase/migrations/013_daily_boss_rewards.sql`
- `server/world.ts`
- `src/ui/DailyBoss.tsx`
- `scripts/online-check.ts`

## Verificação

`npm run typecheck`, `npm run online:check`, `npm run build`, `npm run online:bundle-check`, `npm run journey:check` e `npm run brain:check`.

## Pendente

Aplicar as migrations 007 e 013 no Supabase de produção e testar uma janela com várias contas reais para validar concorrência e visualização do histórico.
