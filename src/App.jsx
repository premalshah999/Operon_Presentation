import React from 'react';
import './index.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ─── Hooks ──────────────────────────────────────────────────────── */
const useInView = (ref, threshold = 0.12) => {
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return v;
};

const useScroll = () => {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const fn = () => { const h = document.documentElement.scrollHeight - window.innerHeight; setP(h > 0 ? (window.scrollY / h) * 100 : 0); };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
};

const useCountUp = (target, duration = 1400, active = false) => {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    let s = null, raf;
    const step = ts => { if (!s) s = ts; const p = Math.min((ts - s) / duration, 1); setVal(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
};

/* ─── Scroll Progress Bar ────────────────────────────────────────── */
const ScrollProgress = () => {
  const p = useScroll();
  return <div className="progress-bar"><div className="progress-fill" style={{ width:`${p}%` }} /></div>;
};

/* ─── Reveal on Scroll ───────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, direction = 'up', style = {}, className = '' }) => {
  const ref = React.useRef(null);
  const v = useInView(ref);
  return (
    <div ref={ref} className={`reveal ${direction} ${v ? 'visible' : ''} ${className}`} style={{ ...style, transitionDelay:`${delay}s` }}>
      {children}
    </div>
  );
};

/* ─── Nav ────────────────────────────────────────────────────────── */
const Nav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <nav className={scrolled ? 'nav-scrolled' : ''} style={{ position:'fixed', top:0, left:0, right:0, zIndex:500, borderBottom:'1px solid transparent', transition:'all 0.35s' }}>
      <div style={{ maxWidth:'var(--max)', margin:'0 auto', padding:'0 var(--pad)', display:'flex', alignItems:'center', justifyContent:'space-between', height:68 }}>
        <a href="#top" style={{ textDecoration:'none', display:'flex', alignItems:'baseline', gap:8 }}>
          <span style={{ fontFamily:'var(--display)', fontSize:18, fontWeight:600, color: scrolled ? 'var(--ink)' : '#fff' }}>OPERON</span>
          <span className="label-accent" style={{ fontSize:8, color: scrolled ? '' : '#FCA5A5' }}>INTELLIGENCE</span>
        </a>
        <div style={{ display:'flex', gap:36 }}>
          {[['Problem','#problem'],['Solution','#solution'],['Architecture','#architecture'],['Impact','#impact'],['Demo','https://operon.website'],['Scale','#scalability']].map(([l,h]) => (
            <a key={l} href={h} className="t label" style={{ textDecoration:'none', fontSize:10, color: scrolled ? 'var(--ink-2)' : 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e=>e.target.style.color='var(--accent)'}
              onMouseLeave={e=>e.target.style.color=''}
            >{l}</a>
          ))}
        </div>
      </div>
    </nav>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */
const Hero = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref);
  const n1 = useCountUp(847, 1800, inView);
  const n2 = useCountUp(92, 1600, inView);
  const n3 = useCountUp(5, 1200, inView);

  return (
    <section id="top" ref={ref} className="slide" style={{ background:'var(--ink)', overflow:'hidden', minHeight:'100vh' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
      <div style={{ position:'absolute', top:'-20%', right:'-10%', width:'60%', height:'80%', background:'radial-gradient(ellipse, rgba(220,38,38,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="container" style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:64, alignItems:'center', minHeight:'80vh' }}>
          <div>
            <Reveal direction="down" delay={0.1}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:12, background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.3)', padding:'8px 16px', marginBottom:48 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)' }} />
                <span style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', color:'#FCA5A5' }}>Agentic Complaint Intelligence</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <h1 className="display" style={{ color:'#FFFFFF', marginBottom:32 }}>
                Operon<br />
                <span style={{ color:'var(--accent)' }}>Intelligence</span>
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.35}>
              <p style={{ fontFamily:'var(--sans)', fontSize:21, color:'rgba(255,255,255,0.55)', lineHeight:1.7, maxWidth:540, fontWeight:400, marginBottom:40 }}>
                A multi-agent AI pipeline that classifies, risk-scores, routes, and resolves
                CFPB complaints in seconds — with full explainability and zero manual friction.
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.45}>
              <div style={{ display:'flex', alignItems:'center', gap:24, marginBottom:56 }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase' }}>Team</span>
                <div style={{ width:1, height:20, background:'rgba(255,255,255,0.15)' }} />
                {['Tauksik', 'Priyam', 'Premal', 'Manan'].map(name => (
                  <span key={name} style={{ fontFamily:'var(--sans)', fontSize:15, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{name}</span>
                ))}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.55}>
              <div style={{ display:'flex', gap:12 }}>
                <a href="#problem" className="btn btn-fill">Explore the Deck →</a>
                <a href="https://operon.website" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ color:'rgba(255,255,255,0.7)', borderColor:'rgba(255,255,255,0.2)' }}
                  onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='var(--accent)'}}
                  onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.7)';e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}}
                >Live Demo ↗</a>
              </div>
            </Reveal>
          </div>

          {/* Right: animated KPI panel */}
          <Reveal direction="left" delay={0.4}>
            <div style={{ display:'flex', flexDirection:'column', gap:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
              {[
                { n:`${n1}K+`, l:'CFPB complaints analyzed' },
                { n:`≥${n2}%`, l:'Classification accuracy' },
                { n:`< ${n3}s`, l:'End-to-end pipeline time' },
                { n:'100%',    l:'Audit trail coverage' },
                { n:'5',       l:'Specialized AI agents' },
              ].map(({ n, l }) => (
                <div key={l} style={{ padding:'22px 28px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily:'var(--display)', fontSize:30, fontWeight:600, color:'#FFFFFF', letterSpacing:'-0.02em', marginBottom:6 }}>{n}</div>
                  <div className="label" style={{ color:'rgba(255,255,255,0.35)' }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div style={{ position:'absolute', bottom:40, left:'var(--pad)', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:28, height:1, background:'rgba(255,255,255,0.3)' }} />
          <span className="label" style={{ fontSize:9, color:'rgba(255,255,255,0.3)' }}>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 1 — PROBLEM STATEMENT
   ═══════════════════════════════════════════════════════════════════ */
const PROBLEMS = [
  { parts:[ {t:'Complaint volume'}, {t:' is rising across cards, loans, and digital banking.'} ] },
  { parts:[ {t:'Complaints come in as '}, {t:'unstructured',b:true}, {t:' narratives and are '}, {t:'categorized',b:true}, {t:' inconsistently.'} ] },
  { parts:[ {t:'Manual triage',b:true}, {t:' and routing slow response times and cause '}, {t:'misrouting',b:true}, {t:'.'} ] },
  { parts:[ {t:'CFPB-related complaints require fast, accurate '}, {t:'handling',b:true}, {t:'.'} ] },
  { parts:[ {t:'Delays',b:true}, {t:' increase compliance risk, operating cost, and customer dissatisfaction.'} ] },
  { parts:[ {t:'Firms need a scalable, '}, {t:'explainable system',b:true}, {t:' for risk assessment, routing, and resolution planning.'} ] },
];

const ProblemStatement = () => (
  <section id="problem" className="slide" style={{ background:'var(--bg)' }}>
    <div className="slide-deco" style={{ opacity:0.5 }}>01</div>
    <div className="container">
      <Reveal direction="down">
        <div style={{ marginBottom:56 }}>
          <span className="label-accent">Slide 01 — Problem Statement</span>
          <h2 className="display-sm" style={{ marginTop:16 }}>
            Our Problem<br /><span style={{ color:'var(--accent)', fontStyle:'italic' }}>Statement</span>
          </h2>
        </div>
      </Reveal>

      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {PROBLEMS.map((p, i) => (
          <Reveal key={i} direction="up" delay={0.06 * i}>
            <div style={{
              display:'grid', gridTemplateColumns:'56px 1fr', gap:24, alignItems:'center',
              padding:'28px 0', borderBottom:'1px solid var(--border)',
            }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:13, color:'var(--accent)', fontWeight:500 }}>{String(i+1).padStart(2,'0')}</span>
              <p style={{ fontFamily:'var(--sans)', fontSize:19, color:'var(--ink)', lineHeight:1.65, margin:0, fontWeight:400 }}>
                {p.parts.map((seg, j) => seg.b ? <strong key={j}>{seg.t}</strong> : <span key={j}>{seg.t}</span>)}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 2 — PROBLEMS WITH THE CURRENT SYSTEM
   ═══════════════════════════════════════════════════════════════════ */
const CURRENT_ISSUES = [
  { text:'Manual tagging takes ', hl:'15–25 minutes per complaint', suffix:'.' },
  { text:'Misrouting adds ', hl:'3–7 days', suffix:' to resolution time.' },
  { text:'Repetitive work increases ', hl:'agent burnout and turnover', suffix:'.' },
  { text:'No risk triage leaves ', hl:'high-risk cases unmanaged', suffix:'.' },
];

const CurrentSystem = () => (
  <section id="current-system" className="slide" style={{ background:'var(--surface)' }}>
    <div className="slide-deco" style={{ opacity:0.4 }}>02</div>
    <div className="container">
      <Reveal direction="down">
        <div style={{ marginBottom:56 }}>
          <span className="label-accent">Slide 02 — Current State</span>
          <h2 className="display-sm" style={{ marginTop:16 }}>
            Problems with the<br /><span style={{ color:'var(--accent)', fontStyle:'italic' }}>Current System</span>
          </h2>
        </div>
      </Reveal>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:56 }}>
        {CURRENT_ISSUES.map((item, i) => (
          <Reveal key={i} direction="up" delay={0.08 * i}>
            <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderTop:'3px solid var(--accent)', padding:'36px 32px', minHeight:140, display:'flex', alignItems:'center' }}>
              <p style={{ fontFamily:'var(--sans)', fontSize:19, color:'var(--ink)', lineHeight:1.6, margin:0, fontWeight:400 }}>
                {item.text}<strong style={{ color:'var(--accent)' }}>{item.hl}</strong>{item.suffix}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal direction="up" delay={0.4}>
        <div style={{ background:'var(--accent-bg)', border:'2px solid var(--accent)', padding:'40px 48px', textAlign:'center' }}>
          <p style={{ fontFamily:'var(--display)', fontSize:'clamp(22px, 3vw, 32px)', fontWeight:600, color:'var(--ink)', lineHeight:1.4, margin:0 }}>
            Root causes stay hidden, increasing{' '}
            <span style={{ color:'var(--accent)' }}>cost, delay,</span> and{' '}
            <span style={{ color:'var(--accent)' }}>compliance exposure.</span>
          </p>
        </div>
      </Reveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 3 — OUR SOLUTION
   ═══════════════════════════════════════════════════════════════════ */
const SOLUTION_POINTS = [
  { bold:'Five-agent pipeline', rest:' turns unstructured complaints into regulator-ready decisions in seconds.' },
  { bold:'Consistent classification', rest:' tags product, issue, severity, sentiment, and urgency using an auditable rubric.' },
  { bold:'Compliance risk scoring', rest:' flags key regulatory issues with direct evidence from the complaint text.' },
  { bold:'Intelligent routing + escalation', rest:' sends each case to the right team, priority, and SLA, with high-risk cases auto-escalated.' },
  { bold:'Resolution + QA + audit trail', rest:' generate action plans and responses, validate outputs, and log every decision for review.' },
];

const OurSolution = () => (
  <section id="solution" className="slide" style={{ background:'var(--bg)' }}>
    <div className="slide-deco" style={{ opacity:0.5 }}>03</div>
    <div className="container">
      <Reveal direction="down">
        <div style={{ marginBottom:56 }}>
          <span className="label-accent">Slide 03 — Our Solution</span>
          <h2 className="display-sm" style={{ marginTop:16 }}>
            Our <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Solution</span>
          </h2>
        </div>
      </Reveal>

      <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
        {SOLUTION_POINTS.map((p, i) => (
          <Reveal key={i} direction="left" delay={0.08 * i}>
            <div style={{
              display:'grid', gridTemplateColumns:'56px 1fr', gap:24, alignItems:'start',
              padding:'28px 0', borderBottom:'1px solid var(--border)',
            }}>
              <div style={{ width:40, height:40, background:'var(--accent-bg)', border:'1px solid var(--accent-mid)', display:'flex', alignItems:'center', justifyContent:'center', marginTop:4 }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:13, color:'var(--accent)', fontWeight:500 }}>{String(i+1).padStart(2,'0')}</span>
              </div>
              <p style={{ fontFamily:'var(--sans)', fontSize:19, color:'var(--ink)', lineHeight:1.65, margin:0, fontWeight:400 }}>
                <strong>{p.bold}</strong>{p.rest}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 4 — ARCHITECTURE
   ═══════════════════════════════════════════════════════════════════ */
const LAYERS = [
  { id:'intake',        label:'Intake Layer',                   sub:'Web  ·  Email  ·  Phone  ·  CFPB  ·  Batch',                              color:'var(--accent)', detail:'Multi-channel ingestion normalizes raw complaints from every source into a unified analysis schema before any AI processing begins.' },
  { id:'orchestration', label:'Agentic Orchestration Layer',    sub:'Classification → Compliance → Routing → Resolution → QA',                 color:'#B91C1C',       detail:'Five specialized agents execute sequentially via LangGraph with structured handoffs and live progress streaming.' },
  { id:'governance',    label:'Governance Layer',               sub:'Review Gate  ·  Supervisor Queue  ·  Audit Log',                           color:'var(--green)',  detail:'Enforced review gate auto-routes high-risk, low-confidence, and QA-failed cases to supervisor queues with machine-readable reason codes.' },
  { id:'delivery',      label:'Delivery Layer',                 sub:'FastAPI  ·  React Dashboard  ·  Ticketing',                                color:'#7C3AED',       detail:'Results surface through REST APIs, a real-time monitoring dashboard, and direct integration with existing case management and ticketing systems.' },
];

const ARCH_BULLETS = [
  { bold:'Multi-channel intake + normalization:', rest:' Ingests complaints from web/email/phone/CFPB/batch sources and converts unstructured narratives into a unified analysis schema.' },
  { bold:'Five-agent orchestration pipeline:', rest:' Sequential specialized agents (Classification → Compliance → Routing → Resolution → QA) with structured handoffs and live progress streaming.' },
  { bold:'Policy-aware governance layer:', rest:' Enforced review gate auto-routes high-risk/low-confidence/QA-failed cases to supervisor queues with machine-readable reason codes.' },
  { bold:'Explainability + audit backbone:', rest:' Every agent logs decision, confidence, reasoning, evidence quotes, and processing duration for regulator-defensible traceability.' },
  { bold:'Resilient execution model:', rest:' Runs on gpt-4.1-mini with deterministic fallback pipeline using the same output contract to ensure continuity under outages.' },
];

const Architecture = () => {
  const [activeLayer, setActiveLayer] = React.useState(null);

  return (
    <section id="architecture" className="slide" style={{ background:'var(--surface)', minHeight:'100vh' }}>
      <div className="slide-deco" style={{ opacity:0.4 }}>04</div>
      <div className="container">
        <Reveal direction="down">
          <div style={{ marginBottom:48 }}>
            <span className="label-accent">Slide 04 — Architecture</span>
            <h2 className="display-sm" style={{ marginTop:16 }}>
              Architecture of the <span style={{ color:'var(--accent)', fontStyle:'italic' }}>System</span>
            </h2>
          </div>
        </Reveal>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:64, alignItems:'start' }}>
          {/* LEFT: Explanation bullets */}
          <div>
            <Reveal direction="right" delay={0.1}>
              <p style={{ fontFamily:'var(--sans)', fontSize:18, color:'var(--ink-2)', lineHeight:1.7, marginBottom:40, fontWeight:400 }}>
                How a complaint is processed — from raw intake to audit-ready case file.
              </p>
            </Reveal>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {ARCH_BULLETS.map((b, i) => (
                <Reveal key={i} direction="right" delay={0.12 + i * 0.06}>
                  <div style={{ display:'grid', gridTemplateColumns:'40px 1fr', gap:16, padding:'20px 0', borderBottom:'1px solid var(--border)', alignItems:'start' }}>
                    <div style={{ width:28, height:28, background:'var(--accent-bg)', border:'1px solid var(--accent-mid)', display:'flex', alignItems:'center', justifyContent:'center', marginTop:2 }}>
                      <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--accent)' }}>{String(i+1).padStart(2,'0')}</span>
                    </div>
                    <p style={{ fontFamily:'var(--sans)', fontSize:16, color:'var(--ink)', lineHeight:1.65, margin:0 }}>
                      <strong>{b.bold}</strong>{b.rest}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* RIGHT: Vertical interactive flowchart */}
          <div>
            <Reveal direction="left" delay={0.2}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0, position:'relative' }}>
                {LAYERS.map((layer, i) => (
                  <React.Fragment key={layer.id}>
                    <div
                      className="t"
                      onClick={() => setActiveLayer(activeLayer === i ? null : i)}
                      onMouseEnter={() => setActiveLayer(i)}
                      onMouseLeave={() => setActiveLayer(null)}
                      style={{
                        width:'100%', cursor:'pointer', position:'relative', zIndex:2,
                        background:'var(--bg)',
                        border: `1.5px solid ${activeLayer === i ? layer.color : 'var(--border)'}`,
                        borderLeft: `4px solid ${layer.color}`,
                        padding:'28px 32px',
                        boxShadow: activeLayer === i ? '0 8px 32px rgba(0,0,0,0.08)' : 'none',
                        transform: activeLayer === i ? 'scale(1.02)' : 'none',
                      }}
                    >
                      <div style={{ fontFamily:'var(--display)', fontSize:18, fontWeight:600, color:'var(--ink)', marginBottom:8 }}>{layer.label}</div>
                      <div style={{ fontFamily:'var(--mono)', fontSize:13, color:'var(--ink-2)', lineHeight:1.6 }}>{layer.sub}</div>
                      <div className="t" style={{
                        maxHeight: activeLayer === i ? 100 : 0, overflow:'hidden', opacity: activeLayer === i ? 1 : 0,
                        marginTop: activeLayer === i ? 16 : 0,
                      }}>
                        <p style={{ fontFamily:'var(--sans)', fontSize:15, color:'var(--ink-2)', lineHeight:1.65, margin:0, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                          {layer.detail}
                        </p>
                      </div>
                    </div>
                    {i < LAYERS.length - 1 && (
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', height:36, justifyContent:'center' }}>
                        <div style={{ width:2, height:18, background:'var(--accent-mid)' }} />
                        <div style={{ width:0, height:0, borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderTop:'9px solid var(--accent-mid)' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </Reveal>
            <Reveal direction="up" delay={0.4}>
              <div style={{ textAlign:'center', marginTop:36, padding:'18px', background:'var(--accent-bg)', border:'1px solid var(--accent-mid)' }}>
                <p style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'var(--accent)', fontStyle:'italic', margin:0 }}>
                  Every step is logged for auditability and escalation
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 5 — BUSINESS IMPACT
   ═══════════════════════════════════════════════════════════════════ */
const IMPACT_ROWS = [
  { before:'20-person team manually reads 200 complaints/day', bHL:'20-person team', after:'200 complaints/day → 170 auto-classified in seconds', aHL:'170 auto-classified in seconds' },
  { before:'Each agent handles 8–12 cases/shift at 15–25 min each', bHL:'8–12 cases/shift', after:'Agents handle only 30 complex cases requiring human judgment', aHL:'30 complex cases' },
  { before:'1 in 5 complaints misrouted → agent rework + delays', bHL:'1 in 5 complaints misrouted', after:'Misrouting drops from 20% to <10% → fewer escalations', aHL:'20% to <10%' },
  { before:'Compliance reports compiled manually → 500+ analyst hrs/year', bHL:'500+ analyst hrs/year', after:'Audit trails auto-generated → compliance reports in minutes', aHL:'compliance reports in minutes' },
  { before:'Agent burnout → 30–45% annual turnover → constant rehiring', bHL:'30–45% annual turnover', after:'Role shifts to exception handler → higher-value work, lower burnout', aHL:'higher-value work, lower burnout' },
];

const HighlightText = ({ text, hl, color }) => {
  const idx = text.indexOf(hl);
  if (idx === -1) return text;
  return <>{text.slice(0, idx)}<strong style={{ color }}>{hl}</strong>{text.slice(idx + hl.length)}</>;
};

const BusinessImpact = () => (
  <section id="impact" className="slide" style={{ background:'var(--bg)' }}>
    <div className="slide-deco" style={{ opacity:0.5 }}>05</div>
    <div className="container">
      <Reveal direction="down">
        <div style={{ marginBottom:40 }}>
          <span className="label-accent">Slide 05 — Business Impact</span>
          <h2 className="display-sm" style={{ marginTop:16 }}>
            Business <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Impact</span>
          </h2>
        </div>
      </Reveal>

      <Reveal direction="up" delay={0.1}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 48px 1fr', gap:0, marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--accent)' }} />
            <span style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-2)', fontWeight:500 }}>Before Operon</span>
          </div>
          <div />
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--green)' }} />
            <span style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-2)', fontWeight:500 }}>After Operon</span>
          </div>
        </div>
      </Reveal>

      {IMPACT_ROWS.map((row, i) => (
        <Reveal key={i} direction="up" delay={0.08 * i}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 48px 1fr', gap:0, alignItems:'stretch', marginBottom:12 }}>
            <div style={{ background:'var(--accent-bg)', border:'1px solid var(--border)', borderLeft:'3px solid var(--accent)', padding:'24px 28px', display:'flex', alignItems:'center' }}>
              <p style={{ fontFamily:'var(--sans)', fontSize:16, color:'var(--ink)', lineHeight:1.55, margin:0 }}>
                <HighlightText text={row.before} hl={row.bHL} color="var(--accent)" />
              </p>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-3)', fontSize:20 }}>→</div>
            <div style={{ background:'var(--green-bg)', border:'1px solid var(--border)', borderLeft:'3px solid var(--green)', padding:'24px 28px', display:'flex', alignItems:'center' }}>
              <p style={{ fontFamily:'var(--sans)', fontSize:16, color:'var(--ink)', lineHeight:1.55, margin:0 }}>
                <HighlightText text={row.after} hl={row.aHL} color="var(--green)" />
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 6 — THE COST OF INACTION
   ═══════════════════════════════════════════════════════════════════ */
const COST_BARS = [
  { label:'Current State (Manual)', total:1900, segments:[
    { name:'Classification labor', value:415, color:'#E87979' },
    { name:'Misrouting rework', value:150, color:'#F5A623' },
    { name:'Agent turnover', value:335, color:'#5B8DEF' },
    { name:'Regulatory risk reserve', value:500, color:'#E05B7A' },
    { name:'Customer churn cost', value:500, color:'#D4A0E8' },
  ]},
  { label:'Year 1 (AI)', total:600, badge:'69% reduction', segments:[
    { name:'Direct handling', value:310, color:'#5B8DEF' },
    { name:'Misrouting rework', value:30, color:'#F5A623' },
    { name:'AI system build', value:148, color:'#1A3A5C' },
    { name:'AI system recurring', value:112, color:'#2A5A8C' },
  ]},
  { label:'Year 2+ (AI)', total:300, badge:'85% reduction', segments:[
    { name:'Direct handling', value:100, color:'#5B8DEF' },
    { name:'Classification labor', value:25, color:'#E87979' },
    { name:'Misrouting rework', value:30, color:'#F5A623' },
    { name:'AI system recurring', value:145, color:'#2A5A8C' },
  ]},
];

/* Cumulative net savings data (36 months) */
const savingsData = [];
for (let m = 0; m <= 36; m++) {
  const conservative = m <= 6 ? -148 + (m * 30) : Math.round(-148 + 180 + (m - 6) * 95);
  const optimistic = m <= 6 ? -148 + (m * 45) : Math.round(-148 + 270 + (m - 6) * 140);
  savingsData.push({ month: m, conservative: Math.max(conservative, -148), optimistic: Math.max(optimistic, -148) });
}

const AnimatedBar = ({ bar, maxTotal, index, inView }) => {
  const [hovered, setHovered] = React.useState(null);
  const barHeight = inView ? (bar.total / maxTotal) * 280 : 0;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
      <div style={{ fontFamily:'var(--display)', fontSize:20, fontWeight:600, color:'var(--ink)', marginBottom:8, transition:'all 0.6s', opacity:inView?1:0 }}>
        ${(bar.total/1000).toFixed(1)}M
      </div>
      {bar.badge ? (
        <div style={{ background:'var(--green)', color:'#fff', fontFamily:'var(--mono)', fontSize:10, padding:'3px 10px', marginBottom:8, letterSpacing:'0.05em', transition:'all 0.8s', opacity:inView?1:0 }}>
          {bar.badge}
        </div>
      ) : <div style={{ height:25 }} />}
      <div style={{ width:'100%', maxWidth:140, height:300, display:'flex', flexDirection:'column', justifyContent:'flex-end', position:'relative' }}>
        <div style={{ height: barHeight, transition:`height 1.2s cubic-bezier(0.16,1,0.3,1) ${index*0.15}s`, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {bar.segments.map((seg, si) => {
            const segH = (seg.value / bar.total) * 100;
            return (
              <div key={si}
                onMouseEnter={() => setHovered(si)} onMouseLeave={() => setHovered(null)}
                className="t"
                style={{
                  flex:`${segH} 0 0%`, background:seg.color, position:'relative', cursor:'pointer',
                  borderBottom:'1px solid rgba(255,255,255,0.3)',
                  filter: hovered !== null && hovered !== si ? 'brightness(0.7)' : 'none',
                  transform: hovered === si ? 'scaleX(1.06)' : 'none',
                }}
              >
                {hovered === si && (
                  <div style={{
                    position:'absolute', left:'110%', top:'50%', transform:'translateY(-50%)',
                    background:'var(--ink)', color:'#fff', padding:'8px 14px', whiteSpace:'nowrap',
                    fontFamily:'var(--mono)', fontSize:11, zIndex:10, boxShadow:'0 4px 20px rgba(0,0,0,0.2)',
                  }}>
                    {seg.name}: ${seg.value}K
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ fontFamily:'var(--display)', fontSize:13, fontWeight:600, color:'var(--ink)', marginTop:12, textAlign:'center', lineHeight:1.4 }}>
        {bar.label}
      </div>
    </div>
  );
};

const SavingsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--ink)', padding:'12px 16px', border:'none', boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
      <div style={{ fontFamily:'var(--mono)', fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Month {label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily:'var(--mono)', fontSize:12, color: p.color, marginBottom:4 }}>
          {p.name}: ${Math.round(p.value)}K
        </div>
      ))}
    </div>
  );
};

const CostOfInaction = () => {
  const ref = React.useRef(null);
  const inView = useInView(ref, 0.1);
  const maxTotal = Math.max(...COST_BARS.map(b => b.total));
  return (
    <section id="inaction" ref={ref} style={{ background:'var(--bg)', padding:'var(--pad)', borderTop:'1px solid var(--border)' }}>
      <div style={{ maxWidth:'var(--max)', margin:'0 auto' }}>
        <Reveal direction="down">
          <span className="label-accent">Slide 06 — The Cost of Inaction</span>
          <h2 className="display-sm" style={{ marginTop:16, marginBottom:48 }}>
            The Cost of <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Inaction</span>
          </h2>
        </Reveal>

        {/* Row 1: Bar chart + Key metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start', marginBottom:64 }}>
          <Reveal direction="up" delay={0.1}>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', padding:'36px 28px' }}>
              <div className="label" style={{ marginBottom:28 }}>Annual Complaint Handling Costs</div>
              <div style={{ display:'flex', gap:20, alignItems:'flex-end', minHeight:380 }}>
                {COST_BARS.map((bar, i) => (
                  <AnimatedBar key={i} bar={bar} maxTotal={maxTotal} index={i} inView={inView} />
                ))}
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:14, marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                {[
                  { name:'Classification labor', color:'#E87979' },
                  { name:'Misrouting rework', color:'#F5A623' },
                  { name:'Agent turnover', color:'#5B8DEF' },
                  { name:'Regulatory risk', color:'#E05B7A' },
                  { name:'Customer churn', color:'#D4A0E8' },
                  { name:'AI system', color:'#1A3A5C' },
                ].map(l => (
                  <div key={l.name} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <div style={{ width:8, height:8, background:l.color }} />
                    <span style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink-3)' }}>{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal direction="left" delay={0.2}>
              <div style={{ background:'var(--accent-bg)', border:'1px solid var(--accent-mid)', padding:'28px 32px', marginBottom:28 }}>
                <div className="label-accent" style={{ marginBottom:12 }}>Payback Period</div>
                <div style={{ fontFamily:'var(--display)', fontSize:36, fontWeight:600, color:'var(--accent)', marginBottom:8 }}>4–6 months</div>
                <p style={{ fontFamily:'var(--mono)', fontSize:13, color:'var(--ink-2)', lineHeight:1.6, margin:0 }}>
                  Breakeven at Month 7. Modular LangGraph architecture enables incremental releases,
                  so cost reductions begin before the final phase is complete.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.3}>
              <div className="label" style={{ marginBottom:16 }}>Key Operational Improvements</div>
            </Reveal>
            {[
              { metric:'67–80%', lbl:'Resolution time reduction', detail:'15+ days → 3–5 days' },
              { metric:'99.7%', lbl:'Classification throughput gain', detail:'15–25 min → <3 seconds' },
              { metric:'<10%', lbl:'Misrouting rate target', detail:'Down from 15–25%' },
              { metric:'80%', lbl:'Faster compliance reporting', detail:'Manual → auto-generated audit trails' },
            ].map((item, i) => (
              <Reveal key={i} direction="left" delay={0.3 + i * 0.06}>
                <div style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:20, padding:'16px 0', borderBottom:'1px solid var(--border)', alignItems:'center' }}>
                  <div style={{ fontFamily:'var(--display)', fontSize:22, fontWeight:600, color:'var(--accent)', lineHeight:1 }}>{item.metric}</div>
                  <div>
                    <div style={{ fontFamily:'var(--sans)', fontSize:15, color:'var(--ink)', fontWeight:500, marginBottom:3 }}>{item.lbl}</div>
                    <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-3)' }}>{item.detail}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Row 2: Cumulative Savings Line Chart */}
        <Reveal direction="up" delay={0.2}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', padding:'36px 32px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
              <div className="label">Cumulative Net Savings (36 months)</div>
              <div style={{ display:'flex', gap:24 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:20, height:3, background:'#2563EB' }} />
                  <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)' }}>Conservative (direct savings)</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ width:20, height:3, background:'var(--green)' }} />
                  <span style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)' }}>Optimistic (incl. churn + risk)</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={savingsData} margin={{ top:10, right:30, left:20, bottom:20 }}>
                <defs>
                  <linearGradient id="gradCons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradOpt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontFamily:'var(--mono)', fontSize:10, fill:'var(--ink-3)' }} label={{ value:'Month', position:'insideBottom', offset:-10, style:{ fontFamily:'var(--mono)', fontSize:11, fill:'var(--ink-3)' } }} />
                <YAxis tick={{ fontFamily:'var(--mono)', fontSize:10, fill:'var(--ink-3)' }} tickFormatter={v => `$${v}K`} label={{ value:'Cumulative Net Savings ($K)', angle:-90, position:'insideLeft', offset:0, style:{ fontFamily:'var(--mono)', fontSize:10, fill:'var(--ink-3)' } }} />
                <Tooltip content={<SavingsTooltip />} />
                <Area type="monotone" isAnimationActive={false} dataKey="conservative" name="Conservative" stroke="#2563EB" strokeWidth={2.5} fill="url(#gradCons)" dot={false} activeDot={{ r:5, fill:'#2563EB' }} />
                <Area type="monotone" isAnimationActive={false} dataKey="optimistic" name="Optimistic" stroke="#16A34A" strokeWidth={2.5} fill="url(#gradOpt)" dot={false} activeDot={{ r:5, fill:'#16A34A' }} />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'var(--accent)' }} />
                <span style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-2)' }}>Breakeven: Month 7</span>
              </div>
              <div style={{ display:'flex', gap:32 }}>
                <span style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'#2563EB' }}>$3.0M conservative</span>
                <span style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'var(--green)' }}>$4.7M optimistic</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.3}>
          <div style={{ marginTop:32, padding:'20px 24px', borderLeft:'3px solid var(--accent)', background:'var(--accent-bg)' }}>
            <p style={{ fontFamily:'var(--sans)', fontSize:14, color:'var(--ink-2)', lineHeight:1.65, margin:0 }}>
              <strong style={{ color:'var(--ink)' }}>Excludes:</strong> avoided regulatory penalties ($7K–$1.4M/day), churn reduction ($500K–$1M/yr), reputational risk.
              Including these increases 3-year ROI to <strong>10–15×</strong>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 7 — DEMO
   ═══════════════════════════════════════════════════════════════════ */
const Demo = () => (
  <section id="demo" className="slide" style={{ background:'var(--surface)', minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div className="container" style={{ textAlign:'center' }}>
      <Reveal direction="down">
        <span className="label-accent" style={{ marginBottom:24, display:'block' }}>Slide 07 — Live Demo</span>
      </Reveal>
      <Reveal direction="up" delay={0.15}>
        <h2 className="display-sm" style={{ marginBottom:24 }}>
          See it in <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Action</span>
        </h2>
      </Reveal>
      <Reveal direction="up" delay={0.25}>
        <p style={{ fontFamily:'var(--sans)', fontSize:19, color:'var(--ink-2)', lineHeight:1.7, maxWidth:520, margin:'0 auto 48px', fontWeight:400 }}>
          Explore the full Operon Intelligence pipeline — live classification,
          risk scoring, routing, and resolution on real CFPB complaint data.
        </p>
      </Reveal>
      <Reveal direction="up" delay={0.35}>
        <a href="https://operon.website" target="_blank" rel="noopener noreferrer"
          className="btn btn-fill" style={{ fontSize:17, padding:'20px 48px', display:'inline-flex' }}>
          Launch Demo ↗
        </a>
      </Reveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 8 — SCALABILITY
   ═══════════════════════════════════════════════════════════════════ */
const SCALE_TIERS = [
  {
    users: '1,000',
    label: 'Pilot / Regional',
    color: 'var(--green)',
    infra: '50,000 complaints/mo · 6 batches/day (every 4 hrs)',
    agents: 'Local classifiers + gpt-5.4-mini pipeline',
    latency: 'Batch execution ~ 10-15 mins',
    cost: 'AI: ~$75 / mo | HW: ~$150 / mo',
    notes: 'Cost-optimized batch ingestion. Complaints compiled every 4 hours, processed via small local models for routing, and gpt-5.4-mini for deep compliance extraction.',
  },
  {
    users: '5,000',
    label: 'Mid-Tier Institution',
    color: '#F5A623',
    infra: '100,000 complaints/mo · 6 batches/day (every 4 hrs)',
    agents: 'Async Celery queues + horizontal worker scaling',
    latency: 'Batch execution ~ 20-30 mins',
    cost: 'AI: ~$150 / mo | HW: ~$350 / mo',
    notes: 'Handles 100k throughput easily. Queues distribute the 6 daily batches across independent microservices to efficiently leverage gpt-5.4-mini without hitting rate limits.',
  },
  {
    users: '20,000',
    label: 'National Scale',
    color: 'var(--accent)',
    infra: '150,000 complaints/mo · Event-driven batching',
    agents: 'Auto-scaling agent pools + semantic caching',
    latency: 'Batch execution ~ 45-60 mins',
    cost: 'AI: ~$225 / mo | HW: ~$800 / mo',
    notes: 'High-volume 4-hour batch processing. Local caching architectures eliminate redundant gpt-5.4-mini API calls, tightly controlling token spend at 150,000+ volume.',
  },
];

const DEPLOY_OPTIONS = [
  { name: 'Vercel + Railway', desc: 'Frontend on Vercel CDN, backend on Railway containers. Zero-ops, instant deploy, ideal for pilots.', tag: '1K users' },
  { name: 'AWS ECS / App Runner', desc: 'Fully managed containers with auto-scaling. RDS for persistence, ElastiCache for Redis. No K8s overhead.', tag: '5K users' },
  { name: 'Kubernetes (EKS / GKE)', desc: 'Each agent as an independent Deployment. HPA scales replicas on CPU/queue depth. Helm chart for versioned releases.', tag: '20K users' },
  { name: 'On-Premise + Air-Gap', desc: 'For institutions with strict data residency. Full Docker Compose or K8s on bare metal with local LLM fallback.', tag: 'Enterprise' },
];

const Scalability = () => (
  <section id="scalability" className="slide" style={{ background:'var(--surface)', minHeight:'100vh' }}>
    <div className="slide-deco" style={{ opacity:0.4 }}>08</div>
    <div className="container">
      <Reveal direction="down">
        <div style={{ marginBottom:56 }}>
          <span className="label-accent">Slide 08 — Scalability</span>
          <h2 className="display-sm" style={{ marginTop:16 }}>
            Built to <span style={{ color:'var(--accent)', fontStyle:'italic' }}>Scale</span>
          </h2>
          <p style={{ fontFamily:'var(--sans)', fontSize:18, color:'var(--ink-2)', lineHeight:1.7, maxWidth:640, marginTop:16, fontWeight:400 }}>
            Operon does not need to be scaled today — but the architecture is designed so that scaling is a configuration change, not a rewrite.
          </p>
        </div>
      </Reveal>

      {/* Tier cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20, marginBottom:56 }}>
        {SCALE_TIERS.map((tier, i) => (
          <Reveal key={i} direction="up" delay={0.08 * i}>
            <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderTop:`4px solid ${tier.color}`, padding:'32px 28px', height:'100%' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
                <div>
                  <div style={{ fontFamily:'var(--display)', fontSize:36, fontWeight:600, color:tier.color, lineHeight:1, marginBottom:6 }}>{tier.users}</div>
                  <div style={{ fontFamily:'var(--mono)', fontSize:10, color:'var(--ink-3)', letterSpacing:'0.12em', textTransform:'uppercase' }}>{tier.label}</div>
                </div>
                <div style={{ fontFamily:'var(--mono)', fontSize:10, color:tier.color, background:`${tier.color}18`, border:`1px solid ${tier.color}44`, padding:'4px 10px', marginTop:4 }}>cmpl/mo</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {[['Infrastructure', tier.infra], ['Agent Execution', tier.agents], ['Latency', tier.latency], ['Est. Cost', tier.cost]].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--ink-3)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:4 }}>{k}</div>
                    <div style={{ fontFamily:'var(--sans)', fontSize:14, color:'var(--ink)', lineHeight:1.5 }}>{v}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--border)' }}>
                <p style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink-2)', lineHeight:1.6, margin:0 }}>{tier.notes}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal direction="up" delay={0.25}>
        <div style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink-3)', textAlign:'right', marginTop:'-36px', marginBottom:56 }}>
          * Final costs shown reflect infrastructure limits. Excludes LLM AI API costs which scale proportionally with complaint volume.
        </div>
      </Reveal>

      {/* Deployment options */}
      <Reveal direction="up" delay={0.3}>
        <div className="label" style={{ marginBottom:20 }}>Deployment Options</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:1, background:'var(--border)' }}>
          {DEPLOY_OPTIONS.map((opt, i) => (
            <div key={i} style={{ background:'var(--bg)', padding:'24px 22px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ fontFamily:'var(--display)', fontSize:15, fontWeight:600, color:'var(--ink)', lineHeight:1.3, maxWidth:140 }}>{opt.name}</div>
                <div style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--accent)', background:'var(--accent-bg)', border:'1px solid var(--accent-mid)', padding:'3px 8px', whiteSpace:'nowrap' }}>{opt.tag}</div>
              </div>
              <p style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink-2)', lineHeight:1.6, margin:0 }}>{opt.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   SLIDE 9 — FUTURE + THANK YOU
   ═══════════════════════════════════════════════════════════════════ */
const FUTURE_ITEMS = [
  {
    title: 'Self-learning agents from supervisor feedback',
    pitch: 'Every supervisor override becomes training data, building a continuously growing dataset that fine-tunes the system to the bank’s own playbook over time.',
  },
  {
    title: 'Regulation-grounded reasoning (Regulatory RAG)',
    pitch: 'Citations are retrieved live from the actual regulatory corpus—including CFR, CFPB guidance, and OCC bulletins—ensuring defensibility and automatic updates.',
  },
  {
    title: 'Multi-agent consensus on high-risk cases',
    pitch: 'For critical cases, a secondary model reviews the primary output, forcing automatic human review on disagreements to prevent silent failures.',
  },
  {
    title: 'Continuous evaluation + drift monitoring',
    pitch: 'A golden set of labeled complaints runs on every update, tracking metrics and blocking any prompt changes that regress quality or fairness.',
  },
  {
    title: 'Multi-tenant role-based access control',
    pitch: 'Administrators, Managers, and Users operate with scoped permissions, ensuring that sensitive queues and model configurations are securely gated.',
  },
  {
    title: 'Parallel agent flows',
    pitch: 'Complaints are dispatched to independent workers immediately upon arrival, allowing agent tiers to scale horizontally without queue bottlenecks.',
  },
];

const FutureAndThanks = () => (
  <section id="future" className="slide" style={{ background:'var(--ink)', overflow:'hidden', minHeight:'100vh' }}>
    <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize:'60px 60px', pointerEvents:'none' }} />
    <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:'50%', height:'60%', background:'radial-gradient(ellipse, rgba(220,38,38,0.15) 0%, transparent 70%)', pointerEvents:'none' }} />

    <div className="container" style={{ position:'relative', zIndex:1 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(60px,8vw,120px)', alignItems:'start' }}>
        <div>
          <Reveal direction="right" delay={0.1}>
            <span className="label-accent" style={{ color:'#FCA5A5' }}>Slide 09 — What's Next</span>
            <h2 className="display-sm" style={{ color:'#FFFFFF', marginTop:16, marginBottom:48 }}>
              Future<br /><span style={{ color:'var(--accent)' }}>Enhancements</span>
            </h2>
          </Reveal>

          <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
            {FUTURE_ITEMS.map((item, i) => (
              <Reveal key={i} direction="right" delay={0.1 + i * 0.06}>
                <div style={{ padding:'20px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'40px 1fr', gap:16, alignItems:'start', marginBottom:12 }}>
                    <div style={{ width:28, height:28, background:'rgba(220,38,38,0.15)', border:'1px solid rgba(220,38,38,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'#FCA5A5' }}>{String(i+1).padStart(2,'0')}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily:'var(--display)', fontSize:16, fontWeight:600, color:'#FFFFFF', marginBottom:6, lineHeight:1.35 }}>{item.title}</div>
                      <div style={{ fontFamily:'var(--sans)', fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.55 }}>{item.pitch}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', minHeight:'60vh' }}>
          <Reveal direction="left" delay={0.3}>
            <h2 style={{ fontFamily:'var(--display)', fontSize:'clamp(48px,7vw,96px)', fontWeight:600, color:'#FFFFFF', lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:32 }}>
              Thank you.
            </h2>
          </Reveal>
          <Reveal direction="left" delay={0.4}>
            <p style={{ fontFamily:'var(--sans)', fontSize:21, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:48, fontWeight:400, maxWidth:400 }}>
              We'd love to answer your questions and discuss how Operon Intelligence
              can transform your complaint operations.
            </p>
          </Reveal>
          <Reveal direction="left" delay={0.5}>
            <div style={{ display:'flex', gap:12 }}>
              <a href="https://operon.website" target="_blank" rel="noopener noreferrer" className="btn btn-fill" style={{ fontSize:15 }}>
                Try the Demo ↗
              </a>
              <a href="#top" className="btn btn-outline" style={{ color:'rgba(255,255,255,0.7)', borderColor:'rgba(255,255,255,0.2)', fontSize:15 }}
                onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='var(--accent)'}}
                onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,0.7)';e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}}
              >
                Back to Top ↑
              </a>
            </div>
          </Reveal>

          <Reveal direction="left" delay={0.6}>
            <div style={{ marginTop:64, paddingTop:32, borderTop:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="label" style={{ color:'rgba(255,255,255,0.25)', marginBottom:16 }}>Team</div>
              <div style={{ display:'flex', gap:24 }}>
                {['Tauksik', 'Priyam', 'Premal', 'Manan'].map(name => (
                  <span key={name} style={{ fontFamily:'var(--sans)', fontSize:15, color:'rgba(255,255,255,0.6)', fontWeight:500 }}>{name}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════════
   APP
   ═══════════════════════════════════════════════════════════════════ */
const App = () => (
  <>
    <ScrollProgress />
    <Nav />
    <Hero />
    <ProblemStatement />
    <CurrentSystem />
    <OurSolution />
    <Architecture />
    <BusinessImpact />
    <CostOfInaction />
    <Demo />
    <Scalability />
    <FutureAndThanks />
  </>
);

export default App;
