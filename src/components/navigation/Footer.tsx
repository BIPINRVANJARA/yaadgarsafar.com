import React from "react";
import Link from "next/link";
import { BrandWordmark } from "./BrandWordmark";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  ShieldCheck,
  Award,
  HeartHandshake,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <>
      {/* Brand Value Pillars - Light, High-Contrast Trust Strip */}
      <section className="bg-brand-offWhite border-t border-brand-borderGrey/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-borderGrey shadow-card hover:shadow-premium-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-brand-charcoal">
                  100% Verified Partners
                </h4>
                <p className="text-xs text-brand-grey mt-0.5 leading-relaxed">
                  Strictly inspected hotels, drivers & scenic routes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-borderGrey shadow-card hover:shadow-premium-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-brand-charcoal">
                  Handcrafted Itineraries
                </h4>
                <p className="text-xs text-brand-grey mt-0.5 leading-relaxed">
                  Thoughtfully paced travel without rushed schedules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-brand-borderGrey shadow-card hover:shadow-premium-hover transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0 shadow-sm">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-brand-charcoal">
                  24/7 On-Tour Assistance
                </h4>
                <p className="text-xs text-brand-grey mt-0.5 leading-relaxed">
                  Instant WhatsApp support throughout your entire journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#111827] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
            {/* Brand Info */}
            <div className="lg:col-span-2 space-y-4">
              <BrandWordmark theme="dark" size="lg" href="/" />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-300">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                <span>A Unit of <strong className="text-white font-semibold">Velora Group of Resorts and hotels</strong></span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                YaadgarSafar.com creates unforgettable travel stories. Owned by <strong className="text-slate-200 font-medium">Deven Vanzara</strong>, we specialize in handcrafted domestic tours across India and breathtaking international holiday getaways with complete transparent planning.
              </p>
              <div className="pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20want%20to%20plan%20a%20trip."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-md transition-transform hover:scale-105"
                >
                  <span>Direct WhatsApp Helpline: +91 98765 43210</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-white text-base tracking-wide">
                Quick Links
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Tour Packages", href: "/packages" },
                  { label: "Destinations", href: "/destinations" },
                  { label: "Custom Trip Planner", href: "/custom-trip" },
                  { label: "Our Services", href: "/services" },
                  { label: "Travel Gallery", href: "/gallery" },
                  { label: "Customer Reviews", href: "/reviews" },
                  { label: "About Us", href: "/about" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Destinations */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-white text-base tracking-wide">
                Top Destinations
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { label: "Kashmir Valley Tours", href: "/destinations/kashmir" },
                  { label: "Goa Beach Vacations", href: "/destinations/goa" },
                  { label: "Kerala Houseboat Packages", href: "/destinations/kerala" },
                  { label: "Rajasthan Royal Forts", href: "/destinations/rajasthan" },
                  { label: "Dubai Luxury Holidays", href: "/destinations/dubai" },
                  { label: "Bali Romantic Escapes", href: "/destinations/bali" },
                ].map((dest) => (
                  <li key={dest.href}>
                    <Link
                      href={dest.href}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-brand-red group-hover:translate-x-0.5 transition-all" />
                      <span>{dest.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agency Contact */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-white text-base tracking-wide">
                Contact & Support
              </h3>
              <ul className="space-y-3 text-xs md:text-sm">
                <li className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>104, Royal Palms Business Center, MG Road, New Delhi, India</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <Phone className="w-4 h-4 text-brand-red shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-300">
                  <Mail className="w-4 h-4 text-brand-red shrink-0" />
                  <span>hello@yaadgarsafar.com</span>
                </li>
                <li className="flex items-start gap-2.5 text-slate-300">
                  <Clock className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                  <span>Mon - Sat: 9:00 AM - 8:00 PM IST</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>
              © {new Date().getFullYear()} YaadgarSafar.com • A Unit of Velora Group of Resorts and hotels • Owned by Deven Vanzara. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
              <Link href="/admin/login" className="text-slate-500 hover:text-brand-red transition-colors">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
