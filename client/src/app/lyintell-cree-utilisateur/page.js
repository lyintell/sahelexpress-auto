import EditorUserCreateForm from "../../components/editor/EditorUserCreateForm";

export const metadata = {
  title: "Créer un utilisateur",
  description: "Création explicite d'un profil éditeur dans la base admin.",
};

export default function CreateEditorUserPage() {
  return (
    <div className="pb-20 pt-6 sm:pt-10">
      <section className="section-shell">
        <EditorUserCreateForm />
      </section>
    </div>
  );
}
