<?php
/**
 * DOCK 71 CANTÙ - PROCESS FORM & CRM API HANDLER (PHPMailer SMTP & MySQL DATABASE)
 *
 * Gestisce:
 * 1. Invio Form Prenotazione Tavolo (Salvataggio MySQL + Email Riepilogo Cliente via PHPMailer SMTP + Notifica a info@dock71birreria.it)
 * 2. Invio Form Contatti (Salvataggio MySQL + Email Riepilogo Cliente via PHPMailer SMTP + Notifica a info@dock71birreria.it)
 * 3. Conferma / Rifiuto Prenotazione dal Gestionale (Aggiornamento MySQL + Email Automatica via PHPMailer SMTP)
 * 4. Risposta Diretta ai Messaggi dal Gestionale (Stato "Risposto" su MySQL + Email di Risposta via PHPMailer SMTP)
 * 5. Sincronizzazione / Eliminazione Record CRM con il Gestionale Frontend
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// Include PHPMailer e configurazione Database / SMTP
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/smtp-mailer.php';

@set_time_limit(45);

/**
 * Funzione diretta PHPMailer SMTP usata da process-form.php
 */
function processFormSendSmtp(string $toEmail, string $toName, string $subject, string $htmlBody, string $replyTo = '', ?string &$errorOut = null, ?string &$transportOut = null): bool {
    return sendSmtpEmail($toEmail, $toName, $subject, $htmlBody, $replyTo, $errorOut, $transportOut);
}

// Supporta anche richieste JSON nel body (fetch API da React)
$rawInput = file_get_contents('php://input');
$jsonBody = !empty($rawInput) ? json_decode($rawInput, true) : null;
if (is_array($jsonBody)) {
    foreach ($jsonBody as $k => $v) {
        if (!isset($_POST[$k])) {
            $_POST[$k] = $v;
        }
    }
}

$action = $_POST['action'] ?? $_GET['action'] ?? 'booking';
$isAjax = !empty($_POST['ajax']) || !empty($_GET['ajax']) || is_array($jsonBody) ||
          (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

$pdo = getDbConnection();
if ($pdo) {
    try {
        $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'In Attesa'");
        $pdo->exec("ALTER TABLE `contacts` MODIFY COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'Nuovo'");
    } catch (\Exception $e) {
        // Ignora se già aggiornate
    }
}

// ============================================================================
// 0. LETTURA DATI DAL DATABASE PER IL GESTIONALE REACT (action = list_crm_data)
// ============================================================================
if ($action === 'list_crm_data') {
    header('Content-Type: application/json; charset=UTF-8');
    if (!$pdo) {
        echo json_encode(['success' => false, 'error' => 'Database non connesso']);
        exit;
    }
    try {
        $bookings = $pdo->query("SELECT * FROM `bookings` ORDER BY id DESC LIMIT 250")->fetchAll();
        $contacts = $pdo->query("SELECT * FROM `contacts` ORDER BY id DESC LIMIT 250")->fetchAll();
        $consents = $pdo->query("SELECT * FROM `cookie_consent_logs` ORDER BY id DESC LIMIT 250")->fetchAll();
        echo json_encode([
            'success'  => true,
            'bookings' => $bookings,
            'contacts' => $contacts,
            'consents' => $consents,
        ]);
    } catch (\Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => false, 'error' => 'Metodo non consentito']);
        exit;
    }
    header('Location: /');
    exit;
}

// Protezione Honeypot anti-spam
if (!empty($_POST['website_url_hp'])) {
    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => true]);
        exit;
    }
    header('Location: /');
    exit;
}

// ============================================================================
// 1. GESTIONE FORM CONTATTO (Salvataggio DB + Email Riepilogo Cliente + Email Admin)
// ============================================================================
if ($action === 'contact') {
    $name    = trim(strip_tags((string)($_POST['name'] ?? '')));
    $email   = trim(filter_var((string)($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL));
    $phone   = trim(strip_tags((string)($_POST['phone'] ?? '')));
    $subject = trim(strip_tags((string)($_POST['subject'] ?? 'Richiesta Contatto Dock 71')));
    $message = trim(strip_tags((string)($_POST['message'] ?? '')));
    $ip      = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

    if (empty($name) || (empty($email) && empty($phone)) || empty($message)) {
        if ($isAjax) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['success' => false, 'error' => 'Campi obbligatori mancanti']);
            exit;
        }
        header('Location: /contatti?error=missing_fields');
        exit;
    }

    $insertedId = 0;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `contacts` (`name`, `email`, `phone`, `subject`, `message`, `ip_address`, `status`)
                VALUES (:name, :email, :phone, :subject, :message, :ip, 'Nuovo')
            ");
            $stmt->execute([
                ':name'    => $name,
                ':email'   => $email,
                ':phone'   => $phone,
                ':subject' => $subject,
                ':message' => $message,
                ':ip'      => $ip,
            ]);
            $insertedId = (int)$pdo->lastInsertId();
        } catch (\Exception $e) {
            error_log("DB Contact Insert Error: " . $e->getMessage());
        }
    }

    $clientSmtpError = null;
    $adminSmtpError  = null;
    $transportUsed   = null;

    // A) Email di Riepilogo al Cliente via PHPMailer SMTP
    $clientSent = false;
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $safeMsg = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
        $clientHtml = buildDock71EmailHtml(
            'MESSAGGIO RICEVUTO',
            '#336859',
            'Abbiamo ricevuto la tua richiesta!',
            $name,
            "<p>Grazie per aver contattato <strong>Dock 71 Cantù</strong>. Il nostro staff ha preso in carico il tuo messaggio e ti risponderà al più presto.</p>
             <div style='padding:14px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:8px;margin-top:12px;font-style:italic;'>\"{$safeMsg}\"</div>",
            [
                'Oggetto'  => $subject,
                'Telefono' => $phone ?: '-',
                'Email'    => $email,
            ]
        );
        $clientSent = processFormSendSmtp(
            $email,
            $name,
            "Dock 71 Cantù - Riepilogo del tuo messaggio",
            $clientHtml,
            COMPANY_NOTIFICATION_EMAIL,
            $clientSmtpError,
            $transportUsed
        );
    }

    // B) Email di Notifica all'Azienda (info@dock71birreria.it) via PHPMailer SMTP
    $safeMsgAdmin = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));
    $adminHtml = buildDock71EmailHtml(
        'NUOVO MESSAGGIO DAL SITO',
        '#7B2039',
        "Nuova richiesta contatto da {$name}",
        'Staff Dock 71',
        "<p>È stato appena inviato un nuovo messaggio dal modulo contatti del sito web:</p>
         <div style='padding:14px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:8px;margin-top:12px;'>{$safeMsgAdmin}</div>",
        [
            'Nome Cliente' => $name,
            'Email'        => $email ?: '-',
            'Telefono'     => $phone ?: '-',
            'Oggetto'      => $subject,
            'Data/Ora'     => date('d/m/Y H:i'),
        ]
    );
    $adminSent = processFormSendSmtp(
        COMPANY_NOTIFICATION_EMAIL,
        'Dock 71 Admin',
        "Nuovo Messaggio da {$name} - Dock 71 Cantù",
        $adminHtml,
        $email ?: COMPANY_NOTIFICATION_EMAIL,
        $adminSmtpError,
        $transportUsed
    );

    $smtpError = implode(' | ', array_filter([$clientSmtpError, $adminSmtpError])) ?: null;

    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success'          => true,
            'id'               => $insertedId,
            'client_mail_sent' => $clientSent,
            'admin_mail_sent'  => $adminSent,
            'transport'        => $transportUsed,
            'smtp_error'       => $smtpError,
        ]);
        exit;
    }

    header('Location: /grazie-contatto');
    exit;
}

// ============================================================================
// 2. GESTIONE FORM PRENOTAZIONE TAVOLO (Salvataggio DB + Email Riepilogo Cliente + Email Admin)
// ============================================================================
if ($action === 'booking') {
    $name        = trim(strip_tags((string)($_POST['name'] ?? '')));
    $email       = trim(filter_var((string)($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL));
    $phone       = trim(strip_tags((string)($_POST['phone'] ?? '')));
    $date        = trim(strip_tags((string)($_POST['booking_date'] ?? $_POST['date'] ?? date('Y-m-d'))));
    $timeSlot    = trim(strip_tags((string)($_POST['time_slot'] ?? $_POST['timeSlot'] ?? '20:30')));
    $guests      = max(1, (int)($_POST['guests'] ?? 2));
    $area        = trim(strip_tags((string)($_POST['area'] ?? $_POST['room'] ?? 'Tavolo Standard')));
    $notes       = trim(strip_tags((string)($_POST['notes'] ?? '')));
    $bookingCode = trim(strip_tags((string)($_POST['booking_code'] ?? $_POST['bookingCode'] ?? '')));
    if (empty($bookingCode)) {
        $bookingCode = 'DK71-' . rand(1000, 9999);
    }

    if (empty($name) || empty($phone)) {
        if ($isAjax) {
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode(['success' => false, 'error' => 'Nome e Telefono sono obbligatori']);
            exit;
        }
        header('Location: /prenota?error=missing_fields');
        exit;
    }

    $insertedId = 0;
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("
                INSERT INTO `bookings` (`booking_code`, `name`, `email`, `phone`, `booking_date`, `time_slot`, `guests`, `room_area`, `notes`, `status`)
                VALUES (:code, :name, :email, :phone, :bdate, :slot, :guests, :area, :notes, 'In Attesa')
            ");
            $stmt->execute([
                ':code'   => $bookingCode,
                ':name'   => $name,
                ':email'  => $email,
                ':phone'  => $phone,
                ':bdate'  => $date,
                ':slot'   => $timeSlot,
                ':guests' => $guests,
                ':area'   => $area,
                ':notes'  => $notes,
            ]);
            $insertedId = (int)$pdo->lastInsertId();
        } catch (\Exception $e) {
            error_log("DB Booking Insert Error: " . $e->getMessage());
        }
    }

    $clientSmtpError = null;
    $adminSmtpError  = null;
    $transportUsed   = null;

    // A) Email di Riepilogo Richiesta Prenotazione al Cliente via PHPMailer SMTP
    $clientSent = false;
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $clientBookingHtml = buildDock71EmailHtml(
            'RICHIESTA PRENOTAZIONE RICEVUTA',
            '#E0A93B',
            "Riepilogo Richiesta Tavolo #{$bookingCode}",
            $name,
            "<p>Grazie per aver scelto <strong>Dock 71 Cantù</strong>! Abbiamo ricevuto la tua richiesta di prenotazione tavolo.</p>
             <p>La tua prenotazione è attualmente <strong>IN ATTESA DI CONFERMA</strong> da parte del nostro staff: riceverai a breve una seconda email di conferma definitiva.</p>",
            [
                'Codice Prenotazione' => '#' . $bookingCode,
                'Data e Orario'       => $date . ' • Ore ' . $timeSlot,
                'Numero Ospiti'       => $guests . ($guests === 1 ? ' Persona' : ' Persone'),
                'Recapito Telefonico' => $phone,
                'Note / Richieste'    => $notes ?: 'Nessuna nota particolare',
            ]
        );
        $clientSent = processFormSendSmtp(
            $email,
            $name,
            "Dock 71 Cantù - Riepilogo Richiesta Prenotazione #{$bookingCode}",
            $clientBookingHtml,
            COMPANY_NOTIFICATION_EMAIL,
            $clientSmtpError,
            $transportUsed
        );
    }

    // B) Email di Notifica Nuova Prenotazione al Ristoratore (info@dock71birreria.it)
    $adminBookingHtml = buildDock71EmailHtml(
        'NUOVA PRENOTAZIONE TAVOLO',
        '#7B2039',
        "Nuova Richiesta Tavolo #{$bookingCode} ({$guests} pax)",
        'Staff Dock 71',
        "<p>È arrivata una nuova richiesta di prenotazione tavolo dal sito web. Accedi al Gestionale CRM per <strong>Confermare</strong> o <strong>Rifiutare</strong> la richiesta con un clic.</p>",
        [
            'Codice Prenotazione' => '#' . $bookingCode,
            'Cliente'             => $name,
            'Telefono / WhatsApp' => $phone,
            'Email Cliente'       => $email ?: 'Non indicata',
            'Data e Orario'       => $date . ' • Ore ' . $timeSlot,
            'Coperti'             => $guests . ' pax',
            'Note Cliente'        => $notes ?: '-',
        ]
    );
    $adminSent = processFormSendSmtp(
        COMPANY_NOTIFICATION_EMAIL,
        'Dock 71 Prenotazioni',
        "Nuova Prenotazione [#{$bookingCode}] - {$name} ({$guests} pax - {$date} {$timeSlot})",
        $adminBookingHtml,
        $email ?: COMPANY_NOTIFICATION_EMAIL,
        $adminSmtpError,
        $transportUsed
    );

    $smtpError = implode(' | ', array_filter([$clientSmtpError, $adminSmtpError])) ?: null;

    if ($isAjax) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success'          => true,
            'id'               => $insertedId,
            'booking_code'     => $bookingCode,
            'client_mail_sent' => $clientSent,
            'admin_mail_sent'  => $adminSent,
            'transport'        => $transportUsed,
            'smtp_error'       => $smtpError,
        ]);
        exit;
    }

    header('Location: /grazie-prenotazione?code=' . urlencode($bookingCode));
    exit;
}

// ============================================================================
// 3. CONFERMA O RIFIUTO PRENOTAZIONE DAL GESTIONALE (action = update_booking_status)
// ============================================================================
if ($action === 'update_booking_status') {
    header('Content-Type: application/json; charset=UTF-8');

    $bookingId       = (int)($_POST['booking_id'] ?? 0);
    $bookingCode     = trim(strip_tags((string)($_POST['booking_code'] ?? '')));
    $newStatus       = trim(strip_tags((string)($_POST['new_status'] ?? 'Confermato')));
    $rejectionReason = trim(strip_tags((string)($_POST['rejection_reason'] ?? '')));

    $customerName    = trim(strip_tags((string)($_POST['name'] ?? '')));
    $customerEmail   = trim(filter_var((string)($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL));
    $bookingDate     = trim(strip_tags((string)($_POST['date'] ?? $_POST['booking_date'] ?? '')));
    $timeSlot        = trim(strip_tags((string)($_POST['time_slot'] ?? '')));
    $guests          = (int)($_POST['guests'] ?? 2);

    if ($pdo) {
        try {
            $dbRow = null;
            if ($bookingId > 0) {
                $st = $pdo->prepare("SELECT * FROM `bookings` WHERE id = :id LIMIT 1");
                $st->execute([':id' => $bookingId]);
                $dbRow = $st->fetch();
            }
            if (!$dbRow && !empty($bookingCode)) {
                $st = $pdo->prepare("SELECT * FROM `bookings` WHERE booking_code = :code LIMIT 1");
                $st->execute([':code' => $bookingCode]);
                $dbRow = $st->fetch();
            }

            if ($dbRow) {
                $customerName  = $customerName ?: $dbRow['name'];
                $customerEmail = $customerEmail ?: $dbRow['email'];
                $bookingDate   = $bookingDate ?: $dbRow['booking_date'];
                $timeSlot      = $timeSlot ?: $dbRow['time_slot'];
                $guests        = $guests ?: (int)$dbRow['guests'];
                $bookingCode   = $bookingCode ?: $dbRow['booking_code'];

                $reasonNote = ($newStatus === 'Rifiutato' && $rejectionReason !== '')
                    ? "\n[Motivazione Rifiuto: {$rejectionReason}]"
                    : '';

                $upd = $pdo->prepare("UPDATE `bookings` SET status = :st, notes = CONCAT(IFNULL(notes,''), :rnote) WHERE id = :id");
                $upd->execute([
                    ':st'    => $newStatus,
                    ':rnote' => $reasonNote,
                    ':id'    => $dbRow['id'],
                ]);
            }
        } catch (\Exception $e) {
            error_log("DB Update Booking Status Error: " . $e->getMessage());
        }
    }

    $mailSent  = false;
    $smtpError = null;
    if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
        if ($newStatus === 'Confermato' || $newStatus === 'confirmed') {
            $subject = "Prenotazione Confermata #{$bookingCode} - Dock 71 Cantù";
            $bodyHtml = "<p>Siamo felici di comunicarti che la tua richiesta di prenotazione tavolo presso <strong>Dock 71 Cantù</strong> è stata <strong>ACCETTATA E CONFERMATA</strong>!</p>
                         <p>Il tuo tavolo ti aspetta in <strong>Via Milano 71 a Cantù</strong>. Ti chiediamo cortesemente di avvisarci in caso di ritardo superiore ai 15 minuti.</p>";
            $html = buildDock71EmailHtml(
                'PRENOTAZIONE CONFERMATA ✓',
                '#336859',
                'Il tuo tavolo al Dock 71 è confermato!',
                $customerName,
                $bodyHtml,
                [
                    'Stato Prenotazione'  => 'CONFERMATA',
                    'Codice Prenotazione' => '#' . $bookingCode,
                    'Data e Orario'       => $bookingDate . ' • Ore ' . $timeSlot,
                    'Numero Ospiti'       => $guests . ($guests === 1 ? ' Persona' : ' Persone'),
                    'Indirizzo'           => 'Via Milano 71, 22063 Cantù (CO)',
                ]
            );
            $mailSent = processFormSendSmtp($customerEmail, $customerName, $subject, $html, COMPANY_NOTIFICATION_EMAIL, $smtpError);
        } elseif ($newStatus === 'Rifiutato' || $newStatus === 'cancelled') {
            $safeReason = htmlspecialchars(
                $rejectionReason ?: 'Disponibilità tavoli esaurita per la fascia oraria richiesta.',
                ENT_QUOTES,
                'UTF-8'
            );
            $subject = "Aggiornamento Richiesta Prenotazione #{$bookingCode} - Dock 71 Cantù";
            $bodyHtml = "<p>Ti ringraziamo per aver scelto <strong>Dock 71 Cantù</strong>. Purtroppo non ci è possibile confermare la tua richiesta di prenotazione per il seguente motivo:</p>
                         <div style='padding:14px 16px;background:#FEE2E2;border-left:4px solid #7B2039;border-radius:8px;margin:14px 0;color:#7B2039;font-weight:bold;'>{$safeReason}</div>
                         <p>Saremo felici di accoglierti in un'altra fascia oraria o in un'altra serata: puoi contattarci direttamente al <strong>+39 031 712063</strong>.</p>";
            $html = buildDock71EmailHtml(
                'PRENOTAZIONE NON DISPONIBILE',
                '#7B2039',
                'Comunicazione sulla tua richiesta di prenotazione',
                $customerName,
                $bodyHtml,
                [
                    'Codice Richiesta' => '#' . $bookingCode,
                    'Data Richiesta'   => $bookingDate . ' • Ore ' . $timeSlot,
                    'Coperti'          => $guests . ($guests === 1 ? ' Persona' : ' Persone'),
                ]
            );
            $mailSent = processFormSendSmtp($customerEmail, $customerName, $subject, $html, COMPANY_NOTIFICATION_EMAIL, $smtpError);
        }
    }

    echo json_encode([
        'success'        => true,
        'status'         => $newStatus,
        'booking_code'   => $bookingCode,
        'email_sent'     => $mailSent,
        'customer_email' => $customerEmail,
        'smtp_error'     => $smtpError,
    ]);
    exit;
}

// ============================================================================
// 4. RISPOSTA DIRETTA A UN MESSAGGIO DAL GESTIONALE (action = reply_contact)
// ============================================================================
if ($action === 'reply_contact') {
    header('Content-Type: application/json; charset=UTF-8');

    $contactId     = (int)($_POST['contact_id'] ?? 0);
    $customerName  = trim(strip_tags((string)($_POST['name'] ?? 'Cliente')));
    $customerEmail = trim(filter_var((string)($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL));
    $replyMessage  = trim(strip_tags((string)($_POST['reply_message'] ?? '')));
    $origMessage   = trim(strip_tags((string)($_POST['original_message'] ?? '')));

    if ($pdo && $contactId > 0) {
        try {
            $st = $pdo->prepare("SELECT * FROM `contacts` WHERE id = :id LIMIT 1");
            $st->execute([':id' => $contactId]);
            $row = $st->fetch();
            if ($row) {
                $customerName  = $customerName ?: $row['name'];
                $customerEmail = $customerEmail ?: $row['email'];
                $origMessage   = $origMessage ?: $row['message'];
            }
            $pdo->prepare("UPDATE `contacts` SET status = 'Risposto' WHERE id = :id")->execute([':id' => $contactId]);
        } catch (\Exception $e) {
            error_log("DB Reply Contact Error: " . $e->getMessage());
        }
    }

    $mailSent  = false;
    $smtpError = null;
    if (!empty($customerEmail) && filter_var($customerEmail, FILTER_VALIDATE_EMAIL) && !empty($replyMessage)) {
        $safeReply = nl2br(htmlspecialchars($replyMessage, ENT_QUOTES, 'UTF-8'));
        $html = buildDock71EmailHtml(
            'RISPOSTA UFFICIALE DOCK 71',
            '#336859',
            'Risposta alla tua richiesta di informazioni',
            $customerName,
            "<div style='padding:16px;background:#FFFFFF;border:1px solid #E8E2D4;border-radius:10px;'>{$safeReply}</div>",
            !empty($origMessage) ? ['Il tuo messaggio originale' => mb_strimwidth($origMessage, 0, 140, '...')] : []
        );
        $mailSent = processFormSendSmtp(
            $customerEmail,
            $customerName,
            "Risposta da Dock 71 Cantù",
            $html,
            COMPANY_NOTIFICATION_EMAIL,
            $smtpError
        );
    }

    echo json_encode([
        'success'    => true,
        'status'     => 'Risposto',
        'email_sent' => $mailSent,
        'smtp_error' => $smtpError,
    ]);
    exit;
}

// ============================================================================
// 5. ELIMINAZIONE SINGOLA O IN MASSA DAL GESTIONALE (action = delete_records)
// ============================================================================
if ($action === 'delete_records') {
    header('Content-Type: application/json; charset=UTF-8');
    $targetTable = $_POST['target_table'] ?? '';
    $ids         = $_POST['ids'] ?? [];
    $codes       = $_POST['codes'] ?? [];

    $allowedTables = [
        'bookings' => 'bookings',
        'contacts' => 'contacts',
        'consents' => 'cookie_consent_logs',
    ];

    $deleted = 0;
    if ($pdo && isset($allowedTables[$targetTable])) {
        $dbTable = $allowedTables[$targetTable];
        try {
            if (!empty($ids) && is_array($ids)) {
                $numIds = array_filter(array_map('intval', $ids), fn($n) => $n > 0);
                if (!empty($numIds)) {
                    $ph = implode(',', array_fill(0, count($numIds), '?'));
                    $st = $pdo->prepare("DELETE FROM `{$dbTable}` WHERE id IN ({$ph})");
                    $st->execute(array_values($numIds));
                    $deleted += $st->rowCount();
                }
            }
            if ($targetTable === 'bookings' && !empty($codes) && is_array($codes)) {
                $cleanCodes = array_filter(array_map('strval', $codes));
                if (!empty($cleanCodes)) {
                    $ph = implode(',', array_fill(0, count($cleanCodes), '?'));
                    $st = $pdo->prepare("DELETE FROM `bookings` WHERE booking_code IN ({$ph})");
                    $st->execute(array_values($cleanCodes));
                    $deleted += $st->rowCount();
                }
            }
        } catch (\Exception $e) {
            error_log("DB Delete Error: " . $e->getMessage());
        }
    }

    echo json_encode(['success' => true, 'deleted' => $deleted]);
    exit;
}

// ============================================================================
// 6. TEST DIAGNOSTICO SMTP RISERVATO (invia solo a info@dock71birreria.it)
// ============================================================================
if ($action === 'test_smtp') {
    header('Content-Type: application/json; charset=UTF-8');
    $smtpError     = null;
    $transportUsed = null;
    $html = buildDock71EmailHtml(
        'TEST SMTP DIAGNOSTICO',
        '#336859',
        'Verifica invio email PHPMailer SMTP',
        'Staff Dock 71',
        '<p>Questa è un\'email automatica di verifica inviata dal Gestionale Dock 71 per confermare che il server SMTP è operativo.</p>',
        [
            'Data/Ora Test' => date('d/m/Y H:i:s'),
            'Server Host'   => $_SERVER['HTTP_HOST'] ?? 'CLI',
        ]
    );
    $sent = processFormSendSmtp(
        COMPANY_NOTIFICATION_EMAIL,
        'Dock 71 Test SMTP',
        'Test Connessione SMTP PHPMailer - Dock 71 Cantù',
        $html,
        COMPANY_NOTIFICATION_EMAIL,
        $smtpError,
        $transportUsed
    );
    echo json_encode([
        'success'    => $sent,
        'email_sent' => $sent,
        'transport'  => $transportUsed,
        'smtp_error' => $smtpError,
    ]);
    exit;
}

