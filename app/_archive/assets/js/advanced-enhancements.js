/**
 * Advanced Enhancements JavaScript
 * Améliorations JavaScript avancées pour une expérience utilisateur exceptionnelle
 */

(function() {
  'use strict';

  // ============================================
  // Scroll Animations avec Intersection Observer
  // ============================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.fade-in-up, .fade-in-left, .fade-in-right, .scale-in'
    );

    if (animatedElements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // ============================================
  // Enhanced Tooltips
  // ============================================

  function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', function() {
        // Tooltip est géré par CSS, mais on peut ajouter des fonctionnalités supplémentaires
        this.setAttribute('aria-label', this.getAttribute('data-tooltip'));
      });
    });
  }

  // ============================================
  // Enhanced Form Validation
  // ============================================

  function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[type="email"], input[type="text"], textarea');

      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          validateInput(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('error')) {
            validateInput(this);
          }
        });
      });

      form.addEventListener('submit', function(e) {
        let isValid = true;
        inputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
        }
      });
    });
  }

  function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';

    // Remove previous error
    input.classList.remove('error');
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Validation rules
    if (input.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Ce champ est requis';
    } else if (type === 'email' && value && !isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Veuillez entrer une adresse email valide';
    }

    // Display error
    if (!isValid) {
      input.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = errorMessage;
      errorDiv.style.cssText = 'color: var(--db-primary); font-size: 0.8125rem; margin-top: 0.25rem;';
      input.parentElement.appendChild(errorDiv);
    }

    return isValid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ============================================
  // Enhanced Image Loading
  // ============================================

  function initImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

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
      });

      images.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // Enhanced Table Interactions
  // ============================================

  function initTableEnhancements() {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
      // Add responsive wrapper if not exists
      if (!table.parentElement.classList.contains('table-responsive')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-responsive';
        wrapper.style.cssText = 'overflow-x: auto; -webkit-overflow-scrolling: touch;';
        table.parentElement.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }

      // Add row highlight on hover
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach(row => {
        row.addEventListener('mouseenter', function() {
          this.style.transition = 'background 0.2s ease';
        });
      });
    });
  }

  // ============================================
  // Enhanced Copy to Clipboard
  // ============================================

  function initCopyToClipboard() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      if (pre.querySelector('.copy-button')) return; // Already has button

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>';
      copyButton.setAttribute('aria-label', 'Copier le code');
      copyButton.style.cssText = `
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem;
        background: var(--db-bg-secondary);
        border: 1px solid var(--db-border);
        border-radius: 6px;
        color: var(--db-text);
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 10;
      `;

      copyButton.addEventListener('mouseenter', function() {
        this.style.background = 'var(--db-primary)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--db-primary)';
      });

      copyButton.addEventListener('mouseleave', function() {
        this.style.background = 'var(--db-bg-secondary)';
        this.style.color = 'var(--db-text)';
        this.style.borderColor = 'var(--db-border)';
      });

      copyButton.addEventListener('click', async function() {
        const text = codeBlock.textContent;
        try {
          await navigator.clipboard.writeText(text);
          copyButton.innerHTML = '<i class="fas fa-check"></i>';
          copyButton.style.background = 'var(--db-primary)';
          copyButton.style.color = 'white';
          setTimeout(() => {
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.style.background = 'var(--db-bg-secondary)';
            copyButton.style.color = 'var(--db-text)';
          }, 2000);
        } catch (err) {
          console.error('Erreur lors de la copie:', err);
        }
      });

      if (pre.style.position !== 'relative') {
        pre.style.position = 'relative';
      }
      pre.appendChild(copyButton);
    });
  }

  // ============================================
  // Enhanced Keyboard Navigation
  // ============================================

  function initKeyboardNavigation() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-to-main');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const main = document.querySelector('main') || document.querySelector('.main-content');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
          main.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Enhanced arrow key navigation for cards
    const cardGrids = document.querySelectorAll('.blog-grid-databird, .topics-grid, .categories-grid');
    cardGrids.forEach(grid => {
      const cards = grid.querySelectorAll('a, button');
      cards.forEach((card, index) => {
        card.addEventListener('keydown', function(e) {
          let nextIndex;
          switch(e.key) {
            case 'ArrowRight':
              nextIndex = (index + 1) % cards.length;
              cards[nextIndex].focus();
              e.preventDefault();
              break;
            case 'ArrowLeft':
              nextIndex = (index - 1 + cards.length) % cards.length;
              cards[nextIndex].focus();
              e.preventDefault();
              break;
            case 'ArrowDown':
              const cols = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
              nextIndex = Math.min(index + cols, cards.length - 1);
              cards[nextIndex].focus();
              e.preventDefault();
              break;
            case 'ArrowUp':
              const colsUp = getComputedStyle(grid).gridTemplateColumns.split(' ').length;
              nextIndex = Math.max(index - colsUp, 0);
              cards[nextIndex].focus();
              e.preventDefault();
              break;
          }
        });
      });
    });
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
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
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
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Browser doesn't support FID
      }
    }
  }

  // ============================================
  // Error Handling
  // ============================================

  function initErrorHandling() {
    // Global error handler
    window.addEventListener('error', function(e) {
      console.error('Erreur JavaScript:', e.error);
      // Vous pouvez envoyer l'erreur à un service de monitoring ici
    });

    // Image error handling
    document.addEventListener('error', function(e) {
      if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
          width: 100%;
          height: 200px;
          background: var(--db-bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--db-text-muted);
          border-radius: 8px;
        `;
        placeholder.textContent = 'Image non disponible';
        e.target.parentElement.insertBefore(placeholder, e.target);
      }
    }, true);
  }

  // ============================================
  // Initialize All Enhancements
  // ============================================

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initScrollAnimations();
    initTooltips();
    initFormValidation();
    initImageLoading();
    initTableEnhancements();
    initCopyToClipboard();
    initKeyboardNavigation();

    // Performance monitoring only in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      initPerformanceMonitoring();
    }

    initErrorHandling();
  }

  // Start initialization
  init();

  // Re-initialize on dynamic content load
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          initScrollAnimations();
          initTooltips();
          initImageLoading();
          initTableEnhancements();
          initCopyToClipboard();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

})();
