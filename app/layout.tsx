import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeWalk Tokyo | 近くの歴史スポットを探せる街歩きガイド",
  description:
    "TimeWalk Tokyoは、現在地から近くの歴史スポットを表示し、人物・歴史解説・トリビアを楽しめる街歩きガイドアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}