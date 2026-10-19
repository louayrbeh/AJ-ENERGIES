# Corrections des coordonnées, de la carte et des dimensions

Corrections appliquées le **15 octobre 2026** au projet AJ ENERGIES existant, sans publication. Les références du portfolio déjà présentes dans la conversation ont été utilisées ; aucune nouvelle capture distincte n’était accessible dans le dernier message. Le rendu actuel a été reproduit dans Chrome avant modification et photographié localement.

## Fichiers concernés

| Source | Modification |
|---|---|
| `assets/styles.css` | Languette intégrée au coin logique du panneau ; réservation dynamique de sa hauteur ; échelle de titres 24–36 px environ ; espacements centralisés et bornés ; pistes `minmax(0,1fr)` ; styles de carte et de Contact ; champs selon leur conteneur réel ; focus ciblé sur le titre. |
| `assets/js/main.mjs` | Mesure de la hauteur réelle de la languette ; observation de ses changements ; adaptation du nombre de colonnes de la barre basse quand le texte agrandi ne tient plus. Les cinq destinations et leur fonctionnement sont conservés. |
| `scripts/build.mjs` | Carte avant le formulaire, adresse et liens conservés, boutons de contact proches de la carte ; validation de l’URL Google ; autorisation CSP conditionnée à l’activation ; indication de confidentialité ; libellés des liens dans un élément flexible et numéros isolés en LTR. |
| `config/map.mjs` | URL cartographique centralisée, `enabled: true`, `verified: false`. Vue générale de Msaken ; aucun GPS inventé. |
| `locales/fr.mjs`, `locales/ar.mjs` | Mention du lieu exact à confirmer, lien de recherche Google Maps explicite et confidentialité adaptée à l’intégration active. Métadonnées et URL des pages conservées. |
| `scripts/browser-tests.mjs`, `scripts/design-tests.mjs` | Contrôles adaptés à la carte active, contrôles de position de la languette et matrice étendue à toutes les pages et au texte 200 %. |
| `README.md`, `docs/TESTS.md`, `docs/CHOIX_TECHNIQUES.md`, `docs/INFORMATIONS_A_COMPLETER.md` | Documentation de l’état réel de la carte et des nouvelles vérifications. |
| `dist/` | Export régénéré à partir des sources. |

Les empreintes SHA-256 de `request-form.mjs`, `email-adapter.mjs`, `data/company.mjs`, `data/projects.mjs` et `config/site.mjs` sont comparées à l’état avant cette mission. Le traitement des formulaires et les paramètres EmailJS ne sont pas modifiés. Les modifications du générateur portent sur la présentation, l’intégration cartographique et les libellés de liens.

## Bouton des coordonnées

La languette a une largeur déterminée par son contenu, une hauteur tactile minimale de 44 px, un libellé de 13 px en français / 14 px en arabe et un padding horizontal de 16 px. Son angle supérieur suit celui du panneau et son angle inférieur intérieur est arrondi. Bordure, ombre et focus restent visibles, sans débordement masqué du panneau.

Les propriétés logiques placent le bouton en haut à droite en français et en haut à gauche en arabe. Sa hauteur réelle est mesurée et réservée au-dessus de la présentation : le libellé ouvert, les polices et le texte agrandi peuvent augmenter sa hauteur sans recouvrir le logo, le nom, le badge ou le slogan. Le bouton garde son type, `aria-controls`, `aria-expanded`, les deux libellés traduits et l’activation Entrée/Espace.

À partir de 1250 px, le bouton est masqué et les coordonnées sont visibles. Le passage du mobile au desktop réévalue leur affichage. Aucune hauteur fixe de coordonnées n’est imposée.

## Carte et localisation

L’ancienne configuration ne contenait aucune URL d’intégration. Une recherche a retrouvé l’adresse et le téléphone d’AJ ENERGIES dans la [liste officielle STEG de mars 2026, page 15/16, ligne AJ ENERGIES](https://www.steg.com.tn/fr/system/files/documents/Societe_eligibles_prosol_elec_3.pdf). Cette source confirme l’adresse postale, sans fournir un point cartographique exact. Aucune nouvelle adresse e-mail issue de cette recherche n’a été ajoutée au site.

La configuration utilise donc une intégration Google Maps de **Msaken, Tunisia**, au zoom 13, sans coordonnées GPS écrites dans le projet et sans marqueur attribué à AJ ENERGIES. L’avertissement est visible en FR et AR : **« Vue générale de Msaken — emplacement exact à confirmer »**. Le widget affiche la ville et l’interface native de Google, sans commandes redessinées.

L’iframe possède un titre traduit, `loading="lazy"`, des dimensions explicites et une largeur fluide, sans transformation. Sa hauteur est de **280 px sur mobile**, **360 px à largeur intermédiaire**, puis **380 px dans un panneau large** ; rayons de 20 px. L’ordre est : titre et introduction, carte, adresse/recherche/actions de contact, formulaire et moyens de contact complémentaires. Sur un panneau assez large, formulaire et coordonnées complémentaires se répartissent en colonnes.

L’adresse textuelle, le lien « Rechercher cette adresse dans Google Maps », le téléphone, WhatsApp et Facebook sont conservés. Pour afficher ultérieurement le lieu exact, remplacer `embedUrl` dans `config/map.mjs` par l’URL validée et passer `verified` à `true`, puis reconstruire. `enabled: false` permet de désactiver l’iframe. Le chargement de l’iframe ne constitue jamais une validation du lieu.

## Dimensions, textes et focus

- Les titres principaux passent d’une échelle 26–40 px à environ **24–36 px** selon la largeur ; titres de section 21–28 px, cartes environ 19 px. Les paragraphes principaux restent à 16 px, le corps arabe à 18 px, les champs à 16 px. Le menu desktop passe à 14 px.
- Les espacements partagés gardent leurs valeurs normales, mais ne doublent plus avec un agrandissement du texte seul. Cela évite de laisser quelques pixels au libellé d’un bouton après plusieurs niveaux de padding. Les boutons gardent un contenu lisible, des paddings maîtrisés et une cible confortable.
- Les grilles à une colonne utilisent une piste `minmax(0,1fr)` ; les champs répondent à la largeur de leur propre carte, et les points d’étude utilisent deux pistes dont une flexible pour le texte. Les libellés de liens sont des éléments flexibles à largeur minimale nulle, séparés de la flèche.
- La césure automatique et les retours à la ligne restent naturels ; la coupure de secours n’intervient que lorsqu’un mot ou fragment ne peut pas tenir. Aucun titre ni numéro essentiel n’est tronqué.
- La barre basse garde cinq entrées sur une rangée aux tailles normales. À texte fortement agrandi, ses colonnes sont recalculées selon la largeur réelle des libellés : les cinq destinations restent visibles sur plusieurs rangées au lieu de couper les mots. Sa hauteur mesurée, incluant la zone de sécurité basse, est réservée sous le contenu.
- **Origine du contour jaune** : la règle globale `:focus-visible` entourait le `<main tabindex="-1">` lorsque le lien d’évitement lui donnait le focus. Ce n’était pas un style de débogage. Le repère est désormais reporté sur le h1 de la page pendant ce focus. Tous les autres indicateurs de focus sont conservés.
- Les numéros affichés dans les nouveaux boutons d’appel et dans le lien de présentation sont isolés avec `bdi dir="ltr"` pour éviter l’inversion de leurs groupes en arabe.

## Contrôles

Les résultats finaux et les limites figurent ci-dessous ; les rapports machine sont dans `test-results/contacts-map/` et `test-results/browser-report.json`.

| Contrôle | Résultat |
|---|---|
| Build / structure / ressources locales | 20 documents HTML, 1854 contrôles réussis ; clés FR/AR correspondantes. |
| Adaptateur e-mail | 5 tests réussis, transport contrôlé uniquement. |
| Parcours de formulaires et navigation | 792 assertions réussies, aucun envoi réel ; états EmailJS simulés, aperçu/copie WhatsApp, validations et conservation de saisie. |
| Matrice finale | **5893 assertions réussies**, **286 scénarios** ; aucun débordement horizontal, aucune erreur JavaScript critique et aucune ressource locale manquante. |
| Pages et langues | Accueil, À propos, Services, Réalisations, Devis, Contact, FAQ, Confidentialité et 404, en français et en arabe. |
| Largeurs | Toutes les pages à **320, 360, 390, 580, 768, 1024, 1250 et 1440 px** ; accueil, devis et contact également à **359, 579, 581, 1249 et 1251 px**. |
| Texte agrandi et reflow | Toutes les neuf pages FR/AR à texte **200 %**, aux largeurs 320/768/1440 px. Reflow équivalent 200 % en viewport 720 px et DPR 2 pour accueil/devis ; pas de zoom natif de l’interface Chrome. |
| Paysage et écran bas | Plus à 667 × 375 px ; accès au sélecteur de langue, fermeture, retour de focus et défilement. Fiche non sticky à 1440 × 500 px. |
| Contrôles ciblés | 24 assertions réussies : activation clavier, fermeture, redimensionnement, focus du titre, barre basse agrandie et cartes Google réelles. |
| Google Maps réel | Widget chargé et captures inspectées en FR à 390/1440 px et en AR à 320/1440 px. Chargement distinct des tests de géométrie, qui interceptent l’iframe pour rester déterministes. |
| Préservation | 5 fichiers de traitement, données et configuration EmailJS identiques à leurs empreintes avant mission. |

Les débordements observés à 200 % ont été identifiés dans les pistes automatiques des grilles, les libellés anonymes des éléments flex et les points d’étude, puis corrigés dans les composants partagés. Aucun `overflow-x: hidden` global et aucune suppression globale des outlines n’ont été ajoutés.

## Captures et limites

[Bouton avant](captures-corrections/avant-services-fr-390.png) · [Bouton après](captures-corrections/apres-services-fr-390.png) · [Coordonnées ouvertes FR](captures-corrections/coordonnees-ouvertes-fr.png) · [Coordonnées ouvertes AR](captures-corrections/coordonnees-ouvertes-ar.png).

[Contact avant](captures-corrections/avant-contact-fr-1440.png) · [Carte réelle desktop](captures-corrections/carte-fr-desktop.png) · [Carte réelle mobile FR](captures-corrections/carte-fr-mobile.png) · [Carte réelle mobile AR](captures-corrections/carte-ar-mobile.png) · [Focus du titre](captures-corrections/focus-titre-fr.png).

[Huit largeurs FR](captures-corrections/matrice-fr.jpg) · [Huit largeurs AR](captures-corrections/matrice-ar.jpg).

Les captures du widget réel montrent une **vue générale de Msaken**, pas le lieu exact de l’entreprise. Son adresse reste à faire confirmer par un lien ou un point exact fourni par le propriétaire. Le service Google dépend du réseau et de ses propres interfaces ; le lien de recherche et les contacts restent disponibles si l’iframe ne s’affiche pas.

Tests dans Chrome headless 155.0.8059.40 sur Windows, viewports simulés. Pas de Safari, Firefox, appareil physique ou lecteur d’écran réel. Pas de vérification du zoom natif de Chrome, ni de réception d’e-mail ou de message. Aucune publication. EmailJS conserve sa configuration précédente, désactivée par défaut. La validation éditoriale des contenus arabes reste du ressort du propriétaire.

Pour consulter le site, lancer le serveur selon le [README](../README.md), puis ouvrir [Contact FR](http://127.0.0.1:4173/fr/contact/) ou [Contact AR](http://127.0.0.1:4173/ar/contact/).
