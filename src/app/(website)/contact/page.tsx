"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitted(true);
  };

  return (
    <div className="pt-28 pb-20 bg-brand-offWhite min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red bg-brand-softRed px-3.5 py-1.5 rounded-full mb-3 inline-block">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-brand-charcoal tracking-tight">
            Contact YaadgarSafar
          </h1>
          <p className="mt-4 text-sm sm:text-base text-brand-grey leading-relaxed">
            Have questions about a holiday package or need help with a customized itinerary? We are here to assist you 6 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information & Channels */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-brand-borderGrey shadow-card space-y-6">
              <h3 className="font-heading font-extrabold text-xl text-brand-charcoal pb-4 border-b border-brand-borderGrey">
                Direct Contact Channels
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-grey uppercase tracking-wider block">
                    Phone Enquiries
                  </span>
                  <a
                    href="tel:+919876543210"
                    className="text-base font-bold text-brand-charcoal hover:text-brand-red transition-colors"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-xs text-brand-grey mt-0.5">Mon - Sat: 9:00 AM - 8:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-grey uppercase tracking-wider block">
                    Instant WhatsApp
                  </span>
                  <a
                    href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-[#128C7E] hover:underline"
                  >
                    +91 98765 43210
                  </a>
                  <p className="text-xs text-brand-grey mt-0.5">Quick responses under 15 mins</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-grey uppercase tracking-wider block">
                    Email Support
                  </span>
                  <a
                    href="mailto:hello@yaadgarsafar.com"
                    className="text-base font-bold text-brand-charcoal hover:text-brand-red transition-colors"
                  >
                    hello@yaadgarsafar.com
                  </a>
                  <p className="text-xs text-brand-grey mt-0.5">Quotes & Itinerary Requests</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-softRed text-brand-red flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-brand-grey uppercase tracking-wider block">
                    Registered Office
                  </span>
                  <p className="text-sm font-semibold text-brand-charcoal">
                    104, Royal Palms Business Center, MG Road, New Delhi, India
                  </p>
                  <p className="text-[11px] text-brand-grey mt-1">
                    A Unit of <strong>Velora Group of Resorts and hotels</strong> • Owned by <strong>Deven Vanzara</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Assurance */}
            <div className="bg-brand-darkNavy text-white rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-brand-red" />
                <h4 className="font-heading font-bold text-sm">Dedicated Tour Manager</h4>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                When you book with YaadgarSafar, a personal holiday manager is assigned to coordinate your trip from check-in to checkout.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-brand-borderGrey shadow-premium">
              <h2 className="text-2xl font-heading font-extrabold text-brand-charcoal mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-brand-grey mb-8">
                Fill out the form below and our travel desk will reach out to you promptly.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                  <h3 className="text-xl font-heading font-bold">Message Sent Successfully!</h3>
                  <p className="text-sm mt-2 text-emerald-700">
                    Thank you, {name}. A member of our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-brand-offWhite rounded-xl p-3 text-xs sm:text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-brand-offWhite rounded-xl p-3 text-xs sm:text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full bg-brand-offWhite rounded-xl p-3 text-xs sm:text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Kashmir Tour in December"
                        className="w-full bg-brand-offWhite rounded-xl p-3 text-xs sm:text-sm font-semibold text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                      Your Message or Requirements
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your travel dates, group size, and any specific requirements..."
                      className="w-full bg-brand-offWhite rounded-xl p-3 text-xs sm:text-sm text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white font-heading font-bold text-sm px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
