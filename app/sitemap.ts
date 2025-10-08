import { MetadataRoute } from "next";
import { getAllPrompts } from "@/lib/database/prompts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in";

	// Get all prompts from database
	const prompts = await getAllPrompts();

	// Generate sitemap entries for all prompts
	const promptUrls = prompts.map((prompt) => ({
		url: `${baseUrl}/p/${prompt.slug}`,
		lastModified: new Date(prompt.updated_at),
		changeFrequency: "weekly" as const,
		priority: prompt.is_trending ? 0.9 : prompt.is_featured ? 0.8 : 0.7,
	}));

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
	];

	return [...staticPages, ...promptUrls];
}
