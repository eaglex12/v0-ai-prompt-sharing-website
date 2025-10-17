import { createClient } from "@/lib/supabase/client";

export interface BlogPost {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string | null;
	featured_image_url: string | null;
	author_name: string;
	author_email: string | null;
	status: 'draft' | 'published' | 'archived';
	is_featured: boolean;
	meta_title: string | null;
	meta_description: string | null;
	tags: string[];
	reading_time: number;
	views_count: number;
	likes_count: number;
	created_at: string;
	updated_at: string;
	published_at: string | null;
	blog_category_id: string | null;
	blog_categories?: {
		id: string;
		name: string;
		slug: string;
		color: string;
	};
}

export interface BlogCategory {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	color: string;
	created_at: string;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
	const supabase = createClient();

	const { data, error } = await supabase
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
		.eq("status", "published")
		.order("published_at", { ascending: false });

	if (error) {
		console.error("Error fetching blog posts:", error);
		return [];
	}

	return data || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
	const supabase = createClient();

	const { data, error } = await supabase
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
		.eq("slug", slug)
		.eq("status", "published")
		.single();

	if (error) {
		console.error("Error fetching blog post by slug:", error);
		return null;
	}

	return data as BlogPost;
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
	const supabase = createClient();

	const { data, error } = await supabase
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
		.eq("status", "published")
		.eq("is_featured", true)
		.order("published_at", { ascending: false })
		.limit(3);

	if (error) {
		console.error("Error fetching featured blog posts:", error);
		return [];
	}

	return data || [];
}

export async function getBlogPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("blog_posts")
		.select(`
			*,
			blog_categories!inner (
				id,
				name,
				slug,
				color
			)
		`)
		.eq("blog_categories.slug", categorySlug)
		.eq("status", "published")
		.order("published_at", { ascending: false });

	if (error) {
		console.error("Error fetching blog posts by category:", error);
		return [];
	}

	return data || [];
}

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("blog_categories")
		.select("*")
		.order("name");

	if (error) {
		console.error("Error fetching blog categories:", error);
		return [];
	}

	return data || [];
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("blog_categories")
		.select("*")
		.eq("slug", slug)
		.single();

	if (error) {
		console.error("Error fetching blog category by slug:", error);
		return null;
	}

	return data as BlogCategory;
}

export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
	const supabase = createClient();

	const { data, error } = await supabase
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
		.eq("status", "published")
		.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
		.order("published_at", { ascending: false });

	if (error) {
		console.error("Error searching blog posts:", error);
		return [];
	}

	return data || [];
}

export async function getRelatedBlogPosts(postId: string, categoryId: string | null, limit: number = 3): Promise<BlogPost[]> {
	const supabase = createClient();

	if (!categoryId) {
		// If no category, get recent posts
		const { data, error } = await supabase
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
			.eq("status", "published")
			.neq("id", postId)
			.order("published_at", { ascending: false })
			.limit(limit);

		if (error) {
			console.error("Error fetching related blog posts:", error);
			return [];
		}

		return data || [];
	}

	const { data, error } = await supabase
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
		.eq("status", "published")
		.eq("blog_category_id", categoryId)
		.neq("id", postId)
		.order("published_at", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Error fetching related blog posts:", error);
		return [];
	}

	return data || [];
}

export async function incrementBlogPostViews(postId: string): Promise<void> {
	const supabase = createClient();

	const { error } = await supabase
		.rpc('increment_blog_views', { post_id: postId });

	if (error) {
		console.error("Error incrementing blog post views:", error);
	}
}
