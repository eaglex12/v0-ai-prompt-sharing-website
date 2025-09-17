"use client"

import { useEffect } from "react"

interface AdSenseAdProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  adStyle?: React.CSSProperties
  className?: string
  responsive?: boolean
}

export function AdSenseAd({ 
  adSlot, 
  adFormat = "auto", 
  adStyle = { display: "block" },
  className = "",
  responsive = true 
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== "undefined" && window.adsbygoogle) {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-2340577707616384"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  )
}
