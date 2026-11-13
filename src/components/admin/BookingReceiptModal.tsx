"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { Enquiry, PaymentRecord } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { travelService } from "@/services/travelService";
import {
  Printer,
  Share2,
  X,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  FileText,
  Clock,
  Download,
} from "lucide-react";

interface BookingReceiptModalProps {
  enquiry: Enquiry;
  onClose: () => void;
  onUpdate?: () => void;
}

export const BookingReceiptModal: React.FC<BookingReceiptModalProps> = ({
  enquiry,
  onClose,
  onUpdate,
}) => {
  const [mounted, setMounted] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // STABLE SEQUENTIAL RECEIPT NUMBER
  const receiptNo = useMemo(() => {
    if (enquiry.receipt_number) return enquiry.receipt_number;
    const year = new Date().getFullYear();
    const cleanDigits = enquiry.reference_number.replace(/[^0-9]/g, "");
    const seq = cleanDigits.slice(-4) || "1001";
    return `YS-REC-${year}-${seq}`;
  }, [enquiry.receipt_number, enquiry.reference_number]);

  // STABLE DETERMINISTIC VERIFICATION TOKEN & URL (NEVER CHANGES ON RE-RENDER)
  const verificationToken = useMemo(() => {
    return (
      enquiry.receipt_id ||
      `TOK-${enquiry.reference_number.replace(/[^a-zA-Z0-9]/g, "")}`
    );
  }, [enquiry.reference_number, enquiry.receipt_id]);

  const verificationUrl = useMemo(() => {
    return `https://yaadgarsafar.com/verify?ref=${encodeURIComponent(
      enquiry.reference_number
    )}&rec=${encodeURIComponent(receiptNo)}&token=${encodeURIComponent(verificationToken)}`;
  }, [enquiry.reference_number, receiptNo, verificationToken]);

  // Pricing & Breakdown
  const totalAmount = enquiry.total_amount || 25000;

  // Payments List
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      transaction_id: `TXN-${enquiry.reference_number.replace(/[^0-9]/g, "").slice(-4) || "7821"}-01`,
      payment_date: enquiry.confirmation_date
        ? new Date(enquiry.confirmation_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
      payment_method: (enquiry.payment_method as any) || "UPI",
      amount: enquiry.amount_paid ?? totalAmount,
      status: "SUCCESS",
      reference: "Advance Booking Token Confirmation",
    },
  ]);

  // New Payment Form State
  const [newPayTxn, setNewPayTxn] = useState("");
  const [newPayMethod, setNewPayMethod] = useState<any>("UPI");
  const [newPayAmount, setNewPayAmount] = useState<number>(5000);
  const [newPayRef, setNewPayRef] = useState("Balance Settlement");

  // Sum of payments
  const totalReceived = useMemo(() => {
    return payments
      .filter((p) => p.status === "SUCCESS")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const balanceDue = Math.max(0, totalAmount - totalReceived);

  // Auto Payment Status calculation
  const paymentStatus = useMemo(() => {
    if (totalReceived >= totalAmount) return "PAID IN FULL";
    if (totalReceived > 0) return "PARTIALLY PAID";
    return "PAYMENT PENDING";
  }, [totalReceived, totalAmount]);

  const issueDate = useMemo(() => {
    return enquiry.confirmation_date
      ? new Date(enquiry.confirmation_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }, [enquiry.confirmation_date]);

  const defaultServices = [
    "Deluxe Hotel / Houseboat Accommodation with Daily Breakfast",
    "Private Air-Conditioned Dedicated Vehicle & Chauffeur throughout",
    "Airport / Station Pickup & Departure Transfers",
    "All Sightseeing Excursions, Toll Taxes, Parking & Driver Allowances",
    "24/7 Priority Tour Assistance by Velora Group Operations Team",
  ];

  const services =
    enquiry.services_included && enquiry.services_included.length > 0
      ? enquiry.services_included
      : defaultServices;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate QR Code ONLY ONCE - stable verificationUrl guarantees no re-generation
  useEffect(() => {
    let isCancelled = false;
    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(verificationUrl, {
          width: 260,
          margin: 1,
          errorCorrectionLevel: "M",
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        });
        if (!isCancelled) {
          setQrCodeUrl(url);
        }
      } catch (err) {
        console.error("QR Code error:", err);
      }
    }
    generateQR();
    return () => {
      isCancelled = true;
    };
  }, [verificationUrl]);

  // HIGH-SPEED, NON-BLOCKING PRINT & PDF GENERATOR
  // Uses dedicated print window to avoid browser freeze/lag and prevent blank white output
  const handlePrint = () => {
    const printContent = document.getElementById("booking-receipt-print");
    if (!printContent) {
      window.print();
      return;
    }

    try {
      const printWindow = window.open("", "_blank", "width=850,height=1000");
      if (!printWindow) {
        window.print();
        return;
      }

      printWindow.document.open();
      printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Receipt_${receiptNo}_${enquiry.customer_name.replace(/[^a-zA-Z0-9]/g, "_")}</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap">
  <style>
    @page { size: A4 portrait; margin: 8mm 10mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px 28px;
      background: #ffffff !important;
      color: #0f172a !important;
      line-height: 1.35;
      font-size: 11px;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 6px 10px; }
    .bg-slate-50 { background-color: #f8fafc !important; }
    .bg-slate-100 { background-color: #f1f5f9 !important; }
    .bg-emerald-100 { background-color: #d1fae5 !important; }
    .text-emerald-800 { color: #065f46 !important; }
    .text-emerald-700 { color: #047857 !important; }
    .text-brand-red, .text-red-600 { color: #F20D18 !important; }
    .text-brand-deepRed { color: #c00811 !important; }
    .bg-brand-softRed { background-color: #fff1f2 !important; }
    .border-brand-red { border-color: #F20D18 !important; }
    .border-slate-900 { border-color: #0f172a !important; }
    .border-slate-200 { border-color: #e2e8f0 !important; }
    .border-slate-300 { border-color: #cbd5e1 !important; }
    .font-extrabold { font-weight: 800; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .uppercase { text-transform: uppercase; }
    .text-xs { font-size: 11px; }
    .text-sm { font-size: 13px; }
    .text-base { font-size: 15px; }
    .text-2xl { font-size: 22px; }
    .text-3xl { font-size: 26px; }
    .rounded-2xl { border-radius: 12px; }
    .rounded-xl { border-radius: 8px; }
    .rounded-lg { border-radius: 6px; }
    .rounded-full { border-radius: 9999px; }
    .p-4 { padding: 12px; }
    .p-3 { padding: 8px; }
    .p-6 { padding: 16px; }
    .space-y-2 > * + * { margin-top: 8px; }
    .space-y-4 > * + * { margin-top: 14px; }
    .space-y-5 > * + * { margin-top: 16px; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .gap-4 { gap: 14px; }
    .gap-2 { gap: 8px; }
    .grid { display: grid; }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
  </style>
</head>
<body>
  ${printContent.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
        window.close();
      }, 200);
    };
  </script>
</body>
</html>`);
      printWindow.document.close();
    } catch {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${enquiry.customer_name}! 🌟\n\nYour tour package booking with YaadgaarSafar.com is *CONFIRMED*!\n\n📄 *Receipt No:* ${receiptNo}\n🔖 *Booking Ref:* ${enquiry.reference_number}\n📍 *Destination:* ${enquiry.destination}\n👥 *Guests:* ${enquiry.adults} Adults${enquiry.children > 0 ? `, ${enquiry.children} Children` : ""}\n💰 *Total Package Price:* ${formatCurrency(totalAmount)}\n💳 *Amount Received:* ${formatCurrency(totalReceived)}\n⚖️ *Balance Due:* ${formatCurrency(balanceDue)}\n✅ *Status:* ${paymentStatus}\n\n🔍 *Verify Authentic Digital Certificate:* ${verificationUrl}\n\n🏢 *A Unit of Velora Group of Resorts & Hotels*\n👤 *Owned & Managed by Deven Vanzara*\n📞 Support: +91 98251 23456\n\nThank you for choosing YaadgaarSafar.com!`
    );
    window.open(`https://wa.me/${enquiry.phone.replace(/[^0-9]/g, "")}?text=${text}`, "_blank");
  };

  const handleAddPayment = async () => {
    if (newPayAmount <= 0) return;
    setIsSaving(true);
    const newRecord: PaymentRecord = {
      transaction_id: newPayTxn.trim() || `TXN-${Date.now().toString().slice(-6)}`,
      payment_date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      payment_method: newPayMethod,
      amount: Number(newPayAmount),
      status: "SUCCESS",
      reference: newPayRef.trim() || "Payment recorded by admin",
    };

    const updatedPayments = [...payments, newRecord];
    setPayments(updatedPayments);

    const updatedReceived = updatedPayments.reduce((s, p) => s + p.amount, 0);

    const updatedEnquiry: Enquiry = {
      ...enquiry,
      receipt_number: receiptNo,
      amount_paid: updatedReceived,
      payment_status: updatedReceived >= totalAmount ? "paid" : "partially_paid",
      updated_at: new Date().toISOString(),
    };

    try {
      await travelService.saveEnquiry(updatedEnquiry);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Failed to save enquiry payment:", err);
    } finally {
      setIsSaving(false);
      setShowAddPayment(false);
      setNewPayTxn("");
      setNewPayAmount(1000);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      id="booking-receipt-portal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div
        id="booking-receipt-modal-card"
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* TOP MODAL CONTROLS BAR (Hidden during Print) */}
        <div className="print-controls px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-white block">
                Booking Receipt & Invoice Generator
              </span>
              <span className="text-[11px] text-slate-400">
                Receipt #{receiptNo} • Ref: {enquiry.reference_number}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddPayment(!showAddPayment)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Payment</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-brand-red hover:bg-red-700 text-xs font-bold text-white shadow-md shadow-brand-red/30 transition hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-xs font-bold text-white shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* RECORD PAYMENT PANEL (ADMIN EXPANDABLE) */}
        {showAddPayment && (
          <div className="print-controls bg-blue-50 border-b border-blue-200 p-4 shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-blue-700" />
                Add New Payment Transaction Against Booking
              </h4>
              <button
                onClick={() => setShowAddPayment(false)}
                className="text-xs text-blue-700 hover:underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-bold text-blue-900">Transaction ID</label>
                <input
                  type="text"
                  value={newPayTxn}
                  onChange={(e) => setNewPayTxn(e.target.value)}
                  placeholder="e.g. UPI-99882143"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-blue-900">Payment Method</label>
                <select
                  value={newPayMethod}
                  onChange={(e) => setNewPayMethod(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white"
                >
                  <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Card">Debit / Credit Card</option>
                  <option value="Other">Other Mode</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-blue-900">Amount (₹)</label>
                <input
                  type="number"
                  min={1}
                  value={newPayAmount}
                  onChange={(e) => setNewPayAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-blue-200 bg-white font-bold text-blue-950"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleAddPayment}
                  className="w-full py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isSaving ? "Saving..." : "Add to History"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRINTABLE RECEIPT CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto">
          <div
            id="booking-receipt-print"
            className="p-6 sm:p-10 text-slate-900 bg-white space-y-5"
          >
            {/* 1. RECEIPT HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">
              {/* Brand & Corporate Entity */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
                    Yaadgar<span className="text-brand-red">Safar</span>.com
                  </span>
                </div>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-bold text-brand-deepRed flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span>A Unit of Velora Group of Resorts and hotels</span>
                  </p>
                  <p className="font-semibold text-slate-800">
                    Owned & Managed by Deven Vanzara
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    402, SNS Arista, Vesu Main Road, Surat, Gujarat - 395007
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Phone: +91 98251 23456 • Email: bookings@yaadgarsafar.com • Web: yaadgarsafar.com
                  </p>
                </div>
              </div>

              {/* Status & Receipt Meta */}
              <div className="text-left sm:text-right space-y-1 shrink-0">
                <span
                  className={cn(
                    "inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-sm",
                    paymentStatus === "PAID IN FULL"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : paymentStatus === "PARTIALLY PAID"
                      ? "bg-amber-100 text-amber-900 border border-amber-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  )}
                >
                  {paymentStatus === "PAID IN FULL"
                    ? "Confirmed Booking Receipt"
                    : `${paymentStatus} Receipt`}
                </span>
                <p className="text-xs text-slate-500">
                  Receipt No:{" "}
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {receiptNo}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Booking Ref:{" "}
                  <span className="font-mono font-bold text-slate-800">
                    {enquiry.reference_number}
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Issue Date: <span className="font-semibold text-slate-800">{issueDate}</span>
                </p>
              </div>
            </div>

            {/* 2. CUSTOMER & TOUR SUMMARY GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Customer & Passenger Details
                </span>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">
                  {enquiry.customer_name}
                </h4>
                <p className="text-slate-600">Mobile: {enquiry.phone}</p>
                <p className="text-slate-600">Email: {enquiry.email || "bookings@yaadgarsafar.com"}</p>
                <p className="text-slate-600">
                  Departure City: <strong>{enquiry.departure_city || "Ahmedabad"}</strong>
                </p>
                <p className="text-slate-600">
                  Travelers:{" "}
                  <strong>
                    {enquiry.adults} Adults
                    {enquiry.children > 0 && `, ${enquiry.children} Children`}
                    {enquiry.infants ? `, ${enquiry.infants} Infants` : ""}
                  </strong>
                </p>
              </div>

              {/* Confirmed Tour Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Confirmed Tour Summary
                </span>
                <h4 className="font-heading font-extrabold text-sm text-slate-900">
                  {enquiry.package_title || `${enquiry.destination} Curated Holiday`}
                </h4>
                <p className="text-slate-600">
                  Destination: <strong>{enquiry.destination}</strong>
                </p>
                {enquiry.departure_date && (
                  <p className="text-slate-600">
                    Travel Dates:{" "}
                    <strong>
                      {enquiry.departure_date}
                      {enquiry.return_date && ` to ${enquiry.return_date}`}
                    </strong>
                  </p>
                )}
                <p className="text-slate-600">
                  Booking Status:{" "}
                  <strong className="text-emerald-700 uppercase">Confirmed & Reserved</strong>
                </p>
              </div>
            </div>

            {/* 3. ITEMIZED BILLING BREAKDOWN TABLE */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Billing & Package Breakdown
              </span>
              <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="py-2.5 px-4 text-left font-bold">Description of Services</th>
                    <th className="py-2.5 px-4 text-center font-bold">Quantity</th>
                    <th className="py-2.5 px-4 text-right font-bold">Unit Price</th>
                    <th className="py-2.5 px-4 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {enquiry.package_title || `${enquiry.destination} Tour Package`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Includes verified hotel accommodation, private transfers, daily breakfast & sightseeing circuit
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {enquiry.adults + (enquiry.children || 0)} Guests
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(Math.round(totalAmount / (enquiry.adults || 1)))}
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Financial Subtotals & Balance Due */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3">
                <div className="text-xs text-slate-500 space-y-0.5">
                  <p>
                    All rates inclusive of Goods & Services Tax (GST) & local facilitation fees.
                  </p>
                  <p>
                    Payment Terms: <strong>Advance confirmed via registered payment gateway / bank.</strong>
                  </p>
                </div>

                <div className="w-full sm:w-72 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1.5 shrink-0">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Taxes & Fees:</span>
                    <span className="font-semibold text-slate-900">Included (₹0)</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Package Price:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-emerald-700">
                    <span>Total Received:</span>
                    <span>{formatCurrency(totalReceived)}</span>
                  </div>
                  <div className="flex justify-between font-heading font-extrabold text-sm text-slate-900 pt-1.5 border-t border-slate-300">
                    <span>Balance Due:</span>
                    <span className={balanceDue > 0 ? "text-brand-red" : "text-emerald-700"}>
                      {formatCurrency(balanceDue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. PAYMENT TRANSACTION HISTORY TABLE */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Payment Transaction History ({payments.length} Recorded)
              </span>
              <table className="w-full text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 text-[11px]">
                  <tr>
                    <th className="py-2 px-3 text-left font-bold">Date</th>
                    <th className="py-2 px-3 text-left font-bold">Payment Method</th>
                    <th className="py-2 px-3 text-left font-bold">Transaction / Ref ID</th>
                    <th className="py-2 px-3 text-right font-bold">Amount Paid</th>
                    <th className="py-2 px-3 text-center font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {payments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-slate-600">{p.payment_date}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{p.payment_method}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{p.transaction_id}</td>
                      <td className="py-2 px-3 text-right font-extrabold text-emerald-700">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 5. SERVICES & INCLUSIONS */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Confirmed Inclusions & Hospitality Amenities
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                {services.map((svc, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-[11px]">{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. POLICIES & EMERGENCY NOTES */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
              <p>
                <strong>Cancellation Policy:</strong> Free cancellation up to 30 days prior to arrival. 50% refund between 15-29 days. Non-refundable within 14 days.
              </p>
              <p>
                <strong>Identification:</strong> Government-issued Photo ID (Aadhaar Card / Passport) is mandatory for check-in and local permit verification.
              </p>
              <p>
                <strong>24x7 Emergency Contact:</strong> +91 98251 23456 • operations@yaadgarsafar.com
              </p>
            </div>

            {/* 7. QR CODE & AUTHORIZED SIGNATORY */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              {/* QR Verification */}
              <div className="flex items-center gap-3">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Scan to Verify"
                    className="w-20 h-20 border border-slate-300 rounded-xl p-1 bg-white shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 border border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 text-[10px] text-slate-400">
                    Generating...
                  </div>
                )}
                <div className="text-[10px] text-slate-500 max-w-[260px]">
                  <p className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Digital Certificate QR Verification
                  </p>
                  <p className="mt-0.5 leading-snug">
                    Scan with any phone camera to verify this authentic certificate on yaadgarsafar.com.
                  </p>
                  <p className="font-mono text-[9px] text-slate-400 mt-1 truncate">
                    Ref: {enquiry.reference_number}
                  </p>
                </div>
              </div>

              {/* Corporate Seal & Authorized Signatory */}
              <div className="text-center sm:text-right space-y-0.5">
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-brand-softRed text-brand-deepRed text-[9px] font-bold uppercase tracking-wider border border-brand-red/20 mb-1">
                  Velora Hospitality Group Seal
                </div>
                <p className="font-heading font-extrabold text-sm text-slate-900">
                  Deven Vanzara
                </p>
                <p className="text-[10px] text-slate-600 font-semibold">
                  Founder & Managing Director
                </p>
                <p className="text-[9px] text-slate-400">
                  Velora Group of Resorts and hotels & YaadgaarSafar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION CONTROLS (Hidden during Print) */}
        <div className="print-controls p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-500">
            Receipt Status: <strong className="text-emerald-700">{paymentStatus}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold transition flex items-center gap-2 shadow-md shadow-brand-red/30"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold transition flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
