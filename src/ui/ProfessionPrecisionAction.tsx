import React, { useEffect, useRef, useState } from "react";
import type { Precision } from "../types";
import type { PreparedProfessionChallenge } from "../engine/professionChallenge";
import type { ProfessionActivity } from "./ProfessionScene";
import { useOnlineState } from "../online/controller";
import { GOOD_PULSE_RADIUS, PERFECT_PULSE_RADIUS, PROFESSION_PULSE_MS, professionPrecisionAt } from "../engine/professionPrecision";

type Challenge = { target: number; startedAt: number; id?: string };
type ActionResult = { success: boolean; error?: string; quantity?: number; precision?: Precision; bonusQuantity?: number; baitConsumed?: string };

export function ProfessionPrecisionAction({ label, run, prepare, cancelRemote, onActivity, blockedReason, cooldownUntil = 0 }: {
  label: string; run: (precision: Precision, challengeId?: string) => ActionResult | Promise<ActionResult>; cooldownUntil?: number;
  prepare?: () => Promise<PreparedProfessionChallenge>; cancelRemote?: (id: string) => void;
  onActivity?: (activity: ProfessionActivity) => void; blockedReason?: string;
}) {
  const active = useRef<Challenge | null>(null);
  const processingRef = useRef(false), preparingRef = useRef(false), generation = useRef(0);
  const cancelRef = useRef(cancelRemote);cancelRef.current = cancelRemote;
  const activityRef = useRef(onActivity);activityRef.current = onActivity;
  const [processing, setProcessing] = useState(false), [preparing, setPreparing] = useState(false);
  const gatheringPending = useOnlineState(state => (state.commands ?? []).some(command => ["mineResource", "fishSpot", "beginProfessionChallenge", "finishProfessionChallenge", "cancelProfessionChallenge"].includes(command)));
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState(0), [lead, setLead] = useState(0);
  const [message, setMessage] = useState(""), [success, setSuccess] = useState(true);
  const [now, setNow] = useState(Date.now);
  const remaining = Math.max(0, cooldownUntil - now);
  useEffect(() => {
    setNow(Date.now());
    if (cooldownUntil <= Date.now()) return;
    const timer = window.setInterval(() => setNow(Date.now()), 200);
    return () => window.clearInterval(timer);
  }, [cooldownUntil]);
  useEffect(() => {
    if (!challenge) return;
    let frame = 0;
    const tick = () => {
      if (active.current !== challenge) return;
      const elapsed = performance.now() - challenge.startedAt;
      setLead(Math.max(0, -elapsed));setProgress(Math.max(0, Math.min(1, elapsed / PROFESSION_PULSE_MS)));
      if (elapsed >= PROFESSION_PULSE_MS) {
        active.current = null;setChallenge(null);
        if (challenge.id) cancelRef.current?.(challenge.id);
        setSuccess(false);setMessage("O pulso passou. Tente novamente; nenhum recurso foi consumido.");
        activityRef.current?.({ phase: "idle" });
      } else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [challenge]);
  useEffect(() => () => {
    generation.current++;
    const id = active.current?.id;active.current = null;preparingRef.current = false;
    if (id) cancelRef.current?.(id);
  }, []);

  const start = async () => {
    if (blockedReason || processingRef.current || preparingRef.current || gatheringPending || active.current || Date.now() < cooldownUntil) return;
    const version = ++generation.current, requestedAt = performance.now();
    preparingRef.current = true;setPreparing(true);setMessage("");
    activityRef.current?.({ phase: "preparing" });
    try {
      const prepared = prepare ? await prepare() : undefined;
      if (version !== generation.current) {
        if (prepared?.challenge?.id) cancelRef.current?.(prepared.challenge.id);
        return;
      }
      if (prepared && (!prepared.success || !prepared.challenge || !Number.isFinite(prepared.serverNow))) {
        setSuccess(false);setMessage(prepared.error ?? "Não foi possível preparar a coleta.");return;
      }
      const remote = prepared?.challenge, receivedAt = performance.now();
      // Estimate one-way latency only to align presentation. Grading is server-side.
      const delay = remote ? remote.startsAt - (prepared!.serverNow! + (receivedAt - requestedAt) / 2) : 0;
      if (remote && delay <= 0) {
        cancelRef.current?.(remote.id);setSuccess(false);setMessage("A preparação demorou demais. Inicie novamente quando a conexão estabilizar.");return;
      }
      const next = { target: remote?.target ?? 0.4 + Math.random() * 0.35, startedAt: remote ? receivedAt + delay : requestedAt, id: remote?.id };
      active.current = next;setChallenge(next);setProgress(0);setLead(Math.max(0, delay));
      activityRef.current?.({ phase: "holding" });
    } catch {
      if (version === generation.current) { setSuccess(false);setMessage("Não foi possível preparar. Confira a conexão."); }
    } finally {
      if (version === generation.current) { preparingRef.current = false;setPreparing(false);if (!active.current) activityRef.current?.({ phase: "idle" }); }
    }
  };
  const cancel = () => {
    generation.current++;preparingRef.current = false;setPreparing(false);
    const id = active.current?.id;active.current = null;setChallenge(null);
    if (id) cancelRef.current?.(id);
    setMessage("Ação cancelada; nenhum recurso consumido.");
    activityRef.current?.({ phase: "idle" });
  };
  const finish = async () => {
    if (preparingRef.current) { cancel();return; }
    const current = active.current;if (!current) return;
    if (performance.now() < current.startedAt) { cancel();return; }
    active.current = null;setChallenge(null);
    const precision = professionPrecisionAt(performance.now() - current.startedAt, current.target);
    processingRef.current = true;setProcessing(true);setMessage("Confirmando a coleta…");
    activityRef.current?.({ phase: "confirming" });
    try {
      const result = await run(precision, current.id), grade = result.precision ?? precision;
      setSuccess(result.success);
      activityRef.current?.({ phase: result.success ? "success" : "idle", quantity: result.quantity, precision: grade, bonusQuantity: result.bonusQuantity });
      setMessage(result.success ? `${grade === 1.5 ? "Perfeito · +2 de skill" : grade === 1 ? "Bom · +1 de skill" : "Fora do pulso · +1 de skill"} · ${result.quantity ?? 1} unidade(s).${result.bonusQuantity ? ` +${result.bonusQuantity} pela isca.` : ""}` : result.error ?? "Ação não concluída.");
    } catch {
      setSuccess(false);setMessage("Não foi possível concluir. Confira a conexão e tente novamente.");
      activityRef.current?.({ phase: "idle" });
    } finally { processingRef.current = false;setProcessing(false); }
  };
  return <div className="mt-2">
    <button type="button" disabled={processing || (!!blockedReason && !preparing && !challenge) || (gatheringPending && !preparing && !challenge) || remaining > 0} aria-pressed={!!challenge || preparing} aria-busy={preparing || processing}
      className="online-button w-full select-none touch-none disabled:cursor-wait disabled:opacity-50"
      onPointerDown={event => { if (event.button !== 0) return;event.currentTarget.setPointerCapture(event.pointerId);void start(); }}
      onPointerUp={() => { void finish(); }} onPointerCancel={cancel} onLostPointerCapture={() => { if (active.current || preparingRef.current) cancel(); }}
      onKeyDown={event => {
        if (event.key === "Escape") { cancel();return; }
        if (event.key !== " " && event.key !== "Enter") return;
        event.preventDefault();if (!event.repeat) void start();
      }}
      onKeyUp={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault();void finish(); } }}
      onBlur={() => { if (active.current || preparingRef.current) cancel(); }} onContextMenu={event => event.preventDefault()}>
      {preparing ? "Preparando… mantenha pressionado" : processing || (gatheringPending && !challenge) ? "Confirmando coleta…" : remaining > 0 ? `⏱ Aguarde ${Math.ceil(remaining / 1000)}s` : challenge ? lead > 0 ? `Começa em ${(lead / 1000).toFixed(1)}s · segure` : "Solte no dourado!" : blockedReason ?? `Segure: ${label}`}
    </button>
    {challenge ? <div className="mt-2">
      <div role="img" aria-label="Pulso de precisão: solte quando o marcador branco atingir a faixa dourada" className="relative h-6 overflow-hidden rounded-lg border border-slate-500 bg-slate-900">
        <span className="absolute inset-y-0 bg-slate-400/50" style={{ left: `${(challenge.target - GOOD_PULSE_RADIUS) * 100}%`, width: `${GOOD_PULSE_RADIUS * 200}%` }} />
        <span className="absolute inset-y-0 bg-amber-400" style={{ left: `${(challenge.target - PERFECT_PULSE_RADIUS) * 100}%`, width: `${PERFECT_PULSE_RADIUS * 200}%` }} />
        <span className="absolute inset-y-0 w-1 bg-white shadow-[0_0_6px_white]" style={{ left: `calc(${progress * 100}% - 2px)` }} />
      </div>
      <p className="mt-1 text-[11px] text-slate-300">Dourado: perfeito · prata: bom. Mouse/toque ou segure Espaço/Enter; Esc cancela.</p>
    </div> : <p className="mt-1 text-[11px] text-slate-400">Segure e solte na faixa dourada. No teclado: Espaço ou Enter.</p>}
    <p role="status" className={`mt-1 min-h-4 text-[11px] ${success ? "text-emerald-300" : "text-amber-200"}`}>{message}</p>
  </div>;
}
