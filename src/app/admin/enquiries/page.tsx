"use client";

import React, { useState, useEffect, useMemo } from "react";
import { travelService } from "@/services/travelService";
import { Enquiry, EnquiryStatus } from "@/types";
import {
  Inbox,
  Search,
  Filter,
  Download,
  MessageCircle,
  Phone,
  Mail,
  Calendar,
  Users,
  ChevronDown,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  FileText,
  Edit3,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Printer,
  Sparkles,
  X,
  Plus,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { BookingReceiptModal } from "@/components/admin/BookingReceiptModal";

const DEFAULT_SERVICES = [
  "Deluxe Hotel / Resort Accommodations with Daily Breakfast",
  "Private Air-Conditioned Dedicated Vehicle & Chauffeur",
  "Complete City Sightseeing Itinerary & Scenic Excursions",
  "24/7 Priority On-Tour WhatsApp Concierge Assistance",
  "All Toll Taxes, Parking, Fuel & Chauffeur Night Allowances",
  "Airport / Railway Station Welcome & Transfers",
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [newNote, setNewNote] = useState("");

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptEnquiry, setReceiptEnquiry] = useState<Enquiry | null>(null);

  // Edit Customer Form State
  const [editForm, setEditForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    destination: "",
    package_title: "",
    departure_date: "",
    adults: 2,
    children: 0,
    accommodation_preference: "",
    travel_preferences: "",
    message: "",
  });

  // Confirmation Form State
  const [confirmForm, setConfirmForm] = useState({
    total_amount: 25000,
    amount_paid: 25000,
    payment_method: "UPI (Google Pay / PhonePe / Paytm)",
    payment_status: "paid" as "paid" | "partially_paid" | "pending",
    services_included: [...DEFAULT_SERVICES],
    newCustomService: "",
  });

  const loadEnquiries = async () => {
    setLoading(true);
    const data = await travelService.getEnquiries();
    setEnquiries(data);
    if (selectedEnquiry) {
      const refreshed = data.find((e) => e.id === selectedEnquiry.id);
      if (refreshed) setSelectedEnquiry(refreshed);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEnquiries();

    // Live real-time subscription via Firebase Realtime Database
    const unsubscribe = travelService.subscribeToEnquiries((liveEnquiries) => {
      setEnquiries(liveEnquiries);
      if (selectedEnquiry) {
        const refreshed = liveEnquiries.find((e) => e.id === selectedEnquiry.id);
        if (refreshed) setSelectedEnquiry(refreshed);
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    enquiries.forEach((e) => {
      if (e.destination) set.add(e.destination);
    });
    return Array.from(set);
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (destinationFilter !== "all" && e.destination !== destinationFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          e.customer_name.toLowerCase().includes(q) ||
          e.reference_number.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, statusFilter, destinationFilter, search]);

  const handleStatusChange = async (enquiryId: string, newStatus: EnquiryStatus) => {
    if (newStatus === "confirmed") {
      openConfirmModal();
      return;
    }
    await travelService.updateEnquiryStatus(enquiryId, newStatus);
    await loadEnquiries();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !newNote.trim()) return;
    await travelService.updateEnquiryStatus(
      selectedEnquiry.id,
      selectedEnquiry.status,
      newNote.trim()
    );
    setNewNote("");
    await loadEnquiries();
  };

  // Open Edit Customer Details Modal
  const openEditModal = () => {
    if (!selectedEnquiry) return;
    setEditForm({
      customer_name: selectedEnquiry.customer_name || "",
      phone: selectedEnquiry.phone || "",
      email: selectedEnquiry.email || "",
      destination: selectedEnquiry.destination || "",
      package_title: selectedEnquiry.package_title || "",
      departure_date: selectedEnquiry.departure_date || "",
      adults: selectedEnquiry.adults || 2,
      children: selectedEnquiry.children || 0,
      accommodation_preference: selectedEnquiry.accommodation_preference || "",
      travel_preferences: selectedEnquiry.travel_preferences ? selectedEnquiry.travel_preferences.join(", ") : "",
      message: selectedEnquiry.message || "",
    });
    setIsEditModalOpen(true);
  };

  // Save Edited Customer Details
  const handleSaveCustomerDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const prefsArray = editForm.travel_preferences
      ? editForm.travel_preferences
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    const updated: Enquiry = {
      ...selectedEnquiry,
      customer_name: editForm.customer_name,
      phone: editForm.phone,
      email: editForm.email,
      destination: editForm.destination,
      package_title: editForm.package_title,
      departure_date: editForm.departure_date,
      adults: Number(editForm.adults),
      children: Number(editForm.children),
      accommodation_preference: editForm.accommodation_preference,
      travel_preferences: prefsArray,
      message: editForm.message,
      updated_at: new Date().toISOString(),
    };

    await travelService.saveEnquiry(updated);
    setSelectedEnquiry(updated);
    setIsEditModalOpen(false);
    await loadEnquiries();
  };

  // Open Confirmation Modal
  const openConfirmModal = () => {
    if (!selectedEnquiry) return;
    const existingTotal = selectedEnquiry.total_amount || 25000;
    const existingPaid = selectedEnquiry.amount_paid ?? existingTotal;
    setConfirmForm({
      total_amount: existingTotal,
      amount_paid: existingPaid,
      payment_method: selectedEnquiry.payment_method || "UPI (Google Pay / PhonePe / Paytm)",
      payment_status: selectedEnquiry.payment_status || (existingPaid >= existingTotal ? "paid" : "partially_paid"),
      services_included:
        selectedEnquiry.services_included && selectedEnquiry.services_included.length > 0
          ? [...selectedEnquiry.services_included]
          : [...DEFAULT_SERVICES],
      newCustomService: "",
    });
    setIsConfirmModalOpen(true);
  };

  // Toggle or add service inclusion
  const toggleServiceInclusion = (service: string) => {
    setConfirmForm((prev) => {
      const exists = prev.services_included.includes(service);
      return {
        ...prev,
        services_included: exists
          ? prev.services_included.filter((s) => s !== service)
          : [...prev.services_included, service],
      };
    });
  };

  const handleAddCustomService = () => {
    if (!confirmForm.newCustomService.trim()) return;
    setConfirmForm((prev) => ({
      ...prev,
      services_included: [...prev.services_included, prev.newCustomService.trim()],
      newCustomService: "",
    }));
  };

  // Handle Submit Booking Confirmation & Generate Receipt
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    const receiptNo =
      selectedEnquiry.receipt_number ||
      `YS-REC-${selectedEnquiry.reference_number.replace("YS-", "")}`;

    const confirmedEnquiry: Enquiry = {
      ...selectedEnquiry,
      status: "confirmed",
      total_amount: Number(confirmForm.total_amount),
      amount_paid: Number(confirmForm.amount_paid),
      payment_method: confirmForm.payment_method,
      payment_status: confirmForm.payment_status,
      services_included: confirmForm.services_included,
      confirmation_date: selectedEnquiry.confirmation_date || new Date().toISOString(),
      receipt_number: receiptNo,
      updated_at: new Date().toISOString(),
    };

    await travelService.saveEnquiry(confirmedEnquiry);
    setSelectedEnquiry(confirmedEnquiry);
    setIsConfirmModalOpen(false);
    await loadEnquiries();

    // Automatically open the PDF Receipt with QR code for viewing/printing
    setReceiptEnquiry(confirmedEnquiry);
    setIsReceiptModalOpen(true);
  };

  // View Receipt for an existing confirmed enquiry
  const handleViewReceipt = (enq: Enquiry) => {
    setReceiptEnquiry(enq);
    setIsReceiptModalOpen(true);
  };

  // CSV Export functionality
  const handleExportCSV = () => {
    const headers = [
      "Reference Number",
      "Customer Name",
      "Phone",
      "Email",
      "Destination",
      "Package Title",
      "Adults",
      "Children",
      "Status",
      "Total Amount",
      "Amount Paid",
      "Payment Method",
      "Receipt No",
      "Created At",
    ];

    const rows = filteredEnquiries.map((e) => [
      `"${e.reference_number}"`,
      `"${e.customer_name}"`,
      `"${e.phone}"`,
      `"${e.email || ""}"`,
      `"${e.destination}"`,
      `"${e.package_title || ""}"`,
      e.adults,
      e.children,
      `"${e.status}"`,
      e.total_amount || "",
      e.amount_paid || "",
      `"${e.payment_method || ""}"`,
      `"${e.receipt_number || ""}"`,
      `"${new Date(e.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `YaadgarSafar_Enquiries_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-brand-red text-white";
      case "contacted":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "quotation_sent":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "confirmed":
        return "bg-emerald-600 text-white font-bold shadow-sm";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-red bg-brand-softRed px-2.5 py-0.5 rounded-md">
              A Unit of Velora Group of Resorts and hotels
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
            Enquiry & Booking Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
            Review customer enquiries, edit details, confirm bookings, and issue QR-coded PDF receipts.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-white hover:bg-brand-offWhite text-brand-charcoal border border-brand-borderGrey text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-brand-red" />
          <span>Export Enquiries (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-borderGrey shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, ref no, phone, or destination..."
            className="w-full bg-brand-offWhite rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-brand-charcoal focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-offWhite border border-brand-borderGrey rounded-xl px-3 py-2 text-xs font-bold text-brand-charcoal focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">🔴 New Enquiries</option>
            <option value="contacted">🟡 Contacted</option>
            <option value="quotation_sent">🔵 Quotation Sent</option>
            <option value="confirmed">🟢 Confirmed Bookings</option>
            <option value="closed">Closed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="bg-brand-offWhite border border-brand-borderGrey rounded-xl px-3 py-2 text-xs font-bold text-brand-charcoal focus:outline-none cursor-pointer"
          >
            <option value="all">All Destinations</option>
            {uniqueDestinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table & Detail Drawer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Enquiries Table */}
        <div
          className={cn(
            "bg-white rounded-2xl border border-brand-borderGrey shadow-sm overflow-hidden",
            selectedEnquiry ? "lg:col-span-6 xl:col-span-7" : "lg:col-span-12"
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-offWhite text-brand-grey uppercase tracking-wider font-bold border-b border-brand-borderGrey">
                <tr>
                  <th className="py-3 px-4">Ref No</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderGrey">
                {filteredEnquiries.map((enq) => {
                  const isConfirmed = enq.status === "confirmed";
                  return (
                    <tr
                      key={enq.id}
                      onClick={() => setSelectedEnquiry(enq)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedEnquiry?.id === enq.id
                          ? "bg-brand-softRed/40"
                          : "hover:bg-brand-offWhite/60"
                      )}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-charcoal">
                        {enq.reference_number}
                        {isConfirmed && (
                          <span className="block text-[10px] text-emerald-600 font-sans font-semibold">
                            ✓ {enq.receipt_number || "Confirmed"}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-brand-charcoal">{enq.customer_name}</p>
                        <p className="text-[11px] text-brand-grey">{enq.phone}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-brand-charcoal">{enq.destination}</span>
                        {enq.package_title && (
                          <span className="text-[10px] text-brand-grey block truncate max-w-[150px]">
                            {enq.package_title}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadge(
                            enq.status
                          )}`}
                        >
                          {enq.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-grey">
                        {new Date(enq.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {isConfirmed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewReceipt(enq);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg border border-emerald-200 transition-colors"
                            title="View / Print PDF Receipt"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEnquiry(enq);
                          }}
                          className="text-xs font-bold text-brand-deepRed hover:underline"
                        >
                          Details ▾
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Enquiry Detailed Drawer */}
        {selectedEnquiry && (
          <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-2xl border border-brand-borderGrey shadow-xl p-6 space-y-6 animate-in fade-in duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-4 border-b border-brand-borderGrey">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-red">
                    {selectedEnquiry.reference_number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(
                      selectedEnquiry.status
                    )}`}
                  >
                    {selectedEnquiry.status.replace("_", " ")}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl text-brand-charcoal mt-1">
                  {selectedEnquiry.customer_name}
                </h3>
                <p className="text-xs text-brand-grey">
                  Enquiry logged on{" "}
                  {new Date(selectedEnquiry.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-xs font-bold text-brand-grey hover:text-brand-charcoal p-1.5 rounded-lg hover:bg-brand-offWhite"
              >
                ✕ Close
              </button>
            </div>

            {/* CONFIRMED BOOKING HERO BANNER & RECEIPT ACTIONS */}
            {selectedEnquiry.status === "confirmed" ? (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-white border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-heading font-extrabold text-emerald-950 uppercase tracking-wider">
                        Official Booking Confirmed
                      </h4>
                      <p className="text-[11px] font-mono text-emerald-700">
                        Receipt: {selectedEnquiry.receipt_number || "Generated"}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider">
                    {selectedEnquiry.payment_status?.replace("_", " ") || "Confirmed"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-emerald-100">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Total Package:</span>
                    <span className="font-extrabold text-brand-charcoal">
                      {formatCurrency(selectedEnquiry.total_amount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Payment Received:</span>
                    <span className="font-extrabold text-emerald-700">
                      {formatCurrency(selectedEnquiry.amount_paid ?? selectedEnquiry.total_amount ?? 0)}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
                    Mode: <strong className="text-slate-900">{selectedEnquiry.payment_method || "UPI"}</strong>
                  </div>
                </div>

                {/* Primary Action: View & Print PDF Receipt */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleViewReceipt(selectedEnquiry)}
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View & Print Receipt</span>
                  </button>

                  <button
                    onClick={openConfirmModal}
                    className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Payment / Services</span>
                  </button>
                </div>
              </div>
            ) : (
              /* DEDICATED SEPARATE OPTION TO CONFIRM THE INQUIRY */
              <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-charcoal to-slate-900 text-white shadow-lg space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white">
                      Confirm Customer Booking
                    </h4>
                    <p className="text-[11px] text-white/70">
                      Lock package pricing, payment mode & generate QR receipt
                    </p>
                  </div>
                </div>

                <button
                  onClick={openConfirmModal}
                  className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white py-3 px-4 rounded-xl text-xs font-bold shadow-md transition-all hover:scale-[1.01]"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Booking & Issue PDF Receipt</span>
                </button>
              </div>
            )}

            {/* Quick Status Workflow Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1.5">
                Update Status
              </label>
              <select
                value={selectedEnquiry.status}
                onChange={(e) =>
                  handleStatusChange(selectedEnquiry.id, e.target.value as EnquiryStatus)
                }
                className="w-full bg-brand-offWhite border border-brand-borderGrey rounded-xl p-2.5 text-xs font-bold text-brand-charcoal focus:outline-none cursor-pointer"
              >
                <option value="new">🔴 New (Needs Action)</option>
                <option value="contacted">🟡 Contacted Customer</option>
                <option value="quotation_sent">🔵 Quotation Sent</option>
                <option value="confirmed">🟢 Confirmed Booking (Generate Receipt)</option>
                <option value="closed">⚪ Closed</option>
                <option value="cancelled">❌ Cancelled</option>
              </select>
            </div>

            {/* Contact Actions */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                  selectedEnquiry.customer_name
                )},%20this%20is%20YaadgarSafar%20regarding%20your%20enquiry%20${selectedEnquiry.reference_number}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${selectedEnquiry.phone}`}
                className="flex items-center justify-center gap-1.5 bg-brand-charcoal hover:bg-black text-white py-2 px-3 rounded-xl text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Phone</span>
              </a>
            </div>

            {/* Customer & Trip Specs Card with Edit Button */}
            <div className="space-y-3 bg-brand-offWhite p-4 rounded-2xl text-xs border border-brand-borderGrey">
              <div className="flex items-center justify-between pb-2 border-b border-brand-borderGrey/60">
                <span className="font-heading font-extrabold uppercase text-[11px] tracking-wider text-brand-charcoal">
                  Customer & Trip Details
                </span>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-deepRed hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>

              <div className="flex justify-between">
                <span className="text-brand-grey">Customer Name:</span>
                <span className="font-bold text-brand-charcoal">{selectedEnquiry.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-grey">Phone:</span>
                <span className="font-bold text-brand-charcoal">{selectedEnquiry.phone}</span>
              </div>
              {selectedEnquiry.email && (
                <div className="flex justify-between">
                  <span className="text-brand-grey">Email:</span>
                  <span className="font-semibold text-brand-charcoal">{selectedEnquiry.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-grey">Destination:</span>
                <span className="font-bold text-brand-charcoal">{selectedEnquiry.destination}</span>
              </div>
              {selectedEnquiry.package_title && (
                <div className="flex justify-between">
                  <span className="text-brand-grey">Package:</span>
                  <span className="font-bold text-brand-charcoal text-right max-w-[200px]">
                    {selectedEnquiry.package_title}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-grey">Travellers:</span>
                <span className="font-bold text-brand-charcoal">
                  {selectedEnquiry.adults} Adults
                  {selectedEnquiry.children > 0 && `, ${selectedEnquiry.children} Children`}
                </span>
              </div>
              {selectedEnquiry.departure_date && (
                <div className="flex justify-between">
                  <span className="text-brand-grey">Approx Travel Dates:</span>
                  <span className="font-bold text-brand-charcoal">
                    {selectedEnquiry.departure_date}
                  </span>
                </div>
              )}
              {selectedEnquiry.accommodation_preference && (
                <div className="flex justify-between">
                  <span className="text-brand-grey">Stay Preference:</span>
                  <span className="font-bold text-brand-charcoal">
                    {selectedEnquiry.accommodation_preference}
                  </span>
                </div>
              )}
              {selectedEnquiry.travel_preferences && selectedEnquiry.travel_preferences.length > 0 && (
                <div>
                  <span className="text-brand-grey block mb-1">Preferences:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedEnquiry.travel_preferences.map((p, i) => (
                      <span
                        key={i}
                        className="bg-white px-2 py-0.5 rounded text-[10px] font-semibold border"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedEnquiry.message && (
                <div className="pt-2 border-t border-brand-borderGrey">
                  <span className="text-brand-grey block mb-0.5">Customer Message:</span>
                  <p className="text-brand-charcoal italic bg-white p-2.5 rounded-lg border border-brand-borderGrey/60">
                    "{selectedEnquiry.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-3 pt-3 border-t border-brand-borderGrey">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-grey">
                Internal Staff Notes & Activity
              </h4>

              <div className="max-h-32 overflow-y-auto space-y-2">
                {selectedEnquiry.internal_notes && selectedEnquiry.internal_notes.length > 0 ? (
                  selectedEnquiry.internal_notes.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-lg bg-brand-offWhite border border-brand-borderGrey text-[11px]"
                    >
                      <p className="font-medium text-brand-charcoal">{n.note}</p>
                      <p className="text-[10px] text-brand-grey mt-1">
                        {n.author} •{" "}
                        {new Date(n.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-brand-grey italic">No notes added yet.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add note (e.g. Sent PDF via WhatsApp)..."
                  className="w-full bg-brand-offWhite rounded-xl p-2.5 text-xs text-brand-charcoal focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 bg-brand-charcoal text-white rounded-xl text-xs font-bold hover:bg-black"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT CUSTOMER DETAILS MODAL                           */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-brand-borderGrey shadow-2xl space-y-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-borderGrey">
              <div>
                <h3 className="text-xl font-heading font-extrabold text-brand-charcoal">
                  Edit Customer & Enquiry Details
                </h3>
                <p className="text-xs text-brand-grey mt-0.5">
                  Update customer contact information, passenger count, dates, and requirements.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-grey hover:text-brand-charcoal hover:bg-brand-offWhite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomerDetails} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.customer_name}
                    onChange={(e) => setEditForm({ ...editForm, customer_name: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
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
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.destination}
                    onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Tour Package Title (Optional)
                </label>
                <input
                  type="text"
                  value={editForm.package_title}
                  onChange={(e) => setEditForm({ ...editForm, package_title: e.target.value })}
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  placeholder="e.g. Heavenly Kashmir: Gulmarg & Dal Lake Odyssey"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Travel Date / Month
                  </label>
                  <input
                    type="text"
                    value={editForm.departure_date}
                    onChange={(e) => setEditForm({ ...editForm, departure_date: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                    placeholder="e.g. 2026-12-25"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Adults (Ages 12+)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.adults}
                    onChange={(e) => setEditForm({ ...editForm, adults: parseInt(e.target.value) || 1 })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Children (Ages 2-11)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.children}
                    onChange={(e) => setEditForm({ ...editForm, children: parseInt(e.target.value) || 0 })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Stay / Hotel Preference
                  </label>
                  <input
                    type="text"
                    value={editForm.accommodation_preference}
                    onChange={(e) => setEditForm({ ...editForm, accommodation_preference: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                    placeholder="e.g. 4-Star Luxury Resort"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Travel Preferences (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editForm.travel_preferences}
                    onChange={(e) => setEditForm({ ...editForm, travel_preferences: e.target.value })}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                    placeholder="e.g. Honeymoon, Candlelight Dinner, Houseboat"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Customer Special Requirements / Message
                </label>
                <textarea
                  rows={3}
                  value={editForm.message}
                  onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red border border-brand-borderGrey"
                  placeholder="Notes from customer or itinerary requirements..."
                />
              </div>

              <div className="pt-4 border-t border-brand-borderGrey flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-borderGrey text-xs font-bold text-brand-charcoal hover:bg-brand-offWhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-deepRed text-white text-xs font-bold shadow-md transition-all"
                >
                  Save Customer Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: SEPARATE CONFIRMATION & PAYMENT / SERVICES MODAL      */}
      {/* ============================================================== */}
      {isConfirmModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-brand-borderGrey shadow-2xl space-y-6 my-6">
            <div className="flex items-center justify-between pb-3 border-b border-brand-borderGrey">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-extrabold text-brand-charcoal">
                    Confirm Booking & Generate Receipt
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Ref: <strong className="font-mono text-brand-charcoal">{selectedEnquiry.reference_number}</strong> • Guest: <strong>{selectedEnquiry.customer_name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-grey hover:text-brand-charcoal hover:bg-brand-offWhite"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-5">
              {/* Pricing & Advance Received */}
              <div className="p-4 rounded-2xl bg-brand-offWhite border border-brand-borderGrey space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-brand-charcoal flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-brand-red" />
                    Package Financials & Payment Status
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    Destination: {selectedEnquiry.destination}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                      Total Package Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={confirmForm.total_amount}
                      onChange={(e) =>
                        setConfirmForm({
                          ...confirmForm,
                          total_amount: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white rounded-xl p-3 text-sm font-extrabold text-brand-charcoal border border-brand-borderGrey focus:outline-none focus:ring-2 focus:ring-brand-red"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                      Amount Paid / Advance (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={confirmForm.amount_paid}
                      onChange={(e) =>
                        setConfirmForm({
                          ...confirmForm,
                          amount_paid: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white rounded-xl p-3 text-sm font-extrabold text-emerald-700 border border-brand-borderGrey focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Balance Due Live Calculation */}
                <div className="flex items-center justify-between text-xs bg-white px-4 py-2.5 rounded-xl border border-brand-borderGrey">
                  <span className="text-slate-600 font-medium">Calculated Balance Due:</span>
                  <span className="font-extrabold text-brand-charcoal text-sm">
                    {formatCurrency(Math.max(0, confirmForm.total_amount - confirmForm.amount_paid))}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                      Payment Method *
                    </label>
                    <select
                      value={confirmForm.payment_method}
                      onChange={(e) =>
                        setConfirmForm({ ...confirmForm, payment_method: e.target.value })
                      }
                      className="w-full bg-white rounded-xl p-3 text-xs font-bold text-brand-charcoal border border-brand-borderGrey focus:outline-none cursor-pointer"
                    >
                      <option value="UPI (Google Pay / PhonePe / Paytm)">UPI (Google Pay / PhonePe / Paytm)</option>
                      <option value="Bank Transfer (NEFT / RTGS / IMPS)">Bank Transfer (NEFT / RTGS / IMPS)</option>
                      <option value="Credit / Debit Card (Online Gateway)">Credit / Debit Card (Online Gateway)</option>
                      <option value="Cash / Direct Bank Deposit">Cash / Direct Bank Deposit</option>
                      <option value="Cheque / Draft">Cheque / Demand Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                      Payment Settlement Status *
                    </label>
                    <select
                      value={confirmForm.payment_status}
                      onChange={(e) =>
                        setConfirmForm({
                          ...confirmForm,
                          payment_status: e.target.value as "paid" | "partially_paid" | "pending",
                        })
                      }
                      className="w-full bg-white rounded-xl p-3 text-xs font-bold text-brand-charcoal border border-brand-borderGrey focus:outline-none cursor-pointer"
                    >
                      <option value="paid">Paid in Full (100% Received)</option>
                      <option value="partially_paid">Advance Received (Partial)</option>
                      <option value="pending">Payment Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Services Included Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-heading font-extrabold uppercase tracking-wider text-brand-charcoal">
                    Services Included in This Booking
                  </label>
                  <span className="text-[11px] text-brand-grey">
                    {confirmForm.services_included.length} items included
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-brand-offWhite border border-brand-borderGrey text-xs">
                  {DEFAULT_SERVICES.map((service, idx) => {
                    const isChecked = confirmForm.services_included.includes(service);
                    return (
                      <label
                        key={idx}
                        className={cn(
                          "flex items-start gap-2.5 p-2 rounded-xl cursor-pointer transition-colors",
                          isChecked ? "bg-white text-brand-charcoal shadow-xs" : "text-slate-400 hover:text-slate-700"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleServiceInclusion(service)}
                          className="mt-0.5 w-4 h-4 rounded text-brand-red focus:ring-brand-red cursor-pointer"
                        />
                        <span className="font-medium text-[11px]">{service}</span>
                      </label>
                    );
                  })}

                  {/* Any custom added services */}
                  {confirmForm.services_included
                    .filter((s) => !DEFAULT_SERVICES.includes(s))
                    .map((customService, idx) => (
                      <div
                        key={`custom-${idx}`}
                        className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200"
                      >
                        <span className="font-semibold text-[11px] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {customService}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleServiceInclusion(customService)}
                          className="text-red-500 hover:text-red-700 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>

                {/* Add Custom Inclusion */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={confirmForm.newCustomService}
                    onChange={(e) =>
                      setConfirmForm({ ...confirmForm, newCustomService: e.target.value })
                    }
                    placeholder="Add custom service (e.g. Complimentary Candlelight Dinner)..."
                    className="flex-1 bg-brand-offWhite rounded-xl p-2.5 text-xs focus:outline-none border border-brand-borderGrey"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomService}
                    className="px-3.5 py-2.5 bg-brand-charcoal hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Group & Legal Assurance */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3 text-[11px] text-slate-600">
                <Building2 className="w-5 h-5 text-brand-red shrink-0" />
                <p>
                  Receipt is issued under <strong>Velora Group of Resorts and hotels</strong>, digitally certified by <strong>Deven Vanzara</strong> with an encrypted QR Code.
                </p>
              </div>

              <div className="pt-4 border-t border-brand-borderGrey flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-brand-borderGrey text-xs font-bold text-brand-charcoal hover:bg-brand-offWhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Confirm & Generate Official Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: OFFICIAL PRINTABLE / DOWNLOADABLE PDF RECEIPT MODAL   */}
      {/* ============================================================== */}
      {isReceiptModalOpen && receiptEnquiry && (
        <BookingReceiptModal
          enquiry={receiptEnquiry}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setReceiptEnquiry(null);
          }}
          onUpdate={loadEnquiries}
        />
      )}
    </div>
  );
}