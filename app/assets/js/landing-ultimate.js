/**
 * Landing Page Ultimate JavaScript
 * Interactions et animations avancées pour la landing page
 */

(function() {
  'use strict';

  // Initialize all features
  function init() {
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffect();
    initCardReveal();
    initFilterAnimations();
    initSearchEnhancements();
    initIntersectionObserver();
  }

  // Scroll animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section-unified, .blog-card-databird, .stat-item-enhanced').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  // Counter animations
  function initCounterAnimations() {
    const counters = document.querySelectorAll('.stats-counter');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.dataset.target) || parseInt(counter.textContent.replace(/\D/g, ''));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '') + 
                                (counter.textContent.includes('%') ? '%' : '');
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + 
                                (counter.textContent.includes('%') ? '%' : '');
        }
      };
      
      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  // Parallax effect
  function initParallaxEffect() {
    const hero = document.querySelector('.hero-section-databird');
    if (!hero) return;

    let ticking = false;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.5;
      
      if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
      }
      
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // Card reveal animations (Toutes ensemble)
  function initCardReveal() {
    const cards = document.querySelectorAll('.blog-card-databird, .topic-card-enhanced, .category-card');
    
    const cardObserver = new IntersectionObserver((entries) => {
      // Toutes les cartes visibles apparaissent en même temps
      const visibleCards = entries.filter(entry => entry.isIntersecting);
      
      if (visibleCards.length > 0) {
        visibleCards.forEach(entry => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          cardObserver.unobserve(entry.target);
        });
      }
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px) scale(0.95)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      cardObserver.observe(card);
    });
  }

  // Filter animations
  function initFilterAnimations() {
    const filters = document.querySelectorAll('.filter-tag');
    const cards = document.querySelectorAll('.blog-card-databird');

    filters.forEach(filter => {
      filter.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all filters
        filters.forEach(f => f.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.dataset.filter;
        
        // Animate cards (Toutes ensemble)
        const matchingCards = [];
        cards.forEach((card) => {
          const cardTag = card.querySelector('.blog-card-tag')?.textContent.toLowerCase() || '';
          const matches = filterValue === 'all' || cardTag.includes(filterValue.replace('-', ' '));
          
          if (matches) {
            matchingCards.push(card);
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
        
        // Toutes les cartes correspondantes apparaissent ensemble
        matchingCards.forEach(card => {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        });
      });
    });
  }

  // Search enhancements
  function initSearchEnhancements() {
    const searchInput = document.getElementById('hero-search-input');
    const searchButton = document.querySelector('.hero-search-button');
    const searchWrapper = document.querySelector('.hero-search-wrapper');

    if (!searchInput || !searchButton) return;

    // Focus effect
    searchInput.addEventListener('focus', () => {
      searchWrapper.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', () => {
      searchWrapper.style.transform = 'scale(1)';
    });

    // Enter key to search
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch(searchInput.value);
      }
    });

    // Button click
    searchButton.addEventListener('click', () => {
      performSearch(searchInput.value);
    });

    function performSearch(query) {
      if (query.trim()) {
        // Trigger search modal or navigate
        if (window.searchModal && typeof window.searchModal.open === 'function') {
          window.searchModal.open(query);
        } else {
          window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
      }
    }
  }

  // Intersection Observer for all animations
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          
          // Tous les enfants apparaissent ensemble (pas de stagger)
          // Exclure les cartes de blog (gérées séparément)
          const children = entry.target.querySelectorAll('.stagger-item:not(.blog-card-databird):not(.blog-card-databird-enhanced)');
          children.forEach((child) => {
            child.classList.add('stagger-animate');
          });
          
          // Cartes de blog apparaissent toutes ensemble
          const blogCards = entry.target.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');
          if (blogCards.length > 0) {
            blogCards.forEach(card => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }
        }
      });
    }, observerOptions);

    // Observe sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
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

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      initSmoothScroll();
    });
  } else {
    init();
    initSmoothScroll();
  }

  // Export for global access
  window.landingUltimate = {
    init,
    initCounterAnimations,
    initCardReveal
  };

})();
