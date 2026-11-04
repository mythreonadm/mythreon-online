# Pack 43 — Temporada de Cards e recompensas de coleção

Data: 04/11/2026  
Estado: implementado e validado localmente/online

## Objetivo

Transformar o Álbum de Cards em uma vocação contínua: a coleção acompanha o mês, registra o melhor progresso e entrega uma recompensa única quando a temporada termina.

## Faixas

- 50% da coleção: **Colecionador** — 3.000 Gold e 20 Mythreon Shards.
- 80% da coleção: **Mestre** — 8.000 Gold, 45 Mythreon Shards e 1 Mythreon Coin.
- 100% da coleção: **Completo** — 15.000 Gold, 80 Mythreon Shards e 2 Mythreon Coins.

## Implementado

- Migration `supabase/migrations/017_card_season_rewards.sql`:
  - `world_card_season_progress` guarda o maior snapshot mensal por personagem;
  - `world_card_season_rewards` funciona como ledger único de resgate;
  - RLS permite apenas leitura das próprias linhas.
- `server/world.ts`:
  - `cards.season.read` registra o snapshot atual e mostra a temporada anterior;
  - `cards.season.claim` valida a temporada encerrada, exige a faixa mínima, entrega recursos e grava auditoria;
  - operação idempotente protegida por `world_operations` e `world_ledger`.
- `src/ui/CardAlbum.tsx`:
  - painel de temporada, prévia da faixa e botão de resgate;
  - estado de recompensa resgatada e mensagens de erro/sucesso.
- `scripts/online-check.ts`:
  - leitura do snapshot, prévia de 100%, resgate e bloqueio de segundo resgate.

## Verificação

- `npm run online:check` passou incluindo o novo fluxo.
- Migration aplicada no Supabase de produção e confirmada na listagem de migrations/tabelas.

## Próximo passo

Criar catálogo de skins sazonais conectado às faixas e validar o fechamento do mês com uma conta real, sem alterar a regra de combate.

## Continuidade — Pack 59

Evolução por duplicatas implementada sem remover a espécie principal: contagem sazonal única é preservada. O Álbum invalida leituras antigas por personagem e aguarda confirmação de resgate/evolução. Queries e tabelas desta temporada não foram alteradas. [[docs/conhecimento/Pack-59-Cards-Evolucao-e-Bonus-Reais-2026-11-04|Evidências e limites]]. Próximo catálogo de Veyra/Kaelor precisa tratar referência sazonal antes de aumentar o total exigido.
