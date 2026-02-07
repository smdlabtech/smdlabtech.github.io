/**
 * Language Switcher
 * Système de changement de langue FR/EN
 */

(function() {
  'use strict';

  // Translations
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

      // Hero Section
      'hero.title.part1': 'Explorez le monde',
      'hero.title.part2': 'Business Intelligence, Data Science, AI & Technologies',
      'hero.subtitle': 'Découvrez le monde de la donnée à travers notre blog : ses tendances, ses outils et ses opportunités. De l\'apprentissage automatique aux décisions basées sur la data, nous vous proposons un contenu informatif et captivant.',
      'hero.search.placeholder': 'Rechercher un article, un tag, une catégorie...',
      'hero.search.button': 'Rechercher',

      // Filters
      'filters.all': 'Tous les articles',
      'filters.data-analytics': 'Data Analytics',
      'filters.data-science': 'Data Science',
      'filters.ai': 'Intelligence Artificielle',
      'filters.data-engineering': 'Data Engineering',
      'filters.bi': 'Business Intelligence',

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
      'common.previous': 'Précédent'
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

      // Hero Section
      'hero.title.part1': 'Explore the world',
      'hero.title.part2': 'of Data and AI',
      'hero.subtitle': 'Discover the world of data through our blog: its trends, tools, and opportunities. From machine learning to data-driven decisions, we offer informative and engaging content.',
      'hero.search.placeholder': 'Search for an article, tag, category...',
      'hero.search.button': 'Search',

      // Filters
      'filters.all': 'All articles',
      'filters.data-analytics': 'Data Analytics',
      'filters.data-science': 'Data Science',
      'filters.ai': 'Artificial Intelligence',
      'filters.data-engineering': 'Data Engineering',
      'filters.bi': 'Business Intelligence',

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
      'common.previous': 'Previous'
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
    translatePage(lang);
    updateLanguageSwitcher(lang);
  }

  // Translate page
  function translatePage(lang) {
    const t = translations[lang];
    if (!t) return;

    // Translate elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (t[key]) {
        if (element.tagName === 'INPUT' && element.type === 'text' || element.type === 'email' || element.type === 'search') {
          element.placeholder = t[key];
        } else if (element.tagName === 'TEXTAREA') {
          element.placeholder = t[key];
        } else {
          element.textContent = t[key];
        }
      }
    });

    // Translate elements with data-i18n-html (for HTML content)
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      if (t[key]) {
        element.innerHTML = t[key];
      }
    });

    // Update page direction if needed (for RTL languages in future)
    document.documentElement.dir = 'ltr';
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

  // Initialize
  function init() {
    const currentLang = getCurrentLanguage();
    setLanguage(currentLang);

    // Add event listeners to language switcher buttons
    document.querySelectorAll('.language-switcher button[data-lang]').forEach(btn => {
      btn.addEventListener('click', function() {
        const lang = this.dataset.lang;
        setLanguage(lang);

        // Announce to screen reader
        if (window.announceToScreenReader) {
          window.announceToScreenReader(`Language changed to ${lang === 'fr' ? 'French' : 'English'}`);
        }
      });
    });
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
    translate: function(key) {
      const lang = getCurrentLanguage();
      return translations[lang] && translations[lang][key] ? translations[lang][key] : key;
    }
  };

})();
