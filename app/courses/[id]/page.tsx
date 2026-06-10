import { getCourseById, resolveCourseSpots } from "../../lib/courses";
import { fetchSpots } from "../../lib/timewalkData";
import SpotMap from "../../components/SpotMap";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = getCourseById(id);

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
        <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
          <a href="/" className="inline-block mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold">
            ← Topに戻る
          </a>
          <p>コースが見つかりません。</p>
        </div>
      </main>
    );
  }

  const spots = await fetchSpots();
  const courseSpots = resolveCourseSpots(course, spots);

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex justify-center">
      <div className="w-full max-w-md bg-slate-950 border-4 border-white rounded-3xl p-5">
        <a href="/" className="inline-block mb-4 bg-white text-black px-4 py-2 rounded-xl font-bold">
          ← Topに戻る
        </a>

        <p className="text-xs text-yellow-300 font-bold mb-2">歴史さんぽコース</p>
        <h1 className="text-2xl font-bold mb-3">{course.title}</h1>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{course.description}</p>

        <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-slate-400 mb-1">エリア</p>
            <p className="font-bold">{course.area}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-slate-400 mb-1">時間</p>
            <p className="font-bold">{course.duration}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3">
            <p className="text-slate-400 mb-1">距離</p>
            <p className="font-bold">{course.distance}</p>
          </div>
        </div>

        {courseSpots.length > 0 ? (
          <div className="mb-4">
            <SpotMap spots={courseSpots} initialZoom={15} height="320px" />
          </div>
        ) : (
          <p className="bg-slate-800 rounded-xl p-3 mb-4 text-sm">
            このコースに対応するスポットはまだ登録されていません。
          </p>
        )}

        <section className="bg-slate-800 rounded-2xl p-4 mb-4">
          <h2 className="font-bold mb-3">歩く順番</h2>
          {courseSpots.length === 0 ? (
            <p className="text-sm text-slate-400">スポット登録後に表示されます。</p>
          ) : (
            <div className="space-y-3">
              {courseSpots.map((spot, index) => (
                <a key={spot.id} href={`/spot/${spot.id}`} className="block bg-slate-900 border border-slate-600 rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-300 text-black flex items-center justify-center font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold">{spot.name}{spot.spotsImage ? " 🖼️" : ""}</h3>
                      {spot.category && <p className="text-xs text-slate-400 mt-1">{spot.category}</p>}
                      {spot.description && (
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                          {spot.description.replace(/<[^>]*>/g, "").slice(0, 80)}{spot.description.replace(/<[^>]*>/g, "").length > 80 ? "..." : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>

        <p className="text-xs text-slate-400 leading-relaxed">
          このコースは最小版です。今後、コース専用のシート管理・並び順指定・イベント連携を追加できます。
        </p>
      </div>
    </main>
  );
}
