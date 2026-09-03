import React, { useEffect, useRef, useState, useCallback } from "react";
import { Coffee, ArrowRight, Instagram, Facebook, Twitter, Phone, Mail, Globe } from "lucide-react";

/* ============================================================
   TOKENS
   ============================================================ */
const C = {
  cream: "#F4EEE2",
  creamSoft: "#EDE5D3",
  espresso: "#170F0A",
  espresso2: "#241609",
  bark: "#3C2A1C",
  clay: "#A9713F",
  clayLight: "#C79357",
  sand: "#D8C6AA",
  stone: "#8B7E6E",
  ceramic: "#F1E7D6",
};

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap');`;

/* ============================================================
   MATH HELPERS
   ============================================================ */
const clamp = (v, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t); // smoothstep
const seg = (p, s, e) => (e === s ? (p >= e ? 1 : 0) : smooth(clamp((p - s) / (e - s))));

// crossfade opacity for a window with soft in/out edges
function fadeWindow(p, inStart, inEnd, outStart, outEnd) {
  const rise = seg(p, inStart, inEnd);
  const fall = 1 - seg(p, outStart, outEnd);
  return clamp(Math.min(rise, fall));
}

/* ============================================================
   SCENE WINDOWS  (0 -> 1 across the whole pinned story)
   ============================================================ */
const WIN = {
  s1: { inS: 0, inE: 0.02, outS: 0.2, outE: 0.3 },
  s2: { inS: 0.2, inE: 0.3, outS: 0.46, outE: 0.56 },
  s3: { inS: 0.46, inE: 0.56, outS: 0.72, outE: 0.82 },
  s4: { inS: 0.72, inE: 0.82, outS: 1, outE: 1 },
};

/* ============================================================
   ART — shared bits
   ============================================================ */
function Vignette({ id, from, to }) {
  return (
    <radialGradient id={id} cx="52%" cy="38%" r="75%">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </radialGradient>
  );
}

/* Steam wisp path, animated via strokeDashoffset + opacity based on local progress t (0..1) */
function Steam({ x, delay = 0, t, height = 220, color = "#F4EEE2" }) {
  const o = clamp((t - delay) / (1 - delay)) * 0.55;
  const rise = clamp((t - delay) / (1 - delay));
  return (
    <path
      d={`M ${x} ${520} C ${x - 26} ${520 - height * 0.3}, ${x + 26} ${520 - height * 0.55}, ${x} ${520 - height * 0.8} C ${x - 20} ${520 - height}, ${x + 18} ${520 - height * 1.15}, ${x} ${520 - height * 1.3}`}
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
      opacity={o}
      style={{
        transform: `translateY(${(1 - rise) * 40}px)`,
        filter: "blur(1.5px)",
      }}
    />
  );
}

/* ---------- SCENE 1 : BEANS ---------- */
const BEAN_LAYOUT = Array.from({ length: 46 }).map((_, i) => {
  // deterministic pseudo-random spread
  const a = (i * 137.5) % 360;
  const r = 40 + ((i * 53) % 340);
  const cx = 400 + Math.cos((a * Math.PI) / 180) * r * 0.85;
  const cy = 560 + Math.sin((a * Math.PI) / 180) * r * 0.42;
  const rot = (i * 47) % 180;
  const scale = 0.55 + ((i * 19) % 60) / 100;
  const tone = i % 3 === 0 ? "#5B3A22" : i % 3 === 1 ? "#7A4A26" : "#3F2717";
  return { cx, cy, rot, scale, tone, fly: i % 7 === 0 };
});

function Bean({ x, y, rot, scale, tone }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="26" ry="17" fill={tone} />
      <path d="M -22 0 Q 0 -9 22 0 Q 0 9 -22 0 Z" fill="none" stroke="#170F0A" strokeWidth="1.6" opacity="0.5" />
      <ellipse cx="-7" cy="-6" rx="6" ry="3" fill="#B8895A" opacity="0.35" />
    </g>
  );
}

function SceneBeans({ t }) {
  const zoom = 1 + t * 0.1;
  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
      <defs>
        <Vignette id="v1" from="#3B2312" to="#150D08" />
      </defs>
      <rect width="800" height="1000" fill="url(#v1)" />
      {/* rim light streak */}
      <g opacity={0.5 + t * 0.15}>
        <ellipse cx="600" cy="230" rx="360" ry="220" fill={C.clay} opacity="0.16" />
      </g>
      <g style={{ transform: `scale(${zoom}) translateY(${-t * 30}px)`, transformOrigin: "50% 60%" }}>
        {BEAN_LAYOUT.map((b, i) => (
          <Bean
            key={i}
            x={b.cx}
            y={b.fly ? b.cy - t * 90 * (1 + (i % 3)) : b.cy + t * 14}
            rot={b.rot + (b.fly ? t * 40 : 0)}
            scale={b.scale}
            tone={b.tone}
          />
        ))}
      </g>
      <rect width="800" height="1000" fill="url(#v1)" opacity="0.18" />
    </svg>
  );
}

/* ---------- SCENE 2 : BREWING ---------- */
function SceneBrewing({ t }) {
  const pour = clamp(t * 1.6); // stream growth
  const splash = clamp((t - 0.35) * 1.8);
  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
      <defs>
        <Vignette id="v2" from="#4A2E14" to="#180F09" />
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE2CB" />
          <stop offset="100%" stopColor="#C9B48C" />
        </linearGradient>
        <linearGradient id="mug2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A1B10" />
          <stop offset="100%" stopColor="#100A06" />
        </linearGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#v2)" />
      <ellipse cx="420" cy="300" rx="300" ry="180" fill={C.clayLight} opacity={0.14 + t * 0.08} />

      {/* dripper cone */}
      <g style={{ transform: `translateY(${-t * 18}px)` }}>
        <path d="M 330 330 L 470 330 L 430 430 L 370 430 Z" fill="url(#cone)" stroke="#8A6A3E" strokeWidth="2" />
        <rect x="300" y="316" width="200" height="18" rx="4" fill="#E7D9BC" stroke="#8A6A3E" strokeWidth="1.5" />
      </g>

      {/* stream */}
      <path
        d="M 400 430 C 398 480 404 520 400 560"
        stroke="#6B3F1D"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        opacity={pour}
      />

      {/* mug */}
      <g style={{ transform: `scale(${1 + t * 0.08})`, transformOrigin: "50% 85%" }}>
        <path d="M 320 560 L 480 560 L 462 700 Q 400 720 338 700 Z" fill="url(#mug2)" stroke="#0B0705" strokeWidth="2" />
        <path d="M 462 585 Q 510 585 508 630 Q 505 665 460 662" fill="none" stroke="#160D08" strokeWidth="10" opacity="0.9" />
        <ellipse cx="400" cy="560" rx="80" ry="14" fill="#4A2C14" />
      </g>

      {/* splash droplets */}
      {Array.from({ length: 10 }).map((_, i) => {
        const ang = (i / 10) * Math.PI * 2;
        const dist = 18 + splash * 46;
        return (
          <circle
            key={i}
            cx={400 + Math.cos(ang) * dist}
            cy={558 + Math.sin(ang) * dist * 0.4}
            r={3.5 - i % 3}
            fill="#C79357"
            opacity={clamp(splash * 1.4) * (1 - splash * 0.5)}
          />
        );
      })}

      <Steam x={400} t={t} delay={0.3} height={200} />
      <Steam x={370} t={t} delay={0.45} height={160} />
      <rect width="800" height="1000" fill="url(#v2)" opacity="0.16" />
    </svg>
  );
}

/* ---------- SCENE 3 / 4 : FINISHED CUP ---------- */
function SceneCup({ t, closeUp = false }) {
  const scale = (closeUp ? 1.18 : 1) + t * (closeUp ? 0.08 : 0.06);
  return (
    <svg viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice" style={{ width: "100%", height: "100%" }}>
      <defs>
        <Vignette id="v3" from="#33210F" to="#0F0A07" />
        <linearGradient id="cup3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.ceramic} />
          <stop offset="100%" stopColor="#CBB98F" />
        </linearGradient>
        <radialGradient id="crema" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#E8C793" />
          <stop offset="60%" stopColor="#B67F3E" />
          <stop offset="100%" stopColor="#7A4E22" />
        </radialGradient>
      </defs>
      <rect width="800" height="1000" fill="url(#v3)" />
      <ellipse cx="400" cy="380" rx="320" ry="260" fill={C.clayLight} opacity="0.15" />

      <g style={{ transform: `scale(${scale}) translateY(${closeUp ? -t * 20 : 0}px)`, transformOrigin: "50% 55%" }}>
        {/* saucer */}
        <ellipse cx="400" cy="700" rx="190" ry="26" fill="#241609" opacity="0.7" />
        {/* cup body */}
        <path d="M 300 470 L 500 470 L 480 640 Q 400 662 320 640 Z" fill="url(#cup3)" stroke="#8A6A3E" strokeWidth="2" />
        {/* handle */}
        <path d="M 480 500 Q 540 505 536 555 Q 532 596 478 592" fill="none" stroke="#8A6A3E" strokeWidth="9" />
        {/* crema surface */}
        <ellipse cx="400" cy="470" rx="100" ry="22" fill="url(#crema)" />
        {/* rosette swirl */}
        <path
          d="M 400 462 C 380 452 372 468 388 474 C 366 470 358 486 378 490 C 358 492 352 508 374 508"
          fill="none"
          stroke="#F2E2C0"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </g>

      <Steam x={400} t={t} delay={0.05} height={240} />
      <Steam x={430} t={t} delay={0.22} height={190} />
      <rect width="800" height="1000" fill="url(#v3)" opacity="0.14" />
    </svg>
  );
}

/* ============================================================
   CAPTION DATA
   ============================================================ */
const SCENES = [
  { n: "01", title: "Mulai dari Biji", desc: "Setiap cangkir dimulai dari pilihan biji terbaik, dipetik pada puncak kematangannya." },
  { n: "02", title: "Keajaiban Ekstraksi", desc: "Air panas bertemu bubuk kopi, melepaskan aroma yang tersimpan di dalamnya." },
  { n: "03", title: "Akhir yang Sempurna", desc: "Diseduh dengan presisi, disajikan dengan perhatian pada setiap detail." },
  { n: "04", title: "Temukan Rasa Anda", desc: "Kopi terbaik, kini di tangan Anda." },
];

/* ============================================================
   MAIN APP
   ============================================================ */
export default function CoffeeLanding() {
  const [loaded, setLoaded] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [progress, setProgress] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const [reduced, setReduced] = useState(false);

  const storyRef = useRef(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef(null);

  // preloader
  useEffect(() => {
    let p = 0;
    const iv = setInterval(() => {
      p += 6 + Math.random() * 10;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setTimeout(() => setLoaded(true), 350);
      }
      setLoadPct(Math.round(p));
    }, 90);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  const readTarget = useCallback(() => {
    const el = storyRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    targetRef.current = clamp(total > 0 ? scrolled / total : 0);
    setNavSolid(window.scrollY > 40);
  }, []);

  useEffect(() => {
    const onScroll = () => readTarget();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    readTarget();

    const loop = () => {
      const ease = reduced ? 1 : 0.11;
      currentRef.current = lerp(currentRef.current, targetRef.current, ease);
      if (Math.abs(currentRef.current - targetRef.current) < 0.0004) {
        currentRef.current = targetRef.current;
      }
      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [readTarget, reduced]);

  const p = progress;

  const o1 = fadeWindow(p, WIN.s1.inS, WIN.s1.inE, WIN.s1.outS, WIN.s1.outE);
  const o2 = fadeWindow(p, WIN.s2.inS, WIN.s2.inE, WIN.s2.outS, WIN.s2.outE);
  const o3 = fadeWindow(p, WIN.s3.inS, WIN.s3.inE, WIN.s3.outS, WIN.s3.outE);
  const o4 = fadeWindow(p, WIN.s4.inS, WIN.s4.inE, WIN.s4.outS, WIN.s4.outE);

  const t1 = seg(p, WIN.s1.inS, WIN.s1.outE);
  const t2 = seg(p, WIN.s2.inS, WIN.s2.outE);
  const t3 = seg(p, WIN.s3.inS, WIN.s3.outE);
  const t4 = seg(p, WIN.s4.inS, 1);

  const blur = (o) => (o > 0.02 && o < 0.98 ? 4 * (1 - Math.abs(o * 2 - 1)) : 0);

  const activeIdx = p < WIN.s1.outS ? 0 : p < WIN.s2.outS ? 1 : p < WIN.s3.outS ? 2 : 3;
  const headlineOpacity = 1 - seg(p, 0, 0.16);
  const cueOpacity = 1 - seg(p, 0, 0.06);
  const ctaOpacity = seg(p, 0.78, 0.9);
  const activeScene = SCENES[activeIdx];

  return (
    <div style={{ background: C.cream, minHeight: "100vh", color: C.espresso, position: "relative" }}>
      <style>{`
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        .serif { font-family: 'Fraunces', serif; }
        .sans { font-family: 'Manrope', sans-serif; }
        a, button { cursor: pointer; }
        ::selection { background: ${C.clay}; color: ${C.cream}; }
      `}</style>

      {/* ---------------- PRELOADER ---------------- */}
      <div
        className="sans"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 200,
          background: C.espresso,
          color: C.sand,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          transition: "opacity 0.6s ease, visibility 0.6s ease",
          opacity: loaded ? 0 : 1,
          visibility: loaded ? "hidden" : "visible",
          pointerEvents: loaded ? "none" : "auto",
        }}
      >
        <Coffee size={26} color={C.clayLight} strokeWidth={1.5} />
        <div style={{ fontSize: 12, letterSpacing: "0.18em", fontWeight: 600 }}>ROASTING YOUR EXPERIENCE...</div>
        <div style={{ width: 220, height: 2, background: "rgba(216,198,170,0.2)", overflow: "hidden" }}>
          <div style={{ width: `${loadPct}%`, height: "100%", background: C.clayLight, transition: "width 0.15s linear" }} />
        </div>
        <div style={{ fontSize: 11, color: C.stone }}>{loadPct}%</div>
      </div>

      {/* ---------------- NAVBAR ---------------- */}
      <nav
        className="sans"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px clamp(20px, 5vw, 56px)",
          background: navSolid ? "rgba(244,238,226,0.86)" : "transparent",
          backdropFilter: navSolid ? "blur(10px)" : "none",
          borderBottom: navSolid ? `1px solid rgba(60,42,28,0.12)` : "1px solid transparent",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, letterSpacing: "0.02em" }}>
          <Coffee size={18} color={C.clay} strokeWidth={1.8} />
          <span className="serif" style={{ fontSize: 18 }}>Ruang Kopi</span>
        </div>
        <div style={{ display: "flex", gap: "clamp(14px, 3vw, 32px)", fontSize: 13.5 }} className="nav-links">
          {["Beranda", "Koleksi", "Proses", "Tentang", "Keranjang"].map((item) => (
            <span key={item} style={{ opacity: navSolid ? 0.85 : 0.95, color: navSolid ? C.bark : C.cream, transition: "color 0.4s ease" }}>
              {item}
            </span>
          ))}
        </div>
      </nav>

      {/* ---------------- INTRO SPACER (top of story, headline lives inside stage) ---------------- */}

      {/* ---------------- PINNED SCROLL STORY ---------------- */}
      <section ref={storyRef} style={{ position: "relative", height: "420vh" }}>
        <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: C.espresso }}>
          {/* layered scenes */}
          <div style={{ position: "absolute", inset: 0, opacity: o1, filter: `blur(${blur(o1)}px)`, willChange: "opacity, filter" }}>
            <SceneBeans t={t1} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: o2, filter: `blur(${blur(o2)}px)`, willChange: "opacity, filter" }}>
            <SceneBrewing t={t2} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: o3, filter: `blur(${blur(o3)}px)`, willChange: "opacity, filter" }}>
            <SceneCup t={t3} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: o4, filter: `blur(${blur(o4)}px)`, willChange: "opacity, filter" }}>
            <SceneCup t={t4} closeUp />
          </div>

          {/* headline (scene 1-2) */}
          <div
            className="serif"
            style={{
              position: "absolute",
              top: "clamp(90px, 12vh, 140px)",
              left: "clamp(20px, 6vw, 64px)",
              right: "clamp(20px, 6vw, 64px)",
              maxWidth: 620,
              opacity: headlineOpacity,
              transform: `translateY(${(1 - headlineOpacity) * -16}px)`,
              pointerEvents: "none",
            }}
          >
            <h1 style={{ margin: 0, fontSize: "clamp(28px, 4.6vw, 48px)", fontWeight: 600, lineHeight: 1.08, color: C.cream }}>
              Biji ke Cangkir: Perjalanan Kopi Kami
            </h1>
          </div>

          {/* scroll cue */}
          <div
            className="sans"
            style={{
              position: "absolute",
              bottom: 36,
              left: "clamp(20px, 6vw, 64px)",
              opacity: cueOpacity,
              color: C.sand,
              fontSize: 11,
              letterSpacing: "0.18em",
              display: "flex",
              alignItems: "center",
              gap: 10,
              pointerEvents: "none",
            }}
          >
            <span style={{ width: 24, height: 1, background: C.sand, display: "inline-block" }} />
            SCROLL TO EXPLORE
          </div>

          {/* caption block (bottom left, crossfades with scenes) */}
          <div
            className="sans"
            style={{
              position: "absolute",
              left: "clamp(20px, 6vw, 64px)",
              bottom: "clamp(96px, 14vh, 150px)",
              maxWidth: 380,
              color: C.cream,
            }}
          >
            {SCENES.map((s, i) => {
              const win = [WIN.s1, WIN.s2, WIN.s3, WIN.s4][i];
              const oo = fadeWindow(p, win.inS, win.inE, win.outS === 1 ? 1.001 : win.outS, win.outE === 1 ? 1.002 : win.outE);
              return (
                <div
                  key={s.n}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    left: 0,
                    bottom: 0,
                    opacity: oo,
                    transform: `translateY(${(1 - oo) * 14}px)`,
                    transition: "none",
                  }}
                >
                  <div className="serif" style={{ fontSize: 13, color: C.clayLight, marginBottom: 8, letterSpacing: "0.06em" }}>
                    {s.n}
                  </div>
                  <div className="serif" style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 500, marginBottom: 10 }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: 14.5, lineHeight: 1.6, color: C.sand, maxWidth: 340 }}>{s.desc}</div>
                </div>
              );
            })}
          </div>

          {/* CTA (scene 4 only) */}
          <div
            style={{
              position: "absolute",
              left: "clamp(20px, 6vw, 64px)",
              bottom: "clamp(50px, 6vh, 60px)",
              opacity: ctaOpacity,
              transform: `translateY(${(1 - ctaOpacity) * 18}px)`,
              display: "flex",
              alignItems: "center",
              gap: 22,
              pointerEvents: ctaOpacity > 0.5 ? "auto" : "none",
            }}
          >
            <button
              className="sans"
              style={{
                background: C.clayLight,
                color: C.espresso2,
                border: "none",
                padding: "13px 26px",
                borderRadius: 2,
                fontSize: 13.5,
                fontWeight: 700,
                letterSpacing: "0.03em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Order Now <ArrowRight size={15} />
            </button>
            <span className="sans" style={{ fontSize: 12.5, color: C.sand, borderBottom: `1px solid ${C.sand}`, paddingBottom: 2 }}>
              Lihat koleksi kopi terbaik kami
            </span>
          </div>

          {/* vertical progress rail (desktop) */}
          <div
            className="sans progress-rail"
            style={{
              position: "absolute",
              right: "clamp(20px, 4vw, 48px)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              color: C.sand,
            }}
          >
            {SCENES.map((s, i) => (
              <div key={s.n} style={{ fontSize: 11, opacity: i === activeIdx ? 1 : 0.4, fontWeight: i === activeIdx ? 700 : 400, transition: "opacity 0.3s ease" }}>
                {s.n}
              </div>
            ))}
            <div style={{ width: 1, height: 90, background: "rgba(216,198,170,0.25)", position: "relative", marginTop: 4 }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${p * 100}%`,
                  background: C.clayLight,
                  transition: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer
        className="sans"
        style={{
          background: C.creamSoft,
          borderTop: `1px solid rgba(60,42,28,0.14)`,
          padding: "56px clamp(20px, 6vw, 64px) 34px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: 32,
            maxWidth: 1100,
            margin: "0 auto",
          }}
          className="footer-grid"
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <Coffee size={17} color={C.clay} strokeWidth={1.8} />
              <span className="serif" style={{ fontSize: 17, fontWeight: 600 }}>Ruang Kopi</span>
            </div>
            <p style={{ fontSize: 13, color: C.stone, maxWidth: 260, lineHeight: 1.6 }}>
              Kopi spesial, diseduh dengan perhatian penuh dari biji hingga cangkir.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 12, color: C.stone, marginBottom: 10 }}>Kontak</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, marginBottom: 8 }}>
              <Phone size={14} color={C.clay} /> +62 812-3456-7890
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5 }}>
              <Mail size={14} color={C.clay} /> halo@ruangkopi.co
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: C.stone, marginBottom: 10 }}>Sosial</div>
            <div style={{ display: "flex", gap: 14, marginBottom: 12 }}>
              <Instagram size={16} color={C.bark} />
              <Facebook size={16} color={C.bark} />
              <Twitter size={16} color={C.bark} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Globe size={14} color={C.clay} /> www.ruangkopi.co
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11.5, color: C.stone, marginTop: 40 }}>
          © {new Date().getFullYear()} Ruang Kopi. Seluruh hak cipta dilindungi.
        </div>
      </footer>

      <style>{`
        @media (max-width: 720px) {
          .nav-links { display: none; }
          .progress-rail { display: none; }
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
