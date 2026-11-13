"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { travelService } from "@/services/travelService";
import {
  TourPackage,
  TripCategory,
  TripType,
  PackageItineraryDay,
  PackageFlight,
  PackageHotel,
  PackageTransfer,
  PackageActivity,
  PackageDepartureDate,
  PackagePolicies,
  PackageCommercial,
  PricingTierConfig,
} from "@/types";
import {
  X,
  Save,
  Eye,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Upload,
  Sparkles,
  Plane,
  Hotel,
  Car,
  MapPin,
  Clock,
  Compass,
  Utensils,
  ShieldAlert,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  Info,
  Layers,
  FileText,
  BadgePercent,
  Check,
  Send,
  Search,
  FolderOpen,
  Star,
  Users,
  Heart,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

interface PackageFormModalProps {
  packageToEdit: TourPackage | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type FormTab =
  | "basic"
  | "commercial"
  | "media"
  | "itinerary"
  | "flights"
  | "hotels"
  | "transfers"
  | "activities"
  | "inclusions"
  | "policies"
  | "departures"
  | "preview";

interface MediaLibraryItem {
  id: string;
  title: string;
  category: string;
  url: string;
}

const CURATED_MEDIA_PRESETS: MediaLibraryItem[] = [
  // Kashmir
  {
    id: "lib-kashmir-1",
    title: "Dal Lake Shikara Sunrise",
    category: "Kashmir",
    url: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kashmir-2",
    title: "Gulmarg Gondola & Snow Peaks",
    category: "Kashmir",
    url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kashmir-3",
    title: "Pahalgam Pine Valley & River",
    category: "Kashmir",
    url: "https://images.unsplash.com/photo-1597074866923-dc0589150358?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kashmir-4",
    title: "Sonamarg Glacier Meadows",
    category: "Kashmir",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kashmir-5",
    title: "Traditional Kashmiri Houseboat",
    category: "Kashmir",
    url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop",
  },
  // Kerala
  {
    id: "lib-kerala-1",
    title: "Alleppey Backwaters Houseboat",
    category: "Kerala",
    url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kerala-2",
    title: "Munnar Rolling Tea Gardens",
    category: "Kerala",
    url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kerala-3",
    title: "Varkala Cliff Beach Sunset",
    category: "Kerala",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-kerala-4",
    title: "Athirappilly Waterfall",
    category: "Kerala",
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1200&auto=format&fit=crop",
  },
  // Goa
  {
    id: "lib-goa-1",
    title: "Palolem Beach Turquoise Waters",
    category: "Goa",
    url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-goa-2",
    title: "Goa Golden Sand Beach Palms",
    category: "Goa",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-goa-3",
    title: "Goa Sunset Beach Shack",
    category: "Goa",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
  },
  // Rajasthan
  {
    id: "lib-rajasthan-1",
    title: "Amber Fort Heritage Jaipur",
    category: "Rajasthan",
    url: "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-rajasthan-2",
    title: "Hawa Mahal Iconic Facade",
    category: "Rajasthan",
    url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-rajasthan-3",
    title: "Thar Desert Sunset Camel Safari",
    category: "Rajasthan",
    url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-rajasthan-4",
    title: "Udaipur Lake Pichola Palace",
    category: "Rajasthan",
    url: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1200&auto=format&fit=crop",
  },
  // Manali & Himachal
  {
    id: "lib-manali-1",
    title: "Manali Alpine Pine Valley",
    category: "Manali",
    url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-manali-2",
    title: "Solang Valley Snow Mountain",
    category: "Manali",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-manali-3",
    title: "Rohtang Pass Alpine Road",
    category: "Manali",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
  },
  // International
  {
    id: "lib-intl-1",
    title: "Dubai Burj Khalifa & Skyline",
    category: "International",
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-intl-2",
    title: "Dubai Desert Safari Dune Bashing",
    category: "International",
    url: "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-intl-3",
    title: "Bali Tegallalang Rice Terraces",
    category: "International",
    url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-intl-4",
    title: "Thailand Phi Phi Islands Lagoon",
    category: "International",
    url: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-intl-5",
    title: "Swiss Alps Interlaken Mountains",
    category: "International",
    url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-intl-6",
    title: "Andaman Radhanagar Beach",
    category: "Nature",
    url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200&auto=format&fit=crop",
  },
  // Hotels & Stays
  {
    id: "lib-hotel-1",
    title: "Luxury 5-Star Bedroom Suite",
    category: "Hotels & Stays",
    url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-hotel-2",
    title: "Private Pool Villa Terrace",
    category: "Hotels & Stays",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-hotel-3",
    title: "Heritage Royal Palace Suite",
    category: "Hotels & Stays",
    url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-hotel-4",
    title: "Boutique Mountain Forest Chalet",
    category: "Hotels & Stays",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
  },
  // Transport & Adventure
  {
    id: "lib-trans-1",
    title: "Flight Window Clouds & Sunset",
    category: "Adventure",
    url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-trans-2",
    title: "Scenic Mountain Road Roadtrip",
    category: "Adventure",
    url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "lib-trans-3",
    title: "Campfire Under Starry Sky",
    category: "Adventure",
    url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
  },
];

export function PackageFormModal({
  packageToEdit,
  isOpen,
  onClose,
  onSuccess,
}: PackageFormModalProps) {
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // SECTION A: Basic Info
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [destinationName, setDestinationName] = useState("Kashmir");
  const [country, setCountry] = useState("India");
  const [stateRegion, setStateRegion] = useState("Jammu & Kashmir");
  const [departureCity, setDepartureCity] = useState("Ahmedabad / Mumbai / Delhi");
  const [tripScope, setTripScope] = useState<TripType>("domestic");
  const [days, setDays] = useState(5);
  const [nights, setNights] = useState(4);
  const [category, setCategory] = useState<TripCategory>("family");
  const [badge, setBadge] = useState<string>("Popular Choice");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [highlights, setHighlights] = useState<string[]>([
    "Deluxe stays with picturesque valley views",
    "Private chauffeur-driven vehicle throughout",
    "Curated sightseeing and iconic viewpoints",
  ]);
  const [newHighlight, setNewHighlight] = useState("");
  const [bestTime, setBestTime] = useState("April to October");
  const [languages, setLanguages] = useState<string>("Hindi, English, Gujarati");
  const [minTravelers, setMinTravelers] = useState(2);
  const [maxTravelers, setMaxTravelers] = useState(20);
  const [ageGroup, setAgeGroup] = useState("All Ages (Family Friendly)");
  const [status, setStatus] = useState<"published" | "draft" | "archived">("published");

  // SECTION B: Supplier & Commercial (CONFIDENTIAL)
  const [supplierName, setSupplierName] = useState("MakeMyTrip Partner");
  const [supplierPackageId, setSupplierPackageId] = useState("");
  const [supplierPackageUrl, setSupplierPackageUrl] = useState("");
  const [supplierBookingRef, setSupplierBookingRef] = useState("");
  const [sourcePlatform, setSourcePlatform] = useState<string>("MakeMyTrip");
  const [supplierBasePrice, setSupplierBasePrice] = useState<number>(35000);
  const [pricingMode, setPricingMode] = useState<"per_person" | "per_package">("per_person");
  const [commissionType, setCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [commissionValue, setCommissionValue] = useState<number>(10);
  const [additionalMarkup, setAdditionalMarkup] = useState<number>(1500);
  const [taxesFees, setTaxesFees] = useState<number>(500);
  const [manualPriceOverride, setManualPriceOverride] = useState(false);
  const [overrideCustomerPrice, setOverrideCustomerPrice] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [internalNotes, setInternalNotes] = useState("");

  // Dynamic Couple & Family Pricing State
  const [enableSeparatePricing, setEnableSeparatePricing] = useState(false);

  // Couple Pricing (2 Persons)
  const [coupleSupplierBasePrice, setCoupleSupplierBasePrice] = useState<number>(38000);
  const [coupleCommissionType, setCoupleCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [coupleCommissionValue, setCoupleCommissionValue] = useState<number>(10);
  const [coupleAdditionalMarkup, setCoupleAdditionalMarkup] = useState<number>(1500);
  const [coupleTaxesFees, setCoupleTaxesFees] = useState<number>(500);
  const [coupleManualPriceOverride, setCoupleManualPriceOverride] = useState(false);
  const [coupleOverridePrice, setCoupleOverridePrice] = useState<number>(0);
  const [coupleDiscountAmount, setCoupleDiscountAmount] = useState<number>(0);

  // Family Pricing (More than 2 Persons)
  const [familySupplierBasePrice, setFamilySupplierBasePrice] = useState<number>(32000);
  const [familyCommissionType, setFamilyCommissionType] = useState<"percentage" | "fixed">("percentage");
  const [familyCommissionValue, setFamilyCommissionValue] = useState<number>(10);
  const [familyAdditionalMarkup, setFamilyAdditionalMarkup] = useState<number>(1200);
  const [familyTaxesFees, setFamilyTaxesFees] = useState<number>(500);
  const [familyManualPriceOverride, setFamilyManualPriceOverride] = useState(false);
  const [familyOverridePrice, setFamilyOverridePrice] = useState<number>(0);
  const [familyDiscountAmount, setFamilyDiscountAmount] = useState<number>(0);

  // Customer Promotional Discount State
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [discountStartDate, setDiscountStartDate] = useState<string>("");
  const [discountEndDate, setDiscountEndDate] = useState<string>("");
  const [allowNegativeProfitException, setAllowNegativeProfitException] = useState(false);

  // Category specific discounts for Couple / Family
  const [sameDiscountForBoth, setSameDiscountForBoth] = useState(true);
  const [coupleDiscountType, setCoupleDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [coupleDiscountVal, setCoupleDiscountVal] = useState<number>(10);
  const [familyDiscountType, setFamilyDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [familyDiscountVal, setFamilyDiscountVal] = useState<number>(10);

  // SECTION C: Media & Gallery
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
  );
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Image Library Picker State
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
  const [mediaLibraryTarget, setMediaLibraryTarget] = useState<"cover" | "gallery">("cover");
  const [libraryCategoryFilter, setLibraryCategoryFilter] = useState("All");
  const [librarySearchQuery, setLibrarySearchQuery] = useState("");
  const [customUploadedLibrary, setCustomUploadedLibrary] = useState<MediaLibraryItem[]>([]);

  // SECTION D: Itinerary Builder
  const [itinerary, setItinerary] = useState<PackageItineraryDay[]>([]);

  // SECTION E: Flights
  const [flights, setFlights] = useState<PackageFlight[]>([]);

  // SECTION F: Hotels
  const [hotels, setHotels] = useState<PackageHotel[]>([]);

  // SECTION G: Transfers
  const [transfers, setTransfers] = useState<PackageTransfer[]>([]);

  // SECTION H: Activities & Sightseeing
  const [activitiesList, setActivitiesList] = useState<PackageActivity[]>([]);

  // SECTION I: Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    "Deluxe Hotel Accommodation with Daily Breakfast",
    "Private Air-Conditioned Vehicle for all transfers & sightseeing",
    "Airport / Railway station pickup and drop assistance",
    "All toll taxes, parking fees, fuel charges, and driver allowances",
    "24/7 dedicated local concierge support",
  ]);
  const [newInclusion, setNewInclusion] = useState("");
  const [exclusions, setExclusions] = useState<string[]>([
    "Airfare / Train tickets unless explicitly included in flights",
    "Personal expenses such as laundry, phone calls, beverages",
    "Monument entry tickets, pony rides, gondola rides & guide fees",
    "Travel Insurance & medical costs",
    "Anything not mentioned in the Inclusions section",
  ]);
  const [newExclusion, setNewExclusion] = useState("");

  // SECTION J: Policies
  const [cancellationPolicy, setCancellationPolicy] = useState(
    "Cancellation up to 30 days prior: 90% refund. Between 15-29 days: 50% refund. Less than 14 days: Non-refundable."
  );
  const [refundPolicy, setRefundPolicy] = useState(
    "Approved refunds are processed to the original payment method within 7-10 business days."
  );
  const [paymentTerms, setPaymentTerms] = useState(
    "25% token advance to book, 50% 15 days before departure, 25% balance on arrival."
  );
  const [documentsRequired, setDocumentsRequired] = useState(
    "Valid Government Photo ID (Aadhaar Card, Passport, or Voter ID) for all guests."
  );
  const [importantNotes, setImportantNotes] = useState(
    "Hotel check-in is typically 2:00 PM and check-out is 11:00 AM. Acclimatization is advised for high-altitude destinations."
  );

  // SECTION K: Departures
  const [departureDates, setDepartureDates] = useState<PackageDepartureDate[]>([]);

  // Auto-generate slug when title changes (if not editing an existing slug)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!packageToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Pricing Calculation
  const commissionEarned =
    commissionType === "percentage"
      ? Math.round((supplierBasePrice * commissionValue) / 100)
      : commissionValue;

  const calculatedSellingPrice = Math.round(
    supplierBasePrice + commissionEarned + (additionalMarkup || 0) + (taxesFees || 0) - (discountAmount || 0)
  );

  const finalSellingPrice = manualPriceOverride && overrideCustomerPrice > 0
    ? overrideCustomerPrice
    : calculatedSellingPrice;

  const estimatedProfit = Math.round(
    finalSellingPrice - supplierBasePrice - (taxesFees || 0)
  );

  // Couple Pricing Calculation (2 Persons)
  const coupleCommissionEarned =
    coupleCommissionType === "percentage"
      ? Math.round((coupleSupplierBasePrice * coupleCommissionValue) / 100)
      : coupleCommissionValue;

  const coupleCalculatedSellingPrice = Math.round(
    coupleSupplierBasePrice +
      coupleCommissionEarned +
      (coupleAdditionalMarkup || 0) +
      (coupleTaxesFees || 0) -
      (coupleDiscountAmount || 0)
  );

  const coupleFinalPrice =
    coupleManualPriceOverride && coupleOverridePrice > 0
      ? coupleOverridePrice
      : coupleCalculatedSellingPrice;

  const coupleEstimatedProfit = Math.round(
    coupleFinalPrice - coupleSupplierBasePrice - (coupleTaxesFees || 0)
  );

  // Family Pricing Calculation (More than 2 Persons)
  const familyCommissionEarned =
    familyCommissionType === "percentage"
      ? Math.round((familySupplierBasePrice * familyCommissionValue) / 100)
      : familyCommissionValue;

  const familyCalculatedSellingPrice = Math.round(
    familySupplierBasePrice +
      familyCommissionEarned +
      (familyAdditionalMarkup || 0) +
      (familyTaxesFees || 0) -
      (familyDiscountAmount || 0)
  );

  const familyFinalPrice =
    familyManualPriceOverride && familyOverridePrice > 0
      ? familyOverridePrice
      : familyCalculatedSellingPrice;

  const familyEstimatedProfit = Math.round(
    familyFinalPrice - familySupplierBasePrice - (familyTaxesFees || 0)
  );

  // Original Selling Prices (before customer discount)
  const regularSellingPrice = finalSellingPrice;
  const coupleRegularSellingPrice = coupleFinalPrice;
  const familyRegularSellingPrice = familyFinalPrice;

  // Single Mode Discount Calculation
  let singleDiscountAmount = 0;
  if (enableDiscount && discountValue > 0) {
    if (discountType === "percentage") {
      const pct = Math.min(Math.max(discountValue, 1), 90);
      singleDiscountAmount = Math.round((regularSellingPrice * pct) / 100);
    } else {
      singleDiscountAmount = Math.min(Math.round(discountValue), Math.max(regularSellingPrice - 1, 0));
    }
  }
  const finalDiscountedSellingPrice = enableDiscount
    ? Math.max(regularSellingPrice - singleDiscountAmount, 1)
    : regularSellingPrice;
  const singleProfitAfterDiscount = Math.round(
    finalDiscountedSellingPrice - supplierBasePrice - (taxesFees || 0)
  );

  // Couple Mode Discount Calculation
  const effCoupleDiscType = sameDiscountForBoth ? discountType : coupleDiscountType;
  const effCoupleDiscVal = sameDiscountForBoth ? discountValue : coupleDiscountVal;
  let coupleDiscountAmountCalc = 0;
  if (enableDiscount && effCoupleDiscVal > 0) {
    if (effCoupleDiscType === "percentage") {
      const pct = Math.min(Math.max(effCoupleDiscVal, 1), 90);
      coupleDiscountAmountCalc = Math.round((coupleRegularSellingPrice * pct) / 100);
    } else {
      coupleDiscountAmountCalc = Math.min(
        Math.round(effCoupleDiscVal),
        Math.max(coupleRegularSellingPrice - 1, 0)
      );
    }
  }
  const coupleFinalDiscountedPrice = enableDiscount
    ? Math.max(coupleRegularSellingPrice - coupleDiscountAmountCalc, 1)
    : coupleRegularSellingPrice;
  const coupleProfitAfterDiscount = Math.round(
    coupleFinalDiscountedPrice - coupleSupplierBasePrice - (coupleTaxesFees || 0)
  );

  // Family Mode Discount Calculation
  const effFamilyDiscType = sameDiscountForBoth ? discountType : familyDiscountType;
  const effFamilyDiscVal = sameDiscountForBoth ? discountValue : familyDiscountVal;
  let familyDiscountAmountCalc = 0;
  if (enableDiscount && effFamilyDiscVal > 0) {
    if (effFamilyDiscType === "percentage") {
      const pct = Math.min(Math.max(effFamilyDiscVal, 1), 90);
      familyDiscountAmountCalc = Math.round((familyRegularSellingPrice * pct) / 100);
    } else {
      familyDiscountAmountCalc = Math.min(
        Math.round(effFamilyDiscVal),
        Math.max(familyRegularSellingPrice - 1, 0)
      );
    }
  }
  const familyFinalDiscountedPrice = enableDiscount
    ? Math.max(familyRegularSellingPrice - familyDiscountAmountCalc, 1)
    : familyRegularSellingPrice;
  const familyProfitAfterDiscount = Math.round(
    familyFinalDiscountedPrice - familySupplierBasePrice - (familyTaxesFees || 0)
  );

  // Discount Validity Status Check
  const todayStr = new Date().toISOString().split("T")[0];
  let discountStatus: "active" | "scheduled" | "expired" | "disabled" = "disabled";
  if (enableDiscount) {
    if (discountStartDate && discountStartDate > todayStr) {
      discountStatus = "scheduled";
    } else if (discountEndDate && discountEndDate < todayStr) {
      discountStatus = "expired";
    } else {
      discountStatus = "active";
    }
  }

  // Sync state when editing or opening
  useEffect(() => {
    if (packageToEdit) {
      setTitle(packageToEdit.title);
      setSlug(packageToEdit.slug);
      setDestinationName(packageToEdit.destination_name);
      setCountry(packageToEdit.country || (packageToEdit.trip_type === "international" ? "International" : "India"));
      setStateRegion(packageToEdit.state_or_region || packageToEdit.destination_name);
      setDepartureCity(packageToEdit.departure_city || "Ahmedabad / Mumbai / Delhi");
      setTripScope(packageToEdit.trip_type);
      setDays(packageToEdit.duration_days);
      setNights(packageToEdit.duration_nights);
      setCategory(packageToEdit.category);
      setBadge(packageToEdit.badge || "Popular Choice");
      setShortDesc(packageToEdit.short_description);
      setFullDesc(packageToEdit.full_description || packageToEdit.description);
      setHighlights(packageToEdit.highlights || []);
      setBestTime(packageToEdit.best_time || "April to October");
      setLanguages(
        Array.isArray(packageToEdit.languages)
          ? packageToEdit.languages.join(", ")
          : "Hindi, English, Gujarati"
      );
      setMinTravelers(packageToEdit.min_travelers || 2);
      setMaxTravelers(packageToEdit.max_travelers || 20);
      setAgeGroup(packageToEdit.recommended_age_group || "All Ages (Family Friendly)");
      setStatus(packageToEdit.status || "published");
      setCoverImage(packageToEdit.cover_image);
      setCoverImageAlt(packageToEdit.cover_image_alt || packageToEdit.title);
      setGalleryImages(packageToEdit.gallery_images || []);
      setItinerary(packageToEdit.itinerary || []);
      setFlights(packageToEdit.flights || []);
      setHotels(packageToEdit.hotels || []);
      setTransfers(packageToEdit.transfers || []);
      setActivitiesList(packageToEdit.activities_list || []);
      setInclusions(packageToEdit.inclusions || []);
      setExclusions(packageToEdit.exclusions || []);
      setDepartureDates(packageToEdit.departure_dates || []);

      if (packageToEdit.policies) {
        setCancellationPolicy(packageToEdit.policies.cancellation || "");
        setRefundPolicy(packageToEdit.policies.refund || "");
        setPaymentTerms(packageToEdit.policies.payment_terms || "");
        setDocumentsRequired(packageToEdit.policies.documents_required || "");
        setImportantNotes(packageToEdit.policies.important_notes || "");
      }

      setOverrideCustomerPrice(packageToEdit.price);
      setManualPriceOverride(true);

      const isSeparate = packageToEdit.pricing_display_mode === "separate";
      setEnableSeparatePricing(isSeparate);

      if (packageToEdit.couple_final_price) {
        setCoupleOverridePrice(packageToEdit.couple_final_price);
        setCoupleManualPriceOverride(true);
      }
      if (packageToEdit.family_final_price) {
        setFamilyOverridePrice(packageToEdit.family_final_price);
        setFamilyManualPriceOverride(true);
      }

      // Customer Promotional Discount
      setEnableDiscount(Boolean(packageToEdit.discount_enabled));
      setDiscountType(packageToEdit.discount_type || "percentage");
      setDiscountValue(packageToEdit.discount_value || 10);
      setDiscountStartDate(packageToEdit.discount_start_date || "");
      setDiscountEndDate(packageToEdit.discount_end_date || "");
      setAllowNegativeProfitException(false);

      if (packageToEdit.couple_pricing_configuration?.discount_value !== undefined) {
        setCoupleDiscountType(packageToEdit.couple_pricing_configuration.discount_type || "percentage");
        setCoupleDiscountVal(packageToEdit.couple_pricing_configuration.discount_value || 10);
      }
      if (packageToEdit.family_pricing_configuration?.discount_value !== undefined) {
        setFamilyDiscountType(packageToEdit.family_pricing_configuration.discount_type || "percentage");
        setFamilyDiscountVal(packageToEdit.family_pricing_configuration.discount_value || 10);
      }

      // Load confidential commercial information
      travelService.getPackageCommercial(packageToEdit.id).then((comm) => {
        if (comm) {
          setSupplierName(comm.supplier_name || "MakeMyTrip Partner");
          setSupplierPackageId(comm.supplier_package_id || "");
          setSupplierPackageUrl(comm.supplier_package_url || "");
          setSupplierBookingRef(comm.supplier_booking_ref || "");
          setSourcePlatform(comm.source_platform || "MakeMyTrip");
          setSupplierBasePrice(comm.supplier_base_price || 35000);
          setPricingMode(comm.pricing_mode || "per_person");
          setCommissionType(comm.commission_type || "percentage");
          setCommissionValue(comm.commission_value || 10);
          setAdditionalMarkup(comm.additional_markup || 1500);
          setTaxesFees(comm.taxes_or_fees || 500);
          setInternalNotes(comm.internal_notes || "");
          setDiscountAmount(comm.discount_amount || 0);

          if (comm.pricing_display_mode === "separate") {
            setEnableSeparatePricing(true);
          }

          if (comm.couple_pricing_configuration) {
            const c = comm.couple_pricing_configuration;
            setCoupleSupplierBasePrice(c.supplier_base_price || 38000);
            setCoupleCommissionType(c.commission_type || "percentage");
            setCoupleCommissionValue(c.commission_value || 10);
            setCoupleAdditionalMarkup(c.additional_markup || 1500);
            setCoupleTaxesFees(c.taxes_or_fees || 500);
            setCoupleDiscountAmount(c.discount_amount || 0);
            setCoupleManualPriceOverride(c.manual_override || false);
            setCoupleOverridePrice(c.override_price || c.final_price || 0);
          }

          if (comm.family_pricing_configuration) {
            const f = comm.family_pricing_configuration;
            setFamilySupplierBasePrice(f.supplier_base_price || 32000);
            setFamilyCommissionType(f.commission_type || "percentage");
            setFamilyCommissionValue(f.commission_value || 10);
            setFamilyAdditionalMarkup(f.additional_markup || 1200);
            setFamilyTaxesFees(f.taxes_or_fees || 500);
            setFamilyDiscountAmount(f.discount_amount || 0);
            setFamilyManualPriceOverride(f.manual_override || false);
            setFamilyOverridePrice(f.override_price || f.final_price || 0);
          }
        }
      });
    } else {
      // Defaults for brand new package
      setTitle("");
      setSlug("");
      setDestinationName("Kashmir");
      setCountry("India");
      setStateRegion("Jammu & Kashmir");
      setDepartureCity("Ahmedabad / Mumbai / Delhi");
      setTripScope("domestic");
      setDays(6);
      setNights(5);
      setCategory("family");
      setBadge("Popular Choice");
      setShortDesc("");
      setFullDesc("");
      setHighlights([
        "Deluxe hotel stays with daily breakfast",
        "Dedicated private vehicle for all transfers & excursions",
        "Priority sightseeing and scenic viewpoints",
      ]);
      setBestTime("April to October");
      setLanguages("Hindi, English, Gujarati");
      setStatus("published");
      setCoverImage(
        "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
      );
      setGalleryImages([]);
      setManualPriceOverride(false);
      setSupplierBasePrice(35000);
      setCommissionValue(10);
      setAdditionalMarkup(1500);
      setTaxesFees(500);
      setInternalNotes("");

      // Couple & Family Pricing Defaults
      setEnableSeparatePricing(false);
      setCoupleSupplierBasePrice(38000);
      setCoupleCommissionType("percentage");
      setCoupleCommissionValue(10);
      setCoupleAdditionalMarkup(1500);
      setCoupleTaxesFees(500);
      setCoupleDiscountAmount(0);
      setCoupleManualPriceOverride(false);
      setCoupleOverridePrice(0);

      setFamilySupplierBasePrice(32000);
      setFamilyCommissionType("percentage");
      setFamilyCommissionValue(10);
      setFamilyAdditionalMarkup(1200);
      setFamilyTaxesFees(500);
      setFamilyDiscountAmount(0);
      setFamilyManualPriceOverride(false);
      setFamilyOverridePrice(0);

      // Customer Discount Defaults
      setEnableDiscount(false);
      setDiscountType("percentage");
      setDiscountValue(10);
      setDiscountStartDate("");
      setDiscountEndDate("");
      setAllowNegativeProfitException(false);
      setSameDiscountForBoth(true);
      setCoupleDiscountType("percentage");
      setCoupleDiscountVal(10);
      setFamilyDiscountType("percentage");
      setFamilyDiscountVal(10);

      // Default sample 6-day itinerary
      setItinerary([
        {
          day: 1,
          title: "Arrival in Srinagar & Dal Lake Shikara Ride",
          start_location: "Srinagar Airport",
          end_location: "Srinagar",
          description: "Arrive at Srinagar Sheikh-ul-Alam Airport. Greeted warmly by our representative and transferred to your houseboat/hotel. Enjoy a serene sunset Shikara ride on the world-famous Dal Lake.",
          travel_duration: "45 mins",
          meals_included: ["Dinner"],
          hotel_name: "Grand Heritage Houseboat / Hotel Royal Milad",
          hotel_room: "Super Deluxe Room",
          hotel_checkin: "1:00 PM",
          hotel_stay_city: "Srinagar",
          transfers: "Private AC Sedan (Airport to Hotel)",
          activities: "Shikara Ride on Dal Lake, Boulevard Walk",
          sightseeing: ["Dal Lake", "Boulevard Road", "Char Chinar"],
        },
        {
          day: 2,
          title: "Srinagar to Sonmarg Excursion (Meadow of Gold)",
          start_location: "Srinagar",
          end_location: "Sonmarg",
          description: "Full day scenic excursion to Sonmarg, renowned as the Meadow of Gold along the Sindh river. Enjoy picturesque pony rides to Thajiwas Glacier.",
          travel_duration: "2.5 hours each way",
          meals_included: ["Breakfast", "Dinner"],
          hotel_name: "Mountview Sonamarg / Srinagar Deluxe Stay",
          hotel_room: "Deluxe Mountain View",
          hotel_checkin: "12:00 PM",
          hotel_stay_city: "Sonmarg",
          transfers: "Private AC Vehicle",
          activities: "Thajiwas Glacier Trek, Sindh River Walk",
          sightseeing: ["Thajiwas Glacier", "Zero Point", "Sindh River Valley"],
        },
        {
          day: 3,
          title: "Sonmarg to Pahalgam (Valley of Shepherds)",
          start_location: "Sonmarg",
          end_location: "Pahalgam",
          description: "Drive through saffron fields and pine forests to Pahalgam. En route visit the historic Avantipur Ruins and cricket bat manufacturing villages.",
          travel_duration: "3.5 hours",
          meals_included: ["Breakfast", "Dinner"],
          hotel_name: "Hotel Bombay Palace / Pine View Resort",
          hotel_room: "Deluxe River View",
          hotel_checkin: "2:00 PM",
          hotel_stay_city: "Pahalgam",
          transfers: "Private AC Vehicle",
          activities: "Lidder River relaxation, Local Market Exploration",
          sightseeing: ["Avantipur Ruins", "Saffron Fields of Pampore", "Lidder River"],
        },
      ]);
      setFlights([]);
      setHotels([]);
      setTransfers([]);
      setActivitiesList([]);
      setDepartureDates([]);
    }
  }, [packageToEdit, isOpen]);

  // Itinerary Helpers
  const addItineraryDay = () => {
    const nextDayNum = itinerary.length + 1;
    const newDay: PackageItineraryDay = {
      day: nextDayNum,
      title: `Day ${nextDayNum} — Exploration & Sightseeing`,
      start_location: destinationName,
      end_location: destinationName,
      description: "Breakfast at hotel. Embark on today's scenic sightseeing circuit. Return in the evening for dinner and overnight stay.",
      travel_duration: "2-3 hours",
      meals_included: ["Breakfast", "Dinner"],
      hotel_name: "Partner Deluxe Hotel",
      hotel_room: "Standard Deluxe AC",
      hotel_checkin: "12:00 PM",
      hotel_stay_city: destinationName,
      transfers: "Private Dedicated Vehicle",
      activities: "Sightseeing and cultural exploration",
      sightseeing: ["Iconic viewpoint", "Local bazaar"],
    };
    setItinerary([...itinerary, newDay]);
  };

  const updateItineraryDay = (index: number, updated: Partial<PackageItineraryDay>) => {
    const copy = [...itinerary];
    copy[index] = { ...copy[index], ...updated };
    setItinerary(copy);
  };

  const deleteItineraryDay = (index: number) => {
    const filtered = itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = filtered.map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(renumbered);
  };

  const duplicateItineraryDay = (index: number) => {
    const target = itinerary[index];
    const duplicated: PackageItineraryDay = {
      ...target,
      day: target.day + 1,
      title: `${target.title} (Extended)`,
    };
    const newItinerary = [...itinerary];
    newItinerary.splice(index + 1, 0, duplicated);
    const renumbered = newItinerary.map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(renumbered);
  };

  const moveItineraryDay = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === itinerary.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const copy = [...itinerary];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    const renumbered = copy.map((d, i) => ({ ...d, day: i + 1 }));
    setItinerary(renumbered);
  };

  // Curated + dynamic media library items
  const allLibraryItems = useMemo(() => {
    const list = [...customUploadedLibrary, ...CURATED_MEDIA_PRESETS];
    // Include existing gallery photos if any
    galleryImages.forEach((img, idx) => {
      if (!list.some((item) => item.url === img)) {
        list.push({
          id: `pkg-gallery-${idx}`,
          title: `Package Photo ${idx + 1}`,
          category: "Package Media",
          url: img,
        });
      }
    });
    return list;
  }, [customUploadedLibrary, galleryImages]);

  const filteredLibraryImages = useMemo(() => {
    return allLibraryItems.filter((item) => {
      const matchesCategory =
        libraryCategoryFilter === "All" ||
        item.category.toLowerCase().includes(libraryCategoryFilter.toLowerCase()) ||
        item.title.toLowerCase().includes(libraryCategoryFilter.toLowerCase());

      const matchesSearch =
        !librarySearchQuery.trim() ||
        item.title.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(librarySearchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allLibraryItems, libraryCategoryFilter, librarySearchQuery]);

  const openMediaLibrary = (target: "cover" | "gallery") => {
    setMediaLibraryTarget(target);
    setLibraryCategoryFilter("All");
    setLibrarySearchQuery("");
    setIsMediaLibraryOpen(true);
  };

  const handleSelectLibraryImage = (url: string, title?: string) => {
    if (mediaLibraryTarget === "cover") {
      setCoverImage(url);
      if (title && !coverImageAlt) {
        setCoverImageAlt(title);
      }
      setIsMediaLibraryOpen(false);
      setSuccessToast("Cover photo updated from library!");
      setTimeout(() => setSuccessToast(""), 2500);
    } else {
      if (!galleryImages.includes(url)) {
        setGalleryImages((prev) => [...prev, url]);
        setSuccessToast("Added photo to gallery!");
        setTimeout(() => setSuccessToast(""), 2000);
      } else {
        setSuccessToast("Photo already in gallery");
        setTimeout(() => setSuccessToast(""), 2000);
      }
    }
  };

  const setAsCoverFromGallery = (url: string) => {
    setCoverImage(url);
    setSuccessToast("Set as main cover photo!");
    setTimeout(() => setSuccessToast(""), 2500);
  };

  const handleGalleryMultiUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await travelService.uploadImage(file, "packages/gallery");
        if (url) {
          uploadedUrls.push(url);
          setCustomUploadedLibrary((prev) => [
            {
              id: `upload-${Date.now()}-${i}`,
              title: file.name.replace(/\.[^/.]+$/, ""),
              category: "Uploads",
              url,
            },
            ...prev,
          ]);
        }
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      setSuccessToast(`Successfully uploaded ${uploadedUrls.length} image(s) from device!`);
      setTimeout(() => setSuccessToast(""), 3000);
    } catch (err: any) {
      setErrorMessage("Upload error: " + err.message);
    } finally {
      setIsUploadingImage(false);
      if (e.target) e.target.value = "";
    }
  };

  // Image Upload Handler
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await travelService.uploadImage(file, "packages/cover");
      if (url) {
        setCoverImage(url);
      }
    } catch (err: any) {
      setErrorMessage("Failed to upload image to Firebase Storage: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add Gallery Image
  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages([...galleryImages, newGalleryUrl.trim()]);
    setNewGalleryUrl("");
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
  };

  // Save / Publish Package
  const handleSave = async (targetStatus?: "published" | "draft" | "archived") => {
    setErrorMessage("");
    const chosenStatus = targetStatus || status;

    // Validate Mandatory Fields
    if (!title.trim()) {
      setErrorMessage("Package Title is required.");
      setActiveTab("basic");
      return;
    }
    if (!destinationName.trim()) {
      setErrorMessage("Destination Name is required.");
      setActiveTab("basic");
      return;
    }
    if (!shortDesc.trim()) {
      setErrorMessage("Short Description is required.");
      setActiveTab("basic");
      return;
    }
    if (days < 1 || nights < 0) {
      setErrorMessage("Valid duration days and nights are required.");
      setActiveTab("basic");
      return;
    }
    if (!coverImage.trim()) {
      setErrorMessage("Cover Image is required.");
      setActiveTab("media");
      return;
    }
    if (enableSeparatePricing) {
      if (coupleRegularSellingPrice <= 0) {
        setErrorMessage("Couple (2 Persons) Regular Price must be greater than ₹0.");
        setActiveTab("commercial");
        return;
      }
      if (familyRegularSellingPrice <= 0) {
        setErrorMessage("Family (More than 2 Persons) Regular Price must be greater than ₹0.");
        setActiveTab("commercial");
        return;
      }
    } else {
      if (regularSellingPrice <= 0) {
        setErrorMessage("Final Customer Selling Price must be greater than ₹0.");
        setActiveTab("commercial");
        return;
      }
    }

    // Financial Validation: prevent publishing if discount causes negative profit without exception
    if (enableDiscount && !allowNegativeProfitException) {
      if (enableSeparatePricing) {
        if (coupleProfitAfterDiscount < 0) {
          setErrorMessage(
            `Couple Discount leads to negative profit (-₹${Math.abs(coupleProfitAfterDiscount)}). Check "Approve Exception" in Customer Discount Configuration to proceed.`
          );
          setActiveTab("commercial");
          return;
        }
        if (familyProfitAfterDiscount < 0) {
          setErrorMessage(
            `Family Discount leads to negative profit (-₹${Math.abs(familyProfitAfterDiscount)}). Check "Approve Exception" in Customer Discount Configuration to proceed.`
          );
          setActiveTab("commercial");
          return;
        }
      } else {
        if (singleProfitAfterDiscount < 0) {
          setErrorMessage(
            `Customer Discount leads to negative profit (-₹${Math.abs(singleProfitAfterDiscount)}). Check "Approve Exception" in Customer Discount Configuration to proceed.`
          );
          setActiveTab("commercial");
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const pkgId = packageToEdit ? packageToEdit.id : `pkg-${Date.now()}`;
      const packageSlug = slug.trim()
        ? slug.trim()
        : `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

      const effectiveFinalPrice = enableSeparatePricing
        ? coupleFinalDiscountedPrice
        : finalDiscountedSellingPrice;

      const coupleConfig: PricingTierConfig = {
        supplier_base_price: Number(coupleSupplierBasePrice) || 0,
        commission_type: coupleCommissionType,
        commission_value: Number(coupleCommissionValue) || 0,
        additional_markup: Number(coupleAdditionalMarkup) || 0,
        taxes_or_fees: Number(coupleTaxesFees) || 0,
        discount_amount: Number(coupleDiscountAmount) || 0,
        manual_override: coupleManualPriceOverride,
        override_price: Number(coupleOverridePrice) || 0,
        final_price: coupleFinalDiscountedPrice,
        original_price: coupleRegularSellingPrice,
        estimated_profit: coupleProfitAfterDiscount,
        discount_enabled: enableDiscount,
        discount_type: effCoupleDiscType,
        discount_value: Number(effCoupleDiscVal) || 0,
        profit_after_discount: coupleProfitAfterDiscount,
      };

      const familyConfig: PricingTierConfig = {
        supplier_base_price: Number(familySupplierBasePrice) || 0,
        commission_type: familyCommissionType,
        commission_value: Number(familyCommissionValue) || 0,
        additional_markup: Number(familyAdditionalMarkup) || 0,
        taxes_or_fees: Number(familyTaxesFees) || 0,
        discount_amount: Number(familyDiscountAmount) || 0,
        manual_override: familyManualPriceOverride,
        override_price: Number(familyOverridePrice) || 0,
        final_price: familyFinalDiscountedPrice,
        original_price: familyRegularSellingPrice,
        estimated_profit: familyProfitAfterDiscount,
        discount_enabled: enableDiscount,
        discount_type: effFamilyDiscType,
        discount_value: Number(effFamilyDiscVal) || 0,
        profit_after_discount: familyProfitAfterDiscount,
      };

      const newPackage: TourPackage = {
        id: pkgId,
        title: title.trim(),
        slug: packageSlug,
        destination_id: `dest-${destinationName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        destination_name: destinationName.trim(),
        country: country.trim(),
        state_or_region: stateRegion.trim(),
        departure_city: departureCity.trim(),
        trip_type: tripScope,
        duration_days: Number(days),
        duration_nights: Number(nights),
        category,
        price: effectiveFinalPrice,
        currency: "INR",
        pricing_basis: pricingMode === "per_person" ? "per person" : "per package",
        pricing_display_mode: enableSeparatePricing ? "separate" : "single",
        couple_final_price: coupleFinalDiscountedPrice,
        family_final_price: familyFinalDiscountedPrice,
        original_price: regularSellingPrice,
        couple_original_price: coupleRegularSellingPrice,
        family_original_price: familyRegularSellingPrice,
        discount_enabled: enableDiscount,
        discount_type: discountType,
        discount_value: Number(discountValue) || 0,
        discount_start_date: discountStartDate || undefined,
        discount_end_date: discountEndDate || undefined,
        couple_pricing_configuration: enableSeparatePricing ? coupleConfig : undefined,
        family_pricing_configuration: enableSeparatePricing ? familyConfig : undefined,
        badge: badge !== "None" ? badge : undefined,
        short_description: shortDesc.trim(),
        description: fullDesc.trim() || shortDesc.trim(),
        full_description: fullDesc.trim(),
        highlights: highlights.filter((h) => h.trim().length > 0),
        best_time: bestTime.trim(),
        languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
        min_travelers: Number(minTravelers),
        max_travelers: Number(maxTravelers),
        recommended_age_group: ageGroup.trim(),
        cover_image: coverImage.trim(),
        cover_image_alt: coverImageAlt.trim() || title.trim(),
        gallery_images: galleryImages,
        itinerary,
        flights,
        hotels,
        transfers,
        activities_list: activitiesList,
        departure_dates: departureDates,
        inclusions: inclusions.filter((i) => i.trim().length > 0),
        exclusions: exclusions.filter((e) => e.trim().length > 0),
        policies: {
          cancellation: cancellationPolicy,
          refund: refundPolicy,
          payment_terms: paymentTerms,
          documents_required: documentsRequired,
          important_notes: importantNotes,
        },
        status: chosenStatus,
        featured: packageToEdit?.featured !== undefined ? packageToEdit.featured : true,
        schema_version: 2,
        created_at: packageToEdit?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Confidential Supplier Data (Separated & Protected)
      const commercialRecord: PackageCommercial = {
        package_id: pkgId,
        supplier_name: supplierName.trim(),
        supplier_package_id: supplierPackageId.trim(),
        supplier_package_url: supplierPackageUrl.trim(),
        supplier_booking_ref: supplierBookingRef.trim(),
        source_platform: sourcePlatform,
        supplier_base_price: Number(supplierBasePrice) || 0,
        currency: "INR",
        pricing_mode: pricingMode,
        commission_type: commissionType,
        commission_value: Number(commissionValue) || 0,
        additional_markup: Number(additionalMarkup) || 0,
        taxes_or_fees: Number(taxesFees) || 0,
        final_customer_price: effectiveFinalPrice,
        original_selling_price: regularSellingPrice,
        discount_amount: Number(discountAmount) || 0,
        discount_enabled: enableDiscount,
        discount_type: discountType,
        discount_value: Number(discountValue) || 0,
        discount_start_date: discountStartDate || undefined,
        discount_end_date: discountEndDate || undefined,
        estimated_profit: enableSeparatePricing
          ? Math.round((coupleProfitAfterDiscount + familyProfitAfterDiscount) / 2)
          : singleProfitAfterDiscount,
        profit_after_discount: enableSeparatePricing
          ? Math.round((coupleProfitAfterDiscount + familyProfitAfterDiscount) / 2)
          : singleProfitAfterDiscount,
        internal_notes: internalNotes.trim(),
        pricing_display_mode: enableSeparatePricing ? "separate" : "single",
        couple_pricing_configuration: coupleConfig,
        family_pricing_configuration: familyConfig,
        couple_final_price: coupleFinalDiscountedPrice,
        family_final_price: familyFinalDiscountedPrice,
        updated_at: new Date().toISOString(),
      };

      await travelService.savePackage(newPackage, commercialRecord);
      setSuccessToast(`Package successfully ${chosenStatus === "published" ? "published" : "saved as " + chosenStatus}!`);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      setErrorMessage("Error saving package: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-brand-charcoal to-slate-950 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md shadow-brand-red/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                {packageToEdit ? "Edit Tour Package" : "Create New Tour Package"}
                <span className="text-xs px-2.5 py-0.5 rounded-full font-sans font-medium uppercase tracking-wider bg-white/20 text-brand-softRed">
                  v2 Enterprise Architect
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Supplier Sourced Packages • Multi-day Itineraries • Real-time Profit Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave("draft")}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 border border-white/15"
            >
              <Save className="w-3.5 h-3.5" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-red hover:bg-red-700 text-white transition flex items-center gap-1.5 shadow-lg shadow-brand-red/30"
            >
              <Send className="w-3.5 h-3.5" />
              Publish Package
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION BANNERS */}
        {errorMessage && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 text-xs text-red-700 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            {errorMessage}
          </div>
        )}
        {successToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            {successToast}
          </div>
        )}

        {/* NAVIGATION TABS */}
        <div className="bg-slate-50 border-b border-gray-200 px-4 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 py-2">
          {[
            { id: "basic", label: "A. Basic Info", icon: Layers },
            { id: "commercial", label: "B. Supplier & Profit", icon: DollarSign, highlight: true },
            { id: "media", label: "C. Cover & Media", icon: ImageIcon },
            { id: "itinerary", label: "D. Itinerary Builder", icon: Calendar, badge: itinerary.length },
            { id: "flights", label: "E. Flights", icon: Plane, badge: flights.length },
            { id: "inclusions", label: "F. Inclusions", icon: CheckCircle2 },
            { id: "policies", label: "G. Policies", icon: ShieldAlert },
            { id: "departures", label: "H. Departure Dates", icon: Clock, badge: departureDates.length },
            { id: "preview", label: "I. Customer Preview", icon: Eye, highlightRed: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FormTab)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 border",
                  isActive
                    ? "bg-brand-red text-white border-brand-red shadow-sm"
                    : tab.highlight
                    ? "bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100"
                    : tab.highlightRed
                    ? "bg-rose-50 text-brand-red border-rose-200 hover:bg-rose-100"
                    : "bg-white text-slate-700 border-gray-200 hover:bg-gray-100"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold ml-0.5",
                      isActive ? "bg-white text-brand-red" : "bg-slate-200 text-slate-700"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS (SCROLLABLE BODY) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          {/* TAB A: BASIC INFORMATION */}
          {activeTab === "basic" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
                  <Layers className="w-5 h-5 text-brand-red" />
                  Package Identity & Scope
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700">Package Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Heavenly Kashmir — Srinagar, Gulmarg & Pahalgam Odyssey"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Package Slug (URL)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="heavenly-kashmir-srinagar-gulmarg"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs text-slate-600 bg-gray-50 focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Destination Name *</label>
                    <input
                      type="text"
                      value={destinationName}
                      onChange={(e) => setDestinationName(e.target.value)}
                      placeholder="Kashmir, Goa, Kerala, Thailand..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India / Thailand / Switzerland"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">State / Region</label>
                    <input
                      type="text"
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      placeholder="Jammu & Kashmir / North Goa"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Departure City</label>
                    <input
                      type="text"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                      placeholder="Ahmedabad / Mumbai / All India"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Trip Scope</label>
                    <select
                      value={tripScope}
                      onChange={(e) => setTripScope(e.target.value as TripType)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
                    >
                      <option value="domestic">Domestic India</option>
                      <option value="international">International</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Duration Days *</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={days}
                      onChange={(e) => setDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Duration Nights *</label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={nights}
                      onChange={(e) => setNights(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TripCategory)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
                    >
                      <option value="family">Family Vacations</option>
                      <option value="honeymoon">Honeymoon Special</option>
                      <option value="adventure">Adventure & Trekking</option>
                      <option value="luxury">Luxury & Premium</option>
                      <option value="budget">Budget Friendly</option>
                      <option value="group">Group Tours</option>
                      <option value="pilgrimage">Religious / Pilgrimage</option>
                      <option value="wildlife">Wildlife & Nature</option>
                      <option value="beach">Beach Holidays</option>
                      <option value="customized">Customized Tours</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Package Badge</label>
                    <select
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
                    >
                      <option value="Popular Choice">Popular Choice</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Trending">Trending</option>
                      <option value="Limited Offer">Limited Offer</option>
                      <option value="Recommended">Recommended</option>
                      <option value="Seasonal Offer">Seasonal Offer</option>
                      <option value="None">None</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Publishing Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white font-medium"
                    >
                      <option value="published">🟢 Published (Live on Site)</option>
                      <option value="draft">🟡 Draft (Admin Only)</option>
                      <option value="archived">⚪ Archived</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Best Time to Visit</label>
                    <input
                      type="text"
                      value={bestTime}
                      onChange={(e) => setBestTime(e.target.value)}
                      placeholder="e.g. October to March / Round the Year"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* DESCRIPTIONS & HIGHLIGHTS */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-3">
                  Narrative & Key Selling Highlights
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Short Summary (Cards & Previews) *</label>
                  <textarea
                    rows={2}
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    placeholder="Brief 1-2 sentence hook highlighting the ultimate charm of this package..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Full Description / Overview</label>
                  <textarea
                    rows={4}
                    value={fullDesc}
                    onChange={(e) => setFullDesc(e.target.value)}
                    placeholder="Comprehensive travel overview describing the journey, terrain, cultural immersion, and comfort provided..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>

                {/* Highlights List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Key Tour Highlights</label>
                  <div className="space-y-2">
                    {highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const copy = [...highlights];
                            copy[idx] = e.target.value;
                            setHighlights(copy);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newHighlight.trim()) {
                            setHighlights([...highlights, newHighlight.trim()]);
                            setNewHighlight("");
                          }
                        }
                      }}
                      placeholder="Add a new highlight (e.g. Sunset Shikara ride on Dal Lake)..."
                      className="flex-1 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newHighlight.trim()) {
                          setHighlights([...highlights, newHighlight.trim()]);
                          setNewHighlight("");
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB B: SUPPLIER & COMMERCIAL PRICING ENGINE */}
          {activeTab === "commercial" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-amber-950">Confidential Commercial & Supplier Privacy Zone</h4>
                  <p className="mt-0.5 text-amber-800">
                    All numbers in this section (Supplier Base Cost, Commission %, Markup, and Profit) are stored in a protected, restricted administrative collection. They are <strong>never</strong> exposed in public APIs, search engines, or customer-facing pages.
                  </p>
                </div>
              </div>

              {/* SUPPLIER SOURCING METRICS */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-brand-red" />
                    Supplier Sourcing Details
                  </span>
                  <span className="text-xs font-normal text-slate-500">
                    Sourced from MakeMyTrip / Direct Travel Suppliers
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Source Platform</label>
                    <select
                      value={sourcePlatform}
                      onChange={(e) => setSourcePlatform(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none bg-white font-medium"
                    >
                      <option value="MakeMyTrip">MakeMyTrip (MMT)</option>
                      <option value="Direct Supplier">Direct Hotel / Fleet Supplier</option>
                      <option value="Yatra">Yatra B2B</option>
                      <option value="EaseMyTrip">EaseMyTrip Partner</option>
                      <option value="Other">Other Wholesale Operator</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Supplier Name</label>
                    <input
                      type="text"
                      value={supplierName}
                      onChange={(e) => setSupplierName(e.target.value)}
                      placeholder="e.g. MMT Holidays / Kashmir Travels Pvt Ltd"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Supplier Package ID</label>
                    <input
                      type="text"
                      value={supplierPackageId}
                      onChange={(e) => setSupplierPackageId(e.target.value)}
                      placeholder="e.g. MMT-PKG-KSH-8821"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Supplier Package URL (Internal Reference)</label>
                    <input
                      type="text"
                      value={supplierPackageUrl}
                      onChange={(e) => setSupplierPackageUrl(e.target.value)}
                      placeholder="https://makemytrip.com/holidays/india/package?id=..."
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none text-slate-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Supplier Booking / Contract Reference</label>
                    <input
                      type="text"
                      value={supplierBookingRef}
                      onChange={(e) => setSupplierBookingRef(e.target.value)}
                      placeholder="e.g. CONTRACT-2026-VELORA-KSH"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none text-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* SEPARATE COUPLE & FAMILY PRICING TOGGLE */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-brand-red text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">
                        Enable Separate Couple & Family Pricing
                      </h4>
                      {enableSeparatePricing && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 uppercase tracking-wide">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure independent supplier costs, markups, commissions, and selling rates for Couples (2 Persons) vs Families (More than 2 Persons).
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={enableSeparatePricing}
                    onChange={(e) => setEnableSeparatePricing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                  <span className="ml-3 text-xs font-bold text-slate-800">
                    {enableSeparatePricing ? "Separate Pricing" : "Single Price"}
                  </span>
                </label>
              </div>

              {/* COMMERCIAL CALCULATION ENGINE - SINGLE PRICE MODE */}
              {!enableSeparatePricing && (
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                    <span>Commission & Markup Calculator (Single Price Mode)</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-600">Pricing Mode:</span>
                      <button
                        type="button"
                        onClick={() => setPricingMode("per_person")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition",
                          pricingMode === "per_person"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        Per Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingMode("per_package")}
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-xs font-bold transition",
                          pricingMode === "per_package"
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        Per Package
                      </button>
                    </div>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Supplier Base Cost (₹) *</label>
                      <input
                        type="number"
                        min={0}
                        value={supplierBasePrice}
                        onChange={(e) => setSupplierBasePrice(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Commission Type</label>
                      <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setCommissionType("percentage")}
                          className={cn(
                            "w-1/2 py-2 text-xs font-bold transition",
                            commissionType === "percentage" ? "bg-brand-red text-white" : "bg-white text-slate-700"
                          )}
                        >
                          Percentage (%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCommissionType("fixed")}
                          className={cn(
                            "w-1/2 py-2 text-xs font-bold transition",
                            commissionType === "fixed" ? "bg-brand-red text-white" : "bg-white text-slate-700"
                          )}
                        >
                          Fixed (₹)
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Commission Value ({commissionType === "percentage" ? "%" : "₹"})
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={commissionValue}
                        onChange={(e) => setCommissionValue(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Additional Markup (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={additionalMarkup}
                        onChange={(e) => setAdditionalMarkup(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Taxes & Facilitation Fees (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={taxesFees}
                        onChange={(e) => setTaxesFees(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Discount Amount (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={discountAmount}
                        onChange={(e) => setDiscountAmount(Number(e.target.value))}
                        placeholder="e.g. 1000"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-700">Manual Price Override?</label>
                        <input
                          type="checkbox"
                          checked={manualPriceOverride}
                          onChange={(e) => {
                            setManualPriceOverride(e.target.checked);
                            if (e.target.checked && overrideCustomerPrice === 0) {
                              setOverrideCustomerPrice(calculatedSellingPrice);
                            }
                          }}
                          className="rounded text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                        />
                      </div>
                      <input
                        type="number"
                        disabled={!manualPriceOverride}
                        value={manualPriceOverride ? overrideCustomerPrice : calculatedSellingPrice}
                        onChange={(e) => setOverrideCustomerPrice(Number(e.target.value))}
                        className={cn(
                          "w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none",
                          manualPriceOverride
                            ? "bg-yellow-50 border-yellow-300 text-yellow-900 focus:ring-2 focus:ring-yellow-500"
                            : "bg-gray-100 border-gray-200 text-slate-500 cursor-not-allowed"
                        )}
                      />
                    </div>
                  </div>

                  {/* LIVE CALCULATION METRICS CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                        Supplier Base Cost
                      </span>
                      <span className="text-lg font-heading font-extrabold text-slate-800">
                        {formatCurrency(supplierBasePrice)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                      <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wider block">
                        Commission Earned
                      </span>
                      <span className="text-lg font-heading font-extrabold text-blue-900">
                        +{formatCurrency(commissionEarned)}
                      </span>
                      <span className="text-[10px] text-blue-600 block">
                        ({commissionValue}{commissionType === "percentage" ? "%" : " fixed"})
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider block">
                        Estimated Profit
                      </span>
                      <span className="text-lg font-heading font-extrabold text-emerald-900">
                        {formatCurrency(estimatedProfit)}
                      </span>
                      <span className="text-[10px] text-emerald-600 block">
                        Margin: {Math.round((estimatedProfit / (finalSellingPrice || 1)) * 100)}%
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-brand-red to-red-700 text-white shadow-md">
                      <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider block">
                        Final Customer Price
                      </span>
                      <span className="text-xl font-heading font-extrabold text-white">
                        {formatCurrency(finalSellingPrice)}
                      </span>
                      <span className="text-[10px] text-white/80 block">
                        {pricingMode === "per_person" ? "Per Person" : "Total Package"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* COMMERCIAL CALCULATION ENGINE - SEPARATE COUPLE & FAMILY MODE */}
              {enableSeparatePricing && (
                <div className="space-y-6">
                  {/* 1. COUPLE PRICING (2 PERSONS) */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-rose-200 shadow-sm space-y-4">
                    <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            Couple Pricing (2 Persons)
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                              2 Adults Private Basis
                            </span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Dedicated 1 double/twin room & private sedan transfers. Calculated strictly per person.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
                        Selling: {formatCurrency(coupleFinalPrice)} / Person
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Couple Supplier Cost (₹) *</label>
                        <input
                          type="number"
                          min={0}
                          value={coupleSupplierBasePrice}
                          onChange={(e) => setCoupleSupplierBasePrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Commission Type</label>
                        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setCoupleCommissionType("percentage")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              coupleCommissionType === "percentage" ? "bg-rose-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCoupleCommissionType("fixed")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              coupleCommissionType === "fixed" ? "bg-rose-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Fixed (₹)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Commission ({coupleCommissionType === "percentage" ? "%" : "₹"})
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={coupleCommissionValue}
                          onChange={(e) => setCoupleCommissionValue(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Additional Markup (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={coupleAdditionalMarkup}
                          onChange={(e) => setCoupleAdditionalMarkup(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Taxes & Fees (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={coupleTaxesFees}
                          onChange={(e) => setCoupleTaxesFees(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Discount Amount (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={coupleDiscountAmount}
                          onChange={(e) => setCoupleDiscountAmount(Number(e.target.value))}
                          placeholder="e.g. 1000"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Manual Override?</label>
                          <input
                            type="checkbox"
                            checked={coupleManualPriceOverride}
                            onChange={(e) => {
                              setCoupleManualPriceOverride(e.target.checked);
                              if (e.target.checked && coupleOverridePrice === 0) {
                                setCoupleOverridePrice(coupleCalculatedSellingPrice);
                              }
                            }}
                            className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="number"
                          disabled={!coupleManualPriceOverride}
                          value={coupleManualPriceOverride ? coupleOverridePrice : coupleCalculatedSellingPrice}
                          onChange={(e) => setCoupleOverridePrice(Number(e.target.value))}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none",
                            coupleManualPriceOverride
                              ? "bg-rose-50 border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-500"
                              : "bg-gray-100 border-gray-200 text-slate-500 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>

                    {/* Couple KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                          Base Cost
                        </span>
                        <span className="text-base font-extrabold text-slate-800">
                          {formatCurrency(coupleSupplierBasePrice)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                        <span className="text-[10px] font-medium text-rose-700 uppercase tracking-wider block">
                          Commission
                        </span>
                        <span className="text-base font-extrabold text-rose-900">
                          +{formatCurrency(coupleCommissionEarned)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider block">
                          Profit Margin
                        </span>
                        <span className="text-base font-extrabold text-emerald-900">
                          {formatCurrency(coupleEstimatedProfit)}
                        </span>
                        <span className="text-[10px] text-emerald-600 block">
                          ({Math.round((coupleEstimatedProfit / (coupleFinalPrice || 1)) * 100)}%)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-br from-rose-600 to-pink-700 text-white shadow-md">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider block">
                          Couple Final Price
                        </span>
                        <span className="text-lg font-heading font-extrabold text-white">
                          {formatCurrency(coupleFinalPrice)}
                        </span>
                        <span className="text-[10px] text-white/80 block">Per Person</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. FAMILY PRICING (MORE THAN 2 PERSONS) */}
                  <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm space-y-4">
                    <div className="border-b border-blue-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            Family Pricing (More than 2 Persons)
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                              3+ Travelers Sharing
                            </span>
                          </h3>
                          <p className="text-xs text-slate-500">
                            Shared family rooms/extra beds & larger vehicle (SUV/Innova/Tempo). Calculated strictly per person.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                        Selling: {formatCurrency(familyFinalPrice)} / Person
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Family Supplier Cost (₹) *</label>
                        <input
                          type="number"
                          min={0}
                          value={familySupplierBasePrice}
                          onChange={(e) => setFamilySupplierBasePrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Commission Type</label>
                        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setFamilyCommissionType("percentage")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              familyCommissionType === "percentage" ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setFamilyCommissionType("fixed")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              familyCommissionType === "fixed" ? "bg-blue-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Fixed (₹)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Commission ({familyCommissionType === "percentage" ? "%" : "₹"})
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={familyCommissionValue}
                          onChange={(e) => setFamilyCommissionValue(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Additional Markup (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={familyAdditionalMarkup}
                          onChange={(e) => setFamilyAdditionalMarkup(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Taxes & Fees (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={familyTaxesFees}
                          onChange={(e) => setFamilyTaxesFees(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Discount Amount (₹)</label>
                        <input
                          type="number"
                          min={0}
                          value={familyDiscountAmount}
                          onChange={(e) => setFamilyDiscountAmount(Number(e.target.value))}
                          placeholder="e.g. 1000"
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Manual Override?</label>
                          <input
                            type="checkbox"
                            checked={familyManualPriceOverride}
                            onChange={(e) => {
                              setFamilyManualPriceOverride(e.target.checked);
                              if (e.target.checked && familyOverridePrice === 0) {
                                setFamilyOverridePrice(familyCalculatedSellingPrice);
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="number"
                          disabled={!familyManualPriceOverride}
                          value={familyManualPriceOverride ? familyOverridePrice : familyCalculatedSellingPrice}
                          onChange={(e) => setFamilyOverridePrice(Number(e.target.value))}
                          className={cn(
                            "w-full px-3 py-2 rounded-xl border text-sm font-bold focus:outline-none",
                            familyManualPriceOverride
                              ? "bg-blue-50 border-blue-300 text-blue-900 focus:ring-2 focus:ring-blue-500"
                              : "bg-gray-100 border-gray-200 text-slate-500 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>

                    {/* Family KPI Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                          Base Cost
                        </span>
                        <span className="text-base font-extrabold text-slate-800">
                          {formatCurrency(familySupplierBasePrice)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                        <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wider block">
                          Commission
                        </span>
                        <span className="text-base font-extrabold text-blue-900">
                          +{formatCurrency(familyCommissionEarned)}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider block">
                          Profit Margin
                        </span>
                        <span className="text-base font-extrabold text-emerald-900">
                          {formatCurrency(familyEstimatedProfit)}
                        </span>
                        <span className="text-[10px] text-emerald-600 block">
                          ({Math.round((familyEstimatedProfit / (familyFinalPrice || 1)) * 100)}%)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider block">
                          Family Final Price
                        </span>
                        <span className="text-lg font-heading font-extrabold text-white">
                          {formatCurrency(familyFinalPrice)}
                        </span>
                        <span className="text-[10px] text-white/80 block">Per Person</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation Alert if prices match */}
                  {coupleFinalPrice === familyFinalPrice && coupleFinalPrice > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Info className="w-5 h-5 text-amber-700 shrink-0" />
                        <div>
                          <p className="font-bold text-amber-950">
                            Notice: Couple and Family per-person prices are identical ({formatCurrency(coupleFinalPrice)} / person).
                          </p>
                          <p className="text-amber-800 text-[11px] mt-0.5">
                            If this package does not have price variation by party size, you can switch back to single price mode.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnableSeparatePricing(false)}
                        className="px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-xs whitespace-nowrap transition self-start sm:self-auto"
                      >
                        Switch to Single Price
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION: CUSTOMER DISCOUNT CONFIGURATION */}
              <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm space-y-5">
                <div className="border-b border-emerald-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold shadow-sm">
                      <BadgePercent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          Customer Discount Configuration
                        </h3>
                        {enableDiscount ? (
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
                              discountStatus === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : discountStatus === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            )}
                          >
                            {discountStatus === "active"
                              ? "🟢 Active Offer (Live)"
                              : discountStatus === "scheduled"
                              ? "🟡 Scheduled Offer"
                              : "🔴 Expired Offer"}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Provide special promotional discounts, strike-through original prices, and promotional savings badges on public listings.
                      </p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={enableDiscount}
                      onChange={(e) => setEnableDiscount(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    <span className="ml-3 text-xs font-bold text-slate-800">
                      {enableDiscount ? "Discount Active" : "No Discount"}
                    </span>
                  </label>
                </div>

                {enableDiscount && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    {/* DISCOUNT PARAMETERS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Discount Type</label>
                        <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setDiscountType("percentage")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              discountType === "percentage" ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Percentage (%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setDiscountType("fixed")}
                            className={cn(
                              "w-1/2 py-2 text-xs font-bold transition",
                              discountType === "fixed" ? "bg-emerald-600 text-white" : "bg-white text-slate-700"
                            )}
                          >
                            Fixed (₹)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">
                          Discount Value ({discountType === "percentage" ? "%" : "₹"}) *
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={discountType === "percentage" ? 90 : regularSellingPrice - 1}
                          value={discountValue}
                          onChange={(e) => setDiscountValue(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Offer Start Date (Optional)</label>
                        <input
                          type="date"
                          value={discountStartDate}
                          onChange={(e) => setDiscountStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700">Offer End Date (Optional)</label>
                        <input
                          type="date"
                          value={discountEndDate}
                          onChange={(e) => setDiscountEndDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* SEPARATE PRICING OPTIONAL CATEGORY OVERRIDE */}
                    {enableSeparatePricing && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">
                            Apply identical discount to both Couple and Family?
                          </span>
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={sameDiscountForBoth}
                              onChange={(e) => setSameDiscountForBoth(e.target.checked)}
                              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                            />
                            <span>Yes, apply identical discount</span>
                          </label>
                        </div>

                        {!sameDiscountForBoth && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                            {/* Couple Custom Discount */}
                            <div className="space-y-2 p-3 bg-white rounded-xl border border-rose-200">
                              <span className="text-xs font-bold text-rose-800 block">Couple Specific Discount</span>
                              <div className="flex gap-2">
                                <select
                                  value={coupleDiscountType}
                                  onChange={(e) => setCoupleDiscountType(e.target.value as any)}
                                  className="px-2 py-1.5 rounded-lg border border-gray-300 text-xs"
                                >
                                  <option value="percentage">% Off</option>
                                  <option value="fixed">₹ Off</option>
                                </select>
                                <input
                                  type="number"
                                  min={1}
                                  value={coupleDiscountVal}
                                  onChange={(e) => setCoupleDiscountVal(Number(e.target.value))}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                                />
                              </div>
                            </div>

                            {/* Family Custom Discount */}
                            <div className="space-y-2 p-3 bg-white rounded-xl border border-blue-200">
                              <span className="text-xs font-bold text-blue-800 block">Family Specific Discount</span>
                              <div className="flex gap-2">
                                <select
                                  value={familyDiscountType}
                                  onChange={(e) => setFamilyDiscountType(e.target.value as any)}
                                  className="px-2 py-1.5 rounded-lg border border-gray-300 text-xs"
                                >
                                  <option value="percentage">% Off</option>
                                  <option value="fixed">₹ Off</option>
                                </select>
                                <input
                                  type="number"
                                  min={1}
                                  value={familyDiscountVal}
                                  onChange={(e) => setFamilyDiscountVal(Number(e.target.value))}
                                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* LIVE DISCOUNT PREVIEW TILES */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                          Original Selling Price
                        </span>
                        <span className="text-base font-extrabold text-slate-600 line-through">
                          {formatCurrency(enableSeparatePricing ? coupleRegularSellingPrice : regularSellingPrice)}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Regular Base Rate</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                        <span className="text-[10px] font-medium text-emerald-800 uppercase tracking-wider block">
                          Customer Savings
                        </span>
                        <span className="text-base font-extrabold text-emerald-700">
                          {discountType === "percentage"
                            ? `${discountValue}% OFF`
                            : `Save ${formatCurrency(singleDiscountAmount)}`}
                        </span>
                        <span className="text-[10px] text-emerald-600 block mt-0.5">
                          Save {formatCurrency(enableSeparatePricing ? coupleDiscountAmountCalc : singleDiscountAmount)} / Person
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md">
                        <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider block">
                          Final Discounted Price
                        </span>
                        <span className="text-xl font-heading font-extrabold text-white">
                          {formatCurrency(enableSeparatePricing ? coupleFinalDiscountedPrice : finalDiscountedSellingPrice)}
                        </span>
                        <span className="text-[10px] text-white/80 block mt-0.5">
                          {enableSeparatePricing ? "Couple / Person" : "Final per Person"}
                        </span>
                      </div>

                      <div
                        className={cn(
                          "p-3.5 rounded-xl border",
                          (enableSeparatePricing ? coupleProfitAfterDiscount : singleProfitAfterDiscount) < 0
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-teal-50 border-teal-200 text-teal-900"
                        )}
                      >
                        <span className="text-[10px] font-medium uppercase tracking-wider block">
                          Profit After Discount
                        </span>
                        <span className="text-base font-extrabold">
                          {formatCurrency(enableSeparatePricing ? coupleProfitAfterDiscount : singleProfitAfterDiscount)}
                        </span>
                        <span className="text-[10px] block mt-0.5">
                          Margin:{" "}
                          {enableSeparatePricing
                            ? Math.round((coupleProfitAfterDiscount / (coupleFinalDiscountedPrice || 1)) * 100)
                            : Math.round((singleProfitAfterDiscount / (finalDiscountedSellingPrice || 1)) * 100)}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Negative Profit Warning */}
                    {(enableSeparatePricing
                      ? coupleProfitAfterDiscount < 0 || familyProfitAfterDiscount < 0
                      : singleProfitAfterDiscount < 0) && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                          <div>
                            <p className="font-bold">Loss Warning: Discount exceeds profit margin!</p>
                            <p className="text-[11px] text-red-700">
                              Selling price with discount is lower than your supplier cost.
                            </p>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-red-800 bg-white/70 px-3 py-1.5 rounded-lg border border-red-200">
                          <input
                            type="checkbox"
                            checked={allowNegativeProfitException}
                            onChange={(e) => setAllowNegativeProfitException(e.target.checked)}
                            className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                          />
                          <span>Approve Exception</span>
                        </label>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-1">
                <label className="text-xs font-bold text-slate-700">Internal Administrator Notes</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Private notes: special supplier booking contact, commission payment cycle, cancellation terms from supplier..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB C: MEDIA & GALLERY */}
          {activeTab === "media" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* MAIN COVER IMAGE */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-brand-red" />
                      Main Cover Image *
                    </h3>
                    <p className="text-xs text-slate-500">
                      The primary banner photo displayed on package cards, search results, and hero section.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-normal">
                    Recommended 16:9 ratio, min 1200×800px
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3.5">
                    {/* Quick Selection Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => openMediaLibrary("cover")}
                        className="py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Layers className="w-4 h-4 text-emerald-400" />
                        Choose from Library
                      </button>

                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="py-2.5 px-3.5 rounded-xl border-2 border-dashed border-gray-300 hover:border-brand-red text-slate-700 hover:text-brand-red text-xs font-bold transition flex items-center justify-center gap-2 bg-gray-50"
                      >
                        <Upload className="w-4 h-4" />
                        {isUploadingImage ? "Uploading..." : "Upload from Device"}
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Cover Image URL</label>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-... or custom URL"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-slate-700 focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Alt Text / SEO Description</label>
                      <input
                        type="text"
                        value={coverImageAlt}
                        onChange={(e) => setCoverImageAlt(e.target.value)}
                        placeholder="e.g. Scenic Dal Lake Shikara ride in Srinagar Kashmir"
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-slate-700 focus:ring-2 focus:ring-brand-red focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm flex items-center justify-center group">
                    {coverImage ? (
                      <>
                        <Image
                          src={coverImage}
                          alt="Cover Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openMediaLibrary("cover")}
                            className="px-3 py-1.5 rounded-xl bg-white/95 text-slate-900 text-xs font-bold shadow-md hover:bg-white flex items-center gap-1.5"
                          >
                            <Layers className="w-3.5 h-3.5 text-brand-red" />
                            Change Photo
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-slate-400 p-4">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-xs">No cover image specified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* GALLERY IMAGES */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-brand-red" />
                      Photo Gallery
                    </h3>
                    <p className="text-xs text-slate-500">
                      Showcase hotels, sightseeing spots, vehicles, and activities across this tour.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openMediaLibrary("gallery")}
                      className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      Choose from Library
                    </button>

                    <input
                      type="file"
                      ref={galleryFileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleGalleryMultiUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="px-3 py-2 rounded-xl border border-gray-300 hover:border-brand-red text-slate-700 hover:text-brand-red text-xs font-bold transition flex items-center gap-1.5 bg-gray-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isUploadingImage ? "Uploading..." : "Upload from Device"}
                    </button>

                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold whitespace-nowrap">
                      {galleryImages.length} images
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addGalleryImage();
                      }
                    }}
                    placeholder="Or paste image URL (Unsplash, Firebase, CDN)..."
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add URL
                  </button>
                </div>

                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 shadow-sm">
                        <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" unoptimized />
                        {img === coverImage && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-brand-red text-white text-[9px] font-bold z-10 shadow">
                            Main Cover
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 p-1">
                          {img !== coverImage && (
                            <button
                              type="button"
                              title="Set as Main Cover Photo"
                              onClick={() => setAsCoverFromGallery(img)}
                              className="p-1.5 rounded-lg bg-white text-slate-900 hover:bg-brand-red hover:text-white transition shadow"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Remove photo"
                            onClick={() => removeGalleryImage(idx)}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-slate-400 bg-gray-50/50">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1.5 opacity-40 text-slate-400" />
                    <p className="text-xs font-medium text-slate-600">No extra gallery photos added yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click <strong>Choose from Library</strong> or <strong>Upload from Device</strong> above to add photos.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB D: DAY-WISE ITINERARY BUILDER */}
          {activeTab === "itinerary" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-red" />
                    Day-Wise Travel Itinerary
                  </h3>
                  <p className="text-xs text-slate-500">
                    Construct a seamless day-by-day journey with accommodation, transfers, activities, and dining.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Next Day
                </button>
              </div>

              {itinerary.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-3">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">No itinerary days created yet</p>
                  <button
                    type="button"
                    onClick={addItineraryDay}
                    className="px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-red-700 transition"
                  >
                    Create Day 1
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {itinerary.map((dayItem, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4 relative"
                    >
                      {/* Day Header Bar */}
                      <div className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-brand-red text-white font-heading font-extrabold text-sm flex items-center justify-center shadow-sm">
                            {dayItem.day}
                          </span>
                          <div>
                            <input
                              type="text"
                              value={dayItem.title}
                              onChange={(e) => updateItineraryDay(index, { title: e.target.value })}
                              placeholder={`Day ${dayItem.day} Title...`}
                              className="font-bold text-slate-900 text-sm sm:text-base border-b border-transparent hover:border-gray-300 focus:border-brand-red focus:outline-none px-1"
                            />
                          </div>
                        </div>

                        {/* Day Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveItineraryDay(index, "up")}
                            title="Move Up"
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={index === itinerary.length - 1}
                            onClick={() => moveItineraryDay(index, "down")}
                            title="Move Down"
                            className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicateItineraryDay(index)}
                            title="Duplicate Day"
                            className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteItineraryDay(index)}
                            title="Delete Day"
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 ml-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Locations & Travel Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Starting Location</label>
                          <input
                            type="text"
                            value={dayItem.start_location || ""}
                            onChange={(e) => updateItineraryDay(index, { start_location: e.target.value })}
                            placeholder="e.g. Srinagar"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Ending Location</label>
                          <input
                            type="text"
                            value={dayItem.end_location || ""}
                            onChange={(e) => updateItineraryDay(index, { end_location: e.target.value })}
                            placeholder="e.g. Sonmarg / Gulmarg"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Estimated Travel Duration</label>
                          <input
                            type="text"
                            value={dayItem.travel_duration || ""}
                            onChange={(e) => updateItineraryDay(index, { travel_duration: e.target.value })}
                            placeholder="e.g. 2.5 Hours drive"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600">Meals Included</label>
                          <div className="flex items-center gap-1.5 pt-1">
                            {["Breakfast", "Lunch", "Dinner"].map((meal) => {
                              const isChecked = (dayItem.meals_included || []).includes(meal);
                              return (
                                <button
                                  type="button"
                                  key={meal}
                                  onClick={() => {
                                    const curr = dayItem.meals_included || [];
                                    const next = isChecked
                                      ? curr.filter((m) => m !== meal)
                                      : [...curr, meal];
                                    updateItineraryDay(index, { meals_included: next });
                                  }}
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold border transition",
                                    isChecked
                                      ? "bg-emerald-600 text-white border-emerald-600"
                                      : "bg-gray-100 text-slate-600 border-gray-200 hover:bg-gray-200"
                                  )}
                                >
                                  {meal[0]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Day Detailed Description */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Day Description & Flow</label>
                        <textarea
                          rows={2}
                          value={dayItem.description || ""}
                          onChange={(e) => updateItineraryDay(index, { description: e.target.value })}
                          placeholder="Describe the day's highlights, scenic road route, stops, photography points, and evening schedule..."
                          className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                        />
                      </div>

                      {/* Hotel & Transfers for the Day */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <Hotel className="w-3.5 h-3.5 text-blue-600" />
                            Overnight Hotel & Room
                          </label>
                          <input
                            type="text"
                            value={dayItem.hotel_name || ""}
                            onChange={(e) => updateItineraryDay(index, { hotel_name: e.target.value })}
                            placeholder="e.g. Hotel Royal Milad (Super Deluxe AC)"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <Car className="w-3.5 h-3.5 text-emerald-600" />
                            Transfers / Vehicle
                          </label>
                          <input
                            type="text"
                            value={dayItem.transfers || ""}
                            onChange={(e) => updateItineraryDay(index, { transfers: e.target.value })}
                            placeholder="e.g. Private AC Sedan Pickup & Excursions"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-amber-600" />
                            Activities & Sightseeing
                          </label>
                          <input
                            type="text"
                            value={dayItem.activities || ""}
                            onChange={(e) => updateItineraryDay(index, { activities: e.target.value })}
                            placeholder="e.g. Aru Valley, Betaab Valley, Cricket Bat Factory"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB E: FLIGHT MANAGEMENT */}
          {activeTab === "flights" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-brand-red" />
                    Flight Segments & Schedules
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add inbound, outbound, or connecting flight segments with airline, terminal, and baggage details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newFlight: PackageFlight = {
                      id: `flt-${Date.now()}`,
                      airline_name: "IndiGo",
                      flight_number: "6E-512",
                      departure_city: departureCity.split("/")[0].trim() || "Ahmedabad",
                      arrival_city: destinationName,
                      departure_airport: "AMD",
                      arrival_airport: "SXR",
                      departure_time: "08:30 AM",
                      arrival_time: "11:15 AM",
                      flight_duration: "2h 45m",
                      flight_type: "direct",
                      cabin_baggage: "7 Kg",
                      checkin_baggage: "15 Kg",
                    };
                    setFlights([...flights, newFlight]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Flight Segment
                </button>
              </div>

              {flights.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-2">
                  <Plane className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No flight segments attached. (Optional: Land packages without flights can leave this empty).
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flights.map((flight, idx) => (
                    <div key={flight.id} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b pb-2.5">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <Plane className="w-4 h-4 text-brand-red" />
                          Flight Segment #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFlights(flights.filter((f) => f.id !== flight.id))}
                          className="text-xs text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Airline Name</label>
                          <input
                            type="text"
                            value={flight.airline_name}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].airline_name = e.target.value;
                              setFlights(copy);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Flight Number</label>
                          <input
                            type="text"
                            value={flight.flight_number}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].flight_number = e.target.value;
                              setFlights(copy);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Route (From → To)</label>
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={flight.departure_city}
                              onChange={(e) => {
                                const copy = [...flights];
                                copy[idx].departure_city = e.target.value;
                                setFlights(copy);
                              }}
                              placeholder="From"
                              className="w-1/2 px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                            />
                            <span className="text-slate-400 text-xs">→</span>
                            <input
                              type="text"
                              value={flight.arrival_city}
                              onChange={(e) => {
                                const copy = [...flights];
                                copy[idx].arrival_city = e.target.value;
                                setFlights(copy);
                              }}
                              placeholder="To"
                              className="w-1/2 px-2 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Flight Type</label>
                          <select
                            value={flight.flight_type}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].flight_type = e.target.value as any;
                              setFlights(copy);
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
                          >
                            <option value="direct">Direct Flight</option>
                            <option value="connecting">Connecting Flight</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Departure Time</label>
                          <input
                            type="text"
                            value={flight.departure_time}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].departure_time = e.target.value;
                              setFlights(copy);
                            }}
                            placeholder="08:30 AM"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Arrival Time</label>
                          <input
                            type="text"
                            value={flight.arrival_time}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].arrival_time = e.target.value;
                              setFlights(copy);
                            }}
                            placeholder="11:15 AM"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Baggage (Cabin / Check-in)</label>
                          <input
                            type="text"
                            value={`${flight.cabin_baggage || "7kg"} / ${flight.checkin_baggage || "15kg"}`}
                            onChange={(e) => {
                              const parts = e.target.value.split("/");
                              const copy = [...flights];
                              copy[idx].cabin_baggage = parts[0]?.trim();
                              copy[idx].checkin_baggage = parts[1]?.trim();
                              setFlights(copy);
                            }}
                            placeholder="7 Kg / 15 Kg"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Connecting / Layover Info</label>
                          <input
                            type="text"
                            value={flight.connecting_info || ""}
                            onChange={(e) => {
                              const copy = [...flights];
                              copy[idx].connecting_info = e.target.value;
                              setFlights(copy);
                            }}
                            placeholder="e.g. 2h 15m Layover in Delhi"
                            className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB F: INCLUSIONS & EXCLUSIONS */}
          {activeTab === "inclusions" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* INCLUSIONS */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                      Package Inclusions
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      {inclusions.length} items
                    </span>
                  </h3>

                  <div className="space-y-2">
                    {inclusions.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const copy = [...inclusions];
                            copy[idx] = e.target.value;
                            setInclusions(copy);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setInclusions(inclusions.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newInclusion}
                      onChange={(e) => setNewInclusion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newInclusion.trim()) {
                            setInclusions([...inclusions, newInclusion.trim()]);
                            setNewInclusion("");
                          }
                        }
                      }}
                      placeholder="Add an included service..."
                      className="flex-1 px-3 py-2 rounded-xl border border-dashed border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newInclusion.trim()) {
                          setInclusions([...inclusions, newInclusion.trim()]);
                          setNewInclusion("");
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* EXCLUSIONS */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2 text-red-700">
                      <X className="w-5 h-5" />
                      Package Exclusions
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      {exclusions.length} items
                    </span>
                  </h3>

                  <div className="space-y-2">
                    {exclusions.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-600 shrink-0" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const copy = [...exclusions];
                            copy[idx] = e.target.value;
                            setExclusions(copy);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setExclusions(exclusions.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newExclusion}
                      onChange={(e) => setNewExclusion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newExclusion.trim()) {
                            setExclusions([...exclusions, newExclusion.trim()]);
                            setNewExclusion("");
                          }
                        }
                      }}
                      placeholder="Add an excluded item..."
                      className="flex-1 px-3 py-2 rounded-xl border border-dashed border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newExclusion.trim()) {
                          setExclusions([...exclusions, newExclusion.trim()]);
                          setNewExclusion("");
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-red-700 text-white text-xs font-bold hover:bg-red-800 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB J: POLICIES */}
          {activeTab === "policies" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-brand-red" />
                  Booking Policies & Guidelines
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Cancellation Policy</label>
                    <textarea
                      rows={3}
                      value={cancellationPolicy}
                      onChange={(e) => setCancellationPolicy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Refund Policy</label>
                    <textarea
                      rows={3}
                      value={refundPolicy}
                      onChange={(e) => setRefundPolicy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Payment Terms</label>
                    <textarea
                      rows={3}
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Mandatory Documents Required</label>
                    <textarea
                      rows={3}
                      value={documentsRequired}
                      onChange={(e) => setDocumentsRequired(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-bold text-slate-700">Important General Instructions & Notes</label>
                  <textarea
                    rows={3}
                    value={importantNotes}
                    onChange={(e) => setImportantNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB K: DEPARTURE DATES & AVAILABILITY */}
          {activeTab === "departures" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-red" />
                    Fixed Group & Seasonal Departure Dates
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define scheduled batch dates, seat capacity, child discounts, and availability badges.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const depDate = new Date(today.getTime() + 15 * 86400000).toISOString().split("T")[0];
                    const retDate = new Date(today.getTime() + (15 + days) * 86400000).toISOString().split("T")[0];
                    const newDep: PackageDepartureDate = {
                      id: `dep-${Date.now()}`,
                      departure_date: depDate,
                      return_date: retDate,
                      available_seats: 12,
                      total_capacity: 20,
                      adult_price: finalSellingPrice,
                      child_price: Math.round(finalSellingPrice * 0.75),
                      infant_price: 2500,
                      status: "available",
                      special_offer: "Early Bird 5% Off",
                    };
                    setDepartureDates([...departureDates, newDep]);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Departure Date
                </button>
              </div>

              {departureDates.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300 p-8 space-y-2">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No fixed departure dates defined. This package will show as <em>Customizable On-Demand</em> on any date.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {departureDates.map((dep, idx) => (
                    <div key={dep.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center font-bold text-slate-800">
                          <span className="text-[10px] uppercase text-brand-red">Batch</span>
                          <span className="text-sm font-extrabold">#{idx + 1}</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <span>{dep.departure_date}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dep.return_date}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>Seats: {dep.available_seats} / {dep.total_capacity}</span>
                            <span>•</span>
                            <span className="font-semibold text-emerald-700">₹{dep.adult_price.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={dep.status}
                          onChange={(e) => {
                            const copy = [...departureDates];
                            copy[idx].status = e.target.value as any;
                            setDepartureDates(copy);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold bg-white"
                        >
                          <option value="available">🟢 Available</option>
                          <option value="limited">🟡 Limited Seats</option>
                          <option value="sold_out">🔴 Sold Out</option>
                          <option value="on_request">⚪ On Request</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => setDepartureDates(departureDates.filter((d) => d.id !== dep.id))}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB L: CUSTOMER LIVE PREVIEW */}
          {activeTab === "preview" && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Customer View Live Preview</h4>
                  <p className="text-xs text-slate-300">
                    This is how customers will experience your tour package on YaadgaarSafar.com.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSave("draft")}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave("published")}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-brand-red hover:bg-red-700 text-white shadow-md shadow-brand-red/40"
                  >
                    Publish Now
                  </button>
                </div>
              </div>

              {/* CARD HERO PREVIEW */}
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
                <div className="relative h-80 sm:h-96 w-full">
                  <Image src={coverImage} alt={title} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Top Tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {tripScope === "international" ? "International" : "Domestic India"}
                    </span>
                    {badge && badge !== "None" && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-red text-white shadow-md">
                        {badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Hero Info */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                      <MapPin className="w-4 h-4 text-brand-softRed" />
                      <span>{destinationName}, {country}</span>
                      <span>•</span>
                      <Clock className="w-4 h-4 text-brand-softRed" />
                      <span>{days} Days / {nights} Nights</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white">
                      {title || "Untitled Package"}
                    </h1>

                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-2xl">
                      {shortDesc || "No short description provided yet."}
                    </p>

                    {enableSeparatePricing ? (
                      <div className="pt-2 flex flex-wrap gap-3 items-center">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-rose-400/40 relative">
                          {enableDiscount && (
                            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] shadow-sm uppercase tracking-wider">
                              {effCoupleDiscType === "percentage" ? `${effCoupleDiscVal}% OFF` : `Save ${formatCurrency(coupleDiscountAmountCalc)}`}
                            </span>
                          )}
                          <span className="text-[10px] text-rose-300 font-bold block uppercase tracking-wider">
                            Couple (2 Persons)
                          </span>
                          <div className="flex items-baseline gap-2">
                            {enableDiscount && (
                              <span className="text-sm font-semibold text-white/50 line-through">
                                {formatCurrency(coupleRegularSellingPrice)}
                              </span>
                            )}
                            <span className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                              {formatCurrency(coupleFinalDiscountedPrice)}
                            </span>
                            <span className="text-xs text-white/70">/ Person</span>
                          </div>
                          {enableDiscount && (
                            <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
                              You Save {formatCurrency(coupleDiscountAmountCalc)}!
                            </span>
                          )}
                        </div>

                        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-blue-400/40 relative">
                          {enableDiscount && (
                            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-[10px] shadow-sm uppercase tracking-wider">
                              {effFamilyDiscType === "percentage" ? `${effFamilyDiscVal}% OFF` : `Save ${formatCurrency(familyDiscountAmountCalc)}`}
                            </span>
                          )}
                          <span className="text-[10px] text-blue-300 font-bold block uppercase tracking-wider">
                            Family (More than 2 Persons)
                          </span>
                          <div className="flex items-baseline gap-2">
                            {enableDiscount && (
                              <span className="text-sm font-semibold text-white/50 line-through">
                                {formatCurrency(familyRegularSellingPrice)}
                              </span>
                            )}
                            <span className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                              {formatCurrency(familyFinalDiscountedPrice)}
                            </span>
                            <span className="text-xs text-white/70">/ Person</span>
                          </div>
                          {enableDiscount && (
                            <span className="text-[10px] text-emerald-300 font-semibold block mt-0.5">
                              You Save {formatCurrency(familyDiscountAmountCalc)}!
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="pt-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {enableDiscount && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-sm uppercase tracking-wider">
                              {discountType === "percentage" ? `${discountValue}% OFF` : `Save ${formatCurrency(singleDiscountAmount)}`}
                            </span>
                          )}
                          {enableDiscount && discountEndDate && (
                            <span className="text-[10px] text-amber-300 font-medium bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-400/30">
                              Offer valid until {discountEndDate}
                            </span>
                          )}
                        </div>

                        <div className="flex items-baseline gap-3">
                          {enableDiscount && (
                            <span className="text-lg sm:text-xl font-bold text-white/50 line-through">
                              {formatCurrency(regularSellingPrice)}
                            </span>
                          )}
                          <span className="text-2xl sm:text-4xl font-heading font-extrabold text-white">
                            {formatCurrency(finalDiscountedSellingPrice)}
                          </span>
                          <span className="text-xs text-white/70">
                            {pricingMode === "per_person" ? "per person (inclusive of all taxes)" : "per package"}
                          </span>
                        </div>

                        {enableDiscount && (
                          <span className="text-xs text-emerald-300 font-bold">
                            You Save {formatCurrency(singleDiscountAmount)}!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* HIGHLIGHTS & ITINERARY SUMMARY */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Highlights Grid */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-brand-red" />
                      Package Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day-Wise Summary Accordion Preview */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-brand-red" />
                      Day-Wise Itinerary Preview ({itinerary.length} Days)
                    </h3>
                    <div className="space-y-3">
                      {itinerary.map((d) => (
                        <div key={d.day} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-brand-red text-white flex items-center justify-center text-[11px] font-bold">
                                D{d.day}
                              </span>
                              {d.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {d.travel_duration || "Scenic Journey"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 pl-8">{d.description}</p>
                          <div className="pl-8 flex flex-wrap gap-2 pt-1 text-[11px] text-slate-500">
                            {d.hotel_name && (
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 flex items-center gap-1">
                                <Hotel className="w-3 h-3" /> {d.hotel_name}
                              </span>
                            )}
                            {d.transfers && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 flex items-center gap-1">
                                <Car className="w-3 h-3" /> {d.transfers}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inclusions & Exclusions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <h4 className="font-bold text-xs text-emerald-900 mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        What's Included
                      </h4>
                      <ul className="space-y-1 text-xs text-emerald-800">
                        {inclusions.slice(0, 5).map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200">
                      <h4 className="font-bold text-xs text-red-900 mb-2 flex items-center gap-1.5">
                        <X className="w-4 h-4 text-red-600" />
                        What's Excluded
                      </h4>
                      <ul className="space-y-1 text-xs text-red-800">
                        {exclusions.slice(0, 5).map((exc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <X className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                            <span>{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Status:{" "}
              <strong className={status === "published" ? "text-emerald-700" : "text-amber-700"}>
                {status.toUpperCase()}
              </strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500">
              {enableSeparatePricing ? (
                <>
                  Couple:{" "}
                  {enableDiscount && (
                    <span className="line-through text-slate-400 mr-1">
                      {formatCurrency(coupleRegularSellingPrice)}
                    </span>
                  )}
                  <strong className="text-rose-700">{formatCurrency(coupleFinalDiscountedPrice)}</strong>
                  <span className="text-slate-300 mx-1.5">•</span>
                  Family:{" "}
                  {enableDiscount && (
                    <span className="line-through text-slate-400 mr-1">
                      {formatCurrency(familyRegularSellingPrice)}
                    </span>
                  )}
                  <strong className="text-blue-700">{formatCurrency(familyFinalDiscountedPrice)}</strong>
                </>
              ) : (
                <>
                  Selling Price:{" "}
                  {enableDiscount && (
                    <span className="line-through text-slate-400 mr-1">
                      {formatCurrency(regularSellingPrice)}
                    </span>
                  )}
                  <strong className="text-slate-900">{formatCurrency(finalDiscountedSellingPrice)}</strong>
                </>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("draft")}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
            >
              Save as Draft
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave("published")}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-brand-red hover:bg-red-700 text-white transition shadow-md shadow-brand-red/30 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Saving..." : "Publish Package"}
            </button>
          </div>
        </div>
      </div>

      {/* MEDIA & IMAGE LIBRARY MODAL OVERLAY */}
      {isMediaLibraryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center text-white shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Media & Image Library</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 text-white font-semibold">
                      Target: {mediaLibraryTarget === "cover" ? "Main Cover Photo" : "Photo Gallery"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Select any picture with 1 click, search destinations, or upload photos from your computer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaLibraryOpen(false)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Controls: Search, Direct upload, Category Filters */}
            <div className="p-4 border-b border-gray-100 bg-slate-50/80 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={librarySearchQuery}
                    onChange={(e) => setLibrarySearchQuery(e.target.value)}
                    placeholder="Search by destination (e.g. Kashmir, Kerala, Goa, Rajasthan, Manali, Dubai, Hotel, Beach)..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>

                {/* Direct File Upload from Computer to Library */}
                <input
                  type="file"
                  id="library-modal-upload"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploadingImage(true);
                    try {
                      const url = await travelService.uploadImage(file, "packages/library");
                      if (url) {
                        const newItem: MediaLibraryItem = {
                          id: "custom-" + Date.now(),
                          title: file.name.replace(/\.[^/.]+$/, ""),
                          category: "Uploads",
                          url,
                        };
                        setCustomUploadedLibrary((prev) => [newItem, ...prev]);
                        handleSelectLibraryImage(url, newItem.title);
                      }
                    } catch (err: any) {
                      setErrorMessage("Upload failed: " + err.message);
                    } finally {
                      setIsUploadingImage(false);
                      if (e.target) e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("library-modal-upload")?.click()}
                  disabled={isUploadingImage}
                  className="px-3.5 py-2 rounded-xl border border-dashed border-gray-300 hover:border-brand-red text-slate-700 hover:text-brand-red text-xs font-bold transition flex items-center justify-center gap-1.5 whitespace-nowrap bg-white shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingImage ? "Uploading..." : "Upload from Computer"}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  "All",
                  "Kashmir",
                  "Kerala",
                  "Goa",
                  "Rajasthan",
                  "Manali",
                  "International",
                  "Hotels & Stays",
                  "Adventure",
                  "Nature",
                  "Uploads",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setLibraryCategoryFilter(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap",
                      libraryCategoryFilter === cat
                        ? "bg-brand-red text-white shadow-sm"
                        : "bg-white border border-gray-200 hover:bg-slate-100 text-slate-700"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Grid Content */}
            <div className="p-4 sm:p-5 overflow-y-auto max-h-[55vh] flex-1 bg-gray-50/50">
              {filteredLibraryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {filteredLibraryImages.map((img) => {
                    const isSelectedCover = coverImage === img.url;
                    const isSelectedGallery = galleryImages.includes(img.url);
                    return (
                      <div
                        key={img.id}
                        onClick={() => handleSelectLibraryImage(img.url, img.title)}
                        className={cn(
                          "group relative aspect-video rounded-xl overflow-hidden border cursor-pointer transition shadow-sm bg-gray-100 flex flex-col justify-end",
                          (mediaLibraryTarget === "cover" && isSelectedCover) ||
                            (mediaLibraryTarget === "gallery" && isSelectedGallery)
                            ? "border-brand-red ring-2 ring-brand-red"
                            : "border-gray-200 hover:border-brand-red hover:shadow-md"
                        )}
                      >
                        <Image
                          src={img.url}
                          alt={img.title}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-85 group-hover:opacity-95 transition" />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                            {img.category}
                          </span>
                        </div>

                        {((mediaLibraryTarget === "cover" && isSelectedCover) ||
                          (mediaLibraryTarget === "gallery" && isSelectedGallery)) && (
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-brand-red text-white z-10 shadow">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="relative p-2.5 z-10">
                          <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
                            {img.title}
                          </p>
                          <span className="text-[10px] text-white/70 group-hover:text-white flex items-center gap-1 mt-0.5">
                            Click to select →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold text-slate-700">No images found</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try clearing the search query or pick a different category.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Showing <strong>{filteredLibraryImages.length}</strong> travel photos
              </span>
              <button
                type="button"
                onClick={() => setIsMediaLibraryOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
