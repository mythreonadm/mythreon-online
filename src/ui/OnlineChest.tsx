import React from "react";
import { useGameStore } from "../store/gameStore";
import { ONLINE_CHEST_MILESTONES, normalizeOnlineChest, nextOnlineChest, onlineChestDayKey } from "../data/onlineChest";

export function OnlineChest() {
  const character = useGameStore(s => s.character);
  const claim = useGameStore(s => s.claimOnlineChest);
  if (!character) return null;
  const normalized = normalizeOnlineChest({
    onlineChestDay: character.onlineChestDay,
    onlineChestClaims: character.onlineChestClaims,
    onlineChestSeconds: character.onlineChestSeconds,
  });
  const seconds = normalized.onlineChestSeconds ?? 0;
  const claimed = new Set(normalized.onlineChestClaims ?? []);
  const next = nextOnlineChest(normalized);
  const required = next?.seconds ?? ONLINE_CHEST_MILESTONES.at(-1)!.seconds;
  const percent = next ? Math.min(100, Math.round(seconds / required * 100)) : 100;
  const remaining = next ? Math.max(0, required - seconds) : 0;
  const ready = !!next && remaining === 0;
  const today = onlineChestDayKey();
  return <section className="mb-4 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-950/30 via-black/25 to-cyan-950/20 p-4 shadow-[0_0_24px_rgba(217,164,65,.08)]">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-amber-300">Recompensa por presença · {today}</p><h3 className="mt-1 text-lg font-black text-white">🧰 Baú do Refúgio</h3><p className="mt-1 text-xs text-slate-400">Cinco marcos por dia: 5 min, 30 min, 2 h, 6 h e 12 h de atividade online.</p></div><div className="text-right"><div className="text-xs text-slate-500">Baús abertos</div><strong className="text-xl text-amber-200">{character.onlineChestsOpened ?? 0}</strong></div></div>
    <div className="mt-3 grid grid-cols-5 gap-1.5" aria-label="Marcos diários do baú">{ONLINE_CHEST_MILESTONES.map(milestone => <div key={milestone.id} className={`rounded-md border p-1.5 text-center text-[9px] ${claimed.has(milestone.id) ? "border-emerald-400/50 bg-emerald-950/30 text-emerald-200" : next?.id === milestone.id && ready ? "border-amber-300 bg-amber-900/40 text-amber-100 shadow-[0_0_12px_rgba(251,191,36,.35)]" : "border-white/10 bg-black/20 text-slate-500"}`}><div>{claimed.has(milestone.id) ? "✓" : "🧰"}</div><span>{milestone.label}</span></div>)}</div>
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/50"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-300 transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs"><span className={ready ? "font-bold text-emerald-300" : "text-slate-400"}>{!next ? "Todos os marcos de hoje foram resgatados" : ready ? `Baú de ${next.label} pronto para abrir` : `Próximo: ${next.label} · faltam ${Math.ceil(remaining / 60)} min`}</span><button disabled={!ready} onClick={() => { const result = claim(); if (!result.success) window.alert(result.error); }} className="rounded-lg bg-amber-500 px-3 py-1.5 font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">Abrir baú</button></div>
  </section>;
}
