import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TILE_LAYERS = new Set(["edo-kiriezu", "meiji-rapid", "meiji-tokyo-5000"]);

function asTileNumber(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function upstreamCandidates(layer: string, z: number, x: number, y: number) {
  const tmsY = 2 ** z - 1 - y;

  if (layer === "edo-kiriezu") {
    return [
      `https://mapwarper.h-gis.jp/mosaics/tile/25/${z}/${x}/${y}`,
      `https://mapwarper.h-gis.jp/mosaics/tile/25/${z}/${x}/${y}.png`,
    ];
  }

  if (layer === "meiji-rapid") {
    return [
      `https://boiledorange73.sakura.ne.jp/ws/tile/Kanto_Rapid-900913/${z}/${x}/${y}.png`,
      `https://habs.rad.naro.go.jp/rapid16/${z}/${x}/${tmsY}.png`,
      `https://habs.rad.naro.go.jp/rapid16/${z}/${x}/${y}.png`,
    ];
  }

  if (layer === "meiji-tokyo-5000") {
    return [
      `https://habs.rad.naro.go.jp/tokyo5k/${z}/${x}/${tmsY}.png`,
      `https://habs.rad.naro.go.jp/tokyo5k/${z}/${x}/${y}.png`,
    ];
  }

  return [];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ layer: string; z: string; x: string; y: string }> }
) {
  const { layer, z: zText, x: xText, y: yText } = await params;

  if (!TILE_LAYERS.has(layer)) {
    return NextResponse.json({ error: "未対応の地図レイヤーです。" }, { status: 404 });
  }

  const z = asTileNumber(zText);
  const x = asTileNumber(xText);
  const y = asTileNumber(yText.replace(/\.png$/i, ""));

  if (z === null || x === null || y === null || z > 20) {
    return NextResponse.json({ error: "タイル座標が不正です。" }, { status: 400 });
  }

  for (const url of upstreamCandidates(layer, z, x, y)) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "User-Agent": "TimeWalk historical map tile proxy",
        },
        signal: AbortSignal.timeout(10000),
        next: { revalidate: 86400 },
      });

      const contentType = response.headers.get("content-type") || "";
      if (!response.ok || !contentType.toLowerCase().startsWith("image/")) continue;

      const body = await response.arrayBuffer();
      if (body.byteLength === 0) continue;

      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
          "X-TimeWalk-Tile-Source": new URL(url).hostname,
        },
      });
    } catch (error) {
      console.warn("地図タイルの取得に失敗しました", layer, url, error);
    }
  }

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
