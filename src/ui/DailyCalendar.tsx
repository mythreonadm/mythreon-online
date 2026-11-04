import React, { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { AssetImage } from "./AssetImage";
import { confirmedAction } from "../online/confirmation";
import { calendarProgress, CALENDAR_COUPON_PRICE, CALENDAR_WEEK_DAYS, CALENDAR_WEEK_FRAGMENTS } from "../data/dailyCalendar";

function resetCountdown(ms: number) {
  const minutes = Math.max(0, Math.ceil(ms / 60_000));
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}min`;
}

export function DailyCalendar() {
  const character = useGameStore(state => state.character);
  const [now, setNow] = useState(Date.now);
  const [notice, setNotice] = useState("");
  const [failed, setFailed] = useState(false);
  const actionLock = useRef(false);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  if (!character) return null;
  const progress = calendarProgress(character, now);
  const claimed = new Set(progress.days);
  const monthLabel = new Date(progress.today + "T00:00:00Z").toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" });
  const coins = character.mythreonCoins ?? 0, coupons = character.calendarCoupons ?? 0;
  const run = async (action: () => { success: boolean; error?: string; reward?: string }, success: string) => {
    if (actionLock.current) return;
    actionLock.current = true;
    try {
      const result = await confirmedAction(action());
      setFailed(!result.success);
      setNotice(result.success ? result.reward ? `Recompensa: ${result.reward}.` : success : result.error ?? "Ação não concluída.");
      setNow(Date.now());
    } catch {
      setFailed(true); setNotice("Não foi possível concluir. Confira a conexão e tente novamente.");
    } finally { queueMicrotask(() => { actionLock.current = false; }); }
  };
  return <section aria-label="Calendário da Essência" className="relative isolate overflow-hidden rounded-2xl border border-arcane-gold/35 bg-[#0b1117]/95 p-4 shadow-[0_0_28px_rgba(54,199,192,.08)] sm:p-6">
    <AssetImage src="/assets/ui/CALENDARIO_ESSENCIA.png" alt="" aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 -z-10 h-72 w-72 object-contain opacity-[.07]" />
    <header className="grid grid-cols-1 items-start gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0 flex-1"><p className="text-[10px] font-black uppercase tracking-[.24em] text-arcane-gold">Calendário da Essência</p><h2 className="mt-1 text-2xl font-black text-white">{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}</h2><p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300">Registre uma presença por dia com um Cupom de Resgate. Faltar reinicia a sequência semanal; suas presenças do mês ficam registradas.</p></div>
      <div className="rounded-xl border border-fuchsia-300/20 bg-fuchsia-950/20 p-3 text-right"><p className="text-xs text-slate-300">Cupons disponíveis</p><p className="text-xl font-black text-fuchsia-200">🎟️ {coupons}</p><button type="button" data-calendar-action="coupon" disabled={coins < CALENDAR_COUPON_PRICE} onClick={() => run(() => useGameStore.getState().buyCalendarCoupon(), "Cupom adquirido.")} className="mt-2 rounded-lg bg-fuchsia-700 px-3 py-2 text-xs font-bold text-white hover:bg-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40">Comprar cupom · {CALENDAR_COUPON_PRICE} Coin</button><p className="mt-1 text-[10px] text-slate-400">Saldo: {coins.toLocaleString("pt-BR")} Coins</p></div>
    </header>
    <div className="mt-5 flex flex-wrap justify-between gap-2 text-[11px] text-slate-400"><span>Dias viram às 00:00 UTC · horário do servidor</span><span>Próximo dia em {resetCountdown(progress.nextResetAt - now)}</span></div>
    <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400" aria-hidden="true">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => <span key={day}>{day}</span>)}</div>
    <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2" aria-label={`Presenças de ${monthLabel}`}>
      {Array.from({ length: progress.month.firstWeekday }, (_, i) => <span key={`empty-${i}`} aria-hidden="true" />)}
      {Array.from({ length: progress.month.days }, (_, i) => i + 1).map(day => {
        const key = `${progress.month.key}-${String(day).padStart(2, "0")}`, done = claimed.has(key), isToday = key === progress.today, missed = key < progress.today && !done;
        const label = `Dia ${day}: ${done ? "resgatado" : isToday ? "hoje" : missed ? "não resgatado" : "ainda não disponível"}`;
        return <div key={key} data-calendar-day={day} data-claimed={done} aria-label={label} aria-current={isToday ? "date" : undefined} title={label}
          className={`relative flex min-h-12 min-w-0 flex-col items-center justify-center rounded-lg border text-xs font-bold sm:min-h-16 ${done ? "border-emerald-400/50 bg-emerald-900/25 text-emerald-100" : isToday ? "border-arcane-gold bg-arcane-gold/15 text-arcane-gold shadow-[0_0_14px_rgba(217,164,65,.2)]" : "border-white/10 bg-black/25 text-slate-400"}`}>
          <span>{day}</span><span className="mt-0.5 text-[10px]">{done ? "✓" : isToday ? "HOJE" : missed ? "—" : "·"}</span>
        </div>;
      })}
    </div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/20 bg-amber-950/15 p-4">
      <div className="text-xs text-slate-300"><strong className="block text-amber-100">{progress.claimedToday ? "Presença de hoje registrada" : `Hoje: ${progress.nextGold.toLocaleString("pt-BR")} gold`}</strong><p className="mt-1 text-slate-400">1 cupom por presença · não é necessário ficar na tela do calendário.</p></div>
      <button type="button" data-calendar-action="claim" disabled={progress.claimedToday || coupons < 1} onClick={() => run(() => useGameStore.getState().claimDailyCalendar(), "Presença registrada.")} className="rounded-lg bg-arcane-gold px-5 py-3 text-xs font-black text-black hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50">{progress.claimedToday ? "✓ Resgatado hoje" : coupons < 1 ? "Adquira um cupom" : "Resgatar hoje"}</button>
    </div>
    <p role="status" className={`mt-2 min-h-5 text-xs ${failed ? "text-amber-200" : "text-emerald-300"}`}>{notice}</p>
    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
      <article className="rounded-xl border border-cyan-300/20 bg-cyan-950/10 p-4">
        <div className="flex items-center gap-3"><AssetImage src="/assets/ui/SELO_SEQUENCIA_SEMANAL.png" alt="" className="h-16 w-16 shrink-0 object-contain" /><div className="min-w-0"><h3 className="font-bold text-cyan-100">Sequência semanal</h3><p className="mt-1 text-xs text-slate-300">A cada {CALENDAR_WEEK_DAYS} dias consecutivos: {CALENDAR_WEEK_FRAGMENTS} Fragmentos Raros.</p></div></div>
        <div className="mt-4 flex justify-between gap-1" aria-label={`${progress.weekProgress} de 7 dias da sequência`}>{Array.from({ length: CALENDAR_WEEK_DAYS }, (_, i) => <span key={i} className={`grid h-8 w-8 place-items-center rounded-full border text-xs font-bold ${i < progress.weekProgress ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100" : "border-white/15 text-slate-500"}`}>{i < progress.weekProgress ? "✓" : i + 1}</span>)}</div>
        <p className="mt-3 text-[11px] text-slate-400">Sequência atual: {progress.streak} dias. Bônus nos marcos 7, 14, 21, 28… Se a mochila não comportar, tentamos entregar no depósito.</p>
      </article>
      <article className="rounded-xl border border-arcane-gold/25 bg-amber-950/10 p-4">
        <h3 className="font-bold text-amber-100">Recompensa exclusiva do mês</h3>
        {progress.month.reward ? <div className="mt-3 flex items-center gap-4"><AssetImage src={progress.month.reward.image} alt={progress.month.reward.name} className="h-32 w-24 shrink-0 object-contain" /><div className="min-w-0"><strong className="text-sm text-arcane-gold">{progress.month.reward.name}</strong><p className="mt-2 text-xs leading-relaxed text-slate-300">{progress.monthlyUnlocked ? "✓ Conquistada permanentemente. Equipe em Personagem → Personalização." : `Registre ${progress.month.requiredPresence} presenças neste mês para liberar esta skin no guarda-roupa.`}</p><p className="mt-2 text-[11px] text-slate-400">Cosmético sem atributos. Não ocupa espaço na bolsa e não é perdido ao vender itens.</p></div></div> : <p className="mt-3 text-xs text-slate-300">A skin deste mês ainda não foi anunciada. As recompensas diárias e semanais continuam disponíveis.</p>}
        <div className="mt-3 flex justify-between text-xs text-slate-300"><span>Presenças do mês</span><span>{progress.days.length}/{progress.month.requiredPresence}</span></div><progress className="mt-2 h-2 w-full accent-amber-400" aria-label="Progresso da recompensa mensal" max={progress.month.requiredPresence} value={Math.min(progress.days.length, progress.month.requiredPresence)} />
      </article>
    </div>
  </section>;
}
