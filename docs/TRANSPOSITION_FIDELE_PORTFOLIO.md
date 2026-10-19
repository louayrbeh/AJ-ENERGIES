# Transposition fidèle du portfolio vers AJ ENERGIES

Version du **15 octobre 2026**. Les trois fichiers fournis ont été lus, y compris les styles de base et les media queries. Les références restent en lecture seule :

- `C:/Users/louay/Desktop/Portfolio/assets/css/style.css`
- `C:/Users/louay/Desktop/Portfolio/index.html`
- `C:/Users/louay/Desktop/Portfolio/assets/js/script.js`

La destination modifiée est `aj-energies-website/`. Aucun `index.html` du portfolio n’a remplacé une page AJ ENERGIES. Les styles n’ont pas été importés globalement : seules les règles pertinentes ont été transposées dans les composants existants.

## Fichiers modifiés

| Fichier | Changement |
|---|---|
| `assets/styles.css` | Tokens exacts du portfolio, surfaces et pseudo-éléments en dégradé, ombres, typographie, largeurs, trois modes responsive, bouton des coordonnées, cartes, galerie, champs et boutons de formulaire. |
| `assets/js/main.mjs` | Distinction entre navigation haute à 1024 px et sidebar à 1250 px ; espace réservé uniquement en cas de collision réelle ; ouverture mesurée sur le contenu, transition de 500 ms, éléments repliés masqués et inertes ; menu Plus et focus conservés. |
| `scripts/build.mjs` | Conteneur `.service-content` pour disposer l’icône à côté du contenu dès 580 px, sans changer les textes, liens ni mécanismes métier. |
| `assets/fonts/poppins-latin-300.woff2` | Graisse 300 officielle ajoutée localement ; les graisses françaises 300/400/500/600 sont réellement disponibles avec leurs déclarations `@font-face`. Licence OFL existante conservée. |
| `scripts/design-tests.mjs` | Matrice adaptée aux onze largeurs et aux trois modes. |
| `scripts/portfolio-reference-tests.mjs` | Nouveau test comparant en mémoire les styles calculés à ceux du CSS original, sans recopier les informations personnelles du HTML. |
| `README.md`, `docs/TESTS.md`, `docs/SOURCES_POLICES.md` | État courant, lancement et provenance de la nouvelle graisse. |
| `dist/` | Export statique régénéré depuis les sources. |

Les **11 empreintes protégées** sont identiques avant/après : les trois références du portfolio, les deux modules de traitement des formulaires, les données entreprise et réalisations, les configurations EmailJS/site et carte, et les deux fichiers de contenus/traductions. Les URL, métadonnées et contenus commerciaux ne changent pas. Aucun identifiant EmailJS du portfolio n’a été importé.

## Correspondance des composants

| Portfolio | AJ ENERGIES | Règles transposées |
|---|---|---|
| `.sidebar` | `.company-panel` | Fond eerie-black-2, bordure jet, rayon 20 px, padding 15/30 px, ombres et top desktop 60 px. |
| `.sidebar-info` | `.company-overview` | Disposition horizontale, puis verticale à 1250 px ; logo solaire aux proportions intactes, nom et badge à l’échelle de référence ; slogan supplémentaire conservé. |
| `.info_more-btn` | `.contacts-toggle` | Bordure dégradée, intérieur jet en pseudo-élément, ombre 2, coins asymétriques, jaune au survol et au focus. Chevron seul sous 580 px, texte à partir de 580 px, masquage à 1250 px. |
| `.sidebar-info_more` | `.company-contacts` | Coordonnées repliables ; hauteur réelle mesurée au lieu des maxima rigides de la référence. |
| `.icon-box` | `.contact-icon` | 30 × 30 px et icône 16 px en base ; 48 × 48 px et icône 18 px dès 580 px. Surface intérieure et ombre 1. |
| `.navbar` | `.bottom-nav`, `#site-nav` | Surface hsla avec flou de 10 px, navigation principalement textuelle ; barre basse sous 1024 px, navigation haute ensuite. Vrais liens multipages et page active conservés. |
| `.article-title` | `h1` | 24 puis 32 px ; trait en dégradé 30 × 3 puis 40 × 5 px ; padding sous le texte 7, 15 puis 20 px. |
| `.service-item` | `.service-card` | Bordure et intérieur en dégradé, rayon 14 px, ombre 2, padding 20 puis 30 px ; centrage mobile, icône à côté dès 580 px ; deux colonnes dès 1024 px, troisième carte de même largeur. |
| `.project-list` | `.project-grid` | Gap 30 px, une puis deux et trois colonnes. La galerie reste vide tant qu’aucune réalisation authentifiée n’est fournie. |
| `.mapbox` | `.map-panel iframe` | 250 px de hauteur en base, 380 px dès 580 px, rayons 16/18 px, bordure jet et marge basse 30 px, couleurs normales. |
| `.form-input` | `input`, `select`, `textarea` | Bordure jet, rayon 14 px, padding 13/20 puis 15/20 px, focus jaune ; champs à 16 px pour la saisie mobile. |
| `.form-btn` | `.form-actions .button`, `.review-actions .button` | Surfaces sombres en dégradé, texte jaune, ombre 3, hover et focus jaunes ; largeur adaptée à la place disponible. |

Les couleurs, les six dégradés complets et les cinq ombres ont été repris depuis le `:root` original. Les trois premières ombres passent à une opacité de 0,125 dès 1024 px, comme dans la référence. Les interactions utilisent `0.25s ease`, le dépliage `0.5s ease-in-out`, avec mouvement réduit pris en charge. La référence invalide `--fw-3` est remplacée par une graisse 300 définie et chargée.

## Trois modes et proportions

| Largeur | Présentation | Navigation | Largeur maximale |
|---|---|---|---|
| Moins de 580 px | Au-dessus, coordonnées repliables, chevron seul | Fixe en bas | Fluide, marges 15 px verticales / 12 px horizontales |
| 580–767 px | Au-dessus, bouton textuel | Fixe en bas | 520 px, padding intérieur 30 px |
| 768–1023 px | Au-dessus, coordonnées sur deux colonnes si ouvertes | Fixe en bas | 700 px |
| 1024–1249 px | Toujours au-dessus, coordonnées toujours repliables | En haut à droite du panneau principal | 950 px |
| Dès 1250 px | Sidebar de 275 px et contenu flexible | En haut du panneau principal | Ensemble de 1200 px, gap 25 px, contenu de 900 px |

La grille `275px minmax(0,1fr)` évite le dépassement provoqué par le `min-width:75%` du portfolio. La sidebar reste sticky seulement si elle tient dans la fenêtre ; sinon elle se parcourt dans le défilement normal. La navigation haute reste dans le flux et peut retourner à la ligne pour réserver sa place devant les longs titres français ou arabes.

## Adaptations conservant la fiabilité

- Aucune copie du nom, du portrait, des contacts, projets, témoignages, réseaux sociaux, localisation ou configuration EmailJS du portfolio.
- Les pages restent des documents HTML distincts avec leurs vrais liens. Les règles globales `article {display:none}`, la conversion de tous les spans en blocs et la navigation fondée sur le texte n’ont pas été importées.
- Les coordonnées restent lisibles sans ellipses, avec des zones tactiles confortables. Le bouton possède un nom accessible traduit, `aria-expanded`, `aria-controls`, une activation clavier et des états masqués correctement gérés.
- La hauteur des coordonnées est mesurée pour l’animation. Les styles temporaires d’animation sont retirés à la fin ; aucune hauteur maximale ne coupe l’adresse. Un redimensionnement recalcule l’état visible selon le mode courant.
- Les propriétés logiques inversent les coins, positions et alignements en arabe. Les numéros et fragments latins restent isolés. Tajawal est conservée, sans espacement artificiel des lettres et sans agrandir globalement l’interface.
- Les valeurs typographiques de référence sont exprimées en rem équivalents à zoom normal, pour conserver l’agrandissement du texte. Les champs restent à 16 px et les labels/erreurs restent visibles. Les couleurs d’erreur accessibles d’AJ ENERGIES sont conservées.
- Les champs ne passent en deux colonnes que lorsque la largeur réelle de leur carte le permet. La zone de texte peut être agrandie verticalement sans maximum rigide.
- Les cinq destinations de la barre basse sont conservées : Accueil, Services, Devis, Contact, Plus. Les grosses icônes sont masquées. À texte fortement agrandi, les libellés peuvent occuper plusieurs rangées, et la hauteur réelle est réservée sous le contenu avec la zone de sécurité mobile.
- Le menu Plus conserve son dialogue, son bouton de fermeture, le bouclage du focus, Échap et le retour du focus. Il se ferme au passage à la navigation haute à 1024 px.
- Les formulaires AJ ENERGIES conservent leur validation, leur aperçu WhatsApp, leurs erreurs, leur verrou et leur traitement EmailJS fiable. Le `.then(alert(...))` de la référence n’est pas repris.
- L’illustration solaire, le hero commercial, les FAQ et le footer gardent leurs contenus ; leurs proportions et couleurs s’alignent sur les tokens du portfolio.

## Vérifications réelles

Chrome headless **155.0.8059.40**, Node **24.19.0**. Aucun e-mail, appel ou message envoyé ; aucune publication.

| Contrôle | Résultat |
|---|---|
| Comparaison aux fichiers fournis | **389 contrôles réussis** : couleurs, gradients, ombres selon le seuil, transitions, tailles du titre et du nom, icônes, cartes, mapbox, largeurs et modes. Référence lue dans une fixture en mémoire, sans données personnelles. |
| Matrice de rendu/interactions | **5855 assertions réussies**, **328 scénarios** ; zéro débordement horizontal, erreur JavaScript critique ou ressource locale manquante dans les scénarios finaux. |
| Largeurs normales | **320, 390, 579, 580, 767, 768, 1023, 1024, 1249, 1250 et 1440 px**, sur les neuf routes en français et en arabe. |
| Pages | Accueil, À propos, Services, Réalisations, Devis, Contact, FAQ, Confidentialité et 404. |
| Texte 200 % | Les neuf pages en FR/AR à 320, 768 et 1440 px ; reflow équivalent à 200 % en viewport 720 px et DPR 2 sur accueil/devis. |
| États et clavier | Coordonnées ouvertes/fermées, passage mobile fermé → tablette → desktop visible, menu Plus et fermeture au seuil, labels, erreurs, FAQ et navigation clavier. |
| Paysage et faible hauteur | Plus à 667 × 375 px ; sidebar non sticky à 1440 × 500 px ; contenu et langue accessibles. |
| Parcours métier | **738 assertions réussies** : validations, aperçu et copie WhatsApp, maintenance, saisie préservée, états EmailJS simulés et verrou ; diminution du nombre d’assertions de menu mobile car celui-ci est désormais masqué à 1024 px. |
| E-mail | **5 tests Node réussis**, transport contrôlé uniquement. |
| Export statique | **1854 contrôles réussis**, 20 documents HTML, correspondance des clés FR/AR, liens, ressources et métadonnées. |
| Préservation | **11 fichiers protégés identiques**, dont les trois références du portfolio et les données/configurations/contenus d’AJ ENERGIES. |

Rapports : `test-results/fidelite-portfolio/reference-report.json`, `design-report.json`, `protected-final.json` et `test-results/browser-report.json`.

Les captures ont été inspectées : modes mobile, tablette et desktop, coordonnées ouvertes en FR/AR, cartes de services, formulaire arabe invalide et carte Google réelle. La matrice intercepte le contenu de l’iframe pour rester déterministe ; le fournisseur réel a été inspecté séparément et aucune localisation privée du portfolio n’a été reprise.

## Captures

[Avant mobile](captures-fidelite/before-390.png) · [Après mobile](captures-fidelite/final-fr-390-home.png) · [Bouton textuel à 580 px](captures-fidelite/final-fr-580-home.png).

[Avant tablette](captures-fidelite/before-1024.png) · [Navigation haute et fiche au-dessus à 1024 px](captures-fidelite/final-fr-1024-services.png) · [Deux colonnes desktop](captures-fidelite/final-fr-1440-home.png).

[Coordonnées FR](captures-fidelite/open-fr.png) · [Coordonnées AR](captures-fidelite/open-ar.png) · [Formulaire arabe et erreurs](captures-fidelite/final-ar-768-quote.png) · [Cartes de services](captures-fidelite/services-fr.png) · [Contact avec Google Maps réel](captures-fidelite/contact-google-reel.png).

## Limites et consultation

Le rendu n’a pas été testé sur Safari, Firefox, appareil physique ou lecteur d’écran réel. Le texte 200 % et le reflow simulé ne constituent pas un test du zoom natif de l’interface de Chrome. Aucune conformité exhaustive n’est revendiquée.

EmailJS garde sa configuration AJ ENERGIES, désactivée par défaut ; aucune réception réelle vérifiée. La carte conserve sa **vue générale de Msaken, emplacement exact à confirmer**, son adresse et son lien de recherche. Son affichage n’est pas une preuve de localisation exacte.

Le serveur local déjà présent a été réutilisé. Consultation : [FR](http://127.0.0.1:4173/fr/) / [AR](http://127.0.0.1:4173/ar/). Pour le relancer, utiliser les commandes exactes du [README](../README.md).

Rejouer les contrôles : `node scripts/build.mjs`, `node scripts/check.mjs`, `node tests/email.test.mjs`, puis, serveur actif, `node scripts/browser-tests.mjs`, `node scripts/design-tests.mjs` et `node scripts/portfolio-reference-tests.mjs`. Le dernier test accepte `PORTFOLIO_CSS` si la référence change de chemin.
