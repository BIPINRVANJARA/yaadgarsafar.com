"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { travelService } from "@/services/travelService";
import { TourPackage, PackageDepartureDate } from "@/types";
import { PackageCard } from "@/components/packages/PackageCard";
import {
  MapPin,
  Clock,
  Check,
  X as CloseIcon,
  ChevronDown,
  Calendar,
  MessageCircle,
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Send,
  HelpCircle,
  Utensils,
  Hotel,
  Plane,
  Car,
  Compass,
  FileText,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Luggage,
  Tag,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface PackageDetailsClientProps {
  slug: string;
}

export function PackageDetailsClient({ slug }: PackageDetailsClientProps) {
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [relatedPackages, setRelatedPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<number | null>(1);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null);

  // Departure date selection & Pricing calculator
  const [selectedDeparture, setSelectedDeparture] = useState<PackageDepartureDate | null>(null);
  const [custAdults, setCustAdults] = useState(2);
  const [custChildren, setCustChildren] = useState(0);
  const [selectedPricingTier, setSelectedPricingTier] = useState<"couple" | "family" | null>(null);

  // Enquiry Form State
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const pkg = await travelService.getPackageBySlug(slug);
      if (pkg) {
        setPackageData(pkg);
        if (pkg.departure_dates && pkg.departure_dates.length > 0) {
          setSelectedDeparture(pkg.departure_dates[0]);
        }
        const allPkgs = await travelService.getPackages();
        const related = allPkgs.filter(
          (p) =>
            p.id !== pkg.id &&
            (p.destination_name === pkg.destination_name || p.category === pkg.category)
        );
        setRelatedPackages(related.slice(0, 3));
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red" />
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
          Loading Curated Journey...
        </p>
      </div>
    );
  }

  if (!packageData) {
    return notFound();
  }

  // Dynamic Couple & Family Pricing Tier Logic
  const isSeparatePricing =
    packageData.pricing_display_mode === "separate" &&
    Boolean(packageData.couple_final_price) &&
    Boolean(packageData.family_final_price);

  // Auto-detect tier based on guest party size: 2 adults and 0 children is "couple", otherwise "family"
  const autoTier: "couple" | "family" =
    custAdults === 2 && custChildren === 0 ? "couple" : "family";
  const activePricingTier = selectedPricingTier || autoTier;

  const coupleRate = packageData.couple_final_price || packageData.price;
  const familyRate = packageData.family_final_price || packageData.price;

  // Dynamic Customer Discount Status
  const discountInfo = travelService.getPackageDiscountStatus(
    packageData.price,
    packageData.discount_enabled,
    packageData.discount_type,
    packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.original_price
  );

  const coupleDiscountInfo = travelService.getPackageDiscountStatus(
    packageData.couple_final_price || packageData.price,
    packageData.discount_enabled,
    packageData.couple_pricing_configuration?.discount_type || packageData.discount_type,
    packageData.couple_pricing_configuration?.discount_value || packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.couple_original_price
  );

  const familyDiscountInfo = travelService.getPackageDiscountStatus(
    packageData.family_final_price || packageData.price,
    packageData.discount_enabled,
    packageData.family_pricing_configuration?.discount_type || packageData.discount_type,
    packageData.family_pricing_configuration?.discount_value || packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.family_original_price
  );

  const activeDiscount = isSeparatePricing
    ? activePricingTier === "couple"
      ? coupleDiscountInfo
      : familyDiscountInfo
    : discountInfo;

  let baseAdultUnitPrice = activeDiscount.isActive
    ? activeDiscount.discountedPrice
    : packageData.price;
  if (isSeparatePricing) {
    baseAdultUnitPrice = activePricingTier === "couple"
      ? (coupleDiscountInfo.isActive ? coupleDiscountInfo.discountedPrice : coupleRate)
      : (familyDiscountInfo.isActive ? familyDiscountInfo.discountedPrice : familyRate);
  }

  // Calculate dynamic price based on selected departure date & adults
  const unitPrice = selectedDeparture ? selectedDeparture.adult_price : baseAdultUnitPrice;
  const childUnitPrice = selectedDeparture?.child_price || Math.round(unitPrice * 0.75);
  const calculatedTotal =
    packageData.pricing_basis === "per package"
      ? unitPrice
      : unitPrice * custAdults + childUnitPrice * custChildren;

  const pricingTierLabel = isSeparatePricing
    ? activePricingTier === "couple"
      ? "Couple (2 Persons)"
      : "Family (More than 2 Persons)"
    : "Standard";

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    setEnquirySubmitting(true);
    try {
      await travelService.submitEnquiry({
        customer_name: custName,
        email: custEmail,
        phone: custPhone,
        destination: packageData.destination_name,
        package_id: packageData.id,
        package_title: packageData.title,
        departure_date: travelDate || selectedDeparture?.departure_date || "",
        adults: custAdults,
        children: custChildren,
        total_amount: calculatedTotal,
        message: `Package Booking Request for ${packageData.title} (${custAdults} Adults, ${custChildren} Children) - Category: ${pricingTierLabel} @ ${formatCurrency(unitPrice)}/person${activeDiscount.isActive ? ` (${activeDiscount.percentageOff}% OFF, Saved ${formatCurrency(activeDiscount.savings)})` : ""} - Est. Total: ${formatCurrency(calculatedTotal)}`,
      });
      setEnquirySuccess(true);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello YaadgarSafar! I am interested in booking "${packageData.title}" (${isSeparatePricing ? `${pricingTierLabel}: ` : ""}${formatCurrency(unitPrice)}/person${activeDiscount.isActive ? ` - ${activeDiscount.percentageOff}% OFF` : ""}) for ${custAdults} Adults${custChildren > 0 ? ` and ${custChildren} Children` : ""}. Travel Date: ${selectedDeparture?.departure_date || "Flexible"}. Please share availability and complete quotation.`
  );

  return (
    <div className="bg-brand-offWhite min-h-screen">
      {/* 1. HERO BANNER */}
      <section className="relative h-[480px] md:h-[540px] w-full bg-slate-950 pt-24">
        <Image
          src={packageData.cover_image}
          alt={packageData.cover_image_alt || packageData.title}
          fill
          priority
          unoptimized={true}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-10">
          {/* Breadcrumb */}
          <nav className="text-xs text-white/70 mb-3 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-white transition">Packages</Link>
            <span>/</span>
            <span className="text-white font-semibold">{packageData.destination_name}</span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {activeDiscount.isActive && (
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
                <Tag className="w-3.5 h-3.5 text-white" />
                <span>Special Deal: {activeDiscount.percentageOff}% OFF</span>
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-brand-red text-white text-xs font-bold uppercase tracking-wider shadow-md">
              {packageData.badge || packageData.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-brand-softRed" />
              <span>{packageData.destination_name}, {packageData.country || "India"}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20">
              <Clock className="w-3.5 h-3.5 text-brand-softRed" />
              <span>{packageData.duration_days} Days / {packageData.duration_nights} Nights</span>
            </span>
            {packageData.departure_city && (
              <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs font-semibold hidden sm:inline-flex items-center gap-1.5 border border-white/10">
                <Plane className="w-3.5 h-3.5 text-brand-softRed" />
                <span>Ex-{packageData.departure_city}</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white tracking-tight max-w-4xl">
            {packageData.title}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-white/85 max-w-2xl leading-relaxed line-clamp-2">
            {packageData.short_description}
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-8">
            {/* TRIP HIGHLIGHTS & OVERVIEW */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 mb-2">
                  Trip Overview & Experience
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {packageData.full_description || packageData.description}
                </p>
              </div>

              {/* Highlights */}
              {packageData.highlights && packageData.highlights.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-red" />
                    Key Journey Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {packageData.highlights.map((highlight, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium bg-slate-50/80 p-2.5 rounded-xl border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trip Quick Facts Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Best Time</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {packageData.best_time || "Round the Year"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Travelers</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {packageData.min_travelers || 2} to {packageData.max_travelers || 20} Guests
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Language</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {Array.isArray(packageData.languages) ? packageData.languages.join(", ") : "Hindi, English"}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[11px] text-slate-500 font-medium block">Age Group</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                    {packageData.recommended_age_group || "Family Friendly"}
                  </span>
                </div>
              </div>
            </div>

            {/* PHOTO GALLERY */}
            {packageData.gallery_images && packageData.gallery_images.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-4">
                <h3 className="text-lg font-heading font-extrabold text-slate-900 flex items-center justify-between">
                  <span>Visual Showcase & Moments</span>
                  <span className="text-xs text-slate-400 font-normal">
                    {packageData.gallery_images.length} Photos
                  </span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {packageData.gallery_images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedGalleryImg(img)}
                      className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer group hover:scale-[1.02] transition"
                    >
                      <Image
                        src={img}
                        alt={`Gallery ${i}`}
                        fill
                        className="object-cover group-hover:brightness-105 transition"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DAY-WISE ITINERARY ACCORDION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900">
                    Day-Wise Travel Itinerary
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Detailed daily plan with verified accommodations, scenic road routes, and included meals
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-brand-softRed text-brand-deepRed text-xs font-bold">
                  {packageData.itinerary?.length || packageData.duration_days} Days
                </span>
              </div>

              <div className="space-y-3">
                {packageData.itinerary?.map((day) => {
                  const isOpen = activeDay === day.day;
                  return (
                    <div
                      key={day.day}
                      className={cn(
                        "rounded-2xl border transition-all overflow-hidden",
                        isOpen
                          ? "border-brand-red/40 bg-brand-softRed/10 shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDay(isOpen ? null : day.day)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-brand-red text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-sm">
                            D{day.day}
                          </span>
                          <div>
                            <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900">
                              {day.title}
                            </h3>
                            {day.travel_duration && (
                              <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span>{day.travel_duration}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0",
                            isOpen && "transform rotate-180 text-brand-red"
                          )}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-gray-100 space-y-4">
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {day.description || day.activities}
                          </p>

                          {/* Day Meta Tags */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                            {day.hotel_name && (
                              <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900">
                                <span className="font-bold flex items-center gap-1 text-[11px] text-blue-700">
                                  <Hotel className="w-3.5 h-3.5" /> Stay / Hotel
                                </span>
                                <span className="mt-0.5 block font-medium truncate">
                                  {day.hotel_name}
                                </span>
                              </div>
                            )}

                            {day.transfers && (
                              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900">
                                <span className="font-bold flex items-center gap-1 text-[11px] text-emerald-700">
                                  <Car className="w-3.5 h-3.5" /> Fleet / Transfer
                                </span>
                                <span className="mt-0.5 block font-medium truncate">
                                  {day.transfers}
                                </span>
                              </div>
                            )}

                            {(day.meals_included || day.meals) && (
                              <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-xs text-amber-900">
                                <span className="font-bold flex items-center gap-1 text-[11px] text-amber-700">
                                  <Utensils className="w-3.5 h-3.5" /> Meals Included
                                </span>
                                <span className="mt-0.5 block font-medium">
                                  {Array.isArray(day.meals_included)
                                    ? day.meals_included.join(", ")
                                    : day.meals}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Sightseeing spots */}
                          {day.sightseeing && day.sightseeing.length > 0 && (
                            <div className="pt-1 flex flex-wrap items-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-500 uppercase">
                                Sightseeing:
                              </span>
                              {day.sightseeing.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FLIGHT TIMELINE SECTION (IF FLIGHTS CONFIGURED) */}
            {packageData.flights && packageData.flights.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-brand-red" />
                    Included Flight Schedules & Baggage
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    {packageData.flights.length} Flight Leg{packageData.flights.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {packageData.flights.map((flight, idx) => (
                    <div
                      key={flight.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-red text-white">
                            {flight.airline_name}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            {flight.flight_number}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            ({flight.flight_type === "direct" ? "Direct" : "Connecting"})
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          Duration: {flight.flight_duration}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div>
                          <div className="text-base font-heading font-extrabold text-slate-900">
                            {flight.departure_time}
                          </div>
                          <div className="font-semibold text-slate-700">
                            {flight.departure_city} ({flight.departure_airport})
                          </div>
                        </div>

                        <div className="flex-1 px-4 text-center">
                          <div className="h-0.5 bg-slate-300 relative w-full my-2">
                            <Plane className="w-4 h-4 text-brand-red absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                          </div>
                          <span className="text-[10px] text-slate-400">Air Route</span>
                        </div>

                        <div className="text-right">
                          <div className="text-base font-heading font-extrabold text-slate-900">
                            {flight.arrival_time}
                          </div>
                          <div className="font-semibold text-slate-700">
                            {flight.arrival_city} ({flight.arrival_airport})
                          </div>
                        </div>
                      </div>

                      {(flight.cabin_baggage || flight.checkin_baggage) && (
                        <div className="pt-2 border-t border-slate-200/60 flex items-center gap-4 text-[11px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <Luggage className="w-3.5 h-3.5 text-slate-400" />
                            Cabin: {flight.cabin_baggage || "7 Kg"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Luggage className="w-3.5 h-3.5 text-slate-400" />
                            Check-in: {flight.checkin_baggage || "15 Kg"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HOTELS & RESORTS SECTION */}
            {packageData.hotels && packageData.hotels.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-4">
                <h3 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                  <Hotel className="w-5 h-5 text-brand-red" />
                  Accommodations & Stay Experience
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageData.hotels.map((htl, idx) => (
                    <div
                      key={htl.id || idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{htl.hotel_name}</span>
                        <span className="text-xs font-bold text-amber-500">
                          {"★".repeat(htl.rating || 4)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{htl.location}</span>
                        <span>•</span>
                        <span>{htl.nights} Nights</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700 bg-white p-2 rounded-xl border border-slate-100">
                        Room: {htl.room_category}
                      </div>
                      {htl.meals_included && (
                        <div className="text-[11px] text-slate-500">
                          Meal Plan: <strong>{htl.meals_included}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INCLUSIONS & EXCLUSIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-3">
                <h3 className="font-heading font-bold text-lg text-emerald-800 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>What's Included</span>
                </h3>
                <ul className="space-y-2">
                  {packageData.inclusions?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-3">
                <h3 className="font-heading font-bold text-lg text-rose-800 flex items-center gap-2">
                  <CloseIcon className="w-5 h-5 text-rose-600" />
                  <span>What's Excluded</span>
                </h3>
                <ul className="space-y-2">
                  {packageData.exclusions?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                      <CloseIcon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* POLICIES & TERMS */}
            {packageData.policies && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-sm space-y-4">
                <h3 className="text-lg font-heading font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
                  <ShieldCheck className="w-5 h-5 text-brand-red" />
                  Policies & Travel Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {packageData.policies.cancellation && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 block font-bold">Cancellation Policy:</strong>
                      <p className="text-slate-600 leading-relaxed">{packageData.policies.cancellation}</p>
                    </div>
                  )}

                  {packageData.policies.refund && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 block font-bold">Refund Policy:</strong>
                      <p className="text-slate-600 leading-relaxed">{packageData.policies.refund}</p>
                    </div>
                  )}

                  {packageData.policies.payment_terms && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 block font-bold">Payment Terms:</strong>
                      <p className="text-slate-600 leading-relaxed">{packageData.policies.payment_terms}</p>
                    </div>
                  )}

                  {packageData.policies.documents_required && (
                    <div className="space-y-1">
                      <strong className="text-slate-800 block font-bold">Documents Required:</strong>
                      <p className="text-slate-600 leading-relaxed">{packageData.policies.documents_required}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: STICKY BOOKING & ENQUIRY PANEL */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-brand-borderGrey shadow-xl space-y-5">
              {/* PRICE HEADER */}
              {isSeparatePricing ? (
                <div className="border-b border-gray-100 pb-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Choose Pricing Category
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Auto-switches with party size
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Couple Card */}
                    <div
                      onClick={() => {
                        setSelectedPricingTier("couple");
                        setCustAdults(2);
                        setCustChildren(0);
                      }}
                      className={cn(
                        "p-3 rounded-2xl border-2 cursor-pointer transition relative overflow-hidden",
                        activePricingTier === "couple"
                          ? "border-rose-500 bg-rose-50/70 shadow-sm"
                          : "border-gray-200 hover:border-rose-200 bg-white"
                      )}
                    >
                      {activePricingTier === "couple" && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500" />
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-[11px] font-bold text-slate-800">
                          Couple (2 Persons)
                        </span>
                      </div>
                      {coupleDiscountInfo.isActive ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(coupleDiscountInfo.originalPrice)}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 text-[10px] font-bold">
                              {coupleDiscountInfo.percentageOff}% OFF
                            </span>
                          </div>
                          <div className="text-lg font-heading font-extrabold text-rose-700 leading-tight">
                            {formatCurrency(coupleDiscountInfo.discountedPrice)}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                            Save {formatCurrency(coupleDiscountInfo.savings)} / Person
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-heading font-extrabold text-rose-700 leading-tight">
                            {formatCurrency(coupleRate)}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {formatCurrency(coupleRate)} / Person
                          </span>
                        </>
                      )}
                    </div>

                    {/* Family Card */}
                    <div
                      onClick={() => {
                        setSelectedPricingTier("family");
                        if (custAdults < 3 && custChildren === 0) {
                          setCustAdults(3);
                        }
                      }}
                      className={cn(
                        "p-3 rounded-2xl border-2 cursor-pointer transition relative overflow-hidden",
                        activePricingTier === "family"
                          ? "border-blue-500 bg-blue-50/70 shadow-sm"
                          : "border-gray-200 hover:border-blue-200 bg-white"
                      )}
                    >
                      {activePricingTier === "family" && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      <div className="flex items-center gap-1.5 mb-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-bold text-slate-800">
                          Family (More than 2)
                        </span>
                      </div>
                      {familyDiscountInfo.isActive ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-400 line-through">
                              {formatCurrency(familyDiscountInfo.originalPrice)}
                            </span>
                            <span className="px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                              {familyDiscountInfo.percentageOff}% OFF
                            </span>
                          </div>
                          <div className="text-lg font-heading font-extrabold text-blue-700 leading-tight">
                            {formatCurrency(familyDiscountInfo.discountedPrice)}
                          </div>
                          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                            Save {formatCurrency(familyDiscountInfo.savings)} / Person
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-heading font-extrabold text-blue-700 leading-tight">
                            {formatCurrency(familyRate)}
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-0.5">
                            {formatCurrency(familyRate)} / Person
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Validity Notice if configured */}
                  {activeDiscount.isActive && activeDiscount.validUntil && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Special offer valid until {activeDiscount.validUntil}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Best Price Guarantee • No Hidden Charges</span>
                  </div>
                </div>
              ) : (
                <div className="border-b border-gray-100 pb-4 space-y-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Starting Price
                  </span>
                  {discountInfo.isActive ? (
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400 line-through font-semibold">
                          {formatCurrency(discountInfo.originalPrice)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                          {discountInfo.percentageOff}% OFF
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl font-heading font-extrabold text-brand-red">
                          {formatCurrency(discountInfo.discountedPrice)}
                        </span>
                        <span className="text-xs text-slate-500">
                          / {packageData.pricing_basis || "person"}
                        </span>
                      </div>
                      <div className="text-xs text-emerald-700 font-bold flex items-center gap-1 mt-1">
                        <Tag className="w-3.5 h-3.5" />
                        <span>You Save {formatCurrency(discountInfo.savings)} per person!</span>
                      </div>
                      {discountInfo.validUntil && (
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Offer valid until {discountInfo.validUntil}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-heading font-extrabold text-brand-red">
                        {formatCurrency(unitPrice)}
                      </span>
                      <span className="text-xs text-slate-500">
                        / {packageData.pricing_basis || "person"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Best Price Guarantee • No Hidden Charges</span>
                  </div>
                </div>
              )}

              {/* FIXED DEPARTURE DATES SELECTOR (IF ANY) */}
              {packageData.departure_dates && packageData.departure_dates.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Select Departure Batch
                  </label>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1">
                    {packageData.departure_dates.map((dep) => {
                      const isSelected = selectedDeparture?.id === dep.id;
                      return (
                        <div
                          key={dep.id}
                          onClick={() => setSelectedDeparture(dep)}
                          className={cn(
                            "p-2.5 rounded-xl border cursor-pointer text-xs transition flex items-center justify-between",
                            isSelected
                              ? "border-brand-red bg-brand-softRed/20 text-brand-deepRed font-bold shadow-sm"
                              : "border-gray-200 hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <div>
                            <div className="flex items-center gap-1">
                              <span>{dep.departure_date}</span>
                              <ArrowRight className="w-3 h-3 text-slate-400" />
                              <span>{dep.return_date}</span>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              Seats: {dep.available_seats} Left
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            {formatCurrency(dep.adult_price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TRAVELERS COUNT SELECTOR */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Adults (12+ Yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCustAdults((a) => Math.max(1, a - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-slate-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-5 text-center">{custAdults}</span>
                    <button
                      type="button"
                      onClick={() => setCustAdults((a) => a + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-slate-700 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Children (2-11 Yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCustChildren((c) => Math.max(0, c - 1))}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-slate-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-5 text-center">{custChildren}</span>
                    <button
                      type="button"
                      onClick={() => setCustChildren((c) => c + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center font-bold text-slate-700 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Estimated Total */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Estimated Total:</span>
                  <span className="text-lg font-heading font-extrabold text-slate-900">
                    {formatCurrency(calculatedTotal)}
                  </span>
                </div>
              </div>

              {/* QUICK ENQUIRY FORM */}
              {enquirySuccess ? (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-heading font-bold text-sm text-emerald-900">
                    Enquiry Received!
                  </h4>
                  <p className="text-xs text-emerald-700">
                    Our senior travel consultant will connect with you on WhatsApp / Phone within 30 minutes with the customized itinerary.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={custPhone}
                      onChange={(e) => setCustPhone(e.target.value)}
                      placeholder="+91 98251 00000"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="w-full py-3 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-brand-red/30"
                  >
                    <Send className="w-4 h-4" />
                    {enquirySubmitting ? "Submitting..." : "Send Booking Enquiry"}
                  </button>
                </form>
              )}

              {/* INSTANT WHATSAPP CHAT BUTTON */}
              <a
                href={`https://wa.me/919825123456?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Chat on WhatsApp Now
              </a>

              {/* TRUST BADGES */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Stays
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 24x7 Assistance
                </span>
                <span>•</span>
                <span>Velora Group</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. RELATED PACKAGES SECTION */}
        {relatedPackages.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wider block">
                More Adventures
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 mt-1">
                You Might Also Love
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} packageData={pkg} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GALLERY FULLSCREEN MODAL */}
      {selectedGalleryImg && (
        <div
          onClick={() => setSelectedGalleryImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-[70vh]">
            <Image
              src={selectedGalleryImg}
              alt="Enlarged Visual"
              fill
              className="object-contain"
              unoptimized
            />
            <button
              onClick={() => setSelectedGalleryImg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
