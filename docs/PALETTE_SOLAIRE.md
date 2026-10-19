# Adaptation solaire — 17 octobre 2026

## Périmètre réalisé

Le site existant a été modifié en place. Les changements d’interface concernent les couleurs, les dégradés et ombres, le symbole de marque, les images et leurs légendes, ainsi que le retrait des messages internes ciblés. Aucun nouvel hébergement, abonnement ou déploiement.

Les dimensions et comportements existants sont conservés : navigation basse sous 1024 px, navigation haute dès 1024 px, fiche entreprise au-dessus du contenu jusqu’à 1249 px, sidebar dès 1250 px. Chevron seul sous 580 px, texte de la languette ensuite, coordonnées toujours visibles à partir de 1250 px. Mise en page, typographie Poppins/Tajawal, graisses, arrondis, espacements, transitions et comportement RTL inchangés.

## Fichiers concernés

| Fichier / dossier | Modification |
|---|---|
| `assets/styles.css` | Palette sémantique claire centralisée, anciens noms de variables reliés à cette palette ; gradients et ombres adaptés ; contrastes des contrôles, liens, icônes, focus, erreurs et succès |
| `assets/logo-aj-energies.svg`, `assets/favicon.svg` | Proposition originale soleil/panneau, sans répétition du nom ; favicon correspondant |
| `assets/images/commercial-*`, `industrial-*`, `equipment-*` | Trois images générées, sources PNG conservées et six exports WebP locaux ; image résidentielle existante conservée |
| `data/illustrations.mjs` | Métadonnées des quatre exemples illustratifs, titres et alternatives FR/AR ; distinctes des projets authentiques |
| `scripts/build.mjs` | Intégration du symbole et des visuels, légendes, galerie illustrative lorsque les données authentiques sont vides, retrait des blocs internes, couleur de thème du navigateur, copie des nouveaux assets |
| `locales/fr.mjs`, `locales/ar.mjs` | Légende d’illustration, retrait de la phrase interne d’introduction de confidentialité, dernier bloc interne marqué pour exclusion de l’affichage |
| `dist/` | Export régénéré par le générateur prévu, 20 pages HTML et assets |
| `scripts/palette-tests.mjs`, `palette-static-tests.mjs`, `palette-captures.mjs` | Comparaison avant/après, géométrie, textes, métadonnées, hash des fichiers protégés, contrastes et captures |
| `scripts/portfolio-reference-tests.mjs`, `scripts/design-tests.mjs` | Comparaison de référence recentrée sur les proportions/transitions et emplacement des rapports de la nouvelle palette ; rapports historiques conservés |
| `README.md`, `docs/INFORMATIONS_A_COMPLETER.md`, ce document et `docs/SOURCES_VISUELS_SOLAIRES.md` | Documentation de l’état actuel, des sources et limites |

## Palette

Fond `#f3f7fa`, panneaux blancs, surfaces `#eaf1f6`, titres `#123047`, texte `#243746`, texte secondaire `#526575`, bleu actif `#145b88` et survol `#10486c`, solaire `#f4b942` et survol `#e5a62b`, énergie `#237a57`, bordures décoratives `#d5e0e8`. Bordures de champs plus soutenues `#7c909f` pour distinguer les contrôles sur blanc. Erreurs `#a32625` sur fond `#fff1f0` ; succès vert.

Les liens et icônes sont bleus, les traits de titres et CTA solaires restent jaunes. Texte bleu nuit sur les CTA jaunes. Les boutons de formulaire gardent leur forme en relief, avec un dégradé bleu et un texte blanc. Navigation transparente bleu très pâle, flou de 10 px conservé. La languette reprend les gradients clairs et le bleu actif sans changement de position ni de taille. Le focus reste visible.

## Identité et photos

Le logo est une **proposition créée pour le site**, pas un logo officiel fourni. Trois nouvelles illustrations IA montrent un bâtiment commercial, une toiture industrielle et les détails d’un panneau ; l’illustration résidentielle existante est conservée. Elles sont affichées avec la légende « Illustration — exemple de configuration photovoltaïque », traduite en arabe, et ne sont pas enregistrées comme réalisations d’AJ ENERGIES. Aucun nom de client, puissance, lieu précis, date ou résultat inventé.

Voir `docs/SOURCES_VISUELS_SOLAIRES.md` pour les sources, prompts, droits non présumés, dimensions et poids. Aucun média personnel du portfolio repris.

## Messages internes retirés

- Titre d’attente « Les réalisations seront présentées prochainement » et équivalent arabe : remplacés par une zone clairement illustrative utilisant les composants de galerie existants ; texte commercial de contact conservé.
- Phrase de l’introduction de confidentialité demandant de compléter les informations juridiques avant publication et équivalent arabe : retirée de l’affichage.
- Section « Informations à compléter avant publication » et équivalent arabe : conservée dans les sources pour la maintenance, exclue du HTML public ; exigences utiles également dans `docs/INFORMATIONS_A_COMPLETER.md`.
- Bloc conditionnel de repli du formulaire lié à l’absence de configuration e-mail : retiré de l’affichage. Le véritable bouton de préparation WhatsApp et les contacts téléphoniques restent fonctionnels.

Les validations, erreurs réseau, états de chargement, avertissements sur l’envoi effectif dans WhatsApp et informations de confidentialité utiles sont conservés. Aucun bouton d’envoi e-mail fictif n’a été ajouté. La mention de **vue générale de Msaken — emplacement exact à confirmer** est conservée : elle évite d’attribuer un emplacement non vérifié à l’entreprise. L’adresse, le lien de recherche, l’iframe et sa configuration restent inchangés.

## Vérifications réellement effectuées

| Contrôle | Résultat |
|---|---|
| Build et contrôle structurel | 20 pages HTML FR/AR, 1 870 contrôles réussis |
| Tests de l’adaptateur e-mail | 5 tests réussis : configuration absente, promesse en attente, réseau/rejet/timeout, verrou anti-double envoi et validation ; aucun envoi réel |
| Tests navigateur fonctionnels | 738 assertions, neuf routes par langue à 360, 390, 768, 1024 et 1440 px ; zéro erreur JavaScript, ressource manquante ou requête externe non interceptée |
| Comparaison avant/après | 72 scénarios : neuf routes × deux langues × 360/768/1024/1440 px ; 45 846 assertions réussies, dimensions/typo/métadonnées et fichiers protégés conservés, ouverture/fermeture des coordonnées, clavier, menu Plus, images et validation |
| Déclarations CSS | 984 déclarations sans rapport avec la couleur identiques ; media queries et container queries inchangées |
| Référence portfolio | 147 contrôles réussis à 320, 390, 579, 580, 767, 768, 1023, 1024, 1249, 1250 et 1440 px, dont cycles mobile/tablette/desktop dans les deux langues ; sa palette sombre n’est plus une référence attendue |
| Captures et inspection | Captures de viewport de l’accueil et Contact aux quatre largeurs demandées, FR/AR, coordonnées ouvertes sous 1250 px ; inspection du rendu desktop, tablette, mobile, RTL, galerie et formulaire en erreur |
| Préservation fonctionnelle | Hash SHA-256 identiques pour `main.mjs`, `request-form.mjs`, `email-adapter.mjs`, les données d’entreprise/projets et les deux configurations ; comparaison des textes commerciaux FR/AR avec exceptions explicites pour les mentions internes/légendes autorisées |

Contrastes calculés : texte/panneau **12,28:1**, secondaire/surface **5,30:1**, lien/surface **6,39:1**, titre/panneau **13,64:1**, bouton jaune **7,71:1**, point le plus clair du bouton bleu **5,96:1**, erreur **6,67:1**, succès **5,26:1**, bordure de champ/blanc **3,31:1**. Cela vérifie ces paires de couleurs, sans revendiquer une conformité globale à l’accessibilité.

Preuves : `test-results/palette-solaire/` contient la référence avant modification, les comparaisons JSON et les captures. Les fichiers `viewport-*` montrent le rendu à la taille de viewport normale ; les captures pleine page sont des traces complémentaires de défilement. Le relevé initial est à conserver, sans le régénérer lors d’un simple contrôle ultérieur.

## Limites et lancement

Chrome headless sous Windows, dimensions simulées ; pas de vérification sur appareils physiques. Le contenu Google Maps a été intercepté dans les tests locaux : le cadre et les liens sont contrôlés, pas le fonctionnement externe du fournisseur. La localisation précise n’est pas confirmée. EmailJS reste désactivé/non configuré, avec un parcours réel de préparation WhatsApp ; aucun e-mail, appel ou message envoyé. Les médias sont illustratifs et le logo reste à approuver. Les mentions opérationnelles privées restent dans la documentation. Aucun déploiement.

Dans la racine du site : `node scripts/build.mjs`, puis `node scripts/serve.mjs`, et ouvrir `http://127.0.0.1:4173/fr/` ou `/ar/`. Les commandes PowerShell avec le chemin absolu du runtime de cet environnement sont dans le README. Le serveur temporaire utilisé pour les vérifications est arrêté à la livraison.
