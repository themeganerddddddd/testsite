import Link from "next/link";

import { getNavigation, getSiteSettings } from "@/lib/data";

type NavLink = {
  href: string;
  label: string;
  order?: number | null;
  visible?: boolean | null;
};

function visibleLinks(links: NavLink[] | null | undefined) {
  return (links || [])
    .filter((link) => link.visible !== false)
    .sort((a, b) => (a.order || 100) - (b.order || 100));
}

export async function SiteHeader() {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);
  const links = visibleLinks(navigation.primaryNavigation as NavLink[]);

  return (
    <header className="border-b thin-rule bg-[var(--panel)]">
      <div className="editorial-container">
        <div className="border-t thin-rule py-7 text-center">
          <Link
            href="/"
            className="font-headline text-5xl font-semibold leading-none tracking-normal sm:text-7xl"
          >
            {settings.publicationName || "PUBLIUS"}
          </Link>
          <p className="mt-2 font-ui text-sm uppercase tracking-[0.22em] text-[var(--muted)]">
            {settings.tagline || "The view from inside."}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[var(--muted)]">
            {settings.description ||
              "Verified perspectives from inside the institutions that shape public life."}
          </p>
        </div>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-t thin-rule py-3 font-ui text-sm uppercase tracking-[0.14em]"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#newsletter"
            className="border border-[var(--foreground)] px-3 py-2 text-xs hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Newsletter
          </Link>
        </nav>
      </div>
    </header>
  );
}
