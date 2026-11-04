-- Pack 31: consultas paginadas e filtros do Mercado Negro.
begin;

create index if not exists world_market_open_currency
  on public.world_market_listings(status, currency, created_at desc);

create index if not exists world_market_open_rarity
  on public.world_market_listings(status, ((item->>'rarity')), created_at desc);

commit;
