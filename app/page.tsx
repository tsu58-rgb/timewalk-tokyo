"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?output=csv";

const DISTANCE_OPTIONS = [
  { label: "200m", value: 200 },
  { label: "500m", value: 500 },
  { label: "1km", value: 1000 },
  { label: "2km", value: 2000 },
  { label: "10km", value: 10000 },
];

const DISPLAY_LIMIT = 30;

type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  area: string;
  category: string;
  characterId: string;
  character: string;
  characterDescription?: string;
  characterImage?: string;
  description: string;
  trivia: string;
  status: string;
};

function calcDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111000;
}

function getCategories(category: string) {
  return category
    .split("・")
    .map((c) => c.trim())
    .filter(Boolean);
}

export default function Home() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [error, setError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDistance, setSelectedDistance] = useState(2000);
  const [tagsInitialized, setTagsInitialized] = useState(false);

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = parsed.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          lat: Number(row.lat),
          lng: Number(row.lng),
          area: row.area,
          category: row.category || "",
          characterId: row.characterId,
          character: row.character,
          characterDescription: row.characterDescription,
          characterImage: row.characterImage,
          description: row.description,
          trivia: row.trivia,
          status: String(row.status || "").trim(),
        }));

        setSpots(data.filter((s) => s.status.toLowerCase() === "ready"));
      });
  }, []);

  const fetchAddress = async (lat: number, lon: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja`
      );
      const data = await res.json();
      const a = data.address || {};

      const ward = a.city || a.town || a.village || a.city_district || "";
      const town =
        a.suburb ||
        a.neighbourhood ||
        a.quarter ||
        a.residential ||
        "";

      const text = `${a.state || ""}${ward}${town}`;

      setAddress(text ? `${text}付近` : "");
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

  const filteredSpots = spots
    .map((spot) => {
      const distance = position
        ? calcDistanceMeters(position.latitude, position.longitude, spot.lat, spot.lng)
        : null;

      return { ...spot, distance };
    })

    .filter((spot) => {
      if (!position || spot.distance === null) return false;
      if (selectedTags.length === 0) return false;
      if (spot.distance > selectedDistance) return false;

      const categories = getCategories(spot.category);

      return categories.some((cat) => selectedTags.includes(cat));
    })
    
    .sort((a, b) => {
      if (a.distance === null || b.distance === null) return 0;
      return a.distance - b.distance;
    })
    .slice(0, DISPLAY_LIMIT);

  if (selectedSpot) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          <button
            onClick={() => setSelectedSpot(null)}
            className="mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold"
          >
            ← Topに戻る
          </button>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${selectedSpot.lat},${selectedSpot.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 bg-green-500 text-white text-center px-4 py-2 rounded-xl font-bold"
          >
            📍 Googleマップで開く
          </a>

          <div className="flex flex-wrap gap-2 mb-3">
            {getCategories(selectedSpot.category).map((cat) => (
              <span
                key={cat}
                className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold"
              >
                {cat}
              </span>
            ))}
          </div>

          <h1 className="text-2xl font-bold mb-4">{selectedSpot.name}</h1>

          <div className="bg-slate-800 rounded-2xl p-4 mb-4">
            {selectedSpot.characterImage && (
              <img
                src={selectedSpot.characterImage}
                alt={selectedSpot.character}
                className="w-full max-h-64 object-contain mb-3 rounded-xl"
              />
            )}

            <h2 className="text-xl font-bold text-center mb-2">
              {selectedSpot.character}
            </h2>

            {selectedSpot.characterDescription && (
              <p
                className="text-sm text-slate-300 text-center"
                dangerouslySetInnerHTML={{
                  __html: selectedSpot.characterDescription,
                }}
              />
            )}
          </div>

          <section className="bg-white text-black rounded-2xl p-4 mb-4">
            <h3 className="font-bold mb-2">歴史解説</h3>
            <div
              className="[&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: selectedSpot.description }}
            />
          </section>

          <section className="bg-yellow-100 text-black rounded-2xl p-4">
            <h3 className="font-bold mb-2">トリビア</h3>
            <div
              className="[&_a]:text-blue-600 [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: selectedSpot.trivia }}
            />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <h1 className="text-2xl font-bold text-center mb-2">TimeWalk Tokyo</h1>

        <p className="text-center text-sm text-slate-300 mb-1">
          {address ? `📍 ${address}` : "📍 現在地取得中..."}
        </p>

        <p className="text-center text-sm text-slate-300 mb-4">
          近くの歴史スポット
        </p>

        <button
          onClick={getCurrentLocation}
          className="mb-4 w-full bg-blue-500 text-white py-3 rounded-xl font-bold"
        >
          {locationLoading ? "現在地を取得中..." : "📍 現在地を更新"}
        </button>

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

        {!position && !error && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            位置情報を取得中...
          </p>
        )}

        {position && filteredSpots.length === 0 && selectedTags.length > 0 && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            条件に合う登録スポットがありません。
          </p>
        )}

        {position && selectedTags.length === 0 && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            タグが選択されていません。
          </p>
        )}
        
        <p className="text-xs text-slate-400 mb-3">
          表示件数：{filteredSpots.length}件（最大{DISPLAY_LIMIT}件）
        </p>

        <div className="space-y-3">
          {filteredSpots.map((spot) => {
            return (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className="w-full text-left bg-slate-800 rounded-2xl p-4 border border-slate-600"
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

                    <h2 className="text-lg font-bold">{spot.name}</h2>

                    <p className="text-sm text-slate-300 mt-1">
                      登場人物：{spot.character}
                    </p>
                  </div>

                  <div className="text-right text-sm text-blue-300 min-w-[70px]">
                    {spot.distance !== null
                      ? `${Math.floor(spot.distance)}m`
                      : "計測中"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 text-sm text-slate-400 leading-relaxed">
          TimeWalk Tokyoは、現在地から近くの歴史スポットを探せる街歩きアプリです。
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
            ▶ TimeWalk Tokyoの使い方・特徴はこちら
          </a>
        </div>
      </div>
    </main>
  );
}