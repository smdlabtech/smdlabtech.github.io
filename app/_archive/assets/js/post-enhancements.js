/**
 * Post Page Enhancements
 * Améliorations interactives pour les pages d'articles
 */

(function() {
  'use strict';

  // Reading Progress Bar
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);

    const article = document.querySelector('.post-content-databird');
    if (!article) return;

    function updateProgress() {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  // Table of Contents
  function initTableOfContents() {
    const content = document.querySelector('.post-content-databird');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3, h4');
    if (headings.length < 2) {
      // Hide sidebar if no TOC
      const sidebar = document.getElementById('post-sidebar');
      if (sidebar) sidebar.style.display = 'none';
      return;
    }

    const tocList = document.createElement('ul');
    let currentLevel = 0;
    let currentList = tocList;

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const id = heading.id || `heading-${index}`;
      heading.id = id;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent.trim();
      a.addEventListener('click', function(e) {
        e.preventDefault();
        const offset = 120;
        const targetPosition = heading.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        window.history.pushState(null, null, `#${id}`);
      });

      li.appendChild(a);

      if (level > currentLevel) {
        const ul = document.createElement('ul');
        li.appendChild(ul);
        currentList.appendChild(li);
        currentList = ul;
      } else if (level < currentLevel) {
        // Go back up the hierarchy
        let parentList = currentList.parentElement;
        while (parentList && parentList.tagName !== 'UL') {
          parentList = parentList.parentElement;
        }
        if (parentList && parentList.tagName === 'UL') {
          currentList = parentList;
        }
        currentList.appendChild(li);
      } else {
        currentList.appendChild(li);
      }

      currentLevel = level;
    });

    // Insert TOC in sidebar
    const tocContainer = document.getElementById('post-toc-content');
    if (tocContainer) {
      tocContainer.appendChild(tocList);
    }

    // Highlight active section
    function highlightActiveSection() {
      const scrollPos = window.scrollY + 150;
      let activeHeading = null;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          activeHeading = heading;
        }
      });

      tocList.querySelectorAll('a').forEach((link) => {
        link.classList.remove('active');
        if (activeHeading && link.getAttribute('href') === `#${activeHeading.id}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 100;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });
  }

  // Copy code blocks
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
      const pre = codeBlock.parentElement;
      if (pre.querySelector('.copy-code-btn')) return;

      const button = document.createElement('button');
      button.className = 'copy-code-btn';
      button.innerHTML = '<i class="fas fa-copy"></i>';
      button.setAttribute('aria-label', 'Copier le code');
      button.style.cssText = `
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        background: var(--db-bg);
        border: 1px solid var(--db-border);
        border-radius: 6px;
        padding: 0.5rem;
        cursor: pointer;
        color: var(--db-text-secondary);
        transition: all 0.2s ease;
      `;

      button.addEventListener('mouseenter', function() {
        this.style.background = 'var(--db-primary)';
        this.style.color = 'white';
        this.style.borderColor = 'var(--db-primary)';
      });

      button.addEventListener('mouseleave', function() {
        this.style.background = 'var(--db-bg)';
        this.style.color = 'var(--db-text-secondary)';
        this.style.borderColor = 'var(--db-border)';
      });

      button.addEventListener('click', async function() {
        const text = codeBlock.textContent;
        try {
          await navigator.clipboard.writeText(text);
          button.innerHTML = '<i class="fas fa-check"></i>';
          setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i>';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }

  // Initialize all features
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initReadingProgress();
        initTableOfContents();
        initSmoothScroll();
        initCodeCopy();
      });
    } else {
      initReadingProgress();
      initTableOfContents();
      initSmoothScroll();
      initCodeCopy();
    }
  }

  init();

})();
