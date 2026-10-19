# E-mail officiel, logo fourni et pompage solaire

Livraison du 17 octobre 2026, dans le site AJ ENERGIES existant. Pas de publication ni d’envoi réel de test.

## Fichiers concernés

| Emplacement | Changement |
|---|---|
| `data/company.mjs` | Adresse officielle fournie par le propriétaire, centralisée dans `email` |
| `config/site.mjs` | Budget conservateur du lien mailto ; paramètres EmailJS existants préservés |
| `assets/js/request-form.mjs` | Même préparation des données pour les canaux, aperçu e-mail/WhatsApp, copie, messages longs, champs de pompage conditionnels |
| `assets/js/message-channels.mjs` | Encodage des liens mailto et WhatsApp, retours à la ligne CRLF pour le courriel, repli sans corps tronqué |
| `scripts/request-form-template.mjs` | Template partagé Contact/Devis extrait du générateur, champs, aperçu et deux actions de préparation ; canal direct supplémentaire conservé lorsqu’il est configuré |
| `scripts/build.mjs` | Coordonnées et liens, logo officiel, quatre services, visuel de pompage, schéma LocalBusiness/OfferCatalog, export des nouveaux médias |
| `locales/fr.mjs`, `locales/ar.mjs`, `locales/request-updates.mjs` | Contenus ajoutés FR/AR : service, formulaires, FAQ, e-mail, aides, confidentialité et métadonnées pertinentes |
| `assets/styles.css` | Seulement trois règles ciblées ajoutées : image du logo contenue dans son emplacement, image de marque du footer et adresse e-mail pouvant revenir à la ligne ; règles préexistantes intactes |
| `assets/images/logo-officiel-*`, `assets/favicon-officiel.*` | Source fournie et exports du logo, sans redessin ni recoloration |
| `assets/images/pumping-*` | Source et exports WebP du visuel illustratif |
| `scripts/serve.mjs` | Type MIME PNG ajouté au serveur local |
| `tests/message-channels.test.mjs`, `scripts/contact-pumping-tests.mjs`, `scripts/contact-pumping-final-smoke.mjs`, `scripts/browser-tests.mjs`, `package.json` | Tests d’encodage, de parcours, de préservation et commandes de vérification ; adaptation du contrôle sans JS aux deux boutons de préparation |
| `dist/` | Site statique régénéré par le générateur prévu |
| README et documentation de configuration, sources et vérifications | État actuel et étapes externes restantes |

## Adresse officielle et emplacements

**ajenergiescontact@gmail.com**, confirmée par le propriétaire dans sa demande. Cette information n’est plus une adresse candidate à confirmer.

Elle apparaît dans le panneau des coordonnées (icône enveloppe), la page Contact, le footer, l’encart du devis et l’aperçu du message. Les liens directs utilisent `mailto:`. La propriété `email` du schéma LocalBusiness utilise la même donnée. Les textes de confidentialité utilisent aussi cette valeur centralisée au build.

L’adresse n’est pas tronquée : les retours à la ligne sont autorisés sans insérer de caractère dans sa valeur. Elle est isolée en gauche à droite avec `bdi dir="ltr"`, y compris dans l’interface arabe. L’aperçu permet de copier séparément le destinataire ; si le presse-papiers est refusé, le texte est sélectionné pour une copie manuelle.

## Mécanisme livré

1. Remplir Contact ou Devis, puis choisir **Continuer par e-mail** ou **Continuer sur WhatsApp**.
2. Le formulaire valide les champs actifs et compose un seul message avec leurs libellés traduits.
3. L’aperçu affiche le destinataire, l’objet et le message. Les deux liens sont disponibles ; modifier la demande conserve les saisies.
4. Le lien mailto fixe le destinataire à l’adresse de l’entreprise et encode l’objet et le corps, y compris accents, arabe, signes `& + ?` et retours à la ligne.
5. Le visiteur ouvre sa messagerie, vérifie puis envoie lui-même. Le site annonce uniquement **message préparé**, jamais un envoi ou une réception.
6. Si l’URL encodée dépasse le budget conservateur de 1 900 caractères, l’e-mail garde seulement destinataire et objet ; le texte intégral reste affiché, avec consigne de copie/collage. Le budget WhatsApp est indépendant. Les limites réelles varient selon les applications ; aucune détection de messagerie installée n’est prétendue.

Aucun mot de passe Gmail, secret SMTP ou clé privée ajouté. Aucun stockage persistant des formulaires. Le corps ne contient que les valeurs renseignées et applicables : les groupes masqués sont désactivés ; les unités sans quantité et les données électriques d’un projet de pompage sont exclues.

### Envoi direct

EmailJS était et reste désactivé/non configuré. L’adaptateur REST existant, son verrou anti-double envoi, sa temporisation et sa gestion d’erreurs sont préservés. Lorsque le service est configuré, son bouton direct reste disponible en complément des préparations mailto/WhatsApp ; seul ce canal peut annoncer une acceptation après réponse effective du service.

Aucun accès au tableau de bord EmailJS n’a été fourni : **le destinataire des modèles externes n’a pas été changé ni vérifié**. Pour activer l’envoi direct, configurer le service et les deux modèles Contact/Devis, fixer leur destinataire à **ajenergiescontact@gmail.com**, vérifier l’expéditeur autorisé, les origines et protections, renseigner les variables publiques puis reconstruire. Voir `docs/CONFIGURATION_EMAIL.md`. Aucun envoi réel ni réception vérifiée dans cette livraison.

## Logo officiel fourni

Source : `C:/Users/louay/Desktop/704898658_122138798013133892_8769785382068832190_n.jpg`, fournie comme logo officiel par le propriétaire. Une copie identique est conservée dans `assets/images/logo-officiel-source.jpg` ; l’égalité SHA-256 est contrôlée.

Le fichier carré 1254 × 1254 px est reproduit **intégralement**, sans détourage génératif, recadrage du dessin, redessin ni changement de palette. Il n’a pas de transparence : son fond photographique bleu/jaune est conservé. Les versions WebP 160 et 320 px respectent le ratio. L’image utilise `object-fit: contain`, dans les tailles de conteneur déjà présentes (80/120/150 px selon la largeur) ; le footer garde sa taille existante.

Le nom figurant déjà dans le logo, la répétition typographique adjacente est retirée du panneau et de la marque du footer. Le nom AJ ENERGIES reste accessible dans les liens de marque et le panneau, et présent dans les contenus commerciaux. Aucun changement de navigation, de police ou de taille de texte pour agrandir le logo. La proposition SVG antérieure reste dans les sources historiques, mais n’est plus utilisée par l’interface.

Le favicon reprend l’image fournie à taille réduite, sans créer de nouveau symbole de marque. Ce fichier de référence contient une composition complète avec du texte : ses détails les plus fins sont forcément moins lisibles à la taille d’un favicon.

## Pompage solaire

Service confirmé par le propriétaire : **installation de systèmes de pompage solaire photovoltaïque** / **تركيب أنظمة ضخّ المياه بالطاقة الشمسية**.

- Quatrième carte et lien de service à l’accueil, avec le texte court demandé.
- Section Services reprenant les composants et le style des trois autres services : description et complément fournis, informations utiles, CTA vers `/{lang}/quote/?need=pumping`.
- Listes générales d’activité, À propos, footer, textes de demande et métadonnées pertinentes complétés sans réécriture des autres prestations.
- Deux questions/réponses de FAQ ajoutées, traduites en arabe.
- Schéma OfferCatalog contenant les quatre services, sans marque, dimension de pompe, débit garanti, client ou référence de chantier inventés.

### Champs conditionnels

Dans les deux formulaires, le choix Pompage solaire active : localisation (ville existante du devis ; champ facultatif ajouté à Contact), usage de l’eau, source, quantité approximative, unité m³/jour ou m³/h, hauteur de relevage en mètres, présence d’une pompe et caractéristiques facultatives. La description du projet reste le champ de demande existant.

Les indications techniques sont facultatives. Les champs électriques de dimensionnement et de maintenance sont masqués/désactivés pour ce service. Le formulaire rappelle que la profondeur d’un forage n’est pas la hauteur manométrique totale et qu’aucun calcul de dimensionnement n’est effectué. Choisir « pompe existante : non » exclut les anciennes caractéristiques éventuellement saisies. Changer de service ou de canal conserve les valeurs dans le formulaire sans transmettre les champs devenus inapplicables.

## Image de pompage et provenance

Aucune photo authentique de pompage n’a été fournie. Le visuel est donc une **illustration générée par imagegen intégré**, pas une réalisation de l’entreprise. Il montre des panneaux, une installation de pompage et un réservoir dans une scène agricole fictive, sans client ni lieu attribué.

Source locale : `assets/images/pumping-source.png` (1672 × 941 px). Exports WebP : `pumping-768.webp` (768 × 432, 111 902 octets) et `pumping-1536.webp` (1536 × 864, 346 324 octets), qualité 84, redimensionnement Lanczos au ratio 16:9. Dimensions réservées, `srcset`, `loading="lazy"` et alternatives FR/AR. Légende : **Illustration d’un système de pompage solaire.** / **صورة توضيحية لنظام ضخّ مياه بالطاقة الشمسية.**

Aucun média d’un installateur tiers ou d’une photothèque récupéré ; aucune licence de photographie tierce revendiquée. Les conditions de l’outil de génération restent applicables ; aucune exclusivité juridique n’est affirmée. Le fichier du logo vient du propriétaire pour cette intégration. Sources et statuts également conservés dans `docs/SOURCES_VISUELS_SOLAIRES.md`.

Prompt final, outil intégré (pas de CLI/API de remplacement) :

```text
Use case: photorealistic-natural. Asset type: illustrative photovoltaic website photo, horizontal 16:9 landscape. Scene: a modest generic Mediterranean agricultural site, orderly blue photovoltaic modules mounted on a plausible low metal ground rack beside a small solar water pumping installation. A discreet pump/control housing protected from weather, realistic connected irrigation pipe leading toward a simple cylindrical water storage tank and olive trees with dry soil. Natural neutral daylight, realistic panel cells and mounting, clean credible architectural/editorial photography consistent with a professional solar energy website. This is a fictional illustrative system, not an actual company project, not an engineering schematic. No people, text, logos, labels, watermark, identifiable location or address, exaggerated water jets, fantasy equipment, floating parts or distorted geometry.
```

## Vérifications

Les résultats finaux sont dans `test-results/email-pompage/report.json`, `test-results/email-pompage/final-smoke.json` et `test-results/browser-report.json`.

| Contrôle exécuté | Résultat |
|---|---|
| Build et structure | 20 pages, **2 004 contrôles** réussis |
| Tests Node | **9 tests** réussis, adaptateur EmailJS et encodage des canaux |
| Mission contact/pompage | **1 019 contrôles**, 48 scénarios : six pages modifiées × FR/AR × 360/768/1024/1440 px ; aucune défaillance, erreur JS, ressource manquante ou requête externe |
| Régression complète | **738 contrôles**, neuf routes × deux langues × 360/390/768/1024/1440 px ; cas sans JS et canal direct simulé également vérifiés |
| Dernier contrôle ciblé après normalisation/isolation des chiffres de téléphone | **67 contrôles** réussis à quatre largeurs dans les deux langues : favicon PNG décodable, destinataire, unités, caractéristiques, téléphone LTR dans l’aperçu, début d’aperçu visible et absence de débordement ; copie manuelle vérifiée avec le nouveau balisage |

Les contrôles comprennent la vérification des règles CSS préexistantes, de la source de navigation et des fichiers protégés, les liens et images, les formulaires invalides, les données facultatives, la présélection via le CTA, les unités, l’exclusion des champs cachés, le contenu commun, les messages longs et le presse-papiers refusé. Les captures de viewport, de pompage, de champs techniques et d’aperçu sont conservées dans ce dossier. Les chiffres arabes du téléphone sont normalisés dans le message préparé, comme dans le paramètre de téléphone de l’adaptateur, sans modifier la saisie conservée dans le formulaire. L’aperçu isole le téléphone et l’e-mail avec `bdi dir="ltr"`, sans ajouter de caractère invisible au texte copié ou encodé. Son titre est explicitement remis dans la zone visible à l’ouverture, même après un formulaire long.

Les contrôles du logo, de la longue adresse et des panneaux ont été inspectés sur captures réelles du navigateur. Les mécanismes d’acceptation/réseau EmailJS sont testés avec bouchons exclusivement. Pas de véritable ouverture d’une application de messagerie, de compte WhatsApp ou d’envoi. Le cadre Google Maps est intercepté durant les tests. Chrome headless sous Windows et viewports simulés : pas de réception vérifiée ni de test sur appareil physique.

La palette, les arrondis, espacements, échelles typographiques et seuils existants sont préservés. La hauteur des blocs reste naturellement liée au contenu ajouté (adresse, quatrième service, champs et aides). La navigation garde exactement les mêmes composants et positions.

## Consultation locale

Dans la racine du site : `node scripts/build.mjs`, puis `node scripts/serve.mjs`. URL : `http://127.0.0.1:4173/fr/`, service : `/fr/services/#pumping`, devis présélectionné : `/fr/quote/?need=pumping`, équivalents arabes sous `/ar/`. Voir les chemins Node complets dans le README si Node n’est pas dans PATH. Le serveur déjà présent sur le port 4173 a été réutilisé, sans publication.

