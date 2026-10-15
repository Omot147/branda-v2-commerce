import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: { default: "Branda — Thoughtful Everyday Goods", template: "%s | Branda" },
  description: "Discover useful, thoughtfully designed essentials for work, home and everyday life.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: { title: "Branda", description: "Thoughtful everyday goods.", type: "website" },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><CartProvider><div className="topbar">Thoughtful essentials, delivered to your door · Free delivery over ₦50,000</div><SiteHeader />{children}<SiteFooter /></CartProvider></body></html>;
}
