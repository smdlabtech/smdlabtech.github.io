/**
 * Ultimate Enhancements JavaScript
 * Fonctionnalités ultimes et innovantes
 */

(function() {
  'use strict';

  // ============================================
  // Thèmes Personnalisés Avancés
  // ============================================
  function initThemeSelector() {
    const themeBtn = document.createElement('button');
    themeBtn.className = 'focus-mode-btn';
    themeBtn.style.bottom = '200px';
    themeBtn.innerHTML = '<i class="fas fa-palette"></i>';
    themeBtn.setAttribute('aria-label', 'Sélecteur de thème');
    document.body.appendChild(themeBtn);

    const themeSelector = document.createElement('div');
    themeSelector.className = 'theme-selector';
    themeSelector.innerHTML = `
      <h4 style="margin: 0 0 1rem 0; font-size: 1rem;">Thèmes</h4>
      <div class="theme-option" data-theme="default">
        <div class="theme-preview" style="background: linear-gradient(135deg, #f5f6fa 0%, #ffffff 50%, #008AFF 50%, #0085A1 100%);"></div>
        <span>Par défaut</span>
      </div>
      <div class="theme-option" data-theme="ocean">
        <div class="theme-preview" style="background: linear-gradient(135deg, #f5f6fa 0%, #ffffff 50%, #00a8ff 50%, #0097e6 100%);"></div>
        <span>Océan</span>
      </div>
      <div class="theme-option" data-theme="sunset">
        <div class="theme-preview" style="background: linear-gradient(135deg, #fff5f5 0%, #ffffff 50%, #ff6b6b 50%, #ee5a6f 100%);"></div>
        <span>Coucher de soleil</span>
      </div>
      <div class="theme-option" data-theme="forest">
        <div class="theme-preview" style="background: linear-gradient(135deg, #f0fff4 0%, #ffffff 50%, #00b894 50%, #00a085 100%);"></div>
        <span>Forêt</span>
      </div>
      <div class="theme-option" data-theme="purple">
        <div class="theme-preview" style="background: linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #a29bfe 50%, #6c5ce7 100%);"></div>
        <span>Violet</span>
      </div>
    `;
    document.body.appendChild(themeSelector);

    themeBtn.addEventListener('click', () => {
      themeSelector.classList.toggle('visible');
    });

    const savedTheme = localStorage.getItem('custom-theme') || 'default';
    applyTheme(savedTheme);

    themeSelector.querySelectorAll('.theme-option').forEach(option => {
      if (option.dataset.theme === savedTheme) {
        option.classList.add('active');
      }

      option.addEventListener('click', () => {
        themeSelector.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        const theme = option.dataset.theme;
        applyTheme(theme);
        localStorage.setItem('custom-theme', theme);
      });
    });
  }

  function applyTheme(theme) {
    document.documentElement.classList.remove('theme-ocean', 'theme-sunset', 'theme-forest', 'theme-purple');
    if (theme !== 'default') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  }

  // ============================================
  // Highlights Colorés Persistants
  // ============================================
  function initColorHighlights() {
    const toolbar = document.createElement('div');
    toolbar.className = 'highlight-toolbar';
    toolbar.innerHTML = `
      <button class="highlight-color-btn yellow" data-color="yellow" aria-label="Jaune"></button>
      <button class="highlight-color-btn blue" data-color="blue" aria-label="Bleu"></button>
      <button class="highlight-color-btn green" data-color="green" aria-label="Vert"></button>
      <button class="highlight-color-btn pink" data-color="pink" aria-label="Rose"></button>
      <button class="highlight-color-btn" style="background: var(--color-bg-primary); border-color: var(--color-link);" data-color="remove" aria-label="Retirer">
        <i class="fas fa-times" style="font-size: 0.75rem;"></i>
      </button>
    `;
    document.body.appendChild(toolbar);

    let selectedText = null;
    let selectedRange = null;

    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const text = selection.toString().trim();

      if (text.length > 5) {
        selectedText = text;
        selectedRange = selection.getRangeAt(0);
        const rect = selectedRange.getBoundingClientRect();
        
        toolbar.style.top = (rect.top - 50) + 'px';
        toolbar.style.left = rect.left + 'px';
        toolbar.classList.add('visible');
      }
    });

    toolbar.querySelectorAll('.highlight-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedRange) return;

        const color = btn.dataset.color;
        const span = document.createElement('span');
        
        if (color === 'remove') {
          // Retirer le highlight
          const parent = selectedRange.commonAncestorContainer.parentElement;
          if (parent.classList.contains('highlight-yellow') || 
              parent.classList.contains('highlight-blue') ||
              parent.classList.contains('highlight-green') ||
              parent.classList.contains('highlight-pink')) {
            const text = parent.textContent;
            parent.outerHTML = text;
          }
        } else {
          span.className = `highlight-${color}`;
          span.textContent = selectedText;
          
          try {
            selectedRange.deleteContents();
            selectedRange.insertNode(span);
            
            // Sauvegarder dans localStorage
            const articleId = window.location.pathname;
            const highlights = JSON.parse(localStorage.getItem(`highlights-${articleId}`) || '[]');
            highlights.push({
              text: selectedText,
              color: color,
              position: selectedRange.startOffset
            });
            localStorage.setItem(`highlights-${articleId}`, JSON.stringify(highlights));
          } catch (e) {
            console.error('Error highlighting:', e);
          }
        }

        toolbar.classList.remove('visible');
        window.getSelection().removeAllRanges();
        selectedText = null;
        selectedRange = null;
      });
    });

    // Charger les highlights sauvegardés
    loadSavedHighlights();
  }

  function loadSavedHighlights() {
    const articleId = window.location.pathname;
    const highlights = JSON.parse(localStorage.getItem(`highlights-${articleId}`) || '[]');
    
    // Cette fonction serait appelée au chargement de la page
    // pour restaurer les highlights (implémentation simplifiée)
  }

  // ============================================
  // Export PDF/Markdown
  // ============================================
  function initExportPanel() {
    const exportBtn = document.createElement('button');
    exportBtn.className = 'focus-mode-btn';
    exportBtn.style.bottom = '260px';
    exportBtn.innerHTML = '<i class="fas fa-download"></i>';
    exportBtn.setAttribute('aria-label', 'Exporter');
    document.body.appendChild(exportBtn);

    const exportPanel = document.createElement('div');
    exportPanel.className = 'export-panel';
    exportPanel.innerHTML = `
      <h4 style="margin: 0 0 1rem 0; font-size: 1rem;">Exporter</h4>
      <a href="#" class="export-btn" data-format="pdf">
        <i class="fas fa-file-pdf"></i>
        <span>PDF</span>
      </a>
      <a href="#" class="export-btn" data-format="markdown">
        <i class="fab fa-markdown"></i>
        <span>Markdown</span>
      </a>
      <a href="#" class="export-btn" data-format="html">
        <i class="fas fa-code"></i>
        <span>HTML</span>
      </a>
    `;
    document.body.appendChild(exportPanel);

    exportBtn.addEventListener('click', () => {
      exportPanel.classList.toggle('visible');
    });

    exportPanel.querySelectorAll('.export-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const format = btn.dataset.format;
        await exportArticle(format);
        exportPanel.classList.remove('visible');
      });
    });
  }

  async function exportArticle(format) {
    const article = document.querySelector('.blog-post');
    if (!article) return;

    const title = document.title;
    const content = article.innerHTML;
    const text = article.textContent;

    switch (format) {
      case 'pdf':
        // Utiliser une bibliothèque comme jsPDF ou window.print()
        window.print();
        showNotification('Utilisez la fonction d\'impression de votre navigateur pour sauvegarder en PDF', 'info');
        break;
      
      case 'markdown':
        // Convertir en Markdown (simplifié)
        const markdown = `# ${title}\n\n${text.replace(/\n\n+/g, '\n\n')}`;
        downloadFile(markdown, `${title.replace(/\s+/g, '-')}.md`, 'text/markdown');
        showNotification('Article exporté en Markdown !', 'success');
        break;
      
      case 'html':
        const html = `<!DOCTYPE html><html><head><title>${title}</title></head><body>${content}</body></html>`;
        downloadFile(html, `${title.replace(/\s+/g, '-')}.html`, 'text/html');
        showNotification('Article exporté en HTML !', 'success');
        break;
    }
  }

  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ============================================
  // Timeline de Lecture
  // ============================================
  function initReadingTimeline() {
    const blogPost = document.querySelector('.blog-post');
    if (!blogPost) return;

    const headings = blogPost.querySelectorAll('h2, h3');
    if (headings.length < 3) return;

    const timeline = document.createElement('div');
    timeline.className = 'reading-timeline';
    timeline.innerHTML = '<div class="timeline-line"></div>';
    document.body.appendChild(timeline);

    headings.forEach((heading, index) => {
      const dot = document.createElement('div');
      dot.className = 'timeline-dot';
      dot.dataset.title = heading.textContent.substring(0, 30);
      dot.dataset.id = heading.id || `heading-${index}`;
      timeline.appendChild(dot);

      dot.addEventListener('click', () => {
        const target = document.querySelector(`#${dot.dataset.id}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Observer pour highlight actif
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          timeline.querySelectorAll('.timeline-dot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.id === id) {
              dot.classList.add('active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    headings.forEach(heading => {
      if (!heading.id) heading.id = `heading-${headings.length}`;
      observer.observe(heading);
    });

    // Afficher après scroll
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        timeline.classList.add('visible');
      }
    }, { passive: true });
  }

  // ============================================
  // Dashboard Personnel
  // ============================================
  function initPersonalDashboard() {
    const dashboardBtn = document.createElement('button');
    dashboardBtn.className = 'focus-mode-btn';
    dashboardBtn.style.top = '120px';
    dashboardBtn.style.left = '2rem';
    dashboardBtn.innerHTML = '<i class="fas fa-chart-line"></i>';
    dashboardBtn.setAttribute('aria-label', 'Dashboard');
    document.body.appendChild(dashboardBtn);

    const dashboard = document.createElement('div');
    dashboard.className = 'personal-dashboard';
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h4 style="margin: 0; font-size: 1rem;">Mon Dashboard</h4>
        <button class="dashboard-close" style="background: none; border: none; cursor: pointer;">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="dashboard-content">
        <div class="dashboard-section">
          <h4>Statistiques</h4>
          <div class="dashboard-stat">
            <span class="dashboard-stat-label">Articles lus</span>
            <span class="dashboard-stat-value" id="articles-read">0</span>
          </div>
          <div class="dashboard-stat">
            <span class="dashboard-stat-label">Temps total</span>
            <span class="dashboard-stat-value" id="total-time">0 min</span>
          </div>
          <div class="dashboard-stat">
            <span class="dashboard-stat-label">Bookmarks</span>
            <span class="dashboard-stat-value" id="bookmarks-count">0</span>
          </div>
        </div>
        <div class="dashboard-section">
          <h4>Mes Bookmarks</h4>
          <div id="bookmarks-list"></div>
        </div>
      </div>
    `;
    document.body.appendChild(dashboard);

    dashboardBtn.addEventListener('click', () => {
      dashboard.classList.toggle('visible');
      updateDashboard();
    });

    dashboard.querySelector('.dashboard-close').addEventListener('click', () => {
      dashboard.classList.remove('visible');
    });

    function updateDashboard() {
      // Compter les bookmarks
      const bookmarks = Object.keys(localStorage)
        .filter(key => key.startsWith('bookmark-'))
        .length;
      document.getElementById('bookmarks-count').textContent = bookmarks;

      // Afficher les bookmarks
      const bookmarksList = document.getElementById('bookmarks-list');
      bookmarksList.innerHTML = '';
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('bookmark-')) {
          const url = key.replace('bookmark-', '');
          const item = document.createElement('div');
          item.className = 'bookmark-item';
          item.innerHTML = `
            <a href="${url}" class="bookmark-item-title">${url}</a>
            <span class="bookmark-item-date">Aujourd'hui</span>
          `;
          bookmarksList.appendChild(item);
        }
      });
    }
  }

  // ============================================
  // Mode Minimal Ultra
  // ============================================
  function initMinimalMode() {
    const minimalBtn = document.createElement('button');
    minimalBtn.className = 'focus-mode-btn';
    minimalBtn.style.bottom = '320px';
    minimalBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
    minimalBtn.setAttribute('aria-label', 'Mode minimal');
    document.body.appendChild(minimalBtn);

    const minimalMode = document.createElement('div');
    minimalMode.className = 'minimal-mode';
    minimalMode.style.display = 'none';
    document.body.appendChild(minimalMode);

    minimalBtn.addEventListener('click', () => {
      const blogPost = document.querySelector('.blog-post');
      if (!blogPost) return;

      minimalMode.innerHTML = `
        <div class="minimal-header">
          <h2 style="margin: 0; font-size: 1.25rem;">${document.title}</h2>
          <div class="minimal-controls">
            <div class="minimal-font-size">
              <button class="font-size-btn" data-size="small">A-</button>
              <button class="font-size-btn active" data-size="medium">A</button>
              <button class="font-size-btn" data-size="large">A+</button>
            </div>
            <button class="minimal-control-btn minimal-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        <div class="minimal-content">${blogPost.innerHTML}</div>
      `;

      minimalMode.style.display = 'block';
      document.body.style.overflow = 'hidden';

      // Font size controls
      minimalMode.querySelectorAll('.font-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          minimalMode.querySelectorAll('.font-size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const size = btn.dataset.size;
          const content = minimalMode.querySelector('.minimal-content');
          if (size === 'small') {
            content.style.fontSize = '1.25rem';
          } else if (size === 'large') {
            content.style.fontSize = '1.75rem';
          } else {
            content.style.fontSize = '1.5rem';
          }
        });
      });

      minimalMode.querySelector('.minimal-close').addEventListener('click', () => {
        minimalMode.style.display = 'none';
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape' && minimalMode.style.display === 'block') {
          minimalMode.style.display = 'none';
          document.body.style.overflow = '';
          document.removeEventListener('keydown', closeOnEscape);
        }
      });
    });
  }

  // ============================================
  // Search History
  // ============================================
  function initSearchHistory() {
    const searchModal = document.querySelector('.search-modal-advanced');
    if (!searchModal) return;

    const searchResults = searchModal.querySelector('.search-results');
    const historyContainer = document.createElement('div');
    historyContainer.className = 'search-history';
    historyContainer.innerHTML = '<h4 style="font-size: 0.875rem; margin-bottom: 0.5rem;">Historique</h4>';
    searchResults.parentNode.insertBefore(historyContainer, searchResults);

    function loadHistory() {
      const history = JSON.parse(localStorage.getItem('search-history') || '[]');
      historyContainer.innerHTML = '<h4 style="font-size: 0.875rem; margin-bottom: 0.5rem;">Historique</h4>';
      
      if (history.length === 0) {
        historyContainer.innerHTML += '<p style="font-size: 0.875rem; color: var(--color-text-muted);">Aucun historique</p>';
        return;
      }

      history.slice(0, 5).forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'search-history-item';
        historyItem.innerHTML = `
          <span class="search-history-query">${item.query}</span>
          <span class="search-history-date">${item.date}</span>
          <button class="search-history-clear" data-query="${item.query}">
            <i class="fas fa-times"></i>
          </button>
        `;
        historyContainer.appendChild(historyItem);

        historyItem.querySelector('.search-history-query').addEventListener('click', () => {
          searchModal.querySelector('.search-input').value = item.query;
          performSearch(item.query, searchResults);
        });

        historyItem.querySelector('.search-history-clear').addEventListener('click', (e) => {
          e.stopPropagation();
          const newHistory = history.filter(h => h.query !== item.query);
          localStorage.setItem('search-history', JSON.stringify(newHistory));
          loadHistory();
        });
      });
    }

    // Sauvegarder dans l'historique
    const originalPerformSearch = window.performSearch;
    window.performSearch = function(query, container) {
      if (originalPerformSearch) originalPerformSearch(query, container);
      
      const history = JSON.parse(localStorage.getItem('search-history') || '[]');
      const newItem = {
        query: query,
        date: new Date().toLocaleDateString('fr-FR')
      };
      const filtered = history.filter(h => h.query !== query);
      filtered.unshift(newItem);
      localStorage.setItem('search-history', JSON.stringify(filtered.slice(0, 10)));
      loadHistory();
    };

    loadHistory();
  }

  // ============================================
  // Page Transitions
  // ============================================
  function initPageTransitions() {
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    transition.innerHTML = '<div class="page-transition-slide"></div>';
    document.body.appendChild(transition);

    document.querySelectorAll('a[href^="/"], a[href^="http"]').forEach(link => {
      link.addEventListener('click', function(e) {
        if (this.href && !this.href.includes('#') && !this.target) {
          e.preventDefault();
          transition.classList.add('active');
          
          setTimeout(() => {
            window.location.href = this.href;
          }, 300);
        }
      });
    });
  }

  // ============================================
  // Notification System
  // ============================================
  function initNotificationSystem() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);

    window.showNotification = function(message, type = 'info', duration = 3000) {
      const notification = document.createElement('div');
      notification.className = 'notification-item';
      
      const icons = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
      };

      notification.innerHTML = `
        <div class="notification-icon ${type}">
          <i class="fas ${icons[type] || icons.info}"></i>
        </div>
        <div class="notification-content">
          <div class="notification-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
          <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      `;

      container.appendChild(notification);

      notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
      });

      setTimeout(() => {
        removeNotification(notification);
      }, duration);
    };

    function removeNotification(notification) {
      notification.style.animation = 'slideOutNotification 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }

    // Ajouter l'animation
    if (!document.querySelector('#notification-animations')) {
      const style = document.createElement('style');
      style.id = 'notification-animations';
      style.textContent = `
        @keyframes slideOutNotification {
          to {
            opacity: 0;
            transform: translateX(100px);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Initialize All
  // ============================================
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initThemeSelector();
    initColorHighlights();
    initExportPanel();
    initReadingTimeline();
    initPersonalDashboard();
    initMinimalMode();
    initSearchHistory();
    initPageTransitions();
    initNotificationSystem();
  }

  init();

})();
