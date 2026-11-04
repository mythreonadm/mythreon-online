import React from "react";
import { useGameStore } from "../store/gameStore";

export function OnlineChest() {
  const character = useGameStore(s => s.character);
  const claim = useGameStore(s => s.claimOnlineChest);
  if (!character) return null;
  const required = 300;
  const seconds = Math.max(0, character.onlineChestSeconds ?? 0);
  const percent = Math.min(100, Math.round(seconds / required * 100));
  const remaining = Math.max(0, required - seconds);
  const ready = remaining === 0;
  return <section className="mb-4 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-950/30 via-black/25 to-cyan-950/20 p-4 shadow-[0_0_24px_rgba(217,164,65,.08)]"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-amber-300">Recompensa por presença</p><h3 className="mt-1 text-lg font-black text-white">🧰 Baú do Refúgio</h3><p className="mt-1 text-xs text-slate-400">A cada 5 minutos de atividade online, abra um baú com Gold e Mythreon Shards.</p></div><div className="text-right"><div className="text-xs text-slate-500">Baús abertos</div><strong className="text-xl text-amber-200">{character.onlineChestsOpened ?? 0}</strong></div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-black/50"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-cyan-300 transition-all" style={{ width: `${percent}%` }} /></div><div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs"><span className={ready ? "font-bold text-emerald-300" : "text-slate-400"}>{ready ? "Baú pronto para abrir" : `Faltam ${Math.ceil(remaining / 60)} min`}</span><button disabled={!ready} onClick={() => { const result = claim(); if (!result.success) window.alert(result.error); }} className="rounded-lg bg-amber-500 px-3 py-1.5 font-black text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">Abrir baú</button></div></section>;
}
