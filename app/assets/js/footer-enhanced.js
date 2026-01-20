/**
 * Footer Enhanced JavaScript
 * Fonctionnalités interactives pour le footer
 */

(function() {
  'use strict';

  // Back to Top Button
  function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'footer-back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Retour en haut');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopBtn);

    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to top on click
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Listen to scroll events
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop(); // Initial check
  }

  // Smooth scroll for footer links
  function initSmoothScroll() {
    const footerLinks = document.querySelectorAll('.footer-databird a[href^="#"]');
    
    footerLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initBackToTop();
      initSmoothScroll();
    });
  } else {
    initBackToTop();
    initSmoothScroll();
  }

})();
