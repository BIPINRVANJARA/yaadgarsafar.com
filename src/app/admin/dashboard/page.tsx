"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { travelService } from "@/services/travelService";
import { Enquiry, TourPackage, Destination } from "@/types";
import {
  Inbox,
  Package,
  MapPin,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const [enqList, pkgList, destList] = await Promise.all([
        travelService.getEnquiries(),
        travelService.getPackages(),
        travelService.getDestinations(),
      ]);
      setEnquiries(enqList);
      setPackages(pkgList);
      setDestinations(destList);
      setLoading(false);
    }
    loadStats();
  }, []);

  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;
  const inProgressCount = enquiries.filter(
    (e) => e.status === "contacted" || e.status === "quotation_sent" || e.status === "follow_up"
  ).length;
  const confirmedCount = enquiries.filter((e) => e.status === "confirmed").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-brand-red text-white";
      case "contacted":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "quotation_sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
            Agency Overview
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
            Real-time tour enquiries, package activity, and traveller requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/packages"
            className="px-4 py-2 bg-white border border-brand-borderGrey hover:bg-brand-offWhite text-brand-charcoal text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            + Add Tour Package
          </Link>
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs font-bold rounded-xl shadow-md shadow-brand-red/20 transition-colors"
          >
            Manage Enquiries ({newEnquiriesCount} New)
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 border border-brand-borderGrey shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
              Total Enquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-softRed text-brand-red flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-brand-charcoal">
            {enquiries.length}
          </div>
          <p className="text-[11px] text-brand-grey mt-1">
            <span className="text-brand-red font-bold">{newEnquiriesCount} action required</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-borderGrey shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
              Active Packages
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-brand-charcoal">
            {packages.length}
          </div>
          <p className="text-[11px] text-brand-grey mt-1">Domestic & International circuits</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-borderGrey shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
              Destinations
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-brand-charcoal">
            {destinations.length}
          </div>
          <p className="text-[11px] text-brand-grey mt-1">Live destination guides</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brand-borderGrey shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-grey">
              Conversion Pipeline
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-heading font-extrabold text-emerald-600">
            {confirmedCount} Bookings
          </div>
          <p className="text-[11px] text-brand-grey mt-1">{inProgressCount} in quotation stage</p>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-brand-borderGrey shadow-sm overflow-hidden">
        <div className="p-6 border-b border-brand-borderGrey flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-brand-charcoal">
              Recent Tour Enquiries
            </h3>
            <p className="text-xs text-brand-grey">
              Direct customer requests from website forms & customized planners
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-brand-deepRed hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-offWhite text-brand-grey uppercase tracking-wider font-bold border-b border-brand-borderGrey">
              <tr>
                <th className="py-3 px-6">Reference</th>
                <th className="py-3 px-6">Customer Name</th>
                <th className="py-3 px-6">Destination</th>
                <th className="py-3 px-6">Phone / WhatsApp</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderGrey">
              {enquiries.slice(0, 6).map((enq) => (
                <tr key={enq.id} className="hover:bg-brand-offWhite/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-brand-charcoal">
                    {enq.reference_number}
                  </td>
                  <td className="py-4 px-6 font-semibold text-brand-charcoal">
                    {enq.customer_name}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-medium text-brand-charcoal">{enq.destination}</span>
                    {enq.package_title && (
                      <span className="text-[10px] text-brand-grey block truncate max-w-[180px]">
                        {enq.package_title}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#128C7E] font-bold hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{enq.phone}</span>
                    </a>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                        enq.status
                      )}`}
                    >
                      {enq.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-brand-grey">
                    {new Date(enq.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href="/admin/enquiries"
                      className="text-brand-deepRed hover:text-brand-red font-bold"
                    >
                      Manage →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
