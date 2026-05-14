import { notFound } from "next/navigation";
import EditorEntityList from "../../../../components/editor/EditorEntityList";
import { getEntityConfig } from "../../../../components/editor/editorConfig";

export default async function EditorEntityListPage({ params }) {
  const { entity } = await params;
  const config = getEntityConfig(entity);

  if (!config) {
    notFound();
  }

  return <EditorEntityList config={config} entityKey={entity} />;
}