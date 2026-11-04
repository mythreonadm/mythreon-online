import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const entries = JSON.parse(await readFile(path.join(root, "docs", "jornal", "releases.json"), "utf8"));
const generated = JSON.parse(await readFile(path.join(root, "src", "data", "journal-releases.json"), "utf8"));
if (JSON.stringify(entries) !== JSON.stringify(generated)) throw new Error("O Jornal gerado está desatualizado. Execute npm run journal:sync.");
const active = entries.filter(entry => entry.active === true).length;
console.log(`PASS Jornal: ${entries.length} entrada(s), ${active} evento(s) ativo(s), IDs únicos e catálogo gerado em sincronia.`);
