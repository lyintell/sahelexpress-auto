# AI DB Instructions

## Objectif

Connecter Sahel Express Auto a Supabase avec un backend dans `server/`, puis remplacer progressivement le `localStorage` du frontend par des appels API securises.

## 1. Creer le projet Supabase

1. Creer un nouveau projet Supabase.
2. Copier les valeurs suivantes depuis `Project Settings > API` :
   - `Project URL`
   - `anon public key`
   - `service_role secret key`
3. Ouvrir l'editeur SQL de Supabase.
4. Copier-coller le contenu de [c:/Users/oumar/Documents/PROJECTS/MY_APPS/WEBSITES/sahelexpress-auto/DB_SQL.md](c:/Users/oumar/Documents/PROJECTS/MY_APPS/WEBSITES/sahelexpress-auto/DB_SQL.md).
5. Executer le script SQL.

## 2. Configurer le backend dans `server/`

1. Aller dans `c:/Users/oumar/Documents/PROJECTS/MY_APPS/WEBSITES/server`.
2. Executer `npm install`.
3. Copier `.env.example` vers `.env`.
4. Renseigner :
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CLIENT_APP_URL`
5. Lancer `npm run dev`.
6. Verifier `GET http://localhost:4000/api/health`.

## 3. Ordre de migration recommande

1. Brancher les lectures publiques du frontend sur `GET /api/public/bootstrap`.
2. Brancher la connexion admin pour authentifier uniquement un utilisateur deja present dans `users`.
   - Creation explicite possible via la page cachee frontend `/lyintell-cree-utilisateur`
3. Brancher `Mon profil` sur `GET /api/admin/users/:id` et `PATCH /api/admin/users/:id`.
4. Ajouter ensuite les routes CRUD pour `marques`, `modeles`, `vehicules`, ainsi que les routes de gestion pour `hero_content` et `contact_details`.
5. Quand tout est stable, retirer l'usage du `localStorage` pour ces donnees.

## 4. Contrat backend/frontend recommande

### Public

- `GET /api/public/bootstrap`
  - Retourne `hero`, `contact`, `marques`, `modeles`, `vehicules`

### Admin

- `POST /api/admin/users`
- `GET /api/admin/users/:id`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/marques`
- `GET /api/admin/marques/:id`
- `POST /api/admin/marques`
- `PATCH /api/admin/marques/:id`
- `DELETE /api/admin/marques/:id`
- `GET /api/admin/modeles`
- `GET /api/admin/modeles/:id`
- `POST /api/admin/modeles`
- `PATCH /api/admin/modeles/:id`
- `DELETE /api/admin/modeles/:id`
- `GET /api/admin/vehicules`
- `GET /api/admin/vehicules/:id`
- `POST /api/admin/vehicules`
- `PATCH /api/admin/vehicules/:id`
- `DELETE /api/admin/vehicules/:id`
- `GET /api/admin/hero-content`
- `POST /api/admin/hero-content`
- `PATCH /api/admin/hero-content`
- `DELETE /api/admin/hero-content`
- `GET /api/admin/contact-details`
- `POST /api/admin/contact-details`
- `PATCH /api/admin/contact-details`
- `DELETE /api/admin/contact-details`

## 5. Recommandations de securite

1. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` dans le frontend.
2. Garder la `service_role` uniquement dans le backend `server/`.
3. Eviter de stocker un mot de passe en clair. Idealement :
   - soit utiliser Supabase Auth
   - soit stocker uniquement un hash genere par le backend
4. Si Supabase Auth est adopte ensuite, garder `public.users` pour les metadonnees metier et lier au compte Auth.

## 6. Configuration domaine avec Cloudflare

Hypothese recommandee :
- frontend sur `sahelexpress-auto.com`
- API backend sur `api.sahelexpress-auto.com`

### DNS Cloudflare

1. Ajouter le domaine a Cloudflare.
2. Pointer le frontend vers son hebergeur :
   - si Vercel : CNAME ou enregistrements recommandes par Vercel
   - si autre hebergeur : suivre ses instructions DNS
3. Creer un sous-domaine API :
   - `api.sahelexpress-auto.com`
   - le pointer vers l'hebergement du dossier `server/`
4. Activer le proxy Cloudflare si compatible avec l'hebergeur choisi.

### SSL

1. Dans Cloudflare, activer `Full (strict)` quand le certificat d'origine existe.
2. Forcer HTTPS.
3. Activer `Always Use HTTPS`.

### CORS backend

Mettre `CLIENT_APP_URL=https://sahelexpress-auto.com` en production.

## 7. Variables d'environnement frontend a ajouter ensuite

Dans le frontend, ajouter plus tard un fichier `.env.local` avec par exemple :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Puis en production :

```env
NEXT_PUBLIC_API_URL=https://api.sahelexpress-auto.com/api
```

## 8. Etapes quand vous me donnerez les credentials

Quand le projet Supabase sera cree, fournissez :
1. `SUPABASE_URL`
2. `SUPABASE_ANON_KEY`
3. `SUPABASE_SERVICE_ROLE_KEY`
4. l'URL choisie pour heberger `server/`

Avec ces infos, je pourrai :
1. brancher les variables d'environnement
2. finaliser les routes CRUD
3. connecter le frontend public
4. connecter le mode admin
5. preparer la configuration domaine finale avec Cloudflare
