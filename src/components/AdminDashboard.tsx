import React, { useState } from 'react';
import {
  useSiteData,
  DynamicMenuItem,
  SeasonalMenuConfig,
  CustomCategory,
  DynamicMatchEvent,
  DynamicGalleryItem,
  BookingRecord,
  BookingStatus,
  ContactRecord,
  ContactStatus,
  buildDock71EmailTemplate
} from '../context/SiteDataContext';
import { optimizeAndUploadImage, OptimizedImageResult } from '../utils/imageOptimizer';

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToSite }) => {
  // Autenticazione (PDF Pagine 1 e 5)
  const [authStep, setAuthStep] = useState<'credentials' | 'totp' | 'logged_in'>('credentials');
  const [username, setUsername] = useState('assistenza@arimediagroup.it');
  const [password, setPassword] = useState('Sd)h3zCr9/A,uA<L3J,J');
  const [totpCode, setTotpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Navigazione principale suddivisa chiaramente in 4 macro-aree
  const [mainTab, setMainTab] = useState<'menu' | 'gallery' | 'sports' | 'forms'>('menu');

  // Sotto-navigazione per Menù & Birre
  const [menuSubTab, setMenuSubTab] = useState<'items' | 'categories' | 'seasonal'>('items');

  // Sotto-navigazione per Invii Form, Analytics & Consensi
  const [formSubTab, setFormSubTab] = useState<'analytics' | 'bookings' | 'contacts' | 'consents'>('bookings');

  // Context dati centralizzato
  const {
    menuItems,
    seasonalMenus,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStatus,
    reorderMenuItems,
    addCategory,
    updateCategory,
    deleteCategory,
    addSeasonalMenu,
    updateSeasonalMenu,
    deleteSeasonalMenu,
    addSeasonalDish,
    removeSeasonalDish,
    matches,
    addMatch,
    updateMatch,
    deleteMatch,
    toggleMatchStatus,
    galleryItems,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    bookings,
    updateBookingStatus,
    deleteBooking,
    deleteBookingsBulk,
    contacts,
    replyToContact,
    markContactStatus,
    deleteContact,
    deleteContactsBulk,
    consents,
    deleteConsentLog,
    deleteConsentLogsBulk,
    sentEmails,
    resetToDefaults
  } = useSiteData();

  // Stati Drag and Drop per riordinare i prodotti
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState<number | null>(null);

  // Filtro categoria prodotti nel backend
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Selezione menù stagionale attivo per gestione piatti
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(
    seasonalMenus[0]?.id || ''
  );

  // Modali di creazione/modifica
  const [editingItem, setEditingItem] = useState<DynamicMenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<CustomCategory | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingSeason, setEditingSeason] = useState<SeasonalMenuConfig | null>(null);
  const [isSeasonModalOpen, setIsSeasonModalOpen] = useState(false);

  const [isSeasonDishModalOpen, setIsSeasonDishModalOpen] = useState(false);

  const [editingMatch, setEditingMatch] = useState<DynamicMatchEvent | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const [editingGallery, setEditingGallery] = useState<DynamicGalleryItem | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  // Stato upload nativo immagine
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  // Form states per Prodotto
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<string>('pizze');
  const [formPrice, setFormPrice] = useState('€ 12.00');
  const [formDescription, setFormDescription] = useState('');
  const [formSpecs, setFormSpecs] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formSeasonalId, setFormSeasonalId] = useState<string>('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);

  // Form states per Categoria
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catIcon, setCatIcon] = useState('restaurant');
  const [catDesc, setCatDesc] = useState('');

  // Form states per Stagione
  const [seasonName, setSeasonName] = useState('');
  const [seasonType, setSeasonType] = useState<'inverno' | 'primavera' | 'estate' | 'autunno' | 'speciale'>('speciale');
  const [seasonStart, setSeasonStart] = useState('2026-11-01');
  const [seasonEnd, setSeasonEnd] = useState('2027-04-30');
  const [seasonNotice, setSeasonNotice] = useState('');
  const [seasonBadge, setSeasonBadge] = useState('SPECIALE INVERNO');

  // Form states per Foto Galleria
  const [galTitle, setGalTitle] = useState('');
  const [galUrl, setGalUrl] = useState('');
  const [galCategory, setGalCategory] = useState<'cucina' | 'birre' | 'locale' | 'terrazza' | 'pizza' | 'burger' | 'community'>('locale');
  const [galBadge, setGalBadge] = useState('DOCK 71 SCATTO');
  const [galCaption, setGalCaption] = useState('');
  const [galFormat, setGalFormat] = useState<'webp' | 'avif' | 'jpg' | 'png'>('webp');

  // Form states per Evento Sportivo
  const [matchTeams, setMatchTeams] = useState('Inter vs Juventus');
  const [matchCompetition, setMatchCompetition] = useState('Serie A Enilive');
  const [matchDate, setMatchDate] = useState('Domenica 29 Nov');
  const [matchTime, setMatchTime] = useState('20:45');
  const [matchSport, setMatchSport] = useState<'calcio' | 'rugby' | 'basket' | 'motori'>('calcio');
  const [matchDescription, setMatchDescription] = useState('Diretta su Maxischermo con cucina e birreria attive');
  const [matchBeer, setMatchBeer] = useState('Dock Crane Pilsner');
  const [matchTables, setMatchTables] = useState(4);
  const [matchStatus, setMatchStatus] = useState<'recommended' | 'filling_fast' | 'available'>('recommended');

  // ==========================================================================
  // STATI CRM: FILTRI, SELEZIONE IN MASSA, RISPOSTA CONTATTI & EMAIL PRENOTAZIONI
  // ==========================================================================
  // Notifica azione CRM
  const [crmNotification, setCrmNotification] = useState<{
    message: string;
    emailHtml?: string;
    emailSubject?: string;
    emailRecipient?: string;
  } | null>(null);

  // Filtri Prenotazioni
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | BookingStatus>('all');
  const [bookingAreaFilter, setBookingAreaFilter] = useState<string>('all');
  const [bookingDateFilter, setBookingDateFilter] = useState<string>('');

  // Filtri Messaggi Contatti
  const [contactSearch, setContactSearch] = useState('');
  const [contactStatusFilter, setContactStatusFilter] = useState<'all' | ContactStatus>('all');
  const [contactSourceFilter, setContactSourceFilter] = useState<string>('all');

  // Filtri Consensi GDPR
  const [consentSearch, setConsentSearch] = useState('');
  const [consentTypeFilter, setConsentTypeFilter] = useState<'all' | 'analytics' | 'marketing' | 'technical_only'>('all');
  const [consentSourceFilter, setConsentSourceFilter] = useState<string>('all');

  // Selezione in massa (IDs selezionati)
  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [selectedConsentIds, setSelectedConsentIds] = useState<string[]>([]);

  // Modale Risposta Messaggio Contatto (dal pannello)
  const [replyingContact, setReplyingContact] = useState<ContactRecord | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');

  // Modale Rifiuto Prenotazione con Motivazione Ristoratore
  const [rejectingBooking, setRejectingBooking] = useState<BookingRecord | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Modale Anteprima Email Inviata al Cliente (Layout Dock 71)
  const [emailPreviewModal, setEmailPreviewModal] = useState<{
    subject: string;
    recipient: string;
    html: string;
  } | null>(null);

  // Logiche di filtraggio Prenotazioni
  const filteredBookings = bookings.filter((b) => {
    const q = bookingSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.notes.toLowerCase().includes(q);
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    const matchesArea = bookingAreaFilter === 'all' || b.area.toLowerCase().includes(bookingAreaFilter.toLowerCase());
    const matchesDate = !bookingDateFilter || b.date === bookingDateFilter;
    return matchesSearch && matchesStatus && matchesArea && matchesDate;
  });

  // Logiche di filtraggio Messaggi Contatti
  const filteredContacts = contacts.filter((c) => {
    const q = contactSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    const matchesStatus = contactStatusFilter === 'all' || c.status === contactStatusFilter;
    const matchesSource = contactSourceFilter === 'all' || c.source === contactSourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Logiche di filtraggio Consensi GDPR
  const filteredConsents = consents.filter((log) => {
    const q = consentSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      log.id.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q) ||
      log.userAgent.toLowerCase().includes(q) ||
      log.purposes.some((p) => p.toLowerCase().includes(q));
    const matchesType =
      consentTypeFilter === 'all' ||
      (consentTypeFilter === 'analytics' && log.analyticsAccepted) ||
      (consentTypeFilter === 'marketing' && log.marketingAccepted) ||
      (consentTypeFilter === 'technical_only' && !log.analyticsAccepted && !log.marketingAccepted);
    const matchesSource = consentSourceFilter === 'all' || log.source === consentSourceFilter;
    return matchesSearch && matchesType && matchesSource;
  });

  // Calcolo Statistiche & Analytics in Tempo Reale
  const totalBookingsCount = bookings.length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'Confermato').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'In Attesa').length;
  const rejectedBookingsCount = bookings.filter((b) => b.status === 'Rifiutato').length;
  const totalGuestsBooked = bookings
    .filter((b) => b.status !== 'Rifiutato')
    .reduce((acc, b) => acc + (Number(b.guests) || 0), 0);
  const avgGuestsPerBooking =
    totalBookingsCount > 0
      ? (bookings.reduce((acc, b) => acc + (Number(b.guests) || 0), 0) / totalBookingsCount).toFixed(1)
      : '0';
  const confirmationRate =
    totalBookingsCount > 0 ? Math.round((confirmedBookingsCount / totalBookingsCount) * 100) : 0;

  const totalContactsCount = contacts.length;
  const repliedContactsCount = contacts.filter((c) => c.status === 'Risposto').length;
  const newContactsCount = contacts.filter((c) => c.status === 'Nuovo').length;
  const contactReplyRate =
    totalContactsCount > 0 ? Math.round((repliedContactsCount / totalContactsCount) * 100) : 0;

  const totalConsentsCount = consents.length;
  const analyticsConsentsCount = consents.filter((c) => c.analyticsAccepted).length;
  const marketingConsentsCount = consents.filter((c) => c.marketingAccepted).length;
  const technicalOnlyConsentsCount = consents.filter((c) => !c.analyticsAccepted && !c.marketingAccepted).length;
  const analyticsConsentRate =
    totalConsentsCount > 0 ? Math.round((analyticsConsentsCount / totalConsentsCount) * 100) : 0;
  const marketingConsentRate =
    totalConsentsCount > 0 ? Math.round((marketingConsentsCount / totalConsentsCount) * 100) : 0;

  // Azione: Conferma immediata prenotazione con invio email automatica
  const handleConfirmBookingWithEmail = (b: BookingRecord) => {
    const sent = updateBookingStatus(b.id, 'Confermato');
    if (sent) {
      setCrmNotification({
        message: `Prenotazione ${b.bookingCode} (${b.name}) CONFERMATA! Email automatica inviata a ${sent.toEmail}.`,
        emailHtml: sent.htmlContent,
        emailSubject: sent.subject,
        emailRecipient: `${b.name} <${sent.toEmail}>`
      });
    }
  };

  // Azione: Apri modale rifiuto prenotazione per inserire la motivazione
  const openRejectBookingModal = (b: BookingRecord) => {
    setRejectingBooking(b);
    setRejectionReason(
      b.rejectionReason ||
        'Siamo spiacenti, per la fascia oraria richiesta tutti i tavoli nella sala indicata risultano già prenotati. Saremmo felici di ospitarvi a un orario alternativo (es. 19:30 o 21:45).'
    );
  };

  // Azione: Conferma rifiuto prenotazione e invia email con motivazione
  const handleSendRejectionEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingBooking || !rejectionReason.trim()) return;
    const sent = updateBookingStatus(rejectingBooking.id, 'Rifiutato', rejectionReason.trim());
    if (sent) {
      setCrmNotification({
        message: `Prenotazione ${rejectingBooking.bookingCode} (${rejectingBooking.name}) RIFIUTATA. Email con motivazione inviata a ${sent.toEmail}.`,
        emailHtml: sent.htmlContent,
        emailSubject: sent.subject,
        emailRecipient: `${rejectingBooking.name} <${sent.toEmail}>`
      });
    }
    setRejectingBooking(null);
    setRejectionReason('');
  };

  // Azione: Apri modale risposta messaggio contatto
  const openReplyContactModal = (c: ContactRecord) => {
    setReplyingContact(c);
    setReplySubject(`Re: ${c.subject}`);
    setReplyBody(
      c.replyMessage ||
        `Ciao ${c.name},\ngrazie per aver contattato Dock 71 Cantù!\n\nIn merito alla tua richiesta ("${c.subject}"), ti confermiamo la nostra disponibilità. Restiamo a tua disposizione al numero 031 4487120 o direttamente al molo in Via Milano 71.\n\nA presto,\nLo Staff di Dock 71 Cantù`
    );
  };

  // Azione: Invia risposta contatto dal pannello e imposta stato su "Risposto"
  const handleSendContactReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingContact || !replyBody.trim()) return;
    const sent = replyToContact(replyingContact.id, replySubject.trim(), replyBody.trim());
    if (sent) {
      setCrmNotification({
        message: `Risposta inviata con successo a ${replyingContact.name} (${sent.toEmail}). Stato aggiornato in "Risposto".`,
        emailHtml: sent.htmlContent,
        emailSubject: sent.subject,
        emailRecipient: `${replyingContact.name} <${sent.toEmail}>`
      });
    }
    setReplyingContact(null);
    setReplySubject('');
    setReplyBody('');
  };

  // Gestione Credenziali (Fase 1)
  const handleCheckCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'assistenza@arimediagroup.it' && password === 'Sd)h3zCr9/A,uA<L3J,J') {
      setErrorMsg(null);
      setAuthStep('totp');
    } else {
      setErrorMsg('Credenziali errate. Usa assistenza@arimediagroup.it');
    }
  };

  // Gestione TOTP (Fase 2)
  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length === 6) {
      setErrorMsg(null);
      setAuthStep('logged_in');
    } else {
      setErrorMsg('Inserisci un codice valido a 6 cifre (es. 712063).');
    }
  };

  // ==========================================================================
  // DRAG & DROP PRODOTTI CON IL MOUSE
  // ==========================================================================
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedItemIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverItemIndex !== index) {
      setDragOverItemIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
      setDraggedItemIndex(null);
      setDragOverItemIndex(null);
      return;
    }

    const updated = [...menuItems];
    const [movedItem] = updated.splice(draggedItemIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    reorderMenuItems(updated);
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleMoveStep = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= menuItems.length) return;
    const updated = [...menuItems];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    reorderMenuItems(updated);
  };

  // ==========================================================================
  // UPLOAD NATIVO IMMAGINE (CONVERSIONE AUTOMATICA WEBP / AVIF)
  // ==========================================================================
  const handleNativeFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string, format: 'webp' | 'avif') => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadFeedback('Compressione e conversione automatica WebP/AVIF in corso...');

    try {
      const res: OptimizedImageResult = await optimizeAndUploadImage(file, {
        targetFormat: 'webp',
        quality: 0.85
      });

      onSuccess(res.url, res.format);
      setUploadFeedback(
        `✓ Immagine ottimizzata con successo! Risparmio peso: -${res.savedPercentage}% (${Math.round(res.originalSize / 1024)}KB → ${Math.round(res.compressedSize / 1024)}KB)`
      );
      setTimeout(() => setUploadFeedback(null), 5000);
    } catch (err) {
      console.error('Errore conversione:', err);
      setUploadFeedback('Errore durante l\'ottimizzazione dell\'immagine');
    } finally {
      setIsUploading(false);
    }
  };

  // ==========================================================================
  // MODALE PRODOTTI
  // ==========================================================================
  const openItemModal = (item?: DynamicMenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormName(item.name);
      setFormCategory(item.category);
      setFormPrice(item.price);
      setFormDescription(item.description);
      setFormSpecs(item.specs || '');
      setFormImage(item.image || '');
      setFormSeasonalId(item.seasonalMenuId || '');
      setFormStartDate(item.publishStartDate || '');
      setFormEndDate(item.publishEndDate || '');
      setFormIsActive(item.isActive !== false);
    } else {
      setEditingItem(null);
      setFormName('');
      setFormCategory(categories[0]?.slug || 'pizze');
      setFormPrice('€ 12.00');
      setFormDescription('');
      setFormSpecs('');
      setFormImage('');
      setFormSeasonalId('');
      setFormStartDate('');
      setFormEndDate('');
      setFormIsActive(true);
    }
    setUploadFeedback(null);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const payload = {
      name: formName,
      category: formCategory as any,
      price: formPrice,
      description: formDescription,
      specs: formSpecs,
      image: formImage || undefined,
      seasonalMenuId: formSeasonalId || undefined,
      isSeasonal: Boolean(formSeasonalId),
      publishStartDate: formStartDate || undefined,
      publishEndDate: formEndDate || undefined,
      isActive: formIsActive
    };

    if (editingItem) {
      updateMenuItem(editingItem.id, payload);
    } else {
      addMenuItem(payload);
    }
    setIsItemModalOpen(false);
  };

  // ==========================================================================
  // MODALE CATEGORIE (CREAZIONE & MODIFICA)
  // ==========================================================================
  const openCategoryModal = (cat?: CustomCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatIcon(cat.icon || 'restaurant');
      setCatDesc(cat.description || '');
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
      setCatIcon('restaurant');
      setCatDesc('');
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    const computedSlug = catSlug.trim()
      ? catSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
      : catName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catName,
        slug: computedSlug,
        icon: catIcon,
        description: catDesc
      });
    } else {
      addCategory({
        name: catName,
        slug: computedSlug,
        icon: catIcon,
        description: catDesc,
        orderIndex: categories.length + 1
      });
    }
    setIsCategoryModalOpen(false);
  };

  // ==========================================================================
  // MODALE MENÙ STAGIONALI
  // ==========================================================================
  const openSeasonModal = (season?: SeasonalMenuConfig) => {
    if (season) {
      setEditingSeason(season);
      setSeasonName(season.name);
      setSeasonType(season.season);
      setSeasonStart(season.startDate);
      setSeasonEnd(season.endDate);
      setSeasonNotice(season.bannerNotice || '');
      setSeasonBadge(season.specialBadge || '');
    } else {
      setEditingSeason(null);
      setSeasonName('');
      setSeasonType('speciale');
      setSeasonStart(new Date().toISOString().slice(0, 10));
      setSeasonEnd('2027-04-30');
      setSeasonNotice('');
      setSeasonBadge('SPECIALE');
    }
    setIsSeasonModalOpen(true);
  };

  const handleSaveSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seasonName.trim()) return;

    if (editingSeason) {
      updateSeasonalMenu(editingSeason.id, {
        name: seasonName,
        season: seasonType,
        startDate: seasonStart,
        endDate: seasonEnd,
        bannerNotice: seasonNotice,
        specialBadge: seasonBadge
      });
    } else {
      addSeasonalMenu({
        name: seasonName,
        season: seasonType,
        startDate: seasonStart,
        endDate: seasonEnd,
        isActive: true,
        bannerNotice: seasonNotice,
        specialBadge: seasonBadge,
        dishes: []
      });
    }
    setIsSeasonModalOpen(false);
  };

  // Salva nuovo piatto specifico del menù stagionale
  const handleSaveSeasonalDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !selectedSeasonId) return;

    addSeasonalDish(selectedSeasonId, {
      name: formName,
      category: formCategory as any,
      price: formPrice,
      description: formDescription,
      specs: formSpecs || 'PROPOSTA STAGIONALE',
      image: formImage || undefined,
      isSeasonal: true,
      seasonalMenuId: selectedSeasonId,
      isActive: true
    });

    setIsSeasonDishModalOpen(false);
    setFormName('');
    setFormDescription('');
    setFormImage('');
  };

  // ==========================================================================
  // MODALE GALLERIA (UPLOAD NATIVO - NO URL MANUALE RICHIESTO)
  // ==========================================================================
  const openGalleryModal = (gal?: DynamicGalleryItem) => {
    if (gal) {
      setEditingGallery(gal);
      setGalTitle(gal.title);
      setGalUrl(gal.url);
      setGalCategory(gal.category);
      setGalBadge(gal.badge);
      setGalCaption(gal.caption);
      setGalFormat(gal.format || 'webp');
    } else {
      setEditingGallery(null);
      setGalTitle('');
      setGalUrl('');
      setGalCategory('locale');
      setGalBadge('DOCK 71 VIBES');
      setGalCaption('');
      setGalFormat('webp');
    }
    setUploadFeedback(null);
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galUrl.trim()) return;

    if (editingGallery) {
      updateGalleryItem(editingGallery.id, {
        title: galTitle,
        url: galUrl,
        category: galCategory,
        badge: galBadge,
        caption: galCaption,
        format: galFormat
      });
    } else {
      addGalleryItem({
        title: galTitle,
        url: galUrl,
        category: galCategory,
        badge: galBadge,
        caption: galCaption,
        format: galFormat,
        isFeatured: true
      });
    }
    setIsGalleryModalOpen(false);
  };

  // ==========================================================================
  // MODALE PALINSESTO SKY SPORT LIVE
  // ==========================================================================
  const openMatchModal = (match?: DynamicMatchEvent) => {
    if (match) {
      setEditingMatch(match);
      setMatchTeams(match.match);
      setMatchCompetition(match.competition);
      setMatchDate(match.date);
      setMatchTime(match.time);
      setMatchSport(match.sport);
      setMatchDescription(match.description || match.screen || '');
      setMatchBeer(match.beerRecommendation || 'Dock Crane Pilsner');
      setMatchTables(match.availableTables ?? 4);
      setMatchStatus(match.status);
    } else {
      setEditingMatch(null);
      setMatchTeams('');
      setMatchCompetition('Champions League');
      setMatchDate('Mercoledì 26 Nov');
      setMatchTime('21:00');
      setMatchSport('calcio');
      setMatchDescription('Diretta su Maxischermo con cucina e birreria attive');
      setMatchBeer('Dock Crane Pilsner');
      setMatchTables(4);
      setMatchStatus('recommended');
    }
    setIsMatchModalOpen(true);
  };

  const handleSaveMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchTeams.trim()) return;

    const splitted = matchTeams.includes(' vs ') ? matchTeams.split(' vs ') : [matchTeams, 'Avversario'];

    const payload = {
      match: matchTeams,
      teams: [splitted[0], splitted[1] || ''] as [string, string],
      competition: matchCompetition,
      date: matchDate,
      time: matchTime,
      sport: matchSport,
      screen: matchDescription,
      description: matchDescription,
      beerRecommendation: matchBeer,
      availableTables: Number(matchTables),
      status: matchStatus,
      isActive: true
    };

    if (editingMatch) {
      updateMatch(editingMatch.id, payload);
    } else {
      addMatch(payload);
    }
    setIsMatchModalOpen(false);
  };

  // Esporta CSV lato client
  const exportCsv = (filename: string, rows: object[]) => {
    if (rows.length === 0) return;
    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [
      headers,
      ...rows.map(r => Object.values(r).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Prodotti filtrati per categoria
  const filteredMenuItems = menuItems.filter(item => {
    if (productCategoryFilter === 'all') return true;
    return item.category === productCategoryFilter;
  });

  // Menù stagionale attualmente selezionato
  const currentSeason = seasonalMenus.find(s => s.id === selectedSeasonId) || seasonalMenus[0];
  const currentSeasonDishes = currentSeason?.dishes || menuItems.filter(m => m.seasonalMenuId === currentSeason?.id);

  // ==========================================================================
  // SCHERMATA LOGIN & 2FA TOTP
  // ==========================================================================
  if (authStep !== 'logged_in') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] font-work text-[#1D1C13] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#FFF9EB] border-3 border-dock-burgundy rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-3 checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>

          <div className="text-center pt-2">
            <span className="inline-block px-3 py-1 bg-dock-burgundy text-white rounded-full font-marker text-[11px] uppercase tracking-wider mb-2">
              SICUREZZA CRM • 2FA TOTP
            </span>
            <h1 className="font-chunky text-2xl text-[#1D1C13] uppercase tracking-tight">
              Dock 71 Control Panel
            </h1>
            <p className="font-work text-xs text-[#554245] mt-1">
              Pannello di controllo per Menù, Categorie, Galleria, Sport &amp; Registri Form
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {authStep === 'credentials' ? (
            <form onSubmit={handleCheckCredentials} className="space-y-4">
              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Email Amministratore
                </label>
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                />
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:outline-none focus:border-dock-burgundy"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Verifica Credenziali (Fase 1)
              </button>

              <button
                type="button"
                onClick={onBackToSite}
                className="w-full py-2 text-xs font-epilogue font-bold text-[#7A7265] hover:text-[#1D1C13] cursor-pointer"
              >
                ← Torna al Sito Pubblico
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyTotp} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#F3EDDF] border border-[#E8E2D4] text-center space-y-1">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-3xl">verified_user</span>
                <p className="font-work text-xs text-[#554245]">
                  Inserisci il codice temporaneo a <strong>6 cifre</strong> generato dalla tua app TOTP (Google Authenticator / Authy).
                </p>
                <span className="font-mono-tech text-[10px] text-dock-green font-bold block">
                  Codice rapido di sblocco: <strong>712063</strong>
                </span>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-center text-[#1D1C13] mb-1">
                  Codice Temporaneo 2FA
                </label>
                <input
                  type="text"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                  autoFocus
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-2xl font-mono px-3 py-2.5 rounded-xl bg-white border-2 border-dock-burgundy focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-chunky text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
              >
                Sblocca Sessione Amministratore (Fase 2)
              </button>

              <button
                type="button"
                onClick={() => setAuthStep('credentials')}
                className="w-full py-2 text-xs font-epilogue font-bold text-[#7A7265] hover:text-[#1D1C13] cursor-pointer"
              >
                ← Rivedi Credenziali
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================================
  // DASHBOARD AUTENTICATA: STRUTTURA CHIARA SUDDIVISA
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-work text-[#1D1C13]">
      {/* Top Header */}
      <header className="bg-[#FFF9EB] border-b-2 border-[#E8E2D4] px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <div>
            <h1 className="font-chunky text-lg sm:text-xl text-[#7B2039] uppercase tracking-tight">
              Dock 71 Cantù • CRM Centrale &amp; Gestione Contenuti
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetToDefaults}
            title="Ripristina dati iniziali"
            className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#1D1C13] font-epilogue text-[11px] font-bold uppercase transition-all cursor-pointer"
          >
            Ripristina Default
          </button>
          <button
            onClick={onBackToSite}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E8E2D4] text-[#1D1C13] hover:border-dock-burgundy font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">visibility</span>
            Vedi Sito Web
          </button>
          <button
            onClick={() => setAuthStep('credentials')}
            className="px-3.5 py-1.5 rounded-lg bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-sm hover:bg-dock-burgundy-dark transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined notranslate text-[16px]">logout</span>
            Esci
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        {/* NAVIGAZIONE PRINCIPALE A 4 MACRO-AREE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-2 rounded-2xl border border-[#E8E2D4] shadow-sm">
          <button
            onClick={() => setMainTab('menu')}
            className={`py-3 px-4 rounded-xl font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mainTab === 'menu'
                ? 'bg-dock-burgundy text-white shadow-md'
                : 'text-[#554245] hover:bg-[#F3EDDF] hover:text-[#1D1C13]'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[20px]">restaurant_menu</span>
            <span>1. Menù &amp; Birre</span>
          </button>

          <button
            onClick={() => setMainTab('gallery')}
            className={`py-3 px-4 rounded-xl font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mainTab === 'gallery'
                ? 'bg-dock-burgundy text-white shadow-md'
                : 'text-[#554245] hover:bg-[#F3EDDF] hover:text-[#1D1C13]'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[20px]">photo_library</span>
            <span>2. Galleria Foto</span>
          </button>

          <button
            onClick={() => setMainTab('sports')}
            className={`py-3 px-4 rounded-xl font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mainTab === 'sports'
                ? 'bg-dock-burgundy text-white shadow-md'
                : 'text-[#554245] hover:bg-[#F3EDDF] hover:text-[#1D1C13]'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[20px]">tv</span>
            <span>3. Palinsesto Sky</span>
          </button>

          <button
            onClick={() => setMainTab('forms')}
            className={`py-3 px-4 rounded-xl font-chunky text-xs uppercase tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mainTab === 'forms'
                ? 'bg-dock-burgundy text-white shadow-md'
                : 'text-[#554245] hover:bg-[#F3EDDF] hover:text-[#1D1C13]'
            }`}
          >
            <span className="material-symbols-outlined notranslate text-[20px]">fact_check</span>
            <span>4. Invii Form &amp; Consensi</span>
          </button>
        </div>

        {/* FEEDBACK UPLOAD NATIVO */}
        {uploadFeedback && (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#A5D6A7] text-[#1B5E20] text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
            <span className="material-symbols-outlined notranslate text-[18px]">verified</span>
            {uploadFeedback}
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 1: GESTIONE MENÙ & BIRRE                                      */}
        {/* ================================================================== */}
        {mainTab === 'menu' && (
          <div className="space-y-6">
            {/* Sotto-menu per Menù & Birre */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFF9EB] p-3 rounded-2xl border border-[#E8E2D4]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMenuSubTab('items')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    menuSubTab === 'items'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">drag_indicator</span>
                  Prodotti &amp; Riordina con Mouse ({menuItems.length})
                </button>

                <button
                  onClick={() => setMenuSubTab('categories')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    menuSubTab === 'categories'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">category</span>
                  Gestione Categorie ({categories.length})
                </button>

                <button
                  onClick={() => setMenuSubTab('seasonal')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    menuSubTab === 'seasonal'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">ac_unit</span>
                  Menù Stagionali &amp; Piatti Dedicati ({seasonalMenus.length})
                </button>
              </div>

              {menuSubTab === 'items' && (
                <button
                  onClick={() => openItemModal()}
                  className="px-4 py-2 rounded-xl bg-dock-green text-white font-chunky text-xs uppercase shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                  Aggiungi Nuovo Prodotto
                </button>
              )}

              {menuSubTab === 'categories' && (
                <button
                  onClick={() => openCategoryModal()}
                  className="px-4 py-2 rounded-xl bg-dock-green text-white font-chunky text-xs uppercase shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                  Crea Nuova Categoria
                </button>
              )}

              {menuSubTab === 'seasonal' && (
                <button
                  onClick={() => openSeasonModal()}
                  className="px-4 py-2 rounded-xl bg-dock-green text-white font-chunky text-xs uppercase shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                  Crea Menù Stagionale
                </button>
              )}
            </div>

            {/* SOTTO-VISTA 1: PRODOTTI CON DRAG & DROP TRASCINAMENTO MOUSE */}
            {menuSubTab === 'items' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D4] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">filter_alt</span>
                    <span className="font-epilogue text-xs uppercase font-bold text-[#1D1C13]">Filtra per Categoria:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setProductCategoryFilter('all')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                        productCategoryFilter === 'all'
                          ? 'bg-dock-burgundy text-white'
                          : 'bg-[#F3EDDF] text-[#554245] hover:bg-[#E8E2D4]'
                      }`}
                    >
                      Tutti ({menuItems.length})
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setProductCategoryFilter(cat.slug)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                          productCategoryFilter === cat.slug
                            ? 'bg-dock-burgundy text-white'
                            : 'bg-[#F3EDDF] text-[#554245] hover:bg-[#E8E2D4]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#FAF5EA] rounded-xl border border-[#E8E2D4] text-xs text-[#554245] flex items-center gap-2">
                  <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">touch_app</span>
                  <span>
                    <strong>Gestione Ordine con Trascinamento:</strong> Clicca e trascina con il mouse l'icona <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E8E2D4]">⋮⋮</span> per posizionare il piatto nell'ordine esatto in cui desideri compaia nel frontend. Puoi anche usare i pulsanti ▲ / ▼.
                  </span>
                </div>

                {/* Lista Prodotti con Drag and Drop */}
                <div className="space-y-3">
                  {filteredMenuItems.map((item, index) => {
                    const isDragging = draggedItemIndex === index;
                    const isDragOver = dragOverItemIndex === index;

                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={() => {
                          setDraggedItemIndex(null);
                          setDragOverItemIndex(null);
                        }}
                        className={`bg-white rounded-2xl p-4 border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-grab active:cursor-grabbing ${
                          isDragOver
                            ? 'border-dock-burgundy border-2 bg-dock-burgundy/5 translate-x-2'
                            : isDragging
                            ? 'opacity-40 border-dashed border-[#7A7265]'
                            : 'border-[#E8E2D4] hover:border-dock-burgundy/50 shadow-xs hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 w-full md:w-auto">
                          {/* Drag Handle Icon */}
                          <div
                            title="Trascina con il mouse per cambiare ordine"
                            className="p-2 rounded-lg bg-[#F3EDDF] text-[#7A7265] hover:text-dock-burgundy hover:bg-[#E8E2D4] transition-colors shrink-0"
                          >
                            <span className="material-symbols-outlined notranslate text-[20px]">drag_indicator</span>
                          </div>

                          {/* Quick Step Buttons */}
                          <div className="flex flex-col gap-0.5 shrink-0">
                            <button
                              disabled={index === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(index, 'up');
                              }}
                              className="w-5 h-4 rounded bg-[#F3EDDF] hover:bg-[#E8E2D4] text-[#1D1C13] text-[9px] flex items-center justify-center disabled:opacity-30 cursor-pointer"
                              title="Sposta su"
                            >
                              ▲
                            </button>
                            <button
                              disabled={index === menuItems.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveStep(index, 'down');
                              }}
                              className="w-5 h-4 rounded bg-[#F3EDDF] hover:bg-[#E8E2D4] text-[#1D1C13] text-[9px] flex items-center justify-center disabled:opacity-30 cursor-pointer"
                              title="Sposta giù"
                            >
                              ▼
                            </button>
                          </div>

                          {/* Anteprima Foto o Placeholder */}
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover border border-[#E8E2D4] shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-[#FAF5EA] border border-[#E8E2D4] flex items-center justify-center text-[#7A7265] shrink-0">
                              <span className="material-symbols-outlined notranslate text-[22px]">restaurant</span>
                            </div>
                          )}

                          {/* Dettagli Prodotto */}
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-chunky text-base text-[#1D1C13]">{item.name}</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-tech uppercase font-bold bg-[#FAF5EA] text-dock-burgundy border border-[#E8E2D4]">
                                {item.category}
                              </span>
                              {item.isSeasonal && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-epilogue font-bold bg-[#E0A93B] text-black">
                                  Stagionale
                                </span>
                              )}
                              {!item.isActive && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-epilogue font-bold bg-red-100 text-red-700">
                                  Disattivato
                                </span>
                              )}
                            </div>
                            <p className="font-work text-xs text-[#554245] line-clamp-1 max-w-xl mt-0.5">
                              {item.description}
                            </p>
                            {item.specs && (
                              <span className="font-mono-tech text-[10px] text-[#7A7265] block mt-0.5">
                                Spec: {item.specs}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Prezzo e Azioni */}
                        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#F0EBE2]">
                          <span className="font-chunky text-lg text-dock-burgundy">{item.price}</span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMenuItemStatus(item.id)}
                              title={item.isActive ? 'Disattiva piatto' : 'Attiva piatto'}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                item.isActive
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              }`}
                            >
                              <span className="material-symbols-outlined notranslate text-[18px]">
                                {item.isActive ? 'toggle_on' : 'toggle_off'}
                              </span>
                            </button>

                            <button
                              onClick={() => openItemModal(item)}
                              title="Modifica piatto"
                              className="p-2 rounded-xl bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-[#1D1C13] transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined notranslate text-[18px]">edit</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Eliminare il piatto "${item.name}"?`)) {
                                  deleteMenuItem(item.id);
                                }
                              }}
                              title="Elimina piatto"
                              className="p-2 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-700 transition-all cursor-pointer"
                            >
                              <span className="material-symbols-outlined notranslate text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SOTTO-VISTA 2: GESTIONE CATEGORIE COMPLETA (CREA, MODIFICA, ELIMINA) */}
            {menuSubTab === 'categories' && (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-[#E8E2D4] flex items-center justify-between">
                  <div>
                    <h3 className="font-chunky text-lg text-[#1D1C13]">Gestione Categorie Menù</h3>
                    <p className="font-work text-xs text-[#554245]">
                      Crea nuove categorie, rinomina quelle esistenti o rimuovile. Le categorie si collegano in tempo reale al filtro del menù nel frontend.
                    </p>
                  </div>
                  <button
                    onClick={() => openCategoryModal()}
                    className="px-4 py-2 rounded-xl bg-dock-green text-white font-chunky text-xs uppercase shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                    Nuova Categoria
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id}
                      className="bg-white rounded-2xl p-5 border border-[#E8E2D4] shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-10 h-10 rounded-xl bg-[#FAF5EA] text-dock-burgundy flex items-center justify-center font-bold border border-[#E8E2D4]">
                            <span className="material-symbols-outlined notranslate text-[22px]">{cat.icon || 'restaurant'}</span>
                          </span>
                          <span className="font-mono-tech text-xs bg-[#F3EDDF] text-[#7A7265] px-2 py-0.5 rounded font-bold">
                            Ordine #{idx + 1}
                          </span>
                        </div>
                        <h4 className="font-chunky text-lg text-[#1D1C13]">{cat.name}</h4>
                        <span className="font-mono-tech text-xs text-dock-burgundy block mt-0.5">
                          slug: /{cat.slug}
                        </span>
                        {cat.description && (
                          <p className="font-work text-xs text-[#554245] mt-2 leading-relaxed">
                            {cat.description}
                          </p>
                        )}
                        <span className="text-[11px] font-work text-[#7A7265] mt-3 block">
                          Prodotti attivi collegati: {menuItems.filter(m => m.category === cat.slug).length}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-[#F0EBE2]">
                        <button
                          onClick={() => openCategoryModal(cat)}
                          className="px-3 py-1.5 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-xs font-bold font-epilogue uppercase transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined notranslate text-[14px]">edit</span>
                          Modifica
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Eliminare la categoria "${cat.name}"? I prodotti esistenti rimarranno comunque nel catalogo.`)) {
                              deleteCategory(cat.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-bold font-epilogue uppercase transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined notranslate text-[14px]">delete</span>
                          Elimina
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOTTO-VISTA 3: MENÙ STAGIONALI & PIATTI DEDICATI */}
            {menuSubTab === 'seasonal' && (
              <div className="space-y-6">
                {/* Selezione Campagna Stagionale */}
                <div className="bg-white p-5 rounded-2xl border border-[#E8E2D4] space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono-tech text-xs uppercase tracking-widest text-[#93541E] font-bold">
                        Campagne Attive nel Menù di Navigazione
                      </span>
                      <h3 className="font-chunky text-xl text-[#1D1C13]">
                        Menù Stagionali &amp; Proposte a Tempo
                      </h3>
                    </div>
                    <button
                      onClick={() => openSeasonModal()}
                      className="px-4 py-2 rounded-xl bg-dock-green text-white font-chunky text-xs uppercase shadow-sm hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
                    >
                      <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                      Nuova Stagione
                    </button>
                  </div>

                  {/* Schede Menù Stagionali */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seasonalMenus.map((season) => (
                      <div
                        key={season.id}
                        onClick={() => setSelectedSeasonId(season.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedSeasonId === season.id
                            ? 'bg-[#FAF5EA] border-2 border-[#E0A93B] shadow-md'
                            : 'bg-white border-[#E8E2D4] hover:border-[#E0A93B]/50'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E0A93B] text-black font-epilogue font-bold text-[10px] uppercase">
                              {season.specialBadge || season.season.toUpperCase()}
                            </span>
                            <span className="font-mono-tech text-xs text-[#7A7265]">
                              {season.startDate} → {season.endDate}
                            </span>
                          </div>
                          <h4 className="font-chunky text-lg text-[#1D1C13]">{season.name}</h4>
                          {season.bannerNotice && (
                            <p className="font-work text-xs text-[#554245] mt-2 italic bg-white/70 p-2.5 rounded-xl border border-[#E8E2D4]">
                              "{season.bannerNotice}"
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-dock-burgundy">
                            <span className="material-symbols-outlined notranslate text-[16px]">restaurant</span>
                            <span>{season.dishes?.length || 0} piatti inseriti in questo menù</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0EBE2]">
                          <span className={`text-[11px] font-bold ${season.isActive ? 'text-emerald-700' : 'text-gray-500'}`}>
                            {season.isActive ? '● Attivo nel Frontend' : '○ Disattivato'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openSeasonModal(season);
                              }}
                              className="px-2.5 py-1 rounded bg-white hover:bg-dock-burgundy hover:text-white text-xs font-bold transition-all border border-[#E8E2D4]"
                            >
                              Modifica
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Rimuovere la stagione "${season.name}"?`)) {
                                  deleteSeasonalMenu(season.id);
                                }
                              }}
                              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-bold transition-all"
                            >
                              Elimina
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gestione Piatti del Menù Stagionale Selezionato */}
                {currentSeason && (
                  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D4] space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#F0EBE2] pb-4">
                      <div>
                        <span className="font-mono-tech text-xs uppercase font-bold text-dock-burgundy">
                          Piatti Inseriti nel Menù: {currentSeason.name}
                        </span>
                        <h4 className="font-chunky text-xl text-[#1D1C13]">
                          Gestione Piatti Stagionali
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          setFormName('');
                          setFormDescription('');
                          setFormPrice('€ 14.50');
                          setFormCategory('pizze');
                          setFormImage('');
                          setFormSpecs('EDIZIONE INVERNALE');
                          setIsSeasonDishModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-sm hover:bg-dock-burgundy-dark transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined notranslate text-[16px]">add_circle</span>
                        Aggiungi Piatto a Questo Menù
                      </button>
                    </div>

                    {currentSeasonDishes.length === 0 ? (
                      <div className="p-8 text-center bg-[#FAF5EA] rounded-2xl border border-dashed border-[#E8E2D4] space-y-2">
                        <span className="material-symbols-outlined notranslate text-dock-burgundy text-3xl">restaurant_menu</span>
                        <p className="font-chunky text-sm uppercase text-[#1D1C13]">
                          Nessun piatto ancora inserito in questo menù stagionale
                        </p>
                        <p className="font-work text-xs text-[#554245]">
                          Aggiungi le pietanze o birre stagionali per renderle visibili nella sottotendina del menù di navigazione.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentSeasonDishes.map((dish) => (
                          <div
                            key={dish.id}
                            className="bg-[#FAF7F2] rounded-2xl p-4 border border-[#E8E2D4] flex flex-col justify-between"
                          >
                            {dish.image && (
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-36 object-cover rounded-xl mb-3 border border-[#E8E2D4]"
                              />
                            )}
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h5 className="font-chunky text-base text-[#1D1C13]">{dish.name}</h5>
                                <span className="font-chunky text-base text-dock-burgundy shrink-0">{dish.price}</span>
                              </div>
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono-tech uppercase font-bold bg-white text-dock-burgundy border border-[#E8E2D4] mb-2">
                                {dish.specs || dish.category}
                              </span>
                              <p className="font-work text-xs text-[#554245] leading-relaxed">
                                {dish.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[#E8E2D4]">
                              <button
                                onClick={() => {
                                  if (confirm(`Rimuovere il piatto "${dish.name}" da questo menù stagionale?`)) {
                                    removeSeasonalDish(currentSeason.id, dish.id);
                                  }
                                }}
                                className="px-2.5 py-1 rounded bg-red-100 hover:bg-red-600 hover:text-white text-red-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined notranslate text-[14px]">delete</span>
                                Rimuovi
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 2: GALLERIA FOTOGRAFICA (CON UPLOAD NATIVO WEBP/AVIF)          */}
        {/* ================================================================== */}
        {mainTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D4] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-dock-burgundy font-bold">
                  Archivio Visivo Ufficiale Cantù
                </span>
                <h3 className="font-chunky text-2xl text-[#1D1C13]">
                  Galleria Fotografica con Upload Diretto
                </h3>
                <p className="font-work text-xs text-[#554245] mt-1">
                  Carica le foto direttamente: il sistema le comprime e converte nativamente in <strong>WebP/AVIF</strong> ad altissima velocità.
                </p>
              </div>

              <button
                onClick={() => openGalleryModal()}
                className="px-5 py-2.5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">add_photo_alternate</span>
                Carica Nuova Foto
              </button>
            </div>

            {/* Griglia Foto Galleria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {galleryItems.map((gal) => (
                <div
                  key={gal.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8E2D4] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="relative h-48 bg-[#F0EBE2] overflow-hidden">
                    <img
                      src={gal.url}
                      alt={gal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-dock-burgundy text-white font-epilogue font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-sm">
                      {gal.badge}
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white font-mono-tech text-[10px] px-2 py-0.5 rounded uppercase font-bold">
                      {gal.format || 'WEBP'}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <span className="font-mono-tech text-[10px] uppercase text-[#7A7265] font-bold">
                        {gal.category}
                      </span>
                      <h4 className="font-chunky text-base text-[#1D1C13] mt-0.5 line-clamp-1">{gal.title}</h4>
                      <p className="font-work text-xs text-[#554245] line-clamp-2 mt-1 leading-relaxed">
                        {gal.caption}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-[#F0EBE2]">
                      <button
                        onClick={() => openGalleryModal(gal)}
                        className="px-2.5 py-1 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-xs font-bold font-epilogue uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[14px]">edit</span>
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Eliminare la foto "${gal.title}" dalla galleria?`)) {
                            deleteGalleryItem(gal.id);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 text-xs font-bold font-epilogue uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[14px]">delete</span>
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 3: PALINSESTO SKY SPORT LIVE                                  */}
        {/* ================================================================== */}
        {mainTab === 'sports' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D4] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-sky-700 font-bold">
                  Licenza Sky Sport HD Ufficiale
                </span>
                <h3 className="font-chunky text-2xl text-[#1D1C13]">
                  Palinsesto Ufficiale Eventi Live
                </h3>
                <p className="font-work text-xs text-[#554245] mt-1">
                  Se non sono presenti eventi attivi in programma, compare automaticamente la notifica: <em>"Non ci sono eventi in programma per ora"</em>.
                </p>
              </div>

              <button
                onClick={() => openMatchModal()}
                className="px-5 py-2.5 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto"
              >
                <span className="material-symbols-outlined notranslate text-[18px]">add_circle</span>
                Aggiungi Partita / Gara
              </button>
            </div>

            {matches.filter(m => m.isActive !== false).length === 0 && (
              <div className="p-8 text-center bg-[#FFF9EB] rounded-2xl border-2 border-dashed border-[#E8E2D4] space-y-2">
                <span className="material-symbols-outlined notranslate text-dock-burgundy text-4xl">tv_off</span>
                <h4 className="font-chunky text-lg text-[#1D1C13] uppercase">
                  Notifica Frontend Attiva: "Non ci sono eventi in programma per ora"
                </h4>
                <p className="font-work text-xs text-[#554245] max-w-md mx-auto">
                  Attualmente nessun evento è attivo. Gli utenti vedranno il messaggio informativo con il pulsante per prenotare un tavolo.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {matches.map((m) => (
                <div
                  key={m.id}
                  className={`bg-white rounded-2xl p-5 border shadow-xs transition-all flex flex-col justify-between ${
                    m.isActive
                      ? 'border-[#E8E2D4]'
                      : 'border-red-200 bg-red-50/30 opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono-tech uppercase tracking-wider bg-dock-burgundy text-white font-bold">
                        {m.date} • {m.time}
                      </span>
                      <span className="font-work text-[11px] text-[#7A7265] uppercase font-bold">
                        {m.competition}
                      </span>
                    </div>

                    <h4 className="font-chunky text-xl text-[#1D1C13] my-2">{m.match}</h4>

                    <div className="space-y-1.5 text-xs text-[#554245] mt-3">
                      {(m.description || m.screen) && (
                        <div className="flex items-start gap-1.5">
                          <span className="material-symbols-outlined notranslate text-[16px] text-sky-700 mt-0.5">description</span>
                          <span><strong>Descrizione:</strong> {m.description || m.screen}</span>
                        </div>
                      )}
                      {m.beerRecommendation && (
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined notranslate text-[16px] text-dock-burgundy">sports_bar</span>
                          <span>Abbinamento: {m.beerRecommendation}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0EBE2]">
                    <button
                      onClick={() => toggleMatchStatus(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-epilogue font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                        m.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <span className="material-symbols-outlined notranslate text-[16px]">
                        {m.isActive ? 'toggle_on' : 'toggle_off'}
                      </span>
                      {m.isActive ? 'Attivo' : 'Nascosto'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openMatchModal(m)}
                        className="p-1.5 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white transition-colors cursor-pointer"
                        title="Modifica evento"
                      >
                        <span className="material-symbols-outlined notranslate text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Eliminare la partita "${m.match}"?`)) {
                            deleteMatch(m.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 transition-colors cursor-pointer"
                        title="Elimina evento"
                      >
                        <span className="material-symbols-outlined notranslate text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================== */}
        {/* TAB 4: INVII FORM, ANALYTICS, PRENOTAZIONI, MESSAGGI & CONSENSI    */}
        {/* ================================================================== */}
        {mainTab === 'forms' && (
          <div className="space-y-6">
            {/* Notifica di sistema per Email Inviate (Conferma / Rifiuto / Risposta) */}
            {crmNotification && (
              <div className="p-4 rounded-2xl bg-[#FFF9EB] border-2 border-dock-burgundy shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-dock-green text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined notranslate text-[20px]">mark_email_read</span>
                  </div>
                  <div>
                    <span className="font-marker text-[10px] text-dock-burgundy uppercase font-bold block">
                      NOTIFICA SISTEMA EMAIL &amp; CRM DOCK 71
                    </span>
                    <p className="font-work text-xs sm:text-sm font-bold text-[#1D1C13]">
                      {crmNotification.message}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {crmNotification.emailHtml && (
                    <button
                      onClick={() =>
                        setEmailPreviewModal({
                          subject: crmNotification.emailSubject || 'Email Dock 71',
                          recipient: crmNotification.emailRecipient || '',
                          html: crmNotification.emailHtml!
                        })
                      }
                      className="px-3.5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase flex items-center gap-1.5 shadow-xs hover:bg-dock-burgundy-dark cursor-pointer"
                    >
                      <span className="material-symbols-outlined notranslate text-[16px]">visibility</span>
                      Vedi Email Inviata
                    </button>
                  )}
                  <button
                    onClick={() => setCrmNotification(null)}
                    className="p-2 rounded-xl bg-white border border-[#E8E2D4] text-[#554245] hover:text-[#1D1C13] cursor-pointer"
                    title="Chiudi avviso"
                  >
                    <span className="material-symbols-outlined notranslate text-[16px]">close</span>
                  </button>
                </div>
              </div>
            )}

            {/* RIEPILOGO KPI STATISTICI SEMPRE VISIBILE IN ALTO */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                onClick={() => setFormSubTab('bookings')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D4] shadow-xs hover:border-dock-burgundy transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tech text-[10px] uppercase font-bold text-[#7A7265]">
                    PRENOTAZIONI TAVOLI
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-dock-burgundy/10 text-dock-burgundy flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">table_restaurant</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">{totalBookingsCount}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    ({confirmationRate}% confermate)
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[#554245]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ✓ {confirmedBookingsCount} Conf.
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    ⏳ {pendingBookingsCount} Attesa
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                    ✕ {rejectedBookingsCount} Rif.
                  </span>
                </div>
              </div>

              <div
                onClick={() => setFormSubTab('bookings')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D4] shadow-xs hover:border-dock-burgundy transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tech text-[10px] uppercase font-bold text-[#7A7265]">
                    COPERTI &amp; OSPITI ATTESI
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-[#336859]/10 text-[#336859] flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">groups</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-chunky text-2xl sm:text-3xl text-[#336859]">{totalGuestsBooked}</span>
                  <span className="text-xs font-semibold text-[#7A7265]">pax attivi</span>
                </div>
                <p className="mt-2 text-[11px] text-[#554245]">
                  Media <strong>{avgGuestsPerBooking} ospiti</strong> per prenotazione • Capienza Molo: 170 posti
                </p>
              </div>

              <div
                onClick={() => setFormSubTab('contacts')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D4] shadow-xs hover:border-dock-burgundy transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tech text-[10px] uppercase font-bold text-[#7A7265]">
                    MESSAGGI &amp; RICHIESTE
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-[#E0A93B]/20 text-[#93541E] flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">mail</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">{totalContactsCount}</span>
                  <span className="text-xs font-bold text-emerald-700">
                    ({contactReplyRate}% risposti)
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ✓ {repliedContactsCount} Risposti
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    ● {newContactsCount} Da leggere
                  </span>
                </div>
              </div>

              <div
                onClick={() => setFormSubTab('consents')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E2D4] shadow-xs hover:border-dock-burgundy transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-tech text-[10px] uppercase font-bold text-[#7A7265]">
                    CONSENSI GDPR (PROOF)
                  </span>
                  <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                    <span className="material-symbols-outlined notranslate text-[18px]">verified_user</span>
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-chunky text-2xl sm:text-3xl text-[#1D1C13]">{totalConsentsCount}</span>
                  <span className="text-xs font-bold text-purple-800">
                    ({analyticsConsentRate}% Analytics)
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-[#554245]">
                  Marketing Opt-in: <strong>{marketingConsentRate}%</strong> • Solo Tecnici: <strong>{technicalOnlyConsentsCount}</strong>
                </p>
              </div>
            </div>

            {/* BARRA SOTTO-NAVIGAZIONE FORM & ANALYTICS */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFF9EB] p-3 rounded-2xl border border-[#E8E2D4]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFormSubTab('bookings')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    formSubTab === 'bookings'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">table_restaurant</span>
                  Prenotazioni Tavoli ({bookings.length})
                </button>

                <button
                  onClick={() => setFormSubTab('contacts')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    formSubTab === 'contacts'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">mail</span>
                  Messaggi Contatti ({contacts.length})
                </button>

                <button
                  onClick={() => setFormSubTab('consents')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    formSubTab === 'consents'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">verified_user</span>
                  Registro Consensi GDPR ({consents.length})
                </button>

                <button
                  onClick={() => setFormSubTab('analytics')}
                  className={`px-4 py-2 rounded-xl font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                    formSubTab === 'analytics'
                      ? 'bg-dock-burgundy text-white shadow-sm'
                      : 'bg-white text-[#554245] border border-[#E8E2D4] hover:bg-[#F3EDDF]'
                  }`}
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">bar_chart</span>
                  Analytics &amp; Statistiche Complete
                </button>
              </div>

              {formSubTab === 'bookings' && (
                <button
                  onClick={() => exportCsv('dock71_prenotazioni', filteredBookings)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">download</span>
                  Esporta CSV ({filteredBookings.length})
                </button>
              )}

              {formSubTab === 'contacts' && (
                <button
                  onClick={() => exportCsv('dock71_contatti', filteredContacts)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">download</span>
                  Esporta CSV ({filteredContacts.length})
                </button>
              )}

              {formSubTab === 'consents' && (
                <button
                  onClick={() => exportCsv('dock71_gdpr_consents', filteredConsents)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-epilogue text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">download</span>
                  Esporta CSV ({filteredConsents.length})
                </button>
              )}
            </div>

            {/* ============================================================== */}
            {/* SOTTO-SCHEDA: ANALYTICS & STATISTICHE FORM, PRENOTAZIONI, GDPR */}
            {/* ============================================================== */}
            {formSubTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card Analytics 1: Prenotazioni per Sala e Stato */}
                  <div className="bg-white rounded-2xl border border-[#E8E2D4] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0EBE2] pb-3">
                      <div>
                        <span className="font-mono-tech text-[10px] uppercase text-dock-burgundy font-bold">
                          ANALYTICS PRENOTAZIONI
                        </span>
                        <h4 className="font-chunky text-base text-[#1D1C13]">
                          Distribuzione Sale &amp; Tasso Conferma
                        </h4>
                      </div>
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-2xl">
                        pie_chart
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Confermate (Email Inviata)', count: confirmedBookingsCount, color: 'bg-emerald-600' },
                        { label: 'In Attesa di Gestione', count: pendingBookingsCount, color: 'bg-amber-500' },
                        { label: 'Rifiutate (Con Motivazione)', count: rejectedBookingsCount, color: 'bg-red-600' }
                      ].map((row) => {
                        const pct = totalBookingsCount > 0 ? Math.round((row.count / totalBookingsCount) * 100) : 0;
                        return (
                          <div key={row.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{row.label}</span>
                              <span className="font-mono-tech font-bold">
                                {row.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-[#F3EDDF] rounded-full overflow-hidden">
                              <div className={`h-full ${row.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE2] space-y-2">
                      <span className="font-epilogue text-[11px] font-bold uppercase text-[#7A7265] block">
                        Preferenza Ambiente del Molo:
                      </span>
                      {['Sala Gru', 'Maxischermo', 'Bancone', 'Terrazza'].map((roomKey) => {
                        const count = bookings.filter((b) =>
                          b.area.toLowerCase().includes(roomKey.toLowerCase())
                        ).length;
                        const pct = totalBookingsCount > 0 ? Math.round((count / totalBookingsCount) * 100) : 0;
                        return (
                          <div key={roomKey} className="flex items-center justify-between text-xs">
                            <span className="text-[#554245] font-medium">{roomKey}</span>
                            <div className="flex items-center gap-2 w-1/2">
                              <div className="flex-1 h-2 bg-[#F3EDDF] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-dock-burgundy rounded-full"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                              <span className="font-mono-tech text-[11px] font-bold w-8 text-right">{pct}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Analytics 2: Messaggi Contatti & Conversione Canali */}
                  <div className="bg-white rounded-2xl border border-[#E8E2D4] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0EBE2] pb-3">
                      <div>
                        <span className="font-mono-tech text-[10px] uppercase text-[#336859] font-bold">
                          ANALYTICS FORM CONTATTI
                        </span>
                        <h4 className="font-chunky text-base text-[#1D1C13]">
                          Performance Risposte &amp; Canali
                        </h4>
                      </div>
                      <span className="material-symbols-outlined notranslate text-[#336859] text-2xl">
                        forum
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Risposti dal Sistema CRM', count: repliedContactsCount, color: 'bg-emerald-600' },
                        { label: 'Nuovi da Leggere', count: newContactsCount, color: 'bg-amber-500' },
                        {
                          label: 'Letti / In Lavorazione',
                          count: contacts.filter((c) => c.status === 'Letto').length,
                          color: 'bg-sky-600'
                        }
                      ].map((row) => {
                        const pct = totalContactsCount > 0 ? Math.round((row.count / totalContactsCount) * 100) : 0;
                        return (
                          <div key={row.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span>{row.label}</span>
                              <span className="font-mono-tech font-bold">
                                {row.count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-2.5 bg-[#F3EDDF] rounded-full overflow-hidden">
                              <div className={`h-full ${row.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE2] space-y-2">
                      <span className="font-epilogue text-[11px] font-bold uppercase text-[#7A7265] block">
                        Sorgente Acquisizione Contatti &amp; Prenotazioni:
                      </span>
                      {[
                        {
                          label: 'Pagina Prenota Ora',
                          count: bookings.filter((b) => b.source === 'Pagina Prenota').length
                        },
                        {
                          label: 'Modale Prenotazione Rapida',
                          count: bookings.filter((b) => b.source === 'Modale Rapido').length
                        },
                        {
                          label: 'Pagina Contatti Ufficiale',
                          count: contacts.filter((c) => c.source === 'Pagina Contatti').length
                        },
                        {
                          label: 'Floating Contact Widget',
                          count:
                            bookings.filter((b) => b.source === 'Widget Contatti').length +
                            contacts.filter((c) => c.source === 'Widget Rapido').length
                        }
                      ].map((src) => (
                        <div key={src.label} className="flex items-center justify-between text-xs py-1">
                          <span className="text-[#554245]">{src.label}</span>
                          <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E2D4] font-mono-tech font-bold text-[#1D1C13]">
                            {src.count} invii
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Analytics 3: Statistiche Consensi GDPR & Cookie */}
                  <div className="bg-white rounded-2xl border border-[#E8E2D4] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#F0EBE2] pb-3">
                      <div>
                        <span className="font-mono-tech text-[10px] uppercase text-purple-800 font-bold">
                          ANALYTICS CONSENSI GDPR
                        </span>
                        <h4 className="font-chunky text-base text-[#1D1C13]">
                          Opt-In Cookie &amp; Privacy Form
                        </h4>
                      </div>
                      <span className="material-symbols-outlined notranslate text-purple-800 text-2xl">
                        policy
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          label: 'Cookie Tecnici + GDPR Obbligatori',
                          count: totalConsentsCount,
                          pct: 100,
                          color: 'bg-emerald-600'
                        },
                        {
                          label: 'Consenso Statistiche (GA4 Anonimo)',
                          count: analyticsConsentsCount,
                          pct: analyticsConsentRate,
                          color: 'bg-sky-600'
                        },
                        {
                          label: 'Consenso Marketing (Meta / TikTok)',
                          count: marketingConsentsCount,
                          pct: marketingConsentRate,
                          color: 'bg-purple-700'
                        },
                        {
                          label: 'Solo Tecnici (Rifiuto Profilazione)',
                          count: technicalOnlyConsentsCount,
                          pct:
                            totalConsentsCount > 0
                              ? Math.round((technicalOnlyConsentsCount / totalConsentsCount) * 100)
                              : 0,
                          color: 'bg-gray-600'
                        }
                      ].map((row) => (
                        <div key={row.label} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>{row.label}</span>
                            <span className="font-mono-tech font-bold">
                              {row.count} ({row.pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-[#F3EDDF] rounded-full overflow-hidden">
                            <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-[#F0EBE2] space-y-1.5">
                      <span className="font-epilogue text-[11px] font-bold uppercase text-[#7A7265] block">
                        Origine Prova del Consenso (Proof of Consent):
                      </span>
                      {(['Cookie Banner', 'Form Prenotazione', 'Form Contatti'] as const).map((origin) => {
                        const c = consents.filter((x) => x.source === origin).length;
                        return (
                          <div key={origin} className="flex items-center justify-between text-xs">
                            <span className="text-[#554245]">{origin}</span>
                            <span className="font-mono-tech font-bold text-dock-burgundy">{c} log</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Registro Ultime Email Automatiche / Risposte Inviate dal Sistema */}
                <div className="bg-white rounded-2xl border border-[#E8E2D4] shadow-xs overflow-hidden">
                  <div className="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined notranslate text-dock-burgundy text-[20px]">
                        outgoing_mail
                      </span>
                      <h4 className="font-chunky text-base text-[#1D1C13]">
                        Storico Email Inviate dal Sistema ({sentEmails.length})
                      </h4>
                    </div>
                    <span className="font-mono-tech text-[11px] text-[#336859] font-bold">
                      Template HTML Ufficiale Dock 71 Attivo
                    </span>
                  </div>

                  {sentEmails.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#7A7265]">
                      Nessuna email inviata in questa sessione. Conferma o rifiuta una prenotazione, oppure rispondi a un messaggio di contatto per generare e inviare l&apos;email con il layout del sito.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#E8E2D4]">
                      {sentEmails.map((mail) => (
                        <div
                          key={mail.id}
                          className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF9EB]"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  mail.type === 'booking_confirmed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : mail.type === 'booking_rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {mail.type === 'booking_confirmed'
                                  ? 'Email Conferma Tavolo'
                                  : mail.type === 'booking_rejected'
                                  ? 'Email Rifiuto Tavolo'
                                  : 'Risposta Contatto'}
                              </span>
                              <span className="font-mono-tech text-[11px] text-[#7A7265]">{mail.sentAt}</span>
                            </div>
                            <p className="font-bold text-xs text-[#1D1C13]">{mail.subject}</p>
                            <p className="text-xs text-[#554245]">
                              Destinatario: <strong>{mail.toName}</strong> ({mail.toEmail})
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setEmailPreviewModal({
                                subject: mail.subject,
                                recipient: `${mail.toName} <${mail.toEmail}>`,
                                html: mail.htmlContent
                              })
                            }
                            className="px-3 py-1.5 rounded-xl bg-white border border-dock-burgundy text-dock-burgundy hover:bg-dock-burgundy hover:text-white font-chunky text-xs uppercase transition-all cursor-pointer self-start sm:self-center"
                          >
                            Visualizza Layout Email
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SOTTO-SCHEDA 1: PRENOTAZIONI TAVOLI (FILTRI, BULK, EMAIL STATO) */}
            {/* ============================================================== */}
            {formSubTab === 'bookings' && (
              <div className="space-y-4">
                {/* Barra Filtri Prenotazioni */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  <div className="lg:col-span-2">
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Cerca Cliente / Codice / Telefono / Note
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined notranslate text-[16px] text-[#7A7265] absolute left-3 top-2.5">
                        search
                      </span>
                      <input
                        type="text"
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        placeholder="Es. DOCK-8492, Matteo, 340..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs focus:bg-white focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Stato Prenotazione
                    </label>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                    >
                      <option value="all">Tutti gli stati ({bookings.length})</option>
                      <option value="In Attesa">⏳ In Attesa ({pendingBookingsCount})</option>
                      <option value="Confermato">✓ Confermato ({confirmedBookingsCount})</option>
                      <option value="Rifiutato">✕ Rifiutato ({rejectedBookingsCount})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Sala / Ambiente
                    </label>
                    <select
                      value={bookingAreaFilter}
                      onChange={(e) => setBookingAreaFilter(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                    >
                      <option value="all">Tutte le sale</option>
                      <option value="Gru">Sala Gru</option>
                      <option value="Maxischermo">Zona Maxischermo</option>
                      <option value="Bancone">Bancone Spine</option>
                      <option value="Terrazza">Terrazza / Dehors</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                        Data Tavolo
                      </label>
                      <input
                        type="date"
                        value={bookingDateFilter}
                        onChange={(e) => setBookingDateFilter(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>
                    {(bookingSearch || bookingStatusFilter !== 'all' || bookingAreaFilter !== 'all' || bookingDateFilter) && (
                      <button
                        onClick={() => {
                          setBookingSearch('');
                          setBookingStatusFilter('all');
                          setBookingAreaFilter('all');
                          setBookingDateFilter('');
                        }}
                        className="px-3 py-2 rounded-xl bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        title="Azzera filtri"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Barra Azioni in Massa Prenotazioni */}
                {selectedBookingIds.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-dock-burgundy text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">
                        check_box
                      </span>
                      <span>{selectedBookingIds.length} prenotazioni selezionate</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          selectedBookingIds.forEach((id) => {
                            const b = bookings.find((x) => x.id === id);
                            if (b) handleConfirmBookingWithEmail(b);
                          });
                          setSelectedBookingIds([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-chunky text-[11px] uppercase cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[15px]">check_circle</span>
                        Conferma Selezionate ({selectedBookingIds.length})
                      </button>
                      <button
                        onClick={() => {
                          deleteBookingsBulk(selectedBookingIds);
                          setSelectedBookingIds([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-chunky text-[11px] uppercase cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[15px]">delete_sweep</span>
                        Elimina in Massa ({selectedBookingIds.length})
                      </button>
                      <button
                        onClick={() => setSelectedBookingIds([])}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer"
                      >
                        Deseleziona
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-[#E8E2D4] shadow-sm overflow-hidden">
                  <div className="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h4 className="font-chunky text-base text-[#1D1C13]">
                        Gestione Prenotazioni Tavoli ({filteredBookings.length} risultati)
                      </h4>
                      <p className="font-work text-[11px] text-[#554245]">
                        Cliccando <strong>Conferma</strong> parte un&apos;email automatica di accettazione al cliente con il layout del sito. Cliccando <strong>Rifiuta</strong> ti verrà chiesta prima la motivazione da includere nell&apos;email.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                        <tr>
                          <th className="p-3 w-9">
                            <input
                              type="checkbox"
                              checked={
                                filteredBookings.length > 0 &&
                                filteredBookings.every((b) => selectedBookingIds.includes(b.id))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBookingIds(filteredBookings.map((b) => b.id));
                                } else {
                                  setSelectedBookingIds([]);
                                }
                              }}
                              className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                              title="Seleziona tutte le prenotazioni visibili"
                            />
                          </th>
                          <th className="p-3">Codice / Canale</th>
                          <th className="p-3">Data / Ora</th>
                          <th className="p-3">Cliente &amp; Recapiti</th>
                          <th className="p-3">Ospiti / Sala</th>
                          <th className="p-3">Note &amp; Motivazioni</th>
                          <th className="p-3">Stato</th>
                          <th className="p-3 text-right">Gestione &amp; Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D4]">
                        {filteredBookings.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-[#7A7265]">
                              Nessuna prenotazione trovata con i filtri selezionati.
                            </td>
                          </tr>
                        ) : (
                          filteredBookings.map((b) => {
                            const isSelected = selectedBookingIds.includes(b.id);
                            return (
                              <tr
                                key={b.id}
                                className={`hover:bg-[#FFF9EB] transition-colors ${
                                  isSelected ? 'bg-[#FFF9EB]' : ''
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedBookingIds((prev) => [...prev, b.id]);
                                      } else {
                                        setSelectedBookingIds((prev) => prev.filter((id) => id !== b.id));
                                      }
                                    }}
                                    className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                                  />
                                </td>
                                <td className="p-3">
                                  <span className="font-mono font-bold text-dock-burgundy block">{b.bookingCode}</span>
                                  <span className="text-[10px] text-[#7A7265] block">{b.source}</span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="font-bold text-[#1D1C13] block">{b.date}</span>
                                  <span className="font-mono-tech text-[11px] text-dock-burgundy font-bold">
                                    ore {b.timeSlot}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <span className="font-bold text-[#1D1C13] block">{b.name}</span>
                                  <span className="text-[#554245] block">{b.phone}</span>
                                  <span className="text-[#7A7265] text-[11px] block">{b.email}</span>
                                </td>
                                <td className="p-3">
                                  <span className="font-chunky text-sm text-dock-burgundy block">{b.guests} pax</span>
                                  <span className="text-[11px] text-[#554245] font-semibold">{b.area}</span>
                                </td>
                                <td className="p-3 max-w-xs">
                                  <p className="text-[#1D1C13] line-clamp-2" title={b.notes}>
                                    {b.notes || '—'}
                                  </p>
                                  {b.status === 'Rifiutato' && b.rejectionReason && (
                                    <div className="mt-1 p-1.5 rounded bg-red-50 border border-red-200 text-[10px] text-red-800">
                                      <strong>Motivo Rifiuto:</strong> {b.rejectionReason}
                                    </div>
                                  )}
                                  {b.lastEmailSentAt && (
                                    <span className="text-[10px] text-emerald-700 font-mono-tech block mt-1">
                                      ✉ Email inviata: {b.lastEmailSentAt}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                                      b.status === 'Confermato'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : b.status === 'Rifiutato'
                                        ? 'bg-red-100 text-red-800 border border-red-300'
                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}
                                  >
                                    {b.status === 'Confermato' && '✓ '}
                                    {b.status === 'Rifiutato' && '✕ '}
                                    {b.status === 'In Attesa' && '⏳ '}
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => handleConfirmBookingWithEmail(b)}
                                      disabled={b.status === 'Confermato'}
                                      title="Conferma prenotazione e invia email automatica al cliente"
                                      className={`px-2.5 py-1.5 rounded-lg font-epilogue font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1 ${
                                        b.status === 'Confermato'
                                          ? 'bg-emerald-50 text-emerald-400 cursor-not-allowed'
                                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                      }`}
                                    >
                                      <span className="material-symbols-outlined notranslate text-[14px]">check</span>
                                      Conferma
                                    </button>

                                    <button
                                      onClick={() => openRejectBookingModal(b)}
                                      title="Rifiuta prenotazione specificando la motivazione nell'email"
                                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-epilogue font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                                    >
                                      <span className="material-symbols-outlined notranslate text-[14px]">block</span>
                                      Rifiuta
                                    </button>

                                    {b.emailHtmlPreview && (
                                      <button
                                        onClick={() =>
                                          setEmailPreviewModal({
                                            subject: `Email Prenotazione ${b.bookingCode} (${b.status})`,
                                            recipient: `${b.name} <${b.email}>`,
                                            html: b.emailHtmlPreview!
                                          })
                                        }
                                        title="Visualizza l'email inviata al cliente"
                                        className="p-1.5 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-[#1D1C13] transition-colors cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined notranslate text-[15px]">
                                          mail
                                        </span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        deleteBooking(b.id);
                                        setSelectedBookingIds((prev) => prev.filter((id) => id !== b.id));
                                      }}
                                      title="Elimina singola prenotazione"
                                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 transition-colors cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined notranslate text-[15px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SOTTO-SCHEDA 2: MESSAGGI CONTATTI (RISPOSTA DIRETTA + BULK)    */}
            {/* ============================================================== */}
            {formSubTab === 'contacts' && (
              <div className="space-y-4">
                {/* Barra Filtri Contatti */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                  <div className="lg:col-span-2">
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Cerca Mittente / Email / Oggetto / Testo Messaggio
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined notranslate text-[16px] text-[#7A7265] absolute left-3 top-2.5">
                        search
                      </span>
                      <input
                        type="text"
                        value={contactSearch}
                        onChange={(e) => setContactSearch(e.target.value)}
                        placeholder="Es. Stefano, Natale, senza glutine..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs focus:bg-white focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Stato Messaggio
                    </label>
                    <select
                      value={contactStatusFilter}
                      onChange={(e) => setContactStatusFilter(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                    >
                      <option value="all">Tutti i messaggi ({contacts.length})</option>
                      <option value="Nuovo">● Nuovi ({newContactsCount})</option>
                      <option value="Letto">👁 Letti ({contacts.filter((c) => c.status === 'Letto').length})</option>
                      <option value="Risposto">✓ Risposti ({repliedContactsCount})</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                        Canale Origine
                      </label>
                      <select
                        value={contactSourceFilter}
                        onChange={(e) => setContactSourceFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                      >
                        <option value="all">Tutti i canali</option>
                        <option value="Pagina Contatti">Pagina Contatti</option>
                        <option value="Widget Rapido">Widget Rapido</option>
                      </select>
                    </div>
                    {(contactSearch || contactStatusFilter !== 'all' || contactSourceFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setContactSearch('');
                          setContactStatusFilter('all');
                          setContactSourceFilter('all');
                        }}
                        className="px-3 py-2 rounded-xl bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Barra Azioni in Massa Contatti */}
                {selectedContactIds.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-dock-burgundy text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">
                        check_box
                      </span>
                      <span>{selectedContactIds.length} messaggi selezionati</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          selectedContactIds.forEach((id) => markContactStatus(id, 'Letto'));
                          setSelectedContactIds([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-chunky text-[11px] uppercase cursor-pointer"
                      >
                        Segna come Letti
                      </button>
                      <button
                        onClick={() => {
                          deleteContactsBulk(selectedContactIds);
                          setSelectedContactIds([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-chunky text-[11px] uppercase cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[15px]">delete_sweep</span>
                        Elimina in Massa ({selectedContactIds.length})
                      </button>
                      <button
                        onClick={() => setSelectedContactIds([])}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer"
                      >
                        Deseleziona
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-[#E8E2D4] shadow-sm overflow-hidden">
                  <div className="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4]">
                    <h4 className="font-chunky text-base text-[#1D1C13]">
                      Messaggi Ricevuti dal Modulo Contatti ({filteredContacts.length})
                    </h4>
                    <p className="font-work text-[11px] text-[#554245]">
                      Rispondi direttamente dal pannello tramite il pulsante <strong>Rispondi</strong>: una volta inviata la risposta, lo stato si aggiorna automaticamente in <strong>Risposto</strong>.
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                        <tr>
                          <th className="p-3 w-9">
                            <input
                              type="checkbox"
                              checked={
                                filteredContacts.length > 0 &&
                                filteredContacts.every((c) => selectedContactIds.includes(c.id))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedContactIds(filteredContacts.map((c) => c.id));
                                } else {
                                  setSelectedContactIds([]);
                                }
                              }}
                              className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                              title="Seleziona tutti i messaggi visibili"
                            />
                          </th>
                          <th className="p-3">Data / Origine</th>
                          <th className="p-3">Mittente &amp; Recapiti</th>
                          <th className="p-3">Oggetto &amp; Messaggio</th>
                          <th className="p-3">Stato</th>
                          <th className="p-3 text-right">Rispondi / Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D4]">
                        {filteredContacts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-[#7A7265]">
                              Nessun messaggio trovato con i filtri selezionati.
                            </td>
                          </tr>
                        ) : (
                          filteredContacts.map((c) => {
                            const isSelected = selectedContactIds.includes(c.id);
                            return (
                              <tr
                                key={c.id}
                                className={`hover:bg-[#FFF9EB] transition-colors ${
                                  isSelected ? 'bg-[#FFF9EB]' : ''
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedContactIds((prev) => [...prev, c.id]);
                                      } else {
                                        setSelectedContactIds((prev) => prev.filter((id) => id !== c.id));
                                      }
                                    }}
                                    className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                                  />
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="font-mono text-[11px] font-semibold block">{c.createdAt}</span>
                                  <span className="text-[10px] text-[#7A7265] block">{c.source} • IP {c.ip}</span>
                                </td>
                                <td className="p-3">
                                  <span className="font-bold text-[#1D1C13] block">{c.name}</span>
                                  <span className="text-dock-burgundy font-medium block">{c.email}</span>
                                  <span className="text-[#7A7265] text-[11px] block">{c.phone}</span>
                                </td>
                                <td className="p-3 max-w-md">
                                  <span className="font-bold text-dock-burgundy block mb-0.5">{c.subject}</span>
                                  <p className="text-[#1D1C13] leading-relaxed">{c.message}</p>
                                  {c.status === 'Risposto' && c.replyMessage && (
                                    <div className="mt-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950">
                                      <span className="font-bold text-emerald-800 block">
                                        ✓ Tua risposta inviata il {c.repliedAt}:
                                      </span>
                                      <span className="italic">{c.replyMessage}</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase inline-flex items-center gap-1 ${
                                      c.status === 'Risposto'
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                        : c.status === 'Letto'
                                        ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}
                                  >
                                    {c.status === 'Risposto' ? '✓ Risposto' : c.status === 'Letto' ? 'Letto' : '● Nuovo'}
                                  </span>
                                </td>
                                <td className="p-3 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      onClick={() => openReplyContactModal(c)}
                                      className="px-3 py-1.5 rounded-lg bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-epilogue font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                                    >
                                      <span className="material-symbols-outlined notranslate text-[14px]">reply</span>
                                      {c.status === 'Risposto' ? 'Rispondi di Nuovo' : 'Rispondi'}
                                    </button>

                                    {c.emailHtmlPreview && (
                                      <button
                                        onClick={() =>
                                          setEmailPreviewModal({
                                            subject: `Re: ${c.subject}`,
                                            recipient: `${c.name} <${c.email}>`,
                                            html: c.emailHtmlPreview!
                                          })
                                        }
                                        title="Visualizza email di risposta inviata"
                                        className="p-1.5 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-[#1D1C13] transition-colors cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined notranslate text-[15px]">mail</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => {
                                        deleteContact(c.id);
                                        setSelectedContactIds((prev) => prev.filter((id) => id !== c.id));
                                      }}
                                      title="Elimina messaggio"
                                      className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 transition-colors cursor-pointer"
                                    >
                                      <span className="material-symbols-outlined notranslate text-[15px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SOTTO-SCHEDA 3: REGISTRO CONSENSI GDPR (FILTRI & BULK DELETE)  */}
            {/* ============================================================== */}
            {formSubTab === 'consents' && (
              <div className="space-y-4">
                {/* Barra Filtri Consensi GDPR */}
                <div className="bg-white p-4 rounded-2xl border border-[#E8E2D4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                  <div className="lg:col-span-2">
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Cerca ID Consenso / Indirizzo IP / Browser User-Agent
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined notranslate text-[16px] text-[#7A7265] absolute left-3 top-2.5">
                        search
                      </span>
                      <input
                        type="text"
                        value={consentSearch}
                        onChange={(e) => setConsentSearch(e.target.value)}
                        placeholder="Es. CONSENT-673, 93.42..., Chrome, iPhone..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs focus:bg-white focus:border-dock-burgundy focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                      Tipologia Consenso
                    </label>
                    <select
                      value={consentTypeFilter}
                      onChange={(e) => setConsentTypeFilter(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                    >
                      <option value="all">Tutti i consensi ({consents.length})</option>
                      <option value="analytics">Con Analitici GA4 ({analyticsConsentsCount})</option>
                      <option value="marketing">Con Marketing Pixel ({marketingConsentsCount})</option>
                      <option value="technical_only">Solo Tecnici ({technicalOnlyConsentsCount})</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block font-epilogue text-[10px] font-bold uppercase text-[#7A7265] mb-1">
                        Origine Consenso
                      </label>
                      <select
                        value={consentSourceFilter}
                        onChange={(e) => setConsentSourceFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8E2D4] text-xs font-semibold focus:border-dock-burgundy focus:outline-none"
                      >
                        <option value="all">Tutte le sorgenti</option>
                        <option value="Cookie Banner">Cookie Banner</option>
                        <option value="Form Prenotazione">Form Prenotazione</option>
                        <option value="Form Contatti">Form Contatti</option>
                      </select>
                    </div>
                    {(consentSearch || consentTypeFilter !== 'all' || consentSourceFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setConsentSearch('');
                          setConsentTypeFilter('all');
                          setConsentSourceFilter('all');
                        }}
                        className="px-3 py-2 rounded-xl bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Barra Azioni in Massa Consensi */}
                {selectedConsentIds.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-dock-burgundy text-white flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="material-symbols-outlined notranslate text-[18px] text-dock-mustard">
                        check_box
                      </span>
                      <span>{selectedConsentIds.length} log di consenso selezionati</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          deleteConsentLogsBulk(selectedConsentIds);
                          setSelectedConsentIds([]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-chunky text-[11px] uppercase cursor-pointer flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined notranslate text-[15px]">delete_sweep</span>
                        Elimina Selezionati ({selectedConsentIds.length})
                      </button>
                      <button
                        onClick={() => setSelectedConsentIds([])}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold cursor-pointer"
                      >
                        Deseleziona
                      </button>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-[#E8E2D4] shadow-sm overflow-hidden">
                  <div className="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4]">
                    <h4 className="font-chunky text-base text-[#1D1C13]">
                      Registro Consensi Cookie &amp; Trattamento Dati GDPR ({filteredConsents.length})
                    </h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                        <tr>
                          <th className="p-3 w-9">
                            <input
                              type="checkbox"
                              checked={
                                filteredConsents.length > 0 &&
                                filteredConsents.every((log) => selectedConsentIds.includes(log.id))
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedConsentIds(filteredConsents.map((log) => log.id));
                                } else {
                                  setSelectedConsentIds([]);
                                }
                              }}
                              className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                              title="Seleziona tutti i log visibili"
                            />
                          </th>
                          <th className="p-3">ID Consenso Univoco</th>
                          <th className="p-3">Data e Ora / Sorgente</th>
                          <th className="p-3">Indirizzo IP</th>
                          <th className="p-3">Categorie Autorizzate</th>
                          <th className="p-3">User Agent Browser</th>
                          <th className="p-3 text-right">Azioni</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E2D4]">
                        {filteredConsents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-[#7A7265]">
                              Nessun log di consenso trovato con i filtri selezionati.
                            </td>
                          </tr>
                        ) : (
                          filteredConsents.map((log) => {
                            const isSelected = selectedConsentIds.includes(log.id);
                            return (
                              <tr
                                key={log.id}
                                className={`hover:bg-[#FFF9EB] transition-colors ${
                                  isSelected ? 'bg-[#FFF9EB]' : ''
                                }`}
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedConsentIds((prev) => [...prev, log.id]);
                                      } else {
                                        setSelectedConsentIds((prev) => prev.filter((id) => id !== log.id));
                                      }
                                    }}
                                    className="w-4 h-4 rounded accent-dock-burgundy cursor-pointer"
                                  />
                                </td>
                                <td className="p-3 font-mono font-bold text-dock-burgundy">{log.id}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className="font-semibold block">{log.timestamp}</span>
                                  <span className="text-[10px] text-[#7A7265]">{log.source}</span>
                                </td>
                                <td className="p-3 font-mono text-emerald-800 font-semibold">{log.ip}</td>
                                <td className="p-3">
                                  <div className="flex flex-wrap gap-1">
                                    {log.purposes.map((p) => (
                                      <span
                                        key={p}
                                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]"
                                      >
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td
                                  className="p-3 font-mono text-[10px] text-[#7A7265] max-w-sm truncate"
                                  title={log.userAgent}
                                >
                                  {log.userAgent}
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => {
                                      deleteConsentLog(log.id);
                                      setSelectedConsentIds((prev) => prev.filter((id) => id !== log.id));
                                    }}
                                    title="Elimina singolo log consenso"
                                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-700 transition-colors cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined notranslate text-[15px]">delete</span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ==================================================================== */}
      {/* MODALE: CREAZIONE / MODIFICA PRODOTTO CON UPLOAD NATIVO WEBP/AVIF   */}
      {/* ==================================================================== */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                {editingItem ? 'Modifica Piatto / Birra' : 'Aggiungi Nuovo Prodotto'}
              </h3>
              <button
                onClick={() => setIsItemModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Nome Prodotto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="es. Pizza Marinaia del Molo"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Prezzo (€) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="€ 13.50"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Categoria Menù
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name} ({c.slug})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Menù Stagionale (Opzionale)
                  </label>
                  <select
                    value={formSeasonalId}
                    onChange={(e) => setFormSeasonalId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    <option value="">Nessuno (Menù Fisso Continuo)</option>
                    {seasonalMenus.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.season})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Ingredienti &amp; Descrizione
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrivi la preparazione, lievitazione, luppoli o abbinamenti..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Dicitura Speciale / Badge / Note
                </label>
                <input
                  type="text"
                  value={formSpecs}
                  onChange={(e) => setFormSpecs(e.target.value)}
                  placeholder="es. LIEVITAZIONE 48H • FARINA MACINATA A PIETRA"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              {/* Upload Nativo Immagine Piatto */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D4] space-y-2">
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13]">
                  Foto Prodotto (Upload Nativo con Conversione Automatica WebP/AVIF)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    disabled={isUploading}
                    onChange={(e) =>
                      handleNativeFileUpload(e, (url) => {
                        setFormImage(url);
                      })
                    }
                    className="text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-dock-burgundy file:text-white file:cursor-pointer"
                  />
                  {formImage && (
                    <img
                      src={formImage}
                      alt="Anteprima"
                      className="w-12 h-12 rounded-xl object-cover border border-[#E8E2D4]"
                    />
                  )}
                </div>
                {formImage && (
                  <span className="font-mono-tech text-[10px] text-[#7A7265] block truncate">
                    File attivo: {formImage}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D4]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-dock-burgundy"
                  />
                  <span className="text-xs font-epilogue font-bold uppercase text-[#1D1C13]">
                    Prodotto Attivo nel Menù
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsItemModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                  >
                    Annulla
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark"
                  >
                    Salva Prodotto
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: GESTIONE CATEGORIA (CREA / MODIFICA)                        */}
      {/* ==================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                {editingCategory ? 'Modifica Categoria' : 'Crea Nuova Categoria'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Nome Categoria *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="es. Primi Piatti Portuali"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Slug URL (Identificativo)
                </label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="es. primi (lascia vuoto per generazione automatica)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Icona Material Symbols
                </label>
                <select
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                >
                  <option value="sports_bar">🍺 Birra (sports_bar)</option>
                  <option value="local_pizza">🍕 Pizza (local_pizza)</option>
                  <option value="lunch_dining">🍔 Burger (lunch_dining)</option>
                  <option value="tapas">🍤 Sfizi / Fritti (tapas)</option>
                  <option value="restaurant">🍴 Ristorante / Primi (restaurant)</option>
                  <option value="set_meal">🐟 Griglia / Carni (set_meal)</option>
                  <option value="cake">🍰 Dolci / Dessert (cake)</option>
                  <option value="local_bar">🍸 Cocktail / Spirits (local_bar)</option>
                  <option value="coffee">☕ Caffetteria (coffee)</option>
                </select>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Descrizione (Opzionale)
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Breve didascalia visibile nel menù..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark"
                >
                  Salva Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: GESTIONE MENÙ STAGIONALE (DATE & CAMPAGNA)                  */}
      {/* ==================================================================== */}
      {isSeasonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                {editingSeason ? 'Modifica Menù Stagionale' : 'Crea Menù Stagionale'}
              </h3>
              <button
                onClick={() => setIsSeasonModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSeason} className="space-y-4">
              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Titolo Menù Stagionale *
                </label>
                <input
                  type="text"
                  required
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  placeholder="es. Menù Invernale: Malto Caldo & Tagliate di Cervo"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Stagione
                  </label>
                  <select
                    value={seasonType}
                    onChange={(e) => setSeasonType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    <option value="inverno">Inverno</option>
                    <option value="primavera">Primavera</option>
                    <option value="estate">Estate</option>
                    <option value="autunno">Autunno</option>
                    <option value="speciale">Speciale / Fuori Stagione</option>
                  </select>
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Badge in Evidenza
                  </label>
                  <input
                    type="text"
                    value={seasonBadge}
                    onChange={(e) => setSeasonBadge(e.target.value)}
                    placeholder="EDIZIONE INVERNALE"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Data Inizio Validità
                  </label>
                  <input
                    type="date"
                    required
                    value={seasonStart}
                    onChange={(e) => setSeasonStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Data Fine Validità
                  </label>
                  <input
                    type="date"
                    required
                    value={seasonEnd}
                    onChange={(e) => setSeasonEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Avviso Banner Frontend
                </label>
                <textarea
                  rows={2}
                  value={seasonNotice}
                  onChange={(e) => setSeasonNotice(e.target.value)}
                  placeholder="es. ★ MENÙ INVERNALE ATTIVO: Birre Winter Warmers & Pizze Stagionali con Funghi Porcini ★"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setIsSeasonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark"
                >
                  Salva Menù Stagionale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: AGGIUNGI PIATTO AL MENÙ STAGIONALE                          */}
      {/* ==================================================================== */}
      {isSeasonDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                Aggiungi Piatto a: {currentSeason?.name}
              </h3>
              <button
                onClick={() => setIsSeasonDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSeasonalDish} className="space-y-4">
              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Nome Specialità Stagionale *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="es. Tagliata di Cervo al Ginepro"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Prezzo (€) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="€ 18.00"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Descrizione &amp; Abbinamenti
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Descrivi la ricetta stagionale, le farine o la birra consigliata..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              {/* Upload Diretto Foto */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#E8E2D4] space-y-2">
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13]">
                  Foto Specialità (Upload con Conversione WebP/AVIF Automatica)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={isUploading}
                  onChange={(e) =>
                    handleNativeFileUpload(e, (url) => {
                      setFormImage(url);
                    })
                  }
                  className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-dock-burgundy file:text-white file:cursor-pointer"
                />
                {formImage && (
                  <img src={formImage} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-[#E8E2D4]" />
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setIsSeasonDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark"
                >
                  Inserisci nel Menù
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: CARICA / MODIFICA FOTO GALLERIA (UPLOAD NATIVO DIRETTO)    */}
      {/* ==================================================================== */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                {editingGallery ? 'Modifica Foto Galleria' : 'Carica Nuova Foto Galleria'}
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              {/* Box Upload Nativo Senza URL Manuale */}
              <div className="p-4 rounded-2xl bg-white border-2 border-dashed border-[#E8E2D4] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EA] text-dock-burgundy flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined notranslate text-2xl">cloud_upload</span>
                </div>
                <div>
                  <span className="font-epilogue font-bold text-xs uppercase text-[#1D1C13] block">
                    Carica Immagine dal Tuo Dispositivo
                  </span>
                  <span className="text-[11px] text-[#7A7265] block mt-0.5">
                    Accetta JPG, PNG, WEBP, AVIF. Viene convertita e ottimizzata istantaneamente.
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={isUploading}
                  onChange={(e) =>
                    handleNativeFileUpload(e, (url, format) => {
                      setGalUrl(url);
                      setGalFormat(format);
                    })
                  }
                  className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-dock-burgundy file:text-white file:cursor-pointer"
                />

                {galUrl && (
                  <div className="pt-2">
                    <img
                      src={galUrl}
                      alt="Anteprima caricata"
                      className="w-full h-44 object-cover rounded-xl border border-[#E8E2D4]"
                    />
                    <span className="font-mono-tech text-[10px] text-emerald-700 font-bold block mt-1">
                      ✓ Immagine pronta e salvata in /uploads/images/ ({galFormat.toUpperCase()})
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Titolo dello Scatto *
                </label>
                <input
                  type="text"
                  required
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  placeholder="es. Pinta di Thames Porter al Bancone"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Categoria
                  </label>
                  <select
                    value={galCategory}
                    onChange={(e) => setGalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    <option value="locale">Sala Gru &amp; Locale</option>
                    <option value="birre">Birre &amp; Spine</option>
                    <option value="pizza">Pizze 48h</option>
                    <option value="burger">Burger &amp; Griglia</option>
                    <option value="terrazza">Dehor Estivo</option>
                    <option value="community">Serate &amp; Sport</option>
                  </select>
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Badge Stamp
                  </label>
                  <input
                    type="text"
                    value={galBadge}
                    onChange={(e) => setGalBadge(e.target.value)}
                    placeholder="14 TAP ON BOARD"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Didascalia Narrativa
                </label>
                <textarea
                  rows={2}
                  value={galCaption}
                  onChange={(e) => setGalCaption(e.target.value)}
                  placeholder="Breve storia dello scatto..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={!galUrl}
                  className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark disabled:opacity-50"
                >
                  Pubblica Foto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: GESTIONE PALINSESTO SPORTIVO                                */}
      {/* ==================================================================== */}
      {isMatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E8E2D4] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D4] pb-3">
              <h3 className="font-chunky text-xl text-[#1D1C13]">
                {editingMatch ? 'Modifica Partita' : 'Aggiungi Partita Sky Sport'}
              </h3>
              <button
                onClick={() => setIsMatchModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F3EDDF] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMatch} className="space-y-4">
              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Incontro / Gara *
                </label>
                <input
                  type="text"
                  required
                  value={matchTeams}
                  onChange={(e) => setMatchTeams(e.target.value)}
                  placeholder="es. Inter vs Real Madrid"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Competizione
                  </label>
                  <input
                    type="text"
                    required
                    value={matchCompetition}
                    onChange={(e) => setMatchCompetition(e.target.value)}
                    placeholder="Champions League"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Sport
                  </label>
                  <select
                    value={matchSport}
                    onChange={(e) => setMatchSport(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  >
                    <option value="calcio">Calcio</option>
                    <option value="rugby">Rugby</option>
                    <option value="basket">Basket</option>
                    <option value="motori">Motori (F1 / MotoGP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Giorno / Data
                  </label>
                  <input
                    type="text"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    placeholder="Mercoledì 26 Nov"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Orario Inizio
                  </label>
                  <input
                    type="text"
                    required
                    value={matchTime}
                    onChange={(e) => setMatchTime(e.target.value)}
                    placeholder="21:00"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Descrizione
                  </label>
                  <input
                    type="text"
                    value={matchDescription}
                    onChange={(e) => setMatchDescription(e.target.value)}
                    placeholder="Es. Diretta su Maxischermo con cucina e birreria attive"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                    Birra Consigliata
                  </label>
                  <input
                    type="text"
                    value={matchBeer}
                    onChange={(e) => setMatchBeer(e.target.value)}
                    placeholder="Dock Crane Pilsner"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setIsMatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3EDDF] text-xs font-bold font-epilogue uppercase hover:bg-[#E8E2D4]"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase shadow-md hover:bg-dock-burgundy-dark"
                >
                  Salva Partita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: RIFIUTO PRENOTAZIONE CON MOTIVAZIONE RISTORATORE             */}
      {/* ==================================================================== */}
      {rejectingBooking && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9EB] w-full max-w-xl rounded-3xl border-3 border-dock-burgundy shadow-2xl overflow-hidden">
            <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4]"></div>
            <div className="p-5 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between">
              <div>
                <span className="font-marker text-[10px] text-dock-burgundy uppercase font-bold block">
                  INVIO EMAIL DI RIFIUTO PRENOTAZIONE • {rejectingBooking.bookingCode}
                </span>
                <h3 className="font-chunky text-lg text-[#1D1C13] uppercase">
                  Inserisci la Motivazione per {rejectingBooking.name}
                </h3>
              </div>
              <button
                onClick={() => setRejectingBooking(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D4] text-[#1D1C13] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendRejectionEmail} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-white border border-[#E8E2D4] text-xs text-[#554245] flex flex-wrap items-center justify-between gap-2">
                <span>
                  <strong>Data richiesta:</strong> {rejectingBooking.date} ore {rejectingBooking.timeSlot}
                </span>
                <span>
                  <strong>Ospiti:</strong> {rejectingBooking.guests} pax ({rejectingBooking.area})
                </span>
                <span>
                  <strong>Email:</strong> {rejectingBooking.email}
                </span>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1.5">
                  Motivazioni Rapide Preimpostate (Clicca per compilare):
                </label>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    'Sala al completo per la fascia oraria richiesta; vi proponiamo le 19:30 o le 21:45.',
                    'Evento privato riservato nella sala richiesta per quella serata.',
                    'Esaurita disponibilità per tavolate numerose in questo turno; contattateci al 031 4487120 per soluzioni alternative.'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectionReason(preset)}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-[#F3EDDF] hover:bg-dock-burgundy hover:text-white text-[11px] font-medium transition-colors cursor-pointer border border-[#E8E2D4]"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                <label className="block font-epilogue text-xs font-bold uppercase text-dock-burgundy mb-1">
                  Motivazione del Rifiuto (verrà inserita nel corpo dell&apos;email al cliente) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Scrivi qui il motivo del rifiuto o la proposta di orario alternativo..."
                  className="w-full p-3 rounded-xl bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy text-xs font-work focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setRejectingBooking(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-bold font-epilogue uppercase hover:bg-[#F3EDDF] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-dock-burgundy hover:bg-dock-burgundy-dark text-white font-chunky text-xs uppercase shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">send</span>
                  Conferma Rifiuto &amp; Invia Email al Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: RISPOSTA DIRETTA AL MESSAGGIO CONTATTO DAL SISTEMA           */}
      {/* ==================================================================== */}
      {replyingContact && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9EB] w-full max-w-2xl rounded-3xl border-3 border-dock-burgundy shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="h-3 w-full checker-ribbon-burgundy border-b border-[#E8E2D4] shrink-0"></div>
            <div className="p-5 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between shrink-0">
              <div>
                <span className="font-marker text-[10px] text-[#336859] uppercase font-bold block">
                  RISPOSTA DIRETTA DAL SISTEMA CRM • AGGIORNA STATO IN &quot;RISPOSTO&quot;
                </span>
                <h3 className="font-chunky text-lg text-[#1D1C13] uppercase">
                  Rispondi a {replyingContact.name} ({replyingContact.email})
                </h3>
              </div>
              <button
                onClick={() => setReplyingContact(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D4] text-[#1D1C13] flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendContactReply} className="p-6 space-y-4 overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-white border border-[#E8E2D4] space-y-1">
                <span className="font-mono-tech text-[10px] uppercase font-bold text-[#7A7265] block">
                  Messaggio Ricevuto il {replyingContact.createdAt} • Tel: {replyingContact.phone}
                </span>
                <p className="font-bold text-xs text-dock-burgundy">{replyingContact.subject}</p>
                <p className="text-xs text-[#1D1C13] italic">&ldquo;{replyingContact.message}&rdquo;</p>
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Oggetto Email di Risposta *
                </label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-work focus:border-dock-burgundy focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-epilogue text-xs font-bold uppercase text-[#1D1C13] mb-1">
                  Corpo della Risposta (inviata con layout grafico Dock 71) *
                </label>
                <textarea
                  rows={5}
                  required
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white border-2 border-[#E8E2D4] focus:border-dock-burgundy text-xs font-work focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
                <button
                  type="button"
                  onClick={() => setReplyingContact(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-[#E8E2D4] text-xs font-bold font-epilogue uppercase hover:bg-[#F3EDDF] cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-dock-green hover:bg-emerald-800 text-white font-chunky text-xs uppercase shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined notranslate text-[16px]">send</span>
                  Invia Risposta &amp; Segna come &quot;Risposto&quot;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODALE: ANTEPRIMA EMAIL HTML INVIATA AL CLIENTE (LAYOUT SITO DOCK 71) */}
      {/* ==================================================================== */}
      {emailPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-3xl border-3 border-dock-burgundy shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex items-center justify-between shrink-0">
              <div>
                <span className="font-mono-tech text-[10px] uppercase font-bold text-dock-burgundy block">
                  LAYOUT EMAIL AUTOMATICA DOCK 71 CANTÙ • A: {emailPreviewModal.recipient}
                </span>
                <h4 className="font-chunky text-base text-[#1D1C13]">{emailPreviewModal.subject}</h4>
              </div>
              <button
                onClick={() => setEmailPreviewModal(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E8E2D4] text-[#1D1C13] flex items-center justify-center cursor-pointer hover:bg-dock-burgundy hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 bg-[#FAF7F2]">
              <div
                dangerouslySetInnerHTML={{ __html: emailPreviewModal.html }}
              />
            </div>
            <div className="p-3 bg-[#F3EDDF] border-t border-[#E8E2D4] flex justify-end shrink-0">
              <button
                onClick={() => setEmailPreviewModal(null)}
                className="px-5 py-2 rounded-xl bg-dock-burgundy text-white font-chunky text-xs uppercase cursor-pointer"
              >
                Chiudi Anteprima Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
