import React, { useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { ATAQUES, SUPORTES, PASSIVAS } from "../data/components";
import { NAMED_RACES, RACE_LORE, findNamedRace, generateRaceName, generateRaceId, MATRIX_STATS, generateRaceBonus } from "../data/races";
import { ATTACK_SKILLS, SUPPORT_EFFECTS, PASSIVE_EFFECTS } from "../data/skills";
import { QUESTS } from "../data/quests";
import { Race } from "../types";
import { RaceModal } from "./RaceModal"; // IMPORTANDO O MODAL

type Tab = "synthesis" | "mine" | "compendium" | "milestones";

export function MatrixView() {
  const { character, races, synthesize, equipRace, claimQuest } = useGameStore();
  const [tab, setTab] = useState<Tab>("synthesis");
  const [slotA, setSlotA] = useState<string>("");
  const [slotS, setSlotS] = useState<string>("");
  const [slotP, setSlotP] = useState<string>("");
  const [activeSelector, setActiveSelector] = useState<"A" | "S" | "P" | null>(null);
  const [error, setError] = useState("");
  const [selectedRace, setSelectedRace] = useState<Race | null>(null); // ESTADO DO MODAL

  if (!character) return null;

  // ... (mesma lógica de owned, discovered, etc)

  return (
    <div className="space-y-6">
      
      {/* MODAL DE DETALHES DA RAÇA */}
      {selectedRace && (
        <RaceModal 
          race={selectedRace} 
          isEquipped={character.raceId === selectedRace.id}
          onEquip={() => { equipRace(selectedRace); setSelectedRace(null); }}
          onClose={() => setSelectedRace(null)}
        />
      )}

      {/* ... (Header e Tabs mantidos iguais) ... */}

      {/* TAB: MINHAS RAÇAS */}
      {tab === "mine" && (
        <div className="space-y-6">
           {/* ... (Mesma lógica de separar Nomeadas e Híbridas) ... */}
           {races.map(r => (
              <div key={r.id} onClick={() => setSelectedRace(r)} className={`bg-arcane-panel border-2 rounded-lg p-4 cursor-pointer hover:-translate-y-1 transition-all ${character.raceId === r.id ? "border-arcane-gold shadow-[0_0_15px_rgba(201,160,77,0.2)]" : "border-arcane-border hover:border-gray-500"}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-bold text-base ${r.tier === "NOMEADA" ? "text-arcane-gold" : "text-white"}`}>{r.name}</h3>
                    <p className="text-[10px] uppercase text-arcane-cyan">{r.tier}</p>
                  </div>
                  {character.raceId === r.id && <span className="text-[10px] bg-arcane-gold text-black px-2 py-0.5 rounded font-bold">EQUIPADA</span>}
                </div>
                <div className="grid grid-cols-3 gap-1 text-[10px]">
                  {Object.entries(r.bonus).slice(0,3).map(([k, v]) => (
                    <div key={k} className="bg-arcane-bg px-1 py-0.5 rounded text-center">
                      <div className="text-gray-500 uppercase">{k}</div>
                      <div className="font-bold text-green-400">+{(v as number) % 1 === 0 ? v : `${(v as number).toFixed(2)}`}</div>
                    </div>
                  ))}
                </div>
              </div>
           ))}
        </div>
      )}
      
      {/* ... (O resto do arquivo: Compêndio, Milestones, Síntese) ... */}
      {/* Na aba de Síntese, o preview da raça também pode ter um botão para abrir o modal, mas o resumo já é bem completo. */}
    </div>
  );
}