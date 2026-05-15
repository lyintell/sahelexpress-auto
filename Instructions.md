1.
Acceuil:
- Il y a trop d'information dans la section-shell. J'ai une page model que je veux que tu réplique pour l'acceuil.
Check : C:\Users\oumar\Documents\PROJECTS\MY_APPS\WEBSITES\sahel-wheels-direct\client\src\routes\index.tsc
Je veux exactement le meme style de page. Ignore les images la bas, juste copy le layout et adapte le à nos données.

2.
Theme du site:
Je veux changer le theme du site de énertique et couleurs existantes, à un theme plus simple. juste du rouge, blanc et or. Rouge et blanc comme dans le drapeau du Canada et Or du drapeau du mali.
Utilise blanc pour les couleurs de fond. le rouge plus pour les boutons. Or pour les boutons active ou bouton de validation final (eg. envoyer email, appeler numéro). Utilise du gris clair là ou approprié

3.
J'aime pas le style des cards de vehicules. Crée des cards dont l'image est encastré dans la card avec un padding de 1 pour l'image. Aussi enleve la description dans les cards. Augmente fonts pour kilométrage, transmission, Carburant et moteur.
Aussi n'affiche le status que si le vehicule est vendu. ie. pas d affichage de status si disponible ou non-disponible

4.
Ajoute des icons appropriés pour les features des section-shell (notre differences, logistique et paiement)

5.
Corrige tout le site en bon francais (les accents surtout)

6.
Page Contact.
Simplifie la page, une seule colonne, pas deux. Utilise des icons pour les contact (tel, email, localisation) au lieu de text. Ces informations sont après le formulaire

7.
Remplace les boutons rouge par couleur Jaune Or et text noir. Cela est plus aligné avec le logo

8.
Il manque une page détails des véhicules. Sur clique d'un card véhicule, on va dans la page détails du véhicules avec toutes les photos (max 10). Les photos à gauche, et les détails a droite. Toutes les photos en bas de celui qui est cliqué. Sur clique de la photo affiché, affiche la photo en modal plein écran. Sur clique déhors, ferme le modal

9.
Pour le moment, popule la page details avec les données fictifs des vehicules déja créee dans data.js. On s occupera de la base de données plus tard. Pour le moment je veux voir les détails d'un véhicule.

10.
Crée la page Éditeur a l'addresse /mode-editeur
Ceci amene à une page login (email et mot de passe) directement, sauf si il y a une session deja ouvert. On s occupe de la BD plus tard. Pour le moment implement le Frontend et permet la connexion avec n'importe quel données.

La page éditeur est le site admin qui permet d'ajouter, modifier et supprimer des marques, modèles et véhicules. On peut aussi modifier le mot de passe de l'utilisateur.
Pour le moment, les utilisateurs seront créer a partir de la base de données directement, le site admin n est disponible que pour des utilisateurs existants.

Implemente les pages liste, détails, nouveau et modifier le plus simplement possibile pour marque, modèle et véhicules. Utilise les fields dans data.js comme référence. Toute les fields doivent y etre. Pas de fields additionnel.

11.
Fait en sorte que seulement les données du mode admin alimente l inventaire.

12.
La base de données n est pas implémenter correctement. Sur suppression, c est en CASCADE. par example, quand une marque est supprimer alors le model et le vehicule sont supprimer. Ceci n est pas présentement le cas lorsque j ai testé en supprimant une marque dans l editeur. Le model et le vehcile sont toujours la.

13. 
Maintenant ignore les données dans data.js. Tout le frontend repose sur les données du local storage. On travaillera sur la BD réel après. Pour le moment, l appli n utilise plus les données durs

14.
Il y a eu certaine additions dans la base de données (localstorage). Update le fichier DB

15. 
Met a jour la page admin en ajoutant les nouveaux models. Aussi pour la page hero, enleve le donneé dur. localstorage seulement comme les autres

16.
Dans modele, supprime le field Trim. on utilisera le nom seuleemtn. Update touste les pages impactés


17.
Met a jour tout le site en utilisant le font Lato (Google font)

18.
Nouveau vehicule n a pas tous les champs du modele. met le a jour

19.
Dans le mode admin, lors des modification ou création, ne pas montrer Id. Id est auto incrémenté par défault et n est pas modifiable.

Modèle: Au lieu marque ID, montrer la liste des marques (nom de la marque) dans un dropdown et le choix automatiquement determine le ID correspondant.

Vehicule: Au lieu de modèle Id, montrer la liste des modèle (marque + nom du modèle) dans un dropdown et le choix automatiquement determine le ID correspondant. Aussi, marque est redundant. Enleve les fields non nécessaire.
Indicateur d'état est un dropdown.
Indicateur vedette est un radio (oui par défault)
Ajouté par, ajouté le, modifié par et modifier le sont tous des fields automatique. 
Ajouté et modifié par seront déterminer par le ID de l'utilisateur.
Les images doivent être des files select (local).

20.
Ajoute 9 autres image fields a vehicule. Il y a 10 images en tout qui peut etre chargees. La premiere image est celle qui apparait sur le card. 

21.
Dans mode admin, dans liste vehicules, ajoute la colonne etat (avant action). Dans action, ajoute un bon bouton marquer Vendu, le bouton est visible seulement si etat n est pas Vendu.

22.
Dans les formulaires, ajoute le requirement pour certain fields:
- brand: nom
- model: nom
- vehicule : model, nom, annee, couleur, etat, carburant, moteur, transmission

23.
Certain field sont choice fields:
- carburant : essence, gasoil
- moteur : 8 cyl, 6 cyl, 4 cyl, hybrid
- transmission : auto, manuel

24.
Dans details vehicule (site visuel), enleve kilometrage. Ajoute année. Color code État

25.
- Dans le mode admin, les tables sont triés par ID en ordre descendant.
- Pour les ecrans Liste, enleve la colonne action. Sur clique de la ligne, on entre dans les details. Ajoute le bouton supprimer dans les details/ modifier
- Dans les details, ajoute un bouton Ajouter nouveau près de retour à la liste

26.
Dans mon profil, masquer les inputs mot de passe. Ajoute Changer mot de passe à part dans le sidebar (en bas de mon profil)

27.
Parfais, le site fonction en mode dev both client et server (supabase). Dis moi ce que je doit faire pour deployer live a sahelexpress-auto.com

28.
Parfait j ai mis le site en production live.
Cependant le login ne fonctionne pas. J'obtient "failed to fetch" lorsque j essaie de me connecter au mode editeur. 

29. 
Optimisation ecran mobile
- le header menu (navbar) doit etre un burger menu sur mobile. presentement le header n apparait pas sur mobile
- le Logo sur le header menu doit etre centré.
- reduit le height du hero
- Dans le titre du navigateur, remplace le logo (nextjs) par le logo du site.
- deplace la partie Notre différence et Logistique et paiement dans le footer (visible sur toute les pages, excepté mode editeur), et reduit les fonts et cards. Présentement ca encombre le contenue du site.
- Dans détails vehicule dans inventaire, sur clique de l image pour zoomer, permet a l utilisateur de slider les images.
- Dans le mode editeur permet de supprimer une image (image 2 à 10), pas seulement remplacer.
