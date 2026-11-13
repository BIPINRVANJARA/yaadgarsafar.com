"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { travelService } from "@/services/travelService";
import confetti from "canvas-confetti";
import {
  Sparkles,
  Send,
  CheckCircle2,
  Calendar,
  Users,
  MapPin,
  Compass,
  Hotel,
  ShieldCheck,
  MessageCircle,
  Clock,
  PhoneCall,
} from "lucide-react";
import { cn } from "@/lib/utils";

function CustomTripContent() {
  const searchParams = useSearchParams();
  const prefillDestination = searchParams.get("destination") || "";
  const prefillPackage = searchParams.get("package") || "";

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState(prefillDestination);
  const [departureCity, setDepartureCity] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budgetMin, setBudgetMin] = useState<number>(30000);
  const [budgetMax, setBudgetMax] = useState<number>(80000);
  const [accommodation, setAccommodation] = useState("4-Star Premium Resort");
  const [preferences, setPreferences] = useState<string[]>(["Sightseeing", "Relaxation"]);
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const travelPreferenceOptions = [
    "Sightseeing & Landmarks",
    "Family Vacation",
    "Honeymoon & Romantic",
    "Adventure & Thrills",
    "Relaxation & Spa",
    "Cultural & Heritage",
    "Pilgrimage & Spiritual",
    "Wildlife & Safari",
  ];

  const accommodationOptions = [
    "3-Star Comfort Hotels",
    "4-Star Premium Resorts",
    "5-Star Luxury & Palaces",
    "Boutique Heritage Havelis",
    "Private Pool Villas",
    "Authentic Houseboat / Camp",
  ];

  const togglePreference = (pref: string) => {
    if (preferences.includes(pref)) {
      setPreferences(preferences.filter((p) => p !== pref));
    } else {
      setPreferences([...preferences, pref]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !destination.trim()) {
      setErrorMessage("Please fill in your name, mobile number, and destination.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const created = await travelService.submitEnquiry({
        customer_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        destination: destination.trim(),
        package_title: prefillPackage || undefined,
        departure_city: departureCity.trim(),
        departure_date: departureDate || undefined,
        return_date: returnDate || undefined,
        adults,
        children,
        budget_min: budgetMin,
        budget_max: budgetMax,
        travel_preferences: preferences,
        accommodation_preference: accommodation,
        message: specialRequests.trim(),
      });

      setReferenceNumber(created.reference_number);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#F20D18", "#C90012", "#ffffff", "#ffccd2"],
      });
    } catch (err: any) {
      setErrorMessage("Failed to submit enquiry. Please try again or reach out directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Tailor-Made Journeys
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Plan Your Custom Holiday
          </h1>
          <p className="mt-3 text-sm sm:text-base text-brand-grey leading-relaxed">
            Tell us your travel vision, dates, and preferences. Our destination experts will craft a personalized day-by-day itinerary tailored just for you.
          </p>
        </div>

        {referenceNumber ? (
          /* Success Screen */
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-emerald-200 shadow-premium text-center max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
              Enquiry Received Successfully!
            </h2>

            <p className="mt-2 text-sm text-brand-grey leading-relaxed">
              Thank you, <span className="font-bold text-brand-charcoal">{fullName}</span>. Your custom travel request has been logged with our senior travel planning desk.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-brand-offWhite border border-brand-borderGrey inline-block">
              <span className="text-xs text-brand-grey block uppercase tracking-wider">
                Your Reference Number
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-brand-deepRed mt-1 block">
                {referenceNumber}
              </span>
            </div>

            <p className="mt-6 text-xs text-brand-grey">
              A travel consultant will contact you via phone / WhatsApp at{" "}
              <strong className="text-brand-charcoal">{phone}</strong> within a few hours with your complimentary customized itinerary and quote.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`https://wa.me/919876543210?text=Hi%20YaadgarSafar!%20I%20just%20submitted%20custom%20trip%20enquiry%20${referenceNumber}%20for%20${encodeURIComponent(destination)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-md transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Fast-Track on WhatsApp</span>
              </a>

              <button
                onClick={() => {
                  setReferenceNumber(null);
                  setFullName("");
                  setPhone("");
                  setEmail("");
                  setSpecialRequests("");
                }}
                className="text-xs font-bold text-brand-grey hover:text-brand-charcoal underline"
              >
                Submit Another Trip Request
              </button>
            </div>
          </div>
        ) : (
          /* Custom Trip Form */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-brand-borderGrey/80 shadow-premium space-y-10"
          >
            {/* Section 1: Destination & Basic Details */}
            <div>
              <h3 className="text-lg font-heading font-bold text-brand-charcoal mb-4 flex items-center gap-2 pb-2 border-b border-brand-borderGrey">
                <MapPin className="w-5 h-5 text-brand-red" />
                <span>1. Destination & Departure</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Dream Destination *
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Kashmir, Dubai, Kerala, Bali..."
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Departure City / Airport
                  </label>
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="e.g. Delhi, Mumbai, Bengaluru..."
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Approximate Departure Date
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Approximate Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Travellers & Accommodation */}
            <div>
              <h3 className="text-lg font-heading font-bold text-brand-charcoal mb-4 flex items-center gap-2 pb-2 border-b border-brand-borderGrey">
                <Users className="w-5 h-5 text-brand-red" />
                <span>2. Travellers & Accommodation Preference</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Number of Adults (12+ yrs)
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, "9+"].map((num) => (
                      <option key={num} value={Number(num) || 10}>
                        {num} {num === 1 ? "Adult" : "Adults"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Number of Children (0 - 11 yrs)
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Child" : "Children"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Stay Preference
                  </label>
                  <select
                    value={accommodation}
                    onChange={(e) => setAccommodation(e.target.value)}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none cursor-pointer"
                  >
                    {accommodationOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Travel Preferences & Style */}
            <div>
              <h3 className="text-lg font-heading font-bold text-brand-charcoal mb-4 flex items-center gap-2 pb-2 border-b border-brand-borderGrey">
                <Compass className="w-5 h-5 text-brand-red" />
                <span>3. What kind of experience are you looking for?</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {travelPreferenceOptions.map((pref) => {
                  const isSelected = preferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePreference(pref)}
                      className={cn(
                        "p-3 rounded-2xl text-xs font-bold border text-left transition-all",
                        isSelected
                          ? "bg-brand-softRed border-brand-red text-brand-deepRed shadow-sm"
                          : "bg-brand-offWhite border-brand-borderGrey text-brand-charcoal hover:bg-brand-borderGrey/60"
                      )}
                    >
                      <span>{pref}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 4: Contact Details */}
            <div>
              <h3 className="text-lg font-heading font-bold text-brand-charcoal mb-4 flex items-center gap-2 pb-2 border-b border-brand-borderGrey">
                <ShieldCheck className="w-5 h-5 text-brand-red" />
                <span>4. Your Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                  Special Requests, Dietary Needs or Must-Visit Sights
                </label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Vegetarian food required, senior citizens traveling, celebrate wedding anniversary..."
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-bold text-brand-deepRed bg-brand-softRed p-3 rounded-xl">
                {errorMessage}
              </p>
            )}

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-brand-grey">
                🔒 Your privacy is fully protected. No spam, only genuine travel proposals.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed disabled:opacity-50 text-white font-heading font-bold text-base px-10 py-4 rounded-full shadow-xl shadow-brand-red/30 transition-all transform hover:-translate-y-0.5"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? "Submitting Custom Trip..." : "Submit Travel Enquiry"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomTripPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-32 pb-20 text-center min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-red" />
        </div>
      }
    >
      <CustomTripContent />
    </Suspense>
  );
}
