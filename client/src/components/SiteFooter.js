import Image from "next/image";
import Link from "next/link";
import logo from "../myImg/logo.png";

export default function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-white/40 bg-white/60 py-8 backdrop-blur-xl">
      <div className="section-shell flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Image
            src={logo}
            alt="Sahel Express Auto"
            className="h-auto w-[170px]"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/">Accueil</Link>
          <Link href="/inventaire">Inventaire</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
}