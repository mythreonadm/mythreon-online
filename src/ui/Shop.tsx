import React, { useState } from "react";
import { useGameStore } from "../store/gameStore";
import { getShopStock } from "../engine/shop";
import { RARITY_ORDER } from "../engine/drops";
import { VIALS } from "../data/vials";
import { Rarity, Item } from "../types";
import { getUpgradeCost } from "../engine/forge";
import { STAT_NAMES } from "../data/affixes";
import { QuantityModal } from "./QuantityModal"; // IMPORTANDO O MODAL

export function Shop() {
  const { character, buyItem, sellItem, salvageAll, updateSettings, useVial, upgradeItem, rerollItem } = useGameStore();
  
  const [tab, setTab] = useState<"COMPRAR" | "FORJA" | "VIALS" | "VENDER" | "DESMANCHAR">("COMPRAR");
  const [filter, setFilter] = useState("all");
  const [actionRarity, setActionRarity] = useState<Rarity>("COMUM");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  
  // ESTADO PARA O MODAL DE QUANTIDADE
  const [qtyModal, setQtyModal] = useState<{ open: boolean, item: any, action: "BUY" | "SELL", max: number } | null>(null);

  if (!character) return null;

  const stock = getShopStock().filter(s => filter === "all" || s.kind === filter);
  const inventory = character.inventory.items.filter(i => i.category !== "COMPONENTE" && i.category !== "POCAO" && i.category !== "FRAGMENTO");

  const handleBuyClick = (entry: any) => {
    // Se for poção, abre o modal de quantidade. Senão, compra 1.
    if (entry.kind === "POCAO") {
      setQtyModal({ open: true, item: entry, action: "BUY", max: 99 });
    } else {
      const res = buyItem(entry, 1);
      if (!res.success) alert(res.error);
    }
  };

  const handleSellClick = (item: Item) => {
    if (item.quantity > 1) {
      setQtyModal({ open: true, item, action: "SELL", max: item.quantity });
    } else {
      sellItem(item.uid, 1); 
      alert("Vendido!");
    }
  };

  const confirmQtyAction = (qty: number) => {
    if (!qtyModal) return;
    
    if (qtyModal.action === "BUY") {
      const res = buyItem(qtyModal.item, qty);
      if (!res.success) alert(res.error);
    } else {
      sellItem(qtyModal.item.uid, qty);
      alert(`Vendidos ${qty}x ${qtyModal.item.name}!`);
    }
    setQtyModal(null);
  };

  // ... (handleUpgrade e handleReroll mantidos iguais)

  return (
    <div className="bg-arcane-panel border border-arcane-border rounded-xl p-6 shadow-lg relative">
      
      {/* MODAL DE QUANTIDADE */}
      {qtyModal && (
        <QuantityModal 
          title={qtyModal.action === "BUY" ? `Comprar ${qtyModal.item.name}` : `Vender ${qtyModal.item.name}`}
          maxQty={qtyModal.max}
          onConfirm={confirmQtyAction}
          onCancel={() => setQtyModal(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6 border-b border-arcane-border pb-4">
        {/* ... (Header e abas mantidos) ... */}
      </div>

      {tab === "COMPRAR" && (
        // ...
        // Na listagem:
        <button onClick={() => handleBuyClick(s)} ...>
          Comprar
        </button>
      )}
      
      {tab === "VENDER" && (
        // ...
        // Na listagem:
        <button onClick={() => handleSellClick(item)} ...>
          Vender
        </button>
      )}

      {/* ... (Resto das abas mantidas) */}
    </div>
  );
}