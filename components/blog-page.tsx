"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, User, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost, BlogCategory } from "@/lib/database/blog-client";
import { searchBlogPosts, getBlogPostsByCategory } from "@/lib/database/blog-client";

interface BlogPageProps {
	initialPosts: BlogPost[];
	initialCategories: BlogCategory[];
}

export function BlogPage({ initialPosts, initialCategories }: BlogPageProps) {
	const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
	const [categories, setCategories] = useState<BlogCategory[]>(initialCategories);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		handleSearch();
	}, [searchQuery, selectedCategory]);

	const handleSearch = async () => {
		setIsLoading(true);
		try {
			let results: BlogPost[];

			if (searchQuery.trim()) {
				results = await searchBlogPosts(searchQuery);
			} else if (selectedCategory === "All") {
				results = initialPosts;
			} else {
				const category = categories.find((cat) => cat.name === selectedCategory);
				if (category) {
					results = await getBlogPostsByCategory(category.slug);
				} else {
					results = initialPosts;
				}
			}

			setPosts(results);
		} catch (error) {
			console.error("Error searching blog posts:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}/${day}/${year}`;
	};

	const featuredPosts = posts.filter(post => post.is_featured).slice(0, 3);
	const regularPosts = posts.filter(post => !post.is_featured);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
				<div className="max-w-7xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<TrendingUp className="h-7 w-7 text-primary" />
							<span className="text-xl font-heading font-bold text-foreground">
								AI Prompts Hub
							</span>
						</Link>
						<nav className="hidden md:flex gap-6">
							<Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
								Prompts
							</Link>
							<Link href="/blog" className="text-sm font-medium text-foreground">
								Blog
							</Link>
							<Link href="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
								Categories
							</Link>
							<Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
								About
							</Link>
						</nav>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
					<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
				</div>
				<div className="max-w-4xl mx-auto px-4 pt-12 pb-8">
					<div className="text-center">
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							AI Prompts Blog
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							Discover the latest insights, tutorials, and trends in AI prompt engineering. 
							Expert guides to help you master AI tools and create better prompts.
						</p>
					</div>
				</div>
			</section>

			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* Search and Filter */}
				<div className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="flex-1">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search blog posts..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 bg-card border-border"
								/>
							</div>
						</div>
					</div>

					{/* Category Filter */}
					<div className="flex flex-wrap gap-2">
						<Button
							variant={selectedCategory === "All" ? "default" : "outline"}
							size="sm"
							onClick={() => setSelectedCategory("All")}
						>
							All
						</Button>
						{categories.map((category) => (
							<Button
								key={category.id}
								variant={selectedCategory === category.name ? "default" : "outline"}
								size="sm"
								onClick={() => setSelectedCategory(category.name)}
							>
								{category.name}
							</Button>
						))}
					</div>
				</div>

				{/* Featured Posts */}
				{featuredPosts.length > 0 && (
					<section className="mb-12">
						<div className="flex items-center gap-2 mb-6">
							<TrendingUp className="h-6 w-6 text-accent" />
							<h2 className="text-3xl font-heading font-bold text-foreground">
								Featured Posts
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredPosts.map((post) => (
								<Card key={post.id} className="group hover:shadow-lg transition-shadow">
									<CardHeader>
										{post.featured_image_url && (
											<div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
												<Image
													src={post.featured_image_url}
													alt={post.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
										<div className="flex items-center gap-2 mb-2">
											{post.blog_categories && (
												<Badge
													variant="secondary"
													style={{
														backgroundColor: post.blog_categories.color + "20",
														color: post.blog_categories.color,
													}}
												>
													{post.blog_categories.name}
												</Badge>
											)}
											<Badge variant="default">Featured</Badge>
										</div>
										<CardTitle className="text-xl group-hover:text-primary transition-colors">
											<Link href={`/blog/${post.slug}`}>
												{post.title}
											</Link>
										</CardTitle>
										<CardDescription className="line-clamp-3">
											{post.excerpt}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
											<div className="flex items-center gap-1">
												<User className="h-4 w-4" />
												<span>{post.author_name}</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												<span>{formatDate(post.published_at || post.created_at)}</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>{post.reading_time} min read</span>
											</div>
										</div>
										<Link
											href={`/blog/${post.slug}`}
											className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
										>
											Read more
											<ArrowRight className="h-4 w-4" />
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					</section>
				)}

				{/* All Posts */}
				<section>
					<h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
						{selectedCategory === "All" ? "All Posts" : selectedCategory}
					</h2>

					{isLoading ? (
						<div className="text-center py-12">
							<p className="text-muted-foreground">Searching posts...</p>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{regularPosts.map((post) => (
								<Card key={post.id} className="group hover:shadow-lg transition-shadow">
									<CardHeader>
										{post.featured_image_url && (
											<div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
												<Image
													src={post.featured_image_url}
													alt={post.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
										<div className="flex items-center gap-2 mb-2">
											{post.blog_categories && (
												<Badge
													variant="secondary"
													style={{
														backgroundColor: post.blog_categories.color + "20",
														color: post.blog_categories.color,
													}}
												>
													{post.blog_categories.name}
												</Badge>
											)}
										</div>
										<CardTitle className="text-xl group-hover:text-primary transition-colors">
											<Link href={`/blog/${post.slug}`}>
												{post.title}
											</Link>
										</CardTitle>
										<CardDescription className="line-clamp-3">
											{post.excerpt}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
											<div className="flex items-center gap-1">
												<User className="h-4 w-4" />
												<span>{post.author_name}</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												<span>{formatDate(post.published_at || post.created_at)}</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>{post.reading_time} min read</span>
											</div>
										</div>
										<Link
											href={`/blog/${post.slug}`}
											className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors"
										>
											Read more
											<ArrowRight className="h-4 w-4" />
										</Link>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{posts.length === 0 && !isLoading && (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-lg">
								No blog posts found matching your search.
							</p>
						</div>
					)}
				</section>
			</div>

			{/* Footer */}
			<footer className="bg-card border-t border-border mt-16">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center gap-2 mb-4 md:mb-0">
							<TrendingUp className="h-6 w-6 text-primary" />
							<span className="font-heading font-semibold text-card-foreground">
								AI Prompts Hub
							</span>
						</div>
						<div className="flex gap-6 text-sm text-muted-foreground">
							<Link href="/about" className="hover:text-foreground transition-colors">
								About
							</Link>
							<Link href="/contact" className="hover:text-foreground transition-colors">
								Contact
							</Link>
							<Link href="/terms" className="hover:text-foreground transition-colors">
								Terms
							</Link>
							<Link href="/privacy" className="hover:text-foreground transition-colors">
								Privacy
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
