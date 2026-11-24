import React, { useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface ContactPageProps {
  onOpenBooking: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenBooking }) => {
  const { addContact } = useSiteData();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reason: 'info',
    message: '',
    privacy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reasonLabels: Record<string, string> = {
    info: 'Informazioni Generali',
    festa: 'Festa Privata / Compleanno / Laurea',
    aziendale: 'Cena Aziendale / Gruppo Grande',
    allergie: 'Allergie / Dieta Senza Glutine',
    partite: 'Tavolo Dedicato Maxischermo Sport'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      addContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: reasonLabels[formData.reason] || formData.reason,
        message: formData.message,
        source: 'Pagina Contatti',
        gdprAccepted: formData.privacy
      });
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Ciao Dock 71! Vorrei informazioni su un tavolo / evento:\n` +
      `Nome: ${formData.name || 'Cliente'}\n` +
      `Motivo: ${formData.reason}\n` +
      (formData.message ? `Messaggio: ${formData.message}` : '')
    );
    window.open(`https://wa.me/390314487120?text=${text}`, '_blank');
  };

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1D1C13]">
      {/* Top Ambient Banner & Header Block */}
      <section className="relative w-full overflow-hidden bg-[#F3EDDF] px-6 lg:px-12 py-16 border-b border-[#E8E2D4]">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-dock-burgundy/5 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -bottom-20 w-80 h-80 rounded-full bg-[#E0A93B]/10 blur-2xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm mb-6 border border-[#E8E2D4]">
            <span className="w-2.5 h-2.5 rounded-full bg-dock-burgundy animate-pulse"></span>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
              Coordinate &amp; Informazioni Pratiche
            </span>
          </div>

          <h1 className="font-chunky text-3xl sm:text-4xl lg:text-5xl text-[#1D1C13] max-w-4xl tracking-tight mb-4 uppercase">
            Contatti, Orari &amp; Dove Trovarci a <span className="text-dock-burgundy">Cantù</span>
          </h1>

          <p className="font-work text-base sm:text-lg text-[#554245] max-w-2xl leading-relaxed">
            Siamo in Via Milano 71 a Cantù. Tutte le coordinate per raggiungerci, prenotare o fare due chiacchiere con noi tra boccali di birra fresca e sapori autentici.
          </p>

          {/* Quick Action Badges Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1D1C13] shadow-sm hover:shadow-md transition-all font-epilogue text-xs uppercase font-bold border border-[#E8E2D4]"
              href="tel:0314487120"
            >
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">call</span>
              031 4487120
            </a>
            <span className="hidden sm:inline text-[#C4BCB2]">•</span>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1D1C13] shadow-sm font-epilogue text-xs uppercase font-semibold border border-[#E8E2D4]">
              <span className="material-symbols-outlined notranslate text-[#336859] text-[18px]">local_parking</span>
              Parcheggio Gratuito Riservato
            </div>
            <span className="hidden sm:inline text-[#C4BCB2]">•</span>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#1D1C13] shadow-sm font-epilogue text-xs uppercase font-semibold border border-[#E8E2D4]">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">sports_bar</span>
              Cucina &amp; Spine Aperte 7/7
            </div>
          </div>
        </div>
      </section>

      {/* Key Information Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 -mt-6 z-20 w-full mb-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Posizione & Accesso */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E8E2D4] flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-dock-burgundy/10 flex items-center justify-center text-dock-burgundy">
                <span className="material-symbols-outlined notranslate text-[26px]">pin_drop</span>
              </div>
              <div>
                <span className="font-marker text-[11px] uppercase tracking-widest text-[#7A7265] font-bold">
                  Indirizzo Storico
                </span>
                <h2 className="font-chunky text-2xl text-[#1D1C13] mt-1">Via Milano 71</h2>
                <p className="font-epilogue text-xs text-dock-burgundy font-bold mt-0.5">
                  22063 Cantù (CO) • Brianza Comasca
                </p>
              </div>
              <p className="font-work text-sm text-[#554245] leading-relaxed">
                Situato a soli 2 minuti dal centro storico di Cantù, comodissimo e con collegamento rapido da Como, Mariano Comense, Giussano ed Erba lungo la direttrice principale.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center justify-between bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D4]">
              <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Distanza Centro</span>
              <span className="font-mono-tech text-xs text-[#1D1C13] font-bold">~ 900 metri (2 min)</span>
            </div>
          </div>

          {/* Card 2: Parcheggio Privato Gratuito */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E8E2D4] flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#336859]/10 flex items-center justify-center text-[#336859]">
                <span className="material-symbols-outlined notranslate text-[26px]">directions_car</span>
              </div>
              <div>
                <span className="font-marker text-[11px] uppercase tracking-widest text-[#7A7265] font-bold">
                  Zero Pensieri Parcheggio
                </span>
                <h2 className="font-chunky text-2xl text-[#1D1C13] mt-1">Piazzale Riservato Gratuito</h2>
                <p className="font-epilogue text-xs text-[#336859] font-bold mt-0.5">
                  Direttamente davanti all'ingresso
                </p>
              </div>
              <p className="font-work text-sm text-[#554245] leading-relaxed">
                Ampia disponibilità di stalli per auto, SUV, furgoni e car sharing. Piazzale completamente illuminato di sera, video-controllato e senza gradini per il pieno accesso disabili.
              </p>
            </div>
            <div className="mt-6 pt-4 flex items-center justify-between bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D4]">
              <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Costo Sosta</span>
              <span className="font-mono-tech text-xs text-dock-burgundy font-bold uppercase tracking-wider">
                100% Gratuito Clienti
              </span>
            </div>
          </div>

          {/* Card 3: Canale Diretto Telefono & WhatsApp */}
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-[#E8E2D4] flex flex-col justify-between group hover:shadow-md transition-shadow">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-dock-burgundy flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined notranslate text-[26px]">headset_mic</span>
              </div>
              <div>
                <span className="font-marker text-[11px] uppercase tracking-widest text-[#7A7265] font-bold">
                  Linea Diretta &amp; WhatsApp
                </span>
                <h2 className="font-chunky text-2xl text-[#1D1C13] mt-1">031 4487120</h2>
                <p className="font-epilogue text-xs text-dock-burgundy font-bold mt-0.5">
                  Unico numero per chiamate &amp; chat
                </p>
              </div>
              <p className="font-work text-sm text-[#554245] leading-relaxed">
                Per tavoli dell'ultimo minuto, richieste speciali sui menù, catering aziendali o per riservare la postazione vicino agli schermi Sky per la partita.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <a
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase tracking-wider hover:bg-dock-burgundy-dark transition-colors shadow-sm"
                href="tel:0314487120"
              >
                <span className="material-symbols-outlined notranslate text-[16px]">call</span>
                Chiama Subito
              </a>
              <a
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FAF7F2] text-[#1D1C13] border border-[#E8E2D4] font-chunky text-xs uppercase tracking-wider hover:bg-[#F3EDDF] transition-colors shadow-sm"
                href="https://wa.me/390314487120"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined notranslate text-[16px] text-[#336859]">chat</span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Orari di Apertura & Atmosfera Dock 71 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-20">
        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-[#E8E2D4] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Schedule Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[32px]">schedule</span>
              <div>
                <span className="font-marker text-[11px] uppercase tracking-widest text-[#7A7265] font-bold">
                  Dock Time Table
                </span>
                <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                  Orari di Servizio Cucina &amp; Birreria
                </h2>
              </div>
            </div>
            <p className="font-work text-sm sm:text-base text-[#554245]">
              Dalla pausa pranzo di qualità per professionisti e artigiani fino alla birra di chiusura notte con lo sport dal vivo. La cucina rimane operativa fino a tardi.
            </p>

            {/* Hours List Cards */}
            <div className="flex flex-col gap-3">
              {/* Mon - Fri */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EDDF] transition-colors gap-3 border border-[#E8E2D4]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-dock-burgundy"></span>
                  <div className="flex flex-col">
                    <span className="font-chunky text-lg text-[#1D1C13]">Lunedì – Venerdì</span>
                    <span className="font-work text-xs text-[#7A7265]">Pranzo di lavoro &amp; Serate Pub</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="font-epilogue text-xs text-dock-burgundy font-bold">12:00 – 14:30</span>
                    <span className="font-epilogue text-xs text-[#1D1C13] font-bold">18:30 – 01:00</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#E0A93B]/20 border border-[#E0A93B]/40 text-[#8F6615] font-marker text-[10px] uppercase tracking-wider font-bold">
                    Cucina Attiva
                  </span>
                </div>
              </div>

              {/* Sat - Sun */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EDDF] transition-colors gap-3 border border-[#E8E2D4]">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-dock-burgundy"></span>
                  <div className="flex flex-col">
                    <span className="font-chunky text-lg text-[#1D1C13]">Sabato &amp; Domenica</span>
                    <span className="font-work text-xs text-[#7A7265]">Live Sport, Cene tra amici, Dopocena</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col">
                    <span className="font-epilogue text-xs text-dock-burgundy font-bold">18:30 – 02:00</span>
                    <span className="font-work text-xs text-[#7A7265]">Match &amp; Pinte</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-dock-burgundy/10 border border-dock-burgundy/20 text-dock-burgundy font-marker text-[10px] uppercase tracking-wider font-bold">
                    Late Night
                  </span>
                </div>
              </div>

              {/* Festivi */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-[#FAF7F2] gap-3 border border-[#E8E2D4]">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined notranslate text-[#336859] text-[22px]">event_available</span>
                  <div className="flex flex-col">
                    <span className="font-chunky text-lg text-[#1D1C13]">Giorni Festivi &amp; Turni Campionato</span>
                    <span className="font-work text-xs text-[#7A7265]">Champions League, Serie A, Formula 1</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-epilogue text-xs text-[#1D1C13] font-bold">Sempre Aperti su Prenotazione</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Feature Visual & Atmosphere */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-sm border border-[#E8E2D4]">
              <img
                className="w-full h-full object-cover"
                alt="Ambiente accogliente di Dock 71 a Cantù"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA59VnQsyNkrXy2ULVyfj0GCz5ACX26RK3rOoNPdX8n2mCaNGz01jnh9zGkWCe4nbkPff68aicyTJ3tET6VRWIMhbySmKZ7e1TaRaSrQa4f_0YbqT8ge6s4lFzKzudwLqd4MY2rJ0aVWMXT6Szw0wWKXqeu5rO1lhpyibna_je9F1EnYCXmt_O1H9aL9K59BqjyipMdXVw0zAhFUqfX5bYAmd32q6-a-HUN9tA8J2S4aFqVme_onl_dxg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="font-marker text-[11px] uppercase tracking-widest text-dock-mustard">
                  Cantù Wharf Pub
                </span>
                <span className="font-chunky text-xl sm:text-2xl">Birre alla Spina &amp; Tavoli Conviviali</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[24px]">wifi</span>
                <div className="flex flex-col">
                  <span className="font-marker text-[11px] uppercase text-[#7A7265] font-bold">
                    Wi-Fi Veloce &amp; Prese Tavolo
                  </span>
                  <span className="font-work text-xs text-[#1D1C13]">Disponibile gratuitamente per tutti i clienti</span>
                </div>
              </div>
              <span className="font-mono-tech text-xs px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D4] text-[#1D1C13] font-bold">
                Free Guest
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Mappa & Percorsi */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-marker text-[11px] uppercase tracking-widest text-dock-burgundy font-bold">
              Come Raggiungerci
            </span>
            <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13] mt-1">
              Mappa Stradale &amp; Navigatori
            </h2>
            <p className="font-work text-sm text-[#554245] max-w-xl mt-1">
              Posizione comoda sia per chi arriva in auto dalle tangenziali di Como e Milano, sia per chi passeggia dal centro di Cantù.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark font-chunky text-xs uppercase tracking-wider transition-all shadow-sm"
              href="https://maps.google.com/?q=Via+Milano+71,+22063+Cantu+CO"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">map</span>
              Apri su Google Maps
            </a>
            <a
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#1D1C13] hover:bg-[#F3EDDF] border border-[#E8E2D4] font-chunky text-xs uppercase tracking-wider transition-all shadow-sm"
              href="https://maps.apple.com/?address=Via+Milano+71,+Cantù,+Italy"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">navigation</span>
              Avvia Waze / Apple Maps
            </a>
          </div>
        </div>

        {/* Map Container with Route Cards */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-sm bg-white border border-[#E8E2D4]">
          <div className="w-full h-80 sm:h-96 lg:h-[420px] bg-[#EBE5DB] relative flex items-center justify-center overflow-hidden">
            <iframe
              title="Mappa Dock 71 Cantu"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2787.6180373033144!2d9.124672!3d45.742361!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47869715104a8b79%3A0x7d6f5f9227c1f80!2sVia%20Milano%2C%2071%2C%2022063%20Cant%C3%B9%20CO!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit"
              className="w-full h-full border-0 filter contrast-[0.95] opacity-90"
              loading="lazy"
            ></iframe>

            {/* Floating Pin Card Overlay */}
            <div className="absolute top-6 left-6 z-10 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-[#E8E2D4] max-w-xs hidden sm:flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-dock-burgundy text-white flex items-center justify-center font-chunky text-sm shadow">
                  71
                </div>
                <div>
                  <h3 className="font-chunky text-base text-[#1D1C13]">Dock 71 Cantù</h3>
                  <span className="font-work text-xs text-[#7A7265]">Risto-Pub, Birreria &amp; Sport</span>
                </div>
              </div>
              <p className="font-work text-xs text-[#554245]">
                Via Milano 71, Cantù. Parcheggio clienti visibile all'arrivo direttamente davanti al molo.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[#336859] font-epilogue text-xs font-bold border-t border-[#E8E2D4]">
                <span className="material-symbols-outlined notranslate text-[18px]">check_circle</span>
                Ampio Parcheggio Gratuito
              </div>
            </div>
          </div>

          {/* Quick Route Indications Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E2D4] bg-[#FAF7F2]">
            <div className="p-4 flex items-center gap-3">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[22px]">near_me</span>
              <div>
                <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Da Como Città</span>
                <p className="font-epilogue text-xs text-[#1D1C13] font-bold">~ 18 minuti via SP34 / Canturina</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[22px]">directions</span>
              <div>
                <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Da Mariano Comense</span>
                <p className="font-epilogue text-xs text-[#1D1C13] font-bold">~ 10 minuti via SP32</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[22px]">commute</span>
              <div>
                <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Da Erba / Laghi</span>
                <p className="font-epilogue text-xs text-[#1D1C13] font-bold">~ 15 minuti via SP40</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split Contact Form & Direct Inquiries */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Box */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-[#E8E2D4] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8E2D4] text-dock-burgundy font-marker text-[10px] uppercase tracking-wider font-bold mb-3">
                Modulo Contatto Diretto
              </div>
              <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">Scrivi a Dock 71</h2>
              <p className="font-work text-sm text-[#554245] mt-1 mb-8">
                Hai richieste per menu speciali, intolleranze, preventivi per compleanni, cene aziendali o eventi sportivi privati? Rispondiamo entro poche ore.
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-[#FAF7F2] border-2 border-emerald-500/40 text-[#1D1C13] space-y-3">
                  <div className="flex items-center gap-2 text-[#336859] font-chunky text-lg">
                    <span className="material-symbols-outlined notranslate text-2xl">task_alt</span>
                    Messaggio Ricevuto con Successo!
                  </div>
                  <p className="font-work text-sm text-[#554245]">
                    Grazie <strong>{formData.name}</strong>! Il nostro staff ti risponderà al più presto. Per urgenze immediate o conferme veloci per stasera, puoi chiamarci direttamente o usare WhatsApp.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href="tel:0314487120"
                      className="px-4 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase"
                    >
                      Chiama: 031 4487120
                    </a>
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="px-4 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-chunky text-xs uppercase"
                    >
                      Apri su WhatsApp
                    </button>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2 rounded-xl text-[#7A7265] text-xs underline font-work"
                    >
                      Invia un altro messaggio
                    </button>
                  </div>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-marker text-[10px] uppercase tracking-wider text-[#1D1C13] font-bold">
                        Nome &amp; Cognome *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-all"
                        placeholder="Es. Marco Rossi"
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-marker text-[10px] uppercase tracking-wider text-[#1D1C13] font-bold">
                        Telefono / WhatsApp *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-all"
                        placeholder="Es. 333 1234567"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-marker text-[10px] uppercase tracking-wider text-[#1D1C13] font-bold">
                        Email *
                      </label>
                      <input
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-all"
                        placeholder="iltuonome@email.it"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-marker text-[10px] uppercase tracking-wider text-[#1D1C13] font-bold">
                        Motivo Richiesta
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-all"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      >
                        <option value="info">Informazioni Generali</option>
                        <option value="festa">Festa Privata / Compleanno / Laurea</option>
                        <option value="aziendale">Cena Aziendale / Gruppo Grande</option>
                        <option value="allergie">Allergie / Dieta Senza Glutine</option>
                        <option value="partite">Tavolo Dedicato Maxischermo Sport</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-marker text-[10px] uppercase tracking-wider text-[#1D1C13] font-bold">
                      Messaggio o Note Particolari *
                    </label>
                    <textarea
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] font-work text-sm focus:bg-white focus:border-dock-burgundy focus:outline-none transition-all"
                      placeholder="Descrivi le tue esigenze, data ipotetica, numero persone o curiosità..."
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      className="w-4 h-4 rounded text-dock-burgundy focus:ring-dock-burgundy border-[#E8E2D4]"
                      id="privacy-check"
                      required
                      type="checkbox"
                      checked={formData.privacy}
                      onChange={(e) => setFormData({ ...formData, privacy: e.target.checked })}
                    />
                    <label className="font-work text-xs text-[#554245]" htmlFor="privacy-check">
                      Acconsento al trattamento dei dati personali per ricevere la risposta in merito alla presente richiesta.
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark font-chunky text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      <span className="material-symbols-outlined notranslate text-[18px]">send</span>
                      {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsAppInquiry}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-[#1D1C13] hover:bg-[#F3EDDF] font-chunky text-xs uppercase tracking-wider transition-all"
                    >
                      <span className="material-symbols-outlined notranslate text-[18px] text-[#336859]">chat</span>
                      Oppure Scrivici su WhatsApp
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Contact Complement Card */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            {/* Private Events Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D4] flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#336859]/10 flex items-center justify-center text-[#336859]">
                <span className="material-symbols-outlined notranslate text-[24px]">celebration</span>
              </div>
              <div>
                <h3 className="font-chunky text-xl text-[#1D1C13]">Feste Private &amp; Tavolate Gruppi</h3>
                <p className="font-work text-sm text-[#554245] mt-1">
                  Compleanni, lauree, ritrovi sportivi e cene tra colleghi. Prepariamo menù concordati con giro-pizza, burger gourmet, taglieri sfiziosi e spine a fiumi.
                </p>
              </div>
              <ul className="flex flex-col gap-2.5 font-work text-xs text-[#1D1C13]">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">done</span>
                  Spazi riservati e tavoli vicini agli schermi
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">done</span>
                  Pacchetti bevande e birre alla spina concordate
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">done</span>
                  Possibilità torta e personalizzazione serata
                </li>
              </ul>
              <button
                onClick={onOpenBooking}
                className="mt-2 w-full py-2.5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase tracking-wider hover:bg-dock-burgundy-dark transition-all shadow"
              >
                Prenota Spazio per Gruppo
              </button>
            </div>

            {/* Direct Social & Instant Chat Box */}
            <div className="bg-[#F3EDDF] rounded-3xl p-8 shadow-sm border border-[#E8E2D4] flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[28px]">forum</span>
                <div>
                  <span className="font-marker text-[10px] uppercase tracking-wider text-[#7A7265] font-bold">
                    Risposta Istantanea
                  </span>
                  <h3 className="font-chunky text-xl text-[#1D1C13]">Canale WhatsApp Diretto</h3>
                </div>
              </div>
              <p className="font-work text-xs text-[#554245]">
                Hai bisogno di una conferma rapida per un tavolo questa sera? Clicca il pulsante e scrivi direttamente allo staff di sala.
              </p>
              <a
                className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase tracking-wider hover:bg-dock-burgundy-dark transition-all shadow"
                href="https://wa.me/390314487120"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined notranslate text-[20px] text-dock-mustard">chat</span>
                Chatta con Dock 71 su WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section (Domande Frequenti) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 w-full mb-20">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="font-marker text-[11px] uppercase tracking-widest text-dock-burgundy font-bold">
            Dubbi Comuni Risolti
          </span>
          <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13] mt-1">
            Domande Frequenti (FAQ)
          </h2>
          <p className="font-work text-sm text-[#554245] mt-2">
            Tutto ciò che è utile sapere prima di varcare la soglia del molo di Via Milano 71.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* FAQ Item 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D4]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-dock-burgundy/10 flex items-center justify-center text-dock-burgundy shrink-0 mt-0.5 font-chunky text-sm">
                ?
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-chunky text-lg text-[#1D1C13]">Serve prenotare per venire da Dock 71?</h3>
                <p className="font-work text-sm text-[#554245] leading-relaxed">
                  La prenotazione è <strong>vivamente consigliata</strong> il venerdì, il sabato sera e durante le grandi sfide di calcio e basket trasmesse in diretta. Tuttavia, accogliamo con piacere anche chi passa senza avviso al banco o per una birra veloce con patatine!
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D4]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#336859]/10 flex items-center justify-center text-[#336859] shrink-0 mt-0.5 font-chunky text-sm">
                ?
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-chunky text-lg text-[#1D1C13]">Avete opzioni senza glutine, vegetariane o vegane?</h3>
                <p className="font-work text-sm text-[#554245] leading-relaxed">
                  Assolutamente sì. Abbiamo selezioni di burger vegetariani saporiti, pizze a lunga lievitazione personalizzabili, birre artigianali gluten-free certificate in bottiglia e opzioni dedicate per celiaci. Segnalacelo al momento dell'ordine per la massima cura della cucina.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Item 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D4]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-dock-burgundy/10 flex items-center justify-center text-dock-burgundy shrink-0 mt-0.5 font-chunky text-sm">
                ?
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-chunky text-lg text-[#1D1C13]">I cani e gli animali domestici sono ammessi?</h3>
                <p className="font-work text-sm text-[#554245] leading-relaxed">
                  Certamente! Gli amici a 4 zampe sono benvenuti sia nelle nostre sale interne che nella veranda coperta. Abbiamo sempre a disposizione una ciotola d'acqua fresca per loro: basta chiedere ai ragazzi al bancone.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Item 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E2D4]">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[#336859]/10 flex items-center justify-center text-[#336859] shrink-0 mt-0.5 font-chunky text-sm">
                ?
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-chunky text-lg text-[#1D1C13]">È possibile vedere la Serie A o la Champions League?</h3>
                <p className="font-work text-sm text-[#554245] leading-relaxed">
                  Siamo la casa del live sport a Cantù. Tutte le principali partite di Serie A, Champions League, Formula 1, MotoGP e basket Cantù vengono trasmesse sui nostri maxischermi ad alta definizione con audio in sala. Consigliamo di prenotare indicando la preferenza per il match.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Callout Section */}
      <section className="w-full bg-dock-burgundy text-white py-16 px-6 lg:px-12 relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute left-10 -top-10 w-64 h-64 rounded-full bg-black/15 blur-xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col gap-3 text-center md:text-left">
            <span className="font-marker text-[11px] uppercase tracking-widest text-dock-mustard font-bold">
              Sempre Pronte le Spine e la Cucina
            </span>
            <h2 className="font-chunky text-3xl sm:text-4xl text-white">
              Hai già fame o sete?
            </h2>
            <p className="font-work text-base text-dock-cream/90 max-w-lg">
              Prenota subito il tuo tavolo a Cantù. Ci vogliono meno di 60 secondi e il tuo posto al pub è assicurato.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white text-dock-burgundy hover:bg-dock-cream font-chunky text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined notranslate text-[22px]">restaurant</span>
              Prenota Tavolo Online
            </button>
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-dock-burgundy-dark hover:bg-black/30 border border-white/20 text-white font-chunky text-xs uppercase tracking-wider transition-colors"
              href="tel:0314487120"
            >
              <span className="material-symbols-outlined notranslate text-[18px]">call</span>
              031 4487120
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
