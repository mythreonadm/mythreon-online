# Pack 21 — Mercado Negro online

Data: 04/11/2026

## Entregue

- Tabela `world_market_listings` com custódia do item, vendedor, moeda, preço, taxa, validade e comprador.
- Anúncios por Gold ou Mythreon Coins com validade de 48 horas.
- Compra atômica: o servidor valida saldo, impede compra própria, entrega no depósito e registra ledger.
- Cancelamento com devolução segura do item ao depósito do vendedor.
- Expiração automática e filtros de ofertas.
- Tela online dentro da Loja Mythreon, com busca, publicação, compra e gestão dos próprios anúncios.
- Taxa de 5% (mínimo 10 Gold ou 1 Coin) aplicada no fechamento; o cliente nunca decide o saldo final.
- RLS somente leitura para usuários autenticados; escrita apenas pela API server-side.

## Arquivos principais

- `supabase/migrations/009_market_listings.sql`
- `server/world.ts`
- `src/ui/OnlineMarket.tsx`
- `src/ui/Shop.tsx`
- `scripts/online-check.ts`

## Validação

- `npm run typecheck` passou.
- `npm run online:check` passou em PostgreSQL/PGlite e na camada de autenticação/origem.

## Próxima evolução

- Paginação e filtros por raridade/bioma.
- Histórico público de preço médio por template, sem expor dados pessoais.
- Moderação, denúncia e limite diário de anúncios.
- Teste concorrente com duas contas tentando comprar o mesmo anúncio.
