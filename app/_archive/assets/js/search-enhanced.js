/**
 * Search Enhanced JavaScript
 * Recherche contextuelle améliorée
 */

(function() {
  'use strict';

  // Get current page context
  function getPageContext() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') return 'home';
    if (path.includes('/tags/')) return 'tags';
    if (path.includes('/posts/') || path.match(/\/\d{4}\/\d{2}\/\d{2}\//)) return 'post';
    if (path.includes('/about')) return 'about';
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/explore')) return 'explore';
    return 'general';
  }

  // Get all posts data
  function getAllPosts() {
    const posts = [];
    const postCards = document.querySelectorAll('.blog-card-databird, .featured-post-card, article');

    postCards.forEach(card => {
      const title = card.querySelector('h2, h3, .blog-card-title, .featured-post-title')?.textContent?.trim() || '';
      const excerpt = card.querySelector('.blog-card-excerpt, .featured-post-excerpt, p')?.textContent?.trim() || '';
      const link = card.querySelector('a[href]')?.getAttribute('href') || '';
      const tags = Array.from(card.querySelectorAll('.blog-card-tag, .featured-post-tag')).map(t => t.textContent.trim());
      const date = card.querySelector('.blog-card-date, .featured-post-meta')?.textContent?.trim() || '';

      if (title && link) {
        posts.push({
          title,
          excerpt,
          link,
          tags,
          date,
          type: 'post'
        });
      }
    });

    return posts;
  }

  // Get all tags
  function getAllTags() {
    const tags = [];
    const tagElements = document.querySelectorAll('.tag-cloud-item, .filter-tag, .blog-card-tag');

    tagElements.forEach(el => {
      const text = el.textContent.trim();
      const link = el.getAttribute('href') || el.closest('a')?.getAttribute('href') || '';
      if (text && !tags.find(t => t.name === text)) {
        tags.push({
          name: text,
          link,
          type: 'tag'
        });
      }
    });

    return tags;
  }

  // Get all categories
  function getAllCategories() {
    const categories = [];
    const categoryElements = document.querySelectorAll('.category-card, .topic-card-enhanced, .explore-category-card');

    categoryElements.forEach(el => {
      const title = el.querySelector('.category-title, .topic-title-enhanced, .explore-category-title')?.textContent?.trim() || '';
      const link = el.getAttribute('href') || el.closest('a')?.getAttribute('href') || '';
      const description = el.querySelector('.category-count, .topic-description-enhanced, .explore-category-description')?.textContent?.trim() || '';

      if (title && link) {
        categories.push({
          title,
          link,
          description,
          type: 'category'
        });
      }
    });

    return categories;
  }

  // Search function
  function search(query, context = 'all') {
    const results = [];
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) return results;

    // Search in posts
    if (context === 'all' || context === 'posts') {
      const posts = getAllPosts();
      posts.forEach(post => {
        const titleMatch = post.title.toLowerCase().includes(lowerQuery);
        const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
        const tagMatch = post.tags.some(tag => tag.toLowerCase().includes(lowerQuery));

        if (titleMatch || excerptMatch || tagMatch) {
          results.push({
            ...post,
            relevance: titleMatch ? 3 : (excerptMatch ? 2 : 1)
          });
        }
      });
    }

    // Search in tags
    if (context === 'all' || context === 'tags') {
      const tags = getAllTags();
      tags.forEach(tag => {
        if (tag.name.toLowerCase().includes(lowerQuery)) {
          results.push({
            ...tag,
            title: tag.name,
            relevance: 2
          });
        }
      });
    }

    // Search in categories
    if (context === 'all' || context === 'categories') {
      const categories = getAllCategories();
      categories.forEach(cat => {
        const titleMatch = cat.title.toLowerCase().includes(lowerQuery);
        const descMatch = cat.description.toLowerCase().includes(lowerQuery);

        if (titleMatch || descMatch) {
          results.push({
            ...cat,
            relevance: titleMatch ? 2 : 1
          });
        }
      });
    }

    // Sort by relevance
    results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));

    return results.slice(0, 10); // Top 10 results
  }

  // Highlight text
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<span class="search-suggestion-highlight">$1</span>');
  }

  // Create suggestion item HTML
  function createSuggestionHTML(item) {
    const icon = item.type === 'post' ? 'fa-file-alt' :
                 item.type === 'tag' ? 'fa-tag' :
                 item.type === 'category' ? 'fa-folder' : 'fa-search';

    const title = item.title || item.name || '';
    const meta = item.excerpt || item.description || item.date || '';

    return `
      <li class="search-suggestion-item" data-href="${item.link}">
        <div class="search-suggestion-icon">
          <i class="fas ${icon}"></i>
        </div>
        <div class="search-suggestion-content">
          <div class="search-suggestion-title">${highlightText(title, item.query || '')}</div>
          ${meta ? `<div class="search-suggestion-meta">${highlightText(meta, item.query || '')}</div>` : ''}
        </div>
      </li>
    `;
  }

  // Show suggestions
  function showSuggestions(query, context) {
    const searchInput = document.querySelector('#blog-search, #explore-search-input, .search-input-enhanced, input[type="search"]:focus');
    if (!searchInput) return;

    const searchBar = searchInput.closest('.search-bar-databird, .search-bar-enhanced, .search-input-wrapper');
    const parentContainer = searchBar?.parentElement || searchBar;
    const suggestionsContainer = parentContainer?.querySelector('.search-suggestions');
    if (!suggestionsContainer) return;

    if (!query || query.length < 2) {
      suggestionsContainer.classList.remove('visible');
      return;
    }

    const results = search(query, context);
    const list = suggestionsContainer.querySelector('.search-suggestions-list');

    if (!list) return;

    if (results.length === 0) {
      list.innerHTML = `
        <li class="search-suggestion-item" style="cursor: default; opacity: 0.6;">
          <div class="search-suggestion-content" style="text-align: center; width: 100%;">
            <div class="search-suggestion-title">Aucun résultat trouvé</div>
            <div class="search-suggestion-meta">Essayez avec d'autres mots-clés</div>
          </div>
        </li>
      `;
    } else {
      list.innerHTML = results.map(item => {
        item.query = query;
        return createSuggestionHTML(item);
      }).join('');

      // Add click handlers
      list.querySelectorAll('.search-suggestion-item[data-href]').forEach(item => {
        item.addEventListener('click', function() {
          const href = this.getAttribute('data-href');
          if (href) {
            window.location.href = href;
          }
        });
      });
    }

    suggestionsContainer.classList.add('visible');
  }

  // Initialize search
  function initSearch() {
    const searchInput = document.querySelector('#blog-search, #explore-search-input, .search-input-enhanced, input[type="search"]');
    if (!searchInput) return;

    const context = getPageContext();
    let searchBar = searchInput.closest('.search-bar-databird, .search-bar-enhanced, .search-input-wrapper');

    // If search-bar-databird, wrap it properly
    if (searchInput.closest('.search-bar-databird') && !searchInput.closest('.search-input-wrapper')) {
      const databirdBar = searchInput.closest('.search-bar-databird');
      const wrapper = document.createElement('div');
      wrapper.className = 'search-input-wrapper';
      wrapper.style.cssText = 'position: relative; display: flex; align-items: center; background: var(--db-bg); border: 2px solid var(--db-border); border-radius: 12px; padding: 0.875rem 1rem 0.875rem 3.5rem; transition: all 0.3s ease; box-shadow: 0 2px 8px var(--db-shadow);';

      // Move icon and input into wrapper
      const icon = databirdBar.querySelector('.search-icon, i.fa-search');
      if (icon) {
        icon.className = 'search-icon-enhanced';
        wrapper.appendChild(icon);
      }

      searchInput.classList.add('search-input-enhanced');
      wrapper.appendChild(searchInput);

      // Replace content
      databirdBar.innerHTML = '';
      databirdBar.appendChild(wrapper);
      databirdBar.classList.add('search-bar-enhanced');

      searchBar = wrapper;
    }

    // Create enhanced search structure if needed
    const parentContainer = searchBar.parentElement || searchBar;
    if (!parentContainer.querySelector('.search-suggestions')) {
      const suggestionsHTML = `
        <div class="search-suggestions">
          <div class="search-suggestions-header">Suggestions</div>
          <ul class="search-suggestions-list"></ul>
          <div class="search-suggestions-footer">
            <a href="/explore" class="search-suggestions-footer-link">
              Voir tous les résultats
              <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      `;

      if (parentContainer) {
        parentContainer.style.position = 'relative';
        parentContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
      }
    }

    // Add clear button
    if (!searchBar.querySelector('.search-clear-button')) {
      const clearButton = document.createElement('button');
      clearButton.className = 'search-clear-button';
      clearButton.setAttribute('aria-label', 'Effacer la recherche');
      clearButton.innerHTML = '<i class="fas fa-times"></i>';
      clearButton.addEventListener('click', () => {
        searchInput.value = '';
        searchInput.focus();
        showSuggestions('', context);
        updateClearButton();
      });
      searchBar.appendChild(clearButton);
    }

    const clearButton = searchBar.querySelector('.search-clear-button');

    // Update clear button visibility
    function updateClearButton() {
      if (clearButton) {
        if (searchInput.value.trim()) {
          clearButton.classList.add('visible');
        } else {
          clearButton.classList.remove('visible');
        }
      }
    }

    // Debounce function
    let debounceTimer;
    function debounce(func, wait) {
      return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), wait);
      };
    }

    // Search on input
    const debouncedSearch = debounce((query) => {
      showSuggestions(query, context);
      updateClearButton();
    }, 200);

    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      debouncedSearch(query);
    });

    // Handle Enter key
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          window.location.href = `/explore?q=${encodeURIComponent(query)}`;
        }
      }

      // Keyboard navigation
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = document.querySelectorAll('.search-suggestion-item[data-href]');
        const current = document.querySelector('.search-suggestion-item.active');
        let index = Array.from(items).indexOf(current);

        if (e.key === 'ArrowDown') {
          index = (index + 1) % items.length;
        } else {
          index = (index - 1 + items.length) % items.length;
        }

        items.forEach(item => item.classList.remove('active'));
        if (items[index]) {
          items[index].classList.add('active');
          items[index].scrollIntoView({ block: 'nearest' });
        }
      }

      if (e.key === 'Escape') {
        const parentContainer = searchBar.parentElement || searchBar;
        parentContainer.querySelector('.search-suggestions')?.classList.remove('visible');
        this.blur();
      }
    });

    // Close suggestions on outside click
    document.addEventListener('click', function(e) {
      const parentContainer = searchBar.parentElement || searchBar;
      if (!parentContainer.contains(e.target)) {
        parentContainer.querySelector('.search-suggestions')?.classList.remove('visible');
      }
    });

    // Handle URL search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlQuery = urlParams.get('q') || urlParams.get('search');
    if (urlQuery) {
      searchInput.value = urlQuery;
      showSuggestions(urlQuery, context);
      updateClearButton();
    }
  }

  // Initialize on page load
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      initSearch();
    }
  }

  init();

})();
