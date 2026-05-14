"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  updateEditorEntityItem,
  useEditorClientReady,
  useEditorEntityData,
} from "./editorDataStore";

function renderValue(field, value, entityName) {
  if (field.type === "file" && value) {
    return (
      <div className="rounded-[1.2rem] border border-[var(--line)] bg-white p-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[0.9rem] bg-[var(--gray-soft)]">
          <Image
            src={value}
            alt={entityName}
            fill
            unoptimized
            sizes="240px"
            className="object-cover"
          />
        </div>
      </div>
    );
  }

  if (field.type === "list" && Array.isArray(value)) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {value.map((item, index) => (
          <div key={`${entityName}-${field.key}-${index}`} className="rounded-[1.2rem] border border-[var(--line)] bg-white p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.9rem] bg-[var(--gray-soft)]">
              <Image
                src={item}
                alt={`${entityName} ${index + 1}`}
                fill
                unoptimized
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-lg font-semibold text-slate-900">{String(value ?? "-")}</p>;
}

export default function EditorEntityDetail({ config, entityKey, itemId }) {
  const router = useRouter();
  const isClientReady = useEditorClientReady();
  const items = useEditorEntityData(entityKey);
  const item = items.find((entry) => String(entry.id) === String(itemId)) ?? null;
  const [error, setError] = useState("");
  const [isMarkingAsSold, setIsMarkingAsSold] = useState(false);

  async function handleMarkAsSold() {
    if (!item || entityKey !== "vehicules" || item.ind_etat === "vendu") {
      return;
    }

    setError("");
    setIsMarkingAsSold(true);

    try {
      await updateEditorEntityItem(entityKey, item.id, {
        ...item,
        ind_etat: "vendu",
      });
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Impossible de mettre à jour cet élément.");
    } finally {
      setIsMarkingAsSold(false);
    }
  }

  if (!isClientReady) {
    return <div className="panel rounded-[2rem] p-6 text-sm text-slate-600">Chargement des données...</div>;
  }

  if (!item) {
    return (
      <div className="panel rounded-[2rem] p-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-semibold">Élément introuvable</h1>
          <p className="mt-3 text-slate-600">Cet enregistrement n&apos;existe pas ou n&apos;a pas encore été chargé depuis le backend.</p>
        <Link href={config.basePath} className="button-secondary mt-5">
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">
            Détails {config.singular.toLowerCase()}
          </h1>
          <p className="mt-2 text-slate-600">Affichage complet des champs synchronisés avec le backend admin.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={config.basePath} className="button-secondary">
            Retour à la liste
          </Link>
          <Link href={`${config.basePath}/nouveau`} className="button-secondary">
            Ajouter nouveau
          </Link>
          <Link href={`${config.basePath}/${item.id}/modifier`} className="button-primary">
            Modifier
          </Link>
          {entityKey === "vehicules" && item.ind_etat !== "vendu" ? (
            <button
              type="button"
              onClick={handleMarkAsSold}
              disabled={isMarkingAsSold}
              className="rounded-full bg-[var(--gold)] px-5 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isMarkingAsSold ? "Mise à jour..." : "Marquer vendu"}
            </button>
          ) : null}
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.fields.map((field) => (
          <div key={field.key} className={field.type === "list" ? "panel rounded-[1.75rem] p-5 sm:col-span-2" : "panel rounded-[1.75rem] p-5"}>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{field.label}</p>
            <div className="mt-3">{renderValue(field, item[field.key], item.nom ?? config.singular)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}