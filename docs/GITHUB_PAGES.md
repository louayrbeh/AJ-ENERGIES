# Publication GitHub Pages

Configuration préparée le 19 octobre 2026 pour `louayrbeh/AJ-ENERGIES`.

## Méthode unique

- Source dans **Settings → Pages → Build and deployment → Source : GitHub Actions**.
- Branche de travail et déclencheur : `main` ; lancement manuel également disponible dans **Actions → Deploy AJ ENERGIES to GitHub Pages → Run workflow**.
- Workflow : `.github/workflows/pages.yml`, avec les actions officielles `checkout`, `setup-node`, `configure-pages`, `upload-pages-artifact` et `deploy-pages`.
- Node 24, aucune installation de dépendances pour la génération. Les neuf tests de contact utilisent des bouchons, sans envoi.
- Artefact : **`dist/` uniquement**, reconstruit depuis un checkout propre. Les sources, documents, originaux d’images, captures, sauvegardes et fichiers privés ne font pas partie du site public.
- Le job de build dispose de `contents: read` et `pages: read`. Seul le job de déploiement dispose de `pages: write` et `id-token: write`, avec l’environnement `github-pages`.
- Aucun déploiement depuis une branche de fichiers générés ; aucun domaine personnalisé ni `CNAME`.

## URL et métadonnées

L’API Pages a confirmé `https://louayrbeh.github.io/AJ-ENERGIES/`, le mode `workflow` et HTTPS le 19/10/2026. Une URL attribuée ne prouve pas à elle seule la réussite d’un déploiement : consulter le résultat Actions et le site public.

`actions/configure-pages` transmet son `origin` à `SITE_URL` et son `base_path` à `BASE_PATH`. Le générateur existant adapte les liens, ressources, langues, canoniques, Open Graph, images sociales, données structurées, sitemap et référence dans `robots.txt`. Aucun préfixe n’est ajouté en dur aux contenus. Le serveur local reste utilisable à `http://127.0.0.1:4173/fr/` sans variables.

## Vérification locale du chemin public

Depuis la racine du dépôt, dans PowerShell :

```powershell
$env:SITE_URL='https://louayrbeh.github.io'
$env:BASE_PATH='/AJ-ENERGIES'
$env:OUTPUT_DIR='test-results/pages-production'
node scripts/build.mjs
node scripts/check.mjs
node scripts/check-pages.mjs
npm test
node tests/pages-preview.mjs
Remove-Item Env:SITE_URL, Env:BASE_PATH, Env:OUTPUT_DIR
```

Le dernier test nécessite Playwright et Chrome, comme les autres tests navigateur du projet. Il démarre et ferme son propre serveur sous `/AJ-ENERGIES/`. Avec `PAGES_URL=https://louayrbeh.github.io/AJ-ENERGIES/`, il vérifie le site distant au lieu de démarrer un serveur. Il visite les pages FR/AR aux largeurs 360, 768, 1024 et 1440 px, contrôle les ressources, les liens, les erreurs de formulaire, la présélection du pompage, les aperçus e-mail/WhatsApp, la navigation et la 404. Les liens d’envoi ne sont jamais suivis. Les requêtes Google Maps sont interceptées : ces tests valident le cadre et sa configuration, pas le rendu réel du fournisseur ni la localisation exacte. Rapports et captures : `test-results/pages-local/` et `test-results/pages-public/`, ignorés par Git.

`scripts/check-pages.mjs` vérifie l’artefact final : ressources avec casse exacte, imports, `srcset`, préfixe, métadonnées absolues, sitemap, absence de fichiers privés et recherche ciblée de secrets. Cela ne constitue pas un audit de sécurité exhaustif.

## Contact et limites

- `mailto:` prépare un message vers `ajenergiescontact@gmail.com` ; le visiteur doit l’envoyer dans sa messagerie. WhatsApp nécessite également une confirmation du visiteur. Aucun backend n’est exécuté sur Pages.
- EmailJS reste désactivé par défaut. Pour l’activer ultérieurement, configurer les variables **publiques** `EMAILJS_ENABLED`, `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_CONTACT_TEMPLATE_ID`, `EMAILJS_QUOTE_TEMPLATE_ID` dans **Settings → Secrets and variables → Actions → Variables**. Ces valeurs sont visibles dans le frontend : aucun mot de passe Gmail, secret SMTP, jeton GitHub ou clé privée ne doit y être injecté.
- Dans le tableau de bord EmailJS, autoriser l’origine `https://louayrbeh.github.io` (sans chemin) et confirmer le destinataire des modèles. Ces réglages externes et la réception d’un message ne sont pas vérifiés par un déploiement. Voir `CONFIGURATION_EMAIL.md`.
- La carte conserve la vue générale de Msaken et son avertissement ; elle n’est pas une position d’entreprise vérifiée. Adresse et lien de recherche restent disponibles.
- GitHub Pages ignore `_headers` : la CSP et les autres en-têtes du serveur de développement ne sont pas configurables par ce fichier sur Pages. Le cache et les en-têtes HTTP sont gérés par GitHub.
- La 404 globale est en français, avec navigation vers l’arabe. GitHub Pages ne choisit pas automatiquement `/ar/404/index.html` pour une URL arabe inconnue. Les pages internes existantes sont de vrais répertoires statiques, sans routeur SPA ni fallback artificiel.
- Le fichier `robots.txt` du projet est sous `/AJ-ENERGIES/` ; la politique robots de l’origine `github.io` ne peut pas être remplacée par ce dépôt. Le sitemap et les métadonnées des pages indiquent les URL publiques exactes.

## Prochaines mises à jour

Modifier les sources, lancer le build et les tests locaux, examiner `git diff`, puis `git add` uniquement les fichiers voulus, `git commit` et `git push origin main`. Suivre **Actions → Deploy AJ ENERGIES to GitHub Pages** jusqu’au succès des deux jobs, puis vérifier le site. `dist/` reste ignoré par Git. Si nécessaire, **Run workflow** republie le même commit sans commit vide.

Documentation officielle consultée : [workflows Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [API Pages](https://docs.github.com/en/rest/pages/pages), [sorties de configure-pages](https://github.com/actions/configure-pages/blob/v5/action.yml), [404 personnalisée](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site).
