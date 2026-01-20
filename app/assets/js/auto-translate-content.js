/**
 * Auto Translate Content
 * Traduction automatique du contenu dynamique
 */

(function() {
  'use strict';

  // Wait for language switcher to be ready
  function init() {
    // Wait a bit for language switcher to initialize
    setTimeout(() => {
      if (window.languageSwitcher) {
        translateDynamicContent();
        setupContentObserver();
      }
    }, 500);
  }

  // Translate dynamic content
  function translateDynamicContent() {
    const lang = window.languageSwitcher.getCurrentLanguage();
    const t = window.languageSwitcher.getTranslations();
    if (!t) return;

    // Translate common text patterns
    translateTextPatterns(t);
    translateButtons(t);
    translateMetaInfo(t);
    translateEmptyStates(t);
  }

  // Translate text patterns
  function translateTextPatterns(t) {
    const patterns = [
      { 
        selector: '.blog-card-excerpt + a, .read-more-link, a.read-more',
        key: 'action.read-more',
        match: /^(Lire la suite|Read more|Lire|Read)$/i
      },
      {
        selector: '.share-button, button[aria-label*="share"], button[aria-label*="Partager"]',
        key: 'action.share',
        match: /^(Partager|Share)$/i
      },
      {
        selector: '.view-all, .voir-tout, a[href*="tags"]:not([data-i18n])',
        key: 'action.view-all',
        match: /^(Voir tout|View all|Voir|View)$/i
      },
      {
        selector: '.filter-button, .filter-btn',
        key: 'action.filter',
        match: /^(Filtrer|Filter)$/i
      },
      {
        selector: '.clear-button, .clear-btn, button[aria-label*="clear"]',
        key: 'action.clear',
        match: /^(Effacer|Clear|Réinitialiser|Reset)$/i
      }
    ];

    patterns.forEach(pattern => {
      document.querySelectorAll(pattern.selector).forEach(element => {
        if (!element.hasAttribute('data-i18n')) {
          const text = element.textContent.trim();
          if (pattern.match.test(text)) {
            element.setAttribute('data-i18n', pattern.key);
            element.textContent = t[pattern.key] || text;
          }
        }
      });
    });
  }

  // Translate buttons
  function translateButtons(t) {
    const buttonPatterns = {
      'Envoyer': t['form.submit'],
      'S\'inscrire': t['section.newsletter.button'],
      'Rechercher': t['hero.search.button'],
      'Fermer': t['common.close'],
      'Annuler': t['common.cancel'],
      'Enregistrer': t['common.save'],
      'Supprimer': t['common.delete'],
      'Modifier': t['common.edit']
    };

    document.querySelectorAll('button, .btn, input[type="submit"]').forEach(btn => {
      if (!btn.hasAttribute('data-i18n')) {
        const text = btn.textContent.trim();
        if (buttonPatterns[text]) {
          btn.setAttribute('data-i18n', Object.keys(buttonPatterns).indexOf(text) >= 0 ? 'button.' + text.toLowerCase() : '');
          const span = btn.querySelector('span');
          if (span) {
            span.textContent = buttonPatterns[text];
          } else {
            btn.textContent = buttonPatterns[text];
          }
        }
      }
    });
  }

  // Translate meta information
  function translateMetaInfo(t) {
    // Reading time
    document.querySelectorAll('.reading-time, [class*="reading-time"]').forEach(el => {
      if (!el.hasAttribute('data-i18n')) {
        const text = el.textContent;
        if (text.includes('min') || text.includes('minute')) {
          el.setAttribute('data-i18n', 'reading.time');
        }
      }
    });

    // View count
    document.querySelectorAll('.view-count, [class*="view-count"], [class*="views"]').forEach(el => {
      if (!el.hasAttribute('data-i18n')) {
        const text = el.textContent;
        if (text.includes('vues') || text.includes('views')) {
          el.setAttribute('data-i18n', 'reading.views');
        }
      }
    });

    // Date labels
    document.querySelectorAll('.date-label, [class*="date"]').forEach(el => {
      if (!el.hasAttribute('data-i18n')) {
        const text = el.textContent.trim();
        if (text === 'Date' || text === 'Publié le' || text === 'Published') {
          el.setAttribute('data-i18n', 'meta.date');
        }
      }
    });

    // Author labels
    document.querySelectorAll('.author-label, [class*="author"]').forEach(el => {
      if (!el.hasAttribute('data-i18n')) {
        const text = el.textContent.trim();
        if (text === 'Auteur' || text === 'Author' || text === 'Par') {
          el.setAttribute('data-i18n', 'meta.author');
        }
      }
    });
  }

  // Translate empty states
  function translateEmptyStates(t) {
    const emptyStates = {
      'Aucun résultat trouvé': t['common.no-results'],
      'Aucun article trouvé': t['posts.no-posts'],
      'Aucun commentaire': t['comments.no-comments'],
      'Chargement...': t['common.loading']
    };

    document.querySelectorAll('.empty-state, .no-results, .loading').forEach(el => {
      if (!el.hasAttribute('data-i18n')) {
        const text = el.textContent.trim();
        Object.keys(emptyStates).forEach(key => {
          if (text.includes(key)) {
            el.setAttribute('data-i18n', 'empty.' + key.toLowerCase().replace(/\s+/g, '-'));
            el.textContent = emptyStates[key];
          }
        });
      }
    });
  }

  // Setup content observer for dynamic content
  function setupContentObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          // Re-translate when new content is added
          setTimeout(() => {
            translateDynamicContent();
          }, 100);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-translate when language changes
  document.addEventListener('languageChanged', function() {
    translateDynamicContent();
  });

  // Export
  window.autoTranslateContent = {
    translate: translateDynamicContent
  };

})();
