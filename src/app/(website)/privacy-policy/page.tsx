import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-brand-borderGrey shadow-card space-y-6">
          <div className="flex items-center gap-2 text-brand-red mb-2">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-widest">YaadgarSafar.com</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-brand-charcoal">
            Privacy Policy
          </h1>

          <p className="text-xs text-brand-grey">Last Updated: November 2026</p>

          <div className="space-y-6 text-sm text-brand-charcoal/90 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                1. Information We Collect
              </h2>
              <p>
                When you browse YaadgarSafar.com, request a custom itinerary, or submit a booking enquiry, we collect information you provide directly to us including your name, email address, mobile/WhatsApp number, travel dates, destinations, and trip preferences.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information collected solely to design and communicate tailored travel proposals, coordinate tour bookings, provide 24/7 on-tour customer support, and improve our services. We do not sell or rent your personal contact information to third-party telemarketers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                3. Partner Coordination
              </h2>
              <p>
                To deliver our tour services, relevant details (such as names and arrival timings) may be shared securely with verified hotels, transport chauffeurs, and local excursion operators for booking fulfillment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                4. Data Security
              </h2>
              <p>
                We implement industry-standard encryption, authenticated database environments, and secure administrative access to safeguard your data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-heading font-bold text-brand-charcoal">
                5. Contact Us
              </h2>
              <p>
                If you have questions regarding this Privacy Policy, please email us at{" "}
                <a href="mailto:privacy@yaadgarsafar.com" className="text-brand-red font-bold hover:underline">
                  privacy@yaadgarsafar.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
