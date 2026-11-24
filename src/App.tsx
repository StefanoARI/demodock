/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PUB_IMAGES,
  PUB_ROOMS,
  GALLERY_ITEMS,
  MATCHES_SCHEDULE,
  GalleryImage
} from './data/pubData';
import { BookingModal } from './components/BookingModal';
import { MenuModal } from './components/MenuModal';
import { LightboxModal } from './components/LightboxModal';
import { PrivateEventsModal } from './components/PrivateEventsModal';
import { Toast } from './components/Toast';
import { GalleryPage, GALLERY_PAGE_ITEMS, POLAROID_ITEMS } from './components/GalleryPage';
import { DaNoiPuoiPage } from './components/DaNoiPuoiPage';
import { ContactPage } from './components/ContactPage';
import { MenuPage } from './components/MenuPage';
import { BookingPage } from './components/BookingPage';
import { LocaleSkySportPage } from './components/LocaleSkySportPage';
import { FloatingContactWidget } from './components/FloatingContactWidget';
import { FloatingLanguageSelector } from './components/FloatingLanguageSelector';
import { CookieBanner } from './components/CookieBanner';
import { NotFoundPage } from './components/NotFoundPage';
import { ThankYouPage } from './components/ThankYouPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ComingSoonPage } from './components/ComingSoonPage';
import { SeoHead } from './components/SeoHead';
import { useSiteData } from './context/SiteDataContext';

// Modalità Coming Soon disattivata: mostra il sito completo con tutte le pagine
const COMING_SOON_MODE = false;

export type AppView = 'home' | 'menu' | 'locale' | 'galleria' | 'esperienze' | 'contatti' | 'prenota' | 'grazie-contatto' | 'grazie-prenotazione' | 'not-found' | 'admin';

export default function App() {
  // Navigation, Language & Modals State
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeNav, setActiveNav] = useState<string>('home');
  const [currentLang, setCurrentLang] = useState<string>('it');
  const [confirmedBookingCode, setConfirmedBookingCode] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<GalleryImage | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<string | undefined>(undefined);
  const [matchFilter, setMatchFilter] = useState<'tutti' | 'calcio' | 'basket' | 'rugby'>('tutti');
  const [parkingView, setParkingView] = useState<'piazzale' | 'retro'>('piazzale');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync iniziale URL e cambio hash (permette accesso diretto segreto a #admin o /admin)
  React.useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('admin') || path.includes('login-segreto') || hash === '#admin') {
        setCurrentView('admin');
      }
    };
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    return () => window.removeEventListener('hashchange', checkAdminRoute);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const handleNavClick = (sectionId: AppView) => {
    setActiveNav(sectionId);
    setIsMobileMenuOpen(false);

    if (sectionId === 'menu') {
      setCurrentView('menu');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'locale') {
      setCurrentView('locale');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'galleria') {
      setCurrentView('galleria');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'esperienze') {
      setCurrentView('esperienze');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'contatti') {
      setCurrentView('contatti');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'prenota') {
      setCurrentView('prenota');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'grazie-contatto') {
      setCurrentView('grazie-contatto');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'grazie-prenotazione') {
      setCurrentView('grazie-prenotazione');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'not-found') {
      setCurrentView('not-found');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (sectionId === 'admin') {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBookingForMatch = (matchTitle: string) => {
    setSelectedMatch(matchTitle);
    setIsBookingOpen(true);
  };

  const openBookingGeneral = () => {
    setSelectedMatch(undefined);
    setIsBookingOpen(true);
  };

  const { matches: dynamicMatches, galleryItems: dynamicGalleryItems, seasonalMenus } = useSiteData();
  const [isMenuSubmenuOpen, setIsMenuSubmenuOpen] = useState(false);
  const [menuInitialCategory, setMenuInitialCategory] = useState<string>('all');

  const navigateToMenuCategory = (category: string = 'all') => {
    setMenuInitialCategory(category);
    handleNavClick('menu');
  };

  const activeDynamicMatches = dynamicMatches.filter(m => m.isActive !== false);

  const filteredMatches = activeDynamicMatches.filter((m) => {
    if (matchFilter === 'tutti') return true;
    return m.sport === matchFilter;
  });

  // Combined list for Lightbox navigation
  const allGalleryItems: GalleryImage[] = [
    ...dynamicGalleryItems.map(g => ({
      id: g.id,
      url: g.url,
      title: g.title,
      category: 'locale' as const,
      badge: g.badge,
      caption: g.caption
    })),
    ...POLAROID_ITEMS.map((pol) => ({
      id: pol.id,
      url: pol.image,
      title: pol.handle,
      category: 'locale' as const,
      badge: '#DOCK71CANTU',
      caption: pol.caption
    }))
  ];

  // Gallery Navigation in Lightbox
  const handleNextGalleryImg = () => {
    if (!selectedGalleryImg) return;
    const currentIndex = allGalleryItems.findIndex((item) => item.id === selectedGalleryImg.id);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % allGalleryItems.length;
    setSelectedGalleryImg(allGalleryItems[nextIndex]);
  };

  const handlePrevGalleryImg = () => {
    if (!selectedGalleryImg) return;
    const currentIndex = allGalleryItems.findIndex((item) => item.id === selectedGalleryImg.id);
    const prevIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + allGalleryItems.length) % allGalleryItems.length;
    setSelectedGalleryImg(allGalleryItems[prevIndex]);
  };

  if (COMING_SOON_MODE) {
    if (currentView === 'admin') {
      return (
        <>
          <SeoHead page="admin" />
          <AdminDashboard onBackToSite={() => handleNavClick('home')} />
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        </>
      );
    }

    return (
      <>
        <SeoHead page="coming-soon" />
        <ComingSoonPage
          onOpenBookingModal={openBookingGeneral}
          onOpenAdmin={() => handleNavClick('admin')}
          onShowToast={showToast}
        />

        <FloatingContactWidget onBookingConfirmed={(msg) => showToast(msg)} />

        <FloatingLanguageSelector
          currentLang={currentLang}
          onLanguageChange={(lang) => {
            setCurrentLang(lang);
            showToast(`Lingua impostata: ${lang.toUpperCase()}`);
          }}
        />

        <CookieBanner
          onOpenPrivacyPolicy={() =>
            showToast('Informativa Privacy conforme Regolamento UE 2016/679 (GDPR).')
          }
          onOpenCookiePolicy={() =>
            showToast('Cookie tecnici e tracciamento conforme direttiva ePrivacy ed EDPB.')
          }
        />

        <BookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          preselectedMatch={selectedMatch}
          onSuccessToast={showToast}
        />

        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      </>
    );
  }

  return (
    <div className="bg-[#FFF9EB] font-work text-[#1D1C13] antialiased selection:bg-dock-burgundy selection:text-white min-h-screen">
      <SeoHead page={currentView} />
      {/* ========================================== */}
      {/* TOP CHECKERBOARD BRAND BAND */}
      {/* ========================================== */}
      <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

      {/* ========================================== */}
      {/* OFFICIAL HEADER (WHITE MODE / LIGHT THEME) */}
      {/* ========================================== */}
      <header className="sticky top-0 w-full z-40 bg-[#FFF9EB]/95 backdrop-blur-md border-b-2 border-[#E8E2D4] shadow-sm">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-4 xl:px-6 h-20 flex items-center justify-between gap-2 lg:gap-3">
          {/* LOGO DOCK 71 UFFICIALE (Su Mobile testo Dock 71 Cantù nascosto per massima compatibilità e leggibilità) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 sm:gap-3 group shrink-0 text-left focus:outline-none"
          >
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 p-0.5 rounded-full bg-white border-2 border-dock-mustard shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg] shrink-0">
              <img
                alt="Dock 71 Cantù Logo Ufficiale"
                className="h-full w-full object-contain rounded-full"
                src={PUB_IMAGES.logo}
              />
            </div>
            {/* Su mobile nascondiamo "Dock 71 Cantù" per renderlo agile, responsive e navigabile come da istruzioni PDF */}
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-chunky text-lg sm:text-xl xl:text-2xl text-[#7B2039] tracking-tight group-hover:text-dock-mustard transition-colors leading-none">
                  DOCK 71
                </span>
                <span className="font-marker text-[10px] bg-dock-green px-1.5 py-0.2 text-white rounded shadow-sm border border-emerald-600 leading-tight">
                  CANTÙ
                </span>
              </div>
              <span className="hidden 2xl:block font-marker text-[10px] text-[#336859] uppercase tracking-wider font-bold mt-0.5">
                MALTO • GRIGLIA • ROCK'N'ROLL
              </span>
            </div>
          </button>

          {/* MAIN NAVIGATION LINKS (DESKTOP - SINGLE ROW OPTIMIZED, 14SPINE E HD RIMOSSI COME DA PDF) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-xl bg-[#F3EDDF] border border-[#E8E2D4] shadow-inner shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-1 ${
                activeNav === 'home'
                  ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                  : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
              }`}
            >
              {activeNav === 'home' && (
                <span className="w-1.5 h-1.5 rounded-full bg-dock-mustard animate-ping"></span>
              )}
              Home
            </button>

            {/* Menù & Birre con Sottotendina per Menù Stagionali */}
            <div
              className="relative"
              onMouseEnter={() => setIsMenuSubmenuOpen(true)}
              onMouseLeave={() => setIsMenuSubmenuOpen(false)}
            >
              <button
                onClick={() => handleNavClick('menu')}
                className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-1 ${
                  activeNav === 'menu'
                    ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                    : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
                }`}
              >
                <span>Menù &amp; Birre</span>
                <span className="material-symbols-outlined notranslate text-[14px]">expand_more</span>
              </button>

              {/* Sottotendina Menù con Sezioni e Menù Stagionali */}
              {isMenuSubmenuOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-[#FFF9EB] border-2 border-dock-burgundy rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn space-y-1">
                  <button
                    onClick={() => {
                      navigateToMenuCategory('all');
                      setIsMenuSubmenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-chunky uppercase text-[#1D1C13] hover:bg-dock-burgundy hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Tutto il Listino (14 Spine)</span>
                    <span className="material-symbols-outlined notranslate text-sm">arrow_forward</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateToMenuCategory('pizze');
                      setIsMenuSubmenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-work font-bold text-[#554245] hover:bg-[#F3EDDF] hover:text-dock-burgundy transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined notranslate text-sm text-dock-burgundy">local_pizza</span>
                    <span>Pizze Lievitate 48h</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateToMenuCategory('burger');
                      setIsMenuSubmenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-work font-bold text-[#554245] hover:bg-[#F3EDDF] hover:text-dock-burgundy transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined notranslate text-sm text-[#A85829]">lunch_dining</span>
                    <span>Burger &amp; Griglia</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateToMenuCategory('birre');
                      setIsMenuSubmenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-work font-bold text-[#554245] hover:bg-[#F3EDDF] hover:text-dock-burgundy transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined notranslate text-sm text-[#E0A93B]">sports_bar</span>
                    <span>14 Spine Artigianali</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateToMenuCategory('lunch');
                      setIsMenuSubmenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-work font-bold text-[#554245] hover:bg-[#F3EDDF] hover:text-dock-burgundy transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined notranslate text-sm text-[#336859]">wb_sunny</span>
                    <span>Menù Lunch (Mezzogiorno)</span>
                  </button>

                  {/* Voci Dinamiche Menù Stagionali */}
                  {seasonalMenus && seasonalMenus.filter(s => s.isActive).length > 0 && (
                    <div className="pt-2 mt-1 border-t border-[#E8E2D4] space-y-1">
                      <span className="px-3 text-[10px] font-mono-tech uppercase font-bold text-[#93541E] block">
                        ★ Menù Speciali &amp; Stagionali
                      </span>
                      {seasonalMenus.filter(s => s.isActive).map(sm => (
                        <button
                          key={sm.id}
                          onClick={() => {
                            const isLunch = sm.id === 'menu-lunch' || sm.name.toLowerCase().includes('lunch');
                            navigateToMenuCategory(isLunch ? 'lunch' : 'all');
                            setIsMenuSubmenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-work font-bold bg-[#FAF5EA] hover:bg-[#E0A93B]/20 text-[#1D1C13] transition-colors flex items-center justify-between"
                        >
                          <span className="truncate pr-1">★ {sm.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E0A93B] text-black font-mono-tech shrink-0 font-bold">
                            {sm.specialBadge || 'ATTIVO'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('locale')}
              className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase rounded-lg transition-all flex items-center gap-1 ${
                activeNav === 'locale'
                  ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                  : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
              }`}
            >
              Il Locale &amp; Sky
            </button>

            <button
              onClick={() => handleNavClick('galleria')}
              className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase transition-all rounded-lg ${
                activeNav === 'galleria'
                  ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                  : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
              }`}
            >
              Galleria
            </button>

            <button
              onClick={() => handleNavClick('esperienze')}
              className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase transition-all rounded-lg ${
                activeNav === 'esperienze'
                  ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                  : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
              }`}
            >
              Da noi puoi...
            </button>

            <button
              onClick={() => handleNavClick('contatti')}
              className={`whitespace-nowrap px-2.5 xl:px-3 py-1.5 xl:py-2 font-epilogue font-bold text-[11px] xl:text-xs tracking-wider uppercase transition-all rounded-lg ${
                activeNav === 'contatti'
                  ? 'bg-dock-burgundy text-white shadow-md border border-dock-burgundy-light'
                  : 'text-[#554245] hover:text-[#7B2039] hover:bg-[#E8E2D4]'
              }`}
            >
              Contatti
            </button>
          </nav>

          {/* CONTACT CALL & PRENOTAZIONE CTA */}
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            <a
              className="hidden 2xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E8E2D4] bg-white hover:border-dock-burgundy transition-colors shadow-sm group shrink-0"
              href="tel:0314487120"
              onClick={() => showToast('Avvio chiamata verso Dock 71 (031 4487120)...')}
            >
              <div className="w-7 h-7 rounded-full bg-dock-burgundy flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-sm">
                <span className="material-symbols-outlined notranslate text-[15px]">phone_in_talk</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-marker text-[8px] uppercase tracking-wider text-[#7A7265] leading-tight">
                  TAVOLI
                </span>
                <span className="font-epilogue text-[11px] font-black text-[#1D1C13] tracking-wide leading-tight">
                  031 4487120
                </span>
              </div>
            </a>

            <button
              onClick={() => handleNavClick('prenota')}
              className="relative inline-flex items-center justify-center px-3 xl:px-4 py-2 xl:py-2.5 rounded-lg bg-dock-burgundy border-2 border-dock-burgundy-light text-white font-chunky text-[11px] xl:text-xs uppercase tracking-wider shadow-md hover:bg-dock-burgundy-dark hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap shrink-0"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[15px] xl:text-[17px] text-dock-mustard">table_restaurant</span>
                PRENOTA ORA
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white border border-[#E8E2D4] text-[#1D1C13] hover:text-dock-burgundy focus:outline-none shadow-sm"
              aria-label="Apri menu mobile"
            >
              <span className="material-symbols-outlined notranslate text-2xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (14spine e Hd rimossi) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#FFF9EB] border-t border-[#E8E2D4] px-4 py-4 space-y-2 shadow-2xl">
            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
            >
              <span>Home Page</span>
              <span className="material-symbols-outlined notranslate text-sm text-dock-mustard">home</span>
            </button>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('menu')}
                className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
              >
                <span>Menù &amp; Birre</span>
                <span className="material-symbols-outlined notranslate text-sm text-[#336859]">restaurant_menu</span>
              </button>

              {seasonalMenus && seasonalMenus.filter(s => s.isActive).length > 0 && (
                <div className="pl-4 space-y-1 border-l-2 border-[#E0A93B] ml-3 my-1">
                  {seasonalMenus.filter(s => s.isActive).map(sm => (
                    <button
                      key={sm.id}
                      onClick={() => {
                        const isLunch = sm.id === 'menu-lunch' || sm.name.toLowerCase().includes('lunch');
                        navigateToMenuCategory(isLunch ? 'lunch' : 'all');
                      }}
                      className="w-full text-left py-1 px-2 rounded font-work text-xs font-bold text-dock-burgundy hover:bg-[#F3EDDF] flex items-center justify-between"
                    >
                      <span className="truncate">★ {sm.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#E0A93B] text-black font-mono-tech font-bold shrink-0 ml-1">
                        {sm.specialBadge || 'STAGIONALE'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleNavClick('locale')}
              className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
            >
              <span>Il Locale &amp; Sky Sport Live</span>
              <span className="material-symbols-outlined notranslate text-sm text-sky-600">tv</span>
            </button>
            <button
              onClick={() => handleNavClick('galleria')}
              className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
            >
              <span>Galleria Scatti</span>
              <span className="material-symbols-outlined notranslate text-sm">photo_library</span>
            </button>
            <button
              onClick={() => handleNavClick('esperienze')}
              className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
            >
              <span>Da noi puoi... (Le 7 Esperienze)</span>
              <span className="material-symbols-outlined notranslate text-sm text-[#336859]">sports_bar</span>
            </button>
            <button
              onClick={() => handleNavClick('contatti')}
              className="w-full text-left py-2.5 px-3 rounded-lg font-chunky text-xs uppercase text-[#1D1C13] hover:bg-[#F3EDDF] hover:text-dock-burgundy flex items-center justify-between"
            >
              <span>Contatti &amp; Dove Siamo</span>
              <span className="material-symbols-outlined notranslate text-sm">location_on</span>
            </button>
            <div className="pt-2 border-t border-[#E8E2D4] flex flex-col gap-2">
              <a
                href="tel:0314487120"
                className="py-2.5 px-3 rounded-lg bg-white text-[#1D1C13] font-chunky text-xs uppercase flex items-center justify-center gap-2 border border-[#E8E2D4] shadow-sm"
              >
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-base">phone</span>
                Chiama: 031 4487120
              </a>
              <button
                onClick={() => handleNavClick('prenota')}
                className="py-3 px-3 rounded-lg bg-dock-burgundy text-white font-chunky text-xs uppercase flex items-center justify-center gap-2 border border-dock-burgundy-light shadow-md"
              >
                <span className="material-symbols-outlined notranslate text-dock-mustard text-base">table_restaurant</span>
                Prenota Subito un Tavolo
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="w-full relative">
        {currentView === 'locale' ? (
          <LocaleSkySportPage
            onOpenBooking={() => handleNavClick('prenota')}
          />
        ) : currentView === 'galleria' ? (
          <GalleryPage
            onOpenBooking={() => handleNavClick('prenota')}
            onSelectImage={setSelectedGalleryImg}
          />
        ) : currentView === 'esperienze' ? (
          <DaNoiPuoiPage
            onOpenBooking={() => handleNavClick('prenota')}
            onOpenMenu={() => handleNavClick('menu')}
            onOpenEvents={() => setIsEventsOpen(true)}
          />
        ) : currentView === 'menu' ? (
          <MenuPage
            onOpenBooking={() => handleNavClick('prenota')}
            initialCategory={menuInitialCategory}
          />
        ) : currentView === 'contatti' ? (
          <ContactPage
            onOpenBooking={() => handleNavClick('prenota')}
          />
        ) : currentView === 'prenota' ? (
          <BookingPage
            onSuccessToast={(msg) => {
              showToast(msg);
              const extractedCode = msg.match(/DOCK-\d+/)?.[0];
              if (extractedCode) {
                setConfirmedBookingCode(extractedCode);
              }
              handleNavClick('grazie-prenotazione');
            }}
          />
        ) : currentView === 'grazie-contatto' ? (
          <ThankYouPage
            type="contact"
            onGoHome={() => handleNavClick('home')}
            onOpenBooking={() => handleNavClick('prenota')}
          />
        ) : currentView === 'grazie-prenotazione' ? (
          <ThankYouPage
            type="booking"
            bookingCode={confirmedBookingCode}
            onGoHome={() => handleNavClick('home')}
          />
        ) : currentView === 'not-found' ? (
          <NotFoundPage
            onGoHome={() => handleNavClick('home')}
            onOpenBooking={() => handleNavClick('prenota')}
            onOpenContact={() => handleNavClick('contatti')}
          />
        ) : currentView === 'admin' ? (
          <AdminDashboard
            onBackToSite={() => handleNavClick('home')}
          />
        ) : (
          <>
            {/* ======================================================= */}
            {/* 1. HERO SECTION (ROCK POSTER VIBES + MONUMENTAL CRANE) */}
            {/* ======================================================= */}
            <section id="home" className="relative w-full pt-10 pb-16 lg:py-20 overflow-hidden bg-[#FAF5EA] border-b-4 border-[#E8E2D4]">
          {/* Giant Doodle / Claim Stencil in Background */}
          <div className="absolute top-4 right-10 text-[120px] lg:text-[180px] font-chunky text-[#1D1C13]/[0.03] select-none pointer-events-none tracking-tighter leading-none">
            ROCK'N'ROLL
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            {/* TOP TICKER WITH SOCIAL CAMPAIGN SLOGANS */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-8 border-b border-[#E8E2D4]">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="burst-badge px-3 py-1 bg-dock-mustard text-dock-carbon font-marker text-xs font-black uppercase tracking-wider">
                  ★ MALTO GRIGLIA ROCK'N'ROLL ★
                </span>
                <span className="burst-badge-green px-3 py-1 bg-dock-green text-white font-marker text-xs font-bold uppercase tracking-wide border border-emerald-400/40">
                  IL PECCATO È NON VENIRE!
                </span>
                <span className="hidden md:inline-block font-epilogue text-xs text-[#7A7265] font-semibold tracking-wider uppercase ml-2">
                  // BIRRERIA &amp; PUB INDUSTRIAL A CANTÙ • VIA MILANO 71
                </span>
              </div>
              <button
                onClick={() => navigateToMenuCategory('birre')}
                className="flex items-center gap-2 font-mono-tech text-xs text-[#7B2039] bg-white px-3 py-1 rounded-full border border-[#E8E2D4] shadow-sm hover:bg-[#7B2039] hover:text-white transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                14 SPINE ATTIVE ALLA SPINA
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Hero Text & Rock Headlines */}
              <div className="lg:col-span-6 flex flex-col">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="font-marker text-[#7B2039] text-base tracking-widest uppercase relative ray-burst inline-block">
                    Good Beer, Great Food
                  </span>
                </div>

                {/* Big Chunky / Brush Catchphrase from Social Posts */}
                <div className="mb-3">
                  <span className="font-marker text-3xl sm:text-4xl lg:text-5xl text-[#7B2039] block tracking-normal transform -rotate-1">
                    "IL PIACERE È TUTTO VOSTRO"
                  </span>
                </div>

                <h1 className="text-[#1D1C13] text-3xl sm:text-4xl lg:text-[46px] leading-[1.15] mb-5 font-chunky uppercase tracking-tight">
                  Pizza, Sport, Birra &amp; Convivialità <br />
                  <span className="font-marker bg-[#7B2039] text-white px-3 py-0.5 rounded inline-block transform rotate-1 mt-1 shadow-md">
                    sul Molo di Cantù!
                  </span>
                </h1>

                <p className="font-work text-[#554245] text-base lg:text-lg mb-8 leading-relaxed max-w-xl">
                  Pizze fragranti a <strong className="text-[#1D1C13] font-bold">lievitazione lenta 48 ore</strong> con farine macinate a pietra, burger veraci battuti al coltello e tagliate alla brace. Vivi lo sport live e le serate tra amici attorno alla monumentale <strong className="text-[#7B2039] font-bold underline decoration-dock-mustard decoration-2 underline-offset-4">gru industriale del 1912</strong> con parcheggio riservato gratuito.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                  <button
                    onClick={openBookingGeneral}
                    className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-sm uppercase tracking-wider shadow-lg border-2 border-dock-burgundy-light transition-all transform hover:-translate-y-0.5 active:scale-95 group"
                  >
                    <span className="material-symbols-outlined notranslate mr-2 text-[22px] text-dock-mustard group-hover:rotate-12 transition-transform">
                      restaurant
                    </span>
                    PRENOTA UN TAVOLO
                  </button>

                  <button
                    onClick={() => navigateToMenuCategory('all')}
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white hover:bg-[#FAF5EA] text-[#1D1C13] font-chunky text-sm uppercase tracking-wider border-2 border-[#1D1C13] shadow-md transition-all transform hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined notranslate mr-2 text-dock-burgundy text-[22px]">
                      menu_book
                    </span>
                    SCOPRI IL MENÙ
                  </button>

                  <a
                    className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#1D1C13] font-marker text-xs tracking-wider border border-[#336859] shadow-sm"
                    href="https://wa.me/390314487120?text=Ciao%20Dock%2071!%20Vorrei%20prenotare%20un%20tavolo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">chat</span>
                    WhatsApp Tavoli
                  </a>
                </div>

                {/* Coordinate / Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-white border-2 border-[#E8E2D4] shadow-sm">
                  <div className="flex flex-col border-r border-[#E8E2D4] pr-2">
                    <span className="font-marker text-[11px] text-[#7B2039] uppercase">CAPIENZA</span>
                    <span className="font-chunky text-[#1D1C13] text-base">170 Posti</span>
                  </div>
                  <div className="flex flex-col border-r border-[#E8E2D4] pr-2">
                    <span className="font-marker text-[11px] text-[#336859] uppercase">SKY SPORT</span>
                    <span className="font-chunky text-[#1D1C13] text-base">Maxischermo</span>
                  </div>
                  <div className="flex flex-col border-r border-[#E8E2D4] pr-2">
                    <span className="font-marker text-[11px] text-[#7B2039] uppercase">MONUMENTO</span>
                    <span className="font-chunky text-[#336859] text-sm">Gru</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-marker text-[11px] text-[#336859] uppercase">PARCHEGGIO</span>
                    <span className="font-chunky text-[#1D1C13] text-base">Gratis 50+</span>
                  </div>
                </div>
              </div>

              {/* Hero Media (MONUMENTAL CRANE IMAGE IN VINTAGE PUB FRAME) */}
              <div className="lg:col-span-6 relative">
                <div className="relative p-3.5 bg-white rounded-2xl border-4 border-dock-mustard shadow-[0_15px_35px_rgba(0,0,0,0.12)]">
                  {/* Checkerboard Header Strip */}
                  <div className="h-3 w-full checker-ribbon-green rounded-t mb-3 border border-[#E8E2D4]"></div>

                  {/* Top Bar with dock signature */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E2D4] px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-dock-burgundy"></span>
                      <span className="font-marker text-xs text-[#1D1C13] tracking-wider uppercase font-bold">
                        SALA CENTRALE • LA GRU ORIGINALE DEL 1912
                      </span>
                    </div>
                    <span className="font-chunky text-[11px] bg-dock-mustard text-dock-carbon px-2 py-0.5 rounded shadow">
                      DOCKYARD
                    </span>
                  </div>

                  {/* Main Historic Crane Image */}
                  <div
                    onClick={() => {
                      setSelectedGalleryImg({
                        id: 'hero-crane',
                        url: PUB_IMAGES.craneHero,
                        title: 'La Storica Gru del 1912',
                        category: 'locale',
                        badge: 'PATRIMONIO CANTÙ',
                        caption: 'Sala centrale dominata dalla gru originale del 1912 in ferro battuto rivettato.'
                      });
                    }}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#1D1C13] bg-black group cursor-pointer"
                  >
                    <img
                      alt="Sala centrale del Dock 71 con la monumentale Gru"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
                      src={PUB_IMAGES.craneHero}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Circular Logo Stamp Watermark */}
                    <div className="absolute top-3 right-3 w-16 h-16 rounded-full bg-white/95 p-1 border-2 border-dock-burgundy shadow-xl pointer-events-none transform rotate-12 group-hover:rotate-0 transition-transform">
                      <img
                        alt="Dock 71 Stamp"
                        className="w-full h-full object-contain"
                        src={PUB_IMAGES.logo}
                      />
                    </div>

                    {/* Social Badge Overlay: "NON È PER TUTTI!" */}
                    <div className="absolute top-4 left-4">
                      <span className="burst-badge px-3 py-1 bg-dock-burgundy text-white font-marker text-xs uppercase tracking-wider border border-white">
                        NON È PER TUTTI!
                      </span>
                    </div>

                    {/* Floating bottom caption */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/20">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined notranslate text-dock-mustard text-[20px]">
                          precision_manufacturing
                        </span>
                        <div>
                          <span className="font-marker text-[11px] text-dock-mustard uppercase block leading-tight">
                            Patrimonio di Cantù
                          </span>
                          <span className="font-work text-xs text-white font-semibold">
                            Cene conviviali sotto il gigante d'acciaio
                          </span>
                        </div>
                      </div>
                      <span className="font-mono-tech text-xs text-emerald-300 font-bold bg-dock-green px-2 py-0.5 rounded">
                        LIVE PUB
                      </span>
                    </div>
                  </div>

                  {/* Checkerboard Bottom Strip */}
                  <div className="h-3 w-full checker-ribbon-burgundy rounded-b mt-3 border border-[#E8E2D4]"></div>
                </div>

                {/* Overlapping Rock Slogan Sticker */}
                <div
                  onClick={() => navigateToMenuCategory('all')}
                  className="hidden sm:flex absolute -bottom-5 -left-6 bg-white text-dock-burgundy border-3 border-dock-carbon p-3.5 rounded-xl shadow-xl items-center gap-3 max-w-xs z-20 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-dock-green text-white flex items-center justify-center flex-shrink-0 font-bold border-2 border-dock-carbon shadow-sm">
                    <span className="material-symbols-outlined notranslate text-[24px]">sports_bar</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-marker text-xs text-dock-green font-bold">PIZZA • BURGER • BIRRA</span>
                    <span className="font-epilogue text-xs text-[#1D1C13] font-extrabold leading-snug">
                      14 Spine a rotazione continua! Clicca per consultarle.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 2. I PILASTRI DEL GUSTO (WITH SOCIAL POST IMAGES) */}
        {/* ======================================================= */}
        <section className="w-full py-20 bg-dock-texture-parchment text-dock-carbon relative border-b-4 border-[#333836]">
          {/* Checkerboard Top Divider */}
          <div className="h-4 w-full checker-ribbon-burgundy mb-12 border-y border-black"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b-2 border-dock-carbon/20">
              <div>
                <div className="inline-flex items-center gap-2 font-marker text-dock-burgundy text-sm uppercase tracking-widest mb-1.5">
                  ★ CUCINA, LIEVITO &amp; FORNO A LEGNA ★
                </div>
                <h2 className="font-chunky text-3xl sm:text-4xl text-dock-carbon uppercase tracking-tight">
                  I Pilastri del Gusto di Dock 71
                </h2>
              </div>
              <p className="font-work text-[#4A453C] text-sm sm:text-base max-w-md font-medium leading-relaxed">
                Dalla maturazione degli impasti al battuto delle carni sulla griglia: ogni ricetta è pensata per esaltare le nostre pinte e farti gridare <span className="font-marker text-dock-burgundy font-bold">"VIENI DI GUSTO!"</span>.
              </p>
            </div>

            {/* 4 CARDS WITH SOCIAL MEDIA VISUALS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Pizze */}
              <div
                onClick={() => navigateToMenuCategory('pizze')}
                className="group bg-white rounded-2xl border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden border-b-2 border-dock-carbon bg-dock-carbon">
                  <img
                    alt="Pizza artigianale Dock 71"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={PUB_IMAGES.pizza}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="burst-badge px-2.5 py-0.5 bg-dock-burgundy text-dock-cream font-marker text-[11px] uppercase border border-white">
                      Lievitazione 48H
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-dock-mustard font-marker text-[10px] uppercase">
                    Farine a Pietra
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-chunky text-lg text-dock-carbon uppercase mb-2 group-hover:text-dock-burgundy transition-colors">
                      Pizze &amp; Focacce Lenta Lievitazione
                    </h3>
                    <p className="font-work text-xs text-[#5C5446] leading-relaxed mb-4">
                      Impasto ad alta idratazione maturato 48 ore a temperatura controllata. Cornicione alveolato, sapore autentico e massima digeribilità.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-dock-carbon/15 flex items-center justify-between font-marker text-xs">
                    <span className="text-dock-burgundy hover:text-dock-green font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Vedi Pizze <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
                    </span>
                    <span className="font-mono-tech text-[10px] text-dock-carbon/60">SPEC: PIZZA-48H</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Burger & Griglia */}
              <div
                onClick={() => navigateToMenuCategory('burger')}
                className="group bg-white rounded-2xl border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden border-b-2 border-dock-carbon bg-dock-carbon">
                  <img
                    alt="Burger Gourmet Dock 71 Cantù"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={PUB_IMAGES.burger}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="burst-badge-green px-2.5 py-0.5 bg-dock-green text-dock-cream font-marker text-[11px] uppercase border border-white">
                      NON TI BASTA MAI!
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-dock-mustard font-marker text-[10px] uppercase">
                    100% Manzo Selezionato
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-chunky text-lg text-dock-carbon uppercase mb-2 group-hover:text-dock-burgundy transition-colors">
                      Burger Gourmet &amp; Carni alla Brace
                    </h3>
                    <p className="font-work text-xs text-[#5C5446] leading-relaxed mb-4">
                      Patty generosi cotti alla griglia, bacon croccante, salse home-made e costine glassate da gustare con le mani.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-dock-carbon/15 flex items-center justify-between font-marker text-xs">
                    <span className="text-dock-burgundy hover:text-dock-green font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      I Nostri Burger <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
                    </span>
                    <span className="font-mono-tech text-[10px] text-dock-carbon/60">SPEC: GRILL-ROCK</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Birre Artigianali */}
              <div
                onClick={() => navigateToMenuCategory('birre')}
                className="group bg-white rounded-2xl border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden border-b-2 border-dock-carbon bg-dock-carbon">
                  <img
                    alt="Birra alla spina Dock 71"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    src={PUB_IMAGES.beerGlass}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="burst-badge px-2.5 py-0.5 bg-dock-mustard text-dock-carbon font-marker text-[11px] uppercase border border-black">
                      14 SPINE A ROTAZIONE
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/75 px-2 py-0.5 rounded text-white font-marker text-[10px] uppercase">
                    CASK &amp; CRAFT
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-chunky text-lg text-dock-carbon uppercase mb-2 group-hover:text-dock-burgundy transition-colors">
                      Birre Artigianali &amp; d'Abbazia
                    </h3>
                    <p className="font-work text-xs text-[#5C5446] leading-relaxed mb-4">
                      Dalle luppolate IPA alle tradizionali belghe ad alta gradazione, fino alle stout a pompa inglese e alle weiss fresche.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-dock-carbon/15 flex items-center justify-between font-marker text-xs">
                    <span className="text-dock-burgundy hover:text-dock-green font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Consulta Tap List <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
                    </span>
                    <span className="font-mono-tech text-[10px] text-dock-carbon/60">SPEC: TAPS-14</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Business Lunch */}
              <div
                onClick={() => navigateToMenuCategory('lunch')}
                className="group bg-white rounded-2xl border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden border-b-2 border-dock-carbon bg-[#2A302D] flex items-center justify-center p-4">
                  <div className="w-full h-full rounded-xl bg-dock-green p-4 flex flex-col justify-center items-center text-center text-dock-cream border-2 border-dashed border-dock-mustard">
                    <span className="material-symbols-outlined notranslate text-dock-mustard text-4xl mb-1">lunch_dining</span>
                    <span className="font-marker text-xs text-dock-mustard tracking-wider uppercase">LUN - VEN • 12:00 - 14:30</span>
                    <span className="font-chunky text-lg text-white mt-1">PRANZO DI LAVORO</span>
                    <span className="font-marker text-xs text-emerald-200 mt-1">Acqua, Caffè &amp; Coperto Inclusi</span>
                  </div>
                  <div className="absolute top-2.5 left-2.5">
                    <span className="burst-badge px-2 py-0.5 bg-dock-burgundy text-dock-cream font-marker text-[10px] uppercase">
                      BUSINESS FORMULA
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-chunky text-lg text-dock-carbon uppercase mb-2 group-hover:text-dock-burgundy transition-colors">
                      Pranzi di Lavoro Veloci &amp; Genuini
                    </h3>
                    <p className="font-work text-xs text-[#5C5446] leading-relaxed mb-4">
                      Menù dedicati a professionisti e aziende con piatti unici, pizze a mezzogiorno e servizio rapido per la tua pausa.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-dock-carbon/15 flex items-center justify-between font-marker text-xs">
                    <span className="text-dock-burgundy hover:text-dock-green font-bold inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Formula Lunch <span className="material-symbols-outlined notranslate text-[16px]">arrow_forward</span>
                    </span>
                    <span className="font-mono-tech text-[10px] text-dock-carbon/60">SPEC: BIZ-01</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkerboard Bottom Ribbon */}
          <div className="h-4 w-full checker-ribbon-burgundy mt-14 border-y border-black"></div>
        </section>

        {/* ======================================================= */}
        {/* 3. CENTRAL STREET POSTER BANNER */}
        {/* ======================================================= */}
        <section className="w-full py-16 bg-dock-texture-green text-dock-cream relative overflow-hidden border-b-4 border-black">
          <div className="absolute top-0 inset-x-0 h-4 checker-ribbon-green border-b border-black"></div>
          <div className="absolute bottom-0 inset-x-0 h-4 checker-ribbon-green border-t border-black"></div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
              {/* Poster Typography Block */}
              <div className="flex flex-col items-center lg:items-start max-w-2xl">
                <div className="inline-flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-dock-cream p-0.5 border border-dock-carbon">
                    <img
                      alt="Dock 71 Stamp"
                      className="w-full h-full object-contain rounded-full"
                      src={PUB_IMAGES.logo}
                    />
                  </div>
                  <span className="font-marker text-dock-mustard text-sm tracking-widest uppercase">
                    // GRIGLIA, MALTO E FARINA //
                  </span>
                </div>

                <h2 className="font-chunky text-4xl sm:text-5xl lg:text-6xl text-dock-cream leading-tight uppercase tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                  MALTO • GRIGLIA <br />
                  <span className="text-dock-mustard font-marker block text-5xl sm:text-6xl lg:text-7xl -rotate-1 mt-1">
                    ROCK'N'ROLL!
                  </span>
                </h2>

                <p className="font-work text-dock-cream/90 text-base sm:text-lg mt-4 max-w-xl font-normal leading-relaxed">
                  Il pub dove la passione per la birra artigianale incontra la cucina verace e l'energia del rock. Nessuna formalità: solo cibo eccellente, grandi bicchieri e buona musica.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6">
                  <span className="burst-badge px-3 py-1 bg-dock-burgundy text-dock-cream font-marker text-xs uppercase border border-white">
                    "GOOD BEER, GREAT FOOD"
                  </span>
                  <span className="burst-badge-green px-3 py-1 bg-dock-cream text-dock-carbon font-marker text-xs uppercase border border-dock-carbon">
                    "GOOD BURGER, BETTER BEER"
                  </span>
                </div>
              </div>

              {/* Poster Graphic Badge / Call to Action */}
              <div className="flex flex-col items-center">
                <div className="p-6 rounded-2xl bg-dock-burgundy border-4 border-dock-mustard shadow-[8px_8px_0px_#191B1A] text-center max-w-xs transform rotate-2 hover:rotate-0 transition-transform">
                  <span className="font-marker text-xs text-dock-mustard uppercase tracking-widest block mb-1">
                    NON FARTELO RACCONTARE
                  </span>
                  <span className="font-chunky text-2xl text-dock-cream uppercase block mb-3">
                    IL PECCATO È NON VENIRE!
                  </span>
                  <p className="font-work text-xs text-dock-cream/80 mb-5">
                    Vieni a vivere l'esperienza del porto a Cantù. Ti aspettiamo tutti i giorni a pranzo e a cena!
                  </p>
                  <button
                    onClick={openBookingGeneral}
                    className="inline-block w-full py-3 px-5 rounded-xl bg-dock-cream hover:bg-white text-dock-burgundy font-chunky text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 border-2 border-dock-carbon"
                  >
                    PRENOTA UN TAVOLO ORA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 4. VIVI L'ATMOSFERA DEI DOCK (3 ICONIC ROOMS) */}
        {/* ======================================================= */}
        <section id="esperienze" className="w-full py-20 bg-[#F3EDDF] relative border-b-4 border-[#E8E2D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 font-marker text-[#7B2039] text-sm uppercase tracking-widest mb-2 font-bold">
                  ★ GLI AMBIENTI DEL MOLO • 170 COPERTI ★
                </div>
                <h2 className="font-chunky text-3xl sm:text-4xl text-[#1D1C13] tracking-tight uppercase mb-3">
                  Vivi l'Atmosfera dei Dock
                </h2>
                <p className="font-work text-[#554245] text-base leading-relaxed">
                  Spazi modulati con anima industriale autentica: dalla monumentale gru navale in acciaio rivettato fino alle spine in ottone e alla brezza della terrazza esterna.
                </p>
              </div>

              <button
                onClick={() => setIsEventsOpen(true)}
                className="px-5 py-3 rounded-xl bg-white hover:bg-[#FAF5EA] border-2 border-dock-burgundy text-dock-burgundy font-chunky text-xs uppercase tracking-wider flex items-center gap-2 self-start md:self-end shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">celebration</span>
                Organizza Compleanno / Festa Privata
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {PUB_ROOMS.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border-2 border-[#E8E2D4] hover:border-dock-burgundy rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 shadow-md"
                >
                  <div
                    onClick={() => {
                      setSelectedGalleryImg({
                        id: room.id,
                        url: room.image,
                        title: room.name,
                        category: 'locale',
                        badge: room.featureBadge,
                        caption: room.description
                      });
                    }}
                    className="relative h-64 overflow-hidden bg-black cursor-pointer"
                  >
                    <img
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      src={room.image}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 border border-[#1D1C13] px-2.5 py-1 font-marker text-[11px] text-[#1D1C13] uppercase shadow">
                      {room.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-dock-burgundy text-white font-marker text-[10px] px-2.5 py-0.5 rounded shadow">
                      {room.featureBadge}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="material-symbols-outlined notranslate text-[#7B2039] text-[24px]">
                          {room.icon}
                        </span>
                        <h3 className="font-chunky text-xl text-[#1D1C13] uppercase">{room.name}</h3>
                      </div>
                      <p className="font-work text-sm text-[#554245] leading-relaxed mb-6">
                        {room.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#E8E2D4] flex items-center justify-between font-mono-tech text-xs text-[#7A7265]">
                      <span className="flex items-center gap-1.5 text-[#1D1C13] font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-dock-burgundy"></span> {room.spec1}
                      </span>
                      <button
                        onClick={openBookingGeneral}
                        className="text-dock-burgundy font-marker hover:underline text-[11px] font-bold"
                      >
                        PRENOTA QUI →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 5. MOMENTI DAL MOLO / GALLERIA INSTAGRAM & SCATTI */}
        {/* ======================================================= */}
        <section id="galleria" className="w-full py-20 bg-dock-texture-parchment text-dock-carbon relative border-b-4 border-black">
          <div className="h-3 w-full checker-ribbon-carbon border-b border-black"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-6 border-b-2 border-dock-carbon/20">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-dock-burgundy text-dock-cream font-marker text-xs uppercase mb-2">
                  <span className="material-symbols-outlined notranslate text-[16px]">photo_camera</span>
                  LOGBOOK LIVE // @DOCK71_CANTU
                </div>
                <h2 className="font-chunky text-3xl sm:text-4xl text-dock-carbon uppercase tracking-tight">
                  Momenti dal Molo: Scatti &amp; Atmosfera
                </h2>
                <p className="font-work text-[#4D4537] text-sm sm:text-base mt-1 max-w-xl">
                  I veri protagonisti dei nostri canali social: pinte spillate fresche, pizze fumanti e bistecche cotte alla perfezione. Clicca su una foto per ingrandirla!
                </p>
              </div>

              <button
                onClick={() => handleNavClick('galleria')}
                className="inline-flex items-center px-5 py-3 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-dock-cream font-chunky text-xs uppercase tracking-wider shadow-md transition-all group"
              >
                <span>ESPLORA TUTTA LA GALLERIA</span>
                <span className="material-symbols-outlined notranslate ml-2 text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Bento Grid with Authentic Social Visuals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
              {/* Photo 1: Bistecca & Birra */}
              <div
                onClick={() => setSelectedGalleryImg(GALLERY_ITEMS[0])}
                className="sm:col-span-2 lg:col-span-6 group relative h-80 lg:h-96 rounded-2xl overflow-hidden border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] bg-black cursor-pointer"
              >
                <img
                  alt="Bistecca alla brace e birra artigianale Dock 71"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={PUB_IMAGES.tagliata}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="burst-badge px-3 py-1 bg-dock-mustard text-dock-carbon font-marker text-xs uppercase border border-black">
                    VIENI DI GUSTO!
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="font-marker text-xs text-dock-mustard uppercase block">BRACE &amp; CASK BEER</span>
                    <h4 className="font-chunky text-lg text-white">Tagliata alla Griglia e Birra Scura</h4>
                  </div>
                  <span className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm group-hover:bg-dock-burgundy transition-colors">
                    <span className="material-symbols-outlined notranslate text-[20px]">zoom_in</span>
                  </span>
                </div>
              </div>

              {/* Photo 2: Pizza Napoletana 48h */}
              <div
                onClick={() => setSelectedGalleryImg(GALLERY_ITEMS[1])}
                className="sm:col-span-1 lg:col-span-6 group relative h-80 lg:h-96 rounded-2xl overflow-hidden border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] bg-black cursor-pointer"
              >
                <img
                  alt="Pizza lievitazione naturale Dock 71"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={PUB_IMAGES.pizza}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="burst-badge-green px-3 py-1 bg-dock-green text-dock-cream font-marker text-xs uppercase border border-white">
                    IL PIACERE È TUTTO VOSTRO
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <span className="font-marker text-xs text-dock-mustard uppercase block">FORNO A PIETRA</span>
                    <h4 className="font-chunky text-lg text-white">Margherita Verace 48 Ore</h4>
                  </div>
                  <span className="p-2 rounded-full bg-white/20 text-white backdrop-blur-sm group-hover:bg-dock-burgundy transition-colors">
                    <span className="material-symbols-outlined notranslate text-[20px]">zoom_in</span>
                  </span>
                </div>
              </div>

              {/* Photo 3: Burger Gourmet */}
              <div
                onClick={() => setSelectedGalleryImg(GALLERY_ITEMS[2])}
                className="lg:col-span-4 group relative h-72 rounded-2xl overflow-hidden border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] bg-black cursor-pointer"
              >
                <img
                  alt="Burger succoso Dock 71"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={PUB_IMAGES.burger}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-marker text-[11px] text-dock-mustard uppercase block">NON TI BASTA MAI!</span>
                  <h4 className="font-chunky text-base text-white">Bacon Cheese Supreme</h4>
                </div>
              </div>

              {/* Photo 4: Birra Bionda Fresca */}
              <div
                onClick={() => setSelectedGalleryImg(GALLERY_ITEMS[3])}
                className="lg:col-span-4 group relative h-72 rounded-2xl overflow-hidden border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] bg-black cursor-pointer"
              >
                <img
                  alt="Boccale di birra fresca Dock 71"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={PUB_IMAGES.beerGlass}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-marker text-[11px] text-dock-mustard uppercase block">NON È PER TUTTI!</span>
                  <h4 className="font-chunky text-base text-white">Pinta Artigianale alla Spina</h4>
                </div>
              </div>

              {/* Photo 5: Atmosfera Terrazza & Gru */}
              <div
                onClick={() => setSelectedGalleryImg(GALLERY_ITEMS[7])}
                className="lg:col-span-4 group relative h-72 rounded-2xl overflow-hidden border-3 border-dock-carbon shadow-[6px_6px_0px_#191B1A] bg-black cursor-pointer"
              >
                <img
                  alt="Brindisi serale in terrazza Dock 71"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={PUB_IMAGES.brindisi}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-marker text-[11px] text-dock-mustard uppercase block">BRINDISI SOTTO LE STELLE</span>
                  <h4 className="font-chunky text-base text-white">Serate Estive &amp; Convivialità</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="h-3 w-full checker-ribbon-carbon border-t border-black mt-12"></div>
        </section>

        {/* ======================================================= */}
        {/* 6. MATCH DAY & SKY SPORT HD (CONSOLLE LIVE & ROCK MATCH) */}
        {/* ======================================================= */}
        <section className="w-full py-20 bg-[#FAF5EA] relative border-b-4 border-[#E8E2D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="bg-white border-4 border-[#E8E2D4] rounded-3xl p-6 sm:p-10 lg:p-12 relative shadow-lg overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-3 checker-ribbon-burgundy"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mt-2">
                <div className="lg:col-span-7">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="burst-badge px-3 py-1 bg-dock-burgundy text-white font-marker text-xs uppercase border border-white">
                      LIVE MATCH • SKY SPORT HD
                    </span>
                    <span className="font-marker text-xs text-[#7B2039] bg-[#F9F3E5] px-3 py-1 rounded-full border border-[#E8E2D4]">
                      LO STADIO AL PUB
                    </span>
                  </div>

                  <h2 className="font-chunky text-3xl sm:text-4xl text-[#1D1C13] tracking-tight uppercase mb-4">
                    Lo Sport dal Vivo su Tre Schermi Giganti
                  </h2>

                  <p className="font-work text-[#554245] text-base leading-relaxed mb-6">
                    Serie A TIM, UEFA Champions League, Formula 1, Sei Nazioni di Rugby e Eurolega di Basket. Nessun angolo cieco: impianto audio multizona calibrato per goderti la partita con la migliore birra alla spina della Brianza.
                  </p>

                  {/* Sport Filter Controls */}
                  <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                    <span className="font-marker text-[10px] text-[#7B2039] uppercase font-bold">FILTRA:</span>
                    {(['tutti', 'calcio', 'basket', 'rugby'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setMatchFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-chunky uppercase transition-colors ${
                          matchFilter === filter
                            ? 'bg-dock-burgundy text-white font-bold shadow-sm'
                            : 'bg-[#F3EDDF] text-[#554245] hover:text-[#1D1C13] border border-[#E8E2D4]'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Match Schedule Cards */}
                  <div className="space-y-3 mb-8">
                    {filteredMatches.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-[#F9F3E5] border-2 border-dashed border-[#E8E2D4] text-center space-y-2">
                        <span className="material-symbols-outlined notranslate text-dock-burgundy text-3xl">sports</span>
                        <h4 className="font-chunky text-sm uppercase text-[#1D1C13]">
                          Non ci sono eventi in programma per ora
                        </h4>
                        <p className="font-work text-xs text-[#554245]">
                          Il palinsesto Sky Sport HD è in aggiornamento. Puoi comunque prenotare il tuo tavolo per una birra al banco o una pizza!
                        </p>
                      </div>
                    ) : (
                      filteredMatches.map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#F9F3E5] border border-[#E8E2D4] gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`font-marker text-xs px-2.5 py-1 rounded shrink-0 ${
                                m.sport === 'calcio' ? 'bg-dock-burgundy text-white' : 'bg-dock-green text-white'
                              }`}
                            >
                              {m.time} • {m.date.split(' ')[0]}
                            </span>
                            <div>
                              <span className="font-epilogue text-sm font-bold text-[#1D1C13] block">
                                {m.match}
                              </span>
                              <span className="text-xs text-[#7A7265] block">{m.competition}</span>
                              {(m.description || m.screen) && (
                                <span className="text-xs text-[#554245] mt-0.5 block">
                                  {m.description || m.screen}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => openBookingForMatch(m.match)}
                            className="self-end sm:self-center font-marker text-xs text-dock-burgundy hover:text-white uppercase bg-white hover:bg-dock-burgundy px-3 py-1.5 rounded-lg border border-dock-burgundy transition-colors shadow-sm font-bold"
                          >
                            Prenota per questo Match →
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={openBookingGeneral}
                      className="inline-flex items-center px-6 py-3.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider shadow-md border border-dock-burgundy-light active:scale-95 transition-all"
                    >
                      PRENOTA TAVOLO PARTITA
                    </button>
                  </div>
                </div>

                {/* Tech Console Box */}
                <div className="lg:col-span-5">
                  <div className="p-6 rounded-2xl bg-[#F3EDDF] border-2 border-[#E8E2D4] relative shadow-sm">
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8E2D4]">
                      <span className="font-marker text-xs text-[#7B2039] uppercase flex items-center gap-2 font-bold">
                        ★ IMPIANTO MULTIZONA LIVE
                      </span>
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8E2D4] shadow-sm">
                        <span className="material-symbols-outlined notranslate text-[#7B2039] text-[24px] mt-0.5">tv</span>
                        <div>
                          <h5 className="font-chunky text-xs text-[#1D1C13] uppercase">Maxischermo Ultra-HD</h5>
                          <p className="font-work text-xs text-[#554245]">Visibilità garantita dalla Sala Gru al bancone.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E8E2D4] shadow-sm">
                        <span className="material-symbols-outlined notranslate text-dock-mustard text-[24px] mt-0.5">sports_bar</span>
                        <div>
                          <h5 className="font-chunky text-xs text-[#1D1C13] uppercase">Menù Pinta &amp; Pizza Rapido</h5>
                          <p className="font-work text-xs text-[#554245]">Servizio veloce prima del fischio d'inizio e all'intervallo.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 7. VIENI A TROVARCI A CANTÙ (INFO, PARKING & MAPPA) */}
        {/* ======================================================= */}
        <section id="contatti" className="w-full py-20 bg-[#F3EDDF] relative border-b-4 border-[#E8E2D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Info Column */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 font-marker text-[#7B2039] text-sm uppercase tracking-widest mb-2 font-bold">
                    ★ COORDINATE, ORARI &amp; CONTATTI ★
                  </div>
                  <h2 className="font-chunky text-3xl sm:text-4xl text-[#1D1C13] tracking-tight uppercase mb-4">
                    Vieni a Trovarci a Cantù
                  </h2>
                  <p className="font-work text-[#554245] text-base leading-relaxed mb-6">
                    Siamo in <strong className="text-[#1D1C13]">Via Milano 71</strong>, sulla direttrice strategica Como - Cantù - Brianza. Parcheggio privato gratuito con oltre 50 posti auto direttamente davanti e sul retro dell'ingresso.
                  </p>

                  {/* Info Blocks */}
                  <div className="space-y-4 mb-8">
                    <div className="p-4 rounded-xl bg-white border-2 border-[#E8E2D4] flex items-start gap-3.5 shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[#7B2039] text-[26px]">location_on</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-chunky text-xs text-[#1D1C13] uppercase">Indirizzo Dock</span>
                          <span className="bg-dock-burgundy text-white text-[10px] font-marker px-1.5 py-0.5 rounded">
                            CANTÙ CO
                          </span>
                        </div>
                        <span className="font-work text-sm text-[#554245] block">
                          Via Milano 71, 22063 Cantù (Como)
                        </span>
                        <a
                          href="https://maps.google.com/?q=Via+Milano+71+Cantu"
                          target="_blank"
                          rel="noreferrer"
                          className="font-marker text-xs text-dock-burgundy hover:underline mt-1 inline-flex items-center gap-1 font-bold"
                        >
                          Apri su Google Maps <span className="material-symbols-outlined notranslate text-[14px]">open_in_new</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border-2 border-[#E8E2D4] flex items-start gap-3.5 shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[#336859] text-[26px]">schedule</span>
                      <div>
                        <span className="font-chunky text-xs text-[#1D1C13] uppercase block mb-1">
                          Orari di Apertura (7 Giorni su 7)
                        </span>
                        <span className="font-work text-xs text-[#554245] block">
                          Pranzo: 12:00 – 14:30 (Lun - Dom)
                        </span>
                        <span className="font-work text-xs text-[#554245] block">
                          Cena &amp; Birreria: 18:30 – 01:00 (Ven e Sab fino alle 02:00)
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white border-2 border-[#E8E2D4] flex items-start gap-3.5 shadow-sm">
                      <span className="material-symbols-outlined notranslate text-[#336859] text-[26px]">local_parking</span>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-chunky text-xs text-[#1D1C13] uppercase">Parcheggio Dedicato Gratuito</span>
                          <span className="bg-dock-green text-white text-[10px] font-marker px-1.5 py-0.5 rounded font-bold">
                            &gt; 50 POSTI
                          </span>
                        </div>
                        <span className="font-work text-sm text-[#554245] block">
                          Ampio piazzale riservato e illuminato proprio davanti e sul retro del pub.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#FAF5EA] border-2 border-dock-burgundy text-dock-burgundy font-chunky text-xs uppercase shadow-sm active:scale-95 transition-all"
                    href="tel:0314487120"
                    onClick={() => showToast('Avvio chiamata verso 031 4487120...')}
                  >
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">call</span>
                    Chiama: 031 4487120
                  </a>
                  <a
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-dock-green hover:bg-dock-green-light text-white font-chunky text-xs uppercase border border-emerald-500 shadow-sm active:scale-95 transition-all"
                    href="https://wa.me/390314487120?text=Ciao%20Dock%2071!%20"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
                    WhatsApp Rapido
                  </a>
                </div>
              </div>

              {/* Map & Parking Exterior Visuals */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Map Banner with Direct Link */}
                <a
                  href="https://maps.google.com/?q=Via+Milano+71+Cantu"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-80 rounded-2xl bg-cover bg-center border-2 border-[#E8E2D4] shadow-md relative overflow-hidden group block"
                  style={{
                    backgroundImage: `url('${PUB_IMAGES.map}')`
                  }}
                  title="Clicca per aprire le indicazioni stradali su Google Maps"
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  {/* Dock Pin Badge */}
                  <div className="absolute bottom-4 left-4 p-3.5 rounded-xl bg-white/95 border-2 border-dock-burgundy shadow-xl flex items-center gap-3 group-hover:scale-105 transition-transform">
                    <div className="w-10 h-10 rounded-full bg-dock-burgundy text-white flex items-center justify-center border border-white/20">
                      <span className="material-symbols-outlined notranslate text-[20px]">storefront</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-chunky text-xs text-[#1D1C13] uppercase">DOCK 71 CANTÙ</span>
                      <span className="font-work text-xs text-[#554245]">
                        Via Milano 71 • Parcheggio Privato Riservato
                      </span>
                      <span className="font-mono-tech text-[10px] text-dock-burgundy font-bold mt-0.5">
                        CLICCA PER APRIRE GOOGLE MAPS →
                      </span>
                    </div>
                  </div>
                </a>

                {/* Two Exterior Photos */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setSelectedGalleryImg({
                        id: 'parking-ext',
                        url: PUB_IMAGES.parking,
                        title: 'Parcheggio Riservato Dock 71',
                        category: 'locale',
                        badge: '> 50 POSTI AUTO',
                        caption: 'Ampio piazzale illuminato e videosorvegliato per sostare in totale comodità.'
                      });
                    }}
                    className="h-44 rounded-xl overflow-hidden relative border-2 border-[#E8E2D4] shadow-sm group cursor-pointer"
                  >
                    <img
                      alt="Parcheggio privato illuminato Dock 71"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      src={PUB_IMAGES.parking}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/95 text-[#1D1C13] font-marker text-[10px] uppercase border border-[#E8E2D4] shadow">
                      AMPIO PARCHEGGIO RISERVATO
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedGalleryImg({
                        id: 'entrance-ext',
                        url: PUB_IMAGES.entrance,
                        title: 'Ingresso Principale Dock 71',
                        category: 'locale',
                        badge: 'BENVENUTI AL MOLO',
                        caption: 'L’atmosfera calda e accogliente del porto ti aspetta in Via Milano 71.'
                      });
                    }}
                    className="h-44 rounded-xl overflow-hidden relative border-2 border-[#E8E2D4] shadow-sm group cursor-pointer"
                  >
                    <img
                      alt="Ingresso accogliente Dock 71 serale"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                      src={PUB_IMAGES.entrance}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-dock-burgundy text-white font-marker text-[10px] uppercase border border-white shadow">
                      INGRESSO PRINCIPALE DOCK
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================= */}
        {/* 8. BANNER PRENOTAZIONE FINALE (POSTER ROCK BURGUNDY) */}
        {/* ======================================================= */}
        <section className="w-full py-16 bg-[#FAF5EA] relative border-b-4 border-[#E8E2D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="relative overflow-hidden rounded-3xl bg-dock-texture-burgundy p-8 lg:p-14 border-4 border-dock-mustard shadow-xl text-white">
              <div className="absolute top-0 right-0 w-48 h-6 checker-ribbon transform rotate-45 translate-x-12 translate-y-4"></div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="burst-badge px-3 py-1 bg-white text-dock-burgundy font-marker text-xs uppercase font-black">
                      TAVOLI &amp; COMPLEANNI
                    </span>
                    <span className="font-marker text-xs text-dock-mustard uppercase tracking-wider font-bold">
                      NON RISCHIARE DI RESTARE IN PIEDI
                    </span>
                  </div>

                  <h2 className="font-chunky text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight uppercase mb-4 leading-tight">
                    Assicurati il Tuo Posto al Molo!
                  </h2>

                  <p className="font-work text-white/90 text-base max-w-2xl leading-relaxed">
                    Cene tra amici, visione match su maxischermo, compleanni o pranzi veloci di lavoro: prenota online in pochi istanti oppure contattaci direttamente su WhatsApp per tavolate numerose.
                  </p>
                </div>

                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center">
                  <button
                    onClick={openBookingGeneral}
                    className="inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white hover:bg-[#FAF5EA] text-dock-burgundy font-chunky text-sm uppercase tracking-wider shadow-xl transition-all active:scale-95 text-center border-2 border-white"
                  >
                    <span className="material-symbols-outlined notranslate mr-2 text-[22px]">calendar_month</span>
                    PRENOTA ONLINE ORA
                  </button>

                  <a
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-dock-green hover:bg-dock-green-light text-white font-chunky text-xs uppercase tracking-wider shadow-lg transition-all text-center border border-emerald-400"
                    href="https://wa.me/390314487120?text=Ciao%20Dock%2071!%20Vorrei%20informazioni%20per%20un%20tavolo"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="material-symbols-outlined notranslate mr-2 text-[20px]">chat</span>
                    WHATSAPP: 031 4487120
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* ======================================================= */}
      {/* 9. FOOTER INDUSTRIALE ROCK CON LOGO DOCK 71 (WHITE MODE) */}
      {/* ======================================================= */}
      <footer className="w-full bg-[#F3EDDF] text-[#554245] pt-16 pb-12 border-t-4 border-dock-burgundy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
            {/* Col 1: Brand & Identity with Official Logo */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-13 h-13 rounded-full bg-white p-1 border-2 border-dock-mustard flex items-center justify-center flex-shrink-0 shadow-sm">
                  <img
                    alt="Dock 71 Cantù Logo"
                    className="h-11 w-11 object-contain rounded-full"
                    src={PUB_IMAGES.logo}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-chunky text-xl text-[#7B2039] uppercase tracking-wider">DOCK 71</span>
                  <span className="font-marker text-[11px] text-[#336859] uppercase font-bold">
                    MALTO, GRIGLIA, ROCK'N'ROLL
                  </span>
                </div>
              </div>
              <p className="font-work text-xs leading-relaxed text-[#554245]">
                Pub autentico d'ispirazione portuale a Cantù. Lievitazioni controllate a 48 ore, tagliate su pietra lavica, 14 birre artigianali a rotazione continua e maxischermi HD dedicati allo sport.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E8E2D4] rounded-lg font-marker text-[11px] text-dock-burgundy shadow-sm w-fit">
                ★ CANTIERE ATTIVO 7 GIORNI SU 7 ★
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="flex flex-col gap-3">
              <span className="font-chunky text-xs text-[#1D1C13] uppercase tracking-widest border-b border-[#E8E2D4] pb-2">
                NAVIGAZIONE MOLO
              </span>
              <ul className="flex flex-col gap-2 font-epilogue text-xs font-semibold">
                <li>
                  <button
                    onClick={() => handleNavClick('home')}
                    className="hover:text-dock-burgundy transition-colors text-left"
                  >
                    // HOME PAGE
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('menu')}
                    className="hover:text-dock-burgundy transition-colors text-left text-dock-burgundy font-bold"
                  >
                    // MENÙ &amp; 14 BIRRE ALLA SPINA
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('locale')}
                    className="hover:text-dock-burgundy transition-colors text-left"
                  >
                    // IL LOCALE &amp; SKY SPORT HD
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('galleria')}
                    className="hover:text-dock-burgundy transition-colors text-left"
                  >
                    // GALLERIA FOTOGRAFICA
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('esperienze')}
                    className="hover:text-dock-burgundy transition-colors text-left"
                  >
                    // DA NOI PUOI... (LE 7 ESPERIENZE)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('contatti')}
                    className="hover:text-dock-burgundy transition-colors text-left"
                  >
                    // DOVE SIAMO &amp; CONTATTI
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavClick('prenota')}
                    className="text-dock-burgundy font-bold hover:underline text-left"
                  >
                    // PRENOTA UN TAVOLO O EVENTO
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Dove Siamo & Coordinate */}
            <div className="flex flex-col gap-3">
              <span className="font-chunky text-xs text-[#1D1C13] uppercase tracking-widest border-b border-[#E8E2D4] pb-2">
                DOVE CI TROVI
              </span>
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px] mt-0.5">location_on</span>
                <div className="font-work text-xs">
                  <span className="text-[#1D1C13] font-semibold block">Via Milano 71, 22063 Cantù (CO)</span>
                  <span className="text-[#7A7265] block mt-0.5">Direttrice Como - Cantù - Brianza</span>
                  <span className="text-[#336859] block mt-1 font-marker text-[11px] font-bold">
                    • 50+ POSTI AUTO GRATUITI RISERVATI
                  </span>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E2D4] flex flex-col gap-2 font-epilogue text-xs">
                <a
                  className="inline-flex items-center gap-2 text-[#1D1C13] hover:text-dock-burgundy font-bold"
                  href="tel:0314487120"
                  onClick={() => showToast('Avvio chiamata verso 031 4487120...')}
                >
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[16px]">call</span> 031 4487120
                </a>
                <a
                  className="inline-flex items-center gap-2 text-[#336859] hover:text-emerald-700 font-bold"
                  href="https://wa.me/390314487120?text=Ciao%20Dock%2071!"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">chat</span> WhatsApp Rapido
                </a>
              </div>
            </div>

            {/* Col 4: Orari di Servizio */}
            <div className="flex flex-col gap-3">
              <span className="font-chunky text-xs text-[#1D1C13] uppercase tracking-widest border-b border-[#E8E2D4] pb-2">
                ORARI DEL LOCALE
              </span>
              <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D4] flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between font-marker text-[11px]">
                  <span className="text-[#1D1C13] uppercase">LUNEDÌ – DOMENICA</span>
                  <span className="px-2 py-0.5 rounded bg-dock-green text-white font-bold">7 / 7 APERTI</span>
                </div>
                <div className="font-work text-xs text-[#554245] flex flex-col gap-1">
                  <span>Pranzo: 12:00 – 14:30</span>
                  <span>Cena: 18:30 – 01:00</span>
                  <span className="text-dock-burgundy font-marker text-[11px] font-bold">Ven &amp; Sab: fino alle 02:00</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <a
                  className="w-9 h-9 rounded-lg bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#1D1C13] hover:text-dock-burgundy flex items-center justify-center transition-colors shadow-sm"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Instagram @dock71_cantu"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">photo_camera</span>
                </a>
                <a
                  className="w-9 h-9 rounded-lg bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#1D1C13] hover:text-dock-burgundy flex items-center justify-center transition-colors shadow-sm"
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook Dock 71"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">public</span>
                </a>
                <a
                  className="w-9 h-9 rounded-lg bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#1D1C13] hover:text-dock-burgundy flex items-center justify-center transition-colors shadow-sm"
                  href="https://maps.google.com/?q=Via+Milano+71+Cantu"
                  target="_blank"
                  rel="noreferrer"
                  title="Recensioni Google"
                >
                  <span className="material-symbols-outlined notranslate text-[18px]">reviews</span>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Bottom Bar */}
          <div className="pt-8 border-t border-[#E8E2D4] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-tech text-[11px] text-[#7A7265]">
            <span>© 2025 DOCK 71 CANTÙ • PUB, PIZZERIA &amp; CASK BEER. P.IVA 03144871201</span>
            <div className="flex items-center gap-4 sm:gap-5 flex-wrap">
              <button onClick={() => showToast('Informativa Privacy conforme GDPR.')} className="hover:text-dock-burgundy transition-colors cursor-pointer">
                PRIVACY POLICY
              </button>
              <button onClick={() => showToast('Cookie tecnici abilitati per la navigazione.')} className="hover:text-dock-burgundy transition-colors cursor-pointer">
                COOKIE POLICY
              </button>
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('reopen_cookie_preferences'));
                }}
                className="hover:text-dock-burgundy transition-colors cursor-pointer text-dock-burgundy font-bold underline"
              >
                GESTISCI PREFERENZE COOKIE
              </button>
              <button onClick={() => showToast('Termini di servizio Dock 71 Cantù.')} className="hover:text-dock-burgundy transition-colors cursor-pointer">
                TERMINI
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* 1. FLOATING CONTACT WIDGET (FISSO IN BASSO A DESTRA) */}
      {/* WhatsApp, Telefono, Modulo di Contatto e Prenotazione con tracciamento GA4, Meta, TikTok */}
      {/* ==================================================================== */}
      <FloatingContactWidget
        onBookingConfirmed={(msg) => showToast(msg)}
      />

      {/* ==================================================================== */}
      {/* 2. FLOATING LANGUAGE SELECTOR (FISSO IN BASSO A SINISTRA) */}
      {/* 9 Lingue: IT, EN, DE, FR, NL, ZH, RU, AR, ES con riscrittura URL e SEO dinamico */}
      {/* ==================================================================== */}
      <FloatingLanguageSelector
        currentLang={currentLang}
        onLanguageChange={(lang) => {
          setCurrentLang(lang);
          showToast(`Lingua impostata: ${lang.toUpperCase()}`);
        }}
      />

      {/* ==================================================================== */}
      {/* 3. COOKIE BANNER GDPR "LEGAL-COMPLIANT" CON BLOCCO PREVENTIVO */}
      {/* Opt-In obbligatorio, Accetta Tutti, Rifiuta Tutti, Preferenze Granulari */}
      {/* ==================================================================== */}
      <CookieBanner
        onOpenPrivacyPolicy={() => showToast('Informativa Privacy conforme Regolamento UE 2016/679 (GDPR).')}
        onOpenCookiePolicy={() => showToast('Cookie tecnici e tracciamento conforme direttiva ePrivacy ed EDPB.')}
      />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedMatch={selectedMatch}
        onSuccessToast={showToast}
      />

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenBooking={openBookingGeneral}
      />

      <LightboxModal
        image={selectedGalleryImg}
        onClose={() => setSelectedGalleryImg(null)}
        onNext={handleNextGalleryImg}
        onPrev={handlePrevGalleryImg}
      />

      <PrivateEventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        onSuccessToast={showToast}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
