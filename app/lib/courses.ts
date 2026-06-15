import { COURSE_POINTS_URL, COURSES_URL } from "./sheetUrls";
import { fetchCsvObjects } from "./timewalkData";

export type Course = {
  id: string;
  status: string;
  title: string;
  description: string;
  area: string;
  distanceKm: number;
  durationMin: number;
  durationLabel: string;
  displayOrder: number;
};

export type CoursePoint = {
  courseId: string;
  pointOrder: number;
  pointType: "spot" | "waypoint";
  spotId: string;
  pointId: string;
  name: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  description?: string;
};

export async function fetchCourses(options: { noStore?: boolean } = {}) {
  const rows = await fetchCsvObjects(COURSES_URL, options.noStore);

  return rows
    .map((row): Course => ({
      id: String(row.courseId || "").trim(),
      status: String(row.status || "").trim(),
      title: String(row.title || "").trim(),
      description: String(row.description || "").trim(),
      area: String(row.area || "").trim(),
      distanceKm: Number(row.distanceKm),
      durationMin: Number(row.durationMin),
      durationLabel: String(row.durationLabel || "").trim(),
      displayOrder: Number(row.displayOrder),
    }))
    .filter((course) => course.id && course.title)
    .sort((a, b) => (a.displayOrder || 9999) - (b.displayOrder || 9999));
}

export async function fetchCoursePoints(options: { noStore?: boolean } = {}) {
  const rows = await fetchCsvObjects(COURSE_POINTS_URL, options.noStore);

  return rows
    .map((row): CoursePoint => ({
      courseId: String(row.courseId || "").trim(),
      pointOrder: Number(row.pointOrder),
      pointType: String(row.pointType || "spot").trim().toLowerCase() === "waypoint" ? "waypoint" : "spot",
      spotId: String(row.spotId || "").trim(),
      pointId: String(row.pointId || "").trim(),
      name: String(row.name || "").trim(),
      lat: Number(row.lat),
      lng: Number(row.lng),
    }))
    .filter(
      (point) =>
        point.courseId &&
        point.pointId &&
        Number.isFinite(point.lat) &&
        Number.isFinite(point.lng)
    )
    .sort((a, b) => a.pointOrder - b.pointOrder);
}

export async function getReadyCourses(options: { noStore?: boolean } = {}) {
  const courses = await fetchCourses(options);
  return courses.filter((course) => course.status.toLowerCase() === "ready");
}

export async function getCourseById(id: string, options: { noStore?: boolean } = {}) {
  const courses = await getReadyCourses(options);
  return courses.find((course) => course.id === id) || null;
}

export async function getCoursePointsById(id: string, options: { noStore?: boolean } = {}) {
  const points = await fetchCoursePoints(options);
  return points.filter((point) => point.courseId === id);
}

export function formatCourseDistance(distanceKm: number) {
  if (!Number.isFinite(distanceKm)) return "約0km";
  const rounded = Math.round(distanceKm * 10) / 10;
  return `約${rounded.toString().replace(/\.0$/, "")}km`;
}

export function calculateCourseDistanceKm(points: Array<{ lat: number; lng: number }>) {
  if (points.length < 2) return 0;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  let directKm = 0;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const dLat = toRad(current.lat - previous.lat);
    const dLng = toRad(current.lng - previous.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(previous.lat)) *
        Math.cos(toRad(current.lat)) *
        Math.sin(dLng / 2) ** 2;
    directKm += 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
  }

  return directKm * 1.25;
}

export function calculateCourseDurationMin(distanceKm: number) {
  return Math.max(0, Math.round(distanceKm * 20));
}

export function formatCourseDuration(durationMin: number) {
  if (!Number.isFinite(durationMin) || durationMin <= 0) return "約0分";
  return `約${Math.ceil(durationMin / 5) * 5}分`;
}
