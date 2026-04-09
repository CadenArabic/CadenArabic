import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Improved CometCard with stronger 3D + holographic shine ─── */
function CometCard({ children, className = "" }) {
  const cardRef = useRef(null);
  const rafRef = useRef(0);
  const currentRef = useRef({ x: 0.5, y: 0.5, rx: 0, ry: 0 });
  const targetRef = useRef({ x: 0.5, y: 0.5, rx: 0, ry: 0 });
  const activeRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const animate = () => {
      const c = currentRef.current;
      const t = targetRef.current;
      const lerp = activeRef.current ? 0.12 : 0.08;
      c.x += (t.x - c.x) * lerp;
      c.y += (t.y - c.y) * lerp;
      c.rx += (t.rx - c.rx) * lerp;
      c.ry += (t.ry - c.ry) * lerp;
      const opacity = activeRef.current ? 1 : Math.max(0, 1 - Math.abs(c.x - 0.5) * 4);
      el.style.setProperty("--cx", `${(c.x * 100).toFixed(2)}%`);
      el.style.setProperty("--cy", `${(c.y * 100).toFixed(2)}%`);
      el.style.setProperty("--rx", `${c.rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${c.ry.toFixed(2)}deg`);
      el.style.setProperty("--co", `${opacity.toFixed(3)}`);
      el.style.setProperty("--shine-angle", `${(Math.atan2(c.y - 0.5, c.x - 0.5) * 180 / Math.PI + 90).toFixed(1)}deg`);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const px = Math.max(0, Math.min(1, (e.clientX - b.left) / b.width));
    const py = Math.max(0, Math.min(1, (e.clientY - b.top) / b.height));
    targetRef.current = { x: px, y: py, ry: (px - 0.5) * 28, rx: (0.5 - py) * 22 };
    activeRef.current = true;
  };

  const handleLeave = () => {
    targetRef.current = { x: 0.5, y: 0.5, rx: 0, ry: 0 };
    activeRef.current = false;
  };

  return (
    <div ref={cardRef} className={`cc ${className}`} onPointerMove={handleMove} onPointerLeave={handleLeave}>
      <div className="cc-inner">
        <div className="cc-shine" />
        <div className="cc-holo" />
        <div className="cc-glow" />
        <div className="cc-edge" />
        <div className="cc-content">{children}</div>
      </div>
    </div>
  );
}

/* ─── Data ─── */
const skillPills = ["Luau Scripting", "Gameplay Systems", "UI Logic", "Data Stores", "Leaderboards", "Optimization"];
const services = [
  { title: "Gameplay Systems", description: "Custom mechanics, round systems, progression loops, and clean scripting foundations built for smooth player experiences.", icon: "gameplay" },
  { title: "UI + Interaction", description: "Responsive menus, shop flows, buttons, prompts, and in-game interactions connected cleanly to backend logic.", icon: "ui" },
  { title: "Optimization + Structure", description: "Organized code, reusable modules, and scalable systems that make future updates easier as your game grows.", icon: "optimize" },
];
const robloxGames = [
  { title: "Escape Train for Brainrots", url: "https://www.roblox.com/games/93014298159631/Escape-Train-for-Brainrots", placeId: "93014298159631", universeId: "9825427575" },
  { title: "Escape Falling Stairs for Brainrot", url: "https://www.roblox.com/games/116990588746086/Escape-Falling-Stairs-for-Brainrot", placeId: "116990588746086", universeId: "9715259353" },
  { title: "Four in a Row", url: "https://www.roblox.com/games/118638953131946/Four-in-a-Row", placeId: "118638953131946", universeId: "9488122827" },
  { title: "Bomb Card", url: "https://www.roblox.com/games/80288638708154/Bomb-Card", placeId: "80288638708154", universeId: "9539819854" },
  { title: "Obby to Brainrots", url: "https://www.roblox.com/games/74344557530102/Obby-to-Brainrots", placeId: "74344557530102", universeId: "9857780163" },
  { title: "Steal a Celebrity", url: "https://www.roblox.com/games/96771164438323/Steal-a-Celebrity", placeId: "96771164438323", universeId: "8048361149" },
  { title: "Feed Your Pets", url: "https://www.roblox.com/games/140049315593804/Feed-Your-Pets", placeId: "140049315593804", universeId: "8770927660" },
  { title: "FREE ADMIN Samurai Troll Tower", url: "https://www.roblox.com/games/115768905804211/FREE-ADMIN-Samurai-Troll-Tower", placeId: "115768905804211", universeId: "8158669578" },
  { title: "Fling a Brainrot", url: "https://www.roblox.com/games/93108774146455/Fling-a-Brainrot", placeId: "93108774146455", universeId: "8471471873" },
  { title: "Dangerous RV Driving", url: "https://www.roblox.com/games/78758085598611/Dangerous-RV-Driving", placeId: "78758085598611", universeId: "9160234761" },
  { title: "Build to Become Squid Game Guard", url: "https://www.roblox.com/games/110424054961189/Build-to-Become-Squid-Game-Guard", placeId: "110424054961189", universeId: "9958506970" },
  { title: "Shrink for Lucky Blocks", url: "https://www.roblox.com/games/97071633125628/Shrink-for-Lucky-Blocks", placeId: "97071633125628", universeId: "9889664408" },
];
const beamLines = [
  { left: "4%", top: "20%", width: "32rem", duration: "16s", delay: "-4s" },
  { left: "18%", top: "76%", width: "28rem", duration: "13s", delay: "-7s" },
  { left: "52%", top: "16%", width: "26rem", duration: "15s", delay: "-9s" },
  { left: "64%", top: "62%", width: "22rem", duration: "12s", delay: "-5s" },
];
const particles = [
  { size: 6, left: "9%", top: "24%", duration: "11s", delay: "-2s" },
  { size: 3, left: "12%", top: "68%", duration: "9s", delay: "-5s" },
  { size: 4, left: "20%", top: "44%", duration: "10s", delay: "-3s" },
  { size: 5, left: "31%", top: "18%", duration: "12s", delay: "-6s" },
  { size: 3, left: "38%", top: "78%", duration: "8s", delay: "-1s" },
  { size: 5, left: "49%", top: "32%", duration: "10s", delay: "-4s" },
  { size: 4, left: "56%", top: "58%", duration: "9s", delay: "-7s" },
  { size: 6, left: "66%", top: "22%", duration: "11s", delay: "-8s" },
  { size: 4, left: "72%", top: "72%", duration: "10s", delay: "-3s" },
  { size: 5, left: "84%", top: "36%", duration: "12s", delay: "-9s" },
];
const navSections = ["about", "stats", "services", "games", "contact"];
const fmt = new Intl.NumberFormat("en-US");

/* ─── API helpers ─── */
const expandUrls = (url) => [url, `https://corsproxy.io/?${encodeURIComponent(url)}`, `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`];
const fetchJson = async (urls) => { for (const base of urls) { for (const u of expandUrls(base)) { try { const c = new AbortController(); const t = setTimeout(() => c.abort(), 9000); const r = await fetch(u, { signal: c.signal }); clearTimeout(t); if (!r.ok) continue; return await r.json(); } catch {} } } throw new Error("fetch failed"); };
const readArr = (p) => { if (Array.isArray(p)) return p; if (p?.data && Array.isArray(p.data)) return p.data; return []; };
const readInt = (v) => typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : null;
const readStr = (v) => typeof v === "string" && v.trim() ? v : null;
const readId = (v) => typeof v === "number" ? String(Math.trunc(v)) : typeof v === "string" && v.trim() ? v.trim() : null;

/* ─── Hooks ─── */
function useScrollReveal() { useEffect(() => { const obs = new IntersectionObserver((entries) => { entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("revealed"); obs.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }); document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale").forEach((el) => obs.observe(el)); return () => obs.disconnect(); }, []); }
function useActiveSection() { const [active, setActive] = useState(""); useEffect(() => { const obs = new IntersectionObserver((entries) => { const vis = entries.filter((e) => e.isIntersecting); if (vis.length) setActive(vis.reduce((a, b) => a.boundingClientRect.top < b.boundingClientRect.top ? a : b).target.id); }, { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }); navSections.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); }); return () => obs.disconnect(); }, []); return active; }
function useScrollProgress() { const [progress, setProgress] = useState(0); const [showBtn, setShowBtn] = useState(false); useEffect(() => { const h = () => { const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); setProgress(Math.min(Math.max(window.scrollY / max, 0), 1)); setShowBtn(window.scrollY > 400); }; h(); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []); return { progress, showBtn }; }
function useTypewriter(text, speed = 70, startDelay = 600) { const [displayed, setDisplayed] = useState(""); const [done, setDone] = useState(false); useEffect(() => { let i = 0, tid; const tick = () => { if (i <= text.length) { setDisplayed(text.slice(0, i)); i++; tid = setTimeout(tick, speed); } else setDone(true); }; tid = setTimeout(tick, startDelay); return () => clearTimeout(tid); }, [text, speed, startDelay]); return { displayed, done }; }

/* ─── Icons ─── */
function ServiceIcon({ type }) { if (type === "gameplay") return <svg viewBox="0 0 24 24" fill="none" style={{width:24,height:24}} stroke="currentColor" strokeWidth="1.8"><path d="M7 10h10a3 3 0 0 1 3 3v1a4 4 0 0 1-4 4l-2-2H10l-2 2a4 4 0 0 1-4-4v-1a3 3 0 0 1 3-3Z"/><path d="M8.5 13.5h3"/><path d="M10 12v3"/><path d="M15.5 13.5h.01"/><path d="M18 13.5h.01"/></svg>; if (type === "ui") return <svg viewBox="0 0 24 24" fill="none" style={{width:24,height:24}} stroke="currentColor" strokeWidth="1.8"><rect x="3.5" y="5" width="17" height="11" rx="2.5"/><path d="M8 20h8"/><path d="M12 16v4"/><path d="M7 9h5"/><path d="M7 12h8"/></svg>; return <svg viewBox="0 0 24 24" fill="none" style={{width:24,height:24}} stroke="currentColor" strokeWidth="1.8"><path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z"/><path d="M4 12.5 12 16l8-3.5"/><path d="M4 17 12 20l8-3"/></svg>; }

function AnimatedCounter({ value, fallback }) { if (value === null) return <span style={{fontFamily:"var(--fm)",fontSize:"clamp(1.05rem,2vw,1.55rem)",color:"rgba(224,242,254,.92)"}}>{fallback}</span>; const f = fmt.format(value); return (<span style={{display:"inline-flex",alignItems:"center",gap:"0.08em",fontVariantNumeric:"tabular-nums",fontFamily:"var(--fm)"}} aria-label={f}>{f.split("").map((c,i) => /\d/.test(c) ? (<span key={`${c}-${i}`} style={{position:"relative",display:"inline-flex",alignItems:"flex-start",justifyContent:"center",width:"0.68em",height:"1em",overflow:"hidden"}}><span style={{display:"flex",flexDirection:"column",transition:"transform 520ms cubic-bezier(.22,1,.36,1)",willChange:"transform",transform:`translateY(-${Number(c)*10}%)`}}>{Array.from({length:10},(_,d)=><span key={d} style={{display:"flex",alignItems:"center",justifyContent:"center",width:"0.68em",height:"1em"}}>{d}</span>)}</span></span>) : <span key={`${c}-${i}`} style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"0.34em",opacity:0.9}}>{c}</span>)}</span>); }

export default function App() {
  const pageRef = useRef(null);
  const beamRef = useRef(null);
  const [stats, setStats] = useState({ totalVisits: 0, activePlayers: 0, tracked: robloxGames.length, updatedAt: null, status: "loading", games: robloxGames.map(g => ({ ...g, playing: null, visits: null, thumbnailUrl: null })) });
  const active = useActiveSection();
  const { progress, showBtn } = useScrollProgress();
  const { displayed, done } = useTypewriter("Roblox Scripter", 80, 800);
  useScrollReveal();
  const scrollTop = useCallback(() => window.scrollTo({ top: 0, behavior: "smooth" }), []);

  useEffect(() => { if (!document.querySelector('link[data-cf]')) { const l = document.createElement("link"); l.rel="stylesheet"; l.dataset.cf="1"; l.href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"; document.head.appendChild(l); } }, []);
  useEffect(() => { const el = pageRef.current; if (!el) return; let cx=400,cy=300,tx=cx,ty=cy,fid=0; const sync=()=>{cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;const sx=((cx/(window.innerWidth||1))-.5)*70,sy=((cy/(window.innerHeight||1))-.5)*70;el.style.setProperty("--px",cx.toFixed(1)+"px");el.style.setProperty("--py",cy.toFixed(1)+"px");el.style.setProperty("--sx",sx.toFixed(1)+"px");el.style.setProperty("--sy",sy.toFixed(1)+"px");fid=requestAnimationFrame(sync);}; sync(); const onMove=(e)=>{tx=e.clientX;ty=e.clientY}; const reset=()=>{tx=(window.innerWidth||800)/2;ty=(window.innerHeight||600)/2}; window.addEventListener("pointermove",onMove); window.addEventListener("pointerleave",reset); return()=>{cancelAnimationFrame(fid);window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerleave",reset)}; }, []);
  useEffect(() => { const el = beamRef.current; if (!el) return; const sync=()=>{el.style.setProperty("--bp",(Math.min(Math.max(window.scrollY/Math.max(document.documentElement.scrollHeight-window.innerHeight,1),0),1)).toFixed(4));}; sync(); window.addEventListener("scroll",sync,{passive:true}); return()=>window.removeEventListener("scroll",sync); }, []);
  useEffect(() => { let alive=true,iid=0,inflight=false; const load=async()=>{try{const uids=robloxGames.map(g=>g.universeId).filter(Boolean);let tm=new Map();try{const tp=await fetchJson([`https://thumbnails.roproxy.com/v1/games/icons?universeIds=${uids.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`]);readArr(tp).forEach(i=>{const id=readId(i.targetId),url=readStr(i.imageUrl);if(id&&url)tm.set(id,url)});}catch{}const bg=robloxGames.map(g=>({...g,playing:null,visits:null,thumbnailUrl:g.universeId?tm.get(g.universeId)||null:null}));if(!alive)return;setStats(s=>({...s,status:"loading",games:bg}));const refresh=async()=>{if(!alive||inflight)return;inflight=true;try{const lp=await fetchJson([`https://games.roproxy.com/v1/games?universeIds=${uids.join(",")}`]);const entries=readArr(lp);const bu=new Map();entries.forEach(e=>{const id=readId(e.id);if(id)bu.set(id,e)});const hg=bg.map(g=>{const le=g.universeId?bu.get(g.universeId):undefined;return{...g,title:readStr(le?.name)||g.title,playing:readInt(le?.playing),visits:readInt(le?.visits)};});const tv=hg.reduce((s,g)=>s+(g.visits||0),0);const ap=hg.reduce((s,g)=>s+(g.playing||0),0);const res=hg.filter(g=>g.visits!==null).length;if(!alive)return;setStats({totalVisits:tv,activePlayers:ap,tracked:robloxGames.length,updatedAt:res>0?Date.now():null,status:res>0?"live":"error",games:hg});}catch{if(alive)setStats(s=>({...s,status:s.updatedAt?"live":"error"}));}finally{inflight=false;}};await refresh();if(alive)iid=setInterval(()=>refresh(),3000);}catch{if(alive)setStats(s=>({...s,status:"error"}));}};load();return()=>{alive=false;if(iid)clearInterval(iid);}; }, []);

  const tv=stats.updatedAt?stats.totalVisits:null, ap=stats.updatedAt?stats.activePlayers:null;
  const tvFb=stats.status==="error"?"Unavailable":"Loading...", apFb=stats.status==="error"?"Unavailable":"Loading...";
  const gwLabel=fmt.format(stats.tracked), mono={fontFamily:"var(--fm)"};

  return (<><style>{`
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
:root{--fd:"Outfit",system-ui,sans-serif;--fm:"JetBrains Mono",monospace}*{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:var(--fd);background:#060d1f;color:#fff;min-height:100vh}

.cc{--cx:50%;--cy:50%;--rx:0deg;--ry:0deg;--co:0;--shine-angle:90deg;perspective:1200px;position:relative;cursor:pointer;border-radius:1.5rem;overflow:hidden}
.cc-inner{position:relative;height:100%;border-radius:inherit;transform-style:preserve-3d;transform:rotateX(var(--rx)) rotateY(var(--ry));transition:transform 80ms ease-out,filter 300ms ease;will-change:transform;filter:saturate(1)}
.cc:hover .cc-inner{filter:saturate(1.12) brightness(1.03)}
.cc-shine{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:3;background:radial-gradient(ellipse 180px 240px at var(--cx) var(--cy),rgba(255,255,255,.25),rgba(255,255,255,.08) 30%,transparent 70%);opacity:var(--co);transition:opacity 200ms ease;mix-blend-mode:overlay}
.cc-holo{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;background:linear-gradient(var(--shine-angle),transparent 0%,rgba(103,232,249,.12) 15%,rgba(167,139,250,.15) 30%,rgba(251,146,60,.08) 45%,rgba(52,211,153,.12) 60%,rgba(244,114,182,.08) 75%,rgba(103,232,249,.12) 85%,transparent 100%);opacity:calc(var(--co)*.8);transition:opacity 200ms ease;mix-blend-mode:screen}
.cc-glow{position:absolute;inset:-2px;border-radius:inherit;pointer-events:none;z-index:0;background:radial-gradient(circle 200px at var(--cx) var(--cy),rgba(103,232,249,.3),rgba(139,92,246,.15) 40%,transparent 70%);filter:blur(20px);opacity:var(--co);transition:opacity 300ms ease}
.cc-edge{position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:4;border:1px solid transparent;background:linear-gradient(135deg,rgba(103,232,249,.2),transparent 40%,transparent 60%,rgba(167,139,250,.15)) border-box;-webkit-mask:linear-gradient(#fff 0 0) padding-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:var(--co);transition:opacity 250ms ease}
.cc-content{position:relative;z-index:5;height:100%;border-radius:inherit;transform:translateZ(0)}

.reveal,.reveal-left,.reveal-right,.reveal-scale{opacity:0;transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1)}.reveal{transform:translateY(32px)}.reveal-left{transform:translateX(-40px)}.reveal-right{transform:translateX(40px)}.reveal-scale{transform:scale(.92)}.revealed{opacity:1!important;transform:none!important}
.s1{transition-delay:.08s}.s2{transition-delay:.16s}.s3{transition-delay:.24s}.s4{transition-delay:.32s}.s5{transition-delay:.4s}.s6{transition-delay:.48s}.s7{transition-delay:.56s}.s8{transition-delay:.64s}.s9{transition-delay:.72s}.s10{transition-delay:.8s}
.grad-text{background:linear-gradient(90deg,#67e8f9,#818cf8,#a78bfa,#f472b6,#fb923c,#34d399,#67e8f9,#818cf8);background-size:400% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gShift 6s ease-in-out infinite}@keyframes gShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.tw-cursor{display:inline-block;width:3px;height:1em;background:rgba(103,232,249,.9);margin-left:2px;vertical-align:text-bottom;animation:blink 1s step-end infinite;box-shadow:0 0 12px rgba(103,232,249,.5)}@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
.shell{--px:50vw;--py:50vh;--sx:0px;--sy:0px;position:relative;background:#060d1f}
.diag-bands{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.diag-band{position:absolute;width:200%;height:35vh;transform-origin:center;transform:rotate(-15deg);filter:blur(0px)}
.diag-band:nth-child(1){top:-8%;left:-30%;background:linear-gradient(90deg,transparent,rgba(34,211,238,.15),rgba(99,102,241,.12),transparent);animation:bandDrift1 18s ease-in-out infinite}
.diag-band:nth-child(2){top:22%;left:-40%;background:linear-gradient(90deg,transparent,rgba(14,18,42,.95),rgba(10,16,38,.9),transparent);height:42vh;animation:bandDrift2 22s ease-in-out infinite}
.diag-band:nth-child(3){top:58%;left:-25%;background:linear-gradient(90deg,transparent,rgba(167,139,250,.1),rgba(34,211,238,.12),rgba(52,211,153,.08),transparent);animation:bandDrift3 20s ease-in-out infinite}
.diag-band:nth-child(4){top:78%;left:-35%;background:linear-gradient(90deg,transparent,rgba(8,14,36,.9),rgba(12,20,40,.85),transparent);height:38vh;animation:bandDrift1 24s ease-in-out infinite alternate}
@keyframes bandDrift1{0%,100%{transform:rotate(-15deg) translateX(0)}50%{transform:rotate(-14deg) translateX(3%)}}
@keyframes bandDrift2{0%,100%{transform:rotate(-15deg) translateX(0)}50%{transform:rotate(-16deg) translateX(-2%)}}
@keyframes bandDrift3{0%,100%{transform:rotate(-15deg) translateX(0)}50%{transform:rotate(-14.5deg) translateX(4%)}}

/* ═══ ANIMATED COLOR MESH ═══ */
.color-mesh{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.mesh-blob{position:absolute;border-radius:50%;filter:blur(100px);mix-blend-mode:screen;animation:meshFloat ease-in-out infinite}
.mesh-blob:nth-child(1){width:50vw;height:50vw;top:-10%;left:-10%;background:radial-gradient(circle,rgba(34,211,238,.2),transparent 70%);animation-duration:20s}
.mesh-blob:nth-child(2){width:45vw;height:45vw;top:30%;right:-15%;background:radial-gradient(circle,rgba(139,92,246,.18),transparent 70%);animation-duration:24s;animation-delay:-6s}
.mesh-blob:nth-child(3){width:40vw;height:40vw;bottom:-5%;left:20%;background:radial-gradient(circle,rgba(52,211,153,.15),transparent 70%);animation-duration:22s;animation-delay:-10s}
.mesh-blob:nth-child(4){width:35vw;height:35vw;top:50%;left:50%;background:radial-gradient(circle,rgba(251,146,60,.1),transparent 70%);animation-duration:26s;animation-delay:-14s}
@keyframes meshFloat{0%,100%{transform:translate(0,0) scale(1)}25%{transform:translate(6vw,-4vh) scale(1.1)}50%{transform:translate(-3vw,5vh) scale(.95)}75%{transform:translate(4vw,2vh) scale(1.05)}}

/* ═══ SHOOTING STARS ═══ */
.shooting-stars{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.star{position:absolute;width:120px;height:1px;background:linear-gradient(90deg,rgba(255,255,255,.8),rgba(103,232,249,.6),transparent);border-radius:1px;animation:starShoot linear infinite;opacity:0}
.star:nth-child(1){top:12%;left:-120px;animation-duration:3s;animation-delay:0s}
.star:nth-child(2){top:35%;left:-120px;animation-duration:2.5s;animation-delay:4s}
.star:nth-child(3){top:58%;left:-120px;animation-duration:3.5s;animation-delay:8s}
.star:nth-child(4){top:75%;left:-120px;animation-duration:2.8s;animation-delay:12s}
.star:nth-child(5){top:22%;left:-120px;animation-duration:3.2s;animation-delay:6s}
.star:nth-child(6){top:88%;left:-120px;animation-duration:2.6s;animation-delay:15s}
@keyframes starShoot{0%{transform:translateX(0) rotate(-25deg);opacity:0}5%{opacity:1}70%{opacity:.6}100%{transform:translateX(110vw) rotate(-25deg);opacity:0}}

/* ═══ GLOWING SECTION HEADERS ═══ */
.glow-title{text-shadow:0 0 40px rgba(103,232,249,.25),0 0 80px rgba(103,232,249,.1)}
.glow-label{text-shadow:0 0 20px rgba(103,232,249,.3)}

/* ═══ CARD GLOW BORDERS ═══ */
.glass-card{position:relative;border-radius:1.5rem;border:1px solid rgba(255,255,255,.08);background:rgba(10,18,42,.55);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease}
.glass-card:hover{border-color:rgba(103,232,249,.25);box-shadow:0 0 30px rgba(34,211,238,.1),0 20px 60px rgba(8,14,36,.4);transform:translateY(-6px)}
.glass-card::after{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(103,232,249,.15),transparent 40%,transparent 60%,rgba(167,139,250,.1));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;opacity:0;transition:opacity .3s ease}
.glass-card:hover::after{opacity:1}

/* ═══ PULSING LIVE INDICATOR ═══ */
.live-pulse{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:9999px;background:rgba(52,211,153,.1);border:1px solid rgba(52,211,153,.25);font-size:12px;font-weight:600;color:rgba(167,243,208,.95)}
.live-pulse-dot{width:8px;height:8px;border-radius:50%;background:#34d399;animation:livePulse 2s ease-in-out infinite}
@keyframes livePulse{0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,.6),0 0 8px rgba(52,211,153,.4)}50%{box-shadow:0 0 0 8px rgba(52,211,153,0),0 0 16px rgba(52,211,153,.2)}}

/* ═══ FLOATING ACTION PARTICLES ═══ */
.float-particles{position:fixed;inset:0;z-index:0;pointer-events:none}
.fp{position:absolute;border-radius:50%;animation:fpFloat linear infinite}
.fp:nth-child(odd){background:radial-gradient(circle,rgba(103,232,249,.5),transparent 70%)}
.fp:nth-child(even){background:radial-gradient(circle,rgba(167,139,250,.5),transparent 70%)}
@keyframes fpFloat{0%{transform:translateY(100vh) scale(0);opacity:0}10%{opacity:.8}90%{opacity:.3}100%{transform:translateY(-10vh) scale(1);opacity:0}}
.backdrop{background:radial-gradient(circle at 18% 18%,rgba(34,211,238,.14),transparent 28%),radial-gradient(circle at 84% 20%,rgba(99,102,241,.16),transparent 32%),radial-gradient(circle at 50% 88%,rgba(14,165,233,.12),transparent 34%),radial-gradient(circle at 30% 60%,rgba(139,92,246,.08),transparent 30%)}
.aurora{position:absolute;inset:0;overflow:hidden;pointer-events:none}
.aurora-band{position:absolute;width:140%;left:-20%;height:40vh;filter:blur(80px);opacity:.55;border-radius:50%;animation:auroraMove ease-in-out infinite}
.aurora-band:nth-child(1){top:5%;background:linear-gradient(90deg,transparent,rgba(34,211,238,.35),rgba(99,102,241,.3),rgba(52,211,153,.2),transparent);animation-duration:12s}
.aurora-band:nth-child(2){top:25%;background:linear-gradient(90deg,transparent,rgba(167,139,250,.3),rgba(6,182,212,.35),rgba(251,146,60,.15),rgba(96,165,250,.25),transparent);animation-duration:16s;animation-delay:-4s}
.aurora-band:nth-child(3){top:55%;background:linear-gradient(90deg,transparent,rgba(52,211,153,.3),rgba(34,211,238,.3),rgba(167,139,250,.2),transparent);animation-duration:14s;animation-delay:-8s}
@keyframes auroraMove{0%,100%{transform:translateX(-8%) rotate(-2deg) scaleY(1)}25%{transform:translateX(5%) rotate(1deg) scaleY(1.15)}50%{transform:translateX(8%) rotate(2deg) scaleY(.9)}75%{transform:translateX(-3%) rotate(-1deg) scaleY(1.1)}}.vignette{position:absolute;inset:0;background:radial-gradient(circle at center,transparent 30%,rgba(8,14,36,.2) 65%,rgba(8,14,36,.7) 100%)}.grid-bg{position:absolute;inset:0;background-size:40px 40px;background-image:linear-gradient(to right,rgba(148,163,184,.08) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,184,.08) 1px,transparent 1px);mask-image:radial-gradient(ellipse at center,transparent 18%,black 78%);opacity:.3;transform:translate3d(calc(var(--sx)*-.08),calc(var(--sy)*-.08),0)}
.cur-core,.cur-light,.cur-soft{position:absolute;left:0;top:0;border-radius:9999px;pointer-events:none;transform:translate3d(calc(var(--px) - 50%),calc(var(--py) - 50%),0)}.cur-core{width:1.8rem;height:1.8rem;background:radial-gradient(circle,rgba(255,255,255,.98),rgba(125,211,252,.9) 30%,rgba(34,211,238,.42) 55%,transparent 74%);box-shadow:0 0 18px rgba(125,211,252,.55),0 0 36px rgba(34,211,238,.34);filter:blur(1px);opacity:.98;z-index:2}.cur-light{width:18rem;height:18rem;background:radial-gradient(circle,rgba(125,211,252,.28),rgba(34,211,238,.15) 24%,rgba(56,189,248,.06) 46%,transparent 72%);filter:blur(18px);mix-blend-mode:screen;z-index:1}.cur-soft{width:34rem;height:34rem;background:radial-gradient(circle,rgba(99,102,241,.16),rgba(6,182,212,.07) 34%,transparent 72%);filter:blur(36px);opacity:.92}
.orb{position:absolute;border-radius:9999px;filter:blur(70px);animation:orbD ease-in-out infinite}@keyframes orbD{0%,100%{transform:translate3d(0,0,0) scale(1)}33%{transform:translate3d(28px,-16px,0) scale(1.08)}66%{transform:translate3d(-20px,24px,0) scale(.94)}}
.ring-el{position:absolute;border-radius:9999px;border:1px solid rgba(125,211,252,.12);box-shadow:0 0 40px rgba(34,211,238,.05);animation:ringP ease-in-out infinite}@keyframes ringP{0%,100%{transform:scale(.96);opacity:.18}50%{transform:scale(1.04);opacity:.34}}
.wave{position:absolute;border-radius:9999px;pointer-events:none;filter:blur(55px);opacity:.4;animation:waveD ease-in-out infinite}@keyframes waveD{0%,100%{transform:translate3d(0,0,0) scale(1)}33%{transform:translate3d(26px,-18px,0) scale(1.06)}66%{transform:translate3d(-22px,20px,0) scale(.96)}}
.beam-f{position:absolute;inset:0;overflow:hidden;pointer-events:none;transform:translate3d(calc(var(--sx)*.08),calc(var(--sy)*.08),0)}.bm{position:absolute;height:1px;background:linear-gradient(90deg,transparent,rgba(125,211,252,.7),rgba(129,140,248,.28),transparent);box-shadow:0 0 18px rgba(103,232,249,.3);transform:rotate(-26deg);opacity:0;animation:bmS linear infinite}@keyframes bmS{0%{transform:translate3d(-8rem,0,0) rotate(-26deg) scaleX(.82);opacity:0}15%{opacity:.42}50%{transform:translate3d(6rem,-1.5rem,0) rotate(-26deg) scaleX(1);opacity:.52}100%{transform:translate3d(16rem,-4rem,0) rotate(-26deg) scaleX(1.06);opacity:0}}
.ptc-f{position:absolute;inset:0;pointer-events:none;transform:translate3d(calc(var(--sx)*.14),calc(var(--sy)*.14),0)}.ptc{position:absolute;border-radius:9999px;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(103,232,249,.7) 55%,transparent 72%);box-shadow:0 0 20px rgba(103,232,249,.35);animation:ptcR linear infinite}@keyframes ptcR{0%{transform:translate3d(0,20px,0) scale(.7);opacity:0}20%{opacity:.75}50%{transform:translate3d(22px,-46px,0) scale(1);opacity:.5}80%{opacity:.25}100%{transform:translate3d(-16px,-118px,0) scale(.65);opacity:0}}
.trace{--bp:0;position:fixed;top:0;bottom:0;right:max(-2.4rem,calc((100vw - 72rem)/2 - 2.4rem));width:1.6rem;pointer-events:none;z-index:5}.trace-rail{position:absolute;top:0;bottom:0;left:50%;width:1px;transform:translateX(-50%);background:linear-gradient(180deg,rgba(34,211,238,.03),rgba(125,211,252,.18),rgba(59,130,246,.06))}.trace-glow{position:absolute;left:50%;top:calc(var(--bp)*(100% - 6rem));width:.42rem;height:6rem;transform:translateX(-50%);border-radius:9999px;background:linear-gradient(180deg,transparent,rgba(103,232,249,.72) 28%,rgba(59,130,246,.52) 68%,transparent);box-shadow:0 0 10px rgba(103,232,249,.2)}
.panel{position:relative;overflow:hidden;border-radius:0;border:none;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:none;background:rgba(8,14,36,.35);border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07)}.panel::before{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.03),transparent 40%,rgba(255,255,255,.015))}.panel-blue{background:rgba(8,14,36,.35)}.panel-cyan{background:rgba(8,14,36,.35)}
.section-divider{width:100%;height:1px;background:linear-gradient(90deg,transparent,rgba(103,232,249,.3) 15%,rgba(167,139,250,.25) 35%,rgba(52,211,153,.2) 55%,rgba(251,146,60,.15) 75%,rgba(103,232,249,.3) 85%,transparent);margin:0;position:relative}.section-divider::after{content:"";position:absolute;inset:-4px 10% -4px 10%;background:linear-gradient(90deg,transparent,rgba(103,232,249,.1) 30%,rgba(167,139,250,.08) 50%,rgba(103,232,249,.1) 70%,transparent);filter:blur(6px);pointer-events:none}
.stat-item{position:relative;display:flex;flex-direction:column;gap:.5rem;overflow:hidden;border:1px solid rgba(103,232,249,.12);border-radius:1.25rem;padding:1.2rem;background:linear-gradient(180deg,rgba(10,18,42,.6),rgba(8,14,36,.5));box-shadow:0 0 20px rgba(34,211,238,.05),inset 0 1px 0 rgba(255,255,255,.05);transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease}.stat-item:hover{border-color:rgba(103,232,249,.3);box-shadow:0 0 30px rgba(34,211,238,.12);transform:translateY(-4px)}.stat-item::before{content:"";position:absolute;inset:-20%;background:radial-gradient(circle at 50% 55%,rgba(34,211,238,.12),transparent 34%),radial-gradient(circle at 62% 42%,rgba(139,92,246,.08),transparent 42%);filter:blur(22px);opacity:.85;pointer-events:none}
.focus-card{position:relative;overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 16px 44px rgba(8,145,178,.12)}.focus-card::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(34,211,238,.55),rgba(59,130,246,.18),rgba(34,211,238,.42));-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}.focus-card::after{content:"";position:absolute;inset:-22%;background:radial-gradient(circle at 50% 48%,rgba(34,211,238,.18),transparent 38%);filter:blur(26px);opacity:.92;pointer-events:none}.focus-card>*{position:relative;z-index:1}
.game-card{transition:transform 220ms ease,border-color 220ms ease,box-shadow 220ms ease}.game-card:hover{transform:translateY(-10px);border-color:rgba(103,232,249,.3);box-shadow:0 0 30px rgba(34,211,238,.12),0 24px 70px rgba(99,102,241,.1)}.game-thumb{transition:transform 320ms ease,filter 320ms ease}.game-card:hover .game-thumb{transform:scale(1.05);filter:saturate(1.05) brightness(1.04)}.game-overlay{background:linear-gradient(180deg,rgba(8,14,36,.02),rgba(8,14,36,.65))}
.badge-dot{animation:dotP 2s ease-in-out infinite}@keyframes dotP{0%,100%{box-shadow:0 0 0 0 rgba(103,232,249,.6)}50%{box-shadow:0 0 0 6px rgba(103,232,249,0)}}
.nav-a{color:rgb(103,232,249);background:rgba(103,232,249,.08);border:1px solid rgba(103,232,249,.2)}
.top-btn{position:fixed;bottom:2rem;right:2rem;z-index:35;width:3rem;height:3rem;display:flex;align-items:center;justify-content:center;border-radius:1rem;border:1px solid rgba(103,232,249,.25);background:rgba(2,6,23,.8);backdrop-filter:blur(12px);color:rgb(103,232,249);cursor:pointer;opacity:0;transform:translateY(1rem);transition:opacity 300ms ease,transform 300ms ease,background 200ms ease;pointer-events:none}.top-btn.vis{opacity:1;transform:translateY(0);pointer-events:auto}.top-btn:hover{background:rgba(103,232,249,.12);box-shadow:0 8px 32px rgba(34,211,238,.2)}
.scroll-bar{position:fixed;top:0;left:0;height:3px;z-index:100;background:linear-gradient(90deg,#22d3ee,#818cf8,#f472b6,#fb923c,#34d399,#22d3ee);background-size:400% 100%;animation:gShift 6s ease-in-out infinite;transform-origin:left;box-shadow:0 0 12px rgba(34,211,238,.4),0 0 24px rgba(139,92,246,.2)}
.lift{transition:transform 220ms ease,border-color 220ms ease,box-shadow 220ms ease,background 220ms ease}.lift:hover{transform:translateY(-4px) scale(1.03);box-shadow:0 0 20px rgba(34,211,238,.12),0 18px 40px rgba(99,102,241,.1)}
@media(max-width:900px){.trace{display:none}}
@media(prefers-reduced-motion:reduce){.reveal,.reveal-left,.reveal-right,.reveal-scale{opacity:1;transform:none;transition:none}.ptc,.bm,.ring-el,.orb,.wave,.aurora-band,.diag-band,.mesh-blob,.star,.fp{animation:none}.cur-core,.cur-light,.cur-soft,.grid-bg,.ptc-f,.beam-f{transform:none}.grad-text,.tw-cursor,.badge-dot{animation:none}.cc-inner{transition:none}}
  `}</style>
  <div ref={pageRef} className="shell" style={{minHeight:"100vh",overflow:"hidden"}}>
    <div className="diag-bands"><div className="diag-band"/><div className="diag-band"/><div className="diag-band"/><div className="diag-band"/></div>
    <div className="color-mesh"><div className="mesh-blob"/><div className="mesh-blob"/><div className="mesh-blob"/><div className="mesh-blob"/></div>
    <div className="shooting-stars"><div className="star"/><div className="star"/><div className="star"/><div className="star"/><div className="star"/><div className="star"/></div>
    <div className="float-particles">{Array.from({length:12},(_,i)=><div key={i} className="fp" style={{width:3+Math.random()*4,height:3+Math.random()*4,left:`${5+Math.random()*90}%`,animationDuration:`${8+Math.random()*12}s`,animationDelay:`${-Math.random()*20}s`}}/>)}</div>
    <div className="scroll-bar" style={{transform:`scaleX(${progress})`}}/>
    <div className="backdrop" style={{position:"absolute",inset:0,zIndex:-1,overflow:"hidden"}}>
      <div className="cur-core"/><div className="cur-light"/><div className="cur-soft"/><div className="vignette"/><div className="grid-bg"/>
      <div className="aurora"><div className="aurora-band"/><div className="aurora-band"/><div className="aurora-band"/></div>
      <div className="wave" style={{bottom:"18%",left:"-12%",width:"38rem",height:"14rem",background:"linear-gradient(90deg,rgba(34,211,238,.22),rgba(37,99,235,.06))",animationDuration:"20s"}}/>
      <div className="wave" style={{top:"14%",right:"-10%",width:"32rem",height:"12rem",background:"linear-gradient(90deg,rgba(59,130,246,.08),rgba(34,211,238,.22))",animationDuration:"24s",animationDelay:"-8s"}}/>
      <div className="ring-el" style={{width:"30rem",height:"30rem",left:"-8rem",top:"8rem",animationDuration:"14s"}}/>
      <div className="ring-el" style={{width:"26rem",height:"26rem",right:"6%",top:"4rem",animationDuration:"16s",animationDelay:"-6s"}}/>
      <div className="orb" style={{width:"18rem",height:"18rem",left:"-4rem",top:"18rem",background:"rgba(34,211,238,.18)",animationDuration:"18s"}}/>
      <div className="orb" style={{width:"20rem",height:"20rem",right:"-4rem",top:"8rem",background:"rgba(99,102,241,.16)",animationDuration:"20s",animationDelay:"-6s"}}/>
      <div className="beam-f">{beamLines.map((b,i)=><span key={i} className="bm" style={{left:b.left,top:b.top,width:b.width,animationDuration:b.duration,animationDelay:b.delay}}/>)}</div>
      <div className="ptc-f">{particles.map((p,i)=><span key={i} className="ptc" style={{width:p.size,height:p.size,left:p.left,top:p.top,animationDuration:p.duration,animationDelay:p.delay}}/>)}</div>
    </div>
    <div ref={beamRef} className="trace"><span className="trace-rail"/><span className="trace-glow"/></div>
    <header style={{position:"sticky",top:0,zIndex:30,borderBottom:"1px solid rgba(255,255,255,.1)",background:"rgba(8,14,36,.45)",backdropFilter:"blur(24px)"}}>
      <div style={{maxWidth:"80rem",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 5vw"}}>
        <a href="#home" style={{display:"flex",alignItems:"center",gap:".75rem",textDecoration:"none",color:"inherit"}}>
          <div style={{width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"1rem",background:"linear-gradient(135deg,#67e8f9,#818cf8,#a78bfa)",fontSize:14,fontWeight:900,color:"#020617",boxShadow:"0 0 20px rgba(103,232,249,.4),0 8px 24px rgba(99,102,241,.3)"}}>CA</div>
          <div><p style={{fontSize:14,fontWeight:600,letterSpacing:".04em"}}>Caden Arabic</p><p style={{fontSize:12,color:"rgba(148,163,184,.9)",...mono}}>Roblox scripter</p></div>
        </a>
        <nav style={{display:"flex",alignItems:"center",gap:8}}>
          {navSections.map(s=><a key={s} href={`#${s}`} className={`lift ${active===s?"nav-a":""}`} style={{borderRadius:9999,padding:".55rem .9rem",fontSize:14,color:active===s?"rgb(103,232,249)":"rgba(203,213,225,.9)",textDecoration:"none"}}>{s==="stats"?"Live Stats":s.charAt(0).toUpperCase()+s.slice(1)}</a>)}
        </nav>
      </div>
    </header>
    <main id="home" style={{paddingBottom:48}}>
      <div style={{margin:"0 auto",padding:"0",position:"relative",zIndex:1}}>
        <section style={{paddingTop:64,paddingBottom:24}}>
          <div className="panel panel-blue" style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:40,padding:"3rem 5vw",alignItems:"center",maxWidth:"80rem",margin:"0 auto"}}>
            <div style={{display:"flex",flexDirection:"column",gap:32}}>
              <div className="reveal" style={{display:"inline-flex",alignItems:"center",gap:8,borderRadius:9999,border:"1px solid rgba(103,232,249,.2)",background:"rgba(103,232,249,.1)",padding:".5rem 1rem",fontSize:14,color:"rgba(207,250,254,.9)",width:"fit-content",boxShadow:"0 0 40px rgba(34,211,238,.12)"}}><span className="badge-dot" style={{width:8,height:8,borderRadius:9999,background:"#67e8f9"}}/>Roblox scripter</div>
              <h1 style={{fontSize:"clamp(2rem,5vw,3.5rem)",fontWeight:900,letterSpacing:"-.02em",lineHeight:1.1}}>Caden Arabic<br/><span className="grad-text">{displayed}{!done&&<span className="tw-cursor"/>}</span></h1>
              <div className="reveal s2" style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                <a href="#stats" className="lift" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"1rem",background:"linear-gradient(135deg,#67e8f9,#818cf8)",padding:".75rem 1.5rem",fontSize:14,fontWeight:600,color:"#020617",textDecoration:"none",boxShadow:"0 0 20px rgba(103,232,249,.3),0 8px 24px rgba(99,102,241,.2)"}}>View Live Stats</a>
                <a href="#games" className="lift" style={{display:"inline-flex",alignItems:"center",justifyContent:"center",borderRadius:"1rem",border:"1px solid rgba(255,255,255,.15)",background:"rgba(255,255,255,.05)",padding:".75rem 1.5rem",fontSize:14,fontWeight:600,color:"#fff",textDecoration:"none"}}>Games Worked On</a>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:12}}>{skillPills.map((s,i)=><span key={s} className={`reveal lift s${i+1}`} style={{borderRadius:9999,border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.06)",padding:".5rem 1rem",fontSize:14,color:"rgba(241,245,249,.9)"}}>{s}</span>)}</div>
            </div>
            <div className="reveal-right" style={{borderRadius:"1.75rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(10,18,42,.55)",padding:24,boxShadow:"0 24px 60px rgba(8,145,178,.12)",backdropFilter:"blur(24px)"}}>
              <div style={{marginBottom:24}}><p style={{fontSize:14,color:"rgba(148,163,184,.9)",...mono}}>Portfolio Snapshot</p><h2 style={{marginTop:8,fontSize:24,fontWeight:700}} className="glow-title">Caden Arabic</h2></div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
                <div className="reveal-scale s1" style={{borderRadius:"1rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.05)",padding:16}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".2em",color:"rgba(148,163,184,.9)",...mono}}>Experience</p><p style={{marginTop:12,fontSize:24,fontWeight:900}}>4+ Years</p></div>
                <div className="reveal-scale s2" style={{borderRadius:"1rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.05)",padding:16}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".2em",color:"rgba(148,163,184,.9)",...mono}}>Projects</p><p style={{marginTop:12,fontSize:24,fontWeight:900}}>{gwLabel}</p></div>
                <div className="reveal-scale s3 focus-card" style={{borderRadius:"1rem",border:"1px solid rgba(103,232,249,.2)",background:"rgba(34,211,238,.05)",padding:20,minHeight:"7.75rem"}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".18em",color:"rgba(203,213,225,.9)",...mono}}>Focus</p><p style={{marginTop:12,fontSize:18,fontWeight:900,lineHeight:1.2,maxWidth:"10ch"}}>Brainrots Games</p></div>
              </div>
            </div>
          </div>
        </section>
        <div className="section-divider"/>
        <section id="about" style={{padding:"48px 0"}}><div className="panel panel-cyan" style={{padding:"3rem 5vw",maxWidth:"80rem",margin:"0 auto"}}><p className="reveal" style={{fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(207,250,254,.9)",...mono}} className="glow-label">About</p><h2 className="reveal s1" style={{marginTop:16,fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:700}} className="glow-title">Caden Arabic</h2><p className="reveal s2" style={{marginTop:20,maxWidth:"48rem",fontSize:18,lineHeight:1.8,color:"rgba(241,245,249,.9)"}}>Roblox experienced scripter with 4+ years of experience.</p></div></section>
        <div className="section-divider"/>
        <section id="stats" style={{padding:"48px 0"}}><div className="panel panel-blue" style={{padding:"3rem 5vw",maxWidth:"80rem",margin:"0 auto"}}><div style={{marginBottom:32}}><p className="reveal" style={{fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(207,250,254,.9)",...mono}} className="glow-label">Live Stats</p><div className="live-pulse reveal s1"><span className="live-pulse-dot"/>LIVE DATA</div><h2 className="reveal s1" style={{marginTop:12,fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:700}} className="glow-title">Real-time totals across my Roblox work</h2></div><div className="reveal s2" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.5rem",borderTop:"1px solid rgba(255,255,255,.14)",borderBottom:"1px solid rgba(255,255,255,.14)",padding:"1.3rem 0"}}>{[{label:"Total Visits",val:tv,fb:tvFb},{label:"Active Players",val:ap,fb:apFb},{label:"Games Worked On",val:stats.tracked,fb:gwLabel}].map(s=><div key={s.label} className="stat-item"><p style={{position:"relative",zIndex:1,fontSize:".8rem",fontWeight:700,letterSpacing:".18em",textTransform:"uppercase",color:"rgba(226,232,240,.76)",...mono}}>{s.label} :</p><div style={{position:"relative",zIndex:1,fontSize:"clamp(1.6rem,3vw,2.8rem)",fontWeight:900,lineHeight:1,color:"#fff"}}><AnimatedCounter value={s.val} fallback={s.fb}/></div></div>)}</div></div></section>
        <div className="section-divider"/>
        <section id="services" style={{padding:"48px 0"}}><div className="panel panel-cyan" style={{padding:"3rem 5vw",maxWidth:"80rem",margin:"0 auto"}}><div style={{marginBottom:32}}><p className="reveal" style={{fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(165,243,252,.9)",...mono}} className="glow-label">Services</p><h2 className="reveal s1" style={{marginTop:12,fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:700}} className="glow-title">What I can script for Roblox games</h2></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>{services.map((svc,i)=><CometCard key={svc.title} className={`reveal-scale s${i+1}`}><article style={{height:"100%",borderRadius:"1.5rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(10,18,42,.45)",padding:24}}><div style={{marginBottom:20,width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:"1rem",border:"1px solid rgba(165,243,252,.2)",background:"rgba(103,232,249,.1)",color:"rgba(207,250,254,.9)",boxShadow:"0 0 30px rgba(34,211,238,.14)"}}><ServiceIcon type={svc.icon}/></div><h3 style={{fontSize:20,fontWeight:600}}>{svc.title}</h3><p style={{marginTop:12,lineHeight:1.75,color:"rgba(203,213,225,.9)"}}>{svc.description}</p></article></CometCard>)}</div></div></section>
        <div className="section-divider"/>
        <section id="games" style={{padding:"48px 0"}}><div className="panel panel-blue" style={{padding:"3rem 5vw",maxWidth:"80rem",margin:"0 auto"}}><div style={{marginBottom:32}}><p className="reveal" style={{fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(165,243,252,.9)",...mono}} className="glow-label">Games Worked On</p><h2 className="reveal s1" style={{marginTop:12,fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:700}} className="glow-title">Tracked Roblox experiences</h2></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>{stats.games.map((g,i)=><CometCard key={g.placeId} className={`reveal-scale s${Math.min(i+1,10)}`}><article className="game-card" style={{height:"100%",overflow:"hidden",borderRadius:"1.5rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(10,18,42,.55)",backdropFilter:"blur(8px)"}}><div style={{position:"relative",height:208,overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,.1)",background:"#0d1a2f"}}>{g.thumbnailUrl?<img src={g.thumbnailUrl} alt={g.title} className="game-thumb" style={{width:"100%",height:"100%",objectFit:"cover"}} loading="lazy"/>:<div className="game-thumb" style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(to bottom right,rgba(6,182,212,.2),#0f172a,rgba(59,130,246,.2))"}}><div style={{textAlign:"center"}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(207,250,254,.8)",...mono}}>Roblox Game</p><p style={{marginTop:12,fontSize:28,fontWeight:900}}>{String(i+1).padStart(2,"0")}</p></div></div>}<div className="game-overlay" style={{position:"absolute",inset:0}}/><div style={{position:"absolute",left:16,top:16,borderRadius:9999,border:"1px solid rgba(255,255,255,.15)",background:"rgba(10,18,42,.55)",padding:"4px 12px",fontSize:12,fontWeight:500,color:"rgba(255,255,255,.9)",backdropFilter:"blur(12px)",...mono}}>Roblox Experience</div></div><div style={{padding:24,display:"flex",flexDirection:"column",gap:20}}><div style={{display:"flex",justifyContent:"space-between",gap:16}}><div><h3 style={{fontSize:22,fontWeight:700}}>{g.title}</h3><p style={{marginTop:8,fontSize:13,color:"rgba(148,163,184,.9)",...mono}}>Place ID: {g.placeId}</p></div><span style={{fontSize:36,fontWeight:900,color:"rgba(255,255,255,.1)"}}>{String(i+1).padStart(2,"0")}</span></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div style={{borderRadius:"1rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.05)",padding:16}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".2em",color:"rgba(148,163,184,.9)",...mono}}>Active Players</p><p style={{marginTop:8,fontSize:20,fontWeight:600}}>{g.playing!==null?fmt.format(g.playing):"Syncing"}</p></div><div style={{borderRadius:"1rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(255,255,255,.05)",padding:16}}><p style={{fontSize:11,textTransform:"uppercase",letterSpacing:".2em",color:"rgba(148,163,184,.9)",...mono}}>Visits</p><p style={{marginTop:8,fontSize:20,fontWeight:600}}>{g.visits!==null?fmt.format(g.visits):"Syncing"}</p></div></div><a href={g.url} target="_blank" rel="noreferrer" className="lift" style={{display:"inline-flex",alignItems:"center",gap:8,borderRadius:"1rem",border:"1px solid rgba(103,232,249,.25)",background:"rgba(103,232,249,.1)",padding:".75rem 1.25rem",fontSize:14,fontWeight:600,color:"rgba(207,250,254,.9)",textDecoration:"none",width:"fit-content"}}>Open game page<svg viewBox="0 0 24 24" fill="none" style={{width:16,height:16}} stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7"/><path d="M9 7h8v8"/></svg></a></div></article></CometCard>)}</div></div></section>
        <div className="section-divider"/>
        <section id="contact" style={{padding:"48px 0"}}><div className="panel panel-cyan" style={{padding:"3rem 5vw",maxWidth:"80rem",margin:"0 auto"}}><p className="reveal" style={{fontSize:14,fontWeight:600,textTransform:"uppercase",letterSpacing:".25em",color:"rgba(207,250,254,.9)",...mono}} className="glow-label">Contact</p><h2 className="reveal s1" style={{marginTop:16,fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:700}} className="glow-title">Let's connect</h2><div style={{marginTop:32,display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>{[{label:"Twitter (X)",value:"@Caden__Pro",sub:"x.com/Caden__Pro",href:"https://x.com/Caden__Pro"},{label:"Discord",value:"caden._.arabic",sub:"Add me on Discord",href:null},{label:"Roblox",value:"Profile",sub:"roblox.com/users/867951875/profile",href:"https://www.roblox.com/users/867951875/profile"}].map((c,i)=>{const inner=<><p style={{fontSize:13,textTransform:"uppercase",letterSpacing:".2em",color:"rgba(148,163,184,.9)",...mono}}>{c.label}</p><p style={{marginTop:12,fontSize:20,fontWeight:700}}>{c.value}</p><p style={{marginTop:8,fontSize:14,color:"rgba(203,213,225,.9)"}}>{c.sub}</p></>;const style={borderRadius:"1.5rem",border:"1px solid rgba(255,255,255,.1)",background:"rgba(10,18,42,.45)",padding:24,textDecoration:"none",color:"inherit"};return c.href?<a key={c.label} href={c.href} target="_blank" rel="noreferrer" className={`reveal-scale s${i+1} lift`} style={style}>{inner}</a>:<div key={c.label} className={`reveal-scale s${i+1}`} style={style}>{inner}</div>;})}</div></div></section>
      </div>
    </main>
    <div className="section-divider"/>
    <footer style={{borderTop:"1px solid rgba(255,255,255,.1)",padding:"2rem 1.5rem",textAlign:"center",fontSize:14,color:"rgba(148,163,184,.9)",...mono,background:"rgba(8,14,36,.4)",backdropFilter:"blur(16px)"}}>Caden Arabic • Roblox scripter • Live totals for visits, active players, and games worked on.</footer>
    <button className={`top-btn ${showBtn?"vis":""}`} onClick={scrollTop} aria-label="Scroll to top"><svg viewBox="0 0 24 24" fill="none" style={{width:20,height:20}} stroke="currentColor" strokeWidth="2.5"><path d="M18 15l-6-6-6 6"/></svg></button>
  </div></>);
}
