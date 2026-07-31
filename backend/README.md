# Backend Panorama des Roses

API NestJS pour enregistrer les demandes d’information, attribuer leur
provenance et envoyer automatiquement la brochure.

## Provenances reconnues

- `flyers`
- `planmasse`
- `bachepanoramique1`
- `direct` pour une visite sans provenance reconnue

Toute autre valeur est rejetée par l’API. Le frontend normalise automatiquement
les paramètres inconnus vers `direct`.

## Configuration

Copier les variables de `env/.env.example` dans les fichiers d’environnement
appropriés. La variable `ADMIN_API_KEY` protège les statistiques.

## Base de données

La base SQLite est configurée avec `DATABASE_URL`. Les migrations sont
appliquées automatiquement au démarrage en développement et en production.

Commandes utiles :

```bash
npm run db:migrate
npm run db:studio
```

## API

### Enregistrer une demande

```http
POST /inquiries
Content-Type: application/json
X-CSRF-TOKEN: <token>
```

Le backend :

1. enregistre d’abord la demande avec `emailStatus=pending` ;
2. envoie la brochure au prospect et la notification commerciale ;
3. marque l’envoi `sent`, ou `failed` en conservant la demande.

### Consulter les statistiques

```bash
curl http://localhost:3000/inquiries/stats \
  -H "x-admin-key: VOTRE_ADMIN_API_KEY"
```

Exemple de réponse :

```json
{
  "total": 12,
  "sources": {
    "flyers": 5,
    "planmasse": 3,
    "bachepanoramique1": 2,
    "direct": 2
  },
  "emailFailures": 0
}
```
