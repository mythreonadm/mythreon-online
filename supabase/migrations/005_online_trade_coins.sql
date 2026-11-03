-- Extensão da economia online: Mythreon Coins em correio, trocas e auditoria.
-- Aplique depois de 003_trade_audit.sql e 004_chat_channels.sql.
begin;

alter table public.world_trades
  alter column offer_a set default '{"gold":0,"mythreonCoins":0,"items":[],"fee":0}',
  alter column offer_b set default '{"gold":0,"mythreonCoins":0,"items":[],"fee":0}';

alter table public.world_mail
  add column if not exists mythreon_coins bigint not null default 0 check(mythreon_coins >= 0);

alter table public.world_ledger
  add column if not exists mythreon_coins bigint not null default 0 check(mythreon_coins >= 0);

alter table public.world_trade_transactions
  add column if not exists mythreon_coins_price bigint not null default 0 check(mythreon_coins_price >= 0);

-- A view é somente leitura e expõe apenas estatísticas agregadas por item.
create or replace view public.world_trade_item_stats as
select item->>'templateId' as template_id,
       count(*)::bigint as sale_events,
       coalesce(sum((item->>'quantity')::numeric),0)::bigint as units_sold,
       avg(gold_price)::numeric(20,2) as average_gold_price,
       min(gold_price)::bigint as lowest_gold_price,
       max(gold_price)::bigint as highest_gold_price,
       max(completed_at) as last_sold_at,
       avg(mythreon_coins_price)::numeric(20,2) as average_mythreon_coin_price,
       min(mythreon_coins_price)::bigint as lowest_mythreon_coin_price,
       max(mythreon_coins_price)::bigint as highest_mythreon_coin_price
from public.world_trade_transactions tx
cross join lateral jsonb_array_elements(tx.items) item
where item ? 'templateId'
group by item->>'templateId';

grant select on public.world_trade_item_stats to authenticated;
commit;
