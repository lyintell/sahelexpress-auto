"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../myImg/logo.png";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/inventaire", label: "Inventaire" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[rgba(115,115,115,0.12)] bg-white/96 backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Sahel Express Auto"
            priority
            className="h-auto w-[180px] sm:w-[240px]"
          />
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[rgba(115,115,115,0.16)] bg-[var(--gray-soft)] p-2 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--gold)] !text-black"
                    : "text-slate-700 hover:bg-[var(--gold)] hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="hidden rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#bc8f14] sm:inline-flex"
        >
          Demander des infos
        </Link>
      </div>
    </header>
  );
}