import { notFound } from "next/navigation";
import EditorEntityForm from "../../../../../components/editor/EditorEntityForm";
import { getEntityConfig } from "../../../../../components/editor/editorConfig";

export default async function EditorEntityCreatePage({ params }) {
  const { entity } = await params;
  const config = getEntityConfig(entity);

  if (!config) {
    notFound();
  }

  return <EditorEntityForm config={config} entityKey={entity} mode="create" />;
}