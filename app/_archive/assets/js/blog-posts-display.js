/**
 * Blog Posts Display Enhancement
 * Amélioration de l'affichage des articles de blog
 */

(function() {
  'use strict';

  // ============================================
  // Group Posts by Category
  // ============================================

  function groupPostsByCategory() {
    const posts = Array.from(document.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced'));
    const categoryGroups = {};

    posts.forEach(post => {
      const tags = post.querySelectorAll('.blog-card-tag, .category-badge-enhanced');
      const category = tags.length > 0 ? tags[0].textContent.trim() : 'Other';

      if (!categoryGroups[category]) {
        categoryGroups[category] = [];
      }
      categoryGroups[category].push(post);
    });

    return categoryGroups;
  }

  // ============================================
  // Display Posts by Category
  // ============================================

  function displayPostsByCategory() {
    const blogGrid = document.querySelector('.blog-grid-databird, #blog-posts');
    if (!blogGrid) return;

    const categoryGroups = groupPostsByCategory();
    const categories = Object.keys(categoryGroups).sort();

    // Create category sections
    categories.forEach(category => {
      const section = document.createElement('section');
      section.className = 'blog-category-section';
      section.innerHTML = `
        <h3 class="blog-category-title">${category}</h3>
        <div class="blog-category-grid">
          ${categoryGroups[category].map(post => post.outerHTML).join('')}
        </div>
      `;

      // Insert after blog grid or append
      if (blogGrid.parentElement) {
        blogGrid.parentElement.insertBefore(section, blogGrid.nextSibling);
      }
    });
  }

  // ============================================
  // Filter Posts by Topic
  // ============================================

  function initTopicFiltering() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const posts = document.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');

    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const filter = this.getAttribute('data-filter');

        // Update active state
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filter posts
        posts.forEach(post => {
          const tags = Array.from(post.querySelectorAll('.blog-card-tag, .category-badge-enhanced'))
            .map(tag => tag.textContent.toLowerCase().trim());
          const postTags = tags.join(' ');

          if (filter === 'all' || postTags.includes(filter.toLowerCase())) {
            post.style.display = 'block';
            setTimeout(() => {
              post.style.opacity = '1';
              post.style.transform = 'translateY(0)';
            }, 10);
          } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            setTimeout(() => {
              post.style.display = 'none';
            }, 300);
          }
        });

        // Scroll to posts section
        const postsSection = document.querySelector('#latest-posts, .latest-posts-section-enhanced');
        if (postsSection) {
          postsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // Enhance Post Cards Display
  // ============================================

  function enhancePostCards() {
    const posts = document.querySelectorAll('.blog-card-databird, .blog-card-databird-enhanced');

    posts.forEach(post => {
      // Add topic badge if in subfolder
      const postUrl = post.querySelector('a')?.href || '';
      if (postUrl.includes('/topics/')) {
        const topicMatch = postUrl.match(/\/topics\/([^\/]+)/);
        if (topicMatch) {
          const topic = topicMatch[1];
          const topicBadge = document.createElement('span');
          topicBadge.className = 'blog-card-topic';
          topicBadge.textContent = topic.charAt(0).toUpperCase() + topic.slice(1);
          topicBadge.style.cssText = `
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: var(--ds-primary-lighter);
            color: var(--ds-primary);
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 0.5rem;
          `;

          const content = post.querySelector('.blog-card-content, .blog-card-content-databird');
          if (content) {
            content.insertBefore(topicBadge, content.firstChild);
          }
        }
      }
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

    initTopicFiltering();
    enhancePostCards();
    // displayPostsByCategory(); // Optionnel : activer si besoin
  }

  // Start initialization
  init();

  // Export API
  window.BlogPostsDisplay = {
    groupPostsByCategory,
    initTopicFiltering,
    enhancePostCards
  };

})();
