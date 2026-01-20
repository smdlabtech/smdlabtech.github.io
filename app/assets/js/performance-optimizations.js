/**
 * Optimisations de Performance JavaScript
 * Optimisations pour améliorer les performances de l'application
 */

(function() {
  'use strict';

  // ============================================
  // Debounce Function
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
  // Throttle Function
  // ============================================
  
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
  // Lazy Loading Images
  // ============================================
  
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            }
            observer.unobserve(img);
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
  // Preload Critical Resources
  // ============================================
  
  function preloadCriticalResources() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('img[data-preload]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.dataset.preload;
      document.head.appendChild(link);
    });
  }

  // ============================================
  // Optimized Scroll Handler
  // ============================================
  
  function initOptimizedScroll() {
    let ticking = false;
    
    const handleScroll = () => {
      // Scroll logic here
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Update scroll-dependent elements
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
  }

  // ============================================
  // Optimized Resize Handler
  // ============================================
  
  function initOptimizedResize() {
    const handleResize = debounce(() => {
      // Resize logic here
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('optimizedResize'));
    }, 250);
    
    window.addEventListener('resize', handleResize, { passive: true });
  }

  // ============================================
  // Resource Hints
  // ============================================
  
  function addResourceHints() {
    // DNS prefetch pour les domaines externes
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://cdn.jsdelivr.net',
      'https://cdnjs.cloudflare.com'
    ];
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // ============================================
  // Service Worker Registration
  // ============================================
  
  function registerServiceWorker() {
    // Désactivé pour éviter les erreurs 404
    // Le service worker peut être activé plus tard si nécessaire
    /*
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
          })
          .catch(error => {
            console.log('Service Worker registration failed:', error);
          });
      });
    }
    */
  }

  // ============================================
  // Performance Monitoring
  // ============================================
  
  function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          if (window.location.hostname === 'localhost') {
            console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Browser doesn't support LCP
      }

      // Monitor First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (window.location.hostname === 'localhost') {
              console.log('FID:', entry.processingStart - entry.startTime);
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Browser doesn't support FID
      }

      // Monitor Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach(entry => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          if (window.location.hostname === 'localhost' && clsValue > 0) {
            console.log('CLS:', clsValue);
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Browser doesn't support CLS
      }
    }
  }

  // ============================================
  // Code Splitting Helper
  // ============================================
  
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // ============================================
  // Memory Management
  // ============================================
  
  function cleanupEventListeners() {
    // Cleanup function for event listeners
    // To be called when components are removed
  }

  // ============================================
  // Initialize All
  // ============================================
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initLazyLoading();
    preloadCriticalResources();
    initOptimizedScroll();
    initOptimizedResize();
    addResourceHints();
    
    // Service Worker désactivé pour éviter les erreurs 404
    // registerServiceWorker();
    
    // Only in development
    if (window.location.hostname === 'localhost') {
      initPerformanceMonitoring();
    }
  }

  // Start initialization
  init();

  // Export utilities
  window.PerformanceUtils = {
    debounce,
    throttle,
    loadScript
  };

})();
