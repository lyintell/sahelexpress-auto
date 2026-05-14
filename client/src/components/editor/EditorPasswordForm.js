"use client";

import { useState } from "react";
import { updateAdminUser } from "../../lib/adminUsers";
import { upsertEditorUser, useEditorCurrentUser } from "./editorDataStore";

export default function EditorPasswordForm() {
  const currentUser = useEditorCurrentUser();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Renseignez tous les champs.");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
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
        nom: currentUser.nom,
        tel: currentUser.tel,
        email: currentUser.email,
        type_utilisateur: currentUser.type_utilisateur,
        mot_de_passe: newPassword,
      });

      upsertEditorUser(updatedUser);
      setError("");
      setMessage("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de mettre à jour le mot de passe.");
      setMessage("");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Mot de passe</h1>
        <p className="mt-2 text-slate-600">Modifiez le mot de passe séparément des autres informations du profil.</p>
      </div>

      <form className="panel rounded-[2rem] p-8 sm:p-10" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Mot de passe actuel</span>
            <input type="password" className="field" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Nouveau mot de passe</span>
            <input type="password" className="field" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Confirmer le nouveau mot de passe</span>
            <input type="password" className="field" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
        </div>

        <button type="submit" disabled={isSaving} className="button-primary mt-6 border-0 disabled:cursor-not-allowed disabled:opacity-70">
          {isSaving ? "Enregistrement..." : "Mettre à jour"}
        </button>

        {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
      </form>
    </div>
  );
}