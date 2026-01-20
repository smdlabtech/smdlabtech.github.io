/**
 * Polish & Refinements JavaScript
 * Optimisations subtiles et ajustements fins
 */

(function() {
  'use strict';

  // ============================================
  // Performance Optimizations
  // ============================================
  
  // Debounce amélioré avec options
  function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  // Throttle pour scroll
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ============================================
  // Intersection Observer Optimisé
  // ============================================
  function initOptimizedIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'animated');
          // Unobserve après animation pour performance
          if (entry.target.dataset.observeOnce !== 'false') {
            observer.unobserve(entry.target);
          }
        }
      });
    }, options);

    // Observer seulement les éléments nécessaires
    document.querySelectorAll('.animate-on-scroll, .reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // Lazy Loading Images Amélioré
  // ============================================
  function initImprovedLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Support natif
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
      });
    } else if ('IntersectionObserver' in window) {
      // Fallback avec Intersection Observer
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // Smooth Scroll Polyfill pour Safari
  // ============================================
  function initSmoothScrollPolyfill() {
    if (!('scrollBehavior' in document.documentElement.style)) {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href === '#' || href === '') return;
          
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            // Polyfill smooth scroll
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 500;
            let start = null;

            function step(timestamp) {
              if (!start) start = timestamp;
              const progress = timestamp - start;
              const percentage = Math.min(progress / duration, 1);
              
              // Easing function
              const ease = percentage < 0.5
                ? 2 * percentage * percentage
                : 1 - Math.pow(-2 * percentage + 2, 2) / 2;
              
              window.scrollTo(0, startPosition + distance * ease);
              
              if (progress < duration) {
                requestAnimationFrame(step);
              }
            }
            
            requestAnimationFrame(step);
          }
        });
      });
    }
  }

  // ============================================
  // Preload Critical Resources
  // ============================================
  function preloadCriticalResources() {
    // Preload hero image si présente
    const heroImage = document.querySelector('.hero-section img, [style*="cover-img"]');
    if (heroImage) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = heroImage.src || heroImage.dataset.src;
      document.head.appendChild(link);
    }

    // Preload fonts critiques
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    // Ajouter les fonts critiques si nécessaire
  }

  // ============================================
  // Reduce Motion Detection
  // ============================================
  function handleReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      // Désactiver certaines animations
      document.querySelectorAll('.morphing-bg, .particles-container').forEach(el => {
        el.style.display = 'none';
      });
    }
  }

  // ============================================
  // Viewport Height Fix (Mobile)
  // ============================================
  function fixViewportHeight() {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', debounce(setVH, 100));
    window.addEventListener('orientationchange', setVH);
  }

  // ============================================
  // Touch Action Optimization
  // ============================================
  function optimizeTouchActions() {
    // Améliorer le scroll sur mobile
    document.body.style.touchAction = 'pan-y';
    
    // Désactiver le double-tap zoom sur les boutons
    document.querySelectorAll('.btn, .nav-link').forEach(el => {
      el.style.touchAction = 'manipulation';
    });
  }

  // ============================================
  // Font Loading Optimization
  // ============================================
  function optimizeFontLoading() {
    if ('fonts' in document) {
      // Vérifier si les fonts sont chargées
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }
  }

  // ============================================
  // Content Visibility Optimization
  // ============================================
  function optimizeContentVisibility() {
    const posts = document.querySelectorAll('.post-preview');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.contentVisibility = 'visible';
        } else {
          entry.target.style.contentVisibility = 'auto';
        }
      });
    }, {
      rootMargin: '200px'
    });

    posts.forEach(post => {
      observer.observe(post);
    });
  }

  // ============================================
  // Memory Leak Prevention
  // ============================================
  function preventMemoryLeaks() {
    // Nettoyer les event listeners au unload
    window.addEventListener('beforeunload', () => {
      // Nettoyer les observers
      // Les observers se nettoient automatiquement, mais on peut forcer
      document.querySelectorAll('*').forEach(el => {
        if (el._observer) {
          el._observer.disconnect();
        }
      });
    });
  }

  // ============================================
  // Error Handling Amélioré
  // ============================================
  function initErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Error:', e.error);
      // Ne pas bloquer l'UI en cas d'erreur
    }, true);

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      e.preventDefault();
    });
  }

  // ============================================
  // Network Status Detection
  // ============================================
  function initNetworkStatus() {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        const updateConnectionStatus = () => {
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.documentElement.classList.add('slow-connection');
            // Désactiver certaines fonctionnalités lourdes
            document.querySelectorAll('.morphing-bg, .particles-container').forEach(el => {
              el.style.display = 'none';
            });
          }
        };
        
        connection.addEventListener('change', updateConnectionStatus);
        updateConnectionStatus();
      }
    }
  }

  // ============================================
  // Battery API (si disponible)
  // ============================================
  function optimizeForBattery() {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        if (battery.level < 0.2 && !battery.charging) {
          // Mode économie d'énergie
          document.documentElement.classList.add('low-battery');
          // Réduire les animations
          document.querySelectorAll('.morphing-bg, .particles-container').forEach(el => {
            el.style.display = 'none';
          });
        }
      });
    }
  }

  // ============================================
  // Passive Event Listeners
  // ============================================
  function usePassiveListeners() {
    // Les event listeners passifs sont déjà utilisés dans le code
    // Cette fonction sert de rappel pour les futurs ajouts
    const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
    
    passiveEvents.forEach(eventType => {
      // S'assurer que tous les listeners sont passifs
      const originalAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (passiveEvents.includes(type) && !options) {
          options = { passive: true };
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
    });
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Optimisations de performance
    initOptimizedIntersectionObserver();
    initImprovedLazyLoading();
    initSmoothScrollPolyfill();
    preloadCriticalResources();
    handleReducedMotion();
    fixViewportHeight();
    optimizeTouchActions();
    optimizeFontLoading();
    optimizeContentVisibility();
    preventMemoryLeaks();
    initErrorHandling();
    initNetworkStatus();
    optimizeForBattery();
  }

  init();

})();
