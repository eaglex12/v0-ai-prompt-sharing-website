import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status") || "published";

		// Get all blog posts with categories
		const { data: posts, error } = await supabase
			.from("blog_posts")
			.select(`
				*,
				blog_categories (
					id,
					name,
					slug,
					color
				)
			`)
			.eq("status", status)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching blog posts:", error);
			return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 });
		}

		return NextResponse.json({ posts: posts || [] });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const body = await request.json();

		const {
			title,
			content,
			excerpt,
			featured_image_url,
			author_name,
			author_email,
			status,
			is_featured,
			meta_title,
			meta_description,
			tags,
			blog_category_id,
			published_at,
		} = body;

		// Generate slug from title
		const slug = title
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

		// Calculate reading time (rough estimate: 200 words per minute)
		const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
		const readingTime = Math.max(1, Math.ceil(wordCount / 200));

		const postData = {
			title,
			slug,
			content,
			excerpt: excerpt || null,
			featured_image_url: featured_image_url || null,
			author_name: author_name || "AI Prompts Hub",
			author_email: author_email || null,
			status: status || "draft",
			is_featured: is_featured || false,
			meta_title: meta_title || null,
			meta_description: meta_description || null,
			tags: tags || [],
			reading_time: readingTime,
			blog_category_id: blog_category_id || null,
			published_at: status === "published" ? (published_at || new Date().toISOString()) : null,
		};

		const { data, error } = await supabase
			.from("blog_posts")
			.insert(postData)
			.select()
			.single();

		if (error) {
			console.error("Error creating blog post:", error);
			return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 });
		}

		return NextResponse.json({ post: data });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
