import SpotPageClient from "./SpotPageClient";

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SpotPageClient id={id} />;
}