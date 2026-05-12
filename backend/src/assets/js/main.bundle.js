/**
 * MAIN BUNDLE JS - Version Consolidée
 * Plateforme Data & IA - smdlabtech
 *
 * Ce fichier regroupe toutes les fonctionnalités JavaScript essentielles
 *
 * Structure:
 * 1. Utilitaires & Helpers
 * 2. Theme System (Dark/Light Mode)
 * 3. Navigation & Scroll
 * 4. Search System
 * 5. Blog Features
 * 6. Forms & Newsletter
 * 7. Analytics & Tracking
 * 8. Performance Optimizations
 * 9. PWA & Service Worker
 * 10. Initialization
 */

(function() {
  'use strict';

  // ============================================
  // 1. UTILITAIRES & HELPERS
  // ============================================

  const Utils = {
    /**
     * Debounce function pour limiter les appels
     */
    debounce(func, wait = 300) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function pour limiter la fréquence
     */
    throttle(func, limit = 100) {
      let inThrottle;
      return function executedFunction(...args) {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    /**
     * Sélecteur DOM simplifié
     */
    $(selector, context = document) {
      return context.querySelector(selector);
    },

    $$(selector, context = document) {
      return Array.from(context.querySelectorAll(selector));
    },

    /**
     * Gestion des événements avec délégation
     */
    on(element, event, selector, handler) {
      if (typeof selector === 'function') {
        handler = selector;
        element.addEventListener(event, handler);
      } else {
        element.addEventListener(event, (e) => {
          const target = e.target.closest(selector);
          if (target) handler.call(target, e);
        });
      }
    },

    /**
     * Storage helpers avec fallback
     */
    storage: {
      get(key, defaultValue = null) {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : defaultValue;
        } catch {
          return defaultValue;
        }
      },
      set(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch {
          return false;
        }
      },
      remove(key) {
        try {
          localStorage.removeItem(key);
          return true;
        } catch {
          return false;
        }
      }
    },

    /**
     * Détection des features
     */
    supports: {
      localStorage: (() => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch { return false; }
      })(),
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window,
      webp: (() => {
        const canvas = document.createElement('canvas');
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      })()
    },

    /**
     * Génère un ID unique
     */
    uniqueId(prefix = 'id') {
      return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Formate une date
     */
    formatDate(date, locale = 'fr-FR') {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date(date));
    },

    /**
     * Calcule le temps de lecture
     */
    readingTime(text, wordsPerMinute = 200) {
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return minutes;
    }
  };

  // ============================================
  // 2. THEME SYSTEM (Dark/Light Mode)
  // ============================================

  const ThemeSystem = {
    STORAGE_KEY: 'theme-preference',
    DARK_CLASS: 'dark-mode',

    init() {
      this.applyTheme(this.getPreference());
      this.setupToggle();
      this.watchSystemPreference();
    },

    getPreference() {
      const stored = Utils.storage.get(this.STORAGE_KEY);
      if (stored) return stored;

      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    },

    setPreference(theme) {
      Utils.storage.set(this.STORAGE_KEY, theme);
      this.applyTheme(theme);
    },

    applyTheme(theme) {
      const isDark = theme === 'dark';
      document.body.classList.toggle(this.DARK_CLASS, isDark);
      document.documentElement.setAttribute('data-theme', theme);

      // Met à jour le meta theme-color
      const metaTheme = Utils.$('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.content = isDark ? '#0F172A' : '#FFFFFF';
      }

      // Met à jour l'icône du toggle
      this.updateToggleIcon(theme);
    },

    setupToggle() {
      const toggles = Utils.$$('[data-theme-toggle], .theme-toggle');
      toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
          const current = this.getPreference();
          const next = current === 'dark' ? 'light' : 'dark';
          this.setPreference(next);
        });
      });
    },

    updateToggleIcon(theme) {
      const toggles = Utils.$$('[data-theme-toggle], .theme-toggle');
      toggles.forEach(toggle => {
        const icon = toggle.querySelector('i, .theme-toggle-icon');
        if (icon) {
          icon.className = theme === 'dark'
            ? 'fas fa-sun theme-toggle-icon'
            : 'fas fa-moon theme-toggle-icon';
        }
      });
    },

    watchSystemPreference() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!Utils.storage.get(this.STORAGE_KEY)) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  };

  // ============================================
  // 3. NAVIGATION & SCROLL
  // ============================================

  const Navigation = {
    navbar: null,
    lastScrollY: 0,

    init() {
      this.navbar = Utils.$('.navbar-databird, .navbar');
      if (!this.navbar) return;

      this.setupScrollBehavior();
      this.setupMobileMenu();
      this.setupSmoothScroll();
    },

    setupScrollBehavior() {
      const handleScroll = Utils.throttle(() => {
        const currentScrollY = window.scrollY;

        // Ajoute la classe "scrolled" après 50px
        this.navbar.classList.toggle('scrolled', currentScrollY > 50);

        // Cache/affiche la navbar selon la direction du scroll
        if (currentScrollY > 200) {
          if (currentScrollY > this.lastScrollY) {
            this.navbar.style.transform = 'translateY(-100%)';
          } else {
            this.navbar.style.transform = 'translateY(0)';
          }
        }

        this.lastScrollY = currentScrollY;
      }, 100);

      window.addEventListener('scroll', handleScroll, { passive: true });
    },

    setupMobileMenu() {
      const toggle = Utils.$('.navbar-toggler, .mobile-menu-toggle');
      const menu = Utils.$('.navbar-mobile-menu, .navbar-collapse');

      if (!toggle || !menu) return;

      toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
        menu.classList.toggle('show');
        toggle.setAttribute('aria-expanded',
          toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
      });

      // Ferme le menu au clic sur un lien
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('active', 'show');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    },

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          const href = anchor.getAttribute('href');
          if (href === '#') return;

          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = this.navbar ? this.navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  };

  // ============================================
  // 4. SEARCH SYSTEM
  // ============================================

  const SearchSystem = {
    searchIndex: [],
    searchInput: null,
    resultsContainer: null,

    init() {
      this.searchInput = Utils.$('#hero-search-input, #search-input');
      this.resultsContainer = Utils.$('#hero-search-suggestions, #search-results');

      if (!this.searchInput) return;

      this.loadSearchIndex();
      this.setupEventListeners();
    },

    async loadSearchIndex() {
      try {
        // Charge l'index de recherche depuis les posts Jekyll
        const posts = Utils.$$('script[type="application/json"][data-posts]');
        if (posts.length > 0) {
          this.searchIndex = JSON.parse(posts[0].textContent);
        } else {
          // Fallback: extrait les articles du DOM
          this.searchIndex = this.extractPostsFromDOM();
        }
      } catch (error) {
        console.warn('Could not load search index:', error);
      }
    },

    extractPostsFromDOM() {
      const posts = [];
      Utils.$$('.blog-card-databird, article.post').forEach(card => {
        const titleEl = card.querySelector('.blog-card-title a, h2 a, h3 a');
        const excerptEl = card.querySelector('.blog-card-excerpt, .post-excerpt, p');
        const tagEl = card.querySelector('.blog-card-tag, .tag');

        if (titleEl) {
          posts.push({
            title: titleEl.textContent.trim(),
            url: titleEl.href,
            excerpt: excerptEl ? excerptEl.textContent.trim() : '',
            tag: tagEl ? tagEl.textContent.trim() : ''
          });
        }
      });
      return posts;
    },

    setupEventListeners() {
      const debouncedSearch = Utils.debounce((query) => {
        this.performSearch(query);
      }, 200);

      this.searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.clearResults();
          this.searchInput.blur();
        }
      });

      // Ferme les résultats au clic extérieur
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.hero-search-enhanced, .search-container')) {
          this.clearResults();
        }
      });
    },

    performSearch(query) {
      if (!query || query.length < 2) {
        this.clearResults();
        return;
      }

      const normalizedQuery = query.toLowerCase().trim();
      const results = this.searchIndex.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
        const excerptMatch = post.excerpt.toLowerCase().includes(normalizedQuery);
        const tagMatch = post.tag && post.tag.toLowerCase().includes(normalizedQuery);
        return titleMatch || excerptMatch || tagMatch;
      }).slice(0, 5);

      this.displayResults(results, query);
    },

    displayResults(results, query) {
      if (!this.resultsContainer) return;

      if (results.length === 0) {
        this.resultsContainer.innerHTML = `
          <div class="search-no-results">
            <p>Aucun résultat pour "<strong>${this.escapeHtml(query)}</strong>"</p>
          </div>
        `;
        this.resultsContainer.classList.add('active');
        return;
      }

      const html = results.map(post => `
        <a href="${post.url}" class="search-result-item">
          <div class="search-result-content">
            ${post.tag ? `<span class="search-result-tag">${this.escapeHtml(post.tag)}</span>` : ''}
            <h4 class="search-result-title">${this.highlightMatch(post.title, query)}</h4>
            <p class="search-result-excerpt">${this.highlightMatch(post.excerpt.substring(0, 100), query)}...</p>
          </div>
          <i class="fas fa-arrow-right search-result-arrow"></i>
        </a>
      `).join('');

      this.resultsContainer.innerHTML = html;
      this.resultsContainer.classList.add('active');
    },

    clearResults() {
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML = '';
        this.resultsContainer.classList.remove('active');
      }
    },

    highlightMatch(text, query) {
      if (!query) return this.escapeHtml(text);
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      return this.escapeHtml(text).replace(regex, '<mark>$1</mark>');
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
  };

  // ============================================
  // 5. BLOG FEATURES
  // ============================================

  const BlogFeatures = {
    init() {
      this.setupReadingProgress();
      this.setupTableOfContents();
      this.setupCopyCodeButtons();
      this.setupImageLightbox();
      this.setupReadingTime();
    },

    setupReadingProgress() {
      const progressBar = Utils.$('.reading-progress-bar');
      if (!progressBar) return;

      const article = Utils.$('article, .post-content');
      if (!article) return;

      const updateProgress = Utils.throttle(() => {
        const articleRect = article.getBoundingClientRect();
        const articleTop = articleRect.top + window.scrollY;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;

        const progress = Math.min(100, Math.max(0,
          ((scrollY - articleTop + windowHeight) / articleHeight) * 100
        ));

        progressBar.style.width = `${progress}%`;
      }, 50);

      window.addEventListener('scroll', updateProgress, { passive: true });
    },

    setupTableOfContents() {
      const toc = Utils.$('#post-toc-content, .js-toc');
      const content = Utils.$('.post-content, article');

      if (!toc || !content) return;

      const headings = content.querySelectorAll('h2, h3');
      if (headings.length === 0) return;

      const tocItems = [];

      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }

        tocItems.push({
          id: heading.id,
          text: heading.textContent,
          level: heading.tagName.toLowerCase()
        });
      });

      const tocHtml = tocItems.map(item => `
        <a href="#${item.id}" class="toc-item toc-${item.level}">
          ${item.text}
        </a>
      `).join('');

      toc.innerHTML = tocHtml;

      // Highlight active section
      if (Utils.supports.intersectionObserver) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              toc.querySelectorAll('.toc-item').forEach(item => {
                item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
              });
            }
          });
        }, { rootMargin: '-20% 0px -70% 0px' });

        headings.forEach(heading => observer.observe(heading));
      }
    },

    setupCopyCodeButtons() {
      Utils.$$('pre code').forEach(block => {
        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block.parentNode.removeChild(block).parentNode || block);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-btn';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.title = 'Copier le code';

        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(block.textContent);
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
              copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
          } catch (err) {
            console.error('Copy failed:', err);
          }
        });

        wrapper.appendChild(copyButton);
      });
    },

    setupImageLightbox() {
      const images = Utils.$$('.post-content img, article img');

      images.forEach(img => {
        if (img.closest('a')) return; // Skip if already wrapped in link

        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
          this.openLightbox(img.src, img.alt);
        });
      });
    },

    openLightbox(src, alt) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-backdrop"></div>
        <div class="lightbox-content">
          <img src="${src}" alt="${alt}">
          <button class="lightbox-close">&times;</button>
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      setTimeout(() => lightbox.classList.add('active'), 10);

      const close = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightbox.remove();
          document.body.style.overflow = '';
        }, 300);
      };

      lightbox.querySelector('.lightbox-backdrop').addEventListener('click', close);
      lightbox.querySelector('.lightbox-close').addEventListener('click', close);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') close();
      }, { once: true });
    },

    setupReadingTime() {
      const content = Utils.$('.post-content, article');
      const readingTimeEl = Utils.$('.reading-time, [data-reading-time]');

      if (content && readingTimeEl) {
        const minutes = Utils.readingTime(content.textContent);
        readingTimeEl.textContent = `${minutes} min de lecture`;
      }
    }
  };

  // ============================================
  // 6. FORMS & NEWSLETTER
  // ============================================

  const Forms = {
    init() {
      this.setupNewsletterForm();
      this.setupContactForm();
      this.setupFormValidation();
    },

    setupNewsletterForm() {
      const forms = Utils.$$('[data-newsletter-form], .newsletter-form');

      forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          const emailInput = form.querySelector('input[type="email"]');
          const submitBtn = form.querySelector('button[type="submit"]');
          const messageEl = form.querySelector('.newsletter-message');

          if (!this.validateEmail(emailInput.value)) {
            this.showMessage(messageEl, 'Veuillez entrer une adresse email valide.', 'error');
            return;
          }

          // Désactive le bouton pendant la soumission
          submitBtn.disabled = true;
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

          try {
            // Simuler l'envoi (à remplacer par votre API)
            await this.simulateApiCall();

            this.showMessage(messageEl, 'Merci ! Vous êtes inscrit à notre newsletter.', 'success');
            form.reset();

            // Track event
            Analytics.trackEvent('newsletter', 'subscribe', form.dataset.source || 'website');
          } catch (error) {
            this.showMessage(messageEl, 'Une erreur est survenue. Veuillez réessayer.', 'error');
          } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        });
      });
    },

    setupContactForm() {
      const form = Utils.$('#contact-form');
      if (!form) return;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('button[type="submit"]');
        const messageEl = form.querySelector('.form-message');

        if (!this.validateForm(form)) {
          this.showMessage(messageEl, 'Veuillez remplir tous les champs requis.', 'error');
          return;
        }

        submitBtn.disabled = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

        try {
          await this.simulateApiCall();

          this.showMessage(messageEl, 'Message envoyé avec succès ! Nous vous répondrons bientôt.', 'success');
          form.reset();

          Analytics.trackEvent('contact', 'submit', 'contact-form');
        } catch (error) {
          this.showMessage(messageEl, 'Une erreur est survenue. Veuillez réessayer.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      });
    },

    setupFormValidation() {
      Utils.$$('input, textarea').forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });

        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            this.validateField(input);
          }
        });
      });
    },

    validateField(field) {
      const isValid = field.checkValidity();
      field.classList.toggle('error', !isValid);
      field.classList.toggle('valid', isValid && field.value);
      return isValid;
    },

    validateForm(form) {
      const fields = form.querySelectorAll('input[required], textarea[required]');
      let isValid = true;

      fields.forEach(field => {
        if (!this.validateField(field)) {
          isValid = false;
        }
      });

      return isValid;
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    showMessage(element, message, type) {
      if (!element) return;

      element.textContent = message;
      element.className = `form-message ${type}`;
      element.style.display = 'block';

      if (type === 'success') {
        setTimeout(() => {
          element.style.display = 'none';
        }, 5000);
      }
    },

    simulateApiCall() {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  // ============================================
  // 7. ANALYTICS & TRACKING
  // ============================================

  const Analytics = {
    init() {
      this.setupPageTracking();
      this.setupClickTracking();
      this.setupScrollDepthTracking();
    },

    trackEvent(category, action, label = null, value = null) {
      // Google Analytics 4
      if (typeof gtag === 'function') {
        gtag('event', action, {
          event_category: category,
          event_label: label,
          value: value
        });
      }

      // Console log en dev
      if (window.location.hostname === 'localhost') {
        console.log(`[Analytics] ${category} / ${action}`, { label, value });
      }
    },

    setupPageTracking() {
      // Track page view on load
      this.trackEvent('page', 'view', window.location.pathname);
    },

    setupClickTracking() {
      // Track outbound links
      Utils.$$('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
          link.addEventListener('click', () => {
            this.trackEvent('outbound', 'click', link.href);
          });
        }
      });

      // Track CTA clicks
      Utils.$$('[data-track-click], .cta-button, .btn-primary').forEach(btn => {
        btn.addEventListener('click', () => {
          const label = btn.dataset.trackLabel || btn.textContent.trim();
          this.trackEvent('cta', 'click', label);
        });
      });
    },

    setupScrollDepthTracking() {
      const depths = [25, 50, 75, 100];
      const tracked = new Set();

      const checkDepth = Utils.throttle(() => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        depths.forEach(depth => {
          if (scrollPercent >= depth && !tracked.has(depth)) {
            tracked.add(depth);
            this.trackEvent('scroll', 'depth', `${depth}%`);
          }
        });
      }, 500);

      window.addEventListener('scroll', checkDepth, { passive: true });
    }
  };

  // ============================================
  // 8. PERFORMANCE OPTIMIZATIONS
  // ============================================

  const Performance = {
    init() {
      this.setupLazyLoading();
      this.prefetchLinks();
      this.reportWebVitals();
    },

    setupLazyLoading() {
      if (!Utils.supports.intersectionObserver) return;

      const lazyImages = Utils.$$('img[data-src], img[loading="lazy"]');

      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });

      lazyImages.forEach(img => imageObserver.observe(img));
    },

    prefetchLinks() {
      if (!Utils.supports.intersectionObserver) return;

      const linkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target;
            const href = link.getAttribute('href');

            if (href && href.startsWith('/') && !href.includes('#')) {
              const prefetchLink = document.createElement('link');
              prefetchLink.rel = 'prefetch';
              prefetchLink.href = href;
              document.head.appendChild(prefetchLink);
            }

            linkObserver.unobserve(link);
          }
        });
      });

      Utils.$$('a[href^="/"]').forEach(link => linkObserver.observe(link));
    },

    reportWebVitals() {
      // Report Core Web Vitals if available
      if ('web-vital' in window || typeof onCLS === 'function') {
        try {
          // LCP
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            Analytics.trackEvent('web-vitals', 'LCP', null, Math.round(lastEntry.startTime));
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          // FID
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
              Analytics.trackEvent('web-vitals', 'FID', null, Math.round(entry.processingStart - entry.startTime));
            });
          }).observe({ type: 'first-input', buffered: true });

          // CLS
          let clsValue = 0;
          new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          }).observe({ type: 'layout-shift', buffered: true });

          // Report CLS on page hide
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
              Analytics.trackEvent('web-vitals', 'CLS', null, Math.round(clsValue * 1000));
            }
          });
        } catch (e) {
          // Observer not supported
        }
      }
    }
  };

  // ============================================
  // 9. PWA & SERVICE WORKER
  // ============================================

  const PWA = {
    init() {
      this.registerServiceWorker();
      this.setupInstallPrompt();
    },

    async registerServiceWorker() {
      if (!Utils.supports.serviceWorker) return;

      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    },

    setupInstallPrompt() {
      let deferredPrompt;

      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;

        // Show install button if exists
        const installBtn = Utils.$('[data-install-pwa]');
        if (installBtn) {
          installBtn.style.display = 'block';
          installBtn.addEventListener('click', async () => {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            Analytics.trackEvent('pwa', 'install-prompt', outcome);
            deferredPrompt = null;
          });
        }
      });
    },

    showUpdateNotification() {
      const notification = document.createElement('div');
      notification.className = 'update-notification';
      notification.innerHTML = `
        <p>Une nouvelle version est disponible !</p>
        <button onclick="window.location.reload()">Mettre à jour</button>
      `;
      document.body.appendChild(notification);
    }
  };

  // ============================================
  // 10. INITIALIZATION
  // ============================================

  const App = {
    init() {
      // Core modules
      ThemeSystem.init();
      Navigation.init();

      // Features
      SearchSystem.init();
      BlogFeatures.init();
      Forms.init();

      // Performance & Analytics
      Performance.init();
      Analytics.init();

      // PWA
      PWA.init();

      // Expose utilities globally
      window.SMDLabTech = {
        Utils,
        ThemeSystem,
        Analytics,
        SearchSystem
      };

      console.log('🚀 SMDLabTech Platform initialized');
    }
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

})();
