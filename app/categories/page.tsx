import { Suspense } from "react";
import { Metadata } from "next";
import { getAllCategories } from "@/lib/database/prompts-server";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { CategoriesPage } from "@/components/categories-page";

export const metadata: Metadata = {
	title: "All Categories - Browse AI Prompts by Category | AI Prompts Hub",
	description:
		"Browse all AI prompt categories including art, photography, 3D modeling, writing, productivity and more. Find the perfect prompts for ChatGPT, Midjourney, DALL-E, and other AI tools.",
	keywords: [
		"AI prompt categories",
		"browse prompts",
		"AI art categories",
		"ChatGPT categories",
		"Midjourney categories",
		"DALL-E categories",
		"prompt categories",
		"AI tools",
		"creative prompts",
		"free AI prompts",
	],
	openGraph: {
		title: "All Categories - Browse AI Prompts by Category",
		description:
			"Browse all AI prompt categories including art, photography, 3D modeling, writing, productivity and more.",
		type: "website",
	},
	alternates: {
		canonical: "/categories",
	},
};

export default async function Page() {
	const categories = await getAllCategories();

	// Structured data for categories page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: "AI Prompt Categories",
		description:
			"Browse all available AI prompt categories to find the perfect prompts for your creative projects.",
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/categories`,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: categories.length,
			itemListElement: categories.map((category, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "Thing",
					name: category.name,
					description: category.description,
					url: `${
						process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"
					}/category/${category.slug}`,
				},
			})),
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<PageViewTracker />
			<CategoriesPage categories={categories} />
		</>
	);
}
