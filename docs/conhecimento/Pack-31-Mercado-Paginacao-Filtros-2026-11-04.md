# Pack 31 — Mercado Negro: paginação, filtros e estatísticas

Data: 04/11/2026  
Estado: implementado localmente; requer migration 012 em produção e teste concorrente real.

## Entrega

- O Mercado Negro deixou de carregar uma lista fixa de 100 anúncios.
- Consulta server-side paginada em blocos de 24 ofertas.
- Busca por nome do item ou vendedor.
- Filtro por Gold/Mythreon Coins e raridade.
- Ordenação por mais recentes, menor preço ou maior preço.
- Resumo da consulta com total, média, mínimo e máximo de preço.
- A tela mantém os anúncios próprios, cancelamento e custódia já existentes.
- A compra continua atômica e não confia em preço calculado no cliente.

## Segurança

- Os filtros aceitam apenas enums conhecidos; não há SQL livre vindo do navegador.
- A ordenação usa uma lista fixa no servidor.
- Expiração de anúncios continua sendo processada antes da consulta.
- A paginação não altera escrow, saldo, taxa ou histórico.

## Arquivos

- `supabase/migrations/012_market_search_indexes.sql`
- `server/world.ts`
- `src/ui/OnlineMarket.tsx`
- `scripts/online-check.ts`

## Verificação

`npm run online:check` valida busca por item, filtro de moeda/raridade, ordenação, resumo e compra atômica.

## Ainda falta

1. Aplicar a migration 012 no Supabase de produção.
2. Moderação administrativa, denúncia e bloqueio de anúncios abusivos.
3. Histórico público de preço por item e gráficos por período.
4. Teste concorrente com várias compras no mesmo anúncio e muitas páginas.
