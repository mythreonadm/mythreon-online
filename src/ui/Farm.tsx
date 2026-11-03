import React, { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { FARM_SEEDS, farmSeed } from "../data/farm";

const format = (ms?: number) => { if (!ms) return ""; const left = Math.max(0, ms - Date.now()); if (!left) return "Pronta para colher"; const minutes = Math.ceil(left / 60000); return `Crescendo · ${minutes} min`; };

export function Farm() {
  const { character, plantFarmSeed, harvestFarmPlot, unlockFarmPlot } = useGameStore();
  const [seed, setSeed] = useState(FARM_SEEDS[0].id);
  const [, refresh] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => refresh(value => value + 1), 30_000); return () => window.clearInterval(timer); }, []);
  if (!character) return null;
  const farm = character.farm ?? { plots: [], unlockedPlots: 0, lastActionAt: 0 };
  const plots = useMemo(() => (farm.plots.length ? farm.plots : Array.from({ length: 4 }, (_, index) => ({ id: `plot-${index + 1}` }))) as any[], [farm.plots]);
  const selected = farmSeed(seed)!;
  return <section className="space-y-5 rounded-xl border border-emerald-700/40 bg-arcane-panel p-5 shadow-lg">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="online-eyebrow">Uma nova vocação de Mythreon</p><h1 className="text-3xl font-bold text-emerald-200">🌱 Fazenda de Lyss</h1><p className="mt-1 text-sm text-gray-400">Plante alimentos para seus Pets e materiais para poções.</p></div><button className="online-button" onClick={() => { const result = unlockFarmPlot(); if (!result.success) alert(result.error); }}>＋ Comprar terreno</button></header>
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-emerald-700/40 bg-black/20 p-3"><label className="text-sm text-gray-300">Semente:</label><select className="online-input max-w-xs" value={seed} onChange={event => setSeed(event.target.value)}>{FARM_SEEDS.map(item => <option key={item.id} value={item.id}>{item.icon} {item.name} · {item.cost} gold · {Math.round(item.growMs / 60000)} min</option>)}</select><span className="text-xs text-gray-400">Colheita: {selected.yieldIcon} {selected.yieldName} ×{selected.yieldQty}</span></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{plots.map((plot, index) => { const locked = index >= farm.unlockedPlots; const item = plot.seedId ? farmSeed(plot.seedId) : undefined; const ready = !!plot.readyAt && Date.now() >= plot.readyAt; return <article key={plot.id} className={`min-h-40 rounded-xl border p-4 ${locked ? "border-gray-700 bg-black/20 opacity-60" : ready ? "border-emerald-400 bg-emerald-950/30" : "border-white/10 bg-black/20"}`}><div className="flex items-center justify-between"><strong className="text-emerald-100">Canteiro {index + 1}</strong><span className="text-3xl">{locked ? "🔒" : item?.icon ?? "🟫"}</span></div>{locked ? <p className="mt-3 text-xs text-gray-500">Compre este terreno para expandir sua produção.</p> : item ? <><p className="mt-3 font-bold text-white">{item.name}</p><p className="text-xs text-gray-400">{ready ? "Pronta para colher" : format(plot.readyAt)}</p><button disabled={!ready} onClick={() => { const result = harvestFarmPlot(plot.id); if (!result.success) alert(result.error); }} className="mt-3 w-full rounded bg-emerald-700 px-3 py-2 text-xs font-bold text-white disabled:bg-gray-800 disabled:text-gray-500">🌾 Colher</button></> : <button onClick={() => { const result = plantFarmSeed(plot.id, seed); if (!result.success) alert(result.error); }} className="mt-5 w-full rounded bg-emerald-700 px-3 py-2 text-xs font-bold text-white">🌱 Plantar por {selected.cost} gold</button>}</article>; })}</div>
    <p className="text-xs text-gray-500">Free: {Math.min(farm.unlockedPlots, 4)} canteiros. Terrenos adicionais custam gold e podem ser expandidos gradualmente.</p>
  </section>;
}
