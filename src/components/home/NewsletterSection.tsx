"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2 } from "lucide-react";

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section className="py-16 md:py-20 bg-brand-softRed/60 border-t border-brand-borderGrey/70 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center mx-auto mb-4 shadow-md">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-brand-charcoal tracking-tight">
          Get Inspired for Your Next Journey
        </h2>

        <p className="mt-3 text-sm text-brand-grey max-w-xl mx-auto leading-relaxed">
          Receive seasonal travel ideas, early-bird holiday packages, and insider destination tips directly to your inbox. No spam, only wanderlust.
        </p>

        {submitted ? (
          <div className="mt-8 bg-white p-6 rounded-2xl max-w-md mx-auto border border-emerald-200 shadow-sm flex items-center justify-center gap-3 text-emerald-700 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Thank you for subscribing! Your journey inspiration is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-8 max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 bg-white p-2 rounded-2xl sm:rounded-full border border-brand-borderGrey shadow-card focus-within:ring-2 focus-within:ring-brand-red">
              <div className="flex items-center gap-2 px-3 w-full">
                <Mail className="w-4 h-4 text-brand-grey shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your personal email..."
                  className="w-full bg-transparent text-sm text-brand-charcoal placeholder:text-brand-grey/60 focus:outline-none py-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl sm:rounded-full shadow-md transition-colors"
              >
                <span>Subscribe</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {error && <p className="text-xs text-brand-deepRed mt-2 font-medium">{error}</p>}
            <p className="text-[11px] text-brand-grey/80 mt-3">
              By subscribing, you agree to receive travel updates from YaadgarSafar.com. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
