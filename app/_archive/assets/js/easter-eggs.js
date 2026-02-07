/**
 * Easter Eggs & Fun Features
 * Fonctionnalités amusantes et surprises
 */

(function() {
  'use strict';

  // ============================================
  // Konami Code
  // ============================================
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    // Créer un effet de confetti massif
    for (let i = 0; i < 100; i++) {
      setTimeout(() => createConfetti(), i * 10);
    }

    // Afficher un message
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem 3rem;
      border-radius: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      z-index: 100000;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      animation: easterEggPop 0.5s ease-out;
    `;
    message.innerHTML = '🎉 Easter Egg Activé ! 🎉<br><small style="font-size: 1rem; margin-top: 1rem; display: block;">Vous avez trouvé le code secret !</small>';
    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'easterEggPop 0.5s ease-out reverse';
      setTimeout(() => message.remove(), 500);
    }, 3000);

    // Ajouter l'animation CSS si elle n'existe pas
    if (!document.querySelector('#easter-egg-styles')) {
      const style = document.createElement('style');
      style.id = 'easter-egg-styles';
      style.textContent = `
        @keyframes easterEggPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function createConfetti() {
    const colors = ['#008AFF', '#0085A1', '#ff6b6b', '#4ecdc4', '#ffe66d', '#667eea', '#764ba2'];
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${5 + Math.random() * 10}px;
      height: ${5 + Math.random() * 10}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}%;
      top: -10px;
      z-index: 10000;
      border-radius: 50%;
      animation: confettiFall 3s linear forwards;
    `;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }

  // ============================================
  // Double-Click sur Logo
  // ============================================
  const logo = document.querySelector('.navbar-brand');
  if (logo) {
    let clickCount = 0;
    let clickTimer;

    logo.addEventListener('click', (e) => {
      clickCount++;
      clearTimeout(clickTimer);

      if (clickCount === 2) {
        // Double-click détecté
        logo.style.animation = 'logoSpin 0.5s ease-out';
        setTimeout(() => {
          logo.style.animation = '';
        }, 500);
        clickCount = 0;
      }

      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 300);
    });

    // Ajouter l'animation
    if (!document.querySelector('#logo-spin-styles')) {
      const style = document.createElement('style');
      style.id = 'logo-spin-styles';
      style.textContent = `
        @keyframes logoSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Message de Bienvenue Personnalisé
  // ============================================
  function showWelcomeMessage() {
    const isFirstVisit = !localStorage.getItem('hasVisited');
    if (isFirstVisit) {
      setTimeout(() => {
        const welcome = document.createElement('div');
        welcome.style.cssText = `
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: var(--color-link);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          z-index: 10000;
          animation: slideInUp 0.5s ease-out;
          max-width: 300px;
        `;
        welcome.innerHTML = `
          <strong>👋 Bienvenue !</strong><br>
          <small>Découvrez toutes les fonctionnalités premium de cette plateforme</small>
        `;
        document.body.appendChild(welcome);

        setTimeout(() => {
          welcome.style.animation = 'slideOutDown 0.5s ease-out';
          setTimeout(() => welcome.remove(), 500);
        }, 5000);

        localStorage.setItem('hasVisited', 'true');
      }, 2000);
    }
  }

  // ============================================
  // Cursor Trail Effect (Optionnel)
  // ============================================
  function initCursorTrail() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const trail = [];
    const trailLength = 10;

    document.addEventListener('mousemove', (e) => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--color-link);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${e.clientX - 3}px;
        top: ${e.clientY - 3}px;
        opacity: 0.6;
        transition: opacity 0.3s ease-out;
      `;
      document.body.appendChild(dot);

      trail.push(dot);
      if (trail.length > trailLength) {
        const oldDot = trail.shift();
        oldDot.style.opacity = '0';
        setTimeout(() => oldDot.remove(), 300);
      }

      setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => {
          dot.remove();
          const index = trail.indexOf(dot);
          if (index > -1) trail.splice(index, 1);
        }, 300);
      }, 500);
    });
  }

  // ============================================
  // Initialize
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    showWelcomeMessage();
    // initCursorTrail(); // Décommentez pour activer
  }

  init();

  // Ajouter les animations CSS
  if (!document.querySelector('#easter-animations')) {
    const style = document.createElement('style');
    style.id = 'easter-animations';
    style.textContent = `
      @keyframes slideInUp {
        from {
          transform: translateY(100px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      @keyframes slideOutDown {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(100px);
          opacity: 0;
        }
      }
      @keyframes confettiFall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

})();
