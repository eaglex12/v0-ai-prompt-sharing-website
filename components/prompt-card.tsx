"use client";

import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InteractionTracker } from "@/components/analytics/interaction-tracker";
import { Prompt } from "@/lib/database/prompts-client";
import { useState } from "react";

export default function PromptCard({
	prompt,
	handlePromptView,
	handleCopy,
	copiedId,
	setSelectedPrompt,
	setIsDialogOpen,
}: {
	prompt: Prompt;
	handlePromptView: (id: string) => void;
	handleCopy: (content: string, id: string) => void;
	copiedId: string | null;
	setSelectedPrompt: (prompt: Prompt) => void;
	setIsDialogOpen: (isOpen: boolean) => void;
}) {
	const [isSharing, setIsSharing] = useState(false);

	const handleShare = async () => {
		setIsSharing(true);

		try {
			const shareUrl = prompt.slug
				? `${window.location.origin}/p/${prompt.slug}`
				: window.location.href;

			const shareData = {
				title: prompt.title,
				text: prompt.description || prompt.title,
				url: shareUrl,
			};

			// Check if Web Share API is supported
			if (navigator.share && navigator.canShare?.(shareData)) {
				await navigator.share(shareData);
			} else {
				// Fallback: copy URL to clipboard
				await navigator.clipboard.writeText(shareUrl);
				alert("Link copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
			// Fallback: copy URL to clipboard
			try {
				const shareUrl = prompt.slug
					? `${window.location.origin}/p/${prompt.slug}`
					: window.location.href;
				await navigator.clipboard.writeText(shareUrl);
				alert("Link copied to clipboard!");
			} catch (clipboardError) {
				console.error("Error copying to clipboard:", clipboardError);
				alert("Unable to share. Please copy the URL manually.");
			}
		} finally {
			setIsSharing(false);
		}
	};
	return (
		<Card
			key={prompt.id}
			className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border p-0 h-full flex flex-col"
			onMouseEnter={() => handlePromptView(prompt.id)}
		>
			<CardHeader className="p-0">
				<div className="relative overflow-hidden rounded-t-lg">
					<img
						src={
							prompt.reference_image_url ||
							"/placeholder.svg?height=192&width=384"
						}
						alt={prompt.title}
						className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-lg"
					/>
					<Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
						Trending
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="px-4 flex-1">
				<div className="flex items-center justify-between mb-2">
					{prompt.categories && (
						<Badge
							variant="secondary"
							className="text-xs"
							style={{
								backgroundColor: prompt.categories.color + "20",
								color: prompt.categories.color,
							}}
						>
							{prompt.categories.name}
						</Badge>
					)}
					<div className="flex items-center gap-1 text-muted-foreground text-sm">
						<Copy className="h-4 w-4" />
						{prompt.copies_count}
					</div>
				</div>
				<h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground whitespace-nowrap overflow-hidden text-ellipsis">
					{prompt.title}
				</h3>
				<p className="text-muted-foreground text-sm mb-3 line-clamp-2">
					{prompt.description}
				</p>
				<p className="text-xs text-muted-foreground bg-muted rounded line-clamp-2">
					{prompt.content}
				</p>
			</CardContent>
			<CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
				<InteractionTracker promptId={prompt.id} action="copy">
					<Button
						size="sm"
						onClick={() => handleCopy(prompt.content, prompt.id)}
						className="flex-1 bg-primary hover:bg-primary/90"
					>
						<Copy className="h-4 w-4 mr-2" />
						{copiedId === prompt.id ? "Copied!" : "Copy"}
					</Button>
				</InteractionTracker>
				<InteractionTracker promptId={prompt.id} action="share">
					<Button
						size="sm"
						variant="outline"
						onClick={handleShare}
						disabled={isSharing}
					>
						<Share2 className="h-4 w-4" />
						{isSharing && <span className="ml-1 text-xs">...</span>}
					</Button>
				</InteractionTracker>
				<Button
					variant="outline"
					size="sm"
					onClick={() => {
						setSelectedPrompt(prompt);
						setIsDialogOpen(true);
					}}
				>
					View
				</Button>
			</CardFooter>
		</Card>
	);
}
