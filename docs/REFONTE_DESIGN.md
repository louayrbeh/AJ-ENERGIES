# Refonte visuelle — AJ ENERGIES

15 octobre 2026. Site modifié directement dans son architecture existante, sans publication, nouvelle dépendance applicative ni changement de destinataire. Les données d'entreprise, traductions, réalisations, configuration et modules de transmission sont conservés.

## Direction artistique : « Trame solaire »

Une grille fine évoquant les cellules photovoltaïques structure le hero bleu nuit. Le jaune souligne AJ ENERGIES et les actions importantes ; le cadre photographique décalé reprend les lignes techniques de cette grille. Les autres sections restent sobres pour préserver la lecture : cartes blanches bordées, bande de clientèles sombre, étapes linéaires, invitation et appel à l'action jaune. Le vert reste réservé aux moyens de contact et aux états de réussite.

Le visuel existant reste une illustration IA, jamais présenté comme une réalisation réelle. Sa légende se trouve maintenant sous l'image sur une surface opaque et lisible, avec une hauteur libre ; aucun texte essentiel ne dépend du recadrage de la photo.

## Modifications et composants harmonisés

- **Tokens CSS** : palette, contraste des contrôles, corps 16 px, échelle fluide des titres, espacements, largeurs, rayons, ombre légère, contrôles de 52 px, durées et niveaux de superposition centralisés. La feuille a été consolidée ; pas de pile de surcharges ou d'overflow horizontal global masquant un défaut. Le seul `!important` protège l'attribut natif `[hidden]`.
- **Typographie** : polices système Segoe UI et Tahoma avec replis ; graisses 400/600/700 selon la famille. Les fichiers Segoe UI normal/semibold/bold et Tahoma normal/bold sont présents sur le poste contrôlé. Pas de téléchargement de police ni d'espacement artificiel du texte arabe.
- **Header** : logo plus lisible, sélecteur et CTA agrandis, état actif clair, menu dessiné en SVG local. Le menu compact remplace les liens dès que l'espace mesuré manque, y compris lorsque les caractères sont agrandis. Sur les écrans très étroits, le logo dispose d'une ligne entière et les contrôles passent dessous. Le header reste dans le flux et ne masque pas les ancres.
- **Hero** : titre fluide avec marque solaire mise en avant, introduction à largeur limitée, actions hiérarchisées, photo architecturale cadrée et liens directs vers les trois services. Pas de hauteur plein écran ni de rupture `<br>` imposée.
- **Sections** : services alignés par leurs CTA, publics en grille distincte, points d'étude et étapes lisibles, état vide des réalisations soigné, FAQ native, footer réorganisé avec liens tactiles et navigation qui se recompose selon la taille du texte.
- **Icônes** : flèches, menu et FAQ utilisent le même tracé SVG local que les pictogrammes existants. Seules les flèches directionnelles sont inversées en RTL ; les marques, téléphones et symboles restent intacts.
- **Formulaires** : contours plus contrastés, labels et aides lisibles, géométrie stable des champs invalides, région de statut réservée et différenciation visuelle de l'attente, du rejet et de l'acceptation. Le panneau d'aide est plus compact sur tablette. Validation, verrou, honeypot, saisie préservée et alternative WhatsApp ne changent pas.
- **Contact fixe** : rail en flux normal sous 1700 px ; au-delà, bouton dans la marge extérieure, vérifiée sans recouvrir le contenu. Aucun bouton fixe sur les pages devis/contact. Zone de sécurité prise en compte.

Fichiers applicatifs modifiés : `assets/styles.css`, `assets/js/main.mjs`, `scripts/build.mjs`. Les modifications de JavaScript concernent le header ; `request-form.mjs` et `email-adapter.mjs` ne sont pas réécrits. Les scripts de test et la documentation sont complétés séparément.

## Défauts corrigés après affichage réel

La comparaison avant/après a guidé l'agrandissement des éléments du header, la sortie des légendes de la photographie, l'harmonisation des icônes et la recomposition du panneau de formulaire en arabe sur tablette.

Les tests à texte 200 % sur 320 px ont révélé des largeurs minimales de Grid/Flexbox, des mots longs dans les surtitres et les liens du footer, et un signe de FAQ dépendant de la taille de police. Correction par `min-inline-size:0`, retour à la ligne ciblé et remplacement du signe par un SVG. Aucun contenu essentiel n'est tronqué par ellipsis.

L'inspection d'une capture a ensuite révélé un logo passant sous le menu malgré des boîtes principales sans chevauchement. Le header a été recomposé et un contrôle des rectangles du texte du logo a été ajouté, puis la matrice a été relancée.

## Vérifications effectivement exécutées

Chrome headless **155.0.8059.40**, Node **24.19.0**, avec toutes les requêtes externes bloquées pendant les tests.

| Périmètre | Résultat |
|---|---|
| Build et contrôle statique | **20 documents HTML**, **1 474 contrôles réussis** : liens, ressources, ancres, titres, traductions, labels, JSON, métadonnées et CSP |
| Matrice de refonte | **2 335 contrôles réussis sur 160 cas**, zéro échec, erreur JS, ressource manquante ou requête externe observée |
| Toutes les pages | Accueil, à propos, services, réalisations, devis, contact, FAQ, confidentialité et 404 ; FR et AR ; **390 et 1440 px** ; rendus capturés et planches examinées |
| Composants représentatifs | Accueil, devis et contact en FR/AR : **320, 360, 390, 768, 1024, 1280, 1440 et 1920 px** |
| Seuils supplémentaires | **599/600, 799/800, 1023/1024, 1319/1320, 1699/1700 px** ; menus ouverts, champs invalides et limites du texte du logo |
| Texte agrandi | Taille racine **200 %** sur accueil et devis FR/AR à **320, 768 et 1440 px**, sans débordement détecté après corrections |
| Paysage | **667 × 375 px**, accueil/devis/contact FR/AR, menu ouvert et fermeture Échap, défilement non verrouillé |
| Équivalent de reflow à 200 % | Viewport **720 × 450 CSS px**, DPR **2**, captures physiques **1440 × 900**, accueil/devis FR/AR ; il s'agit d'une équivalence de rendu, pas du réglage de zoom de l'interface Chrome |
| Régressions fonctionnelles | **792 assertions réussies** : navigation, langue, clavier, FAQ, validation, maintenance, copie et message WhatsApp long, absence de configuration e-mail, attente/rejet/acceptation simulés et verrou |
| Adaptateur e-mail | **5 tests Node réussis**, aucun appel réel |
| Galerie conditionnelle | Filtres et dialog testés dans une fixture locale non publiée, en FR/AR ; Échap et retour du focus vérifiés. La galerie publique reste vide |

Les contrôles de géométrie recherchent débordements horizontaux, boîtes hors écran, chevauchements du header, texte de logo dépassant sa boîte, cibles inférieures à 44 px et recouvrement du contenu par le contact fixe. Les captures ont aussi été inspectées : accueil FR/AR, mobile, formulaires tablette, texte agrandi et états d'e-mail. Les planches donnent une vue des neuf types de pages dans les deux langues.

Contrastes calculés en sRGB pour les associations concernées : bleu/blanc **5,82:1**, texte secondaire/papier **5,85:1**, secondaire/surface **5,54:1**, jaune/marine profond **11,42:1**, blanc/vert **7,43:1**, texte d'erreur/fond **6,51:1**, succès/fond **6,73:1**, placeholder/champ **4,71:1**, bordure de contrôle/blanc **3,55:1**. Ces mesures ciblées atteignent les seuils AA applicables à ces associations ; elles ne constituent pas une certification globale WCAG.

Preuves machine : `test-results/redesign/design-report.json` et `test-results/browser-report.json`. Captures d'états : `test-results/design-{fr,ar}-email-{loading,error,accepted}-simulation.png` et `design-{fr,ar}-message-long.png`. Les termes « acceptation » et « succès » concernent exclusivement des bouchons locaux, pas une livraison d'e-mail.

## Captures représentatives

Extraits des rendus finaux, sans contenu de démonstration ajouté au site :

- [Accueil desktop](captures-refonte/accueil-desktop.png)
- [Accueil mobile](captures-refonte/accueil-mobile.png)
- [Accueil arabe](captures-refonte/accueil-arabe.png)

Les captures avant refonte, les rendus complets des pages et les planches de comparaison restent dans `test-results/redesign/`, hors export public.

## Limites et consultation

Pas de contrôle sur Safari, Firefox, appareil physique, lecteur d'écran réel ou clavier virtuel mobile. Le zoom natif de l'interface Chrome n'est pas piloté : reflow équivalent et agrandissement du texte sont distingués ci-dessus. Pas de mesure Lighthouse/Core Web Vitals de production ni de garantie universelle d'absence de bugs.

Les paramètres EmailJS restent manquants et l'envoi est désactivé ; aucun e-mail, appel, message ou publication n'a été déclenché. La carte reste une recherche d'adresse, sans position exacte prétendument vérifiée. Ces limites fonctionnelles préexistantes ne sont pas remplacées par des démonstrations publiques.

Lancer `node scripts/build.mjs`, puis `node scripts/serve.mjs` depuis le dossier du projet. Adresse : **http://127.0.0.1:4173/fr/** ; arabe : **http://127.0.0.1:4173/ar/**. Le README fournit aussi le chemin exact du runtime Node disponible dans cet environnement. Le serveur de vérification est arrêté en fin de mission.
