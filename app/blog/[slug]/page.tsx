import { Suspense } from "react";
import { getBlogPostBySlug, getRelatedBlogPosts, getAllBlogCategories } from "@/lib/database/blog";
import { BlogPostPage } from "@/components/blog-post-page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
	params: {
		slug: string;
	};
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
	const post = await getBlogPostBySlug(params.slug);
	
	if (!post) {
		return {
			title: "Post Not Found - AI Prompts Hub",
		};
	}

	return {
		title: post.meta_title || post.title,
		description: post.meta_description || post.excerpt || "Read this blog post on AI Prompts Hub",
		keywords: post.tags,
		openGraph: {
			title: post.meta_title || post.title,
			description: post.meta_description || post.excerpt,
			type: "article",
			publishedTime: post.published_at || undefined,
			authors: [post.author_name],
			tags: post.tags,
			images: post.featured_image_url ? [post.featured_image_url] : undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: post.meta_title || post.title,
			description: post.meta_description || post.excerpt,
			images: post.featured_image_url ? [post.featured_image_url] : undefined,
		},
	};
}

export default async function Page({ params }: BlogPostPageProps) {
	const [post, categories] = await Promise.all([
		getBlogPostBySlug(params.slug),
		getAllBlogCategories(),
	]);

	if (!post) {
		notFound();
	}

	const relatedPosts = await getRelatedBlogPosts(post.id, post.blog_category_id, 3);

	// Structured data for blog post
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.excerpt,
		image: post.featured_image_url,
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/blog/${post.slug}`,
		datePublished: post.published_at,
		dateModified: post.updated_at,
		author: {
			"@type": "Person",
			name: post.author_name,
		},
		publisher: {
			"@type": "Organization",
			name: "AI Prompts Hub",
			logo: {
				"@type": "ImageObject",
				url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/placeholder-logo.png`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/blog/${post.slug}`,
		},
		keywords: post.tags.join(", "),
		wordCount: post.content.replace(/<[^>]*>/g, "").split(/\s+/).length,
		timeRequired: `PT${post.reading_time}M`,
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			<Suspense fallback={<div>Loading post...</div>}>
				<BlogPostPage 
					post={post}
					relatedPosts={relatedPosts}
					categories={categories}
				/>
			</Suspense>
		</>
	);
}
