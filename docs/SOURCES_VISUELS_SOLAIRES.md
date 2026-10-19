# Sources des visuels et identité solaire

Mise à jour : 17 octobre 2026. Ce document est destiné au propriétaire et à la maintenance ; il n’est pas copié dans le site public.

## Recherche et statut

Lors de la première adaptation de palette, aucun logo officiel ni photographie authentique de chantier autorisée n’était fourni. Depuis, le propriétaire a transmis son logo officiel et confirmé le pompage solaire : voir l’actualisation ci-dessous. Les captures du portfolio servent exclusivement de référence d’interface ; aucune photo personnelle, localisation, identité ou image de projet du portfolio n’est réutilisée.

Le fichier `data/projects.mjs` reste vide et inchangé. Les images ci-dessous ne constituent aucune preuve de travaux réalisés par AJ ENERGIES. Les exemples de configurations sont enregistrés séparément dans `data/illustrations.mjs`, identifiés par un titre et une légende explicites en français et en arabe. Aucun client, lieu précis, puissance, date de chantier ou résultat n’est attribué à ces scènes fictives.

## Logo

**Logo actuellement utilisé :** fichier officiel transmis par le propriétaire, `704898658_122138798013133892_8769785382068832190_n.jpg`. Copie source identique dans `assets/images/logo-officiel-source.jpg` (1254 × 1254 px, 119 336 octets) ; exports WebP 160 et 320 px (8 222 et 22 218 octets), favicon PNG 128 px. Image complète, proportions et couleurs conservées, sans redessin. Usage fourni dans le cadre de cette intégration ; aucun logo tiers récupéré. Le fond du JPEG est conservé, sans transparence artificielle. Voir `docs/EMAIL_LOGO_POMPAGE.md`.

**Historique, plus utilisé par l’interface :** `assets/logo-aj-energies.svg` était une proposition originale dessinée en SVG pour ce site : soleil jaune et panneau bleu. `assets/favicon.svg` reprenait ce symbole. Ces fichiers sont conservés comme sources antérieures.

Source : dessin vectoriel réalisé directement dans le projet le 17 octobre 2026. Aucun logo de tiers, police intégrée, image matricielle ou ressource distante dans le SVG. Ce n’est pas un logo officiel fourni ou approuvé par l’entreprise. Cette proposition et son utilisation de marque doivent être validées par le propriétaire ; cette précision n’est pas affichée dans l’interface publique.

## Images, provenance et droits

| Fichiers dans `assets/images/` | Source / statut | Dimensions WebP et poids | Usage |
|---|---|---|---|
| `solar-source.png`, `solar-768.webp`, `solar-1536.webp` | Illustration générée par l’outil imagegen intégré le 15/10/2026 ; déjà présente | 768 × 432 : 77 096 octets ; 1536 × 864 : 225 028 octets | Accueil et exemple résidentiel |
| `commercial-source.png`, `commercial-768.webp`, `commercial-1536.webp` | Illustration générée par l’outil imagegen intégré le 17/10/2026 | 768 × 432 : 70 084 octets ; 1536 × 864 : 222 136 octets | À propos et exemple commercial |
| `industrial-source.png`, `industrial-768.webp`, `industrial-1536.webp` | Illustration générée par l’outil imagegen intégré le 17/10/2026 | 768 × 432 : 74 354 octets ; 1536 × 864 : 237 058 octets | Exemple industriel |
| `equipment-source.png`, `equipment-768.webp`, `equipment-1536.webp` | Illustration générée par l’outil imagegen intégré le 17/10/2026 | 768 × 432 : 44 020 octets ; 1536 × 864 : 115 540 octets | Exemple de cellules, cadre et fixation |
| `pumping-source.png`, `pumping-768.webp`, `pumping-1536.webp` | Illustration générée par l’outil imagegen intégré le 17/10/2026 | 768 × 432 : 111 902 octets ; 1536 × 864 : 346 324 octets | Section Pompage solaire uniquement, sans attribution à un chantier réel |

**Statut commun : illustrations IA, aucune réalisation authentifiée.** Aucun téléchargement de photographie d’un installateur ou d’une photothèque ; aucune licence de photographie tierce revendiquée. Les conditions d’utilisation du service de génération restent applicables ; aucune exclusivité, titularité juridique ou validation de marque n’est affirmée ici. Les sources PNG sont conservées dans le projet, mais seuls les WebP optimisés sont exportés dans `dist/`. Les originaux générés sont aussi conservés à leur emplacement d’origine dans le dossier de génération Codex.

Les trois nouveaux PNG sources mesurent 1672 × 941 px. Export WebP par Pillow, qualité 82, ratio 16:9, redimensionnement Lanczos sans étirement. Pas de filtre assombrissant. Les images ont été inspectées : panneaux, contexte architectural, absence de texte et de marque. Ce ne sont pas des plans techniques ni des recommandations d’installation.

Les textes alternatifs et titres des nouveaux exemples sont bilingues dans `data/illustrations.mjs`. Légende publique : « Illustration — exemple de configuration photovoltaïque » / « صورة توضيحية — مثال لتجهيز كهروضوئي ». Les images secondaires ont `loading="lazy"` ; le visuel principal conserve sa priorité élevée. Dimensions explicites, `srcset`, fichiers locaux et recadrage `object-fit: cover` au ratio existant.

## Prompts de génération

Mode : outil intégré imagegen, sans API/CLI de remplacement. Le prompt du visuel résidentiel historique est conservé dans `docs/SOURCES_CONTENUS.md`.

Le prompt complet du nouveau visuel de pompage est conservé dans `docs/EMAIL_LOGO_POMPAGE.md`. Sa légende publique est « Illustration d’un système de pompage solaire. » / « صورة توضيحية لنظام ضخّ مياه بالطاقة الشمسية. ». Export WebP qualité 84, source de 1672 × 941 px conservée, aucun client, lieu ou débit attribué.

### commercial

```text
Use case: photorealistic-natural. Asset type: illustrative photovoltaic website photograph, landscape 16:9. Primary request: A modest Mediterranean commercial building with a flat roof covered by orderly blue photovoltaic modules, elevated three-quarter architectural view. No business signs, no people. Style: realistic architectural/editorial photography, natural Mediterranean daylight, calm pale blue sky, consistent neutral white balance, crisp physically plausible panels and architecture. This is an illustrative fictional configuration, never an actual company project. No text, labels, logos, identifiable address, watermark, exaggerated effects or distorted geometry.
```

### industrial

```text
Use case: photorealistic-natural. Asset type: illustrative photovoltaic website photograph, landscape 16:9. Primary request: An industrial warehouse roof with orderly rows of blue photovoltaic panels, elevated oblique view showing the building context. No logos, no people. Style: realistic architectural/editorial photography, natural Mediterranean daylight, calm pale blue sky, consistent neutral white balance, crisp physically plausible panels and architecture. This is an illustrative fictional configuration, never an actual company project. No text, labels, logos, identifiable address, watermark, exaggerated effects or distorted geometry.
```

### equipment

```text
Use case: photorealistic-natural. Asset type: illustrative photovoltaic website photograph, landscape 16:9. Primary request: Close-up of clean blue photovoltaic modules with realistic visible cells, silver aluminium frame and a technically plausible mounting rail. No people. Style: realistic architectural/editorial photography, natural Mediterranean daylight, calm pale blue sky, consistent neutral white balance, crisp physically plausible panels and architecture. This is an illustrative fictional configuration, never an actual company project. No text, labels, logos, identifiable address, watermark, exaggerated effects or distorted geometry.
```
