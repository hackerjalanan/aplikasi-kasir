<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ruang Kopi — Dari Biji, Menjadi Cerita</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700;800&display=swap');

:root{
  --espresso:#120D09;
  --espresso2:#21140D;
  --bark:#3A2115;
  --clay:#6B4226;
  --clayLight:#A66A3F;
  --sand:#D7A86E;
  --cream:#F4E7D3;
  --white:#FFFFFF;
}
*{box-sizing:border-box; margin:0; padding:0;}
html{scroll-behavior:smooth;}
body{
  background:var(--cream);
  color:var(--espresso);
  font-family:'Manrope',sans-serif;
  overflow-x:hidden;
  width:100%;
}
.serif{font-family:'Fraunces',serif;}
::selection{background:var(--clayLight); color:var(--cream);}
img{display:block; max-width:100%;}
button{cursor:pointer; font-family:'Manrope',sans-serif; border:none; background:none;}
a{color:inherit; text-decoration:none;}

@media (prefers-reduced-motion: reduce){
  *{animation-duration:0.001ms !important; animation-iteration-count:1 !important; transition-duration:0.001ms !important;}
}

/* ---------------- PRELOADER ---------------- */
#preloader{
  position:fixed; inset:0; z-index:300;
  background:var(--espresso); color:var(--sand);
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:18px;
  transition:opacity .7s ease, visibility .7s ease;
}
#preloader.hidden{opacity:0; visibility:hidden; pointer-events:none;}
#preloader .mark{font-size:26px;}
#preloader .label{font-size:12px; letter-spacing:.18em; font-weight:600;}
#preloader .bar-track{width:220px; height:2px; background:rgba(215,168,110,.2); overflow:hidden;}
#preloader .bar-fill{width:0%; height:100%; background:var(--sand); transition:width .15s linear;}
#preloader .pct{font-size:11px; color:var(--sand); opacity:.7;}

/* ---------------- NAV ---------------- */
nav{
  position:fixed; top:0; left:0; right:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between;
  padding:18px clamp(20px,5vw,56px);
  background:transparent;
  border-bottom:1px solid transparent;
  transition:background .4s ease, border-color .4s ease, backdrop-filter .4s ease;
}
nav.solid{
  background:rgba(18,13,9,.72);
  backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(215,168,110,.16);
}
.brand{display:flex; align-items:center; gap:9px; font-weight:700;}
.brand .dot{width:8px; height:8px; border-radius:50%; background:var(--sand);}
.brand span{font-size:18px; color:var(--cream);}
.nav-links{display:flex; gap:clamp(16px,3vw,34px); font-size:13.5px; color:var(--cream); opacity:.92;}
.nav-cta{
  font-size:12.5px; letter-spacing:.05em; font-weight:700; color:var(--espresso);
  background:var(--sand); padding:10px 20px; border-radius:2px;
}

/* ---------------- PINNED CINEMATIC STORY ---------------- */
#story{position:relative; height:680vh;}
#stage{
  position:sticky; top:0; height:100vh; overflow:hidden; background:var(--espresso);
}
.scene{position:absolute; inset:0; will-change:opacity, filter;}
.scene-media{position:absolute; inset:0; overflow:hidden;}
.scene-media img{
  position:absolute; inset:0; width:100%; height:100%; object-fit:cover;
  will-change:transform; transform-origin:center center;
}
.scene-grad{
  position:absolute; inset:0;
  background:linear-gradient(to bottom, rgba(9,6,4,.55) 0%, rgba(9,6,4,.08) 30%, rgba(9,6,4,.08) 55%, rgba(9,6,4,.7) 100%);
}
.scene-heat{position:absolute; inset:0; background:radial-gradient(circle at 50% 55%, rgba(166,106,63,.35), transparent 60%); mix-blend-mode:screen;}
.steam-svg{position:absolute; inset:0; width:100%; height:100%; pointer-events:none;}

.headline-block{
  position:absolute; top:clamp(96px,14vh,150px); left:clamp(20px,6vw,64px); right:clamp(20px,6vw,64px);
  max-width:640px; pointer-events:none;
}
.headline-block h1{
  font-size:clamp(30px,4.8vw,52px); font-weight:600; line-height:1.08; color:var(--cream);
}
.headline-block p{
  margin-top:14px; font-size:15px; color:var(--sand); max-width:420px; line-height:1.6;
}

.scroll-cue{
  position:absolute; bottom:36px; left:clamp(20px,6vw,64px);
  color:var(--sand); font-size:11px; letter-spacing:.18em; font-weight:600;
  display:flex; align-items:center; gap:10px; pointer-events:none;
}
.scroll-cue .line{width:24px; height:1px; background:var(--sand); display:inline-block;}

.caption-block{
  position:absolute; left:clamp(20px,6vw,64px); bottom:clamp(100px,15vh,158px);
  max-width:400px; color:var(--cream);
}
.caption-item{position:absolute; left:0; bottom:0; will-change:opacity, transform;}
.caption-item .num{font-size:13px; color:var(--sand); margin-bottom:8px; letter-spacing:.08em;}
.caption-item h3{font-size:clamp(23px,3vw,31px); font-weight:500; margin-bottom:10px;}
.caption-item p{font-size:14.5px; line-height:1.6; color:var(--sand); max-width:340px;}

.story-cta{
  position:absolute; left:clamp(20px,6vw,64px); bottom:clamp(50px,6vh,60px);
  display:flex; align-items:center; gap:22px; will-change:opacity, transform;
}
.story-cta button{
  background:var(--sand); color:var(--espresso); padding:13px 27px; border-radius:2px;
  font-size:13.5px; font-weight:700; letter-spacing:.03em; display:flex; align-items:center; gap:8px;
}
.story-cta .sec{font-size:12.5px; color:var(--sand); border-bottom:1px solid var(--sand); padding-bottom:2px;}

.progress-rail{
  position:absolute; right:clamp(20px,4vw,48px); top:50%; transform:translateY(-50%);
  display:flex; flex-direction:column; align-items:center; gap:14px; color:var(--sand);
}
.progress-rail .num{font-size:11px; opacity:.4; font-weight:400; transition:opacity .3s ease, font-weight .3s ease;}
.progress-rail .num.active{opacity:1; font-weight:700;}
.progress-rail .track{width:1px; height:110px; background:rgba(215,168,110,.25); position:relative; margin-top:4px;}
.progress-rail .fill{position:absolute; top:0; left:0; width:100%; background:var(--sand);}

/* ---------------- REVEAL SECTIONS ---------------- */
.section{padding:clamp(90px,14vh,150px) clamp(20px,6vw,64px);}
.reveal{opacity:0; transform:translateY(28px); transition:opacity .9s ease, transform .9s ease;}
.reveal.in{opacity:1; transform:translateY(0);}

/* philosophy */
#philosophy{background:var(--espresso); color:var(--cream); text-align:center; padding-top:16vh; padding-bottom:16vh;}
#philosophy .line1{font-family:'Fraunces',serif; font-weight:500; font-size:clamp(30px,5.5vw,60px); line-height:1.15;}
#philosophy .line2{font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:clamp(20px,2.6vw,28px); color:var(--sand); margin-top:26px; max-width:640px; margin-left:auto; margin-right:auto; line-height:1.5;}

/* menu */
#menu{background:var(--cream);}
.section-head{max-width:560px; margin-bottom:52px;}
.section-head .eyebrow{font-size:13px; color:var(--clayLight); letter-spacing:.06em; margin-bottom:10px;}
.section-head h2{font-family:'Fraunces',serif; font-weight:500; font-size:clamp(30px,3.6vw,42px); line-height:1.15;}
.menu-grid{display:grid; grid-template-columns:repeat(3,1fr); gap:28px;}
.menu-card{background:var(--white); border:1px solid rgba(58,33,21,.1); overflow:hidden;}
.menu-card .thumb{aspect-ratio:4/3; overflow:hidden; position:relative;}
.menu-card .thumb img{width:100%; height:100%; object-fit:cover; transition:transform .45s cubic-bezier(.2,.7,.2,1); transform:scale(1);}
.menu-card:hover .thumb img{transform:scale(1.03);}
.menu-card .info{padding:20px 22px 24px;}
.menu-card .name{font-family:'Fraunces',serif; font-size:19px; font-weight:500; transition:transform .3s ease;}
.menu-card:hover .name{transform:translateX(3px);}
.menu-card .desc{font-size:13px; color:var(--clay); margin-top:6px; line-height:1.5;}
.menu-card .price{font-size:13px; color:var(--clayLight); margin-top:12px; font-weight:600;}

/* signature */
#signature{background:var(--bark); color:var(--cream);}
.split{display:grid; grid-template-columns:1.1fr 1fr; gap:0; align-items:stretch;}
.split .img-side{position:relative; min-height:520px; overflow:hidden;}
.split .img-side img{width:100%; height:100%; object-fit:cover; position:absolute; inset:0;}
.split .text-side{display:flex; flex-direction:column; justify-content:center; padding:clamp(30px,5vw,64px);}
.split .eyebrow{font-size:12.5px; letter-spacing:.08em; color:var(--sand); margin-bottom:14px;}
.split h2{font-family:'Fraunces',serif; font-size:clamp(30px,3.6vw,44px); font-weight:500; line-height:1.15; margin-bottom:18px;}
.split p{font-size:15px; line-height:1.7; color:rgba(244,231,211,.82); max-width:420px; margin-bottom:22px;}
.notes{display:flex; gap:10px; flex-wrap:wrap; margin-bottom:26px;}
.notes span{font-size:12px; border:1px solid rgba(215,168,110,.4); color:var(--sand); padding:6px 13px; border-radius:20px;}
.split .price-cta{display:flex; align-items:center; gap:22px;}
.split .price{font-family:'Fraunces',serif; font-size:24px; color:var(--sand);}
.split button{background:var(--sand); color:var(--espresso); padding:13px 26px; font-weight:700; font-size:13.5px; border-radius:2px;}

/* the space */
#space{background:var(--cream);}
.space-grid{display:grid; grid-template-columns:1.3fr .85fr; gap:20px; height:640px;}
.space-grid .cell{position:relative; overflow:hidden;}
.space-grid .cell img{width:100%; height:100%; object-fit:cover; transition:transform .6s ease;}
.space-grid .cell:hover img{transform:scale(1.04);}
.space-grid .col{display:grid; grid-template-rows:1fr 1fr; gap:20px;}

/* location */
#location{background:var(--espresso2); color:var(--cream);}
.loc-grid{display:grid; grid-template-columns:1fr 1fr; gap:44px;}
.loc-grid h2{font-family:'Fraunces',serif; font-weight:500; font-size:clamp(28px,3.4vw,38px); margin-bottom:22px;}
.loc-row{display:flex; gap:14px; margin-bottom:18px; font-size:14.5px; align-items:flex-start;}
.loc-row .ic{color:var(--sand); flex-shrink:0; margin-top:1px;}
.hours{border-left:1px solid rgba(215,168,110,.25); padding-left:36px;}
.hours .row{display:flex; justify-content:space-between; font-size:14px; padding:9px 0; border-bottom:1px solid rgba(215,168,110,.12);}
.hours .row span:first-child{color:var(--sand);}
.map-btn{display:inline-block; margin-top:22px; font-size:13px; border-bottom:1px solid var(--sand); color:var(--sand); padding-bottom:2px;}

/* final CTA */
#final{position:relative; min-height:100vh; display:flex; align-items:center; overflow:hidden; background:var(--espresso);}
#final img{position:absolute; inset:0; width:100%; height:100%; object-fit:cover; filter:brightness(.55) saturate(1.05);}
#final .grad{position:absolute; inset:0; background:linear-gradient(to top, rgba(9,6,4,.85), rgba(9,6,4,.15) 55%, rgba(9,6,4,.5));}
#final .content{position:relative; z-index:2; padding:0 clamp(20px,6vw,64px); max-width:640px;}
#final h2{font-family:'Fraunces',serif; font-weight:600; font-size:clamp(34px,6vw,66px); color:var(--cream); line-height:1.06;}
#final p{margin-top:18px; font-size:16px; color:var(--sand); max-width:420px; line-height:1.6;}
#final .cta-row{display:flex; gap:18px; margin-top:34px; flex-wrap:wrap;}
#final .primary{background:var(--sand); color:var(--espresso); padding:15px 30px; font-weight:700; font-size:13.5px; letter-spacing:.03em; border-radius:2px;}
#final .secondary{border:1px solid rgba(215,168,110,.5); color:var(--cream); padding:15px 30px; font-weight:600; font-size:13.5px; border-radius:2px;}
#final .steam{position:absolute; right:8%; bottom:0; width:200px; height:340px; pointer-events:none; opacity:.5;}
.steam-path{fill:none; stroke:var(--cream); stroke-width:5; stroke-linecap:round; filter:blur(1.5px); animation:rise 5.5s ease-in-out infinite;}
.steam-path.p2{animation-delay:1.4s;}
@keyframes rise{
  0%{opacity:0; transform:translateY(30px);}
  20%{opacity:.5;}
  80%{opacity:.15;}
  100%{opacity:0; transform:translateY(-70px);}
}

/* footer */
footer{background:var(--espresso2); color:var(--cream); padding:56px clamp(20px,6vw,64px) 34px;}
.footer-grid{display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:32px; max-width:1100px; margin:0 auto;}
.footer-grid .brand-col p{font-size:13px; color:var(--sand); max-width:260px; line-height:1.6; margin-top:10px;}
.footer-grid .label{font-size:12px; color:var(--sand); margin-bottom:10px; opacity:.8;}
.footer-grid .row{display:flex; align-items:center; gap:8px; font-size:13.5px; margin-bottom:8px;}
.footer-bottom{text-align:center; font-size:11.5px; color:var(--sand); opacity:.6; margin-top:40px;}

/* icons (inline svg, currentColor) */
.ic svg{width:15px; height:15px; display:block;}

@media (max-width:860px){
  .nav-links{display:none;}
  .progress-rail{display:none;}
  .footer-grid{grid-template-columns:1fr;}
  .menu-grid{grid-template-columns:1fr 1fr;}
  .split{grid-template-columns:1fr;}
  .split .img-side{min-height:320px;}
  .loc-grid{grid-template-columns:1fr;}
  .hours{border-left:none; padding-left:0; margin-top:10px;}
  .space-grid{grid-template-columns:1fr; height:auto;}
  .space-grid .col{grid-template-rows:none; grid-template-columns:1fr 1fr;}
  .space-grid .cell{height:220px;}
}
@media (max-width:520px){
  .menu-grid{grid-template-columns:1fr;}
  #story{height:560vh;}
}
</style>
</head>
<body>

<div id="preloader">
  <div class="mark serif">☕</div>
  <div class="label">MEMPERSIAPKAN SECANGKIR KOPI ANDA...</div>
  <div class="bar-track"><div class="bar-fill" id="bar-fill"></div></div>
  <div class="pct" id="pct">0%</div>
</div>

<nav id="nav">
  <div class="brand"><span class="dot"></span><span class="serif">Ruang Kopi</span></div>
  <div class="nav-links">
    <span>Kisah</span><span>Menu</span><span>Ruang Kami</span><span>Kunjungi</span>
  </div>
  <div class="nav-cta">Kunjungi Kami</div>
</nav>

<section id="story">
  <div id="stage">
    <!-- scenes injected structurally, media via JS for cleanliness -->
    <div class="scene" id="scene0">
      <div class="scene-media"><img id="img0" alt="Kemasan kopi dan biji kopi close up" /></div>
      <div class="scene-grad"></div>
    </div>
    <div class="scene" id="scene1">
      <div class="scene-media"><img id="img1" alt="Biji kopi hijau dan mentah" /></div>
      <div class="scene-grad"></div>
    </div>
    <div class="scene" id="scene2">
      <div class="scene-media"><img id="img2" alt="Biji kopi disangrai dengan warna kecokelatan" /></div>
      <div class="scene-grad"></div>
      <div class="scene-heat" id="heat2"></div>
      <svg class="steam-svg" id="steamSvg2" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice"></svg>
    </div>
    <div class="scene" id="scene3">
      <div class="scene-media"><img id="img3" alt="Proses menyeduh kopi dengan uap" /></div>
      <div class="scene-grad"></div>
      <svg class="steam-svg" id="steamSvg3" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice"></svg>
    </div>
    <div class="scene" id="scene4">
      <div class="scene-media"><img id="img4" alt="Cangkir kopi dengan latte art" /></div>
      <div class="scene-grad"></div>
      <svg class="steam-svg" id="steamSvg4" viewBox="0 0 800 1000" preserveAspectRatio="xMidYMid slice"></svg>
    </div>
    <div class="scene" id="scene5">
      <div class="scene-media"><img id="img5" alt="Suasana hangat coffee shop dengan barista" /></div>
      <div class="scene-grad"></div>
    </div>

    <div class="headline-block" id="headline">
      <h1 class="serif">Dari Biji, Menjadi Cerita.</h1>
      <p>Setiap cangkir yang Anda nikmati memulai perjalanannya jauh sebelum sampai di meja Anda.</p>
    </div>

    <div class="scroll-cue" id="scrollCue"><span class="line"></span>GULIR UNTUK MEMULAI</div>

    <div class="caption-block" id="captionBlock"></div>

    <div class="story-cta" id="storyCta">
      <button>Pesan Sekarang</button>
      <span class="sec">Lihat koleksi kopi terbaik kami</span>
    </div>

    <div class="progress-rail" id="progressRail">
      <div class="track"><div class="fill" id="railFill"></div></div>
    </div>
  </div>
</section>

<section id="philosophy" class="section">
  <div class="reveal" id="philLine1"><div class="line1">Kopi yang baik butuh waktu.</div></div>
  <div class="reveal" id="philLine2"><div class="line2">Kami percaya perjalanan secangkir kopi sama berharganya dengan rasa yang tersaji di akhir.</div></div>
</section>

<section id="menu" class="section">
  <div class="section-head reveal">
    <div class="eyebrow">Menu Favorit</div>
    <h2 class="serif">Pilihan yang paling dicari pelanggan kami</h2>
  </div>
  <div class="menu-grid" id="menuGrid"></div>
</section>

<section id="signature">
  <div class="split">
    <div class="img-side"><img id="sigImg" alt="Cangkir signature coffee Ruang Kopi" /></div>
    <div class="text-side reveal" id="sigText">
      <div class="eyebrow">HOUSE SIGNATURE</div>
      <h2 class="serif">Racikan Rumah Kami</h2>
      <p>Perpaduan biji arabika pilihan yang disangrai medium-dark, menghasilkan rasa cokelat gelap dengan sentuhan karamel dan sedikit rasa jeruk di akhir tegukan.</p>
      <div class="notes"><span>Cokelat gelap</span><span>Karamel</span><span>Jeruk</span></div>
      <div class="price-cta">
        <span class="price serif">Rp 38.000</span>
        <button>Pesan Sekarang</button>
      </div>
    </div>
  </div>
</section>

<section id="space" class="section">
  <div class="section-head reveal">
    <div class="eyebrow">Ruang Kami</div>
    <h2 class="serif">Tempat singgah di antara kesibukan hari Anda</h2>
  </div>
  <div class="space-grid reveal" id="spaceGrid"></div>
</section>

<section id="location" class="section">
  <div class="loc-grid">
    <div class="reveal">
      <h2 class="serif">Kunjungi Kami</h2>
      <div class="loc-row"><span class="ic">📍</span><span>Jl. Kaliurang KM 5, Yogyakarta, DIY 55281</span></div>
      <div class="loc-row"><span class="ic">💬</span><span>+62 812-3456-7890 (WhatsApp)</span></div>
      <div class="loc-row"><span class="ic">📷</span><span>@ruangkopi.id</span></div>
      <a class="map-btn" href="#">Buka di Google Maps →</a>
    </div>
    <div class="hours reveal">
      <div class="row"><span>Senin – Jumat</span><span>07.00 – 22.00</span></div>
      <div class="row"><span>Sabtu – Minggu</span><span>08.00 – 23.00</span></div>
      <div class="row"><span>Hari Libur Nasional</span><span>09.00 – 21.00</span></div>
    </div>
  </div>
</section>

<section id="final">
  <img id="finalImg" alt="Cangkir kopi menunggu di atas meja" />
  <div class="grad"></div>
  <div class="content">
    <h2 class="serif">Secangkir kopi Anda menunggu.</h2>
    <p>Datang, duduk, dan biarkan aroma yang telah melalui seluruh perjalanan ini menyapa Anda.</p>
    <div class="cta-row">
      <button class="primary">Kunjungi Coffee Shop Kami</button>
      <button class="secondary">Jelajahi Menu</button>
    </div>
  </div>
  <svg class="steam" viewBox="0 0 200 340">
    <path class="steam-path" d="M 70 340 C 40 300, 100 270, 70 230 C 40 190, 100 160, 70 120" />
    <path class="steam-path p2" d="M 120 340 C 90 300, 150 270, 120 230 C 90 190, 150 160, 120 120" />
  </svg>
</section>

<footer>
  <div class="footer-grid">
    <div class="brand-col">
      <div class="brand"><span class="dot"></span><span class="serif" style="font-size:17px;">Ruang Kopi</span></div>
      <p>Kopi spesial, diseduh dengan perhatian penuh dari biji hingga cangkir.</p>
    </div>
    <div>
      <div class="label">Kontak</div>
      <div class="row">+62 812-3456-7890</div>
      <div class="row">halo@ruangkopi.co</div>
    </div>
    <div>
      <div class="label">Sosial</div>
      <div class="row">Instagram · TikTok · Maps</div>
      <div class="row">www.ruangkopi.co</div>
    </div>
  </div>
  <div class="footer-bottom">© <span id="year"></span> Ruang Kopi. Seluruh hak cipta dilindungi.</div>
</footer>

<script>
/* ============================================================
   IMAGE ASSETS — real photography (Unsplash), reused across
   scenes with different crops/zooms, same pattern as source file.
   ============================================================ */
const IMG = {
  beans: "https://images.unsplash.com/photo-1626518631612-423ffa6e53a8?auto=format&fit=crop&w=1800&q=75",
  brew:  "https://images.unsplash.com/photo-1517640033243-dc06bb716df5?auto=format&fit=crop&w=1800&q=75",
  shop:  "https://images.unsplash.com/photo-1758593386033-cb1f842d550c?auto=format&fit=crop&w=1800&q=75",
};

/* ============================================================
   MATH HELPERS (ported from the reference Next.js component)
   ============================================================ */
const clamp=(v,a=0,b=1)=>Math.min(Math.max(v,a),b);
const lerp=(a,b,t)=>a+(b-a)*t;
const smooth=t=>t*t*(3-2*t);
const seg=(p,s,e)=> e===s ? (p>=e?1:0) : smooth(clamp((p-s)/(e-s)));
function fadeWindow(p,inS,inE,outS,outE){
  const rise=seg(p,inS,inE);
  const fall=1-seg(p,outS,outE);
  return clamp(Math.min(rise,fall));
}
const WIN=[
  {inS:0,   inE:0.02, outS:0.16, outE:0.22},
  {inS:0.16,inE:0.22, outS:0.34, outE:0.40},
  {inS:0.34,inE:0.40, outS:0.52, outE:0.58},
  {inS:0.52,inE:0.58, outS:0.70, outE:0.76},
  {inS:0.70,inE:0.76, outS:0.86, outE:0.92},
  {inS:0.86,inE:0.92, outS:1,    outE:1},
];

const SCENES=[
  {n:"01", title:"Dari Kemasan", desc:"Setiap perjalanan dimulai dari kemasan yang menyimpan janji rasa.", img:IMG.beans, focal:"center 40%", zoomFrom:1, zoomTo:1.12, panY:24, filter:""},
  {n:"02", title:"Biji Hijau", desc:"Sebelum disangrai, ada potensi yang menunggu untuk ditemukan.", img:IMG.beans, focal:"center 55%", zoomFrom:1.05, zoomTo:1.2, panY:18, filter:"saturate(.85) hue-rotate(6deg)"},
  {n:"03", title:"Titik Sangrai", desc:"Panas mengubah warna, aroma, dan karakter setiap biji kopi.", img:IMG.beans, focal:"center 45%", zoomFrom:1, zoomTo:1.18, panY:20, filter:"saturate(1.25) contrast(1.08) sepia(.18)"},
  {n:"04", title:"Digiling & Diseduh", desc:"Bubuk kopi bertemu air panas, melepaskan crema keemasan.", img:IMG.brew, focal:"center 35%", zoomFrom:1.02, zoomTo:1.16, panY:20, filter:""},
  {n:"05", title:"Tuang & Sajikan", desc:"Setiap tetes espresso mengalir menuju cangkir yang menunggu.", img:IMG.brew, focal:"center 48%", zoomFrom:1.06, zoomTo:1.22, panY:14, filter:""},
  {n:"06", title:"Ruang Kopi", desc:"Dan di sinilah perjalanan ini akhirnya menjadi milik Anda.", img:IMG.shop, focal:"center 42%", zoomFrom:1, zoomTo:1.1, panY:16, filter:""},
];

/* set image sources */
SCENES.forEach((s,i)=>{ document.getElementById('img'+i).src = s.img; });

/* build steam overlays for scenes 2,3,4 */
function buildSteam(svgId, positions){
  const svg=document.getElementById(svgId);
  svg.innerHTML = positions.map(p=>
    `<path data-x="${p.x}" data-delay="${p.delay}" data-h="${p.height}" fill="none" stroke="#F4E7D3" stroke-width="6" stroke-linecap="round" style="filter:blur(1.5px)" />`
  ).join('');
}
buildSteam('steamSvg2',[{x:400,delay:.25,height:190},{x:370,delay:.42,height:150}]);
buildSteam('steamSvg3',[{x:400,delay:.05,height:230},{x:430,delay:.24,height:180}]);
buildSteam('steamSvg4',[{x:400,delay:.05,height:230},{x:430,delay:.22,height:180}]);

function updateSteam(svgId, t){
  const svg=document.getElementById(svgId);
  [...svg.children].forEach(path=>{
    const x=parseFloat(path.dataset.x), delay=parseFloat(path.dataset.delay), h=parseFloat(path.dataset.h);
    const local=clamp((t-delay)/(1-delay));
    const o=local*0.4;
    const d=`M ${x} 820 C ${x-26} ${820-h*0.3}, ${x+26} ${820-h*0.55}, ${x} ${820-h*0.8} C ${x-20} ${820-h}, ${x+18} ${820-h*1.15}, ${x} ${820-h*1.3}`;
    path.setAttribute('d', d);
    path.setAttribute('opacity', o);
    path.style.transform = `translateY(${(1-local)*40}px)`;
  });
}

/* ============================================================
   CAPTION DOM
   ============================================================ */
const captionBlock=document.getElementById('captionBlock');
SCENES.forEach((s,i)=>{
  const div=document.createElement('div');
  div.className='caption-item';
  div.style.position = i===0 ? 'relative' : 'absolute';
  div.innerHTML = `<div class="num serif">${s.n}</div><h3 class="serif">${s.title}</h3><p>${s.desc}</p>`;
  captionBlock.appendChild(div);
});
const captionItems=[...captionBlock.children];

/* progress rail numbers */
const railParent=document.getElementById('progressRail');
SCENES.forEach((s,i)=>{
  const d=document.createElement('div');
  d.className='num serif'; d.textContent=s.n;
  railParent.insertBefore(d, railParent.firstChild);
});
const railNums=[...railParent.querySelectorAll('.num')];

/* ============================================================
   SCROLL-DRIVEN LOOP
   ============================================================ */
const storyEl=document.getElementById('story');
const navEl=document.getElementById('nav');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let target=0, current=0;

function readTarget(){
  const rect=storyEl.getBoundingClientRect();
  const total=storyEl.offsetHeight - window.innerHeight;
  const scrolled=-rect.top;
  target=clamp(total>0 ? scrolled/total : 0);
  navEl.classList.toggle('solid', window.scrollY>40);
}
window.addEventListener('scroll', readTarget, {passive:true});
window.addEventListener('resize', readTarget);
readTarget();

function blurFor(o){ return (o>0.02 && o<0.98) ? 4*(1-Math.abs(o*2-1)) : 0; }

function frame(){
  const ease = reduced ? 1 : 0.11;
  current = lerp(current, target, ease);
  if(Math.abs(current-target) < 0.0004) current = target;
  const p = current;

  const opac = WIN.map(w=>fadeWindow(p, w.inS, w.inE, w.outS===1?1.001:w.outS, w.outE===1?1.002:w.outE));
  const tLocal = WIN.map((w,i)=> i===WIN.length-1 ? seg(p, w.inS, 1) : seg(p, w.inS, w.outE));

  SCENES.forEach((s,i)=>{
    const sceneEl=document.getElementById('scene'+i);
    const o=opac[i];
    sceneEl.style.opacity=o;
    sceneEl.style.filter = `blur(${blurFor(o)}px)`;
    const img=document.getElementById('img'+i);
    const scale=lerp(s.zoomFrom, s.zoomTo, tLocal[i]);
    img.style.objectPosition = s.focal;
    img.style.transform = `scale(${scale}) translateY(${-tLocal[i]*s.panY}px)`;
    if(s.filter) img.style.filter = s.filter;
  });

  const heat=document.getElementById('heat2');
  heat.style.opacity = clamp(seg(p, WIN[2].inS, WIN[2].inS+0.06)) * (1-seg(p, WIN[2].outS-0.04, WIN[2].outE));

  updateSteam('steamSvg2', tLocal[2]);
  updateSteam('steamSvg3', tLocal[3]);
  updateSteam('steamSvg4', tLocal[4]);

  const headlineOpacity = 1-seg(p,0,0.1);
  const headline=document.getElementById('headline');
  headline.style.opacity=headlineOpacity;
  headline.style.transform=`translateY(${(1-headlineOpacity)*-16}px)`;

  const cueOpacity = 1-seg(p,0,0.05);
  document.getElementById('scrollCue').style.opacity=cueOpacity;

  captionItems.forEach((el,i)=>{
    const w=WIN[i];
    const oo=fadeWindow(p, w.inS, w.inE, w.outS===1?1.001:w.outS, w.outE===1?1.002:w.outE);
    el.style.opacity=oo;
    el.style.transform=`translateY(${(1-oo)*14}px)`;
  });

  const ctaOpacity = seg(p, WIN[5].inS+0.02, WIN[5].inE+0.08);
  const cta=document.getElementById('storyCta');
  cta.style.opacity=ctaOpacity;
  cta.style.transform=`translateY(${(1-ctaOpacity)*18}px)`;
  cta.style.pointerEvents = ctaOpacity>0.5 ? 'auto':'none';

  let activeIdx=0;
  for(let i=0;i<WIN.length;i++){ if(p>=WIN[i].outS && i<WIN.length-1) activeIdx=i+1; }
  railNums.forEach((el,i)=>{
    const idx = railNums.length-1-i; // rendered reverse order (last inserted first)
  });
  // recompute since numbers were prepended (reverse order in DOM)
  const orderedNums = SCENES.map((s,i)=> railParent.querySelectorAll('.num')[SCENES.length-1-i]);
  orderedNums.forEach((el,i)=> el.classList.toggle('active', i===activeIdx));
  document.getElementById('railFill').style.height = (p*100)+'%';

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ============================================================
   PRELOADER
   ============================================================ */
let pct=0;
const barFill=document.getElementById('bar-fill');
const pctLabel=document.getElementById('pct');
const iv=setInterval(()=>{
  pct += 6+Math.random()*10;
  if(pct>=100){ pct=100; clearInterval(iv); setTimeout(()=>document.getElementById('preloader').classList.add('hidden'),350); }
  barFill.style.width=Math.round(pct)+'%';
  pctLabel.textContent=Math.round(pct)+'%';
},90);

/* ============================================================
   REVEAL ON SCROLL (single, restrained pattern for later sections)
   ============================================================ */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, {threshold:0.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ============================================================
   MENU GRID
   ============================================================ */
const MENU=[
  {name:"Espresso", desc:"Pekat, pahit tegas, karakter murni.", price:"Rp 22.000", img:IMG.beans},
  {name:"Americano", desc:"Ringan dan bersih untuk hari yang panjang.", price:"Rp 25.000", img:IMG.beans},
  {name:"Cappuccino", desc:"Susu berbusa lembut menyeimbangkan pahit.", price:"Rp 30.000", img:IMG.brew},
  {name:"Latte", desc:"Creamy dan lembut, favorit sepanjang hari.", price:"Rp 32.000", img:IMG.brew},
  {name:"Signature Coffee", desc:"Racikan khas rumah kami, tanpa duanya.", price:"Rp 38.000", img:IMG.shop},
  {name:"Cold Brew", desc:"Diseduh dingin selama 18 jam, halus dan manis.", price:"Rp 34.000", img:IMG.shop},
];
const menuGrid=document.getElementById('menuGrid');
menuGrid.innerHTML = MENU.map(m=>`
  <div class="menu-card">
    <div class="thumb"><img src="${m.img}" alt="${m.name}"/></div>
    <div class="info">
      <div class="name serif">${m.name}</div>
      <div class="desc">${m.desc}</div>
      <div class="price">${m.price}</div>
    </div>
  </div>
`).join('');

document.getElementById('sigImg').src = IMG.shop;

/* space gallery */
document.getElementById('spaceGrid').innerHTML = `
  <div class="cell"><img src="${IMG.shop}" alt="Suasana coffee shop"/></div>
  <div class="col">
    <div class="cell"><img src="${IMG.beans}" alt="Detail biji kopi"/></div>
    <div class="cell"><img src="${IMG.brew}" alt="Cangkir kopi di meja"/></div>
  </div>
`;

document.getElementById('finalImg').src = IMG.brew;
document.getElementById('year').textContent = new Date().getFullYear();
</script>
</body>
</html>