/**
 * Optimisations Réseaux Sociaux JavaScript
 * Fonctionnalités pour le partage et l'intégration sociale
 */

(function() {
  'use strict';

  // ============================================
  // Social Share
  // ============================================

  function initSocialShare() {
    const shareButtons = document.querySelectorAll('[data-share]');

    shareButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.getAttribute('data-share');
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const text = encodeURIComponent(
          document.querySelector('meta[name="description"]')?.content || ''
        );

        let shareUrl = '';

        switch(platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
          case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
            break;
          case 'copy':
            copyToClipboard(window.location.href);
            if (window.UIEnhancements) {
              window.UIEnhancements.showToast('Lien copié dans le presse-papiers !', 'success', null, 2000);
            }
            return;
        }

        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  // ============================================
  // Copy to Clipboard
  // ============================================

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback pour les navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (e) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  }

  // ============================================
  // Social Meta Tags
  // ============================================

  function updateSocialMetaTags() {
    // Mettre à jour les meta tags Open Graph et Twitter Card
    const title = document.querySelector('h1')?.textContent || document.title;
    const description = document.querySelector('meta[name="description"]')?.content ||
                       document.querySelector('p')?.textContent?.substring(0, 160) || '';
    const image = document.querySelector('meta[property="og:image"]')?.content ||
                  document.querySelector('img')?.src || '';
    const url = window.location.href;

    // Open Graph
    setMetaTag('og:title', title);
    setMetaTag('og:description', description);
    setMetaTag('og:url', url);
    if (image) {
      setMetaTag('og:image', image);
    }

    // Twitter Card
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    if (image) {
      setMetaTag('twitter:image', image);
    }
  }

  function setMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) ||
               document.querySelector(`meta[name="${property}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  }

  // ============================================
  // Social Proof Counter
  // ============================================

  function initSocialProofCounter() {
    const counters = document.querySelectorAll('[data-counter]');

    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-counter')) || 0;
      const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      // Démarrer l'animation quand visible
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  // ============================================
  // Social Login
  // ============================================

  function initSocialLogin() {
    const loginButtons = document.querySelectorAll('[data-social-login]');

    loginButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const provider = this.getAttribute('data-social-login');
        // Implémentation du login social
        // À adapter selon votre backend
        console.log(`Login with ${provider}`);
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

    initSocialShare();
    updateSocialMetaTags();
    initSocialProofCounter();
    initSocialLogin();
  }

  // Start initialization
  init();

  // Export API
  window.SocialOptimizations = {
    copyToClipboard,
    updateSocialMetaTags,
    initSocialShare
  };

})();
