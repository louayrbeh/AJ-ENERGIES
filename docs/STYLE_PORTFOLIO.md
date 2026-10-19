# AJ ENERGIES — style du portfolio

Refonte appliquée le **15 octobre 2026** au site existant. Les quatre captures fournies ont été accessibles et examinées : deux vues desktop et deux vues de présentation mobile. Elles servent de référence esthétique. Aucun nom, portrait, contact personnel ou lieu du portfolio n’a été repris.

## Résultat et fichiers

| Fichier | Changement |
|---|---|
| `assets/styles.css` | Remplacement du système clair/marine par une palette centralisée sombre et jaune, rayons, espacements, typographie, ombres et niveaux de superposition. Styles complets des cartes, FAQ, étapes, contacts, formulaires, carte et footer. |
| `scripts/build.mjs` | Fiche entreprise, navigation haute en flux, barre basse cinq entrées, dialogue Plus et sélection de langue vers la route équivalente. Icônes SVG locales de la même famille ; copie des polices et licences vers l’export. |
| `assets/js/main.mjs` | Coordonnées repliables, mesure de hauteur de la barre basse, ancrage de la fiche seulement si elle tient, dialogue Plus, Tab/Maj+Tab, Échap, retour du focus et fermeture au changement de disposition. Logique formulaire et galerie conservée. |
| `locales/fr.mjs`, `locales/ar.mjs` | Ajout des libellés du panneau entreprise et des nouveaux contrôles, sans changement du contenu commercial ou des métadonnées. |
| `assets/fonts/`, `assets/favicon.svg` | Poppins 400/500/600, Tajawal 400/700 auto-hébergées avec licences OFL ; favicon solaire anthracite et jaune. Sources dans `SOURCES_POLICES.md`. |
| `scripts/serve.mjs` | Type MIME `font/woff2` pour les polices locales. |
| `scripts/browser-tests.mjs`, `scripts/design-tests.mjs` | Adaptation des contrôles à la navigation actuelle et matrice des tailles demandées. |
| `README.md`, `docs/TESTS.md`, ce document | Lancement, état courant, preuves et limites. |
| `dist/` | Export statique régénéré : 20 documents HTML, styles, modules, polices et médias. |

Les fichiers `assets/js/request-form.mjs`, `assets/js/email-adapter.mjs`, `data/company.mjs`, `data/projects.mjs`, `config/site.mjs` et `config/map.mjs` sont identiques à leurs empreintes SHA-256 avant refonte. Les pages, textes, chemins, SEO, liens téléphoniques, WhatsApp et Facebook sont conservés. Aucun projet séparé, backend, dépendance applicative ou envoi réel n’a été ajouté.

## Composition et comportement

- **À partir de 1 250 px** : deux colonnes `288px minmax(0,1fr)`, avec un intervalle de 32 px. Fiche à gauche en français et à droite en arabe. Coordonnées entièrement visibles. Navigation intégrée au bord supérieur du panneau principal, alignée à droite en français et inversée en RTL. Elle peut retourner à la ligne ; le titre suit dans le flux et ne peut être recouvert.
- **Sous 1 250 px** : fiche au-dessus du contenu, logo et identité côte à côte ; coordonnées repliées par défaut avec bouton traduit et attributs ARIA. Sans JavaScript, elles restent visibles.
- **Barre basse** : Accueil, Services, Devis, Contact et Plus, chacune avec icône et libellé. Plus ouvre À propos, Réalisations, FAQ, Confidentialité et le sélecteur de langue. Liens actifs avec `aria-current="page"` ; Plus devient jaune et son nom accessible indique une page complémentaire active.
- **Dialogue Plus** : focus initial sur Fermer, bouclage Tab/Maj+Tab, fermeture par bouton, Échap ou clic sur le fond ; focus rendu à l’ouverture. Hauteur disponible calculée pour le paysage, défilement interne sans hauteur de contenu fixe et bouton Fermer maintenu visible au-dessus de la zone défilante. Le passage au desktop ferme le dialogue et libère le défilement.
- **Défilement** : hauteur réelle de la barre réservée en bas, incluant `env(safe-area-inset-bottom)`. Fiche sticky uniquement si sa hauteur tient dans la fenêtre ; sinon défilement normal. Le bouton WhatsApp flottant est retiré de la composition ; WhatsApp reste présent dans la fiche, le contact, les CTA et les formulaires.
- **Grilles** : requêtes de conteneur selon la largeur réelle du panneau principal. Cartes de services sur une colonne, deux avec troisième étendue, puis trois lorsque la place suffit. Formulaires sur une colonne ou deux selon l’espace réellement disponible.
- **Style** : panneaux anthracite à angles de 24 px, cartes de 18 px, jaune `#ffce58`, trait arrondi de 48 × 6 px sous chaque h1, icônes linéaires, conteneurs de coordonnées de 48 px, photo solaire illustrative conservée et légendée.
- **Accessibilité et langues** : propriétés logiques, numéros isolés en LTR, aucun espacement artificiel des lettres arabes, labels visibles, erreurs textuelles, focus jaune et mouvement réduit. Aucune conformité WCAG complète n’est revendiquée.

## Vérifications effectivement effectuées

Chrome headless **155.0.8059.40**, Node **24.19.0**, serveur local uniquement. Tous les accès externes ont été bloqués pendant les tests. Aucun véritable e-mail, message WhatsApp, appel ou publication.

| Vérification | Résultat |
|---|---|
| Build et export | 20 pages, modes FR/AR, EmailJS désactivé, carte en recherche textuelle, préproduction noindex. |
| Structure, liens, ressources et traductions | **1 854 contrôles réussis** par `scripts/check.mjs`. |
| Adaptateur e-mail | **5 tests réussis**, exclusivement avec transport contrôlé. |
| Parcours navigateur | **792 assertions réussies** : pages, validation, maintenance, requêtes préremplies, aperçu et copie WhatsApp, message long, refus du presse-papiers, sans JS, chargement/verrou/erreur/acceptation EmailJS simulés. |
| Design et interactions | **2 738 assertions réussies**, **118 scénarios** : routes FR/AR, tailles, coordonnées ouvertes/fermées, Plus, focus, formulaires invalides, footer dégagé, textes longs et carte en fixture. |
| Largeurs | **320, 360, 390, 580, 768, 1024, 1250, 1440 et 1920 px**, plus **1249 px** pour le changement de disposition. Accueil, devis et contact dans les deux langues ; toutes les neuf routes à 390 et 1440 px. Aucun débordement horizontal constaté, sans masquage horizontal global. |
| Agrandissement | Texte à **200 %** à 320/768/1440 px ; reflow équivalent à un écran physique 1440 px avec viewport CSS 720 px et DPR 2, FR/AR. Zoom natif de l’interface Chrome non effectué. |
| Paysage et écran bas | Dialogue à **667 × 375 px**, langue atteignable en défilement ; fiche non sticky à **1440 × 500 px**, Facebook accessible. |
| Cas limites complémentaires | **20 assertions réussies** : bouclage clavier dans les deux sens, changement de langue effectivement suivi, redimensionnement avec menu ouvert, clic sur le fond, galerie/filtre en fixture locale et repli lorsque les fichiers de polices sont bloqués. |
| Derniers ajustements | **28 contrôles ciblés réussis** après adaptation de la fiche au texte agrandi et de la zone de fermeture persistante de Plus : neuf largeurs FR/AR, texte 200 % et paysage. |
| Réseau et JavaScript | Aucune ressource manquante ni erreur JavaScript critique dans la matrice finale ; zéro requête externe. |
| Contrastes ciblés | Texte/panneau **15,28:1**, secondaire/surface **9,17:1**, texte atténué/surface **5,84:1**, jaune/surface **9,97:1**, texte sombre/bouton jaune **12,14:1**, bord de champ/panneau **3,37:1**. Calcul sRGB, pas un audit exhaustif. |

Rapports machine : `test-results/browser-report.json`, `test-results/portfolio-style/design-report.json`, `edge-report.json`, `final-polish-report.json`, `contrast.json` et `protected-before.json`. Les captures ont été réellement inspectées, notamment les matrices des neuf largeurs FR/AR, les vues desktop/mobile, les formulaires, services, coordonnées dépliées et Plus en paysage. Les fichiers de résultats ne sont pas inclus dans l’export public.

Un problème de bouclage du focus du dialogue natif a été détecté puis corrigé par une gestion explicite de Tab/Maj+Tab. Le contrôle de fermeture tient compte du caractère asynchrone de l’événement natif. Les tests ont ensuite été relancés avec succès.

## Captures avant/après

| Vue | Avant | Après |
|---|---|---|
| Français desktop 1440 px | [Avant](captures-portfolio/before-fr-1440.png) | [Après](captures-portfolio/after-fr-1440.png) |
| Français mobile 390 px | [Avant](captures-portfolio/before-fr-390.png) | [Après](captures-portfolio/after-fr-390.png) |
| Arabe desktop 1440 px | [Avant](captures-portfolio/before-ar-1440.png) | [Après](captures-portfolio/after-ar-1440.png) |

[Neuf largeurs en français](captures-portfolio/visual-matrix-fr.jpg) · [Neuf largeurs en arabe](captures-portfolio/visual-matrix-ar.jpg) · [Menu Plus](captures-portfolio/more-open-fr.png) · [Plus en paysage](captures-portfolio/more-landscape-fr.png) · [Coordonnées en arabe](captures-portfolio/contacts-open-ar.png).

## Limites et état des services conservés

- **EmailJS** : adaptateur et configuration conservés ; canal désactivé faute de paramètres. États vérifiés par bouchons locaux ; aucune délivrabilité ni réception réelle vérifiée.
- **Carte** : configuration exacte toujours non vérifiée et iframe non activée. Adresse d’AJ ENERGIES et recherche Google Maps conservées. Le cadre responsive d’une future iframe a été vérifié avec une fixture locale, sans requête Google ni modification de `config/map.mjs`.
- Galerie toujours vide faute de réalisations authentifiées. La photo est une illustration IA, pas une preuve de réalisation.
- Contrôles sur Chrome headless et viewports simulés : pas de Safari, Firefox, lecteur d’écran ou appareil physique, ni zoom natif de l’interface du navigateur. Pas d’audit d’accessibilité ou de sécurité exhaustif.
- Aucun hébergement ni domaine activé ; le site n’est pas publié. Serveur de test arrêté après livraison, relançable selon le README.

## Afficher localement

Depuis la racine du site, avec Node dans PATH :

```powershell
node scripts/build.mjs
node scripts/serve.mjs
```

Les commandes avec le chemin exact du runtime disponible sur ce poste figurent dans [le README](../README.md). Ouvrir ensuite [le français](http://127.0.0.1:4173/fr/) ou [l’arabe](http://127.0.0.1:4173/ar/).
