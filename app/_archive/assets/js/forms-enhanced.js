/**
 * Formulaires Améliorés JavaScript
 * Fonctionnalités avancées pour les formulaires
 */

(function() {
  'use strict';

  // ============================================
  // Form Validation Enhanced
  // ============================================

  function initFormValidation() {
    const forms = document.querySelectorAll('.form-enhanced, form[data-validate]');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
          validateInput(this);
        });

        input.addEventListener('input', function() {
          if (this.classList.contains('error') || this.classList.contains('success')) {
            validateInput(this);
          }
        });
      });

      // Form submission
      form.addEventListener('submit', function(e) {
        let isValid = true;

        inputs.forEach(input => {
          if (!validateInput(input)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          showFormError(form, 'Veuillez corriger les erreurs avant de soumettre.');
          return false;
        }
      });
    });
  }

  function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    const required = input.hasAttribute('required');
    const pattern = input.getAttribute('pattern');
    const minLength = input.getAttribute('minlength');
    const maxLength = input.getAttribute('maxlength');
    const min = input.getAttribute('min');
    const max = input.getAttribute('max');

    // Remove previous feedback
    const existingFeedback = input.parentElement.querySelector('.form-feedback');
    if (existingFeedback) {
      existingFeedback.remove();
    }

    input.classList.remove('error', 'success');

    // Required check
    if (required && !value) {
      showInputError(input, 'Ce champ est obligatoire.');
      return false;
    }

    // Skip validation if empty and not required
    if (!value && !required) {
      return true;
    }

    // Pattern validation
    if (pattern && value) {
      const regex = new RegExp(pattern);
      if (!regex.test(value)) {
        showInputError(input, input.getAttribute('data-pattern-error') || 'Format invalide.');
        return false;
      }
    }

    // Length validation
    if (minLength && value.length < parseInt(minLength)) {
      showInputError(input, `Minimum ${minLength} caractères requis.`);
      return false;
    }

    if (maxLength && value.length > parseInt(maxLength)) {
      showInputError(input, `Maximum ${maxLength} caractères autorisés.`);
      return false;
    }

    // Min/Max validation
    if (min && parseFloat(value) < parseFloat(min)) {
      showInputError(input, `La valeur minimale est ${min}.`);
      return false;
    }

    if (max && parseFloat(value) > parseFloat(max)) {
      showInputError(input, `La valeur maximale est ${max}.`);
      return false;
    }

    // Type-specific validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showInputError(input, 'Adresse email invalide.');
        return false;
      }
    }

    if (type === 'url' && value) {
      try {
        new URL(value);
      } catch (e) {
        showInputError(input, 'URL invalide.');
        return false;
      }
    }

    // Success state
    input.classList.add('success');
    showInputSuccess(input);
    return true;
  }

  function showInputError(input, message) {
    input.classList.add('error');
    const feedback = document.createElement('span');
    feedback.className = 'form-feedback error';
    feedback.textContent = message;
    input.parentElement.appendChild(feedback);
  }

  function showInputSuccess(input) {
    const feedback = document.createElement('span');
    feedback.className = 'form-feedback success';
    feedback.textContent = '✓ Valide';
    input.parentElement.appendChild(feedback);
  }

  function showFormError(form, message) {
    const existingError = form.querySelector('.form-error-message');
    if (existingError) {
      existingError.remove();
    }

    const error = document.createElement('div');
    error.className = 'form-error-message';
    error.style.cssText = 'background: var(--ds-error-lighter); border: 1px solid var(--ds-error); border-radius: var(--ds-radius-lg); padding: var(--ds-spacing-4); margin-bottom: var(--ds-spacing-4); color: var(--ds-error-dark);';
    error.textContent = message;
    form.insertBefore(error, form.firstChild);

    // Scroll to error
    error.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // ============================================
  // File Upload Enhanced
  // ============================================

  function initFileUpload() {
    const fileUploads = document.querySelectorAll('.file-upload-enhanced');

    fileUploads.forEach(upload => {
      const input = upload.querySelector('.file-upload-enhanced-input');
      const label = upload.querySelector('.file-upload-enhanced-label');
      const filename = upload.querySelector('.file-upload-enhanced-filename');

      if (!input || !label) return;

      input.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
          const file = this.files[0];
          label.classList.add('has-file');

          if (filename) {
            filename.textContent = file.name;
          } else {
            const filenameEl = document.createElement('div');
            filenameEl.className = 'file-upload-enhanced-filename';
            filenameEl.textContent = file.name;
            upload.appendChild(filenameEl);
          }
        } else {
          label.classList.remove('has-file');
          if (filename) {
            filename.textContent = '';
          }
        }
      });
    });
  }

  // ============================================
  // Multi-step Forms
  // ============================================

  function initMultiStepForms() {
    const multiStepForms = document.querySelectorAll('.form-enhanced[data-multi-step]');

    multiStepForms.forEach(form => {
      const steps = form.querySelectorAll('.form-step');
      const stepContents = form.querySelectorAll('.form-step-content');
      const nextBtn = form.querySelector('[data-next-step]');
      const prevBtn = form.querySelector('[data-prev-step]');
      let currentStep = 0;

      function showStep(stepIndex) {
        // Update steps
        steps.forEach((step, index) => {
          step.classList.remove('active');
          if (index < stepIndex) {
            step.classList.add('completed');
          } else {
            step.classList.remove('completed');
          }
          if (index === stepIndex) {
            step.classList.add('active');
          }
        });

        // Update content
        stepContents.forEach((content, index) => {
          content.classList.remove('active');
          if (index === stepIndex) {
            content.classList.add('active');
          }
        });

        currentStep = stepIndex;

        // Update buttons
        if (prevBtn) {
          prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-block';
        }
        if (nextBtn) {
          nextBtn.textContent = stepIndex === steps.length - 1 ? 'Soumettre' : 'Suivant';
        }
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();

          // Validate current step
          const currentContent = stepContents[currentStep];
          const inputs = currentContent.querySelectorAll('input[required], textarea[required], select[required]');
          let isValid = true;

          inputs.forEach(input => {
            if (!validateInput(input)) {
              isValid = false;
            }
          });

          if (!isValid) {
            return;
          }

          if (currentStep < steps.length - 1) {
            showStep(currentStep + 1);
          } else {
            form.submit();
          }
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (currentStep > 0) {
            showStep(currentStep - 1);
          }
        });
      }

      // Initialize
      showStep(0);
    });
  }

  // ============================================
  // Form Auto-save
  // ============================================

  function initFormAutoSave() {
    const autoSaveForms = document.querySelectorAll('form[data-auto-save]');

    autoSaveForms.forEach(form => {
      const formId = form.getAttribute('data-auto-save');
      const inputs = form.querySelectorAll('input, textarea, select');

      // Load saved data
      const savedData = localStorage.getItem(`form_autosave_${formId}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          inputs.forEach(input => {
            if (data[input.name]) {
              input.value = data[input.name];
            }
          });
        } catch (e) {
          console.error('Error loading autosave:', e);
        }
      }

      // Save on input
      inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
          const formData = {};
          inputs.forEach(inp => {
            if (inp.name) {
              formData[inp.name] = inp.value;
            }
          });
          localStorage.setItem(`form_autosave_${formId}`, JSON.stringify(formData));
        }, 1000));
      });

      // Clear on submit
      form.addEventListener('submit', () => {
        localStorage.removeItem(`form_autosave_${formId}`);
      });
    });
  }

  // ============================================
  // Form Loading States
  // ============================================

  function initFormLoadingStates() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', function() {
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('form-submit-loading');
          submitBtn.disabled = true;
        }
      });
    });
  }

  // ============================================
  // Debounce Helper
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

  // ============================================
  // Initialize All
  // ============================================

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initFormValidation();
    initFileUpload();
    initMultiStepForms();
    initFormAutoSave();
    initFormLoadingStates();
  }

  // Start initialization
  init();

  // Export API
  window.FormsEnhanced = {
    validateInput,
    initFormValidation,
    initMultiStepForms,
    initFormAutoSave
  };

})();
