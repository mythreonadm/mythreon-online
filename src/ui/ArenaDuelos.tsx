import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { CARD_TEMPLATES, TRAITS } from "../data/cards";
import { ArenaSize, makeOpponentDeck, simulateArenaDuel, ArenaBattleResult } from "../engine/cardArena";
import { CardInstance } from "../types";

const MODES: { size: ArenaSize; title: string; subtitle: string; reward: string }[] = [
  { size: 1, title: "Duelo", subtitle: "1 contra 1", reward: "30 gold" },
  { size: 3, title: "Escaramuça", subtitle: "3 contra 3", reward: "70 gold + Fragmento Comum" },
  { size: 5, title: "Confronto", subtitle: "5 contra 5", reward: "130 gold + Fragmento Raro" },
];
const GOLD = new Intl.NumberFormat("pt-BR");

export function ArenaDuelos() {
  const { character, currentZoneId, claimArenaReward } = useGameStore();
  const [size, setSize] = useState<ArenaSize>(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [battle, setBattle] = useState<ArenaBattleResult | null>(null);
  const [shownLogs, setShownLogs] = useState(0);
  const [rewardMessage, setRewardMessage] = useState("");
  if (!character) return null;
  const today = new Date().toISOString().slice(0, 10);
  const rewardsUsed = character.arenaRewardDay === today ? (character.arenaRewardsToday ?? 0) : 0;
  const cards = character.cards ?? [];
  const picked = cards.filter(card => selected.includes(card.uid));
  const mode = MODES.find(item => item.size === size)!;
  const available = cards.filter(card => !!CARD_TEMPLATES[card.templateId]);

  const toggleCard = (card: CardInstance) => {
    setBattle(null); setRewardMessage("");
    setSelected(current => current.includes(card.uid)
      ? current.filter(uid => uid !== card.uid)
      : current.length < size ? [...current, card.uid] : [...current.slice(1), card.uid]);
  };
  const chooseMode = (next: ArenaSize) => { setSize(next); setSelected([]); setBattle(null); setShownLogs(0); setRewardMessage(""); };
  const startBattle = () => {
    if (picked.length !== size) return;
    const averageLevel = picked.reduce((total, card) => total + card.level, 0) / size;
    const region = CARD_TEMPLATES[picked[0].templateId]?.region ?? currentZoneId;
    const result = simulateArenaDuel(picked, makeOpponentDeck(region, size, averageLevel));
    setBattle(result); setShownLogs(result.logs.length);
    if (result.winner === "player" && rewardsUsed < 3) {
      const reward = claimArenaReward(size);
      setRewardMessage(reward.success
        ? `Recompensa recebida: ${GOLD.format(reward.gold ?? 0)} gold${reward.fragment ? ` e ${reward.fragment === "FRAGMENTO_RARO" ? "1 Fragmento Raro" : "1 Fragmento Comum"}` : ""}. ${reward.remaining} vitória(s) recompensada(s) restante(s) hoje.`
        : reward.error ?? "Vitória registrada.");
    } else if (result.winner === "player") setRewardMessage("Vitória sem recompensa adicional: limite diário de 3 vitórias recompensadas atingido.");
    else setRewardMessage("Apenas vitórias concedem recompensa. Você pode reorganizar a equipe e tentar novamente.");
  };

  const visibleLogs = battle?.logs.slice(0, shownLogs) ?? [];
  return <section className="overflow-hidden rounded-2xl border border-arcane-gold/30 bg-[#090d11] shadow-[0_20px_60px_rgba(0,0,0,.4)]">
    <div className="relative border-b border-arcane-gold/20 bg-[radial-gradient(ellipse_at_top,rgba(174,123,42,.16),transparent_65%),linear-gradient(120deg,#171a20,#0b1014_65%,#11151c)] p-5 sm:p-7">
      <div className="absolute right-6 top-5 text-6xl opacity-[.08]">⚔</div>
      <div className="relative flex flex-wrap items-end justify-between gap-4">
        <div><div className="mb-2 text-[10px] font-black uppercase tracking-[.28em] text-arcane-gold">Campo de Provas · PvE</div>
          <h2 className="text-2xl font-black tracking-wide text-white sm:text-3xl">Arena de Duelos</h2>
          <p className="mt-1 max-w-xl text-sm text-slate-400">Monte sua equipe de cartas e enfrente uma formação da região. A caça automática continua em segundo plano.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/25 px-4 py-2 text-right">
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vitórias premiadas hoje</div>
          <div className="mt-0.5 font-mono text-lg font-bold text-arcane-gold">{rewardsUsed}<span className="text-slate-600"> / 3</span></div>
        </div>
      </div>
    </div>

    <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(item => <button key={item.size} onClick={() => chooseMode(item.size)} className={`rounded-xl border p-3 text-left transition ${size === item.size ? "border-arcane-gold/70 bg-arcane-gold/10 shadow-[inset_0_0_20px_rgba(201,160,77,.07)]" : "border-white/10 bg-white/[.025] hover:border-white/20"}`}>
            <div className={`text-sm font-black ${size === item.size ? "text-arcane-gold" : "text-slate-300"}`}>{item.title}</div><div className="mt-0.5 text-[11px] text-slate-500">{item.subtitle}</div><div className="mt-2 text-[10px] font-semibold text-emerald-400">{item.reward}</div>
          </button>)}
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><h3 className="text-sm font-bold text-white">Sua formação</h3><p className="text-xs text-slate-500">Escolha {size} carta{size > 1 ? "s" : ""} · {picked.length}/{size} selecionada{picked.length === 1 ? "" : "s"}</p></div><span className="text-[10px] uppercase tracking-wider text-slate-600">Região da equipe</span></div>
          {available.length === 0 ? <div className="rounded-lg border border-dashed border-white/10 px-4 py-8 text-center"><div className="text-3xl">🎴</div><p className="mt-2 text-sm font-semibold text-slate-300">Sua coleção ainda está vazia</p><p className="mt-1 text-xs text-slate-500">Cartas podem ser encontradas durante a caça. Volte quando capturar sua primeira.</p></div> :
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">{available.map(card => {
              const template = CARD_TEMPLATES[card.templateId]; const trait = TRAITS[template.trait]; const active = selected.includes(card.uid);
              return <button key={card.uid} onClick={() => toggleCard(card)} className={`relative rounded-lg border p-3 text-left transition hover:-translate-y-0.5 ${active ? "border-arcane-gold bg-arcane-gold/[.12] ring-1 ring-arcane-gold/30" : "border-white/10 bg-[#11171c] hover:border-white/25"}`}>
                {active && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-arcane-gold text-[10px] font-black text-black">{selected.indexOf(card.uid) + 1}</span>}
                <div className="text-3xl">{template.emoji}</div><div className="mt-2 truncate text-xs font-bold text-slate-100">{template.name}</div><div className={`mt-1 truncate text-[10px] font-semibold ${trait.color}`}>{trait.icon} {trait.name} · Nv {card.level}</div>
                <div className="mt-2 flex gap-2 text-[9px] font-mono text-slate-500"><span>HP {Math.floor(template.baseStats.hp * (1 + (card.level - 1) * .2))}</span><span>ATK {Math.floor(template.baseStats.atk * (1 + (card.level - 1) * .2))}</span></div>
              </button>;
            })}</div>}
        </div>

        <button disabled={picked.length !== size} onClick={startBattle} className="w-full rounded-xl border border-arcane-gold/50 bg-gradient-to-r from-[#8f6525] via-[#c99a43] to-[#8f6525] px-4 py-3 text-sm font-black uppercase tracking-[.14em] text-[#17120a] shadow-lg transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-none disabled:bg-white/5 disabled:text-slate-600 disabled:shadow-none">⚔ Iniciar {mode.title}</button>

        {battle && <div className="rounded-xl border border-white/10 bg-[#0c1115] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3"><div><div className="text-[10px] font-black uppercase tracking-[.22em] text-slate-500">Relatório de combate · {battle.rounds} rodadas</div><div className={`mt-1 text-xl font-black ${battle.winner === "player" ? "text-emerald-400" : battle.winner === "draw" ? "text-arcane-gold" : "text-rose-400"}`}>{battle.winner === "player" ? "Vitória na Arena" : battle.winner === "draw" ? "Duelo empatado" : "Derrota na Arena"}</div></div><div className="font-mono text-xs text-slate-400">Aliados restantes <b className="text-white">{battle.playerRemaining}</b> · Rivais <b className="text-white">{battle.opponentRemaining}</b></div></div>
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">{visibleLogs.map((entry, index) => <div key={index} className={`rounded-md px-2.5 py-1.5 text-xs ${entry.kind === "result" ? "bg-arcane-gold/[.08] font-semibold text-arcane-gold" : entry.kind === "special" ? "bg-purple-400/[.06] text-purple-200" : entry.kind === "attack" ? "text-slate-300" : "text-slate-500"}`}><span className="mr-2 font-mono text-[10px] text-slate-600">R{entry.turn}</span>{entry.text}</div>)}</div>
          {rewardMessage && <div className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[.06] px-3 py-2 text-xs text-emerald-300">{rewardMessage}</div>}
        </div>}
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-arcane-purple/30 bg-gradient-to-br from-purple-950/25 to-transparent p-4"><div className="text-[10px] font-black uppercase tracking-[.2em] text-purple-300">Recompensas da Arena</div><div className="mt-3 space-y-2 text-xs text-slate-300"><div className="flex justify-between"><span>Duelo 1x1</span><b className="text-emerald-300">30 × tier gold</b></div><div className="flex justify-between"><span>Escaramuça 3x3</span><b className="text-emerald-300">70 × tier gold</b></div><div className="flex justify-between"><span>Confronto 5x5</span><b className="text-emerald-300">130 × tier gold</b></div><div className="border-t border-white/10 pt-2 text-slate-500">Equipes 3x3 e 5x5 também podem receber fragmentos. Até 3 vitórias premiadas por dia; no máximo 1 Fragmento Raro.</div></div></div>
        <div className="rounded-xl border border-white/10 bg-white/[.02] p-4"><div className="text-[10px] font-black uppercase tracking-[.2em] text-arcane-gold">Regras do campo</div><ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400"><li>• Sem custo para entrar e sem risco para seus itens.</li><li>• A equipe rival vem da mesma região das suas cartas.</li><li>• Traços de combate afetam a batalha; habilidades especiais ativam a cada 3 rodadas.</li><li>• Empates e derrotas não consomem suas recompensas diárias.</li><li>• A batalha é independente da caça automática e do progresso do personagem.</li></ul></div>
      </aside>
    </div>
  </section>;
}
