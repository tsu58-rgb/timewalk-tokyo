"use client";
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs_sHwnzRP6UbWvwqiCURTbMWS8yrFRRErdzLk_Xt3w1vvBhS6Wa3nO7MulssNWSQ80aqlgM5B2x4Y/pub?output=csv";
import { useEffect, useState } from "react";
import spots from "../data/spots.json";

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
  return (
    Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lng1 - lng2, 2)) * 111000
  );
}

export default function Home() {
  const [spots, setSpots] = useState<any[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
  fetch(SHEET_URL)
    .then((res) => res.text())
    .then((text) => {
      const rows = text.split("\n").slice(1);
      const data = rows.map((row) => {
        const cols = row.split(",");
        return {
          id: cols[0],
          name: cols[1],
          lat: Number(cols[2]),
          lng: Number(cols[3]),
          area: cols[4],
          category: cols[5],
          characterId: cols[6],
          character: cols[7],
          characterDescription: cols[8],
          characterImage: cols[9],
          description: cols[10],
          trivia: cols[11],
          status: cols[12]?.trim(),
        };
      });

      setSpots(data.filter((s) => s.status === "ready"));
    });
}, []);

useEffect(() => {
  if (!navigator.geolocation) {
    setError("このブラウザは位置情報に対応していません");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setPosition(pos.coords);
      setError("");
    },
    (err) => {
      setError("位置情報が取得できません: " + err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
    }
  );
}, []);
  const sortedSpots = spots
  .filter((spot) => {
    if (!position) return false;

    const d =
      Math.sqrt(
        Math.pow(position.latitude - spot.lat, 2) +
          Math.pow(position.longitude - spot.lng, 2)
      ) * 111000;

    return d <= 2000; // ← 2km以内だけ表示
  })
  .sort((a, b) => {
    if (!position) return 0;

    const da =
      Math.sqrt(
        Math.pow(position.latitude - a.lat, 2) +
          Math.pow(position.longitude - a.lng, 2)
      ) * 111000;

    const db =
      Math.sqrt(
        Math.pow(position.latitude - b.lat, 2) +
          Math.pow(position.longitude - b.lng, 2)
      ) * 111000;

    return da - db;
  });

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
          
          <p className="text-sm text-yellow-300 mb-2">
            {selectedSpot.category}
          </p>

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
              <p className="text-sm text-slate-300 text-center">
                {selectedSpot.characterDescription}
              </p>
            )}
          </div>

          <section className="bg-white text-black rounded-2xl p-4 mb-4">
            <h3 className="font-bold mb-2">歴史解説</h3>
            <p>{selectedSpot.description}</p>
          </section>

          <section className="bg-yellow-100 text-black rounded-2xl p-4">
            <h3 className="font-bold mb-2">トリビア</h3>
            <p>{selectedSpot.trivia}</p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <h1 className="text-2xl font-bold text-center mb-2">
          TimeWalk Tokyo
        </h1>

        <p className="text-center text-sm text-slate-300 mb-4">
          近くの歴史スポット
        </p>

        {error && (
          <p className="bg-red-900 rounded-xl p-3 mb-4 text-sm">{error}</p>
        )}

        {!position && !error && (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            位置情報を取得中...
          </p>
        )}

        <div className="space-y-3">
          {sortedSpots.map((spot) => {
            const distance = position
              ? calcDistanceMeters(
                  position.latitude,
                  position.longitude,
                  spot.lat,
                  spot.lng
                )
              : null;

            return (
              <button
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className="w-full text-left bg-slate-800 rounded-2xl p-4 border border-slate-600"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-sm text-yellow-300">{spot.category}</p>
                    <h2 className="text-lg font-bold">{spot.name}</h2>
                    <p className="text-sm text-slate-300 mt-1">
                      登場人物：{spot.character}
                    </p>
                  </div>

                  <div className="text-right text-sm text-blue-300 min-w-[70px]">
                    {distance !== null ? `${Math.floor(distance)}m` : "計測中"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}