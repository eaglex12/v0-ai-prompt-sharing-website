"use client";

import { useState, useEffect } from "react";
import { AdSenseAd } from "./adsense-ad";

interface EnhancedBannerAdProps {
	className?: string;
	adSlot?: string;
	fallbackDelay?: number; // milliseconds to wait before showing fallback
}

export function EnhancedBannerAd({
	className = "",
	adSlot = "banner-ad-slot",
	fallbackDelay = 3000,
}: EnhancedBannerAdProps) {
	const [showFallback, setShowFallback] = useState(false);

	useEffect(() => {
		// Show fallback ad after specified delay if AdSense doesn't load
		const timer = setTimeout(() => {
			setShowFallback(true);
		}, fallbackDelay);

		return () => clearTimeout(timer);
	}, [fallbackDelay]);

	// Check if AdSense is available and loaded
	const isAdSenseLoaded =
		typeof window !== "undefined" &&
		// @ts-ignore
		window.adsbygoogle &&
		// @ts-ignore
		window.adsbygoogle.length > 0;

	return (
		<div className={`w-full flex justify-center my-4 ${className}`}>
			<div className="w-full max-w-4xl">
				{/* Show AdSense ad only */}
				<div className={showFallback || !isAdSenseLoaded ? "hidden" : "block"}>
					<AdSenseAd
						adSlot={adSlot}
						adFormat="auto"
						adStyle={{
							display: "block",
							width: "100%",
							height: "90px",
						}}
						className="w-full"
					/>
				</div>

				{/* Show placeholder when AdSense doesn't load */}
				{(showFallback || !isAdSenseLoaded) && (
					<div className="w-full h-24 bg-muted rounded-lg border border-border flex items-center justify-center">
						<span className="text-muted-foreground text-sm">Advertisement</span>
					</div>
				)}
			</div>
		</div>
	);
}
