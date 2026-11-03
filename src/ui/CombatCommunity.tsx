import React, { useEffect, useMemo, useState } from "react";
import { onlineAction, refreshSocial, useOnlineState } from "../online/controller";
import { useGameStore } from "../store/gameStore";

type Channel = "global" | "trade" | "help";
const labels: Record<Channel, string> = { global: "Chat Mundial", trade: "Chat de Trade", help: "Chat de Help" };
const date = (value: string) => new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export function CombatCommunity() {
  const { active, social, pending, error } = useOnlineState();
  const character = useGameStore(state => state.character);
  const [channel, setChannel] = useState<Channel>("global");
  const [body, setBody] = useState("");
  const [localError, setLocalError] = useState("");

  useEffect(() => { if (active) void refreshSocial(); }, [active]);

  const messages = useMemo(() => {
    const all = social?.messages ?? [];
    return all.filter((message: any) => (message.channel ?? "global") === channel);
  }, [social?.messages, channel]);

  if (!active || !character) {
    return <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-gray-400">Conecte sua conta online para participar dos chats.</div>;
  }

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = body.trim();
    if (!text) return;
    setLocalError("");
    try {
      await onlineAction("message.send", { body: text, channel });
      setBody("");
    } catch (cause) {
      setLocalError(cause instanceof Error ? cause.message : "Não foi possível enviar a mensagem.");
    }
  };

  return <div className="rounded-lg border border-arcane-cyan/30 bg-black/20 p-3">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(labels) as Channel[]).map(id => <button key={id} type="button" onClick={() => setChannel(id)} className={channel === id ? "online-button" : "online-button-secondary"}>{labels[id]}</button>)}
      </div>
      <button type="button" className="online-button-secondary text-xs" onClick={() => void refreshSocial()}>Atualizar</button>
    </div>
    {(error || localError) && <p role="alert" className="mb-2 text-xs text-red-300">{localError || error}</p>}
    <div className="online-chat-log !h-48" role="log" aria-label={labels[channel]}>
      {messages.map((message: any) => <article key={message.id} className="border-b border-white/5 py-2">
        <div className="text-[11px]"><strong className="text-arcane-gold">{message.sender_name}</strong><span className="ml-2 text-gray-500">{date(message.created_at)}</span></div>
        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-200">{message.body}</p>
      </article>)}
      {!messages.length && <p className="text-sm text-gray-500">Nenhuma mensagem neste canal ainda.</p>}
    </div>
    <form onSubmit={send} className="mt-3 flex gap-2">
      <input required maxLength={500} value={body} onChange={event => setBody(event.target.value)} disabled={pending} className="online-input flex-1" placeholder={`Escreva no ${labels[channel].toLowerCase()}…`} />
      <button disabled={pending || !body.trim()} className="online-button">Enviar</button>
    </form>
  </div>;
}
