import React from "react";
import { useGameStore } from "../store/gameStore";

export function CharacterPanel() {
  const { character } = useGameStore();
  if (!character) return null;
  const hpPct = Math.min(100, (character.hp / character.hpMax) * 100);
  const mpPct = Math.min(100, (character.mp / character.mpMax) * 100);
  const xpPct = Math.min(100, (character.xp / character.xpToNext) * 100);

  return (
    <div className="flex flex-wrap gap-4 text-xs font-sans">
      <div className="w-32">
        <div className="flex justify-between text-red-400 mb-1"><span>HP</span><span>{character.hp}/{character.hpMax}</span></div>
        <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300" style={{ width: `${hpPct}%` }} /></div>
      </div>
      <div className="w-32">
        <div className="flex justify-between text-blue-400 mb-1"><span>MP</span><span>{character.mp}/{character.mpMax}</span></div>
        <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300" style={{ width: `${mpPct}%` }} /></div>
      </div>
      <div className="w-32">
        <div className="flex justify-between text-arcane-gold mb-1"><span>XP</span><span>{character.xp}/{character.xpToNext}</span></div>
        <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-600 to-arcane-gold transition-all duration-300" style={{ width: `${xpPct}%` }} /></div>
      </div>
      <div className="text-arcane-gold font-bold bg-arcane-border/50 px-3 py-1 rounded-full flex items-center">💰 {character.gold}</div>
    </div>
  );
}