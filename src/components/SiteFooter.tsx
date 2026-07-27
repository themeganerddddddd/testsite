import Link from "next/link";

import { getNavigation, getSiteSettings } from "@/lib/data";

type FooterGroup = {
  groupLabel: string;
  links?: Array<{
    href: string;
    label: string;
    order?: number | null;
    visible?: boolean | null;
  }> | null;
};

export async function SiteFooter() {
  const [settings, navigation] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);
  const groups = (navigation.footerNavigation || []) as FooterGroup[];

  return (
    <footer className="mt-20 border-t thin-rule bg-[var(--paper)]">
      <div className="editorial-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <section>
            <p className="font-headline text-4xl font-semibold">PUBLIUS</p>
            <p className="mt-3 max-w-md text-[var(--muted)]">
              {settings.footerCopy ||
                "Publius publishes verified perspectives from people who understand institutions firsthand."}
            </p>
          </section>
          {groups.map((group) => (
            <section key={group.groupLabel}>
              <h2 className="font-ui text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                {group.groupLabel}
              </h2>
              <ul className="mt-4 space-y-2 font-ui text-sm">
                {(group.links || [])
                  .filter((link) => link.visible !== false)
                  .sort((a, b) => (a.order || 100) - (b.order || 100))
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="hover:text-[var(--accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-10 border-t thin-rule pt-5 font-ui text-xs text-[var(--muted)]">
          {settings.copyrightNotice || "Copyright (c) 2026 Publius."}
        </div>
      </div>
    </footer>
  );
}
