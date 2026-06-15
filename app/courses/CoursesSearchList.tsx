"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { formatCourseDistance, type Course } from "../lib/courses";

export default function CoursesSearchList({ courses }: { courses: Course[] }) {
  const [keyword, setKeyword] = useState("");

  const visibleCourses = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLocaleLowerCase("ja-JP");
    if (!normalizedKeyword) return courses;

    return courses.filter((course) => {
      const target = [course.title, course.area, course.description]
        .join(" ")
        .toLocaleLowerCase("ja-JP");
      return target.includes(normalizedKeyword);
    });
  }, [courses, keyword]);

  return (
    <>
      <div className="mb-2">
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="キーワードで検索"
          aria-label="コースをキーワード検索"
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

      {visibleCourses.length === 0 && (
        <p className="rounded-xl bg-slate-800 p-4 text-sm text-slate-300">
          該当するコースはありません。
        </p>
      )}
    </>
  );
}
