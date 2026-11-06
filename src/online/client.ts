import {createClient,type SupabaseClient} from '@supabase/supabase-js';
import { generateId } from "../utils/id";
const env=import.meta.env;
export const onlineConfigured=!!(env.VITE_SUPABASE_URL&&env.VITE_SUPABASE_ANON_KEY&&!env.VITE_SUPABASE_URL.includes('SEU-PROJETO'));
let client:SupabaseClient|null=null;
export function supabase(){if(!onlineConfigured)throw Error('O mundo online ainda não foi configurado.');return client??=createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_ANON_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}
export function apiUrl(){return env.VITE_WORLD_API_URL|| (location.protocol==='mythreon:'?'https://mythreon-online.vercel.app/api/world':'/api/world');}
function compatibleTimeoutSignal(ms:number):AbortSignal|undefined{
  if(typeof AbortSignal!=='undefined'&&typeof (AbortSignal as any).timeout==='function')return (AbortSignal as any).timeout(ms);
  if(typeof AbortController==='undefined')return undefined;
  const controller=new AbortController();
  setTimeout(()=>controller.abort(),ms);
  return controller.signal;
}
export async function worldRequest(operation:string,payload:any={},characterId?:string,requestId:string=generateId()):Promise<any>{
 const {data:{session}}=await supabase().auth.getSession();if(!session)throw Error('Entre na sua conta.');
 const body=JSON.stringify({operation,payload,characterId,requestId});let response:Response|undefined;
 // Repetir o MESMO identificador recupera uma resposta perdida sem aplicar o comando duas vezes.
 for(let attempt=0;attempt<2;attempt++){try{response=await fetch(apiUrl(),{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+session.access_token},body,signal:compatibleTimeoutSignal(25000)});break;}catch(e){if(attempt)throw Object.assign(Error('Sem conexão. Aguardando confirmar a última ação no servidor.'),{uncertain:true});}}
 const result=await response!.json().catch(()=>({error:'Servidor indisponível. Confira a conexão do mundo online.'}));if(!response!.ok||!result.ok)throw Object.assign(Error(result.error??'Não foi possível concluir.'),{uncertain:response!.status>=500});return result;
}
