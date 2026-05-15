import Image from "next/image";
import Link from "next/link";
import { getPublicBootstrap } from "../lib/publicBootstrap";
import logo from "../myImg/logo.png";

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
      className="h-4 w-4"
    >
      {children}
    </svg>
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

function ShieldIcon() {
  return (
    <IconBase>
      <path d="M12 3l7 3v5c0 4.4-2.9 8.4-7 9.8C7.9 19.4 5 15.4 5 11V6l7-3Z" />
      <path d="M9.5 11.8l1.7 1.7 3.3-3.8" />
    </IconBase>
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
    text: "Décrivez le modèle recherché et l'équipe vous répond rapidement.",
    tone: "bg-[var(--gray-soft)]",
    icon: MessageIcon,
  },
  {
    title: "Véhicules vérifiés",
    text: "L'état et la présentation sont visibles avant toute discussion.",
    tone: "bg-[#fffaf0]",
    icon: ShieldIcon,
  },
  {
    title: "Transparence totale",
    text: "Le prix annoncé reste clair, sans frais cachés ni ambiguïté.",
    tone: "bg-[#fff6f6]",
    icon: PriceTagIcon,
  },
];

const logisticsItems = [
  {
    title: "Importation encadrée",
    text: "Sélection au Canada, acheminement puis remise au client.",
    icon: ShipIcon,
  },
  {
    title: "Validation du choix",
    text: "Vous confirmez le besoin ciblé avant la suite des échanges.",
    icon: ClipboardIcon,
  },
  {
    title: "Suivi jusqu'à Bamako",
    text: "Le contact reste direct pendant tout le parcours.",
    icon: RouteIcon,
  },
];

export default async function SiteFooter() {
  const publicBootstrap = await getPublicBootstrap();

  return (
    <footer className="mt-14 border-t border-white/40 bg-white/70 py-8 backdrop-blur-xl sm:py-10">
      <div className="section-shell space-y-6 text-sm text-slate-600">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-5 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Notre différence</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {differenceItems.map((item) => (
                <div key={item.title} className={`rounded-[1.25rem] border border-[var(--line)] p-3 ${item.tone}`}>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--gold)] text-black">
                    <item.icon />
                  </span>
                  <p className="mt-3 text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/85 p-5 shadow-[var(--shadow)]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Logistique et paiement</p>
            <div className="mt-4 grid gap-3">
              {logisticsItems.map((item) => (
                <div key={item.title} className="rounded-[1.25rem] border border-[var(--line)] bg-[var(--gray-soft)] p-3">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white">
                      <item.icon />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.6rem] border border-[var(--line)] bg-white/90 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div>
          <Image
            src={logo}
            alt="Sahel Express Auto"
            className="h-auto w-[170px]"
          />
            </div>
            <div className="flex flex-wrap gap-4 font-medium text-slate-700">
              <Link href="/">Accueil</Link>
              <Link href="/inventaire">Inventaire</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </div>

          <div className="text-sm text-slate-600 sm:text-right">
            <p className="font-semibold text-slate-900">Contact</p>
            {publicBootstrap.contact.phone ? <p className="mt-1">{publicBootstrap.contact.phone}</p> : null}
            {publicBootstrap.contact.email ? <p>{publicBootstrap.contact.email}</p> : null}
            {publicBootstrap.contact.location ? <p>{publicBootstrap.contact.location}</p> : null}
          </div>
        </div>
      </div>
    </footer>
  );
}