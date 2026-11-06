import { normalizeCosmeticOwnership } from '../src/engine/cosmeticOwnership';
import {randomUUID} from 'node:crypto';
import {marketSalesHistory} from './marketAnalytics';
import {freshWorld,executeGame,rankingMetrics,type WorldState} from './game';
import {reserveOffer,restoreOffer,receiveOffer,emptyOffer,integer,canTransfer,type Offer} from './transfers';
import {ONLINE_RULES,RANKING_METRICS,transferFee} from '../src/online/rules';
import {bossBattleFor,bossRetaliation} from '../src/engine/dailyBossBattle';
import {DAILY_BOSS_TEMPLATES,dailyBossTemplate,dailyCycleKey,findBossEnemy} from '../src/data/dailyBoss';
import {recalcStats,xpToNextLevel} from '../src/engine/stats';
import {CARD_TEMPLATES,seasonCardCatalogSize,seasonUniqueCards} from '../src/data/cards';
import {cardFormationScore} from '../src/engine/cardCollection';
import {makeComponent} from '../src/engine/drops';
import {createItem,DIVINE_BEAST_EGG_TEMPLATES} from '../src/data/items';
import {addItem} from '../src/engine/inventory';
import {ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS} from '../src/data/skills';
import {attackElement, elementMultiplier} from '../src/data/elementalChart';
import {BALANCE, clamp, mitigatedDamage} from '../src/data/balance';
export interface Database {query:(sql:string,values?:any[])=>Promise<{rows:any[];rowCount?:number|null}>;}
export interface WorldRequest {operation:string;characterId?:string;requestId?:string;payload?:any;}
export interface CharacterRow {id:string;owner_id:string;name:string;state:WorldState;revision:number;}
const BOSS_ARENA_WIDTH=1000;
const BOSS_ARENA_HEIGHT=560;
const BOSS_ARENA_MARGIN=60;
// Mantido aberto para o beta. Depois dos testes, trocar para true e concluir o
// fluxo de guild sem alterar a regra de combate da arena.
const DAILY_BOSS_GUILD_REQUIRED=false;
const uuid=(id:unknown)=>{if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))throw Error('Identificador inválido.');return id;};
const text=(v:unknown,max:number)=>{if(typeof v!=='string'||v.includes('\u0000')||!v.trim()||v.trim().length>max)throw Error('Texto inválido ou muito longo.');return v.trim();};
async function commitCharacter(db:Database,c:CharacterRow){normalizeCosmeticOwnership(c.state.character);if(!Number.isSafeInteger(c.state.character.gold)||c.state.character.gold<0||!Number.isSafeInteger(c.state.character.mythreonCoins??0)||(c.state.character.mythreonCoins??0)<0)throw Error("Saldo fora dos limites.");await db.query('update public.world_characters set state=$2,revision=revision+1,updated_at=now() where id=$1',[c.id,JSON.stringify(c.state)]);await db.query('insert into public.world_rankings(character_id,name,metrics,current_map) values($1,$2,$3,$4) on conflict(character_id) do update set metrics=excluded.metrics,name=excluded.name,current_map=excluded.current_map,updated_at=now()',[c.id,c.name,JSON.stringify(rankingMetrics(c.state)),c.state.character.currentZoneId]);}
async function own(db:Database,owner:string,id:unknown,lock=true){const lockClause=lock?' for update':'';const r=await db.query(`select * from public.world_characters where id=$1 and owner_id=$2${lockClause}`,[uuid(id),owner]);if(!r.rows[0])throw Error('Personagem não pertence a esta conta.');return r.rows[0] as CharacterRow;}
async function byName(db:Database,name:unknown){const r=await db.query('select id,name,owner_id,online_at from public.world_characters where lower(name)=lower($1)',[text(name,24)]);if(!r.rows[0])throw Error('Personagem não encontrado.');return r.rows[0];}
function dailyWindow(now = new Date()){
 const utc = new Date(now);
 const hour = utc.getUTCHours();
 const startHour = hour < 8 ? 0 : hour < 16 ? 8 : 16;
 const openedAt = new Date(Date.UTC(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate(), startHour));
 return {cycleKey:dailyCycleKey(utc),openedAt,closesAt:new Date(openedAt.getTime()+8*60*60*1000)};
}
async function ensureDailyBoss(db:Database){
 const window=dailyWindow();
 await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,closes_at) where status='open' and closes_at<=now()");
 const existing=(await db.query('select * from public.world_daily_boss_runs where cycle_key=$1 for update',[window.cycleKey])).rows[0];
 if(existing){
  if(existing.status==='open'&&new Date(existing.closes_at).getTime()<=Date.now()){
   await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,now()) where id=$1",[existing.id]);
   existing.status='expired';existing.resolved_at=new Date().toISOString();
  }
  return existing;
 }
 const template=dailyBossTemplate(window.cycleKey),enemy=findBossEnemy(template);
 if(!enemy)throw Error('O Boss Diário desta janela ainda não foi configurado.');
 const baseHp=Math.max(1000,Math.floor(enemy.hp*template.baseHpMultiplier)),id=randomUUID();
 await db.query('insert into public.world_daily_boss_runs(id,cycle_key,boss_template_id,boss_name,boss_title,level,base_hp,hp_total,hp_remaining,opened_at,closes_at) values($1,$2,$3,$4,$5,$6,$7,$7,$7,$8,$9) on conflict(cycle_key) do nothing',[id,window.cycleKey,template.id,template.name,template.title,template.level,baseHp,window.openedAt,window.closesAt]);
 return (await db.query('select * from public.world_daily_boss_runs where cycle_key=$1 for update',[window.cycleKey])).rows[0];
}
function applyDailyBossXp(character:WorldState['character'],xp:number){
 character.xp=Math.max(0,Number(character.xp)||0)+Math.max(0,Math.floor(xp));
 while(character.xp>=character.xpToNext){character.xp-=character.xpToNext;character.level+=1;character.statPoints=(character.statPoints??0)+3;character.xpToNext=xpToNextLevel(character.level);}
 recalcStats(character);
}
function grantDailyBossLoot(character:WorldState['character'],run:any,enemy:any,ratio:number,defeated:boolean){
 const granted:any[]=[];const put=(item:any)=>{const inventory=structuredClone(character.inventory);if(addItem(inventory,item)){character.inventory=inventory;granted.push(item);return;}if((character.depot??[]).length<(character.depotMax??300)){character.depot??=[];character.depot.push(item);granted.push(item);return;}throw Error('Libere espaço na mochila ou no depósito para receber o loot do Boss. Sua recompensa continua disponível.');};
 for(const id of [enemy?.componentId,enemy?.essenceId].filter(Boolean)){const item=makeComponent(String(id));item.quantity=defeated?2:1;put(item);}
 const tier=run.level>=80?5:run.level>=60?4:run.level>=40?3:2;const eggTemplate=DIVINE_BEAST_EGG_TEMPLATES[`OVO_BESTA_T${tier}`];
 // A participant who contributes at least 2% can roll the region's egg; defeating
 // the boss improves the chance without making the egg guaranteed for everyone.
 if(eggTemplate&&ratio>=0.02&&((defeated?30:8)+Math.floor(ratio*40)>=((run.level*13+Number(character.level??1)*7)%100))){put(createItem({...eggTemplate,quantity:1}));}
 const shards=Math.max(1,Math.floor(Number(run.level||1)*0.18+ratio*Number(run.level||1)*4));character.mythreonShards=(character.mythreonShards??0)+shards;
 return {items:granted.map(item=>({templateId:item.templateId,name:item.name,quantity:item.quantity})),shards};
}
function pvpPower(state:WorldState){const c=state.character,skills=Object.values(c.skills??{}).reduce((sum,value)=>sum+Number(value||0),0),stats=c.baseStats??{};const cardPower=cardFormationScore(c);return Math.max(1,Number(stats.atk??0)+Number(stats.matk??0)+Number(stats.arm??0)*0.8+Number(c.hpMax??0)*0.1+skills*5+Number(c.level??1)*8+Number(c.pvpRating??1000)*0.02+cardPower);}
function eloDelta(winnerRating:number,loserRating:number){const expected=1/(1+Math.pow(10,(loserRating-winnerRating)/400));return Math.max(8,Math.round(24*(1-expected)));}
function pvpSeason(now = new Date()){const key=`${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;const endsAt=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()+1,1));return {key,endsAt};}
function pvpTier(rating:number){if(rating>=1800)return 'MITICO';if(rating>=1600)return 'PLATINA';if(rating>=1400)return 'OURO';if(rating>=1200)return 'PRATA';return 'BRONZE';}
function pvpLeague(rating:number){const rows=[{id:'BRONZE',label:'Bronze',min:0,next:1200},{id:'PRATA',label:'Prata',min:1200,next:1400},{id:'OURO',label:'Ouro',min:1400,next:1600},{id:'PLATINA',label:'Platina',min:1600,next:1800},{id:'MITICO',label:'Mítico',min:1800,next:null as number|null}];const league=[...rows].reverse().find(row=>rating>=row.min)||rows[0];return {id:league.id,label:league.label,rating,minRating:league.min,nextRating:league.next,progressToNext:league.next?Math.max(0,Math.min(100,Math.round((rating-league.min)/(league.next-league.min)*100))):100};}
function pvpCombatHp(state:WorldState){const c=state.character;return Math.max(120,Math.min(5000,Math.floor(Number(c.hpMax??c.baseStats?.hp??120)*0.6)));}
function pvpTurnDamage(state:WorldState){return Math.max(8,Math.min(900,Math.floor(pvpPower(state)*0.055)));}
function pvpSeasonReward(rating:number,wins:number){const tier=pvpTier(rating);const table:any={BRONZE:{gold:2000,shards:10,coins:0},PRATA:{gold:5000,shards:25,coins:0},OURO:{gold:10000,shards:50,coins:1},PLATINA:{gold:20000,shards:100,coins:1},MITICO:{gold:40000,shards:200,coins:2}};const base=table[tier];const winBonus=Math.min(10000,Math.max(0,wins-5)*250);return {tier,gold:base.gold+winBonus,shards:base.shards+Math.min(100,wins*2),coins:base.coins};}
function cardSeason(now = new Date()){const key=`${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;const previous=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1));return {key,previousKey:`${previous.getUTCFullYear()}-${String(previous.getUTCMonth()+1).padStart(2,'0')}`};}
function cardSeasonReward(unique:number,total:number){const ratio=unique/Math.max(1,total);if(ratio>=1)return {tier:'COMPLETO',gold:15000,shards:80,coins:2};if(ratio>=0.8)return {tier:'MESTRE',gold:8000,shards:45,coins:1};if(ratio>=0.5)return {tier:'COLECIONADOR',gold:3000,shards:20,coins:0};return null;}
function arenaPositionFor(id:string){let hash=0;for(const char of id)hash=(hash*31+char.charCodeAt(0))>>>0;return {x:BOSS_ARENA_MARGIN+(hash%(BOSS_ARENA_WIDTH-BOSS_ARENA_MARGIN*2)),y:BOSS_ARENA_MARGIN+(Math.floor(hash/97)%(BOSS_ARENA_HEIGHT-BOSS_ARENA_MARGIN*2))};}
function ensureArenaBattle(character:WorldState['character'],runId:string){
 const existing=character.dailyBossBattle?.runId===runId?character.dailyBossBattle:bossBattleFor(character,runId);
 existing.position??=arenaPositionFor(character.id);
 existing.targetId??=null; existing.pvpEnabled??=true; existing.cooldowns??={};
 existing.pvpLog??=[];
 return existing;
}
function recordArenaPvpEvent(battle:WorldState['character']['dailyBossBattle'],event:any){
 if(!battle)return;
 battle.lastPvpEvent=event;
 battle.pvpLog=[...(battle.pvpLog??[]),event].slice(-30);
}
function arenaDistance(a:{x:number;y:number},b:{x:number;y:number}){return Math.hypot(a.x-b.x,a.y-b.y);}
function arenaAttackRange(kind:'basic'|'attack'|'support',attackId?:string){
 if(kind==='basic')return 170;
 if(kind==='support')return 260;
 return ['A1','A4','A6','A8','A9','A10','A14','A19'].includes(attackId??'')?185:430;
}
function arenaCooldown(kind:'basic'|'attack'|'support',stats:any,passiveId?:string){
 const speed=clamp(Number(stats?.spd??0),0,0.8);
 if(kind==='basic')return Math.max(650,Math.round(2200/(1+speed)));
 if(kind==='support')return Math.max(4500,Number(SUPPORT_EFFECTS[passiveId??'']?.cd??6)*1500);
 const reduce=PASSIVE_EFFECTS[passiveId??'']?.cdReduce??0;
 return Math.max(3500,Math.round(8500-(reduce*1500)));
}
function arenaDamage(attacker:WorldState['character'],target:WorldState['character'],kind:'basic'|'attack',attackId?:string){
 const stats=attacker.baseStats??{};const targetStats=target.baseStats??{};const element=kind==='attack'?attackElement(attackId):'BASE';
 const skill=kind==='attack'?ATTACK_SKILLS[attackId??'']:undefined;
 const physical=Number(stats.atk??0),magical=Number(stats.matk??0);
 const raw=Math.max(1,Math.floor((kind==='attack'?(skill?.mult??1.8)*(element==='BASE'?physical:magical):physical)*0.34+Number(attacker.level??1)*1.5));
 const armor=Math.max(0,Number(targetStats.arm??targetStats.def??0)*(1-(skill?.pierce??0)));
 const resistance=Math.max(0,Math.min(BALANCE.resistanceCap,Number(target.elementalResistances?.[element]??0)));
 return Math.max(1,Math.round(mitigatedDamage(raw,armor)*elementMultiplier(element,"BASE")* (1-resistance)));
}
async function upsertPvpSeasonStats(db:Database,c:CharacterRow,seasonKey:string){await db.query('insert into public.world_pvp_season_stats(id,season_key,character_id,owner_id,rating,wins,losses,matches,updated_at) values($1,$2,$3,$4,$5,$6,$7,1,now()) on conflict(season_key,character_id) do update set owner_id=excluded.owner_id,rating=excluded.rating,wins=excluded.wins,losses=excluded.losses,matches=public.world_pvp_season_stats.matches+1,updated_at=now()',[randomUUID(),seasonKey,c.id,c.owner_id,Number(c.state.character.pvpRating??1000),Number(c.state.character.pvpWins??0),Number(c.state.character.pvpLosses??0)]);}
async function premiumEntitlement(db:Database,owner:string){try{return {configured:true,row:(await db.query('select plan_id,status,starts_at,expires_at from public.world_premium_entitlements where account_id=$1',[owner])).rows[0]??null};}catch(error:any){if(String(error?.code)==='42P01')return {configured:false,row:null};throw error;}}
async function syncPremium(db:Database,owner:string,character:WorldState['character']){const result=await premiumEntitlement(db,owner);if(!result.configured)return null;const entitlement=result.row;if(!entitlement){character.premium=false;character.premiumPlanId=undefined;character.premiumUntil=undefined;return {active:false,planId:null,expiresAt:null};}const now=Date.now(),starts=new Date(entitlement.starts_at).getTime(),expires=new Date(entitlement.expires_at).getTime();const active=entitlement.status==='active'&&Number.isFinite(starts)&&starts<=now&&Number.isFinite(expires)&&expires>now;character.premium=active;character.premiumPlanId=active?String(entitlement.plan_id):undefined;character.premiumUntil=active?expires:undefined;return {active,planId:active?String(entitlement.plan_id):null,expiresAt:active?new Date(expires).toISOString():null};}
/** The caller must wrap this command in one database transaction (BEGIN/COMMIT/ROLLBACK). */
export async function handleWorld(db:Database,owner:string,request:WorldRequest){
 uuid(owner);const op=request.operation,p=request.payload??{};if(typeof op!=='string')throw Error('Operação inválida.');
 const readonly=['characters','world.read','social.read','ranking','dailyBoss.read','pvp.read','market.read','premium.read','cards.season.read'];
 await db.query('insert into public.world_accounts(id) values($1) on conflict do nothing',[owner]);
 // Leituras frequentes não alteram saldo nem inventário. Evitar o lock da
 // conta nelas impede que o polling de combate e o chat disputem a mesma
 // transação e devolvam um estado antigo para a tela.
 if(!readonly.includes(op)) await db.query('select id from public.world_accounts where id=$1 for update',[owner]);
 let cached:any=null;
 if(!readonly.includes(op)){
  const requestId=uuid(request.requestId);
  // Reserva o request antes de executar o efeito. Isso fecha a janela em que
  // duas tentativas iguais poderiam passar pelo SELECT ao mesmo tempo e
  // aplicar uma troca/correio duas vezes.
  const reserved=await db.query('insert into public.world_operations(owner_id,request_id,response) values($1,$2,null) on conflict(owner_id,request_id) do nothing returning request_id',[owner,requestId]);
  if(!reserved.rows.length){
   const prev=await db.query('select response from public.world_operations where owner_id=$1 and request_id=$2 for update',[owner,requestId]);
   if(prev.rows[0]?.response===null)throw Error('Esta ação já está sendo processada. Aguarde a confirmação.');
   cached=prev.rows[0]?.response;
  }
 }
 let receipt:any=cached??{}, actor:CharacterRow|undefined;
 if(!cached){
 if(op==='characters'){}
 else if(op==='character.create'){
  const count=await db.query('select count(*)::int as count from public.world_characters where owner_id=$1',[owner]);if(count.rows[0].count>=ONLINE_RULES.maxCharacters)throw Error('Limite de três personagens por conta.');const name=text(p.name,24).normalize("NFKC");if(!/^[\p{L}\p{N}][\p{L}\p{N} _-]{2,23}$/u.test(name))throw Error('Use 3–24 letras, números, espaços ou hífen.');const id=randomUUID(),state=freshWorld(name,id);await syncPremium(db,owner,state.character);
  await db.query('insert into public.world_characters(id,owner_id,name,state) values($1,$2,$3,$4)',[id,owner,name,JSON.stringify(state)]);actor={id,owner_id:owner,name,state,revision:0};await commitCharacter(db,actor);receipt={createdId:id};
 }
 else if(op==='ranking'){
  const metric=String(p.metric??'level');if(!RANKING_METRICS.some(m=>m[0]===metric))throw Error('Ranking inválido.');const page=integer(p.page??0,0,1000);
  const ranks=await db.query('select character_id,name,current_map,metrics,row_number() over(order by (metrics->>$1)::numeric desc,character_id) as position from public.world_rankings order by (metrics->>$1)::numeric desc,character_id limit 50 offset $2',[metric,page*50]);receipt={ranking:ranks.rows,page,metric};
 }
 else if(op==='premium.read'){
  const result=await premiumEntitlement(db,owner),entitlement=result.row;const active=Boolean(entitlement&&entitlement.status==='active'&&new Date(entitlement.starts_at).getTime()<=Date.now()&&new Date(entitlement.expires_at).getTime()>Date.now());receipt={premium:{active,planId:active?entitlement.plan_id:null,expiresAt:active?new Date(entitlement.expires_at).toISOString():null,configured:result.configured}};
 }
 else if(op==='cards.season.read'){
  const actor=await own(db,owner,request.characterId);const season=cardSeason();const total=seasonCardCatalogSize(season.key);const unique=seasonUniqueCards(actor.state.character.cards,season.key);
  // O denominador é congelado na abertura da temporada: expansões posteriores
  // entram no próximo mês e nunca reduzem o progresso já conquistado.
  await db.query('insert into public.world_card_season_progress(id,season_key,character_id,owner_id,unique_cards,total_cards) values($1,$2,$3,$4,$5,$6) on conflict(season_key,character_id) do update set unique_cards=greatest(public.world_card_season_progress.unique_cards,excluded.unique_cards),total_cards=public.world_card_season_progress.total_cards,updated_at=now()',[randomUUID(),season.key,actor.id,owner,unique,total]);
  const previous=(await db.query('select season_key,unique_cards,total_cards from public.world_card_season_progress where season_key=$1 and character_id=$2',[season.previousKey,actor.id])).rows[0]??null;const claimed=(await db.query('select tier,reward_gold,reward_shards,reward_coins,claimed_at from public.world_card_season_rewards where season_key=$1 and character_id=$2',[season.previousKey,actor.id])).rows[0]??null;receipt={cards:{seasonKey:season.key,uniqueCards:unique,totalCards:total,previousSeason:{key:season.previousKey,progress:previous,reward:claimed,preview:previous?cardSeasonReward(Number(previous.unique_cards??0),Number(previous.total_cards??total)):null}}};
 }
 else if(op==='dailyBoss.read'){
  const run=await ensureDailyBoss(db);
  const participant=request.characterId?(await db.query('select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2',[run.id,uuid(request.characterId)])).rows[0]??null:null;
  const totals=(await db.query('select count(*)::int as participants,coalesce(sum(damage),0)::bigint as damage_total from public.world_daily_boss_participants where run_id=$1',[run.id])).rows[0];
  const leaderboard=(await db.query('select p.character_id,c.name,p.damage from public.world_daily_boss_participants p join public.world_characters c on c.id=p.character_id where p.run_id=$1 order by p.damage desc limit 10',[run.id])).rows;
  const history=(await db.query('select r.id,r.run_id,r.damage,r.participation_ratio,r.defeated,r.gold,r.xp,r.shards,r.loot,r.created_at,b.cycle_key,b.boss_name,b.level from public.world_daily_boss_rewards r join public.world_daily_boss_runs b on b.id=r.run_id where r.owner_id=$1 order by r.created_at desc limit 10',[owner])).rows;
  const pendingRewards=request.characterId?(await db.query("select b.id as run_id,b.boss_name,b.level,b.cycle_key,b.status,b.closes_at,p.damage from public.world_daily_boss_participants p join public.world_daily_boss_runs b on b.id=p.run_id where p.owner_id=$1 and p.character_id=$2 and p.claimed_at is null and p.damage>0 and (b.status in ('defeated','expired') or b.closes_at<=now()) order by b.closes_at asc limit 50",[owner,uuid(request.characterId)])).rows:[];
  const roster=(await db.query("select p.character_id,c.name,p.damage,p.last_action_at,c.state->'character'->'activeRace'->>'ataqueId' as attack_id,c.state->'character'->'appearance' as appearance,c.state->'character'->'cosmeticLoadout' as cosmetics,c.state->'character'->'dailyBossBattle'->'position' as position,c.state->'character'->'dailyBossBattle'->>'pvpEnabled' as pvp_enabled from public.world_daily_boss_participants p join public.world_characters c on c.id=p.character_id where p.run_id=$1 order by coalesce(p.last_action_at,p.joined_at) desc,p.character_id limit 24",[run.id])).rows;
  const combatOwner=participant?(await db.query('select state from public.world_characters where id=$1 and owner_id=$2',[uuid(request.characterId),owner])).rows[0]:null;const combat=combatOwner?ensureArenaBattle(combatOwner.state.character,run.id):null;
  receipt={dailyBoss:{run,participant,combat,participants:Number(totals.participants??0),damageTotal:Number(totals.damage_total??0),leaderboard,history,pendingRewards,roster}};
 }
 else if(op==='dailyBoss.move'||op==='dailyBoss.togglePvp'||op==='dailyBoss.attackPlayer'){
  const run=await ensureDailyBoss(db);if(run.status!=='open')throw Error('O Boss Diário não está mais em combate.');
  if(p.runId&&uuid(p.runId)!==run.id)throw Error('O ciclo do Boss mudou. Atualize a arena antes de agir.');
  if(op==='dailyBoss.attackPlayer'){
   const targetId=uuid(p.targetCharacterId);if(targetId===request.characterId)throw Error('Escolha outro aventureiro como alvo.');
   const rows=(await db.query('select * from public.world_characters where id=any($1::uuid[]) order by id for update',[[uuid(request.characterId),targetId]])).rows;
   const attacker=rows.find(row=>row.id===request.characterId&&row.owner_id===owner) as CharacterRow|undefined;const target=rows.find(row=>row.id===targetId) as CharacterRow|undefined;
   if(!attacker||!target)throw Error('Participante inválido.');
   const participants=(await db.query('select character_id from public.world_daily_boss_participants where run_id=$1 and character_id=any($2::uuid[])',[run.id,[attacker.id,target.id]])).rows;
   if(participants.length!==2)throw Error('Os dois jogadores precisam estar inscritos no Boss Diário.');
   const friendship=(await db.query("select id from public.world_friends where status='accepted' and ((inviter_id=$1 and invitee_id=$2) or (inviter_id=$2 and invitee_id=$1)) limit 1",[attacker.id,target.id])).rows[0];
   if(friendship)throw Error('Amigos não podem causar dano entre si.');
   const attackerBattle=ensureArenaBattle(attacker.state.character,run.id),targetBattle=ensureArenaBattle(target.state.character,run.id);
   if(attackerBattle.pvpEnabled===false)throw Error('Ative o modo PvP para atacar outros jogadores.');
   if(targetBattle.pvpEnabled===false)throw Error('Este jogador está protegido contra PvP.');
   if(targetBattle.hp<=0&&Date.now()<targetBattle.recoveryUntil)throw Error('Este jogador está se recuperando do nocaute.');
   const kind=String(p.kind??'basic') as 'basic'|'attack'|'support';if(!['basic','attack','support'].includes(kind))throw Error('Ação de combate inválida.');
   const attackId=attacker.state.character.activeRace?.ataqueId;const distance=arenaDistance(attackerBattle.position!,targetBattle.position!);const range=arenaAttackRange(kind,attackId);
   if(distance>range)throw Error(`Alvo fora de alcance (${Math.ceil(distance)} / ${range}px).`);
   const cooldown=arenaCooldown(kind,attacker.state.character.baseStats,kind==='support'?attacker.state.character.activeRace?.suporteId:attacker.state.character.activeRace?.passivaId);const readyAt=Number(attackerBattle.cooldowns?.[kind]??0);if(readyAt>Date.now())throw Error(`Aguarde ${Math.ceil((readyAt-Date.now())/1000)}s para usar esta ação.`);
   attackerBattle.targetId=target.id;attackerBattle.lastAttackKind=kind;attackerBattle.cooldowns![kind]=Date.now()+cooldown;
   let damage=0;
   const eventAt=Date.now();
   if(kind==='support'){
    const heal=Math.max(1,Math.floor((attacker.state.character.hpMax??100)*0.12));attacker.state.character.hp=Math.min(attacker.state.character.hpMax,attacker.state.character.hp+heal);attacker.state.character.mp=Math.min(attacker.state.character.mpMax,attacker.state.character.mp+Math.max(1,Math.floor((attacker.state.character.mpMax??50)*0.06)));
    const event={id:randomUUID(),at:eventAt,kind,attackerId:attacker.id,attackerName:attacker.name,targetId:target.id,targetName:target.name,damage:0,healed:heal,targetHp:targetBattle.hp,targetHpMax:targetBattle.hpMax};
    recordArenaPvpEvent(attackerBattle,event);recordArenaPvpEvent(targetBattle,event);
    receipt.pvp={kind,distance,range,healed:heal,cooldownUntil:attackerBattle.cooldowns![kind],targetId:target.id,event};
   }else{
    damage=arenaDamage(attacker.state.character,target.state.character,kind,attackId);targetBattle.hp=Math.max(0,targetBattle.hp-damage);targetBattle.damageTaken+=damage;targetBattle.lastDamage=damage;targetBattle.targetId=attacker.id;
    if(targetBattle.hp===0){targetBattle.knockouts+=1;targetBattle.recoveryUntil=Date.now()+30000;}
    const event={id:randomUUID(),at:eventAt,kind,attackerId:attacker.id,attackerName:attacker.name,targetId:target.id,targetName:target.name,damage, targetHp:targetBattle.hp,targetHpMax:targetBattle.hpMax,knockedOut:targetBattle.hp===0};
    recordArenaPvpEvent(attackerBattle,event);recordArenaPvpEvent(targetBattle,event);
    receipt.pvp={kind,distance,range,damage,knockedOut:targetBattle.hp===0,targetId:target.id,targetName:target.name,cooldownUntil:attackerBattle.cooldowns![kind],targetHp:targetBattle.hp,event};
   }
   attacker.state.character.dailyBossBattle=attackerBattle;target.state.character.dailyBossBattle=targetBattle;await commitCharacter(db,attacker);await commitCharacter(db,target);
  }else{
   const arenaActor=await own(db,owner,request.characterId);actor=arenaActor;const battle=ensureArenaBattle(arenaActor.state.character,run.id);
   if(op==='dailyBoss.move'){
    const direction=String(p.direction??'');const delta:{x:number;y:number}=direction==='up'||direction==='w'?{x:0,y:-34}:direction==='down'||direction==='s'?{x:0,y:34}:direction==='left'||direction==='a'?{x:-34,y:0}:direction==='right'||direction==='d'?{x:34,y:0}:{x:0,y:0};if(!delta.x&&!delta.y)throw Error('Direção inválida.');
    const now=Date.now();if(Number(battle.cooldowns?.move??0)>now)throw Error('Movimento muito rápido.');battle.position={x:clamp(battle.position!.x+delta.x,BOSS_ARENA_MARGIN,BOSS_ARENA_WIDTH-BOSS_ARENA_MARGIN),y:clamp(battle.position!.y+delta.y,BOSS_ARENA_MARGIN,BOSS_ARENA_HEIGHT-BOSS_ARENA_MARGIN)};battle.cooldowns!.move=now+90;arenaActor.state.character.dailyBossBattle=battle;await commitCharacter(db,arenaActor);receipt.arena={position:battle.position};
   }else{const enabled=Boolean(p.enabled);battle.pvpEnabled=enabled;arenaActor.state.character.dailyBossBattle=battle;await commitCharacter(db,arenaActor);receipt.arena={pvpEnabled:enabled};}
  }
  const latest=(await db.query('select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2',[run.id,uuid(request.characterId)])).rows[0]??null;receipt.dailyBoss={run,participant:latest,combat:actor?.state.character.dailyBossBattle?.runId===run.id?(actor as CharacterRow).state.character.dailyBossBattle:null};
 }
 else if(op==='dailyBoss.join'||op==='dailyBoss.attack'||op==='dailyBoss.claim'){
  actor=await own(db,owner,request.characterId);let run:any;
  if(op==='dailyBoss.claim'&&p.runId){run=(await db.query('select * from public.world_daily_boss_runs where id=$1 for update',[uuid(p.runId)])).rows[0];if(!run)throw Error('Ciclo do Boss Diário não encontrado.');if(run.status==='open'&&new Date(run.closes_at).getTime()<=Date.now()){await db.query("update public.world_daily_boss_runs set status='expired',resolved_at=coalesce(resolved_at,closes_at) where id=$1",[run.id]);run.status='expired';}}else{run=await ensureDailyBoss(db);}
  if(op!=='dailyBoss.claim'&&p.runId&&uuid(p.runId)!==run.id)throw Error('O ciclo do Boss mudou. Atualize o painel antes de participar.');
  if(op==='dailyBoss.join'){
   if(run.status!=='open')throw Error('A janela deste Boss Diário já foi encerrada.');
   if(DAILY_BOSS_GUILD_REQUIRED&&!actor.state.character.guildId)throw Error('Este Boss Diário exige uma guild ativa.');
   const joined=await db.query('insert into public.world_daily_boss_participants(run_id,character_id,owner_id) values($1,$2,$3) on conflict(run_id,character_id) do nothing returning character_id',[run.id,actor.id,owner]);
   if(joined.rows.length){const reinforcement=Math.max(1000,Math.floor(Number(run.base_hp)*0.10));await db.query('update public.world_daily_boss_runs set hp_total=least(base_hp*4,hp_total+$2),hp_remaining=least(base_hp*4,hp_remaining+$2) where id=$1',[run.id,reinforcement]);}
  actor.state.character.dailyBossBattle=ensureArenaBattle(actor.state.character,run.id);await commitCharacter(db,actor);
  }else if(op==='dailyBoss.attack'){
   if(run.status!=='open')throw Error('O Boss Diário não está mais em combate.');
   const participant=(await db.query('select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2 for update',[run.id,actor.id])).rows[0];if(!participant)throw Error('Entre na batalha antes de atacar.');
   if(participant.last_action_at&&Date.now()-new Date(participant.last_action_at).getTime()<2500)throw Error('Aguarde 2,5s entre os ataques do Boss Diário.');
   const ch=actor.state.character,base=Number(ch.baseStats?.atk??0)+Number(ch.baseStats?.matk??0),skills=Object.values(ch.skills??{}).reduce((sum,value)=>sum+Number(value||0),0);const damage=Math.min(Number(run.hp_remaining),100000,Math.max(1,Math.floor(base*0.45+skills*1.5+Number(ch.level||1)*4)));
   const bossTemplate=DAILY_BOSS_TEMPLATES.find(template=>template.id===run.boss_template_id),enemy=bossTemplate?findBossEnemy(bossTemplate):undefined;if(!enemy)throw Error('Boss não configurado para esta batalha.');const group=(await db.query('select count(*)::int as count from public.world_daily_boss_participants where run_id=$1',[run.id])).rows[0];const finalHit=damage>=Number(run.hp_remaining);
   const previousBattle=ensureArenaBattle(ch,run.id);const battle=bossRetaliation(ch,run.id,enemy,Number(group.count),finalHit,Date.now());battle.position=previousBattle.position;battle.targetId=previousBattle.targetId;battle.pvpEnabled=previousBattle.pvpEnabled;battle.cooldowns=previousBattle.cooldowns;battle.lastAttackKind='attack';ch.dailyBossBattle=battle;
   await db.query('update public.world_daily_boss_participants set damage=damage+$3,last_action_at=now() where run_id=$1 and character_id=$2',[run.id,actor.id,damage]);
   await db.query("update public.world_daily_boss_runs set hp_remaining=greatest(0,hp_remaining-$2),status=case when hp_remaining-$2<=0 then 'defeated' else status end,resolved_at=case when hp_remaining-$2<=0 then coalesce(resolved_at,now()) else resolved_at end where id=$1",[run.id,damage]);
   await commitCharacter(db,actor);receipt.damage=damage;receipt.damageTaken=battle.lastDamage;receipt.finalHit=finalHit;
  }else{
   const participant=(await db.query('select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2 for update',[run.id,actor.id])).rows[0];if(!participant)throw Error('Participe do Boss Diário antes de resgatar.');
   if(participant.claimed_at)throw Error('A recompensa desta janela já foi resgatada.');if(Number(participant.damage??0)<=0)throw Error('Cause dano ao Boss para receber uma recompensa de participação.');if(!['defeated','expired'].includes(run.status))throw Error('A recompensa só fica disponível quando a janela terminar.');
   const ratio=Math.min(1,Number(participant.damage||0)/Math.max(1,Number(run.hp_total||1))),defeated=run.status==='defeated';const finalHitRow=defeated?(await db.query('select character_id from public.world_daily_boss_participants where run_id=$1 and damage>0 order by last_action_at desc nulls last,joined_at desc limit 1',[run.id])).rows[0]:null;const finalHit=Boolean(finalHitRow?.character_id===actor.id);const rewardGold=Math.max(50,Math.floor((Number(run.level)*80+ratio*Number(run.level)*2000)*(defeated?2:1)*(finalHit?1.5:1))),rewardXp=Math.max(100,Math.floor((Number(run.level)*35+ratio*Number(run.level)*500)*(finalHit?1.25:1)));
   actor.state.character.gold+=rewardGold;applyDailyBossXp(actor.state.character,rewardXp);if(defeated)actor.state.character.dailyBossXpUntil=Math.max(Number(actor.state.character.dailyBossXpUntil??0),new Date(run.closes_at).getTime());
   const bossEnemy=findBossEnemy(dailyBossTemplate(run.cycle_key));const bossLoot=grantDailyBossLoot(actor.state.character,run,bossEnemy,ratio,defeated);
   await db.query('insert into public.world_daily_boss_rewards(id,run_id,character_id,owner_id,damage,participation_ratio,defeated,gold,xp,shards,loot) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[randomUUID(),run.id,actor.id,owner,Number(participant.damage||0),ratio,defeated,rewardGold,rewardXp,bossLoot.shards,JSON.stringify(bossLoot.items)]);
   await db.query('update public.world_daily_boss_participants set claimed_at=now() where run_id=$1 and character_id=$2',[run.id,actor.id]);await commitCharacter(db,actor);receipt.reward={gold:rewardGold,xp:rewardXp,loot:bossLoot.items,shards:bossLoot.shards,finalHit,bonusXpUntil:actor.state.character.dailyBossXpUntil??null};
  }
  run=(await db.query('select * from public.world_daily_boss_runs where id=$1',[run.id])).rows[0];const participant=(await db.query('select * from public.world_daily_boss_participants where run_id=$1 and character_id=$2',[run.id,actor.id])).rows[0]??null;receipt.dailyBoss={run,participant,combat:actor.state.character.dailyBossBattle?.runId===run.id?actor.state.character.dailyBossBattle:null};
 }
 else if(op==='pvp.read'){
  const ownId=request.characterId?uuid(request.characterId):null;
  const online=await db.query("select id,name,online_at,state->'character'->>'level' as level,state->'character'->>'pvpRating' as rating,state->'character'->>'pvpWins' as wins,state->'character'->>'pvpLosses' as losses from public.world_characters where online_at>now()-interval '90 seconds' and ($1::uuid is null or id<>$1) order by coalesce((state->'character'->>'pvpRating')::int,1000) desc,name limit 100",[ownId]);
  const matches=ownId?(await db.query("select m.*,a.name as challenger_name,b.name as opponent_name from public.world_pvp_matches m join public.world_characters a on a.id=m.challenger_id join public.world_characters b on b.id=m.opponent_id where m.challenger_id=$1 or m.opponent_id=$1 order by m.created_at desc limit 50",[ownId])).rows:[];
  const now=new Date(),season=pvpSeason(now),previous=pvpSeason(new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-1,1))); const queue=ownId?(await db.query("select character_id,season_key,rating,status,match_id,joined_at,matched_at from public.world_pvp_queue where character_id=$1",[ownId])).rows[0]??null:null;
  const ownProfile=ownId?(await db.query("select state->'character'->>'pvpRating' as rating from public.world_characters where id=$1 and owner_id=$2",[ownId,owner])).rows[0]??null:null;
  const currentStats=ownId?(await db.query('select season_key,rating,wins,losses,matches from public.world_pvp_season_stats where character_id=$1 and season_key=$2',[ownId,season.key])).rows[0]??null:null;
  const previousStats=ownId?(await db.query('select season_key,rating,wins,losses,matches from public.world_pvp_season_stats where character_id=$1 and season_key=$2',[ownId,previous.key])).rows[0]??null:null;
  const previousReward=ownId?(await db.query('select tier,rating,wins,losses,reward_gold,reward_shards,reward_coins,claimed_at from public.world_pvp_season_rewards where character_id=$1 and season_key=$2',[ownId,previous.key])).rows[0]??null:null;
  const ownRating=Number(currentStats?.rating??ownProfile?.rating??1000);receipt={pvp:{season:{key:season.key,endsAt:season.endsAt.toISOString()},league:pvpLeague(ownRating),online:online.rows,matches,queue,currentStats,previousSeason:{key:previous.key,stats:previousStats,reward:previousReward,preview:previousStats?pvpSeasonReward(Number(previousStats.rating??1000),Number(previousStats.wins??0)):null}}};
 }
 else if(op==='cards.season.claim'||op==='pvp.queue.join'||op==='pvp.queue.cancel'||op==='pvp.challenge'||op==='pvp.accept'||op==='pvp.resolve'||op==='pvp.turn'||op==='pvp.season.claim'){
  actor=await own(db,owner,request.characterId);
  if(op==='cards.season.claim'){
   const seasonKey=text(p.seasonKey,7),season=cardSeason();if(seasonKey===season.key||!/^[0-9]{4}-(0[1-9]|1[0-2])$/.test(seasonKey))throw Error('Temporada de Cards inválida ou ainda aberta.');const progress=(await db.query('select * from public.world_card_season_progress where season_key=$1 and character_id=$2 for update',[seasonKey,actor.id])).rows[0];if(!progress)throw Error('Nenhum progresso de coleção registrado nesta temporada.');const previous=(await db.query('select * from public.world_card_season_rewards where season_key=$1 and character_id=$2',[seasonKey,actor.id])).rows[0];if(previous)throw Error('A recompensa desta coleção já foi resgatada.');const reward=cardSeasonReward(Number(progress.unique_cards??0),Number(progress.total_cards??seasonCardCatalogSize(seasonKey)));if(!reward)throw Error('Colecione pelo menos 50% dos Cards para resgatar a recompensa.');actor.state.character.gold+=reward.gold;actor.state.character.mythreonShards=(actor.state.character.mythreonShards??0)+reward.shards;actor.state.character.mythreonCoins=(actor.state.character.mythreonCoins??0)+reward.coins;await db.query('insert into public.world_card_season_rewards(id,season_key,character_id,owner_id,unique_cards,total_cards,tier,reward_gold,reward_shards,reward_coins) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[randomUUID(),seasonKey,actor.id,owner,Number(progress.unique_cards??0),Number(progress.total_cards??seasonCardCatalogSize(seasonKey)),reward.tier,reward.gold,reward.shards,reward.coins]);await commitCharacter(db,actor);await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,0,$7,$8)',[randomUUID(),request.requestId,'cards.season.reward',null,actor.id,reward.gold,reward.coins,JSON.stringify([{kind:'MYTHREON_SHARDS',quantity:reward.shards},{kind:'CARD_SEASON_TIER',tier:reward.tier,seasonKey}])]);receipt={cards:{status:'season-reward-claimed',seasonKey,reward}};
  }else if(op==='pvp.season.claim'){
   const seasonKey=text(p.seasonKey,7);const current=pvpSeason();if(seasonKey===current.key)throw Error('A temporada atual ainda não foi encerrada.');if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(seasonKey))throw Error('Temporada inválida.');
   const stats=(await db.query('select * from public.world_pvp_season_stats where season_key=$1 and character_id=$2 for update',[seasonKey,actor.id])).rows[0];if(!stats)throw Error('Você não tem partidas registradas nesta temporada.');const previousReward=(await db.query('select * from public.world_pvp_season_rewards where season_key=$1 and character_id=$2',[seasonKey,actor.id])).rows[0];if(previousReward)throw Error('A recompensa desta temporada já foi resgatada.');
   const reward=pvpSeasonReward(Number(stats.rating??1000),Number(stats.wins??0));actor.state.character.gold+=reward.gold;actor.state.character.mythreonShards=(actor.state.character.mythreonShards??0)+reward.shards;actor.state.character.mythreonCoins=(actor.state.character.mythreonCoins??0)+reward.coins;
   await db.query('insert into public.world_pvp_season_rewards(id,season_key,character_id,owner_id,tier,rating,wins,losses,reward_gold,reward_shards,reward_coins) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[randomUUID(),seasonKey,actor.id,owner,reward.tier,Number(stats.rating??1000),Number(stats.wins??0),Number(stats.losses??0),reward.gold,reward.shards,reward.coins]);
   await commitCharacter(db,actor);await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,0,$7,$8)',[randomUUID(),request.requestId,'pvp.season.reward',null,actor.id,reward.gold,reward.coins,JSON.stringify([{kind:'MYTHREON_SHARDS',quantity:reward.shards},{kind:'PVP_TIER',tier:reward.tier,seasonKey}])]);receipt={pvp:{status:'season-reward-claimed',seasonKey,reward}};
  }else if(op==='pvp.queue.join'||op==='pvp.queue.cancel'){
   const season=pvpSeason();
   if(op==='pvp.queue.cancel'){
    await db.query("update public.world_pvp_queue set status='cancelled',updated_at=now() where character_id=$1 and status='queued'",[actor.id]);
    receipt={pvp:{queue:{status:'cancelled',seasonKey:season.key}}};
   }else{
    const rating=Number(actor.state.character.pvpRating??1000);
    const existing=(await db.query("select * from public.world_pvp_queue where character_id=$1 for update",[actor.id])).rows[0];
    if(existing?.status==='matched'&&existing.match_id)receipt={pvp:{queue:existing}};
    else{
     const candidate=(await db.query("select q.*,c.name,c.owner_id as opponent_owner_id,c.state from public.world_pvp_queue q join public.world_characters c on c.id=q.character_id where q.season_key=$1 and q.status='queued' and q.character_id<>$2 and abs(q.rating-$3)<=150 and c.online_at>now()-interval '90 seconds' order by q.joined_at,q.character_id for update skip locked limit 1",[season.key,actor.id,rating])).rows[0];
     if(candidate){
      const id=randomUUID();
      await db.query('insert into public.world_pvp_matches(id,season_key,challenger_id,opponent_id,challenger_owner_id,opponent_owner_id,challenger_rating_before,opponent_rating_before,expires_at,status,turn_owner,challenger_hp,opponent_hp) values($1,$2,$3,$4,$5,$6,$7,$8,$9,\'open\',$3,$10,$11)',[id,season.key,actor.id,candidate.character_id,owner,candidate.opponent_owner_id,rating,Number(candidate.rating??1000),new Date(Date.now()+ONLINE_RULES.pvpExpiryMs),pvpCombatHp(actor.state),pvpCombatHp(candidate.state)]);
      await db.query("update public.world_pvp_queue set status='matched',match_id=$2,matched_at=now(),updated_at=now() where character_id=$1",[candidate.character_id,id]);
      await db.query("insert into public.world_pvp_queue(character_id,owner_id,season_key,rating,status,match_id,matched_at) values($1,$2,$3,$4,'matched',$5,now()) on conflict(character_id) do update set owner_id=excluded.owner_id,season_key=excluded.season_key,rating=excluded.rating,status='matched',match_id=excluded.match_id,matched_at=now(),updated_at=now()",[actor.id,owner,season.key,rating,id]);
      receipt={pvp:{queue:{status:'matched',matchId:id,seasonKey:season.key},matchId:id,status:'open'}};
     }else{
      await db.query("insert into public.world_pvp_queue(character_id,owner_id,season_key,rating,status,match_id,joined_at,matched_at,updated_at) values($1,$2,$3,$4,'queued',null,now(),null,now()) on conflict(character_id) do update set owner_id=excluded.owner_id,season_key=excluded.season_key,rating=excluded.rating,status='queued',match_id=null,matched_at=null,joined_at=case when public.world_pvp_queue.status='queued' then public.world_pvp_queue.joined_at else now() end,updated_at=now()",[actor.id,owner,season.key,rating]);
      receipt={pvp:{queue:{status:'queued',seasonKey:season.key,rating}}};
     }
    }
   }
  }else if(op==='pvp.challenge'){
   const target=p.opponentId?await own(db,owner,p.opponentId).catch(()=>null):await byName(db,p.target);if(!target)throw Error('Oponente não encontrado.');if(target.id===actor.id||target.owner_id===owner)throw Error('Escolha um jogador de outra conta.');if(Date.now()-new Date(target.online_at).getTime()>90000)throw Error('O jogador precisa estar online.');
   const busy=await db.query("select id from public.world_pvp_matches where (challenger_id=any($1::uuid[]) or opponent_id=any($1::uuid[])) and status in ('invited','open')",[[actor.id,target.id]]);if(busy.rows.length)throw Error('Um dos jogadores já tem um duelo ranqueado em andamento.');
   const id=randomUUID();const targetState=(await db.query('select state from public.world_characters where id=$1',[target.id])).rows[0]?.state as WorldState;await db.query('insert into public.world_pvp_matches(id,season_key,challenger_id,opponent_id,challenger_owner_id,opponent_owner_id,challenger_rating_before,opponent_rating_before,expires_at,turn_owner,challenger_hp,opponent_hp) values($1,$2,$3,$4,$5,$6,$7,$8,$9,null,$10,$11)',[id,pvpSeason().key,actor.id,target.id,owner,target.owner_id,Number(actor.state.character.pvpRating??1000),Number(targetState?.character?.pvpRating??1000),new Date(Date.now()+ONLINE_RULES.pvpExpiryMs),pvpCombatHp(actor.state),pvpCombatHp(targetState)]);receipt={pvp:{matchId:id,status:'invited'}};
  }else{
   const row=(await db.query('select * from public.world_pvp_matches where id=$1 for update',[uuid(p.matchId)])).rows[0];if(!row)throw Error('Duelo ranqueado não encontrado.');if(![row.challenger_id,row.opponent_id].includes(actor.id))throw Error('Você não participa deste duelo.');
   if(row.status==='invited'&&op==='pvp.accept'){if(row.opponent_id!==actor.id)throw Error('Somente o desafiado pode aceitar.');if(new Date(row.expires_at).getTime()<=Date.now()){await db.query("update public.world_pvp_matches set status='expired',resolved_at=now() where id=$1",[row.id]);throw Error('O convite de duelo expirou.');}await db.query("update public.world_pvp_matches set status='open',turn_owner=challenger_id where id=$1",[row.id]);receipt={pvp:{matchId:row.id,status:'open',turnOwner:row.challenger_id}};
   }else if(op==='pvp.turn'){
    if(row.status!=='open')throw Error('O duelo não está em combate.');if(new Date(row.expires_at).getTime()<=Date.now()){await db.query("update public.world_pvp_matches set status='expired',resolved_at=now(),turn_owner=null where id=$1",[row.id]);throw Error('O duelo expirou.');}if(row.turn_owner!==actor.id)throw Error('Aguarde o turno do adversário.');if(row.last_action_at&&Date.now()-new Date(row.last_action_at).getTime()<800)throw Error('Aguarde o próximo turno.');
    const rows=await db.query('select * from public.world_characters where id=any($1::uuid[]) order by id for update',[[row.challenger_id,row.opponent_id]]);const challenger=rows.rows.find(r=>r.id===row.challenger_id) as CharacterRow,opponent=rows.rows.find(r=>r.id===row.opponent_id) as CharacterRow;if(!challenger||!opponent)throw Error('Participante inválido.');const attacker=actor.id===challenger.id?challenger:opponent,target=attacker.id===challenger.id?opponent:challenger;const damage=pvpTurnDamage(attacker.state),challengerHp=Math.max(0,Number(row.challenger_hp??pvpCombatHp(challenger.state))-(attacker.id===opponent.id?damage:0)),opponentHp=Math.max(0,Number(row.opponent_hp??pvpCombatHp(opponent.state))-(attacker.id===challenger.id?damage:0));const entry={round:Number(row.round??1),actorId:attacker.id,actorName:attacker.name,damage,targetHp:attacker.id===challenger.id?opponentHp:challengerHp,at:new Date().toISOString()},combatLog=[...(Array.isArray(row.combat_log)?row.combat_log:[]),entry];
    if((attacker.id===challenger.id?opponentHp:challengerHp)<=0){const winner=attacker,loser=target;const delta=eloDelta(Number(winner.state.character.pvpRating??1000),Number(loser.state.character.pvpRating??1000));winner.state.character.pvpRating=Number(winner.state.character.pvpRating??1000)+delta;loser.state.character.pvpRating=Math.max(0,Number(loser.state.character.pvpRating??1000)-delta);winner.state.character.pvpWins=(winner.state.character.pvpWins??0)+1;loser.state.character.pvpLosses=(loser.state.character.pvpLosses??0)+1;await upsertPvpSeasonStats(db,winner,String(row.season_key??pvpSeason().key));await upsertPvpSeasonStats(db,loser,String(row.season_key??pvpSeason().key));await commitCharacter(db,winner);await commitCharacter(db,loser);await db.query("update public.world_pvp_matches set status='completed',winner_id=$2,challenger_rating_after=$3,opponent_rating_after=$4,challenger_hp=$5,opponent_hp=$6,turn_owner=null,combat_log=$7,resolved_at=now(),last_action_at=now() where id=$1",[row.id,winner.id,Number(challenger.state.character.pvpRating??1000),Number(opponent.state.character.pvpRating??1000),challengerHp,opponentHp,JSON.stringify(combatLog)]);receipt={pvp:{matchId:row.id,status:'completed',winnerId:winner.id,winnerName:winner.name,delta,damage,round:entry.round,combatLog}};
    }else{await db.query('update public.world_pvp_matches set challenger_hp=$2,opponent_hp=$3,turn_owner=$4,round=round+1,combat_log=$5,last_action_at=now() where id=$1',[row.id,challengerHp,opponentHp,target.id,JSON.stringify(combatLog)]);receipt={pvp:{matchId:row.id,status:'open',damage,round:entry.round,turnOwner:target.id,challengerHp,opponentHp,combatLog}};}
   }else if(op==='pvp.resolve'){
    if(row.turn_owner)throw Error('Este duelo usa combate por turnos. Ataque na sua vez.');if(row.status!=='open')throw Error('O duelo precisa ser aceito antes da resolução.');if(new Date(row.expires_at).getTime()<=Date.now()){await db.query("update public.world_pvp_matches set status='expired',resolved_at=now() where id=$1",[row.id]);throw Error('O duelo expirou.');}
    const rows=await db.query('select * from public.world_characters where id=any($1::uuid[]) order by id for update',[[row.challenger_id,row.opponent_id]]);const challenger=rows.rows.find(r=>r.id===row.challenger_id) as CharacterRow,opponent=rows.rows.find(r=>r.id===row.opponent_id) as CharacterRow;if(!challenger||!opponent)throw Error('Participante inválido.');
    const powerA=pvpPower(challenger.state),powerB=pvpPower(opponent.state),winner=powerA===powerB?(challenger.id<opponent.id?challenger:opponent):(powerA>powerB?challenger:opponent),loser=winner.id===challenger.id?opponent:challenger;const delta=eloDelta(Number(winner.state.character.pvpRating??1000),Number(loser.state.character.pvpRating??1000));winner.state.character.pvpRating=Number(winner.state.character.pvpRating??1000)+delta;loser.state.character.pvpRating=Math.max(0,Number(loser.state.character.pvpRating??1000)-delta);winner.state.character.pvpWins=(winner.state.character.pvpWins??0)+1;loser.state.character.pvpLosses=(loser.state.character.pvpLosses??0)+1;await upsertPvpSeasonStats(db,winner,String(row.season_key??pvpSeason().key));await upsertPvpSeasonStats(db,loser,String(row.season_key??pvpSeason().key));await commitCharacter(db,winner);await commitCharacter(db,loser);await db.query("update public.world_pvp_matches set status='completed',winner_id=$2,challenger_rating_after=$3,opponent_rating_after=$4,resolved_at=now() where id=$1",[row.id,winner.id,Number(challenger.state.character.pvpRating??1000),Number(opponent.state.character.pvpRating??1000)]);receipt={pvp:{matchId:row.id,status:'completed',winnerId:winner.id,winnerName:winner.name,delta,challengerRating:challenger.state.character.pvpRating,opponentRating:opponent.state.character.pvpRating}};
   }else if(['completed','expired','cancelled'].includes(row.status)){receipt={pvp:{matchId:row.id,status:row.status,winnerId:row.winner_id}};}
   else throw Error('Ação de PvP inválida.');
  }
 }
 else if(op==='market.read'){
  const now=new Date();
  await db.query("update public.world_market_listings set status='expired' where status='open' and expires_at<=now()");
  const query=typeof p.query==='string'?p.query.trim().slice(0,48):'';const currency=String(p.currency??'ALL').toUpperCase();if(!['ALL','GOLD','COINS'].includes(currency))throw Error('Filtro de moeda inválido.');const rarity=String(p.rarity??'ALL').toUpperCase();if(!['ALL','COMUM','INCOMUM','RARO','EPICO','LENDARIO'].includes(rarity))throw Error('Filtro de raridade inválido.');const sort=String(p.sort??'NEWEST').toUpperCase();const order=sort==='PRICE_ASC'?'price asc,created_at desc':sort==='PRICE_DESC'?'price desc,created_at desc':'created_at desc';const page=integer(p.page??0,0,1000),pageSize=24,offset=page*pageSize;const args=[query,currency,rarity];const predicate="status='open' and ($1='' or item->>'name' ilike '%'||$1||'%' or seller_name ilike '%'||$1||'%') and ($2='ALL' or currency=$2) and ($3='ALL' or item->>'rarity'=$3)";
  const listings=(await db.query(`select id,seller_character_id,seller_name,item,currency,price,fee,expires_at,created_at from public.world_market_listings where ${predicate} order by ${order} limit $5 offset $4`,[...args,offset,pageSize])).rows;
  const templateIds=[...new Set([...listings.map((listing:any)=>String(listing.item?.templateId??'')),...(p.templateId?[text(p.templateId,128)]:[])].filter(Boolean))];
  const salesHistory=await marketSalesHistory(db,templateIds);
  const priceStats=templateIds.length?(await db.query('select template_id,sale_events,units_sold,average_gold_price,lowest_gold_price,highest_gold_price,last_sold_at,average_mythreon_coin_price,lowest_mythreon_coin_price,highest_mythreon_coin_price from public.world_trade_item_stats where template_id=any($1::text[])',[templateIds])).rows:[];
  const summary=(await db.query(`select count(*)::int as total,coalesce(avg(price),0)::numeric as average_price,coalesce(min(price),0)::numeric as min_price,coalesce(max(price),0)::numeric as max_price from public.world_market_listings where ${predicate}`,args)).rows[0]??{total:0,average_price:0,min_price:0,max_price:0};
  const mine=request.characterId?(await db.query("select id,seller_character_id,seller_name,item,currency,price,fee,status,expires_at,created_at,sold_at,buyer_character_id from public.world_market_listings where seller_character_id=$1 order by created_at desc limit 50",[uuid(request.characterId)])).rows:[];
  receipt={market:{listings,mine,priceStats,salesHistory,summary:{total:Number(summary.total??0),averagePrice:Number(summary.average_price??0),minPrice:Number(summary.min_price??0),maxPrice:Number(summary.max_price??0)},page,pageSize,filters:{query,currency,rarity,sort},now:now.toISOString()}};
 }
 else if(op==='market.list'||op==='market.buy'||op==='market.cancel'){
  actor=await own(db,owner,request.characterId);
  if(op==='market.list'){
   canTransfer(actor.state.character);
   const currency=String(p.currency??'GOLD').toUpperCase();if(currency!=='GOLD'&&currency!=='COINS')throw Error('Escolha Gold ou Mythreon Coins.');
   const price=integer(p.price,1,1000000000000);const selection=p.item;if(!selection||typeof selection.uid!=='string')throw Error('Escolha um item da mochila ou depósito.');
   const offer=reserveOffer(actor.state.character,{gold:0,mythreonCoins:0,items:[{uid:selection.uid,quantity:integer(selection.quantity??1,1,999)}]});
   // reserveOffer also reserves the normal transfer fee; a market listing has
   // its own fee and must not charge the hidden zero-gold transfer fee twice.
   actor.state.character.gold+=transferFee(0);
   const item=offer.items[0];const id=randomUUID();const fee=Math.min(price,Math.max(currency==='GOLD'?10:1,Math.floor(price*0.05)));
   await db.query('insert into public.world_market_listings(id,seller_character_id,seller_owner_id,seller_name,item,currency,price,fee,expires_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[id,actor.id,owner,actor.name,JSON.stringify(item),currency,price,fee,new Date(Date.now()+48*60*60*1000)]);
   await commitCharacter(db,actor);receipt={market:{listingId:id,status:'open',fee}};
  }else{
   const listing=(await db.query('select * from public.world_market_listings where id=$1 for update',[uuid(p.listingId)])).rows[0];if(!listing)throw Error('Anúncio não encontrado.');
   if(listing.status==='open'&&new Date(listing.expires_at).getTime()<=Date.now()){await db.query("update public.world_market_listings set status='expired' where id=$1",[listing.id]);listing.status='expired';}
   if(op==='market.cancel'){
    if(listing.seller_character_id!==actor.id||listing.seller_owner_id!==owner)throw Error('Somente o vendedor pode cancelar o anúncio.');if(!['open','expired'].includes(listing.status))throw Error('Este anúncio já foi devolvido ou vendido.');
    restoreOffer(actor.state.character,{gold:0,mythreonCoins:0,items:[listing.item],fee:0});await db.query("update public.world_market_listings set status='cancelled' where id=$1",[listing.id]);await commitCharacter(db,actor);receipt={market:{listingId:listing.id,status:'cancelled'}};
   }else{
    if(listing.status!=='open')throw Error('Este anúncio já foi encerrado.');if(listing.seller_owner_id===owner)throw Error('Você não pode comprar o próprio anúncio.');canTransfer(actor.state.character);
    const seller=(await db.query('select * from public.world_characters where id=$1 and owner_id=$2 for update',[listing.seller_character_id,listing.seller_owner_id])).rows[0] as CharacterRow;if(!seller)throw Error('Vendedor não encontrado.');
    const price=Number(listing.price),fee=Math.min(price,Number(listing.fee));if(listing.currency==='GOLD'){if(actor.state.character.gold<price)throw Error('Gold insuficiente.');actor.state.character.gold-=price;seller.state.character.gold+=price-fee;}else{if((actor.state.character.mythreonCoins??0)<price)throw Error('Mythreon Coins insuficientes.');actor.state.character.mythreonCoins=(actor.state.character.mythreonCoins??0)-price;seller.state.character.mythreonCoins=(seller.state.character.mythreonCoins??0)+price-fee;}
    receiveOffer(actor.state.character,{gold:0,mythreonCoins:0,items:[listing.item],fee:0});await db.query("update public.world_market_listings set status='sold',buyer_character_id=$2,buyer_owner_id=$3,sold_at=now() where id=$1",[listing.id,actor.id,owner]);await commitCharacter(db,seller);await commitCharacter(db,actor);await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[randomUUID(),request.requestId,'market',seller.id,actor.id,listing.currency==='GOLD'?price:0,fee,listing.currency==='COINS'?price:0,JSON.stringify([listing.item])]);receipt={market:{listingId:listing.id,status:'sold',fee}};
   }
  }
 }
 else if(op.startsWith('trade.')){
  if(op==='trade.invite'){
   const target=await byName(db,p.target);const pair=await db.query('select * from public.world_characters where id=any($1::uuid[]) order by id for update',[[uuid(request.characterId),target.id]]);actor=pair.rows.find(r=>r.id===request.characterId&&r.owner_id===owner);if(!actor)throw Error('Personagem inválido.');canTransfer(actor.state.character);if(Date.now()-new Date(target.online_at).getTime()>90000)throw Error('O jogador precisa estar online para receber o convite de troca.');if(target.owner_id===owner)throw Error('Escolha um jogador de outra conta.');const busy=await db.query("select id from public.world_trades where (a_id=any($1::uuid[]) or b_id=any($1::uuid[])) and status in ('invited','open')",[[actor.id,target.id]]);if(busy.rows.length)throw Error('Um dos jogadores já tem uma troca em andamento.');const id=randomUUID();await db.query('insert into public.world_trades(id,a_id,b_id,a_owner,b_owner,expires_at) values($1,$2,$3,$4,$5,$6)',[id,actor.id,target.id,owner,target.owner_id,new Date(Date.now()+ONLINE_RULES.tradeExpiryMs)]);receipt={tradeId:id};
  }else{
   const preview=await db.query('select * from public.world_trades where id=$1',[uuid(p.tradeId)]);if(!preview.rows[0])throw Error('Troca não encontrada.');const t0=preview.rows[0];if(t0.a_owner!==owner&&t0.b_owner!==owner)throw Error('Você não participa desta troca.');
   const rows=await db.query('select * from public.world_characters where id=any($1::uuid[]) order by id for update',[[t0.a_id,t0.b_id]]);const a=rows.rows.find(r=>r.id===t0.a_id) as CharacterRow,b=rows.rows.find(r=>r.id===t0.b_id) as CharacterRow;
   const t=(await db.query('select * from public.world_trades where id=$1 for update',[t0.id])).rows[0];const isA=t.a_owner===owner,me=isA?a:b;actor=me;let offerA=t.offer_a as Offer,offerB=t.offer_b as Offer,readyA=t.ready_a,readyB=t.ready_b;
   if(request.characterId!==me.id)throw Error('Use o personagem que participa da troca.');
   if(['completed','cancelled','expired'].includes(t.status)){receipt={tradeId:t.id,status:t.status};}
   else if(new Date(t.expires_at).getTime()<=Date.now()||op==='trade.cancel'){
    restoreOffer(a.state.character,offerA);restoreOffer(b.state.character,offerB);const status=op==='trade.cancel'?'cancelled':'expired';await db.query('update public.world_trades set status=$2,offer_a=$3,offer_b=$3,ready_a=false,ready_b=false,revision=revision+1 where id=$1',[t.id,status,JSON.stringify(emptyOffer())]);await commitCharacter(db,a);await commitCharacter(db,b);receipt={tradeId:t.id,status};
   }else if(op==='trade.accept'){
    if(isA||t.status!=='invited')throw Error('Convite não disponível.');canTransfer(b.state.character);await db.query("update public.world_trades set status='open',revision=revision+1 where id=$1",[t.id]);receipt={tradeId:t.id};
   }else if(op==='trade.offer'||op==='trade.confirm'){
    if(t.status!=='open')throw Error('Aguarde aceitar o convite.');canTransfer(me.state.character);if(integer(p.revision)!==Number(t.revision))throw Error('A oferta mudou. Confira os dois lados novamente.');
    if(op==='trade.offer'){restoreOffer(me.state.character,isA?offerA:offerB);const offer=reserveOffer(me.state.character,p.offer);if(isA)offerA=offer;else offerB=offer;readyA=false;readyB=false;await commitCharacter(db,me);}
    else {if(isA){if(!offerA.fee)offerA=reserveOffer(a.state.character,{gold:0,items:[]});readyA=true;}else{if(!offerB.fee)offerB=reserveOffer(b.state.character,{gold:0,items:[]});readyB=true;}await commitCharacter(db,me);}
    if(readyA&&readyB){receiveOffer(a.state.character,offerB);receiveOffer(b.state.character,offerA);a.state.counters.trades++;b.state.counters.trades++;await commitCharacter(db,a);await commitCharacter(db,b);
     await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[randomUUID(),request.requestId,'trade',a.id,b.id,offerA.gold+offerB.gold,offerA.fee+offerB.fee,(offerA.mythreonCoins??0)+(offerB.mythreonCoins??0),JSON.stringify({a:offerA.items,b:offerB.items})]);
     const quantity=(items:Offer['items'])=>items.reduce((sum,item)=>sum+Math.max(1,Number(item.quantity)||1),0);
     await db.query('insert into public.world_trade_transactions(id,trade_id,seller_character_id,seller_owner_id,buyer_character_id,buyer_owner_id,gold_price,mythreon_coins_price,fee_gold,items,counterparty_items,item_count) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12),($13,$2,$5,$6,$3,$4,$14,$15,$16,$17,$18,$19) on conflict(trade_id,seller_character_id,buyer_character_id) do nothing',[randomUUID(),t.id,a.id,t.a_owner,b.id,t.b_owner,offerB.gold,offerB.mythreonCoins??0,offerA.fee,JSON.stringify(offerA.items),JSON.stringify(offerB.items),quantity(offerA.items),randomUUID(),offerA.gold,offerA.mythreonCoins??0,offerB.fee,JSON.stringify(offerB.items),JSON.stringify(offerA.items),quantity(offerB.items)]);
     await db.query(`insert into public.world_trade_item_stats(template_id,sale_events,units_sold,average_gold_price,lowest_gold_price,highest_gold_price,last_sold_at,average_mythreon_coin_price,lowest_mythreon_coin_price,highest_mythreon_coin_price) select item->>'templateId',count(*)::bigint,coalesce(sum((item->>'quantity')::numeric),0)::bigint,avg(gold_price)::numeric(20,2),min(gold_price),max(gold_price),max(completed_at),avg(mythreon_coins_price)::numeric(20,2),min(mythreon_coins_price),max(mythreon_coins_price) from public.world_trade_transactions tx cross join lateral jsonb_array_elements(tx.items) item where item ? 'templateId' group by item->>'templateId' on conflict(template_id) do update set sale_events=excluded.sale_events,units_sold=excluded.units_sold,average_gold_price=excluded.average_gold_price,lowest_gold_price=excluded.lowest_gold_price,highest_gold_price=excluded.highest_gold_price,last_sold_at=excluded.last_sold_at,average_mythreon_coin_price=excluded.average_mythreon_coin_price,lowest_mythreon_coin_price=excluded.lowest_mythreon_coin_price,highest_mythreon_coin_price=excluded.highest_mythreon_coin_price`);
     await db.query("update public.world_trades set status='completed',ready_a=true,ready_b=true,revision=revision+1 where id=$1",[t.id]);receipt={tradeId:t.id,status:'completed'};
    }else{await db.query('update public.world_trades set offer_a=$2,offer_b=$3,ready_a=$4,ready_b=$5,revision=revision+1 where id=$1',[t.id,JSON.stringify(offerA),JSON.stringify(offerB),readyA,readyB]);receipt={tradeId:t.id};}
   }else throw Error('Ação de troca inválida.');
  }
 }
 else {
  // O polling do chat só lê dados públicos/da caixa de entrada; não precisa
  // bloquear a linha do personagem. Comandos de jogo continuam usando lock.
  actor=await own(db,owner,request.characterId,op!=='social.read');
  if(op==='world.read'||op==='world.command'){
   if(op==='world.command'&&(typeof p.action!=='string'||!Array.isArray(p.args)||p.args.length>3))throw Error('Comando inválido.');
   const premium=await syncPremium(db,owner,actor.state.character);const executed=executeGame(actor.state,op==='world.command'?p.action:undefined,p.args??[]);actor.state=executed.world;receipt={result:executed.result,messages:executed.messages,premium};await commitCharacter(db,actor);await db.query('update public.world_characters set online_at=now() where id=$1',[actor.id]);
  }else if(op==='message.send'){
   const account=(await db.query('select muted_until from public.world_accounts where id=$1',[owner])).rows[0];if(account.muted_until&&new Date(account.muted_until)>new Date())throw Error('Chat temporariamente restrito.');
   const recent=await db.query('select created_at from public.world_messages where sender_owner=$1 order by created_at desc limit 1',[owner]);if(recent.rows[0]&&Date.now()-new Date(recent.rows[0].created_at).getTime()<ONLINE_RULES.messageCooldownMs)throw Error('Aguarde um instante antes da próxima mensagem.');const body=text(p.body,500),target=p.target?await byName(db,p.target):null;
   const channel=target?'global':(['global','trade','help'].includes(String(p.channel))?String(p.channel):'global');
   await db.query('insert into public.world_messages(id,sender_id,sender_owner,sender_name,recipient_id,recipient_owner,body,channel) values($1,$2,$3,$4,$5,$6,$7,$8)',[randomUUID(),actor.id,owner,actor.name,target?.id??null,target?.owner_id??null,body,channel]);
  }else if(op==='friend.invite'){
   const target=await byName(db,p.target);if(target.id===actor.id)throw Error('Escolha outro personagem.');await db.query('insert into public.world_friends(id,inviter_id,invitee_id,inviter_owner,invitee_owner) values($1,$2,$3,$4,$5) on conflict do nothing',[randomUUID(),actor.id,target.id,owner,target.owner_id]);
  }else if(op==='friend.accept'||op==='friend.remove'){
   const row=(await db.query('select * from public.world_friends where id=$1 for update',[uuid(p.id)])).rows[0];if(!row||![row.inviter_id,row.invitee_id].includes(actor.id))throw Error('Convite não encontrado.');if(op==='friend.accept'){if(row.invitee_id!==actor.id)throw Error('Somente o destinatário pode aceitar.');await db.query("update public.world_friends set status='accepted' where id=$1",[row.id]);}else await db.query('delete from public.world_friends where id=$1',[row.id]);
  }else if(op==='mail.send'){
   canTransfer(actor.state.character);if(typeof p.body==='string'&&p.body.includes('\u0000'))throw Error('Mensagem inválida.');const target=await byName(db,p.target);if(target.id===actor.id)throw Error('Escolha outro personagem.');const offer=reserveOffer(actor.state.character,p.offer);const id=randomUUID();await db.query('insert into public.world_mail(id,sender_id,recipient_id,sender_owner,recipient_owner,sender_name,subject,body,gold,mythreon_coins,items,fee) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[id,actor.id,target.id,owner,target.owner_id,actor.name,text(p.subject,80),typeof p.body==='string'?p.body.slice(0,1000):'',offer.gold,offer.mythreonCoins,JSON.stringify(offer.items),offer.fee]);await commitCharacter(db,actor);receipt={mailId:id};
   await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,mythreon_coins,items) values($1,$2,$3,$4,$5,$6,$7,$8,$9)',[randomUUID(),request.requestId,'mail.send',actor.id,target.id,offer.gold,offer.fee,offer.mythreonCoins,JSON.stringify(offer.items)]);
  }else if(op==='mail.claim'){
   const mail=(await db.query('select * from public.world_mail where id=$1 and recipient_id=$2 for update',[uuid(p.id),actor.id])).rows[0];if(!mail)throw Error('Correio não encontrado.');if(mail.claimed_at)throw Error('Este correio já foi recebido.');receiveOffer(actor.state.character,{gold:Number(mail.gold),mythreonCoins:Number(mail.mythreon_coins??0),items:mail.items,fee:0});await db.query('update public.world_mail set claimed_at=now() where id=$1',[mail.id]);await commitCharacter(db,actor);
  }else if(op!=='social.read')throw Error('Operação não permitida.');
 }
 if(!readonly.includes(op))await db.query('update public.world_operations set response=$3 where owner_id=$1 and request_id=$2',[owner,request.requestId,JSON.stringify(receipt)]);
 }
 const list=(await db.query('select id,name,revision,created_at from public.world_characters where owner_id=$1 order by created_at',[owner])).rows;
 const id=actor?.id??request.characterId;
 let current:any=null;if(id){const row=(await db.query('select id,name,state,revision from public.world_characters where id=$1 and owner_id=$2',[uuid(id),owner])).rows[0];if(!row)throw Error('Personagem não encontrado.');current=row;}
 let social:any=undefined;
 if(op==='social.read'){
  if(!current)throw Error('Selecione um personagem.');const friends=(await db.query('select f.*,a.name as inviter_name,b.name as invitee_name,a.online_at as inviter_online_at,b.online_at as invitee_online_at from public.world_friends f join public.world_characters a on a.id=f.inviter_id join public.world_characters b on b.id=f.invitee_id where f.inviter_id=$1 or f.invitee_id=$1 order by f.created_at desc',[id])).rows;
  const globalMessages=(await db.query("select id,sender_id,sender_name,recipient_id,body,channel,created_at from public.world_messages where recipient_id is null order by created_at desc limit 150")).rows;
  const privateMessages=(await db.query("select m.id,m.sender_id,m.sender_name,m.recipient_id,r.name as recipient_name,m.body,m.channel,m.created_at from public.world_messages m left join public.world_characters r on r.id=m.recipient_id where m.recipient_id is not null and (m.sender_id=$1 or m.recipient_id=$1) order by m.created_at desc limit 100",[id])).rows;
  const messages=[...globalMessages,...privateMessages].sort((a,b)=>new Date(a.created_at).getTime()-new Date(b.created_at).getTime());
  const mail=(await db.query('select m.*,r.name as recipient_name from public.world_mail m join public.world_characters r on r.id=m.recipient_id where m.sender_id=$1 or m.recipient_id=$1 order by (m.recipient_id=$1 and m.claimed_at is null) desc,case when m.recipient_id=$1 and m.claimed_at is null then m.created_at end asc,m.created_at desc limit 100',[id])).rows;
  const trades=(await db.query('select t.*,a.name as a_name,b.name as b_name from public.world_trades t join public.world_characters a on a.id=t.a_id join public.world_characters b on b.id=t.b_id where t.a_id=$1 or t.b_id=$1 order by t.created_at desc limit 20',[id])).rows;
  const tradeHistory=(await db.query('select tx.*,s.name as seller_name,b.name as buyer_name from public.world_trade_transactions tx join public.world_characters s on s.id=tx.seller_character_id join public.world_characters b on b.id=tx.buyer_character_id where tx.seller_character_id=$1 or tx.buyer_character_id=$1 order by tx.completed_at desc limit 50',[id])).rows;
  const tradeStats=(await db.query('select * from public.world_trade_item_stats order by units_sold desc,template_id limit 200')).rows;
  const online=(await db.query("select id,name from public.world_characters where online_at>now()-interval '90 seconds' order by name limit 200")).rows;const onlineTotal=Number((await db.query("select count(*)::int as count from public.world_characters where online_at>now()-interval '90 seconds'")).rows[0].count);social={friends,messages,mail,trades,tradeHistory,tradeStats,online,onlineTotal};
 }
 return {ok:true,...receipt,characters:list,current,social};
}
