"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { travelService } from "@/services/travelService";
import { Enquiry, TourExpense, ExpenseCategory } from "@/types";
import {
  WalletCards,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  Plane,
  Car,
  Ticket,
  Percent,
  Trash2,
  Eye,
  FileSpreadsheet,
  X,
  CreditCard,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { BookingReceiptModal } from "@/components/admin/BookingReceiptModal";

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "Supplier Base Cost",
  "Hotel & Resort",
  "Flight Tickets",
  "Cab & Transport",
  "Sightseeing & Guides",
  "Taxes & Facilitation",
  "Miscellaneous",
];

export default function AdminFinancesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [expenses, setExpenses] = useState<TourExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"bookings" | "expenses" | "insights">("bookings");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedBookingForExpense, setSelectedBookingForExpense] = useState<Enquiry | null>(null);
  const [viewingBreakdownBooking, setViewingBreakdownBooking] = useState<Enquiry | null>(null);
  const [receiptEnquiry, setReceiptEnquiry] = useState<Enquiry | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // New Expense Form State
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("Hotel & Resort");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expensePaidTo, setExpensePaidTo] = useState("");
  const [expensePaymentMethod, setExpensePaymentMethod] = useState("Bank Transfer");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenseStatus, setExpenseStatus] = useState<"paid" | "pending">("paid");
  const [expenseNotes, setExpenseNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [enqs, exps] = await Promise.all([
        travelService.getEnquiries(),
        travelService.getExpenses(),
      ]);
      setEnquiries(enqs);
      setExpenses(exps);
    } catch (err) {
      console.error("Failed to load financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter ONLY confirmed bookings (Customer Confirmed Tour Packages)
  const confirmedBookings = useMemo(() => {
    return enquiries.filter((e) => e.status === "confirmed");
  }, [enquiries]);

  // Aggregate Financials for each confirmed booking
  const bookingFinancials = useMemo(() => {
    return confirmedBookings.map((b) => {
      const bExpenses = expenses.filter(
        (exp) => exp.booking_id === b.id || exp.booking_ref === b.reference_number
      );
      const totalExpense = bExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
      const revenue = b.total_amount || 0;
      const amountPaid = b.amount_paid || 0;
      const balanceDue = Math.max(0, revenue - amountPaid);
      const netProfit = revenue - totalExpense;
      const marginPct = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

      return {
        booking: b,
        expenses: bExpenses,
        revenue,
        amountPaid,
        balanceDue,
        totalExpense,
        netProfit,
        marginPct,
      };
    });
  }, [confirmedBookings, expenses]);

  // Filtered booking financials
  const filteredBookingFinancials = useMemo(() => {
    return bookingFinancials.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        item.booking.customer_name.toLowerCase().includes(q) ||
        item.booking.reference_number.toLowerCase().includes(q) ||
        (item.booking.package_title && item.booking.package_title.toLowerCase().includes(q)) ||
        (item.booking.destination && item.booking.destination.toLowerCase().includes(q));

      const matchesPayment =
        paymentStatusFilter === "all" || item.booking.payment_status === paymentStatusFilter;

      return matchesSearch && matchesPayment;
    });
  }, [bookingFinancials, search, paymentStatusFilter]);

  // Filtered expense entries
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        exp.title.toLowerCase().includes(q) ||
        exp.customer_name.toLowerCase().includes(q) ||
        exp.booking_ref.toLowerCase().includes(q) ||
        (exp.paid_to && exp.paid_to.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, categoryFilter]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalGrossRevenue = bookingFinancials.reduce((sum, item) => sum + item.revenue, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalNetProfit = totalGrossRevenue - totalExpenses;
    const overallMargin =
      totalGrossRevenue > 0 ? Math.round((totalNetProfit / totalGrossRevenue) * 100) : 0;
    const totalCollected = bookingFinancials.reduce((sum, item) => sum + item.amountPaid, 0);
    const totalOutstanding = bookingFinancials.reduce((sum, item) => sum + item.balanceDue, 0);

    return {
      totalGrossRevenue,
      totalExpenses,
      totalNetProfit,
      overallMargin,
      totalCollected,
      totalOutstanding,
      confirmedCount: confirmedBookings.length,
    };
  }, [bookingFinancials, expenses, confirmedBookings]);

  // Handle Save Expense
  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingForExpense || expenseAmount <= 0) {
      alert("Please select a booking and enter a valid expense amount.");
      return;
    }

    const newExpense: TourExpense = {
      id: `exp-${Date.now()}`,
      booking_id: selectedBookingForExpense.id,
      booking_ref: selectedBookingForExpense.reference_number,
      customer_name: selectedBookingForExpense.customer_name,
      package_title: selectedBookingForExpense.package_title || selectedBookingForExpense.destination,
      category: expenseCategory,
      title: expenseTitle || `${expenseCategory} - ${selectedBookingForExpense.customer_name}`,
      amount: Number(expenseAmount),
      paid_to: expensePaidTo,
      payment_method: expensePaymentMethod,
      date: expenseDate,
      status: expenseStatus,
      notes: expenseNotes,
      created_at: new Date().toISOString(),
    };

    try {
      await travelService.saveExpense(newExpense);
      showToast(`Expense of ${formatCurrency(newExpense.amount)} recorded!`);
      setIsExpenseModalOpen(false);
      resetExpenseForm();
      await loadData();
    } catch (err: any) {
      alert("Failed to save expense: " + err.message);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await travelService.deleteExpense(expenseId);
      showToast("Expense record deleted.");
      await loadData();
    } catch (err: any) {
      alert("Failed to delete expense: " + err.message);
    }
  };

  const resetExpenseForm = () => {
    setExpenseTitle("");
    setExpenseCategory("Hotel & Resort");
    setExpenseAmount(0);
    setExpensePaidTo("");
    setExpenseNotes("");
    setSelectedBookingForExpense(null);
  };

  const openAddExpenseForBooking = (booking: Enquiry) => {
    setSelectedBookingForExpense(booking);
    setExpenseTitle("");
    setExpensePaidTo("");
    setExpenseAmount(0);
    setIsExpenseModalOpen(true);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Booking Reference",
      "Customer Name",
      "Package Title",
      "Destination",
      "Travel Date",
      "Selling Price (₹)",
      "Expenses (₹)",
      "Net Profit (₹)",
      "Margin (%)",
      "Amount Paid (₹)",
      "Balance Due (₹)",
      "Payment Status",
    ];

    const rows = bookingFinancials.map((item) => [
      item.booking.reference_number,
      `"${item.booking.customer_name}"`,
      `"${item.booking.package_title || item.booking.destination}"`,
      item.booking.destination,
      item.booking.departure_date || "N/A",
      item.revenue,
      item.totalExpense,
      item.netProfit,
      `${item.marginPct}%`,
      item.amountPaid,
      item.balanceDue,
      item.booking.payment_status || "PENDING",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `YaadgarSafar-Confirmed-Finances-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
            <WalletCards className="w-4 h-4" />
            Executive Financial Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Confirmed Packages & Finances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track revenue, supplier costs, direct tour expenses, receivables & net profit for confirmed customer packages.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl border border-gray-300 text-slate-700 hover:bg-slate-100 transition text-xs font-bold flex items-center gap-2 bg-white shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirmedBookings.length === 0) {
                alert("No confirmed customer bookings exist yet. Confirm an enquiry first!");
                return;
              }
              setSelectedBookingForExpense(confirmedBookings[0]);
              setIsExpenseModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-brand-red hover:bg-red-700 text-white transition text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-red/30"
          >
            <Plus className="w-4 h-4" />
            Record Tour Expense
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-heading">
            {formatCurrency(summaryMetrics.totalGrossRevenue)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Across {summaryMetrics.confirmedCount} confirmed tour package(s)
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-rose-600 font-heading">
            {formatCurrency(summaryMetrics.totalExpenses)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Suppliers, hotels, flights & cabs
          </p>
        </div>

        {/* Net Profit */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Net Profit</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 font-heading">
            {formatCurrency(summaryMetrics.totalNetProfit)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
            <span className="px-1.5 py-0.5 rounded bg-emerald-100">
              {summaryMetrics.overallMargin}% Margin
            </span>
          </div>
        </div>

        {/* Cash Collected */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Received</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 font-heading">
            {formatCurrency(summaryMetrics.totalCollected)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Cash collected from customers
          </p>
        </div>

        {/* Balance Due */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Outstanding</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600 font-heading">
            {formatCurrency(summaryMetrics.totalOutstanding)}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Pending customer collections
          </p>
        </div>
      </div>

      {/* NAVIGATION TABS & FILTER BAR */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2",
              activeTab === "bookings"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <Building className="w-3.5 h-3.5 text-brand-red" />
            Confirmed Packages ({confirmedBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("expenses")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2",
              activeTab === "expenses"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            Expense Ledger ({expenses.length})
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, ref, package..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
            />
          </div>

          {/* Payment Status Filter (for bookings tab) */}
          {activeTab === "bookings" && (
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-red focus:outline-none bg-white text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid in Full</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="pending">Pending</option>
            </select>
          )}

          {/* Category Filter (for expenses tab) */}
          {activeTab === "expenses" && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:ring-2 focus:ring-brand-red focus:outline-none bg-white text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Expense Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* TAB CONTENT 1: CONFIRMED TOUR BOOKINGS P&L */}
      {activeTab === "bookings" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredBookingFinancials.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Confirmed Packages Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Customer bookings marked as <strong>Confirmed</strong> in the Enquiries portal will automatically appear here with full earnings, expense, and profit accounting.
              </p>
              <Link
                href="/admin/enquiries"
                className="inline-block mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition"
              >
                Go to Enquiries Portal →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Customer & Package</th>
                    <th className="py-3.5 px-4 text-right">Selling Price</th>
                    <th className="py-3.5 px-4 text-right">Total Expenses</th>
                    <th className="py-3.5 px-4 text-right">Net Profit</th>
                    <th className="py-3.5 px-4 text-center">Margin</th>
                    <th className="py-3.5 px-4">Payment & Balance</th>
                    <th className="py-3.5 px-4 text-right">Financial Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookingFinancials.map((item) => (
                    <tr key={item.booking.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.booking.reference_number}
                        {item.booking.receipt_number && (
                          <span className="block text-[10px] text-emerald-600 font-sans font-medium mt-0.5">
                            Receipt: {item.booking.receipt_number}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-slate-900">{item.booking.customer_name}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                          {item.booking.package_title || item.booking.destination}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {item.booking.adults || 2} Adults • Date: {item.booking.departure_date || "Flexible"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-extrabold text-slate-900 text-sm whitespace-nowrap">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span className="font-bold text-rose-600">
                          {formatCurrency(item.totalExpense)}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {item.expenses.length} item(s) recorded
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <span
                          className={cn(
                            "font-extrabold text-sm",
                            item.netProfit >= 0 ? "text-emerald-700" : "text-red-700"
                          )}
                        >
                          {formatCurrency(item.netProfit)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            item.marginPct >= 15
                              ? "bg-emerald-100 text-emerald-800"
                              : item.marginPct > 0
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {item.marginPct}%
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider block w-fit mb-1",
                            item.booking.payment_status === "paid"
                              ? "bg-emerald-600 text-white"
                              : item.booking.payment_status === "partially_paid"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          )}
                        >
                          {item.booking.payment_status?.replace("_", " ") || "Pending"}
                        </span>
                        <span className="text-[11px] text-slate-600 block">
                          Paid: <strong>{formatCurrency(item.amountPaid)}</strong>
                        </span>
                        {item.balanceDue > 0 && (
                          <span className="text-[10px] text-amber-700 font-semibold block">
                            Due: {formatCurrency(item.balanceDue)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            title="Add Expense for this package"
                            onClick={() => openAddExpenseForBooking(item.booking)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3 text-brand-red" />
                            Add Expense
                          </button>
                          <button
                            type="button"
                            title="View Full P&L Breakdown"
                            onClick={() => setViewingBreakdownBooking(item.booking)}
                            className="p-1.5 rounded-lg border border-gray-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            title="Print / View Customer Digital Receipt"
                            onClick={() => {
                              setReceiptEnquiry(item.booking);
                              setIsReceiptModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: ALL EXPENSES LEDGER */}
      {activeTab === "expenses" && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {filteredExpenses.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <TrendingDown className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No Expenses Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tour expenses matched your category or search filter. Click "+ Record Tour Expense" above to add supplier, hotel or fleet payments.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Expense Title & Notes</th>
                    <th className="py-3.5 px-4">Booking Ref</th>
                    <th className="py-3.5 px-4">Paid To</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition group">
                      <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{exp.title}</p>
                        {exp.notes && (
                          <p className="text-[11px] text-slate-500 italic mt-0.5">{exp.notes}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        {exp.booking_ref}
                        <span className="block text-[10px] text-slate-400 font-sans">
                          {exp.customer_name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        {exp.paid_to || "Direct Vendor"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {exp.payment_method || "Bank Transfer"}
                      </td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 text-sm whitespace-nowrap">
                        {formatCurrency(exp.amount)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 transition"
                          title="Delete expense entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: RECORD / ADD EXPENSE */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-red text-white">
                  <TrendingDown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Record Tour Expense</h3>
                  <p className="text-xs text-slate-300">
                    Add vendor, supplier, or operational costs for confirmed packages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExpense} className="p-6 space-y-4 text-xs">
              {/* Linked Booking */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Confirmed Booking *</label>
                <select
                  value={selectedBookingForExpense?.id || ""}
                  onChange={(e) => {
                    const match = confirmedBookings.find((b) => b.id === e.target.value);
                    if (match) setSelectedBookingForExpense(match);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none bg-white font-medium"
                >
                  {confirmedBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.reference_number} — {b.customer_name} ({b.destination})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Category */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expense Category *</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none bg-white font-medium"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Amount (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={expenseAmount || ""}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    placeholder="e.g. 15000"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>
              </div>

              {/* Title / Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Expense Description *</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Sonamarg Resort 2 Nights / Innova Chauffeur Advance"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Paid To */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Paid To (Vendor/Hotel)</label>
                  <input
                    type="text"
                    value={expensePaidTo}
                    onChange={(e) => setExpensePaidTo(e.target.value)}
                    placeholder="e.g. Hotel Mountview / Driver Tariq"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Payment Method</label>
                  <select
                    value={expensePaymentMethod}
                    onChange={(e) => setExpensePaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none bg-white"
                  >
                    <option value="Bank Transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                    <option value="UPI">UPI / Google Pay / PhonePe</option>
                    <option value="Card">Credit / Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Payment Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Expense Status</label>
                  <select
                    value={expenseStatus}
                    onChange={(e) => setExpenseStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none bg-white font-semibold"
                  >
                    <option value="paid">Paid & Settled</option>
                    <option value="pending">Pending Payment</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Internal Reference / Notes</label>
                <textarea
                  rows={2}
                  value={expenseNotes}
                  onChange={(e) => setExpenseNotes(e.target.value)}
                  placeholder="Optional voucher number, invoice reference, or payment note..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-red hover:bg-red-700 text-white font-bold transition shadow-md shadow-brand-red/30"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW P&L FINANCIAL STATEMENT FOR A SPECIFIC BOOKING */}
      {viewingBreakdownBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/20 text-white">
                  Booking Financial Statement
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {viewingBreakdownBooking.reference_number} — {viewingBreakdownBooking.customer_name}
                </h3>
                <p className="text-xs text-slate-300">
                  {viewingBreakdownBooking.package_title || viewingBreakdownBooking.destination}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewingBreakdownBooking(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Financial Snapshot */}
              {(() => {
                const bExpenses = expenses.filter(
                  (exp) =>
                    exp.booking_id === viewingBreakdownBooking.id ||
                    exp.booking_ref === viewingBreakdownBooking.reference_number
                );
                const totalExp = bExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
                const rev = viewingBreakdownBooking.total_amount || 0;
                const profit = rev - totalExp;
                const margin = rev > 0 ? Math.round((profit / rev) * 100) : 0;

                return (
                  <>
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-semibold block text-[11px]">Selling Revenue</span>
                        <span className="text-lg font-extrabold text-slate-900 font-heading">
                          {formatCurrency(rev)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block text-[11px]">Total Expenses</span>
                        <span className="text-lg font-extrabold text-rose-600 font-heading">
                          {formatCurrency(totalExp)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold block text-[11px]">Net Earnings</span>
                        <span className="text-lg font-extrabold text-emerald-700 font-heading">
                          {formatCurrency(profit)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 ml-1">
                          ({margin}%)
                        </span>
                      </div>
                    </div>

                    {/* Expense Breakdown List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <TrendingDown className="w-4 h-4 text-rose-600" />
                          Itemized Tour Expenses ({bExpenses.length})
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBookingForExpense(viewingBreakdownBooking);
                            setIsExpenseModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-brand-red text-white text-[11px] font-bold hover:bg-red-700 transition"
                        >
                          + Add Expense
                        </button>
                      </div>

                      {bExpenses.length === 0 ? (
                        <p className="text-slate-400 italic py-4 text-center">
                          No direct expense line items recorded yet for this booking. Click &quot;Add Expense&quot; above to log hotel, flight, or transport costs.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {bExpenses.map((exp) => (
                            <div
                              key={exp.id}
                              className="p-3 rounded-xl border border-gray-200 flex items-center justify-between hover:bg-slate-50 transition"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                    {exp.category}
                                  </span>
                                  <span className="font-bold text-slate-900">{exp.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                  Paid to: <strong>{exp.paid_to || "Supplier"}</strong> • Method:{" "}
                                  {exp.payment_method} • Date: {exp.date}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-extrabold text-rose-600 text-sm">
                                  {formatCurrency(exp.amount)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExpense(exp.id)}
                                  className="text-slate-400 hover:text-red-600 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Customer Receivables Section */}
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900">Customer Collections & Balance</span>
                        <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase">
                          {viewingBreakdownBooking.payment_status || "PENDING"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500">Amount Paid by Customer:</span>
                          <span className="block font-bold text-slate-900">
                            {formatCurrency(viewingBreakdownBooking.amount_paid || 0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500">Remaining Balance Due:</span>
                          <span className="block font-bold text-amber-700">
                            {formatCurrency(
                              Math.max(
                                0,
                                (viewingBreakdownBooking.total_amount || 0) -
                                  (viewingBreakdownBooking.amount_paid || 0)
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setReceiptEnquiry(viewingBreakdownBooking);
                  setIsReceiptModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition flex items-center gap-1.5"
              >
                <Receipt className="w-3.5 h-3.5" />
                View Customer Digital Receipt
              </button>

              <button
                type="button"
                onClick={() => setViewingBreakdownBooking(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL RECEIPT MODAL INTEGRATION */}
      {receiptEnquiry && isReceiptModalOpen && (
        <BookingReceiptModal
          enquiry={receiptEnquiry}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setReceiptEnquiry(null);
          }}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}
