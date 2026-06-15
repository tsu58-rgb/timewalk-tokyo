import Link from "next/link";

import CourseRouteMapLoader from "../../components/CourseRouteMapLoader";
import {
  formatCourseDistance,
  getCourseById,
  getCoursePointsById,
  type CoursePoint,
} from "../../lib/courses";
import { fetchSpots } from "../../lib/timewalkData";

export const dynamic = "force-dynamic";

function cleanDescription(value: string) {
  return String(value || "").replace(/<[^>]*>/g, "");
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, storedPoints, spots] = await Promise.all([
    getCourseById(id, { noStore: true }),
    getCoursePointsById(id, { noStore: true }),
    fetchSpots({ noStore: true }),
  ]);

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-900 p-4 text-white flex justify-center">
        <div className="w-full max-w-md rounded-3xl border-4 border-white bg-slate-950 p-5">
          <Link href="/courses" className="mb-4 inline-block rounded-xl bg-white px-4 py-2 font-bold text-black">
            ← 散歩コース一覧へ
          </Link>
          <p>コースが見つかりません。</p>
        </div>
      </main>
    );
  }

  const spotMap = new Map(spots.map((spot) => [spot.id, spot]));
  const points: CoursePoint[] = storedPoints.map((point) => {
    if (point.pointType !== "spot") return point;
    const spot = spotMap.get(point.spotId);
    if (!spot) return point;

    return {
      ...point,
      name: spot.name || point.name,
      lat: spot.lat,
      lng: spot.lng,
      imageUrl: spot.spotsImage || point.imageUrl,
      description: spot.description || point.description,
    };
  });

  return (
    <main className="min-h-screen bg-slate-900 p-4 text-white flex justify-center">
      <div className="w-full max-w-md rounded-3xl border-4 border-white bg-slate-950 p-5">
        <Link href="/courses" className="mb-4 inline-block rounded-xl bg-white px-4 py-2 font-bold text-black">
          ← 散歩コース一覧へ
        </Link>

        <p className="mb-2 text-xs font-bold text-yellow-300">歴史さんぽコース</p>
        <h1 className="mb-3 text-2xl font-bold">{course.title}</h1>
        <p className="mb-4 text-sm leading-relaxed text-slate-300">{course.description}</p>
        <p className="mb-4 rounded-xl bg-slate-800 p-3 text-center text-sm font-bold">
          {course.area} / {formatCourseDistance(course.distanceKm)} / {course.durationLabel || `約${course.durationMin}分`}
        </p>

        {points.length > 0 ? (
          <div className="mb-4">
            <CourseRouteMapLoader points={points} />
          </div>
        ) : (
          <p className="mb-4 rounded-xl bg-slate-800 p-3 text-sm">
            このコースの地点はまだ登録されていません。
          </p>
        )}

        <section className="mb-4 rounded-2xl bg-slate-800 p-4">
          <h2 className="mb-3 font-bold">歩く順番</h2>
          {points.length === 0 ? (
            <p className="text-sm text-slate-400">地点登録後に表示されます。</p>
          ) : (
            <div className="space-y-3">
              {points.map((point, index) => {
                const isSpot = point.pointType === "spot" && Boolean(point.spotId);
                const cardContent = (
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-300 font-bold text-black">
                        {index + 1}
                      </div>
                      <h3 className="font-bold">{point.name || `経由地 ${index + 1}`}</h3>
                    </div>

                    {isSpot && point.imageUrl && (
                      <img
                        src={point.imageUrl}
                        alt={point.name}
                        loading="lazy"
                        decoding="async"
                        className="mb-3 w-full rounded-xl bg-black object-cover"
                      />
                    )}

                    {isSpot && point.description && (
                      <p className="text-sm leading-relaxed text-slate-300">
                        {cleanDescription(point.description)}
                      </p>
                    )}
                  </div>
                );

                if (isSpot) {
                  return (
                    <a
                      key={point.pointId}
                      href={`/spot/${point.spotId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-2xl border border-slate-600 bg-slate-900 p-4"
                    >
                      {cardContent}
                    </a>
                  );
                }

                return (
                  <div key={point.pointId} className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
                    {cardContent}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
