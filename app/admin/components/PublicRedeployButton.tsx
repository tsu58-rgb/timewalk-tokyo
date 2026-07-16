"use client";

import { useEffect, useRef, useState } from "react";

type RedeployStatus = {
  ok?: boolean;
  configured?: boolean;
  active?: boolean;
  lastReadyAt?: string;
  message?: string;
};

function formatDateTime(value?: string) {
  if (!value) return "未取得";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "未取得";
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function getAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window === "undefined") return headers;

  const password = window.localStorage.getItem("timewalkAdminPassword") || "";
  if (password) headers["x-timewalk-admin-password"] = password;
  return headers;
}

export default function PublicRedeployButton() {
  const [status, setStatus] = useState<RedeployStatus | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function loadStatus(silent = false): Promise<RedeployStatus> {
    try {
      const response = await fetch("/api/admin/redeploy", {
        cache: "no-store",
        headers: getAdminHeaders(),
      });
      const json = (await response.json()) as RedeployStatus;
      setStatus(json);
      if (!silent && json.message) setMessage(json.message);
      return json;
    } catch {
      const fallback: RedeployStatus = {
        ok: false,
        configured: false,
        active: false,
        lastReadyAt: "",
        message: "公開反映の状態を取得できませんでした。",
      };
      setStatus(fallback);
      if (!silent) setMessage(fallback.message || "公開反映の状態を取得できませんでした。");
      return fallback;
    }
  }

  function startPolling() {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      const latest = await loadStatus(true);
      if (!latest.active) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = null;
        setLoading(false);
        setMessage("再デプロイが完了している可能性があります。公開ページを確認してください。");
      }
    }, 15000);
  }

  useEffect(() => {
    loadStatus(true);
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const active = Boolean(status?.active) || loading;
  const configured = status?.configured !== false;

  async function redeploy() {
    if (active) {
      setMessage("すでに再ビルド→再デプロイが実行中です。完了まで待ってください。");
      return;
    }

    const confirmed = window.confirm(
      "Google Sheetsの最新データを読み込み、TimeWalk公開ページを再ビルド→再デプロイします。反映には数分かかります。続行しますか？"
    );
    if (!confirmed) return;

    setLoading(true);
    setMessage("公開反映を開始しています...");

    try {
      const response = await fetch("/api/admin/redeploy", {
        method: "POST",
        cache: "no-store",
        headers: getAdminHeaders(),
      });
      const json = (await response.json()) as RedeployStatus;

      if (!response.ok || !json.ok) {
        setLoading(false);
        setMessage(json.message || "公開反映を開始できませんでした。");
        await loadStatus(true);
        return;
      }

      setMessage(json.message || "公開反映を開始しました。反映には数分かかります。");
      await loadStatus(true);
      startPolling();
    } catch {
      setLoading(false);
      setMessage("公開反映を開始できませんでした。");
    }
  }

  return (
    <section className="mb-4 rounded-2xl border-2 border-yellow-300 bg-slate-900 p-4 text-white">
      <div className="mb-3">
        <p className="font-bold text-yellow-300">公開ページ反映</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">
          Google Sheetsの最新データを公開用JSONへ変換し、TimeWalk公開ページを再ビルド→再デプロイします。
        </p>
      </div>

      <p className="mb-3 text-xs text-slate-400">
        前回再デプロイ完了時刻：{formatDateTime(status?.lastReadyAt)}
      </p>

      {status?.active && (
        <p className="mb-3 rounded-xl bg-blue-950 p-3 text-sm text-blue-100">
          現在、再ビルド→再デプロイが実行中です。完了まで追加実行できません。
        </p>
      )}

      {!configured && (
        <p className="mb-3 rounded-xl bg-red-950 p-3 text-sm text-red-100">
          連続実行防止と完了時刻表示に必要なVercel環境変数が未設定です。
        </p>
      )}

      {message && <p className="mb-3 rounded-xl bg-slate-800 p-3 text-sm text-slate-200">{message}</p>}

      <button
        type="button"
        onClick={redeploy}
        disabled={active || !configured}
        className="w-full rounded-xl bg-yellow-300 px-4 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {active ? "公開反映中..." : "公開ページに反映"}
      </button>
    </section>
  );
}
