"use client";

import Image from "next/image";
import { ArrowRight, Camera, Coffee, MapPin, Phone } from "lucide-react";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import { FaTiktok, FaInstagram } from "react-icons/fa";

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);
const seg = (p: number, s: number, e: number) => (e === s ? (p >= e ? 1 : 0) : smooth(clamp((p - s) / (e - s))));
const fadeWindow = (p: number, inS: number, inE: number, outS: number, outE: number) => {
  const rise = seg(p, inS, inE);
  const fall = 1 - seg(p, outS, outE);
  return clamp(Math.min(rise, fall));
};

const scenes = [
  {
    n: "01",
    title: "Dari Kemasan",
    desc: "Setiap perjalanan dimulai dari kemasan yang menyimpan janji rasa.",
    image: "/images/scene-0-open.jpeg",
    alt: "Biji kopi dalam kemasan",
    focal: "center 40%",
    zoomFrom: 1,
    zoomTo: 1.12,
    panY: 24,
    filter: "",
  },
  {
    n: "02",
    title: "Biji Hijau",
    desc: "Sebelum disangrai, ada potensi yang menunggu untuk ditemukan.",
    image: "/images/scene-1-beans.jpeg",
    alt: "Biji kopi hijau dan mentah",
    focal: "center 55%",
    zoomFrom: 1.05,
    zoomTo: 1.2,
    panY: 18,
    filter: "saturate(.85) hue-rotate(6deg)",
  },
  {
    n: "03",
    title: "Titik Sangrai",
    desc: "Panas mengubah warna, aroma, dan karakter setiap biji kopi.",
    image: "/images/scene-3-grindel.jpeg",
    alt: "Biji kopi hasil sangrai",
    focal: "center 45%",
    zoomFrom: 1,
    zoomTo: 1.18,
    panY: 20,
    filter: "saturate(1.25) contrast(1.08) sepia(.18)",
  },
  {
    n: "04",
    title: "Digiling & Diseduh",
    desc: "Bubuk kopi bertemu air panas, melepaskan crema keemasan.",
    image: "/images/scene-2-brewing.jpeg",
    alt: "Proses seduh kopi",
    focal: "center 35%",
    zoomFrom: 1.02,
    zoomTo: 1.16,
    panY: 20,
    filter: "",
  },
  {
    n: "05",
    title: "Tuang & Sajikan",
    desc: "Setiap tetes espresso mengalir menuju cangkir yang menunggu.",
    image: "/images/scene-3-cup.jpeg",
    alt: "Cangkir kopi dengan latte art",
    focal: "center 48%",
    zoomFrom: 1.06,
    zoomTo: 1.22,
    panY: 14,
    filter: "",
  },
  {
    n: "06",
    title: "Ruang Kopi",
    desc: "Dan di sinilah perjalanan ini akhirnya menjadi milik Anda.",
    image: "/images/scene-4-ctat.jpeg",
    alt: "Suasana coffee shop",
    focal: "center 42%",
    zoomFrom: 1,
    zoomTo: 1.1,
    panY: 16,
    filter: "",
  },
];

const menu = [
  { name: "Espresso", desc: "Pekat, pahit tegas, karakter murni.", price: "Rp 22.000", image: "/images/scene-1-beans.jpeg" },
  { name: "Americano", desc: "Ringan dan bersih untuk hari yang panjang.", price: "Rp 25.000", image: "/images/scene-1-beans.jpeg" },
  { name: "Cappuccino", desc: "Susu berbusa lembut menyeimbangkan pahit.", price: "Rp 30.000", image: "/images/scene-2-brewing.jpeg" },
  { name: "Latte", desc: "Creamy dan lembut, favorit sepanjang hari.", price: "Rp 32.000", image: "/images/scene-2-brewing.jpeg" },
  { name: "Signature Coffee", desc: "Racikan khas rumah kami, tanpa duanya.", price: "Rp 38.000", image: "/images/scene-3-cup.jpeg" },
  { name: "Cold Brew", desc: "Diseduh dingin selama 18 jam, halus dan manis.", price: "Rp 34.000", image: "/images/scene-4-ctat.jpeg" },
];

const gallery = [
  { image: "/images/scene-4-ctat.jpeg", alt: "Suasana ruang kopi" },
  { image: "/images/scene-1-beans.jpeg", alt: "Detail biji kopi" },
  { image: "/images/scene-2-brewing.jpeg", alt: "Secangkir kopi di meja" },
];

const win = [
  { inS: 0, inE: 0.02, outS: 0.16, outE: 0.22 },
  { inS: 0.16, inE: 0.22, outS: 0.34, outE: 0.4 },
  { inS: 0.34, inE: 0.4, outS: 0.52, outE: 0.58 },
  { inS: 0.52, inE: 0.58, outS: 0.7, outE: 0.76 },
  { inS: 0.7, inE: 0.76, outS: 0.86, outE: 0.92 },
  { inS: 0.86, inE: 0.92, outS: 1, outE: 1 },
];

export default function CoffeeLandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadPct, setLoadPct] = useState(0);
  const [navSolid, setNavSolid] = useState(false);
  const storyRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const currentRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    let pct = 0;
    const interval = setInterval(() => {
      pct += 6 + Math.random() * 10;
      if (pct >= 100) {
        pct = 100;
        clearInterval(interval);
        setTimeout(() => setLoaded(true), 350);
      }
      setLoadPct(Math.round(pct));
    }, 90);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateTarget = () => {
      const element = storyRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const total = element.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      targetRef.current = clamp(total > 0 ? scrolled / total : 0);
      setNavSolid(window.scrollY > 40);
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.11);
      if (Math.abs(currentRef.current - targetRef.current) < 0.0004) {
        currentRef.current = targetRef.current;
      }
      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const p = progress;
  const activeIndex = p < win[1].outS ? 0 : p < win[2].outS ? 1 : p < win[3].outS ? 2 : p < win[4].outS ? 3 : p < win[5].outS ? 4 : 5;

  const handleNavClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;

    const offset = 84;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#F4E7D3] text-[#120D09]">
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#120D09] text-[#D7A86E] transition-opacity duration-700 ${loaded ? "pointer-events-none invisible opacity-0" : "visible opacity-100"}`}
      >
        <Coffee className="h-7 w-7" />
        <p className="text-[11px] tracking-[0.18em] font-semibold">MEMPERSIAPKAN SECANGKIR KOPI ANDA...</p>
        <div className="h-[2px] w-[220px] overflow-hidden bg-[#D7A86E]/20">
          <div className="h-full bg-[#D7A86E] transition-all duration-150" style={{ width: `${loadPct}%` }} />
        </div>
        <div className="text-[11px] text-[#D7A86E]/80">{loadPct}%</div>
      </div>

      <nav className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-400 ${navSolid ? "border-[#D7A86E]/20 bg-[#120D09]/75 backdrop-blur-md" : "border-transparent bg-transparent"}`}>
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 md:px-14">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#D7A86E]" />
            <span className="font-serif text-lg text-white">Ruang Kopi</span>
          </div>

          <div className="hidden items-center gap-7 text-[13.5px] text-white/90 md:flex">
            {[
              { label: "Kisah", href: "story" },
              { label: "Menu", href: "menu" },
              { label: "Ruang Kami", href: "space" },
              { label: "Kunjungi", href: "location" },
            ].map((item) => (
              <a
                key={item.label}
                href={`#${item.href}`}
                onClick={(event) => handleNavClick(event, item.href)}
                className="transition-opacity hover:opacity-100"
              >
                {item.label}
              </a>
            ))}
          </div>

          <a
            href="#location"
            onClick={(event) => handleNavClick(event, "location")}
            className="rounded-sm bg-[#D7A86E] px-4 py-2 text-[12.5px] font-bold text-[#120D09]"
          >
            Kunjungi Kami
          </a>
        </div>
      </nav>

      <section id="story" ref={storyRef} className="relative h-[680vh]">
        <div className="sticky top-0 h-screen overflow-hidden bg-[#120D09]">
          {scenes.map((scene, index) => {
            const w = win[index];
            const o = fadeWindow(p, w.inS, w.inE, w.outS === 1 ? 1.001 : w.outS, w.outE === 1 ? 1.002 : w.outE);
            const t = seg(p, w.inS, w.outE);
            const scale = lerp(scene.zoomFrom, scene.zoomTo, t);
            const filter = scene.filter || "";

            return (
              <div key={scene.n} className="absolute inset-0 transition-opacity duration-300" style={{ opacity: o, filter: `blur(${o > 0.02 && o < 0.98 ? 4 * (1 - Math.abs(o * 2 - 1)) : 0}px)` }}>
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={scene.image}
                    alt={scene.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover"
                    style={{
                      objectPosition: scene.focal,
                      transform: `scale(${scale}) translateY(${-t * scene.panY}px)`,
                      filter,
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#090604]/60 via-[#090604]/10 to-[#090604]/70" />
              </div>
            );
          })}

          <div className="absolute left-5 right-5 top-[clamp(96px,14vh,150px)] max-w-[640px] md:left-14 md:right-auto" style={{ opacity: 1 - seg(p, 0, 0.12), transform: `translateY(${(1 - (1 - seg(p, 0, 0.12))) * -16}px)` }}>
            <h1 className="font-serif text-[clamp(30px,4.8vw,52px)] font-semibold leading-[1.08] text-white">
              Dari Biji, Menjadi Cerita.
            </h1>
            <p className="mt-4 max-w-[420px] text-[15px] leading-6 text-[#D7A86E]">
              Setiap cangkir yang Anda nikmati memulai perjalanannya jauh sebelum sampai di meja Anda.
            </p>
          </div>

          <div className="absolute bottom-8 left-5 flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-[#D7A86E] md:left-14" style={{ opacity: 1 - seg(p, 0, 0.06) }}>
            <span className="inline-block h-px w-6 bg-[#D7A86E]" />
            GULIR UNTUK MEMULAI
          </div>

          <div className="absolute bottom-[clamp(100px,15vh,158px)] left-5 right-5 md:left-14">
            {scenes.map((scene, index) => {
              const w = win[index];
              const oo = fadeWindow(
                p,
                w.inS,
                w.inE,
                w.outS === 1 ? 1.001 : w.outS,
                w.outE === 1 ? 1.002 : w.outE
              );

              return (
                <div
                  key={scene.n}
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    opacity: oo,
                    transform: `translateY(${(1 - oo) * 14}px)`,
                  }}
                >
                  <div className="mb-2 text-[13px] tracking-[0.08em] text-[#D7A86E]">
                    {scene.n}
                  </div>

                  <div className=" items-end gap-8 md:gap-12">
                    <h3 className="shrink-0 font-serif text-[clamp(23px,3vw,31px)] font-medium leading-tight text-white">
                      {scene.title}
                    </h3>

                    <p className="max-w-[360px] pb-0.5 text-[13px] leading-5 text-[#D7A86E]">
                      {scene.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>


          <div className="absolute bottom-[clamp(50px,6vh,60px)] left-5 flex items-center gap-5 md:left-14" style={{ opacity: seg(p, win[5].inS + 0.02, win[5].inE + 0.08), transform: `translateY(${(1 - seg(p, win[5].inS + 0.02, win[5].inE + 0.08)) * 18}px)` }}>
            <button className="flex items-center gap-2 rounded-sm bg-[#D7A86E] px-6 py-3 text-[13.5px] font-bold text-[#120D09]">
              Pesan Sekarang <ArrowRight className="h-4 w-4" />
            </button>
            <span className="border-b border-[#D7A86E] pb-1 text-[12.5px] text-[#D7A86E]">Lihat koleksi kopi terbaik kami</span>
          </div>

          <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-[#D7A86E] md:flex">
            {scenes.map((scene, index) => (
              <div key={scene.n} className={`text-[11px] ${index === activeIndex ? "font-bold opacity-100" : "opacity-40"}`}>
                {scene.n}
              </div>
            ))}
            <div className="relative mt-1 h-[110px] w-px bg-[#D7A86E]/25">
              <div className="absolute inset-x-0 top-0 bg-[#D7A86E]" style={{ height: `${p * 100}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#120D09] px-5 py-28 text-center md:px-14">
        <div className="mx-auto max-w-4xl">
          <div className="font-serif text-[clamp(30px,5.5vw,60px)] leading-tight text-white">Kopi yang baik butuh waktu.</div>
          <div className="mt-7 font-serif text-[clamp(20px,2.6vw,28px)] italic text-[#D7A86E]">
            Kami percaya perjalanan secangkir kopi sama berharganya dengan rasa yang tersaji di akhir.
          </div>
        </div>
      </section>

      <section id="menu" className="scroll-mt-[88px] bg-[#F4E7D3] px-5 py-24 md:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <div className="mb-3 text-[13px] tracking-[0.06em] text-[#A66A3F]">Menu Favorit</div>
            <h2 className="font-serif text-[clamp(30px,3.6vw,42px)] leading-tight text-[#120D09]">
              Pilihan yang paling dicari pelanggan kami
            </h2>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {menu.map((item) => (
              <article key={item.name} className="overflow-hidden border border-[#3A2115]/10 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="font-serif text-[19px] text-[#120D09]">{item.name}</div>
                  <p className="mt-2 text-[13px] w-300 leading-5 text-[#6B4226]">{item.desc}</p>
                  <div className="mt-4 text-[13px] font-semibold text-[#A66A3F]">{item.price}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#3A2115] text-white">
        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[420px] md:min-h-[520px]">
            <Image src="/images/scene-4-ctat.jpeg" alt="Cangkir signature coffee Ruang Kopi" fill className="object-cover" />
          </div>
          <div className="flex items-center px-5 py-12 md:px-14">
            <div className="max-w-lg">
              <div className="mb-4 text-[12.5px] tracking-[0.08em] text-[#D7A86E]">HOUSE SIGNATURE</div>
              <h2 className="font-serif text-[clamp(30px,3.6vw,44px)] leading-tight">Racikan Rumah Kami</h2>
              <p className="mt-5 text-[15px] leading-7 text-[#F4E7D3]/85">
                Perpaduan biji arabika pilihan yang disangrai medium-dark, menghasilkan rasa cokelat gelap dengan sentuhan karamel dan sedikit rasa jeruk di akhir tegukan.
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {['Cokelat gelap', 'Karamel', 'Jeruk'].map((tag) => (
                  <span key={tag} className="rounded-full border border-[#D7A86E]/40 px-3 py-1.5 text-[12px] text-[#D7A86E]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-7 flex items-center gap-5">
                <span className="font-serif text-2xl text-[#D7A86E]">Rp 38.000</span>
                <button className="rounded-sm bg-[#D7A86E] px-6 py-3 text-[13.5px] font-bold text-[#120D09]">
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="space" className="scroll-mt-[88px] bg-[#F4E7D3] px-5 py-24 md:px-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <div className="mb-3 text-[13px] tracking-[0.06em] text-[#A66A3F]">Ruang Kami</div>
            <h2 className="font-serif text-[clamp(30px,3.6vw,42px)] leading-tight text-[#120D09]">
              Tempat singgah di antara kesibukan hari Anda
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.3fr_0.85fr] md:h-[640px]">
            <div className="relative overflow-hidden">
              <Image src="/images/scene-4-ctat.jpeg" alt="Suasana coffee shop" fill className="object-cover transition-transform duration-500 hover:scale-105" />
            </div>
            <div className="grid gap-5 md:grid-rows-2">
              {gallery.slice(1).map((g) => (
                <div key={g.alt} className="relative overflow-hidden">
                  <Image src={g.image} alt={g.alt} fill className="object-cover transition-transform duration-500 hover:scale-105" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="location" className="scroll-mt-[88px] bg-[#21140D] px-5 py-24 text-white md:px-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-[clamp(28px,3.4vw,38px)] leading-tight">Kunjungi Kami</h2>
            <div className="mt-6 space-y-4 text-[14.5px] text-[#F4E7D3]">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-[#D7A86E]" /> <span>Jl. Kaliurang KM 5, Yogyakarta, DIY 55281</span></div>
              <div className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-[#D7A86E]" /> <span>+62 812-3456-7890 (WhatsApp)</span></div>
              <div className="flex items-start gap-3"><Camera className="mt-0.5 h-4 w-4 text-[#D7A86E]" /> <span>@ruangkopi.id</span></div>
            </div>
            <a href="#" className="mt-5 inline-block border-b border-[#D7A86E] pb-1 text-[13px] text-[#D7A86E]">
              Buka di Google Maps →
            </a>
          </div>

          <div className="border-l border-[#D7A86E]/25 pl-0 md:pl-8">
            <div className="space-y-3">
              {[
                ['Senin – Jumat', '07.00 – 22.00'],
                ['Sabtu – Minggu', '08.00 – 23.00'],
                ['Hari Libur Nasional', '09.00 – 21.00'],
              ].map(([day, hours]) => (
                <div key={day} className="flex items-center justify-between border-b border-[#D7A86E]/15 py-2.5 text-[14px]">
                  <span className="text-[#D7A86E]">{day}</span>
                  <span>{hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative min-h-[100vh] overflow-hidden bg-[#120D09]">
        <Image src="/images/scene-2-brewing.jpeg" alt="Cangkir kopi menunggu di atas meja" fill className="object-cover brightness-50 saturate-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090604]/90 via-[#090604]/20 to-[#090604]/50" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-32 md:px-14">
          <h2 className="font-serif text-[clamp(34px,6vw,66px)] leading-[1.06] text-white">Secangkir kopi Anda menunggu.</h2>
          <p className="mt-5 max-w-[420px] text-base leading-7 text-[#D7A86E]">
            Datang, duduk, dan biarkan aroma yang telah melalui seluruh perjalanan ini menyapa Anda.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-sm bg-[#D7A86E] px-7 py-3.5 text-[13.5px] font-bold text-[#120D09]">
              Kunjungi Coffee Shop Kami
            </button>
            <button className="rounded-sm border border-[#D7A86E]/50 px-7 py-3.5 text-[13.5px] font-semibold text-white">
              Jelajahi Menu
            </button>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-[8%] h-[340px] w-[200px] opacity-50">
          <div className="absolute left-10 top-0 h-full w-1/2 rounded-full border-[5px] border-transparent border-t-[#F4E7D3] blur-[1.5px] animate-[rise_5.5s_ease-in-out_infinite]" />
          <div className="absolute right-10 top-0 h-full w-1/2 rounded-full border-[5px] border-transparent border-t-[#F4E7D3] blur-[1.5px] animate-[rise_5.5s_ease-in-out_1.4s_infinite]" />
        </div>
      </section>


    <footer className="bg-[#21140D] px-5 py-14 text-white md:px-14">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#D7A86E]" />
            <span className="font-serif text-lg text-white">Ruang Kopi</span>
          </div>
          <p className="mt-3 max-w-[260px] text-[13px] leading-6 text-[#D7A86E]">
            Kopi spesial, diseduh dengan perhatian penuh dari biji hingga cangkir.
          </p>
        </div>

        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[0.12em] text-[#D7A86E]/80">Navigasi</div>
          <div className="space-y-2 text-[13.5px]">
            <div>Beranda</div>
            <div>Tentang Kami</div>
            <div>Menu</div>
            <div>Koleksi Kopi</div>
          </div>
        </div>

        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[0.12em] text-[#D7A86E]/80">Kontak</div>
          <div className="text-[13.5px]">+62 812-3456-7890</div>
          <div className="mt-2 text-[13.5px]">halo@ruangkopi.co</div>
          <div className="mt-2 text-[13.5px]">Jl. Kopi No. 24, Jakarta</div>
        </div>

        <div>
          <div className="mb-3 text-[12px] uppercase tracking-[0.12em] text-[#D7A86E]/80">
            Sosial
          </div>

          <div className="space-y-3 text-[13.5px]">
            <a
              href="#"
              className="flex items-center gap-3 text-white transition-colors hover:text-[#D7A86E]"
            >
              <FaInstagram className="h-4 w-4" />
              <span>Instagram</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 text-white transition-colors hover:text-[#D7A86E]"
            >
              <FaTiktok className="h-4 w-4" />
              <span>TikTok</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 text-white transition-colors hover:text-[#D7A86E]"
            >
              <MapPin className="h-4 w-4" />
              <span>Google Maps</span>
            </a>

            <a
              href="https://ruangkopi.co"
              className="mt-4 block text-[#D7A86E] transition-colors hover:text-white"
            >
              www.ruangkopi.co
            </a>
          </div>
        </div>
        </div>


      <div className="mt-9 text-center text-[11.5px] text-[#D7A86E]/70">© {new Date().getFullYear()} Ruang Kopi. Seluruh hak cipta dilindungi.</div>
    </footer>

    </main>
  );
}
