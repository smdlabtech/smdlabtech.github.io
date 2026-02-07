/**
 * Landing Page Refinements JavaScript
 * Améliorations supplémentaires et optimisations
 */

(function() {
  'use strict';

  // Initialize refinements
  function init() {
    initPerformanceOptimizations();
    initAccessibilityEnhancements();
    initErrorHandling();
    initAnalytics();
    initProgressiveEnhancement();
  }

  // Performance optimizations
  function initPerformanceOptimizations() {
    // Debounce function
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

    // Throttle function
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

    // Optimize scroll events
    const handleScroll = throttle(() => {
      // Scroll-based logic here
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimize resize events
    const handleResize = debounce(() => {
      // Resize-based logic here
    }, 250);

    window.addEventListener('resize', handleResize, { passive: true });

    // Export utilities
    window.debounce = debounce;
    window.throttle = throttle;
  }

  // Accessibility enhancements
  function initAccessibilityEnhancements() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Keyboard navigation for custom components
    document.querySelectorAll('[role="tab"]').forEach(tab => {
      tab.addEventListener('keydown', function(e) {
        const tabs = Array.from(this.parentElement.querySelectorAll('[role="tab"]'));
        const currentIndex = tabs.indexOf(this);

        let nextIndex;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== undefined) {
          e.preventDefault();
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        }
      });
    });

    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
      announcer.textContent = message;
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  }

  // Error handling
  function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
      console.error('Global error:', e.error);
      // You can send to error tracking service here
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
      console.error('Unhandled promise rejection:', e.reason);
      // You can send to error tracking service here
    });

    // Network error handling
    window.addEventListener('online', function() {
      window.announceToScreenReader?.('Connexion rétablie');
    });

    window.addEventListener('offline', function() {
      window.announceToScreenReader?.('Connexion perdue');
    });
  }

  // Analytics
  function initAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: window.location.pathname,
        page_title: document.title
      });
    }

    // Track outbound links
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', function() {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
              'event_category': 'outbound',
              'event_label': this.href,
              'transport_type': 'beacon'
            });
          }
        });
      }
    });

    // Track file downloads
    document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".zip"]').forEach(link => {
      link.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'file_download', {
            'event_category': 'downloads',
            'event_label': this.href.split('/').pop()
          });
        }
      });
    });
  }

  // Progressive enhancement
  function initProgressiveEnhancement() {
    // Check for feature support
    const supports = {
      intersectionObserver: 'IntersectionObserver' in window,
      fetch: 'fetch' in window,
      localStorage: 'localStorage' in window,
      serviceWorker: 'serviceWorker' in navigator
    };

    // Add feature classes to body
    Object.keys(supports).forEach(feature => {
      if (supports[feature]) {
        document.body.classList.add(`supports-${feature}`);
      } else {
        document.body.classList.add(`no-${feature}`);
      }
    });

    // Lazy load images with Intersection Observer
    if (supports.intersectionObserver) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.landingRefinements = {
    init,
    announceToScreenReader: window.announceToScreenReader
  };

})();
