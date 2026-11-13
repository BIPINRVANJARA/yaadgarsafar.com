export type TripType = "domestic" | "international";

export type TripCategory =
  | "family"
  | "honeymoon"
  | "adventure"
  | "relaxation"
  | "pilgrimage"
  | "wildlife"
  | "cultural"
  | "group"
  | "luxury"
  | "budget"
  | "beach"
  | "customized";

// --- FLIGHTS ---
export interface PackageFlight {
  id: string;
  day?: number;
  airline_name: string;
  airline_logo?: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_city: string;
  arrival_city: string;
  departure_date?: string;
  departure_time: string;
  arrival_date?: string;
  arrival_time: string;
  flight_duration: string;
  cabin_baggage?: string;
  checkin_baggage?: string;
  terminal_info?: string;
  layover_duration?: string;
  connecting_info?: string;
  flight_type: "direct" | "connecting";
}

// --- HOTELS ---
export interface PackageHotel {
  id: string;
  hotel_name: string;
  location: string;
  address?: string;
  rating: number; // 1-5
  images?: string[];
  room_category: string;
  room_size?: string;
  bed_type?: string;
  occupancy?: string;
  checkin_date?: string;
  checkin_time?: string;
  checkout_date?: string;
  checkout_time?: string;
  nights: number;
  rooms_count?: number;
  adults_count?: number;
  children_count?: number;
  meals_included?: string;
  amenities?: string[];
  has_ac_heating?: boolean;
  description?: string;
  map_location?: string;
  supplier_hotel_ref?: string;
}

// --- TRANSFERS ---
export interface PackageTransfer {
  id: string;
  day?: number;
  transfer_type:
    | "Airport Pickup"
    | "Airport Drop"
    | "Hotel Transfer"
    | "Intercity Transfer"
    | "Sightseeing Transfer"
    | string;
  pickup_location: string;
  drop_location: string;
  vehicle_type: string;
  vehicle_capacity?: string;
  is_ac: boolean;
  passengers?: number;
  luggage_capacity?: string;
  transfer_date?: string;
  pickup_time?: string;
  estimated_duration?: string;
  service_type: "private" | "shared";
  instructions?: string;
}

// --- ACTIVITIES & SIGHTSEEING ---
export interface PackageActivity {
  id: string;
  day?: number;
  name: string;
  destination: string;
  description: string;
  duration?: string;
  time_slot: "Morning" | "Afternoon" | "Evening" | "Anytime";
  pickup_included: boolean;
  drop_included: boolean;
  ticket_included: boolean;
  images?: string[];
  additional_charges?: string;
  booking_instructions?: string;
}

// --- DEPARTURE DATES & AVAILABILITY ---
export interface PackageDepartureDate {
  id: string;
  departure_date: string;
  return_date: string;
  available_seats: number;
  total_capacity: number;
  adult_price: number;
  child_price?: number;
  infant_price?: number;
  status: "available" | "limited" | "sold_out" | "on_request";
  special_offer?: string;
}

// --- POLICIES ---
export interface PackagePolicies {
  cancellation?: string;
  refund?: string;
  payment_terms?: string;
  booking_conditions?: string;
  documents_required?: string;
  visa_requirements?: string;
  travel_guidelines?: string;
  child_policy?: string;
  hotel_checkin_policy?: string;
  important_notes?: string;
  seasonal_restrictions?: string;
}

// --- DAY-WISE ITINERARY ---
export interface PackageItineraryDay {
  day: number;
  title: string;
  start_location?: string;
  end_location?: string;
  description?: string;
  travel_duration?: string;
  distance?: string;
  meals_included?: string[]; // ["Breakfast", "Lunch", "Dinner", "Snacks"]
  hotel_name?: string;
  hotel_room?: string;
  hotel_checkin?: string;
  hotel_stay_city?: string;
  transfers?: string;
  activities: string; // for backward-compatibility with string
  activities_details?: string[];
  sightseeing?: string[];
  flights?: PackageFlight[];
  day_images?: string[];
  special_instructions?: string;
  // legacy compatibility
  stay?: string;
  meals?: string;
}

// --- PRICING CONFIGURATION ---
export interface PricingTierConfig {
  supplier_base_price: number;
  commission_type: "percentage" | "fixed";
  commission_value: number;
  additional_markup: number;
  taxes_or_fees: number;
  discount_amount?: number;
  manual_override: boolean;
  override_price?: number;
  final_price: number;
  estimated_profit: number;
  // Customer Discount Tier Support
  discount_enabled?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  original_price?: number;
  profit_after_discount?: number;
}

// --- TOUR PACKAGE ---
export interface TourPackage {
  id: string;
  title: string;
  slug: string;
  destination_id: string;
  destination_name: string;
  country?: string;
  state_or_region?: string;
  departure_city?: string;
  trip_type: TripType;
  duration_days: number;
  duration_nights: number;
  category: TripCategory;
  price: number; // Final selling / starting price
  currency: string;
  pricing_basis: string; // e.g. "per person" or "per package"

  // Dynamic Couple & Family Pricing
  pricing_display_mode?: "single" | "separate";
  couple_final_price?: number;
  family_final_price?: number;
  couple_pricing_configuration?: PricingTierConfig;
  family_pricing_configuration?: PricingTierConfig;

  // Customer Discount Management
  discount_enabled?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  original_price?: number;
  couple_original_price?: number;
  family_original_price?: number;
  badge?:
    | "Popular Choice"
    | "Best Seller"
    | "Trending"
    | "Limited Offer"
    | "Recommended"
    | "Seasonal Offer"
    | "New Package"
    | "None"
    | string;
  short_description: string;
  description: string;
  full_description?: string;
  highlights: string[];
  best_time?: string;
  languages?: string[];
  min_travelers?: number;
  max_travelers?: number;
  recommended_age_group?: string;

  // Media
  cover_image: string;
  cover_image_alt?: string;
  gallery_images?: string[];
  destination_images?: string[];
  hotel_images?: string[];
  activity_images?: string[];

  // Structure
  itinerary: PackageItineraryDay[];
  flights?: PackageFlight[];
  hotels?: PackageHotel[];
  transfers?: PackageTransfer[];
  activities_list?: PackageActivity[];
  departure_dates?: PackageDepartureDate[];
  inclusions: string[];
  exclusions: string[];
  policies?: PackagePolicies;
  faqs?: { question: string; answer: string }[];

  // Publishing
  status: "published" | "draft" | "archived";
  featured: boolean;
  schema_version?: number;
  created_at: string;
  updated_at: string;
}

// --- SUPPLIER & COMMERCIAL INFORMATION (CONFIDENTIAL - NEVER EXPOSED PUBLICLY) ---
export interface PackageCommercial {
  package_id: string;
  supplier_name: string;
  supplier_package_id?: string;
  supplier_package_url?: string;
  supplier_booking_ref?: string;
  source_platform: "MakeMyTrip" | "Direct Supplier" | "Other" | string;
  supplier_base_price: number;
  currency: string;
  pricing_mode: "per_person" | "per_package";
  commission_type: "percentage" | "fixed";
  commission_value: number; // e.g. 10 (%) or 4000 (INR)
  additional_markup: number;
  taxes_or_fees: number;
  final_customer_price: number;
  discount_amount?: number;
  discount_percentage?: number;
  estimated_profit: number;
  internal_notes?: string;

  // Dynamic Couple & Family Pricing Configurations (Confidential)
  pricing_display_mode?: "single" | "separate";
  couple_pricing_configuration?: PricingTierConfig;
  family_pricing_configuration?: PricingTierConfig;
  couple_final_price?: number;
  family_final_price?: number;

  // Customer Discount Commercial Tracking
  discount_enabled?: boolean;
  discount_type?: "percentage" | "fixed";
  discount_value?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  original_selling_price?: number;
  profit_after_discount?: number;

  updated_at: string;
}

// --- DESTINATIONS ---
export interface Destination {
  id: string;
  name: string;
  slug: string;
  state_or_country: string;
  trip_type: TripType;
  description: string;
  cover_image: string;
  gallery_images?: string[];
  best_time: string;
  attractions: string[];
  activities: string[];
  travel_tips?: string[];
  featured: boolean;
  package_count: number;
  starting_price?: number;
}

// --- ENQUIRIES & BOOKINGS ---
export type EnquiryStatus =
  | "new"
  | "contacted"
  | "follow_up"
  | "quotation_sent"
  | "confirmed"
  | "closed"
  | "cancelled";

export interface Enquiry {
  id: string;
  reference_number: string;
  customer_name: string;
  email: string;
  phone: string;
  destination: string;
  package_id?: string;
  package_title?: string;
  departure_city?: string;
  departure_date?: string;
  return_date?: string;
  adults: number;
  children: number;
  infants?: number;
  budget_min?: number;
  budget_max?: number;
  travel_preferences?: string[];
  accommodation_preference?: string;
  message?: string;
  status: EnquiryStatus;
  assigned_to?: string;
  internal_notes?: { id: string; note: string; author: string; created_at: string }[];

  // Confirmation & Receipt details
  total_amount?: number;
  amount_paid?: number;
  payment_method?: string;
  payment_status?: "paid" | "partially_paid" | "pending";
  services_included?: string[];
  confirmation_date?: string;
  receipt_number?: string;
  receipt_id?: string;
  created_at: string;
  updated_at: string;
}

// --- RECEIPTS & BILLING ---
export interface PaymentRecord {
  transaction_id: string;
  payment_date: string;
  payment_method: "UPI" | "Google Pay" | "PhonePe" | "Paytm" | "Bank Transfer" | "Cash" | "Card" | "Other";
  amount: number;
  status: "SUCCESS" | "PENDING" | "REFUNDED";
  reference?: string;
}

export interface BillingItem {
  description: string;
  quantity: string;
  unit_price: number;
  total: number;
}

export interface Receipt {
  id: string;
  receipt_number: string; // e.g. YS-REC-2026-1001
  booking_id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  billing_address?: string;
  departure_city?: string;
  adults: number;
  children: number;
  infants: number;
  package_id?: string;
  package_title: string;
  destination: string;
  country?: string;
  duration_text?: string;
  travel_start_date?: string;
  travel_end_date?: string;
  package_category?: string;
  cover_image?: string;

  // Financial Breakdown
  billing_items: BillingItem[];
  subtotal: number;
  discount: number;
  taxes: number;
  additional_charges: number;
  total_package_price: number;
  amount_received: number;
  balance_due: number;
  payment_status:
    | "PAID IN FULL"
    | "PARTIALLY PAID"
    | "PAYMENT PENDING"
    | "REFUND PENDING"
    | "PARTIALLY REFUNDED"
    | "REFUNDED";
  payments: PaymentRecord[];

  // Terms & Inclusions
  services_included: string[];
  exclusions: string[];
  terms_and_conditions: string[];
  cancellation_policy?: string;
  refund_policy?: string;
  travel_instructions?: string;
  emergency_contact: string;

  // Authorization & Signatory
  authorized_signatory: {
    name: string;
    designation: string;
    company: string;
    stamp_url?: string;
    signature_url?: string;
  };

  issue_date: string;
  confirmation_date: string;
  verification_token: string;
  verification_url: string;
  receipt_status: "valid" | "revoked" | "cancelled";
  schema_version: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerReview {
  id: string;
  customer_name: string;
  avatar_url?: string;
  destination: string;
  rating: number;
  comment: string;
  travel_date: string;
  verified: boolean;
}

export interface TravelService {
  id: string;
  title: string;
  iconName: string;
  description: string;
  benefits: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "Mountains" | "Beaches" | "Nature" | "Cities" | "Adventure" | "Culture" | "Group Tours";
  image_url: string;
  location: string;
  featured?: boolean;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  parent_company?: string;
  owner?: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  business_hours: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

// --- TOUR EXPENSES & FINANCES ---
export type ExpenseCategory =
  | "Supplier Base Cost"
  | "Hotel & Resort"
  | "Flight Tickets"
  | "Cab & Transport"
  | "Sightseeing & Guides"
  | "Taxes & Facilitation"
  | "Miscellaneous";

export interface TourExpense {
  id: string;
  booking_id: string; // references Enquiry.id
  booking_ref: string; // e.g. YS-2026-1001
  customer_name: string;
  package_title: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paid_to?: string;
  payment_method?: "Bank Transfer" | "UPI" | "Cash" | "Card" | "Other" | string;
  date: string;
  status: "paid" | "pending";
  notes?: string;
  created_at: string;
}
