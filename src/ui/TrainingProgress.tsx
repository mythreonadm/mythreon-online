import React from "react";
import { useGameStore } from "../store/gameStore";
import { masteryBonus, TRAINING_MILESTONES } from "../engine/training";
import { CharacterSkills } from "../types";

const disciplines: [keyof CharacterSkills, string][] = [["melee", "Corpo a corpo"], ["distance", "Arcos"], ["magic", "Magia"], ["defense", "Defesa"], ["soul", "Alma"]];
export function TrainingProgress() {
  const char = useGameStore(state => state.character);
  if (!char) return null;
  const total = Object.values(char.trainingSeconds ?? {}).reduce((sum, n) => sum + (n ?? 0), 0);
  return <section className="rounded-xl border border-cyan-700/30 bg-arcane-panel p-4 text-sm">
    <h3 className="font-bold text-arcane-gold">Caminho da Disciplina</h3>
    <p className="mt-2 text-xs text-gray-400">Treinar pausa a caça: você abre mão de XP de personagem, gold e loot. Cada nível conquistado praticando dá +1% de maestria à disciplina, até 30%. Pontos distribuídos não geram maestria. Treino funciona com o jogo aberto; atraso de aba é limitado a 60 segundos.</p>
    <div className="my-3 grid grid-cols-2 gap-2 md:grid-cols-5">{disciplines.map(([key,label]) => <div key={key} className="rounded bg-black/25 p-2"><b className="text-cyan-200">{label}</b><p className="text-xs text-gray-400">{Math.floor((char.trainingSeconds?.[key] ?? 0)/60)} min · {Math.round(masteryBonus(char,key)*100)}% maestria</p></div>)}</div>
    <p className="text-xs text-gray-400">Melee/arco: bônus ao ATK usando a arma correspondente. Magia: MATK. Defesa: ARM. Alma: regeneração de mana, até +5 por tick.</p>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{TRAINING_MILESTONES.map(reward => { const earned=char.trainingAchievements?.includes(reward.id);return <div key={reward.id} className={`rounded border p-2 ${earned ? "border-emerald-700 text-emerald-300" : "border-white/10 text-gray-400"}`}><b>{earned ? "✓ " : "◇ "}{reward.name}</b><p className="text-xs">{Math.floor(Math.min(total,reward.seconds)/60)}/{reward.seconds/60} min · {reward.gold} gold + {reward.fragments} Fragmentos Comuns</p></div>;})}</div>
    <p className="mt-2 text-xs text-gray-500">Conquistas globais de treino, resgatadas automaticamente uma vez. Sem espaço na mochila, Fragmentos vão ao depósito.</p>
  </section>;
}
