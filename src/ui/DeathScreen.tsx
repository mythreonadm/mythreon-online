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
        <p className="text-gray-400 mb-6">{deathReport.blessed ? "Sua Bless reduziu a perda de experiência e protegeu seus itens." : deathReport.protectedByRing ? "O Anel da Guarda Eterna protegeu seus itens." : "Sem Bless nem proteção, sua mochila e seu conteúdo foram perdidos."}</p>
        
        <div className="bg-black/50 rounded-xl p-4 border border-red-900/50 mb-8 space-y-3">
          <div className="flex justify-between items-center text-lg">
            <span className="text-gray-300">✨ XP Perdido:</span>
            <span className="font-bold text-red-400">-{deathReport.xpLost.toLocaleString()}</span>
          </div>
          {deathReport.blessed && <div className="text-xs text-arcane-gold">Uma Bless foi consumida. Restam {useGameStore.getState().character?.blesses ?? 0}.</div>}
          {deathReport.protectedByRing && <div className="text-xs text-emerald-300">🛡️ Perda de mochila e equipamento bloqueada pelo anel.</div>}
          {deathReport.lostBackpack && <div className="rounded-lg border border-red-900/40 bg-red-950/25 p-3 text-left"><strong className="text-sm text-red-300">🎒 Mochila perdida: {deathReport.lostBackpack}</strong><p className="mt-1 text-xs text-gray-300">{deathReport.lostItems?.length ? `${deathReport.lostItems.length} item(ns) também foram perdidos:` : "A mochila estava vazia."}</p>{!!deathReport.lostItems?.length && <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-left text-[11px] text-gray-400">{deathReport.lostItems.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul>}</div>}
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
