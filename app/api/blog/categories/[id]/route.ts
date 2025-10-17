import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const supabase = await createClient();
		const { id } = params;

		const { data: category, error } = await supabase
			.from("blog_categories")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			console.error("Error fetching blog category:", error);
			return NextResponse.json({ error: "Blog category not found" }, { status: 404 });
		}

		return NextResponse.json({ category });
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
		const supabase = await createClient();
		const { id } = params;
		const body = await request.json();

		const { name, description, color } = body;

		// Generate slug from name if name changed
		let slug;
		if (name) {
			slug = name
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.trim();
		}

		const updateData: any = {};
		if (name !== undefined) updateData.name = name;
		if (slug !== undefined) updateData.slug = slug;
		if (description !== undefined) updateData.description = description;
		if (color !== undefined) updateData.color = color;

		const { data, error } = await supabase
			.from("blog_categories")
			.update(updateData)
			.eq("id", id)
			.select()
			.single();

		if (error) {
			console.error("Error updating blog category:", error);
			return NextResponse.json({ error: "Failed to update blog category" }, { status: 500 });
		}

		return NextResponse.json({ category: data });
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
			.from("blog_categories")
			.delete()
			.eq("id", id);

		if (error) {
			console.error("Error deleting blog category:", error);
			return NextResponse.json({ error: "Failed to delete blog category" }, { status: 500 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Unexpected error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
