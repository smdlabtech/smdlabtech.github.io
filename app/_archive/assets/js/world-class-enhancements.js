/**
 * World-Class Enhancements JavaScript
 * Fonctionnalités de niveau mondial
 */

(function() {
  'use strict';

  // ============================================
  // Table of Contents Flottante Intelligente
  // ============================================
  function initFloatingTOC() {
    const headings = document.querySelectorAll('.blog-post h2, .blog-post h3, .blog-post h4');
    if (headings.length < 2) return; // Pas besoin de TOC si moins de 2 headings

    // Créer le TOC
    const toc = document.createElement('div');
    toc.className = 'toc-floating';
    toc.innerHTML = '<h4>Table des matières</h4><ul></ul>';
    const tocList = toc.querySelector('ul');
    document.body.appendChild(toc);

    // Générer les liens
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      if (!heading.id) heading.id = id;

      const level = parseInt(heading.tagName.charAt(1)) - 2; // h2=0, h3=1, h4=2
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      a.style.setProperty('--level', level);
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // Intersection Observer pour highlight actif
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const tocLink = toc.querySelector(`a[href="#${id}"]`);
        if (tocLink) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            toc.querySelectorAll('a').forEach(link => link.classList.remove('active'));
            tocLink.classList.add('active');
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.5, 1]
    });

    headings.forEach(heading => observer.observe(heading));

    // Afficher le TOC après scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.pageYOffset > 300) {
            toc.classList.add('visible');
          } else {
            toc.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Smooth scroll pour les liens TOC
    toc.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 100;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ============================================
  // Focus Mode (Mode Lecture)
  // ============================================
  function initFocusMode() {
    const blogPost = document.querySelector('.blog-post');
    if (!blogPost) return;

    // Créer le bouton
    const focusBtn = document.createElement('button');
    focusBtn.className = 'focus-mode-btn';
    focusBtn.setAttribute('aria-label', 'Mode lecture');
    focusBtn.innerHTML = '<i class="fas fa-book-reader"></i>';
    document.body.appendChild(focusBtn);

    // Afficher après scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        focusBtn.classList.add('visible');
      } else {
        focusBtn.classList.remove('visible');
      }
    }, { passive: true });

    // Toggle focus mode
    focusBtn.addEventListener('click', () => {
      const focusMode = document.createElement('div');
      focusMode.className = 'focus-mode';
      focusMode.innerHTML = `
        <div class="focus-header">
          <h2>${document.title}</h2>
          <button class="focus-close" aria-label="Fermer le mode lecture">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="focus-content">${blogPost.innerHTML}</div>
      `;
      document.body.appendChild(focusMode);
      document.body.style.overflow = 'hidden';

      // Fermer
      focusMode.querySelector('.focus-close').addEventListener('click', () => {
        focusMode.remove();
        document.body.style.overflow = '';
      });

      // Fermer avec Escape
      const closeHandler = (e) => {
        if (e.key === 'Escape') {
          focusMode.remove();
          document.body.style.overflow = '';
          document.removeEventListener('keydown', closeHandler);
        }
      };
      document.addEventListener('keydown', closeHandler);
    });
  }

  // ============================================
  // Code Blocks avec Copy Button
  // ============================================
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code, .highlight');

    codeBlocks.forEach(block => {
      const pre = block.closest('pre') || block.parentElement;
      if (pre.classList.contains('code-enhanced')) return;
      pre.classList.add('code-enhanced');

      // Créer le wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // Créer le header
      const header = document.createElement('div');
      header.className = 'code-block-header';

      // Détecter le langage
      const lang = block.className.match(/language-(\w+)/)?.[1] ||
                  block.className.match(/(\w+)/)?.[1] ||
                  'code';

      header.innerHTML = `
        <span>${lang.toUpperCase()}</span>
        <div class="code-block-actions">
          <button class="code-copy-btn" aria-label="Copier le code">
            <i class="fas fa-copy"></i>
            <span>Copier</span>
          </button>
        </div>
      `;

      // Wrapper le pre
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // Copy functionality
      const copyBtn = header.querySelector('.code-copy-btn');
      copyBtn.addEventListener('click', async () => {
        const text = block.textContent || block.innerText;
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copié!</span>';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copier</span>';
          }, 2000);
        } catch (err) {
          // Fallback
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 2000);
        }
      });
    });
  }

  // ============================================
  // Système de Réactions
  // ============================================
  function initReactions() {
    const reactionsContainer = document.querySelector('.reactions-container');
    if (!reactionsContainer) return;

    const reactions = [
      { emoji: '👍', name: 'like' },
      { emoji: '❤️', name: 'love' },
      { emoji: '🎉', name: 'celebrate' },
      { emoji: '👏', name: 'clap' },
      { emoji: '💡', name: 'idea' }
    ];

    reactions.forEach(reaction => {
      const btn = document.createElement('button');
      btn.className = 'reaction-btn';
      btn.dataset.reaction = reaction.name;
      btn.innerHTML = `
        <span class="reaction-emoji">${reaction.emoji}</span>
        <span class="reaction-count">0</span>
      `;

      // Charger le count depuis localStorage
      const count = parseInt(localStorage.getItem(`reaction-${reaction.name}-${window.location.pathname}`)) || 0;
      btn.querySelector('.reaction-count').textContent = count;

      if (localStorage.getItem(`reaction-${reaction.name}-${window.location.pathname}-active`)) {
        btn.classList.add('active');
      }

      btn.addEventListener('click', () => {
        const isActive = btn.classList.contains('active');
        const countEl = btn.querySelector('.reaction-count');
        let count = parseInt(countEl.textContent);

        if (isActive) {
          count = Math.max(0, count - 1);
          btn.classList.remove('active');
          localStorage.removeItem(`reaction-${reaction.name}-${window.location.pathname}-active`);
        } else {
          count++;
          btn.classList.add('active');
          localStorage.setItem(`reaction-${reaction.name}-${window.location.pathname}-active`, 'true');
        }

        countEl.textContent = count;
        localStorage.setItem(`reaction-${reaction.name}-${window.location.pathname}`, count);
      });

      reactionsContainer.appendChild(btn);
    });
  }

  // ============================================
  // Recommandations d'Articles Similaires
  // ============================================
  function initRelatedPosts() {
    const relatedContainer = document.querySelector('.related-posts');
    if (!relatedContainer) return;

    // Simuler des articles similaires (dans un vrai projet, utiliser une API)
    const currentTags = Array.from(document.querySelectorAll('.blog-tags a'))
      .map(a => a.textContent.trim().toLowerCase());

    // Logique de recommandation basée sur les tags
    // Ici on simule, mais dans un vrai projet on ferait une requête
    console.log('Related posts would be calculated based on tags:', currentTags);
  }

  // ============================================
  // Parallax et Reveal Animations
  // ============================================
  function initRevealAnimations() {
    const revealElements = document.querySelectorAll(
      '.reveal-on-scroll, .reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-scale'
    );

    if (revealElements.length === 0) return;

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

    revealElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // Search Avancé avec Suggestions
  // ============================================
  function initAdvancedSearch() {
    const searchLink = document.getElementById('nav-search-link');
    if (!searchLink) return;

    // Créer le modal
    const modal = document.createElement('div');
    modal.className = 'search-modal-advanced';
    modal.innerHTML = `
      <div class="search-container">
        <div class="search-header">
          <i class="fas fa-search"></i>
          <input type="text" class="search-input" placeholder="Rechercher des articles..." autocomplete="off">
          <button class="search-close" aria-label="Fermer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="search-results"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const searchInput = modal.querySelector('.search-input');
    const searchResults = modal.querySelector('.search-results');
    const closeBtn = modal.querySelector('.search-close');

    // Ouvrir le modal
    searchLink.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      setTimeout(() => searchInput.focus(), 100);
    });

    // Fermer le modal
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Recherche avec debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length < 2) {
        searchResults.innerHTML = '';
        return;
      }

      searchTimeout = setTimeout(() => {
        performSearch(query, searchResults);
      }, 300);
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  function performSearch(query, container) {
    // Recherche simple dans les titres et contenus
    const articles = Array.from(document.querySelectorAll('.post-preview, .blog-post'));
    const results = [];

    articles.forEach(article => {
      const title = article.querySelector('h2, h1, .post-title')?.textContent || '';
      const content = article.textContent || '';
      const url = article.querySelector('a')?.href || window.location.href;

      if (title.toLowerCase().includes(query.toLowerCase()) ||
          content.toLowerCase().includes(query.toLowerCase())) {
        results.push({ title, content: content.substring(0, 150), url });
      }
    });

    // Afficher les résultats
    if (results.length === 0) {
      container.innerHTML = '<div class="search-result-item"><p>Aucun résultat trouvé</p></div>';
      return;
    }

    container.innerHTML = results.map(result => `
      <div class="search-result-item">
        <a href="${result.url}">
          <div class="search-result-title">${highlightText(result.title, query)}</div>
          <div class="search-result-excerpt">${highlightText(result.content, query)}...</div>
        </a>
      </div>
    `).join('');

    // Ajouter les event listeners
    container.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelector('.search-modal-advanced').classList.remove('active');
      });
    });
  }

  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
  }

  // ============================================
  // Link Preview Cards
  // ============================================
  function initLinkPreviews() {
    const links = document.querySelectorAll('.blog-post a[href^="http"]');

    links.forEach(link => {
      link.addEventListener('mouseenter', function() {
        if (this.dataset.previewLoaded) return;

        // Simuler un preview (dans un vrai projet, utiliser une API)
        // Pour l'instant, on ajoute juste une classe pour styling
        this.classList.add('has-preview');
        this.dataset.previewLoaded = 'true';
      });
    });
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initFloatingTOC();
    initFocusMode();
    enhanceCodeBlocks();
    initReactions();
    initRelatedPosts();
    initRevealAnimations();
    initAdvancedSearch();
    initLinkPreviews();
  }

  init();

})();
