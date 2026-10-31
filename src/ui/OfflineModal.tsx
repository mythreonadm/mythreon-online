import React from "react";
import { useGameStore } from "../store/gameStore";

export function OfflineModal() {
  const { offlineReport, clearOfflineReport, character } = useGameStore();
  if (!offlineReport) return null;

  const hours = Math.floor(offlineReport.timeAwaySeconds / 3600);
  const minutes = Math.floor((offlineReport.timeAwaySeconds % 3600) / 60);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-fade-in">
      <div className="bg-arcane-panel border-2 border-arcane-gold rounded-2xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(201,160,77,0.3)] text-center relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-arcane-gold to-transparent"></div>
        
        <h2 className="text-3xl font-bold text-arcane-gold mb-2">Bem-vindo de Volta!</h2>
        <p className="text-gray-400 mb-6">Você ficou fora por <strong className="text-white">{hours}h {minutes}m</strong>.</p>
        
        <div className="bg-arcane-bg rounded-xl p-4 border border-arcane-border mb-8 space-y-3">
          <h3 className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-2">Relatório de Caça</h3>
          
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">✨ Experiência:</span>
            <span className="font-bold text-arcane-cyan">+{offlineReport.xpGained.toLocaleString()} XP</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">💰 Ouro:</span>
            <span className="font-bold text-yellow-400">+{offlineReport.goldGained.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">📦 Itens:</span>
            <span className="font-bold text-green-400">+{offlineReport.itemsDropped}</span>
          </div>
          {character && <div className="space-y-2 border-t border-white/10 pt-3 text-left">
            {[{ label: "Stamina online", value: character.staminaOnline ?? 120, max: 120, color: "bg-emerald-400" }, { label: "Stamina offline", value: character.staminaOffline ?? 480, max: 480, color: "bg-violet-400" }].map(pool => <div key={pool.label}>
              <div className="mb-1 flex justify-between text-[10px] text-gray-400"><span>{pool.label}</span><b>{Math.floor(pool.value)} / {pool.max} min</b></div>
              <div className="h-2 overflow-hidden rounded-full bg-black/50"><div className={`h-full ${pool.color}`} style={{ width: `${Math.max(0, Math.min(100, pool.value / pool.max * 100))}%` }} /></div>
            </div>)}
          </div>}
        </div>
        
        <button onClick={clearOfflineReport} className="w-full bg-arcane-gold hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors text-lg shadow-[0_0_15px_rgba(201,160,77,0.5)]">
          Coletar Recompensas
        </button>
      </div>
    </div>
  );
}
