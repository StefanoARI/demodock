import React, { useState } from 'react';

interface DaNoiPuoiPageProps {
  onOpenBooking: () => void;
  onOpenMenu: () => void;
  onOpenEvents: () => void;
}

type VibeKey = 'coppia' | 'gruppo' | 'sport' | 'veloce';

interface VibeOption {
  key: VibeKey;
  label: string;
  icon: string;
  title: string;
  desc: string;
}

const VIBE_OPTIONS: VibeOption[] = [
  {
    key: 'coppia',
    label: 'In Coppia / Due Amici',
    icon: 'favorite',
    title: 'LA FORMULA PERFETTA: TAVOLO CANDELA & DEGUSTAZIONE',
    desc: 'Tavolo accogliente in Sala Molo con menù Pizza Contemporanea o Grigliata mista, abbinato al percorso “Giro delle Spine” per assaggiare 4 stili di birra differenti guidati dal personale di sala.'
  },
  {
    key: 'gruppo',
    label: 'Tavolata di Amici (6+ pax)',
    icon: 'groups',
    title: 'FORMULA TAVOLATA DI AMICI & FESTA',
    desc: 'Tavoli spaziosi in Sala Gru con caraffe di birra artigianale a fiumi, giro-pizza no-stop caldo e fragrante, taglieri di salumi e i leggendari fritti caldi della banchina da condividere.'
  },
  {
    key: 'sport',
    label: 'Voglio la Partita Live',
    icon: 'sports_soccer',
    title: 'POSTO IN PRIMA FILA MAXISCHERMO SKY SPORT HD',
    desc: 'Posto con visibilità diretta su uno dei tre maxischermi giganti, audio live dello stadio multizona, maxi burger gourmet con patatine rustiche e pinte spillate fresche durante l’intervallo.'
  },
  {
    key: 'veloce',
    label: 'Solo una Pinta al Volo',
    icon: 'local_bar',
    title: 'AL BANCONE DEL MOLO SENZA PRENOTAZIONE',
    desc: 'Siediti direttamente al monumentale bancone da oltre 10 metri: fatti consigliare l’ultima cask ale a pompa o NEIPA fresca dal mastro spillatore e ordina uno sfizio caldo senza attese.'
  }
];

export const DaNoiPuoiPage: React.FC<DaNoiPuoiPageProps> = ({
  onOpenBooking,
  onOpenMenu,
  onOpenEvents
}) => {
  const [selectedVibe, setSelectedVibe] = useState<VibeKey>('coppia');

  const currentVibeData = VIBE_OPTIONS.find((v) => v.key === selectedVibe) || VIBE_OPTIONS[0];

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full bg-[#FAF5EA] text-[#1D1C13]">
      {/* 1. TOP MARQUEE TICKER */}
      <div className="w-full bg-[#191B1A] text-[#FAF5EA] py-2.5 px-4 sm:px-6 lg:px-12 overflow-hidden flex items-center justify-between border-b border-[#333836] shadow-sm">
        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-[#E0A93B] whitespace-nowrap overflow-x-auto no-scrollbar">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#336859] animate-pulse"></span>
            14 SPINE ATTIVE OGGI
          </span>
          <span className="text-[#554245]">/</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7B2039]"></span>
            CUCINA ATTIVA FINO A TARDA NOTTE
          </span>
          <span className="text-[#554245]">/</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-[16px] text-white">sports_soccer</span>
            SKY SPORT HD LIVE IN SALA
          </span>
          <span className="text-[#554245]">/</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined notranslate text-[16px] text-[#336859]">local_parking</span>
            50+ POSTI AUTO RISERVATI GRATUITI
          </span>
          <span className="text-[#554245]">/</span>
          <span className="inline-flex items-center gap-1.5 text-white font-mono">
            CANTÙ • VIA MILANO 71
          </span>
        </div>
        <a
          href="tel:0314487120"
          className="hidden lg:inline-flex items-center gap-1 text-xs text-white uppercase font-black shrink-0 hover:text-[#E0A93B] transition-colors ml-4 bg-white/10 px-3 py-1 rounded"
        >
          <span className="material-symbols-outlined notranslate text-[15px] text-[#E0A93B]">call</span>
          TAVOLI: 031 4487120
        </a>
      </div>

      {/* 2. HERO BANNER WITH CHECKER TRIM & POSTER ATMOSPHERE */}
      <section className="relative w-full bg-[#F3EDDF] py-10 lg:py-16 overflow-hidden">
        <div className="w-full h-3 checker-ribbon"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 flex flex-col gap-8">
          {/* Header Stamp Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="inline-flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-[#7B2039] text-[#FAF5EA] flex flex-col items-center justify-center p-1 text-center shadow-md border-2 border-white">
                <span className="material-symbols-outlined notranslate text-[20px] text-[#E0A93B]">anchor</span>
                <span className="text-[9px] font-black uppercase tracking-tight leading-none mt-0.5">
                  DOCK 71
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#7B2039] uppercase tracking-widest font-black">
                  GUIDA COMPLETA AL MOLO
                </span>
                <span className="text-xs text-[#554245] font-semibold">
                  Wharf Pub, Pizzeria &amp; Craft House Cantù
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 self-start md:self-auto bg-white px-4 py-2 rounded-xl shadow-sm border border-[#E8E2D4] text-[#1D1C13] text-xs font-bold uppercase">
              <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">verified</span>
              <span>Zero coperto segreto • Ingredienti tracciati</span>
            </div>
          </div>

          {/* Main Headline Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#7B2039] uppercase font-black tracking-tight leading-none">
                DA NOI PUOI...<br />
                <span className="text-[#1D1C13]">VIVERE IL PUB</span><br />
                <span className="text-[#336859] italic font-serif">COME PIACE A TE</span>
              </h1>
              <p className="text-base sm:text-lg text-[#554245] max-w-2xl mt-2 leading-relaxed">
                Dock 71 non è solo un posto dove mangiare o bere. È un porto d'attracco caldo e conviviale pensato per ogni momento della tua settimana: dal pranzo smart di lavoro alle sfide roventi di Champions League, dai compleanni con giro-pizza alle chiacchiere fino a tarda notte davanti a una pinta a pompa.
              </p>
            </div>

            {/* Poster Manifesto Card */}
            <div className="lg:col-span-4 bg-[#7B2039] text-[#FAF5EA] p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden border-2 border-[#FAF5EA]">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#5D0624]/50 pointer-events-none"></div>
              <div className="flex flex-col gap-2 relative z-10">
                <span className="text-xs text-[#FF8DA3] uppercase tracking-widest font-bold">
                  IL MANIFESTO DOCK 71
                </span>
                <span className="text-2xl font-black tracking-tight uppercase leading-tight text-white">
                  MALTO, GRIGLIA &amp; ROCK'N'ROLL
                </span>
                <p className="text-xs text-[#F5EFE1]/90 mt-1 italic">
                  “Il peccato è non venire. Il rimedio è ordinare un doppio smash burger e una pinta fresca.”
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between text-[#FFDEAA] text-xs font-bold uppercase">
                <span>Cantù (CO) • Molo 71</span>
                <span className="material-symbols-outlined notranslate text-[20px] text-[#E0A93B]">sports_bar</span>
              </div>
            </div>
          </div>

          {/* Quick Interactive Scroll Anchor Bar */}
          <div className="w-full bg-[#E8E2D4] p-2 rounded-xl shadow-inner overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => scrollToAnchor('esperienza-1')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#7B2039] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#7B2039]">local_pizza</span>
                Pizze &amp; Carni
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-2')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#336859] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#336859]">sports_bar</span>
                14 Spine Artigianali
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-3')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#7B2039] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#7B2039]">tv</span>
                Sky Sport HD Live
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-4')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#336859] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#336859]">celebration</span>
                Feste Private &amp; 18esimi
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-5')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#7B2039] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#7B2039]">groups</span>
                Cene Aziendali
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-6')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#336859] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#336859]">timer</span>
                Pranzo Smart 35min
              </button>
              <button
                onClick={() => scrollToAnchor('esperienza-7')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#191B1A] hover:text-white text-[#1D1C13] text-xs uppercase font-extrabold tracking-wider transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#E0A93B]">liquor</span>
                Dopocena al Bancone
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-3 checker-ribbon-secondary"></div>
      </section>

      {/* 3. BIG COUNTER METRICS BAR */}
      <section className="w-full bg-[#EEE8DA] py-8 px-4 sm:px-6 lg:px-12 border-b border-[#DBC0C3]/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl flex flex-col gap-1 shadow-sm border border-[#E8E2D4]">
            <span className="text-3xl sm:text-4xl text-[#7B2039] font-black leading-none">48h</span>
            <span className="text-xs uppercase tracking-wider text-[#1D1C13] font-black">
              Lievitazione Pizze
            </span>
            <span className="text-xs text-[#554245]">Farine integrali macinate a pietra</span>
          </div>

          <div className="p-4 bg-white rounded-xl flex flex-col gap-1 shadow-sm border border-[#E8E2D4]">
            <span className="text-3xl sm:text-4xl text-[#336859] font-black leading-none">14</span>
            <span className="text-xs uppercase tracking-wider text-[#1D1C13] font-black">
              Spine in Rotazione
            </span>
            <span className="text-xs text-[#554245]">Pompe inglesi reali &amp; isobariche</span>
          </div>

          <div className="p-4 bg-white rounded-xl flex flex-col gap-1 shadow-sm border border-[#E8E2D4]">
            <span className="text-3xl sm:text-4xl text-[#7B2039] font-black leading-none">3</span>
            <span className="text-xs uppercase tracking-wider text-[#1D1C13] font-black">
              Maxischermi 4K
            </span>
            <span className="text-xs text-[#554245]">Audio multi-zona zero angoli ciechi</span>
          </div>

          <div className="p-4 bg-white rounded-xl flex flex-col gap-1 shadow-sm border border-[#E8E2D4]">
            <span className="text-3xl sm:text-4xl text-[#336859] font-black leading-none">35'</span>
            <span className="text-xs uppercase tracking-wider text-[#1D1C13] font-black">
              Garanzia Pranzo
            </span>
            <span className="text-xs text-[#554245]">Tavolo servito o caffè omaggio</span>
          </div>
        </div>
      </section>

      {/* 4. THE 7 GREAT EXPERIENCES (Le 7 Grandi Esperienze del Molo) */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        {/* Intro */}
        <div className="flex flex-col items-center text-center gap-2 max-w-3xl mx-auto">
          <span className="px-3 py-1 bg-[#FFD9DE] text-[#3F0015] rounded-full text-xs uppercase tracking-widest font-black shadow-sm">
            FORMAT &amp; OCCASIONI D'USO
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1D1C13] uppercase font-black tracking-tight">
            TUTTO CIÒ CHE TI ATTENDE AL MOLO
          </h2>
          <p className="text-sm sm:text-base text-[#554245]">
            Dai sapori veraci della griglia alle notti scatenate con birre d'eccellenza, abbiamo costruito ogni spazio di Dock 71 con uno scopo preciso: farti sentire nel posto giusto, in qualsiasi giorno dell'anno.
          </p>
        </div>

        {/* EXPERIENCE 1: Pizza & Grill */}
        <article
          id="esperienza-1"
          className="w-full bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md flex flex-col lg:flex-row gap-8 items-center border border-[#E8E2D4] scroll-mt-24"
        >
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-10 h-10 rounded-full bg-[#7B2039] text-white flex items-center justify-center text-lg font-black shadow">
                01
              </span>
              <span className="text-xs bg-[#FFD9DE] text-[#3F0015] px-3 py-1 rounded-full uppercase tracking-wider font-black">
                GRIGLIA &amp; FARINA
              </span>
              <span className="text-xs text-[#336859] uppercase font-black tracking-wider">
                “Il Piacere è Tutto Vostro”
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl text-[#7B2039] uppercase font-black leading-tight">
              Gustare la Vera Pizza a Lenta Lievitazione (48h) e Carni alla Brace
            </h3>

            <p className="text-sm sm:text-base text-[#554245] leading-relaxed">
              Nessuna scorciatoia. I nostri impasti riposano minimo 48 ore a temperatura controllata per assicurare digeribilità assoluta, cornicione alveolato e fragranza unica, con farine biologiche macinate a pietra. Sulla griglia a pietra lavica sfrigolano tagli selezionati di Black Angus frollati oltre 30 giorni e i leggendari Smash Burger con crosticina croccante Maillard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2 bg-[#F3EDDF] p-3 rounded-xl border border-[#E8E2D4]">
                <span className="material-symbols-outlined notranslate text-[#7B2039] text-[20px] shrink-0 mt-0.5">
                  done_all
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-[#1D1C13] uppercase font-bold">Lievitazione 48 Ore</span>
                  <span className="text-xs text-[#554245]">Digeribilità garantita &amp; zero sete notturna</span>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-[#F3EDDF] p-3 rounded-xl border border-[#E8E2D4]">
                <span className="material-symbols-outlined notranslate text-[#7B2039] text-[20px] shrink-0 mt-0.5">
                  local_fire_department
                </span>
                <div className="flex flex-col">
                  <span className="text-xs text-[#1D1C13] uppercase font-bold">Black Angus &amp; Brace</span>
                  <span className="text-xs text-[#554245]">Frollatura minima 30gg su pietra lavica</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenMenu}
                className="px-5 py-2.5 bg-[#7B2039] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md hover:bg-[#5D0624] transition-all inline-flex items-center gap-2 active:scale-95"
              >
                SFOGLIA IL MENÙ COMPLETO
                <span className="material-symbols-outlined notranslate text-[18px]">restaurant_menu</span>
              </button>
              <span className="text-xs text-[#554245] uppercase font-semibold">
                Consigliato: Abbinamento con Red Ale ambrata
              </span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <div className="relative w-full h-72 sm:h-84 lg:h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAc4FYbvnateXHP87Jto-WB0CCg7BV__qXoa6eBouiGT45tHJljvYrntrHBCC3naIOmDjgm0hhrwCc3cj8GG9WXzvUW0UMf6l2o0Syh-4enlC_5euUIk-Ynr7Kr6QRTYwOrvk3OAyYvsqG5qDqxYUa5vioANphgtwH6VUL-_sSilYyM7qS8DTQ_WAWva9zGzmemnWE1SjnBlIA31sQWroyTn1_5J88VeDciVxW18PUkqEaHlKkPxXtvHQ"
                alt="Pizza artigianale a lenta lievitazione e tagliata al Dock 71 Cantù"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-[#191B1A]/90 text-white px-3.5 py-2 rounded-xl backdrop-blur-sm flex items-center gap-2 shadow-md border border-[#E0A93B]">
                <span className="material-symbols-outlined notranslate text-[#E0A93B] text-[20px]">stars</span>
                <span className="text-xs uppercase font-black tracking-wider">
                  TOP SELLER: SMASH BURGER DEL MOLO
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* EXPERIENCE 2: 14 Taps Craft Beer */}
        <article
          id="esperienza-2"
          className="w-full bg-[#EEE8DA] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md flex flex-col-reverse lg:flex-row gap-8 items-center border border-[#E8E2D4] scroll-mt-24"
        >
          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <div className="relative w-full h-72 sm:h-84 lg:h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBszDT_2df3ukOx8xg1jN4DcDt4CZr8pv63Jo2fzabFxAlrlc-ku5qjx-kEWIe6Bo6XH-hJJqMFtLfIr72r8KDShiu0qjfRNBdqHWNDk0Mu61iv38DoMiQJz72LgaNNIP8EOoeZmh9IrS08N-RRvBJ48fr8bPN24EPex2w1FL9A5ELR65sN68khOAhci1uEF_VT6SJndyECOuSGgnFZI0Mxs9HnJQKDYuC_5xXS-xYa-WTZcsiX9EwhmA"
                alt="14 Vie di Birra Artigianale al bancone Dock 71"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-[#336859] text-white px-3.5 py-1.5 rounded-lg text-xs uppercase tracking-wider font-black shadow-md border border-white">
                GOOD BEER, GREAT FOOD
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-10 h-10 rounded-full bg-[#336859] text-white flex items-center justify-center text-lg font-black shadow">
                02
              </span>
              <span className="text-xs bg-[#B4EBD8] text-[#002019] px-3 py-1 rounded-full uppercase tracking-wider font-black">
                TAPROOM MOLO
              </span>
              <span className="text-xs text-[#7B2039] uppercase font-black tracking-wider">
                14 VIE ATTIVE
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl text-[#1D1C13] uppercase font-black leading-tight">
              Esplorare 14 Vie di Birra Artigianale &amp; Tradizionale
            </h3>

            <p className="text-sm sm:text-base text-[#554245] leading-relaxed">
              Non troverai le solite bionde industriali omologate. Il nostro banco ospita autentiche pompe inglesi “hand-pull” senza spinta di anidride carbonica forzata per goderti le cask ale a temperatura di cantina, oltre a spine isobariche con birre bavaresi non filtrate, tripel belghe d'abbazia e NEIPA fresche di luppolo.
            </p>

            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl border border-[#E8E2D4] shadow-sm">
              <div className="flex items-center justify-between text-[#1D1C13] pb-2 border-b border-[#E8E2D4]">
                <span className="text-xs uppercase font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E0A93B]"></span>
                  Percorso “Il Giro Delle Spine”
                </span>
                <span className="text-xs text-[#336859] font-black">4 ASSAGGI GUIDATI DA 15CL</span>
              </div>
              <div className="flex items-center justify-between text-[#1D1C13] pb-2 border-b border-[#E8E2D4]">
                <span className="text-xs uppercase font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#336859]"></span>
                  Pompe Inglesi Tradizionali
                </span>
                <span className="text-xs text-[#554245]">Zero gas forzato • Vellutata</span>
              </div>
              <div className="flex items-center justify-between text-[#1D1C13]">
                <span className="text-xs uppercase font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7B2039]"></span>
                  Microbirrifici di Brianza &amp; Mondo
                </span>
                <span className="text-xs text-[#554245]">Rotazione settimanale costante</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={onOpenMenu}
                className="px-5 py-2.5 bg-[#336859] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md hover:bg-[#003F32] transition-all inline-flex items-center gap-2 active:scale-95"
              >
                VEDI TAP LIST LIVE
                <span className="material-symbols-outlined notranslate text-[18px]">arrow_forward</span>
              </button>
              <span className="text-xs text-[#554245]">Lavaggio linee ogni 7 giorni certificato</span>
            </div>
          </div>
        </article>

        {/* EXPERIENCE 3: Sky Sport HD */}
        <article
          id="esperienza-3"
          className="w-full bg-[#191B1A] text-[#FAF5EA] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl flex flex-col lg:flex-row gap-8 items-center border-2 border-[#333836] scroll-mt-24"
        >
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="w-10 h-10 rounded-full bg-[#E0A93B] text-[#191B1A] flex items-center justify-center text-lg font-black shadow">
                03
              </span>
              <span className="text-xs bg-[#5A3E00] text-[#E0A93B] px-3 py-1 rounded-full uppercase tracking-wider font-black border border-[#E0A93B]/40">
                SKY SPORT HD ARENA
              </span>
              <span className="text-xs text-[#B4EBD8] uppercase font-black tracking-wider">
                NESSUN ANGOLO CIECO
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl text-white uppercase font-black leading-tight">
              Guardare TUTTO lo Sport Live su Tre Schermi Giganti Sky Sport HD
            </h3>

            <p className="text-sm sm:text-base text-[#D0C6B5] leading-relaxed">
              Serie A, Champions League, Formula 1, MotoGP, Sei Nazioni di rugby e l'Eurolega di Basket: al Dock 71 ogni grande evento si vive come se fossi in curva o a bordo pista. I nostri 3 schermi giganti HD sono posizionati con uno studio visivo a 360°, accompagnati da un sistema audio multizona che ti fa sentire ogni coro da stadio o rombo di motore.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex flex-col gap-1 border border-white/10">
                <span className="material-symbols-outlined notranslate text-[#E0A93B] text-[22px]">sports_soccer</span>
                <span className="text-xs text-white font-bold uppercase">Calcio &amp; Coppe</span>
                <span className="text-xs text-white/70">Tutte le partite in chiaro HD</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex flex-col gap-1 border border-white/10">
                <span className="material-symbols-outlined notranslate text-[#FF8DA3] text-[22px]">sports_motorsports</span>
                <span className="text-xs text-white font-bold uppercase">F1 &amp; Moto GP</span>
                <span className="text-xs text-white/70">Qualifiche e gare della domenica</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex flex-col gap-1 border border-white/10">
                <span className="material-symbols-outlined notranslate text-[#B4EBD8] text-[22px]">sports_rugby</span>
                <span className="text-xs text-white font-bold uppercase">Rugby &amp; Basket</span>
                <span className="text-xs text-white/70">6 Nazioni &amp; Playoff canturini</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 bg-[#7B2039] hover:bg-[#A83250] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md transition-all inline-flex items-center gap-2 active:scale-95 border border-[#FF8DA3]"
              >
                PRENOTA POSTO PER LA PARTITA
                <span className="material-symbols-outlined notranslate text-[18px]">event_seat</span>
              </button>
              <span className="text-xs text-white/70">Prenotazione anticipata consigliata per i big match</span>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <div className="relative w-full h-72 sm:h-84 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#333836]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0OxtOgHB8N8cwGl4RIXQZvsx81xyZDuB-yArCGJ1K-8M1wOF3GlkgQ2agAAB2duWhC_61eg8wOtAokjQEmn9XEfTqCoIbwz4XwO3GS-kMw9zu_Rjtwo2PewMeDUgfltNLZXL7qwX71qDCkOpNDIAGdJ7iPrn2cxgAHN_jvwkqicc1GN6LdVnajJklHf9BD_afkYzfuE_XYG3d7HmZB9cPVWezjA1jZ1EfKPK4WfXP6V5w-FSBkpvKXA"
                alt="Sky Sport Live Schermi al Dock 71"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-[#7B2039] text-white px-3.5 py-2 rounded-xl shadow-md text-xs uppercase font-black flex items-center gap-2 border border-white">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E0A93B] animate-ping"></span>
                SCHERMI ATTIVI TUTTI I GIORNI
              </div>
            </div>
          </div>
        </article>

        {/* EXPERIENCE 4 & 5 Bento Row (Feste Private & Cene Aziendali) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EXPERIENCE 4: Feste Private */}
          <article
            id="esperienza-4"
            className="bg-[#F9F3E5] rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between gap-6 border border-[#E8E2D4] scroll-mt-24"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#7B2039] text-white flex items-center justify-center text-sm font-black">
                    04
                  </span>
                  <span className="text-xs bg-[#FFD9DE] text-[#3F0015] px-2.5 py-0.5 rounded-full uppercase font-black">
                    FESTE PRIVATE
                  </span>
                </div>
                <span className="text-xs text-[#336859] font-black uppercase">DA 10 A 80 PERSONE</span>
              </div>

              <h3 className="text-2xl text-[#7B2039] uppercase font-black leading-tight">
                Organizzare Feste Private &amp; Compleanni Esclusivi
              </h3>

              <p className="text-sm text-[#554245] leading-relaxed">
                Diciottesimi senza ingessature, feste di laurea indimenticabili, addii al celibato o ritrovi storici di classe: al Dock 71 la festa è festa vera. Mettiamo a disposizione l'esclusiva <strong>Sala Gru</strong> o la veranda, formule giro-pizza no-stop, birra artigianale a caraffe e gestione del taglio torta con spumante.
              </p>

              <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2 border border-[#E8E2D4]">
                <span className="text-xs uppercase font-black text-[#1D1C13]">
                  COSA INCLUDE IL PACCHETTO FESTE:
                </span>
                <ul className="flex flex-col gap-2 text-xs text-[#554245]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">check_circle</span>
                    Giro-pizza illimitato con 6 gusti a rotazione continua
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">check_circle</span>
                    Antipasti fritti caldi della banchina (chips artigianali, polpette)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">check_circle</span>
                    Playlist personalizzabile o possibilità di musica concordata
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">check_circle</span>
                    Servizio torta e brindisi senza sovrapprezzo ridicolo
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D4] flex-wrap gap-3">
              <button
                onClick={onOpenEvents}
                className="px-4 py-2 bg-[#7B2039] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md hover:bg-[#5D0624] transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                RICHIEDI PREVENTIVO FESTA
                <span className="material-symbols-outlined notranslate text-[16px]">celebration</span>
              </button>
              <span className="text-xs text-[#554245] font-semibold">Spazio riservato / Area dedicata</span>
            </div>
          </article>

          {/* EXPERIENCE 5: Cene Aziendali */}
          <article
            id="esperienza-5"
            className="bg-[#F3EDDF] rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between gap-6 border border-[#E8E2D4] scroll-mt-24"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#336859] text-white flex items-center justify-center text-sm font-black">
                    05
                  </span>
                  <span className="text-xs bg-[#B4EBD8] text-[#002019] px-2.5 py-0.5 rounded-full uppercase font-black">
                    AZIENDE &amp; TEAM
                  </span>
                </div>
                <span className="text-xs text-[#7B2039] font-black uppercase">FATTURA ELETTRONICA SDI</span>
              </div>

              <h3 className="text-2xl text-[#336859] uppercase font-black leading-tight">
                Fare Cene Aziendali &amp; Team Building Informali
              </h3>

              <p className="text-sm text-[#554245] leading-relaxed">
                Basta cene aziendali silenziose e noiose in ristoranti formali. Porta il tuo gruppo di lavoro dove ci si diverte, si mangia carne alla griglia di prim'ordine e si brinda insieme. Proponiamo menù a prezzo fisso concordato a persona con bevande incluse, zero sorprese sullo scontrino e maxischermi utilizzabili.
              </p>

              <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2 border border-[#E8E2D4]">
                <span className="text-xs uppercase font-black text-[#1D1C13]">
                  VANTAGGI PER LE IMPRESE DI CANTÙ &amp; COMO:
                </span>
                <ul className="flex flex-col gap-2 text-xs text-[#554245]">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039] text-[18px]">verified_user</span>
                    Menù concordato con formula tutto compreso
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039] text-[18px]">receipt_long</span>
                    Fatturazione elettronica immediata con codice SDI / PEC
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039] text-[18px]">devices</span>
                    Collegamento schermi per presentazioni o video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039] text-[18px]">directions_car</span>
                    Ampio parcheggio privato gratuito per tutti i colleghi
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D4] flex-wrap gap-3">
              <button
                onClick={onOpenEvents}
                className="px-4 py-2 bg-[#336859] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md hover:bg-[#003F32] transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                PACCHETTI AZIENDALI
                <span className="material-symbols-outlined notranslate text-[16px]">business_center</span>
              </button>
              <span className="text-xs text-[#554245] font-semibold">Referente dedicato al molo</span>
            </div>
          </article>
        </div>

        {/* EXPERIENCE 6 & 7 Bento Row (Pausa Pranzo Smart & Dopocena Cocktails) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* EXPERIENCE 6: Pranzo di Lavoro Smart (col-span 7) */}
          <article
            id="esperienza-6"
            className="lg:col-span-7 bg-[#F9F3E5] rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between gap-6 border border-[#E8E2D4] scroll-mt-24"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#7B2039] text-white flex items-center justify-center text-sm font-black">
                    06
                  </span>
                  <span className="text-xs bg-[#FFDEAA] text-[#271900] px-2.5 py-0.5 rounded-full uppercase font-black">
                    LUNEDÌ - VENERDÌ 12:00 - 14:30
                  </span>
                </div>
                <span className="text-xs bg-[#336859] text-white px-2.5 py-0.5 rounded-full uppercase font-black">
                  GARANZIA 35 MINUTI
                </span>
              </div>

              <h3 className="text-2xl text-[#7B2039] uppercase font-black leading-tight">
                Pausa Pranzo di Lavoro Smart e Veloce
              </h3>

              <p className="text-sm text-[#554245] leading-relaxed">
                Lavori a Cantù, Mariano Comense o nei distretti del mobile? La tua pausa pranzo merita gusto e zero perdite di tempo. Piatti espressi preparati ogni mattina dai nostri cuochi: pasta fresca, tagliate veloci, insalatone ricche, burger leggeri e pizze al piatto con la nostra formula garantita in 35 minuti.
              </p>

              {/* Price Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col border border-[#E8E2D4]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#1D1C13] uppercase font-bold">MENU PRIMO</span>
                    <span className="text-xl text-[#7B2039] font-black">12€</span>
                  </div>
                  <span className="text-xs text-[#554245] mt-1">
                    Primo del giorno + Acqua microfiltrata + Pane fatto in casa + Caffè espresso
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col border border-[#E8E2D4]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#1D1C13] uppercase font-bold">MENU SECONDO / PIZZA</span>
                    <span className="text-xl text-[#336859] font-black">14€</span>
                  </div>
                  <span className="text-xs text-[#554245] mt-1">
                    Secondo alla griglia o Pizza classica + Contorno + Acqua + Caffè espresso
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-[#E8E2D4] flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[#1D1C13] text-xs uppercase font-bold">
                <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">wifi</span>
                Wi-Fi ultraveloce per laptop
              </div>
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 bg-[#7B2039] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md hover:bg-[#5D0624] transition-all inline-flex items-center gap-1.5 active:scale-95"
              >
                PRENOTA PRANZO SMART
                <span className="material-symbols-outlined notranslate text-[16px]">restaurant</span>
              </button>
            </div>
          </article>

          {/* EXPERIENCE 7: Dopocena Bancone (col-span 5) */}
          <article
            id="esperienza-7"
            className="lg:col-span-5 bg-[#191B1A] text-[#FAF5EA] rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between gap-6 border-2 border-[#333836] scroll-mt-24"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-[#E0A93B] text-[#191B1A] flex items-center justify-center text-sm font-black">
                    07
                  </span>
                  <span className="text-xs bg-[#5A3E00] text-[#E0A93B] px-2.5 py-0.5 rounded-full uppercase font-black border border-[#E0A93B]/40">
                    FINO ALLE 02:00
                  </span>
                </div>
                <span className="text-xs text-[#E0A93B] font-black uppercase">IL BANCONE</span>
              </div>

              <h3 className="text-2xl text-white uppercase font-black leading-tight">
                Bere Bene la Sera &amp; Dopocena al Bancone
              </h3>

              <p className="text-sm text-[#D0C6B5] leading-relaxed">
                La notte al Molo comincia quando gli altri chiudono la serranda. Un bancone in legno massello lungo oltre 10 metri dove gustare oltre 30 referenze di Gin premium botanici, amari d'erbe lombardi, whiskey torbati e cocktail classici miscelati a regola d'arte, con stuzzichini caldi dalla cucina sempre accesa.
              </p>

              <div className="flex flex-col gap-2 bg-white/10 p-3 rounded-xl backdrop-blur-sm mt-1 border border-white/10">
                <div className="flex justify-between items-center text-xs uppercase">
                  <span className="text-white font-bold">Gin &amp; Botaniche</span>
                  <span className="text-[#E0A93B] font-black">30+ Etichette</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase">
                  <span className="text-white font-bold">Amari &amp; Bitter Artigianali</span>
                  <span className="text-[#E0A93B] font-black">Selezione Locale</span>
                </div>
                <div className="flex justify-between items-center text-xs uppercase">
                  <span className="text-white font-bold">Snack Notturni dalla Friggitrice</span>
                  <span className="text-[#E0A93B] font-black">Sempre Attivi</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/20">
              <span className="text-xs text-[#E0A93B] uppercase font-bold">
                Zero prenotazione richiesta per il bancone
              </span>
              <span className="material-symbols-outlined notranslate text-[#E0A93B] text-[24px]">local_bar</span>
            </div>
          </article>
        </div>
      </section>

      {/* 5. LOGISTICS & COMFORT PILLARS */}
      <section className="w-full bg-[#F3EDDF] py-16 px-4 sm:px-6 lg:px-12 border-t border-b border-[#DBC0C3]/50">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#336859] font-black uppercase tracking-widest">
                PERCHÉ DOCK 71 È COSÌ COMODO
              </span>
              <h2 className="text-3xl sm:text-4xl text-[#1D1C13] uppercase font-black tracking-tight leading-tight">
                ZERO STRESS, SOLO DIVERTIMENTO
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#554245] max-w-md">
              Non devi impazzire a cercare parcheggio per 40 minuti o preoccuparti di gradini insormontabili. Abbiamo curato l'accessibilità in ogni dettaglio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Parking */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-3 border border-[#E8E2D4]">
              <div className="w-12 h-12 rounded-xl bg-[#FFD9DE] text-[#7B2039] flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[28px]">local_parking</span>
              </div>
              <h3 className="text-xl text-[#7B2039] uppercase font-black">
                Parcheggio Gratuito 50+ Posti
              </h3>
              <p className="text-sm text-[#554245]">
                Un piazzale riservato e illuminato proprio davanti all'ingresso del pub in Via Milano 71. Niente strisce blu, niente multe e niente lunghe camminate al freddo.
              </p>
              <span className="mt-auto pt-2 text-xs text-[#336859] uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-[16px]">check</span>
                Posti riservati disabili adiacenti all'ingresso
              </span>
            </div>

            {/* Pillar 2: Accessibility & Family */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-3 border border-[#E8E2D4]">
              <div className="w-12 h-12 rounded-xl bg-[#B4EBD8] text-[#002019] flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[28px]">accessible_forward</span>
              </div>
              <h3 className="text-xl text-[#336859] uppercase font-black">
                100% Accessibile &amp; Family Friendly
              </h3>
              <p className="text-sm text-[#554245]">
                Locale interamente a piano terra, privo di barriere architettoniche per carrozzine e passeggini. Disponiamo di seggioloni per bambini e bagni ampi e attrezzati.
              </p>
              <span className="mt-auto pt-2 text-xs text-[#7B2039] uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-[16px]">check</span>
                Animali ammessi con ciotola d'acqua fresca
              </span>
            </div>

            {/* Pillar 3: Fast Wi-Fi & Work Friendly */}
            <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col gap-3 border border-[#E8E2D4]">
              <div className="w-12 h-12 rounded-xl bg-[#FFDEAA] text-[#271900] flex items-center justify-center">
                <span className="material-symbols-outlined notranslate text-[28px]">wifi</span>
              </div>
              <h3 className="text-xl text-[#1D1C13] uppercase font-black">
                Fibra Ultraveloce &amp; Smart Working
              </h3>
              <p className="text-sm text-[#554245]">
                Wi-Fi Gigabit gratuito su tutta l'area del locale e prese elettriche disponibili ai tavoli per chi vuole fare un meeting informale o continuare a lavorare a pranzo.
              </p>
              <span className="mt-auto pt-2 text-xs text-[#336859] uppercase font-bold flex items-center gap-1">
                <span className="material-symbols-outlined notranslate text-[16px]">check</span>
                Spazio tranquillo nelle fasce 12:00 - 15:00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE VIBE SELECTOR CONFIGURATOR */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="bg-[#F9F3E5] rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col gap-6 border-2 border-[#E8E2D4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#7B2039] font-black uppercase tracking-wider">
                CONFIGURATORE RAPIDO
              </span>
              <h3 className="text-2xl sm:text-3xl text-[#1D1C13] uppercase font-black">
                NON SAI COSA SCEGLIERE? TROVA IL TUO TAVOLO
              </h3>
            </div>
            <span className="text-xs text-[#554245] uppercase font-semibold">
              Seleziona chi sei stasera:
            </span>
          </div>

          {/* Selector Buttons */}
          <div className="flex flex-wrap gap-2.5">
            {VIBE_OPTIONS.map((opt) => {
              const isActive = opt.key === selectedVibe;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedVibe(opt.key)}
                  className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black shadow-sm transition-all active:scale-95 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#7B2039] text-white shadow-md ring-2 ring-[#7B2039] ring-offset-2'
                      : 'bg-white hover:bg-[#EEE8DA] text-[#1D1C13] border border-[#E8E2D4]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">
                    {opt.icon}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Reaction Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all border border-[#E8E2D4]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD9DE] text-[#7B2039] flex items-center justify-center shrink-0 shadow-sm border border-[#7B2039]/20">
                <span className="material-symbols-outlined notranslate text-[28px]">
                  {currentVibeData.icon}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#7B2039] uppercase font-black">
                  {currentVibeData.title}
                </span>
                <p className="text-sm text-[#554245] mt-1 leading-relaxed">
                  {currentVibeData.desc}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenBooking}
              className="shrink-0 px-6 py-3 bg-[#7B2039] hover:bg-[#5D0624] text-white rounded-xl text-xs uppercase tracking-wider font-black shadow-md transition-all inline-flex items-center gap-2 active:scale-95 self-stretch md:self-auto justify-center"
            >
              PRENOTA QUESTO TAVOLO
              <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION: THE DOCK CALLS WITH CHECKER FRAME */}
      <section className="w-full bg-[#7B2039] text-white py-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden shadow-2xl">
        <div className="w-full h-3 checker-ribbon absolute top-0 left-0"></div>

        <div className="max-w-4xl mx-auto py-8 flex flex-col items-center text-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-[#FAF5EA] text-[#7B2039] flex items-center justify-center shadow-lg border-2 border-white">
            <span className="material-symbols-outlined notranslate text-[32px]">anchor</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs text-[#FF8DA3] uppercase tracking-widest font-black">
              IL TUO POSTO AL MOLO
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-white uppercase font-black tracking-tight leading-tight">
              QUALUNQUE SIA IL TUO PIANO PER STASERA, C'È UN POSTO CHE TI ASPETTA
            </h2>
            <p className="text-base sm:text-lg text-[#F5EFE1]/90 max-w-2xl mx-auto mt-2">
              I tavoli nei weekend e durante le serate di Champions League volano in fretta. Blocca il tuo posto in un click oppure scrivici direttamente su WhatsApp per richieste speciali o grandi compagnie.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-2">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 bg-[#E0A93B] hover:bg-[#C88D42] text-[#191B1A] rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-black shadow-lg transition-all inline-flex items-center justify-center gap-2 active:scale-95 border-2 border-[#191B1A]"
            >
              PRENOTA IL TUO TAVOLO ORA
              <span className="material-symbols-outlined notranslate text-[20px]">calendar_month</span>
            </button>
            <a
              href="https://wa.me/390314487120?text=Ciao%20Dock%2071!%20Vorrei%20informazioni%20per%20un%20tavolo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#336859] hover:bg-[#003F32] text-white rounded-2xl text-xs sm:text-sm uppercase tracking-wider font-black shadow-lg transition-all inline-flex items-center justify-center gap-2 active:scale-95 border-2 border-white"
            >
              SCRIVICI SU WHATSAPP
              <span className="material-symbols-outlined notranslate text-[20px]">chat</span>
            </a>
          </div>

          {/* Micro Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#FFD9DE] uppercase mt-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-[16px] text-[#E0A93B]">done</span>
              Conferma Immediata via SMS
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-[16px] text-[#E0A93B]">done</span>
              Nessuna Carta Richiesta
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined notranslate text-[16px] text-[#E0A93B]">done</span>
              Parcheggio Riservato Incluso
            </span>
          </div>
        </div>

        <div className="w-full h-3 checker-ribbon-secondary absolute bottom-0 left-0"></div>
      </section>
    </div>
  );
};
