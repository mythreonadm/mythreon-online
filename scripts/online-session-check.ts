import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { OnlineSession, type OnlineResponse } from "../src/online/session";
import { projectGameCommand, type GameSnapshot } from "../src/online/projection";
import { freshWorld, executeGame } from "../server/game";
import { ALL_ITEM_TEMPLATES, createItem } from "../src/data/items";

const turn = () => new Promise(resolve => setTimeout(resolve, 0));
const storageData = new Map<string, string>();
const storage = { getItem: (key: string) => storageData.get(key) ?? null, setItem: (key: string, value: string) => { storageData.set(key, value); }, removeItem: (key: string) => { storageData.delete(key); } };
function fixture() {
  const world = freshWorld("Fila", randomUUID());world.character.tutorialCompleted = true;world.character.introSeen = true;
  world.character.gold = 10000;world.character.mythreonCoins = 1000;
  world.character.inventory.items = ["CAPACETE", "BOTAS"].map(slot => createItem({ ...Object.values(ALL_ITEM_TEMPLATES).find(item => item.slot === slot)!, uid: slot }));
  world.character.farm = { unlockedPlots: 3, lastActionAt: 0, skills: { planting: 0, harvesting: 0 }, plots: [{ id: "plot-1" }, { id: "plot-2" }, { id: "plot-3" }] };
  return world;
}
function harness(existing = fixture(), memory = storage) {
  let world = structuredClone(existing), revision = 1;
  const receipts = new Map<string, OnlineResponse>();
  const calls: { operation: string; payload: any; id?: string; resolve: (result: OnlineResponse) => void; reject: (error: Error) => void }[] = [];
  const views: GameSnapshot[] = [], statuses: any[] = [];
  const snapshot = () => ({ current: { revision, state: structuredClone(world) as unknown as GameSnapshot } });
  const request = (operation: string, payload: any, _character: string, id?: string): Promise<OnlineResponse> => {
    if (operation === "world.read") return Promise.resolve(snapshot());
    return new Promise((resolve, reject) => calls.push({ operation, payload, id, resolve, reject }));
  };
  const options = { characterId: existing.character.id, request, storage: memory, project: projectGameCommand, onView: (state: GameSnapshot) => views.push(structuredClone(state)), onStatus: (state: any) => statuses.push({ ...state }), retryMs: 60_000 };
  const session = new OnlineSession(options);
  const commit = (index: number) => {
    const call = calls[index];
    const previous = receipts.get(call.id!);if (previous) return previous;
    const executed = executeGame(world, call.payload.action, call.payload.args);
    world = executed.world;revision++;
    const result = { ...snapshot(), result: executed.result };receipts.set(call.id!, result);return result;
  };
  const finish = async (index: number) => { calls[index].resolve(commit(index));await turn(); };
  return { session, options, calls, views, statuses, finish, commit, snapshot, get world() { return world; }, get revision() { return revision; }, externalGold: (gold: number) => { world.character.gold += gold;revision++; } };
}

const h = harness();await h.session.initialize();
const beforeReadToken = h.session.readToken;
const helmet = h.session.submit("world.command", { action: "equip", args: ["CAPACETE"] });
const boots = h.session.submit("world.command", { action: "equip", args: ["BOTAS"] });
assert(h.session.view.character!.equipped.CAPACETE && h.session.view.character!.equipped.BOTAS);
const afterTwo = h.views.length;
assert.equal(h.session.acceptRead(h.snapshot(), beforeReadToken), false, "Leitura iniciada antes da fila é ignorada");
await h.finish(0);
assert(h.views.slice(afterTwo).every(view => view.character!.equipped.BOTAS), "Confirmar capacete não pode apagar botas pendentes");
await h.finish(1);await Promise.all([helmet, boots]);
assert.equal(h.session.view.character!.inventory.items.length, 2, "Ferramentas iniciais são migradas pelo servidor; equipamentos não duplicam");
const plant1 = h.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
const plant2 = h.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-2", "SEMENTE_TRIGO"] });
const plantedAt = h.session.view.character!.farm!.plots[1].plantedAt;
const beforeConfirm = h.views.length;await h.finish(2);
assert(h.views.slice(beforeConfirm).every(view => view.character!.farm!.plots[1].seedId === "SEMENTE_TRIGO"));
assert.equal(h.session.view.character!.farm!.plots[1].plantedAt, plantedAt, "Replay não reinicia relógio do plantio");
await h.finish(3);await Promise.all([plant1, plant2]);
assert.equal(h.session.view.character!.gold, 9810);
h.session.dispose();

const failed = harness();await failed.session.initialize();
const denied = failed.session.submit("world.command", { action: "equip", args: ["CAPACETE"] });
const independent = failed.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
failed.calls[0].reject(Error("Item indisponível"));await assert.rejects(denied, /Item indisponível/);await turn();
assert.equal(failed.session.view.character!.equipped.CAPACETE, undefined);
assert.equal(failed.session.view.character!.farm!.plots[0].seedId, "SEMENTE_CENOURA", "Rejeitar uma ação preserva a independente");
await failed.finish(1);await independent;failed.session.dispose();

const uncertain = harness();await uncertain.session.initialize();
const one = uncertain.session.submit("world.command", { action: "buyCalendarCoupon", args: [] });
const two = uncertain.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
uncertain.commit(0);uncertain.calls[0].reject(Object.assign(Error("Resposta perdida"), { uncertain: true }));await turn();
assert(uncertain.session.isRecovering);
await assert.rejects(uncertain.session.submit("world.command", { action: "buyCalendarCoupon", args: [] }), /confirmando/);
const saved = JSON.parse(storageData.get(uncertain.session.storageKey)!);assert.equal(saved.jobs.length, 2);assert.equal(saved.jobs[0].sent, true);assert.equal(saved.jobs[1].sent, false);
uncertain.session.retry();await turn();
assert(uncertain.session.isRecovering, "Retry não libera novas mutações antes da confirmação");
assert.equal(uncertain.calls[0].id, uncertain.calls[1].id);
await uncertain.finish(1);await uncertain.finish(2);await Promise.all([one, two]);
assert.equal(uncertain.world.character.calendarCoupons, 1);
assert.equal(uncertain.world.character.mythreonCoins, 999);
assert.equal(uncertain.world.character.gold, 9970);
uncertain.session.dispose();

const crashed = harness();await crashed.session.initialize();
const old1 = crashed.session.submit("world.command", { action: "buyCalendarCoupon", args: [] });
const old2 = crashed.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
const oldReceipt = crashed.commit(0);crashed.externalGold(123);crashed.session.dispose();
await assert.rejects(old1, /saiu/);await assert.rejects(old2, /saiu/);
const resumed = new OnlineSession(crashed.options);await resumed.initialize();
assert.equal(resumed.view.character!.calendarCoupons, 1, "Estado lido já contém cupom; não projetar novamente um envio recuperado");
assert.equal(resumed.view.character!.gold, 10093, "Base nova + plantio pendente");
const journalBeforeOldReply = storageData.get(resumed.storageKey);
crashed.calls[0].resolve(oldReceipt);await turn();
assert.equal(storageData.get(resumed.storageKey), journalBeforeOldReply, "Resposta antiga não apaga o diário da nova sessão");
await crashed.finish(1);await crashed.finish(2);
assert.equal(resumed.view.character!.gold, 10093, "Recibo antigo não apaga revisão mais nova");
assert.equal(resumed.view.character!.calendarCoupons, 1);
assert.equal(storageData.has(resumed.storageKey), false);resumed.dispose();

const random = harness();await random.session.initialize();
const buy = random.session.submit("world.command", { action: "buyMythreonOffer", args: ["PET_LUMINESCENCE"] });
assert(!random.session.view.character!.unlockedCosmetics?.includes("LUMINESCENCIA_PET"), "Não desbloquear o cosmético na prévia");
await random.finish(0);await buy;
assert(random.world.character.unlockedCosmetics?.includes("LUMINESCENCIA_PET"));
assert.equal(random.session.view.character!.cosmeticLoadout?.petAuraTemplateId, "LUMINESCENCIA_PET");
assert(!random.session.view.character!.inventory.items.some(item => item.templateId === "LUMINESCENCIA_PET"));
random.session.dispose();

const deniedStorage = harness(fixture(), { ...storage, setItem: () => { throw Error("quota"); } });
await deniedStorage.session.initialize();
await assert.rejects(deniedStorage.session.submit("world.command", { action: "buyCalendarCoupon", args: [] }), /armazenamento/);
assert.equal(deniedStorage.calls.length, 0, "Sem registro, não enviar compra irrecuperável");
assert.equal(deniedStorage.session.view.character!.calendarCoupons, 0);deniedStorage.session.dispose();
const actorA = harness();await actorA.session.initialize();
const late = actorA.session.submit("world.command", { action: "buyCalendarCoupon", args: [] });
const lateReceipt = actorA.commit(0);const viewsBeforeExit = actorA.views.length;
actorA.session.dispose();await assert.rejects(late, /saiu/);
const actorB = harness();await actorB.session.initialize();
const bAction = actorB.session.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
actorA.calls[0].resolve(lateReceipt);await turn();
assert.equal(actorA.views.length, viewsBeforeExit, "Callback do personagem anterior não publica após logout");
await actorB.finish(0);await bAction;assert.equal(actorB.world.character.calendarCoupons, 0);actorB.session.dispose();

const legacy = harness();const legacyId = randomUUID();
storageData.set(legacy.session.storageKey, JSON.stringify({ operation: "world.command", payload: { action: "buyCalendarCoupon", args: [] }, requestId: legacyId }));
await legacy.session.initialize();assert.equal(legacy.calls[0].id, legacyId);
await legacy.finish(0);assert.equal(legacy.session.view.character!.calendarCoupons, 1);legacy.session.dispose();

let storageWrites = 0, writable = false;
const transientStorage = { ...storage, setItem: (key: string, value: string) => { storageWrites++;if (storageWrites > 1 && !writable) throw Error("quota");storage.setItem(key, value); } };
const transient = harness(fixture(), transientStorage);await transient.session.initialize();
const held = transient.session.submit("world.command", { action: "buyCalendarCoupon", args: [] });await turn();
assert(transient.session.isRecovering);assert.equal(transient.calls.length, 0, "Falha antes de registrar envio não dispara transporte");
writable = true;transient.session.retry();await turn();await transient.finish(0);await held;
assert.equal(transient.world.character.calendarCoupons, 1);transient.session.dispose();

const corrupt = harness();storageData.set(corrupt.session.storageKey, "{invalido");
await corrupt.session.initialize();assert.equal(corrupt.calls.length, 0);assert(corrupt.statuses.at(-1).error.includes("recuperado"));corrupt.session.dispose();
const observer = harness();let failObserver = false, subscriberErrors = 0;
const observingSession = new OnlineSession({ ...observer.options, onResponse: () => { if (failObserver) throw Error("subscriber"); } });
await observingSession.initialize();failObserver = true;
const originalConsoleError = console.error;console.error = () => { subscriberErrors++; };
try {
  const first = observingSession.submit("world.command", { action: "buyCalendarCoupon", args: [] });
  const next = observingSession.submit("world.command", { action: "plantFarmSeed", args: ["plot-1", "SEMENTE_CENOURA"] });
  await observer.finish(0);await first;
  assert.equal(observer.calls.length, 2, "Falha de apresentação não rejeita recibo nem remove o próximo comando");
  await observer.finish(1);await next;
  assert.equal(observingSession.view.character!.calendarCoupons, 1);
  assert.equal(observingSession.view.character!.farm!.plots[0].seedId, "SEMENTE_CENOURA");
  assert.equal(subscriberErrors, 2);assert.equal(storageData.has(observingSession.storageKey), false);
} finally { console.error = originalConsoleError;observingSession.dispose();observer.session.dispose(); }
console.log("Sessão online: fila/latência sem regressão visual, plantio estável, leitura antiga, rejeição, recuperação idempotente, reconexão, isolamento entre personagens, diário legado/corrompido, armazenamento e IDs autoritativos aprovados.");
