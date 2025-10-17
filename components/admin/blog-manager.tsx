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
import { Plus, Edit, Trash2, Eye, Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import type { BlogPost, BlogCategory } from "@/lib/database/blog-client";

export function BlogManager() {
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<BlogCategory[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

	const [formData, setFormData] = useState({
		title: "",
		content: "",
		excerpt: "",
		featured_image_url: "",
		author_name: "AI Prompts Hub",
		author_email: "",
		status: "draft",
		is_featured: false,
		meta_title: "",
		meta_description: "",
		tags: "",
		blog_category_id: "",
		published_at: "",
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
		console.log("Loading blog data...");
		const supabase = createClient();

		// Load blog posts
		const { data: postsData, error: postsError } = await supabase
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
			.order("created_at", { ascending: false });

		if (postsError) {
			console.error("Error loading blog posts:", postsError);
		} else {
			console.log("Loaded blog posts:", postsData?.length || 0);
		}

		// Load blog categories
		const { data: categoriesData, error: categoriesError } = await supabase
			.from("blog_categories")
			.select("*")
			.order("name");

		if (categoriesError) {
			console.error("Error loading blog categories:", categoriesError);
		}

		setPosts(postsData || []);
		setCategories(categoriesData || []);
		setIsLoading(false);
		console.log("Blog data loaded successfully");
		
		// Force a re-render by incrementing refresh key
		setRefreshKey(prev => prev + 1);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();
			
			// Generate slug from title
			const slug = formData.title
				.toLowerCase()
				.replace(/[^a-z0-9\s-]/g, "")
				.replace(/\s+/g, "-")
				.replace(/-+/g, "-")
				.trim();

			// Calculate reading time (rough estimate: 200 words per minute)
			const wordCount = formData.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
			const readingTime = Math.max(1, Math.ceil(wordCount / 200));
			
			const postData = {
				title: formData.title,
				slug: slug,
				content: formData.content,
				excerpt: formData.excerpt || null,
				featured_image_url: formData.featured_image_url || null,
				author_name: formData.author_name,
				author_email: formData.author_email || null,
				status: formData.status as 'draft' | 'published' | 'archived',
				is_featured: formData.is_featured,
				meta_title: formData.meta_title || null,
				meta_description: formData.meta_description || null,
				tags: formData.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				reading_time: readingTime,
				blog_category_id: formData.blog_category_id || null,
				published_at: formData.status === "published" ? (formData.published_at || new Date().toISOString()) : null,
			};

			if (editingPost) {
				// Update existing post using direct Supabase client
				const { error } = await supabase
					.from("blog_posts")
					.update(postData)
					.eq("id", editingPost.id);

				if (error) {
					console.error("Error updating blog post:", error);
					setError(`Failed to update blog post: ${error.message}`);
					return;
				}

				setSuccess("Blog post updated successfully!");
				
				// Immediately update the local state with the new data
				setPosts(prevPosts => 
					prevPosts.map(post => 
						post.id === editingPost.id 
							? { ...post, ...postData, updated_at: new Date().toISOString() }
							: post
					)
				);
			} else {
				// Create new post using direct Supabase client
				const { error } = await supabase.from("blog_posts").insert(postData);

				if (error) {
					console.error("Error creating blog post:", error);
					setError(`Failed to create blog post: ${error.message}`);
					return;
				}
				setSuccess("Blog post created successfully!");
			}

			// Reset form and reload data
			setFormData({
				title: "",
				content: "",
				excerpt: "",
				featured_image_url: "",
				author_name: "AI Prompts Hub",
				author_email: "",
				status: "draft",
				is_featured: false,
				meta_title: "",
				meta_description: "",
				tags: "",
				blog_category_id: "",
				published_at: "",
			});
			setEditingPost(null);
			setIsDialogOpen(false);
			
			// Reload data to show updated content
			console.log("Reloading data after update...");
			// Small delay to ensure database has processed the update
			await new Promise(resolve => setTimeout(resolve, 500));
			await loadData();
			console.log("Data reloaded successfully");
		} catch (err) {
			console.error("Unexpected error:", err);
			setError("An unexpected error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEdit = (post: BlogPost) => {
		setEditingPost(post);
		setFormData({
			title: post.title,
			content: post.content,
			excerpt: post.excerpt || "",
			featured_image_url: post.featured_image_url || "",
			author_name: post.author_name,
			author_email: post.author_email || "",
			status: post.status,
			is_featured: post.is_featured,
			meta_title: post.meta_title || "",
			meta_description: post.meta_description || "",
			tags: post.tags.join(", "),
			blog_category_id: post.blog_category_id || "",
			published_at: post.published_at || "",
		});
		setIsDialogOpen(true);
	};

	const handleDelete = async (postId: string) => {
		if (!confirm("Are you sure you want to delete this blog post?")) return;

		try {
			setError(null);
			const supabase = createClient();
			const { error } = await supabase.from("blog_posts").delete().eq("id", postId);

			if (error) {
				console.error("Error deleting blog post:", error);
				setError(`Failed to delete blog post: ${error.message}`);
				return;
			}

			setSuccess("Blog post deleted successfully!");
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
		return <div>Loading blog posts...</div>;
	}

	return (
		<div className="space-y-6" key={refreshKey}>
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
				<h3 className="text-lg font-semibold">All Blog Posts ({posts.length})</h3>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button onClick={() => setEditingPost(null)}>
							<Plus className="h-4 w-4 mr-2" />
							Add Blog Post
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle>
								{editingPost ? "Edit Blog Post" : "Add New Blog Post"}
							</DialogTitle>
							<DialogDescription>
								{editingPost
									? "Update the blog post details"
									: "Create a new blog post for your website"}
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
									<Label htmlFor="status">Status</Label>
									<Select
										value={formData.status}
										onValueChange={(value) =>
											setFormData({ ...formData, status: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="draft">Draft</SelectItem>
											<SelectItem value="published">Published</SelectItem>
											<SelectItem value="archived">Archived</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div>
								<Label htmlFor="content">Content (HTML allowed)</Label>
								<Textarea
									id="content"
									value={formData.content}
									onChange={(e) =>
										setFormData({
											...formData,
											content: e.target.value,
										})
									}
									rows={8}
									required
									placeholder="<h1>Your Blog Post Title</h1><p>Your content here...</p>"
								/>
							</div>

							<div>
								<Label htmlFor="excerpt">Excerpt</Label>
								<Textarea
									id="excerpt"
									value={formData.excerpt}
									onChange={(e) =>
										setFormData({
											...formData,
											excerpt: e.target.value,
										})
									}
									rows={3}
									placeholder="Brief description of the blog post..."
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="meta_title">Meta Title</Label>
									<Input
										id="meta_title"
										value={formData.meta_title}
										onChange={(e) =>
											setFormData({
												...formData,
												meta_title: e.target.value,
											})
										}
										placeholder="SEO title for search engines"
									/>
								</div>
								<div>
									<Label htmlFor="meta_description">Meta Description</Label>
									<Input
										id="meta_description"
										value={formData.meta_description}
										onChange={(e) =>
											setFormData({
												...formData,
												meta_description: e.target.value,
											})
										}
										placeholder="SEO description for search engines"
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="category">Category</Label>
								<Select
									value={formData.blog_category_id}
									onValueChange={(value) =>
										setFormData({ ...formData, blog_category_id: value })
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
								value={formData.featured_image_url}
								onChange={(url) =>
									setFormData({
										...formData,
										featured_image_url: url || "",
									})
								}
								disabled={isSubmitting}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="author_name">Author Name</Label>
									<Input
										id="author_name"
										value={formData.author_name}
										onChange={(e) =>
											setFormData({
												...formData,
												author_name: e.target.value,
											})
										}
									/>
								</div>
								<div>
									<Label htmlFor="author_email">Author Email</Label>
									<Input
										id="author_email"
										type="email"
										value={formData.author_email}
										onChange={(e) =>
											setFormData({
												...formData,
												author_email: e.target.value,
											})
										}
									/>
								</div>
							</div>

							<div>
								<Label htmlFor="tags">Tags (comma-separated)</Label>
								<Input
									id="tags"
									value={formData.tags}
									onChange={(e) =>
										setFormData({ ...formData, tags: e.target.value })
									}
									placeholder="ai, tutorial, guide"
								/>
							</div>

							<div className="flex items-center space-x-4">
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
										: editingPost
										? "Update"
										: "Create"}{" "}
									Blog Post
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{posts.map((post) => (
					<Card key={post.id}>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg">
										{post.title}
									</CardTitle>
									<CardDescription>
										{post.excerpt}
									</CardDescription>
								</div>
								<div className="flex space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleEdit(post)}
									>
										<Edit className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleDelete(post.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{post.featured_image_url && (
									<div className="relative w-full h-32 rounded-lg overflow-hidden">
										<Image
											src={post.featured_image_url}
											alt={post.title}
											fill
											className="object-cover"
										/>
									</div>
								)}
								<div className="flex items-center space-x-4 text-sm text-muted-foreground">
									<div className="flex items-center space-x-1">
										<Eye className="h-4 w-4" />
										<span>{post.views_count}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Calendar className="h-4 w-4" />
										<span>{formatDate(post.created_at)}</span>
									</div>
									<div className="flex items-center space-x-1">
										<Clock className="h-4 w-4" />
										<span>{post.reading_time} min</span>
									</div>
									<div className="flex items-center space-x-1">
										<User className="h-4 w-4" />
										<span>{post.author_name}</span>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Badge
										variant={
											post.status === "published"
												? "default"
												: post.status === "draft"
												? "secondary"
												: "outline"
										}
									>
										{post.status}
									</Badge>
									{post.is_featured && (
										<Badge variant="outline">Featured</Badge>
									)}
									{post.blog_categories && (
										<Badge
											variant="secondary"
											style={{
												backgroundColor:
													post.blog_categories.color + "20",
												color: post.blog_categories.color,
											}}
										>
											{post.blog_categories.name}
										</Badge>
									)}
								</div>
								<div className="flex flex-wrap gap-1">
									{post.tags.map((tag) => (
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
