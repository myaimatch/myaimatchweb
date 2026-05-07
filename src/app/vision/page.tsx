import type { Metadata } from "next";
import { VisionVideoButton } from "@/components/vision/VisionVideoButton";

export const metadata: Metadata = {
  title: "myAImatch · Vision",
  description: "Internal proposal — myAI Navigator ecosystem.",
  robots: { index: false, follow: false },
};

export default function VisionPage() {
  return (
    <div className="vision-root">
      <style dangerouslySetInnerHTML={{ __html: VISION_STYLES }} />

      {/* ─────── S1 · Hero ─────── */}
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
            Se convierte en tu <span>myAI Navigator</span>.
          </h1>
          <p className="vision-hero-body">
            Una membresía mensual. Un <em>agente</em> que vive en tu
            computadora, aprende tu día, y te <em>mapea</em> los tools y
            workflows exactos que deberías usar para ser{" "}
            <strong>10x más productivo</strong>.
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

      {/* ─────── S2 · Ecosystem Diagram ─────── */}
      <section className="vision-ecosystem">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">02 · El ecosistema</span>
            <h2 className="vision-section-title">
              Cómo el <span>myAI Navigator</span> conecta todo.
            </h2>
            <p className="vision-section-body">
              Un loop continuo: tu día alimenta al agente, el agente entrena tu{" "}
              <em>AI brain</em>, el brain cruza contra el catálogo vivo de tools,
              y el resultado regresa a ti como un mapa personalizado que ningún
              directorio estático puede generar.
            </p>
          </header>

          <div className="eco-outer">
            <EcoDiagram />
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
            </aside>
          </div>
        </div>
      </section>

      {/* ─────── S3 · How It Works ─────── */}
      <section className="vision-how">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">03 · Cómo funciona</span>
            <h2 className="vision-section-title">
              Así funciona. <span>Capture · Learn · Match.</span>
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
                ventanas enfocadas, transiciones, tiempo idle.{" "}
                <strong>Local-first</strong>, encriptado en tu disco. Sin
                keylogging, sin screenshots por defecto. Tú decides qué se
                sincroniza.
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
                Tu <em>AI brain</em> identifica cuándo eres más productivo, qué
                tools usas mal, en qué tarea pierdes 40 min al día.{" "}
                <strong>Mes 6 es radicalmente diferente a Día 1</strong> — la
                memoria persiste, los patrones se refinan semana a semana.
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
                Cada dos semanas hay nuevos tools en el mercado. El Navigator
                cruza <em>tu</em> contexto con lo más reciente — no lo de hace 6
                meses. Resultado:{" "}
                <strong>un mapa de tools actualizado para ti</strong> que un
                directorio estático nunca podría dar.
              </p>
              <ul className="vision-how-bullets">
                <li>Re-ranking quincenal con releases nuevos</li>
                <li>Auto-comparativa contra tools que ya usas</li>
                <li>Workflow templates listos para implementar</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ─────── S4 · Value Moat ─────── */}
      <section className="vision-moat">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">04 · Por qué tiene valor</span>
            <h2 className="vision-section-title">
              Tres ingredientes. <span>Nadie los tiene juntos todavía.</span>
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
                Nadie más tiene este input. En tiempo real, vinculado al usuario
                individual. Vendors solo ven engagement de su producto — nosotros
                vemos el día completo.
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
                actualiza más rápido que cualquier humano puede.{" "}
                <em>Eso ya lo tenemos</em> — solo falta enchufar el Navigator.
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
                vuelven irreemplazables — porque ya conocen tu historia, no solo
                tu perfil.
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

      {/* ─────── S5 · Revenue Streams ─────── */}
      <section className="vision-revenue">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">05 · Modelo de negocio</span>
            <h2 className="vision-section-title">
              Fuentes de ingresos. <span>Todos se refuerzan entre sí.</span>
            </h2>
            <p className="vision-section-body">
              La suscripción genera <em>data</em>. La data genera mejores{" "}
              <em>recomendaciones</em>. Las recomendaciones abren{" "}
              <em>affiliate clicks</em> e <em>implementaciones</em> desde
              cualquier punto del customer journey.
            </p>
          </header>

          <div className="vision-revenue-grid">
            <article className="vision-revenue-card">
              <span className="vision-revenue-num">01</span>
              <span className="vision-revenue-tag vision-revenue-tag--recurring">recurring</span>
              <h3>SaaS Individual</h3>
              <p className="vision-revenue-tagline">
                El producto core: myAI Navigator + reporte mensual. Plan premium
                con actualizaciones quincenales.
              </p>
              <div className="vision-revenue-price">
                <strong>$19</strong>
                <span>/mo · per user</span>
              </div>
              <p className="vision-revenue-note">
                El catálogo cambia cada 2 semanas — plan premium cubre esa
                cadencia para quienes necesitan estar al día más rápido.
              </p>
            </article>

            <article className="vision-revenue-card vision-revenue-card--featured">
              <span className="vision-revenue-num">02</span>
              <span className="vision-revenue-tag vision-revenue-tag--recurring">recurring</span>
              <h3>Team Plan</h3>
              <p className="vision-revenue-tagline">
                Cada miembro tiene su brain. El equipo comparte contexto: el
                Navigator genera recomendaciones a nivel org, no solo individual.
              </p>
              <div className="vision-revenue-price">
                <strong>$49</strong>
                <span>/seat · mín 5 seats</span>
              </div>
              <p className="vision-revenue-note">
                Una vez que el equipo lo usa, se vuelve infraestructura de
                productividad. El switching cost crece cada mes.
              </p>
            </article>

            <article className="vision-revenue-card">
              <span className="vision-revenue-num">03</span>
              <span className="vision-revenue-tag vision-revenue-tag--transactional">transactional</span>
              <h3>Affiliate Revenue</h3>
              <p className="vision-revenue-tagline">
                Comisión cuando el usuario contrata un tool recomendado. Entra
                desde múltiples puntos del customer journey:
              </p>
              <ul className="vision-revenue-touchpoints">
                <li>SaaS Individual — el report recomienda, el usuario compra</li>
                <li>Team Plan — mismo mecanismo, escala con el equipo</li>
                <li>Directory / SEO — alguien busca, encuentra, convierte</li>
                <li>Free Assessment — recomendamos tools directamente</li>
              </ul>
              <div className="vision-revenue-price">
                <strong>15–30%</strong>
                <span>· por conversión</span>
              </div>
            </article>

            <article className="vision-revenue-card">
              <span className="vision-revenue-num">04</span>
              <span className="vision-revenue-tag vision-revenue-tag--services">project-based</span>
              <h3>Implementation Services</h3>
              <p className="vision-revenue-tagline">
                myAImatch Company implementa los tools recomendados. El lead
                puede venir desde cualquier punto:
              </p>
              <ul className="vision-revenue-touchpoints">
                <li>Free Assessment — detectamos necesidad, ofrecemos setup</li>
                <li>Directory / SEO — alguien busca un tool, nosotros lo implementamos</li>
                <li>Monthly report — recomienda, ellos piden ayuda para ejecutar</li>
                <li>Premium plan — análisis profundo abre la conversación</li>
              </ul>
              <div className="vision-revenue-price">
                <strong>$3K–30K</strong>
                <span>· por proyecto</span>
              </div>
            </article>
          </div>

          <div className="vision-revenue-flywheel">
            <span className="vision-label">El flywheel</span>
            <p>
              <strong>Suscripción</strong> → genera data ·{" "}
              <strong>Data</strong> → mejora recomendaciones ·{" "}
              <strong>Recomendaciones</strong> → affiliate desde cualquier
              touchpoint · <strong>Affiliate</strong> → cierre con servicios.
            </p>
          </div>
        </div>
      </section>

      {/* ─────── S6 · Why Now ─────── */}
      <section className="vision-whynow">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">06 · Por qué ahora</span>
            <h2 className="vision-section-title">
              El AI fog es real. <span>Y empeora cada semana.</span>
            </h2>
          </header>

          <div className="vision-whynow-grid">
            <div className="vision-whynow-stat-box">
              <div className="vision-whynow-number">+2,000</div>
              <p className="vision-whynow-stat-label">
                AI tools lanzados en los últimos 12 meses. Sin un sistema que
                aprenda contigo, siempre estarás un paso atrás.
              </p>
            </div>

            <div className="vision-whynow-blocks">
              <div className="vision-whynow-block">
                <span className="vision-whynow-block-kicker">El problema</span>
                <p>
                  Hay tantos tools nuevos que planificar a largo plazo es
                  imposible. El AI fog — la neblina de opciones, hype y noise —
                  paraliza a equipos enteros. Cada semana, una nueva herramienta
                  que &ldquo;lo cambia todo.&rdquo;
                </p>
              </div>
              <div className="vision-whynow-block">
                <span className="vision-whynow-block-kicker">La solución</span>
                <p>
                  No necesitas un plan fijo. Necesitas{" "}
                  <strong>flexibilidad</strong>. Un sistema que se moldea
                  contigo, que se actualiza con el mercado, que te dice qué
                  cambiar antes de que quedes atrás — sin que tengas que
                  investigar cada semana.
                </p>
              </div>
              <div className="vision-whynow-block">
                <span className="vision-whynow-block-kicker">El alcance</span>
                <p>
                  Esto no es solo para CTOs. Desde un CEO hasta alguien que
                  acaba de empezar, todos necesitan actualizarse regularmente.
                  El Navigator democratiza esa ventaja — sin importar tu nivel
                  técnico.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── S7 · Implementation Plan ─────── */}
      <section className="vision-impl">
        <div className="vision-shell">
          <header className="vision-section-head">
            <span className="vision-label">07 · Plan de implementación</span>
            <h2 className="vision-section-title">
              Si esto es aceptado. <span>Tres fases para llegar a beta.</span>
            </h2>
          </header>

          <div className="vision-impl-grid">
            <article className="vision-impl-card">
              <div className="vision-impl-phase">Fase 1</div>
              <div className="vision-impl-weeks">Semanas 1–3</div>
              <h3>Scaffold del Desktop Agent</h3>
              <ul className="vision-impl-bullets">
                <li>Tauri app (Rust + webview) con OS signal capture</li>
                <li>AES-256 local encryption</li>
                <li>Basic onboarding + settings UI</li>
              </ul>
              <div className="vision-impl-deliverable">
                <span className="vision-impl-del-label">Entregable</span>
                <span>Agent corriendo en macOS, capturando señales sin keylogging</span>
              </div>
            </article>

            <article className="vision-impl-card vision-impl-card--mid">
              <div className="vision-impl-phase">Fase 2</div>
              <div className="vision-impl-weeks">Semanas 4–6</div>
              <h3>AI Brain + Memory</h3>
              <ul className="vision-impl-bullets">
                <li>Vector store local (sqlite-vec o lancedb)</li>
                <li>LLM cloud para análisis, on-device para inferencia ligera</li>
                <li>Primeras recomendaciones desde contexto real</li>
              </ul>
              <div className="vision-impl-deliverable">
                <span className="vision-impl-del-label">Entregable</span>
                <span>Brain con memory persistente, 1er reporte generado</span>
              </div>
            </article>

            <article className="vision-impl-card">
              <div className="vision-impl-phase">Fase 3</div>
              <div className="vision-impl-weeks">Semanas 7–10</div>
              <h3>Catalog Integration + Beta</h3>
              <ul className="vision-impl-bullets">
                <li>API hook al catálogo vivo de myAImatch</li>
                <li>Re-ranking quincenal con releases recientes</li>
                <li>Onboarding 10–20 beta users (individual y team)</li>
              </ul>
              <div className="vision-impl-deliverable">
                <span className="vision-impl-del-label">Entregable</span>
                <span>Producto en manos de usuarios reales, feedback loop activo</span>
              </div>
            </article>
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

/* ─────────── Ecosystem Diagram ─────────── */

function EcoDiagram() {
  return (
    <div className="eco-diagram-wrap">
      {/* SVG layer — lines and animated dots */}
      <svg
        className="eco-diagram-svg"
        viewBox="0 0 680 480"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Static visible lines */}
        <path
          d="M 198 97 C 248 150, 302 185, 316 200"
          stroke="rgba(196,181,253,0.2)"
          strokeWidth="1.4"
          strokeDasharray="4 7"
        />
        <path
          d="M 482 97 C 432 150, 378 185, 364 200"
          stroke="rgba(196,181,253,0.2)"
          strokeWidth="1.4"
          strokeDasharray="4 7"
        />
        <path
          d="M 170 362 C 210 322, 268 274, 308 244"
          stroke="rgba(196,181,253,0.2)"
          strokeWidth="1.4"
          strokeDasharray="4 7"
        />
        <path
          d="M 316 248 C 272 284, 208 328, 166 364"
          stroke="rgba(196,181,253,0.12)"
          strokeWidth="1.2"
          strokeDasharray="3 9"
        />
        <path
          d="M 340 256 L 340 412"
          stroke="rgba(196,181,253,0.2)"
          strokeWidth="1.4"
          strokeDasharray="4 7"
        />

        {/* Hidden paths for animateMotion */}
        <path id="ecp-wf"  d="M 198 97 C 248 150, 302 185, 316 200" />
        <path id="ecp-ag"  d="M 482 97 C 432 150, 378 185, 364 200" />
        <path id="ecp-ci"  d="M 170 362 C 210 322, 268 274, 308 244" />
        <path id="ecp-co"  d="M 316 248 C 272 284, 208 328, 166 364" />
        <path id="ecp-rep" d="M 340 256 L 340 412" />

        {/* Animated dots */}
        <circle r="2.6" fill="rgba(196,181,253,0.92)">
          <animateMotion dur="2.4s" repeatCount="indefinite">
            <mpath href="#ecp-wf" />
          </animateMotion>
        </circle>
        <circle r="2.6" fill="rgba(196,181,253,0.92)">
          <animateMotion dur="2.8s" repeatCount="indefinite" begin="0.7s">
            <mpath href="#ecp-ag" />
          </animateMotion>
        </circle>
        <circle r="2.4" fill="rgba(196,181,253,0.72)">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="1.1s">
            <mpath href="#ecp-ci" />
          </animateMotion>
        </circle>
        <circle r="2.4" fill="rgba(196,181,253,0.72)">
          <animateMotion dur="3.2s" repeatCount="indefinite" begin="2.7s">
            <mpath href="#ecp-co" />
          </animateMotion>
        </circle>
        <circle r="2.6" fill="rgba(196,181,253,0.92)">
          <animateMotion dur="2.0s" repeatCount="indefinite" begin="0.3s">
            <mpath href="#ecp-rep" />
          </animateMotion>
        </circle>
      </svg>

      {/* Brain — center hub */}
      <div className="eco-brain">
        <div className="eco-brain-glow" aria-hidden="true" />
        <div className="eco-brain-ring" aria-hidden="true" />
        <div className="eco-brain-icon" aria-hidden="true">
          <IconBrain />
        </div>
        <span className="eco-brain-label">Your myAI Brain</span>
        <span className="eco-brain-sub">memory · patterns · context</span>
      </div>

      {/* Daily Workflow — top left */}
      <div className="eco-node eco-node-wf">
        <span className="eco-node-icon"><IconActivity /></span>
        <div className="eco-node-copy">
          <span className="eco-node-kicker">INPUT</span>
          <strong className="eco-node-name">Daily Workflow</strong>
          <span className="eco-node-desc">apps · clicks · tareas</span>
        </div>
      </div>

      {/* Desktop Agent — top right */}
      <div className="eco-node eco-node-ag">
        <span className="eco-node-icon"><IconChip /></span>
        <div className="eco-node-copy">
          <span className="eco-node-kicker">LOCAL</span>
          <strong className="eco-node-name">Desktop Agent</strong>
          <span className="eco-node-desc">encrypted · on-device</span>
        </div>
      </div>

      {/* Live Catalog — bottom left */}
      <div className="eco-node eco-node-cat">
        <span className="eco-node-icon"><IconCatalog /></span>
        <div className="eco-node-copy">
          <span className="eco-node-kicker">LIVE</span>
          <strong className="eco-node-name">Tool Catalog</strong>
          <span className="eco-node-desc">fuente más fresca</span>
        </div>
      </div>

      {/* Monthly Report — bottom center */}
      <div className="eco-node eco-node-rep">
        <span className="eco-node-icon"><IconReport /></span>
        <div className="eco-node-copy">
          <span className="eco-node-kicker">OUTPUT</span>
          <strong className="eco-node-name">Your Report</strong>
          <span className="eco-node-desc">mensual · quincenal</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Icons ─────────── */

function IconActivity() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h3l3-8 4 16 3-8h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h7M9 16h6M9 10h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* ─────────── Page styles ─────────── */

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

  @keyframes orbPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.72; transform: scale(1.08); }
  }

  @keyframes heroFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ─── S1 · Hero ─── */

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

  /* Video button styles */
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

  .vision-video-button:active { transform: translateY(0) scale(0.985); }

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

  .vision-hero-body strong { color: #ffffff; font-weight: 700; }

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

  .vision-hero-meta strong { color: #ffffff; font-weight: 700; margin-right: 4px; }
  .vision-meta-divider { color: rgba(255,255,255,0.22); }

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

  /* ─── S2 · Ecosystem ─── */

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

  .eco-outer {
    display: grid;
    grid-template-columns: 1fr minmax(260px, 300px);
    gap: 56px;
    align-items: center;
  }

  /* Diagram wrap */
  .eco-diagram-wrap {
    position: relative;
    width: 100%;
    max-width: 660px;
    aspect-ratio: 680 / 480;
  }

  .eco-diagram-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  /* Brain node */
  .eco-brain {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    z-index: 2;
  }

  .eco-brain-glow {
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 999px;
    background: radial-gradient(ellipse, rgba(132,104,235,0.46), rgba(91,66,195,0.18) 56%, transparent 80%);
    filter: blur(20px);
    animation: orbPulse 3s ease-in-out infinite;
    pointer-events: none;
  }

  .eco-brain-ring {
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 999px;
    border: 1px solid rgba(196,181,253,0.3);
    animation: orbPulse 3s ease-in-out infinite reverse;
    pointer-events: none;
  }

  .eco-brain-icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76px;
    height: 76px;
    border-radius: 999px;
    border: 1px solid rgba(196,181,253,0.44);
    background:
      radial-gradient(ellipse at center, rgba(196,181,253,0.3), rgba(132,104,235,0.12) 64%),
      rgba(20,16,42,0.9);
    box-shadow:
      0 0 36px rgba(132,104,235,0.52),
      0 0 0 7px rgba(196,181,253,0.07);
    color: #ffffff;
  }

  .eco-brain-label {
    position: relative;
    z-index: 1;
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.01em;
    text-align: center;
    white-space: nowrap;
    margin-top: 8px;
  }

  .eco-brain-sub {
    color: var(--v-text-dim);
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* Surrounding nodes */
  .eco-node {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02)),
      rgba(12,12,14,0.78);
    box-shadow: 0 12px 36px rgba(0,0,0,0.4);
    transform: translate(-50%, -50%);
    z-index: 2;
    min-width: 164px;
    transition: border-color 220ms ease, transform 220ms cubic-bezier(0.22,1,0.36,1);
  }

  .eco-node:hover {
    border-color: rgba(196,181,253,0.26);
    transform: translate(-50%, -50%) translateY(-2px);
  }

  .eco-node-wf  { left: 29%; top: 16%; }
  .eco-node-ag  { left: 71%; top: 16%; }
  .eco-node-cat { left: 20%; top: 78%; }
  .eco-node-rep { left: 50%; top: 90%; }

  .eco-node-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    border-radius: 10px;
    border: 1px solid rgba(196,181,253,0.2);
    background: rgba(132,104,235,0.12);
    color: var(--v-accent);
  }

  .eco-node-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .eco-node-kicker {
    color: var(--v-accent);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }

  .eco-node-name {
    color: #ffffff;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }

  .eco-node-desc {
    color: var(--v-text-dim);
    font-size: 11px;
    white-space: nowrap;
  }

  /* Moat side card */
  .vision-moat-card {
    position: relative;
    overflow: hidden;
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

  /* ─── S3 · How ─── */

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

  .vision-how-card p strong { color: #ffffff; font-weight: 700; }

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

  /* ─── S4 · Moat ─── */

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

  .vision-moat-orb--accent { animation-duration: 2.4s; }

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

  /* ─── S5 · Revenue ─── */

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

  .vision-revenue-touchpoints {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 6px;
  }

  .vision-revenue-touchpoints li {
    position: relative;
    padding-left: 18px;
    color: var(--v-text-dim);
    font-size: 12.5px;
    line-height: 1.55;
  }

  .vision-revenue-touchpoints li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--v-accent);
    font-size: 10px;
    line-height: 1.7;
  }

  .vision-revenue-price {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-top: 20px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .vision-revenue-price strong {
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
    margin: 16px 0 0;
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

  .vision-revenue-flywheel strong { color: #ffffff; font-weight: 700; }

  /* ─── S6 · Why Now ─── */

  .vision-whynow {
    position: relative;
    padding: 120px 0;
    background:
      radial-gradient(ellipse 70% 40% at 50% 0%, rgba(132,104,235,0.18), transparent 70%),
      #07070b;
  }

  .vision-whynow::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 2px;
    height: 132px;
    transform: translateX(-50%);
    background: linear-gradient(180deg, rgba(196,181,253,0.86), rgba(132,104,235,0.4), transparent);
  }

  .vision-whynow-grid {
    display: grid;
    grid-template-columns: minmax(220px, 280px) 1fr;
    gap: 56px;
    align-items: start;
  }

  .vision-whynow-stat-box {
    position: sticky;
    top: 40px;
    padding: 36px 28px 32px;
    border: 1px solid rgba(196,181,253,0.28);
    border-radius: 22px;
    background:
      radial-gradient(ellipse 70% 50% at 50% 0%, rgba(132,104,235,0.3), transparent 70%),
      rgba(20,15,42,0.78);
    box-shadow:
      0 24px 56px rgba(91,66,195,0.3),
      0 0 0 1px rgba(196,181,253,0.1) inset;
  }

  .vision-whynow-number {
    font-size: clamp(46px, 5.5vw, 66px);
    font-weight: 800;
    letter-spacing: -0.06em;
    line-height: 0.9;
    background: linear-gradient(135deg, #ffffff 0%, #C4B5FD 60%, #5B42C3 100%);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    margin-bottom: 16px;
  }

  .vision-whynow-stat-label {
    color: var(--v-text-muted);
    font-size: 14px;
    line-height: 1.65;
    margin: 0;
  }

  .vision-whynow-blocks {
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding-top: 8px;
  }

  .vision-whynow-block {
    padding-left: 24px;
    border-left: 2px solid rgba(196,181,253,0.24);
  }

  .vision-whynow-block-kicker {
    display: block;
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .vision-whynow-block p {
    color: var(--v-text-muted);
    font-size: 15px;
    line-height: 1.72;
    margin: 0;
  }

  .vision-whynow-block p strong { color: #ffffff; font-weight: 700; }

  /* ─── S7 · Implementation Plan ─── */

  .vision-impl {
    position: relative;
    overflow: hidden;
    padding: 120px 0 96px;
    background:
      radial-gradient(ellipse 56% 70% at 12% 56%, rgba(196,181,253,0.22), rgba(132,104,235,0.1) 36%, transparent 72%),
      radial-gradient(ellipse 58% 60% at 88% 18%, rgba(132,104,235,0.16), transparent 72%),
      linear-gradient(135deg, rgba(196,181,253,0.04), rgba(49,27,146,0.24) 100%),
      #070709;
  }

  .vision-impl::before {
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

  .vision-impl-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .vision-impl-card {
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
  }

  .vision-impl-card::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(196,181,253,0.36), transparent);
  }

  .vision-impl-card--mid {
    border-color: rgba(196,181,253,0.28);
    background:
      radial-gradient(ellipse 80% 60% at 100% 0%, rgba(132,104,235,0.2), transparent 70%),
      linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)),
      rgba(20,15,42,0.76);
    box-shadow:
      0 24px 56px rgba(91,66,195,0.28),
      0 0 32px rgba(132,104,235,0.14),
      0 0 0 1px rgba(196,181,253,0.1) inset;
  }

  .vision-impl-phase {
    display: inline-flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(132,104,235,0.16);
    border: 1px solid rgba(196,181,253,0.28);
    color: var(--v-accent);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .vision-impl-weeks {
    display: block;
    margin: 10px 0 0;
    color: var(--v-text-dim);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .vision-impl-card h3 {
    margin: 14px 0 0;
    color: #ffffff;
    font-size: 22px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.2;
  }

  .vision-impl-bullets {
    margin: 18px 0 0;
    padding: 16px 0 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    list-style: none;
    display: grid;
    gap: 8px;
  }

  .vision-impl-bullets li {
    position: relative;
    padding-left: 18px;
    color: var(--v-text-muted);
    font-size: 13px;
    line-height: 1.55;
  }

  .vision-impl-bullets li::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--v-primary);
    box-shadow: 0 0 8px rgba(132,104,235,0.5);
  }

  .vision-impl-deliverable {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 22px 0 0;
    padding: 14px 16px;
    border-radius: 12px;
    background: rgba(132,104,235,0.1);
    border: 1px solid rgba(196,181,253,0.16);
  }

  .vision-impl-del-label {
    display: block;
    color: var(--v-accent);
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .vision-impl-deliverable span:last-child {
    color: var(--v-text-muted);
    font-size: 13px;
    line-height: 1.55;
  }

  /* Footer */
  .vision-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
    margin-top: 72px;
    color: var(--v-text-dim);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .vision-footer-divider { color: rgba(255,255,255,0.18); }

  /* ─── Responsive ─── */

  @media (max-width: 1080px) {
    .eco-outer {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .vision-moat-card {
      max-width: 540px;
      margin: 0 auto;
    }

    .vision-how-grid,
    .vision-moat-grid {
      grid-template-columns: 1fr;
    }

    .vision-whynow-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }

    .vision-whynow-stat-box {
      position: static;
      max-width: 380px;
    }

    .vision-impl-grid {
      grid-template-columns: 1fr;
      max-width: 540px;
      margin: 0 auto;
    }
  }

  @media (max-width: 720px) {
    .vision-shell { width: min(100% - 24px, 1180px); }

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

    .vision-video-modal { padding: 12px; }
    .vision-video-panel { border-radius: 14px; }

    .vision-hero-title {
      font-size: clamp(38px, 11vw, 56px);
      line-height: 1.02;
    }

    .vision-section-title { font-size: clamp(30px, 9vw, 44px); }

    .vision-ecosystem,
    .vision-how,
    .vision-moat,
    .vision-revenue,
    .vision-whynow,
    .vision-impl {
      padding: 80px 0;
    }

    .vision-revenue-grid { grid-template-columns: 1fr; }
    .vision-revenue-num { font-size: 44px; }

    .eco-diagram-wrap {
      aspect-ratio: auto;
      min-height: 380px;
    }

    .eco-node {
      min-width: 130px;
      padding: 9px 12px;
    }

    .eco-node-name { font-size: 12px; }
    .eco-node-desc { display: none; }

    .vision-hero-meta {
      flex-direction: column;
      align-items: flex-start;
      border-radius: 18px;
      gap: 6px;
    }

    .vision-meta-divider { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .vision-pill-dot,
    .vision-moat-orb,
    .eco-brain-glow,
    .eco-brain-ring {
      animation: none !important;
    }
  }
`;
