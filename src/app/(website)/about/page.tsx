import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandWordmark } from "@/components/navigation/BrandWordmark";
import {
  Compass,
  Heart,
  Target,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  Building2,
  UserCheck,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Our Story & Philosophy
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight leading-tight">
            We Don't Just Plan Trips. <br />
            <span className="text-brand-deepRed">We Help Create Memories.</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            Welcome to YaadgarSafar.com — a modern, customer-first travel agency dedicated to making every single journey deeply memorable, safe, and stress-free.
          </p>
        </div>

        {/* Brand Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 bg-white rounded-3xl p-8 sm:p-12 md:p-16 border border-brand-borderGrey shadow-premium">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 mb-2">
              <BrandWordmark size="md" href="/" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
              Travel Should Be an Experience, Not a Transaction
            </h2>

            <p className="text-sm sm:text-base text-brand-grey leading-relaxed">
              YaadgarSafar was founded with a singular purpose: to challenge the cookie-cutter, rushed itineraries that flood modern tourism. We believe travel is one of life’s most precious investments — a sacred time to reconnect with family, celebrate milestones, and discover cultures.
            </p>

            <p className="text-sm sm:text-base text-brand-grey leading-relaxed">
              Our emblem — featuring the vibrant red of passion, the white location pin of exploration, and the soaring flight path — represents our promise: every holiday we design is handled with meticulous care, genuine local insight, and around-the-clock personal assistance.
            </p>

            <div className="pt-2 flex items-center gap-6">
              <div>
                <span className="text-3xl font-heading font-extrabold text-brand-red">100%</span>
                <p className="text-xs text-brand-grey mt-0.5">Verified Local Stays</p>
              </div>
              <div className="h-10 w-px bg-brand-borderGrey" />
              <div>
                <span className="text-3xl font-heading font-extrabold text-brand-red">24/7</span>
                <p className="text-xs text-brand-grey mt-0.5">On-Tour Support</p>
              </div>
              <div className="h-10 w-px bg-brand-borderGrey" />
              <div>
                <span className="text-3xl font-heading font-extrabold text-brand-red">4.9★</span>
                <p className="text-xs text-brand-grey mt-0.5">Customer Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop"
              alt="Yaadgar Safar Experience"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-softRed">Our Motto</p>
              <h3 className="font-heading font-bold text-xl">"हर सफर हो यादगार • Har Safar Ho Yaadgar"</h3>
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-borderGrey shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-brand-charcoal mb-3">
              Our Mission
            </h3>
            <p className="text-sm text-brand-grey leading-relaxed">
              To empower travellers with honest, transparent, and thoughtfully crafted travel packages that eliminate travel anxiety, celebrate local culture, and deliver outstanding value for every rupee spent.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-borderGrey shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center mb-6">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-heading font-extrabold text-brand-charcoal mb-3">
              Our Vision
            </h3>
            <p className="text-sm text-brand-grey leading-relaxed">
              To become India's most trusted travel brand known for genuine hospitality, personalized journey curation, and exceptional customer satisfaction across both domestic circuits and international getaways.
            </p>
          </div>
        </div>

        {/* Corporate Heritage & Group Leadership */}
        <div className="bg-gradient-to-br from-white via-white to-brand-softRed/30 rounded-3xl p-8 sm:p-12 border border-brand-borderGrey shadow-card mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-brand-softRed px-3.5 py-1.5 rounded-full">
                <Building2 className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-deepRed">
                  Corporate Heritage & Backing
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
                Operated Under <span className="text-brand-red">Velora Group of Resorts and hotels</span>
              </h2>
              <p className="text-sm text-brand-grey leading-relaxed">
                YaadgarSafar is proud to operate as an official subsidiary unit of <strong>Velora Group of Resorts and hotels</strong>. Founded and steered by visionary entrepreneur <strong>Deven Vanzara</strong>, our group combines decades of premium hospitality excellence with nationwide destination management.
              </p>
              <p className="text-sm text-brand-grey leading-relaxed">
                This prestigious backing allows YaadgarSafar to guarantee superior stay inventory, exclusive priority room allocations, audited hygienic standards, and direct resort privileges that independent brokers cannot match.
              </p>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-brand-borderGrey shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-brand-borderGrey">
                <div className="w-12 h-12 rounded-xl bg-brand-charcoal text-white flex items-center justify-center font-heading font-bold text-lg">
                  DV
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-brand-charcoal text-base">
                    Deven Vanzara
                  </h4>
                  <p className="text-xs text-brand-grey font-medium">
                    Owner & Group Managing Director
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-brand-grey">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Velora Group Corporate Governance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Excellence in Leisure & Luxury Hospitality</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-brand-red shrink-0" />
                  <span>Direct Guest Advocacy & Accountability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-brand-darkNavy text-white rounded-3xl p-8 sm:p-14 text-center max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-white">
            Ready to Plan Your Next Unforgettable Journey?
          </h2>
          <p className="mt-3 text-sm text-white/80 max-w-xl mx-auto leading-relaxed">
            Speak directly with our senior destination specialists or request a complimentary custom itinerary.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/custom-trip"
              className="px-8 py-3.5 rounded-full bg-brand-red hover:bg-brand-deepRed text-white text-sm font-bold shadow-lg transition-all"
            >
              Plan Custom Trip
            </Link>
            <a
              href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20would%20like%20to%20know%20more%20about%20your%20agency%20and%20tours."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-sm font-bold shadow-md transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
