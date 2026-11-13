"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { travelService } from "@/services/travelService";
import { GalleryItem } from "@/types";
import {
  Camera,
  Plus,
  Trash2,
  MapPin,
  X,
  Edit2,
  Upload,
  ImageIcon,
} from "lucide-react";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<any>("Mountains");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
  );

  // Local Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const loadGallery = async () => {
    const list = await travelService.getGallery();
    setItems(list);
  };

  useEffect(() => {
    loadGallery();
  }, []);

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
          setImageUrl(data.url);
          setIsUploading(false);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingItemId(null);
    setTitle("");
    setCategory("Mountains");
    setLocation("");
    setImageUrl(
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1200&auto=format&fit=crop"
    );
    setUploadError("");
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setLocation(item.location);
    setImageUrl(item.image_url);
    setUploadError("");
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    if (editingItemId) {
      const existing = items.find((i) => i.id === editingItemId);
      if (existing) {
        const updated: GalleryItem = {
          ...existing,
          title,
          category,
          location: location || "India",
          image_url: imageUrl,
        };
        await travelService.saveGalleryItem(updated);
      }
    } else {
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title,
        category,
        location: location || "India",
        image_url: imageUrl,
      };
      await travelService.saveGalleryItem(newItem);
    }

    setIsModalOpen(false);
    setTitle("");
    setLocation("");
    setEditingItemId(null);
    await loadGallery();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Remove this photograph from gallery?")) {
      await travelService.deleteGalleryItem(id);
      await loadGallery();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-brand-charcoal">
            Photo Gallery Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-grey mt-0.5">
            Manage inspiring travel photographs and destination previews.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-deepRed text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative h-64 rounded-2xl overflow-hidden bg-white border border-brand-borderGrey shadow-card"
          >
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              unoptimized={true}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-softRed block">
                {item.category}
              </span>
              <h4 className="font-heading font-bold text-sm text-white line-clamp-1">{item.title}</h4>
              <p className="text-[11px] text-white/80 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-red" />
                <span>{item.location}</span>
              </p>
            </div>

            {/* Edit & Delete Action Buttons */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <button
                onClick={() => openEditModal(item)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-brand-red text-white transition-colors"
                title="Edit photo"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 rounded-full bg-black/60 hover:bg-rose-600 text-white transition-colors"
                title="Delete photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-brand-borderGrey shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-brand-borderGrey mb-6">
              <h3 className="font-heading font-extrabold text-lg text-brand-charcoal">
                {editingItemId ? "Edit Photo Details" : "Add Photo to Gallery"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-brand-grey hover:text-brand-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-brand-grey mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Shikara at Dal Lake"
                  className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  >
                    <option value="Mountains">Mountains</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Nature">Nature</option>
                    <option value="Cities">Cities</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Group Tours">Group Tours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-grey mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kashmir"
                    className="w-full bg-brand-offWhite rounded-xl p-3 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Local Photo Library Upload + Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-brand-grey">
                    Photograph
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
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-grey">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-brand-borderGrey hover:border-brand-red/40 text-brand-charcoal hover:text-brand-red text-xs font-bold shadow-sm transition-all"
                      >
                        <Upload className="w-3.5 h-3.5 text-brand-red" />
                        <span>
                          {isUploading
                            ? "Uploading..."
                            : "Choose Photo from Library"}
                        </span>
                      </button>

                      <p className="text-[11px] text-brand-grey mt-1 truncate">
                        {imageUrl
                          ? imageUrl.startsWith("data:")
                            ? "Local photo selected"
                            : imageUrl.startsWith("/uploads/")
                            ? "Uploaded file"
                            : imageUrl
                          : "Upload from computer/phone"}
                      </p>
                    </div>
                  </div>

                  {showUrlInput && (
                    <div className="pt-2 border-t border-brand-borderGrey/70">
                      <label className="block text-[10px] font-bold uppercase text-brand-grey mb-1">
                        Direct Image URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white rounded-xl p-2.5 text-xs font-semibold border border-brand-borderGrey focus:outline-none focus:ring-1 focus:ring-brand-red"
                      />
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-[11px] text-red-600 font-semibold">{uploadError}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-brand-grey hover:text-brand-charcoal"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-brand-red text-white text-xs font-bold hover:bg-brand-deepRed shadow-md transition-all"
                >
                  {editingItemId ? "Save Changes" : "Save Photo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
