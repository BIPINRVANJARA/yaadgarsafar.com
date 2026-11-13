"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
  theme?: "light" | "dark" | "auto";
  size?: "sm" | "md" | "lg";
  href?: string;
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  className,
  theme = "auto",
  size = "md",
  href = "/",
}) => {
  const sizeClasses = {
    sm: {
      text: "text-lg md:text-xl",
      logo: 26,
      logoWrapper: "w-[26px] h-[26px]",
      gap: "gap-1.5",
    },
    md: {
      text: "text-xl md:text-2xl",
      logo: 32,
      logoWrapper: "w-8 h-8",
      gap: "gap-2",
    },
    lg: {
      text: "text-2xl md:text-3xl",
      logo: 40,
      logoWrapper: "w-10 h-10",
      gap: "gap-2.5",
    },
  };

  const currentSize = sizeClasses[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center font-heading font-extrabold tracking-tight select-none transition-transform hover:scale-[1.02] active:scale-[0.99]",
        currentSize.gap,
        className
      )}
    >
      {/* 1. Yaadgar */}
      <span
        className={cn(
          "transition-colors duration-200",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-brand-charcoal"
            : "text-current"
        )}
      >
        Yaadgar
      </span>

      {/* 2. Official Uploaded Logo between Yaadgar and Safar */}
      <span className={cn("relative inline-flex items-center justify-center shrink-0", currentSize.logoWrapper)}>
        <Image
          src="/logo/yaadgar-logo.png"
          alt="Yaadgar Safar Logo"
          width={currentSize.logo}
          height={currentSize.logo}
          className="object-contain rounded-md drop-shadow-sm hover:rotate-3 transition-transform duration-300"
          priority
        />
      </span>

      {/* 3. Safar.com */}
      <span
        className={cn(
          "transition-colors duration-200",
          theme === "dark"
            ? "text-white"
            : theme === "light"
            ? "text-brand-charcoal"
            : "text-current"
        )}
      >
        Safar<span className="text-brand-red">.com</span>
      </span>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-lg">
      {content}
    </Link>
  );
};
