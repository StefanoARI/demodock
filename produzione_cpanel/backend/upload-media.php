<?php
/**
 * DOCK 71 CANTÙ - UPLOAD & CONVERSIONE AUTOMATICA WEBP E AVIF
 *
 * Riceve immagini (JPG, PNG, WEBP, AVIF) e le converte automaticamente in formato WebP o AVIF
 * ottimizzato per massime prestazioni su server LiteSpeed / cPanel.
 * Salva i file nella cartella protetta /uploads/images/ (esclusa da Git).
 */

header('Content-Type: application/json; charset=UTF-8');

// Richiedi db.php se presente
if (file_exists(__DIR__ . '/db.php')) {
    require_once __DIR__ . '/db.php';
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metodo non consentito. Richiesto POST.']);
    exit;
}

// Cartella di destinazione fisica (esclusa tassativamente da Git in .gitignore)
$uploadsBaseDir = dirname(__DIR__) . '/uploads/images/';
if (!is_dir($uploadsBaseDir)) {
    mkdir($uploadsBaseDir, 0755, true);
}

// 1. GESTIONE AGGIORNAMENTO ALT TEXT SEO
if (isset($_POST['action']) && $_POST['action'] === 'update_alt') {
    $mediaId = (int)($_POST['id'] ?? 0);
    $altText = trim(htmlspecialchars($_POST['alt_text'] ?? '', ENT_QUOTES, 'UTF-8'));

    if (function_exists('getDbConnection') && $mediaId > 0) {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("UPDATE `media_library` SET `alt_text` = :alt WHERE `id` = :id");
        $stmt->execute([':alt' => $altText, ':id' => $mediaId]);
    }
    echo json_encode(['success' => true, 'message' => 'Alt text SEO salvato']);
    exit;
}

// 2. GESTIONE UPLOAD IMMAGINE
if (!isset($_FILES['media_file']) || $_FILES['media_file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Nessun file valido caricato o errore di trasferimento']);
    exit;
}

$file = $_FILES['media_file'];
$altText = trim(htmlspecialchars($_POST['alt_text'] ?? '', ENT_QUOTES, 'UTF-8'));
$targetFormat = strtolower($_POST['target_format'] ?? 'webp'); // 'webp' oppure 'avif'

$originalName = pathinfo($file['name'], PATHINFO_FILENAME);
$extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Formati in ingresso consentiti: JPG, PNG, WEBP, AVIF
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
if (!in_array($extension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato non supportato. Carica file JPG, PNG, WEBP o AVIF.']);
    exit;
}

// Nome file sicuro
$cleanBase = preg_replace('/[^a-zA-Z0-9_-]/', '_', $originalName);
$uniqueSuffix = date('Ymd_His') . '_' . bin2hex(random_bytes(4));

$converted = false;
$outputExtension = ($targetFormat === 'avif' && function_exists('imageavif')) ? 'avif' : 'webp';
$finalFilename = $cleanBase . '_' . $uniqueSuffix . '.' . $outputExtension;
$destinationPath = $uploadsBaseDir . $finalFilename;

// Creazione risorsa immagine con supporto GD / Imagick
$imageResource = null;

switch ($extension) {
    case 'jpg':
    case 'jpeg':
        $imageResource = @imagecreatefromjpeg($file['tmp_name']);
        break;
    case 'png':
        $imageResource = @imagecreatefrompng($file['tmp_name']);
        if ($imageResource) {
            imagepalettetotruecolor($imageResource);
            imagealphablending($imageResource, true);
            imagesavealpha($imageResource, true);
        }
        break;
    case 'webp':
        if (function_exists('imagecreatefromwebp')) {
            $imageResource = @imagecreatefromwebp($file['tmp_name']);
        }
        break;
    case 'avif':
        if (function_exists('imagecreatefromavif')) {
            $imageResource = @imagecreatefromavif($file['tmp_name']);
        }
        break;
}

// Conversione automatica in WebP o AVIF per massime prestazioni LiteSpeed
if ($imageResource) {
    if ($outputExtension === 'avif' && function_exists('imageavif')) {
        // Conversione in AVIF (qualità 80 per compressione ultramoderna)
        $converted = imageavif($imageResource, $destinationPath, 80);
    } elseif (function_exists('imagewebp')) {
        // Conversione in WebP (qualità 85 per eccellente bilanciamento Core Web Vitals)
        $converted = imagewebp($imageResource, $destinationPath, 85);
    }
    imagedestroy($imageResource);
}

// Fallback se la libreria GD locale non supporta il codec
if (!$converted || !file_exists($destinationPath)) {
    $fallbackName = $cleanBase . '_' . $uniqueSuffix . '.' . $extension;
    $destinationPath = $uploadsBaseDir . $fallbackName;
    $finalFilename = $fallbackName;
    $converted = move_uploaded_file($file['tmp_name'], $destinationPath);
}

$fileSize = file_exists($destinationPath) ? filesize($destinationPath) : 0;
$webPath = '/uploads/images/' . $finalFilename;

// Salvataggio nel Database MySQL se configurato
if (function_exists('getDbConnection')) {
    try {
        $pdo = getDbConnection();
        $stmt = $pdo->prepare("
            INSERT INTO `media_library` (`filename`, `original_name`, `file_path`, `file_size`, `alt_text`)
            VALUES (:fname, :orig, :fpath, :fsize, :alt)
        ");
        $stmt->execute([
            ':fname' => $finalFilename,
            ':orig'  => $file['name'],
            ':fpath' => $webPath,
            ':fsize' => $fileSize,
            ':alt'   => $altText
        ]);
    } catch (Exception $e) {
        error_log("Database media logging error: " . $e->getMessage());
    }
}

echo json_encode([
    'success'       => true,
    'filename'      => $finalFilename,
    'format'        => $outputExtension,
    'file_path'     => $webPath,
    'file_size'     => $fileSize,
    'alt_text'      => $altText,
    'message'       => "Immagine caricata e convertita con successo in {$outputExtension} per LiteSpeed!"
]);
