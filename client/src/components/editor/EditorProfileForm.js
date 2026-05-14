"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { getAdminUser, updateAdminUser } from "../../lib/adminUsers";
import { readEditorSession, subscribeToEditorSession } from "./editorSession";
import { upsertEditorUser, useEditorCurrentUser } from "./editorDataStore";

function formatUserType(userType) {
  return userType === "Admin" ? "Admin" : "Éditeur";
}

function formatOpenedAt(openedAt) {
  const date = new Date(openedAt);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EditorProfileForm() {
  const session = useSyncExternalStore(subscribeToEditorSession, readEditorSession, () => null);
  const currentUser = useEditorCurrentUser();
  const [formState, setFormState] = useState({
    nom: "",
    tel: "",
    email: "",
    type_utilisateur: "Editeur",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isActive = true;

    if (!session?.userId) {
      return () => {
        isActive = false;
      };
    }

    async function loadProfile() {
      setIsLoading(true);
      setMessage("");
      setError("");

      try {
        const user = await getAdminUser(session.userId);

        if (!isActive) {
          return;
        }

        upsertEditorUser(user);
        setFormState({
          nom: user.nom,
          tel: user.tel,
          email: user.email,
          type_utilisateur: user.type_utilisateur,
        });
      } catch (loadError) {
        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Impossible de charger le profil.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [session?.userId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formState.nom.trim()) {
      setError("Renseignez le nom.");
      setMessage("");
      return;
    }

    if (!formState.tel.trim()) {
      setError("Renseignez le téléphone.");
      setMessage("");
      return;
    }

    if (!formState.email.trim()) {
      setError("Renseignez un email.");
      setMessage("");
      return;
    }

    if (!currentUser) {
      setError("Utilisateur introuvable.");
      setMessage("");
      return;
    }

    setIsSaving(true);

    try {
      const updatedUser = await updateAdminUser(currentUser.id, {
        nom: formState.nom.trim(),
        tel: formState.tel.trim(),
        email: formState.email.trim(),
        type_utilisateur: formState.type_utilisateur,
      });

      upsertEditorUser(updatedUser);
      setFormState((current) => ({
        ...current,
        nom: updatedUser.nom,
        tel: updatedUser.tel,
        email: updatedUser.email,
        type_utilisateur: updatedUser.type_utilisateur,
      }));
      setError("");
      setMessage("Profil mis à jour.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de mettre à jour le profil.");
      setMessage("");
    } finally {
      setIsSaving(false);
    }
  }

  if (!session || !currentUser || isLoading) {
    return <div className="panel rounded-[2rem] p-6 text-sm text-slate-600">Chargement du profil...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Mon profil</h1>
        <p className="mt-2 text-slate-600">Consultez les détails du compte et modifiez les informations enregistrées dans le backend.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel rounded-[2rem] p-5">
          <p className="text-sm font-semibold text-slate-500">Identifiant</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">#{currentUser.id}</p>
        </div>
        <div className="panel rounded-[2rem] p-5">
          <p className="text-sm font-semibold text-slate-500">Type d&apos;utilisateur</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatUserType(currentUser.type_utilisateur)}</p>
        </div>
        <div className="panel rounded-[2rem] p-5">
          <p className="text-sm font-semibold text-slate-500">Session ouverte</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{formatOpenedAt(session.openedAt)}</p>
        </div>
      </div>

      <form className="panel rounded-[2rem] p-8 sm:p-10" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Nom</span>
            <input
              type="text"
              className="field"
              value={formState.nom}
              required
              onChange={(event) => setFormState((current) => ({ ...current, nom: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Téléphone</span>
            <input
              type="tel"
              className="field"
              value={formState.tel}
              required
              onChange={(event) => setFormState((current) => ({ ...current, tel: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
            <input
              type="email"
              className="field"
              value={formState.email}
              required
              onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Type d&apos;utilisateur</span>
            <select
              className="field"
              value={formState.type_utilisateur}
              disabled
            >
              <option value="Admin">Admin</option>
              <option value="Editeur">Éditeur</option>
            </select>
          </label>
        </div>

        <button type="submit" disabled={isSaving} className="button-primary mt-6 border-0 disabled:cursor-not-allowed disabled:opacity-70">
          {isSaving ? "Enregistrement..." : "Enregistrer le profil"}
        </button>

        {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
      </form>
    </div>
  );
}