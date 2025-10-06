"use client";

import { useState, useEffect } from "react";
import { AdSenseAd } from "./adsense-ad";
import { DummyAd } from "./dummy-ad";

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
				{/* Always show AdSense ad container */}
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

				{/* Show dummy ad as fallback */}
				{(showFallback || !isAdSenseLoaded) && (
					<DummyAd variant="banner" className="w-full" />
				)}
			</div>
		</div>
	);
}
