import Link from "next/link";
import VehicleDetailView from "./VehicleDetailView";

export default function PublicVehicleDetailPage({ vehicle }) {
  return (
    <div className="pb-20 pt-6 sm:pt-10">
      <section className="section-shell">
        <Link href="/inventaire" className="inline-flex rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#bc8f14]">
          Retour à l&apos;inventaire
        </Link>

        <div className="mt-6">
          {vehicle ? (
            <VehicleDetailView vehicle={vehicle} />
          ) : (
            <div className="panel rounded-[2rem] p-8 text-center text-slate-700">
              Ce véhicule n&apos;est pas disponible dans l&apos;inventaire public.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}