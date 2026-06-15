import Link from "next/link";

import CourseRouteMapLoader from "../../components/CourseRouteMapLoader";
import {
  formatCourseDistance,
  getCourseById,
  getCoursePointsById,
  type CoursePoint,
} from "../../lib/courses";
import { fetchSpots } from "../../lib/timewalkData";

export const revalidate = 300;

function getGoogleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function renderDescription(value: string) {
  const normalized = String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "");

  return normalized.split("\n").map((line, index, lines) => (
    <span key={`${index}-${line}`}>
      {line}
      {index < lines.length - 1 && <br />}
    </span>
  ));
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cacheOptions = { revalidateSeconds: 300 };
  const [course, storedPoints, spots] = await Promise.all([
    getCourseById(id, cacheOptions),
    getCoursePointsById(id, cacheOptions),
    fetchSpots(cacheOptions),
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
      kana: spot.kana || "",
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

        <section className="mb-4">
          <h2 className="mb-3 font-bold">歩く順番</h2>
          {points.length === 0 ? (
            <p className="text-sm text-slate-400">地点登録後に表示されます。</p>
          ) : (
            <div className="space-y-3">
              {points.map((point, index) => {
                const isSpot = point.pointType === "spot" && Boolean(point.spotId);

                return (
                  <div key={point.pointId} className="rounded-2xl border border-slate-600 bg-slate-900 p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-300 font-bold text-black">
                        {index + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        {point.kana && (
                          <p className="mb-1 text-xs text-slate-400">{point.kana}</p>
                        )}
                        <h3 className="font-bold">{point.name || `経由地 ${index + 1}`}</h3>

                        <div className="mt-2 flex flex-wrap justify-end gap-2">
                          {isSpot && (
                            <a
                              href={`/spot/${point.spotId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="whitespace-nowrap rounded-lg bg-white px-3 py-2 text-xs font-bold text-black"
                            >
                              別タブで詳細
                            </a>
                          )}

                          <a
                            href={getGoogleMapsUrl(point.lat, point.lng)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="whitespace-nowrap rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white"
                          >
                            Googleマップ
                          </a>
                        </div>
                      </div>
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
                        {renderDescription(point.description)}
                      </p>
                    )}
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
