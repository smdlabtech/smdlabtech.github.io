/**
 * Sécurité Renforcée JavaScript
 * Fonctionnalités de sécurité pour la plateforme
 */

(function() {
  'use strict';

  // ============================================
  // Security Headers Check
  // ============================================

  function checkSecurityHeaders() {
    // Check if page is served over HTTPS
    const isSecure = window.location.protocol === 'https:';

    // Update security indicator
    const indicator = document.querySelector('.security-indicator') || createSecurityIndicator();
    if (!isSecure) {
      indicator.classList.add('insecure');
    }

    // Check for security headers (via meta tags or response headers)
    // This is a client-side check - actual headers should be set server-side
    return {
      https: isSecure,
      csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null,
      xss: document.querySelector('meta[http-equiv="X-XSS-Protection"]') !== null
    };
  }

  function createSecurityIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'security-indicator';
    indicator.setAttribute('title', 'Connexion sécurisée');
    indicator.setAttribute('aria-label', 'Indicateur de sécurité');
    document.body.appendChild(indicator);
    return indicator;
  }

  // ============================================
  // Password Strength Checker
  // ============================================

  function initPasswordStrength() {
    const passwordInputs = document.querySelectorAll('input[type="password"][data-strength]');

    passwordInputs.forEach(input => {
      const strengthContainer = document.createElement('div');
      strengthContainer.className = 'password-strength';
      strengthContainer.innerHTML = `
        <div class="password-strength-bar">
          <div class="password-strength-fill"></div>
        </div>
        <div class="password-strength-text">Force du mot de passe</div>
      `;
      input.parentElement.appendChild(strengthContainer);

      const fill = strengthContainer.querySelector('.password-strength-fill');
      const text = strengthContainer.querySelector('.password-strength-text');

      input.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);

        fill.className = 'password-strength-fill';
        text.className = 'password-strength-text';

        if (strength.score > 0) {
          if (strength.score <= 2) {
            fill.classList.add('weak');
            text.classList.add('weak');
            text.textContent = 'Faible';
          } else if (strength.score <= 4) {
            fill.classList.add('medium');
            text.classList.add('medium');
            text.textContent = 'Moyen';
          } else {
            fill.classList.add('strong');
            text.classList.add('strong');
            text.textContent = 'Fort';
          }
        } else {
          text.textContent = 'Force du mot de passe';
        }
      });
    });
  }

  function calculatePasswordStrength(password) {
    let score = 0;
    const feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('Au moins 8 caractères');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Lettres minuscules');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Lettres majuscules');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Chiffres');

    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    else feedback.push('Caractères spéciaux');

    if (password.length >= 12) score += 1;

    return { score, feedback };
  }

  // ============================================
  // Input Validation
  // ============================================

  function initInputValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');

    inputs.forEach(input => {
      // Add validation message container
      if (!input.parentElement.querySelector('.validation-message')) {
        const message = document.createElement('span');
        message.className = 'validation-message';
        input.parentElement.appendChild(message);
      }

      const message = input.parentElement.querySelector('.validation-message');

      function validate() {
        if (input.validity.valid) {
          message.className = 'validation-message success';
          message.textContent = '✓ Valide';
        } else {
          message.className = 'validation-message error';
          message.textContent = input.validationMessage || 'Valeur invalide';
        }
      }

      input.addEventListener('blur', validate);
      input.addEventListener('input', function() {
        if (this.value.length > 0) {
          validate();
        } else {
          message.textContent = '';
        }
      });
    });
  }

  // ============================================
  // Rate Limiting Client-Side
  // ============================================

  function initRateLimiting() {
    const rateLimitKey = 'rate_limit_requests';
    const maxRequests = 10;
    const timeWindow = 60000; // 1 minute

    function checkRateLimit() {
      const now = Date.now();
      const requests = JSON.parse(localStorage.getItem(rateLimitKey) || '[]');

      // Remove old requests
      const recentRequests = requests.filter(time => now - time < timeWindow);

      if (recentRequests.length >= maxRequests) {
        showRateLimitWarning();
        return false;
      }

      // Add current request
      recentRequests.push(now);
      localStorage.setItem(rateLimitKey, JSON.stringify(recentRequests));

      return true;
    }

    function showRateLimitWarning() {
      const warning = document.createElement('div');
      warning.className = 'rate-limit-warning rate-limit-exceeded';
      warning.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <div>
          <strong>Trop de requêtes</strong>
          <p>Veuillez patienter avant de réessayer.</p>
        </div>
      `;

      // Remove existing warnings
      document.querySelectorAll('.rate-limit-warning').forEach(w => w.remove());

      document.body.appendChild(warning);

      setTimeout(() => {
        warning.remove();
      }, 5000);
    }

    // Check rate limit on form submissions
    document.addEventListener('submit', function(e) {
      if (!checkRateLimit()) {
        e.preventDefault();
        return false;
      }
    });
  }

  // ============================================
  // CSRF Token Management
  // ============================================

  function initCSRFProtection() {
    // Get CSRF token from meta tag or cookie
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ||
                     getCookie('csrf_token');

    if (csrfToken) {
      // Add CSRF token to all forms
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        const existingToken = form.querySelector('input[name="csrf_token"]');
        if (!existingToken) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'csrf_token';
          input.value = csrfToken;
          input.className = 'csrf-token';
          form.appendChild(input);
        }
      });

      // Add CSRF token to AJAX requests
      if (window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
          options.headers = options.headers || {};
          options.headers['X-CSRF-Token'] = csrfToken;
          return originalFetch(url, options);
        };
      }
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // ============================================
  // XSS Protection
  // ============================================

  function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  function initXSSProtection() {
    // Sanitize user inputs before display
    const userInputs = document.querySelectorAll('[data-user-input]');
    userInputs.forEach(element => {
      const content = element.textContent;
      element.innerHTML = sanitizeInput(content);
      element.classList.add('xss-protected');
    });
  }

  // ============================================
  // Secure Connection Check
  // ============================================

  function initSecureConnectionCheck() {
    const isSecure = window.location.protocol === 'https:';

    // Update secure connection indicators
    const indicators = document.querySelectorAll('.secure-connection');
    indicators.forEach(indicator => {
      if (isSecure) {
        indicator.classList.remove('insecure-connection');
        indicator.innerHTML = `
          <i class="fas fa-lock"></i>
          <span>Connexion sécurisée</span>
        `;
      } else {
        indicator.classList.add('insecure-connection');
        indicator.innerHTML = `
          <i class="fas fa-unlock"></i>
          <span>Connexion non sécurisée</span>
        `;
      }
    });
  }

  // ============================================
  // Privacy Mode
  // ============================================

  function initPrivacyMode() {
    const privacyMode = localStorage.getItem('privacy_mode') === 'true';

    if (privacyMode) {
      document.body.classList.add('privacy-mode');

      // Disable analytics
      if (window.AnalyticsTracking) {
        // Disable tracking in privacy mode
      }
    }

    // Toggle privacy mode
    const toggle = document.querySelector('[data-privacy-mode]');
    if (toggle) {
      toggle.addEventListener('click', function() {
        const newMode = !privacyMode;
        localStorage.setItem('privacy_mode', newMode.toString());
        location.reload();
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

    checkSecurityHeaders();
    initPasswordStrength();
    initInputValidation();
    initRateLimiting();
    initCSRFProtection();
    initXSSProtection();
    initSecureConnectionCheck();
    initPrivacyMode();
  }

  // Start initialization
  init();

  // Export API
  window.SecurityEnhancements = {
    checkSecurityHeaders,
    calculatePasswordStrength,
    sanitizeInput,
    initPrivacyMode
  };

})();
