"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

import {
  calculateCourseDistanceKm,
  calculateCourseDurationMin,
  formatCourseDistance,
  formatCourseDuration,
  type Course,
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

type CourseFormState = {
  courseId: string;
  title: string;
  date: string;
  description: string;
  area: string;
  status: string;
  eyecatchImage: string;
  eyecatchImageBase64: string;
  removeEyecatchImage: boolean;
  points: CoursePoint[];
};

function makeCourseId(title: string) {
  const latin = title
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return latin || `course-${Date.now()}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("画像を読み込めませんでした。"));
    reader.readAsDataURL(file);
  });
}

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function serializeCourseForm(form: CourseFormState) {
  return JSON.stringify({
    courseId: form.courseId,
    title: form.title,
    date: form.date,
    description: form.description,
    area: form.area,
    status: form.status,
    eyecatchImage: form.eyecatchImage,
    eyecatchImageBase64: form.eyecatchImageBase64,
    removeEyecatchImage: form.removeEyecatchImage,
    points: form.points,
  });
}

export default function AdminCoursesPage() {
  const [pagePassword, setPagePassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [spots, setSpots] = useState<SelectableSpot[]>([]);
  const [existingCourses, setExistingCourses] = useState<Course[]>([]);
  const [storedCoursePoints, setStoredCoursePoints] = useState<CoursePoint[]>([]);
  const [selectedExistingId, setSelectedExistingId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getTodayDate);
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [courseId, setCourseId] = useState("");
  const [status, setStatus] = useState("draft");
  const [eyecatchImage, setEyecatchImage] = useState("");
  const [eyecatchImageBase64, setEyecatchImageBase64] = useState("");
  const [removeEyecatchImage, setRemoveEyecatchImage] = useState(false);
  const [eyecatchInputKey, setEyecatchInputKey] = useState(0);
  const [points, setPoints] = useState<CoursePoint[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [draggedPointIndex, setDraggedPointIndex] = useState<number | null>(null);
  const [dragOverPointIndex, setDragOverPointIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("timewalkAdminPassword");
    if (saved) setPagePassword(saved);
  }, []);

  async function loadCourseData() {
    const response = await fetch("/api/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePassword }),
    });
    const json = await response.json();
    if (!json.ok) throw new Error(json.error || "コース取得失敗");
    setExistingCourses(json.courses || []);
    setStoredCoursePoints(json.points || []);
    return json;
  }

  useEffect(() => {
    if (!pagePassword) return;

    Promise.all([
      fetch("/api/admin/spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pagePassword }),
      }).then((response) => response.json()),
      loadCourseData(),
    ])
      .then(([spotsJson]) => {
        if (!spotsJson.ok) throw new Error(spotsJson.error || "地点取得失敗");
        setSpots(
          (spotsJson.spots || []).map((spot: any) => ({
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

  const currentSnapshot = useMemo(
    () =>
      serializeCourseForm({
        courseId,
        title,
        date,
        description,
        area,
        status,
        eyecatchImage,
        eyecatchImageBase64,
        removeEyecatchImage,
        points,
      }),
    [
      courseId,
      title,
      date,
      description,
      area,
      status,
      eyecatchImage,
      eyecatchImageBase64,
      removeEyecatchImage,
      points,
    ]
  );

  useEffect(() => {
    if (!savedSnapshot) setSavedSnapshot(currentSnapshot);
  }, [currentSnapshot, savedSnapshot]);

  const isDirty = Boolean(savedSnapshot) && currentSnapshot !== savedSnapshot;

  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function login() {
    if (!passwordInput) return;
    localStorage.setItem("timewalkAdminPassword", passwordInput);
    setPagePassword(passwordInput);
  }

  function confirmDiscardChanges() {
    if (!isDirty) return true;
    return window.confirm("未保存の変更があります。保存せずに画面を切り替えますか？");
  }

  function applyNewCourse() {
    const nextDate = getTodayDate();
    const nextPoints: CoursePoint[] = [];

    setSelectedExistingId("");
    setCourseId("");
    setTitle("");
    setDate(nextDate);
    setDescription("");
    setArea("");
    setStatus("draft");
    setEyecatchImage("");
    setEyecatchImageBase64("");
    setRemoveEyecatchImage(false);
    setEyecatchInputKey((value) => value + 1);
    setPoints(nextPoints);
    setSavedSnapshot(
      serializeCourseForm({
        courseId: "",
        title: "",
        date: nextDate,
        description: "",
        area: "",
        status: "draft",
        eyecatchImage: "",
        eyecatchImageBase64: "",
        removeEyecatchImage: false,
        points: nextPoints,
      })
    );
    setMessage("新規コースを作成します。");
  }

  function requestNewCourse() {
    if (!confirmDiscardChanges()) return;
    applyNewCourse();
  }

  function applyExistingCourse(id: string) {
    const course = existingCourses.find((item) => item.id === id);
    if (!course) return;

    const nextPoints = storedCoursePoints
      .filter((point) => point.courseId === id)
      .sort((a, b) => a.pointOrder - b.pointOrder);
    const nextDate = course.date || getTodayDate();
    const nextDescription = course.description || "";
    const nextArea = course.area || "";
    const nextStatus = course.status || "draft";
    const nextImage = course.eyecatchImage || "";

    setSelectedExistingId(id);
    setCourseId(course.id);
    setTitle(course.title);
    setDate(nextDate);
    setDescription(nextDescription);
    setArea(nextArea);
    setStatus(nextStatus);
    setEyecatchImage(nextImage);
    setEyecatchImageBase64("");
    setRemoveEyecatchImage(false);
    setEyecatchInputKey((value) => value + 1);
    setPoints(nextPoints);
    setSavedSnapshot(
      serializeCourseForm({
        courseId: course.id,
        title: course.title,
        date: nextDate,
        description: nextDescription,
        area: nextArea,
        status: nextStatus,
        eyecatchImage: nextImage,
        eyecatchImageBase64: "",
        removeEyecatchImage: false,
        points: nextPoints,
      })
    );
    setMessage(`既存コースを読み込みました：${course.title}`);
  }

  function requestLoadExistingCourse(id: string) {
    if (id === selectedExistingId) return;
    if (!confirmDiscardChanges()) return;

    if (!id) {
      applyNewCourse();
      return;
    }

    applyExistingCourse(id);
  }

  function addSpot(spot: SelectableSpot) {
    if (saving) return;
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
    if (saving) return;
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
    if (saving) return;
    setPoints((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return normalizeOrders(next);
    });
  }

  function movePointToIndex(fromIndex: number, toIndex: number) {
    if (saving || fromIndex === toIndex) return;
    setPoints((current) => {
      if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return normalizeOrders(next);
    });
  }

  async function onEyecatchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("画像ファイルを選択してください。");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setMessage("アイキャッチ画像は12MB以下にしてください。");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setEyecatchImageBase64(dataUrl);
      setEyecatchImage(dataUrl);
      setRemoveEyecatchImage(false);
      setMessage("アイキャッチ画像を選択しました。コース保存時にCloudinaryへ登録します。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "画像を読み込めませんでした。");
    }
  }

  function clearEyecatch() {
    setEyecatchImage("");
    setEyecatchImageBase64("");
    setRemoveEyecatchImage(true);
    setEyecatchInputKey((value) => value + 1);
  }

  async function saveCourse() {
    if (!date) {
      setMessage("日付を入力してください。");
      return;
    }
    if (!title.trim()) {
      setMessage("タイトルを入力してください。");
      return;
    }
    if (points.length < 2) {
      setMessage("地点を2件以上追加してください。");
      return;
    }

    const finalId = courseId.trim() || makeCourseId(title);
    const normalizedPoints = normalizeOrders(points).map((point) => ({
      ...point,
      courseId: finalId,
    }));

    setCourseId(finalId);
    setSaving(true);
    setMessage(selectedExistingId ? "既存コースを更新中..." : "新規コースを保存中...");

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
            date,
            description: description.trim(),
            area: area.trim(),
            distanceKm: Math.round(distanceKm * 100) / 100,
            durationMin,
            durationLabel: formatCourseDuration(durationMin),
            eyecatchImage: eyecatchImage.startsWith("data:") ? "" : eyecatchImage,
            eyecatchImageBase64,
            removeEyecatchImage,
          },
          points: normalizedPoints,
        }),
      });
      const json = await response.json();
      if (!json.ok) throw new Error(json.error || "保存に失敗しました。");

      const refreshed = await loadCourseData();
      const refreshedCourses: Course[] = refreshed.courses || [];
      const refreshedPoints: CoursePoint[] = refreshed.points || [];
      const savedCourse = refreshedCourses.find((item) => item.id === finalId);
      const savedPointsFromDb = refreshedPoints
        .filter((point) => point.courseId === finalId)
        .sort((a, b) => a.pointOrder - b.pointOrder);
      const nextPoints = savedPointsFromDb.length ? savedPointsFromDb : normalizedPoints;

      const nextTitle = savedCourse?.title || title.trim();
      const nextDate = savedCourse?.date || date;
      const nextDescription = savedCourse?.description || description.trim();
      const nextArea = savedCourse?.area || area.trim();
      const nextStatus = savedCourse?.status || status;
      const responseHasEyecatch = Object.prototype.hasOwnProperty.call(json, "eyecatchImage");
      const nextImage = responseHasEyecatch
        ? String(json.eyecatchImage || "")
        : savedCourse?.eyecatchImage || (removeEyecatchImage ? "" : eyecatchImage.startsWith("data:") ? "" : eyecatchImage);

      setExistingCourses(refreshedCourses);
      setStoredCoursePoints(refreshedPoints);
      setSelectedExistingId(finalId);
      setCourseId(finalId);
      setTitle(nextTitle);
      setDate(nextDate);
      setDescription(nextDescription);
      setArea(nextArea);
      setStatus(nextStatus);
      setEyecatchImage(nextImage);
      setEyecatchImageBase64("");
      setRemoveEyecatchImage(false);
      setEyecatchInputKey((value) => value + 1);
      setPoints(nextPoints);
      setSavedSnapshot(
        serializeCourseForm({
          courseId: finalId,
          title: nextTitle,
          date: nextDate,
          description: nextDescription,
          area: nextArea,
          status: nextStatus,
          eyecatchImage: nextImage,
          eyecatchImageBase64: "",
          removeEyecatchImage: false,
          points: nextPoints,
        })
      );
      setMessage(`${selectedExistingId ? "更新" : "保存"}しました：${finalId}`);
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
        <p>登録済みスポットのピンを押すとスポットを追加します。ピン以外の場所を押した場合は、確認後に経由地として追加できます。</p>

        <div style={{ display: "flex", gap: 8, alignItems: "end", flexWrap: "wrap", margin: "12px 0 16px" }}>
          <div style={{ flex: "1 1 320px" }}>
            <label>既存コースを編集</label>
            <select
              value={selectedExistingId}
              onChange={(event) => requestLoadExistingCourse(event.target.value)}
              disabled={saving}
              style={{ ...inputStyle, marginBottom: 0 }}
            >
              <option value="">新規コース</option>
              {existingCourses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}（{course.status}）</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={requestNewCourse}
            disabled={saving}
            style={{ padding: "10px 16px", fontWeight: "bold" }}
          >
            新規作成に戻す
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(320px, 1fr)", gap: 16 }}>
          <div>
            <AdminCourseMap spots={spots} points={points} onSpotSelect={addSpot} onWaypointAdd={addWaypoint} />
          </div>

          <div style={{ background: "#fff", padding: 16, borderRadius: 12 }}>
            <label>courseId（新規は空欄で自動作成）</label>
            <input value={courseId} onChange={(event) => setCourseId(event.target.value)} readOnly={Boolean(selectedExistingId)} disabled={saving} style={{ ...inputStyle, background: selectedExistingId ? "#eee" : "#fff" }} />
            <label>日付</label>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} disabled={saving} style={inputStyle} />
            <label>タイトル</label>
            <input value={title} onChange={(event) => setTitle(event.target.value)} disabled={saving} style={inputStyle} />
            <label>説明</label>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} disabled={saving} style={{ ...inputStyle, height: 100 }} />
            <label>エリア</label>
            <input value={area} onChange={(event) => setArea(event.target.value)} disabled={saving} style={inputStyle} />
            <label>公開状態</label>
            <select value={status} onChange={(event) => setStatus(event.target.value)} disabled={saving} style={inputStyle}>
              <option value="draft">draft</option>
              <option value="ready">ready</option>
            </select>

            <label>アイキャッチ画像</label>
            <div style={{ margin: "4px 0 12px", border: "1px solid #aaa", borderRadius: 8, padding: 10, background: "#fafafa" }}>
              <input
                key={eyecatchInputKey}
                type="file"
                accept="image/*"
                onChange={onEyecatchChange}
                disabled={saving}
                style={{ display: "block", width: "100%", color: "#111" }}
              />
              <p style={{ margin: "8px 0", fontSize: 12, color: "#555" }}>
                16:9・横1200px以上を推奨。保存時にWebPへ変換してCloudinaryへ登録します。
              </p>
              {eyecatchImage && (
                <>
                  <img
                    src={eyecatchImage}
                    alt="アイキャッチ画像プレビュー"
                    style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover", borderRadius: 6, background: "#111" }}
                  />
                  <button
                    type="button"
                    onClick={clearEyecatch}
                    disabled={saving}
                    style={{ marginTop: 8, padding: "7px 12px", border: "1px solid #b91c1c", borderRadius: 6, background: "#fff", color: "#b91c1c", fontWeight: 700 }}
                  >
                    画像を削除
                  </button>
                </>
              )}
            </div>

            <div style={{ padding: 12, background: "#eef5ff", marginBottom: 12 }}>
              <strong>{formatCourseDistance(distanceKm)} / {formatCourseDuration(durationMin)}</strong>
              <div style={{ fontSize: 12, marginTop: 4 }}>直線距離の合計×1.25、1kmあたり20分で計算</div>
            </div>

            <h2>歩く順番</h2>
            <p style={{ marginTop: -6, marginBottom: 10, fontSize: 12, color: "#555" }}>矢印またはカードのドラッグで順番を変更できます。</p>
            <div style={{ display: "grid", gap: 8 }}>
              {points.map((point, index) => (
                <div
                  key={point.pointId}
                  draggable={!saving}
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", point.pointId);
                    setDraggedPointIndex(index);
                    setDragOverPointIndex(index);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDragOverPointIndex(index);
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    if (draggedPointIndex !== null) movePointToIndex(draggedPointIndex, index);
                    setDraggedPointIndex(null);
                    setDragOverPointIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedPointIndex(null);
                    setDragOverPointIndex(null);
                  }}
                  style={{
                    border: dragOverPointIndex === index ? "2px solid #2563eb" : "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    background: draggedPointIndex === index ? "#eef5ff" : "#fff",
                    opacity: draggedPointIndex === index ? 0.65 : 1,
                    cursor: saving ? "not-allowed" : "grab",
                  }}
                >
                  <div style={{ display: "grid", gridTemplateColumns: "44px minmax(0, 1fr)", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <button type="button" onClick={() => movePoint(index, -1)} disabled={saving || index === 0} title="1つ上へ移動" style={arrowButtonStyle(saving || index === 0)}>▲</button>
                      <strong style={{ display: "flex", width: 34, height: 34, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fde047", border: "2px solid #111", fontSize: 16 }}>{index + 1}</strong>
                      <button type="button" onClick={() => movePoint(index, 1)} disabled={saving || index === points.length - 1} title="1つ下へ移動" style={arrowButtonStyle(saving || index === points.length - 1)}>▼</button>
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span aria-hidden="true" title="ドラッグして順番を変更" style={{ color: "#777", fontSize: 20, lineHeight: 1, cursor: saving ? "not-allowed" : "grab", userSelect: "none" }}>⠿</span>
                        <input value={point.name} disabled={saving} onChange={(event) => setPoints((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, name: event.target.value } : item))} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 8, alignItems: "center" }}>
                        <button type="button" disabled={saving} onClick={() => setPoints((current) => normalizeOrders(current.filter((_, itemIndex) => itemIndex !== index)))} style={{ padding: "5px 10px" }}>削除</button>
                        <span style={{ fontSize: 12, marginLeft: "auto" }}>{point.pointType === "waypoint" ? "経由地" : point.spotId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div
              role="status"
              aria-live="polite"
              style={{
                marginTop: 16,
                marginBottom: 6,
                fontSize: 18,
                fontWeight: 900,
                color: saving ? "#b45309" : isDirty ? "#dc2626" : "#16a34a",
              }}
            >
              {saving ? "保存中" : isDirty ? "未保存" : "保存済み"}
            </div>

            <button onClick={saveCourse} disabled={saving} style={{ width: "100%", padding: 14, fontWeight: "bold", background: "#111", color: "#fff" }}>
              {saving ? "保存中..." : selectedExistingId ? "コースを更新" : "コースを保存"}
            </button>
            <p>{message}</p>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 800px) { main > div > div { grid-template-columns: 1fr !important; } }`}</style>
    </main>
  );
}

function arrowButtonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 36,
    height: 30,
    borderRadius: 7,
    border: "1px solid #999",
    background: disabled ? "#eee" : "#fff",
    color: disabled ? "#aaa" : "#111",
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1,
    cursor: disabled ? "not-allowed" : "pointer",
  };
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
