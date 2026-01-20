/**
 * Newsletter Subscription Handler
 * Gestion des abonnements à la newsletter
 */

(function() {
  'use strict';

  const API_ENDPOINT = '/api/newsletter.php';

  // Subscribe to newsletter
  function subscribe(email, name = null, source = 'website') {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('action', 'subscribe');
      formData.append('email', email);
      if (name) formData.append('name', name);
      formData.append('source', source);
      
      fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  // Unsubscribe from newsletter
  function unsubscribe(email) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('action', 'unsubscribe');
      formData.append('email', email);
      
      fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.message));
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  // Initialize newsletter forms
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form, [data-newsletter-form]');
    
    forms.forEach(form => {
      form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const nameInput = form.querySelector('input[name="name"]');
        const submitBtn = form.querySelector('button[type="submit"]');
        const messageDiv = form.querySelector('.newsletter-message') || createMessageDiv(form);
        
        if (!emailInput) return;
        
        const email = emailInput.value.trim();
        const name = nameInput ? nameInput.value.trim() : null;
        const source = form.dataset.source || 'website';
        
        if (!email || !isValidEmail(email)) {
          showMessage(messageDiv, 'Veuillez entrer une adresse email valide', 'error');
          return;
        }
        
        // Disable submit button
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Inscription...';
        }
        
        try {
          const result = await subscribe(email, name, source);
          showMessage(messageDiv, result.message || 'Inscription réussie !', 'success');
          form.reset();
          
          // Track conversion
          if (typeof gtag !== 'undefined') {
            gtag('event', 'newsletter_subscribe', {
              'event_category': 'engagement',
              'event_label': source
            });
          }
        } catch (error) {
          showMessage(messageDiv, error.message || 'Une erreur est survenue', 'error');
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'S\'inscrire';
          }
        }
      });
    });
  }

  // Create message div
  function createMessageDiv(form) {
    const div = document.createElement('div');
    div.className = 'newsletter-message';
    form.appendChild(div);
    return div;
  }

  // Show message
  function showMessage(element, message, type = 'info') {
    element.textContent = message;
    element.className = `newsletter-message newsletter-message-${type}`;
    element.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      element.style.display = 'none';
    }, 5000);
  }

  // Validate email
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNewsletterForms);
  } else {
    initNewsletterForms();
  }

  // Export for global access
  window.newsletter = {
    subscribe,
    unsubscribe
  };

})();
