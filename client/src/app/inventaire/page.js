import PublicInventoryPage from "../../components/PublicInventoryPage";
import { getPublicBootstrap } from "../../lib/publicBootstrap";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Inventaire",
  description: "Parcourez tous les véhicules disponibles chez Sahel Express Auto.",
};

export default async function InventoryPage() {
  const publicBootstrap = await getPublicBootstrap();

  return (
    <PublicInventoryPage
      brands={publicBootstrap.marques}
      models={publicBootstrap.modeles}
      vehicles={publicBootstrap.vehicules}
    />
  );
}