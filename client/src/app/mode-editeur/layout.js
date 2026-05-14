import EditorBodyMode from "../../components/editor/EditorBodyMode";

export default function EditorLayout({ children }) {
  return (
    <>
      <EditorBodyMode />
      {children}
    </>
  );
}