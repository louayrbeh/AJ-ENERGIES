# Vérifications du site AJ ENERGIES

Les résultats ci-dessous décrivent la livraison initiale. Pour la version actuelle avec adresse officielle, logo fourni et pompage solaire, consulter [EMAIL_LOGO_POMPAGE.md](EMAIL_LOGO_POMPAGE.md) et `test-results/email-pompage/report.json`. La palette claire est documentée dans [PALETTE_SOLAIRE.md](PALETTE_SOLAIRE.md). Les documents [TRANSPOSITION_FIDELE_PORTFOLIO.md](TRANSPOSITION_FIDELE_PORTFOLIO.md), [CORRECTIONS_COORDONNEES_CARTE.md](CORRECTIONS_COORDONNEES_CARTE.md), [STYLE_PORTFOLIO.md](STYLE_PORTFOLIO.md) et [REFONTE_DESIGN.md](REFONTE_DESIGN.md) conservent les états précédents. Les rapports machine indiquent leur propre date.

Exécutées le 15 octobre 2026. Node.js utilisé : **24.19.0**, runtime fourni par l'environnement de travail. Aucun envoi réel, message WhatsApp, appel téléphonique ou déploiement.

## Résultats locaux

| Contrôle | Résultat observé | Méthode et limite |
|---|---|---|
| Build par défaut | 20 documents HTML produits | `node scripts/build.mjs` ; FR/AR, accueil racine français et 404 racine ; e-mail désactivé, carte non intégrée et préproduction noindex |
| Export statique et traductions | **1 407 contrôles réussis** | `node scripts/check.mjs` : h1, descriptions, titres, correspondance des clés, labels, liens internes, ancres, ressources, imports, JSON, alternates et CSP |
| Configuration de production et sous-chemin | **1 305 contrôles réussis** | Export isolé sous `test-results/production`, origine réservée `https://example.invalid`, préfixe `/aj-energies`, faux paramètres EmailJS de test ; aucun appel au service et aucune modification de `dist/` final. Canonical, hreflang, sitemap et configuration réseau conditionnelle contrôlés |
| Adaptateur e-mail | **5 tests Node réussis** | Configuration absente sans appel ; attente sans succès ; verrou ; destinataire non choisi par le visiteur ; e-mail facultatif ; modèles contact/devis ; HTTP 400/429/500, réseau, timeout et libération du verrou |
| Parcours navigateur | **792 assertions réussies** | `node scripts/browser-tests.mjs`, Chrome headless **155.0.8059.40** ; voir le rapport machine local |
| Responsive | Aucun débordement horizontal constaté | Neuf routes × deux langues × cinq largeurs : **360, 390, 768, 1024, 1440 px**, hauteur 1000 px ; menu ouvert, formulaires invalides et images décodées également vérifiés |
| RTL | Direction et contenus arabes opérationnels dans les scénarios | Vérification des pages et correspondances ; inspection de captures de l'accueil arabe mobile et devis arabe tablette. Numéros et champs latins isolés, espacements logiques |
| Navigation | Liens de pages et sélecteur de langue corrects | HTTP local ; lien de langue vers la même route ; lien d'évitement au clavier et focus sur main ; menu ouvrable, fermeture Échap |
| FAQ et réalisations | FAQ native utilisable au clavier ; galerie vide affichée | Entrée sur summary et état ouvert ; aucun faux projet ni faux filtre publié |
| Validation | Requis, téléphone invalide, e-mail invalide et nombre négatif refusés | Six requis au devis, trois requis au contact ; erreurs associées et focus première erreur ; e-mail facultatif accepté vide |
| Maintenance | Champs adaptés et données non pertinentes exclues | Préselection `?need=maintenance`, dimensionnement masqué et désactivé, informations d'équipement affichées, anciennes valeurs de consommation absentes du message |
| WhatsApp | Aperçu, unités et URL encodée corrects | Soumission au clavier, texte affiché avec `textContent`, aucun HTML injecté ; **aucun clic vers WhatsApp ni message envoyé** |
| Texte long et presse-papiers | Repli vers conversation sans texte et copie vérifiés | Texte de plus de 1 900 caractères encodés ; copie réelle locale, retours CRLF normalisés ; refus du presse-papiers simulé et sélection manuelle |
| E-mail dans l'interface | Chargement, verrou, rejet, conservation et reset après acceptation vérifiés en FR/AR | Fixture HTML en mémoire avec canal activé et `fetch` remplacé par une promesse contrôlée. Le réseau externe reste bloqué. Aucun succès avant résolution ; double submit refusé. **Aucune preuve de livraison d'e-mail** |
| Carte | Alternative textuelle et lien de recherche fonctionnels localement | Aucune iframe affichée en l'absence de point confirmé. Le parcours du service Google et l'exactitude du point ne sont pas testés |
| Sans JavaScript | Contenu, navigation et contacts accessibles | Chrome avec JS désactivé ; bouton formulaire désactivé, aucun GET accidentel de saisie |
| Données et réseau | Stockages navigateur vides ; zéro requête externe au chargement | Observations du contexte de test, requêtes non locales bloquées ; aucun outil de mesure de visite |
| Robustesse JS | Aucune erreur JavaScript critique observée | Collecte pageerror/console pendant les scénarios ; pas de prétention d'audit exhaustif |
| Mouvement réduit | Défilement animé désactivé | Préférence `prefers-reduced-motion` émulée ; règle CSS neutralisant transitions et déplacements |
| Contrastes ciblés | Calculs conformes aux couleurs principales choisies | Bleu/blanc **5,81:1**, texte secondaire/blanc **6,22:1**, secondaire/surface **5,72:1**, jaune/marine profond **11,15:1**, blanc/vert **6,70:1**, placeholder/blanc **4,76:1**. Calcul sRGB local, pas de certification WCAG ni de mesure exhaustive sur les photos |

## Preuves et portée

`test-results/browser-report.json` conserve la date, le navigateur, les assertions, les largeurs, les erreurs et les requêtes externes observées. Les 20 captures `test-results/{fr,ar}-{home,quote}-{360,390,768,1024,1440}.png` montrent l'accueil et les devis invalides. Ces fichiers locaux sont ignorés par Git et ne sont pas copiés dans l'export.

Les tests adaptateur sont dans `tests/email.test.mjs`. Ils n'utilisent jamais un compte actif. Les fixtures d'interface remplacent uniquement la configuration et le transport dans le contexte de test ; elles n'activent pas l'e-mail sur le site livré. L'export `dist/` final reste désactivé et ne contient aucune valeur fictive d'identification EmailJS.

## Corrections et limites de procédure

- Le mode Node `--test` lançait un processus enfant interdit par le sandbox (`spawn EPERM`). Les mêmes tests sont exécutés directement avec `node tests/email.test.mjs`, sans isolation de processus supplémentaire ; les cinq scénarios passent.
- Le lancement Chrome était interdit par le sandbox (`spawn EPERM`). Les tests navigateur ont ensuite été exécutés avec l'autorisation d'exécution locale de l'outil. Aucun accès à un compte ni contournement de restriction d'un service externe.
- Le premier scénario clavier supposait à tort qu'un seul Tab depuis le message allait au bouton ; le lien de confidentialité se trouve aussi dans cet ordre. Le test a été corrigé pour focaliser le bouton puis presser Entrée, et le parcours complet a été relancé.
- Après inspection visuelle, le bouton de menu a été compacté sur très petit écran, les liens téléphone/WhatsApp du panneau arabe séparés, la langue du logotype et l'ordre du sélecteur adaptés, et les libellés de page affinés. Les contrôles concernés ont été relancés.

Pas de test Safari, Firefox, lecteur d'écran réel, iPhone, Android, tablette ou autre matériel physique. Pas de mesure Lighthouse/Core Web Vitals de production, de délivrabilité, réception ou lecture d'e-mail, de réception WhatsApp, d'accès Facebook authentifié, de lieu Google Maps exact ou de configuration d'hébergement réelle. La galerie future avec données réelles et le dialog conditionnel devront être retestés lorsqu'ils seront alimentés.

L'iframe conditionnelle est écrite et centralisée mais non affichée ou vérifiée contre Google, faute de position exacte confirmée. La configuration e-mail et les protections fournisseur restent nécessaires avant activation. Les textes arabe et métier nécessitent une validation éditoriale du propriétaire.

Le serveur local de vérification est arrêté après livraison ; les commandes README permettent de le relancer.
