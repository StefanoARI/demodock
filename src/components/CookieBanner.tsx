import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

export interface CookiePreferences {
  necessary: boolean; // Sempre true
  analytics: boolean; // GA4 anonimizzato
  marketing: boolean; // Meta, TikTok
}

const STORAGE_KEY = 'dock71_cookie_consent';

export const CookieBanner: React.FC<{
  onOpenPrivacyPolicy?: () => void;
  onOpenCookiePolicy?: () => void;
}> = ({ onOpenPrivacyPolicy, onOpenCookiePolicy }) => {
  const { addConsentLog } = useSiteData();
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Rileva se il consenso è già stato espresso precedentemente
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        // Nessun cookie di profilazione o analytics viene eseguito prima dell'opt-in (Blocco Preventivo)
        setIsVisible(true);
      } else {
        const parsed: CookiePreferences = JSON.parse(saved);
        applyConsents(parsed, false);
      }
    } catch {
      setIsVisible(true);
    }

    // Ascolta eventi custom dal footer per riaprire il banner
    const handleReopen = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };
    window.addEventListener('reopen_cookie_preferences', handleReopen);
    return () => {
      window.removeEventListener('reopen_cookie_preferences', handleReopen);
    };
  }, []);

  // Iniezione o abilitazione dinamica degli script solo dopo il rilascio del consenso
  const applyConsents = (prefs: CookiePreferences, shouldLog: boolean = true) => {
    // 1. Analytics (GA4)
    if (prefs.analytics) {
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    }

    // 2. Marketing (Meta Pixel & TikTok Pixel)
    if (prefs.marketing) {
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('consent', 'grant');
      }
    }

    // Salva il consenso localmente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    if (shouldLog) {
      const purposes = ['Tecnici', 'Preferenze'];
      if (prefs.analytics) purposes.push('Analitici');
      if (prefs.marketing) purposes.push('Marketing');
      addConsentLog({
        purposes,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Browser Client',
        source: 'Cookie Banner',
        analyticsAccepted: prefs.analytics,
        marketingAccepted: prefs.marketing
      });
      logConsentToBackend(prefs);
    }
  };

  // Proof of Consent (Log conformità GDPR per database)
  const logConsentToBackend = (prefs: CookiePreferences) => {
    const consentPayload = {
      consent_id: crypto.randomUUID ? crypto.randomUUID() : `cid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      consents_given: prefs,
      user_agent: navigator.userAgent
    };

    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/save-consent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(consentPayload)
        }).catch(() => {});
      }
    } catch {}
  };

  // Azione: Accetta Tutti
  const handleAcceptAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true
    };
    applyConsents(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  // Azione: Rifiuta Tutti (solo necessari)
  const handleRejectAll = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false
    };
    applyConsents(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  // Azione: Salva Preferenze Selezionate
  const handleSavePreferences = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics: analyticsConsent,
      marketing: marketingConsent
    };
    applyConsents(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Informativa Cookie e Consenso GDPR"
      className="fixed bottom-0 inset-x-0 z-[10001] p-4 sm:p-6 bg-black/50 backdrop-blur-sm flex justify-center items-end animate-in fade-in duration-300"
    >
      <div className="w-full max-w-4xl bg-[#FFF9EB] border-3 border-dock-burgundy rounded-2xl shadow-2xl overflow-hidden text-[#1D1C13]">
        {/* Ribbon Decorativo */}
        <div className="h-2 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-dock-burgundy text-white flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined notranslate text-[20px]">cookie</span>
              </div>
              <div>
                <span className="font-marker text-[10px] text-dock-burgundy uppercase font-bold">
                  CONFORMITÀ GDPR &amp; PRIVACY EUROPEA
                </span>
                <h3 className="font-chunky text-lg sm:text-xl text-[#1D1C13] uppercase tracking-tight">
                  Informativa Cookie &amp; Gestione del Consenso
                </h3>
              </div>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              aria-label="Chiudi banner"
              className="w-8 h-8 rounded-full bg-white border border-[#E8E2D4] hover:border-dock-burgundy flex items-center justify-center text-[#554245] transition-colors cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined notranslate text-base">close</span>
            </button>
          </div>

          <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
            Dock 71 utilizza cookie tecnici necessari per il corretto funzionamento del sito. Con il tuo consenso esplicito, possiamo impiegare anche cookie statistici anonimizzati (Google Analytics 4) e di profilazione marketing (Meta Pixel, TikTok) per offrirti offerte pertinenti. Nessun cookie non necessario viene installato prima della tua scelta. Puoi revocare il consenso in qualsiasi momento dal link nel footer.
          </p>

          <div className="flex flex-wrap items-center gap-2 font-epilogue text-xs text-dock-burgundy font-bold">
            <button
              onClick={onOpenPrivacyPolicy}
              className="underline hover:text-dock-burgundy-dark cursor-pointer"
            >
              Privacy Policy Completa
            </button>
            <span className="text-[#E8E2D4]">•</span>
            <button
              onClick={onOpenCookiePolicy}
              className="underline hover:text-dock-burgundy-dark cursor-pointer"
            >
              Cookie Policy Dettagliata
            </button>
          </div>

          {/* MODALE PREFERENZE GRANULARI */}
          {showPreferences && (
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D4] space-y-3 pt-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D4]">
                <span className="font-chunky text-xs uppercase text-[#1D1C13]">
                  Preferenze di Tracciamento
                </span>
                <span className="font-mono-tech text-[10px] text-dock-green font-bold">
                  BLOCCO PREVENTIVO ATTIVO
                </span>
              </div>

              {/* 1. Strettamente necessari */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E8E2D4]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13]">
                      1. Strettamente Necessari
                    </span>
                    <span className="font-mono-tech text-[9px] bg-dock-green text-white px-1.5 py-0.2 rounded font-bold">
                      SEMPRE ATTIVI
                    </span>
                  </div>
                  <p className="font-work text-[11px] text-[#554245] mt-0.5">
                    Indispensabili per navigazione sicura, carrello ordini e salvataggio delle tue preferenze di consenso. Non possono essere disattivati.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 rounded text-dock-burgundy opacity-60 cursor-not-allowed"
                />
              </div>

              {/* 2. Statistici / Analytics */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white border border-[#E8E2D4] hover:border-dock-burgundy transition-colors">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13]">
                      2. Statistici &amp; Analytics
                    </span>
                    <span className="font-mono-tech text-[9px] bg-dock-mustard text-dock-carbon px-1.5 py-0.2 rounded font-bold">
                      GA4 ANONIMIZZATO
                    </span>
                  </div>
                  <p className="font-work text-[11px] text-[#554245] mt-0.5">
                    Ci aiutano a capire quali sezioni del menù o quali birre sono più visitate, con indirizzo IP anonimizzato.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={analyticsConsent}
                  onChange={(e) => setAnalyticsConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
                />
              </div>

              {/* 3. Marketing / Profilazione */}
              <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-white border border-[#E8E2D4] hover:border-dock-burgundy transition-colors">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13]">
                      3. Marketing &amp; Profilazione
                    </span>
                    <span className="font-mono-tech text-[9px] bg-[#7B2039] text-white px-1.5 py-0.2 rounded font-bold">
                      META &amp; TIKTOK
                    </span>
                  </div>
                  <p className="font-work text-[11px] text-[#554245] mt-0.5">
                    Utilizzati per mostrare eventi live (partite Sky, serate birra speciale) tramite inserzioni pertinenti sui social network.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-marketing"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* PULSANTI DI AZIONE OBBLIGATORI (DI PARI EVIDENZA) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2 border-t border-[#E8E2D4]">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-[#1D1C13] hover:bg-[#F3EDDF] font-epilogue text-xs font-bold uppercase transition-all cursor-pointer text-center"
            >
              {showPreferences ? 'Nascondi Dettagli' : 'Personalizza / Preferenze'}
            </button>

            {showPreferences ? (
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 rounded-xl bg-dock-green hover:bg-emerald-700 text-white font-chunky text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer text-center"
              >
                Salva Mie Scelte
              </button>
            ) : null}

            <button
              onClick={handleRejectAll}
              className="px-5 py-2.5 rounded-xl bg-white border-2 border-dock-burgundy text-dock-burgundy hover:bg-[#F3EDDF] font-chunky text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer text-center"
            >
              Rifiuta Tutti
            </button>

            <button
              onClick={handleAcceptAll}
              className="px-6 py-2.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider shadow-md border-2 border-dock-burgundy-light transition-all cursor-pointer text-center"
            >
              Accetta Tutti
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
