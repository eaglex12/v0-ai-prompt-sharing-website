"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import type { BlogCategory } from "@/lib/database/blog-client";

export function BlogCategoriesManager() {
	const [categories, setCategories] = useState<BlogCategory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		color: "#6366f1",
	});

	useEffect(() => {
		loadData();
	}, []);

	// Clear messages after 5 seconds
	useEffect(() => {
		if (error || success) {
			const timer = setTimeout(() => {
				setError(null);
				setSuccess(null);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [error, success]);

	const loadData = async () => {
		const supabase = createClient();

		const { data: categoriesData } = await supabase
			.from("blog_categories")
			.select("*")
			.order("name");

		setCategories(categoriesData || []);
		setIsLoading(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();

			const categoryData = {
				name: formData.name,
				description: formData.description || null,
				color: formData.color,
			};

			if (editingCategory) {
				// Update existing category
				const { error } = await supabase
					.from("blog_categories")
					.update(categoryData)
					.eq("id", editingCategory.id);

				if (error) {
					console.error("Error updating blog category:", error);
					setError(`Failed to update blog category: ${error.message}`);
					return;
				}

				setSuccess("Blog category updated successfully!");
			} else {
				// Create new category
				const { error } = await supabase.from("blog_categories").insert(categoryData);

				if (error) {
					console.error("Error creating blog category:", error);
					setError(`Failed to create blog category: ${error.message}`);
					return;
				}
				setSuccess("Blog category created successfully!");
			}

			// Reset form and reload data
			setFormData({
				name: "",
				description: "",
				color: "#6366f1",
			});
			setEditingCategory(null);
			setIsDialogOpen(false);
			await loadData();
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (category: BlogCategory) => {
		setEditingCategory(category);
		setFormData({
			name: category.name,
			description: category.description || "",
			color: category.color,
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async (categoryId: string) => {
		if (!confirm("Are you sure you want to delete this blog category?")) return;

		try {
			setError(null);
			const supabase = createClient();
			const { error } = await supabase.from("blog_categories").delete().eq("id", categoryId);

			if (error) {
				console.error("Error deleting blog category:", error);
				setError(`Failed to delete blog category: ${error.message}`);
				return;
			}

			setSuccess("Blog category deleted successfully!");
			await loadData();
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred while deleting. Please try again.");
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}/${day}/${year}`;
	};

	if (isLoading) {
		return <div>Loading blog categories...</div>;
	}

	return (
		<div className="space-y-6">
			{/* Error and Success Messages */}
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
					{error}
				</div>
			)}
			{success && (
				<div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
					{success}
				</div>
			)}

			<div className="flex justify-between items-center">
				<h3 className="text-lg font-semibold">Blog Categories ({categories.length})</h3>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setEditingCategory(null)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Category
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>
								{editingCategory ? "Edit Blog Category" : "Add New Blog Category"}
							</DialogTitle>
							<DialogDescription>
								{editingCategory
									? "Update the blog category details"
									: "Create a new blog category"}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									required
								/>
							</div>
							<div>
								<Label htmlFor="description">Description</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									rows={3}
								/>
							</div>
							<div>
								<Label htmlFor="color">Color</Label>
								<div className="flex items-center gap-2">
									<Input
										id="color"
										type="color"
										value={formData.color}
										onChange={(e) =>
											setFormData({
												...formData,
												color: e.target.value,
											})
										}
										className="w-16 h-10"
									/>
									<Input
										value={formData.color}
										onChange={(e) =>
											setFormData({
												...formData,
												color: e.target.value,
											})
										}
										placeholder="#6366f1"
									/>
								</div>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting
										? "Saving..."
										: editingCategory
										? "Update"
										: "Create"}{" "}
									Category
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{categories.map((category) => (
					<Card key={category.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg flex items-center gap-2">
										<div
											className="w-4 h-4 rounded-full"
											style={{ backgroundColor: category.color }}
										/>
										{category.name}
									</CardTitle>
									<CardDescription>
										{category.description}
									</CardDescription>
								</div>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(category)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(category.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-center space-x-1 text-sm text-muted-foreground">
									<Calendar className="h-4 w-4" />
									<span>Created {formatDate(category.created_at)}</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge
										variant="secondary"
										style={{
											backgroundColor: category.color + "20",
											color: category.color,
										}}
									>
										{category.slug}
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
