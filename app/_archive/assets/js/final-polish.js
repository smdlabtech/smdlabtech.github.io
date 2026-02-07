/**
 * Final Polish JavaScript
 * Finitions finales interactives
 */

(function() {
  'use strict';

  // Smooth Page Load
  function initSmoothPageLoad() {
    if (document.readyState === 'loading') {
      document.body.style.opacity = '0';
      window.addEventListener('load', () => {
        document.body.style.transition = 'opacity 0.4s ease';
        document.body.style.opacity = '1';
      });
    }
  }

  // Enhanced Link Tracking
  function initLinkTracking() {
    const links = document.querySelectorAll('a[href^="http"]');

    links.forEach(link => {
      link.addEventListener('click', function() {
        const url = this.getAttribute('href');
        const linkKey = `link_${url}`;
        const clicks = parseInt(localStorage.getItem(linkKey) || '0', 10) + 1;
        localStorage.setItem(linkKey, clicks.toString());
      });
    });
  }

  // Image Error Handling
  function initImageErrorHandling() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #E31E24 0%, #1E40AF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 3rem;
        `;
        placeholder.innerHTML = '<i class="fas fa-image"></i>';
        this.parentNode.insertBefore(placeholder, this);
      });
    });
  }

  // Performance Monitoring
  function initPerformanceMonitoring() {
    if ('performance' in window && 'PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
              console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart, 'ms');
            }
          }
        });
        observer.observe({ entryTypes: ['navigation'] });
      } catch (e) {
        // Performance Observer not supported
      }
    }
  }

  // Intersection Observer for All Cards
  function initUniversalIntersectionObserver() {
    const cards = document.querySelectorAll(
      '.blog-card-databird, .featured-post-card, .topic-card-enhanced, .category-card, .project-card, .testimonial-card'
    );

    if (cards.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 30);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }

  // Debounce Utility
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

  // Throttle Utility
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

  // Scroll Performance Optimization
  function initScrollOptimization() {
    let ticking = false;

    const handleScroll = throttle(() => {
      // Scroll-based features here
      ticking = false;
    }, 16);

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });
  }

  // Lazy Load Images with Intersection Observer
  function initAdvancedLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if (images.length === 0) return;

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
      rootMargin: '50px'
    });

    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        imageObserver.observe(img);
      }
    });
  }

  // Keyboard Shortcuts
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('#blog-search, .search-bar-databird input');
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal.show, .modal.active');
        modals.forEach(modal => {
          modal.classList.remove('show', 'active');
        });
      }
    });
  }

  // Console Welcome Message
  function initConsoleMessage() {
    if (console && console.log) {
      const style = 'color: #E31E24; font-size: 20px; font-weight: bold;';
      console.log('%c✨ Bienvenue sur la plateforme DataBird ! ✨', style);
      console.log('%cDéveloppé avec passion pour la Data Science et l\'IA', 'color: #1E40AF; font-size: 14px;');
    }
  }

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initSmoothPageLoad();
        initLinkTracking();
        initImageErrorHandling();
        initPerformanceMonitoring();
        initUniversalIntersectionObserver();
        initScrollOptimization();
        initAdvancedLazyLoad();
        initKeyboardShortcuts();
        initConsoleMessage();
      });
    } else {
      initSmoothPageLoad();
      initLinkTracking();
      initImageErrorHandling();
      initPerformanceMonitoring();
      initUniversalIntersectionObserver();
      initScrollOptimization();
      initAdvancedLazyLoad();
      initKeyboardShortcuts();
      initConsoleMessage();
    }
  }

  init();

  // Export utilities
  window.debounce = debounce;
  window.throttle = throttle;

})();
