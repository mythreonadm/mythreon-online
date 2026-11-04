-- Mercado Negro: anúncios escrowados e compras atômicas.
begin;
create table if not exists public.world_market_listings (
  id uuid primary key,
  seller_character_id uuid not null references public.world_characters(id),
  seller_owner_id uuid not null references public.world_accounts(id),
  seller_name text not null,
  item jsonb not null check(jsonb_typeof(item) = 'object'),
  currency text not null check(currency in ('GOLD','COINS')),
  price bigint not null check(price > 0 and price <= 1000000000000),
  status text not null default 'open' check(status in ('open','sold','cancelled','expired')),
  buyer_character_id uuid references public.world_characters(id),
  buyer_owner_id uuid references public.world_accounts(id),
  fee bigint not null default 0 check(fee >= 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  sold_at timestamptz
);
create index if not exists world_market_open on public.world_market_listings(status,created_at desc);
create index if not exists world_market_seller on public.world_market_listings(seller_character_id,status,created_at desc);
create index if not exists world_market_template on public.world_market_listings((item->>'templateId'),status);
alter table public.world_market_listings enable row level security;
revoke all on public.world_market_listings from public, anon, authenticated;
grant select on public.world_market_listings to authenticated;
drop policy if exists read_market_listings on public.world_market_listings;
create policy read_market_listings on public.world_market_listings for select to authenticated using(status='open' or seller_owner_id=auth.uid() or buyer_owner_id=auth.uid());
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='world_market_listings') then
    alter publication supabase_realtime add table public.world_market_listings;
  end if;
end $$;
commit;
