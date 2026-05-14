"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  clearEditorSession,
  readEditorSession,
  subscribeToEditorSession,
} from "./editorSession";
import { useEditorCurrentUser } from "./editorDataStore";
import { editorNavigation } from "./editorConfig";

const inventoryLinks = editorNavigation.filter((item) => {
  return ["/mode-editeur/marques", "/mode-editeur/modeles", "/mode-editeur/vehicules"].includes(item.href);
});

const profileLinks = editorNavigation.filter((item) => {
  return ["/mode-editeur/mon-profil", "/mode-editeur/mot-de-passe"].includes(item.href);
});

const generalLinks = editorNavigation.filter((item) => {
  return !profileLinks.some((profileItem) => profileItem.href === item.href)
    && !inventoryLinks.some((inventoryItem) => inventoryItem.href === item.href);
});

function NavigationGroup({ title, items, pathname }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</p>
      <div className="space-y-2">
        {items.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[var(--gold)] text-black"
                  : "bg-[var(--gray-soft)] text-slate-700 hover:bg-[var(--gold-soft)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function EditorShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSyncExternalStore(
    subscribeToEditorSession,
    readEditorSession,
    () => null,
  );
  const currentUser = useEditorCurrentUser();

  useEffect(() => {
    if (!session) {
      router.replace("/mode-editeur");
    }
  }, [router, session]);

  const currentSection = useMemo(() => {
    return editorNavigation.find((item) => pathname.startsWith(item.href))?.label ?? "Éditeur";
  }, [pathname]);
  const isAdmin = currentUser?.type_utilisateur === "Admin";
  const userTypeLabel = currentUser?.type_utilisateur === "Admin" ? "Admin" : "Éditeur";

  function handleLogout() {
    clearEditorSession();
    router.replace("/mode-editeur");
  }

  if (!session || !currentUser) {
    return <div className="editor-shell py-12 text-sm text-slate-600">Chargement de l&apos;espace éditeur...</div>;
  }

  return (
    <section className="editor-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel rounded-[2rem] p-5">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Administration</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-800">{currentUser.email}</p>
            <p className="inline-flex w-fit rounded-full bg-[var(--gray-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
              {userTypeLabel}
            </p>
          </div>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold">
            {currentSection}
          </h2>

          <nav className="mt-6 space-y-5">
            <NavigationGroup title="Inventaire" items={inventoryLinks} pathname={pathname} />
            {isAdmin ? <NavigationGroup title="Contenu" items={generalLinks} pathname={pathname} /> : null}
            {profileLinks.length ? <NavigationGroup title="Profil" items={profileLinks} pathname={pathname} /> : null}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-6 w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            Se déconnecter
          </button>
        </aside>

        <div>{children}</div>
      </div>
    </section>
  );
}