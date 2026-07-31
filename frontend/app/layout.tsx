import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Karla } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Karla({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://panorama-des-roses.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Panorama des Roses | Appartements neufs à Chilly",
    template: "%s | Panorama des Roses",
  },
  description:
    "17 appartements de 30 à 132 m² à Chilly, entre bâtiment patrimonial réhabilité et architecture contemporaine, à proximité d’Annecy et Genève.",
  keywords: [
    "immobilier Chilly",
    "appartement neuf Haute-Savoie",
    "programme immobilier Annecy",
    "Panorama des Roses",
    "logement neuf 74",
  ],
  authors: [{ name: "Panorama des Roses" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName: "Panorama des Roses",
    title: "Panorama des Roses — La douceur de vivre à Chilly",
    description:
      "17 logements dans un écrin bucolique, entre patrimoine préservé et modernité raffinée.",
    images: [{ url: "/images/hero-placeholder.webp", width: 1920, height: 1280 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Panorama des Roses",
    description: "17 appartements d’exception à Chilly, en Haute-Savoie.",
    images: ["/images/hero-placeholder.webp"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fdfaf5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
