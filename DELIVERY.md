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

1. Le frontend lit `source` dans l’URL et conserve la provenance pendant la session.
2. Il récupère un jeton CSRF auprès de `GET /csrf/token`.
3. Il transmet les données validées et la provenance à `POST /inquiries`.
4. Le backend enregistre d’abord la demande dans SQLite.
5. Le backend envoie simultanément :
   - la brochure PDF au prospect ;
   - une notification à l’adresse commerciale.
6. Il enregistre l’état de l’envoi (`sent` ou `failed`).
7. Un champ invisible bloque les soumissions automatisées simples.

## Provenances et statistiques

Les provenances suivies sont `flyers`, `planmasse`,
`bachepanoramique1` et `direct`.

Les statistiques sont exposées par `GET /inquiries/stats`, protégé par
l’en-tête `x-admin-key`.

## À configurer avant la mise en production

- SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`.
- Expéditeur et destinataire : `MAIL_FROM`, `SALES_EMAIL`.
- Accès aux statistiques : `ADMIN_API_KEY`.
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
