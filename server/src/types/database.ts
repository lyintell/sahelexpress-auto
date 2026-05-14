export type UserType = "Admin" | "Editeur";
export type VehicleFuel = "essence" | "gasoil";
export type VehicleTransmission = "auto" | "manuel";
export type VehicleEngine = "8 cyl" | "6 cyl" | "4 cyl" | "hybrid";
export type VehicleStatus = "disponible" | "non-disponible" | "vendu";

export interface UserRecord {
  id: number;
  nom: string;
  tel: string;
  email: string;
  type_utilisateur: UserType;
  mot_de_passe_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface BrandRecord {
  id: number;
  nom: string;
  created_at: string;
  updated_at: string;
}

export interface ModelRecord {
  id: number;
  nom: string;
  marque_id: number;
  created_at: string;
  updated_at: string;
}

export interface VehicleRecord {
  id: number;
  nom: string;
  model_id: number;
  marque_id: number;
  marque_nom: string | null;
  model_nom: string | null;
  annee: number;
  couleur: string;
  type_carb: VehicleFuel;
  type_transm: VehicleTransmission;
  type_moteur: VehicleEngine;
  kilometrage: number | null;
  description: string | null;
  ind_en_vedette: boolean;
  ind_etat: VehicleStatus;
  ajoute_par: number;
  ajoute_le: string;
  modifie_par: number | null;
  modifie_le: string | null;
  image: string;
  image_2: string | null;
  image_3: string | null;
  image_4: string | null;
  image_5: string | null;
  image_6: string | null;
  image_7: string | null;
  image_8: string | null;
  image_9: string | null;
  image_10: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactRecord {
  id: number;
  phone: string;
  email: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface HeroRecord {
  id: number;
  title: string;
  image: string;
  created_at: string;
  updated_at: string;
}
