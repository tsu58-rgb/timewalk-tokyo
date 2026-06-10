import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(process.env.GAS_WEB_APP_URL!, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      adminKey: process.env.GAS_ADMIN_KEY,
      action: "save",
      spot: body.spot,
    }),
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    return NextResponse.json(json);
  } catch {
    console.error("GAS returned non JSON:", text.slice(0, 1000));
    return NextResponse.json(
      {
        ok: false,
        error: "GASがJSONではなくHTMLを返しました。Apps Scriptの実行ログを確認してください。",
        gasResponseHead: text.slice(0, 300),
      },
      { status: 500 }
    );
  }
}
