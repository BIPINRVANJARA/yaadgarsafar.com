"use client";

import React, { useState } from "react";
import { CustomerReview } from "@/types";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";

interface CustomerReviewsSectionProps {
  reviews: CustomerReview[];
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  reviews,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const current = reviews && reviews.length > 0 ? reviews[currentIndex] || reviews[0] : null;

  if (!current) {
    return null;
  }

  return (
    <section className="py-20 md:py-28 bg-brand-offWhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Stories From Our Travellers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Memories That Speak For Themselves
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            Real experiences from families, honeymooners, and adventurers who trusted YaadgarSafar.
          </p>
        </div>

        {/* Featured Testimonial Box */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-brand-borderGrey/80 shadow-premium relative">
          <Quote className="w-16 h-16 text-brand-softRed/60 absolute top-8 right-8 pointer-events-none" />

          {/* Star Ratings */}
          <div className="flex items-center gap-1 mb-6 text-amber-400">
            {Array.from({ length: current.rating }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
            <span className="ml-2 text-xs font-bold text-brand-charcoal bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              5.0 Verified Review
            </span>
          </div>

          {/* Review Text */}
          <p className="text-base sm:text-lg md:text-xl text-brand-charcoal leading-relaxed font-medium italic">
            "{current.comment}"
          </p>

          {/* Author Details and Controls */}
          <div className="mt-8 pt-6 border-t border-brand-borderGrey/70 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-lg text-brand-charcoal">
                  {current.customer_name}
                </h4>
                <span title="Verified Customer">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <p className="text-xs text-brand-grey mt-0.5">
                {current.destination} • {current.travel_date}
              </p>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-brand-grey mr-2">
                {currentIndex + 1} of {reviews.length}
              </span>
              <button
                onClick={prevReview}
                className="w-10 h-10 rounded-full border border-brand-borderGrey bg-white hover:bg-brand-offWhite text-brand-charcoal flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextReview}
                className="w-10 h-10 rounded-full border border-brand-borderGrey bg-brand-charcoal hover:bg-black text-white flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
