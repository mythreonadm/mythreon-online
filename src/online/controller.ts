import {create} from 'zustand';
import {createGameStore,useGameStore,type GameState} from '../store/gameStore';
import {supabase,worldRequest} from './client';
export const useOnlineState=create<{active:boolean;pending:boolean;error:string;social:any;tradeId:string|null;refresh:()=>Promise<void>}>()(()=>({active:false,pending:false,error:'',social:null,tradeId:null,refresh:async()=>{}}));
let original:Partial<GameState>={},poll:ReturnType<typeof setInterval>|undefined,socialPoll:ReturnType<typeof setInterval>|undefined,fullSync:ReturnType<typeof setInterval>|undefined,channel:any=null,revision=-1,selectedId='',generation=0,busy=false,socialBusy=false,polling=false,flushing=false;
type QueuedCommand={operation:string;payload:any;resolve:(value:any)=>void;reject:(reason:any)=>void};
const commandQueue:QueuedCommand[]=[];
let recovery:{operation:string;payload:any;requestId:string}|null=null;
const pendingKey=()=> 'mythreon-pending-'+selectedId;
function remember(){try{if(recovery)localStorage.setItem(pendingKey(),JSON.stringify(recovery));else localStorage.removeItem(pendingKey());}catch{}}
function apply(result:any){if(result.current&&Number(result.current.revision)>=revision){revision=Number(result.current.revision);const w=result.current.state;useGameStore.setState({character:w.character,races:w.races,currentZoneId:w.character.currentZoneId,isTickRunning:w.isTickRunning,isTraining:w.isTraining,healingUntil:w.healingUntil,deathReport:w.deathReport,lastTickResult:w.lastTickResult,offlineReport:null});}if(result.social)useOnlineState.setState({social:result.social});}
export async function refreshSocial(){if(!selectedId||socialBusy)return;socialBusy=true;const gen=generation;try{const response=await worldRequest('social.read',{},selectedId);if(gen===generation)apply(response);}catch(e){if(gen===generation)useOnlineState.setState({error:e instanceof Error?e.message:'Conexão indisponível.'});}finally{socialBusy=false;}}
async function executeOnlineAction(operation:string,payload:any={}) {if(recovery)throw Error('Aguardando a confirmação da última ação.');const requestId=crypto.randomUUID(),storageKey=pendingKey();try{localStorage.setItem(storageKey,JSON.stringify({operation,payload,requestId}));}catch{}busy=true;const gen=generation;try{const result=await worldRequest(operation,payload,selectedId,requestId);try{localStorage.removeItem(storageKey);}catch{}if(gen===generation)apply(result);return result;}catch(e){if(!(e as any)?.uncertain){try{localStorage.removeItem(storageKey);}catch{}}if(gen===generation){if((e as any)?.uncertain){recovery={operation,payload,requestId};remember();}useOnlineState.setState({error:e instanceof Error?e.message:'Não foi possível concluir.'});}throw e;}finally{busy=false;if(gen===generation)useOnlineState.setState({pending:!!recovery});}}
async function flushCommandQueue(){if(flushing)return;flushing=true;try{while(commandQueue.length&&!recovery){const job=commandQueue.shift()!;try{job.resolve(await executeOnlineAction(job.operation,job.payload));}catch(error){job.reject(error);}}}finally{flushing=false;}}
export function onlineAction(operation:string,payload:any={}):Promise<any> {return new Promise<any>((resolve,reject)=>{commandQueue.push({operation,payload,resolve,reject});void flushCommandQueue();});}
export async function connectCharacter(id:string){disconnectCharacter();selectedId=id;try{recovery=JSON.parse(localStorage.getItem(pendingKey())??'null');}catch{recovery=null;}const gen=++generation;const first=await worldRequest('world.read',{},id);if(gen!==generation)return;apply(first);
 const local=useGameStore.getState();original={};const overrides:Record<string,any>={};
 for(const [name,value] of Object.entries(local)){if(typeof value!=='function')continue;(original as any)[name]=value;
  if(['tick','save','loadFromSave','newGame'].includes(name)){overrides[name]=()=>name==='loadFromSave'?false:undefined;continue;}
  overrides[name]=(...args:any[])=>{
   // Handlers como onClick={stopHunting} recebem o evento React. Nunca o envie ao
   // servidor: SyntheticEvent contém referências circulares (__reactFiber).
   const noArg = ['stopHunting','stopTraining','finishIntro','clearOfflineReport','clearDeathReport','startHealing','cancelHealing','unequipRace','unequipDivineBeast','activateBuff','buyTrainingBoost','buyBless','refreshCompendium'].includes(name);
   const safeArgs = noArg || (args.length === 1 && args[0] && typeof args[0] === 'object' && ('nativeEvent' in args[0] || 'currentTarget' in args[0])) ? [] : args;
   // Pré-validação isolada mantém a interface síncrona existente; só a resposta do servidor altera o personagem real.
   const shadow=createGameStore({server:true,persist:()=>{},notify:()=>{}});const current=useGameStore.getState();shadow.setState({character:structuredClone(current.character),races:structuredClone(current.races),currentZoneId:current.currentZoneId,isTickRunning:current.isTickRunning,isTraining:current.isTraining,healingUntil:current.healingUntil,deathReport:current.deathReport});
   let preview:any;try{preview=(shadow.getState() as any)[name](...safeArgs);}catch{return {success:false,error:'Não foi possível validar esta ação.'};}
   if(preview?.success===false||preview===false)return preview;
   // Atualização otimista: a interface reage imediatamente; a confirmação segue em segundo plano.
   const next=shadow.getState();
   useGameStore.setState({character:next.character,races:next.races,currentZoneId:next.currentZoneId,isTickRunning:next.isTickRunning,isTraining:next.isTraining,healingUntil:next.healingUntil,deathReport:next.deathReport,lastTickResult:next.lastTickResult});
   void onlineAction('world.command',{action:name,args:safeArgs}).then(r=>{if(r.result?.success===false)useOnlineState.setState({error:r.result.error??'Ação não concluída.'});}).catch(()=>{});
   return preview;
  };
 }
 useGameStore.setState(overrides);useOnlineState.setState({active:true,error:recovery?'Recuperando a confirmação da última ação…':'',pending:!!recovery,refresh:refreshSocial});
 poll=setInterval(async()=>{if(busy||polling)return;polling=true;try{const result=recovery?await worldRequest(recovery.operation,recovery.payload,id,recovery.requestId):await worldRequest('world.read',{},id);if(gen===generation){if(recovery){recovery=null;remember();useOnlineState.setState({pending:false});void flushCommandQueue();}apply(result);useOnlineState.setState({error:''});}}catch(e){if(gen===generation){if(recovery&&!(e as any)?.uncertain){recovery=null;remember();useOnlineState.setState({pending:false});void flushCommandQueue();}useOnlineState.setState({error:e instanceof Error?e.message:'Conexão perdida.'});}}finally{polling=false;}},3000);
 fullSync=setInterval(()=>{if(!busy&&!recovery&&!polling)void refreshWorld(id,gen);},60*60*1000);
 channel=supabase().channel('mythreon-world-'+id);for(const table of ['world_messages','world_friends','world_mail','world_trades','world_trade_transactions'])channel.on('postgres_changes',{event:'*',schema:'public',table},()=>void refreshSocial());channel.subscribe();socialPoll=setInterval(()=>void refreshSocial(),15000);await refreshSocial();
}
async function refreshWorld(id:string,gen:number){try{const result=await worldRequest('world.read',{},id);if(gen===generation)apply(result);}catch{} }
export function disconnectCharacter(){generation++;if(poll)clearInterval(poll);if(socialPoll)clearInterval(socialPoll);if(fullSync)clearInterval(fullSync);if(channel){void supabase().removeChannel(channel);channel=null;}if(Object.keys(original).length)useGameStore.setState(original);original={};recovery=null;commandQueue.splice(0,commandQueue.length);selectedId='';revision=-1;busy=false;socialBusy=false;polling=false;flushing=false;useOnlineState.setState({active:false,pending:false,error:'',social:null,tradeId:null});}
