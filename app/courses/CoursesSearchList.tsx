"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatCourseDistance, type Course } from "../lib/courses";

type SearchableCourse = Course & {
  routeSpotNames: string;
};

type NumberedCourse = SearchableCourse & {
  sequenceNumber: number;
};

function compareDateAscending(a: Course, b: Course) {
  const dateCompare = String(a.date || "").localeCompare(String(b.date || ""));
  if (dateCompare !== 0) return dateCompare;
  return (a.displayOrder || 9999) - (b.displayOrder || 9999);
}

export default function CoursesSearchList({ courses }: { courses: SearchableCourse[] }) {
  const [keyword, setKeyword] = useState("");
  const [loadingCourseId, setLoadingCourseId] = useState("");

  const numberedCourses = useMemo<NumberedCourse[]>(() => {
    const oldestFirst = [...courses].sort(compareDateAscending);
    return oldestFirst
      .map((course, index) => ({ ...course, sequenceNumber: index + 1 }))
      .sort((a, b) => {
        const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
        if (dateCompare !== 0) return dateCompare;
        return b.sequenceNumber - a.sequenceNumber;
      });
  }, [courses]);

  const visibleCourses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase("ja-JP");
    if (!normalizedKeyword) return numberedCourses;

    return numberedCourses.filter((course) => {
      const target = [
        course.title,
        course.area,
        course.description,
        course.routeSpotNames,
      ]
        .join(" ")
        .toLocaleLowerCase("ja-JP");
      return target.includes(normalizedKeyword);
    });
  }, [numberedCourses, keyword]);

  return (
    <>
      {loadingCourseId && (
        <div
          role="status"
          aria-live="polite"
          aria-label="コースを読み込み中"
          className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-slate-950/80 p-6"
        >
          <div className="flex items-center gap-3 rounded-2xl border-2 border-white bg-slate-900 px-6 py-5 text-base font-bold text-white shadow-2xl">
            <span className="h-7 w-7 animate-spin rounded-full border-4 border-slate-500 border-t-yellow-300" />
            コースを読み込み中です…
          </div>
        </div>
      )}

      <div className="mb-2">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="コース名・スポット名で検索"
          aria-label="コースとルート内スポットをキーワード検索"
          disabled={Boolean(loadingCourseId)}
          className="w-full rounded-xl border border-slate-500 bg-white px-4 py-3 text-black outline-none focus:border-yellow-300 disabled:cursor-wait disabled:opacity-60"
        />
      </div>

      <p className="mb-4 text-xs text-slate-400">
        全{courses.length}件中{visibleCourses.length}件表示
      </p>

      <div className="space-y-3" aria-busy={Boolean(loadingCourseId)}>
        {visibleCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            onClick={(event) => {
              if (
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
              ) {
                return;
              }
              setLoadingCourseId(course.id);
            }}
            className={`block overflow-hidden rounded-2xl border border-slate-600 bg-slate-800 hover:border-yellow-300 ${
              loadingCourseId ? "pointer-events-none" : ""
            }`}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-bold leading-6 text-yellow-300">
                    {String(course.sequenceNumber).padStart(2, "0")}.{course.title}
                  </h2>
                  <p className="mt-2 truncate text-sm font-bold leading-5 text-white">
                    {course.area} / {formatCourseDistance(course.distanceKm)} / {course.durationLabel || `約${course.durationMin}分`}
                  </p>
                </div>

                {course.eyecatchImage && (
                  <img
                    src={course.eyecatchImage}
                    alt={`${course.title}のアイキャッチ画像`}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-24 shrink-0 rounded-lg bg-black object-cover"
                  />
                )}
              </div>

              {course.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{course.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {visibleCourses.length === 0 && (
        <p className="rounded-xl bg-slate-800 p-4 text-sm text-slate-300">
          該当するコースはありません。
        </p>
      )}
    </>
  );
}
