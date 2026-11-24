import React, { useEffect } from 'react';
import { AppView } from '../App';

export type SeoPageKey = AppView | 'coming-soon';

interface SeoMetaConfig {
  title: string;
  description: string;
  keywords: string;
  robots: string;
  path: string;
  ogType: string;
  pageSchemaType: string;
}

const SEO_CONFIG_BY_PAGE: Record<SeoPageKey, SeoMetaConfig> = {
  'coming-soon': {
    title: 'Dock 71 Cantù | Birreria, Griglia, Burger & Pizza – Prenota Ora',
    description:
      'Nuovo sito in arrivo per Dock 71 a Cantù (Via Milano 71): consulta subito il Menù Cucina, la Carta Beverage & Birre Artigianali e prenota online il tuo tavolo.',
    keywords:
      'Dock 71 Cantù, prenota tavolo Dock 71, menù Dock 71 Cantù, birreria artigianale Cantù, hamburgeria Cantù, pizzeria lunga lievitazione Cantù',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/',
    ogType: 'restaurant',
    pageSchemaType: 'WebPage',
  },
  home: {
    title: 'Dock 71 Cantù | Birreria & Pub Industrial – Griglia, Malto e Farina',
    description:
      'Dock 71 a Cantù (Via Milano 71): birreria artigianale, griglia, burger gourmet, pizze a lunga lievitazione 48h e Sky Sport Maxischermo. Prenota ora il tuo tavolo online.',
    keywords:
      'Dock 71 Cantù, pub Cantù, birreria artigianale Cantù, hamburgeria Como, pizzeria 48h Cantù, Sky Sport pub Cantù, Via Milano 71 Cantù',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/',
    ogType: 'restaurant',
    pageSchemaType: 'WebPage',
  },
  menu: {
    title: 'Menù & Birre Artigianali | Dock 71 Cantù – Burger, Pizze 48h e Tap List',
    description:
      'Scopri il menù ufficiale di Dock 71 Cantù: birre alla spina e artigianali, hamburger gourmet, carni alla griglia, pizze a lunga lievitazione 48h e Formula Lunch.',
    keywords:
      'menù Dock 71 Cantù, birre alla spina Cantù, birre artigianali Rurale Menaresta, burger gourmet Cantù, pizza lunga lievitazione Cantù, formula lunch Cantù',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/menu',
    ogType: 'restaurant.menu',
    pageSchemaType: 'Menu',
  },
  locale: {
    title: 'Il Locale & Sky Sport Maxischermo | Dock 71 Pub Industrial Cantù',
    description:
      'Esplora gli ambienti di Dock 71 a Cantù: la storica Gru industriale, il Grande Bancone Spine, la Terrazza Esterna e il palinsesto partite live su Sky Sport Maxischermo.',
    keywords:
      'Sky Sport Cantù pub, dove vedere partite Cantù, Champions League pub Cantù, Serie A maxischermo Cantù, Sala Gru Dock 71',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/il-locale-sky-sport',
    ogType: 'place',
    pageSchemaType: 'WebPage',
  },
  galleria: {
    title: 'Galleria Fotografica | Dock 71 Cantù – Piatti, Birre e Atmosfera Pub',
    description:
      'Guarda gli scatti ufficiali di Dock 71 Cantù: le nostre pizze 48h, i burger artigianali, le spine del bancone, la Sala Gru e le serate live.',
    keywords:
      'foto Dock 71 Cantù, galleria pub Cantù, immagini piatti Dock 71, birreria industriale Cantù foto',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/galleria',
    ogType: 'website',
    pageSchemaType: 'ImageGallery',
  },
  esperienze: {
    title: 'Da Noi Puoi... Le 7 Esperienze | Dock 71 Birreria & Pub Cantù',
    description:
      'Scopri le 7 esperienze firmate Dock 71 Cantù: birre artigianali alla spina, griglia e burger, pizza 48h, Sky Sport Maxischermo, Formula Lunch, feste ed eventi privati.',
    keywords:
      'feste di compleanno pub Cantù, cena aziendale Cantù, aperitivo Cantù birreria, terzo tempo rugby Cantù, eventi privati Dock 71',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/da-noi-puoi',
    ogType: 'website',
    pageSchemaType: 'CollectionPage',
  },
  contatti: {
    title: 'Contatti, Orari e Come Raggiungerci | Dock 71 Via Milano 71 Cantù',
    description:
      'Contatta Dock 71 a Cantù in Via Milano 71: orari di apertura pranzo e cena, parcheggio dedicato, telefono +39 031 712063, WhatsApp e modulo richieste.',
    keywords:
      'contatti Dock 71 Cantù, telefono Dock 71, indirizzo Dock 71 Via Milano 71, orari apertura pub Cantù, parcheggio Dock 71',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/contatti',
    ogType: 'website',
    pageSchemaType: 'ContactPage',
  },
  prenota: {
    title: 'Prenota Ora il Tuo Tavolo Online | Dock 71 Birreria & Pub Cantù',
    description:
      'Prenota online il tuo tavolo da Dock 71 a Cantù in meno di 30 secondi per pranzo, cena o per seguire le partite su Sky Sport Maxischermo. Conferma immediata.',
    keywords:
      'prenota tavolo Dock 71 Cantù, prenotazione online pub Cantù, riservare tavolo birreria Cantù, prenota partita Sky Sport Cantù',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    path: '/prenota-ora',
    ogType: 'website',
    pageSchemaType: 'WebPage',
  },
  'grazie-contatto': {
    title: 'Messaggio Inviato – Grazie per averci contattato | Dock 71 Cantù',
    description:
      'Abbiamo ricevuto la tua richiesta di contatto. Lo staff di Dock 71 Cantù ti risponderà al più presto.',
    keywords: 'conferma contatto Dock 71 Cantù',
    robots: 'noindex, follow',
    path: '/grazie-contatto',
    ogType: 'website',
    pageSchemaType: 'WebPage',
  },
  'grazie-prenotazione': {
    title: 'Prenotazione Ricevuta – Ti aspettiamo al Dock 71 Cantù',
    description:
      'La tua richiesta di prenotazione tavolo presso Dock 71 Cantù è stata registrata con successo.',
    keywords: 'conferma prenotazione Dock 71 Cantù',
    robots: 'noindex, follow',
    path: '/grazie-prenotazione',
    ogType: 'website',
    pageSchemaType: 'WebPage',
  },
  'not-found': {
    title: 'Pagina Non Trovata (404) | Dock 71 Cantù',
    description: 'La pagina richiesta non è disponibile. Torna alla Home di Dock 71 Cantù.',
    keywords: '404 Dock 71 Cantù',
    robots: 'noindex, nofollow',
    path: '/404',
    ogType: 'website',
    pageSchemaType: 'WebPage',
  },
  admin: {
    title: 'Area Riservata CRM & Controllo | Dock 71 Cantù',
    description: 'Pannello di controllo riservato all’amministrazione di Dock 71 Cantù.',
    keywords: 'admin Dock 71',
    robots: 'noindex, nofollow',
    path: '/admin',
    ogType: 'website',
    pageSchemaType: 'WebPage',
  },
};

function setOrCreateMeta(attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector(`meta[${attrName}="${attrValue}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOrCreateLink(rel: string, href: string, extraAttrs?: Record<string, string>) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  if (extraAttrs) {
    Object.entries(extraAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
  }
}

interface SeoHeadProps {
  page: SeoPageKey;
  customSubtitle?: string;
}

export const SeoHead: React.FC<SeoHeadProps> = ({ page, customSubtitle }) => {
  useEffect(() => {
    const config = SEO_CONFIG_BY_PAGE[page] || SEO_CONFIG_BY_PAGE.home;
    const baseTitle = customSubtitle
      ? `${customSubtitle} – ${config.title}`
      : config.title;

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://www.dock71birreria.it';
    const canonicalUrl = `${origin}${config.path}`;
    const faviconUrl = 'https://www.dock71birreria.it/produzione_cpanel/favicon.svg';

    // 1. Document Title
    document.title = baseTitle;

    // 2. Favicon & App Icons enforcement
    setOrCreateLink('icon', faviconUrl, { type: 'image/svg+xml' });
    setOrCreateLink('shortcut icon', faviconUrl, { type: 'image/svg+xml' });
    setOrCreateLink('apple-touch-icon', faviconUrl);
    setOrCreateLink('canonical', canonicalUrl);

    // 3. Standard SEO Meta Tags
    setOrCreateMeta('name', 'description', config.description);
    setOrCreateMeta('name', 'keywords', config.keywords);
    setOrCreateMeta('name', 'robots', config.robots);
    setOrCreateMeta('name', 'author', 'Dock 71 Cantù');
    setOrCreateMeta('name', 'theme-color', '#7B2039');

    // 4. OpenGraph Meta Tags
    setOrCreateMeta('property', 'og:title', baseTitle);
    setOrCreateMeta('property', 'og:description', config.description);
    setOrCreateMeta('property', 'og:type', config.ogType);
    setOrCreateMeta('property', 'og:url', canonicalUrl);
    setOrCreateMeta('property', 'og:site_name', 'Dock 71 Cantù');
    setOrCreateMeta('property', 'og:locale', 'it_IT');
    setOrCreateMeta('property', 'og:image', faviconUrl);
    setOrCreateMeta('property', 'og:image:alt', baseTitle);

    // 5. Twitter Card Meta Tags
    setOrCreateMeta('name', 'twitter:card', 'summary_large_image');
    setOrCreateMeta('name', 'twitter:title', baseTitle);
    setOrCreateMeta('name', 'twitter:description', config.description);
    setOrCreateMeta('name', 'twitter:image', faviconUrl);

    // 6. Dynamic Page-Specific JSON-LD Schema.org
    let pageSchemaScript = document.getElementById('schema-org-page-jsonld') as HTMLScriptElement | null;
    if (!pageSchemaScript) {
      pageSchemaScript = document.createElement('script');
      pageSchemaScript.id = 'schema-org-page-jsonld';
      pageSchemaScript.type = 'application/ld+json';
      document.head.appendChild(pageSchemaScript);
    }

    const pageJsonLd = {
      '@context': 'https://schema.org',
      '@type': config.pageSchemaType,
      name: baseTitle,
      description: config.description,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dock 71 Cantù',
        url: origin,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Dock 71 Cantù',
            item: origin,
          },
          ...(config.path !== '/'
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: baseTitle.split('|')[0].trim(),
                  item: canonicalUrl,
                },
              ]
            : []),
        ],
      },
    };

    pageSchemaScript.textContent = JSON.stringify(pageJsonLd);
  }, [page, customSubtitle]);

  return null;
};
