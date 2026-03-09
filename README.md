# Pendule Foucault App

## Deploiement sur GitHub Pages

Le projet est configure pour etre deploye automatiquement sur GitHub Pages via GitHub Actions.

### Prerequis

- Le depot GitHub est `adrien-cardinale/pendule-foucault-app`
- La branche de deploiement est `main`

### Activer GitHub Pages

1. Ouvre le depot sur GitHub.
2. Va dans `Settings > Pages`.
3. Dans `Build and deployment`, choisis `Source: GitHub Actions`.

### Deploiement automatique

Chaque `git push` sur `main` lance le workflow:

- `.github/workflows/deploy.yml`

Le workflow:

1. installe les dependances (`npm ci`)
2. lance le build (`npm run build`)
3. publie le dossier `dist` sur GitHub Pages

### URL du site

Une fois le workflow termine, le site est accessible ici:

- `https://adrien-cardinale.github.io/pendule-foucault-app/`

### Lancer localement

```bash
npm install
npm run dev
```
