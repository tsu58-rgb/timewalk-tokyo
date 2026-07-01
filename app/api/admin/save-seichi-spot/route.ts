import { NextResponse } from "next/server";
import Papa from "papaparse";
import { LANGUAGES_URL, SPOTS_URL } from "../../../lib/sheetUrls";

async function createNextId() {
  const response = await fetch(`${SPOTS_URL}&cacheBust=${Date.now()}`, {
    cache: "no-store",
  });
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

async function getForeignLanguages() {
  const response = await fetch(`${LANGUAGES_URL}&cacheBust=${Date.now()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("languages CSV fetch failed");

  const parsed = Papa.parse<Record<string, string>>(await response.text(), {
    header: true,
    skipEmptyLines: true,
  });

  return Array.from(
    new Set(
      parsed.data
        .map((row) => String(row.lang || "").trim())
        .filter((lang) => lang && lang !== "ja")
    )
  );
}

function createSpotI18nRows(spotId: string, languages: string[]) {
  return languages.map((lang) => ({
    spotId,
    lang,
    name: "",
    kana: "",
    description: "",
    trivia: "",
    sceneTitle: "",
    sceneDescription: "",
    photoCaption: "",
    metaTitle: "",
    metaDescription: "",
    status: "",
    updatedAt: "",
    note: "",
  }));
}

async function postToGas(payload: Record<string, unknown>) {
  const response = await fetch(process.env.GAS_WEB_APP_URL!, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      adminKey: process.env.GAS_ADMIN_KEY,
      ...payload,
    }),
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      ok: false,
      error: "GASがJSON以外を返しました。",
      gasResponseHead: text.slice(0, 300),
    };
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const source = body.spot || {};
  const workId = String(source.workId || "").trim();

  if (!workId) {
    return NextResponse.json(
      { ok: false, error: "workIdは必須です。" },
      { status: 400 }
    );
  }

  const currentId = String(source.id || "").trim();
  const id = currentId && currentId !== "新規" ? currentId : await createNextId();

  if (!id.startsWith("se_")) {
    return NextResponse.json(
      { ok: false, error: "IDはse_から始まる必要があります。" },
      { status: 400 }
    );
  }

  const languages = await getForeignLanguages();
  const spotI18nRows = createSpotI18nRows(id, languages);

  const result = await postToGas({
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
    spotI18nRows,
  });

  if (!result.ok) {
    return NextResponse.json({ ...result, id: result.id || id });
  }

  const i18nResult = await postToGas({
    action: "ensureSpotI18nRows",
    spotId: id,
    languages,
    rows: spotI18nRows,
  });

  return NextResponse.json({
    ...result,
    id: result.id || id,
    i18nOk: Boolean(i18nResult.ok),
    i18nCreated: Number(i18nResult.created || 0),
    i18nExpected: languages.length,
    i18nError: i18nResult.ok ? "" : String(i18nResult.error || "spot_i18n行を作成できませんでした。"),
  });
}
