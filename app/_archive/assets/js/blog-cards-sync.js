/**
 * Blog Cards Synchronization
 * Synchronisation de l'apparition des cartes blog (toutes ensemble)
 */

(function() {
  'use strict';

  // ============================================
  // Blog Cards - Toutes ensemble
  // ============================================

  function initBlogCardsSync() {
    const blogGrid = document.querySelector('#blog-posts, .blog-grid-databird');
    if (!blogGrid) return;

    const blogCards = blogGrid.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');
    if (blogCards.length === 0) return;

    // Initialiser l'état des cartes
    blogCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    // Observer pour le conteneur
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Toutes les cartes apparaissent ensemble
          blogCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });

          // Ajouter classe pour CSS
          blogGrid.classList.add('in-view');

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(blogGrid);

    // Si déjà visible au chargement
    if (blogGrid.getBoundingClientRect().top < window.innerHeight) {
      blogCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      blogGrid.classList.add('in-view');
    }
  }

  // ============================================
  // Filter Animation - Toutes ensemble
  // ============================================

  function initFilterAnimation() {
    const filterButtons = document.querySelectorAll('.filter-tag[data-filter]');
    const blogGrid = document.querySelector('#blog-posts, .blog-grid-databird');

    if (!blogGrid || filterButtons.length === 0) return;

    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();

        const filter = this.getAttribute('data-filter');
        const blogCards = blogGrid.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');

        // Mettre à jour l'état actif
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Filtrer et animer toutes les cartes ensemble
        blogCards.forEach(card => {
          const cardTag = card.querySelector('.blog-card-tag, .category-badge-enhanced')?.textContent.toLowerCase() || '';
          const matches = filter === 'all' || cardTag.includes(filter.replace('-', ' '));

          if (matches) {
            card.style.display = '';
            // Toutes les cartes visibles apparaissent ensemble
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
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
  // Initialize All
  // ============================================

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initBlogCardsSync();
    initFilterAnimation();
  }

  // Start initialization
  init();

  // Export API
  window.BlogCardsSync = {
    initBlogCardsSync,
    initFilterAnimation
  };

})();
