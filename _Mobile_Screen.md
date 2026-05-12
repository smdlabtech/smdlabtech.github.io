# Prompt expert — Screening mobile (version robuste)

Utilise ce prompt tel quel dans un assistant IA de design/implémentation front :

```text
Tu es un Lead Frontend Engineer + Senior Product Designer spécialisé en UX mobile SaaS.
Ta mission : corriger et sublimer la landing mobile d’une plateforme Next.js/Tailwind, sans régression desktop.

## Produit
- Nom: Datamart analysis
- Domaine: scoring retail ML (Display / No_Displ)
- Stack: Next.js (App Router), React, Tailwind CSS
- Thèmes: light + dark
- Langues: FR + EN

## Navigation cible (obligatoire)
1. Home
2. Predictions
3. Data
4. Demo
5. Training

## Problèmes observés à résoudre
1) Débordements horizontaux sur mobile (éléments qui sortent de l’écran).
2) Header trop chargé en petit écran.
3) CTA parfois serrés / difficiles à cliquer.
4) Sections visuellement denses en largeur < 390 px.
5) Cohérence mobile/desktop incomplète.

## Résultat attendu
Livrer une expérience mobile premium de 320px à 430px:
- propre,
- lisible,
- navigable au pouce,
- sans overflow horizontal.

## Contraintes UX/UI (obligatoires)
### A. Header mobile
- Logo + marque tronquée avec ellipsis.
- Bouton hamburger clairement visible.
- Contrôles secondaires (thème, langue, accès métriques/profil) sortis du top bar mobile.

### B. Drawer mobile
- Ouverture latérale avec overlay.
- Contient exactement: Home, Predictions, Data, Demo, Training.
- Lien actif clairement indiqué.
- Fermeture via: bouton close, clic overlay, touche Escape.
- Scroll body verrouillé pendant ouverture.
- Respect safe-area iOS (env(safe-area-inset-*)).

### C. Anti-overflow strict
- Aucun composant ne doit créer de scroll horizontal.
- Gérer textes longs (break-words / truncate / max-width).
- Boutons CTA empilés sur mobile, inline seulement à partir de sm.
- Grilles desktop -> 1 colonne mobile.
- Contrôler effets décoratifs absolus (blur/halo) pour qu’ils ne débordent pas.

### D. Accessibilité
- Cibles tactiles >= 44x44.
- Contraste AA.
- Focus visible clavier.
- ARIA complet: aria-expanded, aria-controls, aria-modal, aria-current.
- États interactifs cohérents (hover/focus/active/pressed).

### E. Mouvement
- Animations subtiles.
- Réduction des animations via prefers-reduced-motion.
- Éviter carrousels trop rapides en mobile.

## Contraintes techniques (obligatoires)
- Code prêt à intégrer, pas de pseudo-code.
- Conserver architecture actuelle des composants.
- Préserver le desktop existant.
- Ajouter uniquement des commentaires utiles.
- Vérifier: typecheck + lint.

## Definition of Done
- iPhone SE (375x667), iPhone 12/13/14, Pixel standard: aucun débordement.
- Menu mobile fonctionnel sur tous les cas d’usage.
- Navigation complète visible et accessible.
- Desktop inchangé visuellement (hors améliorations mineures neutres).
- Build/Typecheck/Lint OK.

## Format de sortie attendu
1. Diagnostic (liste priorisée des problèmes).
2. Plan d’implémentation.
3. Diff/code final prêt à coller.
4. Checklist de tests manuels:
   - 320px
   - 375px
   - 390px
   - 430px
   - desktop >= 1024px
5. Améliorations phase 2 (optionnelles).
```

## Variante ultra-courte

```text
Refactor la landing mobile Next.js/Tailwind pour supprimer tout overflow horizontal et améliorer la navigation mobile. Mets un menu hamburger + drawer (Home, Predictions, Data, Demo, Training), déplace les contrôles secondaires dans le drawer, rends les CTA full-width en mobile, conserve le desktop intact, ajoute ARIA complet, puis fournis code final + checklist de tests iPhone SE/Android + validation typecheck/lint.
```

## Astuce d’usage

- Si tu veux un résultat “directement exécutable”, ajoute à la fin du prompt:
  - “Rends les modifications dans `frontend/components/Nav.tsx`, `frontend/app/page.tsx`, `frontend/app/globals.css` et nulle part ailleurs sauf nécessité.”

## Extension QA (à ajouter au prompt)

```text
## Vérification obligatoire après implémentation
- Exécute `npm run typecheck` dans `frontend/`.
- Lance un contrôle lint sur les fichiers modifiés.
- Fournis un mini rapport:
  - fichiers touchés,
  - points de débordement corrigés,
  - risques résiduels.

## Plan de tests manuels détaillé
- Viewports:
  - 320x568
  - 360x800
  - 375x667
  - 390x844
  - 430x932
- Vérifier à chaque viewport:
  1) Pas de scroll horizontal.
  2) Header lisible, hamburger accessible.
  3) Drawer: open/close + overlay + Escape.
  4) Liens menu visibles: Home, Predictions, Data, Demo, Training.
  5) CTA principaux cliquables sans chevauchement.
  6) Dark mode + Light mode.
  7) FR + EN.
```

## Mode “anti-régression desktop”

```text
Ajoute une contrainte stricte: "Toute modification mobile doit préserver le rendu desktop >= 1024px. En cas de conflit, utiliser des classes responsives (`sm:`, `md:`, `lg:`) et éviter les changements globaux non conditionnés."
```

## Prompt exécution stricte (copier-coller)

```text
Exécute cette mission en mode implémentation directe.
Tu dois:
1) Identifier les débordements mobile réels.
2) Corriger d’abord la navbar/drawer, puis les sections de la landing.
3) Limiter les changements aux fichiers:
   - frontend/components/Nav.tsx
   - frontend/app/page.tsx
   - frontend/app/globals.css
4) Conserver le desktop inchangé visuellement.
5) Exécuter les vérifications suivantes:
   - npm run typecheck
   - lint sur les fichiers modifiés

Ensuite, fournis un rapport court:
- Modifications appliquées
- Problèmes corrigés
- Vérifications réalisées
- Risques restants (si présents)
```

## Template de rapport final (attendu)

```text
### Résultat
- [x] Menu mobile fonctionnel
- [x] Navigation complète (Home, Predictions, Data, Demo, Training)
- [x] Aucun overflow horizontal sur 320/360/375/390/430
- [x] Desktop préservé

### Fichiers modifiés
- frontend/components/Nav.tsx
- frontend/app/page.tsx
- frontend/app/globals.css

### Vérifications
- typecheck: OK
- lint: OK

### Risques résiduels
- (none) ou liste courte
```

## Plan d’attaque recommandé (ordre de priorité)

```text
Passe 1 — Blocage critique
1) Corriger la navbar mobile (hamburger + drawer + overflow).
2) Vérifier qu’aucune top action ne déborde en 320px.
3) Ajouter protections globales anti-overflow (avec prudence).

Passe 2 — Densité de la landing
1) Hero: titres, badges, CTA full-width.
2) Cartes métriques/login: textes longs + listes clé/valeur.
3) Sections à forte densité (methodology, definitions, faq, final CTA).

Passe 3 — Composants secondaires
1) LandingSectionNav
2) DemoGifCarousel
3) TrustedBySection
4) TestimonialsSection
5) ContactSection

Passe 4 — Finition
1) Dark mode
2) FR/EN
3) Reduced motion
4) Desktop anti-régression
```

## Checklist anti-overflow par composant

```text
Pour chaque composant, vérifier:
- conteneur parent avec min-w-0 si nécessaire;
- textes longs: break-words/truncate selon contexte;
- boutons: pas de largeur implicite excessive;
- grilles: 1 colonne en mobile;
- éléments absolus (halos/blur): ne pas créer de scroll horizontal;
- carrousels/marquees: vitesse mobile adaptée + masque latéral non intrusif.
```

## Compléments issus de l’implémentation (retour terrain)

```text
### 1) Forme finale validée pour le menu mobile
- Drawer latéral (et non bottom-sheet), aligné à droite utilisateur.
- Overlay sombre cliquable pour fermeture.
- En-tête de drawer: titre "Menu" + bouton close visible.
- Liens verticaux larges, état actif en capsule légère.
- Barre fixe en bas du drawer: profil/métriques, thème, langue.

### 2) Contrôles thème/langue/profil
- Sur mobile, masquer ces contrôles dans la top bar: ils doivent vivre uniquement dans le drawer.
- Garder la top bar desktop inchangée (>= lg).
- Prévoir des variantes de composants (ex: variant="drawer") pour éviter de casser le desktop.
- Bouton profil/métriques: cercle 44x44 minimum, contraste fort, icône lisible.

### 3) Accessibilité et interactions à imposer
- Fermer via: bouton close, clic overlay, touche Escape, clic sur un lien.
- Verrouiller le scroll document pendant l’ouverture.
- Focus trap: inclure bouton menu, bouton close, puis les liens.
- Restituer le focus au bouton menu à la fermeture.
- aria-current correct sur le lien actif du drawer.

### 4) Détails techniques importants (React/Next)
- Conserver une taille stable des tableaux de dépendances useEffect (éviter les variations conditionnelles).
- Si warning "set-state-in-effect", différer via queueMicrotask/requestAnimationFrame si nécessaire.
- Prévoir ResizeObserver pour caler dynamiquement top/height du drawer sous la nav sticky.

### 5) Spécificités design à verrouiller
- Respect stricte de la palette produit (éviter les bleus parasites si la marque est emerald/teal).
- Uniformiser bordures/rayons/états actifs entre switches thème et langue.
- Boutons CTA en full-width mobile, inline à partir de sm.
- Vérifier systématiquement 320/360/375/390/430.

### 6) Risques réels rencontrés
- ENOSPC (no space left on device) peut bloquer tsc/eslint: prévoir fallback ReadLints + vérif manuelle.
- Le panneau peut sembler "au-dessus mais transparent" si layering/opacity mal gérés.
- Les contrôles desktop peuvent rester visibles en mobile sans classes responsives explicites.

### 7) Prompt additionnel recommandé
Ajoute cette contrainte dans le prompt:
"Le menu mobile doit être un drawer latéral droit avec footer de contrôles (profil, thème, langue), et ces contrôles doivent être absents de la top bar mobile."
```
