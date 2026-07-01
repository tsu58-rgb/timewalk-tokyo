import SeichiSpotDetail from "./SeichiSpotDetail";
import SpotPageClient from "./SpotPageClient";

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const special = id.substring(0, 2) === "se" && id.charAt(2) === "_";

  if (special) return <SeichiSpotDetail id={id} />;
  return <SpotPageClient id={id} />;
}
