import { initialPackages } from "@/lib/data/mockData";
import { PackageDetailsClient } from "@/components/packages/PackageDetailsClient";

export function generateStaticParams() {
  return initialPackages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

export default function PackageDetailsPage({ params }: { params: { slug: string } }) {
  return <PackageDetailsClient slug={params.slug} />;
}
