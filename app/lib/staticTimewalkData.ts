import coursesJson from "../generated/timewalk/courses.json";
import coursePointsJson from "../generated/timewalk/course-points.json";
import spotsJson from "../generated/timewalk/spots.json";

import type { Spot } from "@/types/timewalk";
import type { Course, CoursePoint } from "./courses";

const courses = coursesJson as Course[];
const coursePoints = coursePointsJson as CoursePoint[];
const spots = spotsJson as Spot[];

export function getStaticReadyCourses() {
  return courses;
}

export function getStaticCourseById(id: string) {
  return courses.find((course) => course.id === id) || null;
}

export function getStaticCoursePoints() {
  return coursePoints;
}

export function getStaticCoursePointsById(id: string) {
  return coursePoints.filter((point) => point.courseId === id);
}

export function getStaticSpots() {
  return spots;
}
