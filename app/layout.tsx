import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import "./globals.css";
import ContactFooter from "./components/ContactFooter";
import InternalNavigationManager from "./components/InternalNavigationManager";
import NominatimPrefectureGuard from "./components/NominatimPrefectureGuard";
import PwaRegister from "./components/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://timewalk.yuru-rekishi-sanpo.com"),
  title: "TimeWalk | 近くの歴史スポットを探せる街歩きガイド",
  description:
    "TimeWalkは、現在地から近くの歴史スポットを表示し、人物・歴史解説・トリビアを楽しめる街歩きガイドアプリです。",
  applicationName: "TimeWalk",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "512x512" }],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "TimeWalk",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#020617",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <PwaRegister />
        <Suspense fallback={null}>
          <InternalNavigationManager />
        </Suspense>
        <NominatimPrefectureGuard />
        {children}
        <ContactFooter />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
