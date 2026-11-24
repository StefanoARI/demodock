import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface BookingPageProps {
  onSuccessToast?: (msg: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onSuccessToast }) => {
  const { addBooking } = useSiteData();
  const [bookingType, setBookingType] = useState<'standard' | 'event'>('standard');
  const [guests, setGuests] = useState<number | string>(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [slot, setSlot] = useState<string>('20:30');
  const [area, setArea] = useState<string>('sala-gru');
  const [occasion, setOccasion] = useState<string>('Festa di Compleanno');
  const [extraService, setExtraService] = useState<string>('Menu Pizza & Birra concordato');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [gdprAccepted, setGdprAccepted] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [confirmationCode, setConfirmationCode] = useState<string>('');

  const areaLabels: Record<string, string> = {
    'sala-gru': 'Sala Gru',
    bancone: 'Grande Bancone Spine',
    terrazza: 'Terrazza Esterna',
    nessuna: 'Qualsiasi Tavolo'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAccepted) return;
    const code = 'DOCK-' + Math.floor(1000 + Math.random() * 9000);
    setConfirmationCode(code);
    addBooking({
      bookingCode: code,
      date,
      timeSlot: slot,
      name,
      email: email || 'cliente@dock71.it',
      phone,
      guests: typeof guests === 'number' ? guests : 20,
      area: areaLabels[area] || area,
      notes: bookingType === 'event' ? `[${occasion} - ${extraService}] ${notes}`.trim() : notes,
      source: 'Pagina Prenota',
      gdprAccepted: true
    });
    setIsSuccess(true);
    if (onSuccessToast) {
      onSuccessToast(`Prenotazione registrata! Codice: ${code}`);
    }
  };

  const handleLaunchWhatsApp = () => {
    const text = encodeURIComponent(
      `Ciao Dock 71! Ho effettuato una richiesta di prenotazione:\n` +
      `• Codice: ${confirmationCode || 'Nuova'}\n` +
      `• Tipo: ${bookingType === 'event' ? `Evento (${occasion})` : 'Tavolo Standard'}\n` +
      `• Nome: ${name}\n` +
      `• Telefono: ${phone}\n` +
      `• Data: ${date}\n` +
      `• Turno: ${slot}\n` +
      `• Persone: ${guests}\n` +
      `• Area: ${area}\n` +
      (bookingType === 'event' ? `• Servizi: ${extraService}\n` : '') +
      (notes ? `• Note: ${notes}` : '')
    );
    window.open(`https://wa.me/390314487120?text=${text}`, '_blank');
  };

  const resetForm = () => {
    setIsSuccess(false);
    setName('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1C1917]">
      <section className="relative w-full py-12 lg:py-16 bg-[#FAF7F2] overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#E8DEC8]/40 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-20 w-80 h-80 rounded-full bg-[#DFD5C6]/30 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9DF] border border-[#DFD5C6] text-[#78350F] font-mono-tech text-xs uppercase tracking-widest mb-4 font-bold">
              <span className="material-symbols-outlined notranslate text-[16px] text-dock-burgundy">restaurant_menu</span>
              Wharf Reservation • Cantù
            </div>
            <h1 className="font-chunky text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#1C1917] tracking-tight uppercase">
              <span className="text-[#1C1917]">Prenota un Tavolo</span>{' '}
              <span className="text-dock-burgundy">&amp; Eventi</span>
            </h1>
            <p className="font-work text-base sm:text-lg text-[#57534E] mt-4 max-w-2xl text-center leading-relaxed">
              Assicurati il tuo posto tra le banchine del gusto. Dalle pinte tra amici con vista sui maxi schermi ai compleanni e rinfreschi aziendali, fino a 170 coperti.
            </p>
            <div className="inline-flex items-center gap-3 bg-white border border-[#DFD5C6] px-5 py-2.5 rounded-2xl shadow-sm mt-6">
              <span className="material-symbols-outlined notranslate text-[20px] text-dock-burgundy">verified</span>
              <span className="font-mono-tech text-xs uppercase text-[#1C1917] font-bold">Conferma Rapida Staff</span>
              <span className="text-[#DFD5C6]">•</span>
              <span className="font-work text-xs text-[#78716C]">WhatsApp &amp; SMS entro 30 minuti</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white border border-[#DFD5C6] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E7DFD4]">
                <div>
                  <span className="font-marker text-[11px] text-[#78350F] uppercase tracking-widest block font-bold">
                    Step 01 / Configura
                  </span>
                  <span className="font-chunky text-xl sm:text-2xl text-[#1C1917]">
                    Tipo di Occasione
                  </span>
                </div>
                <div className="inline-flex p-1 rounded-2xl bg-[#F5F2EB] border border-[#DFD5C6] self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setBookingType('standard')}
                    className={`px-4 py-2 rounded-xl font-epilogue text-xs uppercase tracking-wider transition-all font-bold ${
                      bookingType === 'standard'
                        ? 'bg-dock-burgundy text-white shadow-sm'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Tavolo Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('event')}
                    className={`px-4 py-2 rounded-xl font-epilogue text-xs uppercase tracking-wider transition-all font-bold ${
                      bookingType === 'event'
                        ? 'bg-dock-burgundy text-white shadow-sm'
                        : 'text-[#57534E] hover:text-[#1C1917]'
                    }`}
                  >
                    Evento Speciale
                  </button>
                </div>
              </div>

              <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                {/* Guests */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">group</span>
                      Numero di Coperti
                    </label>
                    <span className="font-mono-tech text-[11px] text-[#57534E] bg-[#F5F2EB] border border-[#DFD5C6] px-2.5 py-1 rounded-lg">
                      Max 170 posti (130 interni + 40 terrazza)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[2, 4, 6, 8, 10, 12, 15, '20+'].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setGuests(count)}
                        className={`py-2.5 rounded-xl border font-chunky text-base transition-all text-center focus:outline-none ${
                          guests === count
                            ? 'bg-dock-burgundy border-dock-burgundy text-white shadow-sm scale-[1.03]'
                            : 'bg-[#FAF7F2] border-[#DFD5C6] text-[#1C1917] hover:border-dock-burgundy hover:bg-white'
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                  <p className="font-work text-xs text-[#57534E] mt-2.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined notranslate text-[16px] text-dock-burgundy">info</span>
                    Per comitive superiori a 20 persone prepariamo allestimenti e menu personalizzati.
                  </p>
                </div>

                {/* Date and Time Slot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label
                      className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold flex items-center gap-1.5"
                      htmlFor="booking-date"
                    >
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">calendar_today</span>
                      Data Prenotazione
                    </label>
                    <input
                      className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-colors"
                      id="booking-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold flex items-center gap-1.5">
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">schedule</span>
                      Turno Orario
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['19:30', '20:30', '21:30', '22:30', 'Pranzo 12:45'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSlot(time)}
                          className={`px-3 py-2 rounded-xl font-mono-tech text-xs transition-all ${
                            slot === time
                              ? 'bg-dock-burgundy border border-dock-burgundy text-white shadow-sm font-bold'
                              : 'bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] hover:border-dock-burgundy hover:bg-white'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Area Preference */}
                <div className="flex flex-col gap-2">
                  <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">meeting_room</span>
                    Preferenza Area (Informativa)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'sala-gru', title: 'Sala Gru', desc: 'Cuore del pub' },
                      { id: 'bancone', title: 'Bancone', desc: 'Vicino alle spine' },
                      { id: 'terrazza', title: 'Terrazza', desc: 'Esterna (40 posti)' },
                      { id: 'nessuna', title: 'Qualsiasi', desc: 'Primo tavolo libero' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setArea(item.id)}
                        className={`flex flex-col p-3 rounded-2xl border transition-all text-center ${
                          area === item.id
                            ? 'bg-white border-2 border-dock-burgundy shadow-sm'
                            : 'bg-[#FAF7F2] border-[#DFD5C6] hover:border-dock-burgundy hover:bg-white'
                        }`}
                      >
                        <span
                          className={`font-chunky text-base mb-1 block ${
                            area === item.id ? 'text-dock-burgundy' : 'text-[#1C1917]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="font-work text-xs text-[#57534E]">
                          {item.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Event Special Section */}
                {bookingType === 'event' && (
                  <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C6] transition-all">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">celebration</span>
                      <span className="font-chunky text-lg text-[#1C1917]">Dettagli per Evento Speciale</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-marker text-[10px] text-[#57534E] uppercase tracking-wider font-bold">
                          Occasione
                        </label>
                        <select
                          className="h-10 px-3 rounded-xl bg-white border border-[#DFD5C6] text-[#1C1917] font-work text-xs focus:border-dock-burgundy focus:outline-none"
                          value={occasion}
                          onChange={(e) => setOccasion(e.target.value)}
                        >
                          <option>Festa di Compleanno</option>
                          <option>Cena Aziendale / Team Building</option>
                          <option>Festa di Laurea / Traguardo</option>
                          <option>Ritrovo Partita Sky Sport</option>
                          <option>Altro evento privato</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-marker text-[10px] text-[#57534E] uppercase tracking-wider font-bold">
                          Servizi Aggiuntivi
                        </label>
                        <select
                          className="h-10 px-3 rounded-xl bg-white border border-[#DFD5C6] text-[#1C1917] font-work text-xs focus:border-dock-burgundy focus:outline-none"
                          value={extraService}
                          onChange={(e) => setExtraService(e.target.value)}
                        >
                          <option>Menu Pizza &amp; Birra concordato</option>
                          <option>Servizio Torta Pub &amp; Spumante</option>
                          <option>Portiamo noi la torta (con manleva)</option>
                          <option>Menu alla carta per tutti</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold" htmlFor="contact-name">
                      Nome &amp; Cognome *
                    </label>
                    <input
                      className="h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] font-work text-sm placeholder:text-[#A8A29E] focus:bg-white focus:border-dock-burgundy focus:outline-none transition-colors"
                      id="contact-name"
                      placeholder="Es. Marco Rossi"
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold" htmlFor="contact-email">
                      Email (per Conferma) *
                    </label>
                    <input
                      className="h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] font-work text-sm placeholder:text-[#A8A29E] focus:bg-white focus:border-dock-burgundy focus:outline-none transition-colors"
                      id="contact-email"
                      placeholder="Es. marco@email.it"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold" htmlFor="contact-phone">
                      Telefono (WhatsApp) *
                    </label>
                    <input
                      className="h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] font-work text-sm placeholder:text-[#A8A29E] focus:bg-white focus:border-dock-burgundy focus:outline-none transition-colors"
                      id="contact-phone"
                      placeholder="Es. 347 1234567"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-3">
                    <label className="font-epilogue text-xs uppercase tracking-wider text-[#1C1917] font-bold" htmlFor="contact-notes">
                      Note Speciali o Allergie (Facoltativo)
                    </label>
                    <textarea
                      className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] font-work text-xs placeholder:text-[#A8A29E] focus:bg-white focus:border-dock-burgundy focus:outline-none transition-colors"
                      id="contact-notes"
                      placeholder="Seggiolone per bambini, intolleranze alimentari, vista partita Sky Sport..."
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                {/* GDPR Consent Checkbox */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C6]">
                  <input
                    type="checkbox"
                    id="booking-page-gdpr"
                    required
                    checked={gdprAccepted}
                    onChange={(e) => setGdprAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-[#DFD5C6] text-dock-burgundy focus:ring-dock-burgundy cursor-pointer"
                  />
                  <label htmlFor="booking-page-gdpr" className="font-work text-xs text-[#57534E] leading-relaxed cursor-pointer">
                    Ho letto l&apos;informativa sulla Privacy e acconsento al trattamento dei miei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) per la conferma del tavolo. *
                  </label>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    className="w-full py-4 rounded-2xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark font-chunky text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95"
                    type="submit"
                  >
                    <span className="material-symbols-outlined notranslate text-[20px]">assignment_turned_in</span>
                    Invia Richiesta di Prenotazione
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[#57534E] font-work text-xs text-center">
                    <span className="material-symbols-outlined notranslate text-[#78350F] text-[16px]">lock</span>
                    <span>Nessun anticipo richiesto • Conferma via WhatsApp/SMS entro pochi minuti.</span>
                  </div>
                </div>
              </form>

              {/* Success Modal Overlay */}
              {isSuccess && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center z-20">
                  <div className="w-16 h-16 rounded-full bg-dock-burgundy text-white flex items-center justify-center mb-4 shadow-lg">
                    <span className="material-symbols-outlined notranslate text-[36px]">check_circle</span>
                  </div>
                  <h3 className="font-chunky text-2xl text-[#1C1917] uppercase mb-1">
                    Richiesta Inviata!
                  </h3>
                  <div className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFD5C6] font-mono-tech text-xs text-dock-burgundy font-bold mb-3">
                    Codice: {confirmationCode}
                  </div>
                  <p className="font-work text-sm text-[#57534E] max-w-md mb-6 leading-relaxed">
                    Grazie <strong>{name}</strong>! Il nostro mastro di sala a Cantù ha preso in carico la tua prenotazione per <strong>{guests} persone</strong> il <strong>{date}</strong> alle <strong>{slot}</strong>.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleLaunchWhatsApp}
                      className="px-6 py-3 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                    >
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">chat</span>
                      Conferma su WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] text-[#1C1917] hover:bg-[#EFE9DF] font-chunky text-xs uppercase tracking-wider font-semibold"
                    >
                      Nuova Prenotazione
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Information Columns */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Fast Track Direct */}
              <div className="bg-white border border-[#DFD5C6] p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[24px]">flash_on</span>
                    <span className="font-chunky text-xl text-[#1C1917] uppercase">
                      Prenotazione Diretta
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#F5F2EB] border border-[#DFD5C6] text-[#78350F] font-marker text-[10px] uppercase font-bold">
                    Fast Track
                  </span>
                </div>
                <p className="font-work text-sm text-[#57534E]">
                  Hai fretta o preferisci concordare subito i dettagli della serata a voce con il nostro personale?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C6] hover:bg-[#F5F2EB] hover:border-dock-burgundy text-dock-burgundy transition-all font-chunky text-xs uppercase tracking-wider shadow-sm"
                    href="tel:0314487120"
                  >
                    <span className="material-symbols-outlined notranslate text-[20px]">call</span>
                    Chiama 031 4487120
                  </a>
                  <a
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#FAF7F2] border border-[#DFD5C6] hover:bg-[#F5F2EB] hover:border-dock-burgundy text-[#1C1917] hover:text-dock-burgundy transition-all font-chunky text-xs uppercase tracking-wider shadow-sm"
                    href="https://wa.me/390314487120"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="material-symbols-outlined notranslate text-[20px] text-[#336859]">chat</span>
                    WhatsApp Diretto
                  </a>
                </div>
              </div>

              {/* Feste & Grandi Tavolate */}
              <div className="bg-white border border-[#DFD5C6] p-6 rounded-3xl shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-[#E7DFD4]">
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[24px]">local_bar</span>
                  <h3 className="font-chunky text-xl text-[#1C1917] uppercase">
                    Feste &amp; Grandi Tavolate
                  </h3>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] flex items-center justify-center text-[#78350F] flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined notranslate text-[20px]">cake</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-chunky text-base text-[#1C1917]">
                        Compleanni &amp; Feste Private
                      </span>
                      <span className="font-work text-xs text-[#57534E]">
                        Zone dedicate con brindisi, opzione torta della casa e giro pizze a spicchi fumanti.
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] flex items-center justify-center text-[#78350F] flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined notranslate text-[20px]">business_center</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-chunky text-base text-[#1C1917]">
                        Cene Aziendali &amp; Team Building
                      </span>
                      <span className="font-work text-xs text-[#57534E]">
                        Formule a prezzo fisso con birre artigianali a fiumi, taglieri misti e atmosfera distesa.
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3.5 items-start">
                    <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#DFD5C6] flex items-center justify-center text-dock-burgundy flex-shrink-0 mt-0.5">
                      <span className="material-symbols-outlined notranslate text-[20px]">sports_soccer</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-chunky text-base text-[#1C1917]">
                        Notti Sky Sport Live
                      </span>
                      <span className="font-work text-xs text-[#57534E]">
                        Prenota indicando la partita nei dettagli: ti riserviamo il tavolo a vista diretta sui maxi schermi HD.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinate Utili */}
              <div className="bg-white border border-[#DFD5C6] p-6 rounded-3xl shadow-sm flex flex-col gap-3">
                <span className="font-chunky text-base uppercase text-[#1C1917]">
                  Coordinate Utili
                </span>
                <div className="flex items-center gap-3 text-[#57534E] font-work text-xs">
                  <span className="material-symbols-outlined notranslate text-[#78350F] text-[20px]">local_parking</span>
                  <span><strong className="text-[#1C1917]">Ampio Parcheggio Gratuito</strong> a pochi metri dal locale</span>
                </div>
                <div className="flex items-center gap-3 text-[#57534E] font-work text-xs">
                  <span className="material-symbols-outlined notranslate text-[#78350F] text-[20px]">map</span>
                  <span>Via Milano 71, Cantù • A 3 minuti dal centro</span>
                </div>
                <div className="flex items-center gap-3 text-[#57534E] font-work text-xs">
                  <span className="material-symbols-outlined notranslate text-[#78350F] text-[20px]">credit_card_off</span>
                  <span>Nessun costo di prenotazione o tariffa coperto maggiorata</span>
                </div>
              </div>

              {/* Atmospheric Visual Banner */}
              <div className="relative rounded-3xl overflow-hidden border border-[#DFD5C6] shadow-sm h-48">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDN4zpjOUoHCRSSCdw8NMwIknNh06AVhnUeuYa1LkhIvqES-Mna8_nWGvdQ5uqe08xHMyugcLT5zt8Xv7CFy04rWmAgywDHCrqXbA87qsvLH5WnoVI_rC-GkrWRFFeuTAwDl9s3s6EU42VM4nGdzkU-8EANqbPVkhv-kQaTvZKwX9II4YlOOO75lVXqi8o5sjuYl4WvRsjVJmUlQTlHhK-lgSE8ZmLm9UO-c_CjkwvZNKIEx2TQCRfdkQ')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent flex items-end p-5">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col">
                      <span className="font-marker text-[11px] uppercase tracking-widest text-[#F1E1C0] font-bold">
                        Atmosfera Wharf
                      </span>
                      <span className="font-work text-xs text-white">
                        170 posti • Interno &amp; Dehor Estivo
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-dock-burgundy text-white font-mono-tech text-xs font-bold uppercase tracking-wider">
                      Cantù
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
