# Sahel Express Auto Server

Backend Node/TypeScript minimal pour connecter l'application a Supabase.

## Prerequis

- Node.js 20+
- Un projet Supabase cree
- Les variables de `.env.example` renseignees dans `.env`

## Installation

```bash
npm install
cp .env.example .env
```

## Scripts

- `npm run dev` : serveur local en mode watch
- `npm run build` : compilation TypeScript vers `dist/`
- `npm run start` : execution du build
- `npm run check` : verification TypeScript sans build

## Structure

- `src/config/env.ts` : validation des variables d'environnement
- `src/lib/supabase.ts` : clients Supabase anon et service-role
- `src/routes/health.ts` : route de sante
- `src/routes/public.ts` : routes publiques catalogue / contenu
- `src/routes/admin.ts` : routes admin / profil
- `src/types/database.ts` : types metier alignes sur `DB.md`

## Notes

- Le frontend actuel utilise encore le `localStorage`.
- Ce backend est pret a recevoir les identifiants Supabase et a remplacer progressivement le stockage local.
- La colonne `mot_de_passe_hash` dans SQL est volontairement separee du frontend demo. En production, utilisez Supabase Auth ou un hash serveur, jamais du texte brut.
