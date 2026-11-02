// Configurações globais do jogo.
const KEY = "mythreon_debug";
let debug = false;
try { debug = location.hostname === "localhost" && localStorage.getItem(KEY) === "1"; } catch { /* fora do navegador */ }

export function isDebug(): boolean { return debug; }
export function setDebug(v: boolean): void {
  debug = typeof location !== "undefined" && location.hostname === "localhost" && v;
  try { localStorage.setItem(KEY, v ? "1" : "0"); } catch { /* ignore */ }
}

export const TICK_MS = 3000;
export const OFFLINE_MAX_HOURS = 8;