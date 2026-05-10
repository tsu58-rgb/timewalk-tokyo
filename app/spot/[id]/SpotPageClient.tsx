"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

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
  spotsImage: string;
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

export default function SpotPageClient({ id }: { id: string }) {
  const [spot, setSpot] = useState<Spot | null>(null);
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

        const data = (parsed.data as any[]).map((row: any) => ({
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
          spotsImage: row.spotsImage || "",
        }));

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
            <span
              key={cat}
              className="text-xs bg-yellow-300 text-black px-2 py-1 rounded-full font-bold"
            >
              {cat}
            </span>
          ))}
        </div>

        {spot.kana && spot.kana.trim() !== "" && (
          <p className="text-xs text-slate-400 mb-1">
            {spot.kana}
          </p>
        )}

        <h1 className="text-2xl font-bold mb-4">{spot.name}</h1>
        
        {spot.spotsImage && spot.spotsImage.trim() !== "" && !spotImageError && (
          <img
            src={spot.spotsImage}
            alt={spot.name}
            onError={() => setSpotImageError(true)}
            className="w-full max-h-72 object-contain mb-4 rounded-xl bg-slate-800"
          />
        )}

        {spot.description && spot.description.trim() !== "" && (
          <section className="bg-white text-black rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-2">歴史解説</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: spot.description,
              }}
            />
          </section>
        )}

        {spot.trivia && spot.trivia.trim() !== "" && (
          <section className="bg-yellow-100 text-black rounded-2xl p-4">
            <h2 className="font-bold mb-2">トリビア</h2>

            <div
              dangerouslySetInnerHTML={{
                __html: spot.trivia,
              }}
            />
          </section>
        )}

        {getCharacterIds(spot.characterIds)
          .map((characterId) =>
            characters.find((c) => c.characterId === characterId)
          )
          .filter(Boolean)
          .map((character, index, characterList) => {
            if (!character) return null;

            return (
              <section
                key={character.characterId}
                className="bg-slate-800 rounded-2xl p-4 mt-4 mb-4"
              >
                <h2 className="font-bold mb-2">
                  {characterList.length === 1
                    ? "人物紹介"
                    : `人物紹介（${index + 1}/${characterList.length}）`}
                </h2>

              {character.characterImage &&
                character.characterImage.trim() !== "" &&
                !characterImageErrors[character.characterId] && (
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
                  <p className="text-xs text-slate-400">
                    {character.characterKana}
                  </p>
                )}

                <h2 className="text-xl font-bold">
                  {character.characterName}
                </h2>

                {character.characterYears && character.characterYears.trim() !== "" && (
                  <p className="text-xs text-slate-400">
                    {character.characterYears}
                  </p>
                )}
              </div>
              
              {character.characterDescription &&
                character.characterDescription.trim() !== "" && (
                  <p className="text-sm text-slate-300 text-center">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: character.characterDescription,
                      }}
                    />

                    {character.wikipediaUrl &&
                      character.wikipediaUrl.trim() !== "" && (
                        <>
                          {" "}
                          <a
                            href={character.wikipediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline"
                          >
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