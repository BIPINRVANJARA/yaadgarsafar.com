"use client";

import React, { useState, useEffect } from "react";
import { travelService } from "@/services/travelService";
import { CustomerReview } from "@/types";
import {
  Star,
  ShieldCheck,
  Quote,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await travelService.getReviews();
      setReviews(data);
    }
    load();
  }, []);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      customer_name: newName,
      destination: newDest || "Curated Tour",
      rating: newRating,
      comment: newComment,
      travel_date: "Recent Journey",
      verified: true,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setShowSubmitModal(false);
      setSubmitted(false);
      setNewName("");
      setNewComment("");
      setNewDest("");
    }, 2000);
  };

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Verified Testimonials
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Customer Reviews & Stories
          </h1>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            Read authentic feedback from travellers who explored Kashmir, Kerala, Rajasthan, Dubai, and beyond with YaadgarSafar.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="bg-white rounded-3xl p-8 border border-brand-borderGrey shadow-sm mb-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left flex items-center gap-6">
            <div className="text-5xl font-heading font-extrabold text-brand-charcoal">
              4.9
            </div>
            <div>
              <div className="flex items-center text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-brand-grey">
                Overall score across verified domestic & international tours
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-8 border border-brand-borderGrey shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  {rev.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Traveller</span>
                    </span>
                  )}
                </div>

                <p className="text-brand-charcoal text-sm sm:text-base leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-brand-borderGrey flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-brand-charcoal">
                    {rev.customer_name}
                  </h4>
                  <p className="text-xs text-brand-grey">{rev.destination}</p>
                </div>

                <span className="text-[11px] text-brand-grey flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-brand-red" />
                  <span>{rev.travel_date}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-borderGrey shadow-2xl relative">
            <h3 className="font-heading font-bold text-xl text-brand-charcoal mb-1">
              Share Your Experience
            </h3>
            <p className="text-xs text-brand-grey mb-6">
              Your genuine feedback helps fellow travellers plan memorable journeys.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl text-center border border-emerald-200">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm">Review Submitted!</h4>
                <p className="text-xs mt-1">Thank you for sharing your journey story with us.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Rahul & Neha"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Destination / Tour</label>
                  <input
                    type="text"
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    placeholder="e.g. Kashmir 5 Days"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewRating(num)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                          newRating === num ? "bg-amber-400 text-black font-extrabold" : "bg-brand-offWhite text-brand-charcoal"
                        }`}
                      >
                        {num} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Your Review</label>
                  <textarea
                    rows={4}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your itinerary, hotel stays, driver hospitality, and memorable moments..."
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2 text-xs font-bold text-brand-grey hover:text-brand-charcoal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold shadow-md hover:bg-brand-deepRed transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
