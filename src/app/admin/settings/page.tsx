"use client";

import React, { useState, useEffect } from "react";
import { travelService } from "@/services/travelService";
import { SiteSettings } from "@/types";
import { Settings, Save, CheckCircle2, ShieldCheck, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await travelService.getSiteSettings();
      setSettings(data);
    }
    load();
  }, []);

  if (!settings) {
    return <div className="p-8">Loading settings...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await travelService.updateSiteSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
          Website Settings
        </h1>
        <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
          Update public agency contact numbers, business hours, and social media handles.
        </p>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Settings saved successfully and updated across public website!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-borderGrey shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
              Brand Name
            </label>
            <input
              type="text"
              value={settings.brand_name}
              onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
              className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
              Official Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>

        {/* Corporate Ownership & Parent Group */}
        <div className="p-4 rounded-2xl bg-brand-offWhite/80 border border-brand-borderGrey space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-red" />
            <h3 className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-charcoal">
              Corporate Ownership & Group Entity
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                Parent Group / Company
              </label>
              <input
                type="text"
                value={settings.parent_company || "Velora Group of Resorts and hotels"}
                onChange={(e) => setSettings({ ...settings, parent_company: e.target.value })}
                className="w-full bg-white rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                placeholder="Velora Group of Resorts and hotels"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                Company Owner / Founder
              </label>
              <input
                type="text"
                value={settings.owner || "Deven Vanzara"}
                onChange={(e) => setSettings({ ...settings, owner: e.target.value })}
                className="w-full bg-white rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                placeholder="Deven Vanzara"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
              Primary Phone
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
              WhatsApp Direct Number
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
              Support Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
            Registered Office Address
          </label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
            Business & Support Hours
          </label>
          <input
            type="text"
            value={settings.business_hours}
            onChange={(e) => setSettings({ ...settings, business_hours: e.target.value })}
            className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
          />
        </div>

        <div className="pt-4 border-t border-brand-borderGrey flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
