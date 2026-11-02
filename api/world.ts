import {Pool} from 'pg';
import {handleWorld} from '../server/world';
let pool:Pool|undefined;
export const config={maxDuration:60};
export default async function handler(req:any,res:any){
 const allowed=(process.env.WORLD_ALLOWED_ORIGINS??'https://mythreon-online.vercel.app,mythreon://game,http://localhost:5173,http://127.0.0.1:5173').split(',').map(x=>x.trim());const origin=req.headers.origin;
 if(origin&&!allowed.includes(origin)){res.statusCode=403;return res.end(JSON.stringify({error:'Origem não autorizada.'}));}
 if(origin)res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Headers','Authorization,Content-Type');res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');
 if(req.method==='OPTIONS'){res.statusCode=204;return res.end();}if(req.method!=='POST'){res.statusCode=405;return res.end(JSON.stringify({error:'Método não permitido.'}));}
 const url=process.env.SUPABASE_URL??process.env.VITE_SUPABASE_URL,key=process.env.SUPABASE_ANON_KEY??process.env.VITE_SUPABASE_ANON_KEY;
 if(!url||!key||!process.env.DATABASE_URL){res.statusCode=503;return res.end(JSON.stringify({error:'O mundo online ainda não foi configurado.'}));}
 let client:any;
 try{
  const token=String(req.headers.authorization??'');if(!token.startsWith('Bearer ')||token.length>10000){res.statusCode=401;return res.end(JSON.stringify({error:'Entre na sua conta.'}));}
  const auth=await fetch(url.replace(/\/$/,'')+'/auth/v1/user',{headers:{apikey:key,Authorization:token},signal:AbortSignal.timeout(8000)});if(!auth.ok){res.statusCode=401;return res.end(JSON.stringify({error:'Sessão expirada. Entre novamente.'}));}const user=await auth.json();if(!user.id||!user.email_confirmed_at){res.statusCode=403;return res.end(JSON.stringify({error:'Confirme seu e-mail antes de entrar no mundo online.'}));}
  const body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||JSON.stringify(body).length>128000){res.statusCode=400;return res.end(JSON.stringify({error:'Solicitação inválida.'}));}
  pool??=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:true,...(process.env.DATABASE_SSL_CA?{ca:process.env.DATABASE_SSL_CA}:{})},max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:8000});
  client=await pool.connect();await client.query('begin');await client.query("set local statement_timeout='15s'");const result=await handleWorld(client,user.id,body);await client.query('commit');res.statusCode=200;res.end(JSON.stringify(result));
 }catch(error:any){if(client)await client.query('rollback').catch(()=>{});res.statusCode=error?.code?500:400;res.end(JSON.stringify({error:error?.code==='23505'?'Este nome de personagem já está em uso.':error?.code?'Não foi possível concluir. Tente novamente.':error instanceof Error?error.message:'Não foi possível concluir.'}));}
 finally{client?.release();}
}
