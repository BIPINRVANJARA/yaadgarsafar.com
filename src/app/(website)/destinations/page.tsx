"use client";

import React, { useState, useEffect } from "react";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { travelService } from "@/services/travelService";
import { Destination } from "@/types";
import { Search, Compass, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripType, setTripType] = useState<"all" | "domestic" | "international">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await travelService.getDestinations();
      setDestinations(data);
      setLoading(false);
    }
    load();
  }, []);

  const filteredDestinations = destinations.filter((d) => {
    if (tripType !== "all" && d.trip_type !== tripType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.state_or_country.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Destination Showcase
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Discover Captivating Destinations
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-grey leading-relaxed">
            From regal palaces in Rajasthan to tropical islands in Bali and Swiss alpine wonderlands.
          </p>
        </div>

        {/* Controls: Search + Domestic / International Tabs */}
        <div className="max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl md:rounded-full border border-brand-borderGrey shadow-sm">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 w-full sm:w-1/2">
            <Search className="w-4 h-4 text-brand-grey shrink-0" />
            <input
              type="text"
              placeholder="Search destination, state, country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-brand-charcoal focus:outline-none"
            />
          </div>

          {/* Scope Tabs */}
          <div className="flex items-center gap-1.5 bg-brand-offWhite p-1 rounded-full w-full sm:w-auto justify-center">
            <button
              onClick={() => setTripType("all")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                tripType === "all"
                  ? "bg-brand-charcoal text-white shadow-sm"
                  : "text-brand-grey hover:text-brand-charcoal"
              )}
            >
              All ({destinations.length})
            </button>
            <button
              onClick={() => setTripType("domestic")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                tripType === "domestic"
                  ? "bg-brand-red text-white shadow-sm"
                  : "text-brand-grey hover:text-brand-charcoal"
              )}
            >
              Incredible India
            </button>
            <button
              onClick={() => setTripType("international")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                tripType === "international"
                  ? "bg-brand-red text-white shadow-sm"
                  : "text-brand-grey hover:text-brand-charcoal"
              )}
            >
              International
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-white border border-brand-borderGrey animate-pulse" />
            ))}
          </div>
        ) : filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-brand-borderGrey shadow-sm max-w-md mx-auto">
            <Compass className="w-12 h-12 text-brand-red mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-brand-charcoal">
              No destinations found
            </h3>
            <p className="text-xs text-brand-grey mt-1">
              Try adjusting your search query or reset the filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setTripType("all");
              }}
              className="mt-4 px-6 py-2 rounded-full bg-brand-charcoal text-white text-xs font-bold"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
