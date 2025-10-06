"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface DummyAdProps {
	variant?: "banner" | "sidebar" | "square" | "rectangle";
	className?: string;
	size?: "small" | "medium" | "large";
}

const dummyAds = [
	{
		title: "Boost Your AI Workflow",
		description: "Premium AI tools for professionals",
		cta: "Try Free",
		color: "from-blue-500 to-purple-600",
		icon: "🚀",
	},
	{
		title: "AI Prompt Templates",
		description: "1000+ ready-to-use prompts",
		cta: "Get Started",
		color: "from-green-500 to-teal-600",
		icon: "✨",
	},
	{
		title: "Creative AI Suite",
		description: "Design, write, and create with AI",
		cta: "Explore",
		color: "from-pink-500 to-rose-600",
		icon: "🎨",
	},
	{
		title: "AI Code Assistant",
		description: "Write better code faster",
		cta: "Download",
		color: "from-orange-500 to-red-600",
		icon: "💻",
	},
	{
		title: "Smart Analytics",
		description: "Track your AI usage & insights",
		cta: "Learn More",
		color: "from-indigo-500 to-blue-600",
		icon: "📊",
	},
];

export function DummyAd({
	variant = "banner",
	className = "",
	size = "medium",
}: DummyAdProps) {
	const [adData, setAdData] = useState(dummyAds[0]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		// Simulate loading delay
		const timer = setTimeout(() => {
			setIsLoaded(true);
		}, Math.random() * 1000 + 500);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		// Randomly select an ad
		const randomAd = dummyAds[Math.floor(Math.random() * dummyAds.length)];
		setAdData(randomAd);
	}, []);

	if (!isLoaded) {
		return (
			<div className={`animate-pulse bg-muted rounded-lg ${className}`}>
				<div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
				<div className="h-3 bg-muted-foreground/10 rounded w-1/2"></div>
			</div>
		);
	}

	const getVariantStyles = () => {
		switch (variant) {
			case "banner":
				return {
					container:
						"w-full h-24 md:h-20 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
					content: "flex items-center justify-between p-4 h-full",
					text: "flex-1",
					cta: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors",
				};
			case "sidebar":
				return {
					container:
						"w-32 h-96 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
					content:
						"flex flex-col items-center justify-center p-4 h-full text-center",
					text: "mb-4",
					cta: "bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md text-xs font-medium transition-colors",
				};
			case "square":
				return {
					container:
						"w-64 h-64 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
					content:
						"flex flex-col items-center justify-center p-6 h-full text-center",
					text: "mb-4",
					cta: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors",
				};
			case "rectangle":
				return {
					container:
						"w-full h-32 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
					content: "flex items-center p-4 h-full",
					text: "flex-1 ml-4",
					cta: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors",
				};
			default:
				return {
					container:
						"w-full h-24 rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
					content: "flex items-center justify-between p-4 h-full",
					text: "flex-1",
					cta: "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors",
				};
		}
	};

	const styles = getVariantStyles();

	const handleClick = () => {
		// Simulate ad click
		console.log(`Ad clicked: ${adData.title}`);
		// You could add analytics tracking here
	};

	return (
		<div className={`${styles.container} ${className}`} onClick={handleClick}>
			<div className={`bg-gradient-to-r ${adData.color} p-1`}>
				<div className="bg-card rounded-lg">
					<div className={styles.content}>
						{variant === "rectangle" && (
							<div className="text-2xl">{adData.icon}</div>
						)}
						<div className={styles.text}>
							<h3 className="font-semibold text-sm text-foreground mb-1">
								{adData.title}
							</h3>
							<p className="text-xs text-muted-foreground">
								{adData.description}
							</p>
						</div>
						<button className={`${styles.cta} flex items-center gap-1`}>
							{adData.cta}
							<ExternalLink className="h-3 w-3" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
