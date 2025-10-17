"use client";

import { useEffect, useState } from "react";
import { AdSenseAd } from "./adsense-ad";

interface PolicyCompliantAdProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  minContentHeight?: number; // Minimum content height before showing ads
  position?: "top" | "middle" | "bottom";
}

export function PolicyCompliantAd({
  adSlot,
  adFormat = "auto",
  className = "",
  minContentHeight = 500,
  position = "bottom"
}: PolicyCompliantAdProps) {
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  useEffect(() => {
    // Check if there's enough content to show ads
    const checkContentHeight = () => {
      const contentHeight = document.body.scrollHeight;
      setShouldShowAd(contentHeight >= minContentHeight);
    };

    // Initial check
    checkContentHeight();

    // Check on resize
    window.addEventListener('resize', checkContentHeight);
    
    return () => window.removeEventListener('resize', checkContentHeight);
  }, [minContentHeight]);

  useEffect(() => {
    // Track ad loading
    const timer = setTimeout(() => {
      setIsAdLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Don't show ads if there's insufficient content
  if (!shouldShowAd) {
    return null;
  }

  return (
    <div className={`policy-compliant-ad ${className}`}>
      {/* AdSense Ad */}
      <div className={isAdLoaded ? "block" : "hidden"}>
        <AdSenseAd
          adSlot={adSlot}
          adFormat={adFormat}
          adStyle={{ 
            display: "block", 
            width: "100%",
            minHeight: adFormat === "vertical" ? "250px" : "90px"
          }}
          className="w-full"
        />
      </div>

      {/* Loading placeholder */}
      {!isAdLoaded && (
        <div className="w-full h-24 bg-muted rounded-lg border border-border flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Advertisement</span>
        </div>
      )}
    </div>
  );
}
