import { Suspense } from "react";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/database/blog";
import { BlogPage } from "@/components/blog-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Blog - AI Prompts Hub",
	description:
		"Discover the latest insights, tutorials, and trends in AI prompt engineering. Expert guides, tips, and industry news to help you master AI tools.",
	keywords: [
		"AI blog",
		"prompt engineering",
		"AI tutorials",
		"AI tips",
		"ChatGPT guides",
		"AI trends",
		"prompt engineering blog",
		"AI news",
	],
	openGraph: {
		title: "Blog - AI Prompts Hub",
		description:
			"Discover the latest insights, tutorials, and trends in AI prompt engineering. Expert guides and industry news.",
		type: "website",
	},
};

export default async function Page() {
	// Fetch data on the server side for better performance
	const [blogPosts, blogCategories] = await Promise.all([
		getAllBlogPosts(),
		getAllBlogCategories(),
	]);

	// Structured data for blog page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "AI Prompts Hub Blog",
		description:
			"Latest insights, tutorials, and trends in AI prompt engineering",
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/blog`,
		author: {
			"@type": "Organization",
			name: "AI Prompts Hub",
		},
		blogPost: blogPosts.slice(0, 5).map((post) => ({
			"@type": "BlogPosting",
			headline: post.title,
			description: post.excerpt,
			url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/blog/${post.slug}`,
			datePublished: post.published_at,
			author: {
				"@type": "Person",
				name: post.author_name,
			},
		})),
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Suspense fallback={null}>
				<BlogPage 
					initialPosts={blogPosts}
					initialCategories={blogCategories}
				/>
			</Suspense>
		</>
	);
}
