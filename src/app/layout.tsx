import type { Metadata } from "next";
import "./globals.css";
import { FirebaseAnalytics } from "@/components/common/FirebaseAnalytics";

export const metadata: Metadata = {
  title: "YaadgarSafar.com | Modern Travel Agency & Tour Management Platform",
  description:
    "Make Every Journey Memorable. Discover curated domestic India holiday packages and breathtaking international escapes with transparent planning, WhatsApp enquiries, and 24/7 travel assistance.",
  keywords: [
    "Yaadgar Safar",
    "Tour and Travel Agency",
    "Kashmir Tour Package",
    "Goa Vacation",
    "Dubai Holiday",
    "Kerala Houseboat Tour",
    "Rajasthan Desert Safari",
    "Bali Honeymoon",
  ],
  authors: [{ name: "YaadgarSafar.com" }],
  icons: {
    icon: "/logo/yaadgar-logo.png",
    apple: "/logo/yaadgar-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans text-brand-charcoal bg-white antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  );
}
