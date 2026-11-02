import { readFile, readdir, stat, writeFile, mkdir, rename, unlink, open } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

const EXCLUDED = new Set(['.git','node_modules','dist','release','.mythreon-brain','mythreon obsidian','.obsidian','.vercel','coverage','.aws','.ssh']);
const BLOCKED = /\.(exe|dll|zip|7z|asar|msi|pdb|enc|pem|key|pfx|p12|tmp|lock)$/i;
export const TEXT_EXTENSIONS = new Set(['.ts','.tsx','.js','.jsx','.mjs','.cjs','.css','.html','.json','.md','.yml','.yaml','.bat','.txt']);
const TRANSIENT = new Set(['EBUSY','EPERM','EACCES','ENOENT','ENOTEMPTY','EEXIST']);
export function isIgnored(relative) {
  const normalized = relative.replaceAll('\\','/');
  const parts = normalized.split('/').filter(Boolean);
  const name = parts.at(-1) ?? '';
  return parts.some(part=>EXCLUDED.has(part.toLowerCase())) || /^\.env(?:\.|$)/i.test(name) || /^(pass|passwords|credentials|api's)\.md$/i.test(name) || BLOCKED.test(name) || name.startsWith('.~');
}
export function warning(warnings, file, error) { warnings.push({ path: file, code: error.code ?? 'ERROR' }); }
export async function scanPaths(root, warnings = []) {
  const files = [];
  let incomplete = false;
  async function walk(directory) {
    let entries;
    try { entries = await readdir(directory,{withFileTypes:true}); }
    catch(error) { incomplete=true; warning(warnings,path.relative(root,directory)||'.',error);return; }
    for(const entry of entries) {
      const absolute=path.join(directory,entry.name);
      if(entry.isSymbolicLink() || isIgnored(path.relative(root,absolute))) continue;
      if(entry.isDirectory()) await walk(absolute); else if(entry.isFile()) files.push(absolute);
    }
  }
  await walk(root);
  return { files, incomplete };
}
export async function collectFile(absolute, old, extract, warnings, io = {stat,readFile}) {
  try {
    const info=await io.stat(absolute);
    const extension=path.extname(absolute).toLowerCase();
    let meta=old?.meta ?? {symbols:[],dependencies:[],headings:[]};
    let hash=old?.hash;
    if(!old || old.bytes!==info.size || old.mtime!==info.mtimeMs) {
      if(TEXT_EXTENSIONS.has(extension) && info.size<=2*1024*1024) {
        const content=await io.readFile(absolute);
        hash=createHash('sha256').update(content).digest('hex');
        meta=extract(absolute,content.toString('utf8'));
      } else {
        // Assets são inventariados, não abertos/hashados. Nunca ler executáveis.
        hash=`metadata:${info.size}:${info.mtimeMs}`;
      }
    }
    return {hash,bytes:info.size,mtime:info.mtimeMs,meta};
  } catch(error) {
    warning(warnings,absolute,error);
    return old ? {hash:old.hash,bytes:old.bytes,mtime:old.mtime,meta:old.meta} : null;
  }
}
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export async function atomicWrite(file, content) {
  await mkdir(path.dirname(file),{recursive:true});
  try { if(await readFile(file,'utf8')===content) return false; } catch(error) { if(error.code!=='ENOENT') throw error; }
  const temporary=`${file}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary,content,{encoding:'utf8',flag:'wx'});
    for(let attempt=0;;attempt++) {
      try { await rename(temporary,file);return true; }
      catch(error) { if(!TRANSIENT.has(error.code)||attempt===3) throw error;await pause([75,200,500][attempt]); }
    }
  } finally { await unlink(temporary).catch(()=>{}); }
}
export async function acquireWatchLock(directory) {
  await mkdir(directory,{recursive:true});
  const file=path.join(directory,'watch.lock');
  const token=randomUUID();
  for(let attempt=0;attempt<2;attempt++) {
    try {
      const handle=await open(file,'wx');
      try { await handle.writeFile(JSON.stringify({pid:process.pid,token,at:new Date().toISOString()})); } finally { await handle.close(); }
      return {async release(){try{const lock=JSON.parse(await readFile(file,'utf8'));if(lock.token===token)await unlink(file);}catch{}}};
    } catch(error) {
      if(error.code!=='EEXIST') throw error;
      let lock;
      try { lock=JSON.parse(await readFile(file,'utf8')); } catch { return null; }
      if(!Number.isInteger(lock.pid)||lock.pid<1) return null;
      try { process.kill(lock.pid,0);return null; } catch(error) { if(error.code!=='ESRCH') return null; }
      await unlink(file).catch(()=>{});
    }
  }
  return null;
}

const LABELS={'knowledge':'Conhecimento e documentação','combat':'Combate','quests':'Missões','build-lab':'Laboratório de Builds','windows-desktop':'Windows','items':'Itens e Ferreiro','matrix':'Matrizes','divine-beasts':'Divine Beasts','zones-and-lore':'Mundo e História','elements':'Elementos','visual-assets':'Artes e recursos','save-and-accounts':'Contas e saves','audio':'Áudio','stats-and-progression':'Atributos e progressão','project-ui':'Interface','document':'Documentação','engine':'Motor do jogo','game-data':'Dados do jogo','interface':'Telas','project-config':'Configuração','project-file':'Outros arquivos','state':'Estado','types':'Tipos','utility':'Utilitários','tooling':'Ferramentas'};
const label=topic=>LABELS[topic]??topic;
const topicFile=topic=>`Sistema - ${label(topic)}`;
export async function renderVault(root, graph) {
  const output=path.join(root,'Mythreon Obsidian');
  const brain=path.join(root,'.mythreon-brain');
  await mkdir(output,{recursive:true});
  const marker=path.join(brain,'knowledge-layout-v2.json');
  let migrated=false;try{await stat(marker);migrated=true;}catch{}
  if(!migrated) {
    const archive=path.join(output,'Arquivo',new Date().toISOString().replaceAll(':','-'));
    for(const entry of await readdir(output,{withFileTypes:true})) {
      if(!entry.isFile()||!(/^(Sistema - .*|CEREBRO_MYTHREON|Início|Mapa de Sistemas)\.md$/.test(entry.name)))continue;
      const source=path.join(output,entry.name);
      const destination=path.join(archive,entry.name==='CEREBRO_MYTHREON.md'?'Cerebro legado - copia gerada.md':entry.name);
      if(!source.startsWith(output+path.sep)||!destination.startsWith(archive+path.sep))throw new Error('Arquivo fora da pasta de migração.');
      await mkdir(archive,{recursive:true});await rename(source,destination);
    }
    await atomicWrite(marker,JSON.stringify({version:2,at:new Date().toISOString(),archive:path.relative(root,archive)}));
  }
  const notes=[];
  const knowledge=path.join(root,'docs','conhecimento');
  async function discover(directory) {
    for(const entry of await readdir(directory,{withFileTypes:true})) {
      const absolute=path.join(directory,entry.name);
      if(entry.isSymbolicLink())continue;
      if(entry.isDirectory()){if(entry.name!=='Arquivo')await discover(absolute);continue;}
      if(!entry.name.endsWith('.md'))continue;
      const text=await readFile(absolute,'utf8');
      const source=path.relative(root,absolute).replaceAll('\\','/');
      notes.push({path:source,title:text.match(/^#\s+(.+)$/m)?.[1]??entry.name.slice(0,-3),summary:text.match(/^resumo:\s*(.+)$/m)?.[1]?.replace(/^"|"$/g,'')??'',status:text.match(/^status:\s*(.+)$/m)?.[1]??'a revisar'});
    }
  }
  await mkdir(knowledge,{recursive:true});await discover(knowledge);notes.sort((a,b)=>a.path.localeCompare(b.path));
  await atomicWrite(path.join(brain,'knowledge.json'),JSON.stringify({source:'docs/conhecimento',notes})+'\n');
  const wikilink=note=>`[[${note.path.replace(/\.md$/,'')}|${note.title}]]`;
  const generated='> Índice automático. Edite as notas originais em docs/conhecimento; este arquivo pode ser recriado.\n';
  await atomicWrite(path.join(output,'Início.md'),`# Painel técnico do Cérebro\n\n${generated}\nO conhecimento principal está em [[docs/conhecimento/00 - Fonte de conhecimento|Fonte de conhecimento]]. Comece por [[00 - Comece aqui]].\n\n- [[Mythreon Obsidian/Conhecimento - Catálogo|Catálogo de notas originais]]\n- [[Mythreon Obsidian/Mapa de Sistemas|Mapa técnico]]\n- [[Mythreon Obsidian/Estado da sincronização|Estado da sincronização]]\n\nO código descreve o comportamento real; notas registram regras, decisões e intenções. Não existe cópia editável concorrente do Cérebro nesta pasta.\n`);
  await atomicWrite(path.join(output,'Conhecimento - Catálogo.md'),`# Catálogo de conhecimento\n\n${generated}\n${notes.map(note=>`- ${wikilink(note)} — ${note.summary||note.status}`).join('\n')}\n\n[[docs/conhecimento/00 - Fonte de conhecimento|Voltar à fonte]]\n`);
  await atomicWrite(path.join(output,'Mapa de Sistemas.md'),`# Mapa técnico de sistemas\n\n${generated}\n${graph.t.map(topic=>`- [[Mythreon Obsidian/${topicFile(topic)}|${label(topic)}]]`).join('\n')}\n\n${graph.s.files} arquivos catalogados; assets somente por metadados. Binários de distribuição não entram.\n\n[[docs/conhecimento/00 - Fonte de conhecimento|Base de conhecimento]]\n`);
  for(let index=0;index<graph.t.length;index++) {
    const topic=graph.t[index];
    const rows=graph.files.filter(row=>row[2].includes(index));
    const connected=new Set();
    for(const row of rows){for(const id of row[2])if(id!==index)connected.add(id);for(const id of row[4])for(const target of graph.files[id]?.[2]??[])if(target!==index)connected.add(target);}
    const linkedNotes=notes.filter(note=>rows.some(row=>row[0]===note.path));
    const content=`# ${label(topic)}\n\n${generated}\n## Conhecimento relacionado\n\n${linkedNotes.length?linkedNotes.map(note=>`- ${wikilink(note)}`).join('\n'):'- [[docs/conhecimento/00 - Fonte de conhecimento|Consultar as notas autorais]]'}\n\n## Código e recursos\n\n${rows.map(row=>`- [${row[0]}](../${row[0]})${row[3].length?' — '+row[3].slice(0,12).join(', '):''}`).join('\n')}\n\n## Relações encontradas\n\n${[...connected].sort((a,b)=>a-b).map(id=>`- [[Mythreon Obsidian/${topicFile(graph.t[id])}|${label(graph.t[id])}]]`).join('\n')||'Sem dependências compartilhadas catalogadas.'}\n\n[[Mythreon Obsidian/Mapa de Sistemas|Mapa técnico]]\n`;
    await atomicWrite(path.join(output,topicFile(topic)+'.md'),content);
  }
  return notes.length;
}
