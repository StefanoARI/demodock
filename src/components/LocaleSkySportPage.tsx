import React from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface LocaleSkySportPageProps {
  onOpenBooking: () => void;
}

export const LocaleSkySportPage: React.FC<LocaleSkySportPageProps> = ({ onOpenBooking }) => {
  const { matches } = useSiteData();
  const activeMatches = matches.filter(m => m.isActive !== false);

  return (
    <div className="w-full bg-[#FAF7F2] font-work text-[#1D1C13]">
      {/* SECTION 1: EDITORIAL HEADER */}
      <section className="relative w-full pt-12 pb-16 px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col items-start gap-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE9DF] border border-[#DFD5C6] text-[#78350F] text-xs font-mono-tech uppercase tracking-widest shadow-sm font-bold">
            <span className="material-symbols-outlined notranslate text-dock-burgundy text-[16px]">sailing</span>
            <span>Thames Riverfront Heritage • Architettura &amp; Passione</span>
          </div>

          <h1 className="font-chunky text-3xl sm:text-4xl lg:text-5xl text-[#1D1C13] tracking-tight leading-tight uppercase">
            Il Locale &amp; <span className="text-dock-burgundy">Sky Sport Live</span>
          </h1>

          <p className="font-work text-base sm:text-lg text-[#554245] max-w-3xl leading-relaxed">
            Dalle banchine commerciali del Tamigi alle strade di Cantù: come nasce l'identità del Dock 71 e perché è diventato il rifugio elettrico per intenditori di birra artigianale e amanti viscerali del grande sport sul grande schermo.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-3 font-epilogue text-xs uppercase tracking-wider text-[#554245]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-dock-burgundy"></span>
              <span className="text-[#1D1C13] font-bold">170 Coperti Attrezzati</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#336859]"></span>
              <span className="text-[#1D1C13] font-bold">6 Schermi Ultra HD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E0A93B]"></span>
              <span className="text-[#1D1C13] font-bold">Soundstage Acustico Dedicato</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GLI AMBIENTI & ARCHITETTURA NAVALE */}
      <section className="w-full py-16 px-6 lg:px-12 bg-[#F3EDDF] border-y border-[#E8E2D4]">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-marker text-[11px] uppercase tracking-widest text-dock-burgundy font-bold block mb-1">
                Architettura &amp; Layout
              </span>
              <h2 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                Gli Ambienti Navali
              </h2>
            </div>
            <p className="font-work text-sm sm:text-base text-[#554245] max-w-md">
              Un recupero industriale meticoloso: mattoni a vista, nodi di cordame marino, travi in ferro chiodate e l'autentica atmosfera dei vecchi magazzini marittimi britannici.
            </p>
          </div>

          {/* Bento Grid Ambienti */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Main Feature: La Sala Gru (7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-[#E8E2D4] justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#DFD5C6] text-[#78350F] font-mono-tech text-xs uppercase tracking-wider font-bold">
                    Spazio Principale • 100 Coperti
                  </span>
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[28px]">precision_manufacturing</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-chunky text-2xl text-[#1D1C13]">La Sala Gru</h3>
                  <p className="font-work text-sm text-[#554245] leading-relaxed">
                    Il cuore pulsante del Dock 71. Al centro troneggia una monumentale gru navale d'epoca riadattata, circondata da pareti in mattoni d'argilla cotta, archi a sesto ribassato e massicce capriate in ferro rivettate a mano. Qui ogni tavolo ha una prospettiva sgombra sui display centrali per i match clou.
                  </p>
                </div>

                {/* Image Asset for Sala Gru */}
                <div className="relative w-full h-72 rounded-2xl overflow-hidden mt-2 bg-[#EBE5DB] border border-[#E8E2D4]">
                  <img
                    className="w-full h-full object-cover"
                    alt="Sala Gru con la storica gru navale di Dock 71 a Cantù"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDifMM2_bhGsST2K9g2OxXzfru67BVtG1AprdrfzFsIjPb26rG9g4cx_ghnFYIu8PRyjTuo_fgOyFJ4PY13KawJWJOWxAbtdfzNAfLoroWb6bdgPdszZwbfOEaWhl8wRi30Q7hRth1pCVIm6wuHKRnMBt9Y2mP-Ajew7fFx3bNRO2Da-aGqxbhDjV-VeklDxir3UVA1iplgIk9sHqE18gjwwj7KvyQSMNODy0PMCOk5mohF3AAz0auiGg"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-xl text-xs font-mono-tech text-[#1D1C13] font-bold shadow-sm border border-[#E8E2D4]">
                    Focus Architettonico: Gru Centrale &amp; Capriate
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E2D4]">
                <div className="flex flex-col">
                  <span className="font-chunky text-2xl text-dock-burgundy">100</span>
                  <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Posti a sedere</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-chunky text-2xl text-[#1D1C13]">360°</span>
                  <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Visibilità schermi</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-chunky text-2xl text-[#336859]">1912</span>
                  <span className="font-marker text-[10px] text-[#7A7265] uppercase font-bold">Ispirazione cantiere</span>
                </div>
              </div>
            </div>

            {/* Right Stack: Il Grande Bancone & La Terrazza Estiva (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
              {/* Il Grande Bancone */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D4] flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#DFD5C6] text-[#78350F] font-mono-tech text-xs uppercase font-bold">
                      30 Sedute Al Banco
                    </span>
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[24px]">sports_bar</span>
                  </div>
                  <h3 className="font-chunky text-xl text-[#1D1C13]">Il Grande Bancone &amp; Spine</h3>
                  <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
                    Una campata di oltre 12 metri in rovere massello curvato e piastre di rame spazzolato. Ospita le 14 vie di spillatura artigianale a vista con manometri nautici in ottone, ideali per una pinta rapida godendosi le qualifiche motorsport o il post-partita in piedi.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E8E2D4] flex items-center justify-between text-xs font-work text-[#7A7265]">
                  <span className="inline-flex items-center gap-1.5 text-dock-burgundy font-bold">
                    <span className="material-symbols-outlined notranslate text-[16px]">check_circle</span> 14 Spine Artigianali
                  </span>
                  <span className="font-medium text-[#1D1C13]">Sedute Alte in Cuoio</span>
                </div>
              </div>

              {/* La Terrazza Estiva */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E8E2D4] flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#DFD5C6] text-[#336859] font-mono-tech text-xs uppercase font-bold">
                      40 Posti All'Aperto
                    </span>
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[24px]">deck</span>
                  </div>
                  <h3 className="font-chunky text-xl text-[#1D1C13]">La Terrazza Estiva</h3>
                  <p className="font-work text-xs sm:text-sm text-[#554245] leading-relaxed">
                    Area esterna ventilata e protetta da pergolato in legno chiaro con nebulizzatori per le calde sere estive lombarde. Schermo esterno dedicato per non perdere nemmeno una gara di Formula 1 o le notti di coppa sotto le stelle.
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E8E2D4] flex items-center justify-between text-xs font-work text-[#7A7265]">
                  <span className="inline-flex items-center gap-1.5 text-[#336859] font-bold">
                    <span className="material-symbols-outlined notranslate text-[16px]">ac_unit</span> Climatizzata &amp; Ventilata
                  </span>
                  <span className="font-medium text-[#1D1C13]">Stagione Primavera-Autunno</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HUB SKY SPORT BUSINESS HD */}
      <section className="w-full py-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-dock-burgundy font-mono-tech text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined notranslate text-[18px]">live_tv</span>
              <span>Tecnologia Ufficiale Sky Sport Business HD</span>
            </div>
            <h2 className="font-chunky text-2xl sm:text-3xl lg:text-4xl text-[#1D1C13] leading-tight">
              Nessun Angolo Cieco, Solo Pura Emozione Live
            </h2>
            <p className="font-work text-sm sm:text-base text-[#554245] leading-relaxed">
              Dock 71 è certificato Sky Sport Business: trasmissioni legali a risoluzione massima garantita, priva di lag e con diritti di trasmissione per tutte le principali competizioni mondiali. La nostra architettura interna è stata studiata per fare in modo che ovunque tu sia seduto, la traiettoria verso uno schermo rimanga perfettamente libera.
            </p>

            {/* Technical Badges Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E8E2D4] flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-dock-burgundy">
                  <span className="material-symbols-outlined notranslate text-[20px]">fullscreen</span>
                  <span className="font-chunky text-lg text-[#1D1C13]">6 Display LED 4K</span>
                </div>
                <p className="font-work text-xs text-[#554245]">
                  Pannelli anti-riflesso calibrati per ambienti luminosi da banchina.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E8E2D4] flex flex-col gap-1.5 shadow-sm">
                <div className="flex items-center gap-2 text-dock-burgundy">
                  <span className="material-symbols-outlined notranslate text-[20px]">surround_sound</span>
                  <span className="font-chunky text-lg text-[#1D1C13]">Sound Zone</span>
                </div>
                <p className="font-work text-xs text-[#554245]">
                  Acustica controllata: chiarezza vocale telecronaca e vibrazioni da stadio.
                </p>
              </div>
            </div>
          </div>

          {/* High Impact Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D4] flex flex-col gap-4">
              <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#EBE5DB]">
                <img
                  className="w-full h-full object-cover"
                  alt="Tifosi e atmosfera live match a Dock 71 Cantù"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyy1KIifygbdZBfYAWdQpPY3XYbm0jOCwMRupCn2OH5iURhOU0HRxbVSYubYviqW34pYBNrCQ7XYx4kV_jcFZn7sNVCRaC28O-b_3xfG_-pLsMxL9eW9QcaqKtpXQdu582RN_iShQCCH5Vxxqq_yExrIa1zhM1WlRf8ECDOiHXl09GgEMItoV1cMhCHNThorpnLQux71af6JEfrLbzMJY7uzvmZfmD8UKyR3CT7ffpC3dAsPHjut99iA"
                />
                <div className="absolute top-4 right-4 bg-dock-burgundy text-white px-3 py-1.5 rounded-xl font-mono-tech text-xs font-bold uppercase tracking-widest shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-dock-mustard animate-pulse"></span>
                  Live Broadcast
                </div>
              </div>
              <div className="flex items-center justify-between px-2 pt-1">
                <div className="flex flex-col">
                  <span className="font-chunky text-base text-[#1D1C13]">Licenza Sky Business Ufficiale</span>
                  <span className="font-work text-xs text-[#554245]">
                    Serie A • Champions League • Premier League • F1 • MotoGP • Sei Nazioni
                  </span>
                </div>
                <span className="material-symbols-outlined notranslate text-[#336859] text-[32px]">verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDARIO SETTIMANALE LIVE */}
        <div className="flex flex-col gap-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-marker text-[11px] uppercase tracking-widest text-dock-burgundy font-bold block mb-1">
                Palinsesto Ufficiale
              </span>
              <h3 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
                Questa Settimana al Dock
              </h3>
            </div>
            <div className="flex items-center gap-2 font-work text-xs text-[#554245]">
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[18px]">calendar_today</span>
              <span>Aggiornato settimanalmente dal nostro Mastro Birraio</span>
            </div>
          </div>

          {/* Match Cards Grid */}
          {activeMatches.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-[#E8E2D4] space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EA] text-dock-burgundy mx-auto flex items-center justify-center border border-[#E8E2D4]">
                <span className="material-symbols-outlined notranslate text-3xl">sports</span>
              </div>
              <div>
                <span className="font-marker text-xs text-dock-burgundy uppercase font-bold">AGGIORNAMENTO PALINSESTO</span>
                <h4 className="font-chunky text-xl text-[#1D1C13] mt-1">Non ci sono eventi in programma per ora</h4>
                <p className="font-work text-xs sm:text-sm text-[#554245] max-w-md mx-auto mt-2 leading-relaxed">
                  Stiamo aggiornando le dirette Sky Sport per i prossimi turni di campionato e coppa. Torna a trovarci presto o chiedi direttamente al banco le prossime trasmissioni live!
                </p>
              </div>
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark transition-all"
              >
                <span className="material-symbols-outlined notranslate text-[16px]">table_restaurant</span>
                Prenota Comunque un Tavolo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeMatches.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-[#E8E2D4] flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider bg-dock-burgundy text-white font-bold">
                        {m.date} • {m.time}
                      </span>
                      <span className="font-work text-[11px] text-[#7A7265] uppercase font-bold">
                        {m.competition}
                      </span>
                    </div>
                    <div className="py-2">
                      <div className="font-chunky text-lg text-[#1D1C13]">{m.match}</div>
                      {(m.description || m.screen) && (
                        <div className="font-work text-xs text-dock-burgundy font-semibold mt-1">
                          {m.description || m.screen}
                        </div>
                      )}
                    </div>
                    <p className="font-work text-xs text-[#554245]">
                      Abbinamento consigliato: <strong className="text-dock-burgundy">{m.beerRecommendation || 'Pilsner Artigianale'}</strong>
                    </p>
                  </div>
                  <div className="mt-6 pt-4 bg-[#FAF7F2] rounded-xl px-3 py-2 flex items-center justify-between text-xs text-[#1D1C13] border border-[#E8E2D4]">
                    <span className="font-bold text-dock-burgundy">
                      {m.availableTables ? `Tavoli: ${m.availableTables}` : 'Accesso Libero'}
                    </span>
                    <button
                      onClick={onOpenBooking}
                      className="text-dock-burgundy font-marker text-xs hover:underline flex items-center gap-1 font-bold"
                    >
                      Prenota →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEZIONE TERZO TEMPO AL DOCK */}
        <div className="bg-[#F3EDDF] rounded-3xl p-8 lg:p-12 shadow-sm border border-[#E8E2D4] flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 text-dock-burgundy font-mono-tech text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined notranslate text-[20px]">celebration</span>
              <span>Tradizione d'Oltremanica</span>
            </div>
            <h3 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
              Il Terzo Tempo al Dock 71
            </h3>
            <p className="font-work text-sm sm:text-base text-[#554245] leading-relaxed">
              Che la tua squadra abbia vinto all'ultimo respiro o incassato una dura sconfitta, il rito non cambia mai. Al fischio finale si abbassano le telecronache, si alza la musica rock &amp; acoustic del Dock e ha inizio il Terzo Tempo. Boccali carichi, padelloni di nachos fumanti con formaggio fuso d'alpeggio, jalapeños marinati e anelli di cipolla dorati.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-[22px]">restaurant</span>
                <span className="font-epilogue text-xs text-[#1D1C13] font-bold">Cucina Calda fino alle 00:30</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined notranslate text-[#336859] text-[22px]">local_cafe</span>
                <span className="font-epilogue text-xs text-[#1D1C13] font-bold">Digestivi Artigianali</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-sm h-64 lg:h-72 bg-[#EBE5DB] border border-[#E8E2D4]">
              <img
                className="w-full h-full object-cover"
                alt="Nachos del Pontile e birre artigianali a Dock 71 Cantù"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs1tAWX6ZSFaUqyi1a-3ReF1AMQGlvCYmFwZLLN2txUNE13mz6n2eBnVh1XkBbt7DDgLQd_b5EISiIi5bDwsES9Ne3rmCWWZxjpt54cu6vOpG-vtGQPwxw0Odt3Muqu9hxgWMEB4XxcXiTrNn_ntfFkPsre_g-QZNGlDRkxXgXM4U8nXv2TTvwrK4H7iR7nl1ZsbwTe110qG7WWeQAnQbVAZznn9UVOmsk-7bcbBkXYA9c5e8hf3Z3Aw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                <p className="text-white font-work text-xs sm:text-sm">
                  Il Piatto Iconico: "Nachos del Pontile" con salsa calda al cheddar e pulled pork nostrano.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CALL TO ACTION BOX */}
      <section className="w-full py-16 px-6 lg:px-12 bg-white border-t border-[#E8E2D4]">
        <div className="max-w-5xl mx-auto bg-[#FAF7F2] rounded-3xl p-8 lg:p-12 shadow-sm border border-[#E8E2D4] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <div className="inline-flex items-center gap-2 text-dock-burgundy font-mono-tech text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined notranslate text-[18px]">event_seat</span>
              <span>Zero Code, Vista Ottimale Garantita</span>
            </div>
            <h3 className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">
              Blocca il Tuo Tavolo per il Match
            </h3>
            <p className="font-work text-sm text-[#554245] leading-relaxed">
              Nelle serate di Champions League, derby e grandi sfide la capienza si esaurisce in fretta. Prenota online in pochi click o mandaci un messaggio diretto su WhatsApp specificando che desideri la vista schermo.
            </p>
            <div className="flex items-center gap-2 pt-1 font-work text-xs text-[#336859] font-bold">
              <span className="material-symbols-outlined notranslate text-[16px]">local_parking</span>
              <span>Parcheggio privato gratuito antistante il locale a Cantù</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto flex-shrink-0">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-dock-burgundy text-white hover:bg-dock-burgundy-dark font-chunky text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 text-center"
            >
              <span className="material-symbols-outlined notranslate text-[20px]">sports_soccer</span>
              Prenota per la Partita
            </button>
            <a
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#1D1C13] border border-[#E8E2D4] hover:bg-[#F3EDDF] font-chunky text-xs uppercase tracking-wider shadow-sm transition-all text-center"
              href="https://wa.me/390314487120?text=Vorrei%20prenotare%20un%20tavolo%20per%20la%20partita%20al%20Dock%2071"
              target="_blank"
              rel="noreferrer"
            >
              <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">chat</span>
              WhatsApp 031 4487120
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
