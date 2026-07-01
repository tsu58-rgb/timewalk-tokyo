import { NextResponse } from "next/server";
import Papa from "papaparse";

import { WORKS_URL } from "../../../lib/sheetUrls";

export async function GET() {
  const response = await fetch(`${WORKS_URL}&cacheBust=${Date.now()}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `works CSV取得失敗: ${response.status}` },
      { status: 502 }
    );
  }

  const parsed = Papa.parse<Record<string, string>>(await response.text(), {
    header: true,
    skipEmptyLines: true,
  });

  const works = parsed.data
    .map((row) => ({
      workId: String(row.workId || "").trim(),
      workTitle: String(row.workTitle || "").trim(),
    }))
    .filter((work) => work.workId)
    .sort((a, b) => a.workId.localeCompare(b.workId));

  return NextResponse.json({ ok: true, works });
}
