/**
 * Navigation Améliorée JavaScript
 * Fonctionnalités avancées pour la navigation
 */

(function() {
  'use strict';

  // ============================================
  // Sticky Navigation Auto-Hide/Show
  // ============================================

  function initStickyNav() {
    const navbar = document.querySelector('.navbar-sticky, .navbar-databird');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    // Add scroll indicator
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'navbar-scroll-indicator';
    document.body.appendChild(scrollIndicator);

    function handleScroll() {
      const currentScroll = window.pageYOffset;
      const scrollPercent = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

      // Update scroll indicator
      scrollIndicator.style.transform = `scaleX(${scrollPercent / 100})`;

      if (currentScroll > 100) {
        scrollIndicator.classList.add('active');

        if (currentScroll > lastScroll) {
          // Scrolling down - hide navbar
          navbar.classList.remove('visible');
          navbar.classList.add('hidden');
        } else {
          // Scrolling up - show navbar
          navbar.classList.remove('hidden');
          navbar.classList.add('visible');
        }
      } else {
        // Always show at top
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
        scrollIndicator.classList.remove('active');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(handleScroll);
        ticking = true;
      }
    }, { passive: true });

    // Initial state
    navbar.classList.add('visible');
  }

  // ============================================
  // Méga-Menu
  // ============================================

  function initMegaMenu() {
    const megaMenuTriggers = document.querySelectorAll('[data-mega-menu]');

    megaMenuTriggers.forEach(trigger => {
      const menuId = trigger.getAttribute('data-mega-menu');
      const menu = document.getElementById(menuId);
      if (!menu) return;

      let timeout;

      function showMenu() {
        clearTimeout(timeout);
        menu.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }

      function hideMenu() {
        timeout = setTimeout(() => {
          menu.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }, 200);
      }

      trigger.addEventListener('mouseenter', showMenu);
      trigger.addEventListener('mouseleave', hideMenu);
      menu.addEventListener('mouseenter', showMenu);
      menu.addEventListener('mouseleave', hideMenu);

      // Keyboard navigation
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          menu.classList.toggle('active');
          trigger.setAttribute('aria-expanded', menu.classList.contains('active'));
        }
        if (e.key === 'Escape') {
          menu.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!trigger.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.remove('active');
          trigger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // ============================================
  // Navigation Contextuelle
  // ============================================

  function initContextualNav() {
    const contextualNav = document.querySelector('.contextual-nav');
    if (!contextualNav) return;

    const links = contextualNav.querySelectorAll('.contextual-nav-link');
    const sections = Array.from(document.querySelectorAll('section[id], h2[id], h3[id]'))
      .map(section => ({
        id: section.id,
        element: section
      }));

    if (sections.length === 0) return;

    function updateActiveLink() {
      const scrollPosition = window.pageYOffset + 150;

      let activeSection = null;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element.offsetTop <= scrollPosition) {
          activeSection = section;
          break;
        }
      }

      links.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && activeSection && href === `#${activeSection.id}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
    updateActiveLink();

    // Smooth scroll
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offset = 100;
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
  // Breadcrumb Amélioré
  // ============================================

  function initBreadcrumb() {
    const breadcrumbs = document.querySelectorAll('.breadcrumb-enhanced');

    breadcrumbs.forEach(breadcrumb => {
      // Auto-generate breadcrumb if data-breadcrumb is present
      const items = breadcrumb.querySelectorAll('[data-breadcrumb]');
      if (items.length > 0) {
        const path = window.location.pathname.split('/').filter(Boolean);
        const breadcrumbHTML = path.map((segment, index) => {
          const href = '/' + path.slice(0, index + 1).join('/');
          const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
          const isLast = index === path.length - 1;

          return `
            <div class="breadcrumb-enhanced-item">
              ${isLast
                ? `<span class="breadcrumb-enhanced-current">${label}</span>`
                : `<a href="${href}" class="breadcrumb-enhanced-link">${label}</a>`
              }
            </div>
            ${!isLast ? '<div class="breadcrumb-enhanced-separator"><i class="fas fa-chevron-right"></i></div>' : ''}
          `;
        }).join('');

        breadcrumb.innerHTML = breadcrumbHTML;
      }
    });
  }

  // ============================================
  // Mobile Navigation Améliorée
  // ============================================

  function initMobileNav() {
    const mobileNavToggle = document.querySelector('[data-mobile-nav-toggle]');
    const mobileNav = document.querySelector('.mobile-nav-enhanced');
    if (!mobileNavToggle || !mobileNav) return;

    mobileNavToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
      mobileNavToggle.setAttribute('aria-expanded', mobileNav.classList.contains('active'));
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    const closeBtn = mobileNav.querySelector('.mobile-nav-enhanced-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    }

    // Close on link click
    const links = mobileNav.querySelectorAll('.mobile-nav-enhanced-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        mobileNavToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // Scroll Spy
  // ============================================

  function initScrollSpy() {
    const scrollSpy = document.querySelector('.nav-scroll-spy');
    if (!scrollSpy) return;

    const links = scrollSpy.querySelectorAll('.nav-scroll-spy-link');
    const sections = Array.from(links).map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        return {
          id: href.substring(1),
          link: link.closest('.nav-scroll-spy-item')
        };
      }
      return null;
    }).filter(Boolean);

    if (sections.length === 0) return;

    function updateActiveSection() {
      const scrollPosition = window.pageYOffset + 150;

      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            section.link.classList.add('active');
          } else {
            section.link.classList.remove('active');
          }
        }
      });
    }

    window.addEventListener('scroll', throttle(updateActiveSection, 100), { passive: true });
    updateActiveSection();
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

    initStickyNav();
    initMegaMenu();
    initContextualNav();
    initBreadcrumb();
    initMobileNav();
    initScrollSpy();
  }

  // Start initialization
  init();

  // Export API
  window.NavigationEnhanced = {
    initStickyNav,
    initMegaMenu,
    initContextualNav,
    initBreadcrumb,
    initMobileNav,
    initScrollSpy
  };

})();
