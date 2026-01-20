/**
 * Search Modal - JavaScript
 * Modal de recherche moderne avec raccourcis clavier
 */

(function() {
  'use strict';

  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let currentResults = [];
  let activeIndex = -1;

  // Create search modal
  function createSearchModal() {
    if (document.getElementById('search-modal')) return;

    const overlay = document.createElement('div');
    overlay.className = 'search-modal-overlay';
    overlay.id = 'search-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.id = 'search-modal';

    modal.innerHTML = `
      <div class="search-modal-header">
        <div class="search-modal-input-wrapper">
          <i class="fas fa-search search-modal-icon"></i>
          <input 
            type="search" 
            class="search-modal-input" 
            id="search-modal-input"
            placeholder="Rechercher un article, un tag, une catégorie..."
            autocomplete="off"
            aria-label="Recherche"
          >
        </div>
        <button class="search-modal-close" aria-label="Fermer" id="search-modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="search-modal-body" id="search-modal-body">
        <div class="search-modal-empty">
          <div class="search-modal-empty-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="search-modal-empty-title">Commencez à taper pour rechercher</div>
          <div class="search-modal-empty-description">
            Recherchez parmi les articles, tags et catégories
          </div>
        </div>
      </div>
      <div class="search-modal-footer">
        <div class="search-modal-shortcuts">
          <span class="search-modal-shortcut">
            <kbd>↑</kbd><kbd>↓</kbd> Naviguer
          </span>
          <span class="search-modal-shortcut">
            <kbd>Enter</kbd> Sélectionner
          </span>
          <span class="search-modal-shortcut">
            <kbd>Esc</kbd> Fermer
          </span>
        </div>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    searchModal = modal;
    searchInput = document.getElementById('search-modal-input');
    searchResults = document.getElementById('search-modal-body');

    // Event listeners
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeSearchModal();
      }
    });

    document.getElementById('search-modal-close').addEventListener('click', closeSearchModal);

    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
  }

  // Open search modal
  function openSearchModal() {
    createSearchModal();
    
    const overlay = document.getElementById('search-modal-overlay');
    const modal = document.getElementById('search-modal');
    
    overlay.classList.add('active');
    modal.classList.add('active');
    
    // Focus input after animation
    setTimeout(() => {
      searchInput.focus();
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close search modal
  function closeSearchModal() {
    const overlay = document.getElementById('search-modal-overlay');
    const modal = document.getElementById('search-modal');
    
    if (overlay && modal) {
      overlay.classList.remove('active');
      modal.classList.remove('active');
      
      // Clear search
      if (searchInput) {
        searchInput.value = '';
      }
      activeIndex = -1;
      currentResults = [];
      
      // Restore body scroll
      document.body.style.overflow = '';
    }
  }

  // Get all searchable content
  function getAllSearchableContent() {
    const content = {
      posts: [],
      tags: [],
      categories: []
    };

    // Get posts
    document.querySelectorAll('.blog-card-databird, .featured-post-card, article').forEach(card => {
      const title = card.querySelector('h2, h3, .blog-card-title, .featured-post-title')?.textContent?.trim() || '';
      const excerpt = card.querySelector('.blog-card-excerpt, .featured-post-excerpt, p')?.textContent?.trim() || '';
      const link = card.querySelector('a[href]')?.getAttribute('href') || '';
      const tags = Array.from(card.querySelectorAll('.blog-card-tag, .featured-post-tag')).map(t => t.textContent.trim());
      const date = card.querySelector('.blog-card-date, .featured-post-meta')?.textContent?.trim() || '';
      
      if (title && link) {
        content.posts.push({
          title,
          excerpt,
          link,
          tags,
          date,
          type: 'post'
        });
      }
    });

    // Get tags
    document.querySelectorAll('.tag-cloud-item, .filter-tag, .blog-card-tag').forEach(el => {
      const name = el.textContent.trim();
      const link = el.getAttribute('href') || el.closest('a')?.getAttribute('href') || '';
      if (name && !content.tags.find(t => t.name === name)) {
        content.tags.push({
          name,
          link,
          type: 'tag'
        });
      }
    });

    // Get categories
    document.querySelectorAll('.category-card, .topic-card-enhanced').forEach(el => {
      const title = el.querySelector('.category-title, .topic-title-enhanced')?.textContent?.trim() || '';
      const link = el.getAttribute('href') || el.closest('a')?.getAttribute('href') || '';
      if (title && link) {
        content.categories.push({
          title,
          link,
          type: 'category'
        });
      }
    });

    return content;
  }

  // Search function
  function search(query) {
    if (!query || query.length < 2) {
      return [];
    }

    const content = getAllSearchableContent();
    const results = [];
    const lowerQuery = query.toLowerCase().trim();

    // Search in posts
    content.posts.forEach(post => {
      const titleMatch = post.title.toLowerCase().includes(lowerQuery);
      const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
      const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
      
      if (titleMatch || excerptMatch || tagMatch) {
        results.push({
          ...post,
          relevance: titleMatch ? 3 : (excerptMatch ? 2 : 1),
          query: lowerQuery
        });
      }
    });

    // Search in tags
    content.tags.forEach(tag => {
      if (tag.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          ...tag,
          title: tag.name,
          relevance: 2,
          query: lowerQuery
        });
      }
    });

    // Search in categories
    content.categories.forEach(cat => {
      if (cat.title.toLowerCase().includes(lowerQuery)) {
        results.push({
          ...cat,
          relevance: 2,
          query: lowerQuery
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    return results.slice(0, 10);
  }

  // Highlight text
  function highlightText(text, query) {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<span class="search-modal-result-highlight">$1</span>');
  }

  // Create result item HTML
  function createResultHTML(item, index) {
    const icon = item.type === 'post' ? 'fa-file-alt' : 
                 item.type === 'tag' ? 'fa-tag' : 
                 item.type === 'category' ? 'fa-folder' : 'fa-search';
    
    const title = item.title || item.name || '';
    const meta = item.excerpt || item.date || item.description || '';
    const isActive = index === activeIndex;

    return `
      <div class="search-modal-result-item ${isActive ? 'active' : ''}" 
           data-href="${item.link}" 
           data-index="${index}">
        <div class="search-modal-result-icon">
          <i class="fas ${icon}"></i>
        </div>
        <div class="search-modal-result-content">
          <div class="search-modal-result-title">${highlightText(title, item.query || '')}</div>
          ${meta ? `
            <div class="search-modal-result-meta">
              ${item.type === 'post' && item.tags ? `
                ${item.tags.slice(0, 2).map(tag => `
                  <span class="search-modal-result-badge">${tag}</span>
                `).join('')}
              ` : ''}
              ${item.date ? `<span>${item.date}</span>` : ''}
              ${meta.length > 60 ? meta.substring(0, 60) + '...' : meta}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Display results
  function displayResults(results) {
    currentResults = results;
    activeIndex = -1;

    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search-modal-empty">
          <div class="search-modal-empty-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="search-modal-empty-title">Aucun résultat trouvé</div>
          <div class="search-modal-empty-description">
            Essayez avec d'autres mots-clés
          </div>
        </div>
      `;
      return;
    }

    const resultsHTML = `
      <ul class="search-modal-results">
        ${results.map((item, index) => `
          <li>${createResultHTML(item, index)}</li>
        `).join('')}
      </ul>
    `;

    searchResults.innerHTML = resultsHTML;

    // Add click handlers
    searchResults.querySelectorAll('.search-modal-result-item').forEach(item => {
      item.addEventListener('click', function() {
        const href = this.getAttribute('data-href');
        if (href) {
          window.location.href = href;
          closeSearchModal();
        }
      });
    });
  }

  // Handle search input
  function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = `
        <div class="search-modal-empty">
          <div class="search-modal-empty-icon">
            <i class="fas fa-search"></i>
          </div>
          <div class="search-modal-empty-title">Commencez à taper pour rechercher</div>
          <div class="search-modal-empty-description">
            Recherchez parmi les articles, tags et catégories
          </div>
        </div>
      `;
      return;
    }

    const results = search(query);
    displayResults(results);
  }

  // Handle keyboard navigation
  function handleSearchKeydown(e) {
    const results = searchResults.querySelectorAll('.search-modal-result-item');
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % results.length;
      updateActiveResult(results);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + results.length) % results.length;
      updateActiveResult(results);
    } else if (e.key === 'Enter' && activeIndex >= 0 && currentResults[activeIndex]) {
      e.preventDefault();
      const href = currentResults[activeIndex].link;
      if (href) {
        window.location.href = href;
        closeSearchModal();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearchModal();
    }
  }

  // Update active result
  function updateActiveResult(results) {
    results.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Initialize navbar search button
  function initNavbarSearchButton() {
    const searchButtons = document.querySelectorAll('.navbar-search-button, [data-search-trigger]');
    
    searchButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        openSearchModal();
      });
    });
  }

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  function initKeyboardShortcut() {
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    });
  }

  // Initialize
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initNavbarSearchButton();
        initKeyboardShortcut();
      });
    } else {
      initNavbarSearchButton();
      initKeyboardShortcut();
    }
  }

  init();

  // Export for global access
  window.openSearchModal = openSearchModal;
  window.closeSearchModal = closeSearchModal;

})();
