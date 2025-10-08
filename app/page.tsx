import { Suspense } from "react";
import { HomePage } from "@/components/home-page";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "AI Prompts Hub - Trending AI Prompts for ChatGPT, Midjourney, Gemini & More",
	description:
		"Discover the best trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini, Stable Diffusion and other AI tools. Browse thousands of creative AI prompts for art generation, 3D modeling, photography, writing, productivity and more. Free AI prompt library.",
	keywords: [
		"trending AI",
		"AI prompts",
		"ChatGPT prompts",
		"Midjourney prompts",
		"DALL-E prompts",
		"Gemini prompts",
		"Google Gemini prompts",
		"AI art",
		"AI prompt library",
		"prompt engineering",
		"AI tools",
		"creative AI",
		"AI prompt sharing",
		"best AI prompts",
		"free AI prompts",
	],
	openGraph: {
		title: "AI Prompts Hub - Trending AI Prompts",
		description:
			"Discover the best trending AI prompts for ChatGPT, Midjourney, Gemini, DALL-E and more. Free prompt library with thousands of creative prompts.",
		type: "website",
	},
};

export default function Page() {
	// Structured data for home page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "AI Prompts Hub",
		description:
			"Discover trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini and more AI tools.",
		url: process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${
					process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"
				}/?search={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<PageViewTracker />
			<Suspense fallback={<div>Loading...</div>}>
				<HomePage />
			</Suspense>
		</>
	);
}
