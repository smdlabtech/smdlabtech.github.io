document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const darkBtn = document.getElementById('toggle-dark');
  const widthBtn = document.getElementById('toggle-width');

  // Dark/Light
  function setTheme(theme) {
    body.classList.toggle('dark-mode', theme === 'dark');
    localStorage.setItem('theme', theme);
  }
  darkBtn.onclick = function () {
    const theme = body.classList.contains('dark-mode') ? 'light' : 'dark';
    setTheme(theme);
  };
  // Init
  setTheme(localStorage.getItem('theme') || 'light');

  // Largeur
  function setWidth(mode) {
    body.classList.toggle('layout-wide', mode === 'wide');
    body.classList.toggle('layout-centered', mode === 'centered');
    localStorage.setItem('layout', mode);
  }
  widthBtn.onclick = function () {
    const mode = body.classList.contains('layout-wide') ? 'centered' : 'wide';
    setWidth(mode);
  };
  // Init
  setWidth(localStorage.getItem('layout') || 'centered');
}); 