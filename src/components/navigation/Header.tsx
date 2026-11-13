"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "./BrandWordmark";
import {
  Menu,
  X,
  PhoneCall,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Compass,
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  Info,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  transparentHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ transparentHero = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<{ [key: string]: boolean }>({
    destinations: false,
    more: false,
  });

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (menuKey: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(menuKey);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const destinationSubItems = [
    {
      label: "Kashmir Valley",
      href: "/destinations/kashmir",
      tagline: "Snow peaks, shikaras & Gulmarg gondola",
    },
    {
      label: "Goa Beaches",
      href: "/destinations/goa",
      tagline: "Golden beaches, cruises & vibrant nightlife",
    },
    {
      label: "Himachal Pradesh",
      href: "/destinations/himachal",
      tagline: "Manali, Shimla & picturesque mountain passes",
    },
    {
      label: "Kerala Backwaters",
      href: "/destinations/kerala",
      tagline: "Tranquil houseboats, tea gardens & Munnar",
    },
  ];

  const moreSubItems = [
    {
      label: "Custom Trips",
      href: "/custom-trip",
      tagline: "Tailor-made itineraries crafted for you",
      icon: SlidersHorizontal,
    },
    {
      label: "Our Services",
      href: "/services",
      tagline: "Hotels, flights, cabs & dedicated guides",
      icon: Briefcase,
    },
    {
      label: "Photo Gallery",
      href: "/gallery",
      tagline: "Real memories & traveler photo moments",
      icon: Camera,
    },
    {
      label: "About Us",
      href: "/about",
      tagline: "Our story, values & experienced team",
      icon: Info,
    },
  ];

  const isHeroMode = transparentHero && !isScrolled;

  const isDestinationsActive =
    pathname === "/destinations" || pathname.startsWith("/destinations/");

  const isMoreActive = moreSubItems.some((item) => pathname === item.href);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isHeroMode
            ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4 md:py-5"
            : "bg-white/95 backdrop-blur-md shadow-sm border-b border-brand-borderGrey/60 py-3 md:py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 lg:gap-4">
            {/* Wordmark Logo */}
            <div className="flex-shrink-0">
              <BrandWordmark
                theme={isHeroMode ? "dark" : "light"}
                size="md"
                href="/"
              />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {/* 1. Home */}
              <Link
                href="/"
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  pathname === "/"
                    ? isHeroMode
                      ? "bg-white/20 text-white font-semibold"
                      : "bg-brand-softRed text-brand-deepRed font-semibold"
                    : isHeroMode
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-offWhite"
                )}
              >
                <span className="whitespace-nowrap">Home</span>
              </Link>

              {/* 2. Packages */}
              <Link
                href="/packages"
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  pathname === "/packages"
                    ? isHeroMode
                      ? "bg-white/20 text-white font-semibold"
                      : "bg-brand-softRed text-brand-deepRed font-semibold"
                    : isHeroMode
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-offWhite"
                )}
              >
                <span className="whitespace-nowrap">Packages</span>
              </Link>

              {/* 3. Destinations with Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("destinations")}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href="/destinations"
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                    isDestinationsActive
                      ? isHeroMode
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-brand-softRed text-brand-deepRed font-semibold"
                      : isHeroMode
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-offWhite"
                  )}
                >
                  <span className="whitespace-nowrap">Destinations</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0",
                      openDropdown === "destinations" ? "rotate-180" : ""
                    )}
                  />
                </Link>

                {/* Destinations Dropdown Panel */}
                {openDropdown === "destinations" && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/15 border border-slate-100 p-2 text-brand-charcoal">
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
                          Top Destinations
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-brand-red" />
                      </div>
                      <div className="py-1">
                        {destinationSubItems.map((dest) => (
                          <Link
                            key={dest.href}
                            href={dest.href}
                            className="flex flex-col px-3 py-2 rounded-xl hover:bg-brand-softRed/60 transition-colors group"
                          >
                            <span className="text-sm font-semibold text-brand-charcoal group-hover:text-brand-deepRed transition-colors whitespace-nowrap">
                              {dest.label}
                            </span>
                            <span className="text-xs text-slate-500 line-clamp-1">
                              {dest.tagline}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <Link
                          href="/destinations"
                          className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-brand-softRed/60 text-xs font-bold text-brand-deepRed transition-colors group"
                        >
                          <span className="whitespace-nowrap">View All Destinations</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. More (Suboptions dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("more")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdown(openDropdown === "more" ? null : "more")
                  }
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 select-none",
                    isMoreActive
                      ? isHeroMode
                        ? "bg-white/20 text-white font-semibold"
                        : "bg-brand-softRed text-brand-deepRed font-semibold"
                      : isHeroMode
                      ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-offWhite"
                  )}
                >
                  <span className="whitespace-nowrap">More</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0",
                      openDropdown === "more" ? "rotate-180" : ""
                    )}
                  />
                </button>

                {/* More Dropdown Panel */}
                {openDropdown === "more" && (
                  <div className="absolute top-full left-0 pt-2 w-72 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/15 border border-slate-100 p-2 text-brand-charcoal">
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
                          Explore More
                        </span>
                        <Compass className="w-3.5 h-3.5 text-brand-red" />
                      </div>
                      <div className="py-1">
                        {moreSubItems.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group",
                                isSubActive
                                  ? "bg-brand-softRed text-brand-deepRed"
                                  : "hover:bg-brand-softRed/60"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-brand-softRed/70 text-brand-deepRed flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red group-hover:text-white transition-colors">
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-brand-charcoal group-hover:text-brand-deepRed transition-colors whitespace-nowrap">
                                  {sub.label}
                                </span>
                                <span className="text-xs text-slate-500 truncate">
                                  {sub.tagline}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Contact */}
              <Link
                href="/contact"
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
                  pathname === "/contact"
                    ? isHeroMode
                      ? "bg-white/20 text-white font-semibold"
                      : "bg-brand-softRed text-brand-deepRed font-semibold"
                    : isHeroMode
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-brand-charcoal/80 hover:text-brand-charcoal hover:bg-brand-offWhite"
                )}
              >
                <span className="whitespace-nowrap">Contact</span>
              </Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden sm:flex items-center space-x-2.5 xl:space-x-3 flex-shrink-0">
              <a
                href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20would%20like%20to%20enquire%20about%20a%20tour%20package."
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "hidden xl:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0",
                  isHeroMode
                    ? "text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
                    : "text-brand-charcoal bg-brand-offWhite hover:bg-brand-borderGrey/50"
                )}
              >
                <PhoneCall className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span className="whitespace-nowrap font-medium">+91 98765 43210</span>
              </a>

              <Link
                href="/custom-trip"
                className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-sm font-semibold px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap flex-shrink-0"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Plan Your Trip</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red flex-shrink-0",
                isHeroMode
                  ? "text-white hover:bg-white/10"
                  : "text-brand-charcoal hover:bg-brand-offWhite"
              )}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between pb-6 border-b border-brand-borderGrey">
                <BrandWordmark size="sm" href="/" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-brand-offWhite text-brand-charcoal hover:bg-brand-borderGrey transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="mt-6 flex flex-col space-y-1">
                {/* 1. Home */}
                <Link
                  href="/"
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors whitespace-nowrap",
                    pathname === "/"
                      ? "bg-brand-softRed text-brand-deepRed font-semibold"
                      : "text-brand-charcoal hover:bg-brand-offWhite"
                  )}
                >
                  <span className="whitespace-nowrap">Home</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4",
                      pathname === "/" ? "text-brand-red" : "text-brand-grey"
                    )}
                  />
                </Link>

                {/* 2. Packages */}
                <Link
                  href="/packages"
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors whitespace-nowrap",
                    pathname === "/packages"
                      ? "bg-brand-softRed text-brand-deepRed font-semibold"
                      : "text-brand-charcoal hover:bg-brand-offWhite"
                  )}
                >
                  <span className="whitespace-nowrap">Packages</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4",
                      pathname === "/packages" ? "text-brand-red" : "text-brand-grey"
                    )}
                  />
                </Link>

                {/* 3. Destinations Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setMobileAccordion((prev) => ({
                        ...prev,
                        destinations: !prev.destinations,
                      }))
                    }
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors whitespace-nowrap",
                      isDestinationsActive
                        ? "bg-brand-softRed text-brand-deepRed font-semibold"
                        : "text-brand-charcoal hover:bg-brand-offWhite"
                    )}
                  >
                    <span className="whitespace-nowrap">Destinations</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        mobileAccordion.destinations ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {mobileAccordion.destinations && (
                    <div className="ml-4 pl-3 border-l-2 border-brand-red/20 my-1 space-y-1">
                      <Link
                        href="/destinations"
                        className="block px-3 py-2 rounded-lg text-sm font-semibold text-brand-deepRed hover:bg-brand-softRed/50 transition-colors whitespace-nowrap"
                      >
                        All Destinations →
                      </Link>
                      {destinationSubItems.map((dest) => (
                        <Link
                          key={dest.href}
                          href={dest.href}
                          className="block px-3 py-1.5 rounded-lg text-sm text-brand-charcoal hover:bg-brand-offWhite transition-colors whitespace-nowrap"
                        >
                          {dest.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. More Accordion */}
                <div>
                  <button
                    onClick={() =>
                      setMobileAccordion((prev) => ({
                        ...prev,
                        more: !prev.more,
                      }))
                    }
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors whitespace-nowrap",
                      isMoreActive
                        ? "bg-brand-softRed text-brand-deepRed font-semibold"
                        : "text-brand-charcoal hover:bg-brand-offWhite"
                    )}
                  >
                    <span className="whitespace-nowrap">More</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        mobileAccordion.more ? "rotate-180" : ""
                      )}
                    />
                  </button>

                  {mobileAccordion.more && (
                    <div className="ml-4 pl-3 border-l-2 border-brand-red/20 my-1 space-y-1">
                      {moreSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors whitespace-nowrap",
                              isSubActive
                                ? "bg-brand-softRed text-brand-deepRed font-semibold"
                                : "text-brand-charcoal hover:bg-brand-offWhite"
                            )}
                          >
                            <SubIcon className="w-4 h-4 text-brand-red flex-shrink-0" />
                            <span className="whitespace-nowrap">{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 5. Contact */}
                <Link
                  href="/contact"
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors whitespace-nowrap",
                    pathname === "/contact"
                      ? "bg-brand-softRed text-brand-deepRed font-semibold"
                      : "text-brand-charcoal hover:bg-brand-offWhite"
                  )}
                >
                  <span className="whitespace-nowrap">Contact</span>
                  <ChevronRight
                    className={cn(
                      "w-4 h-4",
                      pathname === "/contact" ? "text-brand-red" : "text-brand-grey"
                    )}
                  />
                </Link>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-brand-offWhite border-t border-brand-borderGrey space-y-3">
              <Link
                href="/custom-trip"
                className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Plan Your Trip</span>
              </Link>

              <a
                href="https://wa.me/919876543210?text=Hi%20YaadgarSafar!%20I%20would%20like%20to%20plan%20a%20tour."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-3 px-4 rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
