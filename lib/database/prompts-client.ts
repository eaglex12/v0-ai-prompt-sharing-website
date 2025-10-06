import { createClient } from "@/lib/supabase/client";

export interface Prompt {
	id: string;
	title: string;
	slug?: string;
	content: string;
	description: string | null;
	seo_content?: string | null;
	category_id: string | null;
	reference_image_url: string | null;
	tags: string[];
	views_count: number;
	copies_count: number;
	is_trending: boolean;
	is_featured: boolean;
	created_at: string;
	updated_at: string;
	categories?: {
		id: string;
		name: string;
		slug: string;
		color: string;
	};
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	color: string;
	created_at: string;
}

export async function getAllPrompts(): Promise<Prompt[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `
		)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching prompts:", error);
		return [];
	}

	return data || [];
}

export async function getTrendingPrompts(): Promise<Prompt[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `
		)
		.eq("is_trending", true)
		.order("views_count", { ascending: false })
		.limit(6);

	if (error) {
		console.error("Error fetching trending prompts:", error);
		return [];
	}

	return data || [];
}

export async function getFeaturedPrompts(): Promise<Prompt[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `
		)
		.eq("is_featured", true)
		.order("created_at", { ascending: false })
		.limit(8);

	if (error) {
		console.error("Error fetching featured prompts:", error);
		return [];
	}

	return data || [];
}

export async function getPromptsByCategory(categorySlug: string): Promise<Prompt[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories!inner (
        id,
        name,
        slug,
        color
      )
    `
		)
		.eq("categories.slug", categorySlug)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching prompts by category:", error);
		return [];
	}

	return data || [];
}

export async function getAllCategories(): Promise<Category[]> {
	const supabase = createClient();

	const { data, error } = await supabase.from("categories").select("*").order("name");

	if (error) {
		console.error("Error fetching categories:", error);
		return [];
	}

	return data || [];
}

export async function searchPrompts(query: string): Promise<Prompt[]> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `
		)
		.or(
			`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`
		)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error searching prompts:", error);
		return [];
	}

	return data || [];
}

export async function getPromptBySlug(slug: string): Promise<Prompt | null> {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("prompts")
		.select(
			`
      *,
      categories (
        id,
        name,
        slug,
        color
      )
    `
		)
		.eq("slug", slug)
		.single();

	if (error) {
		console.error("Error fetching prompt by slug:", error);
		return null;
	}

	return data as Prompt;
}
