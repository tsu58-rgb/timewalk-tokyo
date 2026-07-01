export type Spot = {
  id: string;
  name: string;
  kana: string;
  lat: number;
  lng: number;
  country: string;
  prefecture: string;
  city: string;
  area: string;
  category: string;
  characterIds: string;
  spotsImage: string;
  status: string;
  mode: string;
  workId: string;
  description: string;
  trivia: string;
};

export type Work = {
  workId: string;
  workTitle: string;
  workDescription: string;
};

export type Language = {
  lang: string;
  label: string;
  nativeLabel: string;
  urlPrefix: string;
  isActive: boolean;
  note: string;
};

export type WorkTranslation = {
  workId: string;
  lang: string;
  workTitle: string;
  workDescription: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  leadText: string;
  ogTitle: string;
  ogDescription: string;
  status: string;
};

export type SpotTranslation = {
  spotId: string;
  lang: string;
  name: string;
  kana: string;
  description: string;
  sceneTitle: string;
  sceneDescription: string;
  photoCaption: string;
  metaTitle: string;
  metaDescription: string;
  status: string;
};

export type Character = {
  characterId: string;
  characterName: string;
};

export type EventItem = {
  id: string;
  date: string;
  description: string;
  memorial: string;
  source_url: string;
  quiz: string;
  quizAnswer: string;
};

export type SpotWithDistance = Spot & {
  distance: number | null;
};
