-- Auditoria imutável das trocas concluídas e estatísticas agregadas do mercado.
-- Execute depois de 001_online_world.sql e 002_realtime.sql.
begin;
create table if not exists public.world_trade_transactions (
  id uuid primary key,
  trade_id uuid not null references public.world_trades(id),
  seller_character_id uuid not null references public.world_characters(id),
  seller_owner_id uuid not null references public.world_accounts(id),
  buyer_character_id uuid not null references public.world_characters(id),
  buyer_owner_id uuid not null references public.world_accounts(id),
  gold_price bigint not null default 0 check(gold_price >= 0),
  fee_gold bigint not null default 0 check(fee_gold >= 0),
  items jsonb not null default '[]' check(jsonb_typeof(items) = 'array'),
  counterparty_items jsonb not null default '[]' check(jsonb_typeof(counterparty_items) = 'array'),
  item_count integer not null default 0 check(item_count >= 0 and item_count <= 1000),
  completed_at timestamptz not null default now(),
  unique(trade_id, seller_character_id, buyer_character_id)
);
create index if not exists world_trade_tx_seller on public.world_trade_transactions(seller_character_id, completed_at desc);
create index if not exists world_trade_tx_buyer on public.world_trade_transactions(buyer_character_id, completed_at desc);
create index if not exists world_trade_tx_time on public.world_trade_transactions(completed_at desc);

-- Estatísticas por template, sem expor conteúdo privado dos itens.
create or replace view public.world_trade_item_stats as
select item->>'templateId' as template_id,
       count(*)::bigint as sale_events,
       coalesce(sum((item->>'quantity')::numeric),0)::bigint as units_sold,
       avg(gold_price)::numeric(20,2) as average_gold_price,
       min(gold_price)::bigint as lowest_gold_price,
       max(gold_price)::bigint as highest_gold_price,
       max(completed_at) as last_sold_at
from public.world_trade_transactions tx
cross join lateral jsonb_array_elements(tx.items) item
where item ? 'templateId'
group by item->>'templateId';

alter table public.world_trade_transactions enable row level security;
revoke all on public.world_trade_transactions from public, anon, authenticated;
grant select on public.world_trade_transactions to authenticated;
drop policy if exists own_trade_history on public.world_trade_transactions;
create policy own_trade_history on public.world_trade_transactions for select to authenticated
using(seller_owner_id = auth.uid() or buyer_owner_id = auth.uid());
alter view public.world_trade_item_stats owner to postgres;
revoke all on public.world_trade_item_stats from public, anon;
grant select on public.world_trade_item_stats to authenticated;
do $$ begin if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='world_trade_transactions') then alter publication supabase_realtime add table public.world_trade_transactions; end if; end $$;
commit;
