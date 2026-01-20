/**
 * Navbar Enhancements JavaScript
 * Améliorations interactives de la navbar
 */

(function() {
  'use strict';

  function initNavbarEnhancements() {
    const navbar = document.querySelector('.navbar-custom');
    if (!navbar) return;

    // Scroll effect
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > scrollThreshold) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Hide/show navbar on scroll (optional - décommenter si souhaité)
      // if (currentScroll > lastScroll && currentScroll > 100) {
      //   navbar.style.transform = 'translateY(-100%)';
      // } else {
      //   navbar.style.transform = 'translateY(0)';
      // }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Active link highlighting
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.startsWith(href + '/'))) {
        link.classList.add('active');
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbarEnhancements);
  } else {
    initNavbarEnhancements();
  }

})();
