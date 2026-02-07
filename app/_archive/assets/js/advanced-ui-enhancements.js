/**
 * Améliorations UI Avancées JavaScript
 * Fonctionnalités JavaScript pour les améliorations UI avancées
 */

(function() {
  'use strict';

  // ============================================
  // Toast Notifications
  // ============================================

  function createToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message, type = 'info', title = null, duration = 5000) {
    const container = createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(toast);

    // Close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      removeToast(toast);
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        removeToast(toast);
      }, duration);
    }

    return toast;
  }

  function removeToast(toast) {
    toast.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }

  // ============================================
  // Modal System
  // ============================================

  function createModal(title, content, footer = null) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="modal-close" aria-label="Fermer">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close handlers
    const closeBtn = modal.querySelector('.modal-close');
    const closeModal = () => {
      overlay.style.animation = 'fadeIn 0.3s ease-out reverse';
      modal.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => {
        if (overlay.parentElement) {
          overlay.parentElement.removeChild(overlay);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal();
      }
    });

    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    return { overlay, modal, close: closeModal };
  }

  // ============================================
  // Dropdown System
  // ============================================

  function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');

        // Close all dropdowns
        document.querySelectorAll('.dropdown.open').forEach(d => {
          d.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
          dropdown.classList.add('open');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.open').forEach(d => {
          d.classList.remove('open');
        });
      }
    });
  }

  // ============================================
  // Tabs System
  // ============================================

  function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.tab');
      const contents = container.querySelectorAll('.tab-content');

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Remove active from all
          tabs.forEach(t => t.classList.remove('active'));
          contents.forEach(c => c.classList.remove('active'));

          // Add active to clicked
          tab.classList.add('active');
          if (contents[index]) {
            contents[index].classList.add('active');
          }
        });
      });
    });
  }

  // ============================================
  // Accordion System
  // ============================================

  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
      const headers = accordion.querySelectorAll('.accordion-header');

      headers.forEach(header => {
        header.addEventListener('click', () => {
          const isActive = header.classList.contains('active');
          const content = header.nextElementSibling;

          // Close all in this accordion
          headers.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.classList.remove('active');
          });

          // Toggle clicked
          if (!isActive) {
            header.classList.add('active');
            content.classList.add('active');
          }
        });
      });
    });
  }

  // ============================================
  // Progress Bar
  // ============================================

  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');

    progressBars.forEach(bar => {
      const fill = bar.querySelector('.progress-bar-fill');
      if (!fill) return;

      const value = fill.getAttribute('data-value') || fill.style.width || '0';
      fill.style.width = value.includes('%') ? value : `${value}%`;
    });
  }

  // ============================================
  // Stagger Animation
  // ============================================

  function initStaggerAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');

    if (staggerContainers.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Exclure les cartes de blog (gérées séparément pour apparaître ensemble)
          const items = entry.target.querySelectorAll('.stagger-item:not(.blog-card-databird):not(.blog-card-databird-enhanced)');
          items.forEach(item => {
            item.classList.add('stagger-item');
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    staggerContainers.forEach(container => {
      observer.observe(container);
    });
  }

  // ============================================
  // Smooth Scroll
  // ============================================

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80; // Navbar height
          const targetPosition = target.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Copy to Clipboard
  // ============================================

  function initCopyToClipboard() {
    document.querySelectorAll('[data-copy]').forEach(element => {
      element.addEventListener('click', async function() {
        const text = this.getAttribute('data-copy') || this.textContent;
        try {
          await navigator.clipboard.writeText(text);
          showToast('Copié dans le presse-papiers !', 'success', null, 2000);
        } catch (err) {
          showToast('Erreur lors de la copie', 'error', null, 2000);
        }
      });
    });
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
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // Initialize All
  // ============================================

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initDropdowns();
    initTabs();
    initAccordions();
    initProgressBars();
    initStaggerAnimations();
    initSmoothScroll();
    initCopyToClipboard();
    initLazyLoading();
  }

  // Start initialization
  init();

  // Re-initialize on dynamic content
  if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
      initDropdowns();
      initTabs();
      initAccordions();
      initLazyLoading();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Export to window
  window.UIEnhancements = {
    showToast,
    createModal,
    initDropdowns,
    initTabs,
    initAccordions
  };

})();
