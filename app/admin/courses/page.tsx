"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import {
  calculateCourseDistanceKm,
  calculateCourseDurationMin,
  formatCourseDistance,
  formatCourseDuration,
  type CoursePoint,
} from "../../lib/courses";

const AdminCourseMap = dynamic(() => import("../../components/AdminCourseMap"), {
  ssr: false,
  loading: () => <div style={{ height: 480, background: "#eee", padding: 16 }}>地図を読み込み中です。</div>,
});

type SelectableSpot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  spotsImage?: string;
  description?: string;
};

function makeCourseId(title: string) {
  const latin = title
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return latin || `course-${Date.now()}`;
}

export default function AdminCoursesPage() {
  const [pagePassword, setPagePassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [spots, setSpots] = useState<SelectableSpot[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("draft");
  const [mode, setMode] = useState<"spot" | "waypoint">("spot");
  const [points, setPoints] = useState<CoursePoint[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("timewalkAdminPassword");
    if (saved) setPagePassword(saved);
  }, []);

  useEffect(() => {
    if (!pagePassword) return;
    fetch("/api/admin/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePassword }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.ok) throw new Error(json.error || "取得失敗");
        setSpots(
          (json.spots || []).map((spot: any) => ({
            id: String(spot.id || ""),
            name: String(spot.name || ""),
            lat: Number(spot.lat),
            lng: Number(spot.lng),
            spotsImage: String(spot.spotsImage || ""),
            description: String(spot.description || ""),
          }))
        );
      })
      .catch((error) => setMessage(error.message));
  }, [pagePassword]);

  const distanceKm = useMemo(() => calculateCourseDistanceKm(points), [points]);
  const durationMin = useMemo(() => calculateCourseDurationMin(distanceKm), [distanceKm]);

  function login() {
    if (!passwordInput) return;
    localStorage.setItem("timewalkAdminPassword", passwordInput);
    setPagePassword(passwordInput);
  }

  function addSpot(spot: SelectableSpot) {
    setPoints((current) => {
      const nextOrder = current.length + 1;
      return [
        ...current,
        {
          courseId: courseId || "new-course",
          pointOrder: nextOrder,
          pointType: "spot",
          spotId: spot.id,
          pointId: `point-${Date.now()}-${nextOrder}`,
          name: spot.name,
          lat: spot.lat,
          lng: spot.lng,
          imageUrl: spot.spotsImage || "",
          description: spot.description || "",
        },
      ];
    });
  }

  function addWaypoint(lat: number, lng: number) {
    setPoints((current) => {
      const nextOrder = current.length + 1;
      return [
        ...current,
        {
          courseId: courseId || "new-course",
          pointOrder: nextOrder,
          pointType: "waypoint",
          spotId: "",
          pointId: `waypoint-${Date.now()}-${nextOrder}`,
          name: `経由地 ${nextOrder}`,
          lat,
          lng,
          imageUrl: "",
          description: "",
        },
      ];
    });
  }

  function normalizeOrders(next: CoursePoint[]) {
    return next.map((point, index) => ({ ...point, pointOrder: index + 1 }));
  }

  function movePoint(index: number, direction: -1 | 1) {
    setPoints((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeOrders(next);
    });
  }

  async function saveCourse() {
    if (!title.trim()) {
      setMessage("タイトルを入力してください。");
      return;
    }
    if (points.length < 2) {
      setMessage("地点を2件以上追加してください。");
      return;
    }

    const finalId = courseId.trim() || makeCourseId(title);
    setCourseId(finalId);
    setSaving(true);
    setMessage("保存中...");

    try {
      const response = await fetch("/api/admin/save-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagePassword,
          course: {
            courseId: finalId,
            status,
            title: title.trim(),
            description: description.trim(),
            area: area.trim(),
            distanceKm: Math.round(distanceKm * 100) / 100,
            durationMin,
            durationLabel: formatCourseDuration(durationMin),
          },
          points: normalizeOrders(points).map((point) => ({ ...point, courseId: finalId })),
        }),
      });
      const json = await response.json();
      if (!json.ok) throw new Error(json.error || "保存に失敗しました。");
      setMessage(`保存しました：${finalId}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "保存に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  if (!pagePassword) {
    return (
      <main style={{ padding: 24 }}>
        <h1>散歩コース管理</h1>
        <input
          type="password"
          value={passwordInput}
          onChange={(event) => setPasswordInput(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && login()}
          placeholder="管理パスワード"
          style={{ display: "block", width: "100%", maxWidth: 420, padding: 10, marginBottom: 10 }}
        />
        <button onClick={login} style={{ padding: "10px 20px", fontWeight: "bold" }}>ログイン</button>
      </main>
    );
  }

  return (
    <main style={{ padding: 16, background: "#f4f4f4", color: "#111", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1>散歩コース管理</h1>
        <p>赤いピンを選ぶと歴史スポットを追加します。経由地追加モードでは地図上の任意の場所を押してください。</p>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)", gap: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <button onClick={() => setMode("spot")} style={{ padding: 10, fontWeight: "bold", background: mode === "spot" ? "#111" : "#fff", color: mode === "spot" ? "#fff" : "#111" }}>スポット選択</button>
              <button onClick={() => setMode("waypoint")} style={{ padding: 10, fontWeight: "bold", background: mode === "waypoint" ? "#2563eb" : "#fff", color: mode === "waypoint" ? "#fff" : "#111" }}>経由地追加</button>
            </div>
            <AdminCourseMap spots={spots} points={points} mode={mode} onSpotSelect={addSpot} onWaypointAdd={addWaypoint} />
          </div>

          <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
            <label>courseId（空欄なら自動作成）</label>
            <input value={courseId} onChange={(event) => setCourseId(event.target.value)} style={inputStyle} />
            <label>タイトル</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} style={inputStyle} />
            <label>説明</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} style={{ ...inputStyle, height: 100 }} />
            <label>エリア</label>
            <input value={area} onChange={(event) => setArea(event.target.value)} style={inputStyle} />
            <label>公開状態</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} style={inputStyle}>
              <option value="draft">draft</option>
              <option value="ready">ready</option>
            </select>

            <div style={{ padding: 12, background: "#eef5ff", marginBottom: 12 }}>
              <strong>{formatCourseDistance(distanceKm)} / {formatCourseDuration(durationMin)}</strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>直線距離の合計×1.25、1kmあたり20分で計算</div>
            </div>

            <h2>歩く順番</h2>
            <div style={{ display: "grid", gap: 8 }}>
              {points.map((point, index) => (
                <div key={point.pointId} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <strong>{index + 1}</strong>
                    <input
                      value={point.name}
                      onChange={(event) => setPoints((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))}
                      style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <button onClick={() => movePoint(index, -1)}>↑</button>
                    <button onClick={() => movePoint(index, 1)}>↓</button>
                    <button onClick={() => setPoints((current) => normalizeOrders(current.filter((_, itemIndex) => itemIndex !== index)))}>削除</button>
                    <span style={{ fontSize: 12, marginLeft: "auto" }}>{point.pointType === "waypoint" ? "経由地" : point.spotId}</span>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={saveCourse} disabled={saving} style={{ width: "100%", padding: 14, marginTop: 16, fontWeight: "bold", background: "#111", color: "#fff" }}>
              {saving ? "保存中..." : "コースを保存"}
            </button>
            <p>{message}</p>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { main > div > div { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  padding: 10,
  margin: "4px 0 12px",
  border: "1px solid #aaa",
  borderRadius: 6,
};
