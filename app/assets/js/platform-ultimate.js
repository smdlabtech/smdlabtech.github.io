/**
 * Platform Ultimate JavaScript
 * Fonctionnalités ultimes pour toute la plateforme
 */

(function() {
  'use strict';

  // ============================================
  // Ripple Effect
  // ============================================
  
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.button-ripple, button, .btn, a.btn');
    
    buttons.forEach(button => {
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
          background: rgba(255, 255, 255, 0.5);
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
    
    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ============================================
  // Lazy Loading Enhanced
  // ============================================
  
  function initLazyLoadingEnhanced() {
    const lazyElements = document.querySelectorAll('[data-lazy], img[loading="lazy"]');
    
    if (lazyElements.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          if (element.tagName === 'IMG') {
            if (element.dataset.src) {
              element.src = element.dataset.src;
              element.removeAttribute('data-src');
            }
            
            element.addEventListener('load', () => {
              element.classList.add('loaded');
            }, { once: true });
          } else {
            // For other elements
            const content = element.dataset.lazy;
            if (content) {
              element.innerHTML = content;
              element.removeAttribute('data-lazy');
            }
          }
          
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyElements.forEach(element => {
      imageObserver.observe(element);
    });
  }

  // ============================================
  // Smooth Scroll Enhanced
  // ============================================
  
  function initSmoothScrollEnhanced() {
    // Add smooth scroll behavior
    if (!document.documentElement.style.scrollBehavior) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Enhanced smooth scroll for anchor links
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
          
          // Update URL
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ============================================
  // Copy to Clipboard Enhanced
  // ============================================
  
  function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('[data-copy]');
    
    copyButtons.forEach(button => {
      button.addEventListener('click', async function() {
        const text = this.getAttribute('data-copy') || 
                    this.previousElementSibling?.textContent || '';
        
        try {
          await navigator.clipboard.writeText(text);
          
          // Show feedback
          const originalText = this.textContent;
          this.textContent = '✓ Copié !';
          this.style.color = 'var(--ds-success)';
          
          setTimeout(() => {
            this.textContent = originalText;
            this.style.color = '';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });
    });
  }

  // ============================================
  // Progress Bar Enhanced
  // ============================================
  
  function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-premium-bar[data-progress]');
    
    progressBars.forEach(bar => {
      const target = parseInt(bar.getAttribute('data-progress')) || 0;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            bar.style.width = target + '%';
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(bar);
    });
  }

  // ============================================
  // Image Zoom on Hover
  // ============================================
  
  function initImageZoom() {
    const images = document.querySelectorAll('[data-zoom]');
    
    images.forEach(img => {
      img.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.3s ease';
      });
      
      img.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }

  // ============================================
  // Sticky Elements
  // ============================================
  
  function initStickyElements() {
    const stickyElements = document.querySelectorAll('[data-sticky]');
    
    stickyElements.forEach(element => {
      const offset = parseInt(element.getAttribute('data-sticky-offset')) || 0;
      const originalTop = element.offsetTop;
      
      function handleScroll() {
        if (window.pageYOffset >= originalTop - offset) {
          element.classList.add('sticky-active');
        } else {
          element.classList.remove('sticky-active');
        }
      }
      
      window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
      handleScroll();
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

    initRippleEffect();
    initLazyLoadingEnhanced();
    initSmoothScrollEnhanced();
    initCopyToClipboard();
    initProgressBars();
    initImageZoom();
    initStickyElements();
  }

  // Start initialization
  init();

  // Export API
  window.PlatformUltimate = {
    initRippleEffect,
    initLazyLoadingEnhanced,
    initSmoothScrollEnhanced,
    initCopyToClipboard,
    initProgressBars,
    initImageZoom,
    initStickyElements
  };

})();
