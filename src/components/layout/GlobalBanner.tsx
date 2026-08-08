"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { bannerService, Banner } from "@/services/banner.service";
import { X, ArrowRight } from "lucide-react";

export default function GlobalBanner() {
  const pathname = usePathname();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await bannerService.getActive();
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    })();
  }, []);

  if (pathname?.startsWith("/admin") || !isVisible || banners.length === 0) {
    return null;
  }

  const activeBanner = banners[0];

  return (
    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-3 shadow-md z-[60]">
      <div className="container mx-auto flex items-center justify-center text-center text-sm font-medium">
        <div className="flex flex-col sm:flex-row items-center gap-2 max-w-[85%] sm:max-w-[90%]">
          <span className="text-xs sm:text-sm">{activeBanner.text}</span>
          {activeBanner.link && (
            <a
              href={activeBanner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors text-xs whitespace-nowrap mt-1 sm:mt-0"
            >
              Learn More <ArrowRight className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        aria-label="Close banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
