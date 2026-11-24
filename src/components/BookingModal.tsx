import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMatch?: string;
  onSuccessToast: (msg: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedMatch,
  onSuccessToast
}) => {
  const { addBooking } = useSiteData();
  const [meal, setMeal] = useState<'cena' | 'pranzo'>('cena');
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('20:30');
  const [guests, setGuests] = useState('4');
  const [room, setRoom] = useState('gru');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState(preselectedMatch ? `Visione partita: ${preselectedMatch}` : '');
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const lunchTimes = ['12:00', '12:30', '13:00', '13:30', '14:00'];
  const dinnerTimes = ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];

  const roomNames: Record<string, string> = {
    gru: 'Sala Gru',
    schermi: 'Zona Maxischermo Sky Sport',
    bancone: 'Il Grande Bancone Spine',
    terrazza: 'La Terrazza Estiva (Meteo permettendo)'
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !gdprAccepted) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const code = `DOCK-${Math.floor(1000 + Math.random() * 9000)}`;
      addBooking({
        bookingCode: code,
        date,
        timeSlot: time,
        name,
        email: email || 'cliente@dock71.it',
        phone,
        guests: parseInt(guests, 10) || 4,
        area: roomNames[room] || room,
        notes,
        source: 'Modale Rapido',
        gdprAccepted: true
      });
      setConfirmationCode(code);
      onSuccessToast(`Tavolo prenotato con successo! Codice: ${code}`);
    }, 600);
  };

  const sendWhatsApp = () => {
    const selectedRoom = roomNames[room] || room;
    const text = encodeURIComponent(
      `Ciao Dock 71 Cantù! 🍺 Vorrei prenotare un tavolo:\n` +
      `• Nome: ${name || 'Cliente'}\n` +
      `• Telefono: ${phone}\n` +
      `• Data: ${date}\n` +
      `• Orario: ${time} (${meal === 'cena' ? 'Cena' : 'Pranzo'})\n` +
      `• Numero Persone: ${guests}\n` +
      `• Sala preferita: ${selectedRoom}\n` +
      (notes ? `• Note: ${notes}` : '')
    );
    window.location.href = `https://wa.me/390314487120?text=${text}`;
  };

  const resetAndClose = () => {
    setConfirmationCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 bg-[#FFF9EB] border-4 border-dock-burgundy rounded-3xl shadow-2xl overflow-hidden text-[#1D1C13]">
        {/* Top Checkerboard Ribbon */}
        <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

        {/* Header */}
        <div className="p-6 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-dock-burgundy flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined notranslate text-[22px]">table_restaurant</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-2">
                <span className="font-marker text-[11px] text-dock-burgundy uppercase font-bold">DOCK 71 CANTÙ</span>
                <span className="text-[10px] bg-dock-green px-2 py-0.5 rounded font-mono-tech text-white font-bold">PRENOTAZIONE DIRETTA</span>
              </div>
              <h3 className="font-chunky text-xl sm:text-2xl text-[#1D1C13] uppercase tracking-tight">
                Assicurati il Tuo Tavolo
              </h3>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E2D4] hover:border-dock-burgundy text-[#1D1C13] flex items-center justify-center transition-colors shadow-sm"
            aria-label="Chiudi finestra prenotazione"
          >
            <span className="material-symbols-outlined notranslate text-lg">close</span>
          </button>
        </div>

        {confirmationCode ? (
          <div className="p-8 text-center space-y-5 bg-[#FFF9EB]">
            <div className="w-16 h-16 rounded-full bg-dock-green mx-auto flex items-center justify-center text-white border-2 border-emerald-400 shadow-md">
              <span className="material-symbols-outlined notranslate text-4xl">check_circle</span>
            </div>
            <div>
              <span className="font-marker text-xs text-dock-burgundy uppercase font-bold">CONFERMA REGISTRATA</span>
              <h4 className="font-chunky text-2xl text-[#1D1C13] uppercase mt-1">Ci Vediamo al Molo!</h4>
              <p className="font-work text-sm text-[#554245] mt-2 max-w-md mx-auto">
                Tavolo riservato a nome di <strong className="text-[#1D1C13]">{name}</strong> per <strong className="text-[#1D1C13]">{guests} persone</strong> in data <strong className="text-dock-burgundy">{date}</strong> alle <strong className="text-[#1D1C13]">{time}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border-2 border-dock-burgundy max-w-xs mx-auto shadow-sm">
              <span className="font-mono-tech text-xs text-[#7A7265] uppercase block">CODICE PRENOTAZIONE</span>
              <span className="font-mono-tech text-2xl font-bold text-dock-burgundy tracking-widest">{confirmationCode}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={sendWhatsApp}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-dock-green hover:bg-dock-green-light text-white font-chunky text-xs uppercase border border-emerald-500 shadow-md transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
                INVIA RIEPILOGO SU WHATSAPP
              </button>
              <button
                onClick={resetAndClose}
                className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase border border-dock-burgundy-light shadow-md"
              >
                FATTO, GRAZIE!
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-6 space-y-5 bg-[#FFF9EB]">
            {/* Meal Choice */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMeal('cena');
                  setTime('20:30');
                }}
                className={`py-3 px-4 rounded-xl border-2 font-chunky text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                  meal === 'cena'
                    ? 'bg-dock-burgundy border-dock-burgundy text-white shadow-md'
                    : 'bg-white border-[#E8E2D4] text-[#554245] hover:text-[#1D1C13]'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[18px]">nightlife</span>
                Cena (18:30 – 01:00)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeal('pranzo');
                  setTime('12:30');
                }}
                className={`py-3 px-4 rounded-xl border-2 font-chunky text-xs uppercase flex items-center justify-center gap-2 transition-all ${
                  meal === 'pranzo'
                    ? 'bg-dock-burgundy border-dock-burgundy text-white shadow-md'
                    : 'bg-white border-[#E8E2D4] text-[#554245] hover:text-[#1D1C13]'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[18px]">wb_sunny</span>
                Pranzo (12:00 – 14:30)
              </button>
            </div>

            {/* Date, Time, Guests */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  DATA
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  ORARIO
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                >
                  {(meal === 'cena' ? dinnerTimes : lunchTimes).map((t) => (
                    <option key={t} value={t} className="bg-white text-[#1D1C13]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  PERSONE
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map((num) => (
                    <option key={num} value={num} className="bg-white text-[#1D1C13]">
                      {num} {num === 1 ? 'Persona' : 'Persone'}
                    </option>
                  ))}
                  <option value="20+ Comitiva" className="bg-white text-[#1D1C13]">
                    20+ (Grande Comitiva)
                  </option>
                </select>
              </div>
            </div>

            {/* Name, Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  NOME E COGNOME *
                </label>
                <input
                  type="text"
                  placeholder="Es. Mario Rossi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  EMAIL (CONFERMA) *
                </label>
                <input
                  type="email"
                  placeholder="Es. mario@email.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                  TELEFONO / WHATSAPP *
                </label>
                <input
                  type="tel"
                  placeholder="Es. 333 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                NOTE PARTICOLARI (FACOLTATIVO)
              </label>
              <textarea
                rows={2}
                placeholder="Es. Seggiolone per bimbi, allergie, compleanno, visione partita Sky..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none resize-none shadow-sm"
              ></textarea>
            </div>

            {/* GDPR Consent Checkbox */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E8E2D4]">
              <input
                type="checkbox"
                id="booking-modal-gdpr"
                required
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E8E2D4] text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
              />
              <label htmlFor="booking-modal-gdpr" className="font-work text-xs text-[#554245] leading-snug cursor-pointer">
                Acconsento al trattamento dei dati personali secondo l&apos;informativa Privacy e il Regolamento UE 2016/679 (GDPR) per la gestione della prenotazione. *
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider border-2 border-dock-burgundy-light shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="font-work">Conferma in corso...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">check</span>
                    CONFERMA PRENOTAZIONE TAVOLO
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={sendWhatsApp}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-dock-green hover:bg-dock-green-light text-white font-chunky text-xs uppercase border border-emerald-500 flex items-center justify-center gap-2 transition-colors shadow-sm"
                title="Prenota via WhatsApp"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">chat</span>
                WhatsApp
              </button>
            </div>
            <p className="text-[11px] text-[#7A7265] text-center font-work">
              Prenotazione immediata gratuita con conferma istantanea. Nessuna carta di credito richiesta.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
