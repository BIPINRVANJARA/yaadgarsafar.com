"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HeroSection } from "@/components/hero/HeroSection";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { PackageCard } from "@/components/packages/PackageCard";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TravelExperienceShowcase } from "@/components/home/TravelExperienceShowcase";
import { CustomTripBanner } from "@/components/home/CustomTripBanner";
import { ServicesSection } from "@/components/home/ServicesSection";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { GalleryPreviewSection } from "@/components/home/GalleryPreviewSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { travelService } from "@/services/travelService";
import { Destination, TourPackage, CustomerReview, TravelService, GalleryItem } from "@/types";
import { Compass, Sparkles, ArrowRight, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  initialDestinations,
  initialPackages,
  initialReviews,
  initialServices,
  initialGallery,
} from "@/lib/data/mockData";

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [packages, setPackages] = useState<TourPackage[]>(initialPackages);
  const [reviews, setReviews] = useState<CustomerReview[]>(initialReviews);
  const [services, setServices] = useState<TravelService[]>(initialServices);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [destinationTab, setDestinationTab] = useState<"all" | "domestic" | "international">("all");
  const [packageCategory, setPackageCategory] = useState<string>("all");

  useEffect(() => {
    async function loadData() {
      const [destList, pkgList, revList, srvList, galList] = await Promise.all([
        travelService.getDestinations(),
        travelService.getPackages(),
        travelService.getReviews(),
        travelService.getServices(),
        travelService.getGallery(),
      ]);
      setDestinations(destList);
      setPackages(pkgList);
      setReviews(revList);
      setServices(srvList);
      setGallery(galList);
    }
    loadData();
  }, []);

  const filteredDestinations = destinations.filter((d) => {
    if (destinationTab === "domestic") return d.trip_type === "domestic";
    if (destinationTab === "international") return d.trip_type === "international";
    return true;
  });

  const filteredPackages = packages.filter((p) => {
    if (packageCategory !== "all") return p.category === packageCategory;
    return true;
  });

  const packageCategories = [
    { label: "All Packages", value: "all" },
    { label: "Honeymoon & Romantic", value: "honeymoon" },
    { label: "Family Holidays", value: "family" },
    { label: "Cultural & Heritage", value: "cultural" },
    { label: "Relaxation & Backwaters", value: "relaxation" },
    { label: "Adventure & Thrills", value: "adventure" },
  ];

  return (
    <div className="w-full">
      {/* 1. Cinematic Hero Section with Search & Flight Path */}
      <HeroSection />

      {/* 2. Featured Destinations Showcase */}
      <section id="featured-destinations" className="py-20 md:py-28 bg-brand-offWhite scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
                Curated Travel Escapes
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
                Featured Destinations
              </h2>
              <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed max-w-xl">
                From the snow-draped valleys of Kashmir to the golden dunes of Dubai, choose your next unforgettable chapter.
              </p>
            </div>

            {/* Destination Filter Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-full border border-brand-borderGrey shadow-sm self-start md:self-auto">
              <button
                onClick={() => setDestinationTab("all")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  destinationTab === "all"
                    ? "bg-brand-charcoal text-white shadow-sm"
                    : "text-brand-grey hover:text-brand-charcoal"
                )}
              >
                All Destinations
              </button>
              <button
                onClick={() => setDestinationTab("domestic")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  destinationTab === "domestic"
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-brand-grey hover:text-brand-charcoal"
                )}
              >
                Incredible India
              </button>
              <button
                onClick={() => setDestinationTab("international")}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold transition-all",
                  destinationTab === "international"
                    ? "bg-brand-red text-white shadow-sm"
                    : "text-brand-grey hover:text-brand-charcoal"
                )}
              >
                International
              </button>
            </div>
          </div>

          {/* Destination Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDestinations.slice(0, 6).map((destination) => (
              <DestinationCard key={destination.id} destination={destination} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-borderGrey/40 text-brand-charcoal text-sm font-bold px-8 py-3.5 rounded-full border border-brand-borderGrey shadow-sm transition-all hover:shadow-md"
            >
              <span>Explore All {destinations.length} Destinations</span>
              <ArrowRight className="w-4 h-4 text-brand-red" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Popular Tour Packages */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
                Tailored Itineraries
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
                Popular Tour Packages
              </h2>
              <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed max-w-xl">
                Transparent inclusions, handpicked stays, and dedicated on-tour assistance for a completely stress-free holiday.
              </p>
            </div>

            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-deepRed hover:text-brand-red transition-colors self-start md:self-auto"
            >
              <span>View All Tour Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {packageCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setPackageCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  packageCategory === cat.value
                    ? "bg-brand-red text-white shadow-sm"
                    : "bg-brand-offWhite text-brand-charcoal hover:bg-brand-borderGrey/60"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Package Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.slice(0, 6).map((pkg) => (
              <PackageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose YaadgarSafar? */}
      <WhyChooseUs />

      {/* 5. Visual Storytelling Experience */}
      <TravelExperienceShowcase />

      {/* 6. Custom Trip Planning Banner */}
      <CustomTripBanner />

      {/* 7. Comprehensive Travel Services */}
      <ServicesSection services={services} />

      {/* 8. Genuine Customer Testimonials */}
      <CustomerReviewsSection reviews={reviews} />

      {/* 9. Travel Gallery Preview */}
      <GalleryPreviewSection galleryItems={gallery} />

      {/* 10. Newsletter */}
      <NewsletterSection />
    </div>
  );
}
