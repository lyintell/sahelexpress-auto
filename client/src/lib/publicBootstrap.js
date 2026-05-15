import { cache } from "react";
import { getApiBaseUrl } from "./apiBaseUrl";

const defaultPublicBootstrap = {
  hero: {
    title: "",
    image: "",
  },
  contact: {
    phone: "",
    email: "",
    location: "",
  },
  marques: [],
  modeles: [],
  vehicules: [],
};

function toText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toNumberOrFallback(value, fallback = 0) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function normalizeBrand(brand) {
  return {
    id: toNumberOrFallback(brand?.id),
    nom: toText(brand?.nom),
  };
}

function normalizeModel(model) {
  return {
    id: toNumberOrFallback(model?.id),
    nom: toText(model?.nom),
    marque_id: toNumberOrFallback(model?.marque_id),
  };
}

function normalizeFeaturedFlag(value) {
  if (value === true || value === "oui") {
    return "oui";
  }

  return "non";
}

function getVehicleImages(vehicle) {
  const imageKeys = [
    "image",
    "image_2",
    "image_3",
    "image_4",
    "image_5",
    "image_6",
    "image_7",
    "image_8",
    "image_9",
    "image_10",
  ];

  return imageKeys
    .map((key) => toText(vehicle?.[key]))
    .filter(Boolean);
}

function normalizeVehicle(vehicle, modelsById, brandsById) {
  const modelId = toNumberOrFallback(vehicle?.model_id);
  const brandId = toNumberOrFallback(vehicle?.marque_id);
  const model = modelsById.get(modelId);
  const brand = brandsById.get(brandId) ?? brandsById.get(model?.marque_id ?? 0);
  const images = getVehicleImages(vehicle);

  return {
    id: toNumberOrFallback(vehicle?.id),
    nom: toText(vehicle?.nom),
    model_id: modelId,
    marque_id: brand?.id ?? brandId,
    marque_nom: toText(vehicle?.marque_nom) || toText(brand?.nom),
    model_nom: toText(vehicle?.model_nom) || toText(model?.nom),
    annee: toNumberOrFallback(vehicle?.annee),
    couleur: toText(vehicle?.couleur),
    type_carb: toText(vehicle?.type_carb),
    type_transm: toText(vehicle?.type_transm),
    type_moteur: toText(vehicle?.type_moteur),
    kilometrage: (() => {
      const parsedValue = Number(vehicle?.kilometrage);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    })(),
    prix_vente: (() => {
      const parsedValue = Number(vehicle?.prix_vente);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    })(),
    prix_achat: (() => {
      const parsedValue = Number(vehicle?.prix_achat);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    })(),
    montant_transport: (() => {
      const parsedValue = Number(vehicle?.montant_transport);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    })(),
    montant_dedouanement: (() => {
      const parsedValue = Number(vehicle?.montant_dedouanement);
      return Number.isFinite(parsedValue) ? parsedValue : null;
    })(),
    description: toText(vehicle?.description),
    ind_en_vedette: normalizeFeaturedFlag(vehicle?.ind_en_vedette),
    ind_etat: toText(vehicle?.ind_etat),
    ajoute_par: toNumberOrFallback(vehicle?.ajoute_par),
    ajoute_le: toText(vehicle?.ajoute_le) || toText(vehicle?.created_at),
    modifie_par: toNumberOrFallback(vehicle?.modifie_par),
    modifie_le: toText(vehicle?.modifie_le) || toText(vehicle?.updated_at),
    image: images[0] ?? "",
    image_2: images[1] ?? "",
    image_3: images[2] ?? "",
    image_4: images[3] ?? "",
    image_5: images[4] ?? "",
    image_6: images[5] ?? "",
    image_7: images[6] ?? "",
    image_8: images[7] ?? "",
    image_9: images[8] ?? "",
    image_10: images[9] ?? "",
    images,
  };
}

function normalizeHero(hero) {
  if (!hero || typeof hero !== "object") {
    return defaultPublicBootstrap.hero;
  }

  return {
    title: toText(hero.title),
    image: toText(hero.image),
  };
}

function normalizeContact(contact) {
  if (!contact || typeof contact !== "object") {
    return defaultPublicBootstrap.contact;
  }

  return {
    phone: toText(contact.phone),
    email: toText(contact.email),
    location: toText(contact.location),
  };
}

export function normalizePublicBootstrap(payload) {
  const marques = Array.isArray(payload?.marques) ? payload.marques.map(normalizeBrand) : [];
  const modeles = Array.isArray(payload?.modeles) ? payload.modeles.map(normalizeModel) : [];
  const brandsById = new Map(marques.map((brand) => [brand.id, brand]));
  const modelsById = new Map(modeles.map((model) => [model.id, model]));

  return {
    hero: normalizeHero(payload?.hero),
    contact: normalizeContact(payload?.contact),
    marques,
    modeles,
    vehicules: Array.isArray(payload?.vehicules)
      ? payload.vehicules.map((vehicle) => normalizeVehicle(vehicle, modelsById, brandsById))
      : [],
  };
}

export const getPublicBootstrap = cache(async () => {
  const endpoint = `${getApiBaseUrl()}/public/bootstrap`;

  try {
    const response = await fetch(endpoint, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Bootstrap request failed with status ${response.status}`);
    }

    const payload = await response.json();
    return normalizePublicBootstrap(payload);
  } catch (error) {
    console.error("Unable to load public bootstrap data.", error);
    return defaultPublicBootstrap;
  }
});

export function getDefaultPublicBootstrap() {
  return defaultPublicBootstrap;
}