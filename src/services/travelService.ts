import {
  TourPackage,
  Destination,
  Enquiry,
  CustomerReview,
  TravelService,
  GalleryItem,
  SiteSettings,
  EnquiryStatus,
  PackageCommercial,
  Receipt,
  PaymentRecord,
  TourExpense,
} from "@/types";
import {
  initialDestinations,
  initialPackages,
  initialReviews,
  initialServices,
  initialGallery,
  initialSiteSettings,
  initialEnquiries,
} from "@/lib/data/mockData";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ref, get, set, update, remove, onValue, off } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { rtdb, storage } from "@/lib/firebase/config";

// Storage keys for client-side local persistence fallback
const PACKAGES_KEY = "yaadgar_packages_store";
const DESTINATIONS_KEY = "yaadgar_destinations_store";
const ENQUIRIES_KEY = "yaadgar_enquiries_store";
const SETTINGS_KEY = "yaadgar_settings_store";
const GALLERY_KEY = "yaadgar_gallery_store";
const RECEIPTS_KEY = "yaadgar_receipts_store";
const EXPENSES_KEY = "yaadgar_expenses_store";

export const initialTourExpenses: TourExpense[] = [
  {
    id: "exp-101",
    booking_id: "enq-1001",
    booking_ref: "YS-2026-1001",
    customer_name: "Vikram Singhania",
    package_title: "Heavenly Kashmir: Gulmarg & Dal Lake Odyssey",
    category: "Supplier Base Cost",
    title: "MakeMyTrip Supplier Base Package Cost",
    amount: 38000,
    paid_to: "MakeMyTrip Holidays B2B",
    payment_method: "Bank Transfer",
    date: "2026-11-06",
    status: "paid",
    notes: "Base package cost for 5N/6D Srinagar + Gulmarg",
    created_at: "2026-11-06T10:00:00Z",
  },
  {
    id: "exp-102",
    booking_id: "enq-1001",
    booking_ref: "YS-2026-1001",
    customer_name: "Vikram Singhania",
    package_title: "Heavenly Kashmir: Gulmarg & Dal Lake Odyssey",
    category: "Hotel & Resort",
    title: "Grand Heritage Houseboat Deluxe Upgrade",
    amount: 4500,
    paid_to: "Grand Heritage Houseboat Srinagar",
    payment_method: "UPI",
    date: "2026-11-07",
    status: "paid",
    notes: "Heating & luxury lake-facing room upgrade",
    created_at: "2026-11-07T14:30:00Z",
  },
  {
    id: "exp-103",
    booking_id: "enq-1001",
    booking_ref: "YS-2026-1001",
    customer_name: "Vikram Singhania",
    package_title: "Heavenly Kashmir: Gulmarg & Dal Lake Odyssey",
    category: "Sightseeing & Guides",
    title: "Phase 1 & 2 Gulmarg Gondola Tickets",
    amount: 3700,
    paid_to: "J&K Cable Car Corporation",
    payment_method: "Card",
    date: "2026-11-08",
    status: "paid",
    notes: "VIP Priority Gondola tickets for 2 adults + 1 child",
    created_at: "2026-11-08T11:00:00Z",
  },
  {
    id: "exp-104",
    booking_id: "enq-1002",
    booking_ref: "YS-2026-1002",
    customer_name: "Priya Chandran",
    package_title: "Magical Dubai: Desert Safari & Burj Khalifa",
    category: "Supplier Base Cost",
    title: "Dubai DMC Partner Land Package",
    amount: 62000,
    paid_to: "Arabian Adventures DMC",
    payment_method: "Bank Transfer",
    date: "2026-11-07",
    status: "paid",
    notes: "Ground package including 4* hotel, transfers & desert safari",
    created_at: "2026-11-07T12:00:00Z",
  },
  {
    id: "exp-105",
    booking_id: "enq-1002",
    booking_ref: "YS-2026-1002",
    customer_name: "Priya Chandran",
    package_title: "Magical Dubai: Desert Safari & Burj Khalifa",
    category: "Sightseeing & Guides",
    title: "Burj Khalifa 124th Floor Sunset Prime Tickets",
    amount: 7800,
    paid_to: "Emaar Entertainment",
    payment_method: "Card",
    date: "2026-11-08",
    status: "paid",
    notes: "Prime sunset slot entry for 2 guests",
    created_at: "2026-11-08T16:00:00Z",
  },
];

function getClientStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setClientStore<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("Local persistence error:", err);
  }
}

function rtdbObjectToList<T>(val: any): T[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.values(val);
}

export interface DiscountStatusResult {
  status: "active" | "scheduled" | "expired" | "disabled";
  isActive: boolean;
  discountAmount: number;
  discountedPrice: number;
  originalPrice: number;
  savings: number;
  percentageOff: number;
  validUntil?: string;
}

export function getPackageDiscountStatus(
  price: number,
  discountEnabled?: boolean,
  discountType?: "percentage" | "fixed",
  discountValue?: number,
  startDate?: string,
  endDate?: string,
  originalPriceOverride?: number
): DiscountStatusResult {
  const origPrice =
    originalPriceOverride && originalPriceOverride > 0 ? originalPriceOverride : price;

  if (!discountEnabled || !discountValue || discountValue <= 0) {
    return {
      status: "disabled",
      isActive: false,
      discountAmount: 0,
      discountedPrice: origPrice,
      originalPrice: origPrice,
      savings: 0,
      percentageOff: 0,
    };
  }

  const now = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  if (startDate && startDate > now) {
    return {
      status: "scheduled",
      isActive: false,
      discountAmount: 0,
      discountedPrice: origPrice,
      originalPrice: origPrice,
      savings: 0,
      percentageOff: 0,
      validUntil: endDate,
    };
  }

  if (endDate && endDate < now) {
    return {
      status: "expired",
      isActive: false,
      discountAmount: 0,
      discountedPrice: origPrice,
      originalPrice: origPrice,
      savings: 0,
      percentageOff: 0,
      validUntil: endDate,
    };
  }

  // Active discount
  let amount = 0;
  let percent = 0;
  if (discountType === "fixed") {
    amount = Math.min(Math.round(discountValue), Math.max(origPrice - 1, 0));
    percent = Math.round((amount / (origPrice || 1)) * 100);
  } else {
    // Default percentage
    percent = Math.min(Math.max(discountValue, 1), 90);
    amount = Math.round((origPrice * percent) / 100);
  }

  const finalPrice = Math.max(origPrice - amount, 1);

  return {
    status: "active",
    isActive: true,
    discountAmount: amount,
    discountedPrice: finalPrice,
    originalPrice: origPrice,
    savings: amount,
    percentageOff: percent,
    validUntil: endDate,
  };
}

// Ensure backward compatibility: populate default values for newly added schema fields
function normalizePackage(pkg: any): TourPackage {
  if (!pkg) return pkg;
  return {
    ...pkg,
    schema_version: pkg.schema_version || 2,
    currency: pkg.currency || "INR",
    pricing_basis: pkg.pricing_basis || "per person",
    pricing_display_mode: pkg.pricing_display_mode || "single",
    couple_final_price: pkg.couple_final_price || pkg.price,
    family_final_price: pkg.family_final_price || pkg.price,
    couple_pricing_configuration: pkg.couple_pricing_configuration || null,
    family_pricing_configuration: pkg.family_pricing_configuration || null,
    discount_enabled: Boolean(pkg.discount_enabled),
    discount_type: pkg.discount_type || "percentage",
    discount_value: pkg.discount_value || 0,
    discount_start_date: pkg.discount_start_date || "",
    discount_end_date: pkg.discount_end_date || "",
    original_price: pkg.original_price || pkg.price,
    couple_original_price: pkg.couple_original_price || pkg.couple_final_price || pkg.price,
    family_original_price: pkg.family_original_price || pkg.family_final_price || pkg.price,
    country: pkg.country || (pkg.trip_type === "international" ? "International" : "India"),
    state_or_region: pkg.state_or_region || pkg.destination_name || "Popular Region",
    departure_city: pkg.departure_city || "Ahmedabad / Mumbai / Delhi",
    status: pkg.status || "published",
    featured: pkg.featured !== undefined ? pkg.featured : true,
    highlights: Array.isArray(pkg.highlights) ? pkg.highlights : [],
    inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions : [
      "Comfortable Hotel Accommodation",
      "Daily Breakfast & Select Meals",
      "Private AC Vehicle for Transfers & Sightseeing",
      "24/7 Dedicated Support",
    ],
    exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions : [
      "Airfare / Train tickets unless specified",
      "Personal expenses, laundry, tips",
      "Entry tickets & optional adventure activities",
      "Travel Insurance",
    ],
    policies: pkg.policies || {
      cancellation: "Free cancellation up to 30 days prior to departure. 50% retention between 15-29 days. Non-refundable within 14 days.",
      refund: "Approved refunds are processed to the original payment source within 7-10 business days.",
      documents_required: "Government issued Photo ID (Aadhaar / Passport) is mandatory for check-in and local permits.",
      payment_terms: "25% token advance to confirm reservation. 50% 15 days prior to arrival. Balance before start of trip.",
    },
    itinerary: Array.isArray(pkg.itinerary) && pkg.itinerary.length > 0
      ? pkg.itinerary.map((d: any, idx: number) => ({
          day: d.day || idx + 1,
          title: d.title || `Day ${idx + 1} Itinerary`,
          activities: typeof d.activities === "string" ? d.activities : "Scheduled sightseeing and activities",
          description: d.description || (typeof d.activities === "string" ? d.activities : ""),
          start_location: d.start_location || pkg.destination_name,
          end_location: d.end_location || pkg.destination_name,
          travel_duration: d.travel_duration || "",
          meals_included: Array.isArray(d.meals_included) ? d.meals_included : (d.meals ? [d.meals] : ["Breakfast"]),
          hotel_name: d.hotel_name || d.stay || "Deluxe Partner Hotel",
          hotel_stay_city: d.hotel_stay_city || pkg.destination_name,
          transfers: d.transfers || "Private AC Vehicle Included",
          sightseeing: Array.isArray(d.sightseeing) ? d.sightseeing : [],
          day_images: Array.isArray(d.day_images) ? d.day_images : [],
          flights: Array.isArray(d.flights) ? d.flights : [],
        }))
      : [
          {
            day: 1,
            title: `Arrival in ${pkg.destination_name}`,
            description: `Warm welcome upon arrival in ${pkg.destination_name} and private transfer to your pre-booked hotel. Evening at leisure.`,
            activities: "Arrival greeting, hotel check-in, leisure evening.",
            meals_included: ["Dinner"],
            hotel_name: "Premium Resort / Hotel",
            hotel_stay_city: pkg.destination_name,
            transfers: "Airport / Station Pickup by Dedicated Chauffeur",
          },
          {
            day: 2,
            title: `Exploring Iconic Highlights of ${pkg.destination_name}`,
            description: `Embark on a full-day guided excursion taking in the best sights, vibrant markets, and unforgettable landscapes.`,
            activities: "Guided full day sightseeing and cultural experiences.",
            meals_included: ["Breakfast", "Dinner"],
            hotel_name: "Premium Resort / Hotel",
            hotel_stay_city: pkg.destination_name,
            transfers: "Full day private sightseeing transport",
          },
        ],
    flights: Array.isArray(pkg.flights) ? pkg.flights : [],
    hotels: Array.isArray(pkg.hotels) ? pkg.hotels : [],
    transfers: Array.isArray(pkg.transfers) ? pkg.transfers : [],
    activities_list: Array.isArray(pkg.activities_list) ? pkg.activities_list : [],
    departure_dates: Array.isArray(pkg.departure_dates) ? pkg.departure_dates : [],
    gallery_images: Array.isArray(pkg.gallery_images) ? pkg.gallery_images : [],
  };
}

export const travelService = {
  // --- MEDIA / FILE UPLOAD VIA FIREBASE STORAGE ---
  async uploadImage(file: File, folder: string = "packages"): Promise<string> {
    try {
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const fileRef = storageRef(storage, `${folder}/${timestamp}_${cleanFileName}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (err) {
      console.warn("Firebase Storage upload failed, falling back to local base64:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsDataURL(file);
      });
    }
  },

  // --- PACKAGES ---
  async getPackages(options?: {
    destinationSlug?: string;
    tripType?: "domestic" | "international";
    category?: string;
    search?: string;
    maxPrice?: number;
    featured?: boolean;
    duration?: "1-3" | "4-7" | "8+";
    status?: "all" | "published" | "draft" | "archived";
    sortBy?: "recommended" | "price_asc" | "price_desc" | "duration" | "newest";
  }): Promise<TourPackage[]> {
    let packages: TourPackage[] = [];

    // 1. Try Firebase Realtime Database
    try {
      const snapshot = await get(ref(rtdb, "packages"));
      if (snapshot.exists()) {
        const rawList = rtdbObjectToList<any>(snapshot.val());
        packages = rawList.map(normalizePackage);
        setClientStore(PACKAGES_KEY, packages);
      } else {
        const initial = getClientStore<any[]>(PACKAGES_KEY, initialPackages);
        packages = initial.map(normalizePackage);
        // Seed into Firebase
        if (typeof window !== "undefined") {
          for (const pkg of packages) {
            set(ref(rtdb, `packages/${pkg.id}`), pkg).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn("Firebase RTDB getPackages failed, using local cache:", err);
      const initial = getClientStore<any[]>(PACKAGES_KEY, initialPackages);
      packages = initial.map(normalizePackage);
    }

    // Apply Filters
    if (options) {
      if (options.status && options.status !== "all") {
        packages = packages.filter((p) => p.status === options.status);
      } else if (!options.status) {
        // By default, public listing only gets published
        // If options are omitted or standard web view calls it, leave as is, but filter if requested
      }

      if (options.destinationSlug) {
        packages = packages.filter(
          (p) =>
            (p.destination_name && p.destination_name.toLowerCase().includes(options.destinationSlug!.toLowerCase())) ||
            (p.slug && p.slug.toLowerCase().includes(options.destinationSlug!.toLowerCase()))
        );
      }
      if (options.tripType) {
        packages = packages.filter((p) => p.trip_type === options.tripType);
      }
      if (options.category && options.category !== "all") {
        packages = packages.filter((p) => p.category === options.category);
      }
      if (options.featured !== undefined) {
        packages = packages.filter((p) => p.featured === options.featured);
      }
      if (options.maxPrice) {
        packages = packages.filter((p) => (p.price || 0) <= options.maxPrice!);
      }
      if (options.duration) {
        if (options.duration === "1-3") {
          packages = packages.filter((p) => (p.duration_days || 0) <= 3);
        } else if (options.duration === "4-7") {
          packages = packages.filter((p) => (p.duration_days || 0) >= 4 && (p.duration_days || 0) <= 7);
        } else if (options.duration === "8+") {
          packages = packages.filter((p) => (p.duration_days || 0) >= 8);
        }
      }
      if (options.search) {
        const query = options.search.toLowerCase();
        packages = packages.filter(
          (p) =>
            Boolean(p.title && p.title.toLowerCase().includes(query)) ||
            Boolean(p.destination_name && p.destination_name.toLowerCase().includes(query)) ||
            Boolean(p.short_description && p.short_description.toLowerCase().includes(query))
        );
      }
      // Apply Sorting
      if (options.sortBy) {
        switch (options.sortBy) {
          case "price_asc":
            packages.sort((a, b) => a.price - b.price);
            break;
          case "price_desc":
            packages.sort((a, b) => b.price - a.price);
            break;
          case "duration":
            packages.sort((a, b) => a.duration_days - b.duration_days);
            break;
          case "newest":
            packages.sort((a, b) => {
              const tB = b.created_at ? new Date(b.created_at).getTime() || 0 : 0;
              const tA = a.created_at ? new Date(a.created_at).getTime() || 0 : 0;
              return tB - tA;
            });
            break;
          default:
            packages.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
      }
    }

    return packages;
  },

  async getPackageBySlug(slug: string): Promise<TourPackage | null> {
    const packages = await this.getPackages();
    return packages.find((p) => p.slug === slug) || null;
  },

  async getPackageById(id: string): Promise<TourPackage | null> {
    const packages = await this.getPackages();
    return packages.find((p) => p.id === id) || null;
  },

  async savePackage(pkg: TourPackage, commercial?: PackageCommercial): Promise<TourPackage> {
    const normalized = normalizePackage(pkg);
    const list = getClientStore<TourPackage[]>(PACKAGES_KEY, initialPackages.map(normalizePackage));
    const index = list.findIndex((p) => p.id === normalized.id);
    const updatedPkg: TourPackage =
      index >= 0
        ? { ...normalized, updated_at: new Date().toISOString() }
        : { ...normalized, created_at: normalized.created_at || new Date().toISOString(), updated_at: new Date().toISOString() };

    if (index >= 0) {
      list[index] = updatedPkg;
    } else {
      list.unshift(updatedPkg);
    }
    setClientStore(PACKAGES_KEY, list);

    // Save package data to Firebase RTDB
    try {
      await set(ref(rtdb, `packages/${updatedPkg.id}`), updatedPkg);
    } catch (err) {
      console.warn("Firebase RTDB savePackage failed, saved locally:", err);
    }

    // Save commercial supplier info in separate, private node if provided
    if (commercial) {
      await this.savePackageCommercial(commercial);
    }

    return updatedPkg;
  },

  async deletePackage(id: string): Promise<void> {
    const list = getClientStore<TourPackage[]>(PACKAGES_KEY, initialPackages.map(normalizePackage));
    const updated = list.filter((p) => p.id !== id);
    setClientStore(PACKAGES_KEY, updated);

    try {
      await remove(ref(rtdb, `packages/${id}`));
      await remove(ref(rtdb, `package_commercials/${id}`));
    } catch (err) {
      console.warn("Firebase RTDB deletePackage failed, removed locally:", err);
    }
  },

  async duplicatePackage(id: string): Promise<TourPackage | null> {
    const original = await this.getPackageById(id);
    if (!original) return null;

    const newId = `pkg-${Date.now()}`;
    const newSlug = `${original.slug}-copy-${Date.now().toString().slice(-4)}`;
    const duplicated: TourPackage = {
      ...original,
      id: newId,
      slug: newSlug,
      title: `${original.title} (Copy)`,
      status: "draft",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Duplicate commercial if available
    const comm = await this.getPackageCommercial(id);
    if (comm) {
      await this.savePackageCommercial({
        ...comm,
        package_id: newId,
        updated_at: new Date().toISOString(),
      });
    }

    return await this.savePackage(duplicated);
  },

  // --- COMMERCIAL & SUPPLIER PRIVATE INFORMATION ---
  async savePackageCommercial(commercial: PackageCommercial): Promise<void> {
    const updated = { ...commercial, updated_at: new Date().toISOString() };
    setClientStore(`commercial_${commercial.package_id}`, updated);
    try {
      await set(ref(rtdb, `package_commercials/${commercial.package_id}`), updated);
    } catch (err) {
      console.warn("Firebase RTDB savePackageCommercial failed, saved locally:", err);
    }
  },

  async getPackageCommercial(packageId: string): Promise<PackageCommercial | null> {
    try {
      const snap = await get(ref(rtdb, `package_commercials/${packageId}`));
      if (snap.exists()) {
        const val = snap.val() as PackageCommercial;
        setClientStore(`commercial_${packageId}`, val);
        return val;
      }
    } catch (err) {
      console.warn("Firebase RTDB getPackageCommercial failed, reading local cache:", err);
    }
    return getClientStore<PackageCommercial | null>(`commercial_${packageId}`, null);
  },

  // --- RECEIPTS & BILLING SYSTEM ---
  async getReceipts(): Promise<Receipt[]> {
    try {
      const snapshot = await get(ref(rtdb, "receipts"));
      if (snapshot.exists()) {
        const list = rtdbObjectToList<Receipt>(snapshot.val());
        setClientStore(RECEIPTS_KEY, list);
        return list;
      }
    } catch (err) {
      console.warn("Firebase RTDB getReceipts failed, reading local:", err);
    }
    return getClientStore<Receipt[]>(RECEIPTS_KEY, []);
  },

  async getReceiptByNumber(receiptNumber: string): Promise<Receipt | null> {
    const list = await this.getReceipts();
    return list.find((r) => r.receipt_number.toLowerCase() === receiptNumber.toLowerCase()) || null;
  },

  async getReceiptByToken(token: string): Promise<Receipt | null> {
    const list = await this.getReceipts();
    return (
      list.find(
        (r) =>
          r.verification_token === token ||
          r.receipt_number.toLowerCase() === token.toLowerCase() ||
          r.booking_reference.toLowerCase() === token.toLowerCase()
      ) || null
    );
  },

  async saveReceipt(receipt: Receipt): Promise<Receipt> {
    const list = getClientStore<Receipt[]>(RECEIPTS_KEY, []);
    const index = list.findIndex((r) => r.id === receipt.id || r.receipt_number === receipt.receipt_number);
    const updated: Receipt = {
      ...receipt,
      updated_at: new Date().toISOString(),
    };

    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    setClientStore(RECEIPTS_KEY, list);

    try {
      await set(ref(rtdb, `receipts/${updated.id}`), updated);
    } catch (err) {
      console.warn("Firebase RTDB saveReceipt failed, saved locally:", err);
    }
    return updated;
  },

  async revokeReceipt(receiptId: string): Promise<void> {
    const list = getClientStore<Receipt[]>(RECEIPTS_KEY, []);
    const target = list.find((r) => r.id === receiptId || r.receipt_number === receiptId);
    if (target) {
      target.receipt_status = "revoked";
      target.updated_at = new Date().toISOString();
      setClientStore(RECEIPTS_KEY, list);

      try {
        await update(ref(rtdb, `receipts/${target.id}`), {
          receipt_status: "revoked",
          updated_at: target.updated_at,
        });
      } catch (err) {
        console.warn("Firebase RTDB revokeReceipt failed:", err);
      }
    }
  },

  async generateNextReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let nextSeq = 1001;

    try {
      const snap = await get(ref(rtdb, `counters/receipt_seq_${year}`));
      if (snap.exists()) {
        nextSeq = Number(snap.val()) + 1;
      } else {
        const existing = await this.getReceipts();
        const nums = existing
          .map((r) => {
            const m = r.receipt_number.match(new RegExp(`YS-REC-${year}-(\\d+)`));
            return m ? parseInt(m[1], 10) : 0;
          })
          .filter((n) => !isNaN(n) && n > 0);
        if (nums.length > 0) {
          nextSeq = Math.max(...nums) + 1;
        }
      }
      await set(ref(rtdb, `counters/receipt_seq_${year}`), nextSeq);
    } catch (err) {
      console.warn("Counter read failed, using safe fallback:", err);
      const existing = getClientStore<Receipt[]>(RECEIPTS_KEY, []);
      nextSeq = 1001 + existing.length;
    }

    return `YS-REC-${year}-${nextSeq}`;
  },

  // --- DESTINATIONS ---
  async getDestinations(options?: {
    tripType?: "domestic" | "international";
    featured?: boolean;
    search?: string;
  }): Promise<Destination[]> {
    let destinations: Destination[] = [];

    try {
      const snapshot = await get(ref(rtdb, "destinations"));
      if (snapshot.exists()) {
        destinations = rtdbObjectToList<Destination>(snapshot.val());
        setClientStore(DESTINATIONS_KEY, destinations);
      } else {
        destinations = getClientStore<Destination[]>(DESTINATIONS_KEY, initialDestinations);
        if (typeof window !== "undefined") {
          for (const dest of destinations) {
            set(ref(rtdb, `destinations/${dest.id}`), dest).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn("Firebase RTDB getDestinations failed, using local cache:", err);
      destinations = getClientStore<Destination[]>(DESTINATIONS_KEY, initialDestinations);
    }

    try {
      const packagesList = getClientStore<TourPackage[]>(PACKAGES_KEY, []);
      if (packagesList && packagesList.length > 0) {
        destinations = destinations.map((d) => {
          const count = packagesList.filter(
            (p) =>
              p.status !== "draft" &&
              (p.destination_name?.toLowerCase() === d.name?.toLowerCase() ||
                p.destination_id === d.id ||
                p.slug?.includes(d.slug))
          ).length;
          return { ...d, package_count: count };
        });
      }
    } catch {
      // fallback
    }

    if (options) {
      if (options.tripType) {
        destinations = destinations.filter((d) => d.trip_type === options.tripType);
      }
      if (options.featured !== undefined) {
        destinations = destinations.filter((d) => d.featured === options.featured);
      }
      if (options.search) {
        const query = options.search.toLowerCase();
        destinations = destinations.filter(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.state_or_country.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query)
        );
      }
    }

    return destinations;
  },

  async getDestinationBySlug(slug: string): Promise<Destination | null> {
    const destinations = await this.getDestinations();
    return destinations.find((d) => d.slug === slug) || null;
  },

  async saveDestination(destination: Destination): Promise<Destination> {
    const list = getClientStore<Destination[]>(DESTINATIONS_KEY, initialDestinations);
    const index = list.findIndex((d) => d.id === destination.id);
    if (index >= 0) {
      list[index] = destination;
    } else {
      list.unshift(destination);
    }
    setClientStore(DESTINATIONS_KEY, list);

    try {
      await set(ref(rtdb, `destinations/${destination.id}`), destination);
    } catch (err) {
      console.warn("Firebase RTDB saveDestination failed, saved locally:", err);
    }
    return destination;
  },

  async deleteDestination(id: string): Promise<void> {
    const list = getClientStore<Destination[]>(DESTINATIONS_KEY, initialDestinations);
    const updated = list.filter((d) => d.id !== id);
    setClientStore(DESTINATIONS_KEY, updated);

    try {
      await remove(ref(rtdb, `destinations/${id}`));
    } catch (err) {
      console.warn("Firebase RTDB deleteDestination failed, removed locally:", err);
    }
  },

  // --- ENQUIRIES & BOOKINGS ---
  async getEnquiries(): Promise<Enquiry[]> {
    let enquiries: Enquiry[] = [];

    try {
      const snapshot = await get(ref(rtdb, "enquiries"));
      if (snapshot.exists()) {
        enquiries = rtdbObjectToList<Enquiry>(snapshot.val());
        enquiries.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setClientStore(ENQUIRIES_KEY, enquiries);
        return enquiries;
      }
    } catch (err) {
      console.warn("Firebase RTDB getEnquiries failed, using local cache:", err);
    }

    enquiries = getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries);
    return enquiries;
  },

  subscribeToEnquiries(callback: (enquiries: Enquiry[]) => void): () => void {
    try {
      const enquiriesRef = ref(rtdb, "enquiries");
      onValue(
        enquiriesRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const list = rtdbObjectToList<Enquiry>(snapshot.val());
            list.sort(
              (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setClientStore(ENQUIRIES_KEY, list);
            callback(list);
          } else {
            const fallback = getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries);
            callback(fallback);
          }
        },
        (error) => {
          console.warn("Firebase RTDB realtime listener error, falling back to local:", error);
          callback(getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries));
        }
      );
      return () => off(enquiriesRef);
    } catch (err) {
      console.warn("Firebase RTDB subscription failed, falling back to local store:", err);
      callback(getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries));
      return () => {};
    }
  },

  async submitEnquiry(
    enquiryInput: Omit<Enquiry, "id" | "reference_number" | "created_at" | "updated_at" | "status">
  ): Promise<Enquiry> {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const refNum = `YS-${new Date().getFullYear()}-${randomId}`;
    const newEnquiry: Enquiry = {
      ...enquiryInput,
      id: `enq-${Date.now()}`,
      reference_number: refNum,
      status: "new",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const enquiryRef = ref(rtdb, `enquiries/${newEnquiry.id}`);
      await set(enquiryRef, newEnquiry);
    } catch (err) {
      console.warn("Firebase RTDB submitEnquiry failed, saving locally:", err);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("enquiries").insert([newEnquiry]);
      } catch (err) {
        console.warn("Could not insert to Supabase, saving locally", err);
      }
    }

    const enquiries = getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries);
    enquiries.unshift(newEnquiry);
    setClientStore(ENQUIRIES_KEY, enquiries);
    return newEnquiry;
  },

  async saveEnquiry(enquiry: Enquiry): Promise<Enquiry> {
    const updatedEnquiry = { ...enquiry, updated_at: new Date().toISOString() };

    try {
      const enquiryRef = ref(rtdb, `enquiries/${enquiry.id}`);
      await set(enquiryRef, updatedEnquiry);
    } catch (err) {
      console.warn("Firebase RTDB saveEnquiry failed, saving locally:", err);
    }

    const list = getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries);
    const index = list.findIndex((e) => e.id === enquiry.id);
    if (index >= 0) {
      list[index] = updatedEnquiry;
    } else {
      list.unshift(updatedEnquiry);
    }
    setClientStore(ENQUIRIES_KEY, list);
    return updatedEnquiry;
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus, note?: string): Promise<void> {
    const enquiries = getClientStore<Enquiry[]>(ENQUIRIES_KEY, initialEnquiries);
    const target = enquiries.find((e) => e.id === id);
    if (target) {
      target.status = status;
      target.updated_at = new Date().toISOString();
      if (note) {
        if (!target.internal_notes) target.internal_notes = [];
        target.internal_notes.unshift({
          id: `note-${Date.now()}`,
          note,
          author: "Admin Agent",
          created_at: new Date().toISOString(),
        });
      }
      setClientStore(ENQUIRIES_KEY, enquiries);

      try {
        const enquiryRef = ref(rtdb, `enquiries/${id}`);
        await update(enquiryRef, {
          status: target.status,
          updated_at: target.updated_at,
          internal_notes: target.internal_notes || [],
        });
      } catch (err) {
        console.warn("Firebase RTDB updateEnquiryStatus failed, saved locally:", err);
      }
    }
  },

  // --- REVIEWS & TESTIMONIALS ---
  async getReviews(): Promise<CustomerReview[]> {
    return initialReviews;
  },

  // --- SERVICES ---
  async getServices(): Promise<TravelService[]> {
    return initialServices;
  },

  // --- GALLERY ---
  async getGallery(category?: string): Promise<GalleryItem[]> {
    let gallery: GalleryItem[] = [];

    try {
      const snapshot = await get(ref(rtdb, "gallery"));
      if (snapshot.exists()) {
        gallery = rtdbObjectToList<GalleryItem>(snapshot.val());
        setClientStore(GALLERY_KEY, gallery);
      } else {
        gallery = getClientStore<GalleryItem[]>(GALLERY_KEY, initialGallery);
        if (typeof window !== "undefined") {
          for (const item of gallery) {
            set(ref(rtdb, `gallery/${item.id}`), item).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn("Firebase RTDB getGallery failed, using local cache:", err);
      gallery = getClientStore<GalleryItem[]>(GALLERY_KEY, initialGallery);
    }

    if (!category || category === "All") {
      return gallery;
    }
    return gallery.filter((g) => g.category === category);
  },

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const list = getClientStore<GalleryItem[]>(GALLERY_KEY, initialGallery);
    const index = list.findIndex((g) => g.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    setClientStore(GALLERY_KEY, list);

    try {
      await set(ref(rtdb, `gallery/${item.id}`), item);
    } catch (err) {
      console.warn("Firebase RTDB saveGalleryItem failed, saved locally:", err);
    }
    return item;
  },

  async deleteGalleryItem(id: string): Promise<void> {
    const list = getClientStore<GalleryItem[]>(GALLERY_KEY, initialGallery);
    const updated = list.filter((g) => g.id !== id);
    setClientStore(GALLERY_KEY, updated);

    try {
      await remove(ref(rtdb, `gallery/${id}`));
    } catch (err) {
      console.warn("Firebase RTDB deleteGalleryItem failed, removed locally:", err);
    }
  },

  // --- SITE SETTINGS ---
  async getSiteSettings(): Promise<SiteSettings> {
    try {
      const snapshot = await get(ref(rtdb, "site_settings"));
      if (snapshot.exists()) {
        const data = snapshot.val() as SiteSettings;
        setClientStore(SETTINGS_KEY, data);
        return data;
      }
    } catch (err) {
      console.warn("Firebase RTDB getSiteSettings failed, using local cache:", err);
    }
    return getClientStore<SiteSettings>(SETTINGS_KEY, initialSiteSettings);
  },

  async updateSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
    setClientStore(SETTINGS_KEY, settings);
    try {
      await set(ref(rtdb, "site_settings"), settings);
    } catch (err) {
      console.warn("Firebase RTDB updateSiteSettings failed, saved locally:", err);
    }
    return settings;
  },

  // --- TOUR EXPENSES & FINANCES ---
  async getExpenses(bookingId?: string): Promise<TourExpense[]> {
    let list: TourExpense[] = [];
    try {
      const snapshot = await get(ref(rtdb, "expenses"));
      if (snapshot.exists()) {
        list = rtdbObjectToList<TourExpense>(snapshot.val());
        setClientStore(EXPENSES_KEY, list);
      } else {
        list = getClientStore<TourExpense[]>(EXPENSES_KEY, initialTourExpenses);
        if (typeof window !== "undefined") {
          for (const item of list) {
            set(ref(rtdb, `expenses/${item.id}`), item).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn("Firebase RTDB getExpenses failed, using local cache:", err);
      list = getClientStore<TourExpense[]>(EXPENSES_KEY, initialTourExpenses);
    }
    if (bookingId) {
      return list.filter((exp) => exp.booking_id === bookingId);
    }
    return list;
  },

  async saveExpense(expense: TourExpense): Promise<TourExpense> {
    const list = getClientStore<TourExpense[]>(EXPENSES_KEY, initialTourExpenses);
    const index = list.findIndex((e) => e.id === expense.id);
    if (index >= 0) {
      list[index] = expense;
    } else {
      list.unshift(expense);
    }
    setClientStore(EXPENSES_KEY, list);

    try {
      await set(ref(rtdb, `expenses/${expense.id}`), expense);
    } catch (err) {
      console.warn("Firebase RTDB saveExpense failed, saved locally:", err);
    }
    return expense;
  },

  async deleteExpense(id: string): Promise<void> {
    const list = getClientStore<TourExpense[]>(EXPENSES_KEY, initialTourExpenses);
    const updated = list.filter((e) => e.id !== id);
    setClientStore(EXPENSES_KEY, updated);

    try {
      await remove(ref(rtdb, `expenses/${id}`));
    } catch (err) {
      console.warn("Firebase RTDB deleteExpense failed, removed locally:", err);
    }
  },

  getPackageDiscountStatus,
};
