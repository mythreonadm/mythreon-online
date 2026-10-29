import React, { useEffect, useState } from "react";
import { useGameStore } from "./store/gameStore";
import { Inventory } from "./ui/Inventory";
import { Equipment } from "./ui/Equipment";
import { ZoneView } from "./ui/Zone";
import { MatrixView } from "./ui/Matrix";
import { CharacterPanel } from "./ui/CharacterPanel";
import { CombatLog } from "./ui/CombatLog";
import { Shop } from "./ui/Shop";
import { Quests } from "./ui/Quests";
import { Attributes } from "./ui/Attributes";
import { Wiki } from "./ui/Wiki";
import { AudioManager } from "./ui/AudioManager";
import { OfflineModal } from "./ui/OfflineModal";
import { DeathScreen } from "./ui/DeathScreen";
import { isDebug, setDebug } from "./config";

type Tab = "zona" | "atributos" | "inventario" | "equipamento" | "matriz" | "loja" | "missoes" | "wiki";

export default function App() {
  const [tab, setTab] = useState<Tab>("zona");
  const { character, loadFromSave, newGame, startHunting, stopHunting } = useGameStore();
  const [name, setName] = useState("");
  const [debug, setDebugState] = useState(isDebug());

  useEffect(() => { 
    if (loadFromSave()) {
      const state = useGameStore.getState();
      if (state.character && state.character.hp > 0) startHunting(state.character.currentZoneId || "BOSQUE_LYSS");
    } 
  }, []);

  useEffect(() => { return () => stopHunting(); }, []);

  const toggleDebug = () => {
    setDebug(!debug); setDebugState(!debug); window.location.reload();
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-arcane-bg flex items-center justify-center p-4">
        <div className="bg-arcane-panel border border-arcane-border rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h1 className="text-3xl font-bold text-arcane-gold mb-2 text-center tracking-wider">Mythreon Online</h1>
          <p className="text-arcane-cyan text-center mb-8 text-sm italic">"A Essência registra tudo."</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do personagem" className="w-full bg-arcane-bg border border-arcane-border rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-arcane-purple" />
          <button onClick={() => { if (name.trim()) { newGame(name.trim()); startHunting("BOSQUE_LYSS"); } }} className="w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white rounded-lg py-3 font-bold transition-all hover:scale-105">Começar Jornada</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arcane-bg text-white pb-10 font-sans relative">
      
      <AudioManager />
      <OfflineModal />
      <DeathScreen />

      <header className="bg-arcane-panel border-b border-arcane-border p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-arcane-gold flex items-center gap-4">
              Mythreon Online
              <button onClick={toggleDebug} className={`text-[10px] px-2 py-1 rounded border ${debug ? "bg-red-900 border-red-500 text-red-200" : "bg-gray-800 border-gray-600 text-gray-400"}`}>
                {debug ? "DEBUG ON" : "DEBUG OFF"}
              </button>
            </h1>
            <p className="text-xs text-arcane-cyan">{character.name} — Nível {character.level} {character.activeRace ? `(${character.activeRace.name})` : ""}</p>
          </div>
          <CharacterPanel />
        </div>
      </header>
      
      <nav className="bg-arcane-panel/80 backdrop-blur border-b border-arcane-border sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {(["zona", "atributos", "inventario", "equipamento", "matriz", "loja", "missoes", "wiki"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-4 capitalize font-bold text-sm whitespace-nowrap transition-colors ${tab === t ? "text-arcane-gold border-b-2 border-arcane-gold bg-arcane-border/30" : "text-gray-400 hover:text-white"}`}>{t}</button>
          ))}
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto p-4 mt-4">
        {tab === "zona" && <ZoneView />}
        {tab === "atributos" && <Attributes />}
        {tab === "inventario" && <Inventory />}
        {tab === "equipamento" && <Equipment />}
        {tab === "matriz" && <MatrixView />}
        {tab === "loja" && <Shop />}
        {tab === "missoes" && <Quests />}
        {tab === "wiki" && <Wiki />}
        <div className="mt-6">
          <CombatLog />
        </div>
      </main>
    </div>
  );
}