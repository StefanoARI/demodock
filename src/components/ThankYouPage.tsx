import React from 'react';

interface ThankYouPageProps {
  type: 'contact' | 'booking';
  onGoHome: () => void;
  onOpenBooking?: () => void;
  bookingCode?: string;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  type,
  onGoHome,
  onOpenBooking,
  bookingCode
}) => {
  // Tracciamento Conversioni Standard "Lead" per Google Analytics, Meta Pixel e TikTok Pixel
  React.useEffect(() => {
    try {
      // 1. Google Analytics 4 (gtag)
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: type === 'contact' ? 'contact_form' : 'booking_form'
        });
      }

      // 2. Meta Pixel (fbq)
      if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Lead', {
          content_name: type === 'contact' ? 'Richiesta Contatto' : 'Richiesta Prenotazione'
        });
      }

      // 3. TikTok Pixel (ttq)
      if (typeof window !== 'undefined' && (window as any).ttq && typeof (window as any).ttq.track === 'function') {
        (window as any).ttq.track('SubmitForm', {
          description: type === 'contact' ? 'contact_lead' : 'booking_lead'
        });
      }
    } catch (err) {
      console.debug('Conversion pixel tracking handled:', err);
    }
  }, [type]);

  const isContact = type === 'contact';

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1D1C13] min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 sm:px-6">
      <div className="max-w-xl w-full text-center space-y-6 bg-[#FFF9EB] border-3 border-dock-burgundy rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Top Checkerboard Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-3 checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-dock-green mx-auto flex items-center justify-center text-white border-4 border-emerald-400 shadow-xl animate-in zoom-in-75 duration-300">
          <span className="material-symbols-outlined notranslate text-5xl">check_circle</span>
        </div>

        {/* Header Texts */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#E8E2D4] rounded-full text-dock-burgundy font-marker text-xs">
            ★ RICHIESTA TRASMESSA CON SUCCESSO ★
          </div>
          <h1 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13] uppercase tracking-tight">
            {isContact ? 'Grazie per averci contattato!' : 'Grazie per la tua prenotazione!'}
          </h1>
          <p className="font-work text-sm sm:text-base text-[#554245] leading-relaxed max-w-md mx-auto">
            {isContact
              ? 'Abbiamo ricevuto la tua richiesta e ti è stata inviata una email di riepilogo. Il team del Dock 71 ti risponderà a brevissimo.'
              : 'La tua richiesta è stata registrata ed è in attesa di conferma da parte del nostro team. Ti abbiamo inviato una mail di riepilogo con tutti i dettagli.'}
          </p>
        </div>

        {/* Booking Code Card (se disponibile) */}
        {!isContact && bookingCode && (
          <div className="p-4 rounded-2xl bg-white border-2 border-dock-burgundy max-w-xs mx-auto shadow-sm">
            <span className="font-mono-tech text-xs text-[#7A7265] uppercase block">
              CODICE PRENOTAZIONE
            </span>
            <span className="font-mono-tech text-2xl font-bold text-dock-burgundy tracking-widest">
              {bookingCode}
            </span>
          </div>
        )}

        {/* Info Coordinate */}
        <div className="p-4 rounded-xl bg-[#F3EDDF] border border-[#E8E2D4] text-xs font-work text-[#554245] space-y-1">
          <p>
            <strong>Dock 71 Cantù:</strong> Via Milano 71, 22063 Cantù (CO)
          </p>
          <p>
            <strong>Telefono &amp; WhatsApp:</strong> 031 448 7120 • <strong>Email:</strong> info@dock71birreria.it
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider border-2 border-dock-burgundy-light shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">home</span>
            Torna alla Home
          </button>
          {isContact && onOpenBooking && (
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-dock-burgundy text-dock-burgundy hover:bg-[#F3EDDF] font-chunky text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">table_restaurant</span>
              Prenota un Tavolo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
