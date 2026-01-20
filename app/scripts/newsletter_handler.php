<?php
/**
 * Newsletter Handler (PHP)
 * Alternative PHP pour gérer la newsletter si Python n'est pas disponible
 */

function initNewsletterDB() {
    $dbPath = __DIR__ . '/../data/newsletter.db';
    $dbDir = dirname($dbPath);
    
    if (!is_dir($dbDir)) {
        mkdir($dbDir, 0755, true);
    }
    
    $db = new SQLite3($dbPath);
    
    $db->exec('
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT "active",
            source TEXT,
            ip_address TEXT,
            user_agent TEXT
        )
    ');
    
    $db->exec('
        CREATE TABLE IF NOT EXISTS newsletter_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            action TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            details TEXT
        )
    ');
    
    return $db;
}

function addNewsletterSubscriber($email, $name = null, $source = 'website') {
    $db = initNewsletterDB();
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    try {
        $stmt = $db->prepare('
            INSERT INTO subscribers (email, name, source, ip_address, user_agent)
            VALUES (:email, :name, :source, :ip, :ua)
        ');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':name', $name, SQLITE3_TEXT);
        $stmt->bindValue(':source', $source, SQLITE3_TEXT);
        $stmt->bindValue(':ip', $ip, SQLITE3_TEXT);
        $stmt->bindValue(':ua', $userAgent, SQLITE3_TEXT);
        $stmt->execute();
        
        $stmt = $db->prepare('
            INSERT INTO newsletter_logs (email, action, details)
            VALUES (:email, "subscribed", :details)
        ');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':details', "Subscribed from $source", SQLITE3_TEXT);
        $stmt->execute();
        
        $db->close();
        return ['success' => true, 'message' => 'Email ajouté avec succès'];
    } catch (Exception $e) {
        $db->close();
        if (strpos($e->getMessage(), 'UNIQUE') !== false) {
            return ['success' => false, 'message' => 'Cet email est déjà enregistré'];
        }
        return ['success' => false, 'message' => 'Erreur : ' . $e->getMessage()];
    }
}

function removeNewsletterSubscriber($email) {
    $db = initNewsletterDB();
    
    $stmt = $db->prepare('UPDATE subscribers SET status = "unsubscribed" WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $stmt->execute();
    
    $stmt = $db->prepare('
        INSERT INTO newsletter_logs (email, action, details)
        VALUES (:email, "unsubscribed", "User unsubscribed")
    ');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $stmt->execute();
    
    $db->close();
    return ['success' => true, 'message' => 'Désabonnement réussi'];
}
?>
