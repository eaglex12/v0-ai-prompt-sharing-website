"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, Share2, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BlogPost } from "@/lib/database/blog";

interface BlogPostPageProps {
	post: BlogPost;
	relatedPosts: BlogPost[];
	categories?: Array<{ id: string; name: string; slug: string }>;
}

export function BlogPostPage({ post, relatedPosts, categories }: BlogPostPageProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const publishDate = new Date(post.published_at || post.created_at);
	const formattedDate = publishDate.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
			{/* Hero Section */}
			<div className="relative h-96 md:h-[500px] w-full overflow-hidden">
				<Image
					src={
						post.featured_image_url ||
						"/placeholder.svg?height=500&width=1200&query=blog post hero image"
					}
					alt={post.title}
					fill
					className="object-cover"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/80" />

				{/* Hero Content */}
				<div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
					<div className="max-w-3xl">
						<div className="flex flex-wrap gap-2 mb-4">
							{post.tags?.slice(0, 3).map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium backdrop-blur-sm border border-accent/30"
								>
									<Tag className="w-3 h-3 mr-1" />
									{tag}
								</span>
							))}
						</div>
						<h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
							{post.title}
						</h1>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="relative -mt-20 z-10">
				<div className="max-w-6xl mx-auto px-4 md:px-6">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{/* Article */}
						<div className="lg:col-span-2">
							<Card className="bg-card border-0 shadow-xl p-8 md:p-12">
								<div className="flex flex-wrap gap-6 pb-8 border-b border-border">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Calendar className="w-4 h-4" />
										<time
											dateTime={
												post.published_at || post.created_at
											}
										>
											{formattedDate}
										</time>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<User className="w-4 h-4" />
										<span>{post.author_name}</span>
									</div>
									<div className="flex items-center gap-2 text-muted-foreground">
										<Clock className="w-4 h-4" />
										<span>{post.reading_time || 5} min read</span>
									</div>
								</div>

								{/* Article Content */}
								<article className="prose prose-lg max-w-none mt-8">
									<div className="text-lg text-muted-foreground mb-8">
										{post.excerpt}
									</div>
									<div
										className="text-foreground/80 space-y-6"
										dangerouslySetInnerHTML={{ __html: post.content }}
									/>
								</article>

								<div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4">
									<Button
										variant="outline"
										className="gap-2 bg-transparent"
										onClick={() => {
											if (navigator.share) {
												navigator.share({
													title: post.title,
													text: post.excerpt || undefined,
													url: window.location.href,
												});
											}
										}}
									>
										<Share2 className="w-4 h-4" />
										Share
									</Button>
								</div>
							</Card>

							{/* Related Posts */}
							{relatedPosts.length > 0 && (
								<div className="mt-12">
									<h2 className="text-2xl font-bold mb-6">
										Related Articles
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										{relatedPosts.map((relatedPost) => (
											<Link
												key={relatedPost.id}
												href={`/blog/${relatedPost.slug}`}
											>
												<Card className="group h-full bg-card border-border hover:shadow-lg transition-all cursor-pointer overflow-hidden">
													<div className="relative h-48 w-full overflow-hidden bg-muted">
														<Image
															src={
																relatedPost.featured_image_url ||
																"/placeholder.svg?height=300&width=400&query=related blog post" ||
																"/placeholder.svg"
															}
															alt={relatedPost.title}
															fill
															className="object-cover group-hover:scale-105 transition-transform duration-300"
														/>
													</div>
													<div className="p-6">
														<p className="text-sm text-accent font-semibold mb-2">
															{relatedPost.tags?.[0] ||
																"Article"}
														</p>
														<h3 className="text-lg font-semibold group-hover:text-accent transition-colors mb-2 line-clamp-2">
															{relatedPost.title}
														</h3>
														<p className="text-sm text-muted-foreground line-clamp-2 mb-4">
															{relatedPost.excerpt}
														</p>
														<div className="flex items-center text-accent text-sm font-medium group-hover:gap-2 transition-all">
															Read More
															<ArrowRight className="w-4 h-4 ml-1" />
														</div>
													</div>
												</Card>
											</Link>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Sidebar */}
						<div className="lg:col-span-1">
							<div className="space-y-6 sticky top-6">
								{/* Author Card */}
								<Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border p-6">
									<div className="flex items-center gap-4 mb-4">
										<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent" />
										<div>
											<p className="font-semibold text-foreground">
												{post.author_name}
											</p>
											<p className="text-sm text-muted-foreground">
												Author
											</p>
										</div>
									</div>
									<p className="text-sm text-muted-foreground leading-relaxed">
										Passionate about AI and technology. Sharing
										insights and best practices with the community.
									</p>
								</Card>

								{/* CTA Card */}
								<Card className="bg-gradient-to-br from-primary to-primary/80 border-0 p-6">
									<h3 className="font-semibold text-primary-foreground mb-2">
										Discover More
									</h3>
									<p className="text-sm text-primary-foreground/90 mb-4">
										Explore our complete guide to AI prompts and best
										practices.
									</p>
									<Link href="/blog">
										<Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
											Explore Collection
										</Button>
									</Link>
								</Card>

								{/* Categories */}
								{categories && categories.length > 0 && (
									<Card className="border-border p-6">
										<h3 className="font-semibold mb-4 text-foreground">
											Categories
										</h3>
										<div className="flex flex-wrap gap-2">
											{categories.slice(0, 5).map((category) => (
												<Link
													key={category.id}
													href={`/blog/category/${category.slug}`}
													className="inline-flex px-3 py-1 text-sm text-muted-foreground rounded-full transition-colors"
												>
													{category.name}
												</Link>
											))}
										</div>
									</Card>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
