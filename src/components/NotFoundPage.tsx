import React from 'react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from './FloatingContactWidget';

interface NotFoundPageProps {
  onGoHome: () => void;
  onOpenBooking: () => void;
  onOpenContact: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onOpenBooking,
  onOpenContact
}) => {
  // WhatsApp Link con messaggio precompilato [INSERISCI_NUMERO_WHATSAPP]
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Ciao Dock 71! Ho riscontrato una pagina non trovata sul sito e vorrei maggiori informazioni.'
  )}`;

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1D1C13] min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8 bg-[#FFF9EB] border-3 border-dock-burgundy rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Ribbon Superiore */}
        <div className="absolute top-0 left-0 right-0 h-3 checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

        {/* 404 Visual Hero */}
        <div className="relative inline-flex items-center justify-center mt-2">
          <span className="font-chunky text-7xl sm:text-9xl text-dock-burgundy tracking-tighter select-none opacity-90 drop-shadow-sm">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-marker text-xs sm:text-sm bg-dock-mustard text-dock-carbon px-3 py-1 rounded-md shadow-md border border-dock-mustard -rotate-6">
              MOLO NON TROVATO
            </span>
          </div>
        </div>

        {/* Titolo e Spiegazione Rassicurante */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E8E2D4] rounded-full text-dock-burgundy font-marker text-xs">
            ★ ROTTA SMARRITA NEL PORTO DI CANTÙ ★
          </div>
          <h1 className="font-chunky text-2xl sm:text-4xl text-[#1D1C13] uppercase tracking-tight">
            Ops! La pagina che cerchi non esiste
          </h1>
          <p className="font-work text-sm sm:text-base text-[#554245] max-w-lg mx-auto leading-relaxed">
            Sembra che questo attracco sia andato perduto tra le nebbie o che il link sia cambiato.
            Niente paura: la nostra cucina, le pizze a 48h di lievitazione e le 14 birre alla spina ti aspettano al Dock!
          </p>
        </div>

        {/* Azione Primaria: Torna alla Home */}
        <div className="pt-2">
          <button
            onClick={onGoHome}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-sm uppercase tracking-wider border-2 border-dock-burgundy-light shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined notranslate text-[20px]">home</span>
            Torna alla Home del Pub
          </button>
        </div>

        {/* Griglia Canali di Contatto Rapido */}
        <div className="pt-6 border-t border-[#E8E2D4] space-y-4">
          <span className="font-marker text-xs uppercase tracking-wider text-[#7A7265] block font-bold">
            Canali di Contatto Rapido &amp; Assistenza
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
            {/* 1. Chiamata Diretta */}
            {/* [INSERISCI_NUMERO_TELEFONO] */}
            <a
              href={`tel:+${PHONE_NUMBER}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E2D4] hover:border-dock-burgundy transition-all group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-dock-burgundy text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined notranslate text-[18px]">call</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13] group-hover:text-dock-burgundy">
                  Chiamaci Subito
                </span>
                <span className="font-mono-tech text-[11px] text-[#554245]">
                  031 448 7120
                </span>
              </div>
            </a>

            {/* 2. WhatsApp Diretto */}
            {/* [INSERISCI_NUMERO_WHATSAPP] */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E2D4] hover:border-emerald-500 transition-all group shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13] group-hover:text-emerald-700">
                  Scrivici su WhatsApp
                </span>
                <span className="font-work text-[11px] text-[#554245]">
                  Risposta istantanea
                </span>
              </div>
            </a>

            {/* 3. Modulo di Contatto */}
            <button
              onClick={onOpenContact}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8E2D4] hover:border-[#336859] transition-all group shadow-xs text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#336859] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined notranslate text-[18px]">mail</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13] group-hover:text-[#336859]">
                  Modulo di Contatto
                </span>
                <span className="font-work text-[11px] text-[#554245]">
                  Invia una richiesta email
                </span>
              </div>
            </button>

            {/* 4. Prenotazione Tavolo */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-3 p-3 rounded-xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark transition-all group shadow-md text-left cursor-pointer border border-dock-burgundy-light"
            >
              <div className="w-9 h-9 rounded-lg bg-dock-mustard text-dock-carbon flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined notranslate text-[18px]">table_restaurant</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-chunky text-xs uppercase text-white group-hover:text-dock-mustard">
                  Prenota un Tavolo
                </span>
                <span className="font-work text-[11px] text-[#F3EDDF]/90">
                  Posto assicurato
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
