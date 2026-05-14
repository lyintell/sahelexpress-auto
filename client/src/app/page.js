
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

function IconBase({ children }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6 sm:h-7 sm:w-7"
    >
      {children}
    </svg>
  );
}

function PriceTagIcon() {
  return (
    <IconBase>
      <path d="M10 4.5h5.7a2 2 0 0 1 1.42.59l1.79 1.79a2 2 0 0 1 .59 1.41V14a2 2 0 0 1-.59 1.41l-4.57 4.57a2 2 0 0 1-2.82 0L4.41 12.8a2 2 0 0 1 0-2.82L9.09 5.1A2 2 0 0 1 10 4.5Z" />
      <circle cx="14.25" cy="9.75" r="1.25" />
      <path d="M9 9l6 6" />
    </IconBase>
  );
}

function ShieldIcon() {
  return (
    <IconBase>
      <path d="M12 3l7 3v5c0 4.4-2.9 8.4-7 9.8C7.9 19.4 5 15.4 5 11V6l7-3Z" />
      <path d="M9.5 11.8l1.7 1.7 3.3-3.8" />
    </IconBase>
  );
}

function MessageIcon() {
  return (
    <IconBase>
      <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4 3v-3.5A2.5 2.5 0 0 1 5 12.5v-6Z" />
      <path d="M8.5 8.5h7" />
      <path d="M8.5 11.5h5" />
    </IconBase>
  );
}

function ShipIcon() {
  return (
    <IconBase>
      <path d="M6 14.5h12" />
      <path d="M8 14.5V7h8v7.5" />
      <path d="M12 7V4.5" />
      <path d="M4 17.5c1.2 1 2.3 1.5 3.5 1.5S9.8 18.5 11 17.5c1.2 1 2.3 1.5 3.5 1.5s2.3-.5 3.5-1.5" />
    </IconBase>
  );
}

function ClipboardIcon() {
  return (
    <IconBase>
      <rect x="7" y="4.5" width="10" height="15" rx="2" />
      <path d="M9.5 4.5h5" />
      <path d="M9.5 9h5" />
      <path d="M9.5 12.5h5" />
    </IconBase>
  );
}

function RouteIcon() {
  return (
    <IconBase>
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="7" r="2" />
      <path d="M8.5 15.5l7-7" />
      <path d="M10.5 17H17v-6.5" />
    </IconBase>
  );
}

const differenceItems = [
  {
    title: "Commande selon votre choix",
    text: "Expliquez le modèle recherché et l'équipe vous répond avec les options disponibles, dans les plus brefs délais.",
    accent: "#c8ac09",
    tone: "border-[rgba(115,115,115,0.16)] bg-[var(--gray-soft)]",
    icon: MessageIcon,
  },
  {
    title: "Véhicules vérifiés",
    text: "L'état et la présentation sont visibles avant toute discussion commerciale.",
    accent: "#0d9503",
    tone: "border-[rgba(212,160,23,0.18)] bg-[#fffaf0]",
    icon: ShieldIcon,
  },
  {
    title: "Transparence totale",
    text: "Pas de frais cachés, pas de surprises. Le prix communiqué est celui que vous payez pour le véhicule, sans intermédiaires, ni coûts additionnels, sans ambiguïté.",
    accent: "#d62828",
    tone: "border-[rgba(214,40,40,0.14)] bg-[#fff6f6]",
    icon: PriceTagIcon,
  },
];

const logisticsItems = [
  {
    step: "Logistique",
    title: "Importation encadrée",
    text: "Sélection au Canada, acheminement puis remise au client avec une communication simple du début à la fin.",
    icon: ShipIcon,
    accent: "#7a7676",
  },
  {
    step: "Étape 1",
    title: "Validation du choix",
    text: "Vous confirmez le véhicule ou le besoin ciblé, puis l'équipe prépare la suite de l'échange hors ligne.",
    icon: ClipboardIcon,
   accent: "#7a7676",
  },
  {
    step: "Étape 2",
    title: "Suivi jusqu'à Bamako",
    text: "Le contact reste direct pour suivre la disponibilité, les arrivages et les prochaines démarches.",
    icon: RouteIcon,
    accent: "#7a7676",
  },
];

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
        <div className="section-shell flex min-h-[30rem] flex-col items-start gap-5 px-0 py-14 text-white md:items-end md:pl-24 md:text-right lg:min-h-[34rem] lg:py-18 sm:py-20">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur sm:text-base">
            <CountryFlag country="canada" />
            <span>Canada</span>
            <span className="text-white/70">-&gt;</span>
            <CountryFlag country="mali" />
            <span>Mali</span>
          </span>
          <h1 className="max-w-2xl font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-none tracking-tight text-white/80 sm:text-6xl lg:max-w-3xl lg:text-7xl">
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

      <section className="section-shell pb-12">
        <div className="mb-5">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Notre différence
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {differenceItems.map((item) => (
            <div
              key={item.title}
              className={`rounded-2xl border p-5 shadow-[var(--shadow)] ${item.tone}`}
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white sm:h-14 sm:w-14"
                style={{ background: item.accent }}
              >
                <item.icon />
              </div>
              <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell pb-12">
        <div className="mb-5">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold sm:text-3xl">
            Logistique et modalités de paiement
          </h2>
          <p className="text-sm text-slate-600">
            Une prise en charge simple, du choix du véhicule jusqu&apos;à la suite de la discussion.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logisticsItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--line)] bg-white/75 p-5 shadow-[var(--shadow)]"
            >
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white sm:h-14 sm:w-14"
                style={{ background: item.accent }}
              >
                <item.icon />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                {item.step}
              </p>
              <h3 className="mt-1 text-base font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-white/50 bg-white/70 p-5 text-sm text-slate-700 shadow-[var(--shadow)] sm:hidden">
          <p className="font-semibold text-slate-900">Contact rapide</p>
          {publicBootstrap.contact.phone || publicBootstrap.contact.location ? (
            <>
              {publicBootstrap.contact.phone ? <p className="mt-1">{publicBootstrap.contact.phone}</p> : null}
              {publicBootstrap.contact.location ? <p>{publicBootstrap.contact.location}</p> : null}
            </>
          ) : (
            <p className="mt-1">Les coordonnées seront bientôt disponibles.</p>
          )}
        </div>
      </section>
    </div>
  );
}
