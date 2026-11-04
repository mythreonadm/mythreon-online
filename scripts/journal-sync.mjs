import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "docs", "jornal", "releases.json");
const target = path.join(root, "src", "data", "journal-releases.json");
const kinds = new Set(["ATUALIZAÇÃO", "EVENTO", "LORE", "AVISO"]);

function fail(message) { throw new Error(`[jornal] ${message}`); }
const entries = JSON.parse(await readFile(source, "utf8"));
if (!Array.isArray(entries)) fail("releases.json precisa conter uma lista.");
const ids = new Set();
for (const [index, entry] of entries.entries()) {
  if (!entry || typeof entry !== "object") fail(`Entrada ${index + 1} inválida.`);
  if (!entry.id || ids.has(entry.id)) fail(`ID ausente ou duplicado na entrada ${index + 1}.`);
  ids.add(entry.id);
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(String(entry.date))) fail(`Data inválida em ${entry.id}. Use DD/MM/AAAA.`);
  if (!kinds.has(entry.kind)) fail(`Categoria inválida em ${entry.id}.`);
  for (const key of ["title", "summary", "body"]) if (typeof entry[key] !== "string" || !entry[key].trim()) fail(`${key} ausente em ${entry.id}.`);
  if (!Array.isArray(entry.tags) || entry.tags.some(tag => typeof tag !== "string" || !tag.trim())) fail(`Tags inválidas em ${entry.id}.`);
}
await mkdir(path.dirname(target), { recursive: true });
await writeFile(target, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
console.log(`[jornal] ${entries.length} entrada(s) editorial(is) sincronizada(s).`);
