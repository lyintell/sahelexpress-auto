"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createEditorEntityItem,
  deleteEditorEntityItem,
  updateEditorEntityItem,
  useEditorClientReady,
  useEditorCurrentUser,
  useEditorEntityData,
} from "./editorDataStore";
import { getEntityInitialValues } from "./editorConfig";

function buildFormState(config, initialValues) {
  return Object.fromEntries(
    config.fields.map((field) => {
      const rawValue = initialValues[field.key];

      if (field.type === "list") {
        return [field.key, Array.isArray(rawValue) ? rawValue.join("\n") : ""];
      }

      if (field.type === "file") {
        return [field.key, typeof rawValue === "string" ? rawValue : ""];
      }

      return [field.key, rawValue ?? ""];
    }),
  );
}

function parseFormState(config, formData) {
  return Object.fromEntries(
    config.fields.map((field) => {
      const rawValue = formData[field.key];

      if (field.type === "list") {
        return [
          field.key,
          String(rawValue ?? "")
            .split("\n")
            .map((entry) => entry.trim())
            .filter(Boolean),
        ];
      }

      if (field.type === "number") {
        return [field.key, rawValue === "" ? "" : Number(rawValue)];
      }

      if (field.type === "select" && field.valueType === "number") {
        return [field.key, rawValue === "" ? "" : Number(rawValue)];
      }

      if (field.type === "file") {
        return [field.key, String(rawValue ?? "")];
      }

      return [field.key, rawValue];
    }),
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error(`Impossible de lire le fichier ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function buildFieldOptions(field, sources) {
  if (Array.isArray(field.options)) {
    return field.options;
  }

  if (!field.optionsSource) {
    return [];
  }

  const items = sources[field.optionsSource] ?? [];
  const relatedItems = field.relatedSource ? (sources[field.relatedSource] ?? []) : [];

  return items.map((item) => ({
    label: resolveOptionLabel(field, item, relatedItems),
    value: String(resolveOptionValue(field, item)),
  }));
}

function resolveOptionLabel(field, item, relatedItems) {
  if (field.optionLabelStrategy === "brand-model") {
    const brand = relatedItems.find(
      (relatedItem) => String(relatedItem.id) === String(item.marque_id),
    );

    return brand ? `${brand.nom} - ${item.nom}` : String(item.nom ?? item.id);
  }

  if (field.optionLabelKey) {
    return String(item[field.optionLabelKey] ?? item.nom ?? item.id);
  }

  return String(item.nom ?? item.id);
}

function resolveOptionValue(field, item) {
  if (field.optionValueKey) {
    return item[field.optionValueKey];
  }

  return item.id;
}

function EditorEntityFormContent({
  config,
  entityKey,
  mode,
  itemId,
  currentItem,
  initialValues,
  visibleFields,
  fieldOptions,
}) {
  const router = useRouter();
  const currentUser = useEditorCurrentUser();
  const [draftFormData, setDraftFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMarkingAsSold, setIsMarkingAsSold] = useState(false);
  const formData = draftFormData ?? buildFormState(config, initialValues);
  const canDelete = currentUser?.type_utilisateur === "Admin";

  const title = useMemo(() => {
    return mode === "create"
      ? `Nouveau ${config.singular.toLowerCase()}`
      : `Modifier ${config.singular.toLowerCase()}`;
  }, [config.singular, mode]);

  async function handleFileChange(field, fileList) {
    const file = Array.from(fileList ?? [])[0] ?? null;

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: dataUrl }));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Impossible de lire les images locales.");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setError("");
    setIsSaving(true);

    const nextItem = parseFormState(config, formData);

    try {
      if (mode === "create") {
        const createdItem = await createEditorEntityItem(entityKey, nextItem);
        setMessage("Enregistrement créé dans le backend.");
        router.push(`${config.basePath}/${createdItem.id}`);
        router.refresh();
        return;
      }

      if (!currentItem) {
        setError("Impossible de modifier cet enregistrement.");
        return;
      }

      const updatedItem = await updateEditorEntityItem(entityKey, itemId, nextItem);
      setMessage("Enregistrement mis à jour dans le backend.");
      router.push(`${config.basePath}/${updatedItem.id}`);
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Impossible d'enregistrer cet élément.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (mode !== "edit" || !currentItem) {
      return;
    }

    if (!canDelete) {
      setMessage("");
      setError("Seuls les administrateurs peuvent supprimer un élément.");
      return;
    }

    const shouldDelete = window.confirm(
      `Supprimer ${config.singular.toLowerCase()} #${currentItem.id} du stockage local ?`,
    );

    if (!shouldDelete) {
      return;
    }

    setMessage("");
    setError("");
    setIsDeleting(true);

    try {
      await deleteEditorEntityItem(entityKey, currentItem.id);
      router.push(config.basePath);
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Impossible de supprimer cet élément.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleMarkAsSold() {
    if (mode !== "edit" || entityKey !== "vehicules" || !currentItem || currentItem.ind_etat === "vendu") {
      return;
    }

    setMessage("");
    setError("");
    setIsMarkingAsSold(true);

    try {
      const updatedItem = await updateEditorEntityItem(entityKey, itemId, {
        ...parseFormState(config, formData),
        ind_etat: "vendu",
      });
      setMessage("Véhicule marqué comme vendu.");
      router.push(`${config.basePath}/${updatedItem.id}`);
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Impossible de mettre à jour cet élément.");
    } finally {
      setIsMarkingAsSold(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">{title}</h1>
          <p className="mt-2 text-slate-600">Les identifiants et champs système sont calculés automatiquement puis enregistrés via l&apos;API admin.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={config.basePath} className="button-secondary">
            Retour à la liste
          </Link>
          {mode === "edit" && entityKey === "vehicules" && currentItem?.ind_etat !== "vendu" ? (
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

      <form className="panel rounded-[2rem] p-8 sm:p-10" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          {visibleFields.map((field) => {
            const value = formData[field.key];
            const isWide = field.type === "textarea" || field.type === "list";

            return (
              <div key={field.key} className={isWide ? "block sm:col-span-2" : "block"}>
                <span className="mb-2 block text-sm font-semibold text-slate-600">
                  {field.label}
                  {field.required ? <span className="ml-1 text-[var(--red)]">*</span> : null}
                </span>
                {field.description ? <p className="mb-2 text-sm text-slate-500">{field.description}</p> : null}
                {field.type === "textarea" ? (
                  <textarea
                    className="field min-h-40 resize-y"
                    value={value}
                    required={field.required}
                    onChange={(event) => setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: event.target.value }))}
                  />
                ) : field.type === "list" ? (
                  <textarea
                    className="field min-h-40 resize-y"
                    value={value}
                    required={field.required}
                    onChange={(event) => setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: event.target.value }))}
                    placeholder="Une valeur par ligne"
                  />
                ) : field.type === "select" ? (
                  <select
                    className="field"
                    value={value}
                    required={field.required}
                    onChange={(event) => setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: event.target.value }))}
                  >
                    <option value="">{field.placeholder ?? "Choisir une option"}</option>
                    {(fieldOptions[field.key] ?? []).map((option) => (
                      <option key={`${field.key}-${option.value}`} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "radio" ? (
                  <div className="flex flex-wrap gap-3">
                    {(field.options ?? []).map((option) => (
                      <label key={`${field.key}-${option.value}`} className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                        <input
                          type="radio"
                          name={field.key}
                          required={field.required}
                          checked={String(value) === String(option.value)}
                          onChange={() => setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: option.value }))}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                ) : field.type === "toggle" ? (
                  <label className="flex min-h-[3.75rem] items-center justify-between rounded-[1rem] border border-[var(--line)] bg-white px-4 py-3">
                    <span className="text-sm font-semibold text-slate-700">
                      {String(value) === "oui" ? "Oui" : "Non"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={String(value) === "oui"}
                      onClick={() => setDraftFormData((current) => ({
                        ...(current ?? formData),
                        [field.key]: String(current[field.key]) === "oui" ? "non" : "oui",
                      }))}
                      className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                        String(value) === "oui" ? "bg-[var(--gold)]" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition ${
                          String(value) === "oui" ? "translate-x-7" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>
                ) : field.type === "file" ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      className="field"
                      accept="image/*"
                      required={field.required && !value}
                      onChange={(event) => {
                        void handleFileChange(field, event.target.files);
                      }}
                    />
                    {value ? (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700">Image prête à être enregistrée.</p>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-[var(--line)] bg-[var(--gray-soft)]">
                          <Image
                            src={value}
                            alt={field.label}
                            fill
                            unoptimized
                            sizes="240px"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    className="field"
                    value={value}
                    required={field.required}
                    onChange={(event) => setDraftFormData((current) => ({ ...(current ?? formData), [field.key]: event.target.value }))}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" className="button-primary border-0" disabled={isSaving}>
            {isSaving ? "Enregistrement..." : "Enregistrer"}
          </button>
          <Link href={config.basePath} className="button-secondary">
            Annuler
          </Link>
          {mode === "edit" && canDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-full bg-[var(--red)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          ) : null}
        </div>

        {error ? <p className="mt-4 rounded-2xl bg-[#fbe4e4] px-4 py-3 text-sm font-semibold text-[var(--red)]">{error}</p> : null}
        {message ? <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--gray-soft)] px-4 py-3 text-sm font-semibold text-slate-700">{message}</p> : null}
      </form>
    </div>
  );
}

export default function EditorEntityForm({ config, entityKey, mode, itemId }) {
  const isClientReady = useEditorClientReady();
  const items = useEditorEntityData(entityKey);
  const brands = useEditorEntityData("marques");
  const models = useEditorEntityData("modeles");
  const currentItem = mode === "edit"
    ? items.find((item) => String(item.id) === String(itemId)) ?? null
    : null;
  const initialValues = currentItem ?? getEntityInitialValues(entityKey);
  const visibleFields = useMemo(
    () => config.fields.filter((field) => !field.hiddenOnForm),
    [config.fields],
  );
  const fieldOptions = useMemo(() => {
    const sources = { marques: brands, modeles: models };

    return Object.fromEntries(
      visibleFields.map((field) => [field.key, buildFieldOptions(field, sources)]),
    );
  }, [brands, models, visibleFields]);

  if (!isClientReady) {
    return <div className="panel rounded-[2rem] p-6 text-sm text-slate-600">Chargement du formulaire...</div>;
  }

  if (mode === "edit" && !currentItem) {
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
    <EditorEntityFormContent
      key={JSON.stringify({ mode, itemId, entityKey, initialValues })}
      config={config}
      entityKey={entityKey}
      mode={mode}
      itemId={itemId}
      currentItem={currentItem}
      initialValues={initialValues}
      visibleFields={visibleFields}
      fieldOptions={fieldOptions}
    />
  );
}