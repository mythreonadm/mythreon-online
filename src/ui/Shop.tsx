import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getShopStock } from "../engine/shop";
import { RARITY_ORDER } from "../engine/drops";
import { VIALS } from "../data/vials";
import { Rarity } from "../types";

export function Shop() {
  const { character, buyItem, sellItem, salvageAll, updateSettings, useVial } = useGameStore();
  const [tab, setTab] = useState<"COMPRAR" | "VENDER" | "DESMANCHAR" | "VIALS">("COMPRAR");
  const [filter, setFilter] = useState("all");
  const [actionRarity, setActionRarity] = useState<Rarity>("COMUM");

  if (!character) return null;

  const stock = getShopStock().filter(s => filter === "all" || s.kind === filter);
  const inventory = character.inventory.items.filter(i => i.category !== "COMPONENTE" && i.category !== "POCAO" && i.category !== "FRAGMENTO");

  const handleBuy = (entry: any) => {
    const res = buyItem(entry);
    if (!res.success) alert(res.error);
  };

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4">
        <h2 className="text-xl font-bold text-arcane-gold">Mercador Bolk</h2>
        <div className="flex bg-arcane-bg rounded-lg p-1 border border-arcane-border flex-wrap">
          <button onClick={() => setTab("COMPRAR")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "COMPRAR" ? "bg-arcane-purple text-white" : "text-gray-400"}`}>Itens</button>
          <button onClick={() => setTab("VIALS")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "VIALS" ? "bg-arcane-cyan text-black" : "text-gray-400"}`}>Vials (Buffs)</button>
          <button onClick={() => setTab("VENDER")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "VENDER" ? "bg-arcane-purple text-white" : "text-gray-400"}`}>Vender</button>
          <button onClick={() => setTab("DESMANCHAR")} className={`px-3 py-1 text-sm font-bold rounded ${tab === "DESMANCHAR" ? "bg-red-800 text-white" : "text-gray-400"}`}>Desmanchar</button>
        </div>
      </div>

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
                        className={`px-4 py-1 rounded font-bold text-sm ${isActive ? "bg-green-700 text-white" : "bg-arcane-cyan hover:bg-cyan-500 text-black"}`}
                     >
                       {isActive ? "Renovar Buff" : "Beber"}
                     </button>
                  </div>
                </div>
              )
           })}
        </div>
      )}

      {tab === "COMPRAR" && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {["all", "POCAO", "EQUIP", "MOCHILA"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-xs rounded-full font-bold ${filter === f ? "bg-arcane-gold text-black" : "bg-arcane-bg text-gray-400"}`}>{f}</button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {stock.map(s => (
              <div key={s.id} className="bg-arcane-bg border border-arcane-border p-3 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold flex items-center gap-2"><span>{s.icon}</span> {s.name}</div>
                  <div className="text-xs text-gray-400">{s.info}</div>
                  <div className="text-sm font-bold text-arcane-gold mt-1">💰 {s.price}</div>
                </div>
                <button onClick={() => handleBuy(s)} disabled={character.gold < s.price || character.level < s.minLevel} className="bg-green-700 hover:bg-green-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-bold">
                  {character.level < s.minLevel ? `Nv ${s.minLevel}` : "Comprar"}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "VENDER" && (
        <>
          <div className="flex items-end gap-4 mb-4 bg-arcane-bg p-3 rounded-lg border border-arcane-border">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Vender Tudo Até:</label>
              <select value={actionRarity} onChange={e => setActionRarity(e.target.value as Rarity)} className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm">
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={() => { updateSettings({ autoSell: actionRarity }); alert("Auto-venda ativado!"); }} className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-bold">Auto-Vender daqui pra frente</button>
            <span className="text-xs text-gray-500 italic ml-auto">Lendários protegidos.</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {inventory.map(item => (
              <div key={item.uid} className="bg-arcane-bg border border-arcane-border p-2 rounded-lg flex flex-col items-center">
                <div className="text-3xl mb-1">{item.icon}</div>
                <div className="text-xs font-bold text-center w-full truncate">{item.name}</div>
                <div className="text-[10px] text-gray-400 uppercase">{item.rarity}</div>
                <button onClick={() => { sellItem(item.uid); alert("Vendido!"); }} className="mt-2 w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white py-1 rounded text-xs font-bold">Vender</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "DESMANCHAR" && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Transforme equipamentos indesejados em Fragmentos de Essência. Eles serão úteis para Encantamento e Forja no futuro.</p>
          
          <div className="flex items-end gap-4 bg-arcane-bg p-4 rounded-lg border border-arcane-border">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Desmanchar Tudo Até:</label>
              <select value={actionRarity} onChange={e => setActionRarity(e.target.value as Rarity)} className="bg-arcane-panel border border-arcane-border rounded px-2 py-1 text-white text-sm">
                {RARITY_ORDER.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button onClick={() => { salvageAll(actionRarity); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-1.5 rounded font-bold">Desmanchar Itens</button>
          </div>
          
          <div className="bg-arcane-bg border border-arcane-border p-4 rounded-lg mt-6">
            <h3 className="text-white font-bold mb-2">Automação de Desmanchar</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="auto-salvage" checked={!!character.autoSalvage} onChange={(e) => { updateSettings({ autoSalvage: e.target.checked ? actionRarity : null }); }} />
              <label htmlFor="auto-salvage" className="text-sm text-gray-300">Desmanchar automaticamente itens que caírem da caça.</label>
            </div>
            <p className="text-xs text-gray-500">Se ativado, itens de raridade até <strong>{actionRarity}</strong> serão quebrados em fragmentos automaticamente. Lendários nunca são desmanchados.</p>
          </div>
        </div>
      )}
    </div>
  );
}