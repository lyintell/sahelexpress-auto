"use client";

import { useState } from "react";
import { createAdminUser } from "../../lib/adminCreateUser";

const initialFormState = {
  nom: "",
  tel: "",
  email: "",
  mot_de_passe: "",
  confirmation_mot_de_passe: "",
};

export default function EditorUserCreateForm() {
  const [formState, setFormState] = useState(initialFormState);
  const [createdUser, setCreatedUser] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!formState.nom.trim()) {
      setError("Renseignez le nom.");
      setCreatedUser(null);
      return;
    }

    if (!formState.tel.trim()) {
      setError("Renseignez le téléphone.");
      setCreatedUser(null);
      return;
    }

    if (!formState.email.trim()) {
      setError("Renseignez l'email.");
      setCreatedUser(null);
      return;
    }

    if (!formState.mot_de_passe) {
      setError("Renseignez le mot de passe.");
      setCreatedUser(null);
      return;
    }

    if (formState.mot_de_passe !== formState.confirmation_mot_de_passe) {
      setError("Les mots de passe ne correspondent pas.");
      setCreatedUser(null);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const user = await createAdminUser({
        nom: formState.nom.trim(),
        tel: formState.tel.trim(),
        email: formState.email.trim(),
        type_utilisateur: "Editeur",
        mot_de_passe: formState.mot_de_passe,
      });

      setCreatedUser(user);
      setFormState(initialFormState);
    } catch (creationError) {
      setCreatedUser(null);
      setError(creationError instanceof Error ? creationError.message : "Impossible de créer le profil.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="panel rounded-[2rem] p-8 sm:p-10">
        <span className="pill">Création utilisateur</span>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold sm:text-5xl">
          Créer un profil éditeur
        </h1>
        <p className="mt-3 text-slate-700">
          Cette page crée explicitement un utilisateur dans la base. Aucun lien public n&apos;y mène depuis l&apos;écran de connexion.
        </p>

        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Nom</span>
            <input
              type="text"
              className="field"
              value={formState.nom}
              onChange={(event) => setFormState((current) => ({ ...current, nom: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Téléphone</span>
            <input
              type="tel"
              className="field"
              value={formState.tel}
              onChange={(event) => setFormState((current) => ({ ...current, tel: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
            <input
              type="email"
              className="field"
              value={formState.email}
              onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Mot de passe</span>
            <input
              type="password"
              className="field"
              value={formState.mot_de_passe}
              onChange={(event) => setFormState((current) => ({ ...current, mot_de_passe: event.target.value }))}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Confirmation du mot de passe</span>
            <input
              type="password"
              className="field"
              value={formState.confirmation_mot_de_passe}
              onChange={(event) => setFormState((current) => ({ ...current, confirmation_mot_de_passe: event.target.value }))}
            />
          </label>

          <button type="submit" disabled={isSubmitting} className="button-primary mt-2 border-0 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Création..." : "Créer l'utilisateur"}
          </button>
        </form>

        {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
      </div>

      {createdUser ? (
        <div className="panel rounded-[2rem] p-8 sm:p-10">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-semibold">Utilisateur créé</h2>
          <p className="mt-3 text-slate-700">Le profil a bien été enregistré dans la base et peut maintenant se connecter au mode éditeur.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-[var(--gray-soft)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">ID</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">#{createdUser.id}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--gray-soft)] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Type</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{createdUser.type_utilisateur}</p>
            </div>
            <div className="rounded-[1.5rem] bg-[var(--gray-soft)] px-4 py-3 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{createdUser.email}</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
