"use client";

import { useState } from "react";
import { updateEditorContactDetails, useEditorContactDetails } from "./editorDataStore";

export default function EditorContactDetailsForm() {
  const contactDetails = useEditorContactDetails();
  const [draftContact, setDraftContact] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const formState = draftContact ?? contactDetails;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      await updateEditorContactDetails(formState);
      setMessage("Coordonnées mises à jour dans le backend.");
      setDraftContact(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de mettre à jour les coordonnées.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Contact</h1>
        <p className="mt-2 text-slate-600">Ces coordonnées alimentent la page contact et les rappels sur l&apos;accueil, via le backend admin.</p>
      </div>

      <form className="panel rounded-[2rem] p-8 sm:p-10" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Téléphone</span>
            <input className="field" value={formState.phone} onChange={(event) => setDraftContact((current) => ({ ...(current ?? contactDetails), phone: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
            <input className="field" value={formState.email} onChange={(event) => setDraftContact((current) => ({ ...(current ?? contactDetails), email: event.target.value }))} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Localisation</span>
            <input className="field" value={formState.location} onChange={(event) => setDraftContact((current) => ({ ...(current ?? contactDetails), location: event.target.value }))} />
          </label>
        </div>

        <button type="submit" disabled={isSaving} className="button-primary mt-6 border-0 disabled:cursor-not-allowed disabled:opacity-70">
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>

        {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
      </form>
    </div>
  );
}