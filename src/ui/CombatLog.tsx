import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { CombatCommunity } from "./CombatCommunity";

export function CombatLog() {
  const { lastTickResult } = useGameStore();
  const [tab, setTab] = useState<"combat" | "community">("combat");

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 shadow-lg font-sans">
      <nav className="mb-3 flex gap-2 border-b border-arcane-border pb-3">
        <button type="button" onClick={() => setTab("combat")} className={tab === "combat" ? "online-button" : "online-button-secondary"}>⚔️ Registro de Combate</button>
        <button type="button" onClick={() => setTab("community")} className={tab === "community" ? "online-button" : "online-button-secondary"}>💬 Comunidade</button>
      </nav>
      {tab === "community" ? <CombatCommunity /> : lastTickResult ? <>
        <div className="flex gap-4 flex-wrap text-sm mb-3 bg-arcane-bg p-3 rounded-lg border border-arcane-border">
          <span className="text-arcane-gold font-bold">⚔️ Kills: {lastTickResult.kills}</span><span className="text-yellow-400 font-bold">💰 +{lastTickResult.gold}</span><span className="text-arcane-cyan font-bold">✨ +{lastTickResult.xp} XP</span><span className="text-green-400 font-bold">📦 +{lastTickResult.drops.length} drops</span>{!!lastTickResult.mythreonShards && <span className="text-cyan-300 font-bold">🔷 +{lastTickResult.mythreonShards} Shards</span>}
        </div>
        <div className="space-y-1 text-xs text-gray-300 bg-black/40 p-3 rounded-lg h-32 overflow-y-auto font-mono">{lastTickResult.log.map((line, i) => <div key={i} className={line.includes("Você causou") ? "text-blue-300" : line.includes("causou") ? "text-red-400" : "text-yellow-300"}>» {line}</div>)}</div>
      </> : <p className="text-sm text-gray-500">Aguardando o primeiro combate.</p>}
    </div>
  );
}
