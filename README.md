# Panorama des Roses

Landing page immobilière responsive basée sur Next.js 16, Tailwind CSS 4 et shadcn/ui, avec API NestJS pour les demandes d’information et l’envoi automatique de la brochure.

## Suivi des QR codes

Les liens suivants sont reconnus :

- `https://www.panorama-des-roses.com/?source=flyers`
- `https://www.panorama-des-roses.com/?source=planmasse`
- `https://www.panorama-des-roses.com/?source=bachepanoramique1`

Le frontend conserve la provenance pendant la session et la joint au
formulaire. Le backend enregistre la demande dans SQLite avant d’envoyer la
brochure.

## Démarrage

1. Renseigner les paramètres SMTP et `ADMIN_API_KEY` dans `backend/env/.env`.
2. Installer les dépendances dans `frontend` et `backend`.
3. Lancer le backend avec `npm run start:dev`.
4. Lancer le frontend avec `npm run dev`.

Le frontend interroge `GET /csrf/token`, puis transmet le formulaire à `POST /inquiries`. Le backend envoie :

- la brochure au prospect ;
- une notification commerciale à `SALES_EMAIL`.

La brochure jointe se trouve dans `backend/assets/panorama-des-roses-brochure.pdf`.

## SEO

- Métadonnées et Open Graph : `frontend/app/layout.tsx`
- Robots : `frontend/app/robots.ts` → `/robots.txt`
- Sitemap : `frontend/app/sitemap.ts` → `/sitemap.xml`

Avant production, renseigner `NEXT_PUBLIC_SITE_URL`, les domaines Traefik et les coordonnées définitives.

## Visuels

Voir `IMAGE-SPECS.md`. Les illustrations actuelles sont volontairement provisoires.
