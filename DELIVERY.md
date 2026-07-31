# Livraison — Panorama des Roses

## Composants frontend

- `Header` : navigation par ancres et menu mobile.
- `Hero` : promesse, CTA et chiffres clés.
- `Project` : présentation et arguments du programme.
- `Buildings` : bâtiments Héritage et Horizon.
- `Lifestyle` : prestations principales.
- `Location` : situation géographique et temps de trajet.
- `Contact` : formulaire relié à l’API NestJS.
- `Footer` : identité et retour en haut.

## Parcours du formulaire

1. Le frontend récupère un jeton CSRF auprès de `GET /csrf/token`.
2. Il transmet les données validées à `POST /inquiries`.
3. Le backend envoie simultanément :
   - la brochure PDF au prospect ;
   - une notification à l’adresse commerciale.
4. Un champ invisible bloque les soumissions automatisées simples.

## À configurer avant la mise en production

- SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`.
- Expéditeur et destinataire : `MAIL_FROM`, `SALES_EMAIL`.
- Domaine public : `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BACK_END`.
- Coordonnées finales dans `frontend/components/sections/contact.tsx`.
- Domaines Traefik dans `docker-compose.prod.yml`.
- Images définitives selon `IMAGE-SPECS.md`.

## Vérifications effectuées

- TypeScript frontend : validé avec `tsc --noEmit`.
- ESLint des fichiers immobiliers : validé.
- Compilation NestJS : validée.
- Génération Prisma de l’architecture fournie : validée.

Le démarrage Next.js natif n’a pas pu être prévisualisé dans le conteneur de travail à cause d’une restriction système sur l’énumération des interfaces réseau. Cette contrainte est propre à l’environnement de vérification ; les contrôles TypeScript et ESLint sont passés.
