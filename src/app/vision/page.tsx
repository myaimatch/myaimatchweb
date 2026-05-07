import type { Metadata } from "next";
import { VisionVideoButton } from "@/components/vision/VisionVideoButton";

export const metadata: Metadata = {
  title: "myAImatch · Vision",
  description: "Internal proposal — the AI workflow brain ecosystem.",
  robots: { index: false, follow: false },
};

export default function VisionPage() {
  return (
    <div className="vision-root">
      <style dangerouslySetInnerHTML={{ __html: VISION_STYLES }} />

      {/* ─────── Section 1 · Hero ─────── */}
      <section className="vision-hero">
        <div className="vision-hero-noise" aria-hidden="true" />
        <VisionVideoButton />
        <div className="vision-shell vision-hero-inner">
          <span className="vision-pill">
            <span className="vision-pill-dot" />
            INTERNAL · V2 PROPOSAL · 2026
          </span>
          <h1 className="vision-hero-title">
            myAImatch deja de ser un directorio.
            <br />
            Se convierte en tu <span>AI workflow brain</span>.
          </h1>
          <p className="vision-hero-body">
            Una membresía mensual. Un <em>agent</em> que vive en tu computadora,
            aprende tu día, y te dice qué <em>tools</em> y <em>workflows</em>{" "}
            usar para ser <strong>10x más productivo</strong>.
          </p>
          <div className="vision-hero-meta">
            <span><strong>Subscription</strong> + Affiliate + Services</span>
            <span className="vision-meta-divider">·</span>
            <span><strong>Individual</strong> · Team · Enterprise</span>
            <span className="vision-meta-divider">·</span>
            <span><strong>Local-first</strong> · privacy-respecting</span>
          </div>
        </div>
        <div className="vision-hero-scroll" aria-hidden="true">
          <span>scroll</span>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path d="M5 1v12M1 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ─────── Section 2 · Ecosystem Diagram ─────── */}
      <section className="vision-ecosystem">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">02 · El ecosistema</span>
            <h2 className="vision-section-title">
              Cómo el <span>workflow brain</span> conecta todo.
            </h2>
            <p className="vision-section-body">
              Cinco capas que se alimentan en loop: tu día se vuelve data, la
              data se vuelve memory, la memory cruza con el catálogo vivo de
              tools, y el resultado regresa a ti como recomendaciones que
              ningún directorio estático puede dar.
            </p>
          </header>

          <div className="vision-eco-canvas">
            <div className="vision-eco-grid">
              <div className="vision-eco-column">
                <EcoNode
                  index="01"
                  kicker="INPUT"
                  titleEn="Your daily workflow"
                  titleEs="Tu día"
                  body="clicks · apps · tareas · websites · transiciones · idle time"
                  icon={<IconActivity />}
                />
                <Connector label="silent local capture" />
                <EcoNode
                  index="02"
                  kicker="LOCAL"
                  titleEn="myAImatch desktop agent"
                  titleEs="El agente"
                  body="Tauri · macOS / Win / Linux · encrypted on-device · sin keylogging"
                  icon={<IconChip />}
                  highlight
                />
                <Connector />
                <EcoNode
                  index="03"
                  kicker="MEMORY"
                  titleEn="Your personal AI brain"
                  titleEs="Tu cerebro"
                  body="memory persistente · context · patterns · improves week over week"
                  icon={<IconBrain />}
                  spotlight
                />
                <Connector label="continuous sync ↕" bidirectional />
                <EcoNode
                  index="04"
                  kicker="LIVE"
                  titleEn="myAImatch tool catalog"
                  titleEs="El catálogo vivo"
                  body="tools · news · docs · workflows · releases — la fuente más fresca"
                  icon={<IconCatalog />}
                  highlight
                />
                <Connector />
                <EcoNode
                  index="05"
                  kicker="OUTPUT"
                  titleEn="Monthly optimization report"
                  titleEs="El reporte mensual"
                  body='"instala X" · "automatiza Y" · "elimina Z" — específico para ti'
                  icon={<IconReport />}
                />
              </div>

              <aside className="vision-moat-card" aria-label="Data moat highlight">
                <span className="vision-moat-label">el moat</span>
                <h3>First-hand workflow data</h3>
                <p>
                  Ningún competidor tiene este <em>input</em>. Vinculado al
                  usuario individual, en tiempo real, anonimizable.
                </p>
                <div className="vision-moat-meta">
                  <span>· no se compra</span>
                  <span>· no se replica</span>
                  <span>· crece con cada usuario</span>
                </div>
                <svg
                  className="vision-moat-arrow"
                  width="180"
                  height="60"
                  viewBox="0 0 180 60"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M170 30 C 130 30, 110 18, 60 22 L 18 30 M30 22 L 18 30 L 30 38"
                    stroke="rgba(196,181,253,0.62)"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="3 4"
                  />
                </svg>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── Section 3 · How It Works ─────── */}
      <section className="vision-how">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">03 · Cómo funciona</span>
            <h2 className="vision-section-title">
              Tres pasos. <span>Capture → learn → match.</span>
            </h2>
            <p className="vision-section-body">
              La ingeniería existe. Hay <em>precedentes claros</em> (RescueTime,
              Rize, Magical, Reclaim). Lo que nadie ha unido todavía: tracking
              de workflow + un catálogo vivo de AI tools que cambia cada semana.
            </p>
          </header>

          <div className="vision-how-grid">
            <article className="vision-how-card">
              <div className="vision-how-num">01</div>
              <span className="vision-how-kicker">Capture</span>
              <h3>El agent corre en background.</h3>
              <p>
                Registra señales del sistema operativo: apps activas, websites,
                ventanas enfocadas, transiciones, tiempo idle. <strong>Local-first</strong>,
                encriptado en tu disco. Sin keylogging, sin screenshots por
                defecto. Tú decides qué se sincroniza.
              </p>
              <ul className="vision-how-bullets">
                <li>Tauri (Rust + webview) — bundle &lt;15MB</li>
                <li>macOS · Windows · Linux desde un mismo build</li>
                <li>Encriptación AES-256 on-device</li>
              </ul>
            </article>

            <article className="vision-how-card">
              <div className="vision-how-num">02</div>
              <span className="vision-how-kicker">Learn</span>
              <h3>El brain procesa patrones.</h3>
              <p>
                Tu <em>personal AI brain</em> identifica cuándo eres más
                productivo, qué tools usas mal, en qué tarea pierdes 40 min al
                día. <strong>Memory persistente</strong> — la versión del mes 6
                no se parece a la del día uno.
              </p>
              <ul className="vision-how-bullets">
                <li>Vector store local (sqlite-vec / lancedb)</li>
                <li>LLM cloud para análisis pesado, on-device para inferencia</li>
                <li>Embeddings privados — tu data nunca entrena modelos públicos</li>
              </ul>
            </article>

            <article className="vision-how-card">
              <div className="vision-how-num">03</div>
              <span className="vision-how-kicker">Match</span>
              <h3>Cruzamos contra el catálogo vivo.</h3>
              <p>
                Aquí es donde myAImatch ya tiene ventaja: el catálogo de tools
                se actualiza constantemente. Cruzamos <em>tu</em> contexto con
                lo más fresco. Resultado: <strong>recomendaciones específicas</strong>{" "}
                que un directorio estático nunca podría dar.
              </p>
              <ul className="vision-how-bullets">
                <li>Re-ranking semanal con releases nuevos</li>
                <li>Auto-comparativa contra tools que ya usas</li>
                <li>Workflow templates listos para implementar</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ─────── Section 4 · Value Moat ─────── */}
      <section className="vision-moat">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">04 · Por qué tiene valor</span>
            <h2 className="vision-section-title">
              Tres ingredientes. <span>Imposibles de replicar juntos.</span>
            </h2>
          </header>

          <div className="vision-moat-grid">
            <article className="vision-moat-pillar">
              <div className="vision-moat-orb" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="9" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M8 9V6a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <span className="vision-moat-pillar-kicker">First-hand data</span>
              <h3>Workflow real, no surveys.</h3>
              <p>
                Nadie más tiene este input. En tiempo real, vinculado al
                usuario individual. Vendors solo ven engagement de su producto
                — nosotros vemos el día completo.
              </p>
            </article>

            <article className="vision-moat-pillar">
              <div className="vision-moat-orb vision-moat-orb--accent" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h3M18 12h3M12 3v3M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" />
                </svg>
              </div>
              <span className="vision-moat-pillar-kicker">Live catalog</span>
              <h3>La fuente más fresca.</h3>
              <p>
                myAImatch ya recolecta news, docs, releases, integrations. Se
                actualiza más rápido que cualquier humano puede. <em>Eso ya lo
                tenemos</em> — solo falta enchufar el agent.
              </p>
            </article>

            <article className="vision-moat-pillar">
              <div className="vision-moat-orb" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3a6 6 0 0 0-6 6c0 2 .8 3.5 2 5l1 4h6l1-4c1.2-1.5 2-3 2-5a6 6 0 0 0-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <span className="vision-moat-pillar-kicker">Continuous learning</span>
              <h3>El switching cost se vuelve enorme.</h3>
              <p>
                Cada día el brain mejora. Mes 6 ≠ Mes 1. Las recomendaciones se
                vuelven irreemplazables — porque ya conocen tu historia, no
                solo tu perfil.
              </p>
            </article>
          </div>

          <p className="vision-moat-quote">
            <span>&ldquo;</span>
            Cuanto más lo usas, menos puedes vivir sin él.
            <span>&rdquo;</span>
          </p>
        </div>
      </section>

      {/* ─────── Section 5 · Revenue Streams ─────── */}
      <section className="vision-revenue">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">05 · Modelo de negocio</span>
            <h2 className="vision-section-title">
              Cuatro ingresos. <span>Todos se refuerzan entre sí.</span>
            </h2>
            <p className="vision-section-body">
              La suscripción genera <em>data</em>. La data genera mejores{" "}
              <em>recomendaciones</em>. Las recomendaciones generan{" "}
              <em>affiliate clicks</em> y <em>implementaciones</em>. Y eso paga
              la próxima ronda de mejoras.
            </p>
          </header>

          <div className="vision-revenue-grid">
            <article className="vision-revenue-card">
              <span className="vision-revenue-num">01</span>
              <span className="vision-revenue-tag vision-revenue-tag--recurring">recurring</span>
              <h3>SaaS Individual</h3>
              <p className="vision-revenue-tagline">
                El producto core: agent + brain + reporte mensual.
              </p>
              <div className="vision-revenue-price">
                <strong>$19</strong>
                <span>/mo · per user</span>
              </div>
              <p className="vision-revenue-note">
                Free trial agresivo (14 días) para mostrar valor antes del
                primer charge.
              </p>
            </article>

            <article className="vision-revenue-card vision-revenue-card--featured">
              <span className="vision-revenue-num">02</span>
              <span className="vision-revenue-tag vision-revenue-tag--recurring">recurring</span>
              <h3>Team Plan</h3>
              <p className="vision-revenue-tagline">
                Cada miembro tiene su brain · contexto compartido del equipo ·
                recomendaciones <em>org-level</em>.
              </p>
              <div className="vision-revenue-price">
                <strong>$49</strong>
                <span>/seat · mín 5 seats</span>
              </div>
              <p className="vision-revenue-note">
                El upsell natural: una vez que un equipo lo usa, se convierte en
                infraestructura de productividad.
              </p>
            </article>

            <article className="vision-revenue-card">
              <span className="vision-revenue-num">03</span>
              <span className="vision-revenue-tag vision-revenue-tag--transactional">transactional</span>
              <h3>Affiliate Revenue</h3>
              <p className="vision-revenue-tagline">
                Comisión cuando el usuario contrata un tool recomendado.
              </p>
              <div className="vision-revenue-price">
                <strong>15-30%</strong>
                <span>· por conversión</span>
              </div>
              <p className="vision-revenue-note">
                Ya es parte del modelo actual de myAImatch. Solo escala con la
                base de usuarios.
              </p>
            </article>

            <article className="vision-revenue-card">
              <span className="vision-revenue-num">04</span>
              <span className="vision-revenue-tag vision-revenue-tag--services">project-based</span>
              <h3>Implementation Services</h3>
              <p className="vision-revenue-tagline">
                <em>myAImatch Company</em> implementa los tools recomendados
                por ti — tu margen alto.
              </p>
              <div className="vision-revenue-price">
                <strong>$3K-30K</strong>
                <span>· por proyecto</span>
              </div>
              <p className="vision-revenue-note">
                El upsell de margen alto. El reporte mensual abre la
                conversación; nosotros cerramos la entrega.
              </p>
            </article>
          </div>

          <div className="vision-revenue-flywheel">
            <span className="vision-label">El flywheel</span>
            <p>
              <strong>Suscripción</strong> → genera data ·
              <strong> Data</strong> → mejora recomendaciones ·
              <strong> Recomendaciones</strong> → affiliate clicks ·
              <strong> Affiliate</strong> → cierre con servicios.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── Section 6 · Closing ─────── */}
      <section className="vision-close">
        <div className="vision-shell vision-close-inner">
          <span className="vision-label">06 · Por qué ahora</span>
          <h2 className="vision-close-title">
            Las AI tools cambian cada semana.
            <br />
            <span>Los humanos no.</span>
          </h2>
          <p className="vision-close-body">
            El gap entre lo que existe y lo que la gente realmente usa se hace
            más grande cada día. <strong>myAImatch cierra ese gap</strong> — no
            como un directorio, sino como un compañero que aprende contigo.
          </p>
          <div className="vision-close-cta" role="group" aria-label="Next step">
            <span className="vision-close-cta-arrow">→</span>
            <span className="vision-close-cta-label">Next step</span>
            <span className="vision-close-cta-text">
              Prototype del desktop agent en <strong>8 semanas</strong>
            </span>
          </div>
          <footer className="vision-footer">
            <span>myAImatch · Internal proposal · 2026</span>
            <span className="vision-footer-divider">·</span>
            <span>Confidential</span>
          </footer>
        </div>
      </section>
    </div>
  );
}

/* ─────────── Inline node + connector helpers ─────────── */

type EcoNodeProps = {
  index: string;
  kicker: string;
  titleEn: string;
  titleEs: string;
  body: string;
  icon: React.ReactNode;
  highlight?: boolean;
  spotlight?: boolean;
};

function EcoNode({
  index,
  kicker,
  titleEn,
  titleEs,
  body,
  icon,
  highlight,
  spotlight,
}: EcoNodeProps) {
  const cls = [
    "vision-eco-node",
    highlight ? "vision-eco-node--highlight" : "",
    spotlight ? "vision-eco-node--spotlight" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls}>
      <div className="vision-eco-node-head">
        <span className="vision-eco-node-num">{index}</span>
        <span className="vision-eco-node-kicker">{kicker}</span>
        <span className="vision-eco-node-icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <h3 className="vision-eco-node-title">
        {titleEn}
        <span className="vision-eco-node-title-es">{titleEs}</span>
      </h3>
      <p className="vision-eco-node-body">{body}</p>
    </div>
  );
}

function Connector({
  label,
  bidirectional,
}: {
  label?: string;
  bidirectional?: boolean;
}) {
  return (
    <div
      className={`vision-eco-connector${bidirectional ? " vision-eco-connector--bi" : ""}`}
      aria-hidden="true"
    >
      <span className="vision-eco-connector-line" />
      {label ? (
        <span className="vision-eco-connector-label">{label}</span>
      ) : null}
    </div>
  );
}

/* ─────────── Inline icons ─────────── */

function IconActivity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12h3l3-8 4 16 3-8h5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChip() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 9h2M2 15h2M20 9h2M20 15h2M9 2v2M15 2v2M9 20v2M15 20v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 4a3 3 0 0 0-3 3v.5a3 3 0 0 0-2 2.8v.7a3 3 0 0 0 1 2.2V14a3 3 0 0 0 3 3h0M15 4a3 3 0 0 1 3 3v.5a3 3 0 0 1 2 2.8v.7a3 3 0 0 1-1 2.2V14a3 3 0 0 1-3 3h0M12 4v17M9 17v3M15 17v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCatalog() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 9h18M8 4v16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 13h6M11 16h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconReport() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M14 3v5h5M9 13h7M9 16h6M9 10h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Page-scoped styles ─────────── */

const VISION_STYLES = `
  .vision-root {
    --v-primary: #8468EB;
    --v-accent: #C4B5FD;
    --v-deep: #5B42C3;
    --v-deepest: #311B92;
    --v-text: #ffffff;
    --v-text-muted: rgba(255,255,255,0.66);
    --v-text-dim: rgba(255,255,255,0.42);
    --v-border-soft: rgba(255,255,255,0.08);
    --v-border-purple: rgba(132,104,235,0.28);
    --v-surface: rgba(255,255,255,0.025);
    --v-surface-elevated: rgba(255,255,255,0.04);

    position: relative;
    background: #050507;
    color: var(--v-text);
    font-family: "Inter", system-ui, sans-serif;
    overflow: hidden;
  }

  .vision-root em {
    font-style: normal;
    color: #ffffff;
    font-weight: 600;
  }

  .vision-shell {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
  }

  .vision-label {
    display: inline-block;
    margin-bottom: 14px;
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .vision-section-head {
    max-width: 720px;
    margin: 0 0 56px;
  }

  .vision-section-title {
    margin: 0;
    color: #ffffff;
    font-size: clamp(34px, 5.4vw, 64px);
    font-weight: 800;
    letter-spacing: -0.045em;
    line-height: 1.0;
  }

  .vision-section-title span {
    background: linear-gradient(135deg, #ffffff 4%, #C4B5FD 56%, #5B42C3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .vision-section-body {
    margin: 22px 0 0;
    max-width: 620px;
    color: var(--v-text-muted);
    font-size: 17px;
    line-height: 1.72;
  }

  /* ─── Section 1 · Hero ─── */

  .vision-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 96px 0 88px;
    background:
      radial-gradient(ellipse 80% 56% at 50% -6%, rgba(132,104,235,0.32), rgba(91,66,195,0.12) 38%, transparent 72%),
      radial-gradient(ellipse 52% 42% at 82% 28%, rgba(196,181,253,0.16), transparent 68%),
      radial-gradient(ellipse 44% 34% at 12% 86%, rgba(132,104,235,0.12), transparent 62%),
      linear-gradient(180deg, rgba(132,104,235,0.08), transparent 24%),
      #000000;
  }

  .vision-hero::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 88px 88px;
    mask-image: radial-gradient(ellipse 70% 56% at 50% 14%, black, transparent 76%);
    pointer-events: none;
    z-index: 0;
  }

  .vision-hero::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 220px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(196,181,253,0.92), rgba(132,104,235,0.46), transparent);
    box-shadow: 0 0 22px rgba(132,104,235,0.4);
    pointer-events: none;
  }

  .vision-hero-noise {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
    opacity: 0.034;
    mix-blend-mode: overlay;
    pointer-events: none;
  }

  .vision-video-launcher {
    position: absolute;
    top: 34px;
    left: 50%;
    z-index: 8;
    width: min(680px, calc(100% - 32px));
    transform: translateX(-50%);
  }

  .vision-video-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    width: 100%;
    min-height: 62px;
    padding: 10px 26px 10px 12px;
    border: 1px solid rgba(196,181,253,0.28);
    border-radius: 999px;
    background:
      radial-gradient(ellipse 64% 120% at 50% 120%, rgba(132,104,235,0.24), rgba(132,104,235,0)),
      rgba(17,17,17,0.72);
    color: #ffffff;
    font-family: inherit;
    cursor: pointer;
    backdrop-filter: blur(18px);
    overflow: hidden;
    transform: translateY(0) scale(1);
    transition:
      transform 220ms cubic-bezier(0.22,1,0.36,1),
      border-color 220ms ease,
      background 220ms ease;
  }

  .vision-video-button::before {
    content: "";
    position: absolute;
    left: 16%;
    right: 16%;
    bottom: -26px;
    height: 54px;
    border-radius: 999px;
    background: radial-gradient(ellipse, rgba(132,104,235,0.36), rgba(132,104,235,0) 72%);
    filter: blur(8px);
    opacity: 0.72;
    pointer-events: none;
  }

  .vision-video-button:hover {
    transform: translateY(-2px) scale(1.01);
    border-color: rgba(196,181,253,0.46);
    background:
      radial-gradient(ellipse 70% 130% at 50% 120%, rgba(132,104,235,0.34), rgba(132,104,235,0)),
      rgba(17,17,17,0.82);
  }

  .vision-video-button:active {
    transform: translateY(0) scale(0.985);
  }

  .vision-video-button:focus-visible,
  .vision-video-close:focus-visible {
    outline: 2px solid rgba(196,181,253,0.86);
    outline-offset: 3px;
  }

  .vision-video-button-icon {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    border: 1px solid rgba(196,181,253,0.34);
    border-radius: 999px;
    background: linear-gradient(135deg, #8468EB, #5B42C3);
    color: #ffffff;
  }

  .vision-video-button-copy {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 12px;
    min-width: 0;
    color: rgba(255,255,255,0.9);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }

  .vision-video-button-copy strong {
    color: rgba(196,181,253,0.86);
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .vision-video-modal {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: 28px;
  }

  .vision-video-backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 18%, rgba(132,104,235,0.24), rgba(0,0,0,0) 68%),
      rgba(0,0,0,0.78);
    cursor: pointer;
    backdrop-filter: blur(16px);
  }

  .vision-video-panel {
    position: relative;
    z-index: 1;
    width: min(1180px, 100%);
    border: 1px solid rgba(196,181,253,0.22);
    border-radius: 18px;
    background: rgba(17,17,17,0.94);
    overflow: hidden;
  }

  .vision-video-panel::before {
    content: "";
    position: absolute;
    left: 20%;
    right: 20%;
    top: -58px;
    height: 120px;
    border-radius: 999px;
    background: radial-gradient(ellipse, rgba(132,104,235,0.34), rgba(132,104,235,0) 70%);
    filter: blur(12px);
    pointer-events: none;
  }

  .vision-video-panel-head {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 60px;
    padding: 12px 14px 12px 22px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.74);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .vision-video-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 999px;
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.78);
    cursor: pointer;
    transform: scale(1);
    transition:
      transform 180ms cubic-bezier(0.22,1,0.36,1),
      border-color 180ms ease,
      color 180ms ease;
  }

  .vision-video-close:hover {
    transform: scale(1.06);
    border-color: rgba(196,181,253,0.34);
    color: #ffffff;
  }

  .vision-video-player {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000000;
  }

  .vision-hero-inner {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .vision-pill {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border: 1px solid rgba(196,181,253,0.28);
    border-radius: 999px;
    background: rgba(132,104,235,0.1);
    color: rgba(255,255,255,0.78);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    line-height: 1;
  }

  .vision-pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--v-accent);
    box-shadow: 0 0 16px rgba(196,181,253,0.78);
    animation: orbPulse 2.4s ease-in-out infinite;
  }

  .vision-hero-title {
    margin: 28px auto 0;
    max-width: 1020px;
    color: #ffffff;
    font-size: clamp(48px, 7.2vw, 96px);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 1.0;
  }

  .vision-hero-title span {
    background: linear-gradient(135deg, #ffffff 0%, #C4B5FD 52%, #5B42C3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .vision-hero-body {
    margin: 28px auto 0;
    max-width: 680px;
    color: var(--v-text-muted);
    font-size: 18px;
    line-height: 1.72;
  }

  .vision-hero-body strong {
    color: #ffffff;
    font-weight: 700;
  }

  .vision-hero-meta {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 14px;
    margin: 36px auto 0;
    padding: 11px 22px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    background: rgba(255,255,255,0.025);
    color: var(--v-text-dim);
    font-size: 13px;
    letter-spacing: 0.01em;
  }

  .vision-hero-meta strong {
    color: #ffffff;
    font-weight: 700;
    margin-right: 4px;
  }

  .vision-meta-divider {
    color: rgba(255,255,255,0.22);
  }

  .vision-hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 36px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.36);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    animation: heroFadeUp 1.2s ease-out;
  }

  /* ─── Section 2 · Ecosystem ─── */

  .vision-ecosystem {
    position: relative;
    padding: 120px 0 132px;
    background:
      radial-gradient(ellipse 70% 40% at 50% 0%, rgba(132,104,235,0.2), transparent 70%),
      #07070b;
  }

  .vision-ecosystem::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 156px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(196,181,253,0.9), rgba(132,104,235,0.46), transparent);
    box-shadow: 0 0 18px rgba(132,104,235,0.35);
  }

  .vision-eco-canvas {
    position: relative;
    margin-top: 8px;
  }

  .vision-eco-grid {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 340px);
    gap: 64px;
    align-items: center;
  }

  .vision-eco-column {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  /* Eco node card */
  .vision-eco-node {
    position: relative;
    display: grid;
    gap: 12px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
      rgba(12,12,14,0.78);
    padding: 22px 24px;
    box-shadow:
      0 18px 48px rgba(0,0,0,0.42),
      0 0 0 1px rgba(255,255,255,0.02) inset;
    transition: transform 200ms cubic-bezier(0.22,1,0.36,1), border-color 200ms ease;
  }

  .vision-eco-node:hover {
    transform: translateY(-2px);
    border-color: rgba(196,181,253,0.24);
  }

  .vision-eco-node--highlight {
    border-color: rgba(196,181,253,0.22);
    background:
      radial-gradient(ellipse 80% 60% at 50% 100%, rgba(132,104,235,0.16), transparent 70%),
      linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02)),
      rgba(12,12,14,0.78);
  }

  .vision-eco-node--spotlight {
    border-color: rgba(196,181,253,0.42);
    background:
      radial-gradient(ellipse 90% 70% at 50% 0%, rgba(132,104,235,0.28), transparent 72%),
      linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)),
      rgba(20,16,42,0.84);
    box-shadow:
      0 22px 56px rgba(91,66,195,0.4),
      0 0 38px rgba(132,104,235,0.22),
      0 0 0 1px rgba(196,181,253,0.16) inset;
  }

  .vision-eco-node--spotlight::after {
    content: "";
    position: absolute;
    inset: -1px;
    z-index: -1;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(196,181,253,0.4), transparent 56%);
    filter: blur(14px);
    opacity: 0.42;
    pointer-events: none;
  }

  .vision-eco-node-head {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .vision-eco-node-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 38px;
    height: 26px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(132,104,235,0.16);
    border: 1px solid rgba(196,181,253,0.28);
    color: var(--v-accent);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .vision-eco-node-kicker {
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .vision-eco-node-icon {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 12px;
    border: 1px solid rgba(196,181,253,0.22);
    background: rgba(132,104,235,0.12);
    color: var(--v-accent);
  }

  .vision-eco-node-title {
    margin: 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.18;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 10px;
  }

  .vision-eco-node-title-es {
    color: var(--v-text-dim);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: lowercase;
  }

  .vision-eco-node-title-es::before {
    content: "·";
    margin-right: 8px;
    color: rgba(255,255,255,0.18);
  }

  .vision-eco-node-body {
    margin: 0;
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.6;
  }

  /* Connector */
  .vision-eco-connector {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 56px;
  }

  .vision-eco-connector-line {
    position: relative;
    display: block;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, rgba(196,181,253,0.06), rgba(196,181,253,0.42), rgba(196,181,253,0.06));
    overflow: hidden;
  }

  .vision-eco-connector-line::after {
    content: "";
    position: absolute;
    left: -1px;
    right: -1px;
    height: 24px;
    background: linear-gradient(180deg, transparent, rgba(196,181,253,0.95), transparent);
    box-shadow: 0 0 10px rgba(196,181,253,0.7);
    animation: visionFlow 2.2s linear infinite;
  }

  .vision-eco-connector--bi .vision-eco-connector-line::after {
    animation-duration: 1.6s;
  }

  .vision-eco-connector-label {
    position: absolute;
    left: calc(50% + 12px);
    color: var(--v-text-dim);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    padding: 4px 9px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    background: rgba(10,10,14,0.68);
    backdrop-filter: blur(8px);
  }

  @keyframes visionFlow {
    0%   { top: -24px; opacity: 0; }
    18%  { opacity: 1; }
    82%  { opacity: 1; }
    100% { top: 100%;  opacity: 0; }
  }

  /* Moat side card */
  .vision-moat-card {
    position: relative;
    overflow: hidden;
    align-self: center;
    padding: 28px 26px 32px;
    border: 1px solid rgba(196,181,253,0.32);
    border-radius: 22px;
    background:
      radial-gradient(ellipse 70% 60% at 100% 0%, rgba(132,104,235,0.32), transparent 72%),
      linear-gradient(180deg, rgba(196,181,253,0.08), rgba(132,104,235,0.04)),
      rgba(12,9,30,0.84);
    box-shadow:
      0 24px 60px rgba(91,66,195,0.34),
      0 0 38px rgba(132,104,235,0.18),
      0 0 0 1px rgba(255,255,255,0.04) inset;
  }

  .vision-moat-label {
    display: inline-block;
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .vision-moat-card h3 {
    margin: 0;
    color: #ffffff;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.12;
  }

  .vision-moat-card p {
    margin: 14px 0 0;
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.65;
  }

  .vision-moat-meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 18px;
    color: var(--v-accent);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .vision-moat-arrow {
    position: absolute;
    left: -160px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    opacity: 0.6;
  }

  /* ─── Section 3 · How ─── */

  .vision-how {
    padding: 120px 0;
    background: #050507;
  }

  .vision-how-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .vision-how-card {
    position: relative;
    overflow: hidden;
    padding: 32px 28px 36px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018)),
      rgba(10,10,14,0.7);
    box-shadow:
      0 18px 48px rgba(0,0,0,0.4),
      0 0 0 1px rgba(255,255,255,0.02) inset;
    transition: transform 200ms ease, border-color 200ms ease;
  }

  .vision-how-card::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(196,181,253,0.42), transparent);
  }

  .vision-how-card:hover {
    transform: translateY(-3px);
    border-color: rgba(196,181,253,0.2);
  }

  .vision-how-num {
    color: rgba(196,181,253,0.34);
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.85;
  }

  .vision-how-kicker {
    display: inline-block;
    margin-top: 4px;
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .vision-how-card h3 {
    margin: 12px 0 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.18;
  }

  .vision-how-card p {
    margin: 14px 0 0;
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.7;
  }

  .vision-how-card p strong {
    color: #ffffff;
    font-weight: 700;
  }

  .vision-how-bullets {
    margin: 22px 0 0;
    padding: 18px 0 0;
    list-style: none;
    border-top: 1px solid rgba(255,255,255,0.06);
    display: grid;
    gap: 9px;
  }

  .vision-how-bullets li {
    position: relative;
    padding-left: 18px;
    color: var(--v-text-muted);
    font-size: 13px;
    line-height: 1.55;
  }

  .vision-how-bullets li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--v-primary);
    box-shadow: 0 0 10px rgba(132,104,235,0.6);
  }

  /* ─── Section 4 · Moat ─── */

  .vision-moat {
    position: relative;
    overflow: hidden;
    padding: 120px 0 124px;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,104,235,0.2), transparent 72%),
      #07070b;
  }

  .vision-moat::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 132px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(196,181,253,0.86), rgba(132,104,235,0.4), transparent);
  }

  .vision-moat-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .vision-moat-pillar {
    position: relative;
    overflow: hidden;
    padding: 36px 28px 32px;
    border: 1px solid rgba(196,181,253,0.18);
    border-radius: 22px;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,104,235,0.22), transparent 72%),
      linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)),
      rgba(10,10,14,0.74);
    box-shadow:
      0 22px 54px rgba(0,0,0,0.42),
      0 0 0 1px rgba(255,255,255,0.02) inset;
  }

  .vision-moat-orb {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 999px;
    border: 1px solid rgba(196,181,253,0.36);
    background:
      radial-gradient(ellipse at center, rgba(196,181,253,0.32), rgba(132,104,235,0.06) 60%),
      rgba(12,9,30,0.6);
    color: #ffffff;
    box-shadow:
      0 0 28px rgba(132,104,235,0.34),
      0 0 0 6px rgba(196,181,253,0.06);
    animation: orbPulse 3.2s ease-in-out infinite;
  }

  .vision-moat-orb--accent {
    animation-duration: 2.4s;
  }

  .vision-moat-pillar-kicker {
    display: inline-block;
    margin: 18px 0 0;
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .vision-moat-pillar h3 {
    margin: 10px 0 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  .vision-moat-pillar p {
    margin: 14px 0 0;
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.7;
  }

  .vision-moat-quote {
    margin: 64px auto 0;
    max-width: 880px;
    text-align: center;
    color: #ffffff;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.18;
  }

  .vision-moat-quote span {
    color: var(--v-accent);
    font-size: 1.4em;
    line-height: 0;
    vertical-align: -0.18em;
    padding: 0 8px;
  }

  /* ─── Section 5 · Revenue ─── */

  .vision-revenue {
    padding: 120px 0;
    background: #050507;
  }

  .vision-revenue-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .vision-revenue-card {
    position: relative;
    overflow: hidden;
    padding: 32px 30px 30px;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018)),
      rgba(10,10,14,0.74);
    box-shadow:
      0 22px 54px rgba(0,0,0,0.42),
      0 0 0 1px rgba(255,255,255,0.02) inset;
  }

  .vision-revenue-card--featured {
    border-color: rgba(196,181,253,0.32);
    background:
      radial-gradient(ellipse 80% 60% at 100% 0%, rgba(132,104,235,0.24), transparent 70%),
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
      rgba(20,15,42,0.78);
    box-shadow:
      0 24px 58px rgba(91,66,195,0.34),
      0 0 38px rgba(132,104,235,0.16),
      0 0 0 1px rgba(196,181,253,0.12) inset;
  }

  .vision-revenue-num {
    position: absolute;
    top: 28px;
    right: 30px;
    color: rgba(196,181,253,0.22);
    font-size: 64px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 0.8;
  }

  .vision-revenue-tag {
    display: inline-flex;
    align-items: center;
    padding: 5px 11px;
    border-radius: 999px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .vision-revenue-tag--recurring {
    color: var(--v-accent);
    border: 1px solid rgba(196,181,253,0.28);
    background: rgba(132,104,235,0.12);
  }

  .vision-revenue-tag--transactional {
    color: rgba(255,255,255,0.78);
    border: 1px solid rgba(255,255,255,0.14);
    background: rgba(255,255,255,0.04);
  }

  .vision-revenue-tag--services {
    color: #ffffff;
    border: 1px solid rgba(196,181,253,0.42);
    background: linear-gradient(135deg, rgba(132,104,235,0.32), rgba(91,66,195,0.18));
  }

  .vision-revenue-card h3 {
    margin: 14px 0 0;
    color: #ffffff;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.15;
  }

  .vision-revenue-tagline {
    margin: 10px 0 0;
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.65;
  }

  .vision-revenue-price {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-top: 22px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .vision-revenue-price strong {
    color: #ffffff;
    font-size: 38px;
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 0.95;
    background: linear-gradient(135deg, #ffffff 0%, #C4B5FD 80%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .vision-revenue-price span {
    color: var(--v-text-dim);
    font-size: 13px;
  }

  .vision-revenue-note {
    margin: 18px 0 0;
    color: var(--v-text-dim);
    font-size: 13px;
    line-height: 1.6;
  }

  .vision-revenue-flywheel {
    margin-top: 36px;
    padding: 22px 28px;
    border: 1px solid rgba(196,181,253,0.18);
    border-radius: 18px;
    background:
      radial-gradient(ellipse 80% 60% at 50% 0%, rgba(132,104,235,0.16), transparent 70%),
      rgba(255,255,255,0.025);
  }

  .vision-revenue-flywheel p {
    margin: 8px 0 0;
    color: var(--v-text-muted);
    font-size: 15px;
    line-height: 1.7;
  }

  .vision-revenue-flywheel strong {
    color: #ffffff;
    font-weight: 700;
  }

  /* ─── Section 6 · Closing ─── */

  .vision-close {
    position: relative;
    overflow: hidden;
    padding: 132px 0 96px;
    background:
      radial-gradient(ellipse 56% 70% at 12% 56%, rgba(196,181,253,0.28), rgba(132,104,235,0.14) 36%, transparent 72%),
      radial-gradient(ellipse 58% 60% at 88% 18%, rgba(132,104,235,0.2), transparent 72%),
      linear-gradient(135deg, rgba(196,181,253,0.06), rgba(49,27,146,0.32) 100%),
      #070709;
  }

  .vision-close::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 156px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(240,237,255,0.94), rgba(132,104,235,0.4), transparent);
    box-shadow: 0 0 24px rgba(196,181,253,0.34);
  }

  .vision-close-inner {
    position: relative;
    text-align: center;
  }

  .vision-close-title {
    margin: 22px auto 0;
    max-width: 980px;
    color: #ffffff;
    font-size: clamp(40px, 6.6vw, 86px);
    font-weight: 800;
    letter-spacing: -0.05em;
    line-height: 1.0;
  }

  .vision-close-title span {
    background: linear-gradient(135deg, #C4B5FD 0%, #5B42C3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .vision-close-body {
    margin: 28px auto 0;
    max-width: 660px;
    color: var(--v-text-muted);
    font-size: 17px;
    line-height: 1.72;
  }

  .vision-close-body strong {
    color: #ffffff;
    font-weight: 700;
  }

  .vision-close-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin: 40px auto 0;
    padding: 14px 24px 14px 18px;
    border: 1px solid rgba(196,181,253,0.42);
    border-radius: 999px;
    background:
      linear-gradient(135deg, rgba(196,181,253,0.18), rgba(132,104,235,0.1)),
      rgba(12,9,30,0.6);
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow:
      0 16px 40px rgba(91,66,195,0.32),
      0 0 28px rgba(132,104,235,0.18);
  }

  .vision-close-cta-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 999px;
    background: linear-gradient(135deg, #C4B5FD 0%, #5B42C3 100%);
    color: #ffffff;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
  }

  .vision-close-cta-label {
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .vision-close-cta-text strong {
    font-weight: 800;
    color: #ffffff;
  }

  .vision-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    margin-top: 64px;
    color: var(--v-text-dim);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .vision-footer-divider {
    color: rgba(255,255,255,0.18);
  }

  /* ─── Responsive ─── */

  @media (max-width: 1080px) {
    .vision-eco-grid {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .vision-moat-arrow {
      display: none;
    }

    .vision-moat-card {
      max-width: 540px;
      margin: 0 auto;
    }

    .vision-how-grid,
    .vision-moat-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .vision-shell {
      width: min(100% - 24px, 1180px);
    }

    .vision-hero {
      min-height: auto;
      padding: 108px 0 64px;
    }

    .vision-video-launcher {
      top: 18px;
      width: min(100% - 24px, 520px);
    }

    .vision-video-button {
      min-height: 58px;
      padding: 9px 18px 9px 10px;
      gap: 10px;
    }

    .vision-video-button-copy {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;
      font-size: 14px;
      text-align: left;
    }

    .vision-video-button-copy strong {
      font-size: 9px;
      white-space: normal;
    }

    .vision-video-modal {
      padding: 12px;
    }

    .vision-video-panel {
      border-radius: 14px;
    }

    .vision-hero-title {
      font-size: clamp(38px, 11vw, 56px);
      line-height: 1.02;
    }

    .vision-section-title {
      font-size: clamp(30px, 9vw, 44px);
    }

    .vision-ecosystem,
    .vision-how,
    .vision-moat,
    .vision-revenue,
    .vision-close {
      padding: 80px 0;
    }

    .vision-revenue-grid {
      grid-template-columns: 1fr;
    }

    .vision-revenue-num {
      font-size: 44px;
    }

    .vision-eco-node {
      padding: 18px 18px;
    }

    .vision-eco-node-title {
      font-size: 18px;
    }

    .vision-hero-meta {
      flex-direction: column;
      align-items: flex-start;
      border-radius: 18px;
      gap: 6px;
    }

    .vision-meta-divider {
      display: none;
    }

    .vision-close-cta {
      flex-direction: column;
      gap: 8px;
      text-align: center;
      padding: 18px 22px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .vision-eco-connector-line::after,
    .vision-pill-dot,
    .vision-moat-orb {
      animation: none !important;
    }
    .vision-eco-connector-line::after {
      display: none;
    }
  }
`;
