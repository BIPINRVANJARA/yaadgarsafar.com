"use client";

import React, { useState, useEffect } from "react";
import { travelService } from "@/services/travelService";
import { CustomerReview } from "@/types";
import { Star, ShieldCheck, Trash2, CheckCircle2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);

  useEffect(() => {
    async function load() {
      const list = await travelService.getReviews();
      setReviews(list);
    }
    load();
  }, []);

  const handleToggleVerify = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, verified: !r.verified } : r))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
          Customer Reviews & Testimonials
        </h1>
        <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
          Approve, verify, and moderate genuine traveller testimonials.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-brand-borderGrey shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-brand-charcoal">
                  {rev.customer_name}
                </h3>
                <span className="text-xs text-brand-grey">• {rev.destination}</span>
                <span className="text-xs text-brand-grey">• {rev.travel_date}</span>
              </div>

              <div className="flex items-center text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-brand-charcoal/90 italic">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggleVerify(rev.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border transition-all ${
                  rev.verified
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{rev.verified ? "Verified" : "Unverified"}</span>
              </button>

              <button
                onClick={() => handleDelete(rev.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete review"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
