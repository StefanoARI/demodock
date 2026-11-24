export interface MenuItem {
  id: string;
  name: string;
  category: 'pizze' | 'burger' | 'griglia' | 'birre' | 'sfizi' | 'dolci' | 'pranzo' | 'lunch';
  price: string;
  description: string;
  tags?: string[];
  specs?: string;
  image?: string;
  abv?: string;
  ibu?: string;
  beerStyle?: string;
  beerOrigin?: string;
}

export interface MatchEvent {
  id: string;
  date: string;
  time: string;
  competition: string;
  match: string;
  teams: [string, string];
  screen: string;
  description?: string;
  status: 'recommended' | 'filling_fast' | 'available';
  sport: 'calcio' | 'rugby' | 'basket' | 'motori';
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'cucina' | 'birre' | 'locale' | 'terrazza';
  badge: string;
  caption: string;
}

export const PUB_IMAGES = {
  logo: '/logo-dock71.png',
  craneHero: 'https://lh3.googleusercontent.com/aida/AEtjO1XxupyxkfMGHwtotjZ4IXSxhNJWBT0dNQMuDHHo-vcmJsTlYqwsVzDGEIrmhCfSVYACanJUq54A9QxP7WCYzXkj7RAx1Hbu8v5o9DW_8C4OJevohNdrk26W4c_cnRq8dX9x-rBvkdHV0utMfnPJSVN6v53E3YCPDlZc3di1GZBrdT8zsn3rY0L2PhorRTrDJJTaugFrg791cggiJiyPsbAEgzWg4nWfZ4S5QPuCZpjwd_gy4PsFMGD0b1uN',
  pizza: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9ZyFsk0CAlmIJ-mpx_wcEHWiqPW5Rl-MVFVvU2pSkKBZ9mH2KMDXbMiZxsmJUbep3xzuhuZF-CY8AUlHlmqVVvJ97q0uTEF30Xus2HYuXjZq0gAcWQKnaYxJhSkpqwACovVLp5v1cyVK0I31xE2m3faHmZeO7Ti80Zsirk-_-HSAjNKzfHf8wSzN55Kp4ThHJ-I64SN00iDXPw6wyJiN-JfLKPQ5OMtbCTHEFtjU83cbgX02_EUhB9n_FTrm6aVKX82I',
  burger: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM8L475a42ztnNLblYPinK5TI7vzGhlQaj6beNyBRWGwzrKKk7nkXya_FmbrTzO1GiqfmEZle-JY9MLKTXW2GhOjDx1rg44cGqevm6dj0HKZweSadh4gf3WAk4MPmYcrQo2kUU3g08mQl0z0_nQ4tNOAtBrrLcTHi0P0FybqZNunfCKTIIP4cKhsWJrC9GAPi84inzv68kzDj0Hs1hd-kwP7CFwYPTkpE9FK7ULcndZfYhBUp1czaRrh_gDfiHjWNC9W4',
  beerGlass: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkhWndZScHkbPn1j2F-_56ws8ZdxZ0zcD8N4WFY6cvbCJ4GjjUzQmxDJurx5_1AbB7WUNi-i5SGiKzeAoKjbBMXs2PQ67TthMRpbKMFsosA0xrmVHWc1qEpIuwgIyf5qNRrQdgkOAxZbweC0gz6UVl6NRdTltFJvxue_yk08f16zOHZics2oCKfxOTRXkrYtQK865LQ0G4Ru_phte7ppM4r-O3RY2KMLHyvieB7uDWiJjfwbvkROJa6YdFjGULHyzwRA4',
  salaGru: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3goL5wftOE1Q0Jn3XW9wepLmafYnoLK6DG0YjeA4uu79aNRofuY5m6iNcrj7J8OJy0Rqnq9OiRlkMGV0DjgH2RuZ14npQyjdr3UG23hu3NuOZ2iB-bSlqPXf3DE7bTgQM4SpGr8wPmU01RDROxrJ8oYgCFT86iadh1A78x8cUAlHhanqcwYU1QFoMVuw_iB1_ch2Ys_hbzebLTtAkpK6sIrYifMIGkOw627Wts1p_6dxvqs9779JP_Q',
  bancone: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCshzopm2dyKZ8PdefKFqR9ZBGUEoyzGv2R7vGEG-8kbFVANGRA9mniz0XHX0R9PGjwciUfYqv8bU5IPxUr_tcONfT_mN7wiB0WMJIkfrSFaPRaRecsg0NM6noOmDFo28o5U5SuIAS7-iWvIkklfFscHsr9baK5kHJE0v5QRzhNNRtwYnBx4sl1HdW5myzqqP6fKxw0g-XeKUZOha0PKLRdDgzLBl3URQS1o800hmeELATtZOJWQkNzGA',
  terrazza: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdJCypoTXPCd2SHPvIppJP3_l3VpigEe2vEHsZnpVYx7A_ndDjeDjkGZCYi2KFLY--jaCMMJH2q7ini7mHTUSh8iknaRHJzHKpqH5ggjVTmcrlSNYonTBnbgelp4sxaUVg1s5hHjXZlx1Gf1P5WbAjEKWaertF2YkO7uR6xQcpyZG00Ep0RMp1wZUPCw-4WhCNNUIjKXbPrWcjZCXfKJerw86CoHmanym5aj4sCw4LSaaELlEmQ2Y6PQ',
  tagliata: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBI4a2J_hEgXqx9tWC1Y_TCI-U_Su4rKR1aXxThUwzEBco1V8WDFmc7Nkv_ZCgqPugR_1p0BWoVL7xHeH1NoTf0QLUVFfyVqcMYNTrDrGGVq_6WL3B1g8XdjLqyHXByZCjmf9gXfsCEJOfut8oNUJfzSkfr_hya7tua-Tml1ExesYI81m2fSyjaL1yWrfqVXCn11eHgpBEqmqA1P9YOGfwUxMbzH01Hi6PjZtXBrk7EB02u6eQg3R8lsU64h33vciahARo',
  brindisi: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFMk-u6y6gcaJAUNWnf1miWU_7qoHEL6mvrtpgLccl1y_s-rFZUQvmVMoiZLMwlV-AIOK8-KKvTanFlMKvBNUo-a1tqQydUPqWEpyqhsTuUSkISVShG44leGMAeTPilS-Xt5iDXquUAV5UnCIL95kZDT7rSts3E11xrwS3Nv3fOHlIOhEFM2nH-jcK5pmlha8EZyaDT2E72q-65VIqAbooHaPY5dHbFCtPGEjaaET2HKWWpkf-dMS7yQ',
  parking: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3vZX5e3ezCGJYX1SBAVjxi42efKQMEc7i4LIkCF7rbWkQQySwlNrmzsENT6Xa3TYjRHtm-yFfkMn_sFtgrM1GVzDo2VCzByIZIR5Rhydsm-Ui7IFnCLow7mQvvl7eimXksDa_gMvJ74sGD5KkCby15fi9edF_lv9JHKmqZwpgJIfTNCmkQWd0WnxG0O1txTwrhOUMS5G16gryTBLBeecE7_U6nLgWHOSQdLzSTO4pEM95BnpmaTCubQ',
  entrance: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAlc_iwTQyiGKMKuni_t3s_P6cCfUkQCWWax2Om4xmZo-S1LilaWg907tKLao9TCrH7NLl99KNBgUW2WsMa2Ml8coBscVHlegeI5TDrh7dYAHCwx7-iU5Oo0FQJAUHl38aoSCIeIhiWBpEktjg7aTgS1b9rj3w8usvKyb31N9FqLPZDChFpozDdpIkiCH9yyFlSaCBZmW-WJTWDOVpvN7nPZ8kNoJEZ_9_zagTFKDWz8LpxTwUlxIXqg',
  map: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlKVmcV3DshijIyVKKD-VmyXPbk5IoDnh7z69nD6nk_THcQZCSx1tRjgaLoYUfzkFoWmbCymaeA-6FJAxi4CtXoVObXVpg2VSXRAkUKfFDFkVwllNQWylyzfgtnN2UFUQLWmzCkslDawiK7o2fnhkIzXV_clXM0xOB5oaupRy5jwhQbW_Qe9cL9hpH_O9SORT7b4SnvwT41hmyS2tXhOn_raBoYzuflF67dFLRtT0PKzcK9rTzHfZ8g',
};

export const BEER_TAPS: MenuItem[] = [
  {
    id: 'tap-01',
    name: 'Dock Crane Pilsner',
    category: 'birre',
    price: '€ 6.00',
    description: 'La nostra bionda di punta. Bassa fermentazione, corpo limpido, note erbacee di luppolo nobile Saaz e finale secco dissetante.',
    specs: 'SPINA 01 • LAGER',
    abv: '5.0%',
    ibu: '32',
    beerStyle: 'German Pilsner',
    beerOrigin: 'Germania / Italia',
    tags: ['Best Seller', 'Pinta da Sete']
  },
  {
    id: 'tap-02',
    name: 'Harbor Fog West Coast IPA',
    category: 'birre',
    price: '€ 7.00',
    description: 'Un’esplosione di agrumi, resina di pino e pompelmo rosa. Amaro deciso e persistente, bilanciato da un leggero malto caramello.',
    specs: 'SPINA 02 • IPA',
    abv: '6.5%',
    ibu: '58',
    beerStyle: 'West Coast IPA',
    beerOrigin: 'Artigianale Brianza',
    tags: ['Luppolata', 'Iconica']
  },
  {
    id: 'tap-03',
    name: '1912 Industrial Stout (Cask Pump)',
    category: 'birre',
    price: '€ 6.50',
    description: 'Spillata a pompa tradizionale inglese. Schiuma compatta color cappuccino, aromi tostati di caffè d’orzo, cioccolato amaro e malto affumicato.',
    specs: 'SPINA 03 • STOUT',
    abv: '4.8%',
    ibu: '38',
    beerStyle: 'Dry Irish Stout',
    beerOrigin: 'Regno Unito',
    tags: ['Pompa Tradizionale', 'Corposa']
  },
  {
    id: 'tap-04',
    name: 'Abbazia di Molo Tripel',
    category: 'birre',
    price: '€ 7.50',
    description: 'Belga dorata ad alta gradazione. Note speziate di coriandolo, frutta a pasta gialla matura e un calore avvolgente con chiusura asciutta.',
    specs: 'SPINA 04 • TRIPEL',
    abv: '8.5%',
    ibu: '26',
    beerStyle: 'Belgian Tripel',
    beerOrigin: 'Belgio',
    tags: ['Ad Alta Gradazione', 'Da Meditazione']
  },
  {
    id: 'tap-05',
    name: 'Red Quay Amber Ale',
    category: 'birre',
    price: '€ 6.50',
    description: 'Rossa d’ispirazione scozzese. Malti tostati, toffee, biscotto croccante e lieve luppolatura terrosa. Ideale con i nostri burger.',
    specs: 'SPINA 05 • RED ALE',
    abv: '5.4%',
    ibu: '24',
    beerStyle: 'Irish Red Ale',
    beerOrigin: 'Irlanda',
    tags: ['Maltata', 'Equilibrata']
  },
  {
    id: 'tap-06',
    name: 'Bavarian Dock Weizen',
    category: 'birre',
    price: '€ 6.50',
    description: 'Birra di frumento naturalmente torbida. Schiuma monumentale, sentori caratteristici di banana matura e chiodi di garofano.',
    specs: 'SPINA 06 • WEISS',
    abv: '5.3%',
    ibu: '14',
    beerStyle: 'Hefeweizen',
    beerOrigin: 'Baviera',
    tags: ['Fresca', 'Frumento']
  },
  {
    id: 'tap-07',
    name: 'Riveted Double IPA',
    category: 'birre',
    price: '€ 8.00',
    description: 'Luppolatura mastodontica a freddo (Dry Hopping Citra & Mosaic). Sentori di mango, papaya e resina con amaro tagliente e pulito.',
    specs: 'SPINA 07 • DIPA',
    abv: '8.0%',
    ibu: '75',
    beerStyle: 'Double IPA',
    beerOrigin: 'Artigianale Craft',
    tags: ['Rock Puro', 'Intensa']
  },
  {
    id: 'tap-08',
    name: 'Cantù Session Pale Ale',
    category: 'birre',
    price: '€ 6.00',
    description: 'Session birra da bere a litri. Leggera nella gradazione ma ricca di profumi estivi, mandarino e melone bianco.',
    specs: 'SPINA 08 • SESSION',
    abv: '4.2%',
    ibu: '30',
    beerStyle: 'Session IPA',
    beerOrigin: 'Italia',
    tags: ['Facile Beva', 'Dissetante']
  },
  {
    id: 'tap-09',
    name: 'Bruxelles Sour Cherry Kriek',
    category: 'birre',
    price: '€ 7.50',
    description: 'Fermentazione spontanea con vere ciliegie morette. Gusto piacevolmente acidulo, fruttato e tagliente.',
    specs: 'SPINA 09 • SOUR',
    abv: '5.8%',
    ibu: '10',
    beerStyle: 'Fruit Lambic / Kriek',
    beerOrigin: 'Belgio',
    tags: ['Acida', 'Gourmet']
  },
  {
    id: 'tap-10',
    name: 'Dockside Blanche Agrumi & Coriandolo',
    category: 'birre',
    price: '€ 6.00',
    description: 'Birra bianca al frumento e avena non maltata. Arricchita con scorze di arancia amara di Sicilia e coriandolo pestato al mortaio.',
    specs: 'SPINA 10 • BLANCHE',
    abv: '4.9%',
    ibu: '15',
    beerStyle: 'Belgian Witbier',
    beerOrigin: 'Belgio',
    tags: ['Agrumata', 'Estiva']
  },
  {
    id: 'tap-11',
    name: 'Smoked Porter del Molo',
    category: 'birre',
    price: '€ 7.00',
    description: 'Malti affumicati su legno di faggio. Note di cioccolato fondente 80% e sentori legnosi che sposano le nostre costine glassate.',
    specs: 'SPINA 11 • PORTER',
    abv: '6.2%',
    ibu: '35',
    beerStyle: 'Smoked Porter',
    beerOrigin: 'Artigianale',
    tags: ['Affumicata', 'Da Griglia']
  },
  {
    id: 'tap-12',
    name: 'Hell Cantù Unfiltered',
    category: 'birre',
    price: '€ 5.50',
    description: 'Bavarese rustica non filtrata. Vellutata al palato, profumo di cereale appena mietuto e crosta di pane dorata.',
    specs: 'SPINA 12 • KELLER',
    abv: '5.1%',
    ibu: '20',
    beerStyle: 'Kellerbier',
    beerOrigin: 'Franconia',
    tags: ['Non Filtrata', 'Tradizionale']
  },
  {
    id: 'tap-13',
    name: 'Black IPA Cantiere Notturno',
    category: 'birre',
    price: '€ 7.50',
    description: 'Il colore di una stout, il cuore selvaggio di una IPA. Luppoli americani Simcoe e Cascade su base di malto Carafa III decorticato.',
    specs: 'SPINA 13 • BLACK IPA',
    abv: '6.8%',
    ibu: '65',
    beerStyle: 'Cascadian Dark Ale',
    beerOrigin: 'Craft Selection',
    tags: ['Oscura & Luppolata', 'Edizione Limitata']
  },
  {
    id: 'tap-14',
    name: 'Hard Cider Mele Brianza & Normandia',
    category: 'birre',
    price: '€ 6.00',
    description: 'Sidro naturale di mele selezionate. Secco, frizzante, profumato e completamente Gluten Free.',
    specs: 'SPINA 14 • SIDRO',
    abv: '5.0%',
    ibu: '0',
    beerStyle: 'Craft Apple Cider',
    beerOrigin: 'Gluten Free',
    tags: ['Gluten Free', 'Dissetante']
  }
];

export const FOOD_MENU: MenuItem[] = [
  // PIZZE 48H
  {
    id: 'pz-01',
    name: 'Margherita Verace del Molo',
    category: 'pizze',
    price: '€ 8.50',
    description: 'Pomodoro San Marzano DOP, fior di latte fresco a km zero, basilico fresco del nostro orto e olio EVO pugliese a crudo.',
    specs: 'LIEVITAZIONE 48H',
    tags: ['Classico', 'Vegetariano']
  },
  {
    id: 'pz-02',
    name: 'La Canturina (Speciale Dock 71)',
    category: 'pizze',
    price: '€ 12.00',
    description: 'Mozzarella, salsiccia nostrana di Cantù sgranata a mano, friarielli saltati al peperoncino, crema di caciocavallo silano e tarallo sbriciolato.',
    specs: 'FARINA A PIETRA',
    tags: ['Specialità della Casa', 'Piccante Leggero']
  },
  {
    id: 'pz-03',
    name: 'Diavola Rock & Chili',
    category: 'pizze',
    price: '€ 10.50',
    description: 'Pomodoro San Marzano, fior di latte, ventricina calabra piccante, nduja di Spilinga e gocce di miele millefiori piccante.',
    specs: 'ROCK VIBES',
    tags: ['Piccante']
  },
  {
    id: 'pz-04',
    name: 'Fumè & Noci del Cantiere',
    category: 'pizze',
    price: '€ 12.50',
    description: 'Fior di latte, provola affumicata campana, speck trentino IGP croccante, gherigli di noci tostate e crema di gorgonzola dolce DOP.',
    specs: 'CORPOSA',
    tags: ['Malt Pairing: Amber Ale']
  },
  {
    id: 'pz-05',
    name: 'Bufala & Pomodorini Confit',
    category: 'pizze',
    price: '€ 11.50',
    description: 'Base bianca con pomodorini datterini confit cotti lentamente a bassa temperatura, mozzarella di bufala campana DOP a crudo e pesto di basilico.',
    specs: 'FRESCA',
    tags: ['Vegetariano']
  },
  {
    id: 'pz-06',
    name: 'Calzone Fritto o al Forno "Gru 1912"',
    category: 'pizze',
    price: '€ 11.00',
    description: 'Ripieno di ricotta fresca mantecata al pepe nero, provola affumicata, salame Napoli a fette spesse e pomodoro.',
    specs: 'MAXI CALZONE',
    tags: ['Ricco']
  },

  // BURGER GOURMET
  {
    id: 'bg-01',
    name: 'Bacon Cheese Supreme 200g',
    category: 'burger',
    price: '€ 14.50',
    description: 'Patty di manzo 100% selezionato da pascolo italiano, triplo cheddar stagionato fuso, quadruplo bacon artigianale croccante, cipolla caramellata alla birra Stout e salsa Dock segreta. Servito con patate rustiche.',
    specs: 'BEEF 200G',
    tags: ['Campione di Incassi', 'Con Patate']
  },
  {
    id: 'bg-02',
    name: 'The Dock Monster 300g (Doppio Smash)',
    category: 'burger',
    price: '€ 17.50',
    description: 'Doppio patty da 150g battuto al coltello alla piastra, doppio bacon, scamorza affumicata fusa, anelli di cipolla dorati, salsa BBQ home-made.',
    specs: 'NON TI BASTA MAI!',
    tags: ['Super Energetico', 'Con Patate']
  },
  {
    id: 'bg-03',
    name: 'Pulled Pork Brianza Smoke',
    category: 'burger',
    price: '€ 13.50',
    description: 'Spalla di maiale marinata per 18 ore con rub speziato e affumicata lentamente con legno di melo, coleslaw di cavolo cappuccio fresco e salsa barbecue alla mela.',
    specs: 'LOW & SLOW 14H',
    tags: ['Affumicato a Legno', 'Con Patate']
  },
  {
    id: 'bg-04',
    name: 'Green Dock Vegan Burger',
    category: 'burger',
    price: '€ 13.00',
    description: 'Patty vegetale artigianale di ceci, funghi porcini e barbabietola, maionese vegana al lime, fette di pomodoro cuore di bue e rucola selvatica.',
    specs: '100% VEGAN',
    tags: ['Vegan', 'Con Patate']
  },

  // GRIGLIA & CARNI ALLA BRACE
  {
    id: 'gr-01',
    name: 'Tagliata di Manzo Black Angus alla Brace (300g)',
    category: 'griglia',
    price: '€ 21.00',
    description: 'Cotta su griglia a pietra lavica ad altissima temperatura. Servita con sale grosso Maldon affumicato, olio al rosmarino e patate al forno dorate.',
    specs: 'BLACK ANGUS',
    tags: ['Cottura al Sangue o Media', 'Top Quality']
  },
  {
    id: 'gr-02',
    name: 'Costine di Maiale BBQ Glassate al Miele (500g)',
    category: 'griglia',
    price: '€ 16.50',
    description: 'Cottura lenta fino a quando la carne si stacca dall’osso con una forchetta. Glassatura brillante al miele di castagno e salsa chili affumicata.',
    specs: 'FALL OFF THE BONE',
    tags: ['Da Mangiare con le Mani']
  },
  {
    id: 'gr-03',
    name: 'Grigliata Mista del Molo (x2 Persone)',
    category: 'griglia',
    price: '€ 38.00',
    description: 'Tagliata di manzo, costine di maiale glassate, salamella di Cantù alla brace e spiedini rustici di pollo marinato al limone ed erbe.',
    specs: 'PER 2 PERSONE',
    tags: ['Condivisione', 'Best Value']
  },

  // SFIZI DA CONDIVIDERE
  {
    id: 'sf-01',
    name: 'Alette di Pollo Rock Piccanti (8pz)',
    category: 'sfizi',
    price: '€ 8.50',
    description: 'Marinate con salsa hot Louisiana e cotte al forno fino a perfetta croccantezza. Servite con salsa al blue cheese rinfrescante.',
    specs: 'SHARING',
    tags: ['Piccante']
  },
  {
    id: 'sf-02',
    name: 'Patate Rustiche al Cartoccio con Buccia',
    category: 'sfizi',
    price: '€ 5.50',
    description: 'Spicchi dorati serviti caldissimi con trio di salse della casa: maionese all’aglio dolce, ketchup speziato e salsa Dock.',
    specs: 'SHARING',
    tags: ['Vegetariano']
  },
  {
    id: 'sf-03',
    name: 'Anelli di Cipolla Dorati alla Birra Pilsner',
    category: 'sfizi',
    price: '€ 6.50',
    description: 'Cipolle dolci tagliate spesse, passate in pastella croccante preparata con la nostra Pilsner alla spina.',
    specs: 'CRUNCHY',
    tags: ['Vegetariano']
  },

  // DOLCI PUB
  {
    id: 'dl-01',
    name: 'Birramisù Artigianale alla Stout',
    category: 'dolci',
    price: '€ 6.00',
    description: 'Savoiardi artigianali bagnati nella nostra 1912 Industrial Stout spillata a pompa, crema al mascarpone montata soffice e cacao amaro 100%.',
    specs: 'SPECIALITÀ DOCK',
    tags: ['Fatto in Casa']
  },
  {
    id: 'dl-02',
    name: 'Cheesecake al Forno con Coulis ai Frutti di Bosco',
    category: 'dolci',
    price: '€ 6.00',
    description: 'Ricetta newyorkese con base biscottata croccante e coulis fresca acidula di lamponi e mirtilli della Brianza.',
    specs: 'HOMEMADE',
    tags: ['Fatto in Casa']
  },

  // MENÙ LUNCH (PRANZO DI LAVORO LUN-VEN)
  {
    id: 'pr-01',
    name: 'Formula Lunch Pizza & Spina',
    category: 'lunch',
    price: '€ 12.00',
    description: 'Qualsiasi pizza classica o speciale del giorno a scelta + bevanda (o birra piccola alla spina) + acqua microfiltrata + caffè espresso + coperto incluso.',
    specs: 'MENÙ LUNCH • LUN-VEN 12:00-14:30',
    tags: ['Tutto Incluso', 'Servizio Rapido']
  },
  {
    id: 'pr-02',
    name: 'Formula Lunch Burger & Griglia',
    category: 'lunch',
    price: '€ 14.00',
    description: 'Burger artigianale con patate rustiche o tagliata di pollo/manzo alla brace con contorno del giorno + bibita/birra piccola + acqua + caffè + coperto.',
    specs: 'MENÙ LUNCH • LUN-VEN 12:00-14:30',
    tags: ['Piatto Unico', 'Completo']
  },
  {
    id: 'pr-03',
    name: 'Formula Lunch Primo & Secondo del Molo',
    category: 'lunch',
    price: '€ 13.00',
    description: 'Primo piatto espresso della cucina + secondo del giorno con contorno fresco di stagione + pane artigianale, acqua microfiltrata e caffè.',
    specs: 'MENÙ LUNCH • LUN-VEN 12:00-14:30',
    tags: ['Cucina Espressa', 'Equilibrato']
  },
  {
    id: 'pr-04',
    name: 'Insalatona Portuale Fit & Leggera',
    category: 'lunch',
    price: '€ 11.00',
    description: 'Maxi insalata con straccetti di pollo grigliato o tonno, scaglie di Grana, crostini al rosmarino, pomodorini confit + acqua + caffè + focaccia.',
    specs: 'MENÙ LUNCH • LUN-VEN 12:00-14:30',
    tags: ['Light', 'Sano']
  }
];

export const MATCHES_SCHEDULE: MatchEvent[] = [
  {
    id: 'match-1',
    date: 'Mercoledì 11 Novembre',
    time: '21:00',
    competition: 'UEFA Champions League',
    match: 'Inter vs Arsenal',
    teams: ['Inter', 'Arsenal'],
    screen: 'Big Match europeo in diretta su Maxischermo con cucina e birreria attive',
    description: 'Big Match europeo in diretta su Maxischermo con cucina e birreria attive',
    status: 'filling_fast',
    sport: 'calcio'
  },
  {
    id: 'match-2',
    date: 'Giovedì 12 Novembre',
    time: '20:30',
    competition: 'Eurolega Basket',
    match: 'Olimpia Milano vs Real Madrid',
    teams: ['Olimpia Milano', 'Real Madrid'],
    screen: 'Sfida di Eurolega in diretta integrale accompagnata dalle nostre birre artigianali',
    description: 'Sfida di Eurolega in diretta integrale accompagnata dalle nostre birre artigianali',
    status: 'available',
    sport: 'basket'
  },
  {
    id: 'match-3',
    date: 'Domenica 15 Novembre',
    time: '20:45',
    competition: 'Serie A TIM',
    match: 'Juventus vs Milan',
    teams: ['Juventus', 'Milan'],
    screen: 'Posticipo di Serie A in diretta con burger gourmet e pizze a lunga lievitazione',
    description: 'Posticipo di Serie A in diretta con burger gourmet e pizze a lunga lievitazione',
    status: 'recommended',
    sport: 'calcio'
  },
  {
    id: 'match-4',
    date: 'Sabato 21 Novembre',
    time: '15:15',
    competition: 'Autumn Nations Series Rugby',
    match: 'Italia vs Nuova Zelanda (All Blacks)',
    teams: ['Italia', 'All Blacks'],
    screen: 'Grande pomeriggio di Rugby internazionale e Terzo Tempo al Dock 71',
    description: 'Grande pomeriggio di Rugby internazionale e Terzo Tempo al Dock 71',
    status: 'filling_fast',
    sport: 'rugby'
  }
];

export const GALLERY_ITEMS: GalleryImage[] = [
  {
    id: 'gal-1',
    url: PUB_IMAGES.tagliata,
    title: 'Tagliata alla Griglia & Birra Scura',
    category: 'cucina',
    badge: 'VIENI DI GUSTO!',
    caption: 'Manzo Black Angus cotto a pietra lavica e pinta spillata a regola d’arte.'
  },
  {
    id: 'gal-2',
    url: PUB_IMAGES.pizza,
    title: 'Margherita Verace 48 Ore',
    category: 'cucina',
    badge: 'IL PIACERE È TUTTO VOSTRO',
    caption: 'Farine a pietra macinate con cura e cornicione alveolato ad alta digeribilità.'
  },
  {
    id: 'gal-3',
    url: PUB_IMAGES.burger,
    title: 'Bacon Cheese Supreme',
    category: 'cucina',
    badge: 'NON TI BASTA MAI!',
    caption: 'Cheddar cremoso fuso, bacon artigianale croccante e patty battuto al coltello.'
  },
  {
    id: 'gal-4',
    url: PUB_IMAGES.beerGlass,
    title: 'Pinta Artigianale alla Spina',
    category: 'birre',
    badge: 'NON È PER TUTTI!',
    caption: '14 spine attive a rotazione continua tra cask inglesi, IPA e belghe d’abbazia.'
  },
  {
    id: 'gal-5',
    url: PUB_IMAGES.salaGru,
    title: 'La Monumentale Gru del 1912',
    category: 'locale',
    badge: 'PATRIMONIO CANTÙ',
    caption: 'Cene indimenticabili sotto l’imponente gigante d’acciaio e ferro rivettato.'
  },
  {
    id: 'gal-6',
    url: PUB_IMAGES.bancone,
    title: 'Il Grande Bancone in Ottone',
    category: 'birre',
    badge: '14 BRASS TAPS',
    caption: 'Atmosfera autentica da pub britannico con 30 comode sedute per la degustazione.'
  },
  {
    id: 'gal-7',
    url: PUB_IMAGES.terrazza,
    title: 'La Terrazza Estiva Sotto le Stelle',
    category: 'terrazza',
    badge: 'DEHORS ESTIVO',
    caption: '40 posti all’aperto illuminati da luci vintage con servizio al tavolo puntuale.'
  },
  {
    id: 'gal-8',
    url: PUB_IMAGES.brindisi,
    title: 'Brindisi e Serate Conviviali',
    category: 'locale',
    badge: 'ROCK & ROLL',
    caption: 'Compleanni, cene tra colleghi e serate speciali: il molo di Cantù è festa viva.'
  },
  {
    id: 'gal-9',
    url: PUB_IMAGES.parking,
    title: 'Parcheggio Riservato Gratuito 50+ Posti',
    category: 'locale',
    badge: 'PARKING FREE',
    caption: 'Ampio piazzale illuminato e videosorvegliato di fronte e sul retro del locale.'
  }
];

export const PUB_ROOMS = [
  {
    id: 'sala-gru',
    name: 'La Sala Gru',
    tag: 'BAY 01 • 100 POSTI',
    featureBadge: 'GRU ACCIAIO',
    icon: 'precision_manufacturing',
    description: 'Il cuore pulsante del locale, dominato dalla maestosa gru originaria in ferro battuto del 1912. Lo spazio ideale per cene con amici, comitive numerose, compleanni e per godersi le partite di cartello su maxischermo.',
    spec1: 'Maxischermo HD Centrale 120"',
    spec2: 'Tavoli Grandi per Gruppi',
    image: PUB_IMAGES.salaGru
  },
  {
    id: 'bancone',
    name: 'Il Grande Bancone',
    tag: 'BAY 02 • 30 SEDUTE',
    featureBadge: '14 BRASS TAPS',
    icon: 'sports_bar',
    description: 'Autentica atmosfera pub d’oltremanica. Sgabelli comodi in cuoio, dialogo continuo con i nostri mastri spillatori, spine lucenti in ottone e pinte spillate secondo il disciplinare di ogni birrificio.',
    spec1: '14 Spine Artigianali a Rotazione',
    spec2: 'Beer Tasting & Chiacchiera',
    image: PUB_IMAGES.bancone
  },
  {
    id: 'terrazza',
    name: 'La Terrazza Estiva',
    tag: 'BAY 03 • 40 POSTI',
    featureBadge: 'DEHORS ESTIVO',
    icon: 'deck',
    description: 'Il dehors perfetto per le tiepide serate estive e primaverili. Luci vintage a filari, servizio al tavolo celere e rilassante brezza estiva sotto il cielo di Cantù lontano dal caos cittadino.',
    spec1: 'All’Aperto & Zona Riservata',
    spec2: 'Open Air Vibes',
    image: PUB_IMAGES.terrazza
  }
];
