import assert from 'node:assert/strict';
const {default:handler}=await import('../api/world.js');
assert.equal(typeof handler,'function');
async function invoke(method,headers={},body={}){let output='';const res={statusCode:200,setHeader(){},end(text=''){output=text;}};await handler({method,headers,body},res);return {status:res.statusCode,body:output?JSON.parse(output):null};}
const names=['SUPABASE_URL','SUPABASE_ANON_KEY','VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','DATABASE_URL'],previous=names.map(n=>process.env[n]);
try{names.forEach(n=>delete process.env[n]);assert.equal((await invoke('GET')).status,405);assert.equal((await invoke('POST')).status,503);assert.equal((await invoke('OPTIONS',{origin:'https://mythreon-online.vercel.app'})).status,204);assert.equal((await invoke('POST',{origin:'https://outside.invalid'})).status,403);console.log('PASS: entrypoint ESM carrega no Node real; GET 405, configuração ausente 503, preflight 204, origem externa 403.');}
finally{names.forEach((n,i)=>{if(previous[i]===undefined)delete process.env[n];else process.env[n]=previous[i];});}
