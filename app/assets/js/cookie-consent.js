/**
 * Cookie Consent Manager
 * Gestion du consentement aux cookies RGPD
 */

(function() {
  'use strict';

  const COOKIE_CONSENT_KEY = 'cookie_consent';
  const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

  // Cookie preferences
  const defaultPreferences = {
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    functional: false
  };

  // Initialize
  function init() {
    const consent = getCookieConsent();
    
    if (!consent) {
      showCookieBanner();
    } else {
      loadCookiePreferences();
    }
    
    initCookieSettings();
  }

  // Show cookie banner
  function showCookieBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      setTimeout(() => {
        banner.classList.add('show');
      }, 1000);
    }
  }

  // Accept all cookies
  function acceptAllCookies() {
    const preferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    setCookieConsent(true);
    setCookiePreferences(preferences);
    hideCookieBanner();
    loadCookiePreferences();
  }

  // Decline all cookies
  function declineAllCookies() {
    setCookieConsent(true);
    setCookiePreferences(defaultPreferences);
    hideCookieBanner();
    loadCookiePreferences();
  }

  // Save cookie preferences
  function saveCookiePreferences() {
    const preferences = {
      necessary: true, // Always true
      analytics: document.getElementById('cookie-analytics')?.checked || false,
      marketing: document.getElementById('cookie-marketing')?.checked || false,
      functional: document.getElementById('cookie-functional')?.checked || false
    };
    
    setCookieConsent(true);
    setCookiePreferences(preferences);
    hideCookieBanner();
    hideCookieSettings();
    loadCookiePreferences();
  }

  // Load cookie preferences
  function loadCookiePreferences() {
    const preferences = getCookiePreferences();
    
    // Load analytics if enabled
    if (preferences.analytics) {
      loadAnalytics();
    }
    
    // Load marketing if enabled
    if (preferences.marketing) {
      loadMarketing();
    }
    
    // Load functional if enabled
    if (preferences.functional) {
      loadFunctional();
    }
  }

  // Load analytics scripts
  function loadAnalytics() {
    // Google Analytics example
    if (typeof gtag === 'undefined') {
      // Load GA script here if needed
      console.log('Analytics enabled');
    }
  }

  // Load marketing scripts
  function loadMarketing() {
    console.log('Marketing cookies enabled');
  }

  // Load functional scripts
  function loadFunctional() {
    console.log('Functional cookies enabled');
  }

  // Show cookie settings
  function showCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      const preferences = getCookiePreferences();
      
      document.getElementById('cookie-analytics').checked = preferences.analytics;
      document.getElementById('cookie-marketing').checked = preferences.marketing;
      document.getElementById('cookie-functional').checked = preferences.functional;
      
      modal.classList.add('show');
    }
  }

  // Hide cookie settings
  function hideCookieSettings() {
    const modal = document.getElementById('cookie-settings-modal');
    if (modal) {
      modal.classList.remove('show');
    }
  }

  // Hide cookie banner
  function hideCookieBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('show');
    }
  }

  // Initialize cookie settings modal
  function initCookieSettings() {
    const settingsBtn = document.getElementById('cookie-settings-btn');
    const closeBtn = document.getElementById('cookie-settings-close');
    const saveBtn = document.getElementById('cookie-settings-save');
    const modal = document.getElementById('cookie-settings-modal');
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', showCookieSettings);
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', hideCookieSettings);
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', saveCookiePreferences);
    }
    
    if (modal) {
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          hideCookieSettings();
        }
      });
    }
    
    // Toggle switches
    document.querySelectorAll('.cookie-toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', function() {
        const checkbox = this.previousElementSibling;
        if (checkbox && checkbox.type === 'checkbox') {
          checkbox.checked = !checkbox.checked;
          this.classList.toggle('active', checkbox.checked);
        }
      });
    });
  }

  // Cookie utilities
  function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
  }

  function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function setCookieConsent(accepted) {
    setCookie(COOKIE_CONSENT_KEY, accepted ? 'true' : 'false', 365);
  }

  function getCookieConsent() {
    return getCookie(COOKIE_CONSENT_KEY) === 'true';
  }

  function setCookiePreferences(preferences) {
    setCookie(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences), 365);
  }

  function getCookiePreferences() {
    const prefs = getCookie(COOKIE_PREFERENCES_KEY);
    if (prefs) {
      try {
        return JSON.parse(prefs);
      } catch (e) {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    const acceptBtn = document.getElementById('cookie-accept-btn');
    const declineBtn = document.getElementById('cookie-decline-btn');
    const settingsBtn = document.getElementById('cookie-settings-link');
    
    if (acceptBtn) {
      acceptBtn.addEventListener('click', acceptAllCookies);
    }
    
    if (declineBtn) {
      declineBtn.addEventListener('click', declineAllCookies);
    }
    
    if (settingsBtn) {
      settingsBtn.addEventListener('click', function(e) {
        e.preventDefault();
        showCookieSettings();
      });
    }
    
    init();
  });

  // Export for global access
  window.cookieConsent = {
    acceptAll: acceptAllCookies,
    declineAll: declineAllCookies,
    showSettings: showCookieSettings,
    getPreferences: getCookiePreferences
  };

})();
