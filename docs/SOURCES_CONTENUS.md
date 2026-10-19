# Sources et provenance des contenus

Actualisation du 17 octobre 2026 : le propriétaire a fourni le logo officiel, confirmé `ajenergiescontact@gmail.com` et le service d’installation de pompage solaire photovoltaïque. Ces informations remplacent les réserves historiques sur l’absence de logo et la confirmation du courriel. Voir `docs/EMAIL_LOGO_POMPAGE.md` et `docs/SOURCES_VISUELS_SOLAIRES.md` pour l’état actuel, les sources du nouveau visuel illustratif et les vérifications. Les sources datées ci-dessous restent des traces de la recherche initiale.

Recherche effectuée le 15 octobre 2026. Le site est une création indépendante : aucun code, média, nom de client ou contenu de l’ancien portfolio n’est repris. Les contenus français et arabe sont des textes de présentation rédigés pour ce projet ; ils doivent être validés par le propriétaire avant publication.

## Informations de l’entreprise

| Information | Provenance | Utilisation et limite |
|---|---|---|
| Nom AJ ENERGIES, implantation à Msaken, Rue Youssef Temimi, téléphone +216 98 289 700 | Informations fournies pour le projet, recoupées avec les listes officielles ci-dessous | Coordonnées utilisées dans le site ; position GPS et localisation de l’entrée non confirmées. |
| Activité photovoltaïque | Listes officielles STEG et ANME | Les textes décrivent les services prévus par le brief. Les prestations et leur périmètre contractuel restent à valider par l’entreprise. |
| Lien Facebook | Lien fourni : <https://www.facebook.com/share/1BhEAjcB5W/> | Page inaccessible pendant la recherche. Aucun contenu, horaire, témoignage ou média n’a été extrait. Le lien est conservé comme moyen d’accès externe fourni. |
| WhatsApp | Numéro fourni, lien construit vers le service WhatsApp | Aucun message envoyé ; disponibilité du compte et réception non vérifiées. |

### Recoupement officiel

- [Liste STEG des sociétés installatrices éligibles](https://www.steg.com.tn/fr/system/files/documents/Societe_eligibles_prosol_elec_3.pdf) : titre du fichier source « STEG 18-03-2026.xlsx », date de pied de page **19/03/2026**, page **15/16**, ligne « Aj Energies ». La ligne indique Rue Youssef Temimi 4070 Msaken, Sousse et le téléphone 98289700. Elle comporte aussi un numéro d’agrément et une date de validité. Le site n’affiche aucune revendication d’agrément.
- [Liste ANME des installateurs photovoltaïques raccordés au réseau BT](https://www.anme.tn/sites/default/files/2025-12/liste-des-societes-installatrices-eligibles-a-la-realisation-des-installations-pv-raccordees-au-reseau-bt.pdf) : document daté **30/12/2025**, page **10/10**, ligne « Aj Energies ». Coordonnées concordantes. Il s’agit d’une liste datée, pas d’une vérification de la situation de l’entreprise au jour de publication du futur site.

Ces sources mentionnent une **adresse e-mail candidate**. Elle n’est ni affichée dans le site ni configurée comme destinataire : confirmation du propriétaire nécessaire avant tout usage. Les sources ne prouvent pas les horaires, l’ancienneté, les réalisations, les effectifs, les prix, les garanties contractuelles ou les marques partenaires.

## Images et identité visuelle

L’illustration solaire principale est **générée par IA avec l’outil intégré**. Les versions WebP prévues sont `assets/images/solar-1536.webp` et `assets/images/solar-768.webp`, pour un chargement adapté aux écrans. Cette image est une illustration ; elle ne représente pas une réalisation, un chantier ou un client identifié d’AJ ENERGIES. Elle ne doit pas être présentée comme preuve d’une installation livrée.

La marque typographique, les pictogrammes et la composition graphique sont créés pour ce site. Ils doivent être remplacés ou approuvés si l’entreprise dispose d’un logo officiel. Aucun logo de fabricant ou label non confirmé n’est utilisé.

| Asset local | Dimensions | Poids |
|---|---|---|
| `assets/images/solar-source.png` | 1672 × 941 | 2 714 084 octets ; source de travail non copiée dans dist |
| `assets/images/solar-768.webp` | 768 × 432 | 77 096 octets |
| `assets/images/solar-1536.webp` | 1536 × 864 | 225 028 octets |

Génération avec l'outil `image_gen` intégré ; redimensionnement et conversion WebP par Pillow, qualité 84. Le visuel a été inspecté avant intégration. Prompt final :

```text
Use case: photorealistic-natural
Asset type: editorial website hero illustration, horizontal 16:9 composition
Primary request: A premium natural architectural photograph of clean dark blue photovoltaic solar panels neatly mounted on the terracotta tiled roof of a modest Mediterranean building. Warm late afternoon sunlight, soft blue sky, distant understated Mediterranean landscape. Crisp realistic photovoltaic cell details and physically plausible mounting, refined warm neutral palette and calm trustworthy mood.
Composition/framing: wide landscape photograph, roof and panels across the lower two thirds, uncluttered sky above, slightly elevated oblique view with convincing architectural perspective, sufficient surrounding context for responsive crops.
Constraints: this is an illustrative fictional scene, not a documented project. No people, no recognisable address or landmark, no logos, no branding, no text, no watermark, no exaggerated sun flare, no distorted panels.
```

## Contenus volontairement non inventés

Aucun avis client, compteur de projets, année de création, rendement garanti, économie chiffrée, prix, subvention applicable, partenariat ou certification commerciale n’est affirmé sans preuve fournie. La page des réalisations doit accueillir uniquement des projets documentés et des photographies dont l’entreprise autorise l’usage. Les descriptions de processus et la FAQ sont des explications générales à faire valider, pas des engagements techniques ou financiers individualisés.

## Documentation technique consultée

- [API REST EmailJS — send](https://www.emailjs.com/docs/rest-api/send/)
- [Protection anti-abus EmailJS](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/)
- [Liste des origines autorisées](https://www.emailjs.com/docs/faq/can-i-add-my-domain-to-allowlist/)
- [Vérification reCAPTCHA v2](https://www.emailjs.com/docs/user-guide/adding-captcha-verification/)

L’intégration e-mail utilise directement REST avec `fetch`, sans SDK EmailJS ni script CDN. Aucun envoi, appel, message, publication ou test d’un service de transmission n’a été effectué pour cette recherche.
