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
      <div className="mb-2">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="コース名・スポット名で検索"
          aria-label="コースとルート内スポットをキーワード検索"
          className="w-full rounded-xl border border-slate-500 bg-white px-4 py-3 text-black outline-none focus:border-yellow-300"
        />
      </div>

      <p className="mb-4 text-xs text-slate-400">
        全{courses.length}件中{visibleCourses.length}件表示
      </p>

      <div className="space-y-3">
        {visibleCourses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block rounded-2xl border border-slate-600 bg-slate-800 p-4 hover:border-yellow-300"
          >
            <h2 className="mb-2 font-bold text-yellow-300">
              {String(course.sequenceNumber).padStart(2, "0")}.{course.title}
            </h2>
            <p className="text-sm font-bold text-white">
              {course.area} / {formatCourseDistance(course.distanceKm)} / {course.durationLabel || `約${course.durationMin}分`}
            </p>
            {course.description && (
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{course.description}</p>
            )}
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
