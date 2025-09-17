"use client"

import { AdSenseAd } from "./adsense-ad"

interface SidebarAdProps {
  position: "left" | "right"
  className?: string
}

export function SidebarAd({ position, className = "" }: SidebarAdProps) {
  return (
    <div className={`hidden lg:block fixed ${position}-4 top-1/2 transform -translate-y-1/2 w-32 h-96 ${className}`}>
      <div className="w-full h-full bg-card rounded-lg border border-border overflow-hidden">
        <AdSenseAd
          adSlot={`${position === "left" ? "1234567890" : "0987654321"}`}
          adFormat="vertical"
          adStyle={{ 
            display: "block",
            width: "128px",
            height: "384px"
          }}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
