/**
 * Advanced Improvements JavaScript
 * Améliorations JavaScript avancées
 */

(function() {
  'use strict';

  // Initialize improvements
  function init() {
    initSmoothScroll();
    initLazyLoading();
    initImageOptimization();
    initFormEnhancements();
    initAccessibility();
    initPerformance();
    initAnalytics();
  }

  // Smooth scroll with offset
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 100;
          const navbar = document.querySelector('.navbar-databird');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Enhanced lazy loading
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }

            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Image optimization
  function initImageOptimization() {
    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
          background: linear-gradient(135deg, var(--db-primary) 0%, var(--db-secondary) 100%);
          aspect-ratio: 16/9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          border-radius: 12px;
        `;
        placeholder.textContent = 'Image non disponible';
        this.parentNode.insertBefore(placeholder, this);
      });
    });
  }

  // Form enhancements
  function initFormEnhancements() {
    // Auto-resize textareas
    document.querySelectorAll('textarea').forEach(textarea => {
      textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
      });
    });

    // Enhanced form validation
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function(e) {
        if (!this.checkValidity()) {
          e.preventDefault();
          e.stopPropagation();

          // Focus first invalid field
          const firstInvalid = this.querySelector(':invalid');
          if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }

        this.classList.add('was-validated');
      }, false);
    });
  }

  // Accessibility enhancements
  function initAccessibility() {
    // Skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.setAttribute('aria-label', 'Aller au contenu principal');
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard navigation for custom components
    document.querySelectorAll('[role="button"]').forEach(button => {
      if (!button.hasAttribute('tabindex')) {
        button.setAttribute('tabindex', '0');
      }

      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // Announce dynamic content changes
    if (!document.querySelector('[role="status"]')) {
      const announcer = document.createElement('div');
      announcer.setAttribute('role', 'status');
      announcer.setAttribute('aria-live', 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
  }

  // Performance optimizations
  function initPerformance() {
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
      // Scroll-based logic
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Optimize resize events
    const handleResize = debounce(() => {
      // Resize-based logic
    }, 250);

    window.addEventListener('resize', handleResize, { passive: true });

    // Preload critical resources
    const criticalLinks = document.querySelectorAll('a[href^="/"]');
    criticalLinks.forEach(link => {
      link.addEventListener('mouseenter', function() {
        const href = this.getAttribute('href');
        if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
        }
      }, { once: true });
    });

    // Export utilities
    window.debounce = debounce;
    window.throttle = throttle;
  }

  // Analytics enhancements
  function initAnalytics() {
    // Track page views
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: window.location.pathname,
        page_title: document.title,
        page_language: document.documentElement.lang || 'fr'
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

    // Track form submissions
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            'event_category': 'engagement',
            'event_label': this.id || this.className
          });
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.advancedImprovements = {
    init,
    debounce: window.debounce,
    throttle: window.throttle
  };

})();
