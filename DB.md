**Stockage actuel**

- Toute l'application frontend repose actuellement sur le `localStorage` du navigateur.
- Clé principale des données métier : `sahel-editor-data`
- Clé de session éditeur : `sahel-editor-session`

**Structure de `sahel-editor-data`**

- `users`: tableau d'utilisateurs
- `marques`: tableau de marques
- `modeles`: tableau de modèles
- `vehicules`: tableau de véhicules
- `hero`: objet de contenu de l'en-tête d'accueil
- `contact`: objet de coordonnées

**Session éditeur**

- `userId` : référence vers `users.id`
- `openedAt`

**Utilisateur**

- `id`
- `nom`
- `tel`
- `email`
- `type_utilisateur` : `Admin` | `Editeur`
- `mot_de_passe` : actuellement stocké en mode démo dans `sahel-editor-data.users`

Note : l'utilisateur n'est pas encore géré par un CRUD complet comme les autres entités, mais le mode admin expose désormais un écran `Mon profil` qui lit et met à jour l'utilisateur courant via `users`, tandis que la session éditeur ne conserve plus que la référence utilisateur et l'ouverture de session.

**Marque**

- `id`
- `nom` *

**Modèle**

- `id`
- `nom` *
- `marque_id` * : many-to-one avec Marque

**Véhicule**

- `id`
- `nom` *
- `model_id` * : many-to-one avec Modèle
- `marque_id` * : many-to-one avec Marque
- `marque_nom`
- `model_nom`
- `annee` *
- `couleur` *
- `type_carb` * : `essence` | `gasoil`
- `type_transm` * : `auto` | `manuel`
- `type_moteur` * : `8 cyl` | `6 cyl` | `4 cyl` | `hybrid`
- `kilometrage`
- `prix_vente`
- `prix_achat`
- `montant_transport`
- `montant_dedouanement`
- `description`
- `ind_en_vedette` * : `oui` | `non`
- `ind_etat` * : `vendu` | `disponible` | `non-disponible`
- `ajoute_par` * : identifiant utilisateur de référence
- `ajoute_le`
- `modifie_par`
- `modifie_le`
- `image` : image principale utilisée sur la carte et comme première image du détail
- `image_2`
- `image_3`
- `image_4`
- `image_5`
- `image_6`
- `image_7`
- `image_8`
- `image_9`
- `image_10`
- `images` : tableau d'URLs ou de data URIs, max 10 côté usage prévu

**Contact**

- `phone`
- `email`
- `location`

**Hero Accueil**

- `title`
- `image`

**Règles de suppression**

- Suppression d'une marque : cascade sur ses modèles puis sur les véhicules liés
- Suppression d'un modèle : cascade sur les véhicules liés
- Suppression d'un véhicule : suppression simple
