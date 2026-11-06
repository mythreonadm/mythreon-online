import type { GameSnapshot } from "./projection";
import { generateId } from "../utils/id";

export interface OnlineResponse {
  current?: { revision: number; state: GameSnapshot };
  result?: any; social?: any; [key: string]: any;
}
export interface StoredCommand {
  requestId: string; operation: string; payload: any; createdAt: number; sent: boolean;
}
type Job = StoredCommand & { resolve: (result: OnlineResponse) => void; reject: (error: Error) => void; promise: Promise<OnlineResponse>; recovered?: boolean };
export interface SessionStatus { queued: number; recovering: boolean; error: string; commands: string[] }
interface Options {
  characterId: string;
  request: (operation: string, payload: any, characterId: string, requestId?: string) => Promise<OnlineResponse>;
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  project: (base: GameSnapshot, operation: string, payload: any, at: number) => GameSnapshot;
  onView: (state: GameSnapshot) => void;
  onStatus: (status: SessionStatus) => void;
  onResponse?: (result: OnlineResponse) => void;
  now?: () => number; retryMs?: number;
}
const MAX_QUEUE = 32;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** One actor's confirmed base and durable, serial command queue. No shared busy flags across accounts. */
export class OnlineSession {
  private base: GameSnapshot | null = null;
  private revision = -1;
  private jobs: Job[] = [];
  private pumping = false;
  private disposed = false;
  private recovering = false;
  private error = "";
  private activity = 0;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private now: () => number;
  readonly storageKey: string;
  constructor(private options: Options) {
    this.now = options.now ?? Date.now;
    this.storageKey = "mythreon-pending-" + options.characterId;
  }
  get isRecovering() { return this.recovering; }
  get hasWork() { return this.jobs.length > 0 || this.pumping; }
  get readToken() { return this.activity; }
  get isDisposed() { return this.disposed; }
  get view(): GameSnapshot {
    if (!this.base) throw Error("O personagem ainda está sendo carregado.");
    let next = structuredClone(this.base);
    for (const job of this.jobs) {
      // A restored in-flight request may already be included in the initial read.
      if (job.recovered && job.sent) continue;
      next = this.options.project(next, job.operation, job.payload, job.createdAt);
    }
    return next;
  }
  private emit() {
    if (this.disposed) return;
    if (this.base) this.options.onView(this.view);
    this.options.onStatus({ queued: this.jobs.length, recovering: this.recovering, error: this.error, commands: [...new Set(this.jobs.map(job => job.operation === "world.command" ? String(job.payload.action) : job.operation))] });
  }
  private acceptBase(result: OnlineResponse) {
    const current = result.current;
    if (current && Number.isSafeInteger(Number(current.revision)) && Number(current.revision) >= this.revision) {
      this.revision = Number(current.revision);
      const state = structuredClone(current.state);
      this.base = { character: state.character, races: state.races, currentZoneId: state.currentZoneId ?? state.character?.currentZoneId ?? "BOSQUE_LYSS", isTickRunning: state.isTickRunning, isTraining: state.isTraining, healingUntil: state.healingUntil, deathReport: state.deathReport, lastTickResult: state.lastTickResult };
    }
  }
  private persist(required = false) {
    if (this.disposed) return;
    try {
      if (!this.jobs.length) this.options.storage.removeItem(this.storageKey);
      else this.options.storage.setItem(this.storageKey, JSON.stringify({
        version: 2, characterId: this.options.characterId,
        jobs: this.jobs.map(({ requestId, operation, payload, createdAt, sent }) => ({ requestId, operation, payload, createdAt, sent })),
      }));
    } catch {
      if (required) throw Error("Não foi possível guardar a ação neste navegador. Libere armazenamento e tente novamente.");
      this.error = "A confirmação foi recebida, mas não foi possível atualizar o registro local.";
    }
  }
  private makeJob(record: StoredCommand): Job {
    let resolve!: Job["resolve"], reject!: Job["reject"];
    const promise = new Promise<OnlineResponse>((yes, no) => { resolve = yes; reject = no; });
    // UI may ignore a synchronous action's receipt. Keep logout/rejection from becoming unhandled.
    void promise.catch(() => {});
    return { ...record, promise, resolve, reject };
  }
  private restore() {
    try {
      const raw = this.options.storage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const records = parsed.version === 2 && parsed.characterId === this.options.characterId
        ? parsed.jobs : parsed.requestId ? [{ ...parsed, sent: true, createdAt: this.now() }] : null;
      if (!Array.isArray(records) || records.length > MAX_QUEUE) throw Error("Registro inválido");
      const ids = new Set<string>();
      this.jobs = records.map((value: any) => {
        if (!value || !UUID.test(value.requestId) || ids.has(value.requestId) ||
          typeof value.operation !== "string" || value.operation.length > 80 ||
          !value.payload || typeof value.payload !== "object" || Array.isArray(value.payload) ||
          !Number.isFinite(value.createdAt) || typeof value.sent !== "boolean") throw Error("Registro inválido");
        ids.add(value.requestId);
        return { ...this.makeJob(value), recovered: true };
      });
    } catch {
      this.jobs = [];
      this.error = "O registro local de ações não pôde ser recuperado; o estado confirmado do servidor foi carregado.";
    }
  }
  async initialize(): Promise<boolean> {
    const result = await this.options.request("world.read", {}, this.options.characterId);
    if (this.disposed) return false;
    this.acceptBase(result);
    if (!this.base) throw Error("O servidor não enviou o personagem.");
    this.restore(); this.emit(); this.options.onResponse?.(result);
    void this.pump();
    return true;
  }
  acceptRead(result: OnlineResponse, token: number): boolean {
    if (this.disposed || token !== this.activity || this.hasWork) return false;
    this.acceptBase(result); this.error = ""; this.emit(); this.options.onResponse?.(result);
    return true;
  }
  submit(operation: string, payload: any = {}, options: { deduplicate?: boolean; at?: number } = {}): Promise<OnlineResponse> {
    const reject = (error: Error) => { const promise = Promise.reject<OnlineResponse>(error); void promise.catch(() => {}); return promise; };
    if (this.disposed || !this.base) return reject(Error("Entre no personagem antes de executar a ação."));
    if (this.recovering) return reject(Error("Estamos confirmando a última ação. Você pode navegar enquanto aguarda."));
    let copy: any;
    try { copy = JSON.parse(JSON.stringify(payload)); } catch { return reject(Error("Os parâmetros da ação não podem ser registrados.")); }
    if (options.deduplicate) {
      const existing = this.jobs.find(job => job.operation === operation && JSON.stringify(job.payload) === JSON.stringify(copy));
      if (existing) return existing.promise;
    }
    if (this.jobs.length >= MAX_QUEUE) return reject(Error("Há muitas ações aguardando confirmação. Aguarde algumas concluírem."));
    const job = this.makeJob({ requestId: generateId(), operation, payload: copy, createdAt: options.at ?? this.now(), sent: false });
    this.jobs.push(job);
    try { this.persist(true); }
    catch (error) { this.jobs.pop(); job.reject(error as Error); this.error = (error as Error).message; this.emit(); return job.promise; }
    this.activity++; this.error = ""; this.emit(); void this.pump();
    return job.promise;
  }
  private async pump(retryRecovery = false) {
    if (this.pumping || this.disposed || (this.recovering && !retryRecovery)) return;
    this.pumping = true;
    try {
      while (this.jobs.length && !this.disposed && (!this.recovering || retryRecovery)) {
        retryRecovery = false;
        const job = this.jobs[0];
        job.recovered = job.recovered && job.sent;
        job.sent = true;
        let result: OnlineResponse;
        try {
          try { this.persist(true); } catch (error) { throw Object.assign(error as Error, { uncertain: true }); }
          result = await this.options.request(job.operation, job.payload, this.options.characterId, job.requestId);
        } catch (cause) {
          if (this.disposed) return;
          const error = cause instanceof Error ? cause : Error("A ação não foi concluída.");
          this.error = error.message;
          if ((cause as any)?.uncertain) {
            this.recovering = true; this.persist(); this.emit();
            this.timer = setTimeout(() => { void this.pump(true); }, this.options.retryMs ?? 3000);
          } else {
            this.jobs.shift(); this.recovering = false; this.activity++; this.persist(); this.emit(); job.reject(error);
            try {
              const fresh = await this.options.request("world.read", {}, this.options.characterId);
              if (this.disposed) return;
              this.acceptBase(fresh);
            } catch { /* The next receipt/read still reconciles against the server. */ }
            this.emit();
          }
          continue;
        }
        // Only transport failures reject a command. A subscriber exception must
        // never remove the next queued command or retry a confirmed transaction.
        if (this.disposed) return;
        this.jobs.shift(); this.recovering = false; this.activity++; this.acceptBase(result);
        this.error = result.result?.success === false ? result.result.error ?? "A ação não foi concluída." : "";
        this.persist(); job.resolve(result);
        try { this.emit(); this.options.onResponse?.(result); }
        catch { console.error("Não foi possível apresentar uma confirmação online; a transação foi preservada."); }
      }
    } finally { this.pumping = false; }
  }
  retry() {
    if (this.disposed) return;
    if (this.timer) clearTimeout(this.timer);
    void this.pump(true);
  }
  dispose() {
    if (this.disposed) return;
    this.disposed = true; this.activity++;
    if (this.timer) clearTimeout(this.timer);
    for (const job of this.jobs) job.reject(Error("Você saiu deste personagem. Ações registradas serão recuperadas ao retornar."));
    this.jobs = [];
  }
}
