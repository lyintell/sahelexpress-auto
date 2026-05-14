import { notFound } from "next/navigation";
import EditorEntityDetail from "../../../../../components/editor/EditorEntityDetail";
import { getEntityConfig } from "../../../../../components/editor/editorConfig";

export default async function EditorEntityDetailPage({ params }) {
  const { entity, id } = await params;
  const config = getEntityConfig(entity);

  if (!config) {
    notFound();
  }

  return <EditorEntityDetail config={config} entityKey={entity} itemId={id} />;
}