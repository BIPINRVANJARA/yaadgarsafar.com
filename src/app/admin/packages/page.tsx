"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { travelService } from "@/services/travelService";
import { TourPackage, TripCategory, TripType } from "@/types";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  ExternalLink,
  MapPin,
  Clock,
  Upload,
  ImageIcon,
  Copy,
  Eye,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  Archive,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { PackageFormModal } from "@/components/admin/PackageFormModal";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals & Action State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [packageToEdit, setPackageToEdit] = useState<TourPackage | null>(null);
  const [deleteConfirmPkg, setDeleteConfirmPkg] = useState<TourPackage | null>(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const loadPackages = async () => {
    setLoading(true);
    try {
      const list = await travelService.getPackages({ status: "all" });
      setPackages(list);
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // Filter & Sort
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        Boolean(pkg.title && pkg.title.toLowerCase().includes(q)) ||
        Boolean(pkg.destination_name && pkg.destination_name.toLowerCase().includes(q)) ||
        Boolean(pkg.category && pkg.category.toLowerCase().includes(q));

      const matchesCategory = categoryFilter === "all" || pkg.category === categoryFilter;
      const matchesDestination =
        destinationFilter === "all" ||
        Boolean(
          pkg.destination_name &&
            pkg.destination_name.toLowerCase() === destinationFilter.toLowerCase()
        );
      const matchesStatus = statusFilter === "all" || pkg.status === statusFilter;

      return matchesSearch && matchesCategory && matchesDestination && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sortBy === "duration") return (a.duration_days || 0) - (b.duration_days || 0);
      // newest
      const timeB = b.created_at ? new Date(b.created_at).getTime() || 0 : 0;
      const timeA = a.created_at ? new Date(a.created_at).getTime() || 0 : 0;
      return timeB - timeA;
    });
  }, [packages, search, categoryFilter, destinationFilter, statusFilter, sortBy]);

  // Unique destinations for filter dropdown
  const uniqueDestinations = useMemo(() => {
    const set = new Set<string>();
    packages.forEach((p) => {
      if (p.destination_name) set.add(p.destination_name);
    });
    return Array.from(set);
  }, [packages]);

  // Metrics
  const metrics = useMemo(() => {
    const total = packages.length;
    const published = packages.filter((p) => p.status === "published").length;
    const draft = packages.filter((p) => p.status === "draft").length;
    const archived = packages.filter((p) => p.status === "archived").length;
    const destinationsCount = uniqueDestinations.length;
    return { total, published, draft, archived, destinationsCount };
  }, [packages, uniqueDestinations]);

  // Pagination
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage) || 1;
  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPackages.slice(start, start + itemsPerPage);
  }, [filteredPackages, currentPage]);

  // Actions
  const handleOpenCreate = () => {
    setPackageToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (pkg: TourPackage) => {
    setPackageToEdit(pkg);
    setIsFormModalOpen(true);
  };

  const handleDuplicate = async (pkg: TourPackage) => {
    try {
      const dup = await travelService.duplicatePackage(pkg.id);
      if (dup) {
        showToast(`Duplicated "${pkg.title}" as draft!`);
        await loadPackages();
      }
    } catch (err: any) {
      alert("Error duplicating package: " + err.message);
    }
  };

  const handleTogglePublish = async (pkg: TourPackage) => {
    const nextStatus = pkg.status === "published" ? "draft" : "published";
    try {
      await travelService.savePackage({ ...pkg, status: nextStatus });
      showToast(`Package marked as ${nextStatus}!`);
      await loadPackages();
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    }
  };

  const handleArchive = async (pkg: TourPackage) => {
    try {
      await travelService.savePackage({ ...pkg, status: "archived" });
      showToast(`Package "${pkg.title}" archived!`);
      await loadPackages();
    } catch (err: any) {
      alert("Failed to archive: " + err.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmPkg) return;
    try {
      await travelService.deletePackage(deleteConfirmPkg.id);
      showToast(`Package "${deleteConfirmPkg.title}" deleted.`);
      setDeleteConfirmPkg(null);
      await loadPackages();
    } catch (err: any) {
      alert("Failed to delete package: " + err.message);
    }
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
            <Sparkles className="w-4 h-4" />
            YaadgaarSafar Tour Engineering
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
            Tour Package Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage MakeMyTrip-sourced & proprietary packages, confidential supplier margins, and rich itineraries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadPackages}
            title="Refresh Packages"
            className="p-2.5 rounded-xl border border-gray-200 text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs sm:text-sm font-bold hover:bg-red-700 transition flex items-center gap-2 shadow-lg shadow-brand-red/25"
          >
            <Plus className="w-4 h-4" />
            Create Tour Package
          </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Packages</span>
            <Package className="w-4 h-4 text-brand-red" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-slate-900 mt-2">
            {metrics.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Active Catalog</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-emerald-700 mt-2">
            {metrics.published}
          </div>
          <div className="text-[11px] text-emerald-600/70 mt-0.5">Live on Website</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Drafts</span>
            <Edit2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-amber-800 mt-2">
            {metrics.draft}
          </div>
          <div className="text-[11px] text-amber-600/70 mt-0.5">Pending Review</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold">
            <span>Archived</span>
            <Archive className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-slate-700 mt-2">
            {metrics.archived}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Seasonal Off-Market</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-blue-700 text-xs font-semibold">
            <span>Destinations</span>
            <MapPin className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-blue-900 mt-2">
            {metrics.destinationsCount}
          </div>
          <div className="text-[11px] text-blue-600/70 mt-0.5">Covered Locations</div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, destination, category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-brand-red focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
            <option value="archived">Archived Only</option>
          </select>

          {/* Destination Filter */}
          <select
            value={destinationFilter}
            onChange={(e) => {
              setDestinationFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All Destinations</option>
            {uniqueDestinations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All Categories</option>
            <option value="family">Family Vacations</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="adventure">Adventure</option>
            <option value="luxury">Luxury</option>
            <option value="budget">Budget</option>
            <option value="group">Group Tours</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white text-slate-700 font-medium"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="duration">Duration (Days)</option>
          </select>
        </div>
      </div>

      {/* PACKAGES TABLE */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Price / Basis</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-red mx-auto mb-2" />
                    <span>Loading tour packages...</span>
                  </td>
                </tr>
              ) : paginatedPackages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                    <Package className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-semibold text-sm">No tour packages match your filters</p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setCategoryFilter("all");
                        setDestinationFilter("all");
                        setStatusFilter("all");
                      }}
                      className="text-xs text-brand-red font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/80 transition group">
                    {/* PACKAGE TITLE & COVER */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image
                            src={pkg.cover_image || "/images/placeholder.jpg"}
                            alt={pkg.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-brand-red transition line-clamp-1">
                            {pkg.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span className="capitalize">{pkg.category}</span>
                            <span>•</span>
                            <span>{pkg.trip_type === "international" ? "International" : "Domestic"}</span>
                            {pkg.badge && (
                              <>
                                <span>•</span>
                                <span className="text-brand-red font-semibold">{pkg.badge}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* DESTINATION */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{pkg.destination_name}</span>
                      </div>
                    </td>

                    {/* DURATION */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {pkg.duration_days}D / {pkg.duration_nights}N
                        </span>
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="py-3.5 px-4">
                      {pkg.pricing_display_mode === "separate" && pkg.couple_final_price && pkg.family_final_price ? (
                        <div>
                          <div className="font-heading font-extrabold text-slate-900 text-xs flex items-center gap-1">
                            <span className="text-rose-700">C: {formatCurrency(pkg.couple_final_price)}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-700">F: {formatCurrency(pkg.family_final_price)}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <span>Couple & Family</span>
                            {pkg.discount_enabled && (
                              <span className="text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                                {pkg.discount_type === "fixed" ? `₹${pkg.discount_value} OFF` : `${pkg.discount_value}% OFF`}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          {pkg.discount_enabled && pkg.original_price && pkg.original_price > (pkg.price || 0) && (
                            <div className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(pkg.original_price)}
                            </div>
                          )}
                          <div className="font-heading font-extrabold text-slate-900 text-sm flex items-center gap-1">
                            <span>{formatCurrency(pkg.price)}</span>
                            {pkg.discount_enabled && (
                              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                {pkg.discount_type === "fixed" ? `₹${pkg.discount_value}` : `${pkg.discount_value}%`}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {pkg.pricing_basis || "per person"}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* STATUS BADGE */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1",
                          pkg.status === "published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : pkg.status === "draft"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-gray-100 text-slate-600 border border-gray-200"
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            pkg.status === "published"
                              ? "bg-emerald-600"
                              : pkg.status === "draft"
                              ? "bg-amber-600"
                              : "bg-slate-400"
                          )}
                        />
                        {pkg.status}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/packages/${pkg.slug}`}
                          target="_blank"
                          title="View on Public Website"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(pkg)}
                          title="Edit Package"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(pkg)}
                          title="Duplicate Package"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTogglePublish(pkg)}
                          title={pkg.status === "published" ? "Unpublish to Draft" : "Publish to Live"}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleArchive(pkg)}
                          title="Archive Package"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        >
                          <Archive className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmPkg(pkg)}
                          title="Delete Package"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-50 border-t border-gray-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredPackages.length)} of{" "}
              {filteredPackages.length} packages
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-semibold"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg font-bold transition",
                    currentPage === i + 1
                      ? "bg-brand-red text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50 text-slate-700"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* PACKAGE EDIT / CREATE MODAL */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        packageToEdit={packageToEdit}
        onClose={() => {
          setIsFormModalOpen(false);
          setPackageToEdit(null);
        }}
        onSuccess={loadPackages}
      />

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Delete Tour Package?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete <strong>{deleteConfirmPkg.title}</strong>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmPkg(null)}
                className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-slate-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition shadow-md shadow-red-600/30"
              >
                Delete Package
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
