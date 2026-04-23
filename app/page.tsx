"use client";

import { useEffect, useState } from "react";

type LoveMap = {
  [key: string]: number;
};

type Place = {
  name: string;
  person: string;
  lat: number;
  lng: number;
  unlock?: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("位置情報を確認しています...");
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("江戸町民");
  const [book, setBook] = useState<string[]>([]);
  const [love, setLove] = useState<LoveMap>({});

  useEffect(() => {
    const savedBook = localStorage.getItem("book");
    const parsedBook: string[] = savedBook ? JSON.parse(savedBook) : [];
    setBook(parsedBook);

    const savedLove = localStorage.getItem("love");
    const parsedLove: LoveMap = savedLove ? JSON.parse(savedLove) : {};
    setLove(parsedLove);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const places: Place[] = [
          {
            name: "浅草寺",
            person: "徳川家康",
            lat: 35.7148,
            lng: 139.7967,
          },
          {
            name: "上野",
            person: "西郷隆盛",
            lat: 35.7112,
            lng: 139.7745,
          },
          {
            name: "馬喰町",
            person: "蔦屋重三郎",
            lat: 35.6938,
            lng: 139.7825,
          },
          {
            name: "日本橋（隠し）",
            person: "坂本龍馬",
            lat: 35.6840,
            lng: 139.7740,
            unlock: "蔦屋重三郎",
          },
        ];

        let found = false;

        for (const place of places) {
          if (place.unlock) {
            if ((parsedLove[place.unlock] || 0) < 5) {
              continue;
            }
          }

          const distance =
            Math.sqrt(
              Math.pow(lat - place.lat, 2) + Math.pow(lng - place.lng, 2)
            ) * 111000;

          if (distance < 1000) {
            setPerson(place.person);
            setReply(`${place.name}付近です。${place.person}が現れました！`);
            found = true;

            let list = [...parsedBook];
            if (!list.includes(place.person)) {
              list.push(place.person);
              localStorage.setItem("book", JSON.stringify(list));
              setBook(list);
            }

            break;
          }
        }

        if (!found) {
          setPerson("江戸町民");
          setReply("このあたりは江戸の町並みが広がっていた場所かもしれません。");
        }
      },
      () => {
        setReply("位置情報が取得できません。");
      }
    );
  }, []);

  const sendMessage = async () => {
    if (!input) return;

    setLoading(true);

    const currentFriendship = love[person] || 0;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        person: person,
        friendship: currentFriendship,
      }),
    });

    const data = await res.json();

    const newLove = {
      ...love,
      [person]: currentFriendship + 1,
    };

    setLove(newLove);
    localStorage.setItem("love", JSON.stringify(newLove));

    setReply(data.reply);
    setInput("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-blue-100 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">
          TimeWalk Tokyo
        </h1>

        <h2 className="text-xl font-bold text-center mb-2">
          👤 {person}
        </h2>

        <p className="text-center mb-4">
          ❤️ 親密度 {love[person] || 0}
        </p>

        <div className="bg-gray-100 rounded-2xl p-4 min-h-[140px] mb-4 whitespace-pre-wrap">
          {loading ? "考え中..." : reply}
        </div>

        <input
          className="w-full border p-3 rounded-xl mb-3"
          placeholder="質問してみよう"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold mb-6"
          onClick={sendMessage}
        >
          送信
        </button>

        <div>
          <h3 className="text-lg font-bold mb-2">📔 連絡帳</h3>

          <ul className="space-y-2">
            {book.length === 0 ? (
              <li className="bg-gray-100 p-2 rounded-xl">
                まだ誰にも出会っていません。
              </li>
            ) : (
              book.map((name, i) => (
                <li key={i} className="bg-yellow-100 p-2 rounded-xl">
                  {name} ❤️ {love[name] || 0}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}