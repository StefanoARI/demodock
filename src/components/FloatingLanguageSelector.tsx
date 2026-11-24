import React, { useState, useEffect, useRef } from 'react';

export interface Language {
  code: string; // 'it', 'en', 'de', 'fr', 'nl', 'zh', 'ru', 'ar', 'es'
  name: string; // Nome nativo
  englishName: string;
  flag: string; // Emoji bandiera
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'it', name: 'Italiano', englishName: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  { code: 'en', name: 'English', englishName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', englishName: 'German', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', englishName: 'French', flag: '🇫🇷', dir: 'ltr' },
  { code: 'nl', name: 'Nederlands', englishName: 'Dutch', flag: '🇳🇱', dir: 'ltr' },
  { code: 'zh', name: '中文 (简体)', englishName: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ru', name: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ar', name: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', name: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
];

// Dizionario SEO per <title> e <meta name="description"> per lingua
const SEO_DICTIONARY: Record<string, { title: string; description: string }> = {
  it: {
    title: "Dock 71 | Risto-Pub & Birreria Portuale Cantù - Malto, Griglia, Rock'n'Roll",
    description: "Sito ufficiale di Dock 71 a Cantù: pizze a lunga lievitazione 48h, burger artigianali, 14 birre alla spina, Sky Sport HD e la storica gru industriale del 1912."
  },
  en: {
    title: "Dock 71 | Cantù Dockside Risto-Pub & Brewery - Malt, Grill, Rock'n'Roll",
    description: "Official website of Dock 71 in Cantù: 48h slow-leavened sourdough pizzas, artisan burgers, 14 craft beers on tap, Sky Sport HD, and historic 1912 industrial crane."
  },
  de: {
    title: "Dock 71 | Hafen-Risto-Pub & Brauhaus Cantù - Malz, Grill, Rock'n'Roll",
    description: "Offizielle Website von Dock 71 in Cantù: 48h Teigführung Pizzen, handgemachte Burger, 14 Fassbiere, Sky Sport HD und historischer Hafenkran von 1912."
  },
  fr: {
    title: "Dock 71 | Risto-Pub & Brasserie Portuaire Cantù - Malt, Grill, Rock'n'Roll",
    description: "Site officiel de Dock 71 à Cantù : pizzas levées 48h, burgers artisanaux, 14 bières pression, Sky Sport HD et grue portuaire historique de 1912."
  },
  nl: {
    title: "Dock 71 | Haven Risto-Pub & Brouwerij Cantù - Mout, Grill, Rock'n'Roll",
    description: "Officiële website van Dock 71 in Cantù: 48u zuurdesem pizza's, ambachtelijke burgers, 14 bieren van de tap, Sky Sport HD en historische havenkraan uit 1912."
  },
  zh: {
    title: "Dock 71 | 坎图码头精酿餐吧 - 麦芽，烧烤，摇滚",
    description: "Dock 71 官方网站（坎图）：48小时慢发酵披萨、手工汉堡、14款精酿生啤、Sky Sport HD 赛事直播与1912年历史工业吊车。"
  },
  ru: {
    title: "Dock 71 | Портовый гастропаб и пивоварня Канту - Солод, Гриль, Рок-н-ролл",
    description: "Официальный сайт паба Dock 71 в Канту: пицца 48-часовой закваски, крафтовые бургеры, 14 сортов разливного пива, Sky Sport HD и старинный кран 1912 года."
  },
  ar: {
    title: "Dock 71 | مطعم وحانة الميناء في كانتو - المالت، الشواء، والروك آند رول",
    description: "الموقع الرسمي لحانة Dock 71 في كانتو: بيتزا بالتخمير البطيء 48 ساعة، برغر حرفي، 14 نوع بيرة طازجة، بث مباريات سكاي سبورت HD."
  },
  es: {
    title: "Dock 71 | Risto-Pub & Cervecería Portuaria Cantù - Malta, Parrilla, Rock'n'Roll",
    description: "Sitio oficial de Dock 71 en Cantù: pizzas fermentadas 48h, hamburguesas artesanales, 14 cervezas de barril, Sky Sport HD y grúa portuaria histórica de 1912."
  }
};

/**
 * Traduzioni chiave per i testi dell'interfaccia (menu, bottoni, modali, footer)
 */
export const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    "Home": "Home",
    "Menù & Birre": "Menu & Beers",
    "Il Locale & Sky": "The Venue & Sky",
    "Galleria": "Gallery",
    "Da noi puoi...": "Experiences",
    "Contatti": "Contact",
    "PRENOTA ORA": "BOOK NOW",
    "TAVOLI": "TABLES",
    "Prenota un Tavolo": "Book a Table",
    "Chiama: 031 4487120": "Call: 031 4487120",
    "Assicurati il Tuo Tavolo": "Reserve Your Table",
    "MOLO DOCK 71 CANTÙ": "DOCK 71 CANTÙ PIER",
    "RISPOSTA RAPIDA": "FAST REPLY",
    "WhatsApp Diretto": "Direct WhatsApp",
    "Chiama al Pub": "Call the Pub",
    "Modulo di Contatto": "Contact Form",
    "Inviaci un Messaggio": "Send us a Message",
    "Lingua": "Language",
    "Seleziona lingua": "Select language",
    "Torna alla Home": "Back to Home",
    "Pagina non trovata": "Page Not Found",
    "Ops! La pagina che cerchi non esiste al Molo.": "Oops! The page you are looking for does not exist on the Dock.",
    "Gestisci preferenze cookie": "Manage cookie preferences"
  },
  de: {
    "Home": "Startseite",
    "Menù & Birre": "Speisekarte & Biere",
    "Il Locale & Sky": "Das Lokal & Sky",
    "Galleria": "Galerie",
    "Da noi puoi...": "Erlebnisse",
    "Contatti": "Kontakt",
    "PRENOTA ORA": "JETZT RESERVIEREN",
    "TAVOLI": "TISCHE",
    "Prenota un Tavolo": "Tisch reservieren",
    "Chiama: 031 4487120": "Anrufen: 031 4487120",
    "Assicurati il Tuo Tavolo": "Sichern Sie sich Ihren Tisch",
    "MOLO DOCK 71 CANTÙ": "DOCK 71 CANTÙ PIER",
    "RISPOSTA RAPIDA": "SCHNELLE ANTWORT",
    "WhatsApp Diretto": "Direktes WhatsApp",
    "Chiama al Pub": "Pub anrufen",
    "Modulo di Contatto": "Kontaktformular",
    "Inviaci un Messaggio": "Nachricht senden",
    "Lingua": "Sprache",
    "Seleziona lingua": "Sprache wählen",
    "Torna alla Home": "Zurück zur Startseite",
    "Pagina non trovata": "Seite nicht gefunden",
    "Ops! La pagina che cerchi non esiste al Molo.": "Hoppla! Die gesuchte Seite existiert nicht am Dock.",
    "Gestisci preferenze cookie": "Cookie-Einstellungen verwalten"
  },
  fr: {
    "Home": "Accueil",
    "Menù & Birre": "Menu & Bières",
    "Il Locale & Sky": "Le Lieu & Sky",
    "Galleria": "Galerie",
    "Da noi puoi...": "Expériences",
    "Contatti": "Contact",
    "PRENOTA ORA": "RÉSERVER",
    "TAVOLI": "TABLES",
    "Prenota un Tavolo": "Réserver une table",
    "Chiama: 031 4487120": "Appeler : 031 4487120",
    "Assicurati il Tuo Tavolo": "Assurez votre table",
    "MOLO DOCK 71 CANTÙ": "QUAI DOCK 71 CANTÙ",
    "RISPOSTA RAPIDA": "RÉPONSE RAPIDE",
    "WhatsApp Diretto": "WhatsApp Direct",
    "Chiama al Pub": "Appeler le Pub",
    "Modulo di Contatto": "Formulaire de contact",
    "Inviaci un Messaggio": "Envoyez-nous un message",
    "Lingua": "Langue",
    "Seleziona lingua": "Choisir la langue",
    "Torna alla Home": "Retour à l'accueil",
    "Pagina non trovata": "Page non trouvée",
    "Ops! La pagina che cerchi non esiste al Molo.": "Oups ! La page que vous cherchez n'existe pas sur le Quai.",
    "Gestisci preferenze cookie": "Gérer les préférences des cookies"
  },
  es: {
    "Home": "Inicio",
    "Menù & Birre": "Menú & Cervezas",
    "Il Locale & Sky": "El Local & Sky",
    "Galleria": "Galería",
    "Da noi puoi...": "Experiencias",
    "Contatti": "Contacto",
    "PRENOTA ORA": "RESERVAR AHORA",
    "TAVOLI": "MESAS",
    "Prenota un Tavolo": "Reservar una Mesa",
    "Chiama: 031 4487120": "Llamar: 031 4487120",
    "Assicurati il Tuo Tavolo": "Asegura Tu Mesa",
    "MOLO DOCK 71 CANTÙ": "MUELLE DOCK 71 CANTÙ",
    "RISPOSTA RAPIDA": "RESPUESTA RÁPIDA",
    "WhatsApp Diretto": "WhatsApp Directo",
    "Chiama al Pub": "Llamar al Pub",
    "Modulo di Contatto": "Formulario de contacto",
    "Inviaci un Messaggio": "Envíanos un mensaje",
    "Lingua": "Idioma",
    "Seleziona lingua": "Seleccionar idioma",
    "Torna alla Home": "Volver al Inicio",
    "Pagina non trovata": "Página no encontrada",
    "Ops! La pagina che cerchi non esiste al Molo.": "¡Vaya! La página que buscas no existe en el Muelle.",
    "Gestisci preferenze cookie": "Gestionar preferencias de cookies"
  },
  nl: {
    "Home": "Home",
    "Menù & Birre": "Menu & Bieren",
    "Il Locale & Sky": "Het Café & Sky",
    "Galleria": "Galerij",
    "Da noi puoi...": "Belevingen",
    "Contatti": "Contact",
    "PRENOTA ORA": "RESERVEER NU",
    "TAVOLI": "TAFELS",
    "Prenota un Tavolo": "Reserveer een tafel",
    "Chiama: 031 4487120": "Bellen: 031 4487120",
    "Assicurati il Tuo Tavolo": "Verzeker je van een tafel",
    "MOLO DOCK 71 CANTÙ": "DOCK 71 PIER CANTÙ",
    "RISPOSTA RAPIDA": "SNEL ANTWOORD",
    "WhatsApp Diretto": "Direct WhatsApp",
    "Chiama al Pub": "Bel de Pub",
    "Modulo di Contatto": "Contactformulier",
    "Inviaci un Messaggio": "Stuur ons een bericht",
    "Lingua": "Taal",
    "Seleziona lingua": "Selecteer taal",
    "Torna alla Home": "Terug naar Home",
    "Pagina non trovata": "Pagina niet gevonden",
    "Ops! La pagina che cerchi non esiste al Molo.": "Oeps! De pagina die je zoekt bestaat niet aan de Kade.",
    "Gestisci preferenze cookie": "Cookievoorkeuren beheren"
  },
  zh: {
    "Home": "首页",
    "Menù & Birre": "菜单与精酿",
    "Il Locale & Sky": "酒馆空间与Sky赛事",
    "Galleria": "图库相册",
    "Da noi puoi...": "精彩体验",
    "Contatti": "联系方式",
    "PRENOTA ORA": "立即订位",
    "TAVOLI": "餐桌预订",
    "Prenota un Tavolo": "预订餐桌",
    "Chiama: 031 4487120": "电话: 031 4487120",
    "Assicurati il Tuo Tavolo": "锁定您的专属座位",
    "MOLO DOCK 71 CANTÙ": "坎图 DOCK 71 码头酒馆",
    "RISPOSTA RAPIDA": "快速回复",
    "WhatsApp Diretto": "WhatsApp 直联",
    "Chiama al Pub": "拨打酒馆电话",
    "Modulo di Contatto": "在线留言表格",
    "Inviaci un Messaggio": "给我们发送消息",
    "Lingua": "语言切换",
    "Seleziona lingua": "选择语言",
    "Torna alla Home": "返回首页",
    "Pagina non trovata": "页面未找到",
    "Ops! La pagina che cerchi non esiste al Molo.": "抱歉！您在码头寻找的页面不存在。",
    "Gestisci preferenze cookie": "管理 Cookie 偏好"
  },
  ru: {
    "Home": "Главная",
    "Menù & Birre": "Меню и Пиво",
    "Il Locale & Sky": "О Пабе и Sky Sport",
    "Galleria": "Галерея",
    "Da noi puoi...": "Впечатления",
    "Contatti": "Контакты",
    "PRENOTA ORA": "ЗАБРОНИРОВАТЬ",
    "TAVOLI": "СТОЛЫ",
    "Prenota un Tavolo": "Забронировать стол",
    "Chiama: 031 4487120": "Позвонить: 031 4487120",
    "Assicurati il Tuo Tavolo": "Забронируйте ваш стол",
    "MOLO DOCK 71 CANTÙ": "ПРИЧАЛ DOCK 71 КАНТУ",
    "RISPOSTA RAPIDA": "БЫСТРЫЙ ОТВЕТ",
    "WhatsApp Diretto": "Прямой WhatsApp",
    "Chiama al Pub": "Позвонить в паб",
    "Modulo di Contatto": "Форма контактов",
    "Inviaci un Messaggio": "Отправить сообщение",
    "Lingua": "Язык",
    "Seleziona lingua": "Выберите язык",
    "Torna alla Home": "Вернуться на главную",
    "Pagina non trovata": "Страница не найдена",
    "Ops! La pagina che cerchi non esiste al Molo.": "Увы! Страница, которую вы ищете, отсутствует на Причале.",
    "Gestisci preferenze cookie": "Управление файлами cookie"
  },
  ar: {
    "Home": "الرئيسية",
    "Menù & Birre": "القائمة والمشروبات",
    "Il Locale & Sky": "المكان وبث المباريات",
    "Galleria": "معرض الصور",
    "Da noi puoi...": "التجارب",
    "Contatti": "اتصل بنا",
    "PRENOTA ORA": "احجز الآن",
    "TAVOLI": "طاولات",
    "Prenota un Tavolo": "حجز طاولة",
    "Chiama: 031 4487120": "اتصل: 031 4487120",
    "Assicurati il Tuo Tavolo": "احجز مقعدك الآن",
    "MOLO DOCK 71 CANTÙ": "رصيف دوك 71 كانتو",
    "RISPOSTA RAPIDA": "استجابة سريعة",
    "WhatsApp Diretto": "واتساب مباشر",
    "Chiama al Pub": "اتصل بالحانة",
    "Modulo di Contatto": "نموذج المراسلة",
    "Inviaci un Messaggio": "أرسل لنا رسالة",
    "Lingua": "اللغة",
    "Seleziona lingua": "اختر اللغة",
    "Torna alla Home": "العودة للرئيسية",
    "Pagina non trovata": "الصفحة غير موجودة",
    "Ops! La pagina che cerchi non esiste al Molo.": "عذراً! الصفحة التي تبحث عنها غير متوفرة في الرصيف.",
    "Gestisci preferenze cookie": "إدارة ملفات تعريف الارتباط"
  }
};

/**
 * Traduce una stringa se presente nel dizionario della lingua corrente
 */
export function translateText(text: string, langCode: string): string {
  if (langCode === 'it' || !UI_TRANSLATIONS[langCode]) return text;
  return UI_TRANSLATIONS[langCode][text] || text;
}

export const FloatingLanguageSelector: React.FC<{
  currentLang: string;
  onLanguageChange: (langCode: string) => void;
}> = ({ currentLang, onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Rileva lingua attiva dall'URL o prop
  const currentLanguageObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  // Chiudi cliccando fuori
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Gestione SEO Dinamico On-Page (Title, Meta Description, Hreflang, HTML lang & dir)
  useEffect(() => {
    // 1. Aggiorna <html lang="..." dir="...">
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLanguageObj.dir || 'ltr';

    // 2. Aggiorna <title>
    const seoData = SEO_DICTIONARY[currentLang] || SEO_DICTIONARY.it;
    document.title = seoData.title;

    // 3. Aggiorna <meta name="description">
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoData.description);

    // 4. Aggiorna <link rel="alternate" hreflang="..." href="..."> per motori di ricerca
    const currentOrigin = window.location.origin;
    const currentPathWithoutLang = window.location.pathname.replace(/^\/(en|de|fr|nl|zh|ru|ar|es)(\/|$)/, '/');

    SUPPORTED_LANGUAGES.forEach((l) => {
      const hreflangId = `hreflang-${l.code}`;
      let linkTag = document.getElementById(hreflangId) as HTMLLinkElement | null;
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.id = hreflangId;
        linkTag.rel = 'alternate';
        linkTag.hreflang = l.code;
        document.head.appendChild(linkTag);
      }
      const targetPath = l.code === 'it' ? currentPathWithoutLang : `/${l.code}${currentPathWithoutLang === '/' ? '' : currentPathWithoutLang}`;
      linkTag.href = `${currentOrigin}${targetPath}`;
    });

    // Tag x-default hreflang
    let xDefault = document.getElementById('hreflang-x-default') as HTMLLinkElement | null;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.id = 'hreflang-x-default';
      xDefault.rel = 'alternate';
      xDefault.hreflang = 'x-default';
      document.head.appendChild(xDefault);
    }
    xDefault.href = `${currentOrigin}${currentPathWithoutLang}`;
  }, [currentLang, currentLanguageObj]);

  const selectLanguage = (code: string) => {
    onLanguageChange(code);
    setIsOpen(false);

    // Mappatura codici per Google Translate (es. zh -> zh-CN)
    const googleLangCode = code === 'zh' ? 'zh-CN' : code;

    // 1. Imposta cookie 'googtrans' per attivare la traduzione automatica su 100% dei testi del DOM
    try {
      const cookieVal = code === 'it' ? '' : `/it/${googleLangCode}`;
      document.cookie = `googtrans=${cookieVal}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=${cookieVal}; path=/`;

      // Se presente l'elemento di Google Translate, attiva il select
      const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (selectElem) {
        selectElem.value = googleLangCode;
        selectElem.dispatchEvent(new Event('change'));
      } else if (code !== 'it') {
        // Se non ancora pronto, ricarica o riprova
        setTimeout(() => {
          const delayedSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
          if (delayedSelect) {
            delayedSelect.value = googleLangCode;
            delayedSelect.dispatchEvent(new Event('change'));
          }
        }, 300);
      }
    } catch (e) {
      console.debug('Translate cookie setup:', e);
    }

    // 2. Riscrive l'URL dinamico inserendo il prefisso lingua (es. /en/, /de/, ecc.)
    try {
      const currentPath = window.location.pathname;
      const stripped = currentPath.replace(/^\/(en|de|fr|nl|zh|ru|ar|es)(\/|$)/, '/');
      const newPath = code === 'it' ? stripped : `/${code}${stripped === '/' ? '' : stripped}`;
      window.history.pushState({ lang: code }, '', newPath);
    } catch (e) {
      console.debug('History pushState handled:', e);
    }
  };

  return (
    <aside
      aria-label="Selettore lingua traduzione sito"
      ref={dropdownRef}
      className="fixed bottom-6 left-6 z-[9999] flex flex-col items-start select-none"
    >
      {/* MENU A TENDINA / GRIGLIA FLUIDA DELLE 9 LINGUE SUPPORTATE */}
      {isOpen && (
        <div
          className="mb-3.5 w-64 sm:w-72 rounded-2xl bg-[#FFF9EB] border-2 border-dock-burgundy shadow-2xl p-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="menu"
          aria-label="Seleziona lingua"
        >
          {/* Header del selettore */}
          <div className="px-2.5 py-1.5 border-b border-[#E8E2D4] flex items-center justify-between mb-2">
            <span className="font-chunky text-xs uppercase text-[#7B2039] tracking-wider">
              Lingua / Language
            </span>
            <span className="font-mono-tech text-[9px] bg-dock-green px-1.5 py-0.2 rounded text-white font-bold">
              9 LINGUE
            </span>
          </div>

          {/* Griglia lingue */}
          <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-dock-burgundy text-white font-bold shadow-xs'
                      : 'hover:bg-[#F3EDDF] text-[#1D1C13]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{lang.flag}</span>
                    <span className="font-epilogue text-xs tracking-wide">
                      {lang.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono-tech text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-dock-mustard text-dock-carbon'
                        : 'bg-[#E8E2D4] text-[#554245]'
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-[#E8E2D4] px-1 text-center">
            <span className="font-work text-[10px] text-[#7A7265] italic">
              Traduzione automatica neurale on-the-fly
            </span>
          </div>
        </div>
      )}

      {/* PULSANTE FISSO IN BASSO A SINISTRA (TRIGGER) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Apri selettore lingua"
        className={`h-14 px-4 rounded-full flex items-center gap-2.5 text-white shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer border-2 ${
          isOpen
            ? 'bg-[#1D1C13] border-white text-dock-mustard ring-4 ring-black/20'
            : 'bg-white text-[#1D1C13] border-dock-burgundy hover:border-dock-mustard hover:bg-[#F3EDDF] shadow-dock-burgundy/20 ring-4 ring-dock-burgundy/10'
        }`}
      >
        <span className="text-2xl leading-none">{currentLanguageObj.flag}</span>
        <div className="flex flex-col text-left">
          <span className="font-mono-tech text-[9px] font-bold text-[#7A7265] uppercase leading-none">
            {currentLanguageObj.code.toUpperCase()}
          </span>
          <span className="font-epilogue text-xs font-black text-[#1D1C13] leading-none mt-0.5">
            {currentLanguageObj.name.split(' ')[0]}
          </span>
        </div>
        <span className="material-symbols-outlined notranslate text-base text-dock-burgundy ml-0.5">
          {isOpen ? 'expand_more' : 'language'}
        </span>
      </button>
    </aside>
  );
};
