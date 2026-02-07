/**
 * Modern Enhancements JavaScript
 * Améliorations modernes pour l'application Jekyll
 */

(function() {
  'use strict';

  // ============================================
  // Dark Mode avec Persistance
  // ============================================
  function initDarkMode() {
    const themeToggle = document.getElementById('toggle-dark');
    const body = document.body;

    // Détecter la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Appliquer le thème
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);

    // Toggle au clic
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }

    // Écouter les changements système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  function applyTheme(theme) {
    const body = document.body;
    body.setAttribute('data-theme', theme);
    body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);

    // Mettre à jour l'icône
    const themeToggle = document.getElementById('toggle-dark');
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    }
  }

  // ============================================
  // Lazy Loading Images avec Intersection Observer
  // ============================================
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observer toutes les images avec data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback pour navigateurs sans Intersection Observer
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }

  // ============================================
  // Animations au Scroll
  // ============================================
  function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
      });
    }
  }

  // ============================================
  // Navigation Sticky avec Blur
  // ============================================
  function initStickyNav() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // Smooth Scroll
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ============================================
  // Amélioration des Cartes d'Articles
  // ============================================
  function enhancePostCards() {
    const postCards = document.querySelectorAll('.post-preview');

    postCards.forEach(card => {
      // Ajouter animation au scroll
      card.classList.add('animate-on-scroll');

      // Améliorer les liens
      const links = card.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('focus', () => {
          card.style.outline = '2px solid var(--color-link)';
          card.style.outlineOffset = '4px';
        });

        link.addEventListener('blur', () => {
          card.style.outline = '';
          card.style.outlineOffset = '';
        });
      });
    });
  }

  // ============================================
  // Amélioration de la Recherche
  // ============================================
  function enhanceSearch() {
    const searchLink = document.getElementById('nav-search-link');
    const searchModal = document.querySelector('.search-modal');

    if (searchLink && searchModal) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        const searchInput = searchModal.querySelector('input[type="search"]');
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 100);
        }
      });
    }
  }

  // ============================================
  // Performance: Debounce pour les événements
  // ============================================
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
  // Initialisation
  // ============================================
  function init() {
    // Attendre que le DOM soit prêt
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialiser toutes les fonctionnalités
    initDarkMode();
    initLazyLoading();
    initScrollAnimations();
    initStickyNav();
    initSmoothScroll();
    enhancePostCards();
    enhanceSearch();

    // Ajouter une classe au body pour indiquer que JS est actif
    document.body.classList.add('js-enabled');
  }

  // Démarrer
  init();

})();
