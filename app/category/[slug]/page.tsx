import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCategoryBySlug, getPromptsByCategory } from "@/lib/database/prompts-server";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { CategoryPage } from "@/components/category-page";

interface CategoryPageProps {
	params: {
		slug: string;
	};
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
	const category = await getCategoryBySlug(params.slug);

	if (!category) {
		return {
			title: "Category Not Found",
			description: "The requested category could not be found.",
		};
	}

	const prompts = await getPromptsByCategory(params.slug);
	const promptCount = prompts.length;

	return {
		title: `${category.name} AI Prompts - ${promptCount} Creative Prompts | AI Prompts Hub`,
		description:
			category.description ||
			`Discover ${promptCount} creative ${category.name.toLowerCase()} AI prompts for ChatGPT, Midjourney, DALL-E, and more. Free prompt library with trending prompts.`,
		keywords: [
			`${category.name} AI prompts`,
			`${category.name.toLowerCase()} prompts`,
			"AI prompts",
			"ChatGPT prompts",
			"Midjourney prompts",
			"DALL-E prompts",
			"AI art",
			"prompt engineering",
			"creative AI",
			"free AI prompts",
		],
		openGraph: {
			title: `${category.name} AI Prompts - ${promptCount} Creative Prompts`,
			description:
				category.description ||
				`Discover ${promptCount} creative ${category.name.toLowerCase()} AI prompts for ChatGPT, Midjourney, DALL-E and more.`,
			type: "website",
		},
		alternates: {
			canonical: `/category/${params.slug}`,
		},
	};
}

export async function generateStaticParams() {
	// This function is optional but helps with static generation
	// For now, we'll let Next.js handle dynamic routes
	return [];
}

export default async function Page({ params }: CategoryPageProps) {
	const [category, prompts] = await Promise.all([
		getCategoryBySlug(params.slug),
		getPromptsByCategory(params.slug),
	]);

	if (!category) {
		notFound();
	}

	// Structured data for category page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: `${category.name} AI Prompts`,
		description:
			category.description ||
			`A collection of ${
				prompts.length
			} creative ${category.name.toLowerCase()} AI prompts for various AI tools.`,
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/category/${
			params.slug
		}`,
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: prompts.length,
			itemListElement: prompts.slice(0, 10).map((prompt, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CreativeWork",
					name: prompt.title,
					description: prompt.description,
					url: `${
						process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"
					}/p/${prompt.slug}`,
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
			<CategoryPage category={category} initialPrompts={prompts} />
		</>
	);
}
