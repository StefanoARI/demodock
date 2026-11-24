-- ============================================================================
-- DOCK 71 CANTÙ - STRUTTURA DATABASE MYSQL
-- Generato per: dock71b1_birreria
-- Include tabelle per: CRM Contatti, Prenotazioni, Admin 2FA, Log Consenso GDPR, Media Library e Menu Dinamico
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABELLA ADMIN USERS CON SUPPORTO 2FA TOTP (Google Authenticator / Authy)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `totp_secret` VARCHAR(64) DEFAULT NULL,
  `is_2fa_enabled` TINYINT(1) NOT NULL DEFAULT 0,
  `last_login` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Utente predefinito indicato nel PDF: assistenza@arimediagroup.it / Psw: Sd)h3zCr9/A,uA<L3J,J
INSERT IGNORE INTO `admin_users` (`username`, `password_hash`, `totp_secret`, `is_2fa_enabled`)
VALUES ('assistenza@arimediagroup.it', '$2y$12$K1UomO7DkHQFjB/yK9JzIuQO0v4h2oT8K5q7mF4aKx8Ym9s5O1s6e', 'JBSWY3DPEHPK3PXP', 1);

-- 2. TABELLA CONTATTI RICEVUTI (FORM CONTATTO)
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(150) DEFAULT 'Richiesta Info Dock 71',
  `message` TEXT NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_contacts_created` (`created_at`),
  INDEX `idx_contacts_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABELLA PRENOTAZIONI TAVOLI (FORM PRENOTAZIONE)
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(30) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) DEFAULT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `booking_date` DATE NOT NULL,
  `time_slot` VARCHAR(30) NOT NULL,
  `guests` INT UNSIGNED NOT NULL DEFAULT 2,
  `room_area` VARCHAR(80) DEFAULT 'sala-gru',
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_bookings_date` (`booking_date`),
  INDEX `idx_bookings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABELLA LOG CONSENSI COOKIE GDPR (PROOF OF CONSENT)
CREATE TABLE IF NOT EXISTS `cookie_consent_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `consent_id` VARCHAR(64) NOT NULL UNIQUE,
  `ip_address` VARCHAR(45) NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `consents_given` JSON NOT NULL,
  `user_agent` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_consent_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABELLA MEDIA LIBRARY & OTTIMIZZAZIONE IMMAGINI (Opzione B + WebP + SEO)
CREATE TABLE IF NOT EXISTS `media_library` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `file_size` INT UNSIGNED NOT NULL,
  `alt_text` VARCHAR(255) DEFAULT '',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_media_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TABELLA GESTIONE MENU DINAMICO CON DROPDOWN (STRUTTURA AD ALBERO)
CREATE TABLE IF NOT EXISTS `menu_items` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(100) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `order_index` INT NOT NULL DEFAULT 0,
  `status` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`parent_id`) REFERENCES `menu_items`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Voci di base del menu (con sottomenu per Menù & Birre e Il Locale)
INSERT INTO `menu_items` (`id`, `title`, `url`, `parent_id`, `order_index`, `status`) VALUES
(1, 'Home', '/', NULL, 1, 1),
(2, 'Menù & Birre', '/menu', NULL, 2, 1),
(3, 'Pizze Lievitate 48h', '/menu#pizze', 2, 1, 1),
(4, 'Burger & Griglia', '/menu#burger', 2, 2, 1),
(5, '14 Birre Artigianali', '/menu#birre', 2, 3, 1),
(6, 'Il Locale & Sky Sport', '/locale', NULL, 3, 1),
(7, 'La Sala Gru 1912', '/locale#gru', 6, 1, 1),
(8, 'Palinsesto Sky Sport Live', '/locale#palinsesto', 6, 2, 1),
(9, 'Galleria', '/galleria', NULL, 4, 1),
(10, 'Da noi puoi...', '/esperienze', NULL, 5, 1),
(11, 'Contatti', '/contatti', NULL, 6, 1)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

SET FOREIGN_KEY_CHECKS = 1;
