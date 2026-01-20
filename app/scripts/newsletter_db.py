#!/usr/bin/env python3
"""
Newsletter Database Manager
Gestion de la base de données SQLite pour les emails de newsletter
"""

import sqlite3
import os
from datetime import datetime
from pathlib import Path

# Chemin vers la base de données
DB_PATH = Path(__file__).parent.parent / 'data' / 'newsletter.db'

def init_db():
    """Initialise la base de données"""
    os.makedirs(DB_PATH.parent, exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'active',
            source TEXT,
            ip_address TEXT,
            user_agent TEXT
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS newsletter_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            action TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            details TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"✅ Base de données initialisée : {DB_PATH}")

def add_subscriber(email, name=None, source=None, ip_address=None, user_agent=None):
    """Ajoute un nouvel abonné"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO subscribers (email, name, source, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        ''', (email, name, source, ip_address, user_agent))
        
        cursor.execute('''
            INSERT INTO newsletter_logs (email, action, details)
            VALUES (?, ?, ?)
        ''', (email, 'subscribed', f'Subscribed from {source}'))
        
        conn.commit()
        conn.close()
        return {'success': True, 'message': 'Email ajouté avec succès'}
    except sqlite3.IntegrityError:
        conn.close()
        return {'success': False, 'message': 'Cet email est déjà enregistré'}
    except Exception as e:
        conn.close()
        return {'success': False, 'message': f'Erreur : {str(e)}'}

def remove_subscriber(email):
    """Supprime un abonné"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('UPDATE subscribers SET status = ? WHERE email = ?', ('unsubscribed', email))
    cursor.execute('''
        INSERT INTO newsletter_logs (email, action, details)
        VALUES (?, ?, ?)
    ''', (email, 'unsubscribed', 'User unsubscribed'))
    
    conn.commit()
    conn.close()
    return {'success': True, 'message': 'Désabonnement réussi'}

def get_subscribers(status='active'):
    """Récupère tous les abonnés actifs"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT email, name, subscribed_at FROM subscribers WHERE status = ?', (status,))
    subscribers = cursor.fetchall()
    
    conn.close()
    return subscribers

def get_stats():
    """Récupère les statistiques"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM subscribers WHERE status = "active"')
    active = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM subscribers WHERE status = "unsubscribed"')
    unsubscribed = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) FROM subscribers')
    total = cursor.fetchone()[0]
    
    conn.close()
    return {
        'active': active,
        'unsubscribed': unsubscribed,
        'total': total
    }

if __name__ == '__main__':
    init_db()
    print("📊 Statistiques:", get_stats())
