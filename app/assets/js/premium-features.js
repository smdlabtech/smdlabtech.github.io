/**
 * Premium Features JavaScript
 * Fonctionnalités premium interactives
 */

(function() {
  'use strict';

  // Reading Time Calculation
  function calculateReadingTime() {
    const articles = document.querySelectorAll('article, .post-content-databird');
    
    articles.forEach(article => {
      const text = article.innerText || article.textContent;
      const words = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / 200); // 200 mots par minute
      
      const indicator = article.querySelector('.reading-time-indicator');
      if (indicator) {
        const timeText = readingTime === 1 ? 'minute' : 'minutes';
        indicator.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} ${timeText} de lecture`;
      }
    });
  }

  // View Counter (localStorage simulation)
  function incrementViewCounter() {
    const pageUrl = window.location.pathname;
    const viewKey = `views_${pageUrl}`;
    const views = parseInt(localStorage.getItem(viewKey) || '0', 10) + 1;
    localStorage.setItem(viewKey, views.toString());
    
    const viewCounter = document.querySelector('.view-counter');
    if (viewCounter) {
      const countElement = viewCounter.querySelector('.view-count');
      if (countElement) {
        countElement.textContent = views;
      }
    }
  }

  // Bookmark Functionality
  function initBookmarks() {
    const bookmarkButtons = document.querySelectorAll('.bookmark-button');
    
    bookmarkButtons.forEach(button => {
      const pageUrl = window.location.pathname;
      const bookmarkKey = `bookmark_${pageUrl}`;
      const isBookmarked = localStorage.getItem(bookmarkKey) === 'true';
      
      if (isBookmarked) {
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      }
      
      button.addEventListener('click', function() {
        const isActive = this.classList.contains('active');
        
        if (isActive) {
          this.classList.remove('active');
          localStorage.removeItem(bookmarkKey);
          this.setAttribute('aria-pressed', 'false');
          if (window.showToast) {
            window.showToast('Article retiré des favoris', 'info');
          }
        } else {
          this.classList.add('active');
          localStorage.setItem(bookmarkKey, 'true');
          this.setAttribute('aria-pressed', 'true');
          if (window.showToast) {
            window.showToast('Article ajouté aux favoris', 'success');
          }
        }
      });
    });
  }

  // Print Functionality
  function initPrint() {
    const printButtons = document.querySelectorAll('.print-button');
    
    printButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
      });
    });
  }

  // Reading Progress Circle
  function initReadingProgressCircle() {
    const circle = document.querySelector('.reading-progress-circle');
    if (!circle) return;
    
    const progressCircle = circle.querySelector('.reading-progress-circle-progress');
    const progressText = circle.querySelector('.reading-progress-circle-text');
    const circumference = 2 * Math.PI * 26; // radius = 26
    
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;
    
    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = scrollTop / (documentHeight - windowHeight);
      const offset = circumference - (scrollPercent * circumference);
      
      progressCircle.style.strokeDashoffset = offset;
      
      if (progressText) {
        progressText.textContent = Math.round(scrollPercent * 100) + '%';
      }
      
      if (scrollTop > 400) {
        circle.classList.add('visible');
      } else {
        circle.classList.remove('visible');
      }
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
    
    updateProgress();
  }

  // Back to Top Enhanced
  function initBackToTopEnhanced() {
    const button = document.querySelector('.back-to-top-enhanced');
    if (!button) return;
    
    function updateVisibility() {
      if (window.scrollY > 400) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }
    
    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();
    
    button.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Article Actions Bar
  function initArticleActionsBar() {
    const actionButtons = document.querySelectorAll('.article-action-button');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const action = this.dataset.action;
        
        switch(action) {
          case 'bookmark':
            // Handled by initBookmarks
            break;
          case 'share':
            if (navigator.share) {
              navigator.share({
                title: document.title,
                text: document.querySelector('meta[name="description"]')?.content || '',
                url: window.location.href
              });
            }
            break;
          case 'print':
            window.print();
            break;
        }
      });
    });
  }

  // Share Count (simulation)
  function initShareCount() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
      const platform = button.dataset.share;
      const pageUrl = window.location.pathname;
      const shareKey = `shares_${platform}_${pageUrl}`;
      const shares = parseInt(localStorage.getItem(shareKey) || '0', 10);
      
      if (shares > 0) {
        const badge = button.querySelector('.share-count-badge');
        if (badge) {
          badge.textContent = shares;
        }
      }
      
      button.addEventListener('click', function() {
        const newShares = shares + 1;
        localStorage.setItem(shareKey, newShares.toString());
        
        const badge = this.querySelector('.share-count-badge');
        if (badge) {
          badge.textContent = newShares;
        }
      });
    });
  }

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        calculateReadingTime();
        incrementViewCounter();
        initBookmarks();
        initPrint();
        initReadingProgressCircle();
        initBackToTopEnhanced();
        initArticleActionsBar();
        initShareCount();
      });
    } else {
      calculateReadingTime();
      incrementViewCounter();
      initBookmarks();
      initPrint();
      initReadingProgressCircle();
      initBackToTopEnhanced();
      initArticleActionsBar();
      initShareCount();
    }
  }

  init();

})();
