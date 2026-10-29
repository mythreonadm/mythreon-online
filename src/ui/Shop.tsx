import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getShopStock } from "../engine/shop";
import { RARITY_ORDER } from "../engine/drops";
import { VIALS } from "../data/vials";
import { Rarity, Item } from "../types";
import { getUpgradeCost } from "../engine/forge";
import { STAT_NAMES } from "../data/affixes";

export function Shop() {
  const { character, buyItem, sellItem, salvageAll, updateSettings, useVial, upgradeItem, rerollItem } = useGameStore();
  
  const [tab, setTab] = useState<"COMPRAR" | "FORJA" | "VIALS" | "VENDER" | "DESMANCHAR">("COMPRAR");
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
        <div className="flex bg-arcane-bg rounded-lg p-1 border border-arcane-border flex-wrap gap-1">
          <button onClick={() => setTab("COMPRAR")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "COMPRAR" ? "bg-arcane-purple text-white" : "text-gray-400 hover:text-white"}`}>Itens</button>
          <button onClick={() => setTab("FORJA")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "FORJA" ? "bg-orange-600 text-white" : "text-gray-400 hover:text-white"}`}>Forja</button>
          <button onClick={() => setTab("VIALS")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VIALS" ? "bg-arcane-cyan text-black" : "text-gray-400 hover:text-white"}`}>Vials</button>
          <button onClick={() => setTab("VENDER")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VENDER" ? "bg-arcane-purple text-white" : "text-gray-400 hover:text-white"}`}>Vender</button>
          <button onClick={() => setTab("DESMANCHAR")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "DESMANCHAR" ? "bg-red-800 text-white" : "text-gray-400 hover:text-white"}`}>Desmanchar</button>
        </div>
      </div>

      {tab === "COMPRAR" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "POCAO", "EQUIP", "MOCHILA"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${filter === f ? "bg-arcane-gold text-black" : "bg-arcane-bg text-gray-400"}`}>{f}</button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto pr-2">
            {stock.map(s => (
              <div key={s.id} className="bg-arcane-bg border border-arcane-border p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold flex items-center gap-2"><span>{s.icon}</span> {s.name}</div>
                  <div className="text-xs text-gray-400">{s.info}</div>
                  <div className="text-sm font-bold text-arcane-gold mt-1">💰 {s.price}</div>
                </div>
                <button onClick={() => handleBuy(s)} disabled={character.gold < s.price || character.level < s.minLevel} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-bold transition-colors">
                  {character.level < s.minLevel ? `Nv ${s.minLevel}` : "Comprar"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "VIALS" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
           {Object.values(VIALS).map(v => {
              const isActive = character.activeVials[v.id] && character.activeVials[v.id] > Date.now();
              return (
                <div key={v.id} className="bg-arcane-bg border border-arcane-border p-4 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{v.icon}</span>
                      <h3 className="font-bold text-white">{v.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{v.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4 border-t border-arcane-border/50 pt-3">
                     <span className="text-arcane-gold font-bold">💰 {v.price}</span>
                     <button 
                        onClick={() => {
                          if (character.gold < v.price) return alert("Ouro insuficiente.");
                          useVial(v); 
                        }} 
                        className={`px-4 py-1 rounded font-bold text-sm transition-colors ${isActive ? "bg-green-700 text-white hover:bg-green-600" : "bg-arcane-cyan hover:bg-cyan-400 text-black"}`}
                     >
                       {isActive ? "Renovar Buff" : "Beber"}
                     </button>
                  </div>
                </div>
              )
           })}
        </div>
      )}

      {tab === "VENDER" && (
        <>
          <div className="flex items-end gap-4 mb-4 bg-arcane-bg p-3 rounded-lg border border-arcane-border">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Auto-Vender Tudo Até:</label>
              <select value={actionRarity} onChange={e => setActionRarity(e.target.value as Rarity)} className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm">
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={() => { updateSettings({ autoSell: actionRarity }); alert("Auto-venda ativado! Itens que caírem com essa raridade ou menor serão vendidos automaticamente."); }} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold transition-colors">Auto-Vender Ativado</button>
            <span className="text-xs text-gray-500 italic ml-auto">Lendários nunca são vendidos.</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {inventory.map(item => (
              <div key={item.uid} className="bg-arcane-bg border border-arcane-border p-2 rounded-lg flex flex-col items-center">
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold text-center w-full truncate">{item.name}</div>
                <div className="text-[10px] text-gray-400 uppercase">{item.rarity}</div>
                <button onClick={() => { sellItem(item.uid); alert("Vendido!"); }} className="mt-2 w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white py-1 rounded text-xs font-bold transition-colors">Vender</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "DESMANCHAR" && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Transforme equipamentos indesejados em Fragmentos de Essência. Eles são usados para aprimorar (Forja) e encantar seus itens.</p>
          
          <div className="flex items-end gap-4 bg-arcane-bg p-4 rounded-lg border border-arcane-border">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Desmanchar Tudo Até:</label>
              <select value={actionRarity} onChange={e => setActionRarity(e.target.value as Rarity)} className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm">
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={() => { salvageAll(actionRarity); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded font-bold transition-colors">Desmanchar Itens</button>
          </div>
          
          <div className="bg-arcane-bg border border-arcane-border p-4 rounded-lg mt-6">
            <h3 className="text-white font-bold mb-2">Automação de Desmanchar</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="auto-salvage" checked={!!character.autoSalvage} onChange={(e) => { updateSettings({ autoSalvage: e.target.checked ? actionRarity : null }); }} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="auto-salvage" className="text-sm text-gray-300 cursor-pointer">Desmanchar automaticamente itens que caírem da caça.</label>
            </div>
            <p className="text-xs text-gray-500">Se ativado, itens de raridade até <strong>{actionRarity}</strong> serão quebrados em fragmentos automaticamente. Lendários nunca são desmanchados.</p>
          </div>
        </div>
      )}

      {tab === "FORJA" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Lista de Itens para escolher */}
          <div className="bg-arcane-bg border border-arcane-border rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-white mb-3">Selecione um item para aprimorar</h3>
            <div className="grid grid-cols-2 gap-2">
              {inventory.map(item => (
                <div key={item.uid} onClick={() => setSelectedItem(item)} className={`border p-2 rounded cursor-pointer transition-all ${selectedItem?.uid === item.uid ? "border-orange-500 bg-orange-900/20 scale-105" : "border-arcane-border hover:border-gray-500"}`}>
                  <div className="text-xl text-center">{item.icon}</div>
                  <div className="text-xs font-bold text-center truncate">{item.name}</div>
                  <div className="text-[10px] text-center text-orange-400 font-bold">+{item.upgradeLevel} {item.rarity}</div>
                </div>
              ))}
              {inventory.length === 0 && <div className="col-span-2 text-center text-gray-500 py-4">Inventário vazio.</div>}
            </div>
          </div>

          {/* Painel de Forja */}
          <div className="bg-arcane-bg border-2 border-orange-900/50 rounded-lg p-4">
            {selectedItem ? (
              <>
                <div className="text-center mb-4 border-b border-arcane-border pb-4">
                  <div className="text-4xl mb-2">{selectedItem.icon}</div>
                  <h3 className="text-lg font-bold text-white">{selectedItem.name} <span className="text-orange-400">+{selectedItem.upgradeLevel}</span></h3>
                  <p className="text-xs text-arcane-cyan uppercase">{selectedItem.rarity} · Tier {selectedItem.tier}</p>
                </div>

                {/* Atributos Randômicos */}
                <div className="mb-4">
                  <h4 className="text-xs text-gray-400 font-bold uppercase mb-2">Atributos Mágicos:</h4>
                  <div className="space-y-1">
                    {selectedItem.affixes.length > 0 ? selectedItem.affixes.map((a, i) => (
                      <div key={i} className="flex justify-between text-xs bg-arcane-panel p-1.5 rounded border border-arcane-border/50">
                        <span className="text-gray-300">{STAT_NAMES[a.stat] || a.stat}</span>
                        <span className="text-green-400 font-bold">+{a.value < 1 ? (a.value * 100).toFixed(1) + "%" : a.value}</span>
                      </div>
                    )) : <div className="text-xs text-gray-500 italic text-center py-2">Nenhum atributo bônus mágico.</div>}
                  </div>
                </div>

                {/* Ações */}
                <div className="space-y-3 mt-6 border-t border-arcane-border pt-4">
                  <button onClick={handleUpgrade} disabled={selectedItem.upgradeLevel >= 10} className="w-full bg-orange-700 hover:bg-orange-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-2.5 rounded flex justify-between items-center px-4 transition-colors">
                    <span>⬆️ Aprimorar Nível (+1)</span>
                    <span className="text-[10px] bg-black/40 px-2 py-1 rounded">{getUpgradeCost(selectedItem).gold}g + {getUpgradeCost(selectedItem).fragments} Frags</span>
                  </button>

                  <button onClick={handleReroll} disabled={selectedItem.rarity === "COMUM"} className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-2.5 rounded flex justify-between items-center px-4 transition-colors">
                    <span>🎲 Reencantar Atributos</span>
                    <span className="text-[10px] bg-black/40 px-2 py-1 rounded">{500 * selectedItem.tier}g + 20 Frags Raros</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-24 italic flex flex-col items-center">
                <span className="text-4xl mb-4 opacity-50">🔨</span>
                Selecione um item ao lado para forjar.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}