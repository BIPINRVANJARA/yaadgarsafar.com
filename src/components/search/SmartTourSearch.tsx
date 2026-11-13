"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Compass,
  ChevronDown,
  Check,
  Globe,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SmartTourSearch: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [duration, setDuration] = useState<string>("all");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Unified single active dropdown state
  const [activeDropdown, setActiveDropdown] = useState<
    "destination" | "category" | "duration" | "travellers" | null
  >(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const destinationSuggestions = [
    { name: "Kashmir", type: "Domestic", subtitle: "Snow peaks, Shikaras & Gulmarg" },
    { name: "Goa", type: "Domestic", subtitle: "Beaches, cruises & vibrant nightlife" },
    { name: "Kerala", type: "Domestic", subtitle: "Tranquil backwaters, tea gardens & Munnar" },
    { name: "Rajasthan", type: "Domestic", subtitle: "Jaipur, Udaipur & royal forts" },
    { name: "Manali", type: "Domestic", subtitle: "Himachal mountain passes & adventure" },
    { name: "Dubai", type: "International", subtitle: "Luxury desert safari & skyline" },
    { name: "Bali", type: "International", subtitle: "Tropical beaches, temples & villas" },
    { name: "Thailand", type: "International", subtitle: "Bangkok, Phuket & island hopping" },
    { name: "Switzerland", type: "International", subtitle: "Alpine snow, Jungfrau & Lucerne" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Experiences", description: "Explore all travel styles" },
    { value: "family", label: "Family Vacations", description: "Kid & senior friendly itineraries" },
    { value: "honeymoon", label: "Honeymoon & Romantic", description: "Couples retreats & candlelight dining" },
    { value: "adventure", label: "Adventure & Wildlife", description: "Trekking, water sports & safaris" },
    { value: "relaxation", label: "Relaxation & Spa", description: "Scenic wellness, beaches & nature" },
    { value: "cultural", label: "Heritage & Cultural", description: "Monuments, temples & traditions" },
  ];

  const durationOptions = [
    { value: "all", label: "Any Duration", description: "Flexible schedule" },
    { value: "1-3", label: "1 - 3 Days", description: "Weekend getaways" },
    { value: "4-7", label: "4 - 7 Days", description: "Most popular vacations" },
    { value: "8+", label: "8+ Days", description: "Grand extended journeys" },
  ];

  const selectedCategoryObj =
    categoryOptions.find((c) => c.value === category) || categoryOptions[0];

  const selectedDurationObj =
    durationOptions.find((d) => d.value === duration) || durationOptions[0];

  const filteredDestinations = destinationSuggestions.filter((item) => {
    if (tripType === "domestic" && item.type !== "Domestic") return false;
    if (tripType === "international" && item.type !== "International") return false;
    if (!destination.trim()) return true;
    return (
      item.name.toLowerCase().includes(destination.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(destination.toLowerCase())
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (destination.trim()) {
      params.set("destination", destination.trim());
    }
    if (tripType !== "all") {
      params.set("type", tripType);
    }
    if (category !== "all") {
      params.set("category", category);
    }
    if (duration !== "all") {
      params.set("duration", duration);
    }
    if (adults > 0) {
      params.set("adults", adults.toString());
    }
    if (children > 0) {
      params.set("children", children.toString());
    }

    router.push(`/packages?${params.toString()}`);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 border border-white/60 relative z-30",
        className
      )}
    >
      <form onSubmit={handleSearch}>
        {/* Quick Trip Type Tabs */}
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-brand-borderGrey/80">
          <button
            type="button"
            onClick={() => {
              setTripType("all");
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              tripType === "all"
                ? "bg-brand-red text-white shadow-sm"
                : "bg-brand-offWhite text-brand-grey hover:text-brand-charcoal"
            )}
          >
            All Holidays
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType("domestic");
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              tripType === "domestic"
                ? "bg-brand-red text-white shadow-sm"
                : "bg-brand-offWhite text-brand-grey hover:text-brand-charcoal"
            )}
          >
            Domestic India Tours
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType("international");
            }}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
              tripType === "international"
                ? "bg-brand-red text-white shadow-sm"
                : "bg-brand-offWhite text-brand-grey hover:text-brand-charcoal"
            )}
          >
            International Escapes
          </button>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-center">
          {/* 1. Destination Field with Custom Popover */}
          <div className="relative">
            <div
              onClick={() =>
                setActiveDropdown(activeDropdown === "destination" ? null : "destination")
              }
              className={cn(
                "bg-brand-offWhite hover:bg-brand-borderGrey/40 rounded-xl p-3 transition-all cursor-pointer flex items-center justify-between border",
                activeDropdown === "destination"
                  ? "bg-white ring-2 ring-brand-red border-transparent"
                  : "border-transparent"
              )}
            >
              <div className="w-full pr-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-red shrink-0" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      if (activeDropdown !== "destination") {
                        setActiveDropdown("destination");
                      }
                    }}
                    onFocus={() => setActiveDropdown("destination")}
                    placeholder="Where to? (e.g. Kashmir)"
                    className="w-full bg-transparent text-sm font-semibold text-brand-charcoal placeholder:text-brand-grey/60 focus:outline-none"
                  />
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-brand-grey shrink-0 transition-transform duration-200",
                  activeDropdown === "destination" ? "rotate-180 text-brand-red" : ""
                )}
              />
            </div>

            {/* Custom Destination Popover */}
            {activeDropdown === "destination" && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-80 bg-white shadow-2xl rounded-2xl p-2 border border-brand-borderGrey z-40 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-brand-borderGrey/70 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-grey">
                    Popular Destinations
                  </span>
                  <span className="text-[10px] text-brand-red font-semibold bg-brand-softRed px-2 py-0.5 rounded-full">
                    {filteredDestinations.length} Places
                  </span>
                </div>
                <div className="space-y-0.5">
                  {filteredDestinations.length > 0 ? (
                    filteredDestinations.map((item) => {
                      const isSelected =
                        destination.toLowerCase() === item.name.toLowerCase();
                      return (
                        <div
                          key={item.name}
                          onClick={() => {
                            setDestination(item.name);
                            setActiveDropdown(null);
                          }}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors group",
                            isSelected
                              ? "bg-brand-softRed text-brand-deepRed font-bold"
                              : "hover:bg-brand-softRed/60 text-brand-charcoal"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                isSelected
                                  ? "bg-brand-red text-white"
                                  : "bg-brand-offWhite text-brand-red group-hover:bg-brand-red group-hover:text-white"
                              )}
                            >
                              {item.type === "Domestic" ? (
                                <MapPin className="w-3.5 h-3.5" />
                              ) : (
                                <Globe className="w-3.5 h-3.5" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{item.name}</p>
                              <p className="text-[11px] text-brand-grey line-clamp-1">
                                {item.subtitle}
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-brand-red shrink-0" />
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-brand-grey">
                      No matching destinations found. You can still press search to find tours!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Travel Style Field with Custom Popover */}
          <div className="relative">
            <div
              onClick={() =>
                setActiveDropdown(activeDropdown === "category" ? null : "category")
              }
              className={cn(
                "bg-brand-offWhite hover:bg-brand-borderGrey/40 rounded-xl p-3 transition-all cursor-pointer flex items-center justify-between border",
                activeDropdown === "category"
                  ? "bg-white ring-2 ring-brand-red border-transparent"
                  : "border-transparent"
              )}
            >
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Travel Style
                </label>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                  <Compass className="w-4 h-4 text-brand-red shrink-0" />
                  <span className="truncate">{selectedCategoryObj.label}</span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-brand-grey shrink-0 transition-transform duration-200",
                  activeDropdown === "category" ? "rotate-180 text-brand-red" : ""
                )}
              />
            </div>

            {/* Custom Travel Style Popover */}
            {activeDropdown === "category" && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-72 bg-white shadow-2xl rounded-2xl p-2 border border-brand-borderGrey z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-brand-borderGrey/70 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-grey">
                    Choose Travel Style
                  </span>
                </div>
                <div className="space-y-0.5">
                  {categoryOptions.map((opt) => {
                    const isSelected = category === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setCategory(opt.value);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors",
                          isSelected
                            ? "bg-brand-softRed text-brand-deepRed font-bold"
                            : "hover:bg-brand-softRed/60 text-brand-charcoal"
                        )}
                      >
                        <div>
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-[11px] text-brand-grey">{opt.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-brand-red shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Duration Field with Custom Popover */}
          <div className="relative">
            <div
              onClick={() =>
                setActiveDropdown(activeDropdown === "duration" ? null : "duration")
              }
              className={cn(
                "bg-brand-offWhite hover:bg-brand-borderGrey/40 rounded-xl p-3 transition-all cursor-pointer flex items-center justify-between border",
                activeDropdown === "duration"
                  ? "bg-white ring-2 ring-brand-red border-transparent"
                  : "border-transparent"
              )}
            >
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Duration
                </label>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                  <Calendar className="w-4 h-4 text-brand-red shrink-0" />
                  <span className="truncate">{selectedDurationObj.label}</span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-brand-grey shrink-0 transition-transform duration-200",
                  activeDropdown === "duration" ? "rotate-180 text-brand-red" : ""
                )}
              />
            </div>

            {/* Custom Duration Popover */}
            {activeDropdown === "duration" && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-64 bg-white shadow-2xl rounded-2xl p-2 border border-brand-borderGrey z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-brand-borderGrey/70 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-grey">
                    Select Trip Length
                  </span>
                </div>
                <div className="space-y-0.5">
                  {durationOptions.map((opt) => {
                    const isSelected = duration === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setDuration(opt.value);
                          setActiveDropdown(null);
                        }}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors",
                          isSelected
                            ? "bg-brand-softRed text-brand-deepRed font-bold"
                            : "hover:bg-brand-softRed/60 text-brand-charcoal"
                        )}
                      >
                        <div>
                          <p className="text-sm font-semibold">{opt.label}</p>
                          <p className="text-[11px] text-brand-grey">{opt.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-brand-red shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. Travellers Selector & Popover */}
          <div className="relative">
            <div
              onClick={() =>
                setActiveDropdown(activeDropdown === "travellers" ? null : "travellers")
              }
              className={cn(
                "bg-brand-offWhite hover:bg-brand-borderGrey/40 rounded-xl p-3 cursor-pointer transition-all flex items-center justify-between border",
                activeDropdown === "travellers"
                  ? "bg-white ring-2 ring-brand-red border-transparent"
                  : "border-transparent"
              )}
            >
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Travellers
                </label>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-charcoal">
                  <Users className="w-4 h-4 text-brand-red shrink-0" />
                  <span>
                    {adults} {adults === 1 ? "Adult" : "Adults"}
                    {children > 0 && `, ${children} ${children === 1 ? "Kid" : "Kids"}`}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-brand-grey shrink-0 transition-transform duration-200",
                  activeDropdown === "travellers" ? "rotate-180 text-brand-red" : ""
                )}
              />
            </div>

            {/* Travellers Popover */}
            {activeDropdown === "travellers" && (
              <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-64 bg-white shadow-2xl rounded-2xl p-4 border border-brand-borderGrey z-40 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between py-2 border-b border-brand-borderGrey">
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">Adults</p>
                    <p className="text-[11px] text-brand-grey">Ages 12+</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-full bg-brand-offWhite border border-brand-borderGrey font-bold text-brand-charcoal hover:bg-brand-borderGrey flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="w-7 h-7 rounded-full bg-brand-offWhite border border-brand-borderGrey font-bold text-brand-charcoal hover:bg-brand-borderGrey flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">Children</p>
                    <p className="text-[11px] text-brand-grey">Ages 2-11</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-full bg-brand-offWhite border border-brand-borderGrey font-bold text-brand-charcoal hover:bg-brand-borderGrey flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-bold">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="w-7 h-7 rounded-full bg-brand-offWhite border border-brand-borderGrey font-bold text-brand-charcoal hover:bg-brand-borderGrey flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDropdown(null)}
                  className="w-full mt-3 py-2 bg-brand-charcoal text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
                >
                  Apply Travellers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-brand-borderGrey/60">
          <p className="text-xs text-brand-grey text-center sm:text-left flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-red shrink-0" />
            <span>Instant itineraries with transparent inclusions & flexible WhatsApp customization.</span>
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5" />
            <span>Find My Trip</span>
          </button>
        </div>
      </form>
    </div>
  );
};
