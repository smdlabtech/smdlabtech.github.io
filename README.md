# 🚀 Blog Data & IA — Portfolio & Articles

[![Site](https://img.shields.io/badge/🌐_Live-Site-blue?style=for-the-badge)](https://smdlabtech.github.io/)
[![Jekyll](https://img.shields.io/badge/Jekyll-GitHub%20Pages-CC0000?style=flat&logo=jekyll)](https://jekyllrb.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Blog et portfolio** : Data Science, Business Intelligence, IA & Technologies.  
Contenu informatif, tutoriels et retours d’expérience.

---


## ✨ En bref

- **Site en ligne** : [https://smdlabtech.github.io/](https://smdlabtech.github.io/)
- **Stack** : Jekyll (front) + Flask (API optionnelle), déployé via GitHub Actions
- **Contenu** : articles par catégories (Data Science, IA, Data Analytics, BI, Data Engineering), newsletter, recherche

---

## 🎯 Points forts du repo

| Domaine | Détail |
|--------|--------|
| **Performance** | CSS/JS en bundles, PWA (Service Worker), lazy loading |
| **Qualité** | Tests pytest, pre-commit (black, flake8, isort), CI unifiée |
| **Observabilité** | Prometheus, Grafana, health checks, métriques |
| **DX** | Script de test avant prod, docs centralisées dans `docs/` |
| **Sécurité** | Headers OWASP, CORS configurable, rate limiting |

---

## 📁 Structure

```
├── app/                 # Jekyll + Flask
│   ├── _config.yml      # Config Jekyll
│   ├── _layouts/        # base → bundles
│   ├── _posts/          # Articles
│   ├── assets/          # main.bundle.css/js
│   ├── src/             # API Flask
│   └── scripts/         # test-local.sh, etc.
├── tests/               # Pytest
├── docs/                # CONTRIBUTING, structure, env, idées
└── .github/workflows/   # CI/CD
```

---

## 🧪 Lancer en local

```bash
# Tests + build Jekyll
./app/scripts/test-local.sh

# Site Jekyll
cd app && bundle install && bundle exec jekyll serve
# → http://localhost:4000
```

**Environnement** : copier `env.example` en `.env` si vous utilisez Flask. Voir [docs/ENV_VARIABLES.md](docs/ENV_VARIABLES.md).

---

## 📖 À propos

**Daya** — Data scientist, passionné par le foot et le basket.  
Partage de la programmation en **Python**, **R**, **SQL**, **Power BI** et **Excel VBA**.

---

## 📚 Documentation

- [Tester avant prod](docs/TESTER_AVANT_PROD.md) · [Structure](docs/STRUCTURE.md) · [Contribuer](docs/CONTRIBUTING.md)
- [Variables d’env](docs/ENV_VARIABLES.md) · [Idées d’améliorations](docs/IDEES_AMELIORATIONS.md) · [Code de conduite](CODE_OF_CONDUCT.md)

---

## 📝 Licence

MIT — voir [LICENSE](LICENSE).

---

<div align="center">
  <p><strong>Fait avec ❤️ par <a href="https://github.com/smdlabtech">smdlabtech</a></strong></p>
  <p>
    <a href="https://github.com/smdlabtech">GitHub</a> ·
    <a href="https://www.linkedin.com/in/dayasylla/">LinkedIn</a> ·
    <a href="https://smdlabtech.github.io/">Blog</a>
  </p>
</div>
