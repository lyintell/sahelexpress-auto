"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import logo from "../myImg/logo.png";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/inventaire", label: "Inventaire" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-[rgba(115,115,115,0.12)] bg-white/96 backdrop-blur-xl">
      <div className="section-shell relative flex items-center justify-between gap-4 py-3 md:py-4">
        <button
          type="button"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-expanded={isMenuOpen}
          aria-controls="site-mobile-menu"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(115,115,115,0.16)] bg-[var(--gray-soft)] text-slate-800 md:hidden"
        >
          <span className="sr-only">Menu</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isMenuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>

        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center md:static md:translate-x-0"
        >
          <Image
            src={logo}
            alt="Sahel Express Auto"
            priority
            className="h-auto w-[150px] sm:w-[190px] md:w-[240px]"
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

        <div className="h-11 w-11 md:hidden" aria-hidden="true" />
      </div>

      {isMenuOpen ? (
        <div className="border-t border-[rgba(115,115,115,0.12)] md:hidden">
          <nav id="site-mobile-menu" className="section-shell flex flex-col gap-2 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--gold)] text-black"
                      : "border border-[rgba(115,115,115,0.14)] bg-white text-slate-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#bc8f14]"
            >
              Demander des infos
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}