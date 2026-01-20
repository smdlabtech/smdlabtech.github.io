/**
 * Landing Page Premium JavaScript
 * Fonctionnalités premium pour la landing page
 */

(function() {
  'use strict';

  // ============================================
  // Scroll Animations
  // ============================================
  
  function initScrollAnimations() {
    // Exclure les cartes de blog (gérées séparément)
    const animatedElements = document.querySelectorAll(
      '.feature-premium-card, .stat-premium-item, .testimonial-premium-card'
    );
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }
  
  // ============================================
  // Blog Cards Animation (Toutes ensemble)
  // ============================================
  
  function initBlogCardsAnimation() {
    const blogCards = document.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');
    
    if (blogCards.length === 0) return;
    
    // Trouver le conteneur parent
    const blogGrid = blogCards[0]?.closest('.blog-grid-databird, .stagger-container, #blog-posts');
    
    if (blogGrid) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Toutes les cartes apparaissent simultanément
            const cards = entry.target.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');
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
      
      // Initialiser l'état
      blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      });
      
      observer.observe(blogGrid);
    } else {
      // Fallback : observer individuellement mais sans stagger
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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
  // Counter Animation
  // ============================================
  
  function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-premium-value');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target')) || 
                    parseInt(counter.textContent.replace(/\D/g, '')) || 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString() + 
                  (counter.textContent.includes('+') ? '+' : '') +
                  (counter.textContent.includes('%') ? '%' : '');
                requestAnimationFrame(updateCounter);
              } else {
                counter.textContent = target.toLocaleString() + 
                  (counter.textContent.includes('+') ? '+' : '') +
                  (counter.textContent.includes('%') ? '%' : '');
              }
            };
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(counter);
    });
  }

  // ============================================
  // Parallax Effect
  // ============================================
  
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
      const scrollTop = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    }
    
    window.addEventListener('scroll', throttle(updateParallax, 16), { passive: true });
  }

  // ============================================
  // Smooth Scroll to Section
  // ============================================
  
  function initSmoothScroll() {
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
        }
      });
    });
  }

  // ============================================
  // Typing Effect
  // ============================================
  
  function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
      const text = element.getAttribute('data-typing') || element.textContent;
      const speed = parseInt(element.getAttribute('data-typing-speed')) || 100;
      let index = 0;
      
      element.textContent = '';
      
      function type() {
        if (index < text.length) {
          element.textContent += text.charAt(index);
          index++;
          setTimeout(type, speed);
        }
      }
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            type();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(element);
    });
  }

  // ============================================
  // Cursor Trail Effect
  // ============================================
  
  function initCursorTrail() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail-dot';
      dot.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: var(--ds-primary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: ${1 - (i / trailLength)};
        transform: scale(${1 - (i / trailLength) * 0.5});
        transition: opacity 0.1s ease;
      `;
      document.body.appendChild(dot);
      trail.push({ element: dot, x: 0, y: 0 });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    
    function animate() {
      let x = mouseX;
      let y = mouseY;
      
      trail.forEach((dot, index) => {
        const nextDot = trail[index + 1] || { x, y };
        x += (nextDot.x - x) * 0.3;
        y += (nextDot.y - y) * 0.3;
        
        dot.x = x;
        dot.y = y;
        dot.element.style.left = x + 'px';
        dot.element.style.top = y + 'px';
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
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

    initScrollAnimations();
    initCounterAnimation();
    initParallax();
    initSmoothScroll();
    initTypingEffect();
    initBlogCardsAnimation();
    // initCursorTrail(); // Désactivé par défaut (peut être activé si souhaité)
  }

  // Start initialization
  init();

  // Export API
  window.LandingPremium = {
    initScrollAnimations,
    initCounterAnimation,
    initParallax,
    initTypingEffect
  };

})();
