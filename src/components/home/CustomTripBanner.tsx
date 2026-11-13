import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, HeartHandshake, PhoneCall } from "lucide-react";

export const CustomTripBanner: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-brand-offWhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-brand-softRed/35 to-white border border-brand-borderGrey p-8 sm:p-12 md:p-16 shadow-card hover:shadow-premium transition-all duration-300 overflow-hidden">
          {/* Subtle decorative background watermarks */}
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-brand-softRed rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-4 border border-brand-red/10">
                <Sparkles className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>Bespoke Holiday Planning</span>
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight leading-tight">
                Your Journey. Your Rules. <br />
                <span className="text-brand-deepRed">Your Perfect Itinerary.</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed font-normal">
                Have a destination in mind but need a personalized travel plan? Tell us what you are looking for, and our senior travel specialists will craft a customized itinerary around your preferences, budget, and schedule.
              </p>

              {/* Feature Chips with high-contrast, polished icons */}
              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-brand-borderGrey shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-charcoal whitespace-nowrap">
                    Flexible Travel Dates
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-brand-borderGrey shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-charcoal whitespace-nowrap">
                    Zero Compromise on Quality
                  </span>
                </div>

                <div className="flex items-center gap-2.5 bg-white px-3.5 py-2 rounded-xl border border-brand-borderGrey shadow-sm">
                  <div className="w-7 h-7 rounded-lg bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-brand-charcoal whitespace-nowrap">
                    Free Expert Consultation
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
              <Link
                href="/custom-trip"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white font-heading font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/35 transition-all duration-200 transform hover:-translate-y-0.5 text-center whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Create My Custom Trip</span>
              </Link>

              <a
                href="https://wa.me/919876543210?text=Hi!%20I%20would%20like%20to%20plan%20a%20customized%20itinerary%20with%20YaadgarSafar."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-heading font-bold text-sm sm:text-base px-6 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-200 text-center whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
