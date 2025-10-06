"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/ui/image-upload";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Eye, Copy, Heart } from "lucide-react";
import Image from "next/image";
import type { Prompt, Category } from "@/lib/database/prompts";

export function PromptsManager() {
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		description: "",
		seo_content: "",
		category_id: "",
		reference_image_url: "",
		tags: "",
		is_trending: false,
		is_featured: false,
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

		// Load prompts
		const { data: promptsData } = await supabase
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

		// Load categories
		const { data: categoriesData } = await supabase
			.from("categories")
			.select("*")
			.order("name");

		setPrompts(promptsData || []);
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

			const promptData = {
				title: formData.title,
				content: formData.content,
				description: formData.description || null,
				seo_content: formData.seo_content || null,
				category_id: formData.category_id || null,
				reference_image_url: formData.reference_image_url || null,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				is_trending: formData.is_trending,
				is_featured: formData.is_featured,
			};

			if (editingPrompt) {
				// Update existing prompt
				const { error } = await supabase
					.from("prompts")
					.update(promptData)
					.eq("id", editingPrompt.id);

				if (error) {
					console.error("Error updating prompt:", error);
					setError(`Failed to update prompt: ${error.message}`);
					return;
				}

				setSuccess("Prompt updated successfully!");
			} else {
				// Create new prompt
				const { error } = await supabase.from("prompts").insert(promptData);

				if (error) {
					console.error("Error creating prompt:", error);
					setError(`Failed to create prompt: ${error.message}`);
					return;
				}
				setSuccess("Prompt created successfully!");
			}

			// Reset form and reload data
			setFormData({
				title: "",
				content: "",
				description: "",
				seo_content: "",
				category_id: "",
				reference_image_url: "",
				tags: "",
				is_trending: false,
				is_featured: false,
			});
			setEditingPrompt(null);
			setIsDialogOpen(false);
			await loadData();
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (prompt: Prompt) => {
		setEditingPrompt(prompt);
		setFormData({
			title: prompt.title,
			content: prompt.content,
			description: prompt.description || "",
			seo_content: (prompt as any).seo_content || "",
			category_id: prompt.category_id || "",
			reference_image_url: prompt.reference_image_url || "",
			tags: prompt.tags.join(", "),
			is_trending: prompt.is_trending,
			is_featured: prompt.is_featured,
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async (promptId: string) => {
		if (!confirm("Are you sure you want to delete this prompt?")) return;

		try {
			setError(null);
			const supabase = createClient();
			const { error } = await supabase.from("prompts").delete().eq("id", promptId);

			if (error) {
				console.error("Error deleting prompt:", error);
				setError(`Failed to delete prompt: ${error.message}`);
				return;
			}

			setSuccess("Prompt deleted successfully!");
			await loadData();
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred while deleting. Please try again.");
		}
	};

	if (isLoading) {
		return <div>Loading prompts...</div>;
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
				<h3 className="text-lg font-semibold">All Prompts ({prompts.length})</h3>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setEditingPrompt(null)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Prompt
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{editingPrompt ? "Edit Prompt" : "Add New Prompt"}
							</DialogTitle>
							<DialogDescription>
								{editingPrompt
									? "Update the prompt details"
									: "Create a new AI prompt for your library"}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({
											...formData,
											title: e.target.value,
										})
									}
									required
								/>
							</div>
							<div>
								<Label htmlFor="content">Prompt Content</Label>
								<Textarea
									id="content"
									value={formData.content}
									onChange={(e) =>
										setFormData({
											...formData,
											content: e.target.value,
										})
									}
									rows={4}
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
									rows={2}
								/>
							</div>
							<div>
								<Label htmlFor="seo_content">
									SEO Content (HTML allowed)
								</Label>
								<Textarea
									id="seo_content"
									value={formData.seo_content}
									onChange={(e) =>
										setFormData({
											...formData,
											seo_content: e.target.value,
										})
									}
									placeholder="<h2>How to use this prompt</h2><p>...</p>"
									rows={6}
								/>
							</div>
							<div>
								<Label htmlFor="category">Category</Label>
								<Select
									value={formData.category_id}
									onValueChange={(value) =>
										setFormData({ ...formData, category_id: value })
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((category) => (
											<SelectItem
												key={category.id}
												value={category.id}
											>
												{category.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<ImageUpload
								value={formData.reference_image_url}
								onChange={(url) =>
									setFormData({
										...formData,
										reference_image_url: url || "",
									})
								}
								disabled={isSubmitting}
							/>
							<div>
								<Label htmlFor="tags">Tags (comma-separated)</Label>
								<Input
									id="tags"
									value={formData.tags}
									onChange={(e) =>
										setFormData({ ...formData, tags: e.target.value })
									}
									placeholder="ai, creative, writing"
								/>
							</div>
							<div className="flex items-center space-x-4">
								<div className="flex items-center space-x-2">
									<Switch
										id="is_trending"
										checked={formData.is_trending}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												is_trending: checked,
											})
										}
									/>
									<Label htmlFor="is_trending">Trending</Label>
								</div>
								<div className="flex items-center space-x-2">
									<Switch
										id="is_featured"
										checked={formData.is_featured}
										onCheckedChange={(checked) =>
											setFormData({
												...formData,
												is_featured: checked,
											})
										}
									/>
									<Label htmlFor="is_featured">Featured</Label>
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
										: editingPrompt
										? "Update"
										: "Create"}{" "}
									Prompt
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-3 gap-5">
				{prompts.map((prompt) => (
					<Card key={prompt.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg">
										{prompt.title}
									</CardTitle>
									<CardDescription>
										{prompt.description}
									</CardDescription>
								</div>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(prompt)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(prompt.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{prompt.reference_image_url && (
									<div className="relative w-full h-32 rounded-lg overflow-hidden">
										<Image
											src={prompt.reference_image_url}
											alt={prompt.title}
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div className="flex items-center space-x-4 text-sm text-muted-foreground">
									<div className="flex items-center space-x-1">
										<Eye className="h-4 w-4" />
										<span>{prompt.views_count}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Copy className="h-4 w-4" />
										<span>{prompt.copies_count}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Heart className="h-4 w-4" />
										<span>{prompt.likes_count}</span>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									{prompt.categories && (
										<Badge
											variant="secondary"
											style={{
												backgroundColor:
													prompt.categories.color + "20",
												color: prompt.categories.color,
											}}
										>
											{prompt.categories.name}
										</Badge>
									)}
									{prompt.is_trending && (
										<Badge variant="default">Trending</Badge>
									)}
									{prompt.is_featured && (
										<Badge variant="outline">Featured</Badge>
									)}
								</div>
								<div className="flex flex-wrap gap-1">
									{prompt.tags.map((tag) => (
										<Badge
											key={tag}
											variant="outline"
											className="text-xs"
										>
											{tag}
										</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
