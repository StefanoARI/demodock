import React, { useState, useMemo } from 'react';
import { GalleryImage } from '../data/pubData';
import { useSiteData } from '../context/SiteDataContext';

export interface GalleryItemData {
  id: string;
  category: 'pizza' | 'burger' | 'birre' | 'locale' | 'community';
  cols: string; // Tailwind grid columns
  ribbonClass: string;
  image: string;
  badge1: string;
  badge2?: string;
  badge1Color: string;
  kicker?: string;
  title: string;
  description: string;
  icon?: string;
  extraBadges?: string[];
}

export const GALLERY_PAGE_ITEMS: GalleryItemData[] = [
  {
    id: 'gal-gru-1912',
    category: 'locale',
    cols: 'md:col-span-8',
    ribbonClass: 'checker-ribbon-secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbHjns7VR6Rr1uJ0S5_Yi1uLWl05JYXwHcC72Y_BOYJYLZWuG_ThJaFCqHb0u5xGv9AniOlkshCx4CbFgMdcbNF5jH1R6-_5nWtaRq5PiDzVJOtMb9RpAdzE0s1nQF-dvsiKKTzu6OjqrvEZLId2J96Gwq27i2Am8v6dO4pjq1vLSozu6aTmvkyEKQ96grjQG3iiQ8lLzSCSrOyDu3pCmXsVSZduibkkcmL-gnQdCPgR42JR-MUav47A',
    badge1: 'PEZZO UNICO DEL 1912',
    badge1Color: 'bg-[#336859] text-[#FAF5EA]',
    badge2: 'SALA GRU NAVALE',
    title: 'La Maestosa Sala Gru Navale',
    description: 'Il cuore pulsante del molo: cenare sotto una vera gru portuale d\'epoca restaurata a regola d\'arte.',
    icon: 'anchor'
  },
  {
    id: 'gal-taps-14',
    category: 'birre',
    cols: 'md:col-span-4',
    ribbonClass: 'checker-ribbon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqnjiAskv6TSQWMwwPiP1NvexXsfawR13qj5Fk88Gj6mEkzQDp0Np-2wyTWPSfKDlomb3fqngmQlwRNA-V87BUD0PVcyrUNLiAgIHO2hwNuPUUcmzeU6Fn5rKBw9TIAWQL5MaBOqHTOex5sy0H-YiRUGGvuUv2slhrdF7EuAGbHZhx22_HNe1xnos-2bK1ZbnzWg6i4BsLTJxm9VVG4Qq-n56lM5dqWR5GFV83KC3e5sNuXeswjK8Eeh2pBhdpamCV-jc',
    badge1: '14 TAP ON BOARD',
    badge1Color: 'bg-[#ffdeaa] text-[#271900]',
    kicker: 'TAP LIST VIVA',
    title: 'Pinte Fresche & Schiuma Perfetta',
    description: 'Dalle luppolate IPA ai sentori tostati di Stout e Lager non filtrate da mastri birrai locali e internazionali.'
  },
  {
    id: 'gal-smash-burger',
    category: 'burger',
    cols: 'md:col-span-4',
    ribbonClass: 'checker-ribbon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAscAY2jW2mVE9xmZKYOhmcwKDzHuy33sE-WgeeQt7WcTH3-KvKaG2VPAEIm3RpyfYHOhK1PeNCrbwAl3O-0cajAg29hg7q-1LM0UZibIjGOljeLy7i5Kfp04DklHvguESZqS_AcBwB-HWa2GFAmMt6pLsBcNjWBpO7xOHRkdcFh0df_nUe4q305syGXuc-RTQDGuUF9UAsz1j89BSqIPOlI-asHuFiRR0go71nGlH8OJf1HpEVlAKPcZ91pKHnQALHDk4',
    badge1: 'GRIGLIA ROVENTE',
    badge1Color: 'bg-[#5d0624] text-[#ffffff]',
    title: 'Dockyard Double Smash Burger',
    description: 'Carne scelta piastrata ad altissima temperatura, crosticina irresistibile e bun artigianale al burro.'
  },
  {
    id: 'gal-pizza-special',
    category: 'pizza',
    cols: 'md:col-span-4',
    ribbonClass: 'checker-ribbon-secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnjef50GSVYfWN1l1lqlXfYLJa-EODPBW22VR0tqPqmy7l1lQHXyShCjLEEebRfO5trJ0AmckPNJM-et6s-W5Ncd4ZwpQ8g5mvTVNIOZSJviOw0em2Tbk2KZ51IX91ocXsbcxQpoqxPLNbnxvB2otbuOiySVxuCAR8bjqRmdymm2G2yd2NLD9ImX1qZa1ljYg7G5xeFfA24fQn-JWCq2sRNT2CknSZj4ideROjSAnOCW6mHpdrxOck-0PjCymtM9bzjJk',
    badge1: 'FARINA & BIGA',
    badge1Color: 'bg-[#336859] text-[#FAF5EA]',
    title: 'Pizza Dock 71 Special',
    description: 'Bordo alto, alveolatura ariosa e impasto maturato 48 ore. Leggerezza senza compromessi sul sapore.'
  },
  {
    id: 'gal-oak-counter',
    category: 'birre',
    cols: 'md:col-span-4',
    ribbonClass: 'checker-ribbon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNA_BNzG4J0CIg4rn6heFz4pIZ7sWQqAEcLaqfCe4i-qGtLWrEVbhj7fl0fITCuKio0ryTK9ximJ1QJ03vW4uIbSlMLJJM2b92YSfNngIl8A1RE3dCQJvlbhMt3pQPoAUpXyVxzni-nZ-RxSIfRpwPj_7rvQqszTJnuXc51pYbOCa9Z14da0sUKTAghPH-3naAo4e9-yGH8vwYkSkbexZoqo1_T41qZXc7X51g_s3ZLoYYloJ3PnewXQ',
    badge1: 'ROVERE & OTTONE',
    badge1Color: 'bg-[#333027] text-[#fff9eb]',
    title: 'Il Grande Bancone Mastodonte',
    description: '10 metri lineari di rovere massiccio dove scambiare due chiacchiere e assaggiare le novità spillate al momento.'
  },
  {
    id: 'gal-black-angus',
    category: 'burger',
    cols: 'md:col-span-6',
    ribbonClass: 'checker-ribbon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHmE_s-yvO53J1M7aHv9NoKUmjLZvINm6sljgg21jifSHBadruhFTs4VAExQqOx21RRQPDV237NnaccoowcnRSAKwl5Lmi_kB3X4NvfhiqAWvWtoGS0m7JhQL5TYaY3MVGR-BUhFxaxOvQwdxpLIa5Itl9vu1s80Qr8rgw4BSv3pLlFGkskq7VYEx9-5B-eJy9chpKlXuU9UGWNO4cjnmxfLIu7ririIpuU2U3XNGz6sQ5Ms7but4xqw',
    badge1: 'BRACERIA D\'ECCELLENZA',
    badge1Color: 'bg-[#7b2039] text-[#ffffff]',
    title: 'Tagliata di Black Angus su Pietra Lavica',
    description: 'Carne frollata 35 giorni, servita sfrigolante al tavolo con rucola selvatica, pomodorini confit e scaglie di Grana Padano 24 mesi.'
  },
  {
    id: 'gal-dehor-twilight',
    category: 'locale',
    cols: 'md:col-span-6',
    ribbonClass: 'checker-ribbon-secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYj--Zk4j3qz-SfhW_5S2488_Vcy4_G2fEbpAL_i5ro9z44i3o9R1ygOfjVYN5pQYXAMU_rpq5ttZNQhan_Z-9mGMHvRHoLdYfI9mjGFnFDA8NNtuOM0o8-hLAx5u0a8gxbcgftcRD03JEUp-8z3yRHrBJr-gdl9nm6_XsiohrswUt7993Cq5KAhm7xVi13dHnkzG0PprUO-15ahONaOyX_gIasXktc_JJDnlppOT9fNYdeaCNjjGYHg',
    badge1: 'ESTATE AL MOLO',
    badge1Color: 'bg-[#336859] text-[#FAF5EA]',
    title: 'Il Dehor Estivo Sotto le Luminarie',
    description: 'L\'aria fresca delle serate canturine, la brezza del dehor e il tintinnio dei bicchieri illuminati da lampadine vintage.'
  },
  {
    id: 'gal-match-community',
    category: 'community',
    cols: 'md:col-span-12',
    ribbonClass: 'checker-ribbon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkqHsVzsi8x5trgc1saBzEcpDq3SSfAYC6u-R3L8PsvWgjI1VShuIwNQajk7080A9WmkojAp6zdkOsdyxr1gTtakoJQbqWegiijbLF8JlWE3AeabvpyPGGTGpvgM6jWDCgZbuRdKvum9dOytu-IH3LcwyJTbgz53EGpfWFj19ebNZUwMOeXvNLgE0J16xM7YSNi9MhE3w_NH0aJqH1yr75qXIQiVuevESkOnRRskWejxKsW6LObFwKBQ',
    badge1: 'SKY SPORT MATCH NIGHT',
    badge1Color: 'bg-[#ffdeaa] text-[#271900]',
    kicker: 'EMOZIONI IN DIRETTA',
    title: 'Maxischermi Sky Sport & Convivialità',
    description: 'Non c\'è niente di meglio di un burger colante, una pinta gelata e i novanta minuti più tesi della settimana con gli amici di sempre. Trasmettiamo tutti i big match di Serie A, Champions League, Rugby Sei Nazioni e Formula 1.',
    extraBadges: ['Audio Immersivo', 'Tavolate Numerose', 'Prenotazione Consigliata']
  }
];

export const POLAROID_ITEMS = [
  {
    id: 'pol-1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCK9DqGPF2iry3qBle1f_L8aKWKi5iw2VyoS78rOEBfC4yTGcy5jN8Z-c1a3FZ7gl4Va59t2lC2xm8AZs50MYAWBZqRT0meJi2vOUwjSrYzRXWarL3QWaGQ7HpUOnNlC5fnEX784gk6eK8wjGTBoghtkbv7w0dN54JGksBmyEo04fb5ebiQhltNW1VdJg83xcJL3LxzcaVRXhY8jL_amAyuuwRZ1WULFJdNATqaplTkv00B6SSKOaV-Q',
    handle: '@marco_beerhunter',
    caption: 'Venerdì Sera 🔥',
    rotation: '-rotate-2'
  },
  {
    id: 'pol-2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKcPTROsm2pMcXC9slytVtprFO5evrZtdwU4Ao5tXSdCZsMT9X3Um2NcOlLhGmKR5O5uQ1vMVhUN1vMlDzZPl815IHOoKktfOuWRwdHkZCZU5WzeROva7YaFAlpsBdeWtEa0mwABQJ-6ShXrJE8urD6ZXrHOQ45D7ub128amiGhpye0eG1_qBrqi_ic9scbfsowreBwdcYN9G8ixk_yYAOXxLKSVVJEIuzLzl-zc1dOueegBijdo_UGg',
    handle: '@giulia_foodlover',
    caption: 'Bite of Heaven 🍔',
    rotation: 'rotate-2'
  },
  {
    id: 'pol-3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBafS-_rlQPo7J64oh98Fc9xwFaHVjwuSoAEulocqvbxeem2UIxgvPzxD1fy-FmX6UoJbdYbnwxmyax6RKTTk5h0bT1n_mYA_L8G80_1hAF9-iHOI7G9ebzx53sJUmKh5yGOaYYHNhkl3SNDqNp9tXG9AHmZR71mjTY5HvoBbndFuNOGwUURR63KssSHw4Vjx3m8k8pcWUTe-bvl05iCfYXwoqzzkI3uSh2dCfaxpco2q-1xIuLTKDW7A',
    handle: '@la_ciurma_cantu',
    caption: 'Tavolata Storica ⚓',
    rotation: '-rotate-1'
  },
  {
    id: 'pol-4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn2bx6fH1mTR70aDO-7DuIu-QS-7FhZv21qv_k3fOKw4rkpYLT6H0qptvvJRgt6ZdiSDsq6F6dV4fwIyS4luQunjj10iMAAstJ_XhswEY7vh9VVzSnpASkZ5NMoa3WY3CbehfWkrqXcX_zbdXnsBRopMCw3_Tlb76TlGvr_wFRWT-6AyH3l6vZgkF2jOUrmrBNOzLV8lDyWsvF8k-MaaaPWpOYiOXdkWK7lBPmXN63bCCXiAGjDmXg4w',
    handle: '@alessio_taster',
    caption: '48h Biga Lover 🍕',
    rotation: 'rotate-3'
  }
];

interface GalleryPageProps {
  onOpenBooking: () => void;
  onSelectImage: (img: GalleryImage) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onOpenBooking,
  onSelectImage
}) => {
  const { galleryItems } = useSiteData();
  const [filter, setFilter] = useState<'all' | 'pizza' | 'burger' | 'birre' | 'locale' | 'community'>('all');

  // Combina gli elementi aggiunti/caricati dal backend con la collezione di default
  const displayItems = useMemo(() => {
    const customItems: GalleryItemData[] = galleryItems
      .filter(g => !GALLERY_PAGE_ITEMS.some(p => p.id === g.id))
      .map((g, index) => ({
        id: g.id,
        category: (g.category === 'cucina' ? 'pizza' : g.category === 'terrazza' ? 'locale' : g.category) as any,
        cols: index % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4',
        ribbonClass: index % 2 === 0 ? 'checker-ribbon' : 'checker-ribbon-secondary',
        image: g.url,
        badge1: g.badge || 'DOCK 71 GALLERY',
        badge1Color: 'bg-[#7b2039] text-[#ffffff]',
        title: g.title,
        description: g.caption,
        icon: 'photo_camera'
      }));

    return [...customItems, ...GALLERY_PAGE_ITEMS];
  }, [galleryItems]);

  const filteredItems = displayItems.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div className="w-full bg-[#fff9eb] text-[#1d1c13] font-body-md min-h-screen">
      {/* SECTION 1: HERO MANIFESTO & CHECKERBOARD CROWN */}
      <section className="relative w-full bg-[#336859] text-[#fff9eb] overflow-hidden pt-12 pb-16 px-4 sm:px-6 md:px-10">
        <div className="w-full h-4 checker-ribbon absolute top-0 left-0 right-0 z-10"></div>
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-20">
          {/* Stamp Emblem Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#fff9eb] text-[#336859] shadow-[3px_3px_0px_#1d1c13] mb-6">
            <span className="material-symbols-outlined notranslate text-[18px]">photo_library</span>
            <span className="font-epilogue text-[11px] uppercase tracking-widest font-black">
              ARCHIVIO VISIVO DEL PORTO DI CANTÙ
            </span>
          </div>

          {/* Main Headline - Bold Retro Character */}
          <h1 className="font-chunky text-4xl sm:text-5xl md:text-[76px] md:leading-[80px] tracking-tight uppercase max-w-4xl text-[#fff9eb]">
            IL GUSTO &amp; L'ANIMA <br />
            <span className="text-[#f5bd57] drop-shadow-[2px_2px_0px_#1d1c13]">
              DEL DOCK
            </span>
          </h1>

          {/* Slogan Strips */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-6">
            <span className="bg-[#5d0624] text-white font-epilogue font-extrabold text-base sm:text-xl px-4 py-1 uppercase rounded-sm shadow-[2px_2px_0px_#1d1c13] transform -rotate-1">
              MALTO • GRIGLIA • ROCK'N'ROLL
            </span>
            <span className="bg-[#3d2900] text-white font-epilogue font-extrabold text-base sm:text-xl px-4 py-1 uppercase rounded-sm shadow-[2px_2px_0px_#1d1c13] transform rotate-1">
              PIZZA • BURGER • BIRRA
            </span>
          </div>

          <p className="font-work text-base sm:text-lg text-[#f3eddf] max-w-2xl mt-6 leading-relaxed">
            Dai carrelli della nostra mastodontica gru navale del 1912 al profumo di malto artigianale e legna d'ulivo. Uno spaccato autentico di ciò che brucia sui nostri fuochi e scorre nelle nostre pinte.
          </p>
        </div>

        {/* Industrial Crane Watermark Graphic */}
        <div className="absolute -right-16 -bottom-10 opacity-10 pointer-events-none select-none text-white flex items-center justify-center">
          <span className="material-symbols-outlined notranslate text-[380px]">precision_manufacturing</span>
        </div>
      </section>

      {/* SECTION 2: STATS TICKER STRIP */}
      <section className="w-full bg-[#eee8da] py-4 px-4 sm:px-6 md:px-10 border-y border-[#d3c7b0]/30 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded shadow-[2px_2px_0px_#1d1c13]">
            <div className="w-10 h-10 rounded bg-[#7b2039] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-[24px]">sports_bar</span>
            </div>
            <div className="flex flex-col">
              <span className="font-epilogue font-extrabold text-xs sm:text-sm text-[#5d0624] uppercase">
                14 VIE A SPINA
              </span>
              <span className="font-work text-[11px] text-[#554245]">Rotazione continua craft</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded shadow-[2px_2px_0px_#1d1c13]">
            <div className="w-10 h-10 rounded bg-[#336859] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-[24px]">local_pizza</span>
            </div>
            <div className="flex flex-col">
              <span className="font-epilogue font-extrabold text-xs sm:text-sm text-[#336859] uppercase">
                48H LIEVITAZIONE
              </span>
              <span className="font-work text-[11px] text-[#554245]">Grani italiani &amp; biga</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded shadow-[2px_2px_0px_#1d1c13]">
            <div className="w-10 h-10 rounded bg-[#5a3e00] text-[#dca743] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-[24px]">groups</span>
            </div>
            <div className="flex flex-col">
              <span className="font-epilogue font-extrabold text-xs sm:text-sm text-[#1d1c13] uppercase">
                170 POSTI A SEDERE
              </span>
              <span className="font-work text-[11px] text-[#554245]">Sala Gru + Dehor coperto</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white rounded shadow-[2px_2px_0px_#1d1c13]">
            <div className="w-10 h-10 rounded bg-[#5d0624] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined notranslate text-[24px]">tv</span>
            </div>
            <div className="flex flex-col">
              <span className="font-epilogue font-extrabold text-xs sm:text-sm text-[#5d0624] uppercase">
                3 MAXISCHERMI SKY
              </span>
              <span className="font-work text-[11px] text-[#554245]">Serie A, Champions &amp; Rugby</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE FILTER TOOLBAR */}
      <section className="w-full bg-[#fff9eb] pt-8 pb-4 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined notranslate text-[#5d0624] text-[24px]">filter_alt</span>
            <span className="font-epilogue font-bold text-xs sm:text-sm uppercase tracking-wider text-[#1d1c13]">
              ESPLORA LA MOSTRA:
            </span>
          </div>

          {/* Filter Buttons with Retro Pressed Effect */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'TUTTE LE FOTO' },
              { id: 'pizza', label: 'PIZZE & LIEVITATI' },
              { id: 'burger', label: 'BURGER & GRIGLIA' },
              { id: 'birre', label: 'BIRRE & BANCONE' },
              { id: 'locale', label: 'SALA GRU & LOCALE' },
              { id: 'community', label: 'SERATE & SPORT' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-3 py-1.5 rounded font-epilogue font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1d1c13] transition-all ${
                  filter === btn.id
                    ? 'bg-[#5d0624] text-white translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0px_#1d1c13]'
                    : 'bg-[#f3eddf] hover:bg-[#eee8da] text-[#1d1c13]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: BENTO GALLERY SHOWCASE */}
      <section className="w-full bg-[#fff9eb] pb-20 px-4 sm:px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {filteredItems.map((item) => {
            if (item.category === 'community' && item.cols === 'md:col-span-12') {
              // Panorama 12 cols card
              return (
                <article
                  key={item.id}
                  onClick={() =>
                    onSelectImage({
                      id: item.id,
                      url: item.image,
                      title: item.title,
                      category: 'locale',
                      badge: item.badge1,
                      caption: item.description
                    })
                  }
                  className="md:col-span-12 bg-white rounded p-4 shadow-[4px_4px_0px_#1d1c13] flex flex-col md:flex-row gap-6 group cursor-pointer hover:-translate-y-0.5 transition-transform"
                >
                  <div className="relative w-full md:w-1/2 h-[280px] overflow-hidden rounded bg-[#f3eddf] shrink-0">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={item.image}
                      alt={item.title}
                    />
                    <div className="absolute top-4 left-4 bg-[#ffdeaa] text-[#271900] font-epilogue text-[11px] font-bold uppercase px-3 py-1 rounded shadow-[2px_2px_0px_#1d1c13] flex items-center gap-1">
                      <span className="material-symbols-outlined notranslate text-[16px]">sports_soccer</span>
                      {item.badge1}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-epilogue text-[11px] text-[#5d0624] uppercase tracking-widest font-black">
                      {item.kicker}
                    </span>
                    <h3 className="font-chunky text-2xl sm:text-3xl text-[#1d1c13] uppercase mt-1">
                      {item.title}
                    </h3>
                    <p className="font-work text-sm text-[#554245] mt-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {item.extraBadges?.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 bg-[#f3eddf] rounded font-epilogue font-bold text-xs text-[#1d1c13] uppercase border border-[#d3c7b0]/30"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            }

            return (
              <article
                key={item.id}
                onClick={() =>
                  onSelectImage({
                    id: item.id,
                    url: item.image,
                    title: item.title,
                    category: 'locale',
                    badge: item.badge1,
                    caption: item.description
                  })
                }
                className={`${item.cols} bg-white rounded p-3 shadow-[4px_4px_0px_#1d1c13] flex flex-col group transition-transform hover:-translate-y-1 cursor-pointer`}
              >
                <div className={`w-full h-3 ${item.ribbonClass} mb-3 rounded-t border-b border-black/10`}></div>
                <div className="relative w-full h-[320px] md:h-[360px] overflow-hidden rounded bg-[#f3eddf]">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src={item.image}
                    alt={item.title}
                  />
                  <div
                    className={`absolute top-4 left-4 ${item.badge1Color} font-epilogue font-bold text-[11px] uppercase px-3 py-1 rounded shadow-[2px_2px_0px_#1d1c13] flex items-center gap-1.5`}
                  >
                    {item.badge1}
                  </div>
                  {item.badge2 && (
                    <div className="absolute bottom-4 right-4 bg-[#fff9eb] text-[#5d0624] font-chunky text-base px-3 py-1 uppercase rounded shadow-[2px_2px_0px_#1d1c13]">
                      {item.badge2}
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 px-2.5 py-1 rounded text-white font-marker text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined notranslate text-[16px]">zoom_in</span> Clicca per ingrandire
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 mt-1">
                  <div>
                    {item.kicker && (
                      <span className="font-epilogue text-[11px] text-[#336859] uppercase font-bold tracking-wider block mb-0.5">
                        {item.kicker}
                      </span>
                    )}
                    <h3 className="font-chunky text-lg text-[#5d0624] uppercase">
                      {item.title}
                    </h3>
                    <p className="font-work text-xs text-[#554245] mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.icon && (
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[28px] hidden sm:block shrink-0 ml-2">
                      {item.icon}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: COMMUNITY SOCIAL POLAROID WALL (#Dock71Cantù) */}
      <section className="w-full bg-[#eee8da] py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden border-t-2 border-[#1d1c13]/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Stamp Badge */}
          <div className="w-16 h-16 rounded-full bg-[#5d0624] text-white flex items-center justify-center shadow-[3px_3px_0px_#1d1c13] mb-4">
            <span className="material-symbols-outlined notranslate text-[32px]">photo_camera</span>
          </div>
          <span className="font-epilogue text-xs text-[#336859] font-black uppercase tracking-widest">
            LA CIURMA DEL MOLO
          </span>
          <h2 className="font-chunky text-3xl sm:text-4xl md:text-5xl text-[#5d0624] uppercase mt-1">
            #DOCK71CANTU
          </h2>
          <p className="font-work text-sm sm:text-base text-[#554245] max-w-xl mt-2 leading-relaxed">
            Tagga <strong className="text-[#5d0624]">@dock71_cantu</strong> nei tuoi post e reel su Instagram. Ogni weekend le foto più energiche e rock'n'roll vengono proiettate sui maxischermi del locale!
          </p>

          {/* Polaroid Mosaic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mt-10">
            {POLAROID_ITEMS.map((pol) => (
              <div
                key={pol.id}
                onClick={() =>
                  onSelectImage({
                    id: pol.id,
                    url: pol.image,
                    title: pol.handle,
                    category: 'locale',
                    badge: '#DOCK71CANTU',
                    caption: pol.caption
                  })
                }
                className={`bg-white p-3 pb-6 rounded shadow-[4px_4px_0px_#1d1c13] transform ${pol.rotation} hover:rotate-0 transition-transform cursor-pointer`}
              >
                <div className="w-full h-64 overflow-hidden rounded-sm bg-[#f3eddf]">
                  <img
                    className="w-full h-full object-cover"
                    src={pol.image}
                    alt={pol.handle}
                  />
                </div>
                <div className="flex items-center justify-between mt-3 px-1">
                  <span className="font-epilogue font-bold text-xs text-[#5d0624]">{pol.handle}</span>
                  <span className="font-work text-xs text-[#554245]">{pol.caption}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button to Instagram */}
          <a
            className="mt-10 inline-flex items-center gap-3 px-6 py-3 bg-[#333027] text-white font-epilogue font-bold text-xs uppercase tracking-wider rounded shadow-[3px_3px_0px_#1d1c13] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            href="https://instagram.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined notranslate text-[20px]">photo_camera</span>
            SEGUI @DOCK71_CANTU SU INSTAGRAM
          </a>
        </div>
      </section>

      {/* SECTION 6: HIGH-CONVERSION CTA BANNER */}
      <section className="w-full bg-[#7b2039] text-white py-16 px-4 sm:px-6 md:px-10 relative overflow-hidden">
        <div className="w-full h-3 checker-ribbon absolute top-0 left-0 right-0"></div>
        <div className="w-full h-3 checker-ribbon-secondary absolute bottom-0 left-0 right-0"></div>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col text-center md:text-left">
            <span className="font-epilogue text-xs text-[#ffdad6] uppercase tracking-widest font-black">
              NON FARTELO SOLO RACCONTARE
            </span>
            <h2 className="font-chunky text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mt-1 leading-tight">
              VUOI VIVERE L'ATMOSFERA DAL VIVO?
            </h2>
            <p className="font-work text-base text-[#eee8da] max-w-xl mt-2 leading-relaxed">
              Prenota il tuo tavolo sotto la gru o nel nostro dehor. Per grandi compagnie, compleanni o una pinta al bancone dopo il lavoro.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#ffdeaa] text-[#271900] font-epilogue font-extrabold text-xs uppercase tracking-wider rounded shadow-[4px_4px_0px_#1d1c13] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1d1c13] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">calendar_month</span>
              PRENOTA IL TUO TAVOLO
            </button>

            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#fff9eb] text-[#5d0624] font-epilogue font-extrabold text-xs uppercase tracking-wider rounded shadow-[4px_4px_0px_#1d1c13] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1d1c13] transition-all"
              href="https://wa.me/390314487120?text=Ciao%20Dock%2071!%20Vorrei%20prenotare%20un%20tavolo"
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined notranslate text-[#336859] text-[20px]">chat</span>
              WHATSAPP TAVOLI
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
