import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in";

	// Get all prompts, categories, and blog posts from database using client-side Supabase
	let prompts: Array<{
		slug: string;
		updated_at: string;
		is_trending: boolean;
		is_featured: boolean;
	}> = [];
	let categories: Array<{ slug: string; created_at: string }> = [];
	let blogPosts: Array<{
		slug: string;
		updated_at: string;
		is_featured: boolean;
	}> = [];
	try {
		const supabase = createClient();

		// Fetch prompts
		const { data: promptsData, error: promptsError } = await supabase
			.from("prompts")
			.select("slug, updated_at, is_trending, is_featured")
			.order("created_at", { ascending: false });

		// Fetch categories
		const { data: categoriesData, error: categoriesError } = await supabase
			.from("categories")
			.select("slug, created_at")
			.order("name");

		// Fetch blog posts
		const { data: blogPostsData, error: blogPostsError } = await supabase
			.from("blog_posts")
			.select("slug, updated_at, is_featured")
			.eq("status", "published")
			.order("published_at", { ascending: false });

		if (promptsError) {
			console.error("Error fetching prompts for sitemap:", promptsError);
		} else {
			prompts = promptsData || [];
		}

		if (categoriesError) {
			console.error("Error fetching categories for sitemap:", categoriesError);
		} else {
			categories = categoriesData || [];
		}

		if (blogPostsError) {
			console.error("Error fetching blog posts for sitemap:", blogPostsError);
		} else {
			blogPosts = blogPostsData || [];
		}
	} catch (error) {
		console.error("Error fetching data for sitemap:", error);
		// Continue with empty arrays if database fails
	}

	// Generate sitemap entries for all prompts
	const promptUrls = prompts.map((prompt) => ({
		url: `${baseUrl}/p/${prompt.slug}`,
		lastModified: new Date(prompt.updated_at),
		changeFrequency: "weekly" as const,
		priority: prompt.is_trending ? 0.9 : prompt.is_featured ? 0.8 : 0.7,
	}));

	// Generate sitemap entries for categories
	const categoryUrls = categories.map((category) => ({
		url: `${baseUrl}/category/${category.slug}`,
		lastModified: new Date(category.created_at),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	// Generate sitemap entries for blog posts
	const blogPostUrls = blogPosts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.updated_at),
		changeFrequency: "weekly" as const,
		priority: post.is_featured ? 0.8 : 0.6,
	}));

	// Static pages
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: new Date(),
			changeFrequency: "yearly" as const,
			priority: 0.5,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog/getting-started-ai-prompts`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/categories`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.9,
		},
	];

	return [...staticPages, ...categoryUrls, ...promptUrls, ...blogPostUrls];
}
