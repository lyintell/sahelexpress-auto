function getApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  return "http://localhost:4000/api";
}

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

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function getAdminUser(userId) {
  const response = await fetch(`${getApiBaseUrl()}/admin/users/${userId}`, {
    headers: {
      Accept: "application/json",
    },
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || "Impossible de charger le profil.");
  }

  return normalizeEditorUser(payload);
}

export async function updateAdminUser(userId, profile) {
  const response = await fetch(`${getApiBaseUrl()}/admin/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(profile),
  });
  const payload = await readJson(response);

  if (!response.ok) {
    throw new Error(payload?.message || "Impossible de mettre à jour le profil.");
  }

  return normalizeEditorUser(payload);
}