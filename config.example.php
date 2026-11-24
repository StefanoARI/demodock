<?php
/**
 * DOCK 71 CANTÙ - CONFIGURAZIONE ESEMPIO (TEMPLATE GITHUB)
 *
 * Rinomina questo file in `config.php` o `db.php` sul server di produzione cPanel
 * e inserisci le tue credenziali reali. Questo file NON contiene password reali.
 */

// Database Host
define('DB_HOST', 'localhost');

// Database Name
define('DB_NAME', 'dock71b1_birreria');

// Database Username
define('DB_USER', 'dock71b1_birra');

// Database Password
define('DB_PASS', 'YOUR_DATABASE_PASSWORD_HERE');

define('DB_CHARSET', 'utf8mb4');

// Configurazione SMTP per invio email
define('SMTP_HOST', 'mailserver15.vhosting-it.com');
define('SMTP_PORT', 465);
define('SMTP_USER', 'info@dock71birreria.it');
define('SMTP_PASS', 'YOUR_SMTP_PASSWORD_HERE');
define('SMTP_FROM_EMAIL', 'info@dock71birreria.it');
define('SMTP_FROM_NAME', 'Dock 71 Cantù');
define('COMPANY_NOTIFICATION_EMAIL', 'info@dock71birreria.it');

// Credenziali e Slug Segreto CRM
define('SECRET_ADMIN_SLUG', 'dock71-control-panel-k98z');
define('ADMIN_DEFAULT_USER', 'assistenza@arimediagroup.it');
define('ADMIN_DEFAULT_PASS_HASH', 'YOUR_BCRYPT_HASH_HERE');
