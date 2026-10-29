import React from "react";
import { useGameStore } from "../store/gameStore";

export function DeathScreen() {
  const { deathReport, clearDeathReport } = useGameStore();
  if (!deathReport) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-arcane-panel border-2 border-red-900 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center relative overflow-hidden">
        
        <div className="text-6xl mb-4">💀</div>
        <h2 className="text-3xl font-bold text-red-500 mb-2">Você morreu!</h2>
        <p className="text-gray-400 mb-6">A escuridão te consumiu.</p>
        
        <div className="bg-black/50 rounded-xl p-4 border border-red-900/50 mb-8 space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">✨ XP Perdido:</span>
            <span className="font-bold text-red-400">-{deathReport.xpLost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">💰 Ouro Perdido:</span>
            <span className="font-bold text-red-400">-{deathReport.goldLost.toLocaleString()}</span>
          </div>
        </div>
        
        <button onClick={clearDeathReport} className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors text-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          Renascer na Casa
        </button>
      </div>
    </div>
  );
}