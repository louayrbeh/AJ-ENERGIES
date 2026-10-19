# Polices locales : sources, licences et intégration

Fichiers obtenus le **15 octobre 2026**, directement depuis Google Fonts (`fonts.googleapis.com` → `fonts.gstatic.com`). Aucune police n’a été récupérée depuis le portfolio. Les polices sont auto-hébergeables ; leur usage ne nécessite aucun abonnement ni appel Google Fonts dans les pages.

## Inventaire

| Fichier dans `assets/fonts/` | Famille / style | Graisse CSS | Sous-ensemble | Taille exacte | Source binaire officielle |
|---|---|---|---|---:|---|
| `poppins-latin-400.woff2` | Poppins normal | 400 | Latin | 7 884 octets | [Google Fonts](https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJfecg.woff2) |
| `poppins-latin-500.woff2` | Poppins normal | 500 | Latin | 7 748 octets | [Google Fonts](https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) |
| `poppins-latin-600.woff2` | Poppins normal | 600 | Latin | 8 000 octets | [Google Fonts](https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) |
| `tajawal-arabic-400.woff2` | Tajawal normal | 400 | Arabe | 8 932 octets | [Google Fonts](https://fonts.gstatic.com/s/tajawal/v12/Iura6YBj_oCad4k1nzSBC45I.woff2) |
| `tajawal-arabic-700.woff2` | Tajawal normal | 700 | Arabe | 9 024 octets | [Google Fonts](https://fonts.gstatic.com/s/tajawal/v12/Iurf6YBj_oCad4k1l4qkHrRpiYlJ.woff2) |

Total WOFF2 : **41 588 octets**, soit environ **40,6 Kio**. Licences comprises : **50 437 octets**, environ **49,3 Kio**. Les cinq fichiers sont statiques ; aucun axe variable n’est déclaré. La graisse 500 de Poppins est conservée pour les menus et libellés, avec un surcoût inférieur à 8 Ko.

Les URL de téléchargement proviennent de la [feuille Google Fonts demandant ces deux familles et graisses](https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Tajawal:wght@400;700&display=swap). Google Fonts fournit ici des versions de diffusion `v24` pour Poppins et `v12` pour Tajawal ; ces segments d’URL ne sont pas une déclaration de version sémantique de la famille.

## Licences conservées

- `assets/fonts/Poppins-OFL.txt` : licence **SIL Open Font License 1.1**, copyright 2020 The Poppins Project Authors. [Source officielle Google Fonts](https://github.com/google/fonts/blob/main/ofl/poppins/OFL.txt).
- `assets/fonts/Tajawal-OFL.txt` : licence **SIL Open Font License 1.1**, copyright 2018 Boutros International. [Source officielle Google Fonts](https://github.com/google/fonts/blob/main/ofl/tajawal/OFL.txt).

Conserver les deux fichiers de licence avec les polices lors de la distribution et du déploiement. Les fichiers téléchargés n’ont pas été modifiés ou réencodés. Les copies originales et l’intégralité de leurs conditions font référence.

## Déclarations CSS suggérées

Exemple pour `assets/styles.css` : chemins relatifs à la feuille, compatibles avec un déploiement en sous-dossier. Ces déclarations sont proposées uniquement dans cette documentation ; l’agent responsable de la refonte les intègre dans le CSS et assure la copie des polices vers `dist/assets/fonts/`.

```css
@font-face {
  font-family: "Poppins";
  src: url("./fonts/poppins-latin-400.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Poppins";
  src: url("./fonts/poppins-latin-500.woff2") format("woff2");
  font-style: normal;
  font-weight: 500;
  font-display: swap;
}
@font-face {
  font-family: "Poppins";
  src: url("./fonts/poppins-latin-600.woff2") format("woff2");
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}
@font-face {
  font-family: "Tajawal";
  src: url("./fonts/tajawal-arabic-400.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: "Tajawal";
  src: url("./fonts/tajawal-arabic-700.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}
html { font-family: "Poppins", Arial, sans-serif; }
html[lang="ar"] { font-family: "Tajawal", "Poppins", Arial, sans-serif; }
html[lang="fr"] :is(h1, h2, h3, strong) { font-weight: 600; }
html[lang="ar"] :is(h1, h2, h3, strong) { font-weight: 700; }
button, input, select, textarea { font: inherit; }
```

Poppins Latin couvre les caractères français usuels, dont les accents et `œ`. Le fichier Tajawal est un sous-ensemble arabe : les lettres latines d’un texte mixte utilisent la famille suivante. Aucun italique n’est fourni. Employer les graisses disponibles pour éviter une graisse ou une inclinaison synthétique. Le CSS peut conserver une police système si le chargement échoue grâce à `font-display: swap` et à la pile de secours.

## Vérification et limites

Les cinq signatures binaires ont été vérifiées : **`wOF2`**. Les tailles et empreintes SHA-256 ont été calculées après téléchargement ; les deux licences contiennent leur copyright et l’identification OFL 1.1. Le rendu typographique, la couverture exacte de tous les caractères du contenu, les retours à la ligne et la lecture arabe doivent être vérifiés lors du contrôle visuel global du site. Aucune modification du CSS, du build ou de la configuration n’a été faite pour cette tâche.

## Ajout pour la transposition fidèle du portfolio

Le 15 octobre 2026, la graisse Poppins **300 Latin** a été ajoutée : `assets/fonts/poppins-latin-300.woff2`, **7 840 octets**, source officielle [Google Fonts](https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLDz8Z1xlFQ.woff2), sous la même licence OFL conservée. Les quatre graisses françaises 300/400/500/600 sont déclarées en `@font-face` et auto-hébergées. Aucun identifiant, média ou contenu personnel du portfolio n’a été importé.
