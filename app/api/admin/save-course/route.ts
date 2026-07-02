import { NextResponse } from "next/server";

const MAX_IMAGE_DATA_URL_LENGTH = 16_000_000;

export async function POST(request: Request) {
  const body = await request.json();

  if (!process.env.GAS_WEB_APP_URL || !process.env.GAS_ADMIN_KEY) {
    return NextResponse.json(
      { ok: false, error: "GAS_WEB_APP_URL または GAS_ADMIN_KEY が設定されていません。" },
      { status: 500 }
    );
  }

  const imageBase64 = String(body.course?.eyecatchImageBase64 || "");
  if (imageBase64 && !imageBase64.startsWith("data:image/")) {
    return NextResponse.json(
      { ok: false, error: "アイキャッチ画像の形式が不正です。" },
      { status: 400 }
    );
  }
  if (imageBase64.length > MAX_IMAGE_DATA_URL_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "アイキャッチ画像が大きすぎます。12MB以下の画像を選択してください。" },
      { status: 400 }
    );
  }

  const selectedDate = String(body.course?.date || "").trim();
  const course = {
    ...body.course,
    eyecatchImage: String(body.course?.eyecatchImage || "").trim(),
    eyecatchImageBase64: imageBase64,
    removeEyecatchImage: Boolean(body.course?.removeEyecatchImage),
    notes: selectedDate ? `courseDate:${selectedDate}` : String(body.course?.notes || ""),
  };

  const response = await fetch(process.env.GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      adminKey: process.env.GAS_ADMIN_KEY,
      action: "saveCourse",
      course,
      points: body.points,
    }),
  });

  const text = await response.text();

  try {
    const json = JSON.parse(text);
    return NextResponse.json(json, { status: json.ok ? 200 : 400 });
  } catch {
    console.error("GAS returned non JSON:", text.slice(0, 1000));
    return NextResponse.json(
      {
        ok: false,
        error: "GASがコース保存に対応していないか、JSON以外を返しました。GASに saveCourse 処理を追加してください。",
        gasResponseHead: text.slice(0, 300),
      },
      { status: 500 }
    );
  }
}
