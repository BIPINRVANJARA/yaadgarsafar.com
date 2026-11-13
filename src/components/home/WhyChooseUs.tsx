import React from "react";
import {
  Compass,
  MapPin,
  Car,
  Receipt,
  Headphones,
  Heart,
  CheckCircle2,
} from "lucide-react";

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Compass,
      title: "Personalized Travel Planning",
      description:
        "Every traveller is unique. We craft itineraries matching your pace, interests, food preferences, and comfort requirements.",
    },
    {
      icon: MapPin,
      title: "Carefully Planned Itineraries",
      description:
        "No rushed 6-destination-a-day marathons. We prioritize genuine discovery, leisure, and memorable moments.",
    },
    {
      icon: Car,
      title: "Comfortable Travel Arrangements",
      description:
        "Handpicked hotels, strictly verified private drivers, clean air-conditioned vehicles, and smooth transitions.",
    },
    {
      icon: Receipt,
      title: "Transparent Package Pricing",
      description:
        "Clear inclusions and zero unpleasant surprises on tour. What you see and agree upon is exactly what you get.",
    },
    {
      icon: Headphones,
      title: "Dedicated Customer Assistance",
      description:
        "From the moment you enquire until you return home safely, our senior travel advisors are only a phone call or WhatsApp away.",
    },
    {
      icon: Heart,
      title: "Memorable Travel Experiences",
      description:
        "We measure our success by the smiles, stories, and lasting memories you cherish with your family and loved ones.",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-brand-offWhite relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>The YaadgarSafar Difference</span>
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Why Discerning Travellers Choose Us
          </h2>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            We don’t just book tickets and rooms. We curate journeys that stay etched in your memory for a lifetime.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-brand-borderGrey/80 shadow-card hover:shadow-premium-hover transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-softRed group-hover:bg-brand-red text-brand-red group-hover:text-white flex items-center justify-center transition-colors duration-300 mb-6 shadow-sm">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-brand-charcoal group-hover:text-brand-deepRed transition-colors">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-brand-grey leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
