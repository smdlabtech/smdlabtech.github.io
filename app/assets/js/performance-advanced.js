/**
 * Performance Avancée JavaScript
 * Optimisations de performance supplémentaires
 */

(function() {
  'use strict';

  // ============================================
  // Image Lazy Loading Enhanced
  // ============================================
  
  function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Load image
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          
          // Remove data-src
          img.removeAttribute('data-src');
          
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
  // Preload Critical Resources
  // ============================================
  
  function preloadCriticalResources() {
    // Preload critical images
    const criticalImages = document.querySelectorAll('[data-preload]');
    criticalImages.forEach(img => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = img.dataset.preload || img.src;
      document.head.appendChild(link);
    });
    
    // Preload critical fonts
    const criticalFonts = document.querySelectorAll('[data-preload-font]');
    criticalFonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = font.dataset.preloadFont;
      document.head.appendChild(link);
    });
  }

  // ============================================
  // Network-Aware Loading
  // ============================================
  
  function initNetworkAwareLoading() {
    if (!navigator.connection) return;
    
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    function handleConnectionChange() {
      const effectiveType = connection.effectiveType;
      const saveData = connection.saveData;
      
      // Hide non-critical content on slow connections
      if (effectiveType === 'slow-2g' || effectiveType === '2g' || saveData) {
        document.body.classList.add('slow-connection');
        const nonCritical = document.querySelectorAll('.non-critical');
        nonCritical.forEach(el => {
          el.style.display = 'none';
        });
      } else {
        document.body.classList.remove('slow-connection');
      }
    }
    
    connection.addEventListener('change', handleConnectionChange);
    handleConnectionChange();
  }

  // ============================================
  // Resource Hints
  // ============================================
  
  function addResourceHints() {
    // Preconnect to external domains
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://cdn.jsdelivr.net'
    ];
    
    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
    
    // DNS prefetch
    const dnsPrefetchDomains = [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com'
    ];
    
    dnsPrefetchDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // ============================================
  // Debounce & Throttle Utilities
  // ============================================
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
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
  // Performance Monitoring
  // ============================================
  
  function monitorPerformance() {
    if (!window.performance || !window.performance.timing) return;
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        
        // Log performance metrics (can be sent to analytics)
        if (window.console && console.log) {
          console.log('Performance Metrics:', {
            pageLoadTime: `${pageLoadTime}ms`,
            domReadyTime: `${domReadyTime}ms`,
            connectTime: `${connectTime}ms`
          });
        }
        
        // Web Vitals
        if ('PerformanceObserver' in window) {
          try {
            const observer = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                // Log Web Vitals
                if (entry.entryType === 'largest-contentful-paint') {
                  console.log('LCP:', entry.renderTime || entry.loadTime);
                }
                if (entry.entryType === 'first-input') {
                  console.log('FID:', entry.processingStart - entry.startTime);
                }
              }
            });
            
            observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
          } catch (e) {
            // PerformanceObserver not supported
          }
        }
      }, 0);
    });
  }

  // ============================================
  // Code Splitting Helper
  // ============================================
  
  async function loadComponent(componentName) {
    try {
      const module = await import(`/assets/js/components/${componentName}.js`);
      return module.default || module;
    } catch (error) {
      console.error(`Failed to load component: ${componentName}`, error);
      return null;
    }
  }

  // ============================================
  // Memory Management
  // ============================================
  
  function cleanupMemory() {
    // Remove unused event listeners
    // Clean up observers
    // Remove unused DOM elements
    
    // Example: Clean up intersection observers
    if (window.intersectionObservers) {
      window.intersectionObservers.forEach(observer => {
        observer.disconnect();
      });
      window.intersectionObservers = [];
    }
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupMemory);

  // ============================================
  // Service Worker Registration
  // ============================================
  
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New update available
                  showUpdateNotification();
                }
              });
            });
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      });
    }
  }
  
  function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'sw-update-available';
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span>Une nouvelle version est disponible !</span>
        <button onclick="window.location.reload()" style="background: white; color: var(--ds-primary); border: none; padding: 0.5rem 1rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
          Actualiser
        </button>
      </div>
    `;
    document.body.appendChild(notification);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.parentElement.removeChild(notification);
      }
    }, 10000);
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
    preloadCriticalResources();
    initNetworkAwareLoading();
    addResourceHints();
    monitorPerformance();
    registerServiceWorker();
  }

  // Start initialization
  init();

  // Export API
  window.PerformanceAdvanced = {
    debounce,
    throttle,
    loadComponent,
    cleanupMemory
  };

})();
