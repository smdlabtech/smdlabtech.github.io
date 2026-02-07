/**
 * Platform Improvements JavaScript
 * Fonctionnalités interactives supplémentaires
 */

(function() {
  'use strict';

  // ============================================
  // Lazy Loading Images
  // ============================================
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for older browsers
      images.forEach(img => {
        img.classList.add('loaded');
      });
    }
  }

  // ============================================
  // Scroll Animations
  // ============================================
  function initScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elements.forEach(el => observer.observe(el));
    } else {
      // Fallback
      elements.forEach(el => el.classList.add('visible'));
    }
  }

  // ============================================
  // Smooth Page Load
  // ============================================
  function initSmoothPageLoad() {
    if (document.readyState === 'loading') {
      document.body.classList.add('loading');
      window.addEventListener('load', function() {
        document.body.classList.remove('loading');
      });
    }
  }

  // ============================================
  // Enhanced Tooltips
  // ============================================
  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        // Tooltip is handled by CSS
      });
    });
  }

  // ============================================
  // Keyboard Navigation Enhancement
  // ============================================
  function initKeyboardNavigation() {
    // Skip to content link
    const skipLink = document.querySelector('.skip-to-content');
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

    // Enhanced keyboard navigation for custom elements
    document.addEventListener('keydown', function(e) {
      // Escape key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show, .search-modal.active');
        modals.forEach(modal => {
          modal.classList.remove('show', 'active');
        });
      }

      // Arrow keys for language switcher
      if (e.target.closest('.language-switcher')) {
        const buttons = Array.from(e.target.closest('.language-switcher').querySelectorAll('button'));
        const currentIndex = buttons.indexOf(e.target);

        if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
          e.preventDefault();
          buttons[currentIndex + 1].focus();
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          e.preventDefault();
          buttons[currentIndex - 1].focus();
        }
      }
    });
  }

  // ============================================
  // Performance Monitoring
  // ============================================
  function initPerformanceMonitoring() {
    if ('PerformanceObserver' in window) {
      try {
        const perfObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
              console.log('LCP:', entry.renderTime || entry.loadTime);
            }
          }
        });
        perfObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // PerformanceObserver not supported
      }
    }
  }

  // ============================================
  // Error Handling
  // ============================================
  function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
      console.error('Global error:', e.error);
      // You can send this to an error tracking service
    });

    // Unhandled promise rejection
    window.addEventListener('unhandledrejection', function(e) {
      console.error('Unhandled promise rejection:', e.reason);
      // You can send this to an error tracking service
    });
  }

  // ============================================
  // Image Error Handling
  // ============================================
  function initImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      img.addEventListener('error', function() {
        this.src = '/assets/img/placeholder.png';
        this.alt = 'Image non disponible';
        this.classList.add('image-error');
      });
    });
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    initLazyLoading();
    initScrollAnimations();
    initSmoothPageLoad();
    initTooltips();
    initKeyboardNavigation();
    initPerformanceMonitoring();
    initErrorHandling();
    initImageErrorHandling();
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
