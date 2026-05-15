"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getApiBaseUrl } from "../../lib/apiBaseUrl";
import { readEditorSession } from "./editorSession";
import { vehicleImageFieldKeys } from "./editorConfig";

const EDITOR_DATA_KEY = "sahel-editor-data";
const EDITOR_DATA_EVENT = "sahel-editor-data-change";

const defaultEditorData = {
  users: [],
  marques: [],
  modeles: [],
  vehicules: [],
  hero: {
    title: "",
    image: "",
  },
  contact: {
    phone: "",
    email: "",
    location: "",
  },
};

let cachedEditorData = cloneEditorData(defaultEditorData);
let hasInitializedLocalCache = false;
let editorBootstrapPromise = null;

function cloneEditorData(data) {
  return JSON.parse(JSON.stringify(data));
}

function getDefaultEditorData() {
  return cloneEditorData(defaultEditorData);
}

function toText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toNumber(value, fallback = 0) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function toNullableNumber(value) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function normalizeBrand(brand) {
  return {
    id: toNumber(brand?.id),
    nom: toText(brand?.nom),
  };
}

function normalizeModel(model) {
  return {
    id: toNumber(model?.id),
    nom: toText(model?.nom),
    marque_id: toNumber(model?.marque_id),
  };
}

function normalizeUserType(userType, email) {
  const normalizedType = String(userType ?? "").trim().toLowerCase();

  if (normalizedType === "admin") {
    return "Admin";
  }

  if (normalizedType === "editeur") {
    return "Editeur";
  }

  return String(email ?? "").toLowerCase().includes("admin") ? "Admin" : "Editeur";
}

function normalizeUser(user) {
  const email = toText(user?.email).trim();

  return {
    id: toNumber(user?.id),
    nom: toText(user?.nom),
    tel: toText(user?.tel),
    email,
    type_utilisateur: normalizeUserType(user?.type_utilisateur, email),
    mot_de_passe: toText(user?.mot_de_passe),
  };
}

function normalizeFeaturedFlag(value) {
  return value === true || value === "oui" ? "oui" : "non";
}

function getNormalizedVehicleImages(vehicle) {
  const legacyImages = Array.isArray(vehicle?.images) ? vehicle.images.filter(Boolean) : [];
  const explicitImages = vehicleImageFieldKeys.map((fieldKey, index) => {
    if (typeof vehicle?.[fieldKey] === "string" && vehicle[fieldKey]) {
      return vehicle[fieldKey];
    }

    if (index === 0 && typeof vehicle?.image === "string" && vehicle.image) {
      return vehicle.image;
    }

    return legacyImages[index] ?? "";
  });

  return explicitImages;
}

function normalizeVehicle(vehicle) {
  const explicitImages = getNormalizedVehicleImages(vehicle);
  const images = explicitImages.filter(Boolean);
  const image = explicitImages[0] ?? toText(vehicle?.image);

  return {
    id: toNumber(vehicle?.id),
    nom: toText(vehicle?.nom),
    model_id: toNumber(vehicle?.model_id),
    marque_id: toNumber(vehicle?.marque_id),
    marque_nom: toText(vehicle?.marque_nom),
    model_nom: toText(vehicle?.model_nom),
    annee: toNumber(vehicle?.annee),
    couleur: toText(vehicle?.couleur),
    type_carb: toText(vehicle?.type_carb),
    type_transm: toText(vehicle?.type_transm),
    type_moteur: toText(vehicle?.type_moteur),
    kilometrage: toNullableNumber(vehicle?.kilometrage),
    description: toText(vehicle?.description),
    ind_en_vedette: normalizeFeaturedFlag(vehicle?.ind_en_vedette),
    ind_etat: toText(vehicle?.ind_etat),
    ajoute_par: toNumber(vehicle?.ajoute_par),
    ajoute_le: toText(vehicle?.ajoute_le) || toText(vehicle?.created_at),
    modifie_par: toNullableNumber(vehicle?.modifie_par),
    modifie_le: toText(vehicle?.modifie_le) || toText(vehicle?.updated_at),
    image,
    image_2: explicitImages[1] ?? "",
    image_3: explicitImages[2] ?? "",
    image_4: explicitImages[3] ?? "",
    image_5: explicitImages[4] ?? "",
    image_6: explicitImages[5] ?? "",
    image_7: explicitImages[6] ?? "",
    image_8: explicitImages[7] ?? "",
    image_9: explicitImages[8] ?? "",
    image_10: explicitImages[9] ?? "",
    images,
  };
}

function normalizeHeroContent(hero) {
  return {
    title: toText(hero?.title),
    image: toText(hero?.image),
  };
}

function normalizeContactDetails(contact) {
  return {
    phone: toText(contact?.phone),
    email: toText(contact?.email),
    location: toText(contact?.location),
  };
}

function sanitizeEditorData(rawData) {
  const fallback = getDefaultEditorData();

  if (!rawData || typeof rawData !== "object") {
    return fallback;
  }

  return {
    users: Array.isArray(rawData.users) ? rawData.users.map(normalizeUser) : fallback.users,
    marques: Array.isArray(rawData.marques) ? rawData.marques.map(normalizeBrand) : fallback.marques,
    modeles: Array.isArray(rawData.modeles) ? rawData.modeles.map(normalizeModel) : fallback.modeles,
    vehicules: Array.isArray(rawData.vehicules) ? rawData.vehicules.map(normalizeVehicle) : fallback.vehicules,
    hero: normalizeHeroContent(rawData.hero),
    contact: normalizeContactDetails(rawData.contact),
  };
}

function dispatchEditorDataChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(EDITOR_DATA_EVENT));
}

function subscribeToEditorData(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(EDITOR_DATA_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EDITOR_DATA_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function subscribeToClient() {
  return () => {};
}

function ensureLocalEditorData() {
  if (typeof window === "undefined" || hasInitializedLocalCache) {
    return;
  }

  hasInitializedLocalCache = true;

  const rawValue = window.localStorage.getItem(EDITOR_DATA_KEY);

  if (!rawValue) {
    cachedEditorData = getDefaultEditorData();
    return;
  }

  try {
    cachedEditorData = sanitizeEditorData(JSON.parse(rawValue));
  } catch {
    window.localStorage.removeItem(EDITOR_DATA_KEY);
    cachedEditorData = getDefaultEditorData();
  }
}

function writeEditorData(nextData) {
  cachedEditorData = sanitizeEditorData(nextData);
  hasInitializedLocalCache = true;

  if (typeof window !== "undefined") {
    window.localStorage.setItem(EDITOR_DATA_KEY, JSON.stringify(cachedEditorData));
  }

  dispatchEditorDataChange();
}

function getEntityEndpoint(entityKey) {
  switch (entityKey) {
    case "marques":
    case "modeles":
    case "vehicules":
      return `/admin/${entityKey}`;
    default:
      throw new Error(`Entité non supportée: ${entityKey}`);
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || `La requête a échoué (${response.status}).`);
  }

  return payload;
}

function hydrateEntityData(editorData, entityKey, nextItem) {
  const items = editorData[entityKey] ?? [];
  const normalizedItem = entityKey === "marques"
    ? normalizeBrand(nextItem)
    : entityKey === "modeles"
      ? normalizeModel(nextItem)
      : normalizeVehicle(nextItem);

  return {
    ...editorData,
    [entityKey]: items.some((item) => String(item.id) === String(normalizedItem.id))
      ? items.map((item) => (String(item.id) === String(normalizedItem.id) ? normalizedItem : item))
      : [...items, normalizedItem],
  };
}

function buildVehiclePayload(nextItem, mode) {
  const currentUserId = getCurrentEditorUserId();

  return {
    nom: toText(nextItem?.nom).trim(),
    model_id: toNumber(nextItem?.model_id),
    annee: toNumber(nextItem?.annee),
    couleur: toText(nextItem?.couleur).trim(),
    type_carb: toText(nextItem?.type_carb),
    type_transm: toText(nextItem?.type_transm),
    type_moteur: toText(nextItem?.type_moteur),
    kilometrage: nextItem?.kilometrage === "" ? null : toNullableNumber(nextItem?.kilometrage),
    description: toText(nextItem?.description).trim() || null,
    ind_en_vedette: normalizeFeaturedFlag(nextItem?.ind_en_vedette),
    ind_etat: toText(nextItem?.ind_etat),
    image: toText(nextItem?.image),
    image_2: toText(nextItem?.image_2) || null,
    image_3: toText(nextItem?.image_3) || null,
    image_4: toText(nextItem?.image_4) || null,
    image_5: toText(nextItem?.image_5) || null,
    image_6: toText(nextItem?.image_6) || null,
    image_7: toText(nextItem?.image_7) || null,
    image_8: toText(nextItem?.image_8) || null,
    image_9: toText(nextItem?.image_9) || null,
    image_10: toText(nextItem?.image_10) || null,
    ...(mode === "create" ? { ajoute_par: currentUserId } : { modifie_par: currentUserId }),
  };
}

async function upsertSingleton(path, payload) {
  try {
    return await requestJson(path, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.toLowerCase().includes("introuvable")) {
      throw error;
    }

    return requestJson(path, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export async function loadEditorDataFromApi(force = false) {
  if (typeof window === "undefined") {
    return getDefaultEditorData();
  }

  ensureLocalEditorData();

  if (editorBootstrapPromise && !force) {
    return editorBootstrapPromise;
  }

  const currentUsers = readEditorData().users ?? [];
  const loadPromise = Promise.all([
    requestJson("/admin/marques"),
    requestJson("/admin/modeles"),
    requestJson("/admin/vehicules"),
    requestJson("/admin/hero-content"),
    requestJson("/admin/contact-details"),
  ])
    .then(([marques, modeles, vehicules, hero, contact]) => {
      const nextData = sanitizeEditorData({
        users: currentUsers,
        marques,
        modeles,
        vehicules,
        hero,
        contact,
      });

      writeEditorData(nextData);
      return nextData;
    })
    .catch((error) => {
      console.error("Impossible de charger les données de l'éditeur depuis l'API.", error);
      return readEditorData();
    })
    .finally(() => {
      if (editorBootstrapPromise === loadPromise) {
        editorBootstrapPromise = null;
      }
    });

  editorBootstrapPromise = loadPromise;
  return loadPromise;
}

function useHydratedEditorData() {
  const editorData = useSyncExternalStore(
    subscribeToEditorData,
    readEditorData,
    getDefaultEditorData,
  );

  useEffect(() => {
    void loadEditorDataFromApi();
  }, []);

  return editorData;
}

export function useEditorClientReady() {
  return useSyncExternalStore(subscribeToClient, () => true, () => false);
}

export function readEditorData() {
  if (typeof window === "undefined") {
    return getDefaultEditorData();
  }

  ensureLocalEditorData();
  return cachedEditorData;
}

export function useEditorEntityData(entityKey) {
  const editorData = useHydratedEditorData();
  return editorData[entityKey] ?? [];
}

export function useEditorInventoryData() {
  const editorData = useHydratedEditorData();

  return {
    brands: editorData.marques ?? [],
    models: editorData.modeles ?? [],
    vehicles: (editorData.vehicules ?? []).map(normalizeVehicle),
  };
}

export function useEditorContactDetails() {
  const editorData = useHydratedEditorData();
  return editorData.contact ?? defaultEditorData.contact;
}

export function useEditorHeroContent() {
  const editorData = useHydratedEditorData();
  return editorData.hero ?? defaultEditorData.hero;
}

export async function updateEditorHeroContent(nextHero) {
  const savedHero = await upsertSingleton("/admin/hero-content", {
    title: toText(nextHero?.title).trim(),
    image: toText(nextHero?.image),
  });
  const editorData = readEditorData();

  writeEditorData({
    ...editorData,
    hero: normalizeHeroContent(savedHero),
  });

  return normalizeHeroContent(savedHero);
}

export async function updateEditorContactDetails(nextContact) {
  const savedContact = await upsertSingleton("/admin/contact-details", {
    phone: toText(nextContact?.phone).trim(),
    email: toText(nextContact?.email).trim(),
    location: toText(nextContact?.location).trim(),
  });
  const editorData = readEditorData();

  writeEditorData({
    ...editorData,
    contact: normalizeContactDetails(savedContact),
  });

  return normalizeContactDetails(savedContact);
}

export function findEditorEntityItem(entityKey, id) {
  const editorData = readEditorData();
  const items = editorData[entityKey] ?? [];

  return items.find((item) => String(item.id) === String(id)) ?? null;
}

export function findEditorVehicleById(id) {
  const vehicle = findEditorEntityItem("vehicules", id);

  if (!vehicle) {
    return null;
  }

  return normalizeVehicle(vehicle);
}

function getCurrentEditorUserId() {
  const session = readEditorSession();
  const userId = Number(session?.userId);

  return Number.isFinite(userId) && userId > 0 ? userId : 1;
}

export async function createEditorEntityItem(entityKey, nextItem) {
  const endpoint = getEntityEndpoint(entityKey);
  const payload = entityKey === "marques"
    ? { nom: toText(nextItem?.nom).trim() }
    : entityKey === "modeles"
      ? { nom: toText(nextItem?.nom).trim(), marque_id: toNumber(nextItem?.marque_id) }
      : buildVehiclePayload(nextItem, "create");
  const createdItem = await requestJson(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (entityKey === "vehicules") {
    await loadEditorDataFromApi(true);
    return findEditorEntityItem(entityKey, createdItem.id);
  }

  writeEditorData(hydrateEntityData(readEditorData(), entityKey, createdItem));
  return findEditorEntityItem(entityKey, createdItem.id);
}

export async function updateEditorEntityItem(entityKey, id, nextItem) {
  const endpoint = `${getEntityEndpoint(entityKey)}/${id}`;
  const payload = entityKey === "marques"
    ? { nom: toText(nextItem?.nom).trim() }
    : entityKey === "modeles"
      ? { nom: toText(nextItem?.nom).trim(), marque_id: toNumber(nextItem?.marque_id) }
      : buildVehiclePayload(nextItem, "update");
  const updatedItem = await requestJson(endpoint, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (entityKey === "vehicules") {
    await loadEditorDataFromApi(true);
    return findEditorEntityItem(entityKey, updatedItem.id);
  }

  writeEditorData(hydrateEntityData(readEditorData(), entityKey, updatedItem));
  return findEditorEntityItem(entityKey, updatedItem.id);
}

export async function deleteEditorEntityItem(entityKey, id) {
  await requestJson(`${getEntityEndpoint(entityKey)}/${id}`, {
    method: "DELETE",
  });

  await loadEditorDataFromApi(true);
}

export function useEditorCurrentUser() {
  const editorData = useHydratedEditorData();
  const session = useSyncExternalStore(
    subscribeToClient,
    readEditorSession,
    () => null,
  );

  if (!session) {
    return null;
  }

  return (editorData.users ?? []).find((user) => String(user.id) === String(session.userId)) ?? null;
}

export function ensureEditorUserForEmail(email) {
  const normalizedEmail = String(email ?? "").trim();

  if (!normalizedEmail) {
    return null;
  }

  const editorData = readEditorData();
  const existingUser = (editorData.users ?? []).find((user) => user.email.toLowerCase() === normalizedEmail.toLowerCase());

  if (existingUser) {
    return existingUser;
  }

  const highestId = (editorData.users ?? []).reduce((maxId, user) => {
    return Number.isFinite(Number(user.id)) ? Math.max(maxId, Number(user.id)) : maxId;
  }, 0);
  const nextUser = normalizeUser({
    id: highestId + 1,
    nom: "",
    tel: "",
    email: normalizedEmail,
    type_utilisateur: normalizeUserType("", normalizedEmail),
    mot_de_passe: "",
  });

  writeEditorData({
    ...editorData,
    users: [...(editorData.users ?? []), nextUser],
  });

  return nextUser;
}

export function upsertEditorUser(nextUser) {
  const editorData = readEditorData();
  const users = editorData.users ?? [];
  const normalizedUser = normalizeUser(nextUser);
  const existingIndex = users.findIndex((user) => {
    return String(user.id) === String(normalizedUser.id)
      || (normalizedUser.email && user.email.toLowerCase() === normalizedUser.email.toLowerCase());
  });

  if (existingIndex >= 0) {
    const mergedUser = { ...users[existingIndex], ...normalizedUser };
    const nextUsers = [...users];
    nextUsers[existingIndex] = mergedUser;

    writeEditorData({
      ...editorData,
      users: nextUsers,
    });

    return mergedUser;
  }

  writeEditorData({
    ...editorData,
    users: [...users, normalizedUser],
  });

  return normalizedUser;
}

export function updateEditorUser(id, nextUser) {
  const editorData = readEditorData();
  const users = editorData.users ?? [];
  const normalizedId = Number(id);
  const normalizedUser = normalizeUser({ ...nextUser, id: normalizedId });

  writeEditorData({
    ...editorData,
    users: users.map((user) => (String(user.id) === String(id) ? normalizedUser : user)),
  });

  return normalizedUser;
}
