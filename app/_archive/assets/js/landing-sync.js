/**
 * Landing Page Synchronization JavaScript
 * Corrections et synchronisation des interactions
 */

(function() {
  'use strict';

  // Initialize all fixes
  function init() {
    fixFilterAccessibility();
    fixSmoothScroll();
    fixImageLoading();
    fixFormValidation();
    initSectionObserver();
  }

  // Fix filter accessibility
  function fixFilterAccessibility() {
    const filters = document.querySelectorAll('.filter-tag[role="tab"]');
    const cards = document.querySelectorAll('.blog-card-databird');

    filters.forEach(filter => {
      filter.addEventListener('click', function(e) {
        e.preventDefault();

        // Update ARIA attributes
        filters.forEach(f => {
          f.classList.remove('active');
          f.setAttribute('aria-selected', 'false');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const filterValue = this.dataset.filter;

        // Filter cards with animation
        cards.forEach((card, index) => {
          const cardTag = card.querySelector('.blog-card-tag')?.textContent.toLowerCase() || '';
          const matches = filterValue === 'all' || cardTag.includes(filterValue.replace('-', ' '));

          if (matches) {
            setTimeout(() => {
              card.style.display = 'flex';
              card.style.opacity = '0';
              card.style.transform = 'scale(0.95)';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            }, index * 30);
          } else {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });

      // Keyboard navigation
      filter.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // Fix smooth scroll
  function fixSmoothScroll() {
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

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, href);
          }
        }
      });
    });
  }

  // Fix image loading
  function fixImageLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(img => {
      // Add error handling
      img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = 'background: linear-gradient(135deg, #E31E24 0%, #1E40AF 100%); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;';
        placeholder.textContent = 'Image non disponible';
        this.parentNode.insertBefore(placeholder, this);
      });

      // Add loading state
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        img.addEventListener('load', function() {
          this.style.opacity = '1';
        });
      }
    });
  }

  // Fix form validation
  function fixFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea');

      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
          validateField(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('error')) {
            validateField(this);
          }
        });
      });
    });
  }

  // Validate individual field
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous error state
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }

    // Required validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Ce champ est requis';
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Veuillez entrer une adresse email valide';
      }
    }

    // Min length validation
    if (field.hasAttribute('minlength')) {
      const minLength = parseInt(field.getAttribute('minlength'));
      if (value.length < minLength) {
        isValid = false;
        errorMessage = `Minimum ${minLength} caractères requis`;
      }
    }

    // Apply error state
    if (!isValid) {
      field.classList.add('error');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = errorMessage;
      errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem;';
      field.parentNode.appendChild(errorDiv);
    }

    return isValid;
  }

  // Section observer for animations
  function initSectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.landingSync = {
    init,
    validateField
  };

})();
