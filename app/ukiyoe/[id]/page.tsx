import UkiyoeDetailClient from "./UkiyoeDetailClient";

export default async function UkiyoeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UkiyoeDetailClient id={id} />;
}
