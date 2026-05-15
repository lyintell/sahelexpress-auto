"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  updateEditorEntityItem,
  useEditorClientReady,
  useEditorEntityData,
} from "./editorDataStore";
import { formatEntityValue } from "./editorConfig";

function buildDisplayOptions(field, sources) {
  if (Array.isArray(field.options)) {
    return field.options;
  }

  if (!field.optionsSource) {
    return [];
  }

  const items = sources[field.optionsSource] ?? [];

  return items.map((item) => ({
    label: String(item[field.optionLabelKey ?? "nom"] ?? item.nom ?? item.id),
    value: String(item[field.optionValueKey ?? "id"] ?? item.id),
  }));
}

function renderValue(field, value, entityName, fieldOptions) {
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

  const fieldForDisplay = fieldOptions.length ? { ...field, options: fieldOptions } : field;

  return <p className="text-lg font-semibold text-slate-900">{formatEntityValue(fieldForDisplay, value)}</p>;
}

export default function EditorEntityDetail({ config, entityKey, itemId }) {
  const router = useRouter();
  const isClientReady = useEditorClientReady();
  const items = useEditorEntityData(entityKey);
  const brands = useEditorEntityData("marques");
  const visibleFields = config.fields.filter((field) => !field.hiddenOnDetail);
  const fieldOptions = useMemo(() => {
    const sources = { marques: brands };

    return Object.fromEntries(
      visibleFields.map((field) => [field.key, buildDisplayOptions(field, sources)]),
    );
  }, [brands, visibleFields]);
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
        {visibleFields.map((field) => (
          <div key={field.key} className={field.type === "list" ? "panel rounded-[1.75rem] p-5 sm:col-span-2" : "panel rounded-[1.75rem] p-5"}>
            <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{field.label}</p>
            <div className="mt-3">{renderValue(field, item[field.key], item.nom ?? config.singular, fieldOptions[field.key] ?? [])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}