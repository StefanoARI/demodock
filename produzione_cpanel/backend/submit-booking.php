<?php
/**
 * Wrapper di compatibilità per submit-booking.php -> process-form.php
 */
$_POST['action'] = $_POST['action'] ?? 'booking';
$_POST['ajax']   = $_POST['ajax'] ?? '1';
require_once __DIR__ . '/process-form.php';
