import { createHash, createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { spawn } from "node:child_process";
import { readFile, readdir, stat, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync, watch as watchFs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAIN_DIR = path.join(ROOT, ".mythreon-brain");
const OBSIDIAN_DIR = path.join(ROOT, "Mythreon Obsidian");
const INDEX_PATH = path.join(BRAIN_DIR, "neurons.json");
const STATE_PATH = path.join(BRAIN_DIR, "state.json");
const SEALED_PATH = path.join(BRAIN_DIR, "neurons.json.gz.enc");
const EXCLUDED_DIRS = new Set([".git", "node_modules", "dist", ".mythreon-brain", "Mythreon Obsidian", ".vercel", "coverage", "release", ".obsidian"]);
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".html", ".json", ".md", ".yml", ".yaml"]);
const MAX_HISTORY = 12;
const MAX_CHANGED_PATHS = 30;
let closing = false;
let childProcess;
let watcher;
let runAgain = false;
let syncing = false;
let debounceTimer;

const posix = (value) => value.split(path.sep).join("/");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
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
    ["combat", /combat|arena|duel|fight/], ["quests", /quest|missao|missão|tutorial/],
    ["build-lab", /buildlab|build-lab|laboratorio/], ["windows-desktop", /desktop|electron|windows/],
    ["items", /item|inventory|backpack|depot|shop|forge|salvage/], ["matrix", /matrix|race|lineage|synthesis|component/],
    ["divine-beasts", /beast|pet/], ["zones-and-lore", /zone|wiki|lore|history/], ["elements", /element/],
    ["visual-assets", /asset|branding|sprite|background|player|monster|vfx|\.gif|\.giff|\.png|\.svg/],
    ["save-and-accounts", /save|account|auth|localaccount/], ["audio", /audio|sound|music/],
    ["stats-and-progression", /stat|skill|level|xp|stamina/], ["project-ui", /app\.tsx|index\.css|tailwind/],
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

async function walk(directory, output = []) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".~") || entry.name.endsWith(".tmp")) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) await walk(absolute, output);
      continue;
    }
    output.push(absolute);
  }
  return output;
}

async function makeGraph(previous, privateState) {
  const oldFiles = privateState?.files?.map(node => [node.path, node])
    ?? previous?.nodes?.filter(node => node.type === "file").map(node => [node.path, node])
    ?? [];
  const previousNodes = new Map(oldFiles);
  const paths = (await walk(ROOT)).map(relative).sort();
  const livePaths = new Set(paths);
  const nodes = [];
  const stateFiles = [];
  const changed = [];
  let unchanged = 0;

  for (const file of paths) {
    const absolute = path.join(ROOT, ...file.split("/"));
    const info = await stat(absolute);
    const old = previousNodes.get(file);
    let hash = old?.hash;
    let metadata = old?.meta ?? { symbols: [], dependencies: [], headings: [] };

    if (!old || old.bytes !== info.size || old.mtime !== info.mtimeMs) {
      const content = await readFile(absolute);
      hash = sha256(content);
      if (TEXT_EXTENSIONS.has(path.extname(file).toLowerCase())) metadata = extractMetadata(file, content.toString("utf8"));
      if (!old) changed.push({ path: file, status: "added" });
      else if (old.hash !== hash) changed.push({ path: file, status: "changed" });
      else unchanged++;
    } else {
      unchanged++;
    }

    const topics = topicsFor(file);
    nodes.push({ path: file, kind: classify(file), hash, bytes: info.size, mtime: info.mtimeMs, topics, meta: metadata });
    stateFiles.push({ path: file, kind: classify(file), hash, bytes: info.size, mtime: info.mtimeMs, topics, meta: metadata });
  }

  for (const old of previousNodes.values()) if (!livePaths.has(old.path)) changed.push({ path: old.path, status: "removed" });

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
    s: { files: paths.length, topics: topics.length, relations: relationCount, unchangedSinceLastScan: unchanged },
    t: topics,
    k: kinds,
    files,
    h: history.slice(-MAX_HISTORY),
    note: "Auto-index: f=[path,kindId,topicIds,exports,importIds,headings]. Hashes internos ficam em state.json, fora do índice legível. Import/topic links são relações entre neurônios; consulte CEREBRO_MYTHREON.md para semântica.",
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

async function syncObsidianVault(graph) {
  await mkdir(OBSIDIAN_DIR, { recursive: true });
  const topicNames = graph.t;
  const fileRows = graph.files;
  const files = fileRows.map(row => ({ path: row[0], kind: graph.k[row[1]], topics: row[2].map(index => topicNames[index]), symbols: row[3], imports: row[4], headings: row[5] }));
  const displayTopic = topic => topic.split(/[-_]/g).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  const topicFile = topic => `Sistema - ${displayTopic(topic)}.md`;
  const topicLinks = topicNames.map(topic => `[[${topicFile(topic).replace(/\.md$/, "")}|${displayTopic(topic)}]]`).join(" · ");
  const latest = graph.h.at(-1);
  const recentChanges = latest?.event === "filesystem-change"
    ? latest.files.map(change => `- ${change.status === "removed" ? "Removido" : change.status === "added" ? "Adicionado" : "Alterado"}: \`${change.path}\``).join("\n")
    : "- Nenhuma mudança de arquivo registrada nesta sincronização.";

  await writeFile(path.join(OBSIDIAN_DIR, "Início.md"), `# Mythreon Online · Cérebro\n\n> Abra esta pasta como um vault no Obsidian. O índice é atualizado por [36mAtivação Cérebro.bat[0m ou por [36mnpm run brain:sync[0m.\n\n## Memória principal\n\n- [[CEREBRO_MYTHREON]] — decisões, arquitetura, estado e continuidade semântica.\n- [[Mapa de Sistemas]] — grafo de arquivos, tópicos e relações do código.\n\n## Sistemas\n\n${topicLinks}\n\n## Última sincronização\n\n${graph.u}\n\n${recentChanges}\n`, "utf8");
  await writeFile(path.join(OBSIDIAN_DIR, "Mapa de Sistemas.md"), `# Mapa de Sistemas\n\nEste mapa é gerado a partir do índice de arquivos. Use os links de sistema para navegar e o Cérebro principal para entender decisões e intenção.\n\n## Sistemas\n\n${topicNames.map(topic => `- [[${topicFile(topic).replace(/\.md$/, "")}|${displayTopic(topic)}]]`).join("\n")}\n\n## Escala atual\n\n- Arquivos indexados: ${graph.s.files}\n- Sistemas relacionados: ${graph.s.topics}\n- Relações de tópico/import: ${graph.s.relations}\n`, "utf8");

  for (let topicIndex = 0; topicIndex < topicNames.length; topicIndex++) {
    const topic = topicNames[topicIndex];
    const related = files.filter(file => file.topics.includes(topic));
    const content = [`# ${displayTopic(topic)}`, ``, `> Índice automático do assunto. O arquivo de código é a fonte da verdade; consulte [[CEREBRO_MYTHREON]] para decisões e regras.`, ``, `## Arquivos relacionados`,
      ...related.map(file => `- [${file.path}](../${file.path})${file.symbols.length ? ` — ${file.symbols.slice(0, 14).join(", ")}` : ""}${file.headings.length ? `\n  - Seções: ${file.headings.slice(0, 8).join(" · ")}` : ""}`),
      ``, `## Conexões`, topicLinks, ``, `## Registro recente`, recentChanges, ``].join("\n");
    await writeFile(path.join(OBSIDIAN_DIR, topicFile(topic)), content, "utf8");
  }
  try {
    const brain = await readFile(path.join(ROOT, "CEREBRO_MYTHREON.md"), "utf8");
    await writeFile(path.join(OBSIDIAN_DIR, "CEREBRO_MYTHREON.md"), brain, "utf8");
  } catch { /* o vault continua utilizável até que o documento principal exista */ }
}

async function syncBrain({ quiet = false } = {}) {
  if (syncing) { runAgain = true; return; }
  syncing = true;
  try {
    const previous = await readPrevious();
    const privateState = await readState();
    const graph = await makeGraph(previous, privateState);
    await mkdir(BRAIN_DIR, { recursive: true });
    const { state, ...publicGraph } = graph;
    await writeFile(INDEX_PATH, `${JSON.stringify(publicGraph)}\n`, "utf8");
    await writeFile(STATE_PATH, `${JSON.stringify(state)}\n`, "utf8");
    await syncObsidianVault(publicGraph);
    const sealed = process.argv.includes("--seal") ? await sealGraph(publicGraph) : false;
    if (!quiet) {
      const changedCount = publicGraph.h.at(-1)?.event === "filesystem-change" ? publicGraph.h.at(-1).files.length : 0;
      console.log(`[cerebro] ${publicGraph.s.files} arquivos · ${publicGraph.s.topics} tópicos · ${publicGraph.s.relations} relações · ${changedCount} alterações registradas${sealed ? " · cópia compactada e criptografada criada" : ""}`);
      if (process.argv.includes("--seal") && !process.env.MYTHREON_BRAIN_KEY) console.warn("[cerebro] Defina MYTHREON_BRAIN_KEY para ativar a cópia criptografada. A chave não deve ser salva no projeto nem enviada ao Git.");
    }
  } finally {
    syncing = false;
    if (runAgain) { runAgain = false; void syncBrain({ quiet: true }); }
  }
}

async function startWatcher() {
  await syncBrain();
  try {
    watcher = watchFs(ROOT, { recursive: true }, (_event, filename) => {
      const changedPath = filename?.toString().replaceAll("\\", "/") ?? "";
      if (changedPath.startsWith(".mythreon-brain/") || changedPath.startsWith("Mythreon Obsidian/") || changedPath.startsWith("node_modules/") || changedPath.startsWith("dist/") || changedPath.startsWith(".git/") || changedPath.startsWith("release/") || changedPath.startsWith(".obsidian/")) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => void syncBrain(), 900);
    });
    console.log("[cerebro] Observando mudanças na pasta. Use Ctrl+C para parar.");
  } catch (error) {
    console.error("[cerebro] Não foi possível iniciar a observação recursiva:", error);
    process.exitCode = 1;
  }
}

async function shutdown() {
  if (closing) return;
  closing = true;
  clearTimeout(debounceTimer);
  watcher?.close();
  if (childProcess && !childProcess.killed) childProcess.kill("SIGINT");
}

process.on("SIGINT", () => { void shutdown(); });
process.on("SIGTERM", () => { void shutdown(); });

const mode = process.argv.find(arg => ["--once", "--watch", "--dev", "--open"].includes(arg)) ?? "--once";
if (mode === "--open") {
  await openSealedGraph();
} else if (mode === "--once") {
  await syncBrain();
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
