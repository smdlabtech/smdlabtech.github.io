/**
 * Modern Enhancements V2 - JavaScript
 * Améliorations interactives modernes
 */

(function() {
  'use strict';

  // Card Tilt Effect
  function initCardTilt() {
    const cards = document.querySelectorAll('.blog-card-databird, .featured-post-card, .topic-card-enhanced');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    });
  }

  // Magnetic Hover Effect
  function initMagneticHover() {
    const magneticElements = document.querySelectorAll('.magnetic-hover');
    
    magneticElements.forEach(element => {
      element.addEventListener('mousemove', function(e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const moveX = x * 0.3;
        const moveY = y * 0.3;
        
        element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
      });
      
      element.addEventListener('mouseleave', function() {
        element.style.transform = '';
      });
    });
  }

  // Stagger Animation
  function initStaggerAnimation() {
    const staggerContainers = document.querySelectorAll('.stagger-container');
    
    if (staggerContainers.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Exclure les cartes de blog (gérées séparément pour apparaître ensemble)
          const items = entry.target.querySelectorAll('.stagger-item:not(.blog-card-databird)');
          // Toutes les cartes apparaissent ensemble
          items.forEach((item) => {
            item.classList.add('animate');
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    staggerContainers.forEach(container => {
      observer.observe(container);
    });
  }

  // Text Reveal Animation
  function initTextReveal() {
    const textReveals = document.querySelectorAll('.text-reveal');
    
    if (textReveals.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
    
    textReveals.forEach(element => {
      observer.observe(element);
    });
  }

  // Card Reveal Animation
  function initCardReveal() {
    const cards = document.querySelectorAll('.card-reveal');
    
    if (cards.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach(card => {
      observer.observe(card);
    });
  }

  // Parallax Effect
  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    let ticking = false;
    
    function updateParallax() {
      parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const rect = element.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = scrolled * speed;
        
        element.style.transform = `translateY(${parallax}px)`;
      });
      
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // Smooth Scroll to Element
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Image Lazy Load with Fade
  function initImageLazyLoad() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.5s ease';
          
          img.addEventListener('load', function() {
            this.style.opacity = '1';
          }, { once: true });
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => {
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        imageObserver.observe(img);
      }
    });
  }

  // Progress Bar Animation
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-animated');
    
    if (progressBars.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const value = bar.dataset.value || bar.style.width;
          
          if (value) {
            bar.style.width = value;
            bar.classList.add('animated');
          }
          
          observer.unobserve(bar);
        }
      });
    }, {
      threshold: 0.5
    });
    
    progressBars.forEach(bar => {
      observer.observe(bar);
    });
  }

  // Cursor Follow Effect (optional)
  function initCursorFollow() {
    const cursorElements = document.querySelectorAll('[data-cursor-follow]');
    
    if (cursorElements.length === 0) return;
    
    let cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.className = 'custom-cursor';
      cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid var(--db-primary);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        display: none;
      `;
      document.body.appendChild(cursor);
    }
    
    cursorElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursor.style.display = 'block';
      });
      
      element.addEventListener('mouseleave', () => {
        cursor.style.display = 'none';
      });
      
      element.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
      });
    });
  }

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initCardTilt();
        initMagneticHover();
        initStaggerAnimation();
        initTextReveal();
        initCardReveal();
        initParallax();
        initSmoothScroll();
        initImageLazyLoad();
        initProgressBars();
        
        // Only init cursor follow on desktop
        if (window.innerWidth > 768) {
          initCursorFollow();
        }
      });
    } else {
      initCardTilt();
      initMagneticHover();
      initStaggerAnimation();
      initTextReveal();
      initCardReveal();
      initParallax();
      initSmoothScroll();
      initImageLazyLoad();
      initProgressBars();
      
      if (window.innerWidth > 768) {
        initCursorFollow();
      }
    }
  }

  init();

})();
