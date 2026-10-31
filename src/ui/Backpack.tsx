import React, { useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { getUsedSlots, removeItem } from "../engine/inventory";
import { getItemScore, isUpgrade, getEquippedForTarget } from "../engine/itemCompare";
import { ItemModal } from "./ItemModal";
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

export function Backpack() {
  const { character, equip, save } = useGameStore();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rarity");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!character) return null;

  const used = getUsedSlots(character.inventory);
  const total = character.inventory.backpack.slots;

  const filtered = useMemo(() => {
    const items = character.inventory.items.filter(i => {
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    items.sort((a, b) => {
      if (sortBy === "rarity") return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
      if (sortBy === "score") return getItemScore(b) - getItemScore(a);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return items;
  }, [character.inventory.items, categoryFilter, search, sortBy]);

  const handleDiscard = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja jogar este item fora?")) {
      const newCharacter = JSON.parse(JSON.stringify(character));
      removeItem(newCharacter.inventory, uid);
      useGameStore.setState({ character: newCharacter });
      save();
    }
  };

  const handleConfirmEquip = () => {
    if (!selectedItem) return;
    const res = equip(selectedItem.uid);
    if (res.success) setSelectedItem(null);
    else alert(res.error);
  };

  const equippedItem = selectedItem ? getEquippedForTarget(character, selectedItem) : undefined;

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg">
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          equipped={equippedItem}
          onEquip={handleConfirmEquip}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4 flex-wrap gap-2">
        <h2 className="text-xl font-bold text-arcane-gold">🎒 Backpack</h2>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-gray-400">Bolsa:</span>
          <span className="font-bold text-white">{character.inventory.backpack.name}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${used >= total ? "bg-red-900 text-white" : "bg-arcane-border"}`}>
            {used}/{total}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {["all", "ARMA", "ARMADURA", "JOIA", "ESCUDO", "COMPONENTE", "FRAGMENTO", "POCAO", "BACKPACK"].map(f => (
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
          placeholder="🔍 Buscar por nome..."
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

      {used >= total && (
        <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-2 rounded">
          ⚠️ Bolsa cheia! Jogue itens fora (🗑️) para continuar coletando drops.
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-10 italic">Nenhum item encontrado.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {filtered.map(item => {
            const better = isUpgrade(item, character);
            return (
              <div
                key={item.uid}
                onClick={() => setSelectedItem(item)}
                className={`relative bg-arcane-bg border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:-translate-y-1 hover:border-arcane-gold group ${RARITY_GLOW[item.rarity]}`}
              >
                {better && (
                  <div className="absolute -top-1.5 -left-1.5 bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg z-10 whitespace-nowrap">
                    ⬆ MELHOR
                  </div>
                )}

                <button
                  onClick={e => handleDiscard(e, item.uid)}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition-opacity z-10"
                  title="Jogar Fora"
                >
                  🗑️
                </button>

                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xs text-center truncate w-full font-bold" title={item.name}>{item.name}</div>
                {item.upgradeLevel > 0 && <div className="text-[10px] text-orange-400 font-bold">+{item.upgradeLevel}</div>}
                {item.slot && <div className="text-[9px] text-arcane-cyan mt-1 bg-arcane-cyan/10 px-1 rounded uppercase">{item.slot.replace(/_/g, " ")}</div>}
                {item.quantity > 1 && <div className="text-xs font-bold text-arcane-gold mt-1">x{item.quantity}</div>}
                <div className="text-[9px] text-gray-500 uppercase mt-1">{item.rarity}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}