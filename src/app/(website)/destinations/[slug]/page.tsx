import { initialDestinations } from "@/lib/data/mockData";
import { DestinationDetailsClient } from "@/components/destinations/DestinationDetailsClient";

export function generateStaticParams() {
  return initialDestinations.map((d) => ({
    slug: d.slug,
  }));
}

export default function DestinationDetailsPage({ params }: { params: { slug: string } }) {
  return <DestinationDetailsClient slug={params.slug} />;
}
