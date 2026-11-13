"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { travelService } from "@/services/travelService";
import { Destination, TripType } from "@/types";
import {
  MapPin,
  Plus,
  Search,
  Trash2,
  ExternalLink,
  X,
  Upload,
  ImageIcon,
  Edit2,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New/Edit Destination Form State
  const [editingDestinationId, setEditingDestinationId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [stateCountry, setStateCountry] = useState("");
  const [tripType, setTripType] = useState<TripType>("domestic");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
  );
  const [bestTime, setBestTime] = useState("October to March");
  const [startingPrice, setStartingPrice] = useState(15999);
  const [description, setDescription] = useState("");

  // Local Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const openCreateModal = () => {
    setEditingDestinationId(null);
    setName("");
    setStateCountry("");
    setTripType("domestic");
    setCoverImage(
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
    );
    setBestTime("October to March");
    setStartingPrice(15999);
    setDescription("");
    setUploadError("");
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const openEditModal = (dest: Destination) => {
    setEditingDestinationId(dest.id);
    setName(dest.name);
    setStateCountry(dest.state_or_country);
    setTripType(dest.trip_type);
    setCoverImage(dest.cover_image);
    setBestTime(dest.best_time);
    setStartingPrice(dest.starting_price || 15999);
    setDescription(dest.description);
    setUploadError("");
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    setUploadError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setCoverImage(data.url);
          setIsUploading(false);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDestinations = async () => {
    const list = await travelService.getDestinations();
    setDestinations(list);
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const filteredDestinations = destinations.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.state_or_country.toLowerCase().includes(q)
    );
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this destination?")) {
      await travelService.deleteDestination(id);
      await loadDestinations();
    }
  };

  const handleSaveDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    if (editingDestinationId) {
      const existing = destinations.find((d) => d.id === editingDestinationId);
      if (existing) {
        const updatedDest: Destination = {
          ...existing,
          name,
          state_or_country: stateCountry || "India",
          trip_type: tripType,
          description,
          cover_image: coverImage,
          best_time: bestTime,
          starting_price: startingPrice,
        };
        await travelService.saveDestination(updatedDest);
      }
    } else {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const newDest: Destination = {
        id: `dest-${Date.now()}`,
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        state_or_country: stateCountry || "India",
        trip_type: tripType,
        description,
        cover_image: coverImage,
        best_time: bestTime,
        attractions: ["Scenic Viewpoints", "Heritage Sites", "Local Markets"],
        activities: ["Guided Sightseeing", "Photography Tour", "Local Culinary Walk"],
        featured: true,
        package_count: 1,
        starting_price: startingPrice,
      };

      await travelService.saveDestination(newDest);
    }

    setIsModalOpen(false);
    setName("");
    setDescription("");
    setEditingDestinationId(null);
    await loadDestinations();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
            Destination Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
            Manage destination guides, attractions, and seasonal advice.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-brand-borderGrey shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-brand-grey absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations by name or state..."
            className="w-full bg-brand-offWhite rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-brand-charcoal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl border border-brand-borderGrey shadow-card overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-brand-offWhite">
                <Image
                  src={dest.cover_image}
                  alt={dest.name}
                  fill
                  unoptimized={true}
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider">
                  {dest.trip_type}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-brand-charcoal">
                  {dest.name}
                </h3>
                <p className="text-xs text-brand-grey font-medium mb-2">{dest.state_or_country}</p>
                <p className="text-xs text-brand-grey line-clamp-2 leading-relaxed">
                  {dest.description}
                </p>

                <div className="mt-4 pt-3 border-t border-brand-borderGrey flex items-center justify-between text-xs">
                  <span className="text-brand-grey font-medium">Starting Price:</span>
                  <span className="font-extrabold text-brand-charcoal">
                    {dest.starting_price ? formatCurrency(dest.starting_price) : "Custom"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-offWhite border-t border-brand-borderGrey flex items-center justify-between">
              <a
                href={`/destinations/${dest.slug}`}
                target="_blank"
                className="text-xs font-bold text-brand-deepRed hover:underline flex items-center gap-1"
              >
                <span>Live Guide</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditModal(dest)}
                  className="text-xs font-bold text-brand-charcoal hover:text-brand-red flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(dest.id)}
                  className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-brand-borderGrey shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-brand-borderGrey mb-6">
              <h3 className="font-heading font-extrabold text-lg text-brand-charcoal">
                {editingDestinationId ? "Edit Destination" : "Add New Destination"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-brand-grey hover:text-brand-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Destination Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Manali"
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    State / Country
                  </label>
                  <input
                    type="text"
                    value={stateCountry}
                    onChange={(e) => setStateCountry(e.target.value)}
                    placeholder="e.g. Himachal Pradesh, India"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                    Scope
                  </label>
                  <select
                    value={tripType}
                    onChange={(e) => setTripType(e.target.value as TripType)}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Best Time to Visit
                </label>
                <input
                  type="text"
                  value={bestTime}
                  onChange={(e) => setBestTime(e.target.value)}
                  placeholder="e.g. Oct to Mar"
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey">
                    Cover Photo
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-semibold text-brand-red hover:underline"
                  >
                    {showUrlInput ? "Hide Web URL" : "Enter Image URL"}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <div className="bg-brand-offWhite rounded-2xl p-3 border border-brand-borderGrey flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-brand-borderGrey/50 shrink-0 border border-brand-borderGrey">
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-grey">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-brand-borderGrey hover:border-brand-red/40 text-brand-charcoal hover:text-brand-red text-xs font-bold shadow-sm transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 text-brand-red" />
                          <span>
                            {isUploading
                              ? "Uploading..."
                              : "Choose Photo from Local Library"}
                          </span>
                        </button>

                        {coverImage && (
                          <button
                            type="button"
                            onClick={() => setCoverImage("")}
                            className="p-2 rounded-xl text-brand-grey hover:text-brand-red hover:bg-white transition-colors"
                            title="Remove photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-grey mt-1 truncate">
                        {coverImage
                          ? coverImage.startsWith("data:")
                            ? "Local photo selected from device"
                            : coverImage.startsWith("/uploads/")
                            ? "Uploaded to local library"
                            : coverImage
                          : "Upload JPG, PNG, or WebP from your local files"}
                      </p>
                    </div>
                  </div>

                  {showUrlInput && (
                    <div className="pt-2 border-t border-brand-borderGrey/70">
                      <label className="block text-[10px] font-bold uppercase text-brand-grey mb-1">
                        Direct Image URL Link
                      </label>
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white rounded-xl p-2.5 text-xs font-semibold border border-brand-borderGrey focus:outline-none focus:ring-1 focus:ring-brand-red"
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-[11px] text-red-600 font-semibold">{uploadError}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-grey mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Scenic highlights and travel essence..."
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-brand-grey"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold shadow-md hover:bg-brand-deepRed"
                >
                  {editingDestinationId ? "Save Changes" : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
