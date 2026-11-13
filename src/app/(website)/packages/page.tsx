"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PackageCard } from "@/components/packages/PackageCard";
import { travelService } from "@/services/travelService";
import { TourPackage } from "@/types";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Compass,
  ArrowUpDown,
  Sparkles,
  MapPin,
  Clock,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

function PackagesContent() {
  const searchParams = useSearchParams();

  // URL Query Parameters Initial State
  const initialDestination = searchParams.get("destination") || "";
  const initialType = searchParams.get("type") || "all";
  const initialCategory = searchParams.get("category") || "all";
  const initialDuration = searchParams.get("duration") || "all";

  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialDestination);
  const [tripType, setTripType] = useState(initialType);
  const [category, setCategory] = useState(initialCategory);
  const [duration, setDuration] = useState(initialDuration);
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc" | "duration" | "newest">("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      const data = await travelService.getPackages();
      setPackages(data);
      setLoading(false);
    }
    fetchPackages();
  }, []);

  // Filter & Sort Logic
  const filteredPackages = useMemo(() => {
    let result = [...packages];

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.destination_name.toLowerCase().includes(q) ||
          p.short_description.toLowerCase().includes(q)
      );
    }

    // Trip Type
    if (tripType !== "all") {
      result = result.filter((p) => p.trip_type === tripType);
    }

    // Category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Duration
    if (duration !== "all") {
      if (duration === "1-3") {
        result = result.filter((p) => p.duration_days <= 3);
      } else if (duration === "4-7") {
        result = result.filter((p) => p.duration_days >= 4 && p.duration_days <= 7);
      } else if (duration === "8+") {
        result = result.filter((p) => p.duration_days >= 8);
      }
    }

    // Max Price
    result = result.filter((p) => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        result.sort((a, b) => a.duration_days - b.duration_days);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // recommended
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [packages, search, tripType, category, duration, maxPrice, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setTripType("all");
    setCategory("all");
    setDuration("all");
    setMaxPrice(150000);
    setSortBy("recommended");
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    (tripType !== "all" ? 1 : 0) +
    (category !== "all" ? 1 : 0) +
    (duration !== "all" ? 1 : 0) +
    (maxPrice < 150000 ? 1 : 0);

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <nav className="text-xs text-brand-grey mb-3 flex items-center gap-2">
            <a href="/" className="hover:text-brand-charcoal">Home</a>
            <span>/</span>
            <span className="text-brand-charcoal font-semibold">Tour Packages</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
                Explore Tour Packages
              </h1>
              <p className="mt-2 text-sm text-brand-grey">
                Showing {filteredPackages.length} handcrafted holiday itineraries
              </p>
            </div>

            {/* Mobile Filter Toggle & Sort Dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-brand-borderGrey text-sm font-bold text-brand-charcoal shadow-sm"
              >
                <Filter className="w-4 h-4 text-brand-red" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-brand-borderGrey shadow-sm text-xs font-semibold">
                <ArrowUpDown className="w-4 h-4 text-brand-grey" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-brand-charcoal font-bold focus:outline-none cursor-pointer"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="duration">Duration</option>
                  <option value="newest">Recently Added</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Package Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-3xl border border-brand-borderGrey/80 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-brand-borderGrey">
              <h3 className="font-heading font-bold text-lg text-brand-charcoal flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-red" />
                <span>Filters</span>
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-brand-deepRed hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                Search Packages
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-brand-grey absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Destination, package name..."
                  className="w-full bg-brand-offWhite rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            {/* Trip Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                Trip Scope
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-brand-offWhite p-1 rounded-xl">
                {["all", "domestic", "international"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTripType(t)}
                    className={cn(
                      "py-1.5 text-xs font-bold capitalize rounded-lg transition-all",
                      tripType === t
                        ? "bg-white text-brand-charcoal shadow-sm"
                        : "text-brand-grey hover:text-brand-charcoal"
                    )}
                  >
                    {t === "domestic" ? "India" : t === "international" ? "Abroad" : "All"}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-brand-offWhite rounded-xl p-2.5 text-xs font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="honeymoon">Honeymoon & Romantic</option>
                <option value="family">Family Vacations</option>
                <option value="cultural">Heritage & Cultural</option>
                <option value="relaxation">Relaxation & Spa</option>
                <option value="adventure">Adventure & Thrills</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                Duration
              </label>
              <div className="space-y-1.5">
                {[
                  { label: "Any Duration", value: "all" },
                  { label: "1 - 3 Days (Weekend)", value: "1-3" },
                  { label: "4 - 7 Days (Popular)", value: "4-7" },
                  { label: "8+ Days (Extended)", value: "8+" },
                ].map((d) => (
                  <label
                    key={d.value}
                    className="flex items-center gap-2 text-xs text-brand-charcoal font-medium cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="duration"
                      checked={duration === d.value}
                      onChange={() => setDuration(d.value)}
                      className="accent-brand-red"
                    />
                    <span>{d.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-brand-grey">Budget Cap</span>
                <span className="font-extrabold text-brand-charcoal">{formatCurrency(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="150000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-red cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-grey mt-1">
                <span>₹10,000</span>
                <span>₹1,50,000+</span>
              </div>
            </div>
          </aside>

          {/* Package Cards Listing */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 rounded-3xl bg-white border border-brand-borderGrey animate-pulse" />
                ))}
              </div>
            ) : filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} packageData={pkg} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-brand-borderGrey shadow-sm">
                <Compass className="w-12 h-12 text-brand-red mx-auto mb-4" />
                <h3 className="font-heading font-bold text-xl text-brand-charcoal">
                  No packages match your filters
                </h3>
                <p className="mt-2 text-sm text-brand-grey max-w-sm mx-auto">
                  Try clearing your search or adjust the budget and duration sliders. Or let us build a custom trip just for you!
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 rounded-full bg-brand-charcoal text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <a
                    href="/custom-trip"
                    className="px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-deepRed transition-colors"
                  >
                    Request Custom Trip
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-borderGrey">
                <h3 className="font-heading font-bold text-lg text-brand-charcoal">
                  Filter Packages
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full bg-brand-offWhite text-brand-charcoal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Inputs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Destination, package..."
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                  Trip Scope
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["all", "domestic", "international"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTripType(t)}
                      className={cn(
                        "py-2 text-xs font-bold capitalize rounded-xl border",
                        tripType === t
                          ? "bg-brand-red text-white border-brand-red"
                          : "bg-white text-brand-charcoal border-brand-borderGrey"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold"
                >
                  <option value="all">All Categories</option>
                  <option value="honeymoon">Honeymoon & Romantic</option>
                  <option value="family">Family Vacations</option>
                  <option value="cultural">Heritage & Cultural</option>
                  <option value="relaxation">Relaxation & Spa</option>
                  <option value="adventure">Adventure & Thrills</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-brand-borderGrey flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="w-1/2 py-3 rounded-xl bg-brand-offWhite text-brand-charcoal text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-brand-red text-white text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PackagesPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 text-center min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red" />
        </div>
      }
    >
      <PackagesContent />
    </Suspense>
  );
}
