import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type VercelDeployment = {
  uid?: string;
  id?: string;
  name?: string;
  url?: string;
  state?: string;
  target?: string | null;
  createdAt?: number;
  buildingAt?: number;
  ready?: number;
  readyState?: string;
};

const ACTIVE_STATES = new Set(["QUEUED", "INITIALIZING", "BUILDING", "DEPLOYING"]);
const SUCCESS_STATES = new Set(["READY"]);

function vercelApiUrl() {
  const projectId = process.env.VERCEL_PROJECT_ID || process.env.TIMEWALK_VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID || process.env.TIMEWALK_VERCEL_TEAM_ID;
  if (!projectId) return "";

  const url = new URL("https://api.vercel.com/v6/deployments");
  url.searchParams.set("projectId", projectId);
  url.searchParams.set("limit", "20");
  if (teamId) url.searchParams.set("teamId", teamId);
  return url.toString();
}

async function fetchDeploymentStatus() {
  const token = process.env.VERCEL_TOKEN || process.env.TIMEWALK_VERCEL_TOKEN;
  const url = vercelApiUrl();

  if (!token || !url) {
    return {
      ok: false,
      configured: false,
      active: false,
      activeDeployment: null as VercelDeployment | null,
      lastReadyDeployment: null as VercelDeployment | null,
      lastReadyAt: "",
      message:
        "VERCEL_TOKEN と VERCEL_PROJECT_ID が未設定のため、再デプロイ中判定と前回完了時刻を取得できません。",
    };
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Vercel deployments API failed: ${response.status} ${detail}`);
  }

  const json = await response.json();
  const deployments: VercelDeployment[] = Array.isArray(json.deployments) ? json.deployments : [];
  const productionDeployments = deployments.filter((deployment) =>
    deployment.target ? deployment.target === "production" : true
  );

  const activeDeployment =
    productionDeployments.find((deployment) => ACTIVE_STATES.has(String(deployment.state || "").toUpperCase())) || null;
  const lastReadyDeployment =
    productionDeployments.find((deployment) => SUCCESS_STATES.has(String(deployment.state || "").toUpperCase())) || null;
  const readyTime = lastReadyDeployment?.ready || lastReadyDeployment?.createdAt || 0;

  return {
    ok: true,
    configured: true,
    active: Boolean(activeDeployment),
    activeDeployment,
    lastReadyDeployment,
    lastReadyAt: readyTime ? new Date(readyTime).toISOString() : "",
    message: "",
  };
}

export async function GET() {
  try {
    const status = await fetchDeploymentStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        active: false,
        activeDeployment: null,
        lastReadyDeployment: null,
        lastReadyAt: "",
        message: error instanceof Error ? error.message : "Vercelの状態取得に失敗しました。",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  const hookUrl = process.env.TIMEWALK_DEPLOY_HOOK_URL;
  if (!hookUrl) {
    return NextResponse.json(
      {
        ok: false,
        message: "TIMEWALK_DEPLOY_HOOK_URL が未設定です。Vercel Deploy Hook URLを環境変数に登録してください。",
      },
      { status: 500 }
    );
  }

  try {
    const status = await fetchDeploymentStatus();
    if (!status.configured) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "VERCEL_TOKEN と VERCEL_PROJECT_ID が未設定です。連続実行防止と前回完了時刻表示のため、先に環境変数を設定してください。",
        },
        { status: 500 }
      );
    }

    if (status.active) {
      return NextResponse.json(
        {
          ok: false,
          alreadyRunning: true,
          message: "すでに再ビルド→再デプロイが実行中です。完了まで待ってください。",
          status,
        },
        { status: 409 }
      );
    }

    const response = await fetch(hookUrl, {
      method: "POST",
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          message: `Vercel Deploy Hookの実行に失敗しました: ${response.status} ${detail}`,
        },
        { status: 500 }
      );
    }

    const deployment = await response.json().catch(() => null);

    return NextResponse.json({
      ok: true,
      message: "公開反映を開始しました。反映には数分かかります。",
      deployment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "公開反映の開始に失敗しました。",
      },
      { status: 500 }
    );
  }
}
