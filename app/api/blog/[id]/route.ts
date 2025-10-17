import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const supabase = await createClient();
		const { id } = params;

		const { data: post, error } = await supabase
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
			.eq("id", id)
			.single();

		if (error) {
			console.error("Error fetching blog post:", error);
			return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
		}

		return NextResponse.json({ post });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		console.log("PUT request received for blog post:", params.id);
		const supabase = await createClient();
		const { id } = params;
		console.log("Updating blog post with ID:", id);
		
		// First check if the blog post exists
		const { data: existingPosts, error: fetchError } = await supabase
			.from("blog_posts")
			.select("id, title, status")
			.eq("id", id);

		if (fetchError) {
			console.error("Error checking blog post existence:", fetchError);
			console.error("Looking for blog post ID:", id);
			return NextResponse.json({ 
				error: `Database error: ${fetchError.message}`,
				details: `Looking for ID: ${id}`
			}, { status: 500 });
		}

		if (!existingPosts || existingPosts.length === 0) {
			console.error("Blog post not found - no data returned");
			console.error("Looking for blog post ID:", id);
			return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
		}

		const existingPost = existingPosts[0];

		const body = await request.json();
		console.log("Update data received:", body);

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

		// Generate slug from title if title changed
		let slug;
		if (title) {
			slug = title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.trim();
		}

		// Calculate reading time if content changed
		let readingTime;
		if (content) {
			const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
			readingTime = Math.max(1, Math.ceil(wordCount / 200));
		}

		const updateData: any = {};
		if (title !== undefined) updateData.title = title;
		if (slug !== undefined) updateData.slug = slug;
		if (content !== undefined) updateData.content = content;
		if (excerpt !== undefined) updateData.excerpt = excerpt;
		if (featured_image_url !== undefined) updateData.featured_image_url = featured_image_url;
		if (author_name !== undefined) updateData.author_name = author_name;
		if (author_email !== undefined) updateData.author_email = author_email;
		if (status !== undefined) updateData.status = status;
		if (is_featured !== undefined) updateData.is_featured = is_featured;
		if (meta_title !== undefined) updateData.meta_title = meta_title;
		if (meta_description !== undefined) updateData.meta_description = meta_description;
		if (tags !== undefined) updateData.tags = tags;
		if (readingTime !== undefined) updateData.reading_time = readingTime;
		if (blog_category_id !== undefined) updateData.blog_category_id = blog_category_id;
		if (status === "published" && !published_at) {
			updateData.published_at = new Date().toISOString();
		} else if (published_at !== undefined) {
			updateData.published_at = published_at;
		}

		const { data, error } = await supabase
			.from("blog_posts")
			.update(updateData)
			.eq("id", id)
			.select();

		if (error) {
			console.error("Error updating blog post:", error);
			console.error("Update data that failed:", updateData);
			return NextResponse.json({ error: `Failed to update blog post: ${error.message}` }, { status: 500 });
		}

		if (!data || data.length === 0) {
			console.error("No blog post found after update");
			return NextResponse.json({ error: "Blog post not found after update" }, { status: 404 });
		}

		console.log("Blog post updated successfully:", data[0]);
		return NextResponse.json({ post: data[0] });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const supabase = await createClient();
		const { id } = params;

		const { error } = await supabase
			.from("blog_posts")
			.delete()
			.eq("id", id);

		if (error) {
			console.error("Error deleting blog post:", error);
			return NextResponse.json({ error: "Failed to delete blog post" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
