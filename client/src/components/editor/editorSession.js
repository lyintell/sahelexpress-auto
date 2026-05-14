export const EDITOR_SESSION_KEY = "sahel-editor-session";
const EDITOR_DATA_KEY = "sahel-editor-data";
const EDITOR_SESSION_EVENT = "sahel-editor-session-change";
const EMPTY_SESSION_VALUE = "__empty_session_value__";

let lastRawSession = null;
let lastSessionSnapshot = null;

function buildEditorUserId(email) {
  return email
    .trim()
    .toLowerCase()
    .split("")
    .reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) % 1000003, 17);
}

function normalizeUserType(rawUserType, email) {
  const normalizedType = String(rawUserType ?? "").trim().toLowerCase();

  if (normalizedType === "admin") {
    return "Admin";
  }

  if (normalizedType === "editeur") {
    return "Editeur";
  }

  return String(email ?? "").toLowerCase().includes("admin") ? "Admin" : "Editeur";
}

function readRawEditorData() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(EDITOR_DATA_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

function writeRawEditorData(nextData) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(EDITOR_DATA_KEY, JSON.stringify(nextData));
  window.dispatchEvent(new Event("sahel-editor-data-change"));
}

function normalizeStoredUser(rawUser) {
  const email = String(rawUser?.email ?? "").trim();

  return {
    id: Number.isFinite(Number(rawUser?.id)) && Number(rawUser.id) > 0 ? Number(rawUser.id) : buildEditorUserId(email),
    nom: String(rawUser?.nom ?? "").trim(),
    tel: String(rawUser?.tel ?? "").trim(),
    email,
    type_utilisateur: normalizeUserType(rawUser?.type_utilisateur, email),
    mot_de_passe: String(rawUser?.mot_de_passe ?? ""),
  };
}

function ensureStoredUser(rawUser) {
  const editorData = readRawEditorData() ?? {};
  const users = Array.isArray(editorData.users)
    ? editorData.users.map(normalizeStoredUser)
    : [];
  const normalizedUser = normalizeStoredUser(rawUser);
  const existingIndex = users.findIndex((user) => String(user.id) === String(normalizedUser.id)
    || (normalizedUser.email && user.email.toLowerCase() === normalizedUser.email.toLowerCase()));

  if (existingIndex >= 0) {
    const mergedUser = { ...users[existingIndex], ...normalizedUser };
    users[existingIndex] = mergedUser;
    writeRawEditorData({ ...editorData, users });
    return mergedUser;
  }

  writeRawEditorData({ ...editorData, users: [...users, normalizedUser] });
  return normalizedUser;
}

function migrateLegacySession(rawSession) {
  const email = String(rawSession?.email ?? "").trim();

  if (!email) {
    return null;
  }

  const storedUser = ensureStoredUser({
    id: rawSession?.id,
    nom: rawSession?.nom,
    tel: rawSession?.tel,
    email,
    type_utilisateur: rawSession?.userType,
    mot_de_passe: rawSession?.password,
  });
  const nextSession = {
    userId: storedUser.id,
    openedAt: String(rawSession?.openedAt ?? new Date().toISOString()),
  };

  window.localStorage.setItem(EDITOR_SESSION_KEY, JSON.stringify(nextSession));
  return nextSession;
}

function normalizeEditorSession(rawSession) {
  if (!rawSession || typeof rawSession !== "object") {
    return null;
  }

  if (!rawSession.userId && rawSession.email) {
    return migrateLegacySession(rawSession);
  }

  const userId = Number(rawSession.userId);

  if (!Number.isFinite(userId) || userId <= 0) {
    return null;
  }

  return {
    userId,
    openedAt: String(rawSession.openedAt ?? new Date().toISOString()),
  };
}

function dispatchEditorSessionChange() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(EDITOR_SESSION_EVENT));
}

export function subscribeToEditorSession(callback) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(EDITOR_SESSION_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EDITOR_SESSION_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function readEditorSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(EDITOR_SESSION_KEY);
  const normalizedRawValue = rawValue ?? EMPTY_SESSION_VALUE;

  if (lastRawSession === normalizedRawValue) {
    return lastSessionSnapshot;
  }

  if (!rawValue) {
    lastRawSession = normalizedRawValue;
    lastSessionSnapshot = null;
    return null;
  }

  try {
    lastRawSession = normalizedRawValue;
    lastSessionSnapshot = normalizeEditorSession(JSON.parse(rawValue));
    return lastSessionSnapshot;
  } catch {
    window.localStorage.removeItem(EDITOR_SESSION_KEY);
    lastRawSession = EMPTY_SESSION_VALUE;
    lastSessionSnapshot = null;
    return null;
  }
}

export function writeEditorSession(userId) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedUserId = Number(userId);

  if (!Number.isFinite(normalizedUserId) || normalizedUserId <= 0) {
    return;
  }

  window.localStorage.setItem(
    EDITOR_SESSION_KEY,
    JSON.stringify({
      userId: normalizedUserId,
      openedAt: new Date().toISOString(),
    }),
  );
  dispatchEditorSessionChange();
}

export function clearEditorSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(EDITOR_SESSION_KEY);
  dispatchEditorSessionChange();
}