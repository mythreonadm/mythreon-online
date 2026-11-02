import {create} from 'zustand';
import {createGameStore,useGameStore,type GameState} from '../store/gameStore';
import {supabase,worldRequest} from './client';
export const useOnlineState=create<{active:boolean;pending:boolean;error:string;social:any;tradeId:string|null;refresh:()=>Promise<void>}>()(()=>({active:false,pending:false,error:'',social:null,tradeId:null,refresh:async()=>{}}));
let original:Partial<GameState>={},poll:ReturnType<typeof setInterval>|undefined,socialPoll:ReturnType<typeof setInterval>|undefined,channel:any=null,revision=-1,selectedId='',generation=0,busy=false,socialBusy=false,polling=false;
let recovery:{operation:string;payload:any;requestId:string}|null=null;
const pendingKey=()=> 'mythreon-pending-'+selectedId;
function remember(){try{if(recovery)localStorage.setItem(pendingKey(),JSON.stringify(recovery));else localStorage.removeItem(pendingKey());}catch{}}
function apply(result:any){if(result.current&&Number(result.current.revision)>=revision){revision=Number(result.current.revision);const w=result.current.state;useGameStore.setState({character:w.character,races:w.races,currentZoneId:w.character.currentZoneId,isTickRunning:w.isTickRunning,isTraining:w.isTraining,healingUntil:w.healingUntil,deathReport:w.deathReport,lastTickResult:w.lastTickResult,offlineReport:null});}if(result.social)useOnlineState.setState({social:result.social});}
export async function refreshSocial(){if(!selectedId||socialBusy)return;socialBusy=true;const gen=generation;try{const response=await worldRequest('social.read',{},selectedId);if(gen===generation)apply(response);}catch(e){if(gen===generation)useOnlineState.setState({error:e instanceof Error?e.message:'Conexão indisponível.'});}finally{socialBusy=false;}}
export async function onlineAction(operation:string,payload:any={}) {if(busy||recovery)throw Error('Aguarde a confirmação da ação atual.');const requestId=crypto.randomUUID(),storageKey=pendingKey();try{localStorage.setItem(storageKey,JSON.stringify({operation,payload,requestId}));}catch{}busy=true;useOnlineState.setState({pending:true,error:''});const gen=generation;try{const result=await worldRequest(operation,payload,selectedId,requestId);try{localStorage.removeItem(storageKey);}catch{}if(gen===generation){apply(result);await refreshSocial();}return result;}catch(e){if(!(e as any)?.uncertain){try{localStorage.removeItem(storageKey);}catch{}}if(gen===generation){if((e as any)?.uncertain){recovery={operation,payload,requestId};remember();}useOnlineState.setState({error:e instanceof Error?e.message:'Não foi possível concluir.'});}throw e;}finally{busy=false;if(gen===generation)useOnlineState.setState({pending:!!recovery});}}
export async function connectCharacter(id:string){disconnectCharacter();selectedId=id;try{recovery=JSON.parse(localStorage.getItem(pendingKey())??'null');}catch{recovery=null;}const gen=++generation;const first=await worldRequest('world.read',{},id);if(gen!==generation)return;apply(first);
 const local=useGameStore.getState();original={};const overrides:Record<string,any>={};
 for(const [name,value] of Object.entries(local)){if(typeof value!=='function')continue;(original as any)[name]=value;
  if(['tick','save','loadFromSave','newGame'].includes(name)){overrides[name]=()=>name==='loadFromSave'?false:undefined;continue;}
  overrides[name]=(...args:any[])=>{
   if(busy||recovery)return {success:false,error:'Aguarde a confirmação da ação atual.'};
   // Pré-validação isolada mantém a interface síncrona existente; só a resposta do servidor altera o personagem real.
   const shadow=createGameStore({server:true,persist:()=>{},notify:()=>{}});const current=useGameStore.getState();shadow.setState({character:structuredClone(current.character),races:structuredClone(current.races),currentZoneId:current.currentZoneId,isTickRunning:current.isTickRunning,isTraining:current.isTraining,healingUntil:current.healingUntil,deathReport:current.deathReport});
   let preview:any;try{preview=(shadow.getState() as any)[name](...args);}catch{return {success:false,error:'Não foi possível validar esta ação.'};}
   if(preview?.success===false||preview===false)return preview;
   void onlineAction('world.command',{action:name,args}).then(r=>{if(r.result?.success===false)useOnlineState.setState({error:r.result.error??'Ação não concluída.'});}).catch(()=>{});
   return preview;
  };
 }
 useGameStore.setState(overrides);useOnlineState.setState({active:true,error:recovery?'Recuperando a confirmação da última ação…':'',pending:!!recovery,refresh:refreshSocial});
 poll=setInterval(async()=>{if(busy||polling)return;polling=true;try{const result=recovery?await worldRequest(recovery.operation,recovery.payload,id,recovery.requestId):await worldRequest('world.read',{},id);if(gen===generation){if(recovery){recovery=null;remember();useOnlineState.setState({pending:false});}apply(result);useOnlineState.setState({error:''});}}catch(e){if(gen===generation){if(recovery&&!(e as any)?.uncertain){recovery=null;remember();useOnlineState.setState({pending:false});}useOnlineState.setState({error:e instanceof Error?e.message:'Conexão perdida.'});}}finally{polling=false;}},3000);
 channel=supabase().channel('mythreon-world-'+id);for(const table of ['world_messages','world_friends','world_mail','world_trades'])channel.on('postgres_changes',{event:'*',schema:'public',table},()=>void refreshSocial());channel.subscribe();socialPoll=setInterval(()=>void refreshSocial(),15000);await refreshSocial();
}
export function disconnectCharacter(){generation++;if(poll)clearInterval(poll);if(socialPoll)clearInterval(socialPoll);if(channel){void supabase().removeChannel(channel);channel=null;}if(Object.keys(original).length)useGameStore.setState(original);original={};recovery=null;selectedId='';revision=-1;busy=false;socialBusy=false;polling=false;useOnlineState.setState({active:false,pending:false,error:'',social:null,tradeId:null});}
