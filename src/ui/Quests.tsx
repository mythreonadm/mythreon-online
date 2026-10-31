import React, { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { QUESTS } from "../data/quests";
import { checkQuestCompletion } from "../engine/questEngine";
import { getAvailableQuests } from "../utils/questSignals";

interface QuestsProps {
  focusQuestId?: string | null;
  onFocusHandled?: () => void;
}

export function Quests({ focusQuestId, onFocusHandled }: QuestsProps) {
  const { character, acceptQuest, claimQuest } = useGameStore();
  const [highlightedQuestId, setHighlightedQuestId] = useState<string | null>(null);

  useEffect(() => {
    if (!focusQuestId || !character) return;
    const card = document.getElementById(`quest-card-${focusQuestId}`);
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedQuestId(focusQuestId);
    onFocusHandled?.();
  }, [character, focusQuestId, onFocusHandled]);

  useEffect(() => {
    if (!highlightedQuestId) return;
    const timer = window.setTimeout(() => setHighlightedQuestId(null), 1800);
    return () => window.clearTimeout(timer);
  }, [highlightedQuestId]);

  if (!character) return null;

  const activeIds = Object.keys(character.quests?.active || {});
  const completedIds = character.quests?.completed || [];
  const availableQuests = getAvailableQuests(character);

  const renderQuest = (template: any, isActive: boolean) => {
    const isCompletedQuest = completedIds.includes(template.id);
    const progressData = character.quests.active[template.id]?.progress || [];
    const isReadyToClaim = isActive && checkQuestCompletion(character, template.id);

    return (
      <div id={`quest-card-${template.id}`} key={template.id} className={`quest-card bg-arcane-panel border p-4 rounded-lg flex flex-col h-full ${isReadyToClaim ? 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'border-arcane-border'} ${highlightedQuestId === template.id ? 'quest-card-focus' : ''}`}>
        <div className="flex justify-between items-start mb-2">
           <div>
             <h3 className="font-bold text-lg text-white">{template.name}</h3>
             <p className="text-xs text-arcane-cyan italic">De: {template.giver}</p>
           </div>
           <span className="text-[10px] font-bold px-2 py-1 bg-arcane-border rounded uppercase">{template.category}</span>
        </div>
        <p className="text-sm text-gray-400 mb-4 flex-1">{template.description}</p>
        
        <div className="space-y-1 mb-4 bg-black/30 p-2 rounded border border-white/5">
           {template.objectives.map((obj: any, i: number) => {
              const current = progressData[i] || 0;
              const done = current >= obj.count;
              return (
                <div key={i} className={`text-sm flex justify-between ${done ? 'text-green-400' : 'text-gray-300'}`}>
                  <span>{obj.description}</span>
                  <span className="font-mono bg-black/50 px-1 rounded">{Math.min(current, obj.count)} / {obj.count}</span>
                </div>
              )
           })}
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-arcane-border">
           <div className="text-xs font-bold text-yellow-400 flex gap-2">
             <span>💰 {template.rewards.gold || 0}</span>
             <span>✨ {template.rewards.xp || 0} XP</span>
           </div>
           {!isActive && !isCompletedQuest && (
             <button onClick={() => acceptQuest(template.id)} className="bg-arcane-purple text-white px-4 py-1.5 rounded font-bold text-sm hover:bg-arcane-purple/80 transition-colors">Aceitar</button>
           )}
           {isActive && isReadyToClaim && (
             <button onClick={() => claimQuest(template.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded font-bold text-sm animate-pulse">Resgatar</button>
           )}
           {isCompletedQuest && <span className="text-green-500 font-bold text-sm">Concluído ✔️</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-arcane-gold mb-6">Missões Ativas ({activeIds.length})</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {activeIds.map(id => {
             const template = QUESTS.find(q => q.id === id);
             return template ? renderQuest(template, true) : null;
           })}
           {activeIds.length === 0 && <p className="text-gray-500 italic col-span-3">Nenhuma missão ativa. Aceite missões na lista abaixo.</p>}
        </div>
      </div>

      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-arcane-cyan mb-6">Disponíveis</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {availableQuests.map(q => renderQuest(q, false))}
        </div>
      </div>
    </div>
  );
}
