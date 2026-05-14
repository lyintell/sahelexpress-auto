"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { formatEntityValue } from "./editorConfig";
import { useEditorClientReady, useEditorEntityData } from "./editorDataStore";

function getStatusBadgeClass(status) {
  if (status === "disponible") {
    return "border border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "vendu") {
    return "border border-red-200 bg-red-50 text-red-700";
  }

  if (status === "non-disponible") {
    return "border border-slate-200 bg-slate-100 text-slate-700";
  }

  return "border border-[var(--line)] bg-[var(--gray-soft)] text-slate-700";
}

export default function EditorEntityList({ config, entityKey }) {
  const router = useRouter();
  const isClientReady = useEditorClientReady();
  const items = useEditorEntityData(entityKey);
  const visibleFields = config.listFields ?? config.fields;
  const sortedItems = useMemo(() => {
    return [...items].sort((leftItem, rightItem) => Number(rightItem.id ?? 0) - Number(leftItem.id ?? 0));
  }, [items]);

  function handleOpenDetails(id) {
    router.push(`${config.basePath}/${id}`);
  }

  function handleRowKeyDown(event, id) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleOpenDetails(id);
  }

  function renderCellValue(field, item) {
    const value = item[field.key];

    if (entityKey === "vehicules" && field.key === "ind_etat") {
      return (
        <span className={`inline-flex min-w-28 items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getStatusBadgeClass(value)}`}>
          {formatEntityValue(field, value)}
        </span>
      );
    }

    return formatEntityValue(field, value);
  }

  if (!isClientReady) {
    return <div className="panel rounded-[2rem] p-6 text-sm text-slate-600">Chargement des données...</div>;
  }

  return (
    <>
      <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl font-semibold">
            {config.plural}
          </h1>
          <p className="mt-2 text-slate-600">Liste synchronisée avec le backend admin, avec cache local de secours dans le navigateur.</p>
        </div>
        <Link href={`${config.basePath}/nouveau`} className="button-primary">
          Ajouter {config.singular.toLowerCase()}
        </Link>
      </div>

      <div className="panel overflow-hidden rounded-[2rem]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-[var(--gray-soft)] text-left text-slate-600">
              <tr>
                {visibleFields.map((field) => (
                  <th key={field.key} className="px-4 py-3 font-semibold">
                    {field.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr
                  key={item.id}
                  tabIndex={0}
                  role="link"
                  onClick={() => handleOpenDetails(item.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, item.id)}
                  className="cursor-pointer border-t border-[var(--line)] align-top transition hover:bg-[var(--gray-soft)]/70 focus-visible:bg-[var(--gray-soft)]/70 focus-visible:outline-none"
                >
                  {visibleFields.map((field) => (
                    <td key={field.key} className="px-4 py-3 text-slate-700">
                      {renderCellValue(field, item)}
                    </td>
                  ))}
                </tr>
              ))}
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={visibleFields.length} className="px-4 py-8 text-center text-slate-500">
                    Aucun élément enregistré.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </>
  );
}