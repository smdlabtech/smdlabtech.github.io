/**
 * Anomalies & Inconsistencies JavaScript Fixes
 * Correction des anomalies JavaScript
 */

(function() {
  'use strict';

  // Initialize fixes
  function init() {
    fixDuplicateEventListeners();
    fixMissingErrorHandling();
    fixAccessibilityIssues();
    fixPerformanceIssues();
    validateHTMLStructure();
  }

  // Fix duplicate event listeners
  function fixDuplicateEventListeners() {
    // Remove potential duplicate listeners
    const filterTags = document.querySelectorAll('.filter-tag');

    filterTags.forEach(tag => {
      // Clone node to remove all event listeners
      const newTag = tag.cloneNode(true);
      tag.parentNode.replaceChild(newTag, tag);
    });

    // Re-attach listeners through landing-sync.js
    if (window.landingSync && typeof window.landingSync.init === 'function') {
      window.landingSync.init();
    }
  }

  // Fix missing error handling
  function fixMissingErrorHandling() {
    // Wrap all async operations in try-catch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return originalFetch.apply(this, args)
        .catch(error => {
          console.error('Fetch error:', error);
          return Promise.reject(error);
        });
    };

    // Add error handling to all event listeners
    const addEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      const wrappedListener = function(...args) {
        try {
          return listener.apply(this, args);
        } catch (error) {
          console.error(`Error in ${type} listener:`, error);
          if (window.announceToScreenReader) {
            window.announceToScreenReader('Une erreur est survenue');
          }
        }
      };
      return addEventListener.call(this, type, wrappedListener, options);
    };
  }

  // Fix accessibility issues
  function fixAccessibilityIssues() {
    // Ensure all interactive elements are keyboard accessible
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

    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
      console.warn('Image without alt text:', img.src);
      img.setAttribute('alt', '');
      img.style.border = '2px dashed #dc3545';
    });

    // Ensure all links have href
    document.querySelectorAll('a:not([href])').forEach(link => {
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });

    // Ensure all form inputs have labels
    document.querySelectorAll('input, textarea, select').forEach(input => {
      const id = input.id;
      if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
          console.warn('Input without label:', id);
        }
      } else if (input.hasAttribute('required')) {
        // Generate ID if missing
        const generatedId = `input-${Math.random().toString(36).substr(2, 9)}`;
        input.id = generatedId;
        const label = document.createElement('label');
        label.setAttribute('for', generatedId);
        label.className = 'sr-only';
        label.textContent = input.getAttribute('aria-label') || input.getAttribute('placeholder') || 'Champ requis';
        input.parentNode.insertBefore(label, input);
      }
    });
  }

  // Fix performance issues
  function fixPerformanceIssues() {
    // Debounce scroll events
    let scrollTimeout;
    const handleScroll = () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(() => {
        // Scroll handling logic
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Lazy load images that aren't already lazy
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src && !img.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
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
  }

  // Validate HTML structure
  function validateHTMLStructure() {
    // Check for missing main landmark
    if (!document.querySelector('main')) {
      console.warn('Missing <main> landmark');
    }

    // Check for multiple h1
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length > 1) {
      console.warn(`Multiple h1 elements found: ${h1Elements.length}`);
    }

    // Check for heading hierarchy
    let previousLevel = 0;
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      if (previousLevel > 0 && level > previousLevel + 1) {
        console.warn(`Heading hierarchy skip: ${previousLevel} -> ${level}`, heading);
      }
      previousLevel = level;
    });

    // Check for empty buttons
    document.querySelectorAll('button').forEach(button => {
      if (!button.textContent.trim() && !button.querySelector('i, img, svg')) {
        console.warn('Empty button found:', button);
        if (!button.getAttribute('aria-label')) {
          button.setAttribute('aria-label', 'Bouton');
        }
      }
    });

    // Check for empty links
    document.querySelectorAll('a').forEach(link => {
      if (!link.textContent.trim() && !link.querySelector('i, img, svg')) {
        if (!link.getAttribute('aria-label')) {
          console.warn('Empty link without aria-label:', link);
        }
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Small delay to ensure other scripts are loaded
    setTimeout(init, 100);
  }

  // Export for global access
  window.anomaliesFixes = {
    init,
    fixDuplicateEventListeners,
    fixAccessibilityIssues,
    validateHTMLStructure
  };

})();
