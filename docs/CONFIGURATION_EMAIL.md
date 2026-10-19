# Configuration e-mail et environnement de publication

## État livré

Le propriétaire a confirmé **ajenergiescontact@gmail.com**, désormais centralisé dans `data/company.mjs`. Les formulaires Contact et Devis préparent un même message validé pour **mailto et WhatsApp**, avec aperçu, destinataire, objet, copie du message et copie de l’adresse. Le visiteur clique sur un lien `mailto:` puis vérifie et envoie lui-même dans sa messagerie. Ouvrir l’application ne constitue pas un envoi et le site ne détecte pas avec certitude la présence d’une application.

Le budget `mailtoMaxUrlLength` dans `config/site.mjs` est conservateur (1 900 caractères encodés), pas une limite universelle des logiciels de messagerie. Si le lien complet dépasse ce budget, le corps n’est pas tronqué : le lien conserve seulement le destinataire et l’objet, et l’interface demande de copier/coller le message. Le texte intégral reste dans l’aperçu. Le parcours WhatsApp applique son propre budget indépendant. Les informations de pompage facultatives et applicables sont incluses dans les deux canaux ; les champs masqués sont désactivés et exclus.

**L’envoi direct EmailJS reste désactivé et non configuré.** Aucun accès au tableau de bord n’est disponible dans cette livraison : le destinataire des modèles externes n’a pas été modifié ni vérifié. L’adresse Gmail ne fournit aucun moyen d’envoyer directement depuis le site. L’adaptateur et ses protections sont conservés ; lorsqu’il est configuré, il reste un canal supplémentaire. Aucun message réel n’a été envoyé ; une acceptation simulée ne prouve pas une réception.

Les fichiers de référence sont `config/site.mjs`, `assets/js/email-adapter.mjs`, `assets/js/request-form.mjs` et `scripts/build.mjs`.

## Paramètres publics au moment du build

`config/site.mjs` lit l’environnement du processus Node. **Aucun fichier `.env` n’est chargé automatiquement.** Définir ces variables dans le terminal ou dans l’environnement de build de l’hébergeur avant `npm run build`.

| Variable | Rôle | Valeur par défaut |
|---|---|---|
| `EMAILJS_ENABLED` | Active le canal e-mail uniquement avec la chaîne exacte `true` | Désactivé |
| `EMAILJS_PUBLIC_KEY` | Clé publique du compte EmailJS ; devient `user_id` dans REST | Chaîne vide |
| `EMAILJS_SERVICE_ID` | Service d’envoi connecté dans le tableau de bord | Chaîne vide |
| `EMAILJS_CONTACT_TEMPLATE_ID` | Modèle de réception du formulaire contact | Chaîne vide |
| `EMAILJS_QUOTE_TEMPLATE_ID` | Modèle de réception de la demande de devis | Chaîne vide |
| `SITE_URL` | Origine publique HTTPS définitive, sans chemin ni slash final | Vide : préproduction `noindex` |
| `BASE_PATH` | Préfixe éventuel de déploiement, commençant par `/`, sans slash final | Vide : racine du domaine |

Les paramètres EmailJS ci-dessus sont publics et sont intégrés au HTML généré pour le navigateur. **Ne jamais placer de mot de passe SMTP, clé privée EmailJS, jeton d’administration ou secret reCAPTCHA dans ces variables ou dans les sources publiques.** Un changement de variable après génération exige un nouveau build. `SITE_URL` doit contenir uniquement l’origine ; le sous-chemin éventuel appartient à `BASE_PATH`.

Le build échoue si `EMAILJS_ENABLED=true` et qu’un des quatre paramètres EmailJS requis manque. Il valide la forme de `SITE_URL` et `BASE_PATH`. Cela ne vérifie ni les permissions du compte, ni l’existence du service et des modèles, ni leur destinataire.

## Configuration dans EmailJS avant activation

1. Utiliser un compte appartenant à l’entreprise et y connecter le service d’envoi choisi. Conserver les authentifiants du fournisseur dans le tableau de bord, jamais dans le navigateur.
2. Créer ou vérifier les deux modèles, contact et devis. Pour chacun, fixer le **destinataire dans le tableau de bord à `ajenergiescontact@gmail.com`**, puis vérifier les réglages du compte. Ce réglage externe reste à effectuer ; il n’est pas déduit de l’adresse publiée sur le site. Aucun champ visiteur ne doit définir le destinataire.
3. Utiliser une adresse d’expédition autorisée par le service connecté. `from_name` peut être affiché comme nom du demandeur ; il ne remplace pas l’adresse d’expédition autorisée.
4. Le champ visiteur `visitor_email` est **facultatif** et peut être vide. Préférer un **Reply-To fixe et valide**, ou l’absence de Reply-To selon le fournisseur, tant qu’une gestion conditionnelle du courriel facultatif n’a pas été configurée et validée. Ne pas lier directement un Reply-To obligatoire à `{{visitor_email}}` sans traiter le cas vide.
5. Insérer les variables ci-dessous dans le corps du modèle, avec l’interpolation textuelle standard du fournisseur. Ne pas interpréter les saisies comme du HTML arbitraire.
6. Configurer les origines autorisées, et les protections côté fournisseur, puis activer les variables publiques et reconstruire. Un éventuel test réel devra être organisé séparément et autorisé.

| Variable du modèle | Contenu envoyé |
|---|---|
| `from_name` | Nom saisi, nettoyé des espaces en début et fin |
| `visitor_phone` | Téléphone saisi ; chiffres arabes normalisés par le formulaire |
| `visitor_email` | Courriel facultatif, chaîne vide possible |
| `request_kind` | `contact` ou `quote` |
| `language` | `fr` ou `ar` |
| `subject` | Sujet ou besoin sélectionné |
| `request_body` | Message structuré avec les champs actifs et leurs libellés dans la langue du formulaire |

## Contrat REST réellement implémenté

Le navigateur appelle `POST https://api.emailjs.com/api/v1.0/email/send` avec `Content-Type: application/json`, `credentials: omit`, et les propriétés `service_id`, `template_id`, `user_id`, `template_params`. Aucun SDK, SMTP ou backend local n’intervient. Le service et le modèle contact/devis proviennent exclusivement de la configuration.

L’adaptateur accepte uniquement **HTTP 200**, ce qui correspond au succès documenté par [EmailJS REST send](https://www.emailjs.com/docs/rest-api/send/). L’acceptation par l’API ne certifie pas la réception dans la boîte du destinataire. Le délai local est de 15 secondes ; une expiration ne permet pas de savoir si le service a déjà accepté la demande. Éviter un nouvel envoi immédiat sans vérifier l’historique du fournisseur.

| Cas | Code interne | Comportement |
|---|---|---|
| Paramètres manquants ou canal désactivé | `unconfigured` | Aucun appel |
| Requête déjà en cours | `busy` | Aucun second appel |
| Tentative dans les 10 secondes ou HTTP 429 | `rate` | Blocage local ou refus fournisseur |
| Champs de base absents ou longueur dépassée | `invalid` | Aucun appel |
| Réponse HTTP autre que 200 et 429 | `rejected` | Échec |
| Annulation après 15 secondes | `timeout` | Échec avec résultat externe incertain |
| Échec réseau ou exception de transport | `network` | Échec |

L’interface affiche un message d’erreur traduit et conserve les saisies en cas d’échec. Elle désactive les boutons pendant l’appel et annonce l’état avec une région accessible. Elle ne réinitialise le formulaire qu’après acceptation. Les messages techniques bruts du fournisseur ne sont pas montrés aux visiteurs.

## Anti-abus : présent et à configurer

- **Présent côté navigateur :** validation, longueurs maximales, honeypot `website`, verrou pendant l’appel, intervalle de 10 secondes entre tentatives dans l’instance de l’adaptateur. Le verrou et la temporisation ne constituent pas une limite serveur persistante ; un navigateur modifié ou une autre page peut les contourner.
- **Fournisseur :** l’API indique une limite d’une requête par seconde ; prévoir le refus 429. Configurer la [liste des origines autorisées](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/) dans EmailJS, avec schéma, nom d’hôte et port éventuel. Définir précisément les origines de production et de recette nécessaires.
- **CAPTCHA non intégré :** EmailJS documente [reCAPTCHA v2](https://www.emailjs.com/docs/user-guide/adding-captcha-verification/), pas hCaptcha dans les sources consultées. Si souhaité avant activation publique, ajouter le widget et son état dans les deux langues, la clé de site publique, la transmission de `g-recaptcha-response`, puis activer la vérification dans chaque modèle et renseigner le secret uniquement dans le tableau de bord EmailJS. Le code livré ne transmet actuellement aucun jeton CAPTCHA : activer cette exigence dans les modèles sans compléter l’interface provoquera un refus.

La configuration d’un compte, les quotas, les conditions commerciales, la délivrabilité et la réception finale restent à vérifier par le propriétaire. Aucune clé de compte ni aucun destinataire n’est fourni dans ce dépôt.
