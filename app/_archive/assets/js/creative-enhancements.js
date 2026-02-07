/**
 * Creative Enhancements JavaScript
 * Fonctionnalités créatives et innovantes
 */

(function() {
  'use strict';

  // ============================================
  // Bookmark System
  // ============================================
  function initBookmarkSystem() {
    const bookmarkBtn = document.createElement('button');
    bookmarkBtn.className = 'bookmark-btn';
    bookmarkBtn.setAttribute('aria-label', 'Ajouter aux favoris');
    bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
    document.body.appendChild(bookmarkBtn);

    const currentPath = window.location.pathname;
    const isBookmarked = localStorage.getItem(`bookmark-${currentPath}`);

    if (isBookmarked) {
      bookmarkBtn.classList.add('active');
      bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
    }

    bookmarkBtn.addEventListener('click', () => {
      const isActive = bookmarkBtn.classList.contains('active');

      if (isActive) {
        bookmarkBtn.classList.remove('active');
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        localStorage.removeItem(`bookmark-${currentPath}`);
        showNotification('Favori retiré', 'bookmark');
      } else {
        bookmarkBtn.classList.add('active');
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        localStorage.setItem(`bookmark-${currentPath}`, 'true');
        showNotification('Ajouté aux favoris !', 'bookmark');
        createConfetti();
      }
    });

    // Afficher après scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        bookmarkBtn.style.opacity = '1';
        bookmarkBtn.style.visibility = 'visible';
      }
    }, { passive: true });
  }

  // ============================================
  // Zen Mode avec Musique
  // ============================================
  function initZenMode() {
    const zenBtn = document.createElement('button');
    zenBtn.className = 'focus-mode-btn';
    zenBtn.style.bottom = '140px';
    zenBtn.innerHTML = '<i class="fas fa-spa"></i>';
    zenBtn.setAttribute('aria-label', 'Mode Zen');
    document.body.appendChild(zenBtn);

    const zenMode = document.createElement('div');
    zenMode.className = 'zen-mode';
    zenMode.innerHTML = `
      <div class="zen-content">
        <h1 class="gradient-text-animated">Mode Zen</h1>
        <p style="font-size: 1.25rem; margin-bottom: var(--spacing-xl);">
          Détendez-vous et concentrez-vous sur votre lecture
        </p>
        <div class="zen-controls">
          <button class="zen-btn" id="zen-play">
            <i class="fas fa-play"></i> Musique
          </button>
          <button class="zen-btn" id="zen-close">
            <i class="fas fa-times"></i> Fermer
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(zenMode);

    let audio = null;
    const playBtn = zenMode.querySelector('#zen-play');

    zenBtn.addEventListener('click', () => {
      zenMode.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    playBtn.addEventListener('click', () => {
      if (!audio) {
        // Utiliser une musique ambiante (dans un vrai projet, utiliser un fichier audio)
        // Pour l'instant, on simule avec une notification
        showNotification('🎵 Musique ambiante activée', 'zen');
        playBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
      } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i> Musique';
        audio = null;
      }
    });

    zenMode.querySelector('#zen-close').addEventListener('click', () => {
      zenMode.classList.remove('active');
      document.body.style.overflow = '';
      if (audio) {
        audio.pause();
        audio = null;
      }
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && zenMode.classList.contains('active')) {
        zenMode.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Text-to-Speech
  // ============================================
  function initTextToSpeech() {
    if (!('speechSynthesis' in window)) return;

    const ttsControls = document.createElement('div');
    ttsControls.className = 'tts-controls';
    ttsControls.innerHTML = `
      <button class="tts-btn" id="tts-play" aria-label="Lire">
        <i class="fas fa-play"></i>
      </button>
      <button class="tts-btn" id="tts-pause" aria-label="Pause">
        <i class="fas fa-pause"></i>
      </button>
      <button class="tts-btn" id="tts-stop" aria-label="Arrêter">
        <i class="fas fa-stop"></i>
      </button>
      <div class="tts-speed">
        <label>Vitesse:</label>
        <input type="range" id="tts-speed" min="0.5" max="2" step="0.1" value="1">
        <span id="tts-speed-value">1x</span>
      </div>
    `;
    document.body.appendChild(ttsControls);

    const blogPost = document.querySelector('.blog-post');
    if (!blogPost) return;

    let utterance = null;
    const playBtn = ttsControls.querySelector('#tts-play');
    const pauseBtn = ttsControls.querySelector('#tts-pause');
    const stopBtn = ttsControls.querySelector('#tts-stop');
    const speedInput = ttsControls.querySelector('#tts-speed');
    const speedValue = ttsControls.querySelector('#tts-speed-value');

    function speak() {
      const text = blogPost.textContent || blogPost.innerText;
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = parseFloat(speedInput.value);
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        playBtn.classList.add('active');
        ttsControls.classList.add('visible');
      };

      utterance.onend = () => {
        playBtn.classList.remove('active');
      };

      speechSynthesis.speak(utterance);
    }

    playBtn.addEventListener('click', () => {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
      } else if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speak();
      }
    });

    pauseBtn.addEventListener('click', () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.pause();
      }
    });

    stopBtn.addEventListener('click', () => {
      speechSynthesis.cancel();
      playBtn.classList.remove('active');
    });

    speedInput.addEventListener('input', (e) => {
      speedValue.textContent = `${e.target.value}x`;
      if (utterance) {
        utterance.rate = parseFloat(e.target.value);
      }
    });

    // Afficher après scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        ttsControls.classList.add('visible');
      }
    }, { passive: true });
  }

  // ============================================
  // Citation Partageable
  // ============================================
  function initQuoteHighlight() {
    document.addEventListener('mouseup', function() {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 20 && text.length < 500) {
        // Créer le tooltip de citation
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const quoteTooltip = document.createElement('div');
        quoteTooltip.className = 'quote-tooltip';
        quoteTooltip.style.cssText = `
          position: fixed;
          top: ${rect.top - 60}px;
          left: ${rect.left}px;
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border);
          border-radius: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          display: flex;
          gap: 0.5rem;
        `;
        quoteTooltip.innerHTML = `
          <button class="quote-btn" data-action="copy">
            <i class="fas fa-copy"></i> Copier
          </button>
          <button class="quote-btn" data-action="share">
            <i class="fas fa-share"></i> Partager
          </button>
        `;

        document.body.appendChild(quoteTooltip);

        quoteTooltip.querySelector('[data-action="copy"]').addEventListener('click', () => {
          navigator.clipboard.writeText(`"${text}" - ${document.title}`);
          showNotification('Citation copiée !', 'quote');
          quoteTooltip.remove();
          selection.removeAllRanges();
        });

        quoteTooltip.querySelector('[data-action="share"]').addEventListener('click', async () => {
          if (navigator.share) {
            await navigator.share({
              title: document.title,
              text: `"${text}"`,
              url: window.location.href
            });
          } else {
            navigator.clipboard.writeText(`"${text}" - ${document.title} - ${window.location.href}`);
            showNotification('Citation copiée pour partage !', 'quote');
          }
          quoteTooltip.remove();
          selection.removeAllRanges();
        });

        // Supprimer après 5 secondes ou clic ailleurs
        setTimeout(() => quoteTooltip.remove(), 5000);
        document.addEventListener('click', function removeTooltip(e) {
          if (!quoteTooltip.contains(e.target)) {
            quoteTooltip.remove();
            document.removeEventListener('click', removeTooltip);
          }
        });
      }
    });
  }

  // ============================================
  // Notes Personnelles
  // ============================================
  function initPersonalNotes() {
    const notesToggle = document.createElement('button');
    notesToggle.className = 'notes-toggle';
    notesToggle.innerHTML = '<i class="fas fa-sticky-note"></i>';
    notesToggle.setAttribute('aria-label', 'Notes personnelles');
    document.body.appendChild(notesToggle);

    const notesPanel = document.createElement('div');
    notesPanel.className = 'personal-notes';
    notesPanel.innerHTML = `
      <div class="notes-header">
        <h4 style="margin: 0; font-size: 1rem;">Mes Notes</h4>
        <button class="notes-close" style="background: none; border: none; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="notes-content">
        <textarea class="notes-input" placeholder="Ajoutez vos notes personnelles sur cet article..."></textarea>
      </div>
    `;
    document.body.appendChild(notesPanel);

    const currentPath = window.location.pathname;
    const savedNotes = localStorage.getItem(`notes-${currentPath}`);
    if (savedNotes) {
      notesPanel.querySelector('.notes-input').value = savedNotes;
    }

    notesToggle.addEventListener('click', () => {
      notesPanel.classList.toggle('visible');
    });

    notesPanel.querySelector('.notes-close').addEventListener('click', () => {
      notesPanel.classList.remove('visible');
    });

    // Sauvegarder automatiquement
    const notesInput = notesPanel.querySelector('.notes-input');
    notesInput.addEventListener('input', debounce(() => {
      localStorage.setItem(`notes-${currentPath}`, notesInput.value);
    }, 500));
  }

  // ============================================
  // Particles Background
  // ============================================
  function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    function createParticle() {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesContainer.appendChild(particle);

      setTimeout(() => particle.remove(), 25000);
    }

    // Créer des particules périodiquement
    setInterval(createParticle, 2000);
    for (let i = 0; i < 10; i++) {
      setTimeout(createParticle, i * 200);
    }
  }

  // ============================================
  // Confetti Animation
  // ============================================
  function createConfetti() {
    const colors = ['#008AFF', '#0085A1', '#ff6b6b', '#4ecdc4', '#ffe66d'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.5 + 's';
      confetti.style.width = (5 + Math.random() * 10) + 'px';
      confetti.style.height = (5 + Math.random() * 10) + 'px';
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 3000);
    }
  }

  // ============================================
  // Reading Stats Avancées
  // ============================================
  function initAdvancedReadingStats() {
    const statsPanel = document.createElement('div');
    statsPanel.className = 'reading-stats-advanced';
    statsPanel.innerHTML = `
      <h4 style="margin: 0 0 1rem 0; font-size: 1rem;">Statistiques</h4>
      <div class="stat-item">
        <span class="stat-label">Progression</span>
        <span class="stat-value" id="reading-progress">0%</span>
        <div class="stat-progress">
          <div class="stat-progress-bar" id="progress-bar" style="width: 0%"></div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-label">Temps lu</span>
        <span class="stat-value" id="time-read">0 min</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Mots lus</span>
        <span class="stat-value" id="words-read">0</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Vitesse</span>
        <span class="stat-value" id="reading-speed">0 wpm</span>
      </div>
    `;
    document.body.appendChild(statsPanel);

    const blogPost = document.querySelector('.blog-post');
    if (!blogPost) return;

    let startTime = Date.now();
    let wordsRead = 0;
    const totalWords = blogPost.textContent.split(/\s+/).length;

    function updateStats() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);

      document.getElementById('reading-progress').textContent = Math.round(progress) + '%';
      document.getElementById('progress-bar').style.width = progress + '%';

      // Calculer les mots lus (approximation basée sur la progression)
      wordsRead = Math.round((progress / 100) * totalWords);
      document.getElementById('words-read').textContent = wordsRead.toLocaleString();

      // Temps de lecture
      const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60);
      document.getElementById('time-read').textContent = timeSpent + ' min';

      // Vitesse de lecture (mots par minute)
      if (timeSpent > 0) {
        const wpm = Math.round(wordsRead / timeSpent);
        document.getElementById('reading-speed').textContent = wpm + ' wpm';
      }
    }

    window.addEventListener('scroll', debounce(updateStats, 100), { passive: true });

    // Afficher après scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        statsPanel.classList.add('visible');
      }
    }, { passive: true });
  }

  // ============================================
  // Cursor Personnalisé
  // ============================================
  function initCustomCursor() {
    if (window.matchMedia('(pointer: fine)').matches) {
      const cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      document.body.appendChild(cursor);

      const cursorDot = document.createElement('div');
      cursorDot.className = 'custom-cursor-dot';
      document.body.appendChild(cursorDot);

      document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursorDot.style.left = e.clientX - 2 + 'px';
        cursorDot.style.top = e.clientY - 2 + 'px';
      });

      document.querySelectorAll('a, button, .clickable').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursor.style.transform = 'scale(1)';
        });
      });

      cursor.classList.add('active');
      cursorDot.classList.add('active');
    }
  }

  // ============================================
  // Utilities
  // ============================================
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'bookmark-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initBookmarkSystem();
    initZenMode();
    initTextToSpeech();
    initQuoteHighlight();
    initPersonalNotes();
    initParticles();
    initAdvancedReadingStats();
    // initCustomCursor(); // Désactivé par défaut (peut être activé si souhaité)
  }

  init();

})();
