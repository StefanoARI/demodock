import React, { useState, useMemo, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface MenuPageProps {
  onOpenBooking: () => void;
  initialCategory?: string;
}

type MenuCategory = 'all' | 'birre' | 'pizze' | 'burger' | 'sfizi' | 'lunch' | 'pranzo' | 'drinks' | 'dolci';

export const MenuPage: React.FC<MenuPageProps> = ({ onOpenBooking, initialCategory = 'all' }) => {
  const { menuItems, seasonalMenus, categories } = useSiteData();
  const [activeCategory, setActiveCategory] = useState<MenuCategory>((initialCategory as MenuCategory) || 'all');

  useEffect(() => {
    if (initialCategory) {
      const normalized = (initialCategory === 'pranzo' ? 'lunch' : initialCategory) as MenuCategory;
      setActiveCategory(normalized);
      if (normalized !== 'all') {
        setTimeout(() => {
          const el = document.getElementById(`section-${normalized}`) || document.getElementById('section-lunch');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [initialCategory]);

  const todayStr = new Date().toISOString().slice(0, 10);

  // Menù stagionali attivi per la data odierna
  const activeSeasonalMenus = useMemo(() => {
    return seasonalMenus.filter(s => {
      if (!s.isActive) return false;
      if (s.startDate && s.endDate) {
        return todayStr >= s.startDate && todayStr <= s.endDate;
      }
      return true;
    });
  }, [seasonalMenus, todayStr]);

  // Piatti del Menù Lunch sincronizzati col backend
  const lunchDishes = useMemo(() => {
    const lunchSeason = seasonalMenus.find(s => s.id === 'menu-lunch' || s.name.toLowerCase().includes('lunch'));
    const fromSeason = lunchSeason?.dishes || [];
    const fromMenu = menuItems.filter(
      item => item.isActive && (item.category === 'lunch' || item.category === 'pranzo') && !fromSeason.some(d => d.name === item.name)
    );
    return [...fromSeason, ...fromMenu];
  }, [menuItems, seasonalMenus]);

  // Articoli personalizzati creati o modificati dal backend
  const customBackendItems = useMemo(() => {
    return menuItems.filter(item => {
      if (!item.isActive) return false;
      if (item.publishStartDate && item.publishEndDate) {
        if (todayStr < item.publishStartDate || todayStr > item.publishEndDate) return false;
      }
      return item.id.startsWith('custom-item-');
    });
  }, [menuItems, todayStr]);

  const handleFilter = (cat: MenuCategory) => {
    const normalized = (cat === 'pranzo' ? 'lunch' : cat) as MenuCategory;
    setActiveCategory(normalized);
    if (normalized !== 'all') {
      setTimeout(() => {
        const el = document.getElementById(`section-${normalized}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1D1C13]">
      {/* Top Anchor Banner & Dockyard Heritage Lead-in */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F2ECE1] to-[#FAF7F2] border-b border-[#E8E1D5] py-12 lg:py-16">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-dock-burgundy/5 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 bottom-0 w-80 h-80 rounded-full bg-[#E0A93B]/10 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          {/* Breadcrumb & Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2D8C9] text-dock-burgundy font-mono-tech text-xs uppercase tracking-widest shadow-sm font-bold">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[16px]">sports_bar</span>
              Tavern &amp; Taproom
            </span>
            <span className="text-[#A89D91] text-xs">•</span>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#706764] font-semibold">
              Cantù (CO) • Molo 71
            </span>
          </div>

          {/* Main Headline Block with Visual Asymmetry */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#1D1C13] leading-[1.15] font-chunky uppercase tracking-tight">
                  Il Listino Del Molo:{' '}
                  <span className="text-dock-burgundy italic">Birre, Pizze</span> &amp; Carni Di Carattere
                </h1>
                <p className="font-work text-base sm:text-lg text-[#554245] max-w-2xl leading-relaxed mt-1">
                  Ingredienti genuini da filiera corta, impasti a lenta lievitazione (48h) altamente digeribili, tagli selezionati di Black Angus cotti sulla piastra e un impianto spina a rotazione continua.
                </p>
              </div>
            </div>

            {/* Working Lunch Highlight Box */}
            <div className="lg:col-span-4 w-full">
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-[0_4px_20px_rgba(44,37,35,0.06)] relative overflow-hidden group hover:shadow-[0_8px_28px_rgba(44,37,35,0.1)] transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-dock-burgundy/10 rounded-bl-full pointer-events-none"></div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                    <span className="material-symbols-outlined notranslate text-[16px] text-dock-burgundy">lunch_dining</span>
                    Formula Mezzogiorno
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-dock-burgundy text-white font-mono-tech text-xs font-bold tracking-wider">
                    12€ / 14€
                  </span>
                </div>
                <h2 className="font-chunky text-xl text-[#1D1C13] font-bold mb-1">
                  Menù Lunch Cantù
                </h2>
                <p className="font-work text-xs sm:text-sm text-[#554245] mb-3">
                  Lun – Ven 12:00-14:30. Primo, secondo con contorno, pane artigianale, acqua microfiltrata e caffè del marinaio.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#F0EBE2]">
                  <span className="font-work text-xs text-[#706764]">Menù aggiornato al mattino</span>
                  <button
                    onClick={() => handleFilter('lunch')}
                    className="font-epilogue text-xs text-dock-burgundy hover:text-dock-burgundy-dark font-bold uppercase tracking-wider inline-flex items-center gap-1"
                  >
                    Vai al Menù Lunch <span className="material-symbols-outlined notranslate text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Menù Stagionale Attivo */}
      {activeSeasonalMenus.length > 0 && (
        <div className="bg-[#FAF5EA] border-y-2 border-[#E0A93B] py-3.5 px-6 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined notranslate text-[#E0A93B] text-[28px] animate-pulse">workspace_premium</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E0A93B] text-black font-epilogue font-black text-[11px] uppercase shadow-sm">
                    {activeSeasonalMenus[0].specialBadge || 'MENÙ STAGIONALE'}
                  </span>
                  <span className="font-chunky text-[#1D1C13] text-base sm:text-lg">
                    {activeSeasonalMenus[0].name}
                  </span>
                </div>
                {activeSeasonalMenus[0].bannerNotice && (
                  <p className="font-work text-xs sm:text-sm text-[#554245] mt-0.5 font-medium">
                    {activeSeasonalMenus[0].bannerNotice}
                  </p>
                )}
              </div>
            </div>
            <div className="text-xs font-mono-tech text-[#706764] bg-white px-3.5 py-1.5 rounded-xl border border-[#E5DDD0] shadow-xs">
              Valido dal <strong className="text-[#1D1C13]">{activeSeasonalMenus[0].startDate}</strong> al <strong className="text-[#1D1C13]">{activeSeasonalMenus[0].endDate}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Category Navigation Anchor Tabs (Dinamiche dal Backend) */}
      <div className="sticky top-20 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] shadow-[0_2px_8px_rgba(44,37,35,0.04)] py-3">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-start gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl font-epilogue text-xs uppercase tracking-wider font-bold transition-all shadow-sm ${
              activeCategory === 'all'
                ? 'bg-dock-burgundy text-white shadow-md'
                : 'bg-white text-[#554245] border border-[#E5DDD0] hover:text-[#1D1C13] hover:border-[#CFC4B2] hover:bg-[#F6F2EB]'
            }`}
          >
            Tutto il Listino
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilter(cat.slug as any)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-epilogue text-xs uppercase tracking-wider font-bold transition-all shadow-sm ${
                activeCategory === cat.slug
                  ? 'bg-dock-burgundy text-white shadow-md'
                  : 'bg-white text-[#554245] border border-[#E5DDD0] hover:text-[#1D1C13] hover:border-[#CFC4B2] hover:bg-[#F6F2EB]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Menu Grid Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 w-full flex flex-col gap-16">
        {/* PIATTI DEL MENÙ STAGIONALE ATTIVO */}
        {activeSeasonalMenus.map((sm) => (
          sm.dishes && sm.dishes.length > 0 ? (
            <section key={sm.id} className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-[#FAF5EA] border-2 border-[#E0A93B] shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5DDD0] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-[#E0A93B] text-black flex items-center justify-center font-bold shadow-sm">
                    <span className="material-symbols-outlined notranslate text-[24px]">ac_unit</span>
                  </span>
                  <div>
                    <span className="font-mono-tech text-xs uppercase tracking-widest text-[#93541E] font-bold">
                      {sm.specialBadge || 'PROPOSTE DEL MENÙ STAGIONALE'}
                    </span>
                    <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                      {sm.name}
                    </h2>
                  </div>
                </div>
                <span className="text-xs font-mono-tech text-[#7A7265] bg-white px-3.5 py-1.5 rounded-full border border-[#E0A93B]/30 self-start md:self-auto font-semibold">
                  Validità: {sm.startDate} → {sm.endDate}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sm.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    {dish.image && (
                      <div className="h-44 w-full rounded-xl overflow-hidden mb-4 bg-[#F0EBE2]">
                        <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold bg-[#FAF5EA] text-dock-burgundy border border-[#E5DDD0] mb-1">
                            {dish.specs || 'STAGIONALE'}
                          </span>
                          <h3 className="font-chunky text-xl text-[#1D1C13]">{dish.name}</h3>
                        </div>
                        <span className="font-chunky text-xl text-dock-burgundy shrink-0">{dish.price}</span>
                      </div>
                      <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed mb-4">
                        {dish.description}
                      </p>
                    </div>
                    {dish.tags && dish.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0EBE2]">
                        {dish.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-epilogue font-bold bg-[#F4EFE6] text-[#554245]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null
        ))}
        {/* SEZIONE DINAMICA BACKEND: Piatti & Birre Aggiunti / Stagionali */}
        {customBackendItems.length > 0 && (
          <section className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#FFF9EB] to-[#F5ECE0] border-2 border-[#E0A93B]/40 shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#E5DDD0] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#E0A93B] text-black flex items-center justify-center font-bold shadow-sm">
                  <span className="material-symbols-outlined notranslate text-[24px]">stars</span>
                </span>
                <div>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-[#93541E] font-bold">
                    Aggiornato in Tempo Reale dal Backend
                  </span>
                  <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                    Novità &amp; Fuori Menù della Settimana
                  </h2>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white text-[#554245] font-epilogue text-xs font-bold border border-[#E0A93B]/30 self-start md:self-auto">
                {customBackendItems.length} proposte attive
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customBackendItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  {item.image && (
                    <div className="h-44 w-full rounded-xl overflow-hidden mb-4 bg-[#F0EBE2]">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold bg-[#FAF5EA] text-dock-burgundy border border-[#E5DDD0] mb-1">
                          {item.specs || item.category.toUpperCase()}
                        </span>
                        <h3 className="font-chunky text-xl text-[#1D1C13]">{item.name}</h3>
                      </div>
                      <span className="font-chunky text-xl text-dock-burgundy shrink-0">{item.price}</span>
                    </div>
                    <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#F0EBE2]">
                      {item.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-epilogue font-bold bg-[#F4EFE6] text-[#554245]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 1. SECTION: TAP LIST & BEERS */}
        {(activeCategory === 'all' || activeCategory === 'birre') && (
          <section className="menu-section flex flex-col gap-8" id="section-birre">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-dock-burgundy animate-pulse"></span>
                  <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                    14 Spine Attive • Rotazione Settimanale
                  </span>
                </div>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Le Birre: Spine Inglesi &amp; Craft Selezionate
                </h2>
                <p className="font-work text-sm text-[#554245]">
                  Dalla tradizionale pompa a caraffa inglese fino alle IPA moderne. Servite nei bicchieri dedicati alla temperatura ideale.
                </p>
              </div>

              {/* Sizing Reference Badge */}
              <div className="flex items-center gap-3 bg-[#F4EFE6] px-4 py-2.5 rounded-xl shrink-0 border border-[#E2D8C9]">
                <div className="flex items-center gap-1.5 font-epilogue text-xs text-[#1D1C13] font-semibold">
                  <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">local_drink</span>
                  <span>Piccola 0.2L</span>
                </div>
                <span className="text-[#B3A799]">•</span>
                <div className="flex items-center gap-1.5 font-epilogue text-xs text-[#1D1C13] font-semibold">
                  <span className="material-symbols-outlined notranslate text-[20px] text-dock-burgundy">sports_bar</span>
                  <span>Media 0.4L</span>
                </div>
                <span className="text-[#B3A799]">•</span>
                <div className="flex items-center gap-1.5 font-epilogue text-xs text-[#1D1C13] font-semibold">
                  <span className="material-symbols-outlined notranslate text-[22px] text-dock-burgundy">liquor</span>
                  <span>Caraffa 1.5L</span>
                </div>
              </div>
            </div>

            {/* Beer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Beer 1: Thames Porter */}
              <div className="p-6 rounded-2xl bg-white flex flex-col justify-between border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-dock-burgundy"></div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-marker text-[10px] text-dock-burgundy font-bold uppercase tracking-widest block mb-0.5">
                        Spina #1 • Dark Malts
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Thames Porter</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D8C9] font-mono-tech text-[11px] text-[#554245] font-bold">
                      Inghilterra
                    </span>
                  </div>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Scura impenetrabile dal profilo avvolgente, brassata con malti d’orzo tostati, accenni caldi di cacao amaro, chicchi di caffè torrefatto e finale secco.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-dock-burgundy/10 text-dock-burgundy font-mono-tech text-xs font-bold border border-dock-burgundy/20">
                      5.8% ABV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-mono-tech text-xs border border-[#E5DDD0]">
                      38 IBU
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-work text-xs border border-[#E5DDD0]">
                      Calice Pinta
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE3D6] -mx-6 -mb-6 px-6 py-3">
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#706764]">Prezzi formato</span>
                  <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D1C13] font-bold">
                    <span>0.2L <strong className="text-dock-burgundy">€3.50</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>0.4L <strong className="text-dock-burgundy">€6.00</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>1.5L <strong className="text-dock-burgundy">€18.00</strong></span>
                  </div>
                </div>
              </div>

              {/* Beer 2: London Pride Bitter */}
              <div className="p-6 rounded-2xl bg-white flex flex-col justify-between border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#A85829]"></div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-marker text-[10px] text-[#A85829] font-bold uppercase tracking-widest block mb-0.5">
                        Spina #2 • Traditional Cask
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">London Pride Bitter</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D8C9] font-mono-tech text-[11px] text-[#554245] font-bold">
                      London UK
                    </span>
                  </div>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Iconica ale ambrata britannica. Caramello tostato, biscottata e con una sottile luppolatura terrosa di Target e Goldings. Equilibrio pub impeccabile.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-[#FBEFE6] text-[#A85829] font-mono-tech text-xs font-bold border border-[#F5DAC7]">
                      4.7% ABV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-mono-tech text-xs border border-[#E5DDD0]">
                      30 IBU
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-work text-xs border border-[#E5DDD0]">
                      Nonic Pint
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE3D6] -mx-6 -mb-6 px-6 py-3">
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#706764]">Prezzi formato</span>
                  <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D1C13] font-bold">
                    <span>0.2L <strong className="text-dock-burgundy">€3.50</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>0.4L <strong className="text-dock-burgundy">€5.50</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>1.5L <strong className="text-dock-burgundy">€17.00</strong></span>
                  </div>
                </div>
              </div>

              {/* Beer 3: Dock 71 Hazy IPA */}
              <div className="p-6 rounded-2xl bg-white flex flex-col justify-between border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#BF6C1E]"></div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-marker text-[10px] text-[#BF6C1E] font-bold uppercase tracking-widest block mb-0.5">
                        Spina #3 • Special Craft
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Dock 71 Hazy IPA</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D8C9] font-mono-tech text-[11px] text-[#554245] font-bold">
                      House Special
                    </span>
                  </div>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Doppio dry-hopping con luppoli Citra e Mosaic. Aspetto torbido dorato, aroma esplosivo di mango, maracuja e pompelmo rosa. Corpo setoso d'avena.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-[#FDF3E7] text-[#BF6C1E] font-mono-tech text-xs font-bold border border-[#FBE3C6]">
                      6.2% ABV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-mono-tech text-xs border border-[#E5DDD0]">
                      45 IBU
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-work text-xs border border-[#E5DDD0]">
                      Teku Glass
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE3D6] -mx-6 -mb-6 px-6 py-3">
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#706764]">Prezzi formato</span>
                  <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D1C13] font-bold">
                    <span>0.2L <strong className="text-dock-burgundy">€4.00</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>0.4L <strong className="text-dock-burgundy">€6.50</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>1.5L <strong className="text-dock-burgundy">€19.00</strong></span>
                  </div>
                </div>
              </div>

              {/* Beer 4: Harbor Pilsner */}
              <div className="p-6 rounded-2xl bg-white flex flex-col justify-between border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#336859]"></div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-marker text-[10px] text-[#336859] font-bold uppercase tracking-widest block mb-0.5">
                        Spina #4 • Crisp &amp; Clean
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Harbor Pilsner</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D8C9] font-mono-tech text-[11px] text-[#554245] font-bold">
                      Boemia / Germania
                    </span>
                  </div>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Bionda dorata cristallina, bassa fermentazione con luppolo nobile Saaz. Schiuma compatta, fresca, note erbacee e chiusura pulita e dissetante.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#336859] font-mono-tech text-xs font-bold border border-[#E2D8C9]">
                      5.0% ABV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-mono-tech text-xs border border-[#E5DDD0]">
                      28 IBU
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-work text-xs border border-[#E5DDD0]">
                      Willi Becher
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE3D6] -mx-6 -mb-6 px-6 py-3">
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#706764]">Prezzi formato</span>
                  <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D1C13] font-bold">
                    <span>0.2L <strong className="text-dock-burgundy">€3.00</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>0.4L <strong className="text-dock-burgundy">€5.00</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>1.5L <strong className="text-dock-burgundy">€15.00</strong></span>
                  </div>
                </div>
              </div>

              {/* Beer 5: Irish Red & Hand Pump */}
              <div className="p-6 rounded-2xl bg-white flex flex-col justify-between border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-dock-burgundy"></div>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-marker text-[10px] text-dock-burgundy font-bold uppercase tracking-widest block mb-0.5">
                        Pompa Tradizionale #5
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Irish Red &amp; Stout</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#F3EDE2] border border-[#E2D8C9] font-mono-tech text-[11px] text-[#554245] font-bold">
                      Carbo Naturale
                    </span>
                  </div>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Spillata a caduta o con motore a pompa manuale senza anidride carbonica forzata. Schiuma cremosa e vellutata, note tostate, caramellate e liquirizia.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="px-2 py-0.5 rounded bg-dock-burgundy/10 text-dock-burgundy font-mono-tech text-xs font-bold border border-dock-burgundy/20">
                      4.4% - 5.2% ABV
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#554245] font-work text-xs border border-[#E5DDD0]">
                      Spina Pump
                    </span>
                  </div>
                </div>
                <div className="pt-4 flex items-center justify-between bg-[#FAF7F2] border-t border-[#EAE3D6] -mx-6 -mb-6 px-6 py-3">
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#706764]">Prezzi formato</span>
                  <div className="flex items-center gap-2 font-mono-tech text-xs text-[#1D1C13] font-bold">
                    <span>0.2L <strong className="text-dock-burgundy">€3.50</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>0.4L <strong className="text-dock-burgundy">€6.00</strong></span>
                    <span className="text-[#C2B7A8]">/</span>
                    <span>1.5L <strong className="text-dock-burgundy">€18.00</strong></span>
                  </div>
                </div>
              </div>

              {/* Craft Beer Tasting Flight Promo */}
              <div className="p-6 rounded-2xl bg-[#F6F1E7] border border-[#E2D8C9] flex flex-col justify-between shadow-sm relative overflow-hidden group">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">flight</span>
                    <span className="font-marker text-[10px] uppercase tracking-widest text-dock-burgundy font-bold">
                      Degustazione Molo
                    </span>
                  </div>
                  <h3 className="font-chunky text-xl text-[#1D1C13] mb-2">
                    Il Giro delle Spine
                  </h3>
                  <p className="font-work text-xs sm:text-sm text-[#554245] mb-4 leading-relaxed">
                    Non sai quale scegliere? Prova la tavolozza di degustazione con 4 assaggi da 0.15L servita su tagliere in legno marchiato a fuoco Dock 71.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5DDD0]">
                  <span className="font-epilogue text-xs text-[#554245] uppercase tracking-wider font-semibold">
                    4 Bicchieri a scelta
                  </span>
                  <span className="font-chunky text-xl text-dock-burgundy font-bold">€11.00</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 2. SECTION: PIZZE & LIEVITATI */}
        {(activeCategory === 'all' || activeCategory === 'pizze') && (
          <section className="menu-section flex flex-col gap-8" id="section-pizze">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                  Impasti D'Autore • 48 Ore di Maturazione
                </span>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Le Pizze del Dock &amp; Lievitati
                </h2>
                <p className="font-work text-sm text-[#554245]">
                  Farine biologiche macinate a pietra, cornicione ben alveolato, salsa di pomodoro San Marzano DOP e fior di latte fresco campano.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#F4EFE6] px-3.5 py-2 rounded-xl shrink-0 border border-[#E2D8C9]">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">workspace_premium</span>
                <span className="font-work text-xs text-[#1D1C13] font-bold">
                  Disponibile impasto integrale 100% (+ €1.50)
                </span>
              </div>
            </div>

            {/* Pizza Grid: Split Architectural Layout with Visual Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 8 cols: Pizza Items List */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                {/* Pizza 1: Dock 71 Special */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-dock-burgundy text-white font-marker text-[10px] font-bold uppercase tracking-wider">
                        Firma
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Dock 71 Special</h3>
                    </div>
                    <span className="font-chunky text-xl text-dock-burgundy font-bold">€13.50</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Fior di latte di Agerola, salsiccia fresca a punta di coltello sbriciolata, cipolla rossa di Tropea caramellata alla London Pride Bitter, Gorgonzola DOP naturale di botte.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-dock-burgundy font-work text-xs font-semibold">
                    <span className="material-symbols-outlined notranslate text-[16px]">recommend</span>
                    <span>Abbinamento consigliato: Thames Porter o Bitter inglese</span>
                  </div>
                </div>

                {/* Pizza 2: La Portside */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] font-bold uppercase tracking-wider">
                        Gourmet
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">La Portside</h3>
                    </div>
                    <span className="font-chunky text-xl text-dock-burgundy font-bold">€14.00</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Pomodoro San Marzano DOP, burrata fresca pugliese intera (120g) a crudo, Prosciutto Crudo di Parma stagionato 24 mesi, granella fine di pistacchio di Bronte e basilico fresco.
                  </p>
                </div>

                {/* Pizza 3: Cantiere Navale (Piccante) */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FFDAD6] border border-[#FFB4AB] text-[#BA1A1A] font-marker text-[10px] font-bold uppercase tracking-wider">
                        Piccante Forte
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Cantiere Navale</h3>
                    </div>
                    <span className="font-chunky text-xl text-dock-burgundy font-bold">€12.50</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Pomodoro San Marzano DOP, fior di latte, 'Nduja calabra di Spilinga lavorata a caldo, spianata piccante artigianale, scaglie di pecorino romano DOP a crudo.
                  </p>
                </div>

                {/* Pizza 4: Quattro Formaggi d'Alpeggio */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] uppercase tracking-wider font-bold">
                        Bianca
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Quattro Formaggi d'Alpeggio</h3>
                    </div>
                    <span className="font-chunky text-xl text-dock-burgundy font-bold">€11.50</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Fior di latte, Gorgonzola dolce DOP, Taleggio a latte crudo della Valsassina, scaglie di Grana Padano Riserva 20 mesi, pepe nero macinato al mortaio.
                  </p>
                </div>

                {/* Pizza 5: Margherita Tradizione */}
                <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] uppercase tracking-wider font-bold">
                        Classica
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">Margherita Tradizione</h3>
                    </div>
                    <span className="font-chunky text-xl text-dock-burgundy font-bold">€8.00</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Polpa fine San Marzano DOP, fior di latte fresco, olio extravergine d'oliva monocultivar spremuto a freddo, basilico fresco lariano.
                  </p>
                </div>
              </div>

              {/* Right 4 cols: Visual Food Feature Card */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="rounded-2xl overflow-hidden bg-white border border-[#E5DDD0] shadow-sm">
                  <img
                    className="w-full h-64 object-cover"
                    alt="Pizza artigianale a lievitazione naturale Dock 71"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuClfXkIPMjS5no7al7VbrPKkn03Tcp9vlhCZYOJy_tptUfvVlNsEEuAfsuH9HPqgktFL4DkgdEgTWbZrbqUcRBJCHw_IertIJMNnRgFgp5GUQxSiSiu8wTGwNTGvUZ3UxrC4DskRBKp04eiGVadJjZMOkdpwkinD4JZ7J3OJA7QPB7GA_U-IfGhbAQkZxZFzV1YqpfXVvPb9S7dHaIiU59XdRJAvTVbaqZZnqnZeaX-hvLvW1P86hQq-Q"
                  />
                  <div className="p-6 flex flex-col gap-2">
                    <span className="font-marker text-[10px] text-dock-burgundy uppercase tracking-widest font-bold">
                      Il Nostro Impasto
                    </span>
                    <h3 className="font-chunky text-xl text-[#1D1C13]">Digeribilità • Metodo Thames</h3>
                    <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
                      Utilizziamo solo un mix di farine di grano tenero tipo 1 con germe di grano vivo. Maturazione controllata a 4°C per 48 ore minime, che trasforma gli amidi rendendo la pizza leggerissima anche a tarda sera.
                    </p>
                  </div>
                </div>

                {/* Calzone Special Quick Badge */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">lunch_dining</span>
                    <h4 className="font-chunky text-base text-[#1D1C13]">Calzone del Marinaio</h4>
                  </div>
                  <p className="font-work text-xs text-[#554245] mb-2 leading-relaxed">
                    Farcito con fior di latte, prosciutto cotto alta qualità alla brace, ricotta fresca vaccina e funghi champignon trifolati al burro.
                  </p>
                  <span className="font-chunky text-lg text-dock-burgundy font-bold">€12.00</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. SECTION: BURGER & CARNI */}
        {(activeCategory === 'all' || activeCategory === 'burger') && (
          <section className="menu-section flex flex-col gap-8" id="section-burger">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                  Butcher's Choice • Piastra a Carbone
                </span>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Burger Gourmet &amp; Carni Selezionate
                </h2>
                <p className="font-work text-sm text-[#554245]">
                  Hamburger cotti al momento con tecnica smash per la massima crosticina maillard, accompagnati da patate rustiche al timo e salse fatte in casa.
                </p>
              </div>
            </div>

            {/* Burger & Meat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Burger 1: The Dockyard Double Smash */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-dock-burgundy text-white font-marker text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                        Pub Hero Burger
                      </span>
                      <h3 className="font-chunky text-2xl text-[#1D1C13]">
                        The Dockyard Double Smash
                      </h3>
                    </div>
                    <span className="font-chunky text-2xl text-dock-burgundy font-bold">€15.50</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] mb-4 leading-relaxed">
                    Doppio patty di manzo piemontese 180g (90g x 2) lavorato a piastra calda, doppio Cheddar inglese stagionato 9 mesi a fusione, bacon croccante cotto al forno, cetriolini agrodolci all’aneto, salsa pub segreta al pepe rosa e bun brioche artigianale dorato.
                  </p>
                  <div className="flex items-center gap-2 font-work text-xs text-dock-burgundy font-semibold">
                    <span className="material-symbols-outlined notranslate text-[16px]">room_service</span>
                    <span>Servito con patate rustiche con buccia e maionese alla senape</span>
                  </div>
                </div>
              </div>

              {/* Burger 2: Pulled Pork allo Spiedo */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                        Cottura 10 Ore
                      </span>
                      <h3 className="font-chunky text-2xl text-[#1D1C13]">
                        Pulled Pork allo Spiedo Molo
                      </h3>
                    </div>
                    <span className="font-chunky text-2xl text-dock-burgundy font-bold">€14.00</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] mb-4 leading-relaxed">
                    Spalla di maiale nostrano sfilacciata a mano marinata con Thames Porter e spezie dolci, insalata coleslaw croccante al cavolo cappuccio, cipolla fritta e salsa barbecue affumicata al legno di melo.
                  </p>
                  <div className="flex items-center gap-2 font-work text-xs text-dock-burgundy font-semibold">
                    <span className="material-symbols-outlined notranslate text-[16px]">room_service</span>
                    <span>Servito con patatine dippers ondulate e salsa tartara Dock</span>
                  </div>
                </div>
              </div>

              {/* Meat 1: Tagliata di Black Angus */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                        Taglio Pregiato (ca. 300g)
                      </span>
                      <h3 className="font-chunky text-2xl text-[#1D1C13]">
                        Tagliata di Black Angus al Rosmarino
                      </h3>
                    </div>
                    <span className="font-chunky text-2xl text-dock-burgundy font-bold">€19.00</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] mb-4 leading-relaxed">
                    Controfiletto di Black Angus frollato 30 giorni, scottato a fiamma viva con olio infuso al rosmarino di collina, sale grosso di Cervia Maldon e scaglie di Grana Padano 24 mesi su letto di rucola selvatica.
                  </p>
                </div>
              </div>

              {/* Meat 2: Costine BBQ Glassate */}
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F3EDE2] border border-[#E2D8C9] text-[#554245] font-marker text-[10px] font-bold uppercase tracking-wider inline-block mb-1">
                        Slow Cooked Ribs
                      </span>
                      <h3 className="font-chunky text-2xl text-[#1D1C13]">
                        Costine di Maiale BBQ Glassate
                      </h3>
                    </div>
                    <span className="font-chunky text-2xl text-dock-burgundy font-bold">€16.50</span>
                  </div>
                  <p className="font-work text-sm text-[#554245] mb-4 leading-relaxed">
                    Costine di maiale cotte a bassa temperatura per 8 ore fino a sciogliersi dall'osso, rifinite con glassatura densa al miele di castagno lariano e birra ambrata London Pride.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. SECTION: MENÙ LUNCH */}
        {(activeCategory === 'all' || activeCategory === 'lunch' || activeCategory === 'pranzo') && (
          <section className="menu-section w-full bg-white border border-[#E5DDD0] p-8 lg:p-12 rounded-3xl shadow-sm relative overflow-hidden space-y-8" id="section-lunch">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dock-burgundy text-white font-mono-tech text-xs uppercase tracking-widest font-bold w-fit">
                  <span className="material-symbols-outlined notranslate text-[16px]">work</span>
                  Menù Lunch • Cantù (Lun – Ven 12:00 - 14:30)
                </div>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Menù Lunch: Pausa Pranzo Veloce &amp; Genuina al Molo 71
                </h2>
                <p className="font-work text-sm sm:text-base text-[#554245] leading-relaxed">
                  Dal Lunedì al Venerdì (12:00 – 14:30), proponiamo il nostro Menù Lunch pensato per professionisti, aziende e chi cerca velocità, porzioni generose e materie prime genuine. Gestito e aggiornato direttamente dal nostro backend.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex flex-col gap-1 shadow-sm">
                    <span className="font-mono-tech text-xs uppercase tracking-wider text-dock-burgundy font-bold">
                      Formula Lunch Pizza / Primo • €12
                    </span>
                    <span className="font-chunky text-lg text-[#1D1C13]">Primo o Pizza del Giorno</span>
                    <span className="font-work text-xs text-[#554245]">
                      Inclusi acqua 0.5L, pane fresco di forno, caffè espresso e coperto.
                    </span>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex flex-col gap-1 shadow-sm">
                    <span className="font-mono-tech text-xs uppercase tracking-wider text-dock-burgundy font-bold">
                      Formula Lunch Completa • €14
                    </span>
                    <span className="font-chunky text-lg text-[#1D1C13]">Burger / Griglia + Contorno</span>
                    <span className="font-work text-xs text-[#554245]">
                      O abbinamento Primo + Secondo con contorno, acqua, pane e caffè.
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-[#554245] font-work text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">check_circle</span>
                    Servizio veloce garantito
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">check_circle</span>
                    Fatturazione elettronica per aziende
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 w-full flex flex-col gap-4">
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] shadow-sm">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E1D5]">
                    <span className="font-chunky text-base uppercase tracking-wider text-[#1D1C13]">
                      Piatti del Giorno in Rotazione
                    </span>
                    <span className="font-marker text-[10px] text-dock-burgundy font-bold">Rotazione</span>
                  </div>
                  <ul className="flex flex-col gap-3 font-work text-xs sm:text-sm text-[#554245]">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px] shrink-0 mt-0.5">restaurant</span>
                      <span>Paccheri di Gragnano con ragù bianco di cortile e timo fresco</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px] shrink-0 mt-0.5">restaurant</span>
                      <span>Risotto mantecato allo zafferano e crumble di luganega comasca</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px] shrink-0 mt-0.5">restaurant</span>
                      <span>Arrosto di vitello nostrano alle erbe con patate novelle al forno</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px] shrink-0 mt-0.5">restaurant</span>
                      <span>Filetto di orata alla piastra con julienne di verdure croccanti</span>
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-[#E8E1D5] flex items-center justify-between">
                    <span className="font-work text-xs text-[#706764]">Prenota tavolo per pranzo</span>
                    <a
                      className="font-chunky text-xs uppercase text-dock-burgundy hover:text-dock-burgundy-dark transition-colors"
                      href="tel:0314487120"
                    >
                      Tel: 031 4487120
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* ELENCO PROPOSTE MENÙ LUNCH DAL BACKEND */}
            {lunchDishes.length > 0 && (
              <div className="pt-6 border-t border-[#E5DDD0] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-chunky text-xl text-[#1D1C13] uppercase">
                    Le Proposte del Menù Lunch
                  </h3>
                  <span className="font-mono-tech text-xs text-dock-burgundy font-bold uppercase">
                    Acqua, Caffè e Coperto Inclusi
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lunchDishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD0] flex flex-col justify-between hover:shadow-md transition-all"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <h4 className="font-chunky text-lg text-[#1D1C13]">{dish.name}</h4>
                          <span className="font-chunky text-lg text-dock-burgundy shrink-0">{dish.price}</span>
                        </div>
                        <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                      {dish.tags && dish.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-[#E8E1D5]">
                          {dish.tags.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-white border border-[#E5DDD0] text-[10px] font-epilogue font-bold text-dock-burgundy">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5. SECTION: FRITTI & SFIZIOSITÀ */}
        {(activeCategory === 'all' || activeCategory === 'sfizi') && (
          <section className="menu-section flex flex-col gap-6" id="section-sfizi">
            <div className="pb-3 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                  Da Condividere o per Iniziare
                </span>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Fritti &amp; Sfizi da Banco
                </h2>
              </div>
              <span className="font-work text-xs text-[#706764] font-semibold">
                Olio d'arachidi ad alto punto di fumo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-chunky text-lg text-[#1D1C13]">Patate Rustiche Dock</h3>
                    <span className="font-chunky text-lg text-dock-burgundy font-bold">€5.50</span>
                  </div>
                  <p className="font-work text-xs text-[#554245]">
                    Taglio casereccio con buccia croccante, sale speziato alla paprika affumicata e rosmarino. Con maionese all'aglio dolce.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-chunky text-lg text-[#1D1C13]">Alette di Pollo Speziate</h3>
                    <span className="font-chunky text-lg text-dock-burgundy font-bold">€7.50</span>
                  </div>
                  <p className="font-work text-xs text-[#554245]">
                    6 pz marinate in agrodolce e birra IPA, panate e dorate, servite con salsa blue cheese all'erborinato.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-chunky text-lg text-[#1D1C13]">Mozzarella Sticks</h3>
                    <span className="font-chunky text-lg text-dock-burgundy font-bold">€6.50</span>
                  </div>
                  <p className="font-work text-xs text-[#554245]">
                    Bastoncini di mozzarella fior di latte in doppia panatura dorata croccante con dip di pomodoro al basilico.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-chunky text-lg text-[#1D1C13]">Anelli di Cipolla alla Birra</h3>
                    <span className="font-chunky text-lg text-dock-burgundy font-bold">€6.00</span>
                  </div>
                  <p className="font-work text-xs text-[#554245]">
                    Pastellati artigianalmente alla birra bionda e fritti all'istante, serviti con salsa barbecue affumicata.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. SECTION: DRINKS & DOPOCENA */}
        {(activeCategory === 'all' || activeCategory === 'drinks') && (
          <section className="menu-section flex flex-col gap-6" id="section-drinks">
            <div className="pb-3 bg-white p-6 rounded-2xl border border-[#E5DDD0] shadow-sm flex items-center justify-between">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                  Cocktails, Amari &amp; Distillati
                </span>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Dopocena al Bancone
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-chunky text-xl text-[#1D1C13]">Gin Tonic Selezione Dock</h3>
                  <span className="font-chunky text-xl text-dock-burgundy font-bold">€9.00</span>
                </div>
                <p className="font-work text-xs sm:text-sm text-[#554245]">
                  London Dry Gin premium, tonica Fever-Tree Indian, bacche di ginepro essiccate e scorza di limone bio del Garda.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-chunky text-xl text-[#1D1C13]">Molo Spritz &amp; Bitters</h3>
                  <span className="font-chunky text-xl text-dock-burgundy font-bold">€6.50</span>
                </div>
                <p className="font-work text-xs sm:text-sm text-[#554245]">
                  Aperol o Campari, Prosecco DOC di Valdobbiadene extra dry, splash di soda d'acquedotto e fetta d'arancia.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#E5DDD0] shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-chunky text-xl text-[#1D1C13]">Amari Artigianali &amp; Whisky</h3>
                  <span className="font-chunky text-xl text-dock-burgundy font-bold">€4.50 / €8</span>
                </div>
                <p className="font-work text-xs sm:text-sm text-[#554245]">
                  Amaro Braulio Riserva, Jefferson calabrese, Lagavulin 16 anni Single Islay Malt, e grappe morbide trentine.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Bottom Important Notice & Reservation Call-To-Action Banner */}
        <section className="w-full rounded-3xl bg-white border border-[#E5DDD0] p-8 lg:p-12 shadow-sm relative overflow-hidden my-4">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-dock-burgundy/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Allergens and Intolerances Info */}
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F1E7] border border-[#E5DDD0] flex items-center justify-center shrink-0 text-dock-burgundy">
                <span className="material-symbols-outlined notranslate text-[26px]">medical_services</span>
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-chunky text-lg text-[#1D1C13]">
                  Intolleranze alimentari, Celiachia &amp; Allergeni
                </h4>
                <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
                  Il nostro staff è formato per gestire ogni tua esigenza nutrizionale. Sono disponibili opzioni senza glutine (birre in bottiglia dedicate, impasti e tagliate senza contaminazioni) e piatti vegani/vegetariani. Richiedi la tabella dettagliata degli allergeni in sala.
                </p>
              </div>
            </div>

            {/* Immediate Booking Action Block */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto shrink-0">
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#FAF7F2] border border-[#E2D8C9] hover:bg-[#F0EBE1] text-[#1D1C13] font-chunky text-xs uppercase tracking-wider transition-all shadow-sm"
                href="tel:0314487120"
              >
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">call</span>
                031 4487120
              </a>
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-widest shadow-md transition-all active:scale-95"
              >
                <span>Prenota per Stasera</span>
                <span className="material-symbols-outlined notranslate text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
