document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const darkBtn = document.getElementById('toggle-dark');
  const widthBtn = document.getElementById('toggle-width');

  //-------------//
  // Dark/Light
  //-------------//
  function setTheme(theme) {
    if (theme === 'dark') {
      body.classList.add('dark-mode');
      if (darkBtn) darkBtn.textContent = '☀️';
    } else {
      body.classList.remove('dark-mode');
      if (darkBtn) darkBtn.textContent = '🌙';
    }
    localStorage.setItem('theme', theme);
  }
  if (darkBtn) {
    darkBtn.onclick = function () {
      const theme = body.classList.contains('dark-mode') ? 'light' : 'dark';
      setTheme(theme);
    };
    setTheme(localStorage.getItem('theme') || 'light');
  }

  //-------------//
  // Largeur
  //-------------//
  function setWidth(mode) {
    if (mode === 'wide') {
      body.classList.add('layout-wide');
      body.classList.remove('layout-centered');
      if (widthBtn) widthBtn.textContent = '🖥️';
    } else {
      body.classList.remove('layout-wide');
      body.classList.add('layout-centered');
      if (widthBtn) widthBtn.textContent = '📱';
    }
    localStorage.setItem('layout', mode);
  }
  if (widthBtn) {
    widthBtn.onclick = function () {
      const mode = body.classList.contains('layout-wide') ? 'centered' : 'wide';
      setWidth(mode);
    };
    setWidth(localStorage.getItem('layout') || 'centered');
  }
}); 