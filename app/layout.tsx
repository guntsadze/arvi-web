import { Inter } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arvi | Drive. Share. Connect.",
    template: "%s | Arvi",
  },
  description: "არვი — ქართული ავტომოყვარულთა სოციალური ქსელი. ",
  keywords: [
    "arvi",
    "arvi ge",
    "arvi.ge",
    "არვი",
    "არვი გე",
    "ავტომოყვარუები",
    "სოციალური ქსელი",
    "ქართული ავტომოყვარულთა სოციალური ქსელი",
    "მანქანები საქართველო",
    "georgia social network",
    "car marketplace georgia",
  ],
  metadataBase: new URL("https://arvi.ge"),
  icons: {
    icon: "/logo.webp",
    shortcut: "/logo.webp",
    apple: "/logo.webp",
  },
  // ✅ Open Graph — Telegram, WhatsApp, Facebook
  openGraph: {
    title: "Arvi | Drive. Share. Connect.",
    description: "არვი — ქართული სოციალური ქსელი",
    url: "https://arvi.ge",
    siteName: "Arvi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Arvi Social Network",
      },
    ],
    locale: "ka_GE",
    type: "website",
  },
  // ✅ Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Arvi | Drive. Share. Connect.",
    description: "არვი — ქართული სოციალური ქსელი",
    images: ["/og-image.png"],
  },
  // ✅ Canonical URL
  alternates: {
    canonical: "https://arvi.ge",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
