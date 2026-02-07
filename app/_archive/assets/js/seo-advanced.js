/**
 * SEO Avancé JavaScript
 * Optimisations SEO supplémentaires
 */

(function() {
  'use strict';

  // ============================================
  // Structured Data
  // ============================================

  function addStructuredData() {
    // Article structured data
    const article = document.querySelector('article');
    if (article) {
      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: document.querySelector('h1')?.textContent || document.title,
        description: document.querySelector('meta[name="description"]')?.content || '',
        author: {
          '@type': 'Person',
          name: document.querySelector('[rel="author"]')?.textContent || 'SMD Lab Tech'
        },
        publisher: {
          '@type': 'Organization',
          name: 'SMD Lab Tech',
          logo: {
            '@type': 'ImageObject',
            url: window.location.origin + '/assets/images/logo.png'
          }
        },
        datePublished: document.querySelector('time[datetime]')?.getAttribute('datetime') || new Date().toISOString(),
        dateModified: document.querySelector('time[datetime]')?.getAttribute('datetime') || new Date().toISOString(),
        image: document.querySelector('meta[property="og:image"]')?.content || ''
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Organization structured data
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SMD Lab Tech',
      url: window.location.origin,
      logo: window.location.origin + '/assets/images/logo.png',
      sameAs: [
        // Add social media URLs here
      ]
    };

    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.textContent = JSON.stringify(organizationData);
    document.head.appendChild(orgScript);
  }

  // ============================================
  // Breadcrumb Navigation
  // ============================================

  function initBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb-seo');
    if (!breadcrumb) return;

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: []
    };

    const items = breadcrumb.querySelectorAll('li');
    items.forEach((item, index) => {
      const link = item.querySelector('a');
      if (link) {
        breadcrumbData.itemListElement.push({
          '@type': 'ListItem',
          position: index + 1,
          name: link.textContent.trim(),
          item: link.href
        });
      }
    });

    if (breadcrumbData.itemListElement.length > 0) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(breadcrumbData);
      document.head.appendChild(script);
    }
  }

  // ============================================
  // Meta Tags Optimization
  // ============================================

  function optimizeMetaTags() {
    // Ensure canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href.split('?')[0].split('#')[0];

    // Ensure Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:title');
      meta.content = document.title;
      document.head.appendChild(meta);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = metaDescription.content;
        document.head.appendChild(meta);
      }
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      meta.content = window.location.href;
      document.head.appendChild(meta);
    }

    // Twitter Card
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'twitter:card');
      meta.content = 'summary_large_image';
      document.head.appendChild(meta);
    }
  }

  // ============================================
  // Reading Time Calculation
  // ============================================

  function calculateReadingTime() {
    const article = document.querySelector('article, .article-content, .post-content');
    if (!article) return;

    const text = article.textContent || article.innerText;
    const words = text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const minutes = Math.ceil(words / wordsPerMinute);

    const readingTimeElements = document.querySelectorAll('[data-reading-time]');
    readingTimeElements.forEach(element => {
      element.textContent = `${minutes} min`;
      element.setAttribute('content', `PT${minutes}M`);
    });
  }

  // ============================================
  // Related Content
  // ============================================

  function initRelatedContent() {
    const relatedContent = document.querySelector('.related-content');
    if (!relatedContent) return;

    // Fetch related content based on tags or categories
    // This is a placeholder - implement based on your CMS/backend
    const tags = Array.from(document.querySelectorAll('.tag-cloud-seo a'))
      .map(a => a.textContent.trim());

    if (tags.length > 0) {
      // Load related content
      // This would typically be an API call
      console.log('Related content for tags:', tags);
    }
  }

  // ============================================
  // Image Alt Text Optimization
  // ============================================

  function optimizeImageAltText() {
    const images = document.querySelectorAll('img:not([alt])');
    images.forEach(img => {
      // Try to infer alt text from context
      const caption = img.closest('figure')?.querySelector('figcaption');
      if (caption) {
        img.alt = caption.textContent.trim();
      } else {
        // Use filename as fallback
        const src = img.src || img.dataset.src;
        const filename = src.split('/').pop().split('.')[0];
        img.alt = filename.replace(/[-_]/g, ' ');
      }
    });
  }

  // ============================================
  // Link Optimization
  // ============================================

  function optimizeLinks() {
    // Add rel="nofollow" to external links
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
      if (!link.rel.includes('nofollow')) {
        link.rel = (link.rel ? link.rel + ' ' : '') + 'nofollow';
      }
    });

    // Ensure internal links don't have nofollow
    const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');
    internalLinks.forEach(link => {
      link.rel = link.rel.replace(/nofollow/g, '').trim();
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

    addStructuredData();
    initBreadcrumb();
    optimizeMetaTags();
    calculateReadingTime();
    initRelatedContent();
    optimizeImageAltText();
    optimizeLinks();
  }

  // Start initialization
  init();

  // Export API
  window.SEOAdvanced = {
    addStructuredData,
    optimizeMetaTags,
    calculateReadingTime,
    optimizeImageAltText,
    optimizeLinks
  };

})();
