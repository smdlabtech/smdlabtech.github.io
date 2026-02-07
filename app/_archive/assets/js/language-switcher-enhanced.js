/**
 * Language Switcher Enhanced
 * Système de traduction automatique complet FR/EN
 */

(function() {
  'use strict';

  // Extended Translations with all content
  const translations = {
    fr: {
      // Navigation
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.tags': 'Tags',
      'nav.projects': 'Projets',
      'nav.explore': 'Explorer',
      'nav.contact': 'Contact',
      'nav.categories': 'Catégories',
      'nav.all-categories': 'Toutes les catégories',
      'nav.search': 'Rechercher',
      'nav.menu': 'Menu',

      // Hero Section
      'hero.title.part1': 'Explorez le monde',
      'hero.title.part2': 'Business Intelligence, Data Science, AI & Technologies',
      'hero.subtitle': 'Découvrez le monde de la donnée à travers notre blog : ses tendances, ses outils et ses opportunités. De l\'apprentissage automatique aux décisions basées sur la data, nous vous proposons un contenu informatif et captivant.',
      'hero.search.placeholder': 'Rechercher un article, un tag, une catégorie...',
      'hero.search.button': 'Rechercher',
      'hero.search.aria': 'Rechercher un article',

      // Filters
      'filters.all': 'Tous les articles',
      'filters.data-analytics': 'Data Analytics',
      'filters.data-science': 'Data Science',
      'filters.ai': 'Intelligence Artificielle',
      'filters.data-engineering': 'Data Engineering',
      'filters.bi': 'Business Intelligence',
      'filters.aria': 'Filtres d\'articles',

      // Sections
      'section.latest-posts': 'Derniers Articles',
      'section.latest-posts.link': 'Voir tous les articles',
      'section.featured': 'Articles à la Une',
      'section.featured.subtitle': 'Découvrez nos articles les plus populaires et les plus récents',
      'section.categories': 'Explorez par Catégorie',
      'section.categories.subtitle': 'Trouvez rapidement les articles qui vous intéressent',
      'section.popular-topics': 'Sujets Populaires',
      'section.popular-topics.subtitle': 'Explorez nos sujets les plus consultés et trouvez rapidement ce qui vous intéresse',
      'section.tags-cloud': 'Tous les Sujets',
      'section.tags-cloud.subtitle': 'Explorez tous nos sujets et trouvez exactement ce que vous cherchez',
      'section.stats': 'Statistiques',
      'section.stats.articles': 'Articles',
      'section.stats.categories': 'Catégories',
      'section.stats.free': 'Gratuit',
      'section.stats.available': 'Disponible',
      'section.cta.title': 'Prêt à explorer le monde de la Data ?',
      'section.cta.description': 'Rejoignez notre communauté et restez informé des dernières tendances en Data Science et Intelligence Artificielle',
      'section.cta.explore': 'Explorer les Articles',
      'section.cta.learn-more': 'En savoir plus',
      'section.newsletter.title': 'Recevez nos prochains articles',
      'section.newsletter.description': 'Inscrivez-vous à notre newsletter pour recevoir les derniers articles directement dans votre boîte mail.',
      'section.newsletter.placeholder': 'Votre adresse email',
      'section.newsletter.button': 'S\'inscrire',
      'section.newsletter.privacy': 'En vous inscrivant, vous acceptez notre',
      'section.newsletter.privacy.link': 'politique de confidentialité',
      'section.newsletter.help': 'Entrez votre adresse email pour vous abonner à la newsletter',
      'section.contact.title': 'Contactez-nous',
      'section.contact.subtitle': 'Une question ? Un projet ? N\'hésitez pas à nous contacter. Nous sommes là pour vous aider.',
      'section.contact.email': 'Email',
      'section.contact.email.desc': 'Envoyez-nous un email et nous vous répondrons dans les plus brefs délais.',
      'section.contact.phone': 'Téléphone',
      'section.contact.phone.desc': 'Appelez-nous pour discuter de votre projet ou obtenir des informations.',
      'section.contact.location': 'Localisation',
      'section.contact.location.desc': 'Retrouvez-nous à notre bureau pour une rencontre en personne.',
      'section.contact.form.title': 'Envoyez-nous un message',
      'section.contact.form.name': 'Nom complet',
      'section.contact.form.name.placeholder': 'Votre nom',
      'section.contact.form.email': 'Email',
      'section.contact.form.email.placeholder': 'votre@email.com',
      'section.contact.form.subject': 'Sujet',
      'section.contact.form.subject.placeholder': 'Sujet de votre message',
      'section.contact.form.message': 'Message',
      'section.contact.form.message.placeholder': 'Votre message...',
      'section.contact.form.submit': 'Envoyer le message',

      // Meta
      'meta.reading-time': 'min de lecture',
      'meta.views': 'vues',
      'meta.date': 'Date',
      'meta.author': 'Auteur',
      'meta.articles': 'articles',
      'meta.read-more': 'Lire la suite',
      'meta.share': 'Partager',
      'meta.bookmark': 'Marquer',

      // Categories
      'category.data-analytics': 'Data Analytics',
      'category.data-analytics.desc': 'Articles sur l\'analyse de données',
      'category.data-science': 'Data Science',
      'category.data-science.desc': 'Science des données et ML',
      'category.ai': 'Intelligence Artificielle',
      'category.ai.desc': 'IA et apprentissage automatique',
      'category.data-engineering': 'Data Engineering',
      'category.data-engineering.desc': 'Pipelines et architectures',
      'category.bi': 'Business Intelligence',
      'category.bi.desc': 'BI et décisions stratégiques',

      // Topics
      'topic.data-analytics.desc': 'Analysez vos données et transformez-les en insights actionnables pour votre entreprise.',
      'topic.data-science.desc': 'Maîtrisez la science des données, le machine learning et l\'analyse prédictive.',
      'topic.ai.desc': 'Découvrez les dernières avancées en IA, LLM et applications génératives.',
      'topic.data-engineering.desc': 'Construisez des pipelines robustes et des architectures de données scalables.',
      'topic.bi.desc': 'Utilisez la BI pour prendre des décisions stratégiques basées sur les données.',

      // Common
      'common.required': 'requis',
      'common.loading': 'Chargement...',
      'common.error': 'Erreur',
      'common.success': 'Succès',
      'common.close': 'Fermer',
      'common.cancel': 'Annuler',
      'common.save': 'Enregistrer',
      'common.delete': 'Supprimer',
      'common.edit': 'Modifier',
      'common.share': 'Partager',
      'common.read-more': 'Lire la suite',
      'common.back': 'Retour',
      'common.next': 'Suivant',
      'common.previous': 'Précédent',
      'common.no-results': 'Aucun résultat trouvé',
      'common.search-results': 'Résultats de recherche',
      'common.filter-by': 'Filtrer par',
      'common.sort-by': 'Trier par',
      'common.view-all': 'Voir tout',
      'common.more': 'Plus',
      'common.less': 'Moins',

      // Footer
      'footer.about': 'À propos',
      'footer.contact': 'Contact',
      'footer.privacy': 'Confidentialité',
      'footer.terms': 'Conditions',
      'footer.follow': 'Suivez-nous',
      'footer.copyright': 'Tous droits réservés',
      'footer.powered': 'Propulsé par',

      // Errors
      'error.404.title': 'Page non trouvée',
      'error.404.message': 'La page que vous recherchez n\'existe pas ou a été déplacée.',
      'error.404.back': 'Retour à l\'accueil',
      'error.500.title': 'Erreur serveur',
      'error.500.message': 'Une erreur est survenue. Veuillez réessayer plus tard.',

      // Search
      'search.placeholder': 'Rechercher...',
      'search.no-results': 'Aucun résultat',
      'search.results': 'résultats trouvés',
      'search.suggestions': 'Suggestions',
      'search.recent': 'Recherches récentes',
      'search.clear': 'Effacer',

      // Forms
      'form.required': 'Ce champ est requis',
      'form.email.invalid': 'Veuillez entrer une adresse email valide',
      'form.minlength': 'Minimum {min} caractères requis',
      'form.maxlength': 'Maximum {max} caractères',
      'form.submit': 'Envoyer',
      'form.submitting': 'Envoi en cours...',
      'form.success': 'Message envoyé avec succès',
      'form.error': 'Une erreur est survenue',

      // Newsletter
      'newsletter.success': 'Inscription réussie !',
      'newsletter.error': 'Erreur lors de l\'inscription',
      'newsletter.already-subscribed': 'Vous êtes déjà inscrit',
      'newsletter.subscribing': 'Inscription...',

      // Social
      'social.share': 'Partager sur',
      'social.twitter': 'Twitter',
      'social.facebook': 'Facebook',
      'social.linkedin': 'LinkedIn',
      'social.whatsapp': 'WhatsApp',
      'social.copy': 'Copier le lien',
      'social.copied': 'Lien copié !',

      // Reading
      'reading.time': 'Temps de lecture',
      'reading.estimated': 'Temps estimé',
      'reading.minutes': 'minutes',
      'reading.views': 'vues',
      'reading.bookmark': 'Marquer',
      'reading.bookmarked': 'Marqué',
      'reading.share': 'Partager cet article',

      // Tags
      'tags.all': 'Tous les tags',
      'tags.popular': 'Tags populaires',
      'tags.recent': 'Tags récents',
      'tags.count': '{count} articles',

      // Posts
      'posts.latest': 'Derniers articles',
      'posts.popular': 'Articles populaires',
      'posts.related': 'Articles similaires',
      'posts.featured': 'Articles à la une',
      'posts.all': 'Tous les articles',
      'posts.no-posts': 'Aucun article trouvé',
      'posts.loading': 'Chargement des articles...',

      // Pagination
      'pagination.previous': 'Précédent',
      'pagination.next': 'Suivant',
      'pagination.page': 'Page',
      'pagination.of': 'sur',

      // Comments
      'comments.title': 'Commentaires',
      'comments.no-comments': 'Aucun commentaire',
      'comments.add': 'Ajouter un commentaire',
      'comments.name': 'Nom',
      'comments.email': 'Email',
      'comments.message': 'Message',
      'comments.submit': 'Publier',
      'comments.loading': 'Chargement...',

      // Breadcrumbs
      'breadcrumbs.home': 'Accueil',
      'breadcrumbs.you-are-here': 'Vous êtes ici',

      // Accessibility
      'a11y.skip-content': 'Aller au contenu principal',
      'a11y.menu': 'Menu principal',
      'a11y.close': 'Fermer',
      'a11y.open': 'Ouvrir',
      'a11y.search': 'Rechercher',
      'a11y.language': 'Changer la langue',
      'a11y.theme': 'Changer le thème',

      // Actions
      'action.read-more': 'Lire la suite',
      'action.view-all': 'Voir tout',
      'action.load-more': 'Charger plus',
      'action.show-less': 'Afficher moins',
      'action.filter': 'Filtrer',
      'action.clear': 'Effacer',
      'action.reset': 'Réinitialiser',
      'action.apply': 'Appliquer',
      'action.cancel': 'Annuler',
      'action.save': 'Enregistrer',
      'action.delete': 'Supprimer',
      'action.edit': 'Modifier',
      'action.share': 'Partager',
      'action.print': 'Imprimer',
      'action.download': 'Télécharger',
      'action.copy': 'Copier',
      'action.close': 'Fermer'
    },
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.tags': 'Tags',
      'nav.projects': 'Projects',
      'nav.explore': 'Explore',
      'nav.contact': 'Contact',
      'nav.categories': 'Categories',
      'nav.all-categories': 'All Categories',
      'nav.search': 'Search',
      'nav.menu': 'Menu',

      // Hero Section
      'hero.title.part1': 'Explore the world',
      'hero.title.part2': 'of Data and AI',
      'hero.subtitle': 'Discover the world of data through our blog: its trends, tools, and opportunities. From machine learning to data-driven decisions, we offer informative and engaging content.',
      'hero.search.placeholder': 'Search for an article, tag, category...',
      'hero.search.button': 'Search',
      'hero.search.aria': 'Search for an article',

      // Filters
      'filters.all': 'All articles',
      'filters.data-analytics': 'Data Analytics',
      'filters.data-science': 'Data Science',
      'filters.ai': 'Artificial Intelligence',
      'filters.data-engineering': 'Data Engineering',
      'filters.bi': 'Business Intelligence',
      'filters.aria': 'Article filters',

      // Sections
      'section.latest-posts': 'Latest Articles',
      'section.latest-posts.link': 'View all articles',
      'section.featured': 'Featured Articles',
      'section.featured.subtitle': 'Discover our most popular and recent articles',
      'section.categories': 'Browse by Category',
      'section.categories.subtitle': 'Quickly find articles that interest you',
      'section.popular-topics': 'Popular Topics',
      'section.popular-topics.subtitle': 'Explore our most viewed topics and quickly find what interests you',
      'section.tags-cloud': 'All Topics',
      'section.tags-cloud.subtitle': 'Explore all our topics and find exactly what you\'re looking for',
      'section.stats': 'Statistics',
      'section.stats.articles': 'Articles',
      'section.stats.categories': 'Categories',
      'section.stats.free': 'Free',
      'section.stats.available': 'Available',
      'section.cta.title': 'Ready to explore the world of Data?',
      'section.cta.description': 'Join our community and stay informed about the latest trends in Data Science and Artificial Intelligence',
      'section.cta.explore': 'Explore Articles',
      'section.cta.learn-more': 'Learn more',
      'section.newsletter.title': 'Receive our next articles',
      'section.newsletter.description': 'Subscribe to our newsletter to receive the latest articles directly in your inbox.',
      'section.newsletter.placeholder': 'Your email address',
      'section.newsletter.button': 'Subscribe',
      'section.newsletter.privacy': 'By subscribing, you accept our',
      'section.newsletter.privacy.link': 'privacy policy',
      'section.newsletter.help': 'Enter your email address to subscribe to the newsletter',
      'section.contact.title': 'Contact us',
      'section.contact.subtitle': 'Have a question? A project? Don\'t hesitate to contact us. We\'re here to help.',
      'section.contact.email': 'Email',
      'section.contact.email.desc': 'Send us an email and we\'ll respond as soon as possible.',
      'section.contact.phone': 'Phone',
      'section.contact.phone.desc': 'Call us to discuss your project or get information.',
      'section.contact.location': 'Location',
      'section.contact.location.desc': 'Find us at our office for an in-person meeting.',
      'section.contact.form.title': 'Send us a message',
      'section.contact.form.name': 'Full name',
      'section.contact.form.name.placeholder': 'Your name',
      'section.contact.form.email': 'Email',
      'section.contact.form.email.placeholder': 'your@email.com',
      'section.contact.form.subject': 'Subject',
      'section.contact.form.subject.placeholder': 'Subject of your message',
      'section.contact.form.message': 'Message',
      'section.contact.form.message.placeholder': 'Your message...',
      'section.contact.form.submit': 'Send message',

      // Meta
      'meta.reading-time': 'min read',
      'meta.views': 'views',
      'meta.date': 'Date',
      'meta.author': 'Author',
      'meta.articles': 'articles',
      'meta.read-more': 'Read more',
      'meta.share': 'Share',
      'meta.bookmark': 'Bookmark',

      // Categories
      'category.data-analytics': 'Data Analytics',
      'category.data-analytics.desc': 'Articles on data analysis',
      'category.data-science': 'Data Science',
      'category.data-science.desc': 'Data science and ML',
      'category.ai': 'Artificial Intelligence',
      'category.ai.desc': 'AI and machine learning',
      'category.data-engineering': 'Data Engineering',
      'category.data-engineering.desc': 'Pipelines and architectures',
      'category.bi': 'Business Intelligence',
      'category.bi.desc': 'BI and strategic decisions',

      // Topics
      'topic.data-analytics.desc': 'Analyze your data and turn it into actionable insights for your business.',
      'topic.data-science.desc': 'Master data science, machine learning, and predictive analytics.',
      'topic.ai.desc': 'Discover the latest advances in AI, LLMs, and generative applications.',
      'topic.data-engineering.desc': 'Build robust pipelines and scalable data architectures.',
      'topic.bi.desc': 'Use BI to make strategic data-driven decisions.',

      // Common
      'common.required': 'required',
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.close': 'Close',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.share': 'Share',
      'common.read-more': 'Read more',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.previous': 'Previous',
      'common.no-results': 'No results found',
      'common.search-results': 'Search results',
      'common.filter-by': 'Filter by',
      'common.sort-by': 'Sort by',
      'common.view-all': 'View all',
      'common.more': 'More',
      'common.less': 'Less',

      // Footer
      'footer.about': 'About',
      'footer.contact': 'Contact',
      'footer.privacy': 'Privacy',
      'footer.terms': 'Terms',
      'footer.follow': 'Follow us',
      'footer.copyright': 'All rights reserved',
      'footer.powered': 'Powered by',

      // Errors
      'error.404.title': 'Page not found',
      'error.404.message': 'The page you are looking for does not exist or has been moved.',
      'error.404.back': 'Back to home',
      'error.500.title': 'Server error',
      'error.500.message': 'An error occurred. Please try again later.',

      // Search
      'search.placeholder': 'Search...',
      'search.no-results': 'No results',
      'search.results': 'results found',
      'search.suggestions': 'Suggestions',
      'search.recent': 'Recent searches',
      'search.clear': 'Clear',

      // Forms
      'form.required': 'This field is required',
      'form.email.invalid': 'Please enter a valid email address',
      'form.minlength': 'Minimum {min} characters required',
      'form.maxlength': 'Maximum {max} characters',
      'form.submit': 'Submit',
      'form.submitting': 'Submitting...',
      'form.success': 'Message sent successfully',
      'form.error': 'An error occurred',

      // Newsletter
      'newsletter.success': 'Subscription successful!',
      'newsletter.error': 'Error during subscription',
      'newsletter.already-subscribed': 'You are already subscribed',
      'newsletter.subscribing': 'Subscribing...',

      // Social
      'social.share': 'Share on',
      'social.twitter': 'Twitter',
      'social.facebook': 'Facebook',
      'social.linkedin': 'LinkedIn',
      'social.whatsapp': 'WhatsApp',
      'social.copy': 'Copy link',
      'social.copied': 'Link copied!',

      // Reading
      'reading.time': 'Reading time',
      'reading.estimated': 'Estimated time',
      'reading.minutes': 'minutes',
      'reading.views': 'views',
      'reading.bookmark': 'Bookmark',
      'reading.bookmarked': 'Bookmarked',
      'reading.share': 'Share this article',

      // Tags
      'tags.all': 'All tags',
      'tags.popular': 'Popular tags',
      'tags.recent': 'Recent tags',
      'tags.count': '{count} articles',

      // Posts
      'posts.latest': 'Latest articles',
      'posts.popular': 'Popular articles',
      'posts.related': 'Related articles',
      'posts.featured': 'Featured articles',
      'posts.all': 'All articles',
      'posts.no-posts': 'No articles found',
      'posts.loading': 'Loading articles...',

      // Pagination
      'pagination.previous': 'Previous',
      'pagination.next': 'Next',
      'pagination.page': 'Page',
      'pagination.of': 'of',

      // Comments
      'comments.title': 'Comments',
      'comments.no-comments': 'No comments',
      'comments.add': 'Add a comment',
      'comments.name': 'Name',
      'comments.email': 'Email',
      'comments.message': 'Message',
      'comments.submit': 'Publish',
      'comments.loading': 'Loading...',

      // Breadcrumbs
      'breadcrumbs.home': 'Home',
      'breadcrumbs.you-are-here': 'You are here',

      // Accessibility
      'a11y.skip-content': 'Skip to main content',
      'a11y.menu': 'Main menu',
      'a11y.close': 'Close',
      'a11y.open': 'Open',
      'a11y.search': 'Search',
      'a11y.language': 'Change language',
      'a11y.theme': 'Change theme',

      // Actions
      'action.read-more': 'Read more',
      'action.view-all': 'View all',
      'action.load-more': 'Load more',
      'action.show-less': 'Show less',
      'action.filter': 'Filter',
      'action.clear': 'Clear',
      'action.reset': 'Reset',
      'action.apply': 'Apply',
      'action.cancel': 'Cancel',
      'action.save': 'Save',
      'action.delete': 'Delete',
      'action.edit': 'Edit',
      'action.share': 'Share',
      'action.print': 'Print',
      'action.download': 'Download',
      'action.copy': 'Copy',
      'action.close': 'Close'
    }
  };

  // Get current language
  function getCurrentLanguage() {
    const stored = localStorage.getItem('preferred-language');
    if (stored && (stored === 'fr' || stored === 'en')) {
      return stored;
    }

    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  }

  // Set language
  function setLanguage(lang) {
    if (lang !== 'fr' && lang !== 'en') {
      lang = 'en';
    }
    localStorage.setItem('preferred-language', lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    // Update meta tags
    const htmlLang = document.querySelector('html');
    if (htmlLang) {
      htmlLang.setAttribute('lang', lang);
    }

    translatePage(lang);
    updateLanguageSwitcher(lang);
    updatePageTitle(lang);
    updateMetaTags(lang);

    // Announce to screen reader
    if (window.announceToScreenReader) {
      window.announceToScreenReader(lang === 'fr' ? 'Langue changée en français' : 'Language changed to English');
    }
  }

  // Update page title
  function updatePageTitle(lang) {
    const t = translations[lang];
    if (!t) return;

    // Update title if it contains translatable content
    const title = document.querySelector('title');
    if (title) {
      const currentTitle = title.textContent;
      // You can add title translations here if needed
    }
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
    let alternateFr = document.querySelector('link[rel="alternate"][hreflang="fr"]');
    let alternateEn = document.querySelector('link[rel="alternate"][hreflang="en"]');

    if (!alternateFr) {
      alternateFr = document.createElement('link');
      alternateFr.setAttribute('rel', 'alternate');
      alternateFr.setAttribute('hreflang', 'fr');
      document.head.appendChild(alternateFr);
    }
    alternateFr.setAttribute('href', window.location.href);

    if (!alternateEn) {
      alternateEn = document.createElement('link');
      alternateEn.setAttribute('rel', 'alternate');
      alternateEn.setAttribute('hreflang', 'en');
      document.head.appendChild(alternateEn);
    }
    alternateEn.setAttribute('href', window.location.href);
  }

  // Translate page with automatic content detection
  function translatePage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (t[key]) {
        translateElement(element, t[key]);
      }
    });

    // Translate elements with data-i18n-html (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      if (t[key]) {
        element.innerHTML = t[key];
      }
    });

    // Translate aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      const key = element.getAttribute('data-i18n-aria');
      if (t[key]) {
        element.setAttribute('aria-label', t[key]);
      }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        element.setAttribute('placeholder', t[key]);
      }
    });

    // Translate title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
      const key = element.getAttribute('data-i18n-title');
      if (t[key]) {
        element.setAttribute('title', t[key]);
      }
    });

    // Auto-translate common patterns
    autoTranslateContent(lang, t);
  }

  // Translate element based on type
  function translateElement(element, translation) {
    if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'search')) {
      element.placeholder = translation;
    } else if (element.tagName === 'TEXTAREA') {
      element.placeholder = translation;
    } else if (element.tagName === 'BUTTON' || element.tagName === 'INPUT' && element.type === 'submit') {
      const span = element.querySelector('span');
      if (span) {
        span.textContent = translation;
      } else {
        element.textContent = translation;
      }
    } else {
      element.textContent = translation;
    }
  }

  // Auto-translate common content patterns
  function autoTranslateContent(lang, t) {
    // Translate common text patterns
    const patterns = [
      { selector: '.blog-card-meta .blog-card-date', key: 'meta.date' },
      { selector: '.blog-card-meta .blog-card-author', key: 'meta.author' },
      { selector: '.reading-time', key: 'reading.time' },
      { selector: '.view-count', key: 'reading.views' },
      { selector: '.read-more', key: 'action.read-more' },
      { selector: '.share-button', key: 'action.share' },
      { selector: '.bookmark-button', key: 'reading.bookmark' }
    ];

    patterns.forEach(pattern => {
      document.querySelectorAll(pattern.selector).forEach(element => {
        if (!element.hasAttribute('data-i18n')) {
          const text = element.textContent.trim();
          if (text && t[pattern.key]) {
            // Only translate if text matches expected pattern
            if (element.textContent.includes('min') || element.textContent.includes('vues') ||
                element.textContent.includes('Date') || element.textContent.includes('Auteur')) {
              // This is a simple pattern match - you can enhance this
            }
          }
        }
      });
    });
  }

  // Update language switcher UI
  function updateLanguageSwitcher(lang) {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;

    const buttons = switcher.querySelectorAll('button[data-lang]');
    buttons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  // Translate navigation automatically
  function translateNavigation(lang) {
    const t = translations[lang];
    if (!t) return;

    // Translate nav links
    const navLinks = {
      'Accueil': t['nav.home'],
      'À propos': t['nav.about'],
      'Tags': t['nav.tags'],
      'Projets': t['nav.projects'],
      'Explorer': t['nav.explore'],
      'Contact': t['nav.contact'],
      'Catégories': t['nav.categories'],
      'Toutes les catégories': t['nav.all-categories']
    };

    document.querySelectorAll('.navbar-databird-nav-link, .navbar-databird-mobile-nav-link').forEach(link => {
      const text = link.textContent.trim();
      if (navLinks[text] && !link.hasAttribute('data-i18n')) {
        link.textContent = navLinks[text];
      }
    });
  }

  // Initialize
  function init() {
    const currentLang = getCurrentLanguage();
    setLanguage(currentLang);

    // Add event listeners to language switcher buttons
    document.querySelectorAll('.language-switcher button[data-lang]').forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        setLanguage(lang);

        // Dispatch language changed event
        document.dispatchEvent(new CustomEvent('languageChanged', {
          detail: { language: lang }
        }));
      });
    });

    // Watch for dynamically added content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          const currentLang = getCurrentLanguage();
          translatePage(currentLang);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Translate navigation on load
    translateNavigation(currentLang);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.languageSwitcher = {
    setLanguage,
    getCurrentLanguage,
    translate: function(key, params = {}) {
      const lang = getCurrentLanguage();
      let translation = translations[lang] && translations[lang][key] ? translations[lang][key] : key;

      // Replace placeholders
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });

      return translation;
    },
    getTranslations: function() {
      return translations[getCurrentLanguage()];
    }
  };

})();
