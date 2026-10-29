import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getShopStock } from "../engine/shop";
import { RARITY_ORDER } from "../engine/drops";
import { VIALS } from "../data/vials";
import { Rarity, Item } from "../types";
import { getUpgradeCost } from "../engine/forge";
import { countByTemplate } from "../engine/inventory";
import { STAT_NAMES } from "../data/affixes";

export function Shop() {
  const { character, buyItem, sellItem, salvageAll, updateSettings, useVial, upgradeItem, rerollItem } = useGameStore();
  const [tab, setTab] = useState<"COMPRAR" | "VENDER" | "DESMANCHAR" | "VIALS" | "FORJA">("COMPRAR");
  const [filter, setFilter] = useState("all");
  const [actionRarity, setActionRarity] = useState<Rarity>("COMUM");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  if (!character) return null;

  const stock = getShopStock().filter(s => filter === "all" || s.kind === filter);
  const inventory = character.inventory.items.filter(i => i.category !== "COMPONENTE" && i.category !== "POCAO" && i.category !== "FRAGMENTO");

  const handleBuy = (entry: any) => {
    const res = buyItem(entry);
    if (!res.success) alert(res.error);
  };

  const handleUpgrade = () => {
    if (!selectedItem) return;
    const res = upgradeItem(selectedItem.uid);
    if (!res.success) alert(res.error);
    else {
      // Atualiza o selectedItem na tela
      const updated = character.inventory.items.find(i => i.uid === selectedItem.uid);
      if (updated) setSelectedItem(updated);
    }
  };

  const handleReroll = () => {
    if (!selectedItem) return;
    const res = rerollItem(selectedItem.uid);
    if (!res.success) alert(res.error);
    else {
      const updated = character.inventory.items.find(i => i.uid === selectedItem.uid);
      if (updated) setSelectedItem(updated);
    }
  };

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4">
        <h2 className="text-xl font-bold text-arcane-gold">Mercador Bolk & Forja</h2>
        <div className="flex bg-arcane-bg rounded-lg p-1 border border-arcane-border flex-wrap">
          <button onClick={() => setTab("COMPRAR")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "COMPRAR" ? "bg-arcane-purple text-white" : "text-gray-400"}`}>Itens</button>
          <button onClick={() => setTab("FORJA")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "FORJA" ? "bg-orange-600 text-white" : "text-gray-400"}`}>Forja</button>
          <button onClick={() => setTab("VIALS")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "VIALS" ? "bg-arcane-cyan text-black" : "text-gray-400"}`}>Vials</button>
          <button onClick={() => setTab("VENDER")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "VENDER" ? "bg-arcane-purple text-white" : "text-gray-400"}`}>Vender</button>
          <button onClick={() => setTab("DESMANCHAR")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "DESMANCHAR" ? "bg-red-800 text-white" : "text-gray-400"}`}>Desmanchar</button>
        </div>
      </div>

      {tab === "FORJA" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Itens para escolher */}
          <div className="bg-arcane-bg border border-arcane-border rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-white mb-3">Selecione um item para aprimorar</h3>
            <div className="grid grid-cols-2 gap-2">
              {inventory.map(item => (
                <div key={item.uid} onClick={() => setSelectedItem(item)} className={`border p-2 rounded cursor-pointer ${selectedItem?.uid === item.uid ? "border-orange-500 bg-orange-900/20" : "border-arcane-border hover:border-gray-500"}`}>
                  <div className="text-xl text-center">{item.icon}</div>
                  <div className="text-xs font-bold text-center truncate">{item.name}</div>
                  <div className="text-[10px] text-center text-orange-400 font-bold">+{item.upgradeLevel} {item.rarity}</div>
                </div>
              ))}
              {inventory.length === 0 && <div className="col-span-2 text-center text-gray-500 py-4">Inventário vazio</div>}
            </div>
          </div>

          {/* Painel de Forja */}
          <div className="bg-arcane-bg border-2 border-orange-900/50 rounded-lg p-4">
            {selectedItem ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-4xl">{selectedItem.icon}</div>
                  <h3 className="text-lg font-bold text-white">{selectedItem.name} <span className="text-orange-400">+{selectedItem.upgradeLevel}</span></h3>
                  <p className="text-xs text-arcane-cyan uppercase">{selectedItem.rarity} · Tier {selectedItem.tier}</p>
                </div>

                {/* Atributos Randômicos */}
                <div className="mb-4">
                  <h4 className="text-xs text-gray-400 font-bold uppercase mb-2">Atributos:</h4>
                  <div className="space-y-1">
                    {selectedItem.affixes.length > 0 ? selectedItem.affixes.map((a, i) => (
                      <div key={i} className="flex justify-between text-xs bg-arcane-panel p-1 rounded">
                        <span className="text-gray-300">{STAT_NAMES[a.stat] || a.stat}</span>
                        <span className="text-green-400 font-bold">+{a.value < 1 ? (a.value * 100).toFixed(1) + "%" : a.value}</span>
                      </div>
                    )) : <div className="text-xs text-gray-500 italic text-center">Nenhum atributo bônus</div>}
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3 mt-6 border-t border-arcane-border pt-4">
                  <button onClick={handleUpgrade} disabled={selectedItem.upgradeLevel >= 10} className="w-full bg-orange-700 hover:bg-orange-600 disabled:bg-gray-800 text-white font-bold py-2 rounded flex justify-between px-4">
                    <span>⬆️ Aprimorar Nível (+1)</span>
                    <span className="text-xs bg-black/30 px-2 py-1 rounded">{getUpgradeCost(selectedItem).gold}g + {getUpgradeCost(selectedItem).fragments} Frags</span>
                  </button>

                  <button onClick={handleReroll} disabled={selectedItem.rarity === "COMUM"} className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-800 text-white font-bold py-2 rounded flex justify-between px-4">
                    <span>🎲 Reencantar Atributos</span>
                    <span className="text-xs bg-black/30 px-2 py-1 rounded">{500 * selectedItem.tier}g + 20 Frags Raros</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-20 italic">Selecione um item ao lado para forjar.</div>
            )}
          </div>
        </div>
      )}

      {/* ... (O resto das abas COMPRAR, VENDER, DESMANCHAR, VIALS continuam iguais) ... */}
    </div>
  );
}