import EditorLoginForm from "../../components/editor/EditorLoginForm";

export const metadata = {
  title: "Mode éditeur",
  description: "Connexion frontend au site administrateur de Sahel Express Auto.",
};

export default function EditorLoginPage() {
  return (
    <div className="pb-20 pt-6 sm:pt-10">
      <section className="section-shell">
        <EditorLoginForm />
      </section>
    </div>
  );
}