"use client";

import { EnhancedBannerAd } from "@/components/ads/enhanced-banner-ad";
import { EnhancedSidebarAd } from "@/components/ads/enhanced-sidebar-ad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAnalytics } from "@/hooks/use-analytics";
import type { Category, Prompt } from "@/lib/database/prompts-client";
import { searchPrompts } from "@/lib/database/prompts-client";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import PromptCard from "./prompt-card";
import PromptModal from "./prompt-modal";

interface CategoryPageProps {
	category: Category;
	initialPrompts: Prompt[];
}

export function CategoryPage({ category, initialPrompts }: CategoryPageProps) {
	const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts);
	const [searchQuery, setSearchQuery] = useState("");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { trackView } = useAnalytics();

	useEffect(() => {
		handleSearch();
	}, [searchQuery]);

	const handleSearch = async () => {
		try {
			let results: Prompt[];

			if (searchQuery.trim()) {
				// Search within the category
				const allResults = await searchPrompts(searchQuery);
				results = allResults.filter(
					(prompt) => prompt.categories?.slug === category.slug
				);
			} else {
				results = initialPrompts;
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

	return (
		<div className="min-h-screen bg-background">
			{/* Top Nav */}
			<header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
				<div className={`md:max-w-[80vw] mx-auto px-4 py-4`}>
					<div className="flex items-center justify-between">
						<Link
							href="/"
							className="flex items-center gap-2 hover:opacity-80 transition-opacity"
						>
							<Sparkles className="h-7 w-7 text-primary" />
							<span className="text-xl font-heading font-bold text-foreground">
								AI Prompts Hub
							</span>
						</Link>
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

			{/* Category Header */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div
						className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20"
						style={{ backgroundColor: category.color }}
					/>
					<div
						className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-20"
						style={{ backgroundColor: category.color }}
					/>
				</div>
				<div className={`md:max-w-[60vw] mx-auto px-4 pt-12 pb-8`}>
					<div className="text-center">
						<div>
							<Link
								href="/"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
							>
								<ArrowLeft className="h-4 w-4" />
								Back to all prompts
							</Link>
						</div>

						<div
							className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm mb-4"
							style={{ borderColor: category.color + "40" }}
						>
							<div
								className="h-3 w-3 rounded-full"
								style={{ backgroundColor: category.color }}
							/>
							<span style={{ color: category.color }}>
								{category.name} Category
							</span>
						</div>

						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							{category.name} AI Prompts
						</h1>

						{category.description && (
							<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
								{category.description}
							</p>
						)}

						<p className="mt-2 text-sm text-muted-foreground">
							{prompts.length} creative prompts available
						</p>
					</div>
				</div>
			</section>

			<div className={`md:max-w-[60vw] mx-auto px-4 py-8`}>
				{/* Search Section */}
				<div className="my-4 md:my-8 max-w-2xl mx-auto">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
						<Input
							placeholder={`Search ${category.name.toLowerCase()} prompts...`}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-12 md:h-14 pl-11 bg-card/80 border-border text-base"
						/>
					</div>
				</div>

				{/* Prompts Grid */}
				<section>
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

					{prompts.length === 0 && (
						<div className="text-center py-12">
							<p className="text-muted-foreground text-lg">
								{searchQuery
									? `No ${category.name.toLowerCase()} prompts found matching "${searchQuery}".`
									: `No prompts found in the ${category.name.toLowerCase()} category.`}
							</p>
							{searchQuery && (
								<Button
									variant="outline"
									onClick={() => setSearchQuery("")}
									className="mt-4"
								>
									Clear search
								</Button>
							)}
						</div>
					)}

					{/* Banner Ad: only show when there is meaningful content */}
					{prompts.length >= 3 && <EnhancedBannerAd adSlot="banner-ad-1" />}
				</section>
			</div>

			{/* Sidebar Ads: only show when the page has enough content density */}
			{prompts.length >= 3 && (
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
							<Link
								href="/about"
								className="hover:text-foreground transition-colors"
							>
								About
							</Link>
							<Link
								href="/contact"
								className="hover:text-foreground transition-colors"
							>
								Contact
							</Link>
							<Link
								href="/terms"
								className="hover:text-foreground transition-colors"
							>
								Terms
							</Link>
							<Link
								href="/privacy"
								className="hover:text-foreground transition-colors"
							>
								Privacy
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
