import { getAllBlogPosts } from "@/lib/database/blog";

export default async function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in";
	
	// Get all published blog posts
	const blogPosts = await getAllBlogPosts();
	
	// Generate sitemap entries for blog posts
	const blogPostUrls = blogPosts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.updated_at),
		changeFrequency: "weekly" as const,
		priority: post.is_featured ? 0.8 : 0.6,
	}));

	return blogPostUrls;
}
