/**
 * Micro-interactions & Enhancements
 * Améliorations interactives subtiles
 */

(function() {
  'use strict';

  // Image Loading
  function initImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', function() {
            this.classList.add('loaded');
          });
        }
      });
    } else {
      // Fallback for browsers without native lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  // Scroll to Top Button
  function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-indicator';
    scrollButton.setAttribute('aria-label', 'Revenir en haut');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(scrollButton);

    let ticking = false;
    function updateScrollButton() {
      if (window.scrollY > 400) {
        scrollButton.classList.add('visible');
      } else {
        scrollButton.classList.remove('visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollButton);
        ticking = true;
      }
    }, { passive: true });
  }

  // Intersection Observer for Animations
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Keyboard Navigation Enhancement
  function initKeyboardNavigation() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Aller au contenu principal';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--db-primary);
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      z-index: 10000;
      border-radius: 0 0 4px 0;
    `;
    skipLink.addEventListener('focus', function() {
      this.style.top = '0';
    });
    skipLink.addEventListener('blur', function() {
      this.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Ensure main has id
    const main = document.querySelector('main');
    if (main && !main.id) {
      main.id = 'main-content';
    }
  }

  // Performance: Passive Event Listeners
  function optimizeEventListeners() {
    // All scroll events should be passive
    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach(el => {
      el.addEventListener('scroll', () => {}, { passive: true });
    });
  }

  // Link External Indicator
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        if (!link.querySelector('i.fa-external-link-alt')) {
          const icon = document.createElement('i');
          icon.className = 'fas fa-external-link-alt';
          icon.style.cssText = 'margin-left: 0.25rem; font-size: 0.75em; opacity: 0.6;';
          link.appendChild(icon);
        }
      }
    });
  }

  // Copy to Clipboard Enhancement
  function initCopyButtons() {
    document.addEventListener('click', function(e) {
      if (e.target.closest('.copy-btn, .copy-code-btn')) {
        const button = e.target.closest('.copy-btn, .copy-code-btn');
        const text = button.dataset.copy || button.closest('pre')?.querySelector('code')?.textContent;

        if (text && navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = 'var(--db-primary)';
            setTimeout(() => {
              button.innerHTML = originalHTML;
              button.style.color = '';
            }, 2000);
          });
        }
      }
    });
  }

  // Toast Notification System
  function showToast(message, type = 'info', title = '') {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-notification-${type}`;

    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle'
    };

    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info} toast-notification-icon"></i>
      <div class="toast-notification-content">
        ${title ? `<div class="toast-notification-title">${title}</div>` : ''}
        <div class="toast-notification-message">${message}</div>
      </div>
      <button class="toast-notification-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(toast);

    // Trigger show animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Close button
    toast.querySelector('.toast-notification-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // Make toast function globally available
  window.showToast = showToast;

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initImageLoading();
        initScrollToTop();
        initScrollAnimations();
        initKeyboardNavigation();
        optimizeEventListeners();
        initExternalLinks();
        initCopyButtons();
      });
    } else {
      initImageLoading();
      initScrollToTop();
      initScrollAnimations();
      initKeyboardNavigation();
      optimizeEventListeners();
      initExternalLinks();
      initCopyButtons();
    }
  }

  init();

})();
