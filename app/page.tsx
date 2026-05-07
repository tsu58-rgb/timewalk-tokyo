"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Papa from "papaparse";

const MapPicker = dynamic(() => import("./components/MapPicker"), {
  ssr: false,
});

const EVENTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1015785763&single=true&output=csv";

const SPOTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1242477641&single=true&output=csv";

const CHARACTERS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1745190060&single=true&output=csv";

const DISTANCE_OPTIONS = [
  { label: "200m", value: 200 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
  { label: "10km", value: 10000 },
];

const DISPLAY_LIMIT = 30;
const DEFAULT_COURSE = "通常";

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
  prefecture: string;
  city: string;
  area: string;
  mode: string;
  category: string;
  characterIds: string;
  description: string;
  trivia: string;
  status: string;
};

type Character = {
  characterId: string;
  characterName: string;
  characterKana?: string;
  characterDescription?: string;
  characterImage?: string;
  wikipediaUrl?: string;
  status?: string;
};

type EventItem = {
  id: string;
  date: string;
  description: string;
  memorial: string;
  source_url: string;
  quiz: string;
};

type SpotWithDistance = Spot & {
  distance: number | null;
};

function calcDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  return (
    Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111000
  );
}

function splitJapaneseList(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function getCharacterIds(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function getCategories(category: string) {
  return splitJapaneseList(category);
}

function getModes(mode: string) {
  const modes = splitJapaneseList(mode);
  return modes.length > 0 ? modes : [DEFAULT_COURSE];
}

function getSpotKey(spot: Spot) {
  return spot.id || `${spot.name}-${spot.lat}-${spot.lng}`;
}

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [error, setError] = useState("");
  const [visitedSpotIds, setVisitedSpotIds] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState(2000);
  const [tagsInitialized, setTagsInitialized] = useState(false);
  const [screen, setScreen] = useState<"home" | "courseSelect" | "today">("home");
  const [baseMode, setBaseMode] = useState<"current" | "custom">("current");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [customPosition, setCustomPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedCourse, setSelectedCourse] = useState(DEFAULT_COURSE);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("visitedSpotIds");

    if (saved) {
      setVisitedSpotIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    fetch(SPOTS_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data as any[]).map((row: any) => ({
          id: row.id || "",
          name: row.name || "",
          lat: Number(row.lat),
          lng: Number(row.lng),
          country: row.country || "",
          prefecture: row.prefecture || "",
          city: row.city || "",
          area: row.area || "",
          mode: row.mode || DEFAULT_COURSE,
          category: row.category || "",
          characterIds: row.characterIds || "",
          description: row.description || "",
          trivia: row.trivia || "",
          status: String(row.status || "").trim(),
        }));

        setSpots(
          data.filter(
            (s) =>
              s.status.toLowerCase() === "ready" &&
              Number.isFinite(s.lat) &&
              Number.isFinite(s.lng)
          )
        );
      })
      .catch((err) => {
        console.error(err);
        setError("スポットデータの取得に失敗しました。");
      });
  }, []);

  useEffect(() => {
    fetch(CHARACTERS_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data as any[]).map((row: any) => ({
          characterId: row.characterId || "",
          characterName: row.characterName || "",
          characterKana: row.characterKana || "",
          characterDescription: row.characterDescription || "",
          characterImage: row.characterImage || "",
          wikipediaUrl: row.wikipediaUrl || "",
          status: row.status || "",
        }));

        setCharacters(data);
      });
  }, []);
  useEffect(() => {
    fetch(EVENTS_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data as any[]).map((row: any) => ({
          id: row.id || "",
          date: row.date || "",
          description: row.description || "",
          memorial: row.memorial || "",
          source_url: row.source_url || "",
          quiz: row.quiz || "",
        }));
        
        setEvents(data);
      });
  }, []);

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja`
      );
      const data = await res.json();
      const a = data.address || {};

      const prefecture = a.state || "";
      const ward =
        a.city ||
        a.town ||
        a.village ||
        a.city_district ||
        a.municipality ||
        "";

      const town =
        a.suburb ||
        a.neighbourhood ||
        a.quarter ||
        a.residential ||
        a.hamlet ||
        "";

      const text = `${prefecture}${ward}${town}`;

      setAddress(text ? `${text}付近` : "現在地付近");
    } catch (e) {
      console.error(e);
    }
  };

  const updatePosition = (coords: GeolocationCoordinates) => {
    setPosition(coords);
    fetchAddress(coords.latitude, coords.longitude);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません");
      return;
    }

    setLocationLoading(true);
    setError("現在地を取得中...");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updatePosition(pos.coords);
        setError("");
        setLocationLoading(false);
      },
      (err) => {
        setError("位置情報が取得できません: " + err.message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      }
    );
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません");
      return;
    }

    setError("位置情報を取得中...");

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        updatePosition(pos.coords);
        setError("");
      },
      (err) => {
        setError("位置情報が取得できません: " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const allCourses = useMemo(() => {
    const courses = new Set<string>();

    spots.forEach((spot) => {
      getModes(spot.mode).forEach((mode) => courses.add(mode));
    });

    const result = Array.from(courses).sort();

    if (!result.includes(DEFAULT_COURSE)) {
      result.unshift(DEFAULT_COURSE);
    } else {
      result.splice(result.indexOf(DEFAULT_COURSE), 1);
      result.unshift(DEFAULT_COURSE);
    }

    return result;
  }, [spots]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();

    spots.forEach((spot) => {
      getCategories(spot.category).forEach((cat) => tags.add(cat));
    });

    return Array.from(tags).sort();
  }, [spots]);

  useEffect(() => {
    if (allTags.length > 0 && !tagsInitialized) {
      setSelectedTags(allTags);
      setTagsInitialized(true);
    }
  }, [allTags, tagsInitialized]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleVisited = (spotId: string) => {
    setVisitedSpotIds((prev) => {
      const next = prev.includes(spotId)
        ? prev.filter((id) => id !== spotId)
        : [...prev, spotId];

      localStorage.setItem("visitedSpotIds", JSON.stringify(next));

      return next;
    });
  };

  const basePosition =
    baseMode === "current"
      ? position
      : customPosition
      ? { latitude: customPosition.lat, longitude: customPosition.lng }
      : null;

  const filteredSpots: SpotWithDistance[] = spots
    .map((spot) => {
      const distance = basePosition
        ? calcDistanceMeters(
            basePosition.latitude,
            basePosition.longitude,
            spot.lat,
            spot.lng
          )
        : null;

      return { ...spot, distance };
    })
    .filter((spot) => {
      if (!basePosition || spot.distance === null) return false;
      if (selectedTags.length === 0) return false;
      if (spot.distance > selectedDistance) return false;

      const modes = getModes(spot.mode);
      if (!modes.includes(selectedCourse)) return false;

      const categories = getCategories(spot.category);
      return categories.some((cat) => selectedTags.includes(cat));
    })
    .sort((a, b) => {
      if (a.distance === null || b.distance === null) return 0;
      return a.distance - b.distance;
    });

  const visibleSpots = filteredSpots.slice(0, DISPLAY_LIMIT);

  const formatMMDD = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}-${dd}`;
  };

  const formatDisplayDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const todayKey = formatMMDD(new Date());

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = formatMMDD(tomorrowDate);

  const todayEvents = events.filter((e) => e.date === todayKey);
  const tomorrowEvents = events.filter((e) => e.date === tomorrowKey);
  
  if (screen === "courseSelect") {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          <button
            onClick={() => setScreen("home")}
            className="mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold"
          >
            ← Topに戻る
          </button>

          <h1 className="text-2xl font-bold mb-4">コース変更</h1>

          <div className="space-y-3">
            {allCourses.map((course) => (
              <button
                key={course}
                onClick={() => {
                  setSelectedCourse(course);
                  setScreen("home");
                }}
                className={`w-full text-left px-4 py-4 rounded-2xl font-bold ${
                  selectedCourse === course
                    ? "bg-blue-500 text-white"
                    : "bg-slate-800 text-slate-200"
                }`}
              >
                {selectedCourse === course ? "✅ " : ""}
                {course}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }  

  if (screen === "today") {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          <button
            onClick={() => setScreen("home")}
            className="mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold"
          >
            ← Topに戻る
          </button>

          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h1 className="text-xl font-bold mb-4">
              今日({formatDisplayDate(new Date())})は何の日？
            </h1>

            {todayEvents.length === 0 ? (
              <p className="text-sm text-slate-400">
                今日の情報は登録されていません。
              </p>
            ) : (
              <div className="space-y-4">
                {todayEvents.map((event) => (
                  <div key={event.id}>
                    {event.memorial && event.memorial.trim() !== "" && (
                      <div className="mb-6 rounded-2xl border border-pink-500 bg-pink-950/40 p-4">
                        {(() => {
                          const parts = String(event.memorial || "").split("<br>");

                          const title = parts[0] || "";
                          const body = parts.slice(1).join("<br>");

                          return (
                            <div className="leading-relaxed">
                              <div className="text-pink-400 font-bold text-lg mb-2">
                                {title}
                              </div>

                              {body && (
                                <div
                                  className="text-sm text-slate-200"
                                  dangerouslySetInnerHTML={{ __html: body }}
                                />
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {event.description && event.description.trim() !== "" && (
                      <div>
                        <h2 className="font-bold text-yellow-300 mb-2">
                          今日のできごと
                        </h2>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: event.description,
                            }}
                          />
                          {event.source_url && (
                            <>
                              {" "}
                              <a
                                href={event.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                              >
                                その他
                              </a>
                            </>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h2 className="font-bold text-yellow-300 mb-2">明日のできごと</h2>

              {tomorrowEvents.length === 0 ? (
                <p className="text-sm text-slate-400">
                  明日のできごとは登録されていません。
                </p>
              ) : (
                <div className="space-y-2">
                  {tomorrowEvents.map((event) => (
                    <p
                      key={event.id}
                      className="text-sm text-slate-200 leading-relaxed"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: event.description,
                        }}
                      />
                      {event.source_url && (
                        <>
                          {" "}
                          <a
                            href={event.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          >
                            その他
                          </a>
                        </>
                      )}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-yellow-300 mb-2">今日のクイズ</h2>

              {todayEvents.some((event) => event.quiz && event.quiz.trim() !== "") ? (
                <div className="space-y-2">
                  {todayEvents
                    .filter((event) => event.quiz && event.quiz.trim() !== "")
                    .map((event) => (
                      <div
                        key={`${event.id}-quiz`}
                        className="text-sm text-slate-200 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: event.quiz }}
                      />
                    ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">なし</p>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <h1 className="text-2xl font-bold text-center mb-2">TimeWalk</h1>

        <button
          onClick={() => setScreen("today")}
          className="mb-4 w-full bg-yellow-300 text-black py-3 rounded-xl font-bold"
        >
          今日はなんの日？
        </button>

        <p className="text-center text-xs text-yellow-300 mb-3">
          訪問済み：{visitedSpotIds.length}件
        </p>

        <div className="flex items-center justify-center gap-2 mb-4">
          <p className="text-sm text-slate-300">
            {address ? `📍 ${address}` : "📍 現在地確認中..."}
          </p>

          <button
            onClick={getCurrentLocation}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap"
          >
            {locationLoading ? "更新中" : "更新"}
          </button>
        </div>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <p className="text-sm text-slate-300 mb-2">現在選択中のコース：</p>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xl font-bold">{selectedCourse}</p>

            <button
              onClick={() => setScreen("courseSelect")}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold whitespace-nowrap"
            >
              コース変更
            </button>
          </div>
        </section>
        
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setBaseMode("current")}
            className={`flex-1 py-2 rounded-xl font-bold ${
              baseMode === "current"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            現在地
          </button>

          <button
            onClick={() => setBaseMode("custom")}
            className={`flex-1 py-2 rounded-xl font-bold ${
              baseMode === "custom"
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            指定地点
          </button>
        </div>

        {baseMode === "custom" && (
          <div className="mb-4 bg-slate-800 rounded-2xl p-3">
            <MapPicker
              onSelect={(lat, lng) => {
                setCustomPosition({ lat, lng });
              }}
            />

            <p className="text-xs mt-2 text-slate-400">
              地図をタップして基準地点を選択
            </p>

            {!customPosition && (
              <p className="text-xs mt-1 text-yellow-300">
                まだ指定地点が選択されていません。
              </p>
            )}
          </div>
        )}

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <p className="font-bold mb-2">表示距離</p>

          <div className="grid grid-cols-5 gap-2">
            {DISTANCE_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDistance(option.value)}
                className={`py-2 rounded-xl text-sm font-bold ${
                  selectedDistance === option.value
                    ? "bg-blue-500 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <p className="font-bold">タグ</p>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTags(allTags)}
                className="text-xs bg-white text-black px-2 py-1 rounded-lg font-bold"
              >
                全選択
              </button>

              <button
                onClick={() => setSelectedTags([])}
                className="text-xs bg-slate-600 text-white px-2 py-1 rounded-lg font-bold"
              >
                全解除
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`text-xs px-3 py-2 rounded-full font-bold ${
                  selectedTags.includes(tag)
                    ? "bg-yellow-300 text-black"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <p className="bg-red-900 rounded-xl p-3 mb-4 text-sm">{error}</p>
        )}

        {!basePosition && !error && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            基準地点を取得中です。
          </p>
        )}

        {basePosition && selectedTags.length === 0 && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            タグが選択されていません。
          </p>
        )}

        <p className="text-xs text-slate-400 mb-3">
          近くの歴史スポット：{visibleSpots.length}件（最大{DISPLAY_LIMIT}件表示）
        </p>

        {visibleSpots.length === 0 ? (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            条件に合う登録スポットがありません。
          </p>
        ) : (
          <div className="space-y-3">
            {visibleSpots.map((spot) => (
              <a
                href={`/spot/${spot.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left bg-slate-800 rounded-2xl p-4 border border-slate-600"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {getCategories(spot.category).map((cat) => (
                        <span
                          key={cat}
                          className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg font-bold">
                      {visitedSpotIds.includes(getSpotKey(spot)) ? "✅ " : ""}
                      {spot.name}
                    </h2>

                    {getCharacterIds(spot.characterIds).length > 0 && (
                      <p className="text-sm text-slate-300 mt-1">
                        登場人物：
                        {getCharacterIds(spot.characterIds)
                          .map(
                            (id) =>
                              characters.find((c) => c.characterId === id)?.characterName
                          )
                          .filter(Boolean)
                          .join("・")}
                      </p>
                  )}
                  </div>

                  <div className="text-right text-sm text-blue-300 min-w-[70px]">
                    {spot.distance !== null
                      ? `${Math.floor(spot.distance)}m`
                      : "計測中"}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-sm text-slate-400 leading-relaxed">
          TimeWalkは、現在地から近くの歴史スポットを探せる街歩きアプリです。
          <br />
          <br />
          GPSを利用して現在地周辺のスポットを距離順に表示できるため、散歩や観光の途中でも効率よく歴史を学ぶことができます。
          <br />
          <br />
          <a
            href="https://yuru-rekishi-sanpo.com/timewalk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            ▶ TimeWalkの使い方・特徴はこちら
          </a>
        </div>
      </div>
    </main>
  );
}