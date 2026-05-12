# Carte de deploiement

Ce document definit le flux de deploiement de reference pour eviter les ambiguities.

## Cibles

- Frontend statique: GitHub Pages (build Jekyll depuis `backend/app/`)
- Backend API: Cloud Run (image Docker publiee sur GHCR)

## Workflow officiel

- Workflow principal: `.github/workflows/ci.yml`
- Branche de deploiement: `main`

## Flux Frontend (GitHub Pages)

1. Build Jekyll avec Ruby dans `backend/app/`
2. Generation du site dans `backend/app/_site`
3. Publication via `actions/deploy-pages`

Resultat: site public sur [https://smdlabtech.github.io/](https://smdlabtech.github.io/)

## Flux Backend (Cloud Run)

1. Build Docker depuis `backend/app/Dockerfile`
2. Push image vers GHCR (`ghcr.io/<actor>/smdlabtech.github.io:<sha>`)
3. Deploiement Cloud Run avec `gcloud run deploy`
4. Health check sur `/health`

## Variables et secrets requis

- Variables Actions:
  - `GCP_PROJECT_ID`
  - `GCP_REGION`
- Secrets Actions:
  - `GCP_SA_KEY`

## Regle de gouvernance

- Toute modification de flux CI/CD doit etre reportee dans ce document.
- Ne pas introduire une seconde cible d'image sans decision explicite et doc associee.
