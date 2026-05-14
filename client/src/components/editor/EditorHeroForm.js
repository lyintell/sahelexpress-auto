"use client";

import { useState } from "react";
import { updateEditorHeroContent, useEditorHeroContent } from "./editorDataStore";

export default function EditorHeroForm() {
  const heroContent = useEditorHeroContent();
  const [draftHero, setDraftHero] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const formState = draftHero ?? heroContent;

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    try {
      await updateEditorHeroContent(formState);
      setMessage("Hero mis à jour dans le backend.");
      setDraftHero(null);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible de mettre à jour le hero.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">Hero</h1>
        <p className="mt-2 text-slate-600">Le titre et l&apos;image d&apos;accueil sont désormais synchronisés avec le backend admin.</p>
      </div>

      <form className="panel rounded-[2rem] p-8 sm:p-10" onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Titre</span>
            <input className="field" value={formState.title} onChange={(event) => setDraftHero((current) => ({ ...(current ?? heroContent), title: event.target.value }))} />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-600">Image</span>
            <input
              className="field"
              value={formState.image}
              onChange={(event) => setDraftHero((current) => ({ ...(current ?? heroContent), image: event.target.value }))}
              placeholder="URL ou data URI"
            />
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