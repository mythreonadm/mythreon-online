import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getUsedSlots, removeItem } from "../engine/inventory";

export function Inventory() {
  const { character, equip, save } = useGameStore();
  const [filter, setFilter] = useState<string>("all");
  if (!character) return null;

  const used = getUsedSlots(character.inventory);
  const total = character.inventory.backpack.slots;
  const items = character.inventory.items.filter((i) => filter === "all" || i.category === filter);

  const getRarityColor = (r: string) => {
    if (r === "LENDARIO") return "border-arcane-gold shadow-[0_0_10px_rgba(201,160,77,0.3)]";
    if (r === "EPICO") return "border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
    if (r === "RARO") return "border-blue-500";
    if (r === "INCOMUM") return "border-green-500";
    return "border-arcane-border";
  };

  const handleEquip = (uid: string) => {
    const res = equip(uid);
    if (!res.success) {
      alert(res.error); // Mostra o erro se a bolsa estiver cheia!
    }
  };

  const handleDiscard = (e: React.MouseEvent, uid: string) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja jogar este item fora?")) {
      const newCharacter = JSON.parse(JSON.stringify(character));
      removeItem(newCharacter.inventory, uid);
      useGameStore.setState({ character: newCharacter });
      save();
    }
  };

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4">
        <h2 className="text-xl font-bold text-arcane-gold">Inventário</h2>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Backpack:</span>
          <span className="font-bold text-white">{character.inventory.backpack.name}</span>
          <span className={`px-2 py-1 rounded text-xs ${used >= total ? "bg-red-900 text-white" : "bg-arcane-border"}`}>{used}/{total}</span>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "ARMA", "ARMADURA", "JOIA", "ESCUDO", "COMPONENTE", "BACKPACK"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${filter === f ? "bg-arcane-purple text-white" : "bg-arcane-bg text-gray-400 hover:text-white border border-arcane-border"}`}>{f}</button>
        ))}
      </div>

      {used >= total && (
        <div className="text-red-400 text-sm mb-4 bg-red-900/20 p-2 rounded">
          ⚠️ Bolsa cheia! Jogue itens fora (🗑️) para continuar coletando drops.
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center text-gray-500 py-10 italic">Nenhum item encontrado.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {items.map((item) => (
            <div key={item.uid} onClick={() => item.slot && handleEquip(item.uid)} className={`bg-arcane-bg border rounded-lg p-2 flex flex-col items-center justify-center transition-all relative group ${getRarityColor(item.rarity)} ${item.slot ? "cursor-pointer hover:-translate-y-1 hover:border-arcane-gold" : ""}`}>
              
              <button onClick={(e) => handleDiscard(e, item.uid)} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition-opacity z-10" title="Jogar Fora">🗑️</button>
              
              <div className="text-3xl mb-1">{item.icon}</div>
              <div className="text-xs text-center truncate w-full font-bold" title={item.name}>{item.name}</div>
              {item.slot && <div className="text-[9px] text-arcane-cyan mt-1 bg-arcane-cyan/10 px-1 rounded uppercase">{item.slot.replace("_", " ")}</div>}
              {item.quantity > 1 && <div className="text-xs font-bold text-arcane-gold mt-1">x{item.quantity}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}