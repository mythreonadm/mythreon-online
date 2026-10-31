import React from "react";
import { Item, ItemStats } from "../types";
import { STAT_NAMES } from "../data/affixes";
import { getItemScore } from "../engine/itemCompare";
import { ItemIcon } from "./ItemIcon"; // NOVO
import { ELEMENTS } from "../data/elementalChart";

interface Props {
  item: Item;
  equipped?: Item;
  onEquip: () => void;
  onClose: () => void;
  onDeposit?: () => void;
  readOnly?: boolean;
}

export function ItemModal({ item, equipped, onEquip, onClose, onDeposit, readOnly = false }: Props) {
  const getTotalStat = (i: Item | undefined, statKey: keyof ItemStats) => {
    if (!i) return 0;
    let total = i.stats[statKey] || 0;
    i.affixes.forEach(a => { if (a.stat === statKey) total += a.value; });
    return total;
  };

  const isBetter = equipped ? getItemScore(item) > getItemScore(equipped) : true;
  const scoreDiff = getItemScore(item) - getItemScore(equipped);

  const renderComparisonRow = (statKey: keyof ItemStats, label: string, isPercent = false, side: "new" | "equipped" = "new") => {
    const newVal = getTotalStat(item, statKey);
    const oldVal = getTotalStat(equipped, statKey);
    const displayedValue = side === "new" ? newVal : oldVal;
    if (newVal === 0 && oldVal === 0) return null;

    const diff = newVal - oldVal;
    let diffColor = "text-gray-400";
    if (diff > 0) diffColor = "text-green-400";
    if (diff < 0) diffColor = "text-red-400";

    const format = (v: number) => {
      if (v === 0) return "0";
      return isPercent ? `${(v * 100).toFixed(1)}%` : Math.round(v).toString();
    };

    return (
      <div key={statKey} className="flex justify-between items-center py-1 border-b border-arcane-border/30 text-sm">
        <span className="text-gray-400">{label}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className="text-white">{format(displayedValue)}</span>
          {side === "new" && equipped && diff !== 0 && (
            <span className={`text-xs ${diffColor}`}>
              ({diff > 0 ? "+" : ""}{format(diff)})
            </span>
          )}
        </div>
      </div>
    );
  };

  const canEquip = !!item.slot;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-arcane-panel border-2 border-arcane-gold rounded-2xl p-6 max-w-4xl w-full shadow-2xl flex flex-col md:flex-row gap-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white font-bold text-xl z-10">✕</button>

        <div className="flex-1 bg-arcane-bg rounded-xl p-4 border border-arcane-border">
          <div className="text-center mb-4 border-b border-arcane-border pb-4">
            <div className="text-6xl mb-2 flex justify-center">
              <ItemIcon item={item} className="w-20 h-20 drop-shadow-md" />
            </div>
            <h2 className={`text-xl font-bold ${item.rarity === "LENDARIO" ? "text-arcane-gold" : item.rarity === "EPICO" ? "text-purple-400" : "text-white"}`}>
              {item.name} {item.upgradeLevel > 0 && <span className="text-orange-400">+{item.upgradeLevel}</span>}
            </h2>
            <p className="text-xs text-arcane-cyan uppercase">{item.rarity} · Tier {item.tier}</p>
            {item.element && <p className="mt-1 text-xs text-orange-300">{ELEMENTS.find(element => element.id === item.element)?.icon} {ELEMENTS.find(element => element.id === item.element)?.name} · +{Math.round((item.elementalDamagePct ?? 0) * 100)}% dano elemental</p>}
            {equipped && (
              <div className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                isBetter ? "bg-green-900/40 text-green-400 border-green-600" : "bg-red-900/40 text-red-400 border-red-700"
              }`}>
                {isBetter ? `⬆ Melhor (score +${scoreDiff.toFixed(1)})` : `⬇ Pior (score ${scoreDiff.toFixed(1)})`}
              </div>
            )}
          </div>

          <div className="space-y-1">
            {renderComparisonRow("atk", STAT_NAMES.atk)}
            {renderComparisonRow("matk", STAT_NAMES.matk)}
            {renderComparisonRow("def", STAT_NAMES.def)}
            {renderComparisonRow("arm", STAT_NAMES.arm)}
            {renderComparisonRow("hp", STAT_NAMES.hp)}
            {renderComparisonRow("mp", STAT_NAMES.mp)}
            {renderComparisonRow("crit", STAT_NAMES.crit, true)}
            {renderComparisonRow("critDmg", STAT_NAMES.critDmg, true)}
            {renderComparisonRow("hit", STAT_NAMES.hit, true)}
            {renderComparisonRow("dge", STAT_NAMES.dge, true)}
            {renderComparisonRow("blk", STAT_NAMES.blk, true)}
            {renderComparisonRow("spd", STAT_NAMES.spd, true)}
            {renderComparisonRow("resFisico", STAT_NAMES.resFisico, true)}
            {renderComparisonRow("resMagico", STAT_NAMES.resMagico, true)}
            {renderComparisonRow("hpRegen", STAT_NAMES.hpRegen)}
            {renderComparisonRow("mpRegen", STAT_NAMES.mpRegen)}
            {renderComparisonRow("luck", STAT_NAMES.luck, true)}
          </div>
        </div>

        {equipped && (
          <div className="flex-1 bg-black/40 rounded-xl p-4 border border-arcane-border/50 opacity-80">
            <div className="text-center mb-4 border-b border-arcane-border/50 pb-4">
              <div className="text-6xl mb-2 flex justify-center opacity-70 grayscale">
                <ItemIcon item={equipped} className="w-20 h-20" />
              </div>
              <h2 className="text-xl font-bold text-gray-400">
                {equipped.name} {equipped.upgradeLevel > 0 && <span>+{equipped.upgradeLevel}</span>}
              </h2>
              <p className="text-xs text-gray-500 uppercase">Atualmente Equipado</p>
            </div>
            <div className="space-y-1">
              {renderComparisonRow("atk", STAT_NAMES.atk, false, "equipped")}
              {renderComparisonRow("matk", STAT_NAMES.matk, false, "equipped")}
              {renderComparisonRow("def", STAT_NAMES.def, false, "equipped")}
              {renderComparisonRow("arm", STAT_NAMES.arm, false, "equipped")}
              {renderComparisonRow("hp", STAT_NAMES.hp, false, "equipped")}
              {renderComparisonRow("mp", STAT_NAMES.mp, false, "equipped")}
              {renderComparisonRow("crit", STAT_NAMES.crit, true, "equipped")}
              {renderComparisonRow("critDmg", STAT_NAMES.critDmg, true, "equipped")}
              {renderComparisonRow("hit", STAT_NAMES.hit, true, "equipped")}
              {renderComparisonRow("dge", STAT_NAMES.dge, true, "equipped")}
              {renderComparisonRow("blk", STAT_NAMES.blk, true, "equipped")}
              {renderComparisonRow("spd", STAT_NAMES.spd, true, "equipped")}
              {renderComparisonRow("resFisico", STAT_NAMES.resFisico, true, "equipped")}
              {renderComparisonRow("resMagico", STAT_NAMES.resMagico, true, "equipped")}
              {renderComparisonRow("hpRegen", STAT_NAMES.hpRegen, false, "equipped")}
              {renderComparisonRow("mpRegen", STAT_NAMES.mpRegen, false, "equipped")}
              {renderComparisonRow("luck", STAT_NAMES.luck, true, "equipped")}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 justify-end w-full md:w-48">
          {canEquip && !readOnly && (
            <button
              onClick={onEquip}
              className={`w-full font-bold py-3 rounded-lg shadow-lg text-lg transition-all ${
                isBetter
                  ? "bg-green-600 hover:bg-green-500 text-white ring-2 ring-green-400 ring-offset-2 ring-offset-arcane-panel"
                  : "bg-green-700 hover:bg-green-600 text-white"
              }`}
            >
              {isBetter ? "⬆ Equipar (Melhor)" : "⚔️ Equipar"}
            </button>
          )}
          
          {onDeposit && (
            <button
              onClick={onDeposit}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 rounded-lg shadow-lg"
            >
              📥 Enviar ao Depot
            </button>
          )}

          <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
