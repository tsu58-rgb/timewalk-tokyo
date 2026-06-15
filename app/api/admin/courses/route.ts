import { NextResponse } from "next/server";

import { fetchCoursePoints, fetchCourses } from "../../../lib/courses";

export async function POST() {
  const [courses, points] = await Promise.all([
    fetchCourses({ noStore: true }),
    fetchCoursePoints({ noStore: true }),
  ]);

  return NextResponse.json({ ok: true, courses, points });
}
