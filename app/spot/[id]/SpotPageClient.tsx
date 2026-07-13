"use client";

import { useEffect, useState } from "react";

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

type Character = {
  characterId: string;
  characterName: string;
  characterKana?: string;
  characterYears?: string;
  characterDescription?: string;
  characterImage?: string;
  wikipediaUrl?: string;
};

async function fetchStaticJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { cache: "force-cache" });
  if (!response.ok) throw new Error(`${path} を取得できませんでした: ${response.status}`);
  return response.json();
}

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
    let cancelled = false;

    async function loadStaticData() {
      try {
        const [spotData, characterData] = await Promise.all([
          fetchStaticJson<Spot[]>("/data/timewalk/spots.json"),
          fetchStaticJson<Character[]>("/data/timewalk/characters.json"),
        ]);

        if (cancelled) return;
        setSpot(spotData.find((s) => s.id === id) || null);
        setCharacters(characterData);
      } catch (error) {
        console.error(error);
        if (!cancelled) setSpot(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStaticData();

    return () => {
      cancelled = true;
    };
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
