"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SmartTourSearch } from "../search/SmartTourSearch";
import { Sparkles, Compass, ChevronDown, ShieldCheck, Star, Building2, Award } from "lucide-react";

export const HeroSection: React.FC = () => {
  const handleScrollToDestinations = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById("featured-destinations");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden bg-brand-darkNavy">
      {/* Background Cinematic Image with Subtle Zoom Parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
          alt="Yaadgar Safar Cinematic Destination"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-pulse-subtle transition-transform duration-1000"
        />
        {/* Layered dark overlays for editorial elegance and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darkNavy via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/30 to-black/80" />
      </div>

      {/* Decorative Animated Logo Flight Path SVG in background */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-25">
        <svg
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M 50 500 C 300 480, 500 350, 850 180"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="12 8"
            className="animate-flight-path"
          />
          {/* Subtle airplane icon positioned along the path */}
          <g transform="translate(850, 180) rotate(-22)">
            <path
              d="M0 0 L25 -8 L35 0 L20 8 Z M12 -3 L18 -18 L24 -16 L20 -3 Z M12 3 L18 18 L24 16 L20 3 Z"
              fill="white"
            />
          </g>
        </svg>
      </div>

      {/* Hero Central Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center">
        {/* Unified Corporate Trust & Rating Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm font-semibold shadow-inner hover:border-white/30 transition-all duration-300">
            {/* Part 1: Velora Group */}
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
              </span>
              <span>
                A Unit of <strong className="text-white font-bold">Velora Group of Resorts and hotels</strong>
              </span>
            </span>

            <span className="text-white/40 hidden sm:inline">|</span>

            {/* Part 2: Owner & Founder */}
            <span className="text-white">
              Owner & Founder: <strong className="text-white font-bold">Deven Vanzara</strong>
            </span>

            <span className="text-white/40 hidden sm:inline">|</span>

            {/* Part 3: Rating */}
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 inline" />
              <span className="text-white font-bold">4.9/5 Rating</span>
            </span>
          </div>
        </motion.div>

        {/* Elegant Hindi Brand Statement Tagline (Rozha One / Serif Devanagari) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-center mb-2.5 sm:mb-3.5"
        >
          <span className="font-['Rozha_One','Noto_Serif_Devanagari',serif] text-brand-red text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide inline-block drop-shadow-[0_2px_14px_rgba(242,13,24,0.35)] select-none leading-tight font-normal">
            हर सफर हो यादगार
          </span>
        </motion.div>

        {/* Primary English Hero Headline Quote */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-white tracking-tight leading-[1.16] text-center"
        >
          <span className="block">Some journeys take you places.</span>
          <span className="block">Others create memories that</span>
          <span className="block">stay forever.</span>
        </motion.h1>

        {/* Refined Concise Supporting Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-white/80 max-w-xl mx-auto font-normal leading-relaxed text-center [text-wrap:balance]"
        >
          Handcrafted holiday packages, verified luxury stays, and 24/7 personal concierge across India and abroad.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-7 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link
            href="/destinations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-red hover:bg-brand-deepRed text-white font-heading font-bold text-base px-8 py-3.5 rounded-full shadow-xl shadow-brand-red/30 hover:shadow-2xl hover:shadow-brand-red/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5" />
            <span>Explore Destinations</span>
          </Link>

          <Link
            href="/custom-trip"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/25 font-heading font-bold text-base px-8 py-3.5 rounded-full transition-all duration-300 hover:border-white/40"
          >
            <Sparkles className="w-5 h-5 text-brand-softRed" />
            <span>Plan Your Trip</span>
          </Link>
        </motion.div>
      </div>

      {/* Floating Smart Tour Search Component */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 md:mt-12"
      >
        <SmartTourSearch />
      </motion.div>

      {/* Smooth Interactive Scroll Down Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-6 mb-2">
        <button
          onClick={handleScrollToDestinations}
          className="group inline-flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer focus:outline-none"
          aria-label="Scroll smoothly to featured destinations"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-white/70 group-hover:text-white transition-colors">
            Scroll to Explore
          </span>
          <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-brand-red flex items-center justify-center transition-all duration-300 border border-white/20 group-hover:border-brand-red shadow-sm">
            <ChevronDown className="w-4 h-4 text-white animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
