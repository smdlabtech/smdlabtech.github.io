/**
 * Refinements Ultimes JavaScript
 * Fonctionnalités finales pour une expérience parfaite
 */

(function() {
  'use strict';

  // ============================================
  // Back to Top Enhanced
  // ============================================

  function initBackToTop() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top-enhanced';
    backToTop.setAttribute('aria-label', 'Retour en haut');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    function toggleBackToTop() {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(toggleBackToTop, 100), { passive: true });
    toggleBackToTop();

    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Scroll Indicator
  // ============================================

  function initScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.innerHTML = `
      <span class="scroll-indicator-text">Défiler</span>
      <i class="fas fa-chevron-down scroll-indicator-icon"></i>
    `;
    document.body.appendChild(indicator);

    function toggleIndicator() {
      if (window.pageYOffset < 100) {
        indicator.classList.add('visible');
      } else {
        indicator.classList.remove('visible');
      }
    }

    window.addEventListener('scroll', throttle(toggleIndicator, 100), { passive: true });
    toggleIndicator();

    indicator.addEventListener('click', () => {
      window.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }

  // ============================================
  // Content Reveal on Scroll
  // ============================================

  function initContentReveal() {
    const elements = document.querySelectorAll('.content-reveal');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
      observer.observe(element);
    });
  }

  // ============================================
  // Page Transition
  // ============================================

  function initPageTransition() {
    document.body.classList.add('page-transition');

    // Remove transition class after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.remove('page-transition');
      }, 500);
    });
  }

  // ============================================
  // Loading Overlay
  // ============================================

  function showLoadingOverlay(message = 'Chargement...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
      <div class="loading-overlay-content">
        <div class="spinner"></div>
        <p style="margin-top: 1rem; color: var(--ds-text);">${message}</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Activate
    setTimeout(() => {
      overlay.classList.add('active');
    }, 10);

    return {
      hide: () => {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (overlay.parentElement) {
            overlay.parentElement.removeChild(overlay);
          }
        }, 300);
      }
    };
  }

  // ============================================
  // Notification System
  // ============================================

  function showNotification(title, message, type = 'info', duration = 5000) {
    const container = document.querySelector('.notification-container') || createNotificationContainer();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    const icons = {
      success: '<i class="fas fa-check-circle"></i>',
      error: '<i class="fas fa-exclamation-circle"></i>',
      warning: '<i class="fas fa-exclamation-triangle"></i>',
      info: '<i class="fas fa-info-circle"></i>'
    };

    notification.innerHTML = `
      <div class="notification-icon">${icons[type] || icons.info}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
    `;

    container.appendChild(notification);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      removeNotification(notification);
    });

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    }

    return notification;
  }

  function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
  }

  function removeNotification(notification) {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 300);
  }

  // ============================================
  // Error Boundary
  // ============================================

  function showErrorBoundary(message, onRetry = null) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-boundary';
    errorDiv.innerHTML = `
      <div class="error-boundary-title">Une erreur est survenue</div>
      <div class="error-boundary-message">${message}</div>
      ${onRetry ? '<button class="error-boundary-button">Réessayer</button>' : ''}
    `;

    if (onRetry) {
      const retryBtn = errorDiv.querySelector('.error-boundary-button');
      retryBtn.addEventListener('click', onRetry);
    }

    return errorDiv;
  }

  // ============================================
  // Success Message
  // ============================================

  function showSuccessMessage(title, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message-enhanced';
    successDiv.innerHTML = `
      <div class="success-message-enhanced-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div class="success-message-enhanced-content">
        <div class="success-message-enhanced-title">${title}</div>
        <div class="success-message-enhanced-text">${message}</div>
      </div>
    `;

    return successDiv;
  }

  // ============================================
  // Throttle Helper
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
  // Initialize All
  // ============================================

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initBackToTop();
    initScrollIndicator();
    initContentReveal();
    initPageTransition();
  }

  // Start initialization
  init();

  // Export API
  window.UltimateRefinements = {
    showLoadingOverlay,
    showNotification,
    showErrorBoundary,
    showSuccessMessage
  };

})();
