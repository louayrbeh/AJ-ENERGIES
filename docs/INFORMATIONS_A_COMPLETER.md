# Informations à compléter avant publication

Le site est livré pour consultation locale et préparation. Cette liste distingue les informations manquantes des fonctionnalités déjà développées ; elle ne constitue pas un engagement de l’entreprise.

| Information | État et action attendue | Emplacement concerné |
|---|---|---|
| Identité et présentation | Faire valider la raison sociale affichée, la formulation des services et les contenus FR/AR par le propriétaire ; faire relire l’arabe par un locuteur compétent | `data/company.mjs`, `locales/fr.mjs`, `locales/ar.mjs` |
| Logo officiel | Fichier fourni par le propriétaire le 17/10/2026, intégré sans redessin ni changement de couleurs ; copie source et exports optimisés conservés | `assets/images/logo-officiel-*`, `assets/favicon-officiel.png` ; `docs/EMAIL_LOGO_POMPAGE.md` |
| Téléphone et WhatsApp | Coordonnée recoupée officiellement, mais accès WhatsApp et réception non testés | `data/company.mjs` |
| Adresse et emplacement exact | Rue Youssef Temimi, 4070 Msaken, Sousse recoupée ; entrée, coordonnées GPS et repère exact non vérifiés | `data/company.mjs`, `config/map.mjs` |
| Carte | `enabled: true`, `verified: false` : une vue générale de Msaken est intégrée avec avertissement explicite, sans marqueur attribué à l’entreprise. Après validation propriétaire, remplacer `embedUrl` par l’intégration du lieu exact, passer `verified` à `true`, puis reconstruire | `config/map.mjs` ; adapter la confidentialité si nécessaire |
| E-mail de l’entreprise | `ajenergiescontact@gmail.com` confirmé par le propriétaire le 17/10/2026 ; publié dans les coordonnées, Contact, footer et données structurées ; parcours mailto livré sans envoi automatique | `data/company.mjs`, formulaires et `docs/CONFIGURATION_EMAIL.md` |
| Envoi EmailJS | Canal désactivé ; compte, clé publique, service et deux modèles à configurer. Fixer le destinataire des deux modèles à `ajenergiescontact@gmail.com` dans le service externe ; réglage non effectué et aucun envoi réel vérifié | `config/site.mjs`, `docs/CONFIGURATION_EMAIL.md` |
| Protections fournisseur | Origines autorisées et protections anti-abus à configurer ; reCAPTCHA v2 non intégré, à développer et configurer si retenu avant activation publique | EmailJS et formulaires |
| Horaires | Non fournis et non vérifiés ; ne pas inventer une disponibilité | Données d’entreprise et contenus contact |
| Facebook | Lien fourni conservé, page inaccessible pendant la recherche ; vérifier qu’il ouvre bien la page officielle voulue | `data/company.mjs` |
| Réalisations | Fournir projets réels, lieux autorisés, descriptifs, photographies et accord de publication ; ne pas transformer l’illustration IA en photo de chantier | `data/projects.mjs`, médias |
| Marques, certifications et agréments | Aucun logo partenaire ni revendication commerciale affiché. Faire confirmer et documenter toute mention future, y compris sa portée et sa validité | Contenus à venir |
| Statistiques, témoignages, tarifs et garanties | Absents faute de preuves ; fournir les données et autorisations avant ajout | Contenus à venir |
| Image d’illustration | Image IA de présentation, pas un projet client. Approuver l’usage ou fournir des photos autorisées | `assets/images/` et `docs/SOURCES_CONTENUS.md` |
| Domaine et chemin public | Renseigner `SITE_URL` avec l’origine HTTPS définitive, et `BASE_PATH` si sous-dossier ; aucun `.env` lu automatiquement | `config/site.mjs` et environnement de build |
| Responsable du traitement | Faire valider le texte de confidentialité, l’identité de l’exploitant, le contact pour les demandes, la durée de conservation et les procédures de traitement effectives | Pages de confidentialité FR/AR et pratiques de l’entreprise |
| Hébergement | Choisir le prestataire, vérifier HTTPS et la résolution des routes statiques ; publication non effectuée | Dossier `dist/` après build |
| Vérifications avant mise en ligne | Relire tous les contenus, vérifier les coordonnées, tester clavier et mobile, puis organiser séparément un éventuel test réel EmailJS et en confirmer la réception | Documentation de tests et environnement de recette |

La provenance et les limites de la recherche sont détaillées dans `docs/SOURCES_CONTENUS.md`. Le domaine, la carte et l’e-mail doivent refléter des données approuvées ; leurs champs ne doivent pas être remplacés par des valeurs fictives pour faire disparaître une limite de configuration.
