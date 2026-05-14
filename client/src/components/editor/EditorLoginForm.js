"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createOrRetrieveAdminSession } from "../../lib/adminSession";
import { upsertEditorUser } from "./editorDataStore";
import { readEditorSession, writeEditorSession } from "./editorSession";

export default function EditorLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (readEditorSession()) {
      router.replace("/mode-editeur/marques");
    }
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Renseignez un email et un mot de passe.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const user = await createOrRetrieveAdminSession({
        email: email.trim(),
        password,
      });
      const syncedUser = upsertEditorUser(user);

      writeEditorSession(syncedUser.id);
      router.replace("/mode-editeur/marques");
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : "Impossible d'ouvrir la session.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel mx-auto w-full max-w-xl rounded-[2rem] p-8 sm:p-10">
      <span className="pill">Mode éditeur</span>
      <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold sm:text-5xl">
        Connexion
      </h1>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Email</span>
          <input
            type="email"
            className="field"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="editeur@sahelexpressauto.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Mot de passe</span>
          <input
            type="password"
            className="field"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Votre mot de passe"
          />
        </label>

        <button type="submit" disabled={isSubmitting} className="button-primary border-0 disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
    </div>
  );
}