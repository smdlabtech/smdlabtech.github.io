/**
 * Optimisations Médias JavaScript
 * Fonctionnalités pour les images, vidéos et médias
 */

(function() {
  'use strict';

  // ============================================
  // Lazy Loading Images
  // ============================================
  
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          // Add loaded class
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          }, { once: true });
          
          // Error handling
          img.addEventListener('error', () => {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage non disponible%3C/text%3E%3C/svg%3E';
            img.classList.add('loaded');
          }, { once: true });
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // Image Gallery
  // ============================================
  
  function initImageGallery() {
    const galleries = document.querySelectorAll('.image-gallery');
    
    galleries.forEach(gallery => {
      const items = gallery.querySelectorAll('.image-gallery-item');
      
      items.forEach((item, index) => {
        item.addEventListener('click', () => {
          openLightbox(items, index);
        });
      });
    });
  }

  // ============================================
  // Lightbox
  // ============================================
  
  function openLightbox(items, startIndex = 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Fermer">
        <i class="fas fa-times"></i>
      </button>
      <button class="lightbox-nav prev" aria-label="Image précédente">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="lightbox-nav next" aria-label="Image suivante">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="lightbox-content">
        <img class="lightbox-image" src="" alt="">
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    let currentIndex = startIndex;
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav.next');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    
    function showImage(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      
      currentIndex = index;
      const img = items[index].querySelector('img');
      if (img) {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt || '';
      }
      
      // Update nav buttons visibility
      if (items.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }
    
    // Show initial image
    setTimeout(() => {
      lightbox.classList.add('active');
      showImage(startIndex);
    }, 10);
    
    // Navigation
    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    closeBtn.addEventListener('click', closeLightbox);
    
    // Keyboard navigation
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showImage(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showImage(currentIndex + 1);
      }
    };
    
    document.addEventListener('keydown', keyHandler);
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', keyHandler);
      }, 300);
    }
  }

  // ============================================
  // Video Optimization
  // ============================================
  
  function initVideoOptimization() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
      const thumbnail = container.querySelector('.video-thumbnail');
      const playButton = container.querySelector('.video-play-button');
      const iframe = container.querySelector('iframe');
      const video = container.querySelector('video');
      
      if (!thumbnail || !playButton) return;
      
      playButton.addEventListener('click', () => {
        container.classList.add('playing');
        
        if (iframe && iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
          iframe.removeAttribute('data-src');
        }
        
        if (video) {
          video.play();
        }
      });
    });
  }

  // ============================================
  // Responsive Images
  // ============================================
  
  function initResponsiveImages() {
    const images = document.querySelectorAll('img[data-srcset]');
    
    images.forEach(img => {
      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
        img.removeAttribute('data-srcset');
      }
      
      if (img.dataset.sizes) {
        img.sizes = img.dataset.sizes;
        img.removeAttribute('data-sizes');
      }
    });
  }

  // ============================================
  // Image Aspect Ratio
  // ============================================
  
  function initAspectRatio() {
    const containers = document.querySelectorAll('[data-aspect-ratio]');
    
    containers.forEach(container => {
      const ratio = container.getAttribute('data-aspect-ratio').split(':');
      const padding = (ratio[1] / ratio[0]) * 100;
      container.style.paddingBottom = `${padding}%`;
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

    initLazyLoading();
    initImageGallery();
    initVideoOptimization();
    initResponsiveImages();
    initAspectRatio();
  }

  // Start initialization
  init();

  // Export API
  window.MediaOptimizations = {
    openLightbox,
    initLazyLoading,
    initImageGallery,
    initVideoOptimization
  };

})();
