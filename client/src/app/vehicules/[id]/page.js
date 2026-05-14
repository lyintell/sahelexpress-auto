import PublicVehicleDetailPage from "../../../components/PublicVehicleDetailPage";
import { getPublicBootstrap } from "../../../lib/publicBootstrap";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const publicBootstrap = await getPublicBootstrap();
  const vehicle = publicBootstrap.vehicules.find((item) => String(item.id) === String(id));

  return {
    title: vehicle?.nom ? `${vehicle.nom}` : `Véhicule ${id}`,
    description: vehicle?.description || "Détails du véhicule public.",
  };
}

export default async function VehicleDetailPage({ params }) {
  const { id } = await params;
  const publicBootstrap = await getPublicBootstrap();
  const vehicle = publicBootstrap.vehicules.find((item) => String(item.id) === String(id)) ?? null;

  return <PublicVehicleDetailPage vehicle={vehicle} />;
}