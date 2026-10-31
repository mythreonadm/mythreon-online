import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getItemScore } from "../engine/itemCompare";
import { Item, Rarity } from "../types";

const RARITY_GLOW: Record<Rarity, string> = {
  COMUM: "border-gray-600",
  INCOMUM: "border-green-500 shadow-[0_0_6px_rgba(34,197,94,0.35)]",
  RARO: "border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.45)]",
  EPICO: "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.55)]",
  LENDARIO: "border-arcane-gold shadow-[0_0_14px_rgba(201,160,77,0.7)]",
};

const RARITY_ORDER: Record<Rarity, number> = {
  COMUM: 0, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 4,
};

type SortBy = "rarity" | "score" | "name";

export function Depot() {
  const { character, isTickRunning, withdrawItem } = useGameStore();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rarity");

  if (!character) return null;

  // REGRA: Só pode acessar se não estiver caçando
  if (isTickRunning) {
    return (
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-12 text-center shadow-lg">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Depósito Trancado</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Você não pode acessar o Depot enquanto estiver caçando. Saia da zona de caça (clique em "Sair" na aba Zona) para organizar seus itens valiosos.
        </p>
      </div>
    );
  }

  const used = character.depot?.length || 0;
  const total = character.depotMax || 300;

  const filtered = (character.depot || []).filter(i => {
    if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === "rarity") return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
    if (sortBy === "score") return getItemScore(b) - getItemScore(a);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const handleWithdraw = (uid: string) => {
    const res = withdrawItem(uid);
    if (!res.success) alert(res.error);
  };

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold text-arcane-gold flex items-center gap-2">🏦 Depot</h2>
          <p className="text-xs text-gray-400">Armazene itens valiosos para o futuro Mercado.</p>
        </div>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-gray-400">Capacidade:</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${used >= total ? "bg-red-900 text-white" : "bg-arcane-border"}`}>
            {used}/{total}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {["all", "ARMA", "ARMADURA", "JOIA", "ESCUDO", "COMPONENTE", "FRAGMENTO", "POCAO"].map(f => (
          <button
            key={f}
            onClick={() => setCategoryFilter(f)}
            className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${
              categoryFilter === f
                ? "bg-arcane-purple text-white"
                : "bg-arcane-bg text-gray-400 hover:text-white border border-arcane-border"
            }`}
          >
            {f === "all" ? "Todos" : f}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Buscar no Depot..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] bg-arcane-bg border border-arcane-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-arcane-purple"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className="bg-arcane-bg border border-arcane-border rounded-lg px-3 py-1.5 text-white text-sm"
        >
          <option value="rarity">Ordenar: Raridade</option>
          <option value="score">Ordenar: Poder</option>
          <option value="name">Ordenar: Nome</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10 italic">O Depot está vazio.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {filtered.map(item => (
            <div
              key={item.uid}
              className={`relative bg-arcane-bg border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all group ${RARITY_GLOW[item.rarity]}`}
            >
              <button
                onClick={() => handleWithdraw(item.uid)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-500 text-white rounded-full px-2 py-0.5 text-[9px] font-bold transition-opacity z-10"
                title="Retirar para Backpack"
              >
                📤 Retirar
              </button>
              <div className="text-3xl mb-1">{item.icon}</div>
              <div className="text-xs text-center truncate w-full font-bold" title={item.name}>{item.name}</div>
              {item.upgradeLevel > 0 && <div className="text-[10px] text-orange-400 font-bold">+{item.upgradeLevel}</div>}
              {item.slot && <div className="text-[9px] text-arcane-cyan mt-1 bg-arcane-cyan/10 px-1 rounded uppercase">{item.slot.replace(/_/g, " ")}</div>}
              {item.quantity > 1 && <div className="text-xs font-bold text-arcane-gold mt-1">x{item.quantity}</div>}
              <div className="text-[9px] text-gray-500 uppercase mt-1">{item.rarity}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}