import React from "react";
import Link from "next/link";
import Image from "next/image";
import { TourPackage } from "@/types";
import { MapPin, Clock, Check, Sparkles, MessageCircle, ArrowRight, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getPackageDiscountStatus } from "@/services/travelService";

interface PackageCardProps {
  packageData: TourPackage;
}

export const PackageCard: React.FC<PackageCardProps> = ({ packageData }) => {
  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "Popular Choice":
        return "bg-brand-red text-white";
      case "Family Special":
        return "bg-amber-500 text-white";
      case "Seasonal Offer":
        return "bg-emerald-600 text-white";
      case "New Package":
        return "bg-indigo-600 text-white";
      default:
        return "bg-brand-charcoal text-white";
    }
  };

  // Discount Status Calculations
  const discountInfo = getPackageDiscountStatus(
    packageData.price,
    packageData.discount_enabled,
    packageData.discount_type,
    packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.original_price
  );

  const coupleDiscountInfo = getPackageDiscountStatus(
    packageData.couple_final_price || packageData.price,
    packageData.discount_enabled,
    packageData.couple_pricing_configuration?.discount_type || packageData.discount_type,
    packageData.couple_pricing_configuration?.discount_value || packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.couple_original_price
  );

  const familyDiscountInfo = getPackageDiscountStatus(
    packageData.family_final_price || packageData.price,
    packageData.discount_enabled,
    packageData.family_pricing_configuration?.discount_type || packageData.discount_type,
    packageData.family_pricing_configuration?.discount_value || packageData.discount_value,
    packageData.discount_start_date,
    packageData.discount_end_date,
    packageData.family_original_price
  );

  const whatsappMessage = encodeURIComponent(
    `Hello YaadgarSafar! I am interested in booking or knowing more about the package "${packageData.title}" (${packageData.destination_name}). Please share the full details.`
  );

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-borderGrey/80 shadow-card hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative h-60 w-full overflow-hidden bg-brand-offWhite">
          <Image
            src={packageData.cover_image}
            alt={packageData.title}
            fill
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {packageData.badge ? (
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${getBadgeColor(
                    packageData.badge
                  )}`}
                >
                  {packageData.badge}
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/90 text-brand-charcoal backdrop-blur-md">
                  {packageData.category}
                </span>
              )}

              {/* Discount Ribbon Badge */}
              {discountInfo.isActive && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {discountInfo.percentageOff > 0
                    ? `${discountInfo.percentageOff}% OFF`
                    : `Save ${formatCurrency(discountInfo.savings)}`}
                </span>
              )}
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-md flex items-center gap-1 shrink-0">
              <Clock className="w-3.5 h-3.5 text-brand-softRed" />
              <span>
                {packageData.duration_days}D / {packageData.duration_nights}N
              </span>
            </span>
          </div>

          {/* Bottom Overlay Location */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-brand-red" />
            <span>{packageData.destination_name}</span>
            <span className="text-white/60">({packageData.trip_type})</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-5 sm:p-6">
          <Link href={`/packages/${packageData.slug}`}>
            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-brand-charcoal hover:text-brand-red transition-colors line-clamp-2 leading-snug">
              {packageData.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs sm:text-sm text-brand-grey line-clamp-2 leading-relaxed font-normal">
            {packageData.short_description}
          </p>

          {/* Highlights List Preview */}
          <div className="mt-4 space-y-1.5 border-t border-brand-borderGrey/70 pt-3">
            {packageData.highlights.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-brand-charcoal/80">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Pricing and Actions */}
      <div className="p-5 sm:p-6 pt-0 bg-white">
        {packageData.pricing_display_mode === "separate" &&
        packageData.couple_final_price &&
        packageData.family_final_price ? (
          <div className="pt-3 border-t border-brand-borderGrey/80 mb-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="p-2.5 rounded-2xl bg-rose-50/70 border border-rose-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
                    Couple (2 Pers)
                  </span>
                  {coupleDiscountInfo.isActive && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                      {coupleDiscountInfo.percentageOff}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  {coupleDiscountInfo.isActive && (
                    <span className="text-xs font-semibold text-slate-400 line-through">
                      {formatCurrency(coupleDiscountInfo.originalPrice, packageData.currency)}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-heading font-extrabold text-slate-900 leading-tight">
                    {formatCurrency(
                      coupleDiscountInfo.isActive
                        ? coupleDiscountInfo.discountedPrice
                        : packageData.couple_final_price,
                      packageData.currency
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">/ Person</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    Family (2+ Pers)
                  </span>
                  {familyDiscountInfo.isActive && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-600 text-white">
                      {familyDiscountInfo.percentageOff}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  {familyDiscountInfo.isActive && (
                    <span className="text-xs font-semibold text-slate-400 line-through">
                      {formatCurrency(familyDiscountInfo.originalPrice, packageData.currency)}
                    </span>
                  )}
                  <span className="text-base sm:text-lg font-heading font-extrabold text-slate-900 leading-tight">
                    {formatCurrency(
                      familyDiscountInfo.isActive
                        ? familyDiscountInfo.discountedPrice
                        : packageData.family_final_price,
                      packageData.currency
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">/ Person</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-brand-grey px-0.5">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" /> Best Price Guarantee
              </span>
              <a
                href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#128C7E] font-bold hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="pt-3 border-t border-brand-borderGrey/80 flex items-end justify-between mb-4">
            <div>
              {discountInfo.isActive ? (
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold text-slate-400 line-through">
                      {formatCurrency(discountInfo.originalPrice, packageData.currency)}
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {discountInfo.percentageOff > 0
                        ? `${discountInfo.percentageOff}% OFF`
                        : `Save ${formatCurrency(discountInfo.savings)}`}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-heading font-extrabold text-brand-charcoal">
                      {formatCurrency(discountInfo.discountedPrice, packageData.currency)}
                    </span>
                    <span className="text-[11px] text-brand-grey">
                      / {packageData.pricing_basis || "person"}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    You Save {formatCurrency(discountInfo.savings, packageData.currency)}!
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-[11px] text-brand-grey uppercase tracking-wider block">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-heading font-extrabold text-brand-charcoal">
                      {formatCurrency(packageData.price, packageData.currency)}
                    </span>
                  </div>
                  <span className="text-[11px] text-brand-grey block">
                    {packageData.pricing_basis}
                  </span>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/919876543210?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#25D366]/10 hover:bg-[#25D366] text-[#128C7E] hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/packages/${packageData.slug}`}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-offWhite hover:bg-brand-borderGrey/60 text-brand-charcoal text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/custom-trip?package=${encodeURIComponent(packageData.title)}&destination=${encodeURIComponent(packageData.destination_name)}`}
            className="w-full inline-flex items-center justify-center gap-1.5 bg-brand-red hover:bg-brand-deepRed text-white text-xs sm:text-sm font-bold py-2.5 px-3 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enquire Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};