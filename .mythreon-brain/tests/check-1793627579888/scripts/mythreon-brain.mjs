import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { spawn } from "node:child_process";
import { readFile, readdir, stat, writeFile, mkdir, appendFile } from "node:fs/promises";
import { existsSync, statSync, watch as watchFs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isIgnored, scanPaths, collectFile, atomicWrite, renderVault, acquireWatchLock } from "./brain-core.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAIN_DIR = path.join(ROOT, ".mythreon-brain");
const OBSIDIAN_DIR = path.join(ROOT, "Mythreon Obsidian");
const INDEX_PATH = path.join(BRAIN_DIR, "neurons.json");
const STATE_PATH = path.join(BRAIN_DIR, "state.json");
const SEALED_PATH = path.join(BRAIN_DIR, "neurons.json.gz.enc");
const MAX_HISTORY = 12;
const MAX_CHANGED_PATHS = 30;
let closing = false;
let childProcess;
let watcher;
let runAgain = false;
let syncing = false;
let debounceTimer;
let pollTimer;
let watchLock;
let lastSyncResult;

const posix = (value) => value.split(path.sep).join("/");
const relative = (absolute) => posix(path.relative(ROOT, absolute));

async function readPrevious() {
  try { return JSON.parse(await readFile(INDEX_PATH, "utf8")); }
  catch { return null; }
}

async function readState() {
  try { return JSON.parse(await readFile(STATE_PATH, "utf8")); }
  catch { return null; }
}

function classify(file) {
  const p = file.toLowerCase();
  if (p.endsWith(".md")) return "document";
  if (p.startsWith("src/data/")) return "game-data";
  if (p.startsWith("src/engine/")) return "engine";
  if (p.startsWith("src/store/")) return "state";
  if (p.startsWith("src/ui/")) return "interface";
  if (p.startsWith("src/types/")) return "types";
  if (p.startsWith("src/utils/")) return "utility";
  if (p.startsWith("public/assets/")) return "asset";
  if (p.startsWith("scripts/")) return "tooling";
  if (p === "package.json") return "project-config";
  return "project-file";
}

function topicsFor(file) {
  const p = file.toLowerCase();
  const topics = [];
  const rules = [
    ["knowledge", /cerebro|brain|obsidian|conhecimento|documentacao|documentação/], ["combat", /combat|arena|duel|fight/], ["quests", /quest|missao|missão|tutorial/],
    ["build-lab", /buildlab|build-lab|laboratorio/], ["windows-desktop", /desktop|electron|windows/],
    ["items", /item|inventory|backpack|depot|shop|forge|salvage/], ["matrix", /matrix|race|lineage|synthesis|component/],
    ["divine-beasts", /beast|pet/], ["zones-and-lore", /zone|wiki|lore|history/], ["elements", /element/],
    ["visual-assets", /asset|branding|sprite|background|player|monster|vfx|\.gif|\.giff|\.png|\.svg/],
    ["save-and-accounts", /save|account|auth|localaccount/], ["audio", /audio|sound|music/],
    ["stats-and-progression", /stat|skill|level|xp|stamina|training|treino|maestria/], ["project-ui", /app\.tsx|index\.css|tailwind/],
  ];
  for (const [topic, pattern] of rules) if (pattern.test(p)) topics.push(topic);
  if (!topics.length) topics.push(classify(file));
  return [...new Set(topics)];
}

function extractMetadata(file, source) {
  const extension = path.extname(file).toLowerCase();
  const symbols = [];
  const dependencies = [];
  const headings = [];
  if ([".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(extension)) {
    const exportPattern = /\bexport\s+(?:default\s+)?(?:declare\s+)?(?:async\s+)?(?:function|class|interface|type|enum|const|let|var)\s+([A-Za-z_$][\w$]*)/g;
    for (const match of source.matchAll(exportPattern)) symbols.push(match[1]);
    for (const match of source.matchAll(/\bexport\s*\{([^}]+)\}/g)) {
      for (const symbol of match[1].split(",")) symbols.push(symbol.trim().split(/\s+as\s+/).at(-1));
    }
    for (const match of source.matchAll(/\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?["'](\.{1,2}\/[^"']+)["']/g)) dependencies.push(match[1]);
    for (const match of source.matchAll(/\bimport\s*\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g)) dependencies.push(match[1]);
  } else if (extension === ".md") {
    for (const match of source.matchAll(/^#{1,3}\s+(.+)$/gm)) headings.push(match[1].trim());
  }
  return {
    symbols: [...new Set(symbols.filter(Boolean))].slice(0, 120),
    dependencies: [...new Set(dependencies)].slice(0, 150),
    headings: headings.slice(0, 40),
  };
}

async function makeGraph(previous, privateState) {
  const oldFiles = privateState?.files?.map(node => [node.path, node])
    ?? previous?.nodes?.filter(node => node.type === "file").map(node => [node.path, node])
    ?? [];
  const previousNodes = new Map(oldFiles);
  const warnings = [];
  const scan = await scanPaths(ROOT, warnings);
  const paths = scan.files.map(relative).sort();
  const livePaths = new Set(paths);
  const nodes = [];
  const stateFiles = [];
  const changed = [];
  let unchanged = 0;

  for (const file of paths) {
    const absolute = path.join(ROOT, ...file.split("/"));
    const old = previousNodes.get(file);
    const collected = await collectFile(absolute, old, extractMetadata, warnings);
    if (!collected) continue;
    const { hash, bytes, mtime } = collected;
    const metadata = collected.meta ?? { symbols: [], dependencies: [], headings: [] };
    if (!old) changed.push({ path: file, status: 'added' });
    else if (old.hash !== hash) changed.push({ path: file, status: 'changed' });
    else unchanged++;

    const topics = topicsFor(file);
    nodes.push({ path: file, kind: classify(file), hash, bytes, mtime, topics, meta: metadata });
    stateFiles.push({ path: file, kind: classify(file), hash, bytes, mtime, topics, meta: metadata });
  }

  for (const old of previousNodes.values()) if (!livePaths.has(old.path) && !isIgnored(old.path)) {
    if (scan.incomplete) { nodes.push(old); stateFiles.push(old); }
    else changed.push({ path: old.path, status: 'removed' });
  }

  const topics = [...new Set(nodes.flatMap(node => node.topics))].sort();
  const topicIndex = new Map(topics.map((topic, index) => [topic, index]));
  const fileIndex = new Map(nodes.map((node, index) => [node.path, index]));
  const kinds = [...new Set(nodes.map(node => node.kind))].sort();
  const kindIndex = new Map(kinds.map((kind, index) => [kind, index]));
  const files = nodes.map(node => {
    const imported = [];
    for (const dependency of node.meta.dependencies) {
      const base = path.resolve(ROOT, ...node.path.split("/").slice(0, -1), dependency);
      const candidates = [base, ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json"].map(ext => `${base}${ext}`), ...["index.ts", "index.tsx", "index.js", "index.jsx"].map(name => path.join(base, name))];
      const target = candidates.find(candidate => existsSync(candidate) && statSyncFile(candidate));
      const targetIndex = target ? fileIndex.get(relative(target)) : undefined;
      if (targetIndex !== undefined) imported.push(targetIndex);
    }
    return [node.path, kindIndex.get(node.kind),
      [...new Set(node.topics.map(topic => topicIndex.get(topic)).filter(index => index !== undefined))],
      node.meta.symbols, [...new Set(imported)], node.meta.headings];
  });
  const relationCount = files.reduce((total, row) => total + row[2].length + row[4].length, 0);

  const history = previous?.h ?? previous?.history ?? [];
  if (!previous) history.push({ at: new Date().toISOString(), event: "baseline", files: nodes.length });
  else if (changed.length) history.push({ at: new Date().toISOString(), event: "filesystem-change", files: changed.slice(0, MAX_CHANGED_PATHS), omitted: Math.max(0, changed.length - MAX_CHANGED_PATHS) });

  return {
    v: 1,
    p: "Mythreon Online",
    u: new Date().toISOString(),
    schema: "f rows=[path,kindId,topicIds,exports,importFileIds,markdownHeadings]; topic/kind/import references are numeric indexes",
    s: { files: nodes.length, topics: topics.length, relations: relationCount, unchangedSinceLastScan: unchanged, changed: changed.length },
    t: topics,
    k: kinds,
    files,
    h: history.slice(-MAX_HISTORY),
    note: "Auto-index: f=[path,kindId,topicIds,exports,importIds,headings]. Hashes internos ficam em state.json, fora do índice legível. Import/topic links são relações entre neurônios; consulte CEREBRO_MYTHREON.md para semântica.",
    warnings: warnings.map(entry => ({ ...entry, path: path.isAbsolute(entry.path) ? relative(entry.path) : entry.path })),
    changes: changed,
    state: { v: 1, files: stateFiles },
  };
}

function statSyncFile(file) {
  try { return statSync(file).isFile(); } catch { return false; }
}

async function sealGraph(graph) {
  const secret = process.env.MYTHREON_BRAIN_KEY;
  if (!secret) return false;
  const key = createHash("sha256").update(secret, "utf8").digest();
  const iv = randomBytes(12);
  const compressed = gzipSync(Buffer.from(JSON.stringify(graph)));
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(compressed), cipher.final()]);
  const envelope = { version: 1, algorithm: "AES-256-GCM+gzip", iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: ciphertext.toString("base64") };
  await writeFile(SEALED_PATH, JSON.stringify(envelope));
  return true;
}

async function openSealedGraph() {
  const secret = process.env.MYTHREON_BRAIN_KEY;
  if (!secret) throw new Error("Defina MYTHREON_BRAIN_KEY com a mesma chave usada para criptografar.");
  const envelope = JSON.parse(await readFile(SEALED_PATH, "utf8"));
  if (envelope.algorithm !== "AES-256-GCM+gzip") throw new Error("Formato/algoritmo criptográfico desconhecido.");
  const key = createHash("sha256").update(secret, "utf8").digest();
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(envelope.iv, "base64"));
  decipher.setAuthTag(Buffer.from(envelope.tag, "base64"));
  const compressed = Buffer.concat([decipher.update(Buffer.from(envelope.data, "base64")), decipher.final()]);
  const graph = gunzipSync(compressed);
  const output = path.join(BRAIN_DIR, "neurons.restored.json");
  await writeFile(output, graph);
  console.log(`[cerebro] Arquivo autenticado e restaurado em ${relative(output)}.`);
}

async function publishStatus(result) {
  await atomicWrite(path.join(BRAIN_DIR, 'status.json'), JSON.stringify(result, null, 2)+'\n');
  const lines = ['# Estado da sincronização', '', '> Painel automático; não substitui as notas de conhecimento.', '',
    'Estado: **'+result.status+'**', 'Atualizado: '+result.at, 'PID do processo: '+process.pid, '',
    result.message ?? '', '', ...(result.warnings ?? []).map(item=>'- '+item.path+' — '+item.code), '',
    '[[docs/conhecimento/00 - Fonte de conhecimento|Abrir a base de conhecimento]]', ''];
  await atomicWrite(path.join(OBSIDIAN_DIR, 'Estado da sincronização.md'), lines.join('\n'));
}
async function syncBrain({ quiet = false } = {}) {
  if (closing) return lastSyncResult;
  if (syncing) { runAgain = true; return lastSyncResult; }
  syncing = true;
  try {
    const previous = await readPrevious();
    const privateState = await readState();
    const graph = await makeGraph(previous, privateState);
    await mkdir(BRAIN_DIR, { recursive: true });
    const { state, changes, ...publicGraph } = graph;
    await atomicWrite(INDEX_PATH, JSON.stringify(publicGraph)+'\n');
    const notes = await renderVault(ROOT, publicGraph);
    if (changes.length) await appendFile(path.join(BRAIN_DIR, 'changes.jsonl'), JSON.stringify({at:graph.u,files:changes})+'\n', 'utf8');
    await atomicWrite(STATE_PATH, JSON.stringify(state)+'\n');
    const sealed = process.argv.includes('--seal') ? await sealGraph(publicGraph) : false;
    const result = {at:graph.u,status:graph.warnings.length?'parcial':'ok',pid:process.pid,files:graph.s.files,notes,changed:changes.length,warnings:graph.warnings,message:notes+' notas originais catalogadas. Decisões e explicações são mantidas em docs/conhecimento.'};
    await publishStatus(result); lastSyncResult=result;
    if (!quiet || changes.length || result.status!=='ok') console.log('[cerebro v2] '+result.status+' · '+graph.s.files+' arquivos · '+notes+' notas originais · '+changes.length+' alterações'+(sealed?' · cópia cifrada criada':''));
    if(graph.warnings.length)console.warn('[cerebro] Arquivos indisponíveis foram preservados no índice anterior. O observador tentará novamente.');
    return result;
  } catch(error) {
    const result={at:new Date().toISOString(),status:'erro',pid:process.pid,message:'A sincronização não terminou. As notas originais não foram removidas. Nova tentativa automática no modo observador.',warnings:[{path:error.path?relative(error.path):'sincronização',code:error.code??error.message}]};
    lastSyncResult=result;
    console.error('[cerebro] Sincronização incompleta: '+(error.code??error.message)+'. O observador continua ativo.');
    try { await publishStatus(result); } catch { console.error('[cerebro] Não foi possível gravar o painel de estado agora.'); }
    return result;
  } finally {
    syncing=false;
    if(runAgain && !closing){runAgain=false;void syncBrain();}
  }
}
async function startWatcher() {
  watchLock=await acquireWatchLock(BRAIN_DIR);
  if(!watchLock){console.log('[cerebro] Já existe um observador ativo. Use a janela existente; se ela for antiga, feche-a e abra Ativação Cérebro.bat novamente.');return false;}
  await syncBrain();
  try {
    watcher=watchFs(ROOT,{recursive:true},(_event,filename)=>{
      const changed=filename?.toString()??'';
      if(isIgnored(changed))return;
      clearTimeout(debounceTimer);
      debounceTimer=setTimeout(()=>void syncBrain(),900);
    });
    watcher.on('error', error=>console.warn('[cerebro] Aviso do observador: '+error.code+'. A verificação periódica continua.'));
  } catch(error) { console.warn('[cerebro] Observação por eventos indisponível: '+error.code+'. Verificação periódica ativa.'); }
  pollTimer=setInterval(()=>void syncBrain({quiet:true}),30000);
  console.log('[cerebro v2] Observando arquivos e notas. Revisão de segurança a cada 30 s; Ctrl+C encerra.');
  return true;
}

async function shutdown() {
  if (closing) return;
  closing = true;
  clearTimeout(debounceTimer);
  watcher?.close();
  clearInterval(pollTimer);
  await watchLock?.release();
  if (childProcess && !childProcess.killed) childProcess.kill("SIGINT");
}

process.on("SIGINT", () => { void shutdown(); });
process.on("SIGTERM", () => { void shutdown(); });

const mode = process.argv.find(arg => ["--once", "--watch", "--dev", "--open"].includes(arg)) ?? "--once";
if (mode === "--open") {
  await openSealedGraph();
} else if (mode === "--once") {
  const result = await syncBrain();
  if (result?.status !== "ok") process.exitCode = 1;
} else if (mode === "--watch") {
  await startWatcher();
} else {
  await startWatcher();
  if (!process.exitCode) {
    const vite = path.join(ROOT, "node_modules", "vite", "bin", "vite.js");
    const viteArgs = process.argv.slice(2).filter(arg => !["--once", "--watch", "--dev", "--open", "--seal"].includes(arg));
    childProcess = spawn(process.execPath, [vite, ...viteArgs], { cwd: ROOT, stdio: "inherit", env: process.env });
    childProcess.on("exit", code => { process.exitCode = code ?? 0; void shutdown(); });
  }
}
