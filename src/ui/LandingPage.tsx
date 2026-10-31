import React, { FormEvent, useState } from "react";
import { HistorySection } from "./Wiki";
import { createLocalAccount, LocalAccount, signInLocalAccount } from "../utils/localAccounts";

type AccessMode = "register" | "login";

interface LandingPageProps {
  onAuthenticated: (account: LocalAccount) => void;
}

export function LandingPage({ onAuthenticated }: LandingPageProps) {
  const [accessMode, setAccessMode] = useState<AccessMode | null>(null);

  const openAccess = (mode: AccessMode) => setAccessMode(mode);
  const closeAccess = () => setAccessMode(null);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <a className="landing-brand" href="#inicio" aria-label="Mythreon Online, início">
          <img src="/assets/branding/mythreon-logo-horizontal.png" alt="Mythreon Online" />
        </a>
        <nav className="landing-nav" aria-label="Navegação principal">
          <a href="#universo">O universo</a>
          <a href="#jornada">Sua jornada</a>
          <a href="#historia">História</a>
        </nav>
        <div className="landing-actions">
          <button className="landing-login" onClick={() => openAccess("login")}>Entrar</button>
          <button className="landing-button landing-button-small" onClick={() => openAccess("register")}>Jogar agora <span aria-hidden="true">↗</span></button>
        </div>
      </header>

      <main>
        <section className="landing-hero" id="inicio">
          <div className="landing-hero-art" aria-hidden="true" />
          <div className="landing-hero-content">
            <div className="landing-eyebrow"><span /> UM MUNDO ESCRITO PELA ESSÊNCIA</div>
            <h1>O destino de Mythreon <em>também está em suas mãos.</em></h1>
            <p className="landing-lead">Explore terras antigas, descubra os segredos da Essência e construa sua própria lenda em um RPG idle de fantasia que continua vivo enquanto você está fora.</p>
            <div className="landing-hero-buttons">
              <button className="landing-button" onClick={() => openAccess("register")}>✦ &nbsp;Jogar agora — é grátis</button>
              <a className="landing-button landing-button-quiet" href="#historia">Conhecer a história <span aria-hidden="true">↓</span></a>
            </div>
            <div className="landing-proof"><span>✦</span> Progresso salvo no seu navegador <i /> Uma aventura para jogar no seu ritmo</div>
          </div>
          <div className="landing-world-card">
            <div className="landing-world-image" />
            <div className="landing-world-caption"><span className="landing-status-dot" /> O mundo continua em movimento</div>
            <div className="landing-world-stamp"><img src="/assets/branding/mythreon-logo-mark.png" alt="" /><span>MYTHREON<br /><small>ONLINE</small></span></div>
          </div>
          <a className="landing-scroll-cue" href="#universo">DESCUBRA O MUNDO <span>⌄</span></a>
        </section>

        <section className="landing-universe landing-section" id="universo">
          <div className="landing-section-heading"><span className="landing-eyebrow">UMA AVENTURA QUE NÃO PARA</span><h2>Mais do que caçar.<br /><em>Uma história para descobrir.</em></h2><p>Mythreon é um mundo de fantasia moldado por escolhas, memórias e forças ancestrais. Sua jornada começa pequena. O que você fará com ela?</p></div>
          <div className="landing-feature-grid">
            <article className="landing-feature"><span className="landing-feature-icon">◷</span><h3>O mundo segue vivo</h3><p>Treine e avance em um RPG idle. Quando voltar, sua aventura terá continuado.</p></article>
            <article className="landing-feature"><span className="landing-feature-icon">⚔</span><h3>Encontre seu caminho</h3><p>Explore regiões, enfrente criaturas e descubra equipamentos e recompensas.</p></article>
            <article className="landing-feature"><span className="landing-feature-icon">✧</span><h3>Desperte sua Essência</h3><p>Combine habilidades, revele linhagens e forme um personagem que seja seu.</p></article>
          </div>
        </section>

        <section className="landing-journey" id="jornada">
          <div className="landing-journey-art" aria-hidden="true" />
          <div><span className="landing-eyebrow">SUA HISTÓRIA COMEÇA AGORA</span><h2>Escolha um nome.<br />O resto, Mythreon lembrará.</h2><p>Crie sua conta neste navegador, dê vida ao seu personagem e parta para sua primeira caçada. Seu progresso fica guardado para quando você voltar.</p><button className="landing-button" onClick={() => openAccess("register")}>Criar minha conta <span aria-hidden="true">→</span></button></div>
          <div className="landing-journey-seal"><span>✦</span><small>A ESSÊNCIA<br />REGISTRA TUDO</small></div>
        </section>

        <section className="landing-lore" id="historia">
          <div className="landing-lore-intro"><span className="landing-eyebrow">OS REGISTROS DA CÚPULA SINAX</span><h2>O Livro da Criação</h2><p>Do silêncio primordial à era presente, conheça os registros que explicam o nascimento de Mythreon. Esta é a história completa preservada no Arquivo do jogo.</p></div>
          <HistorySection />
        </section>
      </main>

      <footer className="landing-footer"><a href="#inicio"><img src="/assets/branding/mythreon-logo-horizontal.png" alt="Mythreon Online" /></a><span>“A Essência registra tudo.”</span><button onClick={() => openAccess("register")}>Sua aventura espera por você <span aria-hidden="true">→</span></button></footer>
      {accessMode && <AccountDialog mode={accessMode} onModeChange={setAccessMode} onClose={closeAccess} onAuthenticated={onAuthenticated} />}
    </div>
  );
}

function AccountDialog({ mode, onModeChange, onClose, onAuthenticated }: { mode: AccessMode; onModeChange: (mode: AccessMode) => void; onClose: () => void; onAuthenticated: (account: LocalAccount) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const registering = mode === "register";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (registering && password !== confirmation) return setError("As senhas não são iguais.");
    setBusy(true);
    try {
      const account = registering ? await createLocalAccount(email, password) : await signInLocalAccount(email, password);
      onAuthenticated(account);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível acessar a conta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="account-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="account-dialog" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <button className="account-close" onClick={onClose} aria-label="Fechar">×</button>
        <img className="account-logo" src="/assets/branding/mythreon-logo-horizontal.png" alt="Mythreon Online" />
        <span className="landing-eyebrow">SUA JORNADA COMEÇA AQUI</span>
        <h2 id="account-title">{registering ? "Criar conta" : "Bem-vindo de volta"}</h2>
        <p>{registering ? "Guarde seu progresso e prepare-se para explorar." : "Entre com a conta criada neste navegador."}</p>
        <form onSubmit={submit}>
          <label htmlFor="account-email">Conta (e-mail)</label>
          <input id="account-email" type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="voce@exemplo.com" />
          <label htmlFor="account-password">Senha</label>
          <input id="account-password" type="password" autoComplete={registering ? "new-password" : "current-password"} required minLength={8} value={password} onChange={event => setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres" />
          {registering && <><label htmlFor="account-confirm">Confirmar senha</label><input id="account-confirm" type="password" autoComplete="new-password" required minLength={8} value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder="Digite a senha novamente" /></>}
          {error && <div className="account-error" role="alert">{error}</div>}
          <button className="landing-button account-submit" disabled={busy}>{busy ? "Aguarde..." : registering ? "Criar conta e jogar" : "Entrar e continuar"}</button>
        </form>
        <div className="account-note">Por enquanto, a conta e o progresso ficam salvos neste navegador.</div>
        <button className="account-switch" onClick={() => { setError(""); onModeChange(registering ? "login" : "register"); }}>{registering ? "Já tem conta? Entrar" : "Primeira vez aqui? Criar conta"}</button>
      </section>
    </div>
  );
}
