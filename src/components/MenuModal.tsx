import React, { useState, useMemo } from 'react';
import { BEER_TAPS, FOOD_MENU, MenuItem } from '../data/pubData';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const MenuModal: React.FC<MenuModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [activeTab, setActiveTab] = useState<'tutte' | 'birre' | 'pizze' | 'burger' | 'griglia' | 'sfizi' | 'dolci' | 'pranzo'>('birre');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allItems: MenuItem[] = useMemo(() => {
    return [...BEER_TAPS, ...FOOD_MENU];
  }, []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      const matchesCategory =
        activeTab === 'tutte' || item.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.beerStyle && item.beerStyle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.beerOrigin && item.beerOrigin.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.specs && item.specs.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        !selectedTag ||
        (item.tags && item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase()));

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [allItems, activeTab, searchQuery, selectedTag]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-[#FFF9EB] border-4 border-dock-burgundy rounded-3xl overflow-hidden flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Checkerboard Ribbon */}
        <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4] shrink-0"></div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#F3EDDF] border-b border-[#E8E2D4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="burst-badge px-2.5 py-0.5 bg-dock-mustard text-dock-carbon font-marker text-[10px] uppercase">
                LISTINO UFFICIALE
              </span>
              <span className="font-marker text-[11px] text-dock-burgundy uppercase">
                // MALTO, GRIGLIA, FARINA A PIETRA
              </span>
            </div>
            <h3 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13] uppercase tracking-tight">
              Menù Completo &amp; 14 Birre alla Spina
            </h3>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="px-4 py-2 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase border border-dock-burgundy-light shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined notranslate text-[17px] text-dock-mustard">table_restaurant</span>
              PRENOTA TAVOLO
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#554245] hover:text-[#1D1C13] flex items-center justify-center transition-colors shadow-sm"
              aria-label="Chiudi menù"
            >
              <span className="material-symbols-outlined notranslate text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 sm:p-4 bg-[#FAF5EA] border-b border-[#E8E2D4] flex flex-col gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined notranslate absolute left-3 top-1/2 -translate-y-1/2 text-dock-burgundy text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cerca piatti, stili di birra (es. IPA, Stout, Lievitazione, Bacon)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#E8E2D4] focus:border-dock-burgundy rounded-xl pl-9 pr-8 py-2 text-xs text-[#1D1C13] placeholder-[#8C827A] outline-none shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1D1C13] text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1 sm:pb-0">
              <span className="font-marker text-[10px] text-dock-burgundy uppercase shrink-0">FILTRI RAPIDI:</span>
              {['Best Seller', 'Vegetariano', 'Piccante', 'Gluten Free'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-lg border font-mono-tech text-[11px] shrink-0 transition-colors shadow-sm ${
                    selectedTag === tag
                      ? 'bg-dock-mustard text-dock-carbon border-dock-mustard font-bold'
                      : 'bg-white text-[#554245] border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  {tag} {selectedTag === tag && '✓'}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-[10px] text-dock-burgundy font-bold hover:underline shrink-0"
                >
                  Reset filtri
                </button>
              )}
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            {[
              { id: 'birre', label: '14 Spine Birra', icon: 'sports_bar' },
              { id: 'pizze', label: 'Pizze 48h', icon: 'local_pizza' },
              { id: 'burger', label: 'Burger Gourmet', icon: 'lunch_dining' },
              { id: 'griglia', label: 'Griglia & Tagliate', icon: 'skillet' },
              { id: 'sfizi', label: 'Sfiziosità & Street', icon: 'tapas' },
              { id: 'dolci', label: 'Dolci del Pub', icon: 'cake' },
              { id: 'pranzo', label: 'Pranzo Business', icon: 'work' },
              { id: 'tutte', label: 'Tutto il Menù', icon: 'menu_book' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedTag(null);
                }}
                className={`px-3 py-2 rounded-xl font-chunky text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 transition-all shadow-sm ${
                  activeTab === tab.id
                    ? 'bg-dock-burgundy text-white border-2 border-dock-mustard shadow-md scale-[1.02]'
                    : 'bg-white text-[#554245] border border-[#E8E2D4] hover:text-[#1D1C13] hover:bg-[#F3EDDF]'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[16px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF5EA] space-y-4">
          {activeTab === 'birre' && !searchQuery && !selectedTag && (
            <div className="p-4 rounded-2xl bg-dock-green border-2 border-emerald-600/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined notranslate text-dock-mustard text-3xl">sports_bar</span>
                <div>
                  <h4 className="font-chunky text-base text-white uppercase">
                    14 Spine Attive a Rotazione Continua
                  </h4>
                  <p className="font-work text-xs text-emerald-100 mt-0.5">
                    Spillatura su impianti refrigerati dedicati. Cask inglesi a pompa meccanica, IPA artigianali brianzole e trappiste belghe.
                  </p>
                </div>
              </div>
              <span className="font-mono-tech text-xs bg-black/40 px-3 py-1.5 rounded-xl border border-dock-mustard text-dock-mustard shrink-0">
                LUPPOLO • MALTO • ACQUA
              </span>
            </div>
          )}

          {activeTab === 'pizze' && !searchQuery && !selectedTag && (
            <div className="p-4 rounded-2xl bg-dock-burgundy border-2 border-dock-mustard/40 flex items-center gap-3 text-white shadow-sm">
              <span className="material-symbols-outlined notranslate text-dock-mustard text-3xl">local_pizza</span>
              <div>
                <h4 className="font-chunky text-base text-white uppercase">
                  Lievitazione 48 Ore &amp; Farine a Pietra
                </h4>
                <p className="font-work text-xs text-dock-cream/90 mt-0.5">
                  Idratazione al 78%, cornicione a nido d'ape e ingredienti dop. Leggerezza totale senza sensazione di pesantezza notturna.
                </p>
              </div>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <span className="material-symbols-outlined notranslate text-4xl text-[#9E9488]">search_off</span>
              <h5 className="font-chunky text-lg text-[#1D1C13]">Nessun piatto o birra corrispondente</h5>
              <p className="font-work text-xs text-[#554245]">
                Prova a cercare un termine diverso o azzera i filtri selezionati.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                  setActiveTab('tutte');
                }}
                className="px-4 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow"
              >
                Mostra Tutto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isBeer = item.category === 'birre';
                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border-2 border-[#E8E2D4] bg-white p-4 flex flex-col justify-between transition-all duration-200 hover:border-dock-burgundy hover:shadow-md shadow-sm"
                  >
                    <div>
                      {/* Top spec & price */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-tech text-[11px] text-dock-burgundy uppercase font-bold tracking-wider">
                            {item.specs || item.category.toUpperCase()}
                          </span>
                          {item.beerStyle && (
                            <span className="text-[10px] bg-[#F3EDDF] px-2 py-0.5 rounded text-[#554245] font-epilogue border border-[#E8E2D4]">
                              {item.beerStyle}
                            </span>
                          )}
                        </div>
                        <span className="font-chunky text-base sm:text-lg text-dock-burgundy bg-dock-burgundy/10 px-2.5 py-0.5 rounded-lg border border-dock-burgundy/20 shrink-0">
                          {item.price}
                        </span>
                      </div>

                      {/* Name */}
                      <h4 className="font-chunky text-lg text-[#1D1C13] uppercase tracking-tight mb-2">
                        {item.name}
                      </h4>

                      {/* Description */}
                      <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed mb-3">
                        {item.description}
                      </p>

                      {/* Beer metrics if beer */}
                      {isBeer && (
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#FAF5EA] border border-[#E8E2D4] mb-3 text-center">
                          <div>
                            <span className="text-[10px] text-[#7A7067] font-marker uppercase block">ABV GRADO</span>
                            <span className="font-mono-tech text-xs text-dock-burgundy font-bold">{item.abv}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#7A7067] font-marker uppercase block">IBU AMARO</span>
                            <span className="font-mono-tech text-xs text-dock-green font-bold">{item.ibu}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#7A7067] font-marker uppercase block">ORIGINE</span>
                            <span className="font-work text-xs text-[#1D1C13] truncate block font-medium">{item.beerOrigin}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="pt-2 border-t border-[#E8E2D4] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap gap-1.5">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-marker px-2 py-0.5 rounded bg-[#F3EDDF] text-[#554245] border border-[#E8E2D4]"
                            >
                              ★ {tag}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            onClose();
                            onOpenBooking();
                          }}
                          className="text-[11px] font-marker text-dock-burgundy hover:text-dock-burgundy-dark flex items-center gap-1 group font-bold"
                        >
                          Assaggia <span className="material-symbols-outlined notranslate text-[14px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#F3EDDF] border-t border-[#E8E2D4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#554245] shrink-0 font-work">
          <div className="flex items-center gap-3">
            <span>Coperto: € 2.00 (incluso nei menu pranzo)</span>
            <span>•</span>
            <span className="text-dock-burgundy font-semibold">Tutti i prezzi sono iva inclusa</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenBooking();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined notranslate text-[17px] text-dock-mustard">calendar_month</span>
            PRENOTA UN TAVOLO AL MOLO
          </button>
        </div>
      </div>
    </div>
  );
};
