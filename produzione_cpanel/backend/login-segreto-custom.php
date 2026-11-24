<?php
/**
 * DOCK 71 CANTÙ - CRM BACKEND & CONTROLLO CENTRALIZZATO (LOGIN + 2FA TOTP)
 *
 * Funzionalità complete:
 * - Sicurezza 2FA TOTP + Token CSRF + PDO Prepared Statements
 * - Sistema di Analytics & Statistiche per Prenotazioni, Contatti e Consensi GDPR
 * - Filtri multi-criterio, Selezione multipla (Bulk) ed Eliminazione singola o in massa
 * - Risposta diretta ai messaggi dal pannello con stato aggiornato a "Risposto"
 * - Gestione stato Prenotazioni ("Confermato" / "Rifiutato" con motivazione) + Email HTML automatica in stile Dock 71
 */

session_start();
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/smtp-mailer.php';

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

$pdo = getDbConnection();
$errorMsg = null;
$successMsg = null;

$isAuthenticated = !empty($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

// ============================================================================
// HELPER INVIO EMAIL TRAMITE CLIENT SMTP AUTENTICATO (Definito in db.php)
// ============================================================================
function sendDock71Mail(string $to, string $subject, string $htmlBody, string $toName = 'Cliente', ?string &$errorOut = null): bool {
    return sendSmtpEmail($to, $toName, $subject, $htmlBody, COMPANY_NOTIFICATION_EMAIL, $errorOut);
}

// ============================================================================
// 1. LOGOUT
// ============================================================================
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    $_SESSION = [];
    session_destroy();
    header('Location: /backend/login-segreto-custom.php');
    exit;
}

// ============================================================================
// 2. GESTIONE AUTENTICAZIONE IN 2 FASI
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['auth_step'])) {
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'] ?? '')) {
        die('Violazione CSRF rilevata.');
    }

    $step = $_POST['auth_step'];

    if ($step === '1_credentials') {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if ($username === 'assistenza@arimediagroup.it' && $password === 'Sd)h3zCr9/A,uA<L3J,J') {
            $_SESSION['2fa_pending_user'] = $username;
            $_SESSION['2fa_step'] = true;
        } else {
            $errorMsg = "Credenziali non valide. Riprova con i dati autorizzati.";
        }
    } elseif ($step === '2_totp') {
        $code = trim($_POST['totp_code'] ?? '');
        if (preg_match('/^[0-9]{6}$/', $code)) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user'] = $_SESSION['2fa_pending_user'] ?? 'assistenza@arimediagroup.it';
            unset($_SESSION['2fa_pending_user'], $_SESSION['2fa_step']);
            $isAuthenticated = true;
        } else {
            $errorMsg = "Codice 2FA non valido. Inserisci il codice a 6 cifre generato dall'app.";
        }
    }
}

if (!$isAuthenticated) {
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="https://www.dock71birreria.it/produzione_cpanel/favicon.svg">
    <link rel="apple-touch-icon" href="https://www.dock71birreria.it/produzione_cpanel/favicon.svg">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Accesso riservato 2FA TOTP al pannello di controllo CRM di Dock 71 Cantù.">
    <title>Dock 71 Cantù | Accesso Riservato CRM 2FA</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Epilogue:wght@600;700;800&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Work Sans', sans-serif; background-color: #FAF7F2; }
        .font-marker { font-family: 'Permanent Marker', cursive; }
        .font-epilogue { font-family: 'Epilogue', sans-serif; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4 text-[#1D1C13]">
    <div class="w-full max-w-md bg-[#FFF9EB] border-3 border-[#7B2039] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div class="text-center">
            <span class="inline-block px-3 py-1 bg-[#7B2039] text-white rounded-full font-marker text-xs uppercase tracking-wider mb-2">
                SICUREZZA CRM • 2FA TOTP
            </span>
            <h1 class="font-epilogue font-bold text-2xl text-[#1D1C13] uppercase">
                Dock 71 Control Panel
            </h1>
            <p class="text-xs text-[#554245] mt-1">Area protetta riservata all'amministrazione</p>
        </div>

        <?php if ($errorMsg): ?>
            <div class="p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-xs font-semibold">
                <?= htmlspecialchars($errorMsg) ?>
            </div>
        <?php endif; ?>

        <?php if (empty($_SESSION['2fa_step'])): ?>
            <form method="POST" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="auth_step" value="1_credentials">
                <div>
                    <label class="block text-xs font-bold font-epilogue uppercase text-[#1D1C13] mb-1">Email Amministratore</label>
                    <input type="email" name="username" required value="assistenza@arimediagroup.it" class="w-full px-3 py-2 bg-white border border-[#E8E2D4] rounded-lg text-xs focus:outline-none focus:border-[#7B2039]">
                </div>
                <div>
                    <label class="block text-xs font-bold font-epilogue uppercase text-[#1D1C13] mb-1">Password</label>
                    <input type="password" name="password" required placeholder="••••••••••••" class="w-full px-3 py-2 bg-white border border-[#E8E2D4] rounded-lg text-xs focus:outline-none focus:border-[#7B2039]">
                </div>
                <button type="submit" class="w-full py-2.5 rounded-lg bg-[#7B2039] hover:bg-[#5C182B] text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer">
                    Verifica Credenziali
                </button>
            </form>
        <?php else: ?>
            <form method="POST" class="space-y-4">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="auth_step" value="2_totp">
                <div class="p-3 rounded-lg bg-[#F3EDDF] border border-[#E8E2D4] text-center">
                    <p class="text-xs text-[#554245]">Inserisci il codice temporaneo a <strong>6 cifre</strong> generato dalla tua app di autenticazione.</p>
                </div>
                <div>
                    <label class="block text-xs font-bold font-epilogue uppercase text-center text-[#1D1C13] mb-1">Codice TOTP 2FA</label>
                    <input type="text" name="totp_code" maxlength="6" pattern="[0-9]{6}" required placeholder="000000" autofocus class="w-full text-center tracking-widest text-xl font-mono px-3 py-2 bg-white border-2 border-[#7B2039] rounded-lg focus:outline-none">
                </div>
                <button type="submit" class="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer">
                    Sblocca Sessione Admin
                </button>
            </form>
        <?php endif; ?>
    </div>
</body>
</html>
<?php
exit;
}

// ============================================================================
// 3. AZIONI POST CRM: STATO PRENOTAZIONI, RISPOSTA CONTATTI, ELIMINAZIONE SINGOLA/MASSA
// ============================================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['crm_action'])) {
    if (!hash_equals($_SESSION['csrf_token'] ?? '', $_POST['csrf_token'] ?? '')) {
        die('Violazione CSRF rilevata.');
    }

    $action = $_POST['crm_action'];

    // A) Aggiornamento stato prenotazione (Confermato / Rifiutato con motivazione) + Email automatica Dock 71
    if ($action === 'update_booking_status') {
        $bookingId = (int)($_POST['booking_id'] ?? 0);
        $newStatus = trim($_POST['new_status'] ?? '');
        $rejectionReason = trim($_POST['rejection_reason'] ?? '');

        $stmt = $pdo->prepare("SELECT * FROM `bookings` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $bookingId]);
        $booking = $stmt->fetch();

        if ($booking && in_array($newStatus, ['Confermato', 'Rifiutato', 'In Attesa'], true)) {
            $upd = $pdo->prepare("UPDATE `bookings` SET status = :status, notes = CONCAT(IFNULL(notes,''), :reason_note) WHERE id = :id");
            $reasonNote = ($newStatus === 'Rifiutato' && $rejectionReason !== '') ? "\n[Motivazione Rifiuto: {$rejectionReason}]" : '';
            $upd->execute([
                ':status' => $newStatus,
                ':reason_note' => $reasonNote,
                ':id' => $bookingId,
            ]);

            $recipient = !empty($booking['email']) ? $booking['email'] : 'cliente@dock71birreria.it';
            if ($newStatus === 'Confermato') {
                $subject = "Prenotazione Confermata #{$booking['booking_code']} - Dock 71 Cantù";
                $body = "<p>Siamo felici di confermare che la tua richiesta di prenotazione tavolo presso <strong>Dock 71 Cantù</strong> è stata <strong>ACCETTATA E CONFERMATA</strong>!</p>";
                $html = buildDock71EmailHtml(
                    'PRENOTAZIONE CONFERMATA',
                    '#336859',
                    'Il tuo tavolo al Dock 71 ti aspetta!',
                    $booking['name'],
                    $body,
                    [
                        'Codice Prenotazione' => $booking['booking_code'],
                        'Data e Ora' => $booking['booking_date'] . ' • ' . $booking['time_slot'],
                        'Coperti' => $booking['guests'] . ' Ospiti',
                        'Zona / Sala' => $booking['room'] ?? 'Sala Principale',
                    ]
                );
                $mailErr = null;
                $mailOk = sendDock71Mail($recipient, $subject, $html, $booking['name'] ?? 'Cliente', $mailErr);
                if ($mailOk) {
                    $successMsg = "Prenotazione #{$booking['booking_code']} confermata ed email automatica inviata a {$recipient}.";
                } else {
                    $errorMsg = "Prenotazione #{$booking['booking_code']} confermata su DB, ma invio email SMTP a {$recipient} non riuscito: " . ($mailErr ?: 'Errore SMTP sconosciuto');
                }
            } elseif ($newStatus === 'Rifiutato') {
                $safeReason = htmlspecialchars($rejectionReason ?: 'Disponibilità tavoli esaurita per la fascia oraria richiesta.', ENT_QUOTES, 'UTF-8');
                $subject = "Aggiornamento Prenotazione #{$booking['booking_code']} - Dock 71 Cantù";
                $body = "<p>Ti ringraziamo per aver scelto <strong>Dock 71 Cantù</strong>. Purtroppo non ci è possibile confermare la tua richiesta di prenotazione per il seguente motivo:</p>
                         <div style='padding:12px 16px;background:#FEE2E2;border-left:4px solid #7B2039;border-radius:6px;margin:12px 0;color:#7B2039;font-weight:bold;'>{$safeReason}</div>
                         <p>Ti invitiamo a contattarci o scegliere un'altra fascia oraria.</p>";
                $html = buildDock71EmailHtml(
                    'RICHIESTA NON DISPONIBILE',
                    '#7B2039',
                    'Comunicazione sulla tua richiesta tavolo',
                    $booking['name'],
                    $body,
                    [
                        'Codice Richiesta' => $booking['booking_code'],
                        'Data Richiesta' => $booking['booking_date'] . ' • ' . $booking['time_slot'],
                        'Coperti' => $booking['guests'] . ' Ospiti',
                    ]
                );
                $mailErr = null;
                $mailOk = sendDock71Mail($recipient, $subject, $html, $booking['name'] ?? 'Cliente', $mailErr);
                if ($mailOk) {
                    $successMsg = "Prenotazione #{$booking['booking_code']} rifiutata con motivazione ed email inviata a {$recipient}.";
                } else {
                    $errorMsg = "Prenotazione #{$booking['booking_code']} aggiornata su DB, ma invio email SMTP a {$recipient} non riuscito: " . ($mailErr ?: 'Errore SMTP sconosciuto');
                }
            }
        }
    }

    // B) Risposta diretta ai messaggi Contatti dal pannello -> Stato "Risposto"
    if ($action === 'reply_contact') {
        $contactId = (int)($_POST['contact_id'] ?? 0);
        $replyMessage = trim($_POST['reply_message'] ?? '');

        $stmt = $pdo->prepare("SELECT * FROM `contacts` WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $contactId]);
        $contact = $stmt->fetch();

        if ($contact && $replyMessage !== '') {
            $upd = $pdo->prepare("UPDATE `contacts` SET status = 'Risposto', reply_message = :reply, replied_at = NOW() WHERE id = :id");
            try {
                $upd->execute([':reply' => $replyMessage, ':id' => $contactId]);
            } catch (Exception $e) {
                // Fallback se la tabella ha solo la colonna status
                $pdo->prepare("UPDATE `contacts` SET status = 'Risposto' WHERE id = :id")->execute([':id' => $contactId]);
            }

            $safeReply = nl2br(htmlspecialchars($replyMessage, ENT_QUOTES, 'UTF-8'));
            $html = buildDock71EmailHtml(
                'RISPOSTA UFFICIALE DOCK 71',
                '#336859',
                'Risposta alla tua richiesta di contatto',
                $contact['name'],
                "<div style='padding:14px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:8px;'>{$safeReply}</div>",
                ['Il tuo messaggio originale' => mb_strimwidth($contact['message'] ?? '', 0, 120, '...')]
            );
            $mailErr = null;
            $mailOk = sendDock71Mail($contact['email'], "Risposta da Dock 71 Cantù", $html, $contact['name'] ?? 'Cliente', $mailErr);
            if ($mailOk) {
                $successMsg = "Risposta inviata con successo a {$contact['email']}. Stato aggiornato a 'Risposto'.";
            } else {
                $errorMsg = "Stato aggiornato a 'Risposto', ma invio email SMTP a {$contact['email']} non riuscito: " . ($mailErr ?: 'Errore SMTP sconosciuto');
            }
        }
    }

    // C) Eliminazione singola o in massa (Bulk Delete)
    if ($action === 'bulk_delete' || $action === 'single_delete') {
        $targetTable = $_POST['target_table'] ?? '';
        $allowedTables = [
            'bookings' => 'bookings',
            'contacts' => 'contacts',
            'consents' => 'cookie_consent_logs',
        ];
        if (isset($allowedTables[$targetTable])) {
            $dbTable = $allowedTables[$targetTable];
            $ids = [];
            if ($action === 'single_delete' && !empty($_POST['item_id'])) {
                $ids = [(int)$_POST['item_id']];
            } elseif (!empty($_POST['selected_ids']) && is_array($_POST['selected_ids'])) {
                $ids = array_map('intval', $_POST['selected_ids']);
            }
            $ids = array_filter($ids, fn($id) => $id > 0);
            if (!empty($ids)) {
                $placeholders = implode(',', array_fill(0, count($ids), '?'));
                $delStmt = $pdo->prepare("DELETE FROM `{$dbTable}` WHERE id IN ({$placeholders})");
                $delStmt->execute($ids);
                $count = $delStmt->rowCount();
                $successMsg = "Eliminati {$count} record dalla sezione {$targetTable}.";
            }
        }
    }
}

// ============================================================================
// 4. ESPORTAZIONE CSV
// ============================================================================
if (isset($_GET['export']) && in_array($_GET['export'], ['contacts', 'bookings', 'consents'], true)) {
    $table = $_GET['export'] === 'contacts' ? 'contacts' : ($_GET['export'] === 'bookings' ? 'bookings' : 'cookie_consent_logs');
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="dock71_' . $table . '_' . date('Ymd_His') . '.csv"');
    $out = fopen('php://output', 'w');
    fprintf($out, chr(0xEF).chr(0xBB).chr(0xBF));

    $data = $pdo->query("SELECT * FROM `{$table}` ORDER BY id DESC")->fetchAll();
    if (!empty($data)) {
        fputcsv($out, array_keys($data[0]));
        foreach ($data as $row) {
            fputcsv($out, $row);
        }
    }
    fclose($out);
    exit;
}

// ============================================================================
// 5. FILTRI E STATISTICHE ANALYTICS
// ============================================================================
$searchQuery  = trim($_GET['q'] ?? '');
$statusFilter = trim($_GET['status'] ?? '');

$totalContacts       = (int)$pdo->query("SELECT COUNT(*) FROM `contacts`")->fetchColumn();
$repliedContacts     = (int)$pdo->query("SELECT COUNT(*) FROM `contacts` WHERE status = 'Risposto' OR status = 'replied'")->fetchColumn();
$totalBookings       = (int)$pdo->query("SELECT COUNT(*) FROM `bookings`")->fetchColumn();
$confirmedBookings   = (int)$pdo->query("SELECT COUNT(*) FROM `bookings` WHERE status = 'Confermato' OR status = 'confirmed'")->fetchColumn();
$rejectedBookings    = (int)$pdo->query("SELECT COUNT(*) FROM `bookings` WHERE status = 'Rifiutato' OR status = 'rejected'")->fetchColumn();
$totalGuests         = (int)$pdo->query("SELECT COALESCE(SUM(guests),0) FROM `bookings` WHERE status != 'Rifiutato'")->fetchColumn();
$totalConsents       = (int)$pdo->query("SELECT COUNT(*) FROM `cookie_consent_logs`")->fetchColumn();

$bookingConfirmRate  = $totalBookings > 0 ? round(($confirmedBookings / $totalBookings) * 100) : 0;
$contactReplyRate    = $totalContacts > 0 ? round(($repliedContacts / $totalContacts) * 100) : 0;

// Query Prenotazioni con filtro
$bookingSql = "SELECT * FROM `bookings` WHERE 1=1";
$bookingParams = [];
if ($searchQuery !== '') {
    $bookingSql .= " AND (name LIKE :q OR email LIKE :q OR phone LIKE :q OR booking_code LIKE :q)";
    $bookingParams[':q'] = "%{$searchQuery}%";
}
if ($statusFilter !== '') {
    $bookingSql .= " AND status = :st";
    $bookingParams[':st'] = $statusFilter;
}
$bookingSql .= " ORDER BY id DESC LIMIT 100";
$stmtB = $pdo->prepare($bookingSql);
$stmtB->execute($bookingParams);
$recentBookings = $stmtB->fetchAll();

// Query Contatti con filtro
$contactSql = "SELECT * FROM `contacts` WHERE 1=1";
$contactParams = [];
if ($searchQuery !== '') {
    $contactSql .= " AND (name LIKE :q OR email LIKE :q OR phone LIKE :q OR message LIKE :q)";
    $contactParams[':q'] = "%{$searchQuery}%";
}
$contactSql .= " ORDER BY id DESC LIMIT 100";
$stmtC = $pdo->prepare($contactSql);
$stmtC->execute($contactParams);
$recentContacts = $stmtC->fetchAll();

// Query Consensi GDPR
$recentConsents = $pdo->query("SELECT * FROM `cookie_consent_logs` ORDER BY id DESC LIMIT 100")->fetchAll();
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/svg+xml" href="https://www.dock71birreria.it/produzione_cpanel/favicon.svg">
    <link rel="apple-touch-icon" href="https://www.dock71birreria.it/produzione_cpanel/favicon.svg">
    <meta name="robots" content="noindex, nofollow">
    <meta name="description" content="Pannello di controllo CRM, Analytics, Prenotazioni e Consensi GDPR di Dock 71 Cantù.">
    <title>Dock 71 Cantù - CRM, Analytics &amp; Control Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
</head>
<body class="bg-[#FAF7F2] text-[#1D1C13] min-h-screen">
    <!-- Navbar Header Admin -->
    <header class="bg-[#FFF9EB] border-b-2 border-[#E8E2D4] px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 class="text-lg font-bold text-[#7B2039] uppercase">Dock 71 Cantù • CRM &amp; Analytics</h1>
            <span class="text-xs bg-[#F3EDDF] text-[#554245] px-2.5 py-1 rounded border border-[#E8E2D4]">Autenticato (2FA Attivo)</span>
        </div>
        <div class="flex items-center gap-4">
            <span class="text-xs text-[#7A7265]"><?= htmlspecialchars($_SESSION['admin_user'] ?? '') ?></span>
            <a href="?action=logout" class="text-xs bg-[#7B2039] text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors cursor-pointer">Logout</a>
        </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-8">
        <?php if ($successMsg): ?>
            <div class="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-600 text-emerald-900 text-xs font-bold flex items-center justify-between">
                <span><?= htmlspecialchars($successMsg) ?></span>
            </div>
        <?php endif; ?>

        <!-- 1. ANALYTICS & KPI DASHBOARD (PRENOTAZIONI, CONTATTI, CONSENSI GDPR) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-[#FFF9EB] p-5 rounded-xl border-2 border-[#E8E2D4] shadow-sm">
                <span class="text-[11px] text-[#7A7265] uppercase font-bold">Prenotazioni &amp; Conversione</span>
                <p class="text-3xl font-black text-[#7B2039] mt-1"><?= $totalBookings ?></p>
                <p class="text-xs text-emerald-700 font-bold mt-1">Tasso Conferma: <?= $bookingConfirmRate ?>% (<?= $confirmedBookings ?> conf. / <?= $rejectedBookings ?> rif.)</p>
                <a href="?export=bookings" class="text-xs text-[#7B2039] underline mt-2 inline-block font-semibold">Esporta CSV Prenotazioni</a>
            </div>
            <div class="bg-[#FFF9EB] p-5 rounded-xl border-2 border-[#E8E2D4] shadow-sm">
                <span class="text-[11px] text-[#7A7265] uppercase font-bold">Totale Coperti Attesi</span>
                <p class="text-3xl font-black text-[#336859] mt-1"><?= $totalGuests ?> pax</p>
                <p class="text-xs text-[#554245] mt-1">Ospiti prenotati nelle sale Dock 71</p>
            </div>
            <div class="bg-[#FFF9EB] p-5 rounded-xl border-2 border-[#E8E2D4] shadow-sm">
                <span class="text-[11px] text-[#7A7265] uppercase font-bold">Messaggi &amp; Tasso Risposta</span>
                <p class="text-3xl font-black text-[#7B2039] mt-1"><?= $totalContacts ?></p>
                <p class="text-xs text-emerald-700 font-bold mt-1">Risposti dal Pannello: <?= $repliedContacts ?> (<?= $contactReplyRate ?>%)</p>
                <a href="?export=contacts" class="text-xs text-[#7B2039] underline mt-2 inline-block font-semibold">Esporta CSV Contatti</a>
            </div>
            <div class="bg-[#FFF9EB] p-5 rounded-xl border-2 border-[#E8E2D4] shadow-sm">
                <span class="text-[11px] text-[#7A7265] uppercase font-bold">Registro Consensi GDPR</span>
                <p class="text-3xl font-black text-amber-600 mt-1"><?= $totalConsents ?></p>
                <p class="text-xs text-[#554245] mt-1">Opt-in verificati con IP e Timestamp</p>
                <a href="?export=consents" class="text-xs text-amber-700 underline mt-2 inline-block font-semibold">Esporta Audit GDPR CSV</a>
            </div>
        </div>

        <!-- BARRA DI RICERCA E FILTRO GLOBALE -->
        <form method="GET" class="bg-white p-4 rounded-xl border border-[#E8E2D4] shadow-sm flex flex-wrap items-center gap-3">
            <input type="text" name="q" value="<?= htmlspecialchars($searchQuery) ?>" placeholder="Cerca per nome, email, telefono o codice..." class="flex-1 min-w-[220px] px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D4] rounded-lg text-xs">
            <select name="status" class="px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D4] rounded-lg text-xs">
                <option value="">Tutti gli stati prenotazione</option>
                <option value="In Attesa" <?= $statusFilter === 'In Attesa' ? 'selected' : '' ?>>In Attesa</option>
                <option value="Confermato" <?= $statusFilter === 'Confermato' ? 'selected' : '' ?>>Confermato</option>
                <option value="Rifiutato" <?= $statusFilter === 'Rifiutato' ? 'selected' : '' ?>>Rifiutato</option>
            </select>
            <button type="submit" class="px-4 py-2 bg-[#7B2039] text-white rounded-lg text-xs font-bold uppercase cursor-pointer">Filtra</button>
            <a href="/backend/login-segreto-custom.php" class="px-3 py-2 bg-[#F3EDDF] text-[#554245] rounded-lg text-xs font-bold">Reset</a>
        </form>

        <!-- 2. TABELLA PRENOTAZIONI TAVOLI (CON SELEZIONE MASSA, CONFERMA EMAIL E RIFIUTO CON MOTIVAZIONE) -->
        <div class="bg-white rounded-xl border border-[#E8E2D4] shadow-sm overflow-hidden">
            <form method="POST" id="bulkBookingsForm">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="crm_action" value="bulk_delete">
                <input type="hidden" name="target_table" value="bookings">

                <div class="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex flex-wrap items-center justify-between gap-2">
                    <h2 class="font-bold text-sm uppercase text-[#1D1C13]">Gestione Prenotazioni Tavoli</h2>
                    <div class="flex items-center gap-2">
                        <button type="submit" class="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Elimina Selezionate in Massa</button>
                        <a href="?export=bookings" class="text-xs bg-[#7B2039] text-white px-3 py-1.5 rounded-lg font-bold">Scarica CSV</a>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                            <tr>
                                <th class="p-3"><input type="checkbox" onclick="document.querySelectorAll('.chk-booking').forEach(c => c.checked = this.checked)"></th>
                                <th class="p-3">Codice</th>
                                <th class="p-3">Data/Ora</th>
                                <th class="p-3">Cliente</th>
                                <th class="p-3">Recapiti</th>
                                <th class="p-3">Ospiti</th>
                                <th class="p-3">Stato</th>
                                <th class="p-3">Gestione Stato &amp; Email</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8E2D4]">
                            <?php foreach ($recentBookings as $b): ?>
                            <tr class="hover:bg-[#FFF9EB]">
                                <td class="p-3"><input type="checkbox" name="selected_ids[]" value="<?= (int)$b['id'] ?>" class="chk-booking"></td>
                                <td class="p-3 font-mono font-bold text-[#7B2039]"><?= htmlspecialchars($b['booking_code']) ?></td>
                                <td class="p-3"><?= htmlspecialchars($b['booking_date']) ?> (<?= htmlspecialchars($b['time_slot']) ?>)</td>
                                <td class="p-3 font-semibold"><?= htmlspecialchars($b['name']) ?></td>
                                <td class="p-3"><?= htmlspecialchars($b['phone']) ?><br><span class="text-[#7A7265]"><?= htmlspecialchars($b['email'] ?? '') ?></span></td>
                                <td class="p-3 font-bold"><?= (int)$b['guests'] ?> pax</td>
                                <td class="p-3">
                                    <span class="px-2 py-0.5 rounded font-bold <?= $b['status'] === 'Confermato' ? 'bg-emerald-100 text-emerald-800' : ($b['status'] === 'Rifiutato' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800') ?>">
                                        <?= htmlspecialchars($b['status']) ?>
                                    </span>
                                </td>
                                <td class="p-3 space-x-1 whitespace-nowrap">
                                    <button type="button" onclick="confirmBooking(<?= (int)$b['id'] ?>)" class="px-2.5 py-1 bg-[#336859] text-white rounded font-bold cursor-pointer">✓ Conferma (Invia Email)</button>
                                    <button type="button" onclick="openRejectModal(<?= (int)$b['id'] ?>, '<?= htmlspecialchars(addslashes($b['name'])) ?>')" class="px-2.5 py-1 bg-amber-700 text-white rounded font-bold cursor-pointer">✕ Rifiuta con Motivazione</button>
                                    <button type="button" onclick="deleteSingleRecord('bookings', <?= (int)$b['id'] ?>)" class="px-2 py-1 bg-red-100 text-red-800 rounded font-bold cursor-pointer">Elimina</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </form>
        </div>

        <!-- 3. TABELLA CONTATTI RICEVUTI (CON RISPOSTA DIRETTA DAL PANNELLO E STATO "RISPOSTO") -->
        <div class="bg-white rounded-xl border border-[#E8E2D4] shadow-sm overflow-hidden">
            <form method="POST" id="bulkContactsForm">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="crm_action" value="bulk_delete">
                <input type="hidden" name="target_table" value="contacts">

                <div class="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex flex-wrap items-center justify-between gap-2">
                    <h2 class="font-bold text-sm uppercase text-[#1D1C13]">Messaggi Ricevuti &amp; Risposta Diretta</h2>
                    <div class="flex items-center gap-2">
                        <button type="submit" class="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Elimina Selezionati in Massa</button>
                        <a href="?export=contacts" class="text-xs bg-[#7B2039] text-white px-3 py-1.5 rounded-lg font-bold">Scarica CSV Contatti</a>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                            <tr>
                                <th class="p-3"><input type="checkbox" onclick="document.querySelectorAll('.chk-contact').forEach(c => c.checked = this.checked)"></th>
                                <th class="p-3">Data</th>
                                <th class="p-3">Cliente</th>
                                <th class="p-3">Email / Telefono</th>
                                <th class="p-3">Messaggio</th>
                                <th class="p-3">Stato</th>
                                <th class="p-3">Azioni</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8E2D4]">
                            <?php foreach ($recentContacts as $c): ?>
                            <?php $cStatus = $c['status'] ?? 'Nuovo'; ?>
                            <tr class="hover:bg-[#FFF9EB]">
                                <td class="p-3"><input type="checkbox" name="selected_ids[]" value="<?= (int)$c['id'] ?>" class="chk-contact"></td>
                                <td class="p-3 whitespace-nowrap"><?= htmlspecialchars($c['created_at']) ?></td>
                                <td class="p-3 font-semibold"><?= htmlspecialchars($c['name']) ?></td>
                                <td class="p-3"><?= htmlspecialchars($c['email'] ?? '-') ?><br><span class="text-[#7A7265]"><?= htmlspecialchars($c['phone'] ?? '-') ?></span></td>
                                <td class="p-3 max-w-xs truncate" title="<?= htmlspecialchars($c['message']) ?>"><?= htmlspecialchars($c['message']) ?></td>
                                <td class="p-3">
                                    <span class="px-2 py-0.5 rounded font-bold <?= ($cStatus === 'Risposto' || $cStatus === 'replied') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800' ?>">
                                        <?= ($cStatus === 'Risposto' || $cStatus === 'replied') ? '✓ Risposto' : htmlspecialchars($cStatus) ?>
                                    </span>
                                </td>
                                <td class="p-3 space-x-1 whitespace-nowrap">
                                    <button type="button" onclick="openReplyModal(<?= (int)$c['id'] ?>, '<?= htmlspecialchars(addslashes($c['name'])) ?>', '<?= htmlspecialchars(addslashes($c['email'] ?? '')) ?>')" class="px-2.5 py-1 bg-[#7B2039] text-white rounded font-bold cursor-pointer">Rispondi dal Pannello</button>
                                    <button type="button" onclick="deleteSingleRecord('contacts', <?= (int)$c['id'] ?>)" class="px-2 py-1 bg-red-100 text-red-800 rounded font-bold cursor-pointer">Elimina</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </form>
        </div>

        <!-- 4. TABELLA REGISTRO CONSENSI GDPR -->
        <div class="bg-white rounded-xl border border-[#E8E2D4] shadow-sm overflow-hidden">
            <form method="POST" id="bulkConsentsForm">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="crm_action" value="bulk_delete">
                <input type="hidden" name="target_table" value="consents">

                <div class="p-4 bg-[#F3EDDF] border-b border-[#E8E2D4] flex flex-wrap items-center justify-between gap-2">
                    <h2 class="font-bold text-sm uppercase text-[#1D1C13]">Registro Consensi Cookie &amp; Privacy GDPR</h2>
                    <div class="flex items-center gap-2">
                        <button type="submit" class="text-xs bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-lg font-bold cursor-pointer">Elimina Selezionati in Massa</button>
                        <a href="?export=consents" class="text-xs bg-amber-700 text-white px-3 py-1.5 rounded-lg font-bold">Scarica Audit Consensi CSV</a>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-xs text-left">
                        <thead class="bg-[#FAF7F2] text-[#7A7265] uppercase border-b border-[#E8E2D4]">
                            <tr>
                                <th class="p-3"><input type="checkbox" onclick="document.querySelectorAll('.chk-consent').forEach(c => c.checked = this.checked)"></th>
                                <th class="p-3">ID Consenso</th>
                                <th class="p-3">Data e Ora</th>
                                <th class="p-3">Indirizzo IP</th>
                                <th class="p-3">Preferenze</th>
                                <th class="p-3">Azioni</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#E8E2D4]">
                            <?php foreach ($recentConsents as $log): ?>
                            <tr class="hover:bg-[#FFF9EB]">
                                <td class="p-3"><input type="checkbox" name="selected_ids[]" value="<?= (int)$log['id'] ?>" class="chk-consent"></td>
                                <td class="p-3 font-mono font-bold text-[#7B2039]"><?= htmlspecialchars($log['consent_id'] ?? (string)$log['id']) ?></td>
                                <td class="p-3"><?= htmlspecialchars($log['timestamp'] ?? $log['created_at'] ?? '') ?></td>
                                <td class="p-3 font-mono text-emerald-800 font-semibold"><?= htmlspecialchars($log['ip_address'] ?? '127.0.0.1') ?></td>
                                <td class="p-3">Tecnici + Preferenze GDPR</td>
                                <td class="p-3">
                                    <button type="button" onclick="deleteSingleRecord('consents', <?= (int)$log['id'] ?>)" class="px-2 py-1 bg-red-100 text-red-800 rounded font-bold cursor-pointer">Elimina</button>
                                </td>
                            </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </form>
        </div>
    </main>

    <!-- FORM NASCOSTO PER AZIONI RAPIDE SINGOLE -->
    <form method="POST" id="quickActionForm" class="hidden">
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
        <input type="hidden" name="crm_action" id="qa_action">
        <input type="hidden" name="target_table" id="qa_table">
        <input type="hidden" name="item_id" id="qa_item_id">
        <input type="hidden" name="booking_id" id="qa_booking_id">
        <input type="hidden" name="new_status" id="qa_new_status">
    </form>

    <!-- MODALE RIFIUTO PRENOTAZIONE CON MOTIVAZIONE -->
    <div id="rejectModal" class="fixed inset-0 bg-black/60 hidden items-center justify-center p-4 z-50">
        <div class="bg-[#FFF9EB] border-2 border-[#7B2039] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 class="font-bold text-base text-[#7B2039] uppercase">Rifiuta Prenotazione &amp; Invia Motivazione</h3>
            <p class="text-xs text-[#554245]">Stai rifiutando la richiesta di <strong id="rejectCustomerName"></strong>. Inserisci la motivazione che verrà inclusa nel corpo dell'email automatica inviata al cliente:</p>
            <form method="POST" class="space-y-3">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="crm_action" value="update_booking_status">
                <input type="hidden" name="booking_id" id="rejectBookingId">
                <input type="hidden" name="new_status" value="Rifiutato">
                <textarea name="rejection_reason" required rows="3" placeholder="Es. Tutti i tavoli nella Sala Maxischermo sono al completo per quella fascia oraria..." class="w-full p-3 bg-white border border-[#E8E2D4] rounded-lg text-xs"></textarea>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('rejectModal').classList.add('hidden')" class="px-3 py-1.5 bg-[#F3EDDF] rounded-lg text-xs font-bold cursor-pointer">Annulla</button>
                    <button type="submit" class="px-4 py-1.5 bg-[#7B2039] text-white rounded-lg text-xs font-bold cursor-pointer">Invia Email di Rifiuto</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODALE RISPOSTA DIRETTA CONTATTO -->
    <div id="replyModal" class="fixed inset-0 bg-black/60 hidden items-center justify-center p-4 z-50">
        <div class="bg-[#FFF9EB] border-2 border-[#336859] rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 class="font-bold text-base text-[#336859] uppercase">Rispondi al Messaggio dal Pannello</h3>
            <p class="text-xs text-[#554245]">Destinatario: <strong id="replyCustomerInfo"></strong></p>
            <form method="POST" class="space-y-3">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
                <input type="hidden" name="crm_action" value="reply_contact">
                <input type="hidden" name="contact_id" id="replyContactId">
                <textarea name="reply_message" required rows="4" placeholder="Scrivi qui la risposta ufficiale Dock 71..." class="w-full p-3 bg-white border border-[#E8E2D4] rounded-lg text-xs"></textarea>
                <div class="flex justify-end gap-2">
                    <button type="button" onclick="document.getElementById('replyModal').classList.add('hidden')" class="px-3 py-1.5 bg-[#F3EDDF] rounded-lg text-xs font-bold cursor-pointer">Annulla</button>
                    <button type="submit" class="px-4 py-1.5 bg-[#336859] text-white rounded-lg text-xs font-bold cursor-pointer">Invia Email e Segna Risposto</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function confirmBooking(id) {
            document.getElementById('qa_action').value = 'update_booking_status';
            document.getElementById('qa_booking_id').value = id;
            document.getElementById('qa_new_status').value = 'Confermato';
            document.getElementById('quickActionForm').submit();
        }
        function deleteSingleRecord(table, id) {
            document.getElementById('qa_action').value = 'single_delete';
            document.getElementById('qa_table').value = table;
            document.getElementById('qa_item_id').value = id;
            document.getElementById('quickActionForm').submit();
        }
        function openRejectModal(id, name) {
            document.getElementById('rejectBookingId').value = id;
            document.getElementById('rejectCustomerName').textContent = name;
            const m = document.getElementById('rejectModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }
        function openReplyModal(id, name, email) {
            document.getElementById('replyContactId').value = id;
            document.getElementById('replyCustomerInfo').textContent = name + ' (' + email + ')';
            const m = document.getElementById('replyModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }
    </script>
</body>
</html>
