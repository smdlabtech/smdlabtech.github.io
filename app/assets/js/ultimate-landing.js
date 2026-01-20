/**
 * Ultimate Landing JavaScript
 * Fonctionnalités ultimes pour la landing page
 */

(function() {
  'use strict';

  // Scroll Progress Indicator
  function initScrollProgress() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-progress-indicator';
    document.body.appendChild(indicator);

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      indicator.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Floating Action Buttons
  function initFAB() {
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';
    
    // Scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'fab-button';
    scrollTopBtn.setAttribute('aria-label', 'Revenir en haut');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'fab-button secondary';
    themeBtn.setAttribute('aria-label', 'Changer de thème');
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    themeBtn.addEventListener('click', () => {
      const body = document.body;
      const isDark = body.classList.contains('dark-mode');
      if (isDark) {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
      } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
      }
    });
    
    // Check initial theme
    if (document.body.classList.contains('dark-mode')) {
      themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    fabContainer.appendChild(scrollTopBtn);
    fabContainer.appendChild(themeBtn);
    document.body.appendChild(fabContainer);

    // Show/hide scroll to top
    let ticking = false;
    function updateFABVisibility() {
      if (window.scrollY > 400) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.transform = 'scale(1)';
      } else {
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.transform = 'scale(0)';
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateFABVisibility);
        ticking = true;
      }
    }, { passive: true });
    
    updateFABVisibility();
  }

  // View Count Tracking
  function initViewCount() {
    const cards = document.querySelectorAll('.blog-card-databird, .featured-post-card');
    
    cards.forEach(card => {
      const link = card.querySelector('a[href]');
      if (!link) return;
      
      const url = link.getAttribute('href');
      const viewKey = `views_${url}`;
      const views = parseInt(localStorage.getItem(viewKey) || '0', 10) + 1;
      localStorage.setItem(viewKey, views.toString());
      
      // Add view count badge if views > 10
      if (views > 10) {
        const badge = document.createElement('span');
        badge.className = 'view-count-badge-landing';
        badge.innerHTML = `<i class="fas fa-eye"></i> ${views}`;
        badge.style.position = 'absolute';
        badge.style.top = '1rem';
        badge.style.left = '1rem';
        badge.style.zIndex = '10';
        
        const imageWrapper = card.querySelector('.blog-card-image-wrapper') || card;
        if (imageWrapper) {
          imageWrapper.style.position = 'relative';
          imageWrapper.appendChild(badge);
        }
      }
    });
  }

  // Featured Badge for Popular Posts
  function initFeaturedBadges() {
    const cards = document.querySelectorAll('.blog-card-databird, .featured-post-card');
    
    cards.forEach((card, index) => {
      if (index < 3) {
        const badge = document.createElement('span');
        badge.className = 'featured-post-badge';
        badge.textContent = 'À la Une';
        
        const imageWrapper = card.querySelector('.blog-card-image-wrapper') || 
                            card.querySelector('.blog-card-image')?.parentElement || 
                            card;
        if (imageWrapper) {
          imageWrapper.style.position = 'relative';
          imageWrapper.appendChild(badge);
        }
      }
    });
  }

  // Reading Time Calculation for Cards
  function initReadingTimeForCards() {
    // This would require fetching post content, so we'll use a placeholder
    const cards = document.querySelectorAll('.blog-card-databird');
    
    cards.forEach(card => {
      const excerpt = card.querySelector('.blog-card-excerpt');
      if (!excerpt) return;
      
      const text = excerpt.textContent || '';
      const words = text.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(words / 200));
      
      const badge = document.createElement('span');
      badge.className = 'reading-time-badge';
      badge.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min`;
      
      const meta = card.querySelector('.blog-card-meta');
      if (meta) {
        meta.appendChild(badge);
      }
    });
  }

  // Share Count Display
  function initShareCountDisplay() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
      const platform = button.dataset.share;
      const pageUrl = window.location.pathname;
      const shareKey = `shares_${platform}_${pageUrl}`;
      const shares = parseInt(localStorage.getItem(shareKey) || '0', 10);
      
      if (shares > 0) {
        const badge = document.createElement('span');
        badge.className = 'share-count-badge-landing';
        badge.textContent = shares;
        button.appendChild(badge);
      }
    });
  }

  // Card Image Lazy Loading with Placeholder
  function initLazyLoadWithPlaceholder() {
    const images = document.querySelectorAll('.blog-card-image[loading="lazy"]');
    
    images.forEach(img => {
      // Add placeholder gradient
      img.style.background = 'linear-gradient(135deg, var(--db-bg-secondary) 0%, var(--db-border) 100%)';
      
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.addEventListener('load', function() {
          this.style.transition = 'opacity 0.3s ease';
          this.style.opacity = '1';
        });
      }
    });
  }

  // Intersection Observer for All Animations
  function initIntersectionAnimations() {
    const animatedElements = document.querySelectorAll(
      '.blog-card-databird, .featured-post-card, .topic-card-enhanced, .category-card, .stat-item-enhanced'
    );
    
    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 50);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initScrollProgress();
        initFAB();
        initViewCount();
        initFeaturedBadges();
        initReadingTimeForCards();
        initShareCountDisplay();
        initLazyLoadWithPlaceholder();
        initIntersectionAnimations();
      });
    } else {
      initScrollProgress();
      initFAB();
      initViewCount();
      initFeaturedBadges();
      initReadingTimeForCards();
      initShareCountDisplay();
      initLazyLoadWithPlaceholder();
      initIntersectionAnimations();
    }
  }

  init();

})();
