import React, { useEffect, useState } from "react";

type UpdateState = MythreonDesktopUpdateResult & { status: "checking" | "available" | "downloaded" | "unavailable" | "error" };

export function DesktopUpdateNotice() {
  const desktop = typeof window !== "undefined" ? window.mythreonDesktop : undefined;
  const [state, setState] = useState<UpdateState>({ status: "checking" });

  useEffect(() => {
    if (!desktop) return;
    const apply = (payload: MythreonDesktopUpdateResult) => {
      setState({ status: payload.status ?? (payload.available ? "available" : "unavailable"), ...payload });
    };
    const unsubscribe = desktop.onUpdate(apply);
    void desktop.checkForUpdate().then(apply).catch(() => setState({ status: "unavailable" }));
    return unsubscribe;
  }, [desktop]);

  if (!desktop || state.status === "checking" || state.status === "unavailable" || !state.manifest) return null;

  const download = async () => {
    setState(current => ({ ...current, status: "checking" }));
    try {
      const result = await desktop.downloadUpdate();
      setState({ status: result.status === "error" ? "error" : result.downloaded ? "downloaded" : "available", ...result });
    } catch (error) {
      setState(current => ({ ...current, status: "error", error: error instanceof Error ? error.message : "Não foi possível baixar a atualização." }));
    }
  };

  const open = async () => {
    const result = await desktop.openUpdate();
    if (!result.ok) setState(current => ({ ...current, status: "error", error: result.error ?? "Não foi possível abrir o instalador." }));
  };

  return (
    <section className="desktop-update-notice" aria-live="polite">
      <div>
        <strong>✨ Atualização {state.manifest.version} disponível</strong>
        {state.manifest.notes && <p>{state.manifest.notes}</p>}
        {state.error && <p className="desktop-update-error">{state.error}</p>}
      </div>
      {state.status === "downloaded" ? (
        <button className="online-button" onClick={() => void open()}>Reiniciar para atualizar</button>
      ) : (
        <button className="online-button" onClick={() => void download()}>{state.status === "error" ? "Tentar novamente" : "Baixar atualização"}</button>
      )}
    </section>
  );
}
