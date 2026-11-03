import {downloadSaveBackup} from './utils/saveBackup';
import {onlineConfigured,supabase} from './online/client';
import {OnlineSession} from './online/OnlineSession';
import {OnlineCommunity,OnlineRanking,OnlineNotice,OnlineTradeWindow} from './ui/OnlineCommunity';
import {useOnlineState,disconnectCharacter} from './online/controller';
import { JourneyGuide } from './ui/JourneyGuide';
import { canUseTab, isGuided } from './engine/journey';
import React, { useCallback, useEffect, useState } from "react";
import { AssetImage } from "./ui/AssetImage";
import { useGameStore } from "./store/gameStore";
import { BuildLab } from "./ui/BuildLab";
import { Backpack } from "./ui/Backpack";
import { Depot } from "./ui/Depot"; // NOVO
import { Personagem } from "./ui/Personagem";
import { ZoneView } from "./ui/Zone";
import { MatrixView } from "./ui/Matrix";
import { CharacterPanel } from "./ui/CharacterPanel";
import { CombatLog } from "./ui/CombatLog";
import { CommerceBenefits } from "./ui/CommerceBenefits";
import { Shop } from "./ui/Shop";
import { Quests } from "./ui/Quests";
import { Wiki } from "./ui/Wiki";
import { Duelos } from "./ui/Duelos";
import { DivineBeasts } from "./ui/DivineBeasts";
import { Farm } from "./ui/Farm";
import { AudioManager } from "./ui/AudioManager";
import { OfflineModal } from "./ui/OfflineModal";
import { DeathScreen } from "./ui/DeathScreen";
import { isDebug, setDebug } from "./config";
import { AccessIcon, type AccessIconName } from "./ui/AccessIcon";
import { LandingPage } from "./ui/LandingPage";
import { closeLocalAccountSession, getLocalAccountSession, type LocalAccount } from "./utils/localAccounts";
import { activateSaveAccount } from "./engine/save";
import { getTutorialQuestSignal } from "./utils/questSignals";
import { QuestTracker } from "./ui/QuestTracker";
import { SettingsPanel } from "./ui/SettingsPanel";
import { QUESTS } from "./data/quests";
import { checkQuestCompletion } from "./engine/questEngine";
import { ZONES } from "./data/zones";
import type { CharacterAppearance } from "./types";

type Tab = "zona" | "personagem" | "backpack" | "depot" | "matriz" | "pets" | "fazenda" | "laboratorio" | "shop" | "loja" | "missoes" | "duelos" | "wiki" | "online" | "ranking";

const TAB_LABELS: Record<Tab, string> = {
  online:"Comunidade",ranking:"Ranking", zona: "Explorar", personagem: "Personagem", backpack: "Mochila", depot: "Depósito", fazenda: "Fazenda",
  matriz: "Matriz", pets: "Pets", laboratorio: "Laboratório", shop: "Shop", loja: "Ferreiro", missoes: "Jornadas", duelos: "Duelo", wiki: "Arquivo",
};

const TAB_ICONS: Record<Tab, AccessIconName> = {
  online:"quest",ranking:"archive", zona: "explore", personagem: "character", backpack: "backpack", depot: "depot",
  matriz: "matrix", fazenda: "farm", laboratorio: "matrix", shop: "shop", loja: "shop", missoes: "quest", duelos: "duel", wiki: "archive",
  pets: "pet",
};

export default function App(){
  if (new URLSearchParams(window.location.search).get("site") === "1") {
    return <LandingPage onAuthenticated={() => { window.history.replaceState({}, "", "/"); window.location.reload(); }} />;
  }
  return onlineConfigured?<OnlineSession>{(account,switchCharacter)=><GameApp onlineAccount={account} onSwitchCharacter={switchCharacter}/>}</OnlineSession>:<GameApp/>;
}
function GameApp({onlineAccount,onSwitchCharacter}:{onlineAccount?:LocalAccount;onSwitchCharacter?:()=>void}) {
  const online=useOnlineState();
  const [tab, setTab] = useState<Tab>("zona");
  const { character, loadFromSave, newGame, startHunting, stopHunting, recordQuestAction, isTickRunning, setCurrentZone } = useGameStore();
  const [name, setName] = useState("");
  const [appearance, setAppearance] = useState<CharacterAppearance>({body:"MASCULINO",skin:"MORENA",hair:"CURTO",hairColor:"NEGRO",outfit:"VIAJANTE",outfitColor:"OCRE"});
  const [debug, setDebugState] = useState(isDebug());
  const [focusQuestId, setFocusQuestId] = useState<string | null>(null);
  const [trackedQuestId, setTrackedQuestId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [account, setAccount] = useState<LocalAccount | null>(() => onlineAccount ?? getLocalAccountSession());
  const tutorialSignal = character ? getTutorialQuestSignal(character) : null;

useEffect(() => {
    if (!account || onlineAccount) return;
    activateSaveAccount(account.id);
    const loaded = loadFromSave();
    if (loaded) {
      const state = useGameStore.getState();
      if (state.character && !isGuided(state.character) && state.character.hp > 0) startHunting(state.character.currentZoneId || "BOSQUE_LYSS");
    } else {
      useGameStore.setState({ character: null, races: [], currentZoneId: "BOSQUE_LYSS", offlineReport: null });
    }
  }, [account?.id]);

  useEffect(() => { return () => { if(!onlineAccount) stopHunting(); }; }, []);
  useEffect(() => {
    if (tab === "wiki") recordQuestAction("VISIT_WIKI");
    if (tab === "matriz") recordQuestAction("VISIT_MATRIX");
    if (tab === "loja") recordQuestAction("VISIT_FORGE");
    if (tab === "backpack") recordQuestAction("VISIT_BACKPACK");
    if (tab === "personagem") recordQuestAction("VISIT_CHARACTER");
    if (tab === "pets") recordQuestAction("VISIT_BEASTS");
    if (tab === "shop") recordQuestAction("VISIT_SHOP");
    if (tab === "laboratorio") recordQuestAction("VISIT_LAB");
    if (tab === "depot") recordQuestAction("VISIT_DEPOT");
  }, [tab, recordQuestAction]);

  const toggleDebug = () => {
    setDebug(!debug); setDebugState(!debug); window.location.reload();
  };

  const openQuest = (questId: string) => {
    setFocusQuestId(questId);
    setTab("missoes");
  };

  const trackQuest = (questId: string) => {
    const quest = QUESTS.find(item => item.id === questId);
    if (!quest || !character) return;
    setTrackedQuestId(questId);
    if (character.quests.completed.includes(questId)) { openQuest(questId); return; }
    if (character.quests.active[questId] && checkQuestCompletion(character, questId)) { openQuest(questId); return; }
    const progress = character.quests.active[questId]?.progress ?? [];
    const objective = quest.objectives.find((_, index) => (progress[index] ?? 0) < quest.objectives[index].count);
    const objectiveType = objective?.type;
    const targetTabs: Record<string, Tab> = {
      VISIT_WIKI: "wiki", VISIT_MATRIX: "matriz", SYNTHESIZE: "matriz", EQUIP_RACE: "matriz",
      VISIT_FORGE: "loja", FORGE: "loja", SELL: "loja", SALVAGE: "loja", VISIT_BACKPACK: "backpack", CONFIGURE_POTIONS: "zona", VISIT_CHARACTER:"personagem", VISIT_BEASTS:"pets", VISIT_SHOP:"shop", VISIT_LAB:"laboratorio", VISIT_DEPOT:"depot", TRAIN:"zona",
    };
    const destinationTab = objectiveType ? targetTabs[objectiveType] : undefined;
    if (destinationTab) {
      if (objectiveType === "TRAIN" && isTickRunning) stopHunting();
      if (!canUseTab(character,destinationTab)) { openQuest(questId); return; }
      if (objectiveType?.startsWith("VISIT_") && tab === destinationTab) recordQuestAction(objectiveType as any);
      if (destinationTab === "loja" && isTickRunning) stopHunting();
      setTab(destinationTab);
      return;
    }
    if (quest.zoneId) {
      if (isTickRunning && useGameStore.getState().currentZoneId !== quest.zoneId) stopHunting();
      setCurrentZone(quest.zoneId);
      const target = quest.objectives.find(obj => ["KILL", "KILL_BOSS", "COLLECT"].includes(obj.type))?.target;
      const targetEnemy = ZONES[quest.zoneId]?.enemies.find(enemy => enemy.id === target || enemy.componentId === target || enemy.essenceId === target);
      if (targetEnemy) useGameStore.getState().setActiveEnemy(targetEnemy.id);
      setTab("zona");
      return;
    }
    openQuest(questId);
  };
  const clearQuestFocus = useCallback(() => setFocusQuestId(null), []);
  const logout = () => {
    if(onlineAccount){disconnectCharacter();void supabase().auth.signOut({scope:"local"});return;}
    stopHunting();
    closeLocalAccountSession();
    activateSaveAccount();
    useGameStore.setState({ character: null, races: [], currentZoneId: "BOSQUE_LYSS", offlineReport: null });
    setAccount(null);
  };

  if (!account) return <LandingPage onAuthenticated={setAccount} />;

  if (!character) {
    return (
      <div className="min-h-screen bg-arcane-bg flex items-center justify-center p-4">
        <div className="bg-arcane-panel border border-arcane-border rounded-2xl p-8 max-w-md w-full shadow-2xl entry-card">
          <div className="brand-lockup brand-lockup-centered">
            <AssetImage
              src="/assets/branding/mythreon-logo-horizontal.png"
              alt="Mythreon Online"
              className="brand-logo brand-logo-entry"
            />
          </div>
          <p className="text-arcane-cyan text-center mb-2 text-sm italic">“A Essência registra tudo.”</p>
          <div className="text-center text-xs text-gray-500 mb-6">Conta: {account.email} · <button className="text-arcane-gold hover:underline" onClick={logout}>Sair</button></div>
          <div className="mb-5 rounded-xl border border-arcane-border bg-black/20 p-4">
            <p className="mb-3 text-sm font-bold text-arcane-gold">Vista do seu primeiro eco</p>
            <div className="mb-4 flex justify-center"><div className="grid h-24 w-24 place-items-center rounded-full border border-arcane-gold/40 bg-gradient-to-b from-arcane-purple/30 to-black text-5xl shadow-[0_0_25px_rgba(201,160,77,.25)]">{appearance.body === "FEMININO" ? "🧝‍♀️" : "🧝‍♂️"}</div></div>
            <div className="grid grid-cols-2 gap-2 text-xs"><label className="text-gray-300">Corpo<select value={appearance.body} onChange={e=>setAppearance({...appearance,body:e.target.value as CharacterAppearance["body"]})} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white"><option value="MASCULINO">Masculino</option><option value="FEMININO">Feminino</option></select></label><label className="text-gray-300">Pele<select value={appearance.skin} onChange={e=>setAppearance({...appearance,skin:e.target.value as CharacterAppearance["skin"]})} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white"><option value="CLARA">Clara</option><option value="MORENA">Morena</option><option value="ESCURA">Escura</option><option value="AZUL_ESSENCIA">Azul da Essência</option></select></label><label className="text-gray-300">Cabelo<select value={appearance.hair} onChange={e=>setAppearance({...appearance,hair:e.target.value as CharacterAppearance["hair"]})} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white"><option value="CURTO">Curto</option><option value="LONGO">Longo</option><option value="TRANCAS">Tranças</option><option value="ARCANO">Arcano</option></select></label><label className="text-gray-300">Cor do cabelo<select value={appearance.hairColor} onChange={e=>setAppearance({...appearance,hairColor:e.target.value as CharacterAppearance["hairColor"]})} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white"><option value="NEGRO">Negro</option><option value="CASTANHO">Castanho</option><option value="RUIVO">Ruivo</option><option value="PRATEADO">Prateado</option><option value="AZUL">Azul</option></select></label><label className="col-span-2 text-gray-300">Roupa inicial<select value={appearance.outfit} onChange={e=>setAppearance({...appearance,outfit:e.target.value as CharacterAppearance["outfit"]})} className="mt-1 w-full rounded border border-arcane-border bg-arcane-bg p-2 text-white"><option value="VIAJANTE">Viajante do Refúgio</option><option value="GUARDIAO">Guardião da Cúpula</option><option value="MISTICO">Místico do Primeiro Canto</option></select></label></div>
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do personagem"
            className="w-full bg-arcane-bg border border-arcane-border rounded-lg px-4 py-3 text-white mb-6 focus:outline-none focus:border-arcane-purple"
          />
          <button
            onClick={() => { if (name.trim()) { newGame(name.trim(), appearance); setTab("missoes"); } }}
            className="w-full bg-arcane-purple hover:bg-arcane-purple/80 text-white rounded-lg py-3 font-bold transition-all hover:scale-105"
          >
            Começar Jornada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-arcane-bg text-white pb-10 font-sans relative">
      <AudioManager />
      <OnlineNotice/>
      <OnlineTradeWindow/>
      <OfflineModal />
      <DeathScreen />

      <header className="game-header bg-arcane-panel border-b border-arcane-border px-4 py-3 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="brand-lockup game-brand-lockup">
            <a href="/?site=1" className="game-brand-link" aria-label="Voltar para o site Mythreon Online" title="Página inicial do Mythreon Online">
              <AssetImage
                src="/assets/branding/mythreon-logo-horizontal.png"
                alt="Mythreon Online"
                className="brand-logo game-brand-banner"
              />
            </a>
            <div className="brand-player-info">
              <p className="text-xs text-arcane-cyan brand-subtitle">
                {character.name} — Nível {character.level} {character.activeRace ? `(${character.activeRace.name})` : ""}
              </p>
              {location.hostname === "localhost" && <button
                onClick={toggleDebug}
                className={`text-[10px] px-2 py-1 rounded border ${debug ? "bg-red-900 border-red-500 text-red-200" : "bg-gray-800 border-gray-600 text-gray-400"}`}
              >
                {debug ? "DEBUG ON" : "DEBUG OFF"}
              </button>}
            </div>
          </div>
          <CharacterPanel />
          <div className="ml-auto flex items-center gap-2">
            {!onlineAccount&&<button className="online-button-secondary" onClick={()=>downloadSaveBackup(character,useGameStore.getState().races)}>Baixar backup</button>}
            {onSwitchCharacter&&<button onClick={onSwitchCharacter} className="online-button-secondary">Personagens</button>}
            <button onClick={() => setSettingsOpen(true)} className="rounded-lg border border-arcane-border px-3 py-2 text-base text-gray-200 hover:border-arcane-gold hover:text-arcane-gold" title="Configurações" aria-label="Abrir configurações">⚙️</button>
            <button onClick={logout} className="rounded-lg border border-red-500/50 px-3 py-2 text-xs text-red-200 hover:border-red-400 hover:bg-red-950/40">Sair da conta</button>
          </div>
        </div>
      </header>

      <nav className="game-nav bg-arcane-panel/80 backdrop-blur border-b border-arcane-border sticky top-[73px] z-40" aria-label="Navegação principal de Mythreon">
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-start gap-1 overflow-x-auto px-2 py-1.5 md:flex-wrap md:justify-center md:overflow-visible">
          {(["zona", "personagem", "backpack", "depot", "matriz", "pets", "fazenda", "laboratorio", "shop", "loja", "missoes", "duelos", "wiki", "online", "ranking"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                if (!canUseTab(character,t) || (t === "loja" && isTickRunning)) return;
                setTab(t);
              }}
              disabled={!canUseTab(character,t) || (t === "loja" && isTickRunning)}
              title={!canUseTab(character,t) ? "Liberado conforme sua iniciação. Siga a missão atual." : t === "loja" && isTickRunning ? "Saia da caça para acessar o Ferreiro" : undefined}
              aria-disabled={t === "loja" && isTickRunning}
              aria-current={tab === t ? "page" : undefined}
              className={`nav-tab relative flex items-center gap-2 rounded-lg px-3 py-2.5 font-bold text-sm whitespace-nowrap transition-colors ${
                t === "loja" && isTickRunning ? "cursor-not-allowed text-gray-600 opacity-50" : tab === t
                  ? "text-arcane-gold border-b-2 border-arcane-gold bg-arcane-border/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <span className="nav-tab-icon-wrap relative"><AccessIcon name={TAB_ICONS[t]} className="nav-tab-icon" />{t === "missoes" && tutorialSignal && <span aria-hidden="true" className={`absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[9px] font-black text-white shadow ${tutorialSignal.type === "claim" ? "bg-red-600 animate-pulse" : "bg-amber-500"}`}>{tutorialSignal.type === "claim" ? "!" : "?"}</span>}</span>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </nav>

      <JourneyGuide openQuest={openQuest} followQuest={trackQuest} />
      <QuestTracker onSelect={trackQuest} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <main className={`game-main max-w-7xl mx-auto p-4 mt-4 ${online.pending ? "pointer-events-none opacity-70" : ""}`} aria-busy={online.pending}>
        <fieldset disabled={online.pending} className="min-w-0 border-0 p-0 m-0">
        {tab === "online" && <OnlineCommunity/>}
        {tab === "ranking" && <OnlineRanking/>}
        {tab === "zona" && <ZoneView onOpenQuest={openQuest} trackedQuestId={trackedQuestId} />}
        {tab === "personagem" && <Personagem />}
        {tab === "backpack" && <Backpack />}
        {tab === "depot" && <Depot />} {/* NOVO */}
        {tab === "matriz" && <MatrixView />}
        {tab === "pets" && <DivineBeasts />}
        {tab === "fazenda" && <Farm />}
        {tab === "laboratorio" && <BuildLab />}
        {tab === "loja" && <Shop key="ferreiro" />}
{tab === "shop" && <><CommerceBenefits /><Shop key="shop" storefront /></>}
        {tab === "missoes" && <Quests focusQuestId={focusQuestId} onFocusHandled={clearQuestFocus} />}
        {tab === "duelos" && <Duelos />}
        {tab === "wiki" && <Wiki />}
        <div className="mt-6">
          <CombatLog />
        </div>
      </fieldset></main>
    </div>
  );
}
