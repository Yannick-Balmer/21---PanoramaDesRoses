# Spécifications des visuels

Les fichiers SVG présents dans `frontend/public/images/` sont des visuels provisoires. Conserver les mêmes noms lors du remplacement, ou adapter les chemins dans les composants.

| Fichier | Usage | Ratio | Dimensions conseillées | Format | Poids cible |
|---|---|---:|---:|---|---:|
| `hero-placeholder` | Hero plein écran et partage social | 3:2 | 2400 × 1600 px | AVIF/WebP | 300–550 Ko |
| `heritage-placeholder` | Présentation bâtiment Héritage | 4:3 | 1600 × 1200 px | AVIF/WebP | 180–350 Ko |
| `horizon-placeholder` | Présentation bâtiment Horizon | 4:3 | 1600 × 1200 px | AVIF/WebP | 180–350 Ko |
| `location-placeholder` | Paysage / situation | 4:3 | 1600 × 1200 px | AVIF/WebP | 180–350 Ko |
| `og-image` (optionnel) | Open Graph dédiée | 1.91:1 | 1200 × 630 px | JPEG/WebP | < 300 Ko |
| Logo | Header, footer, favicon | vectoriel | SVG avec `viewBox` | SVG | < 80 Ko |

## Recommandations

- Exporter en sRGB, sans métadonnées inutiles.
- Garder le sujet principal dans les 60 % centraux du hero pour le recadrage mobile.
- Fournir les images à la taille indiquée : Next.js génère automatiquement les variantes responsives.
- Éviter les textes intégrés dans les photos.
- Pour les JPEG de secours : qualité 78 à 84.
