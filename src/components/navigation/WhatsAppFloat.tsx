"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export const WhatsAppFloat: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 group">
      {/* Tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-brand-charcoal text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl border border-brand-borderGrey animate-bounce duration-1000">
          <span>Need help planning your trip? Chat with us!</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-brand-grey hover:text-brand-charcoal p-0.5"
            aria-label="Close tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href="https://wa.me/919876543210?text=Hello%20YaadgarSafar!%20I%20would%20like%20to%20plan%20a%20tour%20package."
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-4 ring-[#25D366]/20 focus:outline-none focus:ring-4 focus:ring-brand-red"
        aria-label="Direct WhatsApp Enquiry"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
