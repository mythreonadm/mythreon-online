import { confirmedAction } from "../online/confirmation";
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
import { countByTemplate } from "../engine/inventory";
import { MYTHREON_ECONOMY, MYTHREON_OFFERS, MYTHREON_DONATION_PACKS, MYTHREON_PREMIUM_PLANS, PREMIUM_BENEFITS } from "../data/mythreonEconomy";
import { OnlineMarket } from "./OnlineMarket";

export function Shop({ storefront = false }: { storefront?: boolean }) {
  const { character, sellItem, salvageAll, salvageSelected, updateSettings, useVial, upgradeItem, rerollItem, elevateItemTier, rerollSpecificAffix, forgeFragments, refineMythreonCoins, buyMythreonOffer, buyMythreonBoost, openMythreonRoulette } = useGameStore();
  
  const [tab, setTab] = useState<"FORJA" | "VIALS" | "VENDER" | "DESMANCHAR" | "ESSENCIA" | "MERCADO">(storefront ? "VIALS" : "FORJA");
  const [actionRarity, setActionRarity] = useState<Rarity>("COMUM");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [specificStat, setSpecificStat] = useState<keyof Item["stats"]>("atk");
  const [salvageSelection, setSalvageSelection] = useState<string[]>([]);
  const [shopNotice, setShopNotice] = useState("");
  const checkoutUrl = (import.meta.env.VITE_MYTHREON_CHECKOUT_URL as string | undefined)?.trim();
  
  // Estado do Modal de Quantidade
  const [qtyModal, setQtyModal] = useState<{ open: boolean, item: Item, action: "SELL", max: number } | null>(null);

  if (!character) return null;

  const inventory = character.inventory.items.filter(i => i.category !== "COMPONENTE" && i.category !== "FRAGMENTO");
  const forgeInventory = inventory.filter(i => ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(i.category));
  const salvageable = character.inventory.items.filter(i => ["ARMA", "ARMADURA", "JOIA", "PULSEIRA", "ESCUDO", "FLECHA"].includes(i.category));
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
  const handleUpgrade = async () => {
    if (!selectedItem) return;
    const res = await confirmedAction(upgradeItem(selectedItem.uid));
    if (!res.success) alert(res.error);
    else {
      const updated = useGameStore.getState().character?.inventory.items.find(i => i.uid === selectedItem.uid);
      if (updated) setSelectedItem(updated);
    }
  };

  const handleReroll = async () => {
    if (!selectedItem) return;
    const res = await confirmedAction(rerollItem(selectedItem.uid));
    if (!res.success) alert(res.error);
    else {
      const updated = useGameStore.getState().character?.inventory.items.find(i => i.uid === selectedItem.uid);
      if (updated) setSelectedItem(updated);
    }
  };

  const handleTier = async () => {
    if (!selectedItem) return;
    const res = await confirmedAction(elevateItemTier(selectedItem.uid));
    if (!res.success) alert(res.error);
    else setSelectedItem(useGameStore.getState().character?.inventory.items.find(i => i.uid === selectedItem.uid) ?? selectedItem);
  };

  const handleSpecificReroll = async () => {
    if (!selectedItem) return;
    const res = await confirmedAction(rerollSpecificAffix(selectedItem.uid, specificStat));
    if (!res.success) alert(res.error);
    else setSelectedItem(useGameStore.getState().character?.inventory.items.find(i => i.uid === selectedItem.uid) ?? selectedItem);
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
        <div><h2 className="text-xl font-bold text-arcane-gold">{storefront ? "Loja Mythreon" : "Ferreiro de Mythreon"}</h2><p className="text-xs text-gray-500">{storefront ? "Apoie o mundo, escolha seus cosméticos e acelere sua jornada com equilíbrio." : "Aprimore, negocie e recupere a Essência dos seus drops."}</p></div>
        {storefront && <div className="flex flex-wrap gap-2 text-xs font-bold"><span className="rounded border border-cyan-600/50 bg-cyan-950/30 px-2 py-1 text-cyan-200">🔷 {character.mythreonShards ?? 0} Shards</span><span className="rounded border border-fuchsia-600/50 bg-fuchsia-950/30 px-2 py-1 text-fuchsia-200">🪙 {character.mythreonCoins ?? 0} Coins</span></div>}
        <div className="rounded-lg border border-arcane-gold/25 bg-black/20 px-3 py-2 text-sm font-bold text-arcane-gold">💰 {character.gold.toLocaleString("pt-BR")} gold</div>
        <div className="flex bg-arcane-bg rounded-lg p-1 border border-arcane-border flex-wrap gap-1">
          {!storefront && <button onClick={() => setTab("FORJA")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "FORJA" ? "bg-orange-600 text-white" : "text-gray-400 hover:text-white"}`}>Forja</button>}
          {storefront && <button onClick={() => setTab("VIALS")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VIALS" ? "bg-arcane-cyan text-black" : "text-gray-400 hover:text-white"}`}>Elixires</button>}
          {storefront && <button onClick={() => setTab("ESSENCIA")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "ESSENCIA" ? "bg-fuchsia-600 text-white" : "text-gray-400 hover:text-white"}`}>Loja Mythreon</button>}
          {storefront && <button onClick={() => setTab("MERCADO")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "MERCADO" ? "bg-rose-700 text-white" : "text-gray-400 hover:text-white"}`}>Mercado Negro</button>}
          {!storefront && <button onClick={() => setTab("VENDER")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "VENDER" ? "bg-arcane-purple text-white" : "text-gray-400 hover:text-white"}`}>Vender</button>}
          {!storefront && <button onClick={() => setTab("DESMANCHAR")} className={`px-3 py-1 text-sm font-bold rounded transition-colors ${tab === "DESMANCHAR" ? "bg-red-800 text-white" : "text-gray-400 hover:text-white"}`}>Desmanchar</button>}
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

      {tab === "ESSENCIA" && (
        <div className="space-y-5">
          <section className="rounded-xl border border-fuchsia-700/50 bg-gradient-to-br from-fuchsia-950/30 to-cyan-950/20 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div><p className="text-xs font-black uppercase tracking-[0.18em] text-fuchsia-300">Apoie o mundo de Mythreon</p><h3 className="mt-1 text-2xl font-black text-white">Mythreon Coins</h3><p className="mt-2 max-w-2xl text-sm text-gray-300">Referência comercial: <strong className="text-fuchsia-200">1.000 Coins = R$ 1,00</strong>. O saldo só deve ser entregue por um checkout e webhook confirmados no servidor; nunca por uma alteração feita no navegador.</p></div>
              <span className="rounded-full border border-fuchsia-400/40 bg-fuchsia-950/50 px-3 py-1 text-xs font-bold text-fuchsia-100">🪙 Saldo: {(character.mythreonCoins ?? 0).toLocaleString("pt-BR")}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{MYTHREON_DONATION_PACKS.map(pack => <article key={pack.id} className="rounded-lg border border-white/10 bg-black/25 p-3"><strong className="block text-white">{pack.label}</strong><span className="text-xs text-fuchsia-200">{pack.coins.toLocaleString("pt-BR")} Coins · R$ {pack.priceBRL.toFixed(2).replace(".", ",")}</span><button type="button" className="mt-3 w-full rounded bg-fuchsia-700 px-3 py-2 text-xs font-bold text-white hover:bg-fuchsia-600" onClick={() => { if (checkoutUrl) window.open(`${checkoutUrl}?pack=${encodeURIComponent(pack.id)}`, "_blank", "noopener,noreferrer"); else setShopNotice("Checkout ainda não conectado. Configure VITE_MYTHREON_CHECKOUT_URL e entregue as Coins somente após confirmação do webhook."); }}>Apoiar projeto</button></article>)}</div>
            {shopNotice && <p role="status" className="mt-3 rounded border border-amber-600/30 bg-amber-950/20 p-2 text-xs text-amber-100">{shopNotice}</p>}
          </section>
          <section className="rounded-xl border border-arcane-gold/50 bg-arcane-gold/5 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-lg font-black text-arcane-gold">👑 Premium Account</h3><p className="mt-1 text-sm text-gray-300">{character.premium ? "Premium ativo nesta conta." : "Planos preparados para contratação segura; não ficam ativos sem confirmação do pagamento."}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${character.premium ? "bg-emerald-900/60 text-emerald-200" : "bg-black/30 text-arcane-gold"}`}>{character.premium ? "ATIVA" : "EM PREPARAÇÃO"}</span></div><div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{PREMIUM_BENEFITS.map(benefit => <div key={benefit} className="rounded border border-white/10 bg-black/20 p-2 text-xs text-gray-200">✓ {benefit}</div>)}</div><div className="mt-4 grid gap-3 md:grid-cols-3">{MYTHREON_PREMIUM_PLANS.map(plan => <article key={plan.id} className="rounded-lg border border-arcane-gold/25 bg-black/20 p-3"><div className="flex items-center justify-between gap-2"><strong className="text-sm text-white">{plan.name}</strong><span className="text-[10px] font-bold uppercase text-arcane-gold">{plan.tag}</span></div><p className="mt-1 text-xs text-gray-400">Assinatura de conveniência; sem dano, loot raro ou vitória garantida.</p><button type="button" onClick={() => { if (checkoutUrl) window.open(`${checkoutUrl}?product=premium&plan=${encodeURIComponent(plan.id)}`, "_blank", "noopener,noreferrer"); else setShopNotice("Checkout Premium ainda não conectado. Configure VITE_MYTHREON_CHECKOUT_URL e confirme a assinatura por webhook."); }} className="mt-3 w-full rounded border border-arcane-gold/50 px-3 py-2 text-xs font-bold text-arcane-gold hover:bg-arcane-gold/10">R$ {plan.priceBRL.toFixed(2).replace(".", ",")} · preparar contratação</button></article>)}</div></section>
          <section className="rounded-xl border border-cyan-700/50 bg-cyan-950/15 p-5">
            <h3 className="text-lg font-bold text-cyan-200">🔷 Refinaria de Mythreon</h3>
            <p className="mt-1 text-sm text-gray-300">Shards caem raramente de toda criatura viva. Criar uma Coin exige energia e uma taxa alta em gold para manter seu valor.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3"><span className="rounded bg-black/30 px-3 py-2 text-sm text-cyan-100">100 Shards + {MYTHREON_ECONOMY.goldPerCoin.toLocaleString("pt-BR")} gold = 1 Mythreon Coin</span><button onClick={async () => { const result = await confirmedAction(refineMythreonCoins(1)); if (!result.success) alert(result.error); }} className="rounded bg-fuchsia-600 px-4 py-2 font-bold text-white hover:bg-fuchsia-500">Refinar 1 Coin</button><button onClick={async () => { const result = await confirmedAction(refineMythreonCoins(Math.floor(Math.min(character.mythreonShards ?? 0, Math.floor(character.gold / MYTHREON_ECONOMY.goldPerCoin)) / MYTHREON_ECONOMY.shardsPerCoin))); if (!result.success) alert(result.error); }} className="rounded border border-fuchsia-500/60 px-4 py-2 font-bold text-fuchsia-100 hover:bg-fuchsia-900/40">Refinar máximo</button></div>
          </section>
          <section className="rounded-xl border border-violet-700/40 bg-violet-950/10 p-4"><h3 className="mb-3 font-bold text-violet-200">📖 Tomos e modos de progressão</h3><p className="mb-3 text-xs text-gray-400">Os Tomos dão um impulso temporário de habilidade; treino, build e conhecimento continuam sendo o caminho principal.</p><div className="grid gap-3 md:grid-cols-4">{MYTHREON_OFFERS.filter(offer => offer.kind === "BOOST").map(offer => <div key={offer.id} className="rounded-lg border border-white/10 bg-arcane-bg p-3"><div className="text-2xl">{offer.icon}</div><h4 className="mt-1 text-sm font-bold text-white">{offer.name}</h4><p className="mt-1 min-h-12 text-xs text-gray-400">{offer.description}</p><div className="mt-3 flex items-center justify-between gap-2"><span className="text-xs font-bold text-fuchsia-200">🪙 {offer.priceCoins}</span><button type="button" onClick={async () => { const result = await confirmedAction(buyMythreonBoost(offer.id)); if (!result.success) alert(result.error); }} className="rounded bg-violet-700 px-2 py-1.5 text-[11px] font-bold text-white hover:bg-violet-600">Ativar</button></div></div>)}</div></section>
          <section className="rounded-xl border border-fuchsia-700/40 bg-black/20 p-4"><h3 className="mb-3 font-bold text-fuchsia-200">Loja especial</h3><div className="grid gap-3 md:grid-cols-3">{MYTHREON_OFFERS.filter(offer => offer.kind !== "BOOST").map(offer => <div key={offer.id} className="rounded-lg border border-arcane-border bg-arcane-bg p-4"><div className="text-3xl">{offer.icon}</div><h4 className="mt-2 font-bold text-white">{offer.name}</h4><p className="min-h-10 text-xs text-gray-400">{offer.description}</p><div className="mt-3 flex items-center justify-between"><span className="font-bold text-fuchsia-200">🪙 {offer.priceCoins}</span><button onClick={async () => { const result = await confirmedAction(buyMythreonOffer(offer.id)); if (!result.success) alert(result.error); }} className="rounded bg-fuchsia-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-fuchsia-600">Comprar</button></div></div>)}</div></section>
          <section className="rounded-xl border border-amber-700/40 bg-amber-950/10 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-amber-200">🎰 Roleta Arcana</h3><p className="mt-1 text-xs text-gray-400">Use uma Chave da Roleta para sortear gold, fragmentos, ovos ou suprimentos. O prêmio é definido no servidor.</p></div><button type="button" onClick={async () => { const result = await confirmedAction(openMythreonRoulette()); if (!result.success) alert(result.error); }} className="rounded bg-amber-700 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600">Abrir chave</button></div><p className="mt-2 text-xs text-amber-100/70">Chaves na mochila: {countByTemplate(character.inventory, "CHAVE_ROLETA_ARCANA")}</p></section>
        </div>
      )}

      {tab === "MERCADO" && <OnlineMarket />}

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
                <ItemIcon item={item} className="w-20 h-20 mb-1" />
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
                <ItemIcon item={item} className="w-16 h-16 shrink-0" />
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
          <section className="md:col-span-2 rounded-lg border border-cyan-800/50 bg-cyan-950/10 p-4">
            <h3 className="font-bold text-cyan-200">💎 Fundir fragmentos</h3>
            <p className="mt-1 text-xs text-gray-400">Converta sobras da mochila em fragmentos de maior qualidade. A operação consome os fragmentos de origem; confirme antes de usar.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[{ id: "FRAGMENTO_COMUM", label: "100 Comuns → 10 Épicos" }, { id: "FRAGMENTO_RARO", label: "25 Raros → 10 Épicos" }].map(recipe => <button key={recipe.id} onClick={async () => { if (!window.confirm(`Fundir ${recipe.label}?`)) return; const result = await confirmedAction(forgeFragments(recipe.id)); if (!result.success) alert(result.error); }} className="rounded border border-cyan-700/60 bg-cyan-900/30 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-800/50">{recipe.label} · possui {countByTemplate(character.inventory, recipe.id)}</button>)}
            </div>
          </section>
          <div className="bg-arcane-bg border border-arcane-border rounded-lg p-4 max-h-[500px] overflow-y-auto">
            <h3 className="font-bold text-white mb-3">Selecione um item para aprimorar</h3>
            <div className="grid grid-cols-2 gap-2">
              {forgeInventory.map(item => (
                <div key={item.uid} onClick={() => setSelectedItem(item)} className={`border p-2 rounded cursor-pointer transition-all ${selectedItem?.uid === item.uid ? "border-orange-500 bg-orange-900/20 scale-105" : "border-arcane-border hover:border-gray-500"}`}>
                  <ItemIcon item={item} className="w-16 h-16 mx-auto" />
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
                  {selectedItem.category === "FLECHA" && <p className="mt-1 text-[11px] text-orange-300">🔪 O ferreiro afia as pontas: cada nível aumenta o dano e a precisão.</p>}
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
                    <span>{selectedItem.category === "FLECHA" ? "🏹 Afiar Flecha (+1)" : "⬆️ Aprimorar Nível (+1)"}</span>
                    <span className="text-[10px] bg-black/40 px-2 py-1 rounded">{getUpgradeCost(selectedItem).gold}g + {getUpgradeCost(selectedItem).fragments} Frags</span>
                  </button>

                  <button onClick={handleReroll} disabled={selectedItem.rarity === "COMUM"} className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-2.5 rounded flex justify-between items-center px-4 transition-colors">
                    <span>🎲 Reencantar Atributos</span>
                    <span className="text-[10px] bg-black/40 px-2 py-1 rounded">{500 * selectedItem.tier}g + 20 Frags Raros</span>
                  </button>
                  <button onClick={handleTier} disabled={selectedItem.tier >= 5} className="w-full bg-cyan-800 hover:bg-cyan-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-2.5 rounded flex justify-between items-center px-4 transition-colors">
                    <span>✦ Elevar Tier</span><span className="text-[10px] bg-black/40 px-2 py-1 rounded">{15 * (selectedItem.tier + 1)} Fragmentos Épicos</span>
                  </button>
                  <div className="rounded border border-fuchsia-800/40 bg-fuchsia-950/20 p-2 text-[10px] text-fuchsia-200">🎯 Atributo específico: custa 1 Mythreon Coin + 100 Fragmentos Raros. A moeda é rara e serve como sumidouro de gold.</div>
                  <div className="flex gap-2"><select value={String(specificStat)} onChange={event => setSpecificStat(event.target.value as keyof Item["stats"])} className="min-w-0 flex-1 rounded border border-fuchsia-800/50 bg-arcane-panel px-2 py-2 text-xs text-white"><option value="atk">Ataque</option><option value="matk">Magia</option><option value="arm">Armadura</option><option value="def">Defesa</option><option value="hp">Vida</option><option value="mp">Mana</option><option value="crit">Crítico</option><option value="hit">Precisão</option></select><button onClick={handleSpecificReroll} disabled={selectedItem.rarity === "COMUM"} className="rounded bg-fuchsia-700 px-3 py-2 text-[10px] font-bold text-white hover:bg-fuchsia-600 disabled:bg-gray-800">Sortear atributo</button></div>
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
