import Link from "next/link";

import CoursesSearchList from "./CoursesSearchList";
import { getReadyCourses } from "../lib/courses";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getReadyCourses({ noStore: true });

  return (
    <main className="min-h-screen bg-slate-900 p-4 text-white flex justify-center">
      <div className="w-full max-w-md rounded-3xl border-4 border-white bg-slate-950 p-5">
        <Link href="/" className="mb-4 inline-block rounded-xl bg-white px-4 py-2 font-bold text-black">
          ← Topに戻る
        </Link>

        <h1 className="mb-2 text-2xl font-bold">散歩コース一覧</h1>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">
          歴史スポットを順番に歩いて楽しめるコースです。
        </p>

        <CoursesSearchList courses={courses} />
      </div>
    </main>
  );
}
