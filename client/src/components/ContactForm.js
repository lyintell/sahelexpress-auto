"use client";

import { useState } from "react";

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export default function ContactForm() {
  const [formData, setFormData] = useState({ nom: "", objet: "", message: "" });
  const [feedback, setFeedback] = useState({ type: "idle", text: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.nom.trim() || !formData.objet.trim()) {
      setFeedback({
        type: "error",
        text: "Veuillez renseigner votre nom et l'objet du message.",
      });
      return;
    }

    if (countWords(formData.message) < 5) {
      setFeedback({
        type: "error",
        text: "Le message doit contenir au moins 5 mots.",
      });
      return;
    }

    setFeedback({
      type: "success",
      text: "Message prêt. Le branchement backend sera ajouté à l'étape suivante.",
    });
    setFormData({ nom: "", objet: "", message: "" });
  }

  return (
    <div className="panel rounded-[2rem] p-8 sm:p-10">
      <span className="pill">Parlons de votre besoin</span>
      <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold">
        Envoyez votre demande en quelques lignes.
      </h2>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Nom</span>
          <input
            className="field"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            placeholder="Votre nom"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Objet</span>
          <input
            className="field"
            name="objet"
            value={formData.objet}
            onChange={handleChange}
            placeholder="Ex. : besoin d'un SUV 2021"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-600">Message</span>
          <textarea
            className="field min-h-40 resize-y"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Décrivez le type de véhicule recherché, votre budget ou vos questions."
          />
        </label>

        <button type="submit" className="button-accent !bg-[var(--gold)] !text-black hover:!bg-[#bc8f14] hover:!text-black border-0">
          Envoyer
        </button>
      </form>

      {feedback.type !== "idle" ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${
            feedback.type === "success"
              ? "border border-[var(--line)] bg-[var(--gray-soft)] text-slate-700"
              : "bg-[#fbe4e4] text-[var(--red)]"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}
    </div>
  );
}