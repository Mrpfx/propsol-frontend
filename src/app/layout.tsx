import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Prop SOL - Get Your Prop Firm Account Passed",
  description: "Get your prop firm account passed within 30 days. Guaranteed results or 100% refund.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

import { Toaster } from "react-hot-toast";
import { TawkToChat } from "@/components/TawkToChat";
import GlobalBanner from "@/components/layout/GlobalBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        <TawkToChat />
        <GlobalBanner />
        {children}
      </body>
    </html>
  );
}
