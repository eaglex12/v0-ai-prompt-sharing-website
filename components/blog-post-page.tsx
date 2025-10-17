"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft, Share2, Heart, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost, BlogCategory } from "@/lib/database/blog-client";
import { incrementBlogPostViews } from "@/lib/database/blog-client";
import { EnhancedBannerAd } from "@/components/ads/enhanced-banner-ad";
import { EnhancedSidebarAd } from "@/components/ads/enhanced-sidebar-ad";
import { PolicyCompliantAd } from "@/components/ads/policy-compliant-ad";

interface BlogPostPageProps {
	post: BlogPost;
	relatedPosts: BlogPost[];
	categories: BlogCategory[];
}

export function BlogPostPage({ post, relatedPosts, categories }: BlogPostPageProps) {
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes_count);

	useEffect(() => {
		// Track view when component mounts
		incrementBlogPostViews(post.id);
	}, [post.id]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${month}/${day}/${year}`;
	};

	const handleLike = () => {
		if (!isLiked) {
			setLikesCount(prev => prev + 1);
			setIsLiked(true);
		}
	};

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: post.title,
					text: post.excerpt || "",
					url: window.location.href,
				});
			} catch (error) {
				console.log("Error sharing:", error);
			}
		} else {
			// Fallback: copy to clipboard
			await navigator.clipboard.writeText(window.location.href);
			// You could add a toast notification here
		}
	};

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
							<ArrowLeft className="h-7 w-7 text-primary" />
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

			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Breadcrumb */}
				<nav className="mb-8">
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Link href="/" className="hover:text-foreground transition-colors">Home</Link>
						<span>/</span>
						<Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
						<span>/</span>
						<span className="text-foreground">{post.title}</span>
					</div>
				</nav>

				{/* Article Header */}
				<article className="mb-12">
					<div className="mb-6">
						{post.blog_categories && (
							<Badge
								variant="secondary"
								className="mb-4"
								style={{
									backgroundColor: post.blog_categories.color + "20",
									color: post.blog_categories.color,
								}}
							>
								{post.blog_categories.name}
							</Badge>
						)}
						<h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-foreground mb-4">
							{post.title}
						</h1>
						{post.excerpt && (
							<p className="text-xl text-muted-foreground mb-6">
								{post.excerpt}
							</p>
						)}
					</div>

					{/* Article Meta */}
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
						<div className="flex items-center gap-6 text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<User className="h-4 w-4" />
								<span>{post.author_name}</span>
							</div>
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4" />
								<span>{formatDate(post.published_at || post.created_at)}</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4" />
								<span>{post.reading_time} min read</span>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={handleLike}
								className={isLiked ? "text-red-500 border-red-500" : ""}
							>
								<Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
								{likesCount}
							</Button>
							<Button variant="outline" size="sm" onClick={handleShare}>
								<Share2 className="h-4 w-4 mr-2" />
								Share
							</Button>
						</div>
					</div>

					{/* Featured Image */}
					{post.featured_image_url && (
						<div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8">
							<Image
								src={post.featured_image_url}
								alt={post.title}
								fill
								className="object-cover"
							/>
						</div>
					)}

					{/* Article Content */}
					<div 
						className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-card prose-pre:border prose-pre:border-border"
						dangerouslySetInnerHTML={{ __html: post.content }}
					/>

					{/* Tags */}
					{post.tags.length > 0 && (
						<div className="mt-8 pt-6 border-t border-border">
							<h3 className="text-lg font-semibold text-foreground mb-4">Tags</h3>
							<div className="flex flex-wrap gap-2">
								{post.tags.map((tag) => (
									<Badge key={tag} variant="outline">
										{tag}
									</Badge>
								))}
							</div>
						</div>
					)}
				</article>

				{/* Banner Ad: after main content */}
				<EnhancedBannerAd 
					adSlot="blog-post-banner" 
					className="my-8"
				/>

				{/* Related Posts */}
				{relatedPosts.length > 0 && (
					<section className="mb-12">
						<h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
							Related Posts
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{relatedPosts.map((relatedPost) => (
								<Card key={relatedPost.id} className="group hover:shadow-lg transition-shadow">
									<CardHeader>
										{relatedPost.featured_image_url && (
											<div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
												<Image
													src={relatedPost.featured_image_url}
													alt={relatedPost.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
										<div className="flex items-center gap-2 mb-2">
											{relatedPost.blog_categories && (
												<Badge
													variant="secondary"
													style={{
														backgroundColor: relatedPost.blog_categories.color + "20",
														color: relatedPost.blog_categories.color,
													}}
												>
													{relatedPost.blog_categories.name}
												</Badge>
											)}
										</div>
										<CardTitle className="text-xl group-hover:text-primary transition-colors">
											<Link href={`/blog/${relatedPost.slug}`}>
												{relatedPost.title}
											</Link>
										</CardTitle>
										<CardDescription className="line-clamp-3">
											{relatedPost.excerpt}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
											<div className="flex items-center gap-1">
												<User className="h-4 w-4" />
												<span>{relatedPost.author_name}</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-4 w-4" />
												<span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
											</div>
											<div className="flex items-center gap-1">
												<Clock className="h-4 w-4" />
												<span>{relatedPost.reading_time} min read</span>
											</div>
										</div>
										<Link
											href={`/blog/${relatedPost.slug}`}
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

				{/* Bottom Ad: only show when there is substantial content */}
				<PolicyCompliantAd 
					adSlot="blog-post-bottom" 
					adFormat="auto"
					minContentHeight={1000}
					position="bottom"
				/>

				{/* Back to Blog */}
				<div className="text-center">
					<Link href="/blog">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Blog
						</Button>
					</Link>
				</div>
			</div>

			{/* Sidebar Ads: always show on blog post pages */}
			<EnhancedSidebarAd position="left" />
			<EnhancedSidebarAd position="right" />

			{/* Footer */}
			<footer className="bg-card border-t border-border mt-16">
				<div className="max-w-7xl mx-auto px-4 py-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center gap-2 mb-4 md:mb-0">
							<ArrowLeft className="h-6 w-6 text-primary" />
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
