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
        <div className="border-t thin-rule py-4 text-center sm:py-7">
          <p className="mb-2 font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--muted)] sm:hidden">
            Independent workplace reporting
          </p>
          <Link
            href="/"
            className="font-headline text-[2.75rem] font-semibold leading-none tracking-normal sm:text-7xl"
          >
            {settings.publicationName || "PUBLIUS"}
          </Link>
          <p className="mt-1 font-ui text-xs uppercase tracking-[0.22em] text-[var(--muted)] sm:mt-2 sm:text-sm">
            {settings.tagline || "The view from inside."}
          </p>
          <p className="mx-auto mt-4 hidden max-w-2xl text-base text-[var(--muted)] sm:block">
            {settings.description ||
              "Verified perspectives from inside the institutions that shape public life."}
          </p>
        </div>
        <nav
          aria-label="Primary"
          className="flex items-center gap-x-5 overflow-x-auto whitespace-nowrap border-t thin-rule py-3 font-ui text-xs uppercase tracking-[0.14em] sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-3 sm:text-sm"
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
