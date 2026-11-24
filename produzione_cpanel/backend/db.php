<?php
/**
 * DOCK 71 CANTÙ - DATABASE CONFIGURATION, PDO WRAPPER & REAL SMTP CLIENT
 * Configurazione centrale per ambiente vHosting / cPanel (mailserver15.vhosting-it.com:465).
 */

if (!defined('DOCK71_APP')) {
    define('DOCK71_APP', true);
}

// Credenziali Database MySQL vHosting
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'dock71b1_birreria');
define('DB_USER', getenv('DB_USER') ?: 'dock71b1_birra');
define('DB_PASS', getenv('DB_PASSWORD') ?: 'X)b_1%#so)z#Bx9u');
define('DB_CHARSET', 'utf8mb4');

// Configurazione SMTP vHosting (SSL/TLS Porta 465)
define('SMTP_HOST', 'mailserver15.vhosting-it.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'info@dock71birreria.it');
define('SMTP_PASS', 'RdP7KakV6EXZ9C584J2B@.');
define('SMTP_FROM_EMAIL', 'info@dock71birreria.it');
define('SMTP_FROM_NAME', 'Dock 71 Cantù');
define('COMPANY_NOTIFICATION_EMAIL', 'info@dock71birreria.it');

/**
 * Connessione PDO MySQL con migrazione automatica colonne status
 */
function getDbConnection(): ?PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

            // Assicura che le colonne status accettino sia i valori italiani ('In Attesa', 'Confermato', 'Rifiutato', 'Risposto') sia quelli inglesi
            try {
                $pdo->exec("ALTER TABLE `bookings` MODIFY COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'In Attesa'");
            } catch (Exception $e) {
                // Ignora se tabella non ancora creata
            }
            try {
                $pdo->exec("ALTER TABLE `contacts` MODIFY COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'Nuovo'");
            } catch (Exception $e) {
                // Ignora se tabella non ancora creata
            }
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage());
            return null;
        }
    }
    return $pdo;
}

/**
 * Carica automaticamente il client SMTP PHPMailer se chiamato da script che includono solo db.php
 */
if (file_exists(__DIR__ . '/smtp-mailer.php')) {
    require_once __DIR__ . '/smtp-mailer.php';
}

