/**
 * Theme Toggle - Dark/Light Mode
 * Version améliorée avec animations fluides
 */
document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const darkBtn = document.getElementById('toggle-dark');

  //-------------//
  // Dark/Light Mode
  //-------------//
  function setTheme(theme) {
    const isDark = theme === 'dark';
    
    // Transition fluide
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDark) {
      body.classList.add('dark-mode');
      if (darkBtn) {
        const icon = darkBtn.querySelector('.theme-toggle-icon');
        if (icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      }
    } else {
      body.classList.remove('dark-mode');
      if (darkBtn) {
        const icon = darkBtn.querySelector('.theme-toggle-icon');
        if (icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      }
    }
    
    localStorage.setItem('theme', theme);
    
    // Retirer la transition après l'animation
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  }

  if (darkBtn) {
    darkBtn.onclick = function (e) {
      e.preventDefault();
      const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    };
    
    // Initialiser le thème
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }
}); 