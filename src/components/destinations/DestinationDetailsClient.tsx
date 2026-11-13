"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { travelService } from "@/services/travelService";
import { Destination, TourPackage } from "@/types";
import { PackageCard } from "@/components/packages/PackageCard";
import {
  MapPin,
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface DestinationDetailsClientProps {
  slug: string;
}

export function DestinationDetailsClient({ slug }: DestinationDetailsClientProps) {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      const dest = await travelService.getDestinationBySlug(slug);
      if (dest) {
        setDestination(dest);
        const pkgs = await travelService.getPackages({ destinationSlug: dest.name });
        setPackages(pkgs);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red" />
      </div>
    );
  }

  if (!destination) {
    return notFound();
  }

  return (
    <div className="bg-brand-offWhite min-h-screen">
      {/* 1. Destination Hero */}
      <section className="relative h-[480px] md:h-[550px] w-full bg-brand-darkNavy pt-24">
        <Image
          src={destination.cover_image}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-black/40 to-black/60" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <nav className="text-xs text-white/70 mb-4 flex items-center gap-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span>/</span>
            <span className="text-white font-semibold">{destination.name}</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider mb-2 self-start">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>{destination.state_or_country}</span>
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight">
            {destination.name}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-white/85 max-w-2xl leading-relaxed">
            {destination.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/custom-trip?destination=${encodeURIComponent(destination.name)}`}
              className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-sm font-bold px-6 py-3 rounded-full shadow-lg transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Trip to {destination.name}</span>
            </Link>

            <a
              href={`https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20want%20to%20plan%20a%20tour%20to%20${encodeURIComponent(destination.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Destination Guide Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Best Time & About */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey/80 shadow-card">
              <h2 className="text-2xl font-heading font-extrabold text-brand-charcoal mb-4">
                About {destination.name}
              </h2>
              <p className="text-brand-grey text-sm sm:text-base leading-relaxed mb-6">
                {destination.description}
              </p>

              <div className="bg-brand-softRed/40 border border-brand-red/20 rounded-2xl p-4 sm:p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-heading font-bold text-brand-charcoal">
                    Best Time To Visit
                  </h4>
                  <p className="text-xs sm:text-sm text-brand-deepRed font-semibold mt-0.5">
                    {destination.best_time}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Attractions & Sightseeing */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey/80 shadow-card">
              <h3 className="text-xl font-heading font-extrabold text-brand-charcoal mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-red" />
                <span>Must-See Attractions in {destination.name}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {destination.attractions.map((attraction, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-brand-offWhite border border-brand-borderGrey/50">
                    <span className="w-6 h-6 rounded-full bg-brand-red/10 text-brand-red text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-brand-charcoal">{attraction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Activities */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey/80 shadow-card">
              <h3 className="text-xl font-heading font-extrabold text-brand-charcoal mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-red" />
                <span>Top Things To Do & Experience</span>
              </h3>
              <div className="space-y-2.5">
                {destination.activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-charcoal">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Tips */}
            {destination.travel_tips && destination.travel_tips.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey/80 shadow-card">
                <h3 className="text-xl font-heading font-extrabold text-brand-charcoal mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>Insider Travel Tips</span>
                </h3>
                <ul className="space-y-2.5">
                  {destination.travel_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-brand-grey">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Sidebar: Quick Custom Planner */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-borderGrey shadow-premium text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-brand-charcoal">
                Plan a Trip to {destination.name}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-brand-grey leading-relaxed">
                Tell us your preferred dates, party size, and interests. Our destination specialist will create a tailored itinerary for you.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href={`/custom-trip?destination=${encodeURIComponent(destination.name)}`}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Customized Itinerary</span>
                </Link>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20YaadgarSafar!%20I%20need%20a%20quote%20for%20${encodeURIComponent(destination.name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold py-3 px-4 rounded-xl shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Travel Expert</span>
                </a>
              </div>
            </div>

            {/* Verified Guarantee */}
            <div className="bg-brand-darkNavy text-white rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-6 h-6 text-brand-red" />
                <h4 className="font-heading font-bold text-sm">YaadgarSafar Assurance</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                All accommodation and transport partners in {destination.name} are vetted for hygiene, reliability, and punctuality.
              </p>
            </div>
          </div>
        </div>

        {/* Available Packages in this Destination */}
        <div className="mt-16 pt-12 border-t border-brand-borderGrey">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
                Packages Available in {destination.name}
              </h2>
              <p className="text-xs sm:text-sm text-brand-grey mt-1">
                Handcrafted itineraries ready to book
              </p>
            </div>

            <Link
              href="/packages"
              className="text-xs sm:text-sm font-bold text-brand-deepRed hover:underline flex items-center gap-1"
            >
              <span>All Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} packageData={pkg} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-brand-borderGrey">
              <p className="text-sm text-brand-grey">
                Packages for {destination.name} are currently being customized for the upcoming season.
              </p>
              <Link
                href={`/custom-trip?destination=${encodeURIComponent(destination.name)}`}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-brand-red hover:underline"
              >
                <span>Request Custom Package for {destination.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
