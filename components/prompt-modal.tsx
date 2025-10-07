"use client";

import { Dialog } from "@/components/ui/dialog";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { Prompt } from "@/lib/database/prompts-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InteractionTracker } from "@/components/analytics/interaction-tracker";
import { DummyAd } from "@/components/ads/dummy-ad";

export default function PromptModal({
	isDialogOpen,
	setIsDialogOpen,
	selectedPrompt,
	handleCopy,
}: {
	isDialogOpen: boolean;
	setIsDialogOpen: (isOpen: boolean) => void;
	selectedPrompt: Prompt | null;
	handleCopy: (content: string, id: string) => void;
}) {
	const [isSharing, setIsSharing] = useState(false);

	const handleShare = async () => {
		if (!selectedPrompt) return;

		setIsSharing(true);

		try {
			const shareUrl = selectedPrompt.slug
				? `${window.location.origin}/p/${selectedPrompt.slug}`
				: window.location.href;

			const shareData = {
				title: selectedPrompt.title,
				text: selectedPrompt.description || selectedPrompt.title,
				url: shareUrl,
			};

			// Check if Web Share API is supported
			if (navigator.share && navigator.canShare?.(shareData)) {
				await navigator.share(shareData);
			} else {
				// Fallback: copy URL to clipboard
				await navigator.clipboard.writeText(shareUrl);
				// You could add a toast notification here if you have one
				alert("Link copied to clipboard!");
			}
		} catch (error) {
			console.error("Error sharing:", error);
			// Fallback: copy URL to clipboard
			try {
				const shareUrl = selectedPrompt.slug
					? `${window.location.origin}/p/${selectedPrompt.slug}`
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
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>{selectedPrompt?.title}</DialogTitle>
					<DialogDescription>{selectedPrompt?.description}</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="relative w-full h-60 overflow-hidden rounded-md border">
						{selectedPrompt && (
							<Image
								src={
									selectedPrompt.reference_image_url ||
									"/placeholder.svg"
								}
								alt={selectedPrompt.title}
								fill
								className="object-cover"
							/>
						)}
					</div>
					<div className="flex flex-wrap gap-2">
						{selectedPrompt?.tags?.map((t) => (
							<Badge key={t} variant="outline" className="text-xs">
								{t}
							</Badge>
						))}
					</div>
					<div className="rounded-md border bg-muted/60 p-3 max-h-48 overflow-auto text-xs text-muted-foreground">
						{selectedPrompt?.content}
					</div>

					{/* Ad in modal */}
					<div className="pt-4">
						<DummyAd variant="banner" />
					</div>
				</div>
				<DialogFooter>
					{selectedPrompt && (
						<InteractionTracker promptId={selectedPrompt.id} action="copy">
							<Button
								onClick={() =>
									handleCopy(selectedPrompt.content, selectedPrompt.id)
								}
								className="bg-primary hover:bg-primary/90"
								size="sm"
							>
								<Copy className="h-4 w-4 mr-2" /> Copy prompt
							</Button>
						</InteractionTracker>
					)}
					{selectedPrompt?.slug && (
						<Link href={`/p/${selectedPrompt.slug}`} prefetch>
							<Button variant="secondary" size="sm" className="w-full">
								Open details
							</Button>
						</Link>
					)}
					{selectedPrompt && (
						<InteractionTracker promptId={selectedPrompt.id} action="share">
							<Button
								variant="outline"
								size="sm"
								onClick={handleShare}
								disabled={isSharing}
							>
								<Share2 className="h-4 w-4 mr-2" />
								{isSharing ? "Sharing..." : "Share"}
							</Button>
						</InteractionTracker>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
