import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { QUESTS } from "../data/quests";
import { checkQuestCompletion } from "../engine/questEngine";

export function QuestTracker({ onSelect }: { onSelect: (questId: string) => void }) {
  const character = useGameStore(state => state.character);
  const [minimized, setMinimized] = useState(() => localStorage.getItem("mythreon_quest_tracker_minimized") === "true");
  const [showCompleted, setShowCompleted] = useState(false);
  if (!character) return null;

  const active = Object.keys(character.quests?.active ?? {}).map(id => QUESTS.find(quest => quest.id === id)).filter(Boolean);
  const completed = (character.quests?.completed ?? []).map(id => QUESTS.find(quest => quest.id === id)).filter(Boolean);
  const toggle = () => setMinimized(current => { localStorage.setItem("mythreon_quest_tracker_minimized", String(!current)); return !current; });
  const readyCount = active.filter(quest => quest && checkQuestCompletion(character, quest.id)).length;

  return <aside className="fixed bottom-24 left-3 z-40 w-[min(330px,calc(100vw-24px))]">
    {minimized ? <button onClick={toggle} className="flex items-center gap-2 rounded-full border border-arcane-gold/50 bg-arcane-panel/95 px-4 py-3 text-sm font-bold text-arcane-gold shadow-2xl backdrop-blur"><span>📜</span> Missões <span className="rounded-full bg-arcane-gold px-2 text-black">{readyCount ? `! ${readyCount}` : active.length}</span></button> :
      <section className="overflow-hidden rounded-xl border border-arcane-gold/35 bg-[#0b1014]/95 shadow-2xl backdrop-blur">
        <header className="flex items-center justify-between border-b border-white/10 px-3 py-2"><div><strong className="text-sm text-arcane-gold">📜 Missões</strong><span className="ml-2 text-[10px] text-gray-500">{active.length} ativas</span></div><button onClick={toggle} title="Minimizar missões" className="rounded px-2 text-gray-400 hover:bg-white/10 hover:text-white">−</button></header>
        <div className="max-h-[48vh] space-y-1 overflow-y-auto p-2">
          {active.map(quest => {
            if (!quest) return null;
            const ready = checkQuestCompletion(character, quest.id);
            const progress = character.quests.active[quest.id]?.progress ?? [];
            const current = quest.objectives.reduce((sum, objective, index) => sum + Math.min(objective.count, progress[index] ?? 0), 0);
            const total = quest.objectives.reduce((sum, objective) => sum + objective.count, 0);
            return <button key={quest.id} onClick={() => onSelect(quest.id)} className={`block w-full rounded-lg border p-2 text-left transition-colors ${ready ? "border-emerald-500/50 bg-emerald-950/25 hover:bg-emerald-950/50" : "border-white/5 bg-white/[.025] hover:border-arcane-gold/40"}`}>
              <span className="flex items-center justify-between gap-2"><strong className="truncate text-xs text-white">{quest.name}</strong><span className={`shrink-0 text-[9px] font-black ${ready ? "text-emerald-300" : "text-arcane-cyan"}`}>{ready ? "! CONCLUIR" : `${current}/${total}`}</span></span>
              <span className="mt-1 block truncate text-[10px] text-gray-400">{ready ? "Clique para abrir a missão e resgatar." : quest.zoneId ? `Destino: ${quest.zoneId.replaceAll("_", " ")}` : quest.objectives[0]?.description}</span>
            </button>;
          })}
          {!active.length && <p className="p-3 text-center text-xs text-gray-500">Nenhuma missão aceita.</p>}
        </div>
        <footer className="border-t border-white/10 p-2"><button onClick={() => setShowCompleted(current => !current)} className="w-full text-left text-[10px] font-bold text-gray-400 hover:text-white">{showCompleted ? "▾" : "▸"} Concluídas ({completed.length})</button>{showCompleted && <div className="mt-1 max-h-24 space-y-1 overflow-y-auto">{completed.slice().reverse().map(quest => quest && <button key={quest.id} onClick={() => onSelect(quest.id)} className="block w-full truncate px-2 py-1 text-left text-[10px] text-emerald-300 hover:bg-white/5">✓ {quest.name}</button>)}</div>}</footer>
      </section>}
  </aside>;
}
