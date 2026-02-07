/**
 * Innovative Features JavaScript
 * Fonctionnalités vraiment innovantes
 */

(function() {
  'use strict';

  // ============================================
  // 3D Card Tilt Effect
  // ============================================
  function init3DCards() {
    const cards = document.querySelectorAll('.post-preview, .card');

    cards.forEach(card => {
      card.classList.add('card-3d');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      });
    });
  }

  // ============================================
  // Magnetic Hover Effect
  // ============================================
  function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn, .nav-link, .post-preview');

    magneticElements.forEach(el => {
      el.classList.add('magnetic');

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        const moveX = x * 0.1;
        const moveY = y * 0.1;

        el.style.setProperty('--magnetic-x', `${moveX}px`);
        el.style.setProperty('--magnetic-y', `${moveY}px`);
      });

      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--magnetic-x', '0');
        el.style.setProperty('--magnetic-y', '0');
      });
    });
  }

  // ============================================
  // Morphing Background
  // ============================================
  function initMorphingBackground() {
    if (window.innerWidth < 768) return; // Désactiver sur mobile

    const morphingBg = document.createElement('div');
    morphingBg.className = 'morphing-bg';
    morphingBg.innerHTML = `
      <div class="morphing-blob"></div>
      <div class="morphing-blob"></div>
      <div class="morphing-blob"></div>
    `;
    document.body.appendChild(morphingBg);
  }

  // ============================================
  // Interactive Cursor Trail
  // ============================================
  function initCursorTrail() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const trail = [];
    const trailLength = 8;

    document.addEventListener('mousemove', (e) => {
      const dot = document.createElement('div');
      dot.className = 'cursor-trail';
      dot.style.left = e.clientX - 10 + 'px';
      dot.style.top = e.clientY - 10 + 'px';
      document.body.appendChild(dot);

      trail.push(dot);
      if (trail.length > trailLength) {
        const oldDot = trail.shift();
        oldDot.style.opacity = '0';
        oldDot.style.transform = 'scale(0)';
        setTimeout(() => oldDot.remove(), 300);
      }

      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0)';
        setTimeout(() => {
          dot.remove();
          const index = trail.indexOf(dot);
          if (index > -1) trail.splice(index, 1);
        }, 300);
      }, 800);
    });
  }

  // ============================================
  // Text Reveal Animation
  // ============================================
  function initTextReveal() {
    const revealElements = document.querySelectorAll('h1, h2, .hero-title');

    revealElements.forEach(el => {
      el.classList.add('text-reveal');
    });
  }

  // ============================================
  // Split Text Animation
  // ============================================
  function initSplitText() {
    const splitElements = document.querySelectorAll('.split-text-target');

    splitElements.forEach(el => {
      const text = el.textContent;
      const words = text.split(' ');

      el.innerHTML = words.map(word =>
        `<span>${word}</span>`
      ).join(' ');

      el.classList.add('split-text');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(el);
    });
  }

  // ============================================
  // Image Zoom with Overlay
  // ============================================
  function initImageZoom() {
    const images = document.querySelectorAll('.blog-post img, .post-image img');

    images.forEach(img => {
      const container = document.createElement('div');
      container.className = 'image-zoom-container';

      const overlay = document.createElement('div');
      overlay.className = 'image-zoom-overlay';
      overlay.innerHTML = `<p style="margin: 0; font-size: 0.875rem;">${img.alt || 'Image'}</p>`;

      img.parentNode.insertBefore(container, img);
      container.appendChild(img);
      container.appendChild(overlay);
    });
  }

  // ============================================
  // Stagger Animation
  // ============================================
  function initStaggerAnimation() {
    const staggerContainers = document.querySelectorAll('.stagger-container');

    staggerContainers.forEach(container => {
      // Exclure les cartes de blog (gérées séparément pour apparaître ensemble)
      const items = container.querySelectorAll('.stagger-item:not(.blog-card-databird)');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Toutes les cartes apparaissent ensemble
            items.forEach(item => item.classList.add('animated'));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(container);
    });
  }

  // ============================================
  // Floating Action Button
  // ============================================
  function initFAB() {
    const fabContainer = document.createElement('div');
    fabContainer.className = 'fab-container';
    fabContainer.innerHTML = `
      <div class="fab-menu" id="fab-menu">
        <button class="fab-item" data-action="bookmark" aria-label="Bookmark">
          <i class="fas fa-bookmark"></i>
        </button>
        <button class="fab-item" data-action="share" aria-label="Partager">
          <i class="fas fa-share"></i>
        </button>
        <button class="fab-item" data-action="focus" aria-label="Focus">
          <i class="fas fa-book-reader"></i>
        </button>
        <button class="fab-item" data-action="zen" aria-label="Zen">
          <i class="fas fa-spa"></i>
        </button>
      </div>
      <button class="fab-main" id="fab-main" aria-label="Menu">
        <i class="fas fa-plus"></i>
      </button>
    `;
    document.body.appendChild(fabContainer);

    const fabMain = fabContainer.querySelector('#fab-main');
    const fabMenu = fabContainer.querySelector('#fab-menu');

    fabMain.addEventListener('click', () => {
      fabMenu.classList.toggle('active');
      fabMain.style.transform = fabMenu.classList.contains('active')
        ? 'rotate(45deg) scale(1.1)'
        : 'rotate(0) scale(1)';
    });

    fabMenu.querySelectorAll('.fab-item').forEach(item => {
      item.addEventListener('click', () => {
        const action = item.dataset.action;
        handleFABAction(action);
        fabMenu.classList.remove('active');
        fabMain.style.transform = 'rotate(0) scale(1)';
      });
    });
  }

  function handleFABAction(action) {
    switch (action) {
      case 'bookmark':
        document.querySelector('.bookmark-btn')?.click();
        break;
      case 'share':
        document.querySelector('.social-share-modern')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'focus':
        document.querySelector('.focus-mode-btn')?.click();
        break;
      case 'zen':
        document.querySelector('[aria-label="Mode Zen"]')?.click();
        break;
    }
  }

  // ============================================
  // Scroll Progress Circle
  // ============================================
  function initScrollProgressCircle() {
    const progressCircle = document.createElement('div');
    progressCircle.className = 'scroll-progress-circle';
    progressCircle.innerHTML = `
      <svg class="scroll-progress-svg">
        <circle class="scroll-progress-circle-bg" cx="30" cy="30" r="30"></circle>
        <circle class="scroll-progress-circle-progress" cx="30" cy="30" r="30"></circle>
      </svg>
      <div class="scroll-progress-text">0%</div>
    `;
    document.body.appendChild(progressCircle);

    const progressBar = progressCircle.querySelector('.scroll-progress-circle-progress');
    const progressText = progressCircle.querySelector('.scroll-progress-text');
    const circumference = 2 * Math.PI * 30;

    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference;

    window.addEventListener('scroll', () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / scrollableHeight) * 100;

      const offset = circumference - (progress / 100) * circumference;
      progressBar.style.strokeDashoffset = offset;
      progressText.textContent = Math.round(progress) + '%';

      if (scrollTop > 300) {
        progressCircle.style.opacity = '1';
        progressCircle.style.visibility = 'visible';
      } else {
        progressCircle.style.opacity = '0';
        progressCircle.style.visibility = 'hidden';
      }
    }, { passive: true });

    progressCircle.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // Gradient Mesh Background
  // ============================================
  function initGradientMesh() {
    if (window.innerWidth < 768) return;

    const mesh = document.createElement('div');
    mesh.className = 'gradient-mesh';
    document.body.appendChild(mesh);
  }

  // ============================================
  // Liquid Button Effect
  // ============================================
  function initLiquidButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-lg');

    buttons.forEach(btn => {
      btn.classList.add('liquid-btn');
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

    init3DCards();
    initMagneticEffect();
    initMorphingBackground();
    // initCursorTrail(); // Décommentez pour activer
    initTextReveal();
    initSplitText();
    initImageZoom();
    initStaggerAnimation();
    initFAB();
    initScrollProgressCircle();
    initGradientMesh();
    initLiquidButtons();
  }

  init();

})();
