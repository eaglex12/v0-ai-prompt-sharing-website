import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
	try {
		const supabase = await createClient();

		const { data: categories, error } = await supabase
			.from("blog_categories")
			.select("*")
			.order("name");

		if (error) {
			console.error("Error fetching blog categories:", error);
			return NextResponse.json({ error: "Failed to fetch blog categories" }, { status: 500 });
		}

		return NextResponse.json({ categories: categories || [] });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

export async function POST(request: NextRequest) {
	try {
		const supabase = await createClient();
		const body = await request.json();

		const { name, description, color } = body;

		// Generate slug from name
		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();

		const categoryData = {
			name,
			slug,
			description: description || null,
			color: color || "#6366f1",
		};

		const { data, error } = await supabase
			.from("blog_categories")
			.insert(categoryData)
			.select()
			.single();

		if (error) {
			console.error("Error creating blog category:", error);
			return NextResponse.json({ error: "Failed to create blog category" }, { status: 500 });
		}

		return NextResponse.json({ category: data });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
