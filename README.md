# AJ ENERGIES — site vitrine français / arabe

Site vitrine en HTML/CSS/JavaScript natifs. Le générateur Node produit un site statique multipage français/arabe. Ce dépôt contient les sources ; aucun workflow de déploiement ni activation de GitHub Pages n’est inclus.

## Lancer

Prérequis : **Node.js 20+**. Aucune dépendance npm n'est nécessaire au build ou au site livré. Depuis le dossier du dépôt :

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Ouvrir [le site local](http://127.0.0.1:4173/fr/). Arrêt du serveur : `Ctrl+C`. `PORT` change le port d'écoute. Le serveur utilise uniquement `127.0.0.1`, applique les en-têtes générés, ne journalise pas les demandes et renvoie de vrais statuts 404.

Les alias npm sont `npm run build`, `npm start`, `npm test`, `npm run check`, `npm run test:browser` lorsqu'une installation de Node/npm est disponible dans PATH.

Les sources, les originaux des images et du logo, les polices avec leurs licences et les tests sont versionnés. `dist/`, `test-results/`, les captures générées, `node_modules/`, les fichiers `.env` privés, les clés privées et les fichiers temporaires sont exclus par `.gitignore`. Le build recrée `dist/` ; ne pas héberger l’intégralité du dépôt. Les paramètres de configuration sont décrits ci-dessous ; les coordonnées publiques de l’entreprise ne sont pas des secrets.

## Pages et architecture

- `/fr/` et `/ar/` : accueil ; le `/` racine affiche aussi l'accueil français.
- Pour chaque langue : `about/`, `services/`, `projects/`, `quote/`, `contact/`, `faq/`, `privacy/`, `404/`.
- `locales/` : tous les contenus, messages et métadonnées FR/AR.
- `data/company.mjs` : informations de l'entreprise ; `data/projects.mjs` : galerie de réalisations authentiques, actuellement vide.
- `config/site.mjs` : origine, sous-chemin et paramètres publics EmailJS.
- `config/map.mjs` : URL de la carte intégrée et état de vérification ; vue générale de Msaken active, emplacement exact à confirmer.
- `scripts/build.mjs` : composants partagés et génération statique ; `scripts/serve.mjs` : serveur de vérification locale.
- `assets/styles.css` : variables, styles, responsive mobile-first et propriétés logiques RTL.
- `assets/js/` : navigation, galerie, formulaire et adaptateur REST EmailJS séparés.
- `dist/` : résultat autonome à héberger ; ne pas éditer les fichiers générés.
- `tests/`, `scripts/check.mjs`, `scripts/browser-tests.mjs` : contrôles locaux ; `test-results/` : preuves générées ignorées par Git.

Le sélecteur conserve la page équivalente dans l'autre langue. Il ne transfère pas la saisie du formulaire. Tous les contenus et moyens de contact sont accessibles sans JavaScript ; les boutons de préparation sont désactivés sans JS pour éviter une soumission GET de données.

## Contact, e-mail et carte : état exact

L’adresse officielle `ajenergiescontact@gmail.com`, confirmée par le propriétaire, est centralisée dans `data/company.mjs`. Les formulaires valident la saisie et proposent **Continuer par e-mail** ou **Continuer sur WhatsApp**, avec un aperçu partagé et copie du message ou du destinataire. Le lien `mailto:` prépare le destinataire, l’objet et le corps ; le visiteur doit vérifier puis envoyer lui-même dans sa messagerie. Il doit aussi appuyer sur Envoyer dans WhatsApp. Les liens trop longs conservent le destinataire et proposent de copier/coller le message intégral ; un refus du presse-papiers donne une sélection manuelle. Aucun stockage de formulaire, cookies applicatifs, outil analytique ou backend n’est ajouté.

Le service confirmé de **pompage solaire photovoltaïque** figure dans l’accueil, Services, À propos et la FAQ. Son CTA présélectionne `?need=pumping`. Les formulaires Contact et Devis proposent les indications d’eau et de pompe facultatives, sans calcul de dimensionnement ; les champs non applicables sont exclus des messages. Le logo officiel fourni remplace visuellement la proposition précédente. Voir [la livraison e-mail, logo et pompage](docs/EMAIL_LOGO_POMPAGE.md).

**EmailJS est implémenté mais désactivé et non configuré.** L'adaptateur navigateur utilise l'API REST officielle, sans SDK CDN : il attend HTTP 200, gère erreurs/délai, verrou et temporisation. La réponse signifie acceptation du service, pas livraison ni lecture. Les tests utilisent uniquement des bouchons. Voir [la configuration e-mail](docs/CONFIGURATION_EMAIL.md), modèles et anti-abus.

**La carte affiche une vue générale de Msaken ; la position exacte de l’entreprise reste à confirmer.** Une iframe Google Maps réelle, différée, titrée et responsive est affichée avant le formulaire, avec un avertissement explicite, l’adresse textuelle et son lien de recherche. `config/map.mjs` centralise `enabled`, `verified` et `embedUrl`. Remplacer l’URL par celle du lieu validé puis passer `verified` à `true` uniquement après confirmation de l’emplacement. Le chargement de Google ne constitue pas une validation de l’adresse ; la confidentialité documente désormais l’intégration active.

Les quatre visuels de configurations et le nouveau visuel de pompage sont des illustrations générées par IA, légendées comme telles, sans être présentées comme des réalisations de l’entreprise. Le logo est le fichier officiel fourni par le propriétaire. Les sources, prompts et limites sont dans [la provenance des visuels](docs/SOURCES_VISUELS_SOLAIRES.md). Les références des informations d’entreprise restent dans [les sources des contenus](docs/SOURCES_CONTENUS.md).

## Vérifier

```powershell
node scripts/build.mjs
node scripts/check.mjs
npm test
# Serveur déjà lancé dans un autre terminal :
node scripts/browser-tests.mjs
# Contrôles visuels et matrice étendue de la refonte :
node scripts/design-tests.mjs
```

Les tests navigateur demandent Playwright et Chrome ; ils utilisent le runtime partagé de cet environnement lorsqu'il est disponible. Sur un autre poste : `npm install --no-save --package-lock=false playwright`, puis Chrome installé, ou `BROWSER_CHANNEL=msedge` pour Edge. Cette dépendance de vérification n'est pas utilisée par le site. `TEST_URL` peut changer l'origine locale testée. Les requêtes externes sont bloquées, les réponses EmailJS simulées en mémoire et aucun message n'est envoyé.

`OUTPUT_DIR` permet de vérifier un export dans un sous-dossier de `test-results/`. Ne pas l'utiliser pour changer le dossier de livraison `dist/`. Les résultats réellement obtenus sont dans [docs/TESTS.md](docs/TESTS.md).

## Production — à préparer sans publier

Sans origine définitive, le build reste `noindex, nofollow`, `robots.txt` interdit l'indexation, le sitemap est vide et aucune canonique fictive n'est émise. Les alternates de langues sont locaux. Pour un domaine réel, définir les paramètres **avant** reconstruction :

```powershell
$env:SITE_URL='https://VOTRE-DOMAINE-REEL'
# Seulement pour une installation sous un chemin :
# $env:BASE_PATH='/aj-energies'
node scripts/build.mjs
node scripts/check.mjs
```

L'origine HTTPS ne doit pas contenir de chemin ni slash final. `BASE_PATH` est séparé, sans slash final. Le build génère alors les canoniques, Open Graph absolu, alternates FR/AR/x-default et sitemap multilingue. **Configurer une origine de production lève le noindex** pour les pages publiques ; ne pas utiliser cette option par erreur en préproduction. Aucun `.env` n'est lu automatiquement.

Procédure ultérieure :

1. Compléter [les informations manquantes](docs/INFORMATIONS_A_COMPLETER.md), valider les textes FR/AR, la confidentialité, les coordonnées et les droits des médias.
2. Choisir un hébergeur statique HTTPS avec index de répertoires et vraie 404 personnalisée. Le transfert porte uniquement sur `dist/`, pas les sources, docs ou tests.
3. Sur Netlify/Cloudflare Pages, faire interpréter `_headers` et vérifier son application effective. Sur nginx/Apache/autre, traduire ces règles dans la configuration serveur ; aucun fallback SPA vers `index.html`.
4. Exemple nginx à adapter : `try_files $uri $uri/ =404;` et `error_page 404 /404.html;`. Prévoir si souhaité une règle de 404 arabe sous `/ar/`. Apache : `DirectoryIndex index.html` et `ErrorDocument 404 /404.html`, à préfixer en cas de sous-chemin.
5. Appliquer les en-têtes CSP, `nosniff`, politique de référent et permissions. HSTS seulement après validation HTTPS. Définir revalidation HTML/CSS/JS et cache des images ; les noms de fichiers ne portent pas de hash et le serveur local utilise `no-store`.
6. Après autorisation explicite de publication seulement : vérifier HTTPS, liens profonds FR/AR, statuts 404, en-têtes, sitemap, langue et liens externes sur appareils réels. Aucun test d'envoi réel n'est autorisé par le simple lancement des tests locaux.

Le livrable est utilisable localement ; domaine, hébergement, confidentialité finale, EmailJS et position exacte restent à compléter selon les besoins. Aucun calculateur, compte utilisateur, faux témoignage ou faux projet n'est inclus.

## Refonte visuelle

La version actuelle conserve les proportions, la typographie et le comportement du portfolio, avec une palette photovoltaïque claire : blanc, bleu, accents solaires jaunes et quelques touches vertes. La navigation passe en haut à **1024 px** ; la fiche entreprise reste au-dessus jusqu’à **1249 px**, puis devient une sidebar de **275 px** dans un ensemble de **1200 px**. Le bouton utilise seulement un chevron sous **580 px**, puis un texte jusqu’à son masquage sur desktop. Voir [la palette solaire et ses vérifications](docs/PALETTE_SOLAIRE.md) et [la provenance des visuels](docs/SOURCES_VISUELS_SOLAIRES.md). La [transposition initiale](docs/TRANSPOSITION_FIDELE_PORTFOLIO.md) et les rapports précédents sont conservés comme historiques.

Pour la version actuelle : `npm test` contrôle l’adaptateur EmailJS et l’encodage des canaux ; `npm run test:contact-pumping` vérifie les nouveaux parcours et la préservation des règles CSS/navigation, avec le serveur lancé sur le port 4173. `npm run test:browser` couvre les régressions fonctionnelles et l’envoi direct simulé. Les tests de palette et de comparaison au portfolio décrivent des états historiques : leurs références de textes, métadonnées, identité et fichiers protégés précèdent les ajouts autorisés d’e-mail/pompage/logo. Ne pas écraser les relevés `--baseline` historiques pour obtenir artificiellement un succès.

Les corrections du bouton en languette, de la carte, des proportions et du focus sont documentées dans [docs/CORRECTIONS_COORDONNEES_CARTE.md](docs/CORRECTIONS_COORDONNEES_CARTE.md), avec les nouvelles captures et vérifications.
