-- Estatísticas públicas do mercado sem view SECURITY DEFINER.
begin;
drop view if exists public.world_trade_item_stats;

create table if not exists public.world_trade_item_stats (
  template_id text primary key,
  sale_events bigint not null default 0 check(sale_events >= 0),
  units_sold bigint not null default 0 check(units_sold >= 0),
  average_gold_price numeric(20,2) not null default 0,
  lowest_gold_price bigint not null default 0 check(lowest_gold_price >= 0),
  highest_gold_price bigint not null default 0 check(highest_gold_price >= 0),
  last_sold_at timestamptz,
  average_mythreon_coin_price numeric(20,2) not null default 0,
  lowest_mythreon_coin_price bigint not null default 0 check(lowest_mythreon_coin_price >= 0),
  highest_mythreon_coin_price bigint not null default 0 check(highest_mythreon_coin_price >= 0)
);

alter table public.world_trade_item_stats enable row level security;
revoke all on public.world_trade_item_stats from public, anon;
grant select on public.world_trade_item_stats to authenticated;
drop policy if exists read_market_stats on public.world_trade_item_stats;
create policy read_market_stats on public.world_trade_item_stats for select to authenticated using(true);
commit;
