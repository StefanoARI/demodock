import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteDataContext';

// ============================================================================
// DOCK 71 CANTÙ - CONFIGURAZIONE CONTATTI RAPIDI
// Modifica rapidamente questi segnaposto secondo le tue necessità
// ============================================================================
// [INSERISCI_NUMERO_WHATSAPP]: numero WhatsApp con prefisso internazionale senza '+' o spazi
export const WHATSAPP_NUMBER = '390314487120'; // [INSERISCI_NUMERO_WHATSAPP]

// [INSERISCI_NUMERO_TELEFONO]: numero telefonico per le chiamate dirette
export const PHONE_NUMBER = '0314487120'; // [INSERISCI_NUMERO_TELEFONO]

// Messaggio precompilato per WhatsApp
export const WHATSAPP_DEFAULT_MESSAGE = 'Ciao Dock 71 Cantù! Vorrei maggiori informazioni sul vostro locale o prenotare un tavolo.';

// Interfaccia per il tracciamento sicuro su analytics e pixel
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    ttq?: {
      track: (event: string, params?: Record<string, any>) => void;
    };
  }
}

/**
 * Funzione centralizzata di tracciamento al clic sui canali di contatto.
 * Esegue controlli sicuri per evitare errori in console qualora un ad-blocker blocchi gli script.
 */
export function trackContactClick(channelName: 'whatsapp' | 'phone_call' | 'contact_form' | 'booking' | 'widget_open') {
  try {
    // 1. Google Analytics 4 (gtag)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'contact_widget_click', {
        method: channelName
      });
    }

    // 2. Meta Pixel (fbq)
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: channelName
      });
    }

    // 3. TikTok Pixel (ttq)
    if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track('Contact', {
        description: channelName
      });
    }
  } catch (err) {
    // Silently continue if ad-blocker interferes
    console.debug('Analytics tracking skipped or blocked:', err);
  }
}

interface ContactModalState {
  isOpen: boolean;
  activeTab: 'contact' | 'booking';
}

export const FloatingContactWidget: React.FC<{
  onBookingConfirmed?: (msg: string) => void;
}> = ({ onBookingConfirmed }) => {
  const { addContact, addBooking } = useSiteData();
  const [isOpen, setIsOpen] = useState(false);
  const [modalState, setModalState] = useState<ContactModalState>({
    isOpen: false,
    activeTab: 'contact'
  });

  // Form states per la modale unificata
  const [contactName, setContactName] = useState('');
  const [contactPhoneEmail, setContactPhoneEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactPrivacy, setContactPrivacy] = useState(false);

  // Form states per la prenotazione
  const [bookingName, setBookingName] = useState('');
  const [bookingContact, setBookingContact] = useState('');
  const [bookingDate, setBookingDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [bookingTimeSlot, setBookingTimeSlot] = useState('20:30');
  const [bookingGuests, setBookingGuests] = useState('4');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingPrivacy, setBookingPrivacy] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Chiusura al clic esterno al widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
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

  // Gestione apertura menu widget
  const toggleWidget = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      trackContactClick('widget_open');
    }
  };

  // Azione 1: WhatsApp
  const handleWhatsAppClick = () => {
    trackContactClick('whatsapp');
    setIsOpen(false);
    // [INSERISCI_NUMERO_WHATSAPP] e [INSERISCI_MESSAGGIO_PRECOMPILATO_URL_ENCODED]
    const encodedMessage = encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Azione 2: Chiamata telefonica
  const handlePhoneClick = () => {
    trackContactClick('phone_call');
    setIsOpen(false);
    // [INSERISCI_NUMERO_TELEFONO]
    window.location.href = `tel:+${PHONE_NUMBER}`;
  };

  // Azione 3: Modulo di contatto
  const handleOpenContactModal = () => {
    trackContactClick('contact_form');
    setIsOpen(false);
    setFeedbackSuccess(null);
    setModalState({ isOpen: true, activeTab: 'contact' });
  };

  // Azione 4: Prenotazione
  const handleOpenBookingModal = () => {
    trackContactClick('booking');
    setIsOpen(false);
    setFeedbackSuccess(null);
    setModalState({ isOpen: true, activeTab: 'booking' });
  };

  // Invio Form Contatto
  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhoneEmail.trim() || !contactPrivacy) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addContact({
        name: contactName,
        email: contactPhoneEmail.includes('@') ? contactPhoneEmail : 'cliente@dock71.it',
        phone: contactPhoneEmail,
        subject: 'Messaggio dal Widget Rapido',
        message: contactMessage,
        source: 'Widget Rapido',
        gdprAccepted: contactPrivacy
      });
      setIsSubmitting(false);
      setFeedbackSuccess('Grazie per averci scritto! Ti ricontatteremo al più presto.');
      if (onBookingConfirmed) {
        onBookingConfirmed('Richiesta inviata con successo! Riceverai una risposta a breve.');
      }
      setTimeout(() => {
        setModalState({ isOpen: false, activeTab: 'contact' });
        setContactName('');
        setContactPhoneEmail('');
        setContactMessage('');
        setContactPrivacy(false);
        setFeedbackSuccess(null);
      }, 2000);
    }, 600);
  };

  // Invio Form Prenotazione
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingContact.trim() || !bookingPrivacy) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const bookingCode = `DOCK-${Math.floor(1000 + Math.random() * 9000)}`;
      addBooking({
        bookingCode,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        name: bookingName,
        email: bookingContact.includes('@') ? bookingContact : 'cliente@dock71.it',
        phone: bookingContact,
        guests: parseInt(bookingGuests, 10) || 4,
        area: 'Sala Gru',
        notes: bookingNotes,
        source: 'Widget Contatti',
        gdprAccepted: bookingPrivacy
      });
      setFeedbackSuccess(`Prenotazione registrata! Codice: ${bookingCode}. Ti contatteremo per la conferma.`);
      if (onBookingConfirmed) {
        onBookingConfirmed(`Tavolo riservato! Codice: ${bookingCode}`);
      }
      setTimeout(() => {
        setModalState({ isOpen: false, activeTab: 'booking' });
        setBookingName('');
        setBookingContact('');
        setBookingNotes('');
        setBookingPrivacy(false);
        setFeedbackSuccess(null);
      }, 2500);
    }, 600);
  };

  return (
    <>
      {/* ==================================================================== */}
      {/* FLOATING WIDGET BUTTON (BOTTOM-RIGHT) */}
      {/* ==================================================================== */}
      <aside
        aria-label="Contatti rapidi Dock 71"
        ref={widgetRef}
        className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end select-none"
      >
        {/* SPEED-DIAL CARD MENU (POPUP VERTICALE SOPRA IL TRIGGER) */}
        {isOpen && (
          <div
            className="mb-3.5 w-72 sm:w-80 rounded-2xl bg-[#FFF9EB] border-2 border-dock-burgundy shadow-2xl p-3 space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-200"
            role="menu"
            aria-label="Opzioni di contatto rapido"
          >
            {/* Header del widget */}
            <div className="px-2 py-1.5 border-b border-[#E8E2D4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-chunky text-xs uppercase text-[#7B2039] tracking-wider">
                  MOLO DOCK 71 CANTÙ
                </span>
              </div>
              <span className="font-marker text-[9px] text-[#336859] uppercase font-bold">
                RISPOSTA RAPIDA
              </span>
            </div>

            {/* 1. WHATSAPP */}
            <button
              onClick={handleWhatsAppClick}
              role="menuitem"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[#F3EDDF] border border-[#E8E2D4] hover:border-emerald-500 transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <span className="material-symbols-outlined notranslate text-[20px]">chat</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-epilogue font-bold text-xs text-[#1D1C13] uppercase tracking-wide group-hover:text-emerald-700">
                    WhatsApp Diretto
                  </span>
                  <span className="font-mono-tech text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                    ONLINE
                  </span>
                </div>
                <span className="font-work text-[11px] text-[#554245] truncate">
                  Chatta subito con il molo (031 448 7120)
                </span>
              </div>
            </button>

            {/* 2. CHIAMATA TELEFONICA */}
            <button
              onClick={handlePhoneClick}
              role="menuitem"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[#F3EDDF] border border-[#E8E2D4] hover:border-dock-burgundy transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-dock-burgundy text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <span className="material-symbols-outlined notranslate text-[20px]">call</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-epilogue font-bold text-xs text-[#1D1C13] uppercase tracking-wide group-hover:text-dock-burgundy">
                    Chiama al Pub
                  </span>
                  <span className="font-mono-tech text-[10px] font-bold text-[#1D1C13]">
                    031 448 7120
                  </span>
                </div>
                <span className="font-work text-[11px] text-[#554245] truncate">
                  Orario serale &amp; pranzo
                </span>
              </div>
            </button>

            {/* 3. MODULO DI CONTATTO */}
            <button
              onClick={handleOpenContactModal}
              role="menuitem"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-[#F3EDDF] border border-[#E8E2D4] hover:border-dock-burgundy transition-all text-left group shadow-xs cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#336859] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <span className="material-symbols-outlined notranslate text-[20px]">mail</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-epilogue font-bold text-xs text-[#1D1C13] uppercase tracking-wide group-hover:text-[#336859]">
                  Modulo di Contatto
                </span>
                <span className="font-work text-[11px] text-[#554245] truncate">
                  Scrivici un messaggio via email
                </span>
              </div>
            </button>

            {/* 4. PRENOTAZIONE TAVOLO */}
            <button
              onClick={handleOpenBookingModal}
              role="menuitem"
              className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark border border-dock-burgundy-light transition-all text-left group shadow-md cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-dock-mustard text-dock-carbon flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <span className="material-symbols-outlined notranslate text-[20px]">table_restaurant</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-chunky text-xs uppercase tracking-wide text-white group-hover:text-dock-mustard">
                  Prenota un Tavolo
                </span>
                <span className="font-work text-[11px] text-[#F3EDDF]/90 truncate">
                  Blocca il tuo posto per cena o partita
                </span>
              </div>
            </button>
          </div>
        )}

        {/* PULSANTE PRINCIPALE (TRIGGER FISSO) */}
        <button
          onClick={toggleWidget}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Chiudi menu di contatto' : 'Apri menu di contatto rapido'}
          className={`h-14 w-14 sm:h-15 sm:w-15 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 cursor-pointer border-2 ${
            isOpen
              ? 'bg-[#1D1C13] border-white rotate-90 text-dock-mustard shadow-dock-burgundy/40'
              : 'bg-dock-burgundy border-dock-mustard hover:scale-105 hover:bg-dock-burgundy-dark ring-4 ring-dock-burgundy/20'
          }`}
        >
          {isOpen ? (
            <span className="material-symbols-outlined notranslate text-2xl font-bold">close</span>
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined notranslate text-[28px]">support_agent</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-dock-mustard rounded-full border-2 border-dock-burgundy animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-dock-mustard rounded-full border-2 border-dock-burgundy"></span>
            </div>
          )}
        </button>
      </aside>

      {/* ==================================================================== */}
      {/* POPUP MODALE DINAMICA CON TAB SWITCH ("Contattaci" / "Prenota") */}
      {/* ==================================================================== */}
      {modalState.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setModalState({ ...modalState, isOpen: false })}
        >
          <div
            className="relative w-full max-w-lg my-8 bg-[#FFF9EB] border-3 border-dock-burgundy rounded-2xl shadow-2xl overflow-hidden text-[#1D1C13]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ribbon superiore */}
            <div className="h-2 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

            {/* Header modale con switch tab */}
            <div className="p-4 sm:p-5 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalState({ ...modalState, activeTab: 'contact' });
                    setFeedbackSuccess(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer ${
                    modalState.activeTab === 'contact'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:text-dock-burgundy'
                  }`}
                >
                  Contattaci
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalState({ ...modalState, activeTab: 'booking' });
                    setFeedbackSuccess(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer ${
                    modalState.activeTab === 'booking'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:text-dock-burgundy'
                  }`}
                >
                  Prenota Tavolo
                </button>
              </div>

              <button
                type="button"
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                aria-label="Chiudi finestra"
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#1D1C13] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-lg">close</span>
              </button>
            </div>

            {/* Messaggio di successo post-invio */}
            {feedbackSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-dock-green mx-auto flex items-center justify-center text-white shadow-md">
                  <span className="material-symbols-outlined notranslate text-3xl">check_circle</span>
                </div>
                <h4 className="font-chunky text-xl uppercase text-[#1D1C13]">
                  Operazione Completata
                </h4>
                <p className="font-work text-sm text-[#554245] max-w-sm mx-auto">
                  {feedbackSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => setModalState({ ...modalState, isOpen: false })}
                  className="px-5 py-2.5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark cursor-pointer"
                >
                  Chiudi Finestra
                </button>
              </div>
            ) : modalState.activeTab === 'contact' ? (
              /* TAB 1: MODULO DI CONTATTO */
              <form onSubmit={handleSubmitContact} className="p-5 sm:p-6 space-y-4">
                <div className="text-left">
                  <span className="font-marker text-[11px] text-dock-burgundy uppercase font-bold">
                    CANALE RAPIDO DOCK 71
                  </span>
                  <h3 className="font-chunky text-xl text-[#1D1C13] uppercase tracking-tight">
                    Inviaci un Messaggio
                  </h3>
                  <p className="font-work text-xs text-[#554245] mt-1">
                    Compila i campi: riceverai riscontro dal nostro staff a Cantù in poche ore.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="es. Mario Rossi"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                      Email o Telefono *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactPhoneEmail}
                      onChange={(e) => setContactPhoneEmail(e.target.value)}
                      placeholder="es. mario@email.it oppure 333 1234567"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                      Messaggio *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Scrivi qui la tua richiesta (info birre, menu gruppi, orari)..."
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                    ></textarea>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="privacy-widget-check"
                      required
                      checked={contactPrivacy}
                      onChange={(e) => setContactPrivacy(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
                    />
                    <label htmlFor="privacy-widget-check" className="font-work text-[11px] text-[#554245] leading-tight cursor-pointer">
                      Ho letto e accetto l'informativa Privacy secondo le normative GDPR vigenti.
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8E2D4]">
                  <button
                    type="button"
                    onClick={() => setModalState({ ...modalState, isOpen: false })}
                    className="px-4 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-epilogue font-bold uppercase text-[#554245] hover:bg-[#F3EDDF] cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Invio in corso...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined notranslate text-[16px]">send</span>
                        <span>Invia Messaggio</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: MODULO PRENOTAZIONE */
              <form onSubmit={handleSubmitBooking} className="p-5 sm:p-6 space-y-4">
                <div className="text-left">
                  <span className="font-marker text-[11px] text-dock-burgundy uppercase font-bold">
                    PRENOTAZIONE RAPIDA
                  </span>
                  <h3 className="font-chunky text-xl text-[#1D1C13] uppercase tracking-tight">
                    Blocca il Tuo Posto
                  </h3>
                  <p className="font-work text-xs text-[#554245] mt-1">
                    Prenotazione veloce per pranzo o cena al Dock 71 (Via Milano 71, Cantù).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Nome e Cognome *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingName}
                        onChange={(e) => setBookingName(e.target.value)}
                        placeholder="es. Mario Rossi"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Telefono / Email *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingContact}
                        onChange={(e) => setBookingContact(e.target.value)}
                        placeholder="es. 333 1234567"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block font-epilogue text-[11px] font-bold uppercase text-[#1D1C13] mb-1">
                        Data *
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block font-epilogue text-[11px] font-bold uppercase text-[#1D1C13] mb-1">
                        Fascia Oraria *
                      </label>
                      <select
                        value={bookingTimeSlot}
                        onChange={(e) => setBookingTimeSlot(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy cursor-pointer"
                      >
                        <option value="12:30">Pranzo (12:30)</option>
                        <option value="13:15">Pranzo (13:15)</option>
                        <option value="19:30">Cena 1° Turno (19:30)</option>
                        <option value="20:30">Cena Match (20:30)</option>
                        <option value="21:15">Cena Pizzata (21:15)</option>
                        <option value="22:00">Dopocena &amp; Birre (22:00)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-epilogue text-[11px] font-bold uppercase text-[#1D1C13] mb-1">
                        Ospiti
                      </label>
                      <select
                        value={bookingGuests}
                        onChange={(e) => setBookingGuests(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy cursor-pointer"
                      >
                        <option value="2">2 persone</option>
                        <option value="4">4 persone</option>
                        <option value="6">6 persone</option>
                        <option value="8">8 persone</option>
                        <option value="10+">Tavolata 10+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                      Note Particolari (Partita Sky, Compleanno, Allergie)
                    </label>
                    <input
                      type="text"
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="es. Vorremmo vedere la Champions League, tavolo vicino allo schermo"
                      className="w-full px-3 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                    />
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="privacy-booking-widget-check"
                      required
                      checked={bookingPrivacy}
                      onChange={(e) => setBookingPrivacy(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-gray-300 text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
                    />
                    <label htmlFor="privacy-booking-widget-check" className="font-work text-[11px] text-[#554245] leading-tight cursor-pointer">
                      Ho letto e accetto l&apos;informativa Privacy secondo le normative GDPR vigenti per la gestione della prenotazione. *
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E8E2D4]">
                  <button
                    type="button"
                    onClick={() => setModalState({ ...modalState, isOpen: false })}
                    className="px-4 py-2 rounded-lg bg-white border border-[#E8E2D4] text-xs font-epilogue font-bold uppercase text-[#554245] hover:bg-[#F3EDDF] cursor-pointer"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmitting ? (
                      <span>Registrazione...</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined notranslate text-[16px]">check_circle</span>
                        <span>Conferma Prenotazione</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
