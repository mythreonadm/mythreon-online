import { spawn } from 'node:child_process';
import { stat, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scripts=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(scripts);
const watched=['mythreon-brain.mjs','brain-core.mjs'];
let child, stopping=false, restarting=false, retry, failures=0;
const stamps=new Map();
for(const name of watched)stamps.set(name,(await stat(path.join(scripts,name))).mtimeMs);
async function record(status) {
  try{await mkdir(path.join(root,'.mythreon-brain'),{recursive:true});await writeFile(path.join(root,'.mythreon-brain/service-status.json'),JSON.stringify({at:new Date().toISOString(),supervisor:process.pid,child:child?.pid,status}));}catch{}
}
function start() {
  if(stopping)return;
  restarting=false;
  console.log('[cerebro] Iniciando observador atualizado. Não feche esta janela durante o trabalho.');
  child=spawn(process.execPath,[path.join(scripts,'mythreon-brain.mjs'),'--watch'],{cwd:root,stdio:'inherit'});
  void record('ativo');
  child.on('error',error=>console.error('[cerebro] Não foi possível iniciar: '+error.message));
  child.on('close',code=>{
    if(stopping)return;
    if(restarting){retry=setTimeout(start,300);return;}
    if(code===0){stopping=true;clearInterval(timer);void record('encerrado');return;}
    failures++;
    const delay=Math.min(30000,2000*failures);
    console.warn('[cerebro] O processo encerrou com falha. Nova tentativa em '+delay/1000+' s.');
    void record('reiniciando');retry=setTimeout(start,delay);
  });
}
const timer=setInterval(async()=>{
  if(stopping||restarting)return;
  try{
    for(const name of watched){const mtime=(await stat(path.join(scripts,name))).mtimeMs;if(mtime!==stamps.get(name)){stamps.set(name,mtime);restarting=true;}}
    if(restarting){console.log('[cerebro] O código do observador mudou; recarregando as novas regras.');child?.kill('SIGTERM');}
  }catch(error){console.warn('[cerebro] Arquivo temporariamente indisponível: '+error.code);}
},1500);
function stop(){if(stopping)return;stopping=true;clearInterval(timer);clearTimeout(retry);child?.kill('SIGTERM');void record('encerrado');if(process.connected)process.disconnect();}
process.on('SIGINT',stop);process.on('SIGTERM',stop);
process.on('message',message=>{if(message==='stop')stop();});
start();
