import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/types";
import { MapPin, ArrowUpRight, Compass } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ destination }) => {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-500 flex flex-col justify-end p-6 border border-brand-borderGrey/50"
    >
      {/* Background Image with Hover Zoom */}
      <div className="absolute inset-0 z-0">
        <Image
          src={destination.cover_image}
          alt={destination.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        {/* Layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors duration-500" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
          <MapPin className="w-3 h-3 text-brand-red" />
          <span>{destination.trip_type === "domestic" ? "Domestic" : "International"}</span>
        </span>

        {destination.package_count > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
            {destination.package_count} Packages
          </span>
        )}
      </div>

      {/* Content Area */}
      <div className="relative z-10 transition-transform duration-300 transform group-hover:-translate-y-1">
        <p className="text-xs font-semibold text-brand-softRed uppercase tracking-wider mb-1">
          {destination.state_or_country}
        </p>

        <h3 className="text-2xl md:text-3xl font-heading font-extrabold text-white tracking-tight">
          {destination.name}
        </h3>

        <p className="mt-2 text-xs md:text-sm text-white/80 line-clamp-2 font-normal leading-relaxed">
          {destination.description}
        </p>

        {/* Pricing & CTA footer */}
        <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-white/60 block">Starting from</span>
            <span className="text-lg font-heading font-bold text-white">
              {destination.starting_price ? formatCurrency(destination.starting_price) : "Custom"}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold bg-white text-brand-charcoal group-hover:bg-brand-red group-hover:text-white px-4 py-2 rounded-full transition-colors duration-300 shadow-md">
            <span>Explore</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
};
