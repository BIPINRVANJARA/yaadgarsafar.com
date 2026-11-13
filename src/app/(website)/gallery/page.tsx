"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { travelService } from "@/services/travelService";
import { GalleryItem } from "@/types";
import { Camera, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    "All",
    "Mountains",
    "Beaches",
    "Nature",
    "Cities",
    "Adventure",
    "Culture",
    "Group Tours",
  ];

  useEffect(() => {
    async function load() {
      const data = await travelService.getGallery();
      setGallery(data);
    }
    load();
  }, []);

  const filteredItems =
    activeCategory === "All"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") {
        setActiveLightboxIndex(null);
      } else if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
      } else if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  const currentLightboxItem =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Visual Memories
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Travel Photo Gallery
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-grey leading-relaxed">
            Real snapshots and inspiring landscapes from journeys curated across India and abroad.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveLightboxIndex(null);
              }}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-brand-red text-white shadow-sm"
                  : "bg-white text-brand-charcoal hover:bg-brand-borderGrey/60 border border-brand-borderGrey"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative h-80 rounded-3xl overflow-hidden bg-brand-offWhite border border-brand-borderGrey shadow-card cursor-pointer"
            >
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-5 left-5 right-5 text-white transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-softRed block">
                  {item.category}
                </span>
                <h3 className="font-heading font-bold text-base text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" />
                  <span>{item.location}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          <button
            onClick={() =>
              setActiveLightboxIndex((prev) =>
                prev! > 0 ? prev! - 1 : filteredItems.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20 focus:outline-none hidden sm:flex"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setActiveLightboxIndex((prev) =>
                prev! < filteredItems.length - 1 ? prev! + 1 : 0
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors z-20 focus:outline-none hidden sm:flex"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image & Caption Display */}
          <div className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="relative w-full h-[65vh] sm:h-[75vh]">
              <Image
                src={currentLightboxItem.image_url}
                alt={currentLightboxItem.title}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-center text-white">
              <span className="text-xs uppercase tracking-widest text-brand-softRed font-bold block">
                {currentLightboxItem.category}
              </span>
              <h3 className="font-heading font-bold text-lg text-white">
                {currentLightboxItem.title}
              </h3>
              <p className="text-xs text-white/70 flex items-center justify-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                <span>{currentLightboxItem.location}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
