import React, { useState } from "react";
import { AssetImage } from "./AssetImage";
import { DIVINE_BEASTS, DIVINE_BEAST_ORDER } from "../data/divineBeasts";
import { useGameStore } from "../store/gameStore";
import { DivineBeastTemplate, ItemStats } from "../types";
import { ZONES } from "../data/zones";

const STAT_LABELS: Partial<Record<keyof ItemStats, string>> = {
  hp: "Vida", mp: "Mana", atk: "Ataque", matk: "Magia", arm: "Armadura", def: "Defesa",
  crit: "Crítico", hit: "Precisão", dge: "Esquiva", spd: "Vel. ataque", blk: "Bloqueio", resMagico: "Res. mágica", hpRegen: "Regen. de vida",
};
const numberFormat = new Intl.NumberFormat("pt-BR");

export function DivineBeasts() {
  const { character, equipDivineBeast, unequipDivineBeast } = useGameStore();
  const [message, setMessage] = useState("");
  if (!character) return null;
  const owned = character.divineBeasts ?? [];
  const activeId = character.activeDivineBeastId;

  const handleEquip = (id: keyof typeof DIVINE_BEASTS) => {
    const result = equipDivineBeast(id);
    setMessage(result.success ? `${DIVINE_BEASTS[id].name} agora ressoa com você. A Matriz foi guardada, mas continua na sua coleção.` : result.error ?? "Não foi possível ativar o vínculo.");
  };

  return <div className="space-y-5">
    <header className="relative overflow-hidden rounded-2xl border border-arcane-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(89,71,133,.25),transparent_45%),linear-gradient(125deg,#171923,#0b1014_70%,#14131b)] p-5 sm:p-7">
      <div className="absolute -right-4 -top-10 text-[150px] opacity-[.06]">🐾</div>
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 text-[10px] font-black uppercase tracking-[.28em] text-arcane-gold">Bestiário do Arquivo · Ecos do Primeiro Canto</div><h1 className="text-2xl font-black text-white sm:text-3xl">Divine Beasts</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">Não são mascotes domesticados nem deuses. São memórias vivas da Essência, despertadas nos guardiões das regiões de Mythreon.</p></div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-right"><div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vínculos descobertos</div><div className="font-mono text-lg font-bold text-arcane-gold">{owned.length}<span className="text-slate-600"> / {DIVINE_BEAST_ORDER.length}</span></div></div>
      </div>
    </header>

    <section className="rounded-xl border border-purple-900/40 bg-purple-950/15 p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="text-2xl">📜</span><div><h2 className="text-sm font-black uppercase tracking-wider text-purple-200">O vínculo não se captura</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">O Bestiário reúne doze ecos: cinco ligados às regiões e sete às Consciências Primordiais. Cada chefe regional pode revelar um dos ecos associados à sua Essência; há 12% de chance por vitória, e a criatura descoberta é única.</p><p className="mt-2 text-[10px] text-slate-500">Matriz e Divine Beast compartilham o espaço de Ressonância. Ativar uma guarda a outra, sem removê-la da coleção.</p></div></div>
    </section>

    {message && <div role="status" className="rounded-lg border border-arcane-gold/20 bg-arcane-gold/5 px-4 py-2 text-xs text-arcane-gold">{message}</div>}

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {DIVINE_BEAST_ORDER.map(id => {
        const beast = DIVINE_BEASTS[id];
        const hasBeast = owned.some(instance => instance.id === id);
        const isActive = activeId === id;
        return <BeastCard key={id} beast={beast} owned={hasBeast} active={isActive} onEquip={() => handleEquip(id)} onUnequip={unequipDivineBeast} />;
      })}
    </div>

    <footer className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-slate-500">
      <span className="font-bold text-slate-300">Sobre os bônus:</span> cada guardião concede uma pequena especialidade enquanto ocupa o espaço de Ressonância. Os valores são iniciais e podem ser ajustados depois de observarmos as métricas de hunt.
    </footer>
  </div>;
}

function BeastCard({ beast, owned, active, onEquip, onUnequip }: { beast: DivineBeastTemplate; owned: boolean; active: boolean; onEquip: () => void; onUnequip: () => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const stats = Object.entries(beast.bonus) as [keyof ItemStats, number][];
  const sourceBoss = Object.values(ZONES).flatMap(zone => zone.enemies).find(enemy => enemy.id === beast.bossId);
  return <article className={`overflow-hidden rounded-xl border bg-[#0c1115] transition ${active ? "border-arcane-gold/70 shadow-[0_0_22px_rgba(201,160,77,.12)]" : owned ? "border-emerald-700/30" : "border-white/10 opacity-[.82]"}`}>
    <div className="flex min-h-36 items-center gap-4 border-b border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(201,160,77,.10),transparent_65%)] px-4 py-3">
      <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {owned && !imageFailed ? <AssetImage src={beast.sprite} alt={beast.name} className="h-full w-full object-contain [image-rendering:pixelated]" onError={() => setImageFailed(true)} /> : <span className={`text-6xl ${owned ? "" : "grayscale opacity-40"}`}>{beast.emoji}</span>}
      </div>
      <div className="min-w-0"><div className={`text-[9px] font-black uppercase tracking-[.2em] ${owned ? "text-emerald-400" : "text-slate-600"}`}>{owned ? active ? "Vínculo ativo" : "Vínculo formado" : "Eco não descoberto"}</div><h2 className={`mt-1 truncate text-lg font-black ${beast.rarity === "LENDARIO" ? "text-arcane-gold" : owned ? "text-white" : "text-slate-500"}`}>{owned ? beast.name : "???"}</h2><div className="truncate text-[10px] text-slate-500">{owned ? beast.title : "Guardião desconhecido"}</div><div className="mt-2 text-[10px] text-slate-500">{beast.region} · {beast.rarity}</div></div>
    </div>
    <div className="space-y-3 p-4">
      <p className="min-h-[54px] text-xs leading-relaxed text-slate-400">{owned ? beast.lore : `A Essência detecta um eco em ${beast.region}. O vínculo pode surgir ao derrotar o guardião local.`}</p>
      {owned ? <><div className="rounded-lg border border-white/5 bg-black/20 p-2"><div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-arcane-gold">Ressonância</div><div className="flex flex-wrap gap-1.5">{stats.map(([stat, value]) => <span key={stat} className="rounded border border-emerald-900/40 bg-emerald-950/20 px-2 py-1 text-[10px] font-bold text-emerald-300">+{stat === "crit" || stat === "hit" || stat === "dge" || stat === "resMagico" || stat === "spd" ? `${(value * 100).toFixed(0)}%` : numberFormat.format(value)} {STAT_LABELS[stat] ?? stat}</span>)}</div></div><p className="text-[10px] italic leading-relaxed text-slate-500">{beast.bond}</p></> : <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-[10px] text-slate-500">Vínculo possível ao derrotar {sourceBoss?.name ?? "o chefe regional"}. Chance de 12% por vitória; o chefe revela um dos ecos ainda não descobertos.</div>}
      {owned && <button onClick={active ? onUnequip : onEquip} className={`w-full rounded-lg border px-3 py-2 text-xs font-black transition ${active ? "border-rose-900/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50" : "border-arcane-gold/40 bg-arcane-gold/10 text-arcane-gold hover:bg-arcane-gold/20"}`}>{active ? "Encerrar vínculo" : "Ativar no espaço de Ressonância"}</button>}
    </div>
  </article>;
}
