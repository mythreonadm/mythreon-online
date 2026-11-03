import {randomUUID} from 'node:crypto';
import {freshWorld,executeGame,rankingMetrics,type WorldState} from './game';
import {reserveOffer,restoreOffer,receiveOffer,emptyOffer,integer,canTransfer,type Offer} from './transfers';
import {ONLINE_RULES,RANKING_METRICS} from '../src/online/rules';
export interface Database {query:(sql:string,values?:any[])=>Promise<{rows:any[];rowCount?:number|null}>;}
export interface WorldRequest {operation:string;characterId?:string;requestId?:string;payload?:any;}
export interface CharacterRow {id:string;owner_id:string;name:string;state:WorldState;revision:number;}
const uuid=(id:unknown)=>{if(typeof id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))throw Error('Identificador inválido.');return id;};
const text=(v:unknown,max:number)=>{if(typeof v!=='string'||v.includes('\u0000')||!v.trim()||v.trim().length>max)throw Error('Texto inválido ou muito longo.');return v.trim();};
async function commitCharacter(db:Database,c:CharacterRow){if(!Number.isSafeInteger(c.state.character.gold)||c.state.character.gold<0)throw Error("Saldo fora dos limites.");await db.query('update public.world_characters set state=$2,revision=revision+1,updated_at=now() where id=$1',[c.id,JSON.stringify(c.state)]);await db.query('insert into public.world_rankings(character_id,name,metrics,current_map) values($1,$2,$3,$4) on conflict(character_id) do update set metrics=excluded.metrics,name=excluded.name,current_map=excluded.current_map,updated_at=now()',[c.id,c.name,JSON.stringify(rankingMetrics(c.state)),c.state.character.currentZoneId]);}
async function own(db:Database,owner:string,id:unknown){const r=await db.query('select * from public.world_characters where id=$1 and owner_id=$2 for update',[uuid(id),owner]);if(!r.rows[0])throw Error('Personagem não pertence a esta conta.');return r.rows[0] as CharacterRow;}
async function byName(db:Database,name:unknown){const r=await db.query('select id,name,owner_id,online_at from public.world_characters where lower(name)=lower($1)',[text(name,24)]);if(!r.rows[0])throw Error('Personagem não encontrado.');return r.rows[0];}
/** The caller must wrap this command in one database transaction (BEGIN/COMMIT/ROLLBACK). */
export async function handleWorld(db:Database,owner:string,request:WorldRequest){
 uuid(owner);const op=request.operation,p=request.payload??{};if(typeof op!=='string')throw Error('Operação inválida.');
 await db.query('insert into public.world_accounts(id) values($1) on conflict do nothing',[owner]);await db.query('select id from public.world_accounts where id=$1 for update',[owner]);
 const readonly=['characters','world.read','social.read','ranking'];let cached:any=null;
 if(!readonly.includes(op)){const requestId=uuid(request.requestId);const prev=await db.query('select response from public.world_operations where owner_id=$1 and request_id=$2',[owner,requestId]);cached=prev.rows[0]?.response;}
 let receipt:any=cached??{}, actor:CharacterRow|undefined;
 if(!cached){
 if(op==='characters'){}
 else if(op==='character.create'){
  const count=await db.query('select count(*)::int as count from public.world_characters where owner_id=$1',[owner]);if(count.rows[0].count>=ONLINE_RULES.maxCharacters)throw Error('Limite de três personagens por conta.');const name=text(p.name,24).normalize("NFKC");if(!/^[\p{L}\p{N}][\p{L}\p{N} _-]{2,23}$/u.test(name))throw Error('Use 3–24 letras, números, espaços ou hífen.');const id=randomUUID(),state=freshWorld(name,id);
  await db.query('insert into public.world_characters(id,owner_id,name,state) values($1,$2,$3,$4)',[id,owner,name,JSON.stringify(state)]);actor={id,owner_id:owner,name,state,revision:0};await commitCharacter(db,actor);receipt={createdId:id};
 }
 else if(op==='ranking'){
  const metric=String(p.metric??'level');if(!RANKING_METRICS.some(m=>m[0]===metric))throw Error('Ranking inválido.');const page=integer(p.page??0,0,1000);
  const ranks=await db.query('select character_id,name,current_map,metrics,row_number() over(order by (metrics->>$1)::numeric desc,character_id) as position from public.world_rankings order by (metrics->>$1)::numeric desc,character_id limit 50 offset $2',[metric,page*50]);receipt={ranking:ranks.rows,page,metric};
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
     await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,items) values($1,$2,$3,$4,$5,$6,$7,$8)',[randomUUID(),request.requestId,'trade',a.id,b.id,offerA.gold+offerB.gold,offerA.fee+offerB.fee,JSON.stringify({a:offerA.items,b:offerB.items})]);
     const quantity=(items:Offer['items'])=>items.reduce((sum,item)=>sum+Math.max(1,Number(item.quantity)||1),0);
     await db.query('insert into public.world_trade_transactions(id,trade_id,seller_character_id,seller_owner_id,buyer_character_id,buyer_owner_id,gold_price,fee_gold,items,counterparty_items,item_count) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11),($12,$2,$5,$6,$3,$4,$13,$14,$15,$16,$17) on conflict(trade_id,seller_character_id,buyer_character_id) do nothing',[randomUUID(),t.id,a.id,t.a_owner,b.id,t.b_owner,offerB.gold,offerA.fee,JSON.stringify(offerA.items),JSON.stringify(offerB.items),quantity(offerA.items),randomUUID(),offerA.gold,offerB.fee,JSON.stringify(offerB.items),JSON.stringify(offerA.items),quantity(offerB.items)]);
     await db.query("update public.world_trades set status='completed',ready_a=true,ready_b=true,revision=revision+1 where id=$1",[t.id]);receipt={tradeId:t.id,status:'completed'};
    }else{await db.query('update public.world_trades set offer_a=$2,offer_b=$3,ready_a=$4,ready_b=$5,revision=revision+1 where id=$1',[t.id,JSON.stringify(offerA),JSON.stringify(offerB),readyA,readyB]);receipt={tradeId:t.id};}
   }else throw Error('Ação de troca inválida.');
  }
 }
 else {
  actor=await own(db,owner,request.characterId);
  if(op==='world.read'||op==='world.command'){
   if(op==='world.command'&&(typeof p.action!=='string'||!Array.isArray(p.args)||p.args.length>3))throw Error('Comando inválido.');
   const executed=executeGame(actor.state,op==='world.command'?p.action:undefined,p.args??[]);actor.state=executed.world;receipt={result:executed.result,messages:executed.messages};await commitCharacter(db,actor);await db.query('update public.world_characters set online_at=now() where id=$1',[actor.id]);
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
   canTransfer(actor.state.character);if(typeof p.body==='string'&&p.body.includes('\u0000'))throw Error('Mensagem inválida.');const target=await byName(db,p.target);if(target.id===actor.id)throw Error('Escolha outro personagem.');const offer=reserveOffer(actor.state.character,p.offer);const id=randomUUID();await db.query('insert into public.world_mail(id,sender_id,recipient_id,sender_owner,recipient_owner,sender_name,subject,body,gold,items,fee) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',[id,actor.id,target.id,owner,target.owner_id,actor.name,text(p.subject,80),typeof p.body==='string'?p.body.slice(0,1000):'',offer.gold,JSON.stringify(offer.items),offer.fee]);await commitCharacter(db,actor);receipt={mailId:id};
   await db.query('insert into public.world_ledger(id,operation_id,kind,sender_id,recipient_id,gold,fee,items) values($1,$2,$3,$4,$5,$6,$7,$8)',[randomUUID(),request.requestId,'mail.send',actor.id,target.id,offer.gold,offer.fee,JSON.stringify(offer.items)]);
  }else if(op==='mail.claim'){
   const mail=(await db.query('select * from public.world_mail where id=$1 and recipient_id=$2 for update',[uuid(p.id),actor.id])).rows[0];if(!mail)throw Error('Correio não encontrado.');if(mail.claimed_at)throw Error('Este correio já foi recebido.');receiveOffer(actor.state.character,{gold:Number(mail.gold),items:mail.items,fee:0});await db.query('update public.world_mail set claimed_at=now() where id=$1',[mail.id]);await commitCharacter(db,actor);
  }else if(op!=='social.read')throw Error('Operação não permitida.');
 }
 if(!readonly.includes(op))await db.query('insert into public.world_operations(owner_id,request_id,response) values($1,$2,$3)',[owner,request.requestId,JSON.stringify(receipt)]);
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
