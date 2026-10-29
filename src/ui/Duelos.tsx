import React, { useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { CARD_TEMPLATES, TRAITS, getCardStats } from "../data/cards";
import { CardInstance } from "../types";

type RegionFilter = "TODAS" | "BOSQUE_LYSS" | "PICO_DHOR" | "MAR_AZHAR" | "RUINAS_ASTERION" | "CICATRIZ_PROFUNDA";

const REGIONS: { id: RegionFilter; name: string; icon: string; color: string }[] = [
  { id: "TODAS", name: "Todas", icon: "🌍", color: "text-arcane-gold" },
  { id: "BOSQUE_LYSS", name: "Bosque de Lyss", icon: "🌲", color: "text-green-400" },
  { id: "PICO_DHOR", name: "Pico de Dhor", icon: "🏔️", color: "text-orange-400" },
  { id: "MAR_AZHAR", name: "Mar de Azhar", icon: "🌊", color: "text-cyan-400" },
  { id: "RUINAS_ASTERION", name: "Ruínas de Asterion", icon: "🏛️", color: "text-amber-400" },
  { id: "CICATRIZ_PROFUNDA", name: "Cicatriz Profunda", icon: "🌑", color: "text-purple-400" },
];

const RARITY_COLORS: Record<string, string> = {
  COMUM: "border-gray-500",
  INCOMUM: "border-green-500",
  RARO: "border-blue-500",
  EPICO: "border-purple-500",
  LENDARIO: "border-arcane-gold shadow-[0_0_15px_rgba(201,160,77,0.4)]",
};

const RARITY_LABELS: Record<string, string> = {
  COMUM: "Comum", INCOMUM: "Incomum", RARO: "Raro", EPICO: "Épico", LENDARIO: "Lendário",
};

export function Duelos() {
  const { character } = useGameStore();
  const [filter, setFilter] = useState<RegionFilter>("TODAS");
  const [selectedCard, setSelectedCard] = useState<CardInstance | null>(null);

  if (!character) return null;

  const cards = character.cards || [];

  // Agrupa por templateId para mostrar quantidade
  const groupedCards = useMemo(() => {
    const map: Record<string, { instance: CardInstance; count: number; }> = {};
    cards.forEach(card => {
      if (!map[card.templateId]) {
        map[card.templateId] = { instance: card, count: 1 };
      } else {
        map[card.templateId].count++;
        // Mantém o de maior nível
        if (card.level > map[card.templateId].instance.level) {
          map[card.templateId].instance = card;
        }
      }
    });
    return Object.values(map);
  }, [cards]);

  const filteredCards = groupedCards.filter(({ instance }) => {
    const template = CARD_TEMPLATES[instance.templateId];
    if (!template) return false;
    if (filter === "TODAS") return true;
    return template.region === filter;
  });

  const uniqueCount = groupedCards.length;
  const totalCount = cards.length;

  // Se não tem cartas ainda
  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-arcane-panel via-purple-900/20 to-arcane-panel border-2 border-arcane-purple/30 rounded-xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-arcane-gold tracking-wider">🎴 DUELOS DE MYTHREON</h1>
              <p className="text-arcane-cyan text-sm italic">"Toda carta é uma memória. Todo duelo é uma lenda."</p>
            </div>
          </div>
        </div>
        
        <div className="bg-arcane-panel border border-arcane-border rounded-xl p-12 text-center">
          <div className="text-8xl mb-6">🎴</div>
          <h2 className="text-2xl font-bold text-white mb-2">Nenhuma carta ainda</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Cartas dropam dos monstros durante a caça. Comece pelo <strong className="text-green-400">Bosque de Lyss</strong> — os monstros iniciais têm maior chance de drop (3%).
          </p>
          <div className="bg-arcane-bg border border-arcane-border rounded-lg p-4 max-w-md mx-auto text-left">
            <div className="text-xs text-gray-500 uppercase font-bold mb-2">Dicas:</div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Mobs comuns T1: 3% de chance</li>
              <li>• Mobs comuns T2: 2% de chance</li>
              <li>• Mobs comuns T5: 0.5% de chance</li>
              <li>• <strong className="text-arcane-gold">Bosses: 0.5%</strong> (raríssimo)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-arcane-panel via-purple-900/20 to-arcane-panel border-2 border-arcane-purple/30 rounded-xl p-6 shadow-[0_0_30px_rgba(124,58,237,0.2)]">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-arcane-gold tracking-wider">🎴 DUELOS DE MYTHREON</h1>
            <p className="text-arcane-cyan text-sm italic">"Toda carta é uma memória. Todo duelo é uma lenda."</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Cartas Únicas</div>
              <div className="text-2xl font-black text-arcane-cyan">{uniqueCount}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 uppercase">Total de Cópias</div>
              <div className="text-2xl font-black text-arcane-gold">{totalCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner: Batalha em Breve */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border-2 border-yellow-600/50 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">⚔️</div>
        <h2 className="text-xl font-bold text-yellow-400 mb-1">Arena de Duelos em Construção</h2>
        <p className="text-sm text-gray-300">
          Em breve você poderá desafiar a IA em batalhas <strong>1x1</strong>, <strong>3x3</strong> e <strong>5x5</strong>.
        </p>
        <p className="text-xs text-gray-500 mt-2">Colete cartas agora para estar pronto quando a arena abrir.</p>
      </div>

      {/* Filtro por Região */}
      <div className="flex gap-2 flex-wrap">
        {REGIONS.map(r => (
          <button
            key={r.id}
            onClick={() => setFilter(r.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === r.id
                ? "bg-arcane-purple text-white shadow-lg"
                : "bg-arcane-panel border border-arcane-border text-gray-400 hover:text-white"
            }`}
          >
            <span>{r.icon}</span>
            {r.name}
          </button>
        ))}
      </div>

      {/* Grid de Cartas */}
      {filteredCards.length === 0 ? (
        <div className="text-center text-gray-500 italic py-10 bg-arcane-panel border border-arcane-border rounded-xl">
          Nenhuma carta nesta região ainda. Continue caçando!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredCards.map(({ instance, count }) => {
            const template = CARD_TEMPLATES[instance.templateId];
            if (!template) return null;
            const trait = TRAITS[template.trait];
            const stats = getCardStats(template, instance.level);
            
            return (
              <div
                key={instance.uid}
                onClick={() => setSelectedCard(instance)}
                className={`bg-arcane-panel border-2 rounded-lg overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl ${RARITY_COLORS[template.rarity]}`}
              >
                <div className="bg-gradient-to-br from-arcane-bg to-black/60 p-3 flex items-center justify-center relative">
                  <div className="text-5xl">{template.emoji}</div>
                  {count > 1 && (
                    <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-arcane-gold">
                      x{count}
                    </div>
                  )}
                  {instance.level > 1 && (
                    <div className="absolute bottom-1 left-1 bg-orange-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                      Nv {instance.level}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <div className="text-xs font-bold text-white truncate text-center">{template.name}</div>
                  <div className={`text-[10px] text-center font-bold ${trait.color}`}>
                    {trait.icon} {trait.name}
                  </div>
                  <div className="text-[9px] text-center text-gray-500 mt-1">
                    {RARITY_LABELS[template.rarity]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Detalhes da Carta */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MODAL DE DETALHES DA CARTA
// ═══════════════════════════════════════════════════════════════
function CardDetailModal({ card, onClose }: { card: CardInstance; onClose: () => void }) {
  const template = CARD_TEMPLATES[card.templateId];
  if (!template) return null;
  
  const trait = TRAITS[template.trait];
  const stats = getCardStats(template, card.level);
  const nextStats = card.level < 5 ? getCardStats(template, card.level + 1) : null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={onClose}>
      <div
        className={`bg-arcane-panel border-2 rounded-2xl p-6 max-w-md w-full shadow-2xl relative ${RARITY_COLORS[template.rarity]}`}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-white font-bold text-xl">✕</button>

        <div className="text-center mb-4 border-b border-arcane-border pb-4">
          <div className="text-7xl mb-2">{template.emoji}</div>
          <h2 className="text-2xl font-bold text-white">{template.name}</h2>
          <div className="text-xs uppercase tracking-wider mt-1">
            <span className={RARITY_LABELS[template.rarity] === "Lendário" ? "text-arcane-gold" : "text-arcane-cyan"}>
              {RARITY_LABELS[template.rarity]}
            </span>
            {" · "}
            <span className="text-gray-500">Nível {card.level}</span>
          </div>
          <div className={`mt-2 inline-block px-3 py-1 rounded-full bg-black/40 border border-arcane-border text-sm font-bold ${trait.color}`}>
            {trait.icon} {trait.name}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-arcane-bg p-2 rounded-lg border border-arcane-border text-center">
            <div className="text-[10px] text-gray-500 uppercase">HP</div>
            <div className="font-bold text-red-400">{stats.hp}</div>
            {nextStats && <div className="text-[9px] text-green-400">→ {nextStats.hp}</div>}
          </div>
          <div className="bg-arcane-bg p-2 rounded-lg border border-arcane-border text-center">
            <div className="text-[10px] text-gray-500 uppercase">ATK</div>
            <div className="font-bold text-orange-400">{stats.atk}</div>
            {nextStats && <div className="text-[9px] text-green-400">→ {nextStats.atk}</div>}
          </div>
          <div className="bg-arcane-bg p-2 rounded-lg border border-arcane-border text-center">
            <div className="text-[10px] text-gray-500 uppercase">DEF</div>
            <div className="font-bold text-gray-300">{stats.def}</div>
            {nextStats && <div className="text-[9px] text-green-400">→ {nextStats.def}</div>}
          </div>
          <div className="bg-arcane-bg p-2 rounded-lg border border-arcane-border text-center">
            <div className="text-[10px] text-gray-500 uppercase">SPD</div>
            <div className="font-bold text-cyan-400">{stats.spd}</div>
            {nextStats && <div className="text-[9px] text-green-400">→ {nextStats.spd}</div>}
          </div>
        </div>

        {/* Traço */}
        <div className="bg-arcane-bg p-3 rounded-lg border border-arcane-border mb-3">
          <div className="text-[10px] text-gray-500 uppercase mb-1">Traço de Combate</div>
          <div className={`font-bold text-sm ${trait.color}`}>{trait.icon} {trait.name}</div>
          <div className="text-xs text-gray-400 mt-1">{trait.desc}</div>
        </div>

        {/* Habilidade */}
        <div className="bg-purple-900/20 p-3 rounded-lg border border-purple-900/50 mb-4">
          <div className="text-[10px] text-purple-400 uppercase mb-1">Habilidade Única</div>
          <div className="font-bold text-sm text-white">{template.ability}</div>
          <div className="text-xs text-gray-400 mt-1">{template.abilityDesc}</div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white font-bold py-2 rounded-lg transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}