/**
 * Expérience de Lecture JavaScript
 * Fonctionnalités pour améliorer l'expérience de lecture
 */

(function() {
  'use strict';

  // ============================================
  // Reading Progress Bar
  // ============================================
  
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    window.addEventListener('scroll', throttle(updateProgress, 16), { passive: true });
    updateProgress();
  }

  // ============================================
  // Table of Contents Highlight
  // ============================================
  
  function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.table-of-contents a[href^="#"]');
    const headings = Array.from(document.querySelectorAll('h2, h3, h4')).map(heading => {
      const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-');
      if (!heading.id) {
        heading.id = id;
      }
      return { id, element: heading };
    });
    
    if (tocLinks.length === 0 || headings.length === 0) return;
    
    function updateActiveTOC() {
      const scrollPosition = window.pageYOffset + 100;
      
      let activeHeading = null;
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading.element.offsetTop <= scrollPosition) {
          activeHeading = heading;
          break;
        }
      }
      
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
          link.classList.add('active');
        }
      });
    }
    
    window.addEventListener('scroll', throttle(updateActiveTOC, 100), { passive: true });
    updateActiveTOC();
    
    // Smooth scroll pour les liens TOC
    tocLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // ============================================
  // Reading Time Calculation
  // ============================================
  
  function calculateReadingTime() {
    const articleContent = document.querySelector('.article-content, .post-content, .reading-content');
    if (!articleContent) return;
    
    const text = articleContent.textContent || articleContent.innerText;
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200; // Average reading speed
    const minutes = Math.ceil(words / wordsPerMinute);
    
    const readingTimeElements = document.querySelectorAll('.reading-time-indicator, [data-reading-time]');
    readingTimeElements.forEach(element => {
      const timeText = element.querySelector('.reading-time-text') || element;
      if (timeText) {
        timeText.textContent = `${minutes} min de lecture`;
      }
    });
  }

  // ============================================
  // Focus Mode
  // ============================================
  
  function initFocusMode() {
    const focusModeBtn = document.querySelector('[data-focus-mode]');
    if (!focusModeBtn) return;
    
    focusModeBtn.addEventListener('click', function() {
      const article = document.querySelector('article, .article-content, .post-content');
      if (!article) return;
      
      const focusMode = document.createElement('div');
      focusMode.className = 'focus-mode';
      focusMode.innerHTML = `
        <button class="focus-mode-close" aria-label="Fermer le mode focus">
          <i class="fas fa-times"></i>
        </button>
        <div class="article-content">
          ${article.innerHTML}
        </div>
      `;
      
      document.body.appendChild(focusMode);
      document.body.style.overflow = 'hidden';
      
      // Close button
      const closeBtn = focusMode.querySelector('.focus-mode-close');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(focusMode);
        document.body.style.overflow = '';
      });
      
      // ESC key
      const escHandler = (e) => {
        if (e.key === 'Escape') {
          document.body.removeChild(focusMode);
          document.body.style.overflow = '';
          document.removeEventListener('keydown', escHandler);
        }
      };
      document.addEventListener('keydown', escHandler);
    });
  }

  // ============================================
  // Text Selection Share
  // ============================================
  
  function initTextSelectionShare() {
    let selectedText = '';
    
    document.addEventListener('mouseup', function() {
      const selection = window.getSelection();
      const text = selection.toString().trim();
      
      if (text.length > 10) {
        selectedText = text;
        // Afficher un bouton de partage pour le texte sélectionné
        showSelectionShareButton(selection);
      }
    });
    
    function showSelectionShareButton(selection) {
      // Implémentation du bouton de partage pour texte sélectionné
      // Peut être étendu pour partager sur Twitter, etc.
    }
  }

  // ============================================
  // Reading Statistics
  // ============================================
  
  function initReadingStatistics() {
    const articleContent = document.querySelector('.article-content, .post-content');
    if (!articleContent) return;
    
    const text = articleContent.textContent || articleContent.innerText;
    const words = text.trim().split(/\s+/).length;
    const characters = text.length;
    const paragraphs = articleContent.querySelectorAll('p').length;
    
    const statsElements = document.querySelectorAll('[data-reading-stats]');
    statsElements.forEach(element => {
      element.innerHTML = `
        <div class="reading-stat-item">
          <i class="fas fa-font"></i>
          <span>${words} mots</span>
        </div>
        <div class="reading-stat-item">
          <i class="fas fa-paragraph"></i>
          <span>${paragraphs} paragraphes</span>
        </div>
        <div class="reading-stat-item">
          <i class="fas fa-clock"></i>
          <span>${Math.ceil(words / 200)} min</span>
        </div>
      `;
    });
  }

  // ============================================
  // Smooth Scroll to Section
  // ============================================
  
  function initSmoothScrollToSection() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.offsetTop - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without scrolling
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ============================================
  // Throttle Helper
  // ============================================
  
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // ============================================
  // Initialize All
  // ============================================
  
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initReadingProgress();
    initTableOfContents();
    calculateReadingTime();
    initFocusMode();
    initTextSelectionShare();
    initReadingStatistics();
    initSmoothScrollToSection();
  }

  // Start initialization
  init();

  // Export API
  window.ReadingExperience = {
    calculateReadingTime,
    initFocusMode,
    initReadingStatistics
  };

})();
