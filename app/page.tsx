"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import type { Product } from "@/lib/products";

// ─── Team groupings ──────────────────────────────────────────────────────────
const SERIE_A_NAMES = [
  "Flamengo","Corinthians","São Paulo","Palmeiras","Vasco","Grêmio","Cruzeiro",
  "Atlético-MG","Santos","Internacional","Botafogo","Bahia","Fluminense",
  "Coritiba","Remo","Athletico-PR","Vitória","Chapecoense","Bragantino","Mirassol",
];
const SERIE_B_NAMES = [
  "Sport Recife","Fortaleza","Ceará","Goiás","Avaí","América-MG","Juventude",
  "Cuiabá","CRB","Novorizontino","São Bernardo","Botafogo-SP","Operário",
  "Londrina","Atlético-GO","Vila Nova","Criciúma","Guarani","Ponte Preta",
];
const SERIE_C_NAMES = [
  "Náutico","Athletic Club","Ypiranga","Caxias","Santa Cruz","Figueirense","Confiança",
];

function getTeams(names: string[]): Product[] {
  return names
    .map((n) => PRODUCTS.find((p) => p.name === n))
    .filter(Boolean) as Product[];
}

const TABS = ["Série A", "Série B", "Série C"] as const;
type Tab = typeof TABS[number];

const TEAMS: Record<Tab, Product[]> = {
  "Série A": getTeams(SERIE_A_NAMES),
  "Série B": getTeams(SERIE_B_NAMES),
  "Série C": getTeams(SERIE_C_NAMES),
};

// ─── FAQ data ────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Como funciona a personalização do nome?",
    a: "Ao finalizar o pedido, você informa o nome que deseja gravado nas peças e na caixa. O dominó chega com o nome escolhido.",
  },
  {
    q: "Qual o material do dominó?",
    a: "As peças são fabricadas em resina de alta durabilidade com acabamento profissional e pintura detalhada.",
  },
  {
    q: "Posso escolher qualquer time?",
    a: "Sim! Temos times de Série A, B e C. Selecione o clube do seu coração na seção acima.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "O prazo é de 3 a 7 dias úteis para todo o Brasil, via Correios.",
  },
  {
    q: "Como entro em contato com o suporte?",
    a: "Você pode falar conosco pelo WhatsApp ou e-mail disponíveis no rodapé.",
  },
  {
    q: "A loja é confiável?",
    a: "Sim! Já atendemos mais de 2.000 clientes satisfeitos com avaliação 4.9 estrelas.",
  },
  {
    q: "Posso trocar ou devolver?",
    a: "Sim, aceitamos trocas e devoluções em até 7 dias após o recebimento do produto.",
  },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────
const REVIEWS = [
  { name: "Carlos R.", img: "/images/review1-B3rg2PsV.png", text: "Presente perfeito pro meu pai! Ele amou, qualidade impecável. A galera toda quer um agora." },
  { name: "Fernanda S.", img: "/images/review2-CGOEvoao.png", text: "Comprei pro meu marido e ele não larga mais. As peças são lindas e bem acabadas!" },
  { name: "Marcos T.", img: "/images/review3-BEUd7AU1.png", text: "Entrega rápida e embalagem nota 10. Todo jogo de dominó na rua agora é com estilo!" },
  { name: "Juliana M.", img: "/images/review4-CP4-nL-V.png", text: "Personalizado com o nome ficou incrível! Meu presente mais elogiado de todos os tempos." },
];

// ─── Stars component ─────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="text-[#E5AE35]">
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

function VideoSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="py-16 px-6 text-center" style={{ background: "#141414" }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", textTransform: "uppercase" }}
        >
          Aperte o Play e garanta{" "}
          <span style={{ color: "#E5AE35" }}>+10% de Desconto!</span>
        </h2>
        <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {playing ? (
            <iframe
              src="https://www.youtube.com/embed/dDyxtrO_buI?autoplay=1"
              title="Dominó FC"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: "none" }}
            />
          ) : (
            <button
              className="absolute inset-0 w-full h-full group cursor-pointer"
              onClick={() => setPlaying(true)}
              aria-label="Assistir vídeo"
            >
              <Image
                src="/images/video-thumbnail-Dtmyu9VC.jpg"
                alt="Assistir vídeo"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: "#E5AE35" }}
                >
                  <svg viewBox="0 0 24 24" fill="#141414" className="w-8 h-8 ml-1">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Série A");
  const [selected, setSelected] = useState<Product>(PRODUCTS[0]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [customName, setCustomName] = useState("");

  function handleBuy() {
    const params = new URLSearchParams({ product: selected.productId });
    if (customName.trim()) params.set("nome", customName.trim());
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div style={{ fontFamily: "var(--font-inter), Inter, sans-serif", background: "#141414", color: "#F5F4F0" }}>

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Image src="/images/logo-dominofc-1kMaugOL.png" alt="Dominó FC" width={120} height={40} className="object-contain h-10 w-auto" />
        <button
          onClick={handleBuy}
          className="hidden md:block text-sm font-bold px-6 py-2 rounded-full"
          style={{ background: "#E5AE35", color: "#141414" }}
        >
          COMPRAR AGORA
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(180deg,#1a1a1a 0%,#141414 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 pt-10 pb-16 flex flex-col lg:flex-row items-center gap-10">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <h1
              className="leading-tight mb-4"
              style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", fontSize: "clamp(2.5rem,6vw,4rem)", color: "#F5F4F0", textTransform: "uppercase" }}
            >
              O DOMINÓ<br />
              <span style={{ color: "#E5AE35" }}>DO SEU TIME</span>
            </h1>
            <p className="text-[#A0A0A0] text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Peças personalizadas com o escudo do seu clube do coração. Reúna os amigos, represente sua torcida e jogue com estilo.
            </p>
            <button
              onClick={handleBuy}
              className="font-bold text-base md:text-lg px-10 py-4 rounded-full uppercase tracking-wide transition-all hover:brightness-110 hover:scale-105"
              style={{ background: "#E5AE35", color: "#141414", fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
            >
              QUERO O MEU AGORA!
            </button>
            <div className="flex items-center gap-3 mt-6 justify-center lg:justify-start text-sm text-[#A0A0A0]">
              <Stars />
              <span>+2.000 clientes satisfeitos</span>
              <span>•</span>
              <span>Entrega para todo Brasil</span>
            </div>
          </div>
          {/* Product image */}
          <div className="flex-1 flex justify-center">
            <Image
              src="/images/domino-product-CRFCHRgT.jpg"
              alt="Dominó FC"
              width={480}
              height={480}
              className="object-contain w-full max-w-[420px] rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── WHY ── */}
      <section className="py-16 px-6" style={{ background: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-[#E5AE35] text-xs font-bold tracking-widest mb-2 uppercase">Monte o seu</p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", textTransform: "uppercase" }}
          >
            POR QUE ESCOLHER O <span style={{ color: "#E5AE35" }}>DOMINÓ FC?</span>
          </h2>
          <p className="text-[#A0A0A0] mb-12">Mais do que um jogo, é uma declaração de amor ao seu clube.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🏆", title: "QUALIDADE PREMIUM", desc: "Peças em resina de alta durabilidade com acabamento profissional e pintura detalhada." },
              { icon: "⚽", title: "ESCUDO OFICIAL", desc: "Cada peça com o brasão do seu time gravado com precisão e cores vibrantes." },
              { icon: "🎁", title: "EMBALAGEM ESPECIAL", desc: "Caixa de apresentação elegante, perfeita para presente ou coleção." },
              { icon: "✨", title: "100% PERSONALIZADO", desc: "Seu nome gravado nas peças e na caixa exclusiva. Um dominó único, feito só pra você." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 text-center" style={{ background: "#222" }}>
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", color: "#E5AE35" }}
                >
                  {f.title}
                </h3>
                <p className="text-[#A0A0A0] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM SELECTOR ── */}
      <section className="py-16 px-6" style={{ background: "#141414" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[#E5AE35] text-xs font-bold tracking-widest mb-2 uppercase text-center">Escolha seu time</p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", textTransform: "uppercase" }}
          >
            DE QUAL TORCIDA <span style={{ color: "#E5AE35" }}>VOCÊ É?</span>
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 justify-center mb-6">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: activeTab === tab ? "#E5AE35" : "#222",
                  color: activeTab === tab ? "#141414" : "#F5F4F0",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-3 mb-10">
            {TEAMS[activeTab].map((team) => (
              <button
                key={team.productId}
                onClick={() => setSelected(team)}
                title={team.name}
                className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all hover:scale-110"
                style={{
                  background: selected.productId === team.productId ? "#2a2200" : "#1e1e1e",
                  border: selected.productId === team.productId ? "2px solid #E5AE35" : "2px solid transparent",
                }}
              >
                <Image src={team.image} alt={team.name} width={48} height={48} className="object-contain w-10 h-10" />
                <span className="text-[9px] text-[#A0A0A0] text-center leading-tight hidden sm:block">{team.name}</span>
              </button>
            ))}
          </div>

          {/* Product card */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "#1a1a1a" }}>
            {/* Product image — full width, large */}
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <Image
                src={selected.productImage || selected.image}
                alt={selected.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
            {/* Info below image */}
            <div className="p-6 md:p-8">
              <p className="text-[#E5AE35] text-xs font-bold tracking-widest uppercase mb-1">Dominó FC</p>
              <h3
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", textTransform: "uppercase" }}
              >
                {selected.name}
              </h3>
              <p className="text-[#A0A0A0] text-sm mb-4">28 peças personalizadas + caixa premium</p>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[#666] line-through text-base">R$ 189,90</span>
                <span className="text-3xl font-bold" style={{ color: "#E5AE35", fontFamily: "var(--font-oswald), Oswald, sans-serif" }}>
                  R$ {selected.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p className="text-[#A0A0A0] text-sm mb-6">
                ou 12x de R$ {(selected.price / 12).toFixed(2).replace(".", ",")} sem juros
              </p>

              {/* Name personalization */}
              <div className="mb-5">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "#F5F4F0" }}
                >
                  Qual nome quer no dominó?
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ex: João Silva"
                  maxLength={30}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none placeholder:text-[#666] focus:ring-2"
                  style={{
                    background: "#222",
                    color: "#F5F4F0",
                    border: "1.5px solid #333",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#E5AE35")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#333")}
                />
              </div>

              <button
                onClick={handleBuy}
                className="w-full font-bold text-base px-10 py-4 rounded-full uppercase tracking-wide transition-all hover:brightness-110 hover:scale-105"
                style={{ background: "#E5AE35", color: "#141414", fontFamily: "var(--font-oswald), Oswald, sans-serif" }}
              >
                COMPRAR AGORA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-16 px-6" style={{ background: "#1a1a1a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-10 items-start mb-10">
            {/* Score */}
            <div className="flex-shrink-0 text-center">
              <div
                className="text-7xl font-bold"
                style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", color: "#E5AE35" }}
              >
                4.9
              </div>
              <Stars />
              <p className="text-[#A0A0A0] text-sm mt-1">2.000 avaliações</p>
            </div>
            {/* Bar chart */}
            <div className="flex-1 w-full space-y-2">
              {[
                { stars: 5, count: 1842, pct: 92 },
                { stars: 4, count: 98, pct: 5 },
                { stars: 3, count: 35, pct: 2 },
                { stars: 2, count: 15, pct: 1 },
                { stars: 1, count: 10, pct: 0.5 },
              ].map((r) => (
                <div key={r.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-4 text-right text-[#A0A0A0]">{r.stars}</span>
                  <span className="text-[#E5AE35]">★</span>
                  <div className="flex-1 h-2 rounded-full bg-[#333]">
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "#E5AE35" }} />
                  </div>
                  <span className="w-10 text-[#A0A0A0]">{r.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.name} className="rounded-2xl overflow-hidden" style={{ background: "#222" }}>
                {/* Large portrait photo */}
                <div className="relative w-full" style={{ aspectRatio: "4/5" }}>
                  <Image src={r.img} alt={r.name} fill className="object-cover object-top" />
                </div>
                {/* Review text */}
                <div className="p-4">
                  <Stars />
                  <p className="text-[#F5F4F0] text-sm mt-2 mb-3 leading-relaxed">{r.text}</p>
                  <span className="text-sm font-semibold text-[#E5AE35]">{r.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO ── */}
      <VideoSection />

      {/* ── FAQ ── */}
      <section className="py-16 px-6" style={{ background: "#1a1a1a" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold mb-8 text-center"
            style={{ fontFamily: "var(--font-oswald), Oswald, sans-serif", textTransform: "uppercase" }}
          >
            Perguntas <span style={{ color: "#E5AE35" }}>Frequentes</span>
          </h2>
          <div className="space-y-2">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: "#222" }}>
                <button
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-sm"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-5 h-5 flex-shrink-0 transition-transform"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", color: "#E5AE35" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[#A0A0A0] leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 px-6 text-center" style={{ background: "#111", borderTop: "1px solid #222" }}>
        <Image src="/images/logo-dominofc-1kMaugOL.png" alt="Dominó FC" width={100} height={36} className="object-contain mx-auto mb-4 h-9 w-auto" />
        <p className="text-[#A0A0A0] text-xs mb-4">
          O dominó oficial do torcedor brasileiro. Qualidade premium para quem vive o futebol.
        </p>
        <div className="flex justify-center gap-6 text-xs text-[#666] mb-4">
          <button onClick={handleBuy} className="hover:text-[#E5AE35] transition-colors">Comprar</button>
          <span>|</span>
          <span className="hover:text-[#E5AE35] cursor-pointer transition-colors">Política de Troca</span>
          <span>|</span>
          <span className="hover:text-[#E5AE35] cursor-pointer transition-colors">Termos de Uso</span>
        </div>
        <p className="text-[#444] text-xs">© 2025 Dominó FC. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}
