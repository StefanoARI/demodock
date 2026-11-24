import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface PrivateEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const PrivateEventsModal: React.FC<PrivateEventsModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const { addBooking } = useSiteData();
  const [eventType, setEventType] = useState('compleanno');
  const [guests, setGuests] = useState('25');
  const [preferredDate, setPreferredDate] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [menuFormula, setMenuFormula] = useState('pizza_birra');
  const [notes, setNotes] = useState('');
  const [gdprAccepted, setGdprAccepted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !gdprAccepted) {
      return;
    }

    const code = `DOCK-${Math.floor(1000 + Math.random() * 9000)}`;
    addBooking({
      bookingCode: code,
      date: preferredDate || new Date().toISOString().split('T')[0],
      timeSlot: '20:30',
      name,
      email: 'eventi@dock71.it',
      phone,
      guests: parseInt(guests, 10) || 25,
      area: 'Sala Gru',
      notes: `[Evento: ${eventType.toUpperCase()} - Formula: ${menuFormula}] ${notes}`.trim(),
      source: 'Eventi Privati',
      gdprAccepted: true
    });

    const text = encodeURIComponent(
      `Ciao Dock 71 Cantù! 🎉 Vorrei informazioni per un evento privato:\n` +
      `• Tipo Evento: ${eventType.toUpperCase()}\n` +
      `• Ospiti stimati: ${guests} persone\n` +
      `• Data indicativa: ${preferredDate || 'Da concordare'}\n` +
      `• Formula desiderata: ${menuFormula}\n` +
      `• Nome: ${name}\n` +
      `• Telefono: ${phone}\n` +
      (notes ? `• Note speciali: ${notes}` : '')
    );

    onSuccessToast('Richiesta evento registrata! Ti reindirizziamo su WhatsApp.');
    setTimeout(() => {
      window.location.href = `https://wa.me/390314487120?text=${text}`;
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg my-8 bg-[#FFF9EB] border-4 border-dock-green rounded-3xl shadow-2xl overflow-hidden text-[#1D1C13]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-3 w-full checker-ribbon-secondary border-b border-[#E8E2D4]"></div>

        <div className="p-6 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="burst-badge px-2 py-0.5 bg-dock-green text-white font-marker text-[10px] uppercase font-bold">
                170 POSTI DISPONIBILI
              </span>
              <span className="font-marker text-[10px] text-dock-burgundy uppercase font-bold">SALA GRU &amp; TERRAZZA</span>
            </div>
            <h3 className="font-chunky text-xl sm:text-2xl text-[#1D1C13] uppercase tracking-tight">
              Feste &amp; Eventi al Molo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-[#E8E2D4] text-[#1D1C13] hover:text-dock-green flex items-center justify-center shadow-sm"
          >
            <span className="material-symbols-outlined notranslate text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-[#FFF9EB]">
          <div>
            <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
              TIPO DI FESTA O EVENTO
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'compleanno', label: '🎂 Compleanno' },
                { id: 'laurea', label: '🎓 Laurea' },
                { id: 'aziendale', label: '🏢 Cena Aziendale' },
                { id: 'comitiva', label: '🍻 Festa Comitiva / Celibato' }
              ].map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  onClick={() => setEventType(ev.id)}
                  className={`p-2.5 rounded-xl border text-left font-work font-semibold transition-colors ${
                    eventType === ev.id
                      ? 'bg-dock-green border-dock-green text-white shadow-sm'
                      : 'bg-white border-[#E8E2D4] text-[#554245] hover:text-[#1D1C13]'
                  }`}
                >
                  {ev.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                NUMERO OSPITI STIMATO
              </label>
              <input
                type="number"
                min="10"
                max="170"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
              />
            </div>
            <div>
              <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                DATA INDICATIVA
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
              FORMULA MENÙ PREFERITA
            </label>
            <select
              value={menuFormula}
              onChange={(e) => setMenuFormula(e.target.value)}
              className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
            >
              <option value="Giro Pizza 48h + Birra Artigianale alla Spina">
                Giro Pizza 48h No Stop + Pinte di Birra
              </option>
              <option value="Formula Burger Gourmet + Sfiziosità Condivise">
                Formula Burger Gourmet + Gran Taglieri Fritti
              </option>
              <option value="Grigliata del Molo (Tagliata & Costine BBQ)">
                Grigliata Mista del Molo (Tagliate & Costine BBQ)
              </option>
              <option value="Aperitivo Rinforzato a Buffet con Spine Libere">
                Aperitivo Rinforzato a Buffet con Spine Libere
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                NOME E COGNOME *
              </label>
              <input
                type="text"
                placeholder="Es. Luca Bianchi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                required
              />
            </div>
            <div>
              <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
                TELEFONO *
              </label>
              <input
                type="tel"
                placeholder="Es. 347 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-marker text-[11px] text-dock-burgundy uppercase block mb-1.5 font-bold">
              RICHIESTE PARTICOLARI O TORTA
            </label>
            <textarea
              rows={2}
              placeholder="Es. Torta personalizzata, musica, maxi schermo per video ricordo..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border-2 border-[#E8E2D4] focus:border-dock-green rounded-xl p-2.5 text-xs text-[#1D1C13] outline-none resize-none shadow-sm"
            ></textarea>
          </div>

          {/* GDPR Consent Checkbox */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E8E2D4]">
            <input
              type="checkbox"
              id="private-events-gdpr"
              required
              checked={gdprAccepted}
              onChange={(e) => setGdprAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#E8E2D4] text-dock-green focus:ring-dock-green cursor-pointer"
            />
            <label htmlFor="private-events-gdpr" className="font-work text-xs text-[#554245] leading-snug cursor-pointer">
              Acconsento al trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) per la gestione della richiesta evento. *
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-dock-green hover:bg-dock-green-light text-white font-chunky text-xs uppercase tracking-wider border border-emerald-400 shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined notranslate text-[18px]">send</span>
            RICHIEDI PREVENTIVO EVENTO
          </button>
        </form>
      </div>
    </div>
  );
};
