import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { sellValue } from "../engine/shop";
import { RARITY_ORDER } from "../engine/drops";
import { VIALS } from "../data/vials";
import { Rarity, Item } from "../types";
import { getUpgradeCost } from "../engine/forge";
import { STAT_NAMES } from "../data/affixes";
import { QuantityModal } from "./QuantityModal";
import { ItemIcon } from "./ItemIcon";
import { ALL_EQUIPMENT_TEMPLATES } from "../data/items";

export function Shop() {
  const { character, sellItem, salvageAll, salvageSelected, updateSettings, useVial, upgradeItem, rerollItem } = useGameStore();
  
  const [tab, setTab] = useState<"FORJA" | "VIALS" | "VENDER" | "DESMANCHAR">("FORJA");
  const [actionRarity, setActionRarity] = useState<Rarity>("COMUM");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [salvageSelection, setSalvageSelection] = useState<string[]>([]);
  
  // Estado do Modal de Quantidade
  const [qtyModal, setQtyModal] = useState<{ open: boolean, item: Item, action: "SELL", max: number } | null>(null);

  if (!character) return null;

  const inventory = character.inventory.items.filter(i => i.category !== "COMPONENTE" && i.category !== "FRAGMENTO");
  const forgeInventory = inventory.filter(i => i.category !== "POCAO");
  const salvageable = character.inventory.items.filter(i => ["ARMA", "ARMADURA", "JOIA", "ESCUDO"].includes(i.category));
  const selectedSalvageItems = salvageable.filter(i => salvageSelection.includes(i.uid));
  const salvagePreview = selectedSalvageItems.reduce((total, item) => total + (item.rarity === "RARO" ? 2 : item.rarity === "EPICO" || item.rarity === "LENDARIO" ? 3 : 1) * item.quantity, 0);

  // ─── HANDLERS VENDER ───
  const handleSellClick = (item: Item) => {
    if (item.quantity > 1) {
      setQtyModal({ open: true, item, action: "SELL", max: item.quantity });
    } else {
      sellItem(item.uid, 1); 
      alert("Vendido!");
    }
  };

  // ─── CONFIRMAR AÇÃO DO MODAL ───
  const confirmQtyAction = (qty: number) => {
    if (!qtyModal) return;
    
    sellItem(qtyModal.item.uid, qty);
    alert(`Vendidos ${qty}x ${qtyModal.item.name}!`);
    setQtyModal(null);
  };

  // ─── FORJA ───
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
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg relative">
      
      {/* MODAL DE QUANTIDADE */}
      {qtyModal && (
        <QuantityModal 
          title={`Vender ${qtyModal.item.name}`}
          maxQty={qtyModal.max}
          onConfirm={confirmQtyAction}
          onCancel={() => setQtyModal(null)}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4">
        <div><h2 className="text-xl font-bold text-arcane-gold">Ferreiro de Mythreon</h2><p className="text-xs text-gray-500">Aprimore, negocie e recupere a Essência dos seus drops.</p></div>
        <div className="rounded-lg border border-arcane-gold/25 bg-black/20 px-3 py-2 text-sm font-bold text-arcane-gold">💰 {character.gold.toLocaleString("pt-BR")} gold</div>
        <div className="flex bg-arcane-bg rounded-lg p-1 border border-arcane-border flex-wrap gap-1">
          <button onClick={() => setTab("FORJA")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "FORJA" ? "bg-orange-600 text-white" : "text-gray-400 hover:text-white"}`}>Forja</button>
          <button onClick={() => setTab("VIALS")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VIALS" ? "bg-arcane-cyan text-black" : "text-gray-400 hover:text-white"}`}>Elixires</button>
          <button onClick={() => setTab("VENDER")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VENDER" ? "bg-arcane-purple text-white" : "text-gray-400 hover:text-white"}`}>Vender</button>
          <button onClick={() => setTab("DESMANCHAR")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "DESMANCHAR" ? "bg-red-800 text-white" : "text-gray-400 hover:text-white"}`}>Desmanchar</button>
        </div>
      </div>

      {/* ─── ABA VIALS ─── */}
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

      {/* ─── ABA VENDER ─── */}
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
          <AutoItemRules title="Vender automaticamente estes itens" items={Object.values(ALL_EQUIPMENT_TEMPLATES)} selectedIds={character.autoSellTemplateIds ?? []} onChange={autoSellTemplateIds => updateSettings({ autoSellTemplateIds })} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
            {inventory.map(item => (
              <div key={item.uid} className="bg-arcane-bg border border-arcane-border p-2 rounded-lg flex flex-col items-center">
                <ItemIcon item={item} className="w-12 h-12 mb-1" />
                <div className="text-xs font-bold text-center w-full truncate">{item.name}</div>
                <div className="text-[10px] text-gray-400 uppercase">{item.rarity}</div>
                {item.quantity > 1 && <div className="text-[10px] text-arcane-gold font-bold">x{item.quantity}</div>}
                <div className="text-[10px] text-emerald-300 font-bold mt-1">💰 {sellValue(item).toLocaleString()} gold cada</div>
                {item.quantity > 1 && <div className="text-[9px] text-emerald-500/80">Total: {(sellValue(item) * item.quantity).toLocaleString()} gold</div>}
                <button onClick={() => handleSellClick(item)} className="mt-2 w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white py-1 rounded text-xs font-bold transition-colors">Vender</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── ABA DESMANCHAR ─── */}
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

          <section className="bg-arcane-bg/70 border border-arcane-border rounded-lg p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-white font-bold">Desmontagem seletiva</h3>
                <p className="text-xs text-gray-400">Marque somente os equipamentos que deseja transformar em fragmentos.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSalvageSelection(salvageable.map(i => i.uid))} className="text-xs px-3 py-1.5 rounded bg-arcane-panel text-arcane-cyan border border-arcane-border">Selecionar todos</button>
                <button onClick={() => setSalvageSelection([])} className="text-xs px-3 py-1.5 rounded bg-arcane-panel text-gray-300 border border-arcane-border">Limpar</button>
              </div>
            </div>
            {salvageable.length ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              {salvageable.map(item => <label key={item.uid} className={`flex items-center gap-3 p-2 rounded border cursor-pointer ${salvageSelection.includes(item.uid) ? "border-red-500/70 bg-red-950/20" : "border-arcane-border bg-arcane-panel"}`}>
                <input type="checkbox" checked={salvageSelection.includes(item.uid)} onChange={e => setSalvageSelection(current => e.target.checked ? [...current, item.uid] : current.filter(uid => uid !== item.uid))} />
                <ItemIcon item={item} className="w-10 h-10 shrink-0" />
                <span className="min-w-0"><span className="block text-xs text-white font-bold truncate">{item.name}</span><span className="text-[10px] text-gray-400">{item.rarity} · {item.quantity > 1 ? `x${item.quantity}` : "1 unidade"}</span></span>
              </label>)}
            </div> : <p className="text-sm text-gray-500 py-4 text-center">Nenhum equipamento disponível para desmontagem.</p>}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-arcane-border">
              <span className="text-xs text-gray-300">{selectedSalvageItems.length} selecionado(s) · até {salvagePreview} fragmentos</span>
              <button disabled={!selectedSalvageItems.length} onClick={() => {
                if (selectedSalvageItems.some(item => item.rarity === "LENDARIO") && !window.confirm("Você selecionou equipamento LENDÁRIO. Deseja realmente desmontá-lo?")) return;
                salvageSelected(salvageSelection); setSalvageSelection([]);
              }} className="bg-red-700 hover:bg-red-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-4 py-2 rounded font-bold text-sm">Desmanchar selecionados</button>
            </div>
          </section>
          
          <div className="bg-arcane-bg border border-arcane-border p-4 rounded-lg mt-6">
            <h3 className="text-white font-bold mb-2">Automação de Desmanchar</h3>
            <div className="flex items-center gap-2 mb-2">
              <input type="checkbox" id="auto-salvage" checked={!!character.autoSalvage} onChange={(e) => { updateSettings({ autoSalvage: e.target.checked ? actionRarity : null }); }} className="w-4 h-4 cursor-pointer" />
              <label htmlFor="auto-salvage" className="text-sm text-gray-300 cursor-pointer">Desmanchar automaticamente itens que caírem da caça.</label>
            </div>
            <p className="text-xs text-gray-500">Se ativado, itens de raridade até <strong>{actionRarity}</strong> serão quebrados em fragmentos automaticamente. Lendários nunca são desmanchados.</p>
            <AutoItemRules title="Desmanchar automaticamente estes itens" items={Object.values(ALL_EQUIPMENT_TEMPLATES)} selectedIds={character.autoSalvageTemplateIds ?? []} onChange={autoSalvageTemplateIds => updateSettings({ autoSalvageTemplateIds })} />
          </div>
        </div>
      )}

      {/* ─── ABA FORJA ─── */}
      {tab === "FORJA" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-arcane-bg border border-arcane-border rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-white mb-3">Selecione um item para aprimorar</h3>
            <div className="grid grid-cols-2 gap-2">
              {forgeInventory.map(item => (
                <div key={item.uid} onClick={() => setSelectedItem(item)} className={`border p-2 rounded cursor-pointer transition-all ${selectedItem?.uid === item.uid ? "border-orange-500 bg-orange-900/20 scale-105" : "border-arcane-border hover:border-gray-500"}`}>
                  <ItemIcon item={item} className="w-10 h-10 mx-auto" />
                  <div className="text-xs font-bold text-center truncate">{item.name}</div>
                  <div className="text-[10px] text-center text-orange-400 font-bold">+{item.upgradeLevel} {item.rarity}</div>
                </div>
              ))}
              {forgeInventory.length === 0 && <div className="col-span-2 text-center text-gray-500 py-4">Nenhum equipamento disponível para forjar.</div>}
            </div>
          </div>

          <div className="bg-arcane-bg border-2 border-orange-900/50 rounded-lg p-4">
            {selectedItem ? (
              <>
                <div className="text-center mb-4 border-b border-arcane-border pb-4">
                  <ItemIcon item={selectedItem} className="w-16 h-16 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white">{selectedItem.name} <span className="text-orange-400">+{selectedItem.upgradeLevel}</span></h3>
                  <p className="text-xs text-arcane-cyan uppercase">{selectedItem.rarity} · Tier {selectedItem.tier}</p>
                </div>

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

                <div className="space-y-3 mt-6 border-t border-arcane-border pt-4">
                  {/* AVISO IMPORTANTE */}
                  <div className="text-[10px] text-yellow-500 text-center mb-2 bg-yellow-900/20 p-1.5 rounded border border-yellow-900/30">
                    ⚠️ Os stats do personagem só mudam se o item estiver EQUIPADO.
                  </div>

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

function AutoItemRules({ title, items, selectedIds, onChange }: { title: string; items: Item[]; selectedIds: string[]; onChange: (ids: string[]) => void }) {
  const [search, setSearch] = useState("");
  const filtered = items.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  return <section className="my-3 rounded-lg border border-arcane-border bg-black/20 p-3">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><div><h4 className="text-sm font-bold text-white">{title}</h4><p className="text-[10px] text-gray-500">Regras por item se somam à regra geral por raridade.</p></div><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar equipamento" className="rounded border border-arcane-border bg-arcane-bg px-2 py-1 text-xs text-white" /></div>
    <div className="grid max-h-44 grid-cols-2 gap-1 overflow-y-auto sm:grid-cols-3">{filtered.map(item => <label key={item.templateId} title={`${item.name} · ${item.rarity}`} className="flex cursor-pointer items-center gap-1.5 rounded border border-white/5 bg-arcane-bg/70 p-1.5 hover:border-arcane-gold/40"><input type="checkbox" checked={selectedIds.includes(item.templateId)} onChange={event => onChange(event.target.checked ? [...new Set([...selectedIds, item.templateId])] : selectedIds.filter(id => id !== item.templateId))} className="accent-arcane-gold" /><ItemIcon item={item} className="h-7 w-7 shrink-0" /><span className="truncate text-[10px] text-gray-200">{item.name}</span></label>)}</div>
    <p className="mt-2 text-[10px] text-arcane-cyan">{selectedIds.length} regra(s) de item ativa(s)</p>
  </section>;
}
