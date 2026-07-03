import Link from "next/link";

import CoursesSearchList from "./CoursesSearchList";
import { fetchCoursePoints, getReadyCourses } from "../lib/courses";
import { fetchSpots } from "../lib/timewalkData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoursesPage() {
  const cacheOptions = { noStore: true };
  const [courses, coursePoints, spots] = await Promise.all([
    getReadyCourses(cacheOptions),
    fetchCoursePoints(cacheOptions),
    fetchSpots(cacheOptions),
  ]);

  const spotNameMap = new Map(spots.map((spot) => [spot.id, spot.name]));
  const courseSearchNames = new Map<string, Set<string>>();

  coursePoints.forEach((point) => {
    const name =
      point.pointType === "spot"
        ? spotNameMap.get(point.spotId) || point.name
        : point.name;

    if (!name) return;

    const names = courseSearchNames.get(point.courseId) || new Set<string>();
    names.add(name);
    courseSearchNames.set(point.courseId, names);
  });

  const searchableCourses = courses.map((course) => ({
    ...course,
    routeSpotNames: Array.from(courseSearchNames.get(course.id) || []).join(" "),
  }));

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

        <CoursesSearchList courses={searchableCourses} />
      </div>
    </main>
  );
}
