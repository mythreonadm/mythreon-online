import React from "react";
import { useGameStore } from "../store/gameStore";

export function DailyCalendar() {
  const { character, buyCalendarCoupon, claimDailyCalendar } = useGameStore();
  if (!character) return null;
  const today = new Date().toISOString().slice(0, 10);
  const claimed = new Set(character.calendarClaimedDays ?? []);
  const currentMonth = today.slice(0, 7);
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const claim = () => { const result = claimDailyCalendar(); if (!result.success) window.alert(result.error); };
  return <section className="rounded-2xl border border-arcane-gold/35 bg-[#0b1117]/90 p-4 shadow-[0_0_28px_rgba(54,199,192,.08)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="text-[10px] font-black uppercase tracking-[.24em] text-arcane-gold">Calendário da Essência</div><h2 className="mt-1 text-xl font-black text-white">Recompensas diárias</h2><p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-400">Use um Cupom de Resgate para registrar o dia. A sequência reinicia se você faltar, mas o calendário nunca altera dano ou poder de combate.</p></div><div className="text-right"><div className="text-xs text-slate-500">Cupons disponíveis</div><div className="text-xl font-black text-fuchsia-200">🎟️ {character.calendarCoupons ?? 0}</div><button onClick={() => { const result=buyCalendarCoupon(); if (!result.success) window.alert(result.error); }} className="mt-2 rounded-lg bg-fuchsia-700 px-3 py-1.5 text-[10px] font-black text-white hover:bg-fuchsia-600">Comprar cupom · 1 Coin</button></div></div>
    <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-10">{days.map(day => { const key = `${currentMonth}-${String(day).padStart(2, "0")}`; const done = claimed.has(key); const isToday = key === today; return <div key={key} className={`relative grid aspect-square place-items-center rounded-lg border text-sm font-black ${done ? "border-emerald-400/60 bg-emerald-900/35 text-emerald-200" : isToday ? "border-arcane-gold bg-arcane-gold/20 text-arcane-gold shadow-[0_0_14px_rgba(217,164,65,.25)]" : "border-white/10 bg-black/25 text-slate-500"}`}><span>{done ? "✓" : day}</span>{day % 7 === 0 && <span className="absolute -bottom-1 rounded bg-purple-900 px-1 text-[8px] text-purple-200">bônus</span>}</div>; })}</div>
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/25 p-3"><div className="text-xs text-slate-300">Sequência atual: <strong className="text-arcane-gold">{character.calendarStreak ?? 0} dias</strong><span className="ml-2 text-slate-500">· 7 dias = bônus semanal · 30 dias = Capa do Primeiro Canto</span></div><button onClick={claim} className="rounded-lg bg-arcane-gold px-4 py-2 text-xs font-black text-black hover:bg-yellow-300">{claimed.has(today) ? "Resgatado hoje" : "Resgatar hoje"}</button></div>
  </section>;
}
