import charactersJson from "../generated/timewalk/characters.json";
import coursesJson from "../generated/timewalk/courses.json";
import coursePointsJson from "../generated/timewalk/course-points.json";
import eventsJson from "../generated/timewalk/events.json";
import languagesJson from "../generated/timewalk/languages.json";
import seichiSpotsJson from "../generated/timewalk/seichi-spots.json";
import spotsJson from "../generated/timewalk/spots.json";
import spotTranslationsJson from "../generated/timewalk/spot-translations.json";
import worksJson from "../generated/timewalk/works.json";
import workTranslationsJson from "../generated/timewalk/work-translations.json";

import type {
  Character,
  EventItem,
  Language,
  Spot,
  SpotTranslation,
  Work,
  WorkTranslation,
} from "@/types/timewalk";
import type { Course, CoursePoint } from "./courses";

const characters = charactersJson as Character[];
const courses = coursesJson as Course[];
const coursePoints = coursePointsJson as CoursePoint[];
const events = eventsJson as EventItem[];
const languages = languagesJson as Language[];
const seichiSpots = seichiSpotsJson as Spot[];
const spots = spotsJson as Spot[];
const spotTranslations = spotTranslationsJson as SpotTranslation[];
const works = worksJson as Work[];
const workTranslations = workTranslationsJson as WorkTranslation[];

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

export function getStaticSeichiSpots() {
  return seichiSpots;
}

export function getStaticCharacters() {
  return characters;
}

export function getStaticEvents() {
  return events;
}

export function getStaticWorks() {
  return works;
}

export function getStaticLanguages() {
  return languages;
}

export function getStaticWorkTranslations() {
  return workTranslations;
}

export function getStaticSpotTranslations() {
  return spotTranslations;
}
