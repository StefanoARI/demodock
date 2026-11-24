import React, { useState } from 'react';
import { PUB_IMAGES } from '../data/pubData';
import { useSiteData } from '../context/SiteDataContext';

interface ComingSoonPageProps {
  onOpenBookingModal: () => void;
  onOpenAdmin: () => void;
  onShowToast: (msg: string) => void;
}

const KITCHEN_PDF_URL = '/assets/aistudio/Dock71_-_menu_per_sito_7172863f.pdf';
const BEVERAGE_PDF_URL = '/assets/aistudio/RB_Menu_DOCK71_copia_8d78ba02.pdf';

const KITCHEN_STUZZICHERIE = [
  { name: 'PATATE DEL MOZZO', price: '€ 4,50', desc: 'patate fritte a buccia spessa' },
  { name: 'CROCCHETTE DI PATATE', price: '€ 5,00', desc: '' },
  { name: 'ANELLI DI CIPOLLA', price: '€ 7,00', desc: 'in pastella alla birra IPA, croccanti e dorati, serviti con salsa tartara' },
  { name: 'BASKET DI FRITTINI', price: '€ 10,00', desc: 'nuggets di pollo (4pz), crocchette di patate (4 pz), anelli di cipolla (4pz)' },
  { name: 'POLPETTE DI PULLED PORK SFILACCIATO', price: '€ 7,00', desc: 'cotte a bassa temperatura con cuore fondente di scamorza affumicata (6pz)' },
  { name: 'NACHOS SEMPLICI', price: '€ 7,00', desc: 'con cheddar fuso, salsa messicana' },
  { name: 'NACHOS FARCITI', price: '€ 10,00', desc: 'con salsa messicana, guacamole, jalapeno, cheddar fuso, pulled pork' },
  { name: 'RED HOT JALAPENOS', price: '€ 8,00', desc: 'peperoni rossi fritti ripieni di formaggio (4pz)' },
  { name: 'TAGLIERE DEL PORTO', price: '€ 15,00', desc: 'prosciutto crudo, salame filzetta, coppa, gnocco fritto' },
];

const KITCHEN_GRIGLIA = [
  { name: 'TAGLIATA DI MANZO', price: '€ 18,00', desc: '250g con rucola, pomodorini' },
  { name: 'GALLETTO DEI DOCKS', price: '€ 18,00', desc: 'marinato alla birra e pepe rosa servito con patate del mozzo' },
  { name: 'COSTATA DI MANZO', price: '€ 36,00', desc: '500g servita con verdure alla griglia' },
  { name: 'RIBS DI MAIALE', price: '€ 19,00', desc: 'cotte a bassa temperatura con salsa BBQ, crauti' },
  { name: 'GRAN GRIGLIATA', price: '€ 25,00', desc: 'Tagliata di manzo, alette di pollo, arrosticini, salsiccia arrotolata, servita con verdure grigliate, patate del mozzo' },
  { name: 'ARROSTICINI', price: '€ 15,00', desc: 'in brocca | 10 pz' },
  { name: 'ARROSTICINI AL PEZZO', price: '€ 1,80', desc: '' },
];

const KITCHEN_TARTARE = [
  {
    name: 'TARTARE DEL PRIMO UFFICIALE',
    price: '€ 12,00',
    desc: "battuta di manzo condita con frutto del cappero, trito di acciughe, senape in grani, tuorlo d'uovo cbt",
  },
  {
    name: 'TARTARE DI STIVA',
    price: '€ 14,00',
    desc: 'battuta di manzo, gorgonzola, noci, funghi trifolati',
  },
  {
    name: 'NAVE AMMIRAGLIA',
    price: '€ 12,00',
    desc: 'battuta di manzo servita su letto di stracciatella di bufala con olio al basilico, pesto di pomodori secchi, cialda al Parmigiano',
  },
];

const KITCHEN_PIZZE_CLASSICHE = [
  { name: 'MARGHERITA', price: '€ 7,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, basilico' },
  { name: 'AMERICANA', price: '€ 9,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, wurstel, patatine' },
  { name: 'MARINARA', price: '€ 7,00', desc: 'pomodoro Frulloro, origano, aglio' },
  { name: 'QUATTRO STAGIONI', price: '€ 12,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, prosciutto cotto, salame piccante, funghi, olive' },
  { name: 'QUATTRO FORMAGGI', price: '€ 11,00', desc: 'mozzarella fior di latte, gorgonzola, taleggio, scamorza affumicata' },
  { name: 'CAPRICCIOSA', price: '€ 11,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, prosciutto cotto, funghi, carciofi, olive' },
  { name: 'ORTOLANA', price: '€ 10,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, verdure di stagione' },
  { name: 'BUFALINA', price: '€ 13,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, bocconi di bufala fresca, basilico' },
  { name: 'NAPOLI', price: '€ 12,50', desc: 'pomodoro Frulloro, mozzarella fior di latte, origano, acciughe' },
  { name: 'PROSCIUTTO', price: '€ 10,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, prosciutto cotto' },
  { name: 'DIAVOLA', price: '€ 9,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, spianata calabra' },
  { name: 'PROSCIUTTO E FUNGHI', price: '€ 11,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, prosciutto cotto, funghi' },
  { name: 'SIMPATICA', price: '€ 11,50', desc: 'mozzarella fior di latte, panna, prosciutto cotto, funghi' },
  { name: 'SPECK E ZOLA', price: '€ 13,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, speck, gorgonzola' },
  { name: 'SALSICCIA E FRIARIELLI', price: '€ 12,00', desc: 'mozzarella fior di latte, salsiccia, friarielli' },
];

const KITCHEN_PIZZE_SPECIALI = [
  { name: 'DOCK71', price: '€ 15,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, melanzane, funghi, carciofi, acciughe, olive' },
  { name: 'CAZZA LA RANDA', price: '€ 14,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, salame piccante, gorgonzola Dop, cipolla caramellata' },
  { name: 'FUMO DI STIVA', price: '€ 16,00', desc: 'mozzarella fior di latte, scamorza affumicata, pasta di salame, patate al forno profumate al rosmarino, riduzione di birra IPA' },
  { name: 'FIUME IN PIENA', price: '€ 13,00', desc: 'pomodoro Frulloro, mozzarella fior di latte, melanzane, salsiccia, basilico, ricotta salata' },
  { name: 'PORCHETTARA', price: '€ 13,00', desc: 'mozzarella fior di latte, scamorza affumicata, porchetta, patate al forno' },
];

const KITCHEN_PANINI = [
  { name: 'IL RIMORCHIATORE', price: '€ 12,00', desc: 'pane "potato roll", petto di pollo crispy, bacon, pomodoro, lattuga, maionese' },
  { name: 'IL FARO', price: '€ 13,00', desc: 'pane "potato roll", pasta di salame scottata, scamorza affumicata, friarielli piccanti' },
  { name: 'IL 71', price: '€ 14,50', desc: 'pane "potato roll", smash burger di manzo 180g, cheddar, bacon, cipolla caramellata, maionese, salsa BBQ' },
  { name: 'STIVA PIENA', price: '€ 12,00', desc: 'pane "gourmet potato roll", pulled pork, coleslaw' },
  { name: 'ARMATORE DEI DOCKS', price: '€ 15,00', desc: 'pane "potato roll", scottona 200g, gorgonzola piccante, pere saltate, noci' },
  { name: 'IL PANINO DEL CAPITANO', price: '€ 13,50', desc: 'pane "potato roll", porchetta alla piastra, patate al forno, scamorza, maionese' },
  { name: 'HOT DOG DEL DOCKLANDS', price: '€ 10,00', desc: 'pane "potato roll", wurstel, crauti, cipolla croccante, senape, ketchup' },
  { name: 'LA NEBBIA SUL DOCK', price: '€ 10,00', desc: 'pane "potato roll", burger di patate e melanzane, pomodoro ramato, salsa al basilico, insalata, cetriolo' },
];

const KITCHEN_PICCOLI_MARINAI = [
  { name: 'NUGGETS DI POLLO', desc: 'panati e fritti' },
  { name: 'HOT DOG', desc: 'con salse a scelta' },
  { name: 'BURGER DI POLLO', desc: 'Panino con cotoletta di pollo, cheddar, bacon croccante e maionese' },
  { name: 'BURGER DI MANZO', desc: 'Panino con carne di manzo con cheddar e salsa a scelta' },
];

const KITCHEN_TOP_SELLER = [
  {
    name: 'IL FISH AND CHIPS DEL VECCHIO MOLO',
    price: '€ 21,00',
    desc: 'Un filetto generoso di merluzzo bianco fresco, in pastella artigianale leggera e croccante a base di birra Ale bionda ghiacciata e un pizzico di malto. Accompagnato da patate del mozzo e da una vellutata salsa tartara.',
  },
  {
    name: 'LONDON BEEF PIE',
    price: '€ 18,00',
    desc: 'Pasticcio di carne di manzo cotto lentamente con birra scura, crosta di pasta sfoglia dorata. Servito con soffice purè e salsa gravy al prezzemolo fresco.',
  },
];

const KITCHEN_DOLCI = [
  { name: 'BIRRAMISÙ', price: '€ 6,00', note: '' },
  { name: 'PANNA COTTA CON TOPPING', price: '€ 6,00', note: '' },
  { name: 'TORTA DEL GIORNO', price: '€ 5,00', note: '' },
  { name: 'ANANAS ALLA PIASTRA', price: '€ 5,00', note: '+ pallina di gelato + € 1,50' },
];

const DRAFT_BEERS = [
  {
    name: 'BUD',
    abv: 'alc 5,0 %',
    desc: 'La Budweiser è una lager chiara. Al naso si percepiscono note floreali e fruttate molto leggere. In bocca mostra una ridotta frizzantezza ed un corpo leggero, un aroma sfumato di luppolo ed un retrogusto dolciastro accompagnato da una lieve punta alcolica.',
    prices: 'Media (0,40 l) – € 5,00 | Piccola (0,20 l) – € 3,00',
  },
  {
    name: 'IPA GOOSE',
    abv: 'alc 6,6%',
    desc: "La Goose IPA è l'interpretazione americana di un classico inglese. All'olfatto, si ritrovano le caratteristiche delle IPA americane con sentori caratterizzati dal luppolo che offrono aromi fruttati di pompelmo e pesca. Questa birra di colore arancione ramato leggermente opalescente, dominato da una corona di schiuma bianca cremosa e duratura.",
    prices: 'Media (0,40 l) – € 6,00 | Piccola (0,20 l) – € 4,00',
  },
  {
    name: 'HOEGAARDEN',
    abv: 'alc 6,6%',
    desc: "La Hoegaarden è una classica birra Blanche belga a base di frumento. Questa birra bianca non filtrata ha un gusto fragrante e speziato grazie all'uso del coriandolo e delle scorze d'arancia. Ha un sapore fruttato e un delizioso sfondo di miele, che la rende una piacevole blanche dal carattere dissetante e beverino.",
    prices: 'Media (0,50 l) – € 7,00 | Piccola (0,25 l) – € 4,00',
  },
  {
    name: 'LEFFE ROUGE',
    abv: 'alc 6,6%',
    desc: "Leffe Rouge è un'autentica birra rossa d'abbazia dall'aroma intenso di malto con note di caffè tostato e di agrumi canditi. Il gusto rivela un corpo morbido, in cui il malto tostato lascia il posto ad un retrogusto erbaceo. Il finale, infine, lungo e persistente, lascia un senso di freschezza.",
    prices: 'Formato unico (0,33 l) – € 6,00',
  },
  {
    name: 'MODERN BITTER',
    abv: 'alc. 4,50% (Birra artigianale – Rurale)',
    desc: "La Modern Bitter di Birrificio Rurale è un'interpretazione contemporanea dello stile inglese. Ambrata, offre note di biscotto e caramello bilanciate dal luppolo Crystal, che dona sentori speziati ed erbacei. Secca, leggera e molto beverina.",
    prices: 'Media (0,40 l) – € 6,50 | Piccola (0,20 l) – € 4,50',
  },
  {
    name: 'GOLOSA',
    abv: 'alc. 5,5% (Birra artigianale – Menaresta) GLUTEN FREE',
    desc: "Golosa di Birrificio artigianale Menaresta è un'ambrata in stile american red ale con luppoli americani delicatamente dosati (grande bevibilità, rimane in equilibrio tra luppoli aromatici e malto). Note degustative: Floreale, fruttato esotico, frutta rossa e bianca.",
    prices: 'Media (0,40 l) – € 6,00 | Piccola (0,20 l) – € 4,00',
  },
  {
    name: 'GUINNESS',
    abv: 'Stout Irlandese',
    desc: "Emblema delle birre Stout e simbolo dell'Irlanda, la Guinness è conosciuta e apprezzata in tutto il mondo. Ha un colore marrone scuro e forma una schiuma di colore beige compatta e persistente. Il suo gusto unico, di intenso tostato con note di caffè e cacao, deriva dall'elevato grado di tostatura a cui è sottoposto uno dei suoi ingredienti fondamentali, il malto d'orzo.",
    prices: 'Formato unico (0,50 l) – € 8,50',
  },
];

const BOTTLE_BEERS = [
  {
    name: '3 FONTEINEN OUDE GEUZE',
    meta: 'Belgio – 37,5 cl | 6,7% Vol.',
    price: '€ 20,00',
    desc: 'Agrumi e vaniglia. Leggera, secca e beverina. Ideale con frutti di mare, crostacei, fritti e verdure grigliate.',
  },
  {
    name: 'BAYREUTHER HELL',
    meta: 'Baviera – 50 cl | Lager | 4,9% Vol.',
    price: '€ 6,00',
    desc: 'Aroma fresco e floreale con note di miele, limone e cereale. Ottima per aperitivi, pizze, insalatone e pollo arrosto.',
  },
  {
    name: 'CDM BELLE GOSE',
    meta: 'Italia – 33 cl | 4,8% Vol.',
    price: '€ 9,00',
    desc: 'Spesso chiamata "Che Bel Gose". Aroma floreale, sapidità bilanciata dal malto e tocco acidulo finale che pulisce il palato. Ideale per antipasti e insalatone.',
  },
  {
    name: 'CDM PIEDI NERI',
    meta: 'Italia – 33 cl | 7,8% Vol.',
    price: '€ 10,00',
    desc: 'Ispirata alle Imperial Stout/Porter, con un profilo aromatico caratterizzato da castagne e riso. Ottima con carni grigliate e brasate.',
  },
  {
    name: 'CDM TEMPORIS',
    meta: 'Italia – 22 cl | Saison Artigianale | 6,4–6,8% Vol.',
    price: '€ 9,00',
    desc: 'Note fruttate e agrumate al naso con sfumature erbacee e speziate date da luppoli, erbe e spezie selezionate. Si abbina a pizza e carni alla brace; ideale anche da gustare con calma.',
  },
  {
    name: 'GRIGNA – BIRRIFICIO LARIANO',
    meta: 'Italia – 33 cl | Pils Chiara | 4,6% Vol.',
    price: '€ 7,00',
    desc: 'Bassa fermentazione, ricco aroma di malto e bouquet erbaceo da luppoli cechi e tedeschi, con amaro moderato. Ottima con pizze classiche e insalate.',
  },
  {
    name: 'RAILROAD ARISTOTELES',
    meta: 'Italia – 33 cl | IPA | 4,0% Vol.',
    price: '€ 8,00',
    desc: 'Note agrumate di pompelmo che evolvono in sentori esotici di litchi e uva bianca, con un delicato profumo erbaceo. Perfetta con cibi piccanti e carni bianche alla griglia.',
  },
  {
    name: 'RAILROAD RAUCH AGAINST THE MACINE',
    meta: 'Italia – 33 cl | Rauch/Smoked | 5,0% Vol.',
    price: '€ 8,00',
    desc: "Birra affumicata realizzata con spezie, erbe aromatiche e l'aggiunta di biscotti nella ricetta, che donano morbidezza al profilo aromatico. Consigliata con pizze affumicate.",
  },
  {
    name: 'RAILROAD ZLATAN',
    meta: 'Italia – 33 cl | IPA Artigianale Ambrata | 8,3% Vol.',
    price: '€ 8,00',
    desc: "Aroma intenso di luppoli americani e del Pacifico con note tropicali di mango e maracuja. Secca, profumata e dall'amaro deciso ma privo di astringenza. Consigliata con cibi piccanti.",
  },
  {
    name: 'RODENBACH GRAND CRU',
    meta: 'Belgio – 33 cl | Rossa | 6,0% Vol.',
    price: '€ 7,00',
    desc: "Profumi vinosi di ciliegia rossa matura, frutta secca, scorza d'agrumi, vaniglia e caramello. Al palato è dolce e aspra allo stesso tempo. Consigliata per aperitivi e amanti delle note acide.",
  },
  {
    name: 'RURALE ORANGE BOCK',
    meta: 'Italia – 33 cl | Bock Ambrata',
    price: '€ 8,00',
    desc: "Le note complesse di caramello, pane tostato e frutta secca incontrano la freschezza della buccia d'arancia. Ideale con carni brasate, formaggi stagionati e dolci speziati.",
  },
  {
    name: 'RURALE RESET',
    meta: 'Italia – 33 cl | American Amber Ale | 5,6% Vol.',
    price: '€ 8,00',
    desc: 'Ambrata dal gusto e profumo intensi con vibranti note agrumate e tropicali. Ideale con pizze, carne rossa alla brace e cucina americana.',
  },
  {
    name: 'VETRA PALE',
    meta: 'Italia – 33 cl | Pils | 5,4% Vol. | Gluten Free',
    price: '€ 8,00',
    desc: 'Aroma fresco e profumi esotici. Ottima con fritture e hamburger.',
  },
  {
    name: 'FRANZISKANER WEISS',
    meta: 'Baviera – 50 cl | Weisse | 5,0% Vol.',
    price: '€ 6,00',
    desc: "Gusto piacevolmente amarognolo dall'aroma fruttato e agrumato. Ideale con le carni bianche.",
  },
  {
    name: 'MAISEL URBAN IPA',
    meta: 'Germania – 33 cl in lattina | 5,6% Vol.',
    price: '€ 6,00',
    desc: 'Carattere di agrumi e frutta tropicale con una leggera nota speziata e finale secco e amaro. Consigliata con pizze e insalate.',
  },
  {
    name: 'CORONA EXTRA',
    meta: 'Messico – 33 cl | 4,5% Vol.',
    price: '€ 5,00',
    desc: 'Struttura snella con lievi note luppolate, floreali ed erbacee. Consigliata con pizze e carni grigliate.',
  },
];

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  onOpenBookingModal,
  onOpenAdmin,
  onShowToast,
}) => {
  const { addBooking, addConsentLog } = useSiteData();
  const [activeMenuTab, setActiveMenuTab] = useState<'food' | 'beverage'>('food');
  const [foodViewMode, setFoodViewMode] = useState<'interactive' | 'pdf'>('pdf');
  const [beverageViewMode, setBeverageViewMode] = useState<'interactive' | 'pdf'>('pdf');

  // Booking Form State
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('20:30');
  const [guests, setGuests] = useState<number>(4);
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [gdprAccepted, setGdprAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedCode, setConfirmedCode] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenFoodMenu = () => {
    setActiveMenuTab('food');
    scrollToSection('sezione-menu-coming-soon');
  };

  const handleOpenBeverageMenu = () => {
    setActiveMenuTab('beverage');
    scrollToSection('sezione-menu-coming-soon');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !gdprAccepted) {
      onShowToast('Compila tutti i campi obbligatori e accetta la Privacy GDPR.');
      return;
    }

    setIsSubmitting(true);

    const generatedCode = `DK71-${Math.floor(1000 + Math.random() * 9000)}`;

    addBooking({
      bookingCode: generatedCode,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      date,
      timeSlot,
      guests,
      area: 'Tavolo Standard',
      notes: notes.trim() || 'Prenotazione da Pagina Coming Soon',
      gdprAccepted: true,
      source: 'Pagina Prenota',
    });

    addConsentLog({
      purposes: ['Tecnici', 'Gestione Prenotazione GDPR'],
      userAgent: navigator.userAgent,
      source: 'Form Prenotazione',
      analyticsAccepted: true,
      marketingAccepted: false,
    });

    setIsSubmitting(false);
    setConfirmedCode(generatedCode);
    onShowToast(`Richiesta prenotazione #${generatedCode} inviata con successo!`);
  };

  return (
    <div className="min-h-screen bg-[#FFF9EB] text-[#1D1C13] font-work flex flex-col justify-between selection:bg-dock-burgundy selection:text-white">
      {/* Top Checkerboard Band */}
      <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]" />

      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-[#FFF9EB]/95 backdrop-blur-md border-b-2 border-[#E8E2D4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-0 sm:h-20 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 p-0.5 rounded-full bg-white border-2 border-dock-mustard shadow-md shrink-0">
              <img
                src={PUB_IMAGES.logo}
                alt="Dock 71 Cantù Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-chunky text-xl sm:text-2xl text-[#7B2039] tracking-tight leading-none">
                  DOCK 71
                </span>
                <span className="font-marker text-[10px] bg-dock-green px-2 py-0.5 text-white rounded shadow-xs">
                  CANTÙ
                </span>
              </div>
              <span className="font-marker text-[10px] text-[#336859] uppercase tracking-wider font-bold block mt-0.5">
                GRIGLIA • MALTO • FARINA
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleOpenFoodMenu}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F3EDDF] hover:bg-[#E8E2D4] text-[#1D1C13] border border-[#E8E2D4] font-epilogue font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[18px] text-dock-burgundy">
                restaurant_menu
              </span>
              Vedi il Menù
            </button>

            <button
              onClick={handleOpenBeverageMenu}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F3EDDF] hover:bg-[#E8E2D4] text-[#1D1C13] border border-[#E8E2D4] font-epilogue font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[18px] text-dock-green">
                sports_bar
              </span>
              Carta Beverage
            </button>

            <button
              onClick={() => scrollToSection('sezione-prenota-coming-soon')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider shadow-md border border-dock-burgundy-light transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">
                event_seat
              </span>
              Prenota Ora
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO COMING SOON */}
        <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 border-b-2 border-[#E8E2D4] bg-gradient-to-b from-[#FFF9EB] to-[#FAF7F2]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7B2039]/10 border-2 border-[#7B2039]/30 text-[#7B2039]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7B2039] animate-ping" />
              <span className="font-marker text-xs sm:text-sm uppercase tracking-wider font-bold">
                COMING SOON • NUOVO SITO WEB IN ARRIVO
              </span>
            </div>

            <h1 className="font-chunky text-4xl sm:text-6xl lg:text-7xl text-[#1D1C13] uppercase tracking-tight leading-[1.05]">
              IL NUOVO PORTO DEL GUSTO A{' '}
              <span className="text-[#7B2039] underline decoration-dock-mustard decoration-4 underline-offset-8">
                CANTÙ
              </span>{' '}
              STA ARRIVANDO
            </h1>

            <p className="max-w-2xl mx-auto font-work text-base sm:text-lg text-[#554245] leading-relaxed">
              Stiamo ultimando il nostro nuovo portale digitale. Nel frattempo il{' '}
              <strong className="text-[#1D1C13]">Dock 71</strong> è aperto e operativo in{' '}
              <strong className="text-[#7B2039]">Via Milano 71 a Cantù</strong>: consulta subito il nostro{' '}
              <strong>Menù Cucina</strong>, la <strong>Carta Beverage &amp; Birre</strong> e{' '}
              <strong>prenota il tuo tavolo online</strong>!
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => scrollToSection('sezione-prenota-coming-soon')}
                className="px-7 py-4 rounded-2xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-sm sm:text-base uppercase tracking-wider shadow-xl border-2 border-dock-burgundy-light flex items-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[22px] text-dock-mustard">
                  table_restaurant
                </span>
                PRENOTA IL TUO TAVOLO
              </button>

              <button
                onClick={handleOpenFoodMenu}
                className="px-6 py-4 rounded-2xl bg-dock-green hover:bg-emerald-900 text-white font-chunky text-sm sm:text-base uppercase tracking-wider shadow-lg border-2 border-emerald-700 flex items-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[22px] text-dock-mustard">
                  menu_book
                </span>
                VEDI IL MENÙ CUCINA
              </button>

              <button
                onClick={handleOpenBeverageMenu}
                className="px-6 py-4 rounded-2xl bg-[#FFF9EB] hover:bg-[#F3EDDF] text-[#7B2039] font-chunky text-sm sm:text-base uppercase tracking-wider shadow-md border-2 border-[#7B2039] flex items-center gap-2.5 transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[22px] text-[#7B2039]">
                  sports_bar
                </span>
                CARTA BEVERAGE &amp; BIRRE
              </button>
            </div>

            {/* Info Pill Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#554245] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[18px] text-[#7B2039]">
                  location_on
                </span>
                <span>Via Milano 71, 22063 Cantù (CO)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined notranslate text-[18px] text-[#336859]">
                  schedule
                </span>
                <span>Aperto Tutti i Giorni • Pranzo &amp; Cena</span>
              </div>
              <a
                href="tel:+39031712063"
                className="flex items-center gap-1.5 text-[#7B2039] font-bold hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">call</span>
                <span>+39 031 712063</span>
              </a>
            </div>
          </div>
        </section>

        {/* =================================================================== */}
        {/* SEZIONE 1: MENÙ CUCINA (PDF) & CARTA BEVERAGE (PDF) */}
        {/* =================================================================== */}
        <section
          id="sezione-menu-coming-soon"
          className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-[#E8E2D4] pb-6">
            <div>
              <span className="font-marker text-xs uppercase tracking-widest text-[#336859] font-bold block mb-1">
                CONSULTAZIONE IMMEDIATA
              </span>
              <h2 className="font-chunky text-3xl sm:text-4xl text-[#1D1C13] uppercase tracking-tight">
                I NOSTRI MENÙ UFFICIALI
              </h2>
            </div>

            {/* Tab Switcher Food vs Beverage */}
            <div className="inline-flex p-1.5 rounded-2xl bg-[#F3EDDF] border-2 border-[#E8E2D4] self-start md:self-auto">
              <button
                onClick={() => setActiveMenuTab('food')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-chunky text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeMenuTab === 'food'
                    ? 'bg-dock-burgundy text-white shadow-md'
                    : 'text-[#554245] hover:text-[#7B2039]'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[18px]">
                  lunch_dining
                </span>
                Menù Cucina (PDF)
              </button>

              <button
                onClick={() => setActiveMenuTab('beverage')}
                className={`px-4 sm:px-6 py-2.5 rounded-xl font-chunky text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                  activeMenuTab === 'beverage'
                    ? 'bg-dock-green text-white shadow-md'
                    : 'text-[#554245] hover:text-[#336859]'
                }`}
              >
                <span className="material-symbols-outlined notranslate text-[18px]">
                  sports_bar
                </span>
                Beverage &amp; Birre (PDF)
              </button>
            </div>
          </div>

          {/* TAB 1: MENÙ CUCINA (PDF UFFICIALE + VERSIONE DIGITALE LEGGIBILE) */}
          {activeMenuTab === 'food' && (
            <div className="bg-white rounded-3xl p-4 sm:p-8 border-2 border-[#E8E2D4] shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D4]">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-[#7B2039] text-white font-marker text-[11px] uppercase mb-1">
                    MENÙ CUCINA UFFICIALE DOCK 71
                  </span>
                  <h3 className="font-chunky text-xl sm:text-2xl text-[#1D1C13] uppercase">
                    Stuzzicherie, Griglia, Pizze, Panini &amp; Dolci
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex p-1 rounded-xl bg-[#F3EDDF] border border-[#E8E2D4]">
                    <button
                      onClick={() => setFoodViewMode('pdf')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-epilogue font-bold uppercase cursor-pointer transition-all ${
                        foodViewMode === 'pdf'
                          ? 'bg-[#7B2039] text-white'
                          : 'text-[#554245] hover:text-[#1D1C13]'
                      }`}
                    >
                      Visualizzatore PDF
                    </button>
                    <button
                      onClick={() => setFoodViewMode('interactive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-epilogue font-bold uppercase cursor-pointer transition-all ${
                        foodViewMode === 'interactive'
                          ? 'bg-[#7B2039] text-white'
                          : 'text-[#554245] hover:text-[#1D1C13]'
                      }`}
                    >
                      Lettura Rapida Mobile
                    </button>
                  </div>

                  <a
                    href={KITCHEN_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Menu_Cucina_Dock71.pdf"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-epilogue font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">
                      download
                    </span>
                    Scarica / Apri PDF
                  </a>

                  <button
                    onClick={() => setActiveMenuTab('beverage')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#336859] hover:bg-emerald-900 text-white font-epilogue font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">
                      sports_bar
                    </span>
                    Vai al Beverage →
                  </button>
                </div>
              </div>

              {foodViewMode === 'pdf' && (
                <div className="space-y-4">
                  <div className="w-full h-[650px] sm:h-[850px] rounded-2xl overflow-hidden border-2 border-[#E8E2D4] bg-[#FAF7F2]">
                    <iframe
                      src={`${KITCHEN_PDF_URL}#view=FitH`}
                      title="Menù Cucina Dock 71 PDF"
                      className="w-full h-full border-0"
                    />
                  </div>
                  <p className="text-center text-xs text-[#7A7265]">
                    Se il tuo dispositivo mobile non mostra l&apos;anteprima PDF qui sopra, clicca su{' '}
                    <button
                      onClick={() => setFoodViewMode('interactive')}
                      className="text-[#7B2039] font-bold underline cursor-pointer"
                    >
                      Lettura Rapida Mobile
                    </button>{' '}
                    oppure{' '}
                    <a
                      href={KITCHEN_PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7B2039] font-bold underline"
                    >
                      apri direttamente il PDF
                    </a>
                    .
                  </p>
                </div>
              )}

              {/* VERSIONE SFOGLIABILE AD ALTA LEGGIBILITÀ DEL PDF CUCINA */}
              <div className="space-y-8 pt-2">
                {/* 1. STUZZICHERIE */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-[#7B2039] pb-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039]">
                      tapas
                    </span>
                    <h4 className="font-chunky text-xl sm:text-2xl text-[#7B2039] uppercase">
                      Stuzzicherie
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {KITCHEN_STUZZICHERIE.map((item) => (
                      <div
                        key={item.name}
                        className="bg-white p-4 rounded-xl border border-[#E8E2D4] flex flex-col justify-between gap-1.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-chunky text-sm sm:text-base text-[#1D1C13]">
                            {item.name}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-[#7B2039] text-white font-chunky text-xs shrink-0">
                            {item.price}
                          </span>
                        </div>
                        {item.desc && (
                          <p className="text-xs text-[#554245] leading-relaxed">{item.desc}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. DAI FUOCHI... ALLA GRIGLIA & 3. TARTARE DEL MOLO */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-[#C88B1F] pb-2">
                      <span className="material-symbols-outlined notranslate text-[#B87712]">
                        outdoor_grill
                      </span>
                      <h4 className="font-chunky text-xl text-[#B87712] uppercase">
                        Dai Fuochi... Alla Griglia
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {KITCHEN_GRIGLIA.map((item) => (
                        <div
                          key={item.name}
                          className="bg-white p-3.5 rounded-xl border border-[#E8E2D4] space-y-1 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-sm sm:text-base text-[#1D1C13]">
                              {item.name}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#C88B1F] text-white font-chunky text-xs shrink-0">
                              {item.price}
                            </span>
                          </div>
                          {item.desc && (
                            <p className="text-xs text-[#554245] leading-relaxed">{item.desc}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                    <div className="border-b-2 border-[#336859] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined notranslate text-[#336859]">
                          restaurant
                        </span>
                        <h4 className="font-chunky text-xl text-[#336859] uppercase">
                          Tartare del Molo
                        </h4>
                      </div>
                      <p className="text-[11px] font-semibold text-[#554245] mt-0.5">
                        120 g di Scottona, servite con crostini di pane casereccio tostato
                      </p>
                    </div>
                    <div className="space-y-3">
                      {KITCHEN_TARTARE.map((item) => (
                        <div
                          key={item.name}
                          className="bg-white p-4 rounded-xl border border-[#E8E2D4] space-y-1.5 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-sm sm:text-base text-[#1D1C13]">
                              {item.name}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#336859] text-white font-chunky text-xs shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-xs text-[#554245] leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. PIZZE CLASSICHE & 5. PIZZE SPECIALI DEL PORTO */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-6">
                  <div>
                    <div className="flex items-center gap-2 border-b-2 border-[#7B2039] pb-2 mb-4">
                      <span className="material-symbols-outlined notranslate text-[#7B2039]">
                        local_pizza
                      </span>
                      <h4 className="font-chunky text-xl sm:text-2xl text-[#7B2039] uppercase">
                        Pizze Classiche
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {KITCHEN_PIZZE_CLASSICHE.map((pizza) => (
                        <div
                          key={pizza.name}
                          className="bg-white p-3.5 rounded-xl border border-[#E8E2D4] flex flex-col justify-between gap-1.5 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-sm text-[#1D1C13]">{pizza.name}</span>
                            <span className="px-2 py-0.5 rounded bg-[#7B2039] text-white font-chunky text-xs shrink-0">
                              {pizza.price}
                            </span>
                          </div>
                          <p className="text-xs text-[#554245] leading-relaxed">{pizza.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#336859] pb-2 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined notranslate text-[#336859]">
                          workspace_premium
                        </span>
                        <h4 className="font-chunky text-xl sm:text-2xl text-[#336859] uppercase">
                          Pizze Speciali del Porto
                        </h4>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#1D1C13] text-[#E0A93B] font-marker text-[11px] uppercase">
                        Chiedi al nostro staff la birra perfetta da abbinare!
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {KITCHEN_PIZZE_SPECIALI.map((pizza) => (
                        <div
                          key={pizza.name}
                          className="bg-white p-4 rounded-xl border border-[#336859]/30 flex flex-col justify-between gap-1.5 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-base text-[#1D1C13]">{pizza.name}</span>
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#336859] text-white font-chunky text-xs shrink-0">
                              {pizza.price}
                            </span>
                          </div>
                          <p className="text-xs text-[#554245] leading-relaxed">{pizza.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. PANINI DEL DOCKLANDS & 7. MENÙ DEI PICCOLI MARINAI */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-[#1D1C13] text-white rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/20 pb-3">
                      <div>
                        <h4 className="font-chunky text-xl sm:text-2xl text-dock-mustard uppercase">
                          Panini del Docklands
                        </h4>
                        <p className="text-xs text-white/80">
                          Serviti con patate del mozzo e salsa Dock
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-[#7B2039] text-white font-chunky text-[11px] uppercase">
                        Coperto € 1 • Acqua € 2 • Caffè € 2
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {KITCHEN_PANINI.map((item) => (
                        <div
                          key={item.name}
                          className="bg-white/10 p-3.5 rounded-xl border border-white/10 space-y-1.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-sm text-dock-mustard">
                              {item.name}
                            </span>
                            <span className="font-chunky text-xs bg-white text-[#1D1C13] px-2 py-0.5 rounded shrink-0">
                              {item.price}
                            </span>
                          </div>
                          <p className="text-xs text-white/85 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border-2 border-[#7B2039] flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 border-b-2 border-[#7B2039] pb-2">
                        <h4 className="font-chunky text-lg text-[#7B2039] uppercase">
                          Menù dei Piccoli Marinai
                        </h4>
                        <span className="px-3 py-1 rounded-full bg-dock-mustard text-[#1D1C13] font-chunky text-sm shrink-0">
                          € 10,00
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {KITCHEN_PICCOLI_MARINAI.map((kid) => (
                          <div
                            key={kid.name}
                            className="bg-white p-3 rounded-xl border border-[#E8E2D4]"
                          >
                            <div className="font-chunky text-xs sm:text-sm text-[#7B2039]">
                              {kid.name}
                            </div>
                            <p className="text-xs text-[#554245] mt-0.5">{kid.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-bold text-[#7B2039] bg-white p-3 rounded-xl border border-[#E8E2D4]">
                      Tutti i piatti vengono serviti con patatine fritte e accompagnati da acqua o bibita.
                    </p>
                  </div>
                </div>

                {/* 8. DOCK'S TOP SELLER & 9. I DOLCI FIRMATI DOCK71 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                    <div className="flex items-center gap-2 border-b-2 border-[#7B2039] pb-2">
                      <span className="material-symbols-outlined notranslate text-[#7B2039]">
                        stars
                      </span>
                      <h4 className="font-chunky text-xl text-[#7B2039] uppercase">
                        Dock&apos;s Top Seller!
                      </h4>
                    </div>
                    <div className="space-y-3.5">
                      {KITCHEN_TOP_SELLER.map((top) => (
                        <div
                          key={top.name}
                          className="bg-white p-4 rounded-xl border-2 border-[#E0A93B]/60 space-y-2 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-chunky text-base text-[#7B2039]">
                              {top.name}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-dock-mustard text-[#1D1C13] font-chunky text-sm shrink-0">
                              {top.price}
                            </span>
                          </div>
                          <p className="text-xs text-[#554245] leading-relaxed">{top.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#7B2039] text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 border-b border-white/20 pb-2 mb-4">
                        <span className="material-symbols-outlined notranslate text-dock-mustard">
                          cake
                        </span>
                        <h4 className="font-chunky text-xl text-dock-mustard uppercase">
                          I Dolci Firmati Dock71
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {KITCHEN_DOLCI.map((dolce) => (
                          <li
                            key={dolce.name}
                            className="flex items-center justify-between gap-3 bg-white/10 px-4 py-3 rounded-xl border border-white/10"
                          >
                            <div>
                              <span className="font-chunky text-sm sm:text-base text-white block">
                                {dolce.name}
                              </span>
                              {dolce.note && (
                                <span className="text-xs italic text-dock-mustard">
                                  {dolce.note}
                                </span>
                              )}
                            </div>
                            <span className="px-2.5 py-1 rounded-lg bg-dock-mustard text-[#1D1C13] font-chunky text-xs shrink-0">
                              {dolce.price}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[11px] text-white/75 text-center pt-2">
                      Chiedi al nostro personale informazioni su allergeni e proposte del giorno.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CARTA BEVERAGE & BIRRE (PDF UFFICIALE + VERSIONE DIGITALE LEGGIBILE) */}
          {activeMenuTab === 'beverage' && (
            <div className="bg-white rounded-3xl p-4 sm:p-8 border-2 border-[#E8E2D4] shadow-lg space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E8E2D4]">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded bg-dock-green text-white font-marker text-[11px] uppercase mb-1">
                    CARTA BEVERAGE UFFICIALE DOCK 71
                  </span>
                  <h3 className="font-chunky text-xl sm:text-2xl text-[#1D1C13] uppercase">
                    Birre alla Spina, Artigianali, Cocktail &amp; Drink
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex p-1 rounded-xl bg-[#F3EDDF] border border-[#E8E2D4]">
                    <button
                      onClick={() => setBeverageViewMode('pdf')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-epilogue font-bold uppercase cursor-pointer transition-all ${
                        beverageViewMode === 'pdf'
                          ? 'bg-[#7B2039] text-white'
                          : 'text-[#554245] hover:text-[#1D1C13]'
                      }`}
                    >
                      Visualizzatore PDF
                    </button>
                    <button
                      onClick={() => setBeverageViewMode('interactive')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-epilogue font-bold uppercase cursor-pointer transition-all ${
                        beverageViewMode === 'interactive'
                          ? 'bg-[#7B2039] text-white'
                          : 'text-[#554245] hover:text-[#1D1C13]'
                      }`}
                    >
                      Lettura Rapida Mobile
                    </button>
                  </div>

                  <a
                    href={BEVERAGE_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    download="Menu_Beverage_Dock71.pdf"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-epilogue font-bold text-xs uppercase tracking-wider shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">
                      download
                    </span>
                    Scarica / Apri PDF
                  </a>
                </div>
              </div>

              {beverageViewMode === 'pdf' && (
                <div className="space-y-4">
                  <div className="w-full h-[650px] sm:h-[820px] rounded-2xl overflow-hidden border-2 border-[#E8E2D4] bg-[#FAF7F2]">
                    <iframe
                      src={`${BEVERAGE_PDF_URL}#view=FitH`}
                      title="Carta Beverage e Birre Dock 71 PDF"
                      className="w-full h-full border-0"
                    />
                  </div>
                  <p className="text-center text-xs text-[#7A7265]">
                    Se il tuo dispositivo mobile non mostra l&apos;anteprima PDF qui sopra, clicca su{' '}
                    <button
                      onClick={() => setBeverageViewMode('interactive')}
                      className="text-[#7B2039] font-bold underline cursor-pointer"
                    >
                      Lettura Rapida Mobile
                    </button>{' '}
                    oppure{' '}
                    <a
                      href={BEVERAGE_PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#7B2039] font-bold underline"
                    >
                      apri direttamente il PDF
                    </a>
                    .
                  </p>
                </div>
              )}

              {/* VERSIONE SFOGLIABILE AD ALTA LEGGIBILITÀ DEL PDF BEVERAGE */}
              <div className="space-y-8 pt-2">
                {/* 1. BIRRE ALLA SPINA */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-[#7B2039] pb-2">
                    <span className="material-symbols-outlined notranslate text-[#7B2039]">
                      sports_bar
                    </span>
                    <h4 className="font-chunky text-xl sm:text-2xl text-[#7B2039] uppercase">
                      Birre alla Spina
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DRAFT_BEERS.map((b) => (
                      <div
                        key={b.name}
                        className="bg-white p-4 rounded-xl border border-[#E8E2D4] flex flex-col justify-between gap-2 shadow-2xs"
                      >
                        <div>
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="font-chunky text-base text-[#1D1C13]">{b.name}</span>
                            <span className="text-xs italic font-semibold text-[#7B2039]">
                              {b.abv}
                            </span>
                          </div>
                          <p className="text-xs text-[#554245] mt-1.5 leading-relaxed">{b.desc}</p>
                        </div>
                        <div className="pt-2 border-t border-[#F3EDDF] text-xs font-bold text-[#336859]">
                          {b.prices}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. BIRRE IN BOTTIGLIA E LATTINA */}
                <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-4">
                  <div className="flex items-center gap-2 border-b-2 border-[#336859] pb-2">
                    <span className="material-symbols-outlined notranslate text-[#336859]">
                      liquor
                    </span>
                    <h4 className="font-chunky text-xl sm:text-2xl text-[#336859] uppercase">
                      Birre in Bottiglia e Lattina
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {BOTTLE_BEERS.map((b) => (
                      <div
                        key={b.name}
                        className="bg-white p-4 rounded-xl border border-[#E8E2D4] flex flex-col justify-between gap-1.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-chunky text-sm sm:text-base text-[#1D1C13] block">
                              {b.name}
                            </span>
                            <span className="text-[11px] italic text-[#7A7265]">{b.meta}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-[#7B2039] text-white font-chunky text-xs shrink-0">
                            {b.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#554245] leading-relaxed mt-1">{b.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. ANALCOLICHE, SOFT DRINK, COCKTAIL & VINI, CAFFETTERIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Birre Analcoliche & Soft Drink */}
                  <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-5">
                    <div>
                      <h4 className="font-chunky text-lg text-[#7B2039] uppercase border-b border-[#E8E2D4] pb-2 mb-3">
                        Birre Analcoliche
                      </h4>
                      <ul className="space-y-2.5 text-xs">
                        <li className="flex justify-between gap-2">
                          <span>
                            <strong>MAISEL URBAN IPA ANALCOLICA</strong>{' '}
                            <em className="text-[#7A7265]">(Germania – 33 cl | 0,0% Vol.)</em>
                          </span>
                          <strong className="text-[#7B2039] shrink-0">€ 6,00</strong>
                        </li>
                        <li className="flex justify-between gap-2">
                          <span>
                            <strong>MAISEL WEISSE ANALCOLICA</strong>{' '}
                            <em className="text-[#7A7265]">(Germania – 50 cl | 0,0% Vol.)</em>
                          </span>
                          <strong className="text-[#7B2039] shrink-0">€ 6,00</strong>
                        </li>
                        <li>
                          <div className="flex justify-between gap-2">
                            <span>
                              <strong>CORONA ZERO 0.0</strong>{' '}
                              <em className="text-[#7A7265]">(Messico – 33 cl | 0,0% Vol.)</em>
                            </span>
                            <strong className="text-[#7B2039] shrink-0">€ 5,00</strong>
                          </div>
                          <p className="text-[11px] text-[#554245] mt-0.5">
                            Leggera, rinfrescante e versatile, dal profilo aromatico delicato.
                          </p>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-chunky text-lg text-[#336859] uppercase border-b border-[#E8E2D4] pb-2 mb-3">
                        Bevande e Soft Drink
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span>
                            <strong>ACQUA</strong> (0,70 l)
                          </span>
                          <strong className="text-[#1D1C13]">€ 2,00</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>SOFT DRINK ALLA SPINA</strong> (0,50 l) — Pepsi, Pepsi Zero
                            Zuccheri, 7Up, Schweppes Orange
                          </span>
                          <strong className="text-[#1D1C13] shrink-0">€ 3,50</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>LIPTON ICE TEA</strong> (Lattina 0,33 l – Limone/Pesca)
                          </span>
                          <strong className="text-[#1D1C13] shrink-0">€ 3,50</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>RED BULL</strong> (Lattina 0,25 l)
                          </span>
                          <strong className="text-[#1D1C13] shrink-0">€ 4,00</strong>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Cocktail, Vini e Caffetteria */}
                  <div className="space-y-6">
                    <div className="bg-[#7B2039] text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
                      <h4 className="font-chunky text-lg text-dock-mustard uppercase border-b border-white/20 pb-2">
                        Cocktail e Vini
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1.5">
                          <div className="font-chunky text-sm text-white">COCKTAIL — € 8,00</div>
                          <p className="text-white/90 leading-relaxed font-medium">
                            VODKA RED BULL • GIN TONIC • GIN LEMON • APEROL SPRITZ • CAMPARI SPRITZ
                            • NEGRONI • NEGRONI SBAGLIATO • AMERICANO
                          </p>
                        </div>
                        <div className="space-y-1.5 bg-white/10 p-3 rounded-xl">
                          <div className="font-chunky text-sm text-dock-mustard">
                            CALICI DI VINO — € 7,00
                          </div>
                          <p className="text-white/85 italic">
                            Chiedi la proposta delle bottiglie al nostro personale
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] rounded-2xl p-5 sm:p-6 border border-[#E8E2D4] space-y-2.5">
                      <h4 className="font-chunky text-lg text-[#1D1C13] uppercase border-b border-[#E8E2D4] pb-2">
                        Caffetteria e Dopocena
                      </h4>
                      <ul className="space-y-2 text-xs">
                        <li className="flex justify-between">
                          <span>
                            <strong>Caffè / Decaffeinato / Macchiato</strong>
                          </span>
                          <strong>€ 2,00</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>Caffè corretto</strong>
                          </span>
                          <strong>€ 2,50</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>Amari e grappe</strong>
                          </span>
                          <strong>a partire da € 4,00</strong>
                        </li>
                        <li className="flex justify-between">
                          <span>
                            <strong>Distillati premium, Whisky e Rum</strong>{' '}
                            <em className="text-[#7A7265]">
                              (chiedi la selezione al nostro personale)
                            </em>
                          </span>
                          <strong className="shrink-0">a partire da € 10,00</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* SEZIONE 2: MODULO DI PRENOTAZIONE TAVOLO DIRETTA */}
        {/* =================================================================== */}
        <section
          id="sezione-prenota-coming-soon"
          className="py-12 sm:py-16 bg-[#F3EDDF] border-t-2 border-[#E8E2D4]"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FFF9EB] rounded-3xl p-6 sm:p-10 border-3 border-[#7B2039] shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#336859] text-white font-marker text-xs uppercase tracking-wider">
                  PRENOTAZIONE ONLINE ATTIVA
                </span>
                <h2 className="font-chunky text-3xl sm:text-4xl text-[#1D1C13] uppercase">
                  PRENOTA ORA IL TUO TAVOLO
                </h2>
                <p className="text-xs sm:text-sm text-[#554245] max-w-xl mx-auto">
                  Riserva il tuo posto al Dock 71 Cantù in meno di 30 secondi. Riceverai conferma
                  via email direttamente dal nostro staff.
                </p>
              </div>

              {confirmedCode ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 border-2 border-[#336859] text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#336859] text-white flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined notranslate text-3xl">check</span>
                  </div>
                  <h3 className="font-chunky text-2xl text-[#336859] uppercase">
                    Richiesta Inviata con Successo!
                  </h3>
                  <p className="text-sm text-[#1D1C13]">
                    Codice Prenotazione:{' '}
                    <strong className="font-mono-tech text-base text-[#7B2039] bg-white px-3 py-1 rounded border border-[#E8E2D4]">
                      #{confirmedCode}
                    </strong>
                  </p>
                  <p className="text-xs text-[#554245] max-w-md mx-auto">
                    Abbiamo registrato la tua richiesta per <strong>{guests} ospiti</strong> il{' '}
                    <strong>{date}</strong> alle ore <strong>{timeSlot}</strong>. Riceverai a breve
                    l&apos;email di conferma ufficiale.
                  </p>
                  <button
                    onClick={() => {
                      setConfirmedCode(null);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setNotes('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#7B2039] text-white font-chunky text-xs uppercase cursor-pointer"
                  >
                    Effettua un&apos;altra prenotazione
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Data *
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Orario *
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      >
                        <option value="12:30">12:30 (Pranzo)</option>
                        <option value="13:15">13:15 (Pranzo)</option>
                        <option value="19:30">19:30 (Cena / Aperitivo)</option>
                        <option value="20:00">20:00 (Cena)</option>
                        <option value="20:30">20:30 (Cena)</option>
                        <option value="21:00">21:00 (Cena / Match)</option>
                        <option value="21:30">21:30 (Cena)</option>
                        <option value="22:00">22:00 (Dopocena / Birreria)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Numero Ospiti *
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Ospite' : 'Ospiti'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Nome e Cognome *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Es. Marco Rossi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Telefono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Es. +39 333 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                        Email per Conferma *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="tuaemail@esempio.it"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                      Note o Richieste Particolari (Intolleranze, Seggiolone, Partita Sky...)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Scrivi qui eventuali richieste..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                    />
                  </div>

                  {/* GDPR Checkbox */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#E8E2D4] cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={gdprAccepted}
                      onChange={(e) => setGdprAccepted(e.target.checked)}
                      className="mt-0.5 accent-[#7B2039] w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="text-xs text-[#554245] leading-relaxed">
                      Dichiaro di aver letto l&apos;informativa Privacy e acconsento al trattamento
                      dei dati personali per la gestione della prenotazione ai sensi del GDPR (Reg.
                      UE 2016/679). *
                    </span>
                  </label>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={onOpenBookingModal}
                      className="text-xs font-epilogue font-bold text-[#7B2039] underline hover:text-black cursor-pointer"
                    >
                      Preferisci prenotare tramite finestra rapida? Clicca qui
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-sm uppercase tracking-wider shadow-lg border border-dock-burgundy-light transition-all cursor-pointer"
                    >
                      {isSubmitting ? 'Invio in corso...' : 'CONFERMA PRENOTAZIONE TAVOLO'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="bg-[#FAF7F2] border-t-2 border-[#E8E2D4] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#7A7265] text-center">
          <div>
            © {new Date().getFullYear()} <strong>DOCK 71 CANTÙ</strong> • Via Milano 71, 22063 Cantù
            (CO) • Tel. +39 031 712063
          </div>
        </div>
      </footer>
    </div>
  );
};
