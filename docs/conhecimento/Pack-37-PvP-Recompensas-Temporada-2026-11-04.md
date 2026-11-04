# Pack 37 — Temporadas e recompensas do PvP ranqueado

## Objetivo

Transformar o rating do PvP em uma progressão sazonal persistente, com recompensa única por personagem e proteção contra duplicidade, sem permitir que o cliente altere rating ou saldo.

## Implementado

- Snapshot server-side em `world_pvp_season_stats` a cada duelo concluído.
- Temporada UTC mensal (`YYYY-MM`), exibida no lobby e com histórico da temporada anterior.
- Tiers: Bronze, Prata, Ouro, Platina e Mítico.
- Recompensas escalonadas em Gold, Mythreon Shards e Mythreon Coins; vitórias acima de cinco adicionam bônus de Gold/Shards com teto.
- Resgate `pvp.season.claim` somente para temporadas encerradas.
- Restrição única por `(season_key, character_id)` e ledger auditável.
- UI com prévia, tier, estatísticas e botão de resgate.

## Regras de recompensa

| Tier | Rating | Gold base | Shards base | Coins |
|---|---:|---:|---:|---:|
| Bronze | 0–1199 | 2.000 | 10 | 0 |
| Prata | 1200–1399 | 5.000 | 25 | 0 |
| Ouro | 1400–1599 | 10.000 | 50 | 1 |
| Platina | 1600–1799 | 20.000 | 100 | 1 |
| Mítico | 1800+ | 40.000 | 200 | 2 |

Cada vitória concede +2 Shards, limitado a +100, e cada vitória acima da quinta concede +250 Gold, limitado a +10.000.

## Segurança

- O cálculo do tier e dos valores ocorre exclusivamente no servidor.
- O cliente só envia a chave da temporada a resgatar.
- A temporada atual é rejeitada até o encerramento.
- A chave única impede resgate duplicado mesmo em reconexões.
- As tabelas ficam protegidas por RLS para leitura do próprio proprietário; escrita fica restrita ao runtime online.

## Validação

`npm run typecheck`, `npm run online:check`, `npm run online:bundle`, `npm run online:bundle-check`, `npm run build`, `npm run journey:check`, `npm run brain:sync`, `npm run brain:check` e `git diff --check` devem passar antes do deploy.

## Próximos passos

1. Migration `015_pvp_season_rewards.sql` aplicada no projeto Supabase de produção em 04/11/2026; as tabelas foram confirmadas com RLS ativo.
2. Fazer playtest com duas ou mais contas em paralelo.
3. Adicionar turnos em tempo real, ligas e reconexão antes do lançamento público.
