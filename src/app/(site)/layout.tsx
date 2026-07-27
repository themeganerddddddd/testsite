import type { Metadata } from "next";
import { Inter, Newsreader, Source_Serif_4 } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

import "../globals.css";

const headline = Newsreader({
  subsets: ["latin"],
  variable: "--font-headline",
});

const body = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  description:
    "Verified perspectives from inside the institutions that shape public life.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    description:
      "Verified perspectives from inside the institutions that shape public life.",
    siteName: "PUBLIUS",
    title: "PUBLIUS",
    type: "website",
  },
  title: {
    default: "PUBLIUS",
    template: "%s | PUBLIUS",
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headline.variable} ${body.variable} ${sans.variable}`}
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
