import React from "react";
import { useGameStore } from "../store/gameStore";

export function CombatLog() {
  const { lastTickResult } = useGameStore();
  if (!lastTickResult) return null;

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg font-sans">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Registro de Combate</h3>
      <div className="flex gap-4 flex-wrap text-sm mb-3 bg-arcane-bg p-3 rounded-lg border border-arcane-border">
        <span className="text-arcane-gold font-bold">⚔️ Kills: {lastTickResult.kills}</span>
        <span className="text-yellow-400 font-bold">💰 +{lastTickResult.gold}</span>
        <span className="text-arcane-cyan font-bold">✨ +{lastTickResult.xp} XP</span>
        <span className="text-green-400 font-bold">📦 +{lastTickResult.drops.length} drops</span>
      </div>
      <div className="space-y-1 text-xs text-gray-300 bg-black/40 p-3 rounded-lg h-32 overflow-y-auto font-mono">
        {lastTickResult.log.map((line, i) => (
          <div key={i} className={line.includes("Você causou") ? "text-blue-300" : line.includes("causou") ? "text-red-400" : "text-yellow-300"}>» {line}</div>
        ))}
      </div>
    </div>
  );
}