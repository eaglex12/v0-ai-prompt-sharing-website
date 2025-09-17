"use client"

import { AdSenseAd } from "./adsense-ad"

interface BannerAdProps {
  className?: string
  adSlot?: string
}

export function BannerAd({ className = "", adSlot = "banner-ad-slot" }: BannerAdProps) {
  return (
    <div className={`w-full flex justify-center my-4 ${className}`}>
      <div className="w-full max-w-4xl">
        <AdSenseAd
          adSlot={adSlot}
          adFormat="auto"
          adStyle={{ 
            display: "block",
            width: "100%",
            height: "90px"
          }}
          className="w-full"
        />
      </div>
    </div>
  )
}
