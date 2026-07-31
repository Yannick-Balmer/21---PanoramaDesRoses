# Panorama des Roses

Landing page immobilière responsive basée sur Next.js 16, Tailwind CSS 4 et shadcn/ui, avec API NestJS pour les demandes d’information et l’envoi automatique de la brochure.

## Démarrage

1. Renseigner les paramètres SMTP dans `backend/env/.env`.
2. Lancer `docker compose -f docker-compose.dev.yml up --build`.
3. Ouvrir `http://localhost:5556`.

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
