import React from "react";
import { useGameStore } from "../store/gameStore";

export function CombatLogCompact() {
  const { lastTickResult } = useGameStore();
  if (!lastTickResult) return null;

  const recentLog = lastTickResult.log.slice(-3);

  return (
    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-arcane-cyan/30">
      <div className="text-[9px] text-arcane-cyan font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
        Log
      </div>
      <div className="space-y-0.5 text-[10px] font-mono leading-tight max-h-[80px] overflow-hidden">
        {recentLog.map((line, i) => (
          <div key={i} className={`truncate ${line.includes("Você causou") ? "text-blue-300" : line.includes("causou") ? "text-red-400" : line.includes("derrotou") || line.includes("Subiu") ? "text-yellow-300" : line.includes("curou") ? "text-green-400" : "text-gray-400"}`}>
            » {line}
          </div>
        ))}
        {recentLog.length === 0 && <div className="text-gray-600 italic">Aguardando ação...</div>}
      </div>
    </div>
  );
}