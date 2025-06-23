document.addEventListener("DOMContentLoaded", function () {
  var options = {
    valueNames: ['title', 'excerpt', 'date', 'categories', 'tags'],
    listClass: 'list'
  };
  var articleList = new List('articles-list', options);

  // Remplir les filtres dynamiquement
  const articles = document.querySelectorAll('.article-card');
  const years = new Set();
  const categories = new Set();
  const tags = new Set();

  articles.forEach(article => {
    years.add(article.dataset.year);
    article.dataset.category.split(',').forEach(cat => categories.add(cat.trim()));
    article.dataset.tags.split(',').forEach(tag => tags.add(tag.trim()));
  });

  function fillSelect(selectId, values) {
    const select = document.getElementById(selectId);
    Array.from(values).sort().forEach(val => {
      if (val) {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        select.appendChild(opt);
      }
    });
  }
  fillSelect('filter-year', years);
  fillSelect('filter-category', categories);
  fillSelect('filter-tag', tags);

  // Filtres
  document.getElementById('filter-year').addEventListener('change', function () {
    filterArticles();
  });
  document.getElementById('filter-category').addEventListener('change', function () {
    filterArticles();
  });
  document.getElementById('filter-tag').addEventListener('change', function () {
    filterArticles();
  });

  function filterArticles() {
    const year = document.getElementById('filter-year').value;
    const category = document.getElementById('filter-category').value;
    const tag = document.getElementById('filter-tag').value;

    articles.forEach(article => {
      let show = true;
      if (year && article.dataset.year !== year) show = false;
      if (category && !article.dataset.category.split(',').includes(category)) show = false;
      if (tag && !article.dataset.tags.split(',').includes(tag)) show = false;
      article.style.display = show ? '' : 'none';
    });
  }
}); 