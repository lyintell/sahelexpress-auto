import { getApiBaseUrl } from "./apiBaseUrl";

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function createAdminUser(profile) {
  const response = await fetch(`${getApiBaseUrl()}/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(profile),
  });

  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || "Impossible de créer l'utilisateur.");
  }

  return {
    id: Number(payload?.id ?? 0),
    nom: String(payload?.nom ?? ""),
    tel: String(payload?.tel ?? ""),
    email: String(payload?.email ?? ""),
    type_utilisateur: payload?.type_utilisateur === "Admin" ? "Admin" : "Editeur",
  };
}
