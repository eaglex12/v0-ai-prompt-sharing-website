"use client";

import { useState, useEffect } from "react";
import { AdSenseAd } from "./adsense-ad";
import { DummyAd } from "./dummy-ad";

interface EnhancedSidebarAdProps {
	position: "left" | "right";
	className?: string;
	fallbackDelay?: number; // milliseconds to wait before showing fallback
}

export function EnhancedSidebarAd({
	position,
	className = "",
	fallbackDelay = 3000,
}: EnhancedSidebarAdProps) {
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
		<div
			className={`hidden lg:block fixed ${position}-4 top-1/2 transform -translate-y-1/2 w-32 h-96 ${className}`}
		>
			<div className="w-full h-full">
				{/* Always show AdSense ad container */}
				<div
					className={
						showFallback || !isAdSenseLoaded
							? "hidden"
							: "block w-full h-full"
					}
				>
					<div className="w-full h-full bg-card rounded-lg border border-border overflow-hidden">
						<AdSenseAd
							adSlot={`${
								position === "left" ? "1234567890" : "0987654321"
							}`}
							adFormat="vertical"
							adStyle={{
								display: "block",
								width: "128px",
								height: "384px",
							}}
							className="w-full h-full"
						/>
					</div>
				</div>

				{/* Show dummy ad as fallback */}
				{(showFallback || !isAdSenseLoaded) && (
					<DummyAd variant="sidebar" className="w-full h-full" />
				)}
			</div>
		</div>
	);
}
