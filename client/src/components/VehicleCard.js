import Link from "next/link";
import Image from "next/image";

function getDisplayText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function getFormattedDistance(value) {
  return Number.isFinite(value) ? `${value.toLocaleString("fr-FR")} km` : "";
}

export default function VehicleCard({ vehicle }) {
  const imageSource = vehicle.image || vehicle.images?.find(Boolean) || "";

  return (
    <Link href={`/vehicules/${vehicle.id}`} className="block h-full transition-transform hover:scale-[1.01]">
      <article className="panel flex h-full flex-col rounded-[1.75rem] p-1">
        <div className="relative overflow-hidden rounded-[1.45rem] bg-[var(--gray-soft)] p-1">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.15rem]">
            {imageSource ? (
              <Image
                src={imageSource}
                alt={getDisplayText(vehicle.nom)}
                width={640}
                height={400}
                unoptimized
                className="h-full w-full object-cover"
              />
            ) : null}
            {vehicle.ind_etat === "vendu" ? (
              <span className="absolute left-4 top-4 rounded-full bg-[#fbe4e4] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--red)]">
                {getDisplayText(vehicle.ind_etat)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex min-h-[5.75rem] items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">
                {getDisplayText(vehicle.marque_nom)}{vehicle.marque_nom && vehicle.model_nom ? " • " : ""}{getDisplayText(vehicle.model_nom)}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight">
                {getDisplayText(vehicle.nom)}
              </h3>
            </div>
            <p className="shrink-0 rounded-full bg-[var(--gold)] px-3 py-1 text-sm font-semibold text-black">
              {getDisplayText(vehicle.annee)}
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-slate-700">
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3.5">
              <p className="text-sm text-slate-500">Kilométrage</p>
              <p className="mt-1 text-lg font-semibold sm:text-xl">
                {getFormattedDistance(vehicle.kilometrage)}
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3.5">
              <p className="text-sm text-slate-500">Transmission</p>
              <p className="mt-1 text-lg font-semibold capitalize sm:text-xl">{getDisplayText(vehicle.type_transm)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3.5">
              <p className="text-sm text-slate-500">Carburant</p>
              <p className="mt-1 text-lg font-semibold capitalize sm:text-xl">{getDisplayText(vehicle.type_carb)}</p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-white p-3.5">
              <p className="text-sm text-slate-500">Moteur</p>
              <p className="mt-1 text-lg font-semibold uppercase sm:text-xl">{getDisplayText(vehicle.type_moteur)}</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}