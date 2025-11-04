"use client";

import { Button } from "@/components/ui/button";
import type { Category } from "@/lib/database/prompts-client";
import { ArrowLeft, Grid3X3, Sparkles } from "lucide-react";
import Link from "next/link";

interface CategoriesPageProps {
	categories: Category[];
}

export function CategoriesPage({ categories }: CategoriesPageProps) {
	return (
		<div className="min-h-screen bg-background">
			{/* Page Header */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
					<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
				</div>
				<div className={`md:max-w-[60vw] mx-auto px-4 pt-12 pb-8`}>
					<div className="text-center">
						<div>
							<Link
								href="/"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
							>
								<ArrowLeft className="h-4 w-4" />
								Back to home
							</Link>
						</div>

						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-4">
							<Grid3X3 className="h-3.5 w-3.5 text-primary" />
							<span>Browse all categories</span>
						</div>

						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							All Categories
						</h1>

						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							Explore prompts organized by category. Find the perfect
							prompts for your creative projects.
						</p>

						<p className="mt-2 text-sm text-muted-foreground">
							{categories.length} categories available
						</p>
					</div>
				</div>
			</section>

			<div className={`md:max-w-[60vw] mx-auto px-4 py-8`}>
				{/* Categories Grid */}
				<section>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{categories.map((category) => (
							<Link
								key={category.id}
								href={`/category/${category.slug}`}
								className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:scale-105"
							>
								<div className="flex flex-col items-center text-center space-y-4">
									<div
										className="h-16 w-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
										style={{ backgroundColor: category.color + "20" }}
									>
										<div
											className="h-8 w-8 rounded-full"
											style={{ backgroundColor: category.color }}
										/>
									</div>
									<div className="space-y-2">
										<h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
											{category.name}
										</h3>
										{category.description && (
											<p className="text-sm text-muted-foreground line-clamp-3">
												{category.description}
											</p>
										)}
									</div>
									<Button
										variant="outline"
										size="sm"
										className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
									>
										View Prompts
									</Button>
								</div>
							</Link>
						))}
					</div>

					{categories.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-lg">
								No categories available at the moment.
							</p>
						</div>
					)}

					{/* Banner Ad: only show when there are categories */}
					{/* {categories.length >= 3 && (
						<EnhancedBannerAd
							adSlot="categories-page-banner"
							className="my-8"
						/>
					)} */}

					{/* Bottom Ad: only show when there is substantial content */}
					{/* {categories.length >= 6 && (
						<PolicyCompliantAd
							adSlot="categories-page-bottom"
							adFormat="auto"
							minContentHeight={800}
							position="bottom"
						/>
					)} */}
				</section>
			</div>

			{/* Sidebar Ads: only show when there are enough categories */}
			{/* {categories.length >= 3 && (
				<>
					<EnhancedSidebarAd position="left" />
					<EnhancedSidebarAd position="right" />
				</>
			)} */}
		</div>
	);
}
