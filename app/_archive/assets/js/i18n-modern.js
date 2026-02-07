/**
 * Modern i18n System
 * Système de traduction moderne inspiré des meilleures pratiques
 * Architecture similaire à i18next mais pour vanilla JS
 */

(function() {
  'use strict';

  // Configuration
  const config = {
    defaultLanguage: 'fr',
    fallbackLanguage: 'en',
    supportedLanguages: ['fr', 'en'],
    storageKey: 'preferred-language',
    namespace: 'translation',
    interpolationPrefix: '{{',
    interpolationSuffix: '}}',
    debug: false
  };

  // Translation resources
  const resources = {
    fr: {
      translation: {
        // Navigation
        nav: {
          home: 'Accueil',
          about: 'À propos',
          tags: 'Tags',
          projects: 'Projets',
          explore: 'Explorer',
          contact: 'Contact',
          categories: 'Catégories',
          allCategories: 'Toutes les catégories',
          search: 'Rechercher',
          menu: 'Menu'
        },

        // Hero
        hero: {
          title: {
            part1: 'Explorez le monde',
            part2: 'Business Intelligence, Data Science, AI & Technologies'
          },
          subtitle: 'Découvrez le monde de la donnée à travers notre blog : ses tendances, ses outils et ses opportunités. De l\'apprentissage automatique aux décisions basées sur la data, nous vous proposons un contenu informatif et captivant.',
          search: {
            placeholder: 'Rechercher un article, un tag, une catégorie...',
            button: 'Rechercher',
            aria: 'Rechercher un article'
          }
        },

        // Filters
        filters: {
          all: 'Tous les articles',
          dataAnalytics: 'Data Analytics',
          dataScience: 'Data Science',
          ai: 'Intelligence Artificielle',
          dataEngineering: 'Data Engineering',
          bi: 'Business Intelligence',
          aria: 'Filtres d\'articles'
        },

        // Sections
        sections: {
          latestPosts: 'Derniers Articles',
          latestPostsLink: 'Voir tous les articles',
          featured: 'Articles à la Une',
          featuredSubtitle: 'Découvrez nos articles les plus populaires et les plus récents',
          categories: 'Explorez par Catégorie',
          categoriesSubtitle: 'Trouvez rapidement les articles qui vous intéressent',
          popularTopics: 'Sujets Populaires',
          popularTopicsSubtitle: 'Explorez nos sujets les plus consultés et trouvez rapidement ce qui vous intéresse',
          tagsCloud: 'Tous les Sujets',
          tagsCloudSubtitle: 'Explorez tous nos sujets et trouvez exactement ce que vous cherchez',
          stats: 'Statistiques',
          statsArticles: 'Articles',
          statsCategories: 'Catégories',
          statsFree: 'Gratuit',
          statsAvailable: 'Disponible',
          cta: {
            title: 'Prêt à explorer le monde de la Data ?',
            description: 'Rejoignez notre communauté et restez informé des dernières tendances en Data Science et Intelligence Artificielle',
            explore: 'Explorer les Articles',
            learnMore: 'En savoir plus'
          },
          newsletter: {
            title: 'Recevez nos prochains articles',
            description: 'Inscrivez-vous à notre newsletter pour recevoir les derniers articles directement dans votre boîte mail.',
            placeholder: 'Votre adresse email',
            button: 'S\'inscrire',
            privacy: 'En vous inscrivant, vous acceptez notre',
            privacyLink: 'politique de confidentialité',
            help: 'Entrez votre adresse email pour vous abonner à la newsletter'
          },
          contact: {
            title: 'Contactez-nous',
            subtitle: 'Une question ? Un projet ? N\'hésitez pas à nous contacter. Nous sommes là pour vous aider.',
            email: 'Email',
            emailDesc: 'Envoyez-nous un email et nous vous répondrons dans les plus brefs délais.',
            phone: 'Téléphone',
            phoneDesc: 'Appelez-nous pour discuter de votre projet ou obtenir des informations.',
            location: 'Localisation',
            locationDesc: 'Retrouvez-nous à notre bureau pour une rencontre en personne.',
            form: {
              title: 'Envoyez-nous un message',
              name: 'Nom complet',
              namePlaceholder: 'Votre nom',
              email: 'Email',
              emailPlaceholder: 'votre@email.com',
              subject: 'Sujet',
              subjectPlaceholder: 'Sujet de votre message',
              message: 'Message',
              messagePlaceholder: 'Votre message...',
              submit: 'Envoyer le message'
            }
          }
        },

        // Meta
        meta: {
          readingTime: 'min de lecture',
          views: 'vues',
          date: 'Date',
          author: 'Auteur',
          articles: 'articles',
          readMore: 'Lire la suite',
          share: 'Partager',
          bookmark: 'Marquer'
        },

        // Categories
        category: {
          dataAnalytics: 'Data Analytics',
          dataAnalyticsDesc: 'Articles sur l\'analyse de données',
          dataScience: 'Data Science',
          dataScienceDesc: 'Science des données et ML',
          ai: 'Intelligence Artificielle',
          aiDesc: 'IA et apprentissage automatique',
          dataEngineering: 'Data Engineering',
          dataEngineeringDesc: 'Pipelines et architectures',
          bi: 'Business Intelligence',
          biDesc: 'BI et décisions stratégiques'
        },

        // Topics
        topic: {
          dataAnalyticsDesc: 'Analysez vos données et transformez-les en insights actionnables pour votre entreprise.',
          dataScienceDesc: 'Maîtrisez la science des données, le machine learning et l\'analyse prédictive.',
          aiDesc: 'Découvrez les dernières avancées en IA, LLM et applications génératives.',
          dataEngineeringDesc: 'Construisez des pipelines robustes et des architectures de données scalables.',
          biDesc: 'Utilisez la BI pour prendre des décisions stratégiques basées sur les données.'
        },

        // Common
        common: {
          required: 'requis',
          loading: 'Chargement...',
          error: 'Erreur',
          success: 'Succès',
          close: 'Fermer',
          cancel: 'Annuler',
          save: 'Enregistrer',
          delete: 'Supprimer',
          edit: 'Modifier',
          share: 'Partager',
          readMore: 'Lire la suite',
          back: 'Retour',
          next: 'Suivant',
          previous: 'Précédent',
          noResults: 'Aucun résultat trouvé',
          searchResults: 'Résultats de recherche',
          filterBy: 'Filtrer par',
          sortBy: 'Trier par',
          viewAll: 'Voir tout',
          more: 'Plus',
          less: 'Moins'
        },

        // Actions
        action: {
          readMore: 'Lire la suite',
          viewAll: 'Voir tout',
          loadMore: 'Charger plus',
          showLess: 'Afficher moins',
          filter: 'Filtrer',
          clear: 'Effacer',
          reset: 'Réinitialiser',
          apply: 'Appliquer',
          cancel: 'Annuler',
          save: 'Enregistrer',
          delete: 'Supprimer',
          edit: 'Modifier',
          share: 'Partager',
          print: 'Imprimer',
          download: 'Télécharger',
          copy: 'Copier',
          close: 'Fermer'
        },

        // Forms
        form: {
          required: 'Ce champ est requis',
          emailInvalid: 'Veuillez entrer une adresse email valide',
          minlength: 'Minimum {{min}} caractères requis',
          maxlength: 'Maximum {{max}} caractères',
          submit: 'Envoyer',
          submitting: 'Envoi en cours...',
          success: 'Message envoyé avec succès',
          error: 'Une erreur est survenue'
        },

        // Newsletter
        newsletter: {
          success: 'Inscription réussie !',
          error: 'Erreur lors de l\'inscription',
          alreadySubscribed: 'Vous êtes déjà inscrit',
          subscribing: 'Inscription...'
        },

        // Social
        social: {
          share: 'Partager sur',
          twitter: 'Twitter',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          whatsapp: 'WhatsApp',
          copy: 'Copier le lien',
          copied: 'Lien copié !'
        },

        // Reading
        reading: {
          time: 'Temps de lecture',
          estimated: 'Temps estimé',
          minutes: 'minutes',
          views: 'vues',
          bookmark: 'Marquer',
          bookmarked: 'Marqué',
          share: 'Partager cet article'
        },

        // Posts
        posts: {
          latest: 'Derniers articles',
          popular: 'Articles populaires',
          related: 'Articles similaires',
          featured: 'Articles à la une',
          all: 'Tous les articles',
          noPosts: 'Aucun article trouvé',
          loading: 'Chargement des articles...'
        },

        // Pagination
        pagination: {
          previous: 'Précédent',
          next: 'Suivant',
          page: 'Page',
          of: 'sur'
        },

        // Breadcrumbs
        breadcrumbs: {
          home: 'Accueil',
          youAreHere: 'Vous êtes ici'
        },

        // Footer
        footer: {
          navigation: 'Navigation',
          resources: 'Ressources',
          contact: 'Contact',
          about: 'À propos',
          whoAreWe: 'Qui sommes-nous ?',
          allArticles: 'Tous les articles',
          copyright: 'Tous droits réservés.'
        },

        // Accessibility
        a11y: {
          skipContent: 'Aller au contenu principal',
          menu: 'Menu principal',
          close: 'Fermer',
          open: 'Ouvrir',
          search: 'Rechercher',
          language: 'Changer la langue',
          theme: 'Changer le thème'
        }
      }
    },
    en: {
      translation: {
        // Navigation
        nav: {
          home: 'Home',
          about: 'About',
          tags: 'Tags',
          projects: 'Projects',
          explore: 'Explore',
          contact: 'Contact',
          categories: 'Categories',
          allCategories: 'All Categories',
          search: 'Search',
          menu: 'Menu'
        },

        // Hero
        hero: {
          title: {
            part1: 'Explore the world',
            part2: 'Business Intelligence, Data Science, AI & Technologies'
          },
          subtitle: 'Discover the world of data through our blog: its trends, tools, and opportunities. From machine learning to data-driven decisions, we offer informative and engaging content.',
          search: {
            placeholder: 'Search for an article, tag, category...',
            button: 'Search',
            aria: 'Search for an article'
          }
        },

        // Filters
        filters: {
          all: 'All articles',
          dataAnalytics: 'Data Analytics',
          dataScience: 'Data Science',
          ai: 'Artificial Intelligence',
          dataEngineering: 'Data Engineering',
          bi: 'Business Intelligence',
          aria: 'Article filters'
        },

        // Sections
        sections: {
          latestPosts: 'Latest Articles',
          latestPostsLink: 'View all articles',
          featured: 'Featured Articles',
          featuredSubtitle: 'Discover our most popular and recent articles',
          categories: 'Browse by Category',
          categoriesSubtitle: 'Quickly find articles that interest you',
          popularTopics: 'Popular Topics',
          popularTopicsSubtitle: 'Explore our most viewed topics and quickly find what interests you',
          tagsCloud: 'All Topics',
          tagsCloudSubtitle: 'Explore all our topics and find exactly what you\'re looking for',
          stats: 'Statistics',
          statsArticles: 'Articles',
          statsCategories: 'Categories',
          statsFree: 'Free',
          statsAvailable: 'Available',
          cta: {
            title: 'Ready to explore the world of Data?',
            description: 'Join our community and stay informed about the latest trends in Data Science and Artificial Intelligence',
            explore: 'Explore Articles',
            learnMore: 'Learn more'
          },
          newsletter: {
            title: 'Receive our next articles',
            description: 'Subscribe to our newsletter to receive the latest articles directly in your inbox.',
            placeholder: 'Your email address',
            button: 'Subscribe',
            privacy: 'By subscribing, you accept our',
            privacyLink: 'privacy policy',
            help: 'Enter your email address to subscribe to the newsletter'
          },
          contact: {
            title: 'Contact us',
            subtitle: 'Have a question? A project? Don\'t hesitate to contact us. We\'re here to help.',
            email: 'Email',
            emailDesc: 'Send us an email and we\'ll respond as soon as possible.',
            phone: 'Phone',
            phoneDesc: 'Call us to discuss your project or get information.',
            location: 'Location',
            locationDesc: 'Find us at our office for an in-person meeting.',
            form: {
              title: 'Send us a message',
              name: 'Full name',
              namePlaceholder: 'Your name',
              email: 'Email',
              emailPlaceholder: 'your@email.com',
              subject: 'Subject',
              subjectPlaceholder: 'Subject of your message',
              message: 'Message',
              messagePlaceholder: 'Your message...',
              submit: 'Send message'
            }
          }
        },

        // Meta
        meta: {
          readingTime: 'min read',
          views: 'views',
          date: 'Date',
          author: 'Author',
          articles: 'articles',
          readMore: 'Read more',
          share: 'Share',
          bookmark: 'Bookmark'
        },

        // Categories
        category: {
          dataAnalytics: 'Data Analytics',
          dataAnalyticsDesc: 'Articles on data analysis',
          dataScience: 'Data Science',
          dataScienceDesc: 'Data science and ML',
          ai: 'Artificial Intelligence',
          aiDesc: 'AI and machine learning',
          dataEngineering: 'Data Engineering',
          dataEngineeringDesc: 'Pipelines and architectures',
          bi: 'Business Intelligence',
          biDesc: 'BI and strategic decisions'
        },

        // Topics
        topic: {
          dataAnalyticsDesc: 'Analyze your data and turn it into actionable insights for your business.',
          dataScienceDesc: 'Master data science, machine learning, and predictive analytics.',
          aiDesc: 'Discover the latest advances in AI, LLMs, and generative applications.',
          dataEngineeringDesc: 'Build robust pipelines and scalable data architectures.',
          biDesc: 'Use BI to make strategic data-driven decisions.'
        },

        // Common
        common: {
          required: 'required',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          close: 'Close',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          share: 'Share',
          readMore: 'Read more',
          back: 'Back',
          next: 'Next',
          previous: 'Previous',
          noResults: 'No results found',
          searchResults: 'Search results',
          filterBy: 'Filter by',
          sortBy: 'Sort by',
          viewAll: 'View all',
          more: 'More',
          less: 'Less'
        },

        // Actions
        action: {
          readMore: 'Read more',
          viewAll: 'View all',
          loadMore: 'Load more',
          showLess: 'Show less',
          filter: 'Filter',
          clear: 'Clear',
          reset: 'Reset',
          apply: 'Apply',
          cancel: 'Cancel',
          save: 'Save',
          delete: 'Delete',
          edit: 'Edit',
          share: 'Share',
          print: 'Print',
          download: 'Download',
          copy: 'Copy',
          close: 'Close'
        },

        // Forms
        form: {
          required: 'This field is required',
          emailInvalid: 'Please enter a valid email address',
          minlength: 'Minimum {{min}} characters required',
          maxlength: 'Maximum {{max}} characters',
          submit: 'Submit',
          submitting: 'Submitting...',
          success: 'Message sent successfully',
          error: 'An error occurred'
        },

        // Newsletter
        newsletter: {
          success: 'Subscription successful!',
          error: 'Error during subscription',
          alreadySubscribed: 'You are already subscribed',
          subscribing: 'Subscribing...'
        },

        // Social
        social: {
          share: 'Share on',
          twitter: 'Twitter',
          facebook: 'Facebook',
          linkedin: 'LinkedIn',
          whatsapp: 'WhatsApp',
          copy: 'Copy link',
          copied: 'Link copied!'
        },

        // Reading
        reading: {
          time: 'Reading time',
          estimated: 'Estimated time',
          minutes: 'minutes',
          views: 'views',
          bookmark: 'Bookmark',
          bookmarked: 'Bookmarked',
          share: 'Share this article'
        },

        // Posts
        posts: {
          latest: 'Latest articles',
          popular: 'Popular articles',
          related: 'Related articles',
          featured: 'Featured articles',
          all: 'All articles',
          noPosts: 'No articles found',
          loading: 'Loading articles...'
        },

        // Pagination
        pagination: {
          previous: 'Previous',
          next: 'Next',
          page: 'Page',
          of: 'of'
        },

        // Breadcrumbs
        breadcrumbs: {
          home: 'Home',
          youAreHere: 'You are here'
        },

        footer: {
          navigation: 'Navigation',
          resources: 'Resources',
          contact: 'Contact',
          about: 'About',
          whoAreWe: 'Who are we?',
          allArticles: 'All articles',
          copyright: 'All rights reserved.'
        },

        // Accessibility
        a11y: {
          skipContent: 'Skip to main content',
          menu: 'Main menu',
          close: 'Close',
          open: 'Open',
          search: 'Search',
          language: 'Change language',
          theme: 'Change theme'
        }
      }
    }
  };

  // Current language
  let currentLanguage = config.defaultLanguage;

  // Get nested value from object
  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // Interpolate string with variables
  function interpolate(str, variables = {}) {
    if (!str || typeof str !== 'string') return str;

    return str.replace(
      new RegExp(`${config.interpolationPrefix}([^${config.interpolationSuffix}]+)${config.interpolationSuffix}`, 'g'),
      (match, key) => {
        return variables[key.trim()] !== undefined ? variables[key.trim()] : match;
      }
    );
  }

  // Get translation
  function t(key, options = {}) {
    const { namespace = config.namespace, defaultValue, ...variables } = options;

    const resource = resources[currentLanguage]?.[namespace];
    if (!resource) {
      if (config.debug) console.warn(`Namespace "${namespace}" not found for language "${currentLanguage}"`);
      return defaultValue || key;
    }

    let translation = getNestedValue(resource, key);

    if (!translation) {
      // Try fallback language
      if (currentLanguage !== config.fallbackLanguage) {
        const fallbackResource = resources[config.fallbackLanguage]?.[namespace];
        translation = getNestedValue(fallbackResource, key);
      }

      if (!translation) {
        if (config.debug) console.warn(`Translation key "${key}" not found`);
        return defaultValue !== undefined ? defaultValue : key;
      }
    }

    // Interpolate if variables provided
    if (Object.keys(variables).length > 0) {
      translation = interpolate(translation, variables);
    }

    return translation;
  }

  // Detect browser language
  function detectLanguage() {
    // Check localStorage first
    const stored = localStorage.getItem(config.storageKey);
    if (stored && config.supportedLanguages.includes(stored)) {
      return stored;
    }

    // Detect from browser
    const browserLang = (navigator.language || navigator.userLanguage || '').split('-')[0];
    if (config.supportedLanguages.includes(browserLang)) {
      return browserLang;
    }

    // Check HTML lang attribute
    const htmlLang = document.documentElement.lang;
    if (htmlLang && config.supportedLanguages.includes(htmlLang)) {
      return htmlLang;
    }

    return config.defaultLanguage;
  }

  // Change language
  function changeLanguage(lang) {
    if (!config.supportedLanguages.includes(lang)) {
      if (config.debug) console.warn(`Language "${lang}" is not supported`);
      return;
    }

    const previousLang = currentLanguage;
    currentLanguage = lang;

    // Save to localStorage
    localStorage.setItem(config.storageKey, lang);

    // Update HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update meta tags
    updateMetaTags(lang);

    // Translate page
    translatePage();

    // Update language switcher UI
    updateLanguageSwitcher();

    // Dispatch event
    document.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language: lang, previousLanguage: previousLang }
    }));

    if (config.debug) console.log(`Language changed from ${previousLang} to ${lang}`);
  }

  // Update meta tags
  function updateMetaTags(lang) {
    // Update og:locale
    let ogLocale = document.querySelector('meta[property="og:locale"]');
    if (!ogLocale) {
      ogLocale = document.createElement('meta');
      ogLocale.setAttribute('property', 'og:locale');
      document.head.appendChild(ogLocale);
    }
    ogLocale.setAttribute('content', lang === 'fr' ? 'fr_FR' : 'en_US');

    // Update alternate language links
    const currentUrl = window.location.href;
    config.supportedLanguages.forEach(supportedLang => {
      let alternate = document.querySelector(`link[rel="alternate"][hreflang="${supportedLang}"]`);
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.setAttribute('rel', 'alternate');
        alternate.setAttribute('hreflang', supportedLang);
        document.head.appendChild(alternate);
      }
      alternate.setAttribute('href', currentUrl);
    });
  }

  // Translate element
  function translateElement(element, key, options = {}) {
    const translation = t(key, options);

    if (!translation || translation === key) return;

    const tagName = element.tagName.toLowerCase();
    const attr = element.getAttribute('data-i18n-attr') || 'text';

    switch (attr) {
      case 'text':
        if (tagName === 'input' && (element.type === 'text' || element.type === 'email' || element.type === 'search')) {
          element.placeholder = translation;
        } else if (tagName === 'textarea') {
          element.placeholder = translation;
        } else {
          const span = element.querySelector('span');
          if (span && !span.hasAttribute('data-i18n')) {
            span.textContent = translation;
          } else {
            element.textContent = translation;
          }
        }
        break;
      case 'html':
        element.innerHTML = translation;
        break;
      case 'placeholder':
        element.placeholder = translation;
        break;
      case 'aria-label':
      case 'ariaLabel':
        element.setAttribute('aria-label', translation);
        break;
      case 'title':
        element.setAttribute('title', translation);
        break;
      default:
        element.setAttribute(attr, translation);
    }
  }

  // Translate page
  function translatePage() {
    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const optionsAttr = element.getAttribute('data-i18n-options');
      const options = optionsAttr ? JSON.parse(optionsAttr) : {};
      translateElement(element, key, options);
    });

    // Translate elements with data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      translateElement(element, key, { attr: 'html' });
    });

    // Translate elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      translateElement(element, key, { attr: 'placeholder' });
    });

    // Translate elements with data-i18n-aria
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      translateElement(element, key, { attr: 'aria-label' });
    });

    // Translate elements with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      translateElement(element, key, { attr: 'title' });
    });
  }

  // Update language switcher UI
  function updateLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;

    const buttons = switcher.querySelectorAll('button[data-lang]');
    buttons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLanguage) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Initialize
  function init() {
    // Detect and set language
    const detectedLang = detectLanguage();
    changeLanguage(detectedLang);

    // Setup language switcher buttons
    document.querySelectorAll('.language-switcher button[data-lang]').forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.getAttribute('data-lang');
        changeLanguage(lang);
      });
    });

    // Watch for dynamically added content
    const observer = new MutationObserver(function(mutations) {
      let shouldTranslate = false;
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              if (node.hasAttribute && (
                node.hasAttribute('data-i18n') ||
                node.hasAttribute('data-i18n-html') ||
                node.hasAttribute('data-i18n-placeholder') ||
                node.hasAttribute('data-i18n-aria') ||
                node.hasAttribute('data-i18n-title') ||
                node.querySelector('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-aria], [data-i18n-title]')
              )) {
                shouldTranslate = true;
              }
            }
          });
        }
      });

      if (shouldTranslate) {
        // Debounce translation
        clearTimeout(window._i18nTranslateTimeout);
        window._i18nTranslateTimeout = setTimeout(() => {
          translatePage();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    if (config.debug) console.log('i18n system initialized', { language: currentLanguage });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export API
  window.i18n = {
    t,
    changeLanguage,
    getLanguage: () => currentLanguage,
    getSupportedLanguages: () => config.supportedLanguages,
    init,
    config
  };

})();
