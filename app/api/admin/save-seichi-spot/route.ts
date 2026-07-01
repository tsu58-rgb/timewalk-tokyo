import { NextResponse } from "next/server";
import Papa from "papaparse";
import { SPOTS_URL } from "../../../lib/sheetUrls";

async function createNextId() {
  const response = await fetch(`${SPOTS_URL}&cacheBust=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("spots CSV fetch failed");

  const parsed = Papa.parse<Record<string, string>>(await response.text(), {
    header: true,
    skipEmptyLines: true,
  });

  let max = 0;
  for (const row of parsed.data) {
    const id = String(row.id || "").trim();
    if (!id.startsWith("se_")) continue;
    const value = Number(id.slice(3));
    if (Number.isInteger(value)) max = Math.max(max, value);
  }

  return `se_${String(max + 1).padStart(9, "0")}`;
}

export async function POST(request: Request) {
  const body = await request.json();
  const source = body.spot || {};
  const workId = String(source.workId || "").trim();

  if (!workId) {
    return NextResponse.json({ ok: false, error: "workIdは必須です。" }, { status: 400 });
  }

  const currentId = String(source.id || "").trim();
  const id = currentId && currentId !== "新規" ? currentId : await createNextId();

  if (!id.startsWith("se_")) {
    return NextResponse.json({ ok: false, error: "IDはse_から始まる必要があります。" }, { status: 400 });
  }

  const response = await fetch(process.env.GAS_WEB_APP_URL!, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      adminKey: process.env.GAS_ADMIN_KEY,
      action: "save",
      spot: {
        ...source,
        id,
        workId,
        category: "",
        mode: "",
        trivia: "",
        characterIds: "",
      },
    }),
  });

  const result = await response.json();
  return NextResponse.json({ ...result, id: result.id || id });
}
