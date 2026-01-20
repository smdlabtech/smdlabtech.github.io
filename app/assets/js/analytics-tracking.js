/**
 * Analytics & Tracking JavaScript
 * Fonctionnalités d'analytics et de tracking
 */

(function() {
  'use strict';

  // ============================================
  // Event Tracking
  // ============================================
  
  const trackedEvents = {
    pageViews: 0,
    clicks: 0,
    scrolls: 0,
    timeOnPage: 0,
    startTime: Date.now()
  };
  
  function trackEvent(eventName, eventData = {}) {
    // Log event (can be sent to analytics service)
    const event = {
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    // Store in localStorage for offline tracking
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }
    
    localStorage.setItem('analytics_events', JSON.stringify(events));
    
    // Show indicator
    showEventIndicator(eventName);
    
    // Send to analytics service (Google Analytics, etc.)
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }
    
    // Custom analytics endpoint
    if (window.analyticsEndpoint) {
      fetch(window.analyticsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      }).catch(err => console.error('Analytics error:', err));
    }
    
    console.log('Event tracked:', event);
  }
  
  function showEventIndicator(eventName) {
    const indicator = document.querySelector('.event-tracking-indicator') || createEventIndicator();
    indicator.querySelector('.event-tracking-text').textContent = `Event: ${eventName}`;
    indicator.classList.add('active');
    
    setTimeout(() => {
      indicator.classList.remove('active');
    }, 2000);
  }
  
  function createEventIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'event-tracking-indicator';
    indicator.innerHTML = `
      <i class="fas fa-chart-line event-tracking-indicator-icon"></i>
      <span class="event-tracking-text"></span>
    `;
    document.body.appendChild(indicator);
    return indicator;
  }

  // ============================================
  // Page View Tracking
  // ============================================
  
  function trackPageView() {
    trackedEvents.pageViews++;
    trackEvent('page_view', {
      path: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now()
    });
  }

  // ============================================
  // Click Tracking
  // ============================================
  
  function initClickTracking() {
    document.addEventListener('click', function(e) {
      const target = e.target.closest('a, button, [data-track]');
      if (!target) return;
      
      trackedEvents.clicks++;
      
      const trackData = {
        element: target.tagName.toLowerCase(),
        text: target.textContent.trim().substring(0, 50),
        href: target.href || target.getAttribute('href') || '',
        id: target.id || '',
        className: target.className || ''
      };
      
      // Check for data-track attribute
      const trackName = target.getAttribute('data-track');
      if (trackName) {
        trackEvent(trackName, trackData);
      } else {
        trackEvent('click', trackData);
      }
    }, true);
  }

  // ============================================
  // Scroll Tracking
  // ============================================
  
  function initScrollTracking() {
    const scrollMilestones = [25, 50, 75, 100];
    const reachedMilestones = new Set();
    
    function handleScroll() {
      const scrollPercent = Math.round(
        (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      scrollMilestones.forEach(milestone => {
        if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
          reachedMilestones.add(milestone);
          trackedEvents.scrolls++;
          trackEvent('scroll', {
            percent: milestone,
            timestamp: Date.now()
          });
        }
      });
    }
    
    window.addEventListener('scroll', throttle(handleScroll, 500), { passive: true });
  }

  // ============================================
  // Time on Page Tracking
  // ============================================
  
  function initTimeOnPageTracking() {
    setInterval(() => {
      trackedEvents.timeOnPage = Math.floor((Date.now() - trackedEvents.startTime) / 1000);
    }, 1000);
    
    // Track on page unload
    window.addEventListener('beforeunload', () => {
      trackEvent('time_on_page', {
        seconds: trackedEvents.timeOnPage,
        timestamp: Date.now()
      });
    });
  }

  // ============================================
  // Heatmap Data Collection
  // ============================================
  
  function initHeatmapTracking() {
    const heatmapData = JSON.parse(localStorage.getItem('heatmap_data') || '{}');
    
    document.addEventListener('click', function(e) {
      const x = Math.floor((e.clientX / window.innerWidth) * 100);
      const y = Math.floor((e.clientY / window.innerHeight) * 100);
      const key = `${x},${y}`;
      
      heatmapData[key] = (heatmapData[key] || 0) + 1;
      
      // Keep only last 1000 clicks
      if (Object.keys(heatmapData).length > 1000) {
        const sorted = Object.entries(heatmapData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 1000);
        Object.keys(heatmapData).forEach(key => delete heatmapData[key]);
        sorted.forEach(([key, value]) => heatmapData[key] = value);
      }
      
      localStorage.setItem('heatmap_data', JSON.stringify(heatmapData));
    }, true);
  }

  // ============================================
  // User Flow Tracking
  // ============================================
  
  function initUserFlowTracking() {
    const flow = JSON.parse(sessionStorage.getItem('user_flow') || '[]');
    
    // Track page in flow
    flow.push({
      page: window.location.pathname,
      timestamp: Date.now(),
      referrer: document.referrer
    });
    
    // Keep only last 10 pages
    if (flow.length > 10) {
      flow.shift();
    }
    
    sessionStorage.setItem('user_flow', JSON.stringify(flow));
    
    // Track flow on page unload
    window.addEventListener('beforeunload', () => {
      trackEvent('user_flow', {
        flow: flow,
        duration: Date.now() - (flow[0]?.timestamp || Date.now())
      });
    });
  }

  // ============================================
  // Conversion Funnel Tracking
  // ============================================
  
  function trackConversionStep(stepName, stepData = {}) {
    trackEvent('conversion_step', {
      step: stepName,
      ...stepData,
      timestamp: Date.now()
    });
  }

  // ============================================
  // Real-time Stats
  // ============================================
  
  function initRealTimeStats() {
    const statsContainer = document.querySelector('.real-time-stats');
    if (!statsContainer) return;
    
    function updateStats() {
      const stats = {
        visitors: trackedEvents.pageViews,
        clicks: trackedEvents.clicks,
        scrolls: trackedEvents.scrolls,
        timeOnPage: Math.floor(trackedEvents.timeOnPage / 60) + ' min'
      };
      
      Object.entries(stats).forEach(([key, value]) => {
        const statElement = statsContainer.querySelector(`[data-stat="${key}"]`);
        if (statElement) {
          const valueElement = statElement.querySelector('.real-time-stat-value');
          if (valueElement) {
            valueElement.textContent = value;
          }
        }
      });
    }
    
    setInterval(updateStats, 1000);
    updateStats();
  }

  // ============================================
  // Analytics Dashboard
  // ============================================
  
  function initAnalyticsDashboard() {
    const dashboard = document.querySelector('.analytics-dashboard');
    if (!dashboard) return;
    
    // Update analytics cards
    const cards = dashboard.querySelectorAll('.analytics-card');
    cards.forEach(card => {
      const dataKey = card.getAttribute('data-analytics');
      if (dataKey) {
        const value = trackedEvents[dataKey] || 0;
        const valueElement = card.querySelector('.analytics-card-value');
        if (valueElement) {
          animateValue(valueElement, 0, value, 1000);
        }
      }
    });
  }
  
  function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      element.textContent = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  // ============================================
  // Privacy & Consent
  // ============================================
  
  function initPrivacyConsent() {
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      // Show consent banner
      showConsentBanner();
    } else if (consent === 'true') {
      // User consented, enable tracking
      enableTracking();
    }
  }
  
  function showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'analytics-privacy-notice';
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '20px';
    banner.style.right = '20px';
    banner.style.zIndex = '10000';
    banner.style.maxWidth = '600px';
    banner.style.margin = '0 auto';
    banner.innerHTML = `
      <i class="fas fa-info-circle analytics-privacy-notice-icon"></i>
      <div style="flex: 1;">
        <p style="margin: 0 0 0.5rem 0;">Nous utilisons des cookies pour améliorer votre expérience.</p>
        <div style="display: flex; gap: 1rem;">
          <button data-consent="accept" style="padding: 0.5rem 1rem; background: var(--ds-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer;">Accepter</button>
          <button data-consent="reject" style="padding: 0.5rem 1rem; background: var(--ds-bg-secondary); color: var(--ds-text); border: 1px solid var(--ds-border); border-radius: 0.5rem; cursor: pointer;">Refuser</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);
    
    banner.querySelector('[data-consent="accept"]').addEventListener('click', () => {
      localStorage.setItem('analytics_consent', 'true');
      enableTracking();
      banner.remove();
    });
    
    banner.querySelector('[data-consent="reject"]').addEventListener('click', () => {
      localStorage.setItem('analytics_consent', 'false');
      banner.remove();
    });
  }
  
  function enableTracking() {
    initClickTracking();
    initScrollTracking();
    initTimeOnPageTracking();
    initHeatmapTracking();
    initUserFlowTracking();
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

    trackPageView();
    initPrivacyConsent();
    initRealTimeStats();
    initAnalyticsDashboard();
    initUserFlowTracking();
  }

  // Start initialization
  init();

  // Export API
  window.AnalyticsTracking = {
    trackEvent,
    trackPageView,
    trackConversionStep,
    trackedEvents
  };

})();
