import { notFound } from "next/navigation";
import UkiyoeDetailClient from "./UkiyoeDetailClient";
import { getUkiyoeSpots, UKIYOE_REVALIDATE_SECONDS, type UkiyoeSpot } from "../data";

export const revalidate = UKIYOE_REVALIDATE_SECONDS;

type PageParams = {
  params: Promise<{ id: string }>;
};

function orderNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

function isUkiyoeSpot(value: UkiyoeSpot | undefined): value is UkiyoeSpot {
  return Boolean(value);
}

export async function generateStaticParams() {
  const spots = await getUkiyoeSpots();
  return spots.map((spot) => ({ id: spot.id }));
}

export default async function UkiyoeDetailPage({ params }: PageParams) {
  const { id } = await params;
  const spots = await getUkiyoeSpots();
  const spot = spots.find((item) => item.id === id);

  if (!spot) {
    notFound();
  }

  const nearbySpots = spots
    .filter((item) => item.id !== spot.id)
    .sort((a, b) => distanceKm(spot, a) - distanceKm(spot, b))
    .slice(0, 4);

  const sameSeries = spots
    .filter((item) => item.seriesId === spot.seriesId)
    .sort((a, b) => orderNumber(a.seriesOrder) - orderNumber(b.seriesOrder));
  const currentIndex = sameSeries.findIndex((item) => item.id === spot.id);
  const seriesNeighbors = [sameSeries[currentIndex - 1], sameSeries[currentIndex + 1]].filter(isUkiyoeSpot);

  return (
    <UkiyoeDetailClient
      spot={spot}
      nearbySpots={nearbySpots}
      seriesNeighbors={seriesNeighbors}
    />
  );
}
