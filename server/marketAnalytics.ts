import type { Database } from "./world";

/** Read completed sales only. Mixed barter/bundles cannot establish a unit price. */
export async function marketSalesHistory(db: Database, templateIds: string[]) {
  if (!templateIds.length) return [];
  const result = await db.query(`
    with sales as (
      select item->>'templateId' as template_id,coalesce(item->>'rarity','COMUM') as rarity,
        coalesce((item->>'tier')::int,1) as tier,coalesce((item->>'upgradeLevel')::int,0) as upgrade_level,
        currency,price::numeric as price,greatest(1,coalesce((item->>'quantity')::numeric,1)) as units,sold_at
      from public.world_market_listings
      where status='sold' and sold_at is not null and item->>'templateId'=any($1::text[])
      union all
      select lot.template_id,lot.rarity,lot.tier,lot.upgrade_level,
        case when tx.gold_price>0 then 'GOLD' else 'COINS' end,
        case when tx.gold_price>0 then tx.gold_price else tx.mythreon_coins_price end::numeric,
        lot.units,tx.completed_at
      from public.world_trade_transactions tx
      cross join lateral (
        select min(item->>'templateId') as template_id,min(coalesce(item->>'rarity','COMUM')) as rarity,
          min(coalesce((item->>'tier')::int,1)) as tier,min(coalesce((item->>'upgradeLevel')::int,0)) as upgrade_level,
          sum(greatest(1,coalesce((item->>'quantity')::numeric,1))) as units
        from jsonb_array_elements(tx.items) item
        having count(*)>0 and count(distinct jsonb_build_array(item->>'templateId',coalesce(item->>'rarity','COMUM'),coalesce((item->>'tier')::int,1),coalesce((item->>'upgradeLevel')::int,0)))=1
      ) lot
      where lot.template_id=any($1::text[]) and tx.counterparty_items='[]'::jsonb
        and ((tx.gold_price>0 and tx.mythreon_coins_price=0) or (tx.gold_price=0 and tx.mythreon_coins_price>0))
    ), totals as (
      select template_id,rarity,tier,upgrade_level,currency,count(*)::int as sale_events,sum(units) as units_sold,
        round(sum(price)/sum(units),2) as average_unit_price,
        round(min(price/units),2) as lowest_unit_price,round(max(price/units),2) as highest_unit_price,max(sold_at) as last_sold_at
      from sales group by template_id,rarity,tier,upgrade_level,currency
    ), days as (
      select template_id,rarity,tier,upgrade_level,currency,(sold_at at time zone 'UTC')::date as day,
        sum(units) as units,round(sum(price)/sum(units),2) as average
      from sales where sold_at>=now()-interval '30 days'
      group by template_id,rarity,tier,upgrade_level,currency,(sold_at at time zone 'UTC')::date
    )
    select totals.*,coalesce((
      select jsonb_agg(jsonb_build_object('day',day,'units',units,'average',average) order by day)
      from days where days.template_id=totals.template_id and days.rarity=totals.rarity and days.tier=totals.tier
        and days.upgrade_level=totals.upgrade_level and days.currency=totals.currency
    ),'[]'::jsonb) as daily from totals order by template_id,rarity,tier,upgrade_level,currency
  `, [templateIds]);
  return result.rows.map(row => ({
    ...row,
    sale_events: Number(row.sale_events), units_sold: Number(row.units_sold),
    tier: Number(row.tier), upgrade_level: Number(row.upgrade_level),
    average_unit_price: Number(row.average_unit_price), lowest_unit_price: Number(row.lowest_unit_price), highest_unit_price: Number(row.highest_unit_price),
    daily: (row.daily ?? []).map((day: any) => ({ ...day, units: Number(day.units), average: Number(day.average) })),
  }));
}
