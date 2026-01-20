<?php
/**
 * Newsletter API Endpoint
 * Gestion des abonnements à la newsletter via SQLite
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../scripts/newsletter_handler.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'subscribe':
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $name = $_POST['name'] ?? '';
        $source = $_POST['source'] ?? 'website';
        
        if (!$email) {
            echo json_encode(['success' => false, 'message' => 'Email invalide']);
            exit;
        }
        
        $result = addNewsletterSubscriber($email, $name, $source);
        echo json_encode($result);
        break;
        
    case 'unsubscribe':
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        
        if (!$email) {
            echo json_encode(['success' => false, 'message' => 'Email invalide']);
            exit;
        }
        
        $result = removeNewsletterSubscriber($email);
        echo json_encode($result);
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Action non valide']);
}
?>
