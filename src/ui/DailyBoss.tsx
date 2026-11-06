import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { worldRequest } from "../online/client";
import { onlineAction, useOnlineState } from "../online/controller";
import { useGameStore } from "../store/gameStore";
import { AssetImage } from "./AssetImage";
import type { DailyBossBattle } from "../types";
import { DailyBossArena, type BossArenaHit, type BossArenaParticipant } from "./DailyBossArena";

type BossPayload = {
  run: { id: string; boss_template_id: string; boss_name: string; boss_title: string; level: number; hp_total: number; hp_remaining: number; status: "open" | "defeated" | "expired"; closes_at: string };
  participant: { damage: number; claimed_at?: string | null; last_action_at?: string | null } | null;
  pendingRewards?: { run_id: string; boss_name: string; level: number; cycle_key: string; status: string; closes_at: string; damage: number }[];
  combat?: DailyBossBattle | null;
  roster?: BossArenaParticipant[];
  participants: number;
  damageTotal: number;
  leaderboard: { character_id: string; name: string; damage: number }[];
  history?: { id: string; boss_name: string; level: number; gold: number; xp: number; shards: number; damage: number; participation_ratio: number; defeated: boolean; loot: { templateId: string; name: string; quantity: number }[]; created_at: string }[];
};

const statusLabel: Record<BossPayload["run"]["status"], string> = { open: "Inscrições abertas", defeated: "Boss derrotado", expired: "Janela encerrada" };
const statusColor: Record<BossPayload["run"]["status"], string> = { open: "text-green-300", defeated: "text-arcane-gold", expired: "text-gray-400" };

function formatTime(value: string, now = Date.now()) {
  const left = Math.max(0, new Date(value).getTime() - now);
  const hours = Math.floor(left / 3_600_000);
  const minutes = Math.floor((left % 3_600_000) / 60_000);
  const seconds = Math.floor((left % 60_000) / 1_000);
  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

export function DailyBoss() {
  const active = useOnlineState(state => state.active);
  const pending = useOnlineState(state => state.pending);
  const character = useGameStore(state => state.character);
  const [boss, setBoss] = useState<BossPayload | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [now, setNow] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const actionInFlight = useRef(false);
  const arenaActionInFlight = useRef(false);
  const [confirmedHit, setConfirmedHit] = useState<BossArenaHit | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [arenaNotice, setArenaNotice] = useState("");
  const joined = !!boss?.participant;

  const refresh = useCallback(async () => {
    if (!active || !character) return;
    try {
      const response = await worldRequest("dailyBoss.read", {}, character.id);
      setBoss(response.dailyBoss ?? null);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível consultar o Boss Diário.");
    }
  }, [active, character?.id]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    if (!active) return;
    // A arena precisa refletir o dano recebido por outro jogador rapidamente;
    // o polling continua leve, mas não deixa o alvo esperando dez segundos.
    const poll = window.setInterval(() => { void refresh(); }, 2_500);
    const clock = window.setInterval(() => setNow(Date.now()), 250);
    return () => { window.clearInterval(poll); window.clearInterval(clock); };
  }, [active, refresh]);

  const arenaAction = async (operation: "dailyBoss.move" | "dailyBoss.togglePvp" | "dailyBoss.attackPlayer", payload: Record<string, unknown>) => {
    if (arenaActionInFlight.current || !boss?.run.id) return;
    arenaActionInFlight.current = true; setError(""); setArenaNotice("");
    try {
      const response = await onlineAction(operation, { runId: boss.run.id, ...payload });
      if (response.dailyBoss) setBoss(previous => previous?.run.id === response.dailyBoss.run.id ? { ...previous, ...response.dailyBoss } : previous);
      if (response.pvp?.damage) setConfirmedHit({ id: crypto.randomUUID(), runId: boss.run.id, damage: Number(response.pvp.damage), at: Date.now() });
      setArenaNotice(response.pvp?.kind === "support" ? `Suporte ativado: +${Number(response.pvp.healed ?? 0).toLocaleString("pt-BR")} vida.` : response.pvp?.damage ? `${response.pvp.targetName}: −${Number(response.pvp.damage).toLocaleString("pt-BR")} PV.` : operation === "dailyBoss.togglePvp" ? (response.arena?.pvpEnabled ? "PvP aberto na arena." : "PvP protegido: ninguém poderá selecionar você.") : "Posição atualizada.");
      if (operation !== "dailyBoss.move") await refresh();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "A ação da arena não pôde ser concluída."); }
    finally { arenaActionInFlight.current = false; }
  };

  useEffect(() => {
    if (!joined || !boss || boss.run.status !== "open") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const key = event.key.toLowerCase(); const direction = key === "w" || key === "arrowup" ? "up" : key === "s" || key === "arrowdown" ? "down" : key === "a" || key === "arrowleft" ? "left" : key === "d" || key === "arrowright" ? "right" : null;
      if (!direction) return; event.preventDefault(); void arenaAction("dailyBoss.move", { direction });
    };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [joined, boss?.run.id, boss?.run.status]);

  const runAction = async (operation: "dailyBoss.join" | "dailyBoss.attack" | "dailyBoss.claim", runId = boss?.run.id) => {
    if (actionInFlight.current) return;
    actionInFlight.current = true; setSubmitting(true);
    setError(""); setNotice("");
    try {
      const response = await onlineAction(operation, { runId });
      if (operation === "dailyBoss.attack" && Number(response.damage) > 0) setConfirmedHit({ id: crypto.randomUUID(), runId: response.dailyBoss.run.id, damage: Number(response.damage), damageTaken: Number(response.damageTaken ?? 0), at: Date.now() });
      if (response.dailyBoss) setBoss(previous => previous?.run.id === response.dailyBoss.run.id ? { ...previous, ...response.dailyBoss } : previous);
      setNotice(operation === "dailyBoss.join" ? "Você entrou na batalha. O dano de todos soma no mesmo Boss." : operation === "dailyBoss.attack" ? `Você causou ${Number(response.damage ?? 0).toLocaleString("pt-BR")} e recebeu ${Number(response.damageTaken ?? 0).toLocaleString("pt-BR")} de dano nesta batalha.${response.finalHit ? " ✦ Você deu o golpe final!" : ""}` : `Recompensa recebida: ${Number(response.reward?.gold ?? 0).toLocaleString("pt-BR")} gold e ${Number(response.reward?.xp ?? 0).toLocaleString("pt-BR")} XP.${response.reward?.finalHit ? " Bônus de golpe final aplicado." : ""}`);
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível concluir a ação.");
    } finally { actionInFlight.current = false; setSubmitting(false); }
  };

  const hpPercent = useMemo(() => boss ? Math.max(0, Math.min(100, Number(boss.run.hp_remaining) / Math.max(1, Number(boss.run.hp_total) || 1) * 100)) : 0, [boss]);
  const canClaim = joined && !!boss && Number(boss.participant?.damage ?? 0) > 0 && ["defeated", "expired"].includes(boss.run.status) && !boss.participant?.claimed_at;
  const attackCooldown = Math.max(0, 2500 - (now - new Date(boss?.participant?.last_action_at ?? 0).getTime()));
  const knockoutWait = boss?.combat?.hp === 0 ? Math.max(0, boss.combat.recoveryUntil - now) : 0;
  if (!active) return <section className="online-card"><p className="online-eyebrow">Conteúdo cooperativo online</p><h1 className="text-3xl font-bold text-arcane-gold">Boss Diário</h1><p className="mt-3 text-gray-400">Entre em uma conta online para participar do Boss Diário e deixar sua contribuição registrada no servidor.</p></section>;
  if (!boss) return <section className="online-card"><h1 className="text-3xl font-bold text-arcane-gold">Boss Diário</h1><p className="mt-4 text-gray-400">Consultando a próxima janela da Essência…</p>{error && <p className="mt-3 text-red-300">{error}</p>}</section>;
  const run = boss.run;
  const spriteByTemplate: Record<string, string> = { DAILY_BRASA: "/assets/monsters/ESPECTRO.png", DAILY_COLOSSO: "/assets/monsters/COLOSSO.png", DAILY_LEVIATA: "/assets/monsters/LEVIATA.png", DAILY_MATRIARCA: "/assets/monsters/MATRIARCA_LODO.png", DAILY_SENTINELA: "/assets/monsters/SENTINELA_ZENITE.png", DAILY_DEVORADOR: "/assets/monsters/DEVORADOR.png" };
  const sprite = spriteByTemplate[run.boss_template_id] ?? "/assets/branding/mythreon-logo-horizontal.png";
  return <section className="online-card space-y-5">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="online-eyebrow">Uma ameaça para todo o mundo</p><h1 className="text-3xl font-bold text-arcane-gold">Boss Diário</h1><p className="mt-1 text-gray-300">{run.boss_title}</p></div>
      <div className="text-right"><strong className={statusColor[run.status]}>{statusLabel[run.status]}</strong><p className="text-xs text-gray-500">Ciclo encerra em {formatTime(run.closes_at, now)}</p></div>
    </header>
    <DailyBossArena key={run.id} run={run} sprite={sprite} character={character} roster={boss.roster ?? []} participants={boss.participants} joined={joined} hit={confirmedHit} now={now} combat={boss.combat} selectedTargetId={selectedTargetId} onSelectTarget={entry => { setSelectedTargetId(entry.character_id); setArenaNotice(`${entry.name} selecionado. Agora escolha uma ação PvP.`); }} onMove={direction => void arenaAction("dailyBoss.move", { direction })} />
    {joined && run.status === "open" && <section className="rounded-2xl border border-cyan-400/30 bg-black/30 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-cyan-100">🎮 Controle de combate</h2><p className="text-xs text-gray-400">Movimente-se com WASD ou setas. Passe o mouse sobre um jogador para iluminar e clique para selecionar.</p></div><button type="button" className="online-button-secondary" onClick={() => void arenaAction("dailyBoss.togglePvp", { enabled: true })}>PvP aberto</button></div><div className="mt-3 grid gap-2 sm:grid-cols-4"><button type="button" className="online-button" disabled={!selectedTargetId || arenaActionInFlight.current} onClick={() => void arenaAction("dailyBoss.attackPlayer", { targetCharacterId: selectedTargetId, kind: "basic" })}>⚔️ Ataque básico</button><button type="button" className="online-button" disabled={!selectedTargetId || arenaActionInFlight.current} onClick={() => void arenaAction("dailyBoss.attackPlayer", { targetCharacterId: selectedTargetId, kind: "attack" })}>🔥 {character?.activeRace?.skills.ataque ?? "Ataque"}</button><button type="button" className="online-button-secondary" disabled={arenaActionInFlight.current} onClick={() => void arenaAction("dailyBoss.attackPlayer", { targetCharacterId: selectedTargetId, kind: "support" })}>✦ {character?.activeRace?.skills.suporte ?? "Suporte"}</button><div className="rounded-lg border border-white/10 p-2 text-xs text-gray-400"><strong className="text-arcane-gold">Passiva</strong><br />{character?.activeRace?.skills.passiva ?? "Sempre ativa"}</div></div>{arenaNotice && <p role="status" className="mt-3 text-sm text-cyan-200">{arenaNotice}</p>}</section>}
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <article className="rounded-2xl border border-arcane-gold/30 bg-black/25 p-5">
        <div className="flex flex-wrap items-center gap-5"><div className="grid h-28 w-28 place-items-center rounded-full border border-arcane-gold/40 bg-gradient-to-b from-arcane-purple/30 to-black text-5xl"><AssetImage src={sprite} alt="Boss Diário" className="max-h-24 max-w-24 object-contain" fallbackSrc="/assets/branding/mythreon-logo-horizontal.png" /></div><div><h2 className="text-2xl font-bold text-white">{run.boss_name}</h2><p className="text-sm text-gray-400">Nível recomendado {run.level} · Vida reforçada pela participação coletiva</p><p className="mt-2 text-sm text-gray-300">Participantes: <strong className="text-arcane-gold">{boss.participants}</strong> · Dano mundial: <strong className="text-red-300">{boss.damageTotal.toLocaleString("pt-BR")}</strong></p></div></div>
        <div className="mt-5"><div className="mb-1 flex justify-between text-xs"><span>Vida do Boss</span><span>{Number(run.hp_remaining).toLocaleString("pt-BR")} / {Number(run.hp_total).toLocaleString("pt-BR")}</span></div><div className="h-4 overflow-hidden rounded-full border border-red-500/30 bg-black"><div className="h-full rounded-full bg-gradient-to-r from-red-700 to-orange-400 transition-all" style={{ width: `${hpPercent}%` }} /></div></div>
        <div className="mt-5 flex flex-wrap gap-2">{run.status === "open" && !joined && <button disabled={pending || submitting} className="online-button" onClick={() => void runAction("dailyBoss.join")}>⚔️ Entrar na batalha</button>}{run.status === "open" && joined && <button disabled={pending || submitting || attackCooldown > 0 || knockoutWait > 0} className="online-button" onClick={() => void runAction("dailyBoss.attack")}>{knockoutWait > 0 ? `Recuperando · ${Math.ceil(knockoutWait / 1000)}s` : attackCooldown > 0 ? `⏳ ${(attackCooldown / 1000).toFixed(1)}s` : boss.combat?.hp === 0 ? "⚔️ Voltar à batalha" : "🔥 Atacar Boss"}</button>}{canClaim && <button disabled={pending || submitting} className="online-button" onClick={() => void runAction("dailyBoss.claim")}>🎁 Resgatar recompensa</button>}{run.status === "open" && <span className="self-center text-xs text-gray-500">Cada ataque provoca retaliação. Nocaute: 30s de recuperação; sua contribuição é mantida.</span>}</div>
        {joined && <p className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3 text-sm text-cyan-100">Sua contribuição: <strong>{Number(boss.participant?.damage ?? 0).toLocaleString("pt-BR")}</strong> de dano. O loot cresce com sua participação.</p>}
      </article>
      <aside className="rounded-2xl border border-white/10 bg-black/20 p-4"><h3 className="mb-3 font-bold text-arcane-gold">🏆 Maiores contribuições</h3>{boss.leaderboard.length ? <ol className="space-y-2">{boss.leaderboard.map((entry, index) => <li key={entry.character_id} className="flex items-center justify-between gap-2 text-sm"><span><b className="mr-2 text-arcane-gold">{index + 1}º</b>{entry.name}</span><strong className="text-red-200">{Number(entry.damage).toLocaleString("pt-BR")}</strong></li>)}</ol> : <p className="text-sm text-gray-500">Os primeiros golpes ainda não foram registrados.</p>}</aside>
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-700/50 bg-red-950/30 p-3 text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-lg border border-green-700/50 bg-green-950/30 p-3 text-green-200">{notice}</p>}
    {!!boss.pendingRewards?.length && <section className="rounded-2xl border border-arcane-gold/30 bg-black/20 p-4"><h3 className="font-bold text-arcane-gold">🎁 Recompensas pendentes</h3><p className="mt-1 text-xs text-gray-400">Sua contribuição fica registrada mesmo depois da troca de ciclo. Libere espaço para receber todos os itens.</p><div className="mt-3 space-y-2">{boss.pendingRewards.map(entry => <article key={entry.run_id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 p-3"><div><strong className="text-white">{entry.boss_name} · Nv. {entry.level}</strong><p className="text-xs text-gray-400">{entry.cycle_key} · {Number(entry.damage).toLocaleString("pt-BR")} de dano · {entry.status === "defeated" ? "Vitória coletiva" : "Ciclo encerrado"}</p></div><button type="button" disabled={pending || submitting} className="online-button" onClick={() => void runAction("dailyBoss.claim", entry.run_id)}>Resgatar este ciclo</button></article>)}</div></section>}
    {!!boss.history?.length && <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><h3 className="mb-3 font-bold text-arcane-gold">📜 Histórico de recompensas</h3><div className="grid gap-2 md:grid-cols-2">{boss.history.map(entry => <article key={entry.id} className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs"><div className="flex items-center justify-between gap-2"><strong className="text-white">{entry.boss_name} · Nv. {entry.level}</strong><span className={entry.defeated ? "text-arcane-gold" : "text-gray-400"}>{entry.defeated ? "Derrotado" : "Janela encerrada"}</span></div><p className="mt-1 text-gray-400">{new Date(entry.created_at).toLocaleString("pt-BR")} · {Number(entry.damage).toLocaleString("pt-BR")} dano · {(Number(entry.participation_ratio) * 100).toFixed(2)}% participação</p><p className="mt-1 text-cyan-200">+{Number(entry.gold).toLocaleString("pt-BR")} gold · +{Number(entry.xp).toLocaleString("pt-BR")} XP · +{Number(entry.shards).toLocaleString("pt-BR")} Shards</p><p className="mt-1 text-gray-500">Loot: {entry.loot?.length ? entry.loot.map(item => `${item.name} x${item.quantity}`).join(", ") : "nenhum item adicional"}</p></article>)}</div></div>}
    <p className="text-xs text-gray-500">{now ? "O painel atualiza sozinho. A vida desta batalha é separada da hunt e não usa poções." : ""} Ao derrotar o Boss, quem contribuiu recebe recompensa proporcional e um bônus de XP de 5% até o próximo ciclo.</p>
  </section>;
}
