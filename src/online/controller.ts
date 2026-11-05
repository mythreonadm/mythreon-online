import { create } from "zustand";
import { useGameStore, type GameState } from "../store/gameStore";
import { supabase, worldRequest } from "./client";
import { OnlineSession } from "./session";
import { previewGameAction, projectGameCommand } from "./projection";

export const useOnlineState = create<{
  active: boolean; pending: boolean; syncing: number; commands: string[]; error: string; social: any; tradeId: string | null; refresh: () => Promise<void>;
}>()(() => ({ active: false, pending: false, syncing: 0, commands: [], error: "", social: null, tradeId: null, refresh: refreshSocial }));
let current: OnlineSession | null = null;
let original: Partial<GameState> = {};
let poll: ReturnType<typeof setInterval> | undefined, socialPoll: ReturnType<typeof setInterval> | undefined, fullSync: ReturnType<typeof setInterval> | undefined;
let channel: any = null, polling: OnlineSession | null = null, socialRunning: OnlineSession | null = null;
let characterId = "";
const NO_ARGUMENTS = new Set(["stopHunting", "stopTraining", "finishIntro", "clearOfflineReport", "clearDeathReport", "startHealing", "cancelHealing", "unequipRace", "unequipDivineBeast", "activateBuff", "buyTrainingBoost", "buyBless", "refreshCompendium"]);
const DEDUPLICATE = new Set(["hatchEgg", "harvestFarmPlot", "claimDailyCalendar", "recoverCalendarDay", "recoverCalendarWeek", "claimOnlineChest", "claimQuest", "recycleCards"]);
// These commands are intentionally server-only: their nonce and timing live
// in WorldState and they are not methods of the local Zustand store.
const SERVER_ONLY = new Set(["beginProfessionChallenge", "finishProfessionChallenge", "cancelProfessionChallenge", "recycleCards"]);

export async function refreshSocial() {
  const session = current, id = characterId;
  if (!session || session.isDisposed || socialRunning === session) return;
  socialRunning = session;
  try {
    const result = await worldRequest("social.read", {}, id);
    if (current === session && result.social) useOnlineState.setState({ social: result.social });
  } catch (error) {
    if (current === session) useOnlineState.setState({ error: error instanceof Error ? error.message : "Comunidade indisponível." });
  } finally { if (socialRunning === session) socialRunning = null; }
}
async function refreshWorld(session: OnlineSession, id: string) {
  if (current !== session || session.hasWork || polling === session) return;
  polling = session;
  const token = session.readToken;
  try {
    const result = await worldRequest("world.read", {}, id);
    if (current === session) session.acceptRead(result, token);
  } catch (error) {
    if (current === session) useOnlineState.setState({ error: error instanceof Error ? error.message : "Conexão perdida." });
  } finally { if (polling === session) polling = null; }
}
export function retryOnlineConnection() {
  const session = current;
  if (!session) return;
  session.retry();
  void refreshWorld(session, characterId); void refreshSocial();
}
export function onlineAction(operation: string, payload: any = {}): Promise<any> {
  if (!current) return Promise.reject(Error("Entre no personagem para executar esta ação."));
  return current.submit(operation, payload);
}
export async function connectCharacter(id: string) {
  disconnectCharacter();
  characterId = id;
  const session = new OnlineSession({
    characterId: id, request: worldRequest, project: projectGameCommand,
    storage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value), removeItem: key => localStorage.removeItem(key) },
    onView: state => { if (current === session) useGameStore.setState({ ...state, offlineReport: null }); },
    onStatus: status => { if (current === session) useOnlineState.setState({ pending: status.recovering, syncing: status.queued, commands: status.commands, error: status.error }); },
    onResponse: result => { if (current === session && result.social) useOnlineState.setState({ social: result.social }); },
  });
  current = session;
  try { if (!await session.initialize() || current !== session) return; }
  catch (error) {
    if (current === session) { session.dispose(); current = null; useOnlineState.setState({ active: false, pending: false, syncing: 0, error: error instanceof Error ? error.message : "Não foi possível carregar o personagem." }); }
    throw error;
  }
  const local = useGameStore.getState(), overrides: Record<string, any> = {};
  original = {};
  for (const [name, value] of Object.entries(local)) {
    if (typeof value !== "function") continue;
    (original as any)[name] = value;
    if (["tick", "save", "loadFromSave", "newGame"].includes(name)) { overrides[name] = () => name === "loadFromSave" ? false : undefined; continue; }
    if (name === "healFull") { overrides[name] = () => { if (current === session) void refreshWorld(session, id); }; continue; }
    overrides[name] = (...args: any[]) => {
      if (current !== session || session.isDisposed) return { success: false, error: "Este personagem foi desconectado." };
      if (session.isRecovering) return { success: false, error: "A última ação ainda está sendo confirmada. Você pode navegar enquanto aguarda." };
      // React events are circular; they are never command arguments.
      const safeArgs = NO_ARGUMENTS.has(name) || (args.length === 1 && args[0] && typeof args[0] === "object" && ("nativeEvent" in args[0] || "currentTarget" in args[0])) ? [] : args;
      let copied: unknown[];
      try { copied = JSON.parse(JSON.stringify(safeArgs)); }
      catch { return { success: false, error: "Os parâmetros desta ação são inválidos." }; }
      const at = Date.now();
      const preview = SERVER_ONLY.has(name) ? { result: undefined as any } : previewGameAction(session.view, name, copied, at);
      if (preview.result === false || preview.result?.success === false) return preview.result;
      const receipt = session.submit("world.command", { action: name, args: copied }, { at, deduplicate: DEDUPLICATE.has(name) });
      if (SERVER_ONLY.has(name)) return receipt;
      if (preview.result && typeof preview.result === "object") {
        const confirmation = receipt.then(result => result.result ?? preview.result);
        void confirmation.catch(() => {});
        return { ...preview.result, confirmation };
      }
      return preview.result;
    };
  }
  useGameStore.setState(overrides);
  useOnlineState.setState({ active: true, refresh: refreshSocial });
  poll = setInterval(() => { void refreshWorld(session, id); }, 3000);
  fullSync = setInterval(() => { void refreshWorld(session, id); }, 60 * 60 * 1000);
  channel = supabase().channel("mythreon-world-" + id);
  for (const table of ["world_messages", "world_friends", "world_mail", "world_trades", "world_trade_transactions", "world_market_listings"]) channel.on("postgres_changes", { event: "*", schema: "public", table }, () => { if (current === session) void refreshSocial(); });
  channel.subscribe();
  socialPoll = setInterval(() => { if (current === session) void refreshSocial(); }, 5000);
  await refreshSocial();
}
export function disconnectCharacter() {
  const previous = current;
  current = null; previous?.dispose();
  if (poll) clearInterval(poll); if (socialPoll) clearInterval(socialPoll); if (fullSync) clearInterval(fullSync);
  if (channel) { void supabase().removeChannel(channel); channel = null; }
  if (Object.keys(original).length) useGameStore.setState(original);
  original = {}; characterId = ""; polling = null; socialRunning = null;
  useOnlineState.setState({ active: false, pending: false, syncing: 0, commands: [], error: "", social: null, tradeId: null });
}
