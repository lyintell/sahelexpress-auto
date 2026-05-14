# Guide de deploiement production

Ce guide deploie l'application en production sur :

- frontend public : `https://sahelexpress-auto.com`
- API backend : `https://api.sahelexpress-auto.com`
- base de donnees et storage : Supabase
- DNS et SSL : Cloudflare

Architecture recommandee :

- dossier `client/` : deploiement sur Vercel
- dossier `server/` : deploiement sur Railway ou Render
- Supabase : base Postgres + bucket Storage `vehicules-images`

## 1. Pre-requis

Avant de commencer, verifier que vous avez :

- le code pousse sur GitHub
- le domaine `sahelexpress-auto.com`
- l'acces a Cloudflare pour gerer le DNS
- un projet Supabase de production
- les secrets Supabase de production
- un compte Vercel
- un compte Railway ou Render

Variables de production necessaires :

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_VEHICLE_IMAGES_BUCKET=vehicules-images`
- `NEXT_PUBLIC_API_URL=https://api.sahelexpress-auto.com/api`
- `CLIENT_APP_URL=https://sahelexpress-auto.com`

## 2. Verifications avant de deployer

Executer localement :

### Frontend

```powershell
cd client
npm install
npm run build
```

### Backend

```powershell
cd server
npm install
npm run check
npm run build
```

Si ces commandes echouent, ne pas deployer avant correction.

## 3. Deployer le frontend sur Vercel

### Creer le projet

1. Aller sur Vercel.
2. Cliquer sur `Add New Project`.
3. Importer le repository GitHub.
4. Dans la configuration du projet :
   - Root Directory : `client`
   - Framework Preset : Next.js
   - Install Command : `npm install`
   - Build Command : `npm run build`
   - Output Directory : laisser la valeur par defaut

### Variables d'environnement Vercel

Ajouter :

```env
NEXT_PUBLIC_API_URL=https://api.sahelexpress-auto.com/api
```

Si vous utilisez plusieurs environnements, ajoutez-la pour :

- Production
- Preview
- Development si besoin

### Domaine sur Vercel

1. Dans le projet Vercel, ouvrir `Settings > Domains`.
2. Ajouter :
   - `sahelexpress-auto.com`
   - `www.sahelexpress-auto.com`
3. Suivre les enregistrements DNS demandes par Vercel.

## 4. Deployer le backend sur Railway ou Render

L'objectif est d'heberger le dossier `server/`.

### Option recommandee : Railway

1. Creer un nouveau projet Railway.
2. Connecter le repository GitHub.
3. Configurer le service avec :
   - Root Directory : `server`
   - Build Command : `npm install && npm run build`
   - Start Command : `npm run start`
4. Railway fournira une URL publique temporaire.

### Option alternative : Render

1. Creer un `Web Service`.
2. Connecter le repository.
3. Configurer :
   - Root Directory : `server`
   - Build Command : `npm install && npm run build`
   - Start Command : `npm run start`

### Variables d'environnement backend

Ajouter dans Railway/Render :

```env
NODE_ENV=production
CLIENT_APP_URL=https://sahelexpress-auto.com
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_VEHICLE_IMAGES_BUCKET=vehicules-images
```

Notes importantes :

- `CLIENT_APP_URL` doit correspondre a l'URL frontend utilisee en production.
- Le backend utilise CORS avec cette valeur exacte.
- Si vous voulez accepter aussi `https://www.sahelexpress-auto.com`, il faudra soit rediriger vers le domaine principal, soit elargir la configuration CORS du backend.

## 5. Configurer Cloudflare

Hypothese recommandee :

- `sahelexpress-auto.com` -> frontend Vercel
- `api.sahelexpress-auto.com` -> backend Railway/Render

### DNS

1. Ajouter le domaine a Cloudflare.
2. Pour le frontend :
   - utiliser les enregistrements recommandes par Vercel
3. Pour l'API :
   - creer `api.sahelexpress-auto.com`
   - le pointer vers l'URL Railway/Render
4. Activer le proxy Cloudflare si l'hebergeur choisi le supporte correctement.

### SSL

Dans Cloudflare :

1. activer `Full (strict)`
2. activer `Always Use HTTPS`
3. forcer la redirection HTTPS

## 6. Configurer Supabase production

Verifier les points suivants dans Supabase :

1. les tables de production existent
2. les policies et permissions sont correctes
3. le bucket `vehicules-images` existe ou peut etre cree automatiquement
4. les colonnes `image`, `image_2`, ..., `image_10` contiennent des URLs publiques, pas du base64

Si vous avez encore des anciennes images base64, executer une fois :

```powershell
cd server
npm run migrate:vehicle-images
```

## 7. Ordre recommande de mise en ligne

1. deployer Supabase production
2. deployer le backend
3. tester l'API avec l'URL temporaire Railway/Render
4. deployer le frontend sur Vercel
5. brancher les domaines dans Cloudflare
6. mettre les vraies variables d'environnement production
7. redeployer backend et frontend si necessaire
8. tester le domaine final

## 8. Checklist de verification apres deploiement

Tester :

- `https://sahelexpress-auto.com`
- `https://sahelexpress-auto.com/inventaire`
- `https://sahelexpress-auto.com/vehicules/1`
- `https://sahelexpress-auto.com/contact`
- `https://sahelexpress-auto.com/mode-editeur`
- `https://api.sahelexpress-auto.com/api/health`

Verifier aussi :

- le chargement des images vehicule
- la connexion editeur
- la creation/modification de vehicule
- l'upload d'image vehicule
- les appels API sans erreur CORS
- HTTPS actif partout

## 9. Variables a copier-coller

### Frontend Vercel

```env
NEXT_PUBLIC_API_URL=https://api.sahelexpress-auto.com/api
```

### Backend Railway/Render

```env
NODE_ENV=production
CLIENT_APP_URL=https://sahelexpress-auto.com
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_VEHICLE_IMAGES_BUCKET=vehicules-images
```

## 10. Points techniques propres a ce projet

- Le frontend public et le mode editeur utilisent `NEXT_PUBLIC_API_URL` pour parler a l'API.
- Le backend Express n'accepte que `CLIENT_APP_URL` en CORS.
- Les images uploades des vehicules sont maintenant stockees dans Supabase Storage, puis enregistrees comme URLs publiques en base.
- Le bucket par defaut est `vehicules-images`.
- Le backend demande `SUPABASE_SERVICE_ROLE_KEY`, donc ne jamais exposer cette cle cote frontend.

## 11. Strategie conseillee pour le domaine

Je conseille :

- domaine principal : `https://sahelexpress-auto.com`
- redirection de `https://www.sahelexpress-auto.com` vers le domaine principal

Ca simplifie :

- le CORS
- le SEO
- la configuration SSL
- les variables d'environnement

## 12. Si quelque chose casse en prod

Verifier en premier :

1. `NEXT_PUBLIC_API_URL`
2. `CLIENT_APP_URL`
3. les logs du backend Railway/Render
4. les logs de build Vercel
5. les variables Supabase
6. le DNS Cloudflare
7. le certificat SSL

## 13. Recommandation finale

Pour ce projet, la combinaison la plus simple est :

- Vercel pour `client/`
- Railway pour `server/`
- Cloudflare pour le domaine
- Supabase pour DB + Storage

C'est la voie la plus rapide pour passer de l'etat actuel a `sahelexpress-auto.com` en production sans changer l'architecture.
