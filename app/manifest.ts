import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TimeWalk｜歴史を学べる街歩き・観光アプリ",
    short_name: "TimeWalk",
    description:
      "現在地から近くの歴史スポットや歴史散歩コースを探せる街歩きガイドアプリです。",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#020617",
    theme_color: "#020617",
    lang: "ja",
    categories: ["travel", "education", "navigation"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
