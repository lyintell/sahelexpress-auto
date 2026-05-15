
import Image from "next/image";
import Link from "next/link";
import VehicleCard from "../components/VehicleCard";
import { getPublicBootstrap } from "../lib/publicBootstrap";

export const dynamic = "force-dynamic";

function getFeaturedVehicles(allVehicles, limit = 5) {
  const sortedVehicles = [...allVehicles].sort(
    (left, right) => new Date(right.ajoute_le || 0) - new Date(left.ajoute_le || 0),
  );

  const featuredVehicles = sortedVehicles.filter(
    (vehicle) => vehicle.ind_en_vedette === "oui",
  );

  if (featuredVehicles.length >= limit) {
    return featuredVehicles.slice(0, limit);
  }

  const featuredIds = new Set(featuredVehicles.map((vehicle) => vehicle.id));
  const remainingVehicles = sortedVehicles.filter((vehicle) => !featuredIds.has(vehicle.id));

  return [...featuredVehicles, ...remainingVehicles].slice(0, limit);
}

function CountryFlag({ country }) {
  const background =
    country === "canada"
      ? "linear-gradient(90deg, #d62828 0 28%, #ffffff 28% 72%, #d62828 72% 100%)"
      : "linear-gradient(90deg, #14a44d 0 33.33%, #f4c430 33.33% 66.66%, #d62828 66.66% 100%)";

  return (
    <span
      aria-hidden="true"
      className="inline-block h-5 w-7 rounded-[4px] border border-white/40 shadow-sm sm:h-6 sm:w-8"
      style={{ background }}
    />
  );
}

export default async function Home() {
  const publicBootstrap = await getPublicBootstrap();
  const featuredVehicles = getFeaturedVehicles(publicBootstrap.vehicules, 6);
  const heroImage = publicBootstrap.hero.image;
  const heroTitle = publicBootstrap.hero.title;

  return (
    <div className="pb-16">
      <section className="relative isolate overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt={heroTitle}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
          />
        ) : null}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(90deg, rgba(70,22,22,0.14) 0%, rgba(70,22,22,0.34) 42%, rgba(70,22,22,0.62) 100%)",
          }}
        />
        <div className="section-shell flex min-h-[22rem] flex-col items-start gap-4 px-0 pb-10 pt-16 text-white sm:min-h-[24rem] sm:pb-12 sm:pt-14 md:min-h-[26rem] md:items-end md:pl-20 md:py-12 md:text-right lg:min-h-[30rem] lg:py-16">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur sm:text-base">
            <CountryFlag country="canada" />
            <span>Canada</span>
            <span className="text-white/70">-&gt;</span>
            <CountryFlag country="mali" />
            <span>Mali</span>
          </span>
          <h1 className="max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-extrabold leading-none tracking-tight text-white/80 sm:text-5xl lg:max-w-3xl lg:text-7xl">
            {heroTitle || "Hero à configurer dans le mode éditeur"}
          </h1>
          <p className="max-w-xl text-sm text-white/80 sm:text-base lg:max-w-2xl">
            Sahel Express Auto sélectionne, présente et importe des véhicules fiables
            depuis le Canada pour des clients à Bamako avec un contact direct et rapide.
          </p>
          <div className="mt-2 flex flex-wrap gap-3 md:justify-end">
            <Link href="/inventaire" className="button-primary !bg-[var(--gold)] !text-black shadow-[var(--shadow)] transition-transform hover:!bg-[#bc8f14] hover:!text-black hover:scale-[1.02]">
              Voir l&apos;inventaire
            </Link>
            <Link
              href="/contact"
              className="button-accent !bg-[var(--gold)] !text-black hover:!bg-[#bc8f14] hover:!text-black"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

      <section className="section-shell py-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
              Véhicules à la une
            </h2>
          </div>
          <Link href="/inventaire" className="hidden rounded-full bg-[var(--gold)] px-4 py-2 text-sm font-semibold !text-black transition hover:bg-[#bc8f14] hover:!text-black sm:inline-flex">
            Tout voir -&gt;
          </Link>
        </div>
        {featuredVehicles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-white/70 p-10 text-center">
            <p className="text-sm text-slate-600">Aucun véhicule n&apos;est encore mis à la une.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
        <div className="mt-6 sm:hidden">
          <Link
            href="/inventaire"
            className="block rounded-full bg-[var(--gold)] py-3 text-center text-sm font-semibold !text-black transition hover:bg-[#bc8f14] hover:!text-black"
          >
            Voir tout l&apos;inventaire -&gt;
          </Link>
        </div>
      </section>
    </div>
  );
}
