import {canUseTab} from '../src/engine/journey';
import {createGameStore, type GameState} from '../src/store/gameStore';
import {createNewCharacter} from '../src/engine/save';
import {recalcStats,xpToNextLevel} from '../src/engine/stats';
import {VIALS} from '../src/data/vials';
import {ZONES} from '../src/data/zones';
import {ALL_ITEM_TEMPLATES} from '../src/data/items';
import { getMythreonOffer } from '../src/data/mythreonEconomy';
import type {Character,Race,CharacterAppearance} from '../src/types';
export interface WorldState { character:Character; races:Race[]; isTickRunning:boolean; isTraining:boolean; healingUntil:number|null; deathReport:GameState['deathReport']; lastTickResult:GameState['lastTickResult']; lastAdvanceAt:number; counters:{forges:number;syntheses:number;trades:number;bosses:number}; }
export function freshWorld(name:string,id:string,appearance?:CharacterAppearance):WorldState {const character=createNewCharacter(name,appearance);character.id=id;return {character,races:[],isTickRunning:false,isTraining:false,healingUntil:null,deathReport:null,lastTickResult:null,lastAdvanceAt:Date.now(),counters:{forges:0,syntheses:0,trades:0,bosses:0}};}
function normalizeArrowItems(character:Character){for(const item of [...(character.inventory?.items??[]),...(character.depot??[]),...Object.values(character.equipped??{})]){if(/^FLECHA_T[1-5]$/.test(item.templateId)){item.category='FLECHA';item.slot='MUNICAO';item.stackable=false;item.maxStack=1;item.quantity=1;}}}
function normalizeLegacyItems(character:Character){for(const item of [...(character.inventory?.items??[]),...(character.depot??[]),...Object.values(character.equipped??{})]){if(item.templateId==='UNICO_BRASA_ETERNA'){item.category='PULSEIRA';item.slot='PULSEIRA';}const template=ALL_ITEM_TEMPLATES[item.templateId];if(template){item.stats??={};for(const [key,value] of Object.entries(template.stats??{})){const current=Number((item.stats as any)[key]);if(!Number.isFinite(current)||current===0)(item.stats as any)[key]=Math.round(Number(value)*Math.pow(1.1,item.upgradeLevel??0)*100)/100;}}}const equipped=character.equipped??{};for(const key of ['ANEL_I','ANEL_II'] as const){const item=equipped[key];if(item?.templateId!=='UNICO_BRASA_ETERNA')continue;item.category='PULSEIRA';item.slot='PULSEIRA';if(!equipped.PULSEIRA){equipped.PULSEIRA=item;delete equipped[key];}else{(character.inventory.items??=[]).push({...item,uid:`${item.uid}-pulseira`});delete equipped[key];}}}
export function executeGame(world:WorldState,action?:string,args:unknown[]=[]):{world:WorldState;result:unknown;messages:string[]} {
 normalizeArrowItems(world.character); normalizeLegacyItems(world.character);
 const expectedXp=xpToNextLevel(world.character.level);if(world.character.xpToNext!==expectedXp){world.character.xp=Math.floor(world.character.xp/Math.max(1,world.character.xpToNext)*expectedXp);world.character.xpToNext=expectedXp;}
 world.counters??={forges:0,syntheses:0,trades:0,bosses:0};world.counters.bosses??=0;
 const messages:string[]=[]; const store=createGameStore({server:true,persist:()=>{},notify:m=>messages.push(m)});
 store.setState({...world,currentZoneId:world.character.currentZoneId});
 const now=Date.now(), elapsed=now-world.lastAdvanceAt;
 if(world.healingUntil && now>=world.healingUntil){store.getState().healFull();}
 if(elapsed>=3000 && (world.isTickRunning||world.isTraining)) {
  const steps=elapsed>15000?1:Math.min(5,Math.floor(elapsed/3000));
  for(let i=0;i<steps;i++){store.getState().tick();const tick=store.getState().lastTickResult,actor=store.getState().character!;if(tick?.attacked&&(!actor.onlineBalloonUntil||actor.onlineBalloonUntil<now)&&Math.random()<.15)actor.onlineBalloonUntil=now+10000;world.counters.bosses=(world.counters.bosses??0)+Object.values(store.getState().lastTickResult?.bossKills??{}).reduce((a,b)=>a+b,0);if(!store.getState().isTickRunning&&!store.getState().isTraining)break;}
  world.lastAdvanceAt = elapsed>15000?now:world.lastAdvanceAt+steps*3000;
 }
 let result:unknown;
 if(action){
  const s=store.getState();
  if(s.isTickRunning&&['sellItem','sellSelected','salvageAll','salvageSelected','upgradeItem','rerollItem'].includes(action))throw Error('Saia da caça para acessar o Ferreiro.');
  if(action==='activateBuff'&&(!s.isTickRunning||!s.character?.onlineBalloonUntil||s.character.onlineBalloonUntil<now))throw Error('Este eco de bônus expirou. Aguarde outro durante a caça.');
  const zero=['finishIntro','clearOfflineReport','clearDeathReport','startHealing','cancelHealing','stopHunting','stopTraining','unequipRace','unequipDivineBeast','activateBuff','buyTrainingBoost','buyBless','refreshCompendium'];
  const strings=['unlockZone','setActiveEnemy','setCurrentZone','acceptQuest','claimQuest','upgradeItem','rerollItem','depositItem','withdrawItem','discardItem','plantFarmSeed','harvestFarmPlot','cookFarmRecipe'];
  const uid=(v:unknown)=>{if(typeof v!=='string'||v.length<1||v.length>128)throw Error('Identificador inválido.');return v;};
  if(zero.includes(action)){if(args.length)throw Error('Parâmetros inesperados.');result=(s[action as keyof GameState] as ()=>unknown)();}
  else if(strings.includes(action)){const id=uid(args[0]);if(action==='plantFarmSeed'){result=s.plantFarmSeed(id,uid(args[1]));}else{if(['upgradeItem','rerollItem'].includes(action)){const item=s.character!.inventory.items.find(i=>i.uid===id);if(!item||!['ARMA','ARMADURA','JOIA','PULSEIRA','ESCUDO','FLECHA'].includes(item.category))throw Error('Escolha um equipamento válido para o Ferreiro.');}result=(s[action as keyof GameState] as (id:string)=>unknown)(id);}}
  else if(action==='startHunting'){const zone=uid(args[0]);if(!ZONES[zone])throw Error('Mapa inválido.');s.startHunting(zone);if(store.getState().isTickRunning){store.getState().character!.lastTick=now;world.lastAdvanceAt=now;}}
  else if(action==='startTraining'||action==='spendStatPoint'){const skill=uid(args[0]);if(!['melee','magic','distance','defense','soul'].includes(skill))throw Error('Atributo inválido.');result=(s[action] as (v:any)=>unknown)(skill);if(action==='startTraining')world.lastAdvanceAt=now;}
  else if(action==='equip'){const id=uid(args[0]);const force=args[1]===true;result=s.equip(id,force);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível equipar.');}
  else if(action==='armSpecialCombo'){const power=args[0]===1||args[0]===0.5||args[0]===1.5?args[0] as 1|0.5|1.5:1.5;result=s.armSpecialCombo(power);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível armar o combo.');s.tick();world.lastAdvanceAt=now;}
  else if(action==='unequip'){const slots=['CAPACETE','ARMADURA','LUVAS','CALCAS','BOTAS','COLAR','ANEL_I','ANEL_II','PULSEIRA','ARMA_PRINCIPAL','OFF_HAND','MUNICAO','BACKPACK'];if(!slots.includes(String(args[0])))throw Error('Slot inválido.');result=s.unequip(args[0]);}
  else if(action==='updateAppearance'){const value=args[0];if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Aparência inválida.');const allowed={body:['MASCULINO','FEMININO'],skin:['CLARA','MORENA','ESCURA','AZUL_ESSENCIA'],hair:['CURTO','LONGO','TRANCAS','ARCANO'],hairColor:['NEGRO','CASTANHO','RUIVO','PRATEADO','AZUL'],outfit:['VIAJANTE','GUARDIAO','MISTICO'],outfitColor:['OCRE','AZUL','VIOLETA','VERDE']};for(const [key,values] of Object.entries(allowed)){if(!values.includes(String((value as any)[key])))throw Error('Opção de aparência inválida.');}result=s.updateAppearance(value as any);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível salvar a aparência.');}
  else if(action==='equipRace'){const id=typeof args[0]==='string'?args[0]:(args[0] as any)?.id;const race=s.races.find(r=>r.id===id);if(!race)throw Error('Matriz não descoberta.');s.equipRace(race);}
  else if(action==='equipDivineBeast'){result=s.equipDivineBeast(uid(args[0]) as any);}
  else if(action==='hatchEgg'){result=s.hatchEgg(uid(args[0]));if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível eclodir o ovo.');}
  else if(action==='combineBeast'){result=s.combineBeast(uid(args[0]) as any);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível aprimorar a linhagem.');}
  else if(action==='sellDivineBeast'){result=s.sellDivineBeast(uid(args[0]) as any);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível vender o pet.');}
  else if(action==='feedDivineBeast'){result=s.feedDivineBeast(uid(args[0]) as any, uid(args[1]));if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível alimentar a Besta.');}
  else if(action==='elevateItemTier'){result=s.elevateItemTier(uid(args[0]));if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível elevar o Tier.');}
  else if(action==='rerollSpecificAffix'){result=s.rerollSpecificAffix(uid(args[0]), uid(args[1]) as any);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível sortear o atributo.');}
  else if(action==='buyCalendarCoupon'){result=s.buyCalendarCoupon();if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível comprar o cupom.');}
  else if(action==='claimDailyCalendar'){result=s.claimDailyCalendar();if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível resgatar a recompensa.');}
  else if(action==='synthesize'){result=s.synthesize(uid(args[0]),uid(args[1]),uid(args[2]));if((result as any)?.success)world.counters.syntheses++;}
  else if(action==='useVial'){const id=typeof args[0]==='string'?args[0]:(args[0] as any)?.id;const vial=typeof id==='string'&&Object.hasOwn(VIALS,id)?VIALS[id]:undefined;if(!vial)throw Error('Vial inválido.');s.useVial(vial);}
  else if(action==='sellItem'){const quantity=args[1]??1;if(!Number.isInteger(quantity)||Number(quantity)<1||Number(quantity)>999)throw Error('Quantidade inválida.');s.sellItem(uid(args[0]),Number(quantity));}
  else if(action==='unlockFarmPlot'){result=s.unlockFarmPlot();if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível expandir a fazenda.');}
  else if(action==='sellSelected'){if(!Array.isArray(args[0])||args[0].length>300)throw Error('Seleção inválida.');s.sellSelected([...new Set(args[0].map(uid))]);}
  else if(['salvageSelected','depositMany','withdrawMany'].includes(action)){if(!Array.isArray(args[0])||args[0].length>300)throw Error('Seleção inválida.');const ids=[...new Set(args[0].map(uid))];result=(s[action as 'depositMany'])(ids);}
  else if(action==='salvageAll'){if(!['COMUM','INCOMUM','RARO','EPICO','LENDARIO'].includes(String(args[0])))throw Error('Raridade inválida.');s.salvageAll(args[0]);}
  else if(action==='recordQuestAction'){
   const visits:Record<string,string>={VISIT_WIKI:'wiki',VISIT_MATRIX:'matriz',VISIT_FORGE:'loja',VISIT_BACKPACK:'backpack',VISIT_CHARACTER:'personagem',VISIT_BEASTS:'pets',VISIT_SHOP:'shop',VISIT_LAB:'laboratorio',VISIT_DEPOT:'depot'};
   const visit=String(args[0]);if(!visits[visit]||!canUseTab(s.character!,visits[visit]))throw Error('Etapa de tutorial inválida.');s.recordQuestAction(visit as any);
  }
  else if(action==='updateSettings'){
   const value=args[0];if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Configuração inválida.');const clean:Record<string,unknown>={};
   for(const [key,v] of Object.entries(value)){if(['autoSell','autoSalvage'].includes(key)){if(v!==null&&!['COMUM','INCOMUM','RARO','EPICO','LENDARIO'].includes(String(v)))throw Error('Raridade inválida.');clean[key]=v;}
   else if(['autoSellTemplateIds','autoSalvageTemplateIds','ignoredLootTemplateIds'].includes(key)){if(!Array.isArray(v)||v.length>500||v.some(id=>typeof id!=='string'||id.length>128))throw Error('Itens inválidos.');clean[key]=v;}
   else if(['autoHpPotionEnabled','autoMpPotionEnabled'].includes(key)){if(typeof v!=='boolean')throw Error('Configuração inválida.');clean[key]=v;}
   else if(['autoHpPotionPercent','autoMpPotionPercent'].includes(key)){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>100)throw Error('Limite inválido.');clean[key]=v;}
   else if(['autoHpPotionId','autoMpPotionId'].includes(key)){if(v!==null&&(typeof v!=='string'||!/^POCAO_(VIDA|MANA)_[1-5]$/.test(v)))throw Error('Poção inválida.');clean[key]=v;}
   else throw Error('Esta configuração não pode ser alterada.');} s.updateSettings(clean);
  }
  else if(action==='healFull'){if(!world.healingUntil||now<world.healingUntil)throw Error('Aguarde a meditação.');s.healFull();}
  else if(action==='claimArenaReward')throw Error('Recompensas da arena local não podem ser importadas para a economia online.');
  else if(action==='forgeFragments'){const id=uid(args[0]);if(!['FRAGMENTO_COMUM','FRAGMENTO_RARO'].includes(id))throw Error('Receita inválida.');result=s.forgeFragments(id);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível fundir os fragmentos.');}
  else if(action==='refineMythreonCoins'){const amount=args[0]===undefined?1:Number(args[0]);if(!Number.isInteger(amount)||amount<1||amount>100)throw Error('Quantidade de Coins inválida.');result=s.refineMythreonCoins(amount);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível refinar a energia.');}
  else if(action==='buyMythreonOffer'){const id=uid(args[0]);if(!getMythreonOffer(id))throw Error('Oferta inválida.');result=s.buyMythreonOffer(id);if(!(result as any)?.success)throw Error((result as any)?.error??'Não foi possível concluir a compra.');}
  else throw Error('Ação não permitida.');
  if(action==='activateBuff')store.getState().character!.onlineBalloonUntil=undefined;
  if(action==='upgradeItem'&&(result as any)?.success)world.counters.forges++;
 }
 const state=store.getState();const character=state.character!;recalcStats(character);
 if(!Number.isFinite(character.gold)||character.gold<0||character.gold>Number.MAX_SAFE_INTEGER)throw Error('Saldo inválido.');
 return {world:{...world,character,races:state.races,isTickRunning:state.isTickRunning,isTraining:state.isTraining,healingUntil:state.healingUntil,deathReport:state.deathReport,lastTickResult:state.lastTickResult},result:result??null,messages};
}
export function rankingMetrics(w:WorldState) {const c=w.character,sum=(values:unknown[])=>values.reduce<number>((s,v)=>s+(Number(v)||0),0);const hunt=Object.values(c.huntStatsByZone??{}),stats=c.baseStats;return {maxTier:Math.max(1,...(c.unlockedZoneIds??[]).map(id=>ZONES[id]?.tier??1)),atk:stats.atk??0,matk:stats.matk??0,armor:stats.arm??0,hp:c.hpMax,mp:c.mpMax,crit:Math.round((stats.crit??0)*10000)/100,resPhysical:Math.round((stats.resFisico??0)*10000)/100,resMagic:Math.round((stats.resMagico??0)*10000)/100,mastery:sum(Object.values(c.trainingMastery??{})),earnedXp:sum(hunt.map(h=>h.xp)),earnedGold:sum(hunt.map(h=>h.gold)),damageDealt:sum(hunt.map(h=>h.damageDealt)),damageTaken:sum(hunt.map(h=>h.damageTaken)),huntTime:Math.floor(sum(hunt.map(h=>h.activeMs))/1000),lootValue:sum(hunt.map(h=>h.lootValue)),level:c.level,map:(c.unlockedZoneIds??['BOSQUE_LYSS']).length,discoveries:w.races.length,named:w.races.filter(r=>r.tier==='NOMEADA').length,syntheses:w.counters.syntheses,kills:c.totalKills??0,bosses:w.counters.bosses??0,gold:Math.floor(c.gold),training:sum(Object.values(c.trainingSeconds??{})),melee:c.skills.melee,distance:c.skills.distance,magic:c.skills.magic,defense:c.skills.defense,soul:c.skills.soul,quests:c.quests.completed.length,beasts:c.divineBeasts?.length??0,cards:c.cards.length,salvaged:c.totalSalvaged??0,forges:w.counters.forges,trades:w.counters.trades};}
