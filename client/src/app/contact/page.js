import PublicContactPage from "../../components/PublicContactPage";
import { getPublicBootstrap } from "../../lib/publicBootstrap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact",
  description: "Prenez contact avec Sahel Express Auto pour discuter d'un véhicule.",
};

export default async function ContactPage() {
  const publicBootstrap = await getPublicBootstrap();

  return <PublicContactPage contactDetails={publicBootstrap.contact} />;
}