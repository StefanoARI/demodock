import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  MatchEvent,
  GalleryImage,
  BEER_TAPS,
  FOOD_MENU,
  MATCHES_SCHEDULE,
  GALLERY_ITEMS
} from '../data/pubData';
import { GALLERY_PAGE_ITEMS, GalleryItemData } from '../components/GalleryPage';

export interface SeasonalMenuConfig {
  id: string;
  name: string;
  season: 'inverno' | 'primavera' | 'estate' | 'autunno' | 'speciale';
  startDate: string;
  endDate: string;
  isActive: boolean;
  bannerNotice?: string;
  specialBadge?: string;
  dishes?: DynamicMenuItem[];
}

export interface CustomCategory {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  icon?: string;
  description?: string;
}

export interface DynamicMenuItem extends MenuItem {
  isSeasonal?: boolean;
  seasonalMenuId?: string;
  publishStartDate?: string;
  publishEndDate?: string;
  isActive: boolean;
  customCategorySlug?: string;
}

export interface DynamicMatchEvent extends MatchEvent {
  isActive: boolean;
  beerRecommendation?: string;
  availableTables?: number;
}

export interface DynamicGalleryItem {
  id: string;
  url: string;
  title: string;
  category: 'cucina' | 'birre' | 'locale' | 'terrazza' | 'pizza' | 'burger' | 'community';
  badge: string;
  caption: string;
  format?: 'webp' | 'avif' | 'jpg' | 'png';
  isFeatured?: boolean;
}

export type BookingStatus = 'In Attesa' | 'Confermato' | 'Rifiutato';

export interface BookingRecord {
  id: string;
  bookingCode: string;
  date: string;
  timeSlot: string;
  name: string;
  email: string;
  phone: string;
  guests: number;
  area: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  source: 'Pagina Prenota' | 'Modale Rapido' | 'Widget Contatti' | 'Eventi Privati';
  gdprAccepted: boolean;
  rejectionReason?: string;
  lastEmailSentAt?: string;
  emailHtmlPreview?: string;
}

export type ContactStatus = 'Nuovo' | 'Letto' | 'Risposto';

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  ip: string;
  status: ContactStatus;
  source: 'Pagina Contatti' | 'Widget Rapido';
  gdprAccepted: boolean;
  replyMessage?: string;
  repliedAt?: string;
  emailHtmlPreview?: string;
}

export interface ConsentRecord {
  id: string;
  ip: string;
  timestamp: string;
  purposes: string[];
  userAgent: string;
  source: 'Cookie Banner' | 'Form Prenotazione' | 'Form Contatti';
  analyticsAccepted: boolean;
  marketingAccepted: boolean;
}

export interface SentEmailLog {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  type: 'booking_confirmed' | 'booking_rejected' | 'contact_reply';
  sentAt: string;
  htmlContent: string;
  relatedRecordId: string;
}

/**
 * Genera il template HTML dell'email con il layout ufficiale di Dock 71 Cantù
 * (Palette avorio #FFF9EB, bordeaux #7B2039, verde molo #336859, senape #E0A93B)
 */
export function buildDock71EmailTemplate(options: {
  badgeText: string;
  badgeColor: 'green' | 'burgundy' | 'mustard';
  headline: string;
  greetingName: string;
  introText: string;
  detailsRows?: { label: string; value: string }[];
  highlightBoxTitle?: string;
  highlightBoxText?: string;
  highlightBoxTone?: 'success' | 'danger' | 'neutral';
  ctaText?: string;
  ctaUrl?: string;
}): string {
  const badgeBg =
    options.badgeColor === 'green'
      ? '#336859'
      : options.badgeColor === 'mustard'
      ? '#E0A93B'
      : '#7B2039';
  const badgeFg = options.badgeColor === 'mustard' ? '#1D1C13' : '#FFFFFF';

  const boxBg =
    options.highlightBoxTone === 'success'
      ? '#E8F5E9'
      : options.highlightBoxTone === 'danger'
      ? '#FFEBEE'
      : '#F3EDDF';
  const boxBorder =
    options.highlightBoxTone === 'success'
      ? '#336859'
      : options.highlightBoxTone === 'danger'
      ? '#7B2039'
      : '#E0A93B';

  const detailsHtml =
    options.detailsRows && options.detailsRows.length > 0
      ? `<table style="width:100%; border-collapse:collapse; margin:20px 0; background:#FFFFFF; border:2px solid #E8E2D4; border-radius:12px; overflow:hidden;">
          ${options.detailsRows
            .map(
              (r, i) => `
            <tr style="border-bottom:${i === options.detailsRows!.length - 1 ? 'none' : '1px solid #F0EBE2'};">
              <td style="padding:10px 14px; font-size:12px; font-weight:700; color:#7A7265; text-transform:uppercase; width:38%; background:#FAF7F2;">${r.label}</td>
              <td style="padding:10px 14px; font-size:13px; font-weight:700; color:#1D1C13;">${r.value}</td>
            </tr>`
            )
            .join('')}
        </table>`
      : '';

  const highlightHtml = options.highlightBoxText
    ? `<div style="margin:20px 0; padding:16px 18px; background:${boxBg}; border-left:5px solid ${boxBorder}; border-radius:10px;">
        ${
          options.highlightBoxTitle
            ? `<div style="font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:${boxBorder}; margin-bottom:6px;">${options.highlightBoxTitle}</div>`
            : ''
        }
        <div style="font-size:14px; line-height:1.55; color:#1D1C13; white-space:pre-line;">${options.highlightBoxText}</div>
      </div>`
    : '';

  return `
<div style="font-family:'Work Sans', Arial, sans-serif; background-color:#FAF7F2; padding:24px 12px; color:#1D1C13;">
  <div style="max-width:600px; margin:0 auto; background-color:#FFF9EB; border:3px solid #7B2039; border-radius:20px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
    <!-- Top Checkerboard Header Strip -->
    <div style="height:10px; background:repeating-linear-gradient(90deg, #7B2039 0px, #7B2039 16px, #FFF9EB 16px, #FFF9EB 32px); border-bottom:2px solid #E8E2D4;"></div>

    <!-- Brand Header -->
    <div style="background-color:#F3EDDF; padding:20px 24px; border-bottom:2px solid #E8E2D4; text-align:center;">
      <div style="display:inline-block; padding:4px 12px; background-color:${badgeBg}; color:${badgeFg}; border-radius:999px; font-size:11px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:8px;">
        ${options.badgeText}
      </div>
      <h1 style="margin:4px 0 0; font-size:24px; font-weight:900; color:#7B2039; text-transform:uppercase; letter-spacing:-0.02em;">
        DOCK 71 CANTÙ
      </h1>
      <div style="font-size:11px; font-weight:700; color:#336859; text-transform:uppercase; letter-spacing:0.08em; margin-top:2px;">
        BIRRERIA &amp; PUB INDUSTRIAL • VIA MILANO 71, CANTÙ (CO)
      </div>
    </div>

    <!-- Body -->
    <div style="padding:26px 24px;">
      <h2 style="margin:0 0 14px; font-size:20px; font-weight:800; color:#1D1C13; text-transform:uppercase;">
        ${options.headline}
      </h2>
      <p style="margin:0 0 12px; font-size:14px; line-height:1.6; color:#554245;">
        Ciao <strong style="color:#1D1C13;">${options.greetingName}</strong>,
      </p>
      <p style="margin:0 0 16px; font-size:14px; line-height:1.6; color:#554245;">
        ${options.introText}
      </p>

      ${highlightHtml}
      ${detailsHtml}

      ${
        options.ctaText
          ? `<div style="text-align:center; margin:24px 0 10px;">
              <a href="${options.ctaUrl || 'https://wa.me/390314487120'}" target="_blank" rel="noreferrer" style="display:inline-block; padding:13px 26px; background-color:#7B2039; color:#FFFFFF; text-decoration:none; font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; border-radius:12px; border:2px solid #E0A93B;">
                ${options.ctaText}
              </a>
            </div>`
          : ''
      }
    </div>

    <!-- Footer -->
    <div style="background-color:#F3EDDF; padding:16px 24px; border-top:2px solid #E8E2D4; text-align:center; font-size:11px; color:#7A7265;">
      <div style="font-weight:700; color:#1D1C13; margin-bottom:4px;">
        DOCK 71 CANTÙ • MALTO, GRIGLIA &amp; ROCK'N'ROLL
      </div>
      <div>Via Milano 71, 22063 Cantù (CO) • Tel / WhatsApp: 031 4487120</div>
      <div style="margin-top:4px; font-size:10px;">Parcheggio Riservato Gratuito (50+ posti) • Aperti 7 giorni su 7</div>
    </div>
  </div>
</div>`.trim();
}

interface SiteDataContextType {
  // Menù & Birre
  menuItems: DynamicMenuItem[];
  seasonalMenus: SeasonalMenuConfig[];
  categories: CustomCategory[];
  addMenuItem: (item: Omit<DynamicMenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<DynamicMenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemStatus: (id: string) => void;
  reorderMenuItems: (items: DynamicMenuItem[]) => void;

  // Categorie
  addCategory: (cat: Omit<CustomCategory, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<CustomCategory>) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: CustomCategory[]) => void;

  // Menù Stagionali
  addSeasonalMenu: (menu: Omit<SeasonalMenuConfig, 'id'>) => void;
  updateSeasonalMenu: (id: string, menu: Partial<SeasonalMenuConfig>) => void;
  deleteSeasonalMenu: (id: string) => void;
  addSeasonalDish: (seasonalMenuId: string, dish: Omit<DynamicMenuItem, 'id'>) => void;
  removeSeasonalDish: (seasonalMenuId: string, dishId: string) => void;
  reorderSeasonalDishes: (seasonalMenuId: string, dishes: DynamicMenuItem[]) => void;

  // Palinsesto Eventi Sportivi Live
  matches: DynamicMatchEvent[];
  addMatch: (match: Omit<DynamicMatchEvent, 'id'>) => void;
  updateMatch: (id: string, match: Partial<DynamicMatchEvent>) => void;
  deleteMatch: (id: string) => void;
  toggleMatchStatus: (id: string) => void;

  // Galleria Fotografica
  galleryItems: DynamicGalleryItem[];
  addGalleryItem: (item: Omit<DynamicGalleryItem, 'id'>) => void;
  updateGalleryItem: (id: string, item: Partial<DynamicGalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;

  // CRM Prenotazioni, Contatti, Consensi GDPR & Log Email
  bookings: BookingRecord[];
  addBooking: (booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & { status?: BookingStatus }) => BookingRecord;
  updateBookingStatus: (id: string, status: BookingStatus, rejectionReason?: string) => SentEmailLog | null;
  deleteBooking: (id: string) => void;
  deleteBookingsBulk: (ids: string[]) => void;

  contacts: ContactRecord[];
  addContact: (contact: Omit<ContactRecord, 'id' | 'createdAt' | 'status' | 'ip'>) => ContactRecord;
  replyToContact: (id: string, replySubject: string, replyMessage: string) => SentEmailLog | null;
  markContactStatus: (id: string, status: ContactStatus) => void;
  deleteContact: (id: string) => void;
  deleteContactsBulk: (ids: string[]) => void;

  consents: ConsentRecord[];
  addConsentLog: (consent: Omit<ConsentRecord, 'id' | 'timestamp' | 'ip'>) => void;
  deleteConsentLog: (id: string) => void;
  deleteConsentLogsBulk: (ids: string[]) => void;

  sentEmails: SentEmailLog[];

  // Ripristino dati default
  resetToDefaults: () => void;
}

const STORAGE_KEYS = {
  MENU: 'dock71_dynamic_menu_v3',
  SEASONAL: 'dock71_seasonal_menus_v3',
  CATEGORIES: 'dock71_custom_categories_v3',
  MATCHES: 'dock71_dynamic_matches_v3',
  GALLERY: 'dock71_dynamic_gallery_v3',
  BOOKINGS: 'dock71_crm_bookings_v1',
  CONTACTS: 'dock71_crm_contacts_v1',
  CONSENTS: 'dock71_crm_consents_v1',
  EMAILS: 'dock71_crm_sent_emails_v1'
};

const DEFAULT_CATEGORIES: CustomCategory[] = [
  { id: 'cat-birre', name: '14 Spine & Birre Artigianali', slug: 'birre', orderIndex: 1, icon: 'sports_bar' },
  { id: 'cat-pizze', name: 'Pizze Lievitate 48h', slug: 'pizze', orderIndex: 2, icon: 'local_pizza' },
  { id: 'cat-burger', name: 'Burger & Griglia', slug: 'burger', orderIndex: 3, icon: 'lunch_dining' },
  { id: 'cat-sfizi', name: 'Sfizi Portuali & Fritti', slug: 'sfizi', orderIndex: 4, icon: 'tapas' },
  { id: 'cat-lunch', name: 'Lunch', slug: 'lunch', orderIndex: 5, icon: 'restaurant', description: 'Menù Lunch dal Lunedì al Venerdì (12:00 - 14:30) con acqua, pane artigianale, caffè e coperto inclusi.' },
  { id: 'cat-dolci', name: 'Dolci Artigianali', slug: 'dolci', orderIndex: 6, icon: 'cake' }
];

const DEFAULT_SEASONAL_MENUS: SeasonalMenuConfig[] = [
  {
    id: 'menu-lunch',
    name: 'Lunch',
    season: 'speciale',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    isActive: true,
    bannerNotice: '★ MENÙ LUNCH ATTIVO LUN-VEN (12:00 - 14:30): Acqua Microfiltrata, Pane Artigianale, Caffè Espresso e Coperto Sempre Inclusi ★',
    specialBadge: 'FORMULA LUNCH',
    dishes: [
      {
        id: 'ln-01',
        name: 'Formula Lunch Pizza & Spina',
        category: 'lunch',
        price: '€ 12.00',
        description: 'Qualsiasi pizza classica o speciale del giorno a scelta + bevanda (o birra piccola alla spina) + acqua microfiltrata + caffè espresso + coperto incluso.',
        specs: 'LUN-VEN 12:00-14:30',
        tags: ['Tutto Incluso', 'Servizio Rapido'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'menu-lunch'
      },
      {
        id: 'ln-02',
        name: 'Formula Lunch Burger & Griglia',
        category: 'lunch',
        price: '€ 14.00',
        description: 'Burger artigianale con patate rustiche o tagliata di pollo/manzo alla brace con contorno del giorno + bibita/birra piccola + acqua + caffè + coperto.',
        specs: 'LUN-VEN 12:00-14:30',
        tags: ['Piatto Unico', 'Completo'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'menu-lunch'
      },
      {
        id: 'ln-03',
        name: 'Formula Lunch Primo & Secondo del Molo',
        category: 'lunch',
        price: '€ 13.00',
        description: 'Primo piatto espresso della cucina + secondo del giorno con contorno fresco di stagione + pane artigianale, acqua microfiltrata e caffè.',
        specs: 'LUN-VEN 12:00-14:30',
        tags: ['Cucina Espressa', 'Equilibrato'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'menu-lunch'
      },
      {
        id: 'ln-04',
        name: 'Insalatona Portuale Fit & Leggera',
        category: 'lunch',
        price: '€ 11.00',
        description: 'Maxi insalata con straccetti di pollo grigliato o tonno, scaglie di Grana, crostini al rosmarino, pomodorini confit + acqua + caffè + focaccia.',
        specs: 'LUN-VEN 12:00-14:30',
        tags: ['Light', 'Sano'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'menu-lunch'
      }
    ]
  },
  {
    id: 'season-winter',
    name: 'Menù Invernale: Malto Caldo & Tagliate di Cervo',
    season: 'inverno',
    startDate: '2026-11-01',
    endDate: '2027-03-31',
    isActive: true,
    bannerNotice: '★ MENÙ INVERNALE ATTIVO: Birre Winter Warmers & Pizze Stagionali con Funghi Porcini ★',
    specialBadge: 'EDIZIONE INVERNALE',
    dishes: [
      {
        id: 'sd-01',
        name: 'Tagliata di Cervo al Ginepro & Polenta Taragna',
        category: 'griglia',
        price: '€ 19.50',
        description: 'Trancio di cervo marinato alla porter e bacche di ginepro, cotto alla griglia su pietra lavica con polenta taragna fumante.',
        specs: 'EDIZIONE INVERNALE',
        tags: ['Piatto Caldo', 'Selvaggina'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'season-winter'
      },
      {
        id: 'sd-02',
        name: 'Pizza del Bosco: Porcini, Taleggio DOP & Tartufo',
        category: 'pizze',
        price: '€ 14.50',
        description: 'Fior di latte, funghi porcini trifolati al burro chiarificato, taleggio di malga fuso e carpaccio di tartufo nero.',
        specs: 'LIEVITAZIONE 48H',
        tags: ['Autunno/Inverno', 'Gourmet'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'season-winter'
      },
      {
        id: 'sd-03',
        name: 'Winter Warmer Spiced Amber Ale',
        category: 'birre',
        price: '€ 7.50',
        description: 'Spina speciale 07. Malto caramellato, cannella, noce moscata e scorze d\'arancia amara. Gradazione corposa 7.8% alc.',
        specs: 'SPINA SPECIALE • 7.8%',
        tags: ['Winter Warmer', 'Artigianale'],
        isActive: true,
        isSeasonal: true,
        seasonalMenuId: 'season-winter'
      }
    ]
  }
];

const DEFAULT_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-1',
    bookingCode: 'DOCK-8492',
    date: '2026-11-14',
    timeSlot: '20:30',
    name: 'Matteo Colombo',
    email: 'matteo.colombo@example.com',
    phone: '+39 340 1234567',
    guests: 6,
    area: 'Sala Gru',
    notes: 'Tavolo vicino al maxischermo per la partita Sky Sport',
    status: 'Confermato',
    createdAt: '2026-11-12 11:20:15',
    source: 'Pagina Prenota',
    gdprAccepted: true,
    lastEmailSentAt: '2026-11-12 11:25:00'
  },
  {
    id: 'bk-2',
    bookingCode: 'DOCK-8493',
    date: '2026-11-15',
    timeSlot: '13:00',
    name: 'Chiara Riva',
    email: 'chiara.riva@example.com',
    phone: '+39 333 9876543',
    guests: 4,
    area: 'Sala Gru',
    notes: 'Seggiolone per bimbo, formula Lunch',
    status: 'In Attesa',
    createdAt: '2026-11-12 12:45:00',
    source: 'Modale Rapido',
    gdprAccepted: true
  },
  {
    id: 'bk-3',
    bookingCode: 'DOCK-8494',
    date: '2026-11-16',
    timeSlot: '21:00',
    name: 'Andrea Galli',
    email: 'andrea.galli@example.com',
    phone: '+39 349 5558899',
    guests: 10,
    area: 'Grande Bancone Spine',
    notes: 'Tavolata compleanno con degustazione birre artigianali',
    status: 'Confermato',
    createdAt: '2026-11-12 13:10:04',
    source: 'Pagina Prenota',
    gdprAccepted: true,
    lastEmailSentAt: '2026-11-12 13:15:20'
  },
  {
    id: 'bk-4',
    bookingCode: 'DOCK-8495',
    date: '2026-11-17',
    timeSlot: '20:30',
    name: 'Davide Cattaneo',
    email: 'davide.cattaneo@azienda.it',
    phone: '+39 338 4455667',
    guests: 8,
    area: 'Zona Maxischermo Sport',
    notes: 'Visione Champions League + Giro Pizza',
    status: 'In Attesa',
    createdAt: '2026-11-12 14:05:10',
    source: 'Widget Contatti',
    gdprAccepted: true
  },
  {
    id: 'bk-5',
    bookingCode: 'DOCK-8496',
    date: '2026-11-18',
    timeSlot: '21:30',
    name: 'Francesca Mauri',
    email: 'f.mauri@studio.com',
    phone: '+39 347 8899001',
    guests: 25,
    area: 'Dehors Estivo',
    notes: 'Richiesta festa di laurea all\'aperto',
    status: 'Rifiutato',
    rejectionReason: 'Il Dehors Estivo non è disponibile nella fascia serale invernale; vi proponiamo con piacere la Sala Gru interna riscaldata.',
    createdAt: '2026-11-11 19:30:00',
    source: 'Eventi Privati',
    gdprAccepted: true,
    lastEmailSentAt: '2026-11-11 19:42:11'
  }
];

const DEFAULT_CONTACTS: ContactRecord[] = [
  {
    id: 'ct-1',
    name: 'Stefano Brambilla',
    email: 'stefano.b@azienda.it',
    phone: '031 998877',
    subject: 'Pranzo aziendale di Natale (35 persone)',
    message: 'Buongiorno, vorremmo riservare la Sala Gru per il nostro pranzo natalizio aziendale. Avete disponibilità per venerdì 18 dicembre con menù fisso?',
    createdAt: '2026-11-12 10:15:22',
    ip: '93.42.158.12',
    status: 'Nuovo',
    source: 'Pagina Contatti',
    gdprAccepted: true
  },
  {
    id: 'ct-2',
    name: 'Elena Molteni',
    email: 'elena.molteni@libero.it',
    phone: '347 1122334',
    subject: 'Informazione birre senza glutine e impasti',
    message: 'Salve, volevo sapere quante tipologie di birre o sidro senza glutine avete attualmente alla spina o in bottiglia. Grazie!',
    createdAt: '2026-11-12 11:40:09',
    ip: '79.24.110.85',
    status: 'Risposto',
    source: 'Pagina Contatti',
    gdprAccepted: true,
    replyMessage: 'Ciao Elena! Abbiamo sempre disponibili 3 birre artigianali certificate Gluten-Free in bottiglia (IPA, Blanca e Pils) oltre al nostro sidro artigianale alla spina. Ti aspettiamo al molo!',
    repliedAt: '2026-11-12 12:02:15'
  },
  {
    id: 'ct-3',
    name: 'Marco Valli',
    email: 'marco.valli@gmail.com',
    phone: '335 6677889',
    subject: 'Convenzione Aziendale Formula Lunch',
    message: 'Siamo un ufficio tecnico di Cantù con 12 collaboratori, vorremmo attivare una convenzione per il vostro Menù Lunch dal lunedì al venerdì.',
    createdAt: '2026-11-12 14:22:40',
    ip: '151.48.201.7',
    status: 'Nuovo',
    source: 'Widget Rapido',
    gdprAccepted: true
  }
];

const DEFAULT_CONSENTS: ConsentRecord[] = [
  {
    id: 'CONSENT-6733261a9bc',
    ip: '93.42.158.12',
    timestamp: '2026-11-12 10:14:50',
    purposes: ['Tecnici', 'Preferenze', 'Analitici'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36',
    source: 'Cookie Banner',
    analyticsAccepted: true,
    marketingAccepted: false
  },
  {
    id: 'CONSENT-6733284f18d',
    ip: '79.24.110.85',
    timestamp: '2026-11-12 11:39:44',
    purposes: ['Tecnici', 'Preferenze'],
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15',
    source: 'Cookie Banner',
    analyticsAccepted: false,
    marketingAccepted: false
  },
  {
    id: 'CONSENT-6733301ab4e',
    ip: '151.48.201.7',
    timestamp: '2026-11-12 13:05:12',
    purposes: ['Tecnici', 'Preferenze', 'Analitici', 'Marketing'],
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
    source: 'Cookie Banner',
    analyticsAccepted: true,
    marketingAccepted: true
  },
  {
    id: 'CONSENT-6733359cd12',
    ip: '93.42.190.44',
    timestamp: '2026-11-12 13:10:04',
    purposes: ['Tecnici', 'GDPR Form Prenotazione'],
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/130.0.0.0 Mobile Safari/537.36',
    source: 'Form Prenotazione',
    analyticsAccepted: true,
    marketingAccepted: true
  },
  {
    id: 'CONSENT-6733412ef08',
    ip: '82.54.119.203',
    timestamp: '2026-11-12 14:22:40',
    purposes: ['Tecnici', 'GDPR Form Contatti', 'Analitici'],
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
    source: 'Form Contatti',
    analyticsAccepted: true,
    marketingAccepted: false
  }
];

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

function formatNowTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inizializzazione Menù
  const [menuItems, setMenuItems] = useState<DynamicMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MENU);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Error loading stored menu:', e);
    }
    const combined: DynamicMenuItem[] = [
      ...BEER_TAPS.map((b: MenuItem): DynamicMenuItem => ({ ...b, isActive: true })),
      ...FOOD_MENU.map((f: MenuItem): DynamicMenuItem => ({ ...f, isActive: true }))
    ];
    return combined;
  });

  // Inizializzazione Menù Stagionali
  const [seasonalMenus, setSeasonalMenus] = useState<SeasonalMenuConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEASONAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SEASONAL_MENUS;
  });

  // Inizializzazione Categorie
  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CATEGORIES;
  });

  // Inizializzazione Match Sportivi (Palinsesto)
  const [matches, setMatches] = useState<DynamicMatchEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (saved) return JSON.parse(saved);
    } catch {}
    return MATCHES_SCHEDULE.map((m: MatchEvent): DynamicMatchEvent => ({
      ...m,
      isActive: true,
      beerRecommendation: 'Bitter Ambrata Artigianale',
      availableTables: 4
    }));
  });

  // Inizializzazione Galleria
  const [galleryItems, setGalleryItems] = useState<DynamicGalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (saved) return JSON.parse(saved);
    } catch {}
    const combined: DynamicGalleryItem[] = [
      ...GALLERY_ITEMS.map((g: GalleryImage): DynamicGalleryItem => ({
        id: g.id,
        url: g.url,
        title: g.title,
        category: g.category,
        badge: g.badge,
        caption: g.caption,
        format: 'webp' as const,
        isFeatured: true
      })),
      ...GALLERY_PAGE_ITEMS.map((g: GalleryItemData): DynamicGalleryItem => ({
        id: g.id,
        url: g.image,
        title: g.title,
        category: (g.category === 'community' ? 'community' : g.category === 'pizza' ? 'pizza' : g.category === 'burger' ? 'burger' : g.category === 'birre' ? 'birre' : 'locale') as any,
        badge: g.badge1,
        caption: g.description,
        format: 'avif' as const,
        isFeatured: false
      }))
    ];
    return combined;
  });

  // Inizializzazione CRM Prenotazioni
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_BOOKINGS;
  });

  // Inizializzazione CRM Contatti
  const [contacts, setContacts] = useState<ContactRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONTACTS;
  });

  // Inizializzazione CRM Consensi GDPR
  const [consents, setConsents] = useState<ConsentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONSENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CONSENTS;
  });

  // Inizializzazione Storico Email Inviate
  const [sentEmails, setSentEmails] = useState<SentEmailLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EMAILS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Salvataggio automatico persistente in localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEASONAL, JSON.stringify(seasonalMenus));
  }, [seasonalMenus]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents));
  }, [consents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(sentEmails));
  }, [sentEmails]);

  // Helper per chiamare il backend PHP / MySQL / SMTP su vHosting (o relay Express /api/crm in AI Studio)
  const callBackendCrmApi = async (payload: Record<string, unknown>) => {
    const endpoints = [
      '/backend/process-form.php',
      '/produzione_cpanel/backend/process-form.php',
      '/api/crm',
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ ...payload, ajax: '1' }),
        });
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          const data = await res.json().catch(() => null);
          if (data) return data;
        }
      } catch {
        // Prova endpoint successivo o continua in modalità locale
      }
    }
    return null;
  };

  // Sincronizzazione automatica dal database MySQL all'avvio (per mostrare nel Gestionale le prenotazioni salvate nel DB)
  useEffect(() => {
    const syncFromMySql = async () => {
      const endpoints = [
        '/backend/process-form.php?action=list_crm_data&ajax=1',
        '/produzione_cpanel/backend/process-form.php?action=list_crm_data&ajax=1',
      ];
      for (const url of endpoints) {
        try {
          const res = await fetch(url, { headers: { Accept: 'application/json' } });
          if (!res.ok) continue;
          const data = await res.json().catch(() => null);
          if (data && data.success) {
            if (Array.isArray(data.bookings) && data.bookings.length > 0) {
              const dbBookings: BookingRecord[] = data.bookings.map((row: Record<string, unknown>) => {
                const rawSt = String(row.status || 'In Attesa');
                const normStatus: BookingStatus =
                  rawSt === 'confirmed' || rawSt === 'Confermato'
                    ? 'Confermato'
                    : rawSt === 'cancelled' || rawSt === 'Rifiutato'
                    ? 'Rifiutato'
                    : 'In Attesa';
                return {
                  id: `db-bk-${row.id}`,
                  bookingCode: String(row.booking_code || `DK71-${row.id}`),
                  date: String(row.booking_date || ''),
                  timeSlot: String(row.time_slot || '20:30'),
                  name: String(row.name || 'Cliente'),
                  email: String(row.email || ''),
                  phone: String(row.phone || ''),
                  guests: Number(row.guests) || 2,
                  area: String(row.room_area || 'Tavolo Standard'),
                  notes: String(row.notes || ''),
                  status: normStatus,
                  createdAt: String(row.created_at || formatNowTimestamp()),
                  source: 'Pagina Prenota',
                  gdprAccepted: true,
                };
              });
              setBookings((prev) => {
                const dbCodes = new Set(dbBookings.map((b) => b.bookingCode));
                const localOnly = prev.filter((b) => !dbCodes.has(b.bookingCode) && !b.id.startsWith('db-bk-'));
                return [...dbBookings, ...localOnly];
              });
            }

            if (Array.isArray(data.contacts) && data.contacts.length > 0) {
              const dbContacts: ContactRecord[] = data.contacts.map((row: Record<string, unknown>) => {
                const rawSt = String(row.status || 'Nuovo');
                const normStatus: ContactStatus =
                  rawSt === 'replied' || rawSt === 'Risposto'
                    ? 'Risposto'
                    : rawSt === 'read' || rawSt === 'Letto'
                    ? 'Letto'
                    : 'Nuovo';
                return {
                  id: `db-ct-${row.id}`,
                  name: String(row.name || 'Cliente'),
                  email: String(row.email || ''),
                  phone: String(row.phone || ''),
                  subject: String(row.subject || 'Richiesta Contatto'),
                  message: String(row.message || ''),
                  createdAt: String(row.created_at || formatNowTimestamp()),
                  ip: String(row.ip_address || '127.0.0.1'),
                  status: normStatus,
                  source: 'Pagina Contatti',
                  gdprAccepted: true,
                };
              });
              setContacts((prev) => {
                const dbIds = new Set(dbContacts.map((c) => c.id));
                const localOnly = prev.filter((c) => !dbIds.has(c.id) && !c.id.startsWith('db-ct-'));
                return [...dbContacts, ...localOnly];
              });
            }
            break;
          }
        } catch {
          // Ambiente di anteprima senza PHP
        }
      }
    };
    syncFromMySql();
  }, []);

  // Gestione Menù
  const addMenuItem = (item: Omit<DynamicMenuItem, 'id'>) => {
    const newItem: DynamicMenuItem = {
      ...item,
      id: `custom-item-${Date.now()}`
    };
    setMenuItems(prev => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, updatedFields: Partial<DynamicMenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleMenuItemStatus = (id: string) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
  };

  const reorderMenuItems = (newOrder: DynamicMenuItem[]) => {
    setMenuItems(newOrder);
  };

  // Gestione Menù Stagionali
  const addSeasonalMenu = (menu: Omit<SeasonalMenuConfig, 'id'>) => {
    const newMenu: SeasonalMenuConfig = {
      ...menu,
      id: `season-${Date.now()}`,
      dishes: menu.dishes || []
    };
    setSeasonalMenus(prev => [...prev, newMenu]);
  };

  const updateSeasonalMenu = (id: string, updatedFields: Partial<SeasonalMenuConfig>) => {
    setSeasonalMenus(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteSeasonalMenu = (id: string) => {
    setSeasonalMenus(prev => prev.filter(s => s.id !== id));
  };

  const addSeasonalDish = (seasonalMenuId: string, dish: Omit<DynamicMenuItem, 'id'>) => {
    const newDish: DynamicMenuItem = {
      ...dish,
      id: `season-dish-${Date.now()}`,
      seasonalMenuId,
      isSeasonal: true,
      isActive: true
    };
    setSeasonalMenus(prev => prev.map(sm => {
      if (sm.id === seasonalMenuId) {
        return {
          ...sm,
          dishes: [...(sm.dishes || []), newDish]
        };
      }
      return sm;
    }));
    setMenuItems(prev => [newDish, ...prev]);
  };

  const removeSeasonalDish = (seasonalMenuId: string, dishId: string) => {
    setSeasonalMenus(prev => prev.map(sm => {
      if (sm.id === seasonalMenuId) {
        return {
          ...sm,
          dishes: (sm.dishes || []).filter(d => d.id !== dishId)
        };
      }
      return sm;
    }));
    setMenuItems(prev => prev.filter(m => m.id !== dishId));
  };

  const reorderSeasonalDishes = (seasonalMenuId: string, newDishes: DynamicMenuItem[]) => {
    setSeasonalMenus(prev => prev.map(sm => {
      if (sm.id === seasonalMenuId) {
        return {
          ...sm,
          dishes: newDishes
        };
      }
      return sm;
    }));
  };

  // Gestione Categorie
  const addCategory = (cat: Omit<CustomCategory, 'id'>) => {
    const newCat: CustomCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      orderIndex: cat.orderIndex || categories.length + 1
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updatedFields: Partial<CustomCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const reorderCategories = (newOrder: CustomCategory[]) => {
    setCategories(newOrder);
  };

  // Gestione Palinsesto Eventi
  const addMatch = (match: Omit<DynamicMatchEvent, 'id'>) => {
    const newMatch: DynamicMatchEvent = {
      ...match,
      id: `match-${Date.now()}`
    };
    setMatches(prev => [newMatch, ...prev]);
  };

  const updateMatch = (id: string, updatedFields: Partial<DynamicMatchEvent>) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updatedFields } : m));
  };

  const deleteMatch = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const toggleMatchStatus = (id: string) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  // Gestione Galleria
  const addGalleryItem = (item: Omit<DynamicGalleryItem, 'id'>) => {
    const newItem: DynamicGalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    setGalleryItems(prev => [newItem, ...prev]);
  };

  const updateGalleryItem = (id: string, updatedFields: Partial<DynamicGalleryItem>) => {
    setGalleryItems(prev => prev.map(g => g.id === id ? { ...g, ...updatedFields } : g));
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
  };

  // ==========================================================================
  // CRM: PRENOTAZIONI, CONTATTI, CONSENSI GDPR E INVIO EMAIL AUTOMATICHE
  // ==========================================================================
  const addBooking = (
    booking: Omit<BookingRecord, 'id' | 'createdAt' | 'status'> & { status?: BookingStatus }
  ): BookingRecord => {
    const nowStr = formatNowTimestamp();
    const newBooking: BookingRecord = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: booking.status || 'In Attesa',
      createdAt: nowStr
    };
    setBookings(prev => [newBooking, ...prev]);

    // Invia al backend PHP per salvataggio su MySQL + invio email di riepilogo al cliente e notifica a info@dock71birreria.it via SMTP
    void callBackendCrmApi({
      action: 'booking',
      booking_code: newBooking.bookingCode,
      name: newBooking.name,
      email: newBooking.email,
      phone: newBooking.phone,
      booking_date: newBooking.date,
      time_slot: newBooking.timeSlot,
      guests: newBooking.guests,
      area: newBooking.area,
      notes: newBooking.notes
    });

    // Registra anche il consenso GDPR associato al form di prenotazione
    if (booking.gdprAccepted) {
      addConsentLog({
        purposes: ['Tecnici', 'GDPR Form Prenotazione'],
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
        source: 'Form Prenotazione',
        analyticsAccepted: true,
        marketingAccepted: false
      });
    }
    return newBooking;
  };

  const updateBookingStatus = (
    id: string,
    status: BookingStatus,
    rejectionReason?: string
  ): SentEmailLog | null => {
    const target = bookings.find(b => b.id === id);
    if (!target) return null;

    const nowStr = formatNowTimestamp();
    let generatedEmail: SentEmailLog | null = null;

    if (status === 'Confermato') {
      const html = buildDock71EmailTemplate({
        badgeText: '★ PRENOTAZIONE CONFERMATA ★',
        badgeColor: 'green',
        headline: 'Il Tuo Tavolo al Molo è Confermato!',
        greetingName: target.name,
        introText:
          'Siamo felici di comunicarti che la tua richiesta di prenotazione presso Dock 71 Cantù è stata ACCETTATA e CONFERMATA dal nostro staff di sala. Ti aspettiamo per una grande serata tra birre artigianali e cucina verace!',
        highlightBoxTitle: 'STATO PRENOTAZIONE: CONFERMATO',
        highlightBoxText: `Codice Tavolo: ${target.bookingCode}\nPresenta questo codice all'ingresso in Via Milano 71, Cantù.`,
        highlightBoxTone: 'success',
        detailsRows: [
          { label: 'Codice Prenotazione', value: target.bookingCode },
          { label: 'Data e Ora', value: `${target.date} • ore ${target.timeSlot}` },
          { label: 'Numero Ospiti', value: `${target.guests} persone` },
          { label: 'Ambiente Riservato', value: target.area },
          { label: 'Note Registrata', value: target.notes || 'Nessuna nota particolare' }
        ],
        ctaText: 'APRI INDICAZIONI STRADALI',
        ctaUrl: 'https://maps.google.com/?q=Via+Milano+71+Cantu'
      });

      generatedEmail = {
        id: `mail-${Date.now()}`,
        toEmail: target.email || target.phone,
        toName: target.name,
        subject: `✅ Prenotazione Confermata [${target.bookingCode}] - Dock 71 Cantù`,
        type: 'booking_confirmed',
        sentAt: nowStr,
        htmlContent: html,
        relatedRecordId: target.id
      };
    } else if (status === 'Rifiutato') {
      const reasonText =
        rejectionReason?.trim() ||
        'Per la fascia oraria selezionata abbiamo esaurito i tavoli disponibili nella sala richiesta.';
      const html = buildDock71EmailTemplate({
        badgeText: 'AGGIORNAMENTO PRENOTAZIONE',
        badgeColor: 'burgundy',
        headline: 'Comunicazione sulla tua Richiesta di Prenotazione',
        greetingName: target.name,
        introText:
          'Grazie per aver scelto Dock 71 Cantù. Purtroppo non ci è possibile confermare il tavolo per la data/orario indicati. Di seguito trovi la comunicazione del nostro responsabile di sala:',
        highlightBoxTitle: 'MOTIVAZIONE COMUNICATA DAL RISTORATORE',
        highlightBoxText: reasonText,
        highlightBoxTone: 'danger',
        detailsRows: [
          { label: 'Codice Richiesta', value: target.bookingCode },
          { label: 'Data e Ora Richiesta', value: `${target.date} • ore ${target.timeSlot}` },
          { label: 'Ospiti Indicati', value: `${target.guests} persone` },
          { label: 'Area Richiesta', value: target.area }
        ],
        ctaText: 'SCRIVICI SU WHATSAPP PER UN ORARIO ALTERNATIVO',
        ctaUrl: 'https://wa.me/390314487120'
      });

      generatedEmail = {
        id: `mail-${Date.now()}`,
        toEmail: target.email || target.phone,
        toName: target.name,
        subject: `ℹ️ Aggiornamento Richiesta Prenotazione [${target.bookingCode}] - Dock 71 Cantù`,
        type: 'booking_rejected',
        sentAt: nowStr,
        htmlContent: html,
        relatedRecordId: target.id
      };
    }

    setBookings(prev =>
      prev.map(b =>
        b.id === id
          ? {
              ...b,
              status,
              rejectionReason: status === 'Rifiutato' ? rejectionReason : b.rejectionReason,
              lastEmailSentAt: generatedEmail ? nowStr : b.lastEmailSentAt,
              emailHtmlPreview: generatedEmail ? generatedEmail.htmlContent : b.emailHtmlPreview
            }
          : b
      )
    );

    if (generatedEmail) {
      setSentEmails(prev => [generatedEmail!, ...prev]);
    }

    // Invia comando al backend PHP per aggiornare lo stato su MySQL e spedire realmente l'email SMTP (Conferma o Rifiuto con motivazione)
    void callBackendCrmApi({
      action: 'update_booking_status',
      booking_id: target.id.startsWith('db-bk-') ? Number(target.id.replace('db-bk-', '')) : 0,
      booking_code: target.bookingCode,
      new_status: status,
      rejection_reason: rejectionReason || '',
      name: target.name,
      email: target.email,
      date: target.date,
      time_slot: target.timeSlot,
      guests: target.guests
    });

    return generatedEmail;
  };

  const deleteBooking = (id: string) => {
    const target = bookings.find(b => b.id === id);
    setBookings(prev => prev.filter(b => b.id !== id));
    if (target) {
      void callBackendCrmApi({
        action: 'delete_records',
        target_table: 'bookings',
        ids: target.id.startsWith('db-bk-') ? [Number(target.id.replace('db-bk-', ''))] : [],
        codes: [target.bookingCode]
      });
    }
  };

  const deleteBookingsBulk = (ids: string[]) => {
    const idSet = new Set(ids);
    const targets = bookings.filter(b => idSet.has(b.id));
    setBookings(prev => prev.filter(b => !idSet.has(b.id)));
    if (targets.length > 0) {
      void callBackendCrmApi({
        action: 'delete_records',
        target_table: 'bookings',
        ids: targets.filter(t => t.id.startsWith('db-bk-')).map(t => Number(t.id.replace('db-bk-', ''))),
        codes: targets.map(t => t.bookingCode)
      });
    }
  };

  const addContact = (
    contact: Omit<ContactRecord, 'id' | 'createdAt' | 'status' | 'ip'>
  ): ContactRecord => {
    const nowStr = formatNowTimestamp();
    const newContact: ContactRecord = {
      ...contact,
      id: `ct-${Date.now()}`,
      createdAt: nowStr,
      ip: `93.42.${Math.floor(10 + Math.random() * 200)}.${Math.floor(10 + Math.random() * 240)}`,
      status: 'Nuovo'
    };
    setContacts(prev => [newContact, ...prev]);

    // Invia al backend PHP per salvataggio su MySQL + invio email di riepilogo al cliente e notifica a info@dock71birreria.it via SMTP
    void callBackendCrmApi({
      action: 'contact',
      name: newContact.name,
      email: newContact.email,
      phone: newContact.phone,
      subject: newContact.subject,
      message: newContact.message
    });

    if (contact.gdprAccepted) {
      addConsentLog({
        purposes: ['Tecnici', 'GDPR Form Contatti'],
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
        source: 'Form Contatti',
        analyticsAccepted: true,
        marketingAccepted: false
      });
    }
    return newContact;
  };

  const replyToContact = (
    id: string,
    replySubject: string,
    replyMessage: string
  ): SentEmailLog | null => {
    const target = contacts.find(c => c.id === id);
    if (!target) return null;

    const nowStr = formatNowTimestamp();
    const html = buildDock71EmailTemplate({
      badgeText: 'RISPOSTA DAL MOLO DOCK 71',
      badgeColor: 'mustard',
      headline: replySubject || `Re: ${target.subject}`,
      greetingName: target.name,
      introText:
        'Abbiamo ricevuto il tuo messaggio e il nostro team ti ha risposto direttamente dal pannello clienti di Dock 71 Cantù:',
      highlightBoxTitle: 'MESSAGGIO DEL NOSTRO STAFF',
      highlightBoxText: replyMessage,
      highlightBoxTone: 'neutral',
      detailsRows: [
        { label: 'Tuo Messaggio Originale', value: target.message },
        { label: 'Data Richiesta', value: target.createdAt },
        { label: 'Risposto il', value: nowStr }
      ],
      ctaText: 'PRENOTA O CHIAMACI AL 031 4487120',
      ctaUrl: 'https://wa.me/390314487120'
    });

    const emailLog: SentEmailLog = {
      id: `mail-${Date.now()}`,
      toEmail: target.email || target.phone,
      toName: target.name,
      subject: replySubject || `Re: ${target.subject} - Dock 71 Cantù`,
      type: 'contact_reply',
      sentAt: nowStr,
      htmlContent: html,
      relatedRecordId: target.id
    };

    setContacts(prev =>
      prev.map(c =>
        c.id === id
          ? {
              ...c,
              status: 'Risposto',
              replyMessage,
              repliedAt: nowStr,
              emailHtmlPreview: html
            }
          : c
      )
    );

    setSentEmails(prev => [emailLog, ...prev]);

    // Invia al backend PHP per aggiornare stato a 'Risposto' su MySQL e inviare realmente l'email di risposta via SMTP
    void callBackendCrmApi({
      action: 'reply_contact',
      contact_id: target.id.startsWith('db-ct-') ? Number(target.id.replace('db-ct-', '')) : 0,
      name: target.name,
      email: target.email,
      reply_message: replyMessage,
      original_message: target.message
    });

    return emailLog;
  };

  const markContactStatus = (id: string, status: ContactStatus) => {
    setContacts(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    if (id.startsWith('db-ct-')) {
      void callBackendCrmApi({
        action: 'delete_records',
        target_table: 'contacts',
        ids: [Number(id.replace('db-ct-', ''))]
      });
    }
  };

  const deleteContactsBulk = (ids: string[]) => {
    const idSet = new Set(ids);
    setContacts(prev => prev.filter(c => !idSet.has(c.id)));
    const dbIds = ids.filter(i => i.startsWith('db-ct-')).map(i => Number(i.replace('db-ct-', '')));
    if (dbIds.length > 0) {
      void callBackendCrmApi({
        action: 'delete_records',
        target_table: 'contacts',
        ids: dbIds
      });
    }
  };

  const addConsentLog = (consent: Omit<ConsentRecord, 'id' | 'timestamp' | 'ip'>) => {
    const nowStr = formatNowTimestamp();
    const newConsent: ConsentRecord = {
      ...consent,
      id: `CONSENT-${Math.random().toString(16).substring(2, 11)}`,
      timestamp: nowStr,
      ip: `93.42.${Math.floor(10 + Math.random() * 220)}.${Math.floor(10 + Math.random() * 240)}`
    };
    setConsents(prev => [newConsent, ...prev]);
  };

  const deleteConsentLog = (id: string) => {
    setConsents(prev => prev.filter(c => c.id !== id));
  };

  const deleteConsentLogsBulk = (ids: string[]) => {
    const idSet = new Set(ids);
    setConsents(prev => prev.filter(c => !idSet.has(c.id)));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.MENU);
    localStorage.removeItem(STORAGE_KEYS.SEASONAL);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.CONSENTS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    window.location.reload();
  };

  return (
    <SiteDataContext.Provider
      value={{
        menuItems,
        seasonalMenus,
        categories,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemStatus,
        reorderMenuItems,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        addSeasonalMenu,
        updateSeasonalMenu,
        deleteSeasonalMenu,
        addSeasonalDish,
        removeSeasonalDish,
        reorderSeasonalDishes,
        matches,
        addMatch,
        updateMatch,
        deleteMatch,
        toggleMatchStatus,
        galleryItems,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        deleteBookingsBulk,
        contacts,
        addContact,
        replyToContact,
        markContactStatus,
        deleteContact,
        deleteContactsBulk,
        consents,
        addConsentLog,
        deleteConsentLog,
        deleteConsentLogsBulk,
        sentEmails,
        resetToDefaults
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
