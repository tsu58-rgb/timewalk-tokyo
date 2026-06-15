import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (!process.env.GAS_WEB_APP_URL || !process.env.GAS_ADMIN_KEY) {
    return NextResponse.json(
      { ok: false, error: "GAS_WEB_APP_URL または GAS_ADMIN_KEY が設定されていません。" },
      { status: 500 }
    );
  }

  const response = await fetch(process.env.GAS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      adminKey: process.env.GAS_ADMIN_KEY,
      action: "saveCourse",
      course: body.course,
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
