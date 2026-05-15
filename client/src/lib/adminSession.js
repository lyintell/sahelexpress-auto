import { getApiBaseUrl } from "./apiBaseUrl";

function normalizeEditorUser(user) {
  return {
    id: Number(user?.id ?? 0),
    nom: String(user?.nom ?? ""),
    tel: String(user?.tel ?? ""),
    email: String(user?.email ?? ""),
    type_utilisateur: user?.type_utilisateur === "Admin" ? "Admin" : "Editeur",
    mot_de_passe: "",
  };
}

export async function createOrRetrieveAdminSession(credentials) {
  const response = await fetch(`${getApiBaseUrl()}/admin/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Impossible d'ouvrir la session admin. Vérifiez que le profil existe en base.");
  }

  return normalizeEditorUser(payload);
}