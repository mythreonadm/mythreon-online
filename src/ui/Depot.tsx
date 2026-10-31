import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getItemScore } from "../engine/itemCompare";
import { ItemIcon } from "./ItemIcon"; // NOVO
import { Rarity } from "../types";

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
  const { character, isTickRunning, withdrawItem, withdrawMany } = useGameStore();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rarity");
  const [selectedUids, setSelectedUids] = useState<string[]>([]);

  if (!character) return null;

  if (isTickRunning) {
    return (
      <div className="bg-arcane-panel border border-arcane-border rounded-xl p-12 text-center shadow-lg">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Depósito Trancado</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Você não pode acessar o Depot enquanto estiver caçando. Saia da zona de caça (clique em "Sair" na aba Zona) para organizar seus itens.
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

  const toggleSelect = (uid: string) => {
    setSelectedUids(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  const selectAll = () => setSelectedUids(filtered.map(i => i.uid));
  const clearSelection = () => setSelectedUids([]);

  const handleBulkWithdraw = () => {
    if (selectedUids.length === 0) return;
    const res = withdrawMany(selectedUids);
    if (res.moved > 0) {
      setSelectedUids([]);
      if (res.error) alert(res.error);
    } else {
      alert(res.error || "Nenhum item movido.");
    }
  };

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg relative pb-20">
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-arcane-gold flex items-center gap-2">🏦 Depot</h2>
          <button onClick={selectAll} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded">Selecionar Tudo</button>
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
          {filtered.map(item => {
            const isSelected = selectedUids.includes(item.uid);
            return (
              <div
                key={item.uid}
                className={`relative bg-arcane-bg border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all group ${RARITY_GLOW[item.rarity]} ${isSelected ? "ring-2 ring-blue-500 bg-blue-900/30" : ""}`}
              >
                <button
                  onClick={() => toggleSelect(item.uid)}
                  className={`absolute top-1 left-1 w-5 h-5 rounded border flex items-center justify-center text-xs z-20 transition-colors ${isSelected ? "bg-blue-500 border-blue-400 text-white" : "bg-black/50 border-gray-500 text-transparent hover:border-white"}`}
                >
                  ✓
                </button>

                <button
                  onClick={() => handleWithdraw(item.uid)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-500 text-white rounded px-1.5 py-0.5 text-[9px] font-bold transition-opacity z-10"
                  title="Retirar para Backpack"
                >
                  📤
                </button>
                
                <div className="mb-1 flex justify-center">
                  <ItemIcon item={item} className="w-12 h-12 drop-shadow-md" />
                </div>
                <div className="text-xs text-center truncate w-full font-bold" title={item.name}>{item.name}</div>
                {item.upgradeLevel > 0 && <div className="text-[10px] text-orange-400 font-bold">+{item.upgradeLevel}</div>}
                {item.quantity > 1 && <div className="text-xs font-bold text-arcane-gold mt-1">x{item.quantity}</div>}
                <div className="text-[9px] text-gray-500 uppercase mt-1">{item.rarity}</div>
              </div>
            );
          })}
        </div>
      )}

      {selectedUids.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-arcane-panel border-2 border-blue-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] p-3 flex items-center gap-4 z-50">
          <span className="text-white font-bold whitespace-nowrap">{selectedUids.length} itens selecionados</span>
          <div className="flex gap-2">
            <button onClick={handleBulkWithdraw} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow">
              📤 Retirar p/ Backpack
            </button>
            <button onClick={clearSelection} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg font-bold text-sm">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}