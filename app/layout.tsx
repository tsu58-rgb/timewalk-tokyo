import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import ContactFooter from "./components/ContactFooter";

export const metadata: Metadata = {
  title: "TimeWalk | 近くの歴史スポットを探せる街歩きガイド",
  description:
    "TimeWalkは、現在地から近くの歴史スポットを表示し、人物・歴史解説・トリビアを楽しめる街歩きガイドアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <ContactFooter />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}