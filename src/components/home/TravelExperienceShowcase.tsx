import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export const TravelExperienceShowcase: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visual Storytelling</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight leading-tight">
              More Than Destinations. <br />
              <span className="text-brand-deepRed">Experiences That Stay With You.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-brand-grey leading-relaxed">
            From the tranquil morning mist over Kashmiri Dal Lake to the golden desert sunsets of Dubai, every itinerary is designed for immersive, soul-enriching moments.
          </p>
        </div>

        {/* Asymmetrical Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Card 1 - Large Left Showcase */}
          <div className="md:col-span-7 relative h-[420px] md:h-[500px] rounded-3xl overflow-hidden group shadow-premium">
            <Image
              src="https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1400&auto=format&fit=crop"
              alt="Kashmir Shikara Experience"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-softRed block mb-1 drop-shadow-sm">
                Kashmir Valley
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white drop-shadow-md">
                Dawn Over the Floating Lotus Gardens
              </h3>
              <p className="mt-2 text-sm text-white/90 max-w-lg leading-relaxed line-clamp-2 drop-shadow-sm">
                A cup of steaming saffron kehwa in hand as wooden oars gently carve through glass-like waters beneath snow-capped peaks.
              </p>
              <Link
                href="/packages/heavenly-kashmir-gulmarg-dal-lake"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white hover:text-brand-softRed underline underline-offset-4 drop-shadow-sm"
              >
                <span>View Kashmir Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Side Stack (2 Cards) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Card 2 - Dubai Dune Sunset */}
            <div className="relative h-[200px] md:h-[238px] rounded-3xl overflow-hidden group shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop"
                alt="Dubai Desert Safari"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-0.5 drop-shadow-sm">
                  Arabian Desert
                </span>
                <h4 className="text-lg font-heading font-bold text-white drop-shadow-md">
                  Crimson Dunes & Starlit Bedouin Feasts
                </h4>
              </div>
            </div>

            {/* Card 3 - Kerala Backwaters */}
            <div className="relative h-[200px] md:h-[238px] rounded-3xl overflow-hidden group shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop"
                alt="Kerala Backwaters Houseboat"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block mb-0.5 drop-shadow-sm">
                  God’s Own Country
                </span>
                <h4 className="text-lg font-heading font-bold text-white drop-shadow-md">
                  Whispering Palms & Private Lagoon Cruises
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
