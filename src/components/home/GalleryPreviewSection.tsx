"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { Camera, ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryPreviewSectionProps {
  galleryItems: GalleryItem[];
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({
  galleryItems,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Mountains", "Beaches", "Nature", "Adventure", "Culture"];

  const filteredItems =
    activeCategory === "All"
      ? galleryItems.slice(0, 6)
      : galleryItems.filter((item) => item.category === activeCategory).slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
              Visual Journey
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
              Captured Moments & Landscapes
            </h2>
            <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed max-w-xl">
              Glimpses from the remarkable destinations visited by YaadgarSafar travellers across India and the globe.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 bg-brand-charcoal hover:bg-black text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full transition-colors self-start md:self-auto shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-brand-red text-white shadow-sm"
                  : "bg-brand-offWhite text-brand-charcoal hover:bg-brand-borderGrey/70"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative h-72 rounded-3xl overflow-hidden bg-brand-offWhite shadow-card"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-5 right-5 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-softRed block">
                  {item.category}
                </span>
                <h4 className="font-heading font-bold text-base text-white">
                  {item.title}
                </h4>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-brand-red" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
