"use client";

import { EnhancedBannerAd } from "@/components/ads/enhanced-banner-ad";
import { EnhancedSidebarAd } from "@/components/ads/enhanced-sidebar-ad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnalytics } from "@/hooks/use-analytics";
import type { Category, Prompt } from "@/lib/database/prompts-client";
import {
	getAllCategories,
	getAllPrompts,
	getPromptsByCategory,
	getTrendingPrompts,
	searchPrompts,
} from "@/lib/database/prompts-client";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import PromptCard from "./prompt-card";
import PromptModal from "./prompt-modal";

export function HomePage() {
	const [prompts, setPrompts] = useState<Prompt[]>([]);
	const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { trackView } = useAnalytics();

	useEffect(() => {
		loadInitialData();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [searchQuery, selectedCategory]);

	const loadInitialData = async () => {
		try {
			const [allPrompts, trending, allCategories] = await Promise.all([
				getAllPrompts(),
				getTrendingPrompts(),
				getAllCategories(),
			]);

			setPrompts(allPrompts);
			setTrendingPrompts(trending);
			setCategories(allCategories);
		} catch (error) {
			console.error("Error loading data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async () => {
		try {
			let results: Prompt[];

			if (searchQuery.trim()) {
				results = await searchPrompts(searchQuery);
			} else if (selectedCategory === "All") {
				results = await getAllPrompts();
			} else {
				const category = categories.find((cat) => cat.name === selectedCategory);
				if (category) {
					results = await getPromptsByCategory(category.slug);
				} else {
					results = await getAllPrompts();
				}
			}

			setPrompts(results);
		} catch (error) {
			console.error("Error searching prompts:", error);
		}
	};

	const handleCopy = async (prompt: string, id: string) => {
		try {
			await navigator.clipboard.writeText(prompt);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	const handlePromptView = (promptId: string) => {
		trackView(promptId);
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
					<p className="text-muted-foreground">Loading AI prompts...</p>
				</div>
			</div>
		);
	}

	const categoryOptions = ["All", ...categories.map((cat) => cat.name)];

	return (
		<div className="min-h-screen bg-background">
			{/* Top Nav */}
			<header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
				<div className={`md:max-w-[80vw] mx-auto px-4 py-4`}>
					<div className="flex items-center justify-between">
						<a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
							<Sparkles className="h-7 w-7 text-primary" />
							<span className="text-xl font-heading font-bold text-foreground">
								AI Prompts Hub
							</span>
						</a>
						<div className="hidden md:block w-full max-w-lg ml-6">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search prompts..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="pl-10 bg-card border-border"
								/>
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					{/* soft gradient background with blobs */}
					<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
					<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
				</div>
				<div className={`md:max-w-[60vw] mx-auto px-4 pt-12 pb-8`}>
					<div className="text-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-4">
							<Sparkles className="h-3.5 w-3.5 text-primary" />
							<span>Discover, copy, and share the best AI prompts</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							Discover trending AI prompts to try right now
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							Explore what's hot across art, photography, and 3D. Copy a
							prompt and start creating in seconds.
						</p>
					</div>
				</div>
			</section>

			<div className={`md:max-w-[60vw] mx-auto px-4 py-8`}>
				{/* Main Content */}
				<div>
					{/* Trending Section */}
					{trendingPrompts.length > 0 && (
						<section className="mb-12">
							<div className="flex items-center gap-2 mb-6">
								<TrendingUp className="h-6 w-6 text-accent" />
								<h2 className="text-3xl font-heading font-bold text-foreground">
									Trending Prompts
								</h2>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{trendingPrompts.map((prompt) => (
									<PromptCard
										key={prompt.id}
										prompt={prompt}
										handlePromptView={handlePromptView}
										handleCopy={handleCopy}
										copiedId={copiedId}
										setSelectedPrompt={setSelectedPrompt}
										setIsDialogOpen={setIsDialogOpen}
									/>
								))}
							</div>
						</section>
					)}

					{/* Banner Ad: only show when there is meaningful content on screen */}
					{trendingPrompts.length >= 3 && (
						<EnhancedBannerAd adSlot="banner-ad-1" />
					)}

					{/* Category Filter */}
					<div className="flex flex-wrap gap-2 mb-8">
						{categoryOptions.map((category) => (
							<Button
								key={category}
								variant={
									selectedCategory === category ? "default" : "outline"
								}
								size="sm"
								onClick={() => setSelectedCategory(category)}
								className={
									selectedCategory === category
										? "bg-primary hover:bg-primary/90"
										: ""
								}
							>
								{category}
							</Button>
						))}
					</div>

					{/* All Prompts Grid */}
					<section>
						<h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
							{selectedCategory === "All"
								? "All Prompts"
								: selectedCategory}
						</h2>

						<div className="my-4 md:my-8 max-w-2xl mx-auto">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
								<Input
									placeholder="Try: cyberpunk portrait, product render, isometric room..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="h-12 md:h-14 pl-11 bg-card/80 border-border text-base"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{prompts.map((prompt) => (
								<PromptCard
									key={prompt.id}
									prompt={prompt}
									handlePromptView={handlePromptView}
									handleCopy={handleCopy}
									copiedId={copiedId}
									setSelectedPrompt={setSelectedPrompt}
									setIsDialogOpen={setIsDialogOpen}
								/>
							))}
						</div>

						{prompts.length === 0 && !isLoading && (
							<div className="text-center py-12">
								<p className="text-muted-foreground text-lg">
									No prompts found matching your search.
								</p>
							</div>
						)}

						{/* Bottom Banner Ad: only show when there is substantial list content */}
						{prompts.length >= 3 && (
							<EnhancedBannerAd adSlot="banner-ad-2" />
						)}
					</section>
				</div>
			</div>

			{/* Sidebar Ads: only show when the page has enough content density */}
			{(prompts.length >= 3 || trendingPrompts.length >= 3) && (
				<>
					<EnhancedSidebarAd position="left" />
					<EnhancedSidebarAd position="right" />
				</>
			)}

			{/* Prompt Detail Modal */}
			<PromptModal
				isDialogOpen={isDialogOpen}
				setIsDialogOpen={setIsDialogOpen}
				selectedPrompt={selectedPrompt}
				handleCopy={handleCopy}
			/>

			{/* Footer */}
			<footer className="bg-card border-t border-border mt-16">
				<div className={`max-w-[80vw] mx-auto px-4 py-8`}>
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center gap-2 mb-4 md:mb-0">
							<Sparkles className="h-6 w-6 text-primary" />
							<span className="font-heading font-semibold text-card-foreground">
								AI Prompts Hub
							</span>
						</div>
						<div className="flex gap-6 text-sm text-muted-foreground">
							<a
								href="/about"
								className="hover:text-foreground transition-colors"
							>
								About
							</a>
							<a
								href="/contact"
								className="hover:text-foreground transition-colors"
							>
								Contact
							</a>
							<a
								href="/terms"
								className="hover:text-foreground transition-colors"
							>
								Terms
							</a>
							<a
								href="/privacy"
								className="hover:text-foreground transition-colors"
							>
								Privacy
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
