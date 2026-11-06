-- Pack 56: crédito único de teste para as contas existentes até 05/11/2026.
-- O benefício é aplicado uma única vez ao primeiro personagem de cada conta
-- existente. Contas criadas depois do corte não entram na concessão.
begin;

create table if not exists public.world_one_time_grants (
  grant_key text primary key,
  amount bigint not null check (amount > 0),
  recipient_count integer not null check (recipient_count >= 0),
  recipients jsonb not null default '[]'::jsonb,
  granted_at timestamptz not null default now()
);

alter table public.world_one_time_grants enable row level security;
revoke all on public.world_one_time_grants from public, anon, authenticated;

with recipients as (
  select distinct on (owner_id) id, owner_id
  from public.world_characters
  where created_at <= timestamptz '2026-11-05 23:59:59-03'
  order by owner_id, created_at, id
), marker as (
  insert into public.world_one_time_grants(grant_key, amount, recipient_count, recipients)
  select
    'beta-mythreon-coins-2026-11-05',
    1000,
    count(*)::integer,
    coalesce(jsonb_agg(jsonb_build_object('character_id', id, 'owner_id', owner_id, 'amount', 1000)), '[]'::jsonb)
  from recipients
  where not exists (
    select 1 from public.world_one_time_grants
    where grant_key = 'beta-mythreon-coins-2026-11-05'
  )
  returning grant_key
)
update public.world_characters as character_row
set
  state = jsonb_set(
    character_row.state,
    '{character,mythreonCoins}',
    to_jsonb(coalesce(nullif(character_row.state->'character'->>'mythreonCoins', '')::bigint, 0) + 1000),
    true
  ),
  revision = character_row.revision + 1,
  updated_at = now()
from recipients, marker
where character_row.id = recipients.id;

commit;
