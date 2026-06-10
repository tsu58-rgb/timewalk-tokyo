export type Spot = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  characterIds: string;
  spotsImage: string;
  status: string;
  mode: string;
  description: string;
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
