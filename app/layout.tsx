import type React from "react";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-space-grotesk",
	weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	variable: "--font-dm-sans",
	weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"),
	title: {
		default:
			"AI Prompts Hub - Trending AI Prompts for ChatGPT, Midjourney, DALL-E, Gemini & More",
		template: "%s | AI Prompts Hub",
	},
	description:
		"Discover trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini, Stable Diffusion and more. Browse thousands of creative AI prompts for art, 3D models, photography, writing, and productivity. Copy, share, and explore the best AI prompts.",
	keywords: [
		"AI prompts",
		"trending AI",
		"ChatGPT prompts",
		"Midjourney prompts",
		"DALL-E prompts",
		"Gemini prompts",
		"Google Gemini prompts",
		"AI art prompts",
		"AI writing prompts",
		"prompt library",
		"AI prompt sharing",
		"creative AI prompts",
		"stable diffusion prompts",
		"AI tools",
		"AI generators",
	],
	authors: [{ name: "AI Prompts Hub" }],
	creator: "AI Prompts Hub",
	publisher: "AI Prompts Hub",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		title: "AI Prompts Hub - Trending AI Prompts for All AI Tools",
		description:
			"Discover and share trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini and more. Your ultimate AI prompt library.",
		url: process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in",
		siteName: "AI Prompts Hub",
		locale: "en_US",
		type: "website",
		images: [
			{
				url: "/placeholder-logo.png",
				width: 1200,
				height: 630,
				alt: "AI Prompts Hub - Trending AI Prompts",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Prompts Hub - Trending AI Prompts",
		description:
			"Discover trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini and more.",
		images: ["/placeholder-logo.png"],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		google: process.env.GOOGLE_VERIFICATION_ID,
	},
	generator: "v0.app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<Script
					async
					src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2340577707616384"
					crossOrigin="anonymous"
					strategy="afterInteractive"
				/>
			</head>
			<body className={`font-sans ${spaceGrotesk.variable} ${dmSans.variable}`}>
				<Suspense fallback={null}>{children}</Suspense>
				<Analytics />
			</body>
		</html>
	);
}
