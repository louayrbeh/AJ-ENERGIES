# Choix techniques et correspondance avec le rapport

Le seul document de référence utilisé est `COMPETENCES_PROJET.md`. Aucun fichier applicatif du portfolio n'est copié ou réaudité. Tous les composants et contenus du nouveau site sont écrits pour AJ ENERGIES.

| Approche du rapport | Mise en œuvre nouvelle | Nature et correction |
|---|---|---|
| HTML/CSS/JS natifs | Générateur Node sans dépendances, export HTML multipage, modules JS | Approche reprise, code entièrement nouveau ; HTML directement indexable |
| Variables CSS, Grid, Flexbox | Système « Trame solaire », grilles fluides, ruptures de contenu à 600/800/1024/1320 px et adaptation mesurée du header | Approche reprise et affinée ; mobile-first, texte long, agrandissement et RTL en propriétés logiques |
| Navigation par classes | Liens vers de vraies pages ; menu disclosure accessible | Réécriture ; aucune correspondance fondée sur le texte traduit |
| Événements DOM | Contrôles avec identifiants techniques et modules séparés | Approche reprise, sans dépendance framework |
| Cartes et filtres | Données de réalisations séparées ; filtres si plusieurs catégories réelles | Ajout conditionnel ; galerie vide tant que les contenus autorisés manquent |
| Modales | Un seul `dialog` natif pour les futures images | Réécriture : Échap natif, focus modal et retour au bouton ; non affiché en l'absence de projets |
| Scroll-snap | Non nécessaire aux contenus actuels | Non repris : grilles lisibles, aucun carrousel automatique |
| Animations et lazy loading | Transitions discrètes, préférence mouvement réduit, hero prioritaire et photos secondaires différées | Approche adaptée ; deux tailles WebP et dimensions déclarées |
| Google Maps iframe | Configuration séparée, titre traduit, largeur fluide, lazy loading | Adresse et recherche externe actives ; iframe générale de Msaken avec lieu exact à confirmer, URL centralisée et remplaçable |
| EmailJS navigateur | Adaptateur REST officiel injectable, sans SDK tiers | Réécriture : `submit`, validation, await/try/catch/finally, verrou, délai et retour accessible |
| Formulaire contact | Contact court et devis photovoltaïque traduits | Ajout : champs facultatifs, périodes explicites, besoin présélectionné, maintenance adaptée |
| Liens `tel:` et sociaux | Coordonnées centralisées, WhatsApp en langue active | Nouveau contenu propriétaire, destinations cohérentes |
| Pas de langues/SEO structuré | Dictionnaires FR/AR, routes équivalentes, RTL, SEO conditionnel au domaine réel | Développé de zéro |
| Pas de tests | Tests adaptateur, contrôles export et Playwright | Ajout ; simulations distinctes d'un service réellement testé |

## Décisions d'architecture

Neuf types de pages par langue, plus accueil et 404 racine : 20 documents générés. Les slugs communs simplifient les correspondances. Le français est la langue par défaut. La saisie personnelle n'est jamais transmise automatiquement lors d'un changement de langue.

Le JS ne sert pas à injecter le contenu principal. Sans JS, la navigation et les liens de contact restent visibles ; les boutons des formulaires sont désactivés et un message donne l'alternative. Les FAQ utilisent `details/summary`, sans script inutile.

La palette utilise un bleu marine dominant, des surfaces claires, un accent jaune et un vert réservé au contact. Les polices système évitent une requête tierce et fournissent une famille arabe lisible. Les pictogrammes sont des SVG locaux intégrés ; le logotype est provisoire.

Le bouton WhatsApp occupe un rail en flux normal sur les largeurs courantes. Sur les très grands écrans (1700 px et plus), il devient fixe dans la marge extérieure du contenu. Il est absent des pages devis/contact afin de ne masquer aucun champ, et son décalage tient compte de `safe-area-inset-bottom`. La géométrie de cette marge est contrôlée par les tests de refonte.

La validation cliente et le honeypot ne sont pas des protections serveur. Un service de contact actif exige les protections du fournisseur. Le site ne crée ni base, ni session, ni cookie, ni outil analytique. La politique de confidentialité explique le transfert par clic vers WhatsApp et ses limites.

Le build produit une CSP adaptée : réseau bloqué par défaut, EmailJS autorisé uniquement si activé et frame Google uniquement si intégration activée (distinct de la vérification du lieu). Les scripts JSON intégrés sont couverts par des empreintes SHA-256. Ces en-têtes doivent être appliqués et revérifiés par l'hébergeur réel.

Sans domaine, pas de canonique fictive et pas d'URL absolue de sitemap. Avec `SITE_URL`, les pages hors 404 deviennent indexables et reçoivent les métadonnées absolues. Cette configuration reste une étape explicite avant publication.
