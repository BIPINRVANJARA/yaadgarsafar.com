import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-brand-borderGrey shadow-card space-y-6">
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">YaadgarSafar.com</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-charcoal">
            Terms & Conditions
          </h1>

          <p className="text-xs text-brand-grey">Last Updated: November 2026</p>

          <div className="space-y-6 text-sm text-brand-charcoal/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and utilizing YaadgarSafar.com or submitting travel inquiries, you agree to comply with and be bound by the following terms and conditions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                2. Tour Quotes & Bookings
              </h2>
              <p>
                All package rates and itinerary proposals are subject to availability of hotel rooms and transport at the time of confirmed booking. Confirmed bookings require formal approval and adherence to specified advance payment terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                3. Changes & Force Majeure
              </h2>
              <p>
                YaadgarSafar acts in good faith to fulfill confirmed schedules. In the event of unforeseen weather conditions, natural roadblocks, flight cancellations, or governmental restrictions, itineraries may be rescheduled or adjusted in coordination with clients for safety reasons.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                4. Identity & Documentation
              </h2>
              <p>
                Travellers must carry valid government-issued photo identification (Aadhaar, Passport, Voter ID) during domestic tours. For international travels, a passport valid for at least six months from the date of travel and appropriate visas are strictly the traveller's responsibility.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
