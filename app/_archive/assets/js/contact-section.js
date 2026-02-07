/**
 * Contact Section JavaScript
 * Gestion du formulaire de contact et interactions
 */

(function() {
  'use strict';

  // Initialize contact section
  function init() {
    initContactForm();
    initSocialLinks();
    initScrollAnimations();
    initEmailLinks();
  }

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.form-submit');
      const messageDiv = form.querySelector('.form-message');
      const originalText = submitBtn.innerHTML;

      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

      // Get form data
      const formData = new FormData(form);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      // Validate
      if (!validateForm(data)) {
        showMessage(messageDiv, 'Veuillez remplir tous les champs correctement', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        return;
      }

      // Simulate form submission (replace with actual API call)
      try {
        // Here you would make an actual API call
        // const response = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });

        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        showMessage(messageDiv, 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        form.reset();

        // Track conversion
        if (typeof gtag !== 'undefined') {
          gtag('event', 'contact_form_submit', {
            'event_category': 'engagement',
            'event_label': 'contact'
          });
        }
      } catch (error) {
        showMessage(messageDiv, 'Une erreur est survenue. Veuillez réessayer plus tard.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Validate form
  function validateForm(data) {
    if (!data.name || data.name.trim().length < 2) return false;
    if (!data.email || !isValidEmail(data.email)) return false;
    if (!data.subject || data.subject.trim().length < 3) return false;
    if (!data.message || data.message.trim().length < 10) return false;
    return true;
  }

  // Validate email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Show message
  function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';

    // Scroll to message
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto hide after 5 seconds
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }

  // Social links enhancement
  function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');

    socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Track social clicks
        const platform = this.getAttribute('aria-label') || 'social';
        if (typeof gtag !== 'undefined') {
          gtag('event', 'social_click', {
            'event_category': 'engagement',
            'event_label': platform
          });
        }
      });
    });
  }

  // Scroll animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.contact-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Email links
  function initEmailLinks() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

    emailLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (typeof gtag !== 'undefined') {
          gtag('event', 'email_click', {
            'event_category': 'engagement',
            'event_label': 'contact'
          });
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.contactSection = {
    init,
    validateForm,
    showMessage
  };

})();
