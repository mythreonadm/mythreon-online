import { confirmedAction } from "../online/confirmation";
import { beastGrowth, getBeastCombat } from "../data/beastCombat";
import React, { useEffect, useState } from "react";
import { AssetImage } from "./AssetImage";
import { divineBeastSellValue, DIVINE_BEASTS, DIVINE_BEAST_ORDER } from "../data/divineBeasts";
import { useGameStore } from "../store/gameStore";
import { DivineBeastInstance, DivineBeastTemplate, ItemStats, Rarity } from "../types";
import { ZONES } from "../data/zones";
import { DIVINE_BEAST_EGG_TEMPLATES } from "../data/items";

const STAT_LABELS: Partial<Record<keyof ItemStats, string>> = {
  hp: "Vida", mp: "Mana", atk: "Ataque", matk: "Magia", arm: "Armadura", def: "Defesa",
  crit: "Crítico", hit: "Precisão", dge: "Esquiva", spd: "Vel. ataque", blk: "Bloqueio", resMagico: "Res. mágica", hpRegen: "Regen. de vida",
};
const numberFormat = new Intl.NumberFormat("pt-BR");
const RARITY_ORDER: Rarity[] = ["COMUM", "INCOMUM", "RARO", "EPICO", "LENDARIO"];
const rarityRank = (rarity?: Rarity) => RARITY_ORDER.indexOf(rarity ?? "COMUM");
function bestPetIndex(instances: DivineBeastInstance[]) {
  return instances.reduce((best, instance, index) => {
    if (!instances[best]) return index;
    const score = rarityRank(instance.rarity) - rarityRank(instances[best].rarity);
    return score > 0 || (score === 0 && instance.obtainedAt > instances[best].obtainedAt) ? index : best;
  }, 0);
}

export function DivineBeasts() {
  const { character, equipDivineBeast, unequipDivineBeast, hatchEgg, combineBeast, sellDivineBeast, feedDivineBeast } = useGameStore();
  const [message, setMessage] = useState("");
  const [petTab, setPetTab] = useState<"descobertos" | "cativeiro">("descobertos");
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  if (!character) return null;
  const owned = character.divineBeasts ?? [];
  const activeId = character.activeDivineBeastId;
  const eggs = character.inventory.items.filter(item => !!DIVINE_BEAST_EGG_TEMPLATES[item.templateId]);
  // A coleção mede linhagens descobertas. Cópias e raridades diferentes ficam
  // no cativeiro, mas não podem fazer o contador ultrapassar o catálogo.
  const discoveredCount = new Set(owned.map(instance => instance.id)).size;
  const petIds = Array.from(new Set([...DIVINE_BEAST_ORDER, ...owned.map(instance => instance.id)]));

  const handleEquip = (id: keyof typeof DIVINE_BEASTS) => {
    const result = equipDivineBeast(id);
    setMessage(result.success ? `${DIVINE_BEASTS[id].name} agora acompanha sua jornada ao lado da Matriz.` : result.error ?? "Não foi possível ativar o pet.");
  };

  return <div className="space-y-5">
    <header className="relative overflow-hidden rounded-2xl border border-arcane-gold/30 bg-[radial-gradient(ellipse_at_top_right,rgba(89,71,133,.25),transparent_45%),linear-gradient(125deg,#171923,#0b1014_70%,#14131b)] p-5 sm:p-7">
      <div className="absolute -right-4 -top-10 text-[150px] opacity-[.06]">🐾</div>
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 text-[10px] font-black uppercase tracking-[.28em] text-arcane-gold">Arquivo de Mythreon · Ovos e Companheiros</div><h1 className="text-2xl font-black text-white sm:text-3xl">Pets de Mythreon</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">As Bestas Divinas agora vivem como pets: companheiros despertados em ovos, treinados com cuidado e capazes de lutar ao lado do herói.</p></div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-right"><div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Linhagens descobertas</div><div className="font-mono text-lg font-bold text-arcane-gold">{discoveredCount}<span className="text-slate-600"> / {DIVINE_BEAST_ORDER.length}</span></div><div className="text-[10px] text-slate-500">{owned.length} exemplar(es) no total</div></div>
      </div>
    </header>

    <section className="rounded-xl border border-purple-900/40 bg-purple-950/15 p-4 sm:p-5">
      <div className="flex items-start gap-3"><span className="text-2xl">📜</span><div><h2 className="text-sm font-black uppercase tracking-wider text-purple-200">Como os pets despertam</h2><p className="mt-1 text-xs leading-relaxed text-slate-400">O Arquivo reúne doze linhagens de pets: cinco ligadas às regiões e sete às Consciências Primordiais. Ovos podem cair de criaturas especiais e chefes; o tier do ovo define a chance de cada raridade.</p><p className="mt-2 text-[10px] text-slate-500">A Matriz e o pet atuam juntos. O pet acompanha o herói, desfere seu próprio ataque e mantém seus bônus enquanto estiver ativo.</p></div></div>
    </section>

    {message && <div role="status" className="rounded-lg border border-arcane-gold/20 bg-arcane-gold/5 px-4 py-2 text-xs text-arcane-gold">{message}</div>}

    <section className="rounded-xl border border-arcane-gold/30 bg-arcane-gold/5 p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-sm font-black uppercase tracking-wider text-arcane-gold">🥚 Incubadora de Pets</h2><p className="mt-1 text-xs text-slate-400">Escolha um ovo, aguarde a incubação e descubra qual Besta Divina se tornará seu novo pet.</p></div><div className="text-[10px] text-slate-500">Ovo T1: Comum 95% · Incomum 4% · Raro 1%</div></div>
      {character.divineBeastIncubator && (() => { const incubator = character.divineBeastIncubator; const remainingMs = Math.max(0, incubator.completesAt - now); const totalMs = Math.max(1, incubator.completesAt - incubator.startedAt); const progress = Math.max(0, Math.min(100, ((totalMs - remainingMs) / totalMs) * 100)); const ready = remainingMs === 0; const incubatedEgg = character.inventory.items.find(item => item.uid === incubator.eggUid); const openEgg = async () => { const result = await confirmedAction(hatchEgg(incubator.eggUid)); if (result.success) setMessage(`Eclosão concluída: ${result.beastId ? DIVINE_BEASTS[result.beastId].name : "novo vínculo"} · ${result.rarity}`); else if (result.error) setMessage(result.error); }; return <div className={`mt-3 rounded-lg border p-3 text-xs ${ready ? "border-emerald-300/60 bg-emerald-950/35 text-emerald-100 shadow-[0_0_22px_rgba(52,211,153,.18)]" : "border-cyan-400/30 bg-cyan-950/20 text-cyan-100"}`}><div className="flex flex-wrap items-center justify-between gap-2"><strong>{ready ? "✨ Ovo pronto para eclodir" : `⏳ Ovo em incubação · Tier ${incubator.tier}`}</strong><span className="font-mono font-bold">{ready ? "Agora" : `${Math.ceil(remainingMs / 1000)}s restantes`}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50"><div className={`h-full rounded-full transition-[width] duration-500 ${ready ? "bg-emerald-300" : "bg-cyan-300"}`} style={{ width: `${progress}%` }} /></div>{ready ? <button type="button" onClick={() => void openEgg()} className="mt-3 w-full animate-pulse rounded-xl border border-amber-200 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 px-4 py-3 text-sm font-black uppercase tracking-[.16em] text-amber-950 shadow-[0_0_24px_rgba(250,204,21,.55)] transition hover:scale-[1.01] hover:shadow-[0_0_34px_rgba(250,204,21,.75)]">🥚 Abrir o Ovo</button> : null}<p className="mt-1 text-[10px] text-cyan-200/70">O tempo é salvo no servidor/local e continua avançando mesmo fora da tela.{ready && incubatedEgg ? ` · ${incubatedEgg.name}` : ""}</p></div>; })()}
      {eggs.length === 0 ? <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-xs text-slate-500">{character.divineBeastIncubator ? "O ovo em incubação está reservado no cartão acima." : "Nenhum ovo disponível. Ovos poderão surgir em encontros especiais e recompensas de regiões."}</p> : <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{eggs.map(egg => { const incubator=character.divineBeastIncubator; const same=incubator?.eggUid===egg.uid; const remaining=same?Math.max(0,Math.ceil((incubator!.completesAt-now)/1000)):0; return <div key={egg.uid} className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/25 p-3"><span className="text-3xl">{egg.icon}</span><div className="min-w-0 flex-1"><div className="truncate text-xs font-bold text-white">{egg.name}</div><div className="text-[10px] text-slate-500">Tier {egg.tier} · quantidade {egg.quantity}</div></div><button disabled={!!incubator && !same || remaining>0} onClick={async()=>{const result=await confirmedAction(hatchEgg(egg.uid));if(result.success)setMessage(result.started ? `Incubação iniciada para ${egg.name}.` : `Eclosão concluída: ${result.beastId ? DIVINE_BEASTS[result.beastId].name : "novo vínculo"} · ${result.rarity}`);else if(result.error)setMessage(result.error);}} className="rounded-lg bg-arcane-gold px-3 py-2 text-[10px] font-black text-black disabled:cursor-not-allowed disabled:opacity-40 hover:bg-yellow-300">{same ? remaining>0 ? `⏳ ${remaining}s` : "Eclodir agora" : incubator ? "Incubadora ocupada" : "Incubar"}</button></div>; })}</div>}
    </section>

    <section className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div><p className="text-[10px] font-black uppercase tracking-[.2em] text-slate-500">Coleção de companheiros</p><p className="mt-1 text-xs text-slate-400">A descrição mostra apenas o melhor exemplar de cada linhagem. As cópias excedentes ficam no cativeiro para aprimorar ou vender.</p></div>
        <div className="flex rounded-lg border border-white/10 bg-black/25 p-1 text-[10px] font-black">
          <button type="button" onClick={() => setPetTab("descobertos")} className={`rounded px-3 py-2 transition ${petTab === "descobertos" ? "bg-arcane-gold text-black" : "text-slate-400 hover:text-white"}`}>Pets descobertos</button>
          <button type="button" onClick={() => setPetTab("cativeiro")} className={`rounded px-3 py-2 transition ${petTab === "cativeiro" ? "bg-purple-500 text-white" : "text-slate-400 hover:text-white"}`}>Pets em cativeiro</button>
        </div>
      </div>
    </section>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {petIds.map(id => {
        const beast = DIVINE_BEASTS[id];
        if (!beast) return null;
        const ownedInstances = owned.filter(instance => instance.id === id);
        const bestIndex = bestPetIndex(ownedInstances);
        const ownedInstance = ownedInstances[bestIndex];
        const captiveInstances = ownedInstances.filter((_, index) => index !== bestIndex);
        if (petTab === "cativeiro" && captiveInstances.length === 0) return null;
        const hasBeast = ownedInstances.length > 0;
        const copies = ownedInstances.length;
        const isActive = activeId === id;
        return <BeastCard key={id} beast={beast} owned={hasBeast} copies={copies} captiveInstances={captiveInstances} captiveCount={captiveInstances.length} captiveRarities={captiveInstances.map(instance => instance.rarity).filter(Boolean) as Rarity[]} rarity={ownedInstance?.rarity} active={isActive} captiveView={petTab === "cativeiro"} onEquip={() => handleEquip(id)} onUnequip={unequipDivineBeast} onFeed={(foodUid) => { const result=feedDivineBeast(id, foodUid); setMessage(result.success ? "O pet foi alimentado e recuperou o humor." : result.error ?? "Não foi possível alimentar."); }} onCombine={async () => { const result=await confirmedAction(combineBeast(id)); setMessage(result.success ? `Linhagem aprimorada para ${result.rarity}.` : result.error ?? "Não foi possível aprimorar."); }} onSell={async (instanceId) => { const result=await confirmedAction(sellDivineBeast(id, instanceId)); setMessage(result.success ? `Pet vendido por ${result.gold?.toLocaleString("pt-BR")} gold.` : result.error ?? "Não foi possível vender."); }} />;
      })}
    </div>

    {petTab === "cativeiro" && !petIds.some(id => owned.filter(instance => instance.id === id).length > 1) && <div className="rounded-xl border border-purple-900/40 bg-purple-950/15 p-6 text-center text-xs text-slate-400">Nenhum pet excedente no cativeiro. Ecloda novos ovos para encontrar cópias e desbloquear aprimoramentos.</div>}

    <footer className="rounded-xl border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-slate-500">
      <span className="font-bold text-slate-300">Sobre os bônus:</span> cada pet desfere um ataque elemental a cada 5 segundos, concede bônus de combate que crescem com o nível e possui uma especialidade própria. Nutrição e humor modulam o poder do ataque; os valores serão calibrados pelas métricas de hunt.
    </footer>
  </div>;
}

function BeastCard({ beast, owned, copies, captiveInstances, captiveCount, captiveRarities, rarity, active, captiveView, onEquip, onUnequip, onFeed, onCombine, onSell }: { beast: DivineBeastTemplate; owned: boolean; copies: number; captiveInstances: DivineBeastInstance[]; captiveCount: number; captiveRarities: Rarity[]; rarity?: string; active: boolean; captiveView: boolean; onEquip: () => void; onUnequip: () => void; onFeed: (foodUid: string) => void; onCombine: () => void; onSell: (instanceId?: string) => void }) {
  const [imageFailed, setImageFailed] = useState(false);
  const character = useGameStore(state => state.character);
  const growth = beastGrowth(character?.level ?? 1);
  const bonus = { ...growth };
  for (const [key, value] of Object.entries(beast.bonus)) (bonus as any)[key] = ((bonus as any)[key] ?? 0) + value;
  const bond = character ? getBeastCombat({...character, activeRace: undefined, activeDivineBeastId: beast.id}) : null;
  const needs = character?.divineBeastNeeds?.[beast.id];
  const food = character?.inventory.items.find(item => ["CENOURA_PET", "FRUTA_MEL", "MELANCIA_LUNAR", "RACAO_DOMADOR", "CALDO_MARCA_DAGUA"].includes(item.templateId));
  const stats = Object.entries(bonus) as [keyof ItemStats, number][];
  const sourceBoss = Object.values(ZONES).flatMap(zone => zone.enemies).find(enemy => enemy.id === beast.bossId);
  const needsPanel = active ? <div className="mt-2 rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-2 text-[10px] text-slate-300"><div className="flex justify-between"><span>Nutrição {Math.round(needs?.nutrition ?? 100)}%</span><span>Humor {Math.round(needs?.mood ?? 80)}%</span></div>{food && <button onClick={() => onFeed(food.uid)} className="mt-2 w-full rounded border border-emerald-400/30 px-2 py-1 text-emerald-200">🍖 Alimentar com {food.name}</button>}</div> : null;
  return <article className={`overflow-hidden rounded-xl border bg-[#0c1115] transition ${active ? "border-arcane-gold/70 shadow-[0_0_22px_rgba(201,160,77,.12)]" : owned ? "border-emerald-700/30" : "border-white/10 opacity-[.82]"}`}>
    <div className="flex min-h-36 items-center gap-4 border-b border-white/5 bg-[radial-gradient(ellipse_at_center,rgba(201,160,77,.10),transparent_65%)] px-4 py-3">
      <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-black/30">
        {owned && !imageFailed ? <AssetImage src={beast.sprite} alt={beast.name} className="h-full w-full object-contain [image-rendering:pixelated]" onError={() => setImageFailed(true)} /> : <span className={`text-6xl ${owned ? "" : "grayscale opacity-40"}`}>{beast.emoji}</span>}
      </div>
      <div className="min-w-0"><div className={`text-[9px] font-black uppercase tracking-[.2em] ${owned ? "text-emerald-400" : "text-slate-600"}`}>{owned ? active ? "Pet ativo · melhor exemplar" : captiveView ? "No cativeiro" : "Melhor exemplar" : "Pet ainda não descoberto"}</div><h2 className={`mt-1 truncate text-lg font-black ${beast.rarity === "LENDARIO" ? "text-arcane-gold" : owned ? "text-white" : "text-slate-500"}`}>{owned ? beast.name : "???"}</h2><div className="truncate text-[10px] text-slate-500">{owned ? beast.title : "Guardião desconhecido"}</div><div className="mt-2 text-[10px] text-slate-500">{beast.region} · {rarity ?? beast.rarity}{rarity && rarity !== beast.rarity ? ` · exemplar ${rarity}` : ""}</div>{owned && captiveCount > 0 && <div className="mt-1 flex flex-wrap gap-1"><span className="rounded border border-purple-500/30 px-1.5 py-0.5 text-[9px] text-purple-200">{captiveCount} no cativeiro</span>{captiveRarities.map((entry, index) => <span key={`${entry}-${index}`} className="rounded border border-purple-500/30 px-1.5 py-0.5 text-[9px] text-purple-200">{entry}</span>)}</div>}{needsPanel}</div>
    </div>
    <div className="space-y-3 p-4">
      <p className="min-h-[54px] text-xs leading-relaxed text-slate-400">{owned ? beast.lore : `A Essência detecta um eco em ${beast.region}. O vínculo pode surgir ao derrotar o guardião local.`}</p>
      {owned ? <><p className="text-xs text-cyan-200">{bond?.name} · {bond?.element} · a cada 5 segundos · {bond?.mana} MP. Bônus abaixo calculados para seu nível atual.</p><div className="rounded-lg border border-white/5 bg-black/20 p-2"><div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-arcane-gold">Bônus do pet</div><div className="flex flex-wrap gap-1.5">{stats.map(([stat, value]) => <span key={stat} className="rounded border border-emerald-900/40 bg-emerald-950/20 px-2 py-1 text-[10px] font-bold text-emerald-300">+{stat === "crit" || stat === "hit" || stat === "dge" || stat === "resMagico" || stat === "spd" ? `${(value * 100).toFixed(0)}%` : numberFormat.format(value)} {STAT_LABELS[stat] ?? stat}</span>)}</div></div><p className="text-[10px] italic leading-relaxed text-slate-500">{beast.bond}</p></> : <div className="rounded-lg border border-white/5 bg-black/20 p-2 text-[10px] text-slate-500">Pet possível ao derrotar {sourceBoss?.name ?? "o chefe regional"}. Chance de 12% por vitória; o chefe revela um dos pets ainda não descobertos.</div>}
      {owned && <div className="grid gap-2">{!captiveView && <button onClick={active ? onUnequip : onEquip} className={`w-full rounded-lg border px-3 py-2 text-xs font-black transition ${active ? "border-rose-900/50 bg-rose-950/40 text-rose-300 hover:bg-rose-900/50" : "border-arcane-gold/40 bg-arcane-gold/10 text-arcane-gold hover:bg-arcane-gold/20"}`}>{active ? "Desativar pet" : "Ativar pet"}</button>}{captiveView && <><div className="rounded-lg border border-purple-500/20 bg-purple-950/10 p-2"><div className="mb-2 text-[10px] font-black uppercase tracking-wider text-purple-200">Exemplares selecionáveis</div><div className="space-y-1">{captiveInstances.map((instance, index) => <div key={instance.instanceId ?? `${instance.id}-${instance.obtainedAt}-${index}`} className="flex items-center gap-2 rounded border border-white/10 bg-black/20 px-2 py-1"><span className="flex-1 text-[10px] text-slate-300">{instance.rarity ?? "COMUM"} · {new Date(instance.obtainedAt).toLocaleDateString("pt-BR")}</span><button type="button" onClick={() => onSell(instance.instanceId)} className="rounded border border-rose-400/30 px-2 py-1 text-[9px] font-bold text-rose-200 hover:bg-rose-900/40">Vender · {divineBeastSellValue(instance.rarity)}</button></div>)}</div></div>{captiveCount >= 4 && <button onClick={onCombine} className="w-full rounded-lg border border-purple-400/50 bg-purple-950/30 px-3 py-2 text-xs font-black text-purple-200 hover:bg-purple-900/40">♢ Transformar 4 excedentes + ração</button>}</>}</div>}
    </div>
  </article>;
}
