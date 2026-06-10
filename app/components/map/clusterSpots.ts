export type ClusterableSpot = {
  id?: string;
  lat: number | string;
  lng: number | string;
};

export type ClusterItem<T extends ClusterableSpot> =
  | {
      type: "spot";
      spot: T;
    }
  | {
      type: "cluster";
      key: string;
      count: number;
      lat: number;
      lng: number;
      spots: T[];
    };

type ProjectedPoint = {
  x: number;
  y: number;
};

type ClusterMapLike = {
  project: (latLng: [number, number], zoom: number) => ProjectedPoint;
};

export function getClusterCellSize(zoom: number) {
  if (zoom <= 12) return 90;
  if (zoom <= 14) return 75;
  if (zoom <= 16) return 60;
  return 45;
}

export function shouldClusterSpots(zoom: number) {
  return zoom < 17;
}

export function clusterSpots<T extends ClusterableSpot>(
  spots: T[],
  map: ClusterMapLike,
  zoom: number
): ClusterItem<T>[] {
  if (!shouldClusterSpots(zoom)) {
    return spots.map((spot) => ({ type: "spot", spot }));
  }

  const cellSize = getClusterCellSize(zoom);
  const clusters: Record<string, T[]> = {};

  spots.forEach((spot) => {
    const lat = Number(spot.lat);
    const lng = Number(spot.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const point = map.project([lat, lng], zoom);
    const key = `${Math.floor(point.x / cellSize)}_${Math.floor(point.y / cellSize)}`;

    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(spot);
  });

  const items: ClusterItem<T>[] = [];

  Object.entries(clusters).forEach(([key, group]) => {
    if (group.length === 1) {
      items.push({ type: "spot", spot: group[0] });
      return;
    }

    const lat = group.reduce((sum, spot) => sum + Number(spot.lat), 0) / group.length;
    const lng = group.reduce((sum, spot) => sum + Number(spot.lng), 0) / group.length;

    items.push({
      type: "cluster",
      key,
      count: group.length,
      lat,
      lng,
      spots: group,
    });
  });

  return items;
}
