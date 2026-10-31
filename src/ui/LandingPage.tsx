import React, { FormEvent, useState } from "react";
import { HistorySection } from "./Wiki";
import { createLocalAccount, LocalAccount, signInLocalAccount } from "../utils/localAccounts";

type AccessMode = "register" | "login";

const brandBannerUrl = new URL("../../imagens/image_5f23237d.jpg", import.meta.url).href;

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
          <a href="#caminhos">Classes e builds</a>
          <a href="#horizonte">O que vem aí</a>
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

        <figure className="landing-brand-art">
          <img src={brandBannerUrl} alt="Mythreon Online em um vale suspenso iluminado por cristais" />
          <figcaption>Um mundo antigo. Uma Essência que ainda guarda segredos.</figcaption>
        </figure>

        <section className="landing-paths landing-section" id="caminhos">
          <div className="landing-section-heading">
            <span className="landing-eyebrow">CLASSES, ARQUÉTIPOS E BUILDS</span>
            <h2>Seu caminho nasce das <em>escolhas que você combina.</em></h2>
            <p>Em Mythreon, seu arquétipo nasce das combinações que você escolhe. Combine um componente de Ataque, um de Suporte e uma Passiva para construir uma identidade própria: agressiva, resistente, veloz, arcana ou híbrida.</p>
          </div>
          <div className="landing-path-grid">
            <article className="landing-path-card"><span className="landing-path-symbol">⚔</span><span className="landing-path-label">01 · ATAQUE</span><h3>Defina como lutar</h3><p>Golpes físicos, magia, veneno, sangramento, gelo, tempestade e outras forças moldam sua ofensiva.</p></article>
            <article className="landing-path-card"><span className="landing-path-symbol">✧</span><span className="landing-path-label">02 · SUPORTE</span><h3>Escolha como persistir</h3><p>Cura, escudos, velocidade, adaptação, precisão e vínculos mudam o ritmo da batalha.</p></article>
            <article className="landing-path-card"><span className="landing-path-symbol">◈</span><span className="landing-path-label">03 · PASSIVA</span><h3>Imprima sua marca</h3><p>Resistência, esquiva, crítico, experiência, drops e criação favorecem diferentes estratégias.</p></article>
          </div>
          <div className="landing-build-count">
            <div><span className="landing-eyebrow">O SISTEMA ATUAL</span><strong>2.340</strong><p>combinações teóricas entre 15 ataques, 13 suportes e 12 passivas, antes de considerar os equipamentos.</p></div>
            <div className="landing-build-target"><span>PRÓXIMO HORIZONTE</span><strong>3.900+</strong><p>Uma meta de expansão para novos arquétipos, escolhas e formas de montar sua build.</p></div>
          </div>
          <p className="landing-build-footnote">Os 33 arquétipos nomeados já registrados no jogo são combinações especiais. O catálogo cresce com o desenvolvimento de Mythreon.</p>
        </section>        <section className="landing-journey" id="jornada">
          <div className="landing-journey-art" aria-hidden="true" />
          <div><span className="landing-eyebrow">SUA HISTÓRIA COMEÇA AGORA</span><h2>Escolha um nome.<br />O resto, Mythreon lembrará.</h2><p>Crie sua conta neste navegador, dê vida ao seu personagem e parta para sua primeira caçada. Seu progresso fica guardado para quando você voltar.</p><button className="landing-button" onClick={() => openAccess("register")}>Criar minha conta <span aria-hidden="true">→</span></button></div>
          <div className="landing-journey-seal"><span>✦</span><small>A ESSÊNCIA<br />REGISTRA TUDO</small></div>
        </section>

        <section className="landing-roadmap" id="horizonte">
          <div className="landing-roadmap-heading"><span className="landing-eyebrow">O FUTURO DE MYTHREON</span><h2>O próximo capítulo,<br /><em>construído com a comunidade.</em></h2><p>Estas ideias fazem parte da visão do projeto. Estamos trabalhando para transformar cada uma delas em sistemas jogáveis.</p></div>
          <div className="landing-roadmap-grid">
            <article className="landing-roadmap-card"><span className="landing-roadmap-status">PLANEJADO</span><span className="landing-roadmap-icon">✦</span><h3>Relíquias raras e mercado</h3><p>Itens raros podem ganhar valor dentro da economia do jogo. Um mercado entre jogadores está nos planos; regras, segurança e qualquer possibilidade de valor em dinheiro ainda serão definidas. Nenhum item possui valor monetário garantido.</p></article>
            <article className="landing-roadmap-card"><span className="landing-roadmap-status">PLANEJADO</span><span className="landing-roadmap-icon">✉</span><h3>Trocas e correio</h3><p>Negociação direta e envio de itens pelo correio do jogo estão no horizonte, com controles para tornar as trocas claras e confiáveis.</p></article>
            <article className="landing-roadmap-card"><span className="landing-roadmap-status">A ANUNCIAR</span><span className="landing-roadmap-icon">◉</span><h3>Comunidade no Discord</h3><p>Um espaço oficial para conversar, acompanhar novidades, compartilhar builds e participar dos próximos passos será divulgado quando estiver pronto.</p></article>
            <article className="landing-roadmap-card"><span className="landing-roadmap-status">EM EVOLUÇÃO</span><span className="landing-roadmap-icon">⌖</span><h3>Novas jornadas</h3><p>Mais regiões, criaturas, histórias e caminhos para explorar o mundo e descobrir o que a Essência ainda guarda.</p></article>
          </div>
        </section>        <section className="landing-lore" id="historia">
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
