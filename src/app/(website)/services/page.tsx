import React from "react";
import Link from "next/link";
import { travelService } from "@/services/travelService";
import {
  Compass,
  Sparkles,
  Hotel,
  Car,
  Heart,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Sparkles,
  Hotel,
  Car,
  Heart,
  Users,
};

export default async function ServicesPage() {
  const services = await travelService.getServices();

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            End-To-End Hospitality
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Our Travel Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            From meticulously planned package tours to custom itineraries, luxury stays, and private transportation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.iconName] || Compass;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-8 border border-brand-borderGrey shadow-card hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-brand-charcoal mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-brand-borderGrey">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                      Included Advantages:
                    </h4>
                    {service.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-brand-charcoal">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-borderGrey">
                  <Link
                    href="/custom-trip"
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-deepRed hover:text-brand-red"
                  >
                    <span>Request Custom Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-16 bg-brand-darkNavy text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            Need Tailored Corporate or Group Travel?
          </h2>
          <p className="mt-3 text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Our corporate desk handles company offsites, conferences, and student excursions with dedicated on-ground management.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-full bg-brand-red hover:bg-brand-deepRed text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              Contact Corporate Desk
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20have%20a%20corporate%20/%20group%20travel%20requirement."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Directly</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
