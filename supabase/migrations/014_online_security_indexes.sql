-- Hardening das tabelas internas e índices dos novos fluxos online.
begin;

-- Tabelas usadas somente pelo servidor: a ausência de política não deve
-- depender de comportamento implícito do Supabase.
drop policy if exists deny_direct_world_ledger on public.world_ledger;
create policy deny_direct_world_ledger on public.world_ledger
  for all to authenticated using(false) with check(false);
drop policy if exists deny_direct_world_operations on public.world_operations;
create policy deny_direct_world_operations on public.world_operations
  for all to authenticated using(false) with check(false);
drop policy if exists deny_direct_world_premium_events on public.world_premium_events;
create policy deny_direct_world_premium_events on public.world_premium_events
  for all to authenticated using(false) with check(false);

-- Reavaliação única do auth.uid() e índices para as relações adicionadas nos packs.
drop policy if exists own_daily_boss_participation on public.world_daily_boss_participants;
create policy own_daily_boss_participation on public.world_daily_boss_participants
  for select to authenticated using(owner_id = (select auth.uid()));
drop policy if exists own_daily_boss_rewards on public.world_daily_boss_rewards;
create policy own_daily_boss_rewards on public.world_daily_boss_rewards
  for select to authenticated using(owner_id = (select auth.uid()));
drop policy if exists own_pvp_queue on public.world_pvp_queue;
create policy own_pvp_queue on public.world_pvp_queue
  for select to authenticated using(owner_id = (select auth.uid()));
drop policy if exists own_premium_entitlement on public.world_premium_entitlements;
create policy own_premium_entitlement on public.world_premium_entitlements
  for select to authenticated using(account_id = (select auth.uid()));

create index if not exists world_daily_boss_participants_character
  on public.world_daily_boss_participants(character_id, run_id);
create index if not exists world_daily_boss_rewards_character
  on public.world_daily_boss_rewards(character_id, created_at desc);
create index if not exists world_daily_boss_rewards_run
  on public.world_daily_boss_rewards(run_id, created_at desc);
create index if not exists world_pvp_queue_owner
  on public.world_pvp_queue(owner_id, status, updated_at desc);
create index if not exists world_premium_events_account
  on public.world_premium_events(account_id, received_at desc);

commit;
