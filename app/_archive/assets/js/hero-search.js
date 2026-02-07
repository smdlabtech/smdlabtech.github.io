/**
 * Hero Search - Landing Page
 * Recherche améliorée pour la landing page
 */

(function() {
  'use strict';

  function initHeroSearch() {
    const searchInput = document.getElementById('hero-search-input');
    const searchButton = document.querySelector('.hero-search-button');
    const suggestionsContainer = document.getElementById('hero-search-suggestions');

    if (!searchInput || !suggestionsContainer) return;

    // Get all searchable content
    function getAllContent() {
      const content = {
        posts: [],
        tags: [],
        categories: []
      };

      document.querySelectorAll('.blog-card-databird, .featured-post-card').forEach(card => {
        const title = card.querySelector('.blog-card-title, .featured-post-title')?.textContent?.trim() || '';
        const excerpt = card.querySelector('.blog-card-excerpt, .featured-post-excerpt')?.textContent?.trim() || '';
        const link = card.querySelector('a[href]')?.getAttribute('href') || '';
        const tags = Array.from(card.querySelectorAll('.blog-card-tag, .featured-post-tag')).map(t => t.textContent.trim());

        if (title && link) {
          content.posts.push({ title, excerpt, link, tags, type: 'post' });
        }
      });

      document.querySelectorAll('.tag-cloud-item, .filter-tag').forEach(el => {
        const name = el.textContent.trim();
        const link = el.getAttribute('href') || el.closest('a')?.getAttribute('href') || '';
        if (name && !content.tags.find(t => t.name === name)) {
          content.tags.push({ name, link, type: 'tag' });
        }
      });

      return content;
    }

    // Search function
    function search(query) {
      if (!query || query.length < 2) return [];

      const content = getAllContent();
      const results = [];
      const lowerQuery = query.toLowerCase().trim();

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

      content.tags.forEach(tag => {
        if (tag.name.toLowerCase().includes(lowerQuery)) {
          results.push({ ...tag, title: tag.name, relevance: 2, query: lowerQuery });
        }
      });

      results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
      return results.slice(0, 5);
    }

    // Highlight text
    function highlightText(text, query) {
      if (!query || !text) return text;
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<span class="search-suggestion-highlight">$1</span>');
    }

    // Display suggestions
    function showSuggestions(query) {
      if (!query || query.length < 2) {
        suggestionsContainer.classList.remove('visible');
        return;
      }

      const results = search(query);

      if (results.length === 0) {
        suggestionsContainer.innerHTML = `
          <div style="padding: 1.5rem; text-align: center; color: var(--db-text-secondary);">
            <i class="fas fa-search" style="font-size: 2rem; opacity: 0.3; margin-bottom: 0.75rem; display: block;"></i>
            <div>Aucun résultat trouvé</div>
          </div>
        `;
        suggestionsContainer.classList.add('visible');
        return;
      }

      const suggestionsHTML = results.map(item => {
        const icon = item.type === 'post' ? 'fa-file-alt' : 'fa-tag';
        return `
          <a href="${item.link}" class="search-suggestion-item" style="text-decoration: none; color: inherit;">
            <div class="search-suggestion-icon">
              <i class="fas ${icon}"></i>
            </div>
            <div class="search-suggestion-content">
              <div class="search-suggestion-title">${highlightText(item.title || item.name, item.query)}</div>
              ${item.excerpt ? `<div class="search-suggestion-meta">${highlightText(item.excerpt.substring(0, 60), item.query)}...</div>` : ''}
            </div>
          </a>
        `;
      }).join('');

      suggestionsContainer.innerHTML = suggestionsHTML;
      suggestionsContainer.classList.add('visible');
    }

    // Debounce
    let debounceTimer;
    function debounce(func, wait) {
      return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), wait);
      };
    }

    const debouncedSearch = debounce(showSuggestions, 200);

    // Event listeners
    searchInput.addEventListener('input', function(e) {
      debouncedSearch(e.target.value);
    });

    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = this.value.trim();
        if (query) {
          window.location.href = `/explore?q=${encodeURIComponent(query)}`;
        }
      } else if (e.key === 'Escape') {
        suggestionsContainer.classList.remove('visible');
        this.blur();
      }
    });

    if (searchButton) {
      searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `/explore?q=${encodeURIComponent(query)}`;
        } else {
          // Open search modal if empty
          if (window.openSearchModal) {
            window.openSearchModal();
          }
        }
      });
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!searchInput.closest('.hero-search-enhanced').contains(e.target)) {
        suggestionsContainer.classList.remove('visible');
      }
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSearch);
  } else {
    initHeroSearch();
  }

})();
