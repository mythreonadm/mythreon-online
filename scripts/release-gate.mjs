import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "src/App.tsx", "src/ui/Shop.tsx", "src/ui/OnlineMarket.tsx", "src/ui/Wiki.tsx",
  "src/data/mythreonJournal.ts", "src/data/journal-releases.json", "desktop/main.cjs",
  "desktop/updater.cjs", "docs/ROADMAP_LANCAMENTO.md", "docs/RELEASE_CHECKLIST_MYTHREON.md",
];
const checks = [
  ["journal:check", "Jornal editorial e catálogo gerado"],
  ["online:bundle-check", "Runtimes online gerados"],
  ["brain:check", "Cérebro e Obsidian"],
  ["online:check", "Contrato online e segurança local"],
];
const failures = [];
for (const file of required) { try { await access(path.join(root, file)); } catch { failures.push(`arquivo ausente: ${file}`); } }
for (const [script, label] of checks) {
  const result = process.platform === "win32"
    ? spawnSync(process.env.ComSpec ?? "cmd.exe", ["/d", "/s", "/c", `npm run ${script}`], { cwd: root, encoding: "utf8", stdio: "pipe" })
    : spawnSync("npm", ["run", script], { cwd: root, encoding: "utf8", stdio: "pipe" });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`.trim();
  if (result.status !== 0) failures.push(`${label} falhou (${script})${output ? `: ${output.split("\n").slice(-3).join(" | ")}` : ""}`);
  else console.log(`PASS ${label}`);
}
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (!packageJson.scripts?.build) failures.push("script build ausente");
if (!packageJson.scripts?.["desktop:portable"]) failures.push("scripts.desktop:portable ausente");
if (!packageJson.scripts?.["desktop:package"]) failures.push("scripts.desktop:package ausente");
if (failures.length) { console.error("FAIL release gate:\n- " + failures.join("\n- ")); process.exitCode = 1; }
else console.log("PASS release gate: base local pronta para iniciar o ciclo de playtests; produção, pagamento e Android continuam dependentes de homologação externa.");
