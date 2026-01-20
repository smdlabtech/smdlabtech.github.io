/**
 * DataBird Inspired JavaScript
 * Fonctionnalités inspirées de la plateforme DataBird
 * Source: https://www.data-bird.co/blog/copilot-excel-ia
 */

(function() {
  'use strict';

  // ============================================
  // Enhanced Card Interactions
  // ============================================
  
  function initCardInteractions() {
    const cards = document.querySelectorAll('.category-card-databird, .blog-card-databird-enhanced');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
      
      // Add click tracking
      card.addEventListener('click', function() {
        const link = this.querySelector('a');
        if (link && !link.hasAttribute('data-no-track')) {
          // Track card click
          if (window.AnalyticsTracking) {
            window.AnalyticsTracking.trackEvent('card_click', {
              cardType: this.classList.contains('category-card-databird') ? 'category' : 'blog',
              title: this.querySelector('.category-card-title, .blog-card-title-databird')?.textContent || ''
            });
          }
        }
      });
    });
  }

  // ============================================
  // Smooth Section Transitions
  // ============================================
  
  function initSectionTransitions() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(section);
    });
  }

  // ============================================
  // Enhanced Button Interactions
  // ============================================
  
  function initButtonInteractions() {
    const buttons = document.querySelectorAll('.hero-databird-button, .cta-databird-button');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
      
      // Add ripple effect
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          left: ${x}px;
          top: ${y}px;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // ============================================
  // Category Filter Enhancement
  // ============================================
  
  function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('[data-category-filter]');
    const categoryCards = document.querySelectorAll('.category-card-databird');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const filter = this.getAttribute('data-category-filter');
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter cards
        categoryCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filter === 'all' || cardCategory === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ============================================
  // Blog Grid Animation (Toutes ensemble)
  // ============================================
  
  function initBlogGridStagger() {
    const blogCards = document.querySelectorAll('.blog-card-databird-enhanced, .blog-card-databird');
    
    if (blogCards.length === 0) return;
    
    // Trouver le conteneur parent (grid)
    const blogGrid = blogCards[0]?.closest('.blog-grid-databird, .stagger-container, #blog-posts');
    
    if (blogGrid) {
      // Observer le conteneur pour déclencher toutes les cartes ensemble
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Toutes les cartes apparaissent simultanément (pas de stagger)
            const cards = entry.target.querySelectorAll('.blog-card-databird-enhanced, .blog-card-databird');
            cards.forEach(card => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      // Initialiser l'état de toutes les cartes
      blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
      
      observer.observe(blogGrid);
    } else {
      // Fallback : observer individuellement mais toutes ensemble (sans setTimeout)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Apparition immédiate, pas de délai
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });
    }
  }

  // ============================================
  // Newsletter Form Enhancement
  // ============================================
  
  function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form-databird');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]')?.value;
      if (!email) return;
      
      const submitButton = this.querySelector('button[type="submit"]');
      const originalText = submitButton?.textContent;
      
      // Show loading state
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Inscription...';
      }
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        if (window.UltimateRefinements) {
          window.UltimateRefinements.showNotification(
            'Inscription réussie !',
            'Vous recevrez bientôt nos dernières actualités.',
            'success'
          );
        }
        
        this.reset();
      } catch (error) {
        if (window.UltimateRefinements) {
          window.UltimateRefinements.showNotification(
            'Erreur',
            'Une erreur est survenue. Veuillez réessayer.',
            'error'
          );
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  // ============================================
  // Scroll to Top Enhancement
  // ============================================
  
  function initScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top-databird';
    scrollButton.setAttribute('aria-label', 'Retour en haut');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      background: var(--ds-primary);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(227, 30, 36, 0.4);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
    `;
    
    document.body.appendChild(scrollButton);
    
    function toggleButton() {
      if (window.pageYOffset > 300) {
        scrollButton.style.opacity = '1';
        scrollButton.style.visibility = 'visible';
      } else {
        scrollButton.style.opacity = '0';
        scrollButton.style.visibility = 'hidden';
      }
    }
    
    window.addEventListener('scroll', throttle(toggleButton, 100), { passive: true });
    toggleButton();
    
    scrollButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
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

    initCardInteractions();
    initSectionTransitions();
    initButtonInteractions();
    initCategoryFilters();
    initBlogGridStagger();
    initNewsletterForm();
    initScrollToTop();
  }

  // Start initialization
  init();

  // Export API
  window.DataBirdInspired = {
    initCardInteractions,
    initSectionTransitions,
    initButtonInteractions,
    initCategoryFilters,
    initBlogGridStagger
  };

})();
