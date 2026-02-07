/**
 * Advanced Search with Suggestions
 * Recherche avancée avec suggestions en temps réel
 */

(function() {
  'use strict';

  function initAdvancedSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchBar = document.querySelector('.search-bar-databird');
    if (!searchInput || !searchBar) return;

    // Créer le container de suggestions
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.id = 'search-suggestions';
    searchBar.style.position = 'relative';
    searchBar.appendChild(suggestionsContainer);

    // Récupérer tous les posts
    const posts = Array.from(document.querySelectorAll('.blog-card-databird')).map(card => {
      const title = card.querySelector('.blog-card-title')?.textContent || '';
      const excerpt = card.querySelector('.blog-card-excerpt')?.textContent || '';
      const tag = card.querySelector('.blog-card-tag')?.textContent || '';
      const url = card.querySelector('.blog-card-title a')?.href || '';
      const image = card.querySelector('.blog-card-image')?.src || '';

      return { title, excerpt, tag, url, image };
    });

    let debounceTimer;

    searchInput.addEventListener('input', function(e) {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim().toLowerCase();

      if (query.length < 2) {
        suggestionsContainer.classList.remove('active');
        return;
      }

      debounceTimer = setTimeout(() => {
        showSuggestions(query, posts);
      }, 200);
    });

    // Fermer les suggestions au clic extérieur
    document.addEventListener('click', function(e) {
      if (!searchBar.contains(e.target)) {
        suggestionsContainer.classList.remove('active');
      }
    });

    // Navigation clavier
    searchInput.addEventListener('keydown', function(e) {
      const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
      const active = suggestionsContainer.querySelector('.suggestion-item.active');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (active) {
          const next = active.nextElementSibling || suggestions[0];
          active.classList.remove('active');
          next?.classList.add('active');
          next?.scrollIntoView({ block: 'nearest' });
        } else {
          suggestions[0]?.classList.add('active');
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (active) {
          const prev = active.previousElementSibling || suggestions[suggestions.length - 1];
          active.classList.remove('active');
          prev?.classList.add('active');
          prev?.scrollIntoView({ block: 'nearest' });
        } else {
          suggestions[suggestions.length - 1]?.classList.add('active');
        }
      } else if (e.key === 'Enter' && active) {
        e.preventDefault();
        active.click();
      }
    });
  }

  function showSuggestions(query, posts) {
    const suggestionsContainer = document.getElementById('search-suggestions');
    if (!suggestionsContainer) return;

    // Filtrer les posts
    const matches = posts
      .filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tag.toLowerCase().includes(query)
      )
      .slice(0, 5);

    if (matches.length === 0) {
      suggestionsContainer.innerHTML = `
        <div class="suggestion-item" style="cursor: default; color: var(--db-text-muted);">
          <div class="suggestion-content">
            <div class="suggestion-title">Aucun résultat trouvé</div>
          </div>
        </div>
      `;
      suggestionsContainer.classList.add('active');
      return;
    }

    // Générer les suggestions
    suggestionsContainer.innerHTML = matches.map(post => `
      <a href="${post.url}" class="suggestion-item">
        <div class="suggestion-icon">
          <i class="fas fa-file-alt"></i>
        </div>
        <div class="suggestion-content">
          <div class="suggestion-title">${highlightMatch(post.title, query)}</div>
          <div class="suggestion-meta">${post.tag} • ${post.excerpt.substring(0, 60)}...</div>
        </div>
      </a>
    `).join('');

    suggestionsContainer.classList.add('active');

    // Ajouter les event listeners
    suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('mouseenter', function() {
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark style="background: rgba(227, 30, 36, 0.2); padding: 0.125rem 0.25rem; border-radius: 4px;">$1</mark>');
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedSearch);
  } else {
    initAdvancedSearch();
  }

})();
