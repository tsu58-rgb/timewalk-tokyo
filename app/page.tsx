"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  linkWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export default function Home() {
  const [uid, setUid] = useState("");
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("読み込み中...");
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState("江戸町民");
  const [book, setBook] = useState<string[]>([]);
  const [love, setLove] = useState<{ [key: string]: number }>({});
  const [ready, setReady] = useState(false);
  const [isAnonymousUser, setIsAnonymousUser] = useState(true);

  const places = [
    { name: "浅草寺", person: "徳川家康", lat: 35.7148, lng: 139.7967 },
    { name: "上野", person: "西郷隆盛", lat: 35.7112, lng: 139.7745 },
    { name: "馬喰町", person: "蔦屋重三郎", lat: 35.6938, lng: 139.7825 },
  ];

  const saveProfile = async (
    nextBook: string[],
    nextLove: any,
    currentPerson?: string
  ) => {
    if (!uid) return;

    await setDoc(
      doc(db, "users", uid),
      {
        book: nextBook,
        love: nextLove,
        currentPerson: currentPerson || person,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        await signInAnonymously(auth);
        return;
      }

      setUid(user.uid);
      setIsAnonymousUser(user.isAnonymous);

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setBook(data.book || []);
        setLove(data.love || {});
      }

      setReady(true);
      setReply("位置情報を確認しています...");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        for (const place of places) {
          const distance =
            Math.sqrt(
              Math.pow(lat - place.lat, 2) +
                Math.pow(lng - place.lng, 2)
            ) * 111000;

          if (distance < 1000) {
            setPerson(place.person);
            setReply(`${place.name}付近。${place.person}が現れた！`);

            const newBook = [...new Set([...book, place.person])];
            setBook(newBook);

            await saveProfile(newBook, love, place.person);
            return;
          }
        }

        setPerson("江戸町民");
        setReply("このあたりは江戸の町かもしれないな。");
      },
      () => {
        setReply("位置情報が取得できません。");
      }
    );
  }, [ready]);

  const sendMessage = async () => {
    if (!input) return;

    setLoading(true);

    const currentLove = love[person] || 0;

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
        person,
        friendship: currentLove,
      }),
    });

    const data = await res.json();

    const nextLove = {
      ...love,
      [person]: currentLove + 1,
    };

    setLove(nextLove);
    setReply(data.reply);
    setInput("");

    await saveProfile(book, nextLove, person);

    setLoading(false);
  };

  const handleGoogleLink = async () => {
    try {
      if (!auth.currentUser) return;

      if (auth.currentUser.isAnonymous) {
        await linkWithPopup(auth.currentUser, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }

      setIsAnonymousUser(false);
      setReply("Googleログインに引き継ぎました！");
    } catch (e) {
      setReply("ログインに失敗しました");
    }
  };

  return (
    <main className="min-h-screen bg-blue-100 p-4">
      <div className="bg-white p-6 rounded-2xl max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-2">
          TimeWalk Tokyo
        </h1>

        <p className="text-center text-sm mb-4">
          UID: {uid ? uid.slice(0, 6) + "..." : "作成中..."}
        </p>

        <button
          className="w-full bg-black text-white py-2 rounded mb-4"
          onClick={handleGoogleLink}
        >
          {isAnonymousUser
            ? "Googleで引き継ぐ"
            : "ログイン済み"}
        </button>

        <h2 className="text-lg font-bold text-center mb-2">
          👤 {person}
        </h2>

        <p className="text-center mb-2">
          ❤️ {love[person] || 0}
        </p>

        <div className="bg-gray-100 p-4 rounded mb-4 min-h-[100px]">
          {loading ? "考え中..." : reply}
        </div>

        <input
          className="w-full border p-2 rounded mb-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="w-full bg-blue-500 text-white py-2 rounded mb-4"
          onClick={sendMessage}
        >
          送信
        </button>

        <div>
          <h3 className="font-bold mb-2">📔 連絡帳</h3>
          {book.length === 0
            ? "まだ誰にも会っていません"
            : book.map((b) => (
                <div key={b}>
                  {b} ❤️ {love[b] || 0}
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}