Je veux crée un site web de vente d'auto à Bamako, Mali. Mon entreprise Sahel Express Auto importe des véhicules du Canada pour vendre au Mali.
Le site servira à montrer les véhicules aux clients. Les clients naviguerons le site pour trouver un vehicule qui leur convient. Puis il entreront en contact avec l'entreprise pour en savoir plus. Le site ne fait pas de vente directement au client, mais plus tot permet au client de contacter l entreprise pour furter discussions. 

Comptes/ profils:
Il y aura deux type de compte pour le site web. Un compte admin et un compte editeur.

- Compte admin: dispose de toutes les privilèges. Peut crée, modifier et supprimer tous les profils, mais ne peut pas supprimer son propre profil. Peut changer son mot de passe et celui des editeurs. Peut créer, modifier et supprimer des posts de véhicules.
- Compte editeur: Peut modifier son profil. Peut changer son propre mot de passe. Peut créer, modifier et supprimer des posts de véhicules.

Design:
Le site est très simple avec des couleurs fun (bleu et different dégradés, rouge et different dégradés, rose et different dégradés) pour une expérience fun et électrique pour les visiteurs.

Le site a 3 pages:
- Une page acceuil : affiche les véhicules en vedette. Au plus 5 vehicules en vedette basé sur les post les plus récents. Si les vehicules vedette ne sont pas 5 au plus, completer avec les autres vehicules toujours trié pas ordre de recence de post.
- Une page inventaire : montre la liste de tous les véhicules (par cards). Chaque véhicule card inclu une photo de l'auto, le nom du vehicule, l'état du véhicule (vendu, disponible, non-disponible), une description de l'auto, afficher partiellement. La page inventaire inclu des filtres d années, et de maque et models (si marque selectionné)
- Une page contact : formulaire de contact
    - nom
    - objet
    - message (min 5 mots)

Stack:
- Supabase pour le backend
- Nextjs pour le frontend

Couleur: 
- Fun / Exotique

Le next js app a deja eté setup.

Ne crée pas la base de données supabase encore. Pour le moment on va utiliser SQLite locally.
J'ai déja le schema de la base de données tout fait dans le ficher DB.md. Ne modifie en rien la base de données. implement le comme tel.

Pour la premiere étape, focus à créer le frontend seulement, et les données sont des données fictif et statique que tu aura générer. Crée un fichier data.js pour les données fictifs.

Écrit le code bien structure et la manière la plus simple, en ne faisant pas de overkill coding.

Initie git.