import { RARITY_FRAME } from './itemRarity';
import React, { useState, useMemo } from "react";
import { useGameStore } from "../store/gameStore";
import { getUsedSlots } from "../engine/inventory";
import { getItemScore, isUpgrade, getEquippedForTarget } from "../engine/itemCompare";
import { ItemModal } from "./ItemModal";
import { ItemIcon } from "./ItemIcon"; // NOVO
import { Item, Rarity } from "../types";
import { sellValue } from "../engine/shop";
import { onlineAction, useOnlineState } from "../online/controller";


const RARITY_ORDER: Record<Rarity, number> = {
  COMUM: 0, INCOMUM: 1, RARO: 2, EPICO: 3, LENDARIO: 4,
};

type SortBy = "rarity" | "score" | "name";

export function Backpack() {
  const { character, equip, discardItem, depositItem, depositMany, sellSelected, activateCosmetic } = useGameStore();
  const online = useOnlineState(state => state.active);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rarity");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedUids, setSelectedUids] = useState<string[]>([]);

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
      const result = discardItem(uid);
      if (!result.success) alert(result.error);
    }
  };

  const handleConfirmEquip = () => {
    if (!selectedItem) return;
    const current = selectedItem.slot === "BACKPACK" ? character.equipped.BACKPACK : undefined;
    if (current && (selectedItem.slots ?? 0) <= (current.slots ?? character.inventory.backpack.slots)) {
      const confirmed = window.confirm(`Você está usando uma mochila igual ou melhor. Deseja confirmar a troca mesmo assim?\n\nAtual: ${current.name} (${current.slots ?? 0} espaços)\nNova: ${selectedItem.name} (${selectedItem.slots ?? 0} espaços)`);
      if (!confirmed) return;
    }
    const res = equip(selectedItem.uid, !!current);
    if (res.success) setSelectedItem(null);
    else alert(res.error);
  };

  const handleDeposit = () => {
    if (!selectedItem) return;
    const res = depositItem(selectedItem.uid);
    if (res.success) setSelectedItem(null);
    else alert(res.error);
  };

  const toggleSelect = (uid: string) => {
    setSelectedUids(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  const selectAll = () => setSelectedUids(filtered.map(i => i.uid));
  const selectAllForSale = () => setSelectedUids(filtered.filter(i => i.category !== "COMPONENTE" && i.category !== "FRAGMENTO" && i.category !== "POCAO").map(i => i.uid));
  const clearSelection = () => setSelectedUids([]);

  const handleBulkSell = () => {
    const items = character.inventory.items.filter(i => selectedUids.includes(i.uid));
    if (!items.length) return;
    const total = items.reduce((sum, item) => sum + sellValue(item) * item.quantity, 0);
    if (!window.confirm(`Vender ${items.length} itens selecionados por aproximadamente ${total.toLocaleString("pt-BR")} gold?`)) return;
    sellSelected(selectedUids);
    setSelectedUids([]);
  };

  const handleBulkDeposit = () => {
    if (selectedUids.length === 0) return;
    const res = depositMany(selectedUids);
    if (res.moved > 0) {
      setSelectedUids([]);
      if (res.error) alert(res.error);
    } else {
      alert(res.error || "Nenhum item movido.");
    }
  };

  const equipBestPowerItems = async () => {
    if (!window.confirm("Equipar todos os itens de maior potência disponíveis, um por slot? Essa escolha considera uma pontuação geral e pode não combinar com os atributos da sua build.")) return;

    let equippedCount = 0;
    const inventory = [...character.inventory.items].filter(item => item.slot);
    const equipOne = async (uid: string) => {
      if (online) {
        const response = await onlineAction('world.command', { action: 'equip', args: [uid, false] });
        return response?.result?.success !== false;
      }
      return useGameStore.getState().equip(uid).success;
    };

    // Cada slot recebe o melhor candidato disponível. O estado é lido novamente
    // após cada operação para que a troca anterior já entre no próximo cálculo.
    const regularSlots = [...new Set(inventory.map(item => item.slot).filter((slot): slot is NonNullable<typeof slot> => !!slot && slot !== "ANEL_I"))];
    for (const slot of regularSlots) {
      const best = inventory.filter(item => item.slot === slot).sort((a, b) => getItemScore(b) - getItemScore(a))[0];
      const current = useGameStore.getState().character;
      if (!best || !current) continue;
      const isBetterBackpack = slot === "BACKPACK" && (best.slots ?? 0) > current.inventory.backpack.slots;
      const isBetterEquipment = slot !== "BACKPACK" && getItemScore(best) > getItemScore(current.equipped[slot]);
      if ((isBetterBackpack || isBetterEquipment) && await equipOne(best.uid)) equippedCount++;
    }

    // Anéis usam dois slots: os melhores dois anéis da mochila são avaliados
    // separadamente, respeitando o slot vazio ou o anel de menor potência.
    const ringCandidates = inventory.filter(item => item.slot === "ANEL_I").sort((a, b) => getItemScore(b) - getItemScore(a));
    for (const ring of ringCandidates) {
      const current = useGameStore.getState().character;
      if (!current) continue;
      const ringSlot = !current.equipped.ANEL_I ? "ANEL_I" : !current.equipped.ANEL_II ? "ANEL_II" : getItemScore(current.equipped.ANEL_I) <= getItemScore(current.equipped.ANEL_II) ? "ANEL_I" : "ANEL_II";
      if (getItemScore(ring) <= getItemScore(current.equipped[ringSlot])) continue;
      if (await equipOne(ring.uid)) equippedCount++;
    }

    alert(equippedCount ? `${equippedCount} item(ns) de maior potência equipado(s), incluindo todos os slots disponíveis. Revise a sinergia dos atributos da sua build.` : "Nenhum item da mochila superou o equipamento atual por potência estimada.");
  };

  const equippedItem = selectedItem ? getEquippedForTarget(character, selectedItem) : undefined;

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-4 md:p-6 shadow-lg relative pb-20">
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          equipped={equippedItem}
          onEquip={handleConfirmEquip}
          onDeposit={handleDeposit}
          onActivateCosmetic={() => { const result = activateCosmetic(selectedItem.templateId); if (result.success) setSelectedItem(null); else alert(result.error); }}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-arcane-gold">🎒 Backpack</h2>
          <span className={`rounded px-2 py-1 text-xs font-bold ${used >= total ? "bg-red-900/70 text-red-200" : used >= total - 3 ? "bg-yellow-900/60 text-yellow-200" : "bg-black/30 text-gray-400"}`}>{used}/{total} espaços{used >= total ? " · CHEIA" : ""}</span>
          <button onClick={selectAll} className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded">Selecionar Tudo</button>
          <button onClick={selectAllForSale} className="text-xs bg-emerald-800 hover:bg-emerald-700 border border-emerald-500/40 text-white px-2 py-1 rounded font-bold">Selecionar todos para vender</button>
          <button onClick={equipBestPowerItems} title="Equipa automaticamente o melhor item disponível em cada slot." className="text-xs bg-emerald-800 hover:bg-emerald-700 border border-emerald-500/40 text-white px-3 py-1.5 rounded font-bold">⚡ Equipar todos os itens de maior potência</button>
        </div>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="text-gray-400">Bolsa:</span>
          <span className="font-bold text-white">{character.inventory.backpack.name}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${used >= total ? "bg-red-900 text-white" : "bg-arcane-border"}`}>
            {used}/{total}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-3 flex-wrap">
        {["all", "ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "COMPONENTE", "FRAGMENTO", "POCAO", "BACKPACK"].map(f => (
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
            const isSelected = selectedUids.includes(item.uid);
            
            return (
              <div
                key={item.uid}
                onClick={() => setSelectedItem(item)}
                className={`relative bg-arcane-bg border-2 rounded-lg p-2 flex flex-col items-center justify-center transition-all cursor-pointer hover:-translate-y-1 group ${RARITY_FRAME[item.rarity]} ${isSelected ? "ring-2 ring-blue-500 bg-blue-900/30" : "hover:border-arcane-gold"}`}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(item.uid); }}
                  className={`absolute top-1 left-1 w-5 h-5 rounded border flex items-center justify-center text-xs z-20 transition-colors ${isSelected ? "bg-blue-500 border-blue-400 text-white" : "bg-black/50 border-gray-500 text-transparent hover:border-white"}`}
                >
                  ✓
                </button>

                {better && (
                  <div className="absolute -top-1.5 right-1 bg-green-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg z-10 whitespace-nowrap">
                    ⬆ TOP
                  </div>
                )}

                <button
                  onClick={e => handleDiscard(e, item.uid)}
                  className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 bg-red-600 hover:bg-red-500 text-white rounded w-5 h-5 flex items-center justify-center text-[10px] transition-opacity z-10"
                  title="Jogar Fora"
                >
                  🗑️
                </button>

                <div className="mb-1 flex justify-center">
                  <ItemIcon item={item} className="w-24 h-24 md:w-28 md:h-28 drop-shadow-md" />
                </div>
                <div className="text-xs text-center truncate w-full font-bold" title={item.name}>{item.name}</div>
                {item.upgradeLevel > 0 && <div className="text-[10px] text-orange-400 font-bold">+{item.upgradeLevel}</div>}
                {item.quantity > 1 && <div className="text-xs font-bold text-arcane-gold mt-1">x{item.quantity}</div>}
              </div>
            );
          })}
        </div>
      )}

      {selectedUids.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-arcane-panel border-2 border-blue-500 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] p-3 flex items-center gap-4 z-50">
          <span className="text-white font-bold whitespace-nowrap">{selectedUids.length} itens selecionados</span>
          <div className="flex gap-2">
            <button onClick={handleBulkDeposit} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow">
              📥 Enviar ao Depot
            </button>
            <button onClick={handleBulkSell} className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow">
              💰 Vender selecionados
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
