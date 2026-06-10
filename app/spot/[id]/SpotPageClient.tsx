"use client";

import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

import { calcDistanceMeters } from "../../lib/distance";

const SPOTS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1242477641&single=true&output=csv";

const CHARACTERS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?gid=1745190060&single=true&output=csv";

type Spot = {
  id: string;
  name: string;
  kana: string;
  lat: number;
  lng: number;
  category: string;
  characterIds: string;
  description: string;
  trivia: string;
  status: string;
  mode: string;
  spotsImage: string;
};

type NearbySpot = Spot & {
  distance: number;
};

type Character = {
  characterId: string;
  characterName: string;
  characterKana?: string;
  characterYears?: string;
  characterDescription?: string;
  characterImage?: string;
  wikipediaUrl?: string;
};

function getCharacterIds(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function splitJapaneseList(value: string) {
  return String(value || "")
    .split("・")
    .map((v) => v.trim())
    .filter(Boolean);
}

function stripHtml(value: string) {
  return String(value || "").replace(/<[^>]*>/g, "").trim();
}

export default function SpotPageClient({ id }: { id: string }) {
  const [spot, setSpot] = useState<Spot | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [spotImageError, setSpotImageError] = useState(false);
  const [characterImageErrors, setCharacterImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(SPOTS_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        });

        const data = (parsed.data as any[])
          .map((row: any) => ({
            id: row.id || "",
            name: row.name || "",
            kana: row.kana || "",
            lat: Number(row.lat),
            lng: Number(row.lng),
            category: row.category || "",
            characterIds: row.characterIds || "",
            description: row.description || "",
            trivia: row.trivia || "",
            status: String(row.status || "").trim(),
            mode: row.mode || "",
            spotsImage: row.spotsImage || "",
          }))
          .filter(
            (item) =>
              item.status.toLowerCase() === "ready" &&
              Number.isFinite(item.lat) &&
              Number.isFinite(item.lng) &&
              !String(item.mode || "").includes("除外")
          );

        setSpots(data);
        setSpot(data.find((s) => s.id === id) || null);
        setLoading(false);
      });

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
          characterYears: row.characterYears || "",
          characterDescription: row.characterDescription || "",
          characterImage: row.characterImage || "",
          wikipediaUrl: row.wikipediaUrl || "",
        }));

        setCharacters(data);
      });
  }, [id]);

  useEffect(() => {
    setSpotImageError(false);
  }, [spot?.id]);

  const nearbySpots: NearbySpot[] = useMemo(() => {
    if (!spot) return [];

    return spots
      .filter((candidate) => candidate.id !== spot.id)
      .map((candidate) => ({
        ...candidate,
        distance: calcDistanceMeters(spot.lat, spot.lng, candidate.lat, candidate.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [spot, spots]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          読み込み中...
        </div>
      </main>
    );
  }

  if (!spot) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          スポットが見つかりません。
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${spot.lat},${spot.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4 bg-green-500 text-white text-center px-4 py-2 rounded-xl font-bold"
        >
          📍 Googleマップで開く
        </a>

        <div className="flex flex-wrap gap-2 mb-3">
          {splitJapaneseList(spot.category).map((cat) => (
            <span key={cat} className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold">
              {cat}
            </span>
          ))}
        </div>

        {spot.kana && spot.kana.trim() !== "" && <p className="text-xs text-slate-400 mb-1">{spot.kana}</p>}

        <h1 className="text-2xl font-bold mb-4">{spot.name}</h1>
        
        {spot.spotsImage && spot.spotsImage.trim() !== "" && !spotImageError && (
          <img
            src={spot.spotsImage}
            alt={spot.name}
            onError={() => setSpotImageError(true)}
            className="w-full h-auto mb-4 rounded-xl"
          />
        )}

        {spot.description && spot.description.trim() !== "" && (
          <section className="bg-white text-black rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-2">歴史解説</h2>
            <div dangerouslySetInnerHTML={{ __html: spot.description }} />
          </section>
        )}

        {spot.trivia && spot.trivia.trim() !== "" && (
          <section className="bg-yellow-100 text-black rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-2">トリビア</h2>
            <div dangerouslySetInnerHTML={{ __html: spot.trivia }} />
          </section>
        )}

        {nearbySpots.length > 0 && (
          <section className="bg-slate-800 rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-3">近くのスポット</h2>
            <div className="space-y-3">
              {nearbySpots.map((nearby) => {
                const summary = stripHtml(nearby.description);

                return (
                  <a key={nearby.id} href={`/spot/${nearby.id}`} className="block bg-slate-900 border border-slate-600 rounded-2xl p-4">
                    <div className="flex justify-between gap-3 mb-1">
                      <h3 className="font-bold">{nearby.name}{nearby.spotsImage ? " 🖼️" : ""}</h3>
                      <span className="text-xs text-blue-300 whitespace-nowrap">
                        {nearby.distance >= 1000 ? `${(nearby.distance / 1000).toFixed(1)}km` : `${Math.round(nearby.distance)}m`}
                      </span>
                    </div>
                    {nearby.category && <p className="text-xs text-yellow-300 mt-1">{nearby.category}</p>}
                    {summary && (
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {summary.slice(0, 70)}{summary.length > 70 ? "..." : ""}
                      </p>
                    )}
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {getCharacterIds(spot.characterIds)
          .map((characterId) => characters.find((c) => c.characterId === characterId))
          .filter(Boolean)
          .map((character, index, characterList) => {
            if (!character) return null;

            return (
              <section key={character.characterId} className="bg-slate-800 rounded-2xl p-4 mt-4 mb-4">
                <h2 className="font-bold mb-2">
                  {characterList.length === 1 ? "人物紹介" : `人物紹介（${index + 1}/${characterList.length}）`}
                </h2>

                {character.characterImage && character.characterImage.trim() !== "" && !characterImageErrors[character.characterId] && (
                  <img
                    src={character.characterImage}
                    alt={character.characterName}
                    onError={() =>
                      setCharacterImageErrors((prev) => ({
                        ...prev,
                        [character.characterId]: true,
                      }))
                    }
                    className="w-full max-h-64 object-contain mb-3 rounded-xl"
                  />
                )}

                <div className="text-center mb-2">
                  {character.characterKana && character.characterKana.trim() !== "" && (
                    <p className="text-xs text-slate-400">{character.characterKana}</p>
                  )}

                  <h2 className="text-xl font-bold">{character.characterName}</h2>

                  {character.characterYears && character.characterYears.trim() !== "" && (
                    <p className="text-xs text-slate-400">{character.characterYears}</p>
                  )}
                </div>
                
                {character.characterDescription && character.characterDescription.trim() !== "" && (
                  <p className="text-sm text-slate-300 text-center">
                    <span dangerouslySetInnerHTML={{ __html: character.characterDescription }} />
                    {character.wikipediaUrl && character.wikipediaUrl.trim() !== "" && (
                      <>
                        {" "}
                        <a href={character.wikipediaUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                          Wikipedia
                        </a>
                      </>
                    )}
                  </p>
                )}
              </section>
            );
          })}
      </div>
    </main>
  );
}
