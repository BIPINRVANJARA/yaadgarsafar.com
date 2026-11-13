import React from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  Hotel,
  Car,
  Heart,
  Users,
  ArrowRight,
} from "lucide-react";
import { TravelService } from "@/types";

interface ServicesSectionProps {
  services: TravelService[];
}

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Sparkles,
  Hotel,
  Car,
  Heart,
  Users,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
              Comprehensive Travel Assistance
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
              Our Specialized Travel Services
            </h2>
            <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
              Every detail of your vacation managed with professional dedication, from curated stays to private transfers.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-deepRed hover:text-brand-red transition-colors self-start md:self-auto"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = iconMap[service.iconName] || Compass;
            return (
              <div
                key={service.id}
                className="bg-brand-offWhite rounded-3xl p-8 border border-brand-borderGrey/70 hover:border-brand-red/40 hover:bg-white shadow-card hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm text-brand-red flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-extrabold text-xl text-brand-charcoal mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2 border-t border-brand-borderGrey/60 pt-4 text-xs font-semibold text-brand-charcoal/80">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-red shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
