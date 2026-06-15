import Link from "next/link";

import { formatCourseDistance, getReadyCourses } from "../lib/courses";

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
        <p className="mb-5 text-sm leading-relaxed text-slate-300">
          歴史スポットを順番に歩いて楽しめるコースです。
        </p>

        <div className="space-y-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="block rounded-2xl border border-slate-600 bg-slate-800 p-4 hover:border-yellow-300"
            >
              <h2 className="mb-2 font-bold text-yellow-300">{course.title}</h2>
              <p className="text-sm font-bold text-white">
                {course.area} / {formatCourseDistance(course.distanceKm)} / {course.durationLabel || `約${course.durationMin}分`}
              </p>
              {course.description && (
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{course.description}</p>
              )}
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="rounded-xl bg-slate-800 p-4 text-sm text-slate-300">公開中のコースはありません。</p>
        )}
      </div>
    </main>
  );
}
