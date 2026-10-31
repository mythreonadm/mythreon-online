import React, { useEffect, useState } from "react";
import { useGameStore } from "./store/gameStore";
import { Backpack } from "./ui/Backpack";
import { Depot } from "./ui/Depot"; // NOVO
import { Personagem } from "./ui/Personagem";
import { ZoneView } from "./ui/Zone";
import { MatrixView } from "./ui/Matrix";
import { CharacterPanel } from "./ui/CharacterPanel";
import { CombatLog } from "./ui/CombatLog";
import { Shop } from "./ui/Shop";
import { Quests } from "./ui/Quests";
import { Wiki } from "./ui/Wiki";
import { Duelos } from "./ui/Duelos";
import { AudioManager } from "./ui/AudioManager";
import { OfflineModal } from "./ui/OfflineModal";
import { DeathScreen } from "./ui/DeathScreen";
import { isDebug, setDebug } from "./config";

type Tab = "zona" | "personagem" | "backpack" | "depot" | "matriz" | "loja" | "missoes" | "duelos" | "wiki";

const TAB_LABELS: Record<Tab, string> = {
  zona: "Explorar", personagem: "Personagem", backpack: "Mochila", depot: "Depósito",
  matriz: "Matriz", loja: "Mercado", missoes: "Jornadas", duelos: "Duelo", wiki: "Arquivo",
};

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
        <div className="bg-arcane-panel border border-arcane-border rounded-2xl p-8 max-w-md w-full shadow-2xl entry-card">
          <div className="brand-lockup brand-lockup-centered"><span className="brand-sigil" aria-hidden="true">✦</span><div><span className="brand-kicker">UM MUNDO DE LENDA</span><h1 className="brand-title">Mythreon <span>Online</span></h1></div></div>
          <p className="text-arcane-cyan text-center mb-8 text-sm italic">“A Essência registra tudo.”</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do personagem"
            className="w-full bg-arcane-bg border border-arcane-border rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-arcane-purple"
          />
          <button
            onClick={() => { if (name.trim()) { newGame(name.trim()); startHunting("BOSQUE_LYSS"); } }}
            className="w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white rounded-lg py-3 font-bold transition-all hover:scale-105"
          >
            Começar Jornada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arcane-bg text-white pb-10 font-sans relative">
      <AudioManager />
      <OfflineModal />
      <DeathScreen />

      <header className="game-header bg-arcane-panel border-b border-arcane-border px-4 py-3 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="brand-lockup">
            <span className="brand-sigil" aria-hidden="true">✦</span>
            <div>
            <h1 className="brand-title text-2xl font-bold text-arcane-gold flex items-center gap-4">
              Mythreon <span>Online</span>
              <button
                onClick={toggleDebug}
                className={`text-[10px] px-2 py-1 rounded border ${debug ? "bg-red-900 border-red-500 text-red-200" : "bg-gray-800 border-gray-600 text-gray-400"}`}
              >
                {debug ? "DEBUG ON" : "DEBUG OFF"}
              </button>
            </h1>
            <p className="text-xs text-arcane-cyan brand-subtitle">
              {character.name} — Nível {character.level} {character.activeRace ? `(${character.activeRace.name})` : ""}
            </p></div>
          </div>
          <CharacterPanel />
        </div>
      </header>

      <nav className="game-nav bg-arcane-panel/80 backdrop-blur border-b border-arcane-border sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {(["zona", "personagem", "backpack", "depot", "matriz", "loja", "missoes", "duelos", "wiki"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-current={tab === t ? "page" : undefined}
              className={`nav-tab px-4 py-4 font-bold text-sm whitespace-nowrap transition-colors ${
                tab === t
                  ? "text-arcane-gold border-b-2 border-arcane-gold bg-arcane-border/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </nav>

      <main className="game-main max-w-7xl mx-auto p-4 mt-4">
        {tab === "zona" && <ZoneView />}
        {tab === "personagem" && <Personagem />}
        {tab === "backpack" && <Backpack />}
        {tab === "depot" && <Depot />} {/* NOVO */}
        {tab === "matriz" && <MatrixView />}
        {tab === "loja" && <Shop />}
        {tab === "missoes" && <Quests />}
        {tab === "duelos" && <Duelos />}
        {tab === "wiki" && <Wiki />}
        <div className="mt-6">
          <CombatLog />
        </div>
      </main>
    </div>
  );
}
