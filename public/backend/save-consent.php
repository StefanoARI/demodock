<?php
/**
 * DOCK 71 CANTÙ - SAVE CONSENT SCRIPT (GDPR PROOF OF CONSENT)
 * Ricezione e salvataggio sicuro in PDO con prepared statements e anonimizzazione IP.
 */

header('Content-Type: application/json; charset=UTF-8');

// Richiedi file configurazione
require_once __DIR__ . '/db.php';

// Consentiamo solo richieste POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Lettura body JSON
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data || !isset($data['consents_given'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid consent payload']);
    exit;
}

// 1. Consent ID univoco (UUID)
$consentId = !empty($data['consent_id']) ? substr(preg_replace('/[^a-zA-Z0-9_\-]/', '', $data['consent_id']), 0, 64) : bin2hex(random_bytes(16));

// 2. Anonimizzazione Indirizzo IP (azzeramento ultimo ottetto IPv4 o hextet IPv6 secondo linee guida GDPR)
$rawIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
$anonymizedIp = $rawIp;
if (filter_var($rawIp, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
    $parts = explode('.', $rawIp);
    if (count($parts) === 4) {
        $parts[3] = '0';
        $anonymizedIp = implode('.', $parts);
    }
} elseif (filter_var($rawIp, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
    $parts = explode(':', $rawIp);
    if (count($parts) > 2) {
        $anonymizedIp = $parts[0] . ':' . $parts[1] . ':*:*';
    }
}

// 3. User Agent e Timestamp
$userAgent = substr($_SERVER['HTTP_USER_AGENT'] ?? ($data['user_agent'] ?? 'Unknown'), 0, 500);
$consentsJson = json_encode($data['consents_given'], JSON_UNESCAPED_UNICODE);

try {
    $pdo = getDbConnection();
    $stmt = $pdo->prepare("
        INSERT INTO `cookie_consent_logs` (`consent_id`, `ip_address`, `consents_given`, `user_agent`)
        VALUES (:cid, :ip, :consents, :ua)
        ON DUPLICATE KEY UPDATE `consents_given` = VALUES(`consents_given`), `timestamp` = CURRENT_TIMESTAMP
    ");

    $stmt->execute([
        ':cid'      => $consentId,
        ':ip'       => $anonymizedIp,
        ':consents' => $consentsJson,
        ':ua'       => $userAgent
    ]);

    // Imposta cookie cifrato/sicuro sul browser
    setcookie('dock71_cid', $consentId, [
        'expires'  => time() + (365 * 24 * 60 * 60),
        'path'     => '/',
        'secure'   => true,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);

    echo json_encode([
        'success'    => true,
        'consent_id' => $consentId,
        'message'    => 'Proof of consent registered successfully'
    ]);
} catch (Exception $e) {
    error_log("Error saving consent log: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database operation failed']);
}
