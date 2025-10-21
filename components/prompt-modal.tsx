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
import { Copy, Share2, X } from "lucide-react";
import { Prompt } from "@/lib/database/prompts-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InteractionTracker } from "@/components/analytics/interaction-tracker";
import { AdSenseAd } from "@/components/ads/adsense-ad";

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
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto mx-4 sm:mx-0">
				<DialogHeader className="space-y-3">
					<div className="flex items-start justify-between">
						<div className="flex-1 min-w-0">
							<DialogTitle className="text-lg sm:text-xl leading-tight">{selectedPrompt?.title}</DialogTitle>
							<DialogDescription className="text-sm sm:text-base mt-1">{selectedPrompt?.description}</DialogDescription>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsDialogOpen(false)}
							className="ml-2 flex-shrink-0 h-8 w-8 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>
				<div className="grid gap-4">
					<div className="relative w-full h-48 sm:h-60 overflow-hidden rounded-md border">
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
					<div className="rounded-md border bg-muted/60 p-3 max-h-48 overflow-auto text-xs sm:text-sm text-muted-foreground">
						{selectedPrompt?.content}
					</div>

					{/* Ad in modal */}
					<div className="pt-4">
						<AdSenseAd 
							adSlot="modal-ad-slot"
							adFormat="auto"
							adStyle={{ display: "block", width: "100%" }}
							className="w-full"
						/>
					</div>
				</div>
				<DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
					{selectedPrompt && (
						<InteractionTracker promptId={selectedPrompt.id} action="copy">
							<Button
								onClick={() =>
									handleCopy(selectedPrompt.content, selectedPrompt.id)
								}
								className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
								size="sm"
							>
								<Copy className="h-4 w-4 mr-2" /> Copy prompt
							</Button>
						</InteractionTracker>
					)}
					{selectedPrompt?.slug && (
						<Link href={`/p/${selectedPrompt.slug}`} prefetch className="w-full sm:w-auto">
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
								className="w-full sm:w-auto"
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
