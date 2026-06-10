"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { calcDistanceMeters } from "../lib/distance";
import { getReadyCourses } from "../lib/courses";
import { fetchCharacters, fetchEvents, fetchSpots } from "../lib/timewalkData";
import type { Character, EventItem, Spot, SpotWithDistance } from "@/types/timewalk";

const SpotMap = dynamic(() => import("./SpotMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-slate-800 rounded-2xl p-4 mb-4 text-sm text-slate-300">
      地図を読み込み中です。
    </div>
  ),
});

const DISTANCE_OPTIONS = [200, 500, 1000, 2000, 10000];
const DISPLAY_LIMIT = 30;

function splitJapaneseList(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function formatMMDD(date: Date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

function formatDisplayDate(date: Date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

export default function TimeWalkHome() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [screen, setScreen] = useState<"home" | "today">("home");
  const [selectedDistance, setSelectedDistance] = useState(2000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsInitialized, setTagsInitialized] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const readyCourses = getReadyCourses();
  const mapCurrentPosition: [number, number] | null = position
    ? [position.latitude, position.longitude]
    : null;

  useEffect(() => {
    fetchSpots()
      .then(setSpots)
      .catch((err) => {
        console.error(err);
        setError("スポットデータの取得に失敗しました。");
      });
  }, []);

  useEffect(() => {
    fetchCharacters().then(setCharacters).catch(console.error);
  }, []);

  useEffect(() => {
    fetchEvents().then(setEvents).catch(console.error);
  }, []);

  async function fetchAddress(lat: number, lon: number) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja`
      );
      const data = await res.json();
      const a = data.address || {};
      const text = `${a.state || ""}${a.city || a.town || a.village || a.city_district || a.municipality || ""}${a.suburb || a.neighbourhood || a.quarter || a.residential || a.hamlet || ""}`;
      setAddress(text ? `${text}付近` : "現在地付近");
    } catch (e) {
      console.error(e);
    }
  }

  function updatePosition(pos: GeolocationPosition, shouldUpdateAddress = false) {
    setPosition(pos.coords);
    setError("");
    setLocationLoading(false);

    if (shouldUpdateAddress) {
      fetchAddress(pos.coords.latitude, pos.coords.longitude);
    }
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) {
      setError("このブラウザは位置情報に対応していません");
      return;
    }

    setLocationLoading(true);
    setError("現在地を取得中...");

    navigator.geolocation.getCurrentPosition(
      (pos) => updatePosition(pos, true),
      (err) => {
        setError("位置情報が取得できません: " + err.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  }

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => updatePosition(pos, false),
      (err) => console.warn(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    spots.forEach((spot) => splitJapaneseList(spot.category).forEach((cat) => tags.add(cat)));
    return Array.from(tags).sort();
  }, [spots]);

  useEffect(() => {
    if (allTags.length > 0 && !tagsInitialized) {
      setSelectedTags(allTags);
      setTagsInitialized(true);
    }
  }, [allTags, tagsInitialized]);

  const visibleSpots: SpotWithDistance[] = spots
    .map((spot) => ({
      ...spot,
      distance: position
        ? calcDistanceMeters(position.latitude, position.longitude, spot.lat, spot.lng)
        : null,
    }))
    .filter((spot) => {
      if (!position || spot.distance === null) return false;
      if (spot.distance > selectedDistance) return false;
      if (selectedTags.length === 0) return false;
      const categories = splitJapaneseList(spot.category);
      if (categories.length === 0) return selectedTags.length === allTags.length;
      return categories.some((cat) => selectedTags.includes(cat));
    })
    .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    .slice(0, DISPLAY_LIMIT);

  const todayKey = formatMMDD(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowKey = formatMMDD(tomorrowDate);
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = formatMMDD(yesterdayDate);
  const todayEvents = events.filter((event) => event.date === todayKey);
  const tomorrowEvents = events.filter((event) => event.date === tomorrowKey);
  const yesterdayEvents = events.filter((event) => event.date === yesterdayKey);

  if (screen === "today") {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          <button onClick={() => setScreen("home")} className="mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold">
            ← Topに戻る
          </button>
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h1 className="text-xl font-bold mb-4">今日（{formatDisplayDate(new Date())}）は何の日？</h1>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-slate-400">今日の情報は登録されていません。</p>
            ) : (
              <div className="space-y-4">
                {todayEvents.map((event) => (
                  <div key={event.id} className="text-sm text-slate-200 leading-relaxed">
                    {event.memorial && <div className="mb-3" dangerouslySetInnerHTML={{ __html: event.memorial }} />}
                    {event.description && <div dangerouslySetInnerHTML={{ __html: event.description }} />}
                    {event.source_url && <a href={event.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">その他</a>}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              <h2 className="font-bold text-yellow-300 mb-2">明日のできごと</h2>
              {tomorrowEvents.length === 0 ? <p className="text-sm text-slate-400">明日のできごとは登録されていません。</p> : tomorrowEvents.map((event) => <p key={event.id} className="text-sm text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.description }} />)}
            </div>
            <div className="mt-6">
              <h2 className="font-bold text-yellow-300 mb-2">今日のクイズ</h2>
              {todayEvents.some((event) => event.quiz) ? todayEvents.filter((event) => event.quiz).map((event) => <div key={`${event.id}-quiz`} className="text-sm text-slate-200 leading-relaxed" dangerouslySetInnerHTML={{ __html: event.quiz }} />) : <p className="text-sm text-slate-400">なし</p>}
            </div>
            <div className="mt-6">
              <h2 className="font-bold text-yellow-300 mb-2">昨日のクイズの答え</h2>
              {yesterdayEvents.some((event) => event.quiz) ? yesterdayEvents.filter((event) => event.quiz).map((event) => <div key={`${event.id}-answer`} className="text-sm text-slate-200 leading-relaxed"><div dangerouslySetInnerHTML={{ __html: event.quiz }} />{event.quizAnswer && <p className="text-xs text-slate-400 mt-1">答え：<span dangerouslySetInnerHTML={{ __html: event.quizAnswer }} /></p>}</div>) : <p className="text-sm text-slate-400">なし</p>}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <h1 className="text-2xl font-bold text-center mb-1">TimeWalk</h1>
        <p className="text-center text-xs text-slate-300 mb-3">近くの歴史スポットがわかるアプリ</p>
        <button onClick={() => setScreen("today")} className="mb-4 w-full bg-yellow-300 text-black py-3 rounded-xl font-bold">今日は何の日？</button>

        <div className="flex items-center justify-center gap-2 mb-4">
          {address ? (
            <>
              <p className="text-sm text-slate-300">📍 {address}</p>
              <button onClick={getCurrentLocation} className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">{locationLoading ? "更新中" : "更新"}</button>
            </>
          ) : (
            <a href="https://yuru-rekishi-sanpo.com/timewalk#toc11" target="_blank" rel="noopener noreferrer" className="text-sm text-yellow-300 underline font-bold">位置情報サービスをオンにしてください</a>
          )}
        </div>

        <div className="mb-4">
          <SpotMap spots={spots} initialZoom={15} height="360px" currentPosition={mapCurrentPosition} followCurrentLocation />
        </div>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <button onClick={() => setShowCourses(!showCourses)} className={`w-full text-center text-base font-bold ${showCourses ? "border border-white py-2" : ""}`}>おすすめ歴史さんぽコース [{showCourses ? "閉じる" : "開く"}]</button>
          {showCourses && (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-400">迷ったら、この順番で歩いてみよう</p>
              {readyCourses.map((course) => (
                <a key={course.id} href={`/courses/${course.id}`} className="block bg-slate-900 border border-slate-600 rounded-2xl p-4">
                  <div className="flex justify-between gap-3 mb-2">
                    <h2 className="font-bold text-yellow-300">{course.title}</h2>
                    <span className="text-xs text-blue-300 whitespace-nowrap">{course.duration}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{course.description}</p>
                  <p className="text-xs text-slate-400 mt-2">{course.area} / {course.distance}</p>
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <button onClick={() => setShowDetails(!showDetails)} className={`w-full text-center text-base font-bold ${showDetails ? "border border-white py-2" : ""}`}>詳細設定[{showDetails ? "閉じる" : "開く"}]</button>
          {showDetails && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-bold mb-2">表示距離</p>
                <div className="grid grid-cols-5 gap-2">
                  {DISTANCE_OPTIONS.map((distance) => <button key={distance} onClick={() => setSelectedDistance(distance)} className={`py-2 rounded-xl text-sm font-bold ${selectedDistance === distance ? "bg-blue-500 text-white" : "bg-slate-700 text-slate-300"}`}>{distance >= 1000 ? `${distance / 1000}km` : `${distance}m`}</button>)}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold">タグ</p>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedTags(allTags)} className="text-xs bg-white text-black px-2 py-1 rounded-lg font-bold">全選択</button>
                    <button onClick={() => setSelectedTags([])} className="text-xs bg-slate-600 text-white px-2 py-1 rounded-lg font-bold">全解除</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => <button key={tag} onClick={() => setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag])} className={`text-xs px-3 py-2 rounded-full font-bold ${selectedTags.includes(tag) ? "bg-yellow-300 text-black" : "bg-slate-700 text-slate-300"}`}>{tag}</button>)}
                </div>
              </div>
            </div>
          )}
        </section>

        {error && !position && <p className="bg-red-900 rounded-xl p-3 mb-4 text-sm">{error}</p>}
        {!position && !error && <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">基準地点を取得中です。</p>}
        {position && selectedTags.length === 0 && <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">タグが選択されていません。</p>}

        <div className="mb-3">
          <p className="font-bold">近くの歴史スポット</p>
          <p className="text-xs text-slate-400 mt-1">{visibleSpots.length}件（最大{DISPLAY_LIMIT}件表示）</p>
        </div>

        {visibleSpots.length === 0 ? (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">条件に合う登録スポットがありません。</p>
        ) : (
          <div className="space-y-3">
            {visibleSpots.map((spot) => (
              <a key={spot.id} href={`/spot/${spot.id}`} target="_blank" rel="noopener noreferrer" className="block w-full text-left bg-slate-800 rounded-2xl p-4 border border-slate-600">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {splitJapaneseList(spot.category).map((cat) => <span key={cat} className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">{cat}</span>)}
                    </div>
                    <h2 className="text-lg font-bold">{spot.name}{spot.spotsImage ? " 🖼️" : ""}</h2>
                    {splitJapaneseList(spot.characterIds).length > 0 && <p className="text-sm text-slate-300 mt-1">登場人物：{splitJapaneseList(spot.characterIds).map((id) => characters.find((c) => c.characterId === id)?.characterName).filter(Boolean).join("・")}</p>}
                  </div>
                  <div className="text-right text-sm text-blue-300 min-w-[70px]">{spot.distance !== null ? `${Math.floor(spot.distance)}m` : "計測中"}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 text-sm text-slate-400 leading-relaxed">
          TimeWalkは、現在地から近くの歴史スポットを探せる街歩きアプリです。<br /><br />GPSを利用して現在地周辺のスポットを距離順に表示できるため、散歩や観光の途中でも効率よく歴史を学ぶことができます。<br /><br />
          <a href="https://yuru-rekishi-sanpo.com/timewalk" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">▶ TimeWalkの使い方・特徴はこちら</a>
        </div>
      </div>
    </main>
  );
}
