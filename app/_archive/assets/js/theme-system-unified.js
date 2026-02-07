/**
 * Système de Thème Unifié
 * Système de thème light/dark qui fonctionne sur toutes les pages
 */

(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'preferred-theme';
  const THEME_ATTRIBUTE = 'data-theme';

  // ============================================
  // Configuration
  // ============================================

  const config = {
    defaultTheme: 'light',
    transitionDuration: 300,
    applyToAllPages: true
  };

  // ============================================
  // Theme Management
  // ============================================

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function getInitialTheme() {
    return getStoredTheme() || getSystemPreference();
  }

  function setTheme(theme) {
    const html = document.documentElement;
    const body = document.body;

    // Appliquer le thème
    html.setAttribute(THEME_ATTRIBUTE, theme);
    body.classList.toggle('dark-mode', theme === 'dark');

    // Sauvegarder dans localStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Impossible de sauvegarder le thème:', e);
    }

    // Mettre à jour l'icône du bouton
    updateThemeButton(theme);

    // Dispatch event pour les autres composants
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme }
    }));

    // Mettre à jour les meta tags
    updateMetaTheme(theme);
  }

  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    return newTheme;
  }

  function getCurrentTheme() {
    return document.documentElement.getAttribute(THEME_ATTRIBUTE) ||
           (document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  }

  // ============================================
  // Theme Button
  // ============================================

  function updateThemeButton(theme) {
    const button = document.getElementById('toggle-dark');
    if (!button) return;

    const icon = button.querySelector('.theme-toggle-icon');
    if (icon) {
      if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        button.setAttribute('aria-label', 'Passer en mode clair');
        button.setAttribute('aria-pressed', 'true');
      } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        button.setAttribute('aria-label', 'Passer en mode sombre');
        button.setAttribute('aria-pressed', 'false');
      }
    }
  }

  function initThemeButton() {
    const button = document.getElementById('toggle-dark');
    if (!button) return;

    // Ajouter transition pour le changement de thème
    const style = document.createElement('style');
    style.textContent = `
      * {
        transition: background-color ${config.transitionDuration}ms ease,
                    color ${config.transitionDuration}ms ease,
                    border-color ${config.transitionDuration}ms ease !important;
      }
    `;
    document.head.appendChild(style);

    // Event listener
    button.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });

    // Initialiser l'état du bouton
    const currentTheme = getCurrentTheme();
    updateThemeButton(currentTheme);
  }

  // ============================================
  // Meta Tags
  // ============================================

  function updateMetaTheme(theme) {
    // Mettre à jour le meta theme-color
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement('meta');
      metaTheme.name = 'theme-color';
      document.head.appendChild(metaTheme);
    }

    if (theme === 'dark') {
      metaTheme.content = '#0F172A';
    } else {
      metaTheme.content = '#FFFFFF';
    }

    // Mettre à jour le meta color-scheme
    let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (!metaColorScheme) {
      metaColorScheme = document.createElement('meta');
      metaColorScheme.name = 'color-scheme';
      document.head.appendChild(metaColorScheme);
    }
    metaColorScheme.content = theme;
  }

  // ============================================
  // System Preference Listener
  // ============================================

  function initSystemPreferenceListener() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      mediaQuery.addEventListener('change', (e) => {
        // Ne changer que si l'utilisateur n'a pas de préférence stockée
        if (!getStoredTheme()) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  // ============================================
  // Apply Theme to All Elements
  // ============================================

  function applyThemeToAllElements(theme) {
    // Cette fonction peut être étendue pour appliquer le thème
    // à des éléments spécifiques si nécessaire
    const isDark = theme === 'dark';

    // Exemple : appliquer aux iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        iframe.contentDocument?.documentElement?.setAttribute(THEME_ATTRIBUTE, theme);
      } catch (e) {
        // Cross-origin iframe, ignore
      }
    });
  }

  // ============================================
  // Initialize
  // ============================================

  function init() {
    // Appliquer le thème immédiatement (avant DOMContentLoaded)
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initThemeButton();
        initSystemPreferenceListener();
        applyThemeToAllElements(initialTheme);
      });
    } else {
      initThemeButton();
      initSystemPreferenceListener();
      applyThemeToAllElements(initialTheme);
    }
  }

  // Start initialization
  init();

  // Export API
  window.ThemeSystem = {
    setTheme,
    toggleTheme,
    getCurrentTheme,
    getStoredTheme,
    getSystemPreference
  };

})();
