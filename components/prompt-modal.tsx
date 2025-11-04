"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Share2, X } from "lucide-react";
import type { Prompt } from "@/lib/database/prompts-client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { InteractionTracker } from "@/components/analytics/interaction-tracker";

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
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const handleModalCopy = async (content: string, id: string) => {
		try {
			await navigator.clipboard.writeText(content);
			setCopiedId(id);
			setTimeout(() => setCopiedId(null), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

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
			<DialogContent
				showCloseButton={false}
				className="sm:max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col mx-4 sm:mx-0 p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl bg-card"
			>
				{/* Header - Fixed with enhanced styling */}
				<DialogHeader className="p-6 pb-5 flex-shrink-0 border-b border-border/50 bg-gradient-to-br from-background to-background/95">
					<div className="flex items-start justify-between gap-4">
						<div className="flex-1 min-w-0">
							<DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight pr-2 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
								{selectedPrompt?.title}
							</DialogTitle>
							{selectedPrompt?.description && (
								<DialogDescription className="text-sm sm:text-base mt-3 text-muted-foreground/90 leading-relaxed">
									{selectedPrompt.description}
								</DialogDescription>
							)}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsDialogOpen(false)}
							className="flex-shrink-0 h-9 w-9 p-0 -mt-1 -mr-1 hover:bg-primary/10 hover:text-primary rounded-full transition-all duration-200"
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</DialogHeader>

				<div className="overflow-y-auto">
					{/* Image - Fixed with enhanced styling */}
					{selectedPrompt?.reference_image_url && (
						<div className="px-6 py-5 flex-shrink-0">
							<div className="relative w-full h-64 sm:h-80 overflow-hidden rounded-xl border border-border/50 bg-muted/30 shadow-md hover:shadow-lg transition-shadow duration-300">
								<Image
									src={
										selectedPrompt.reference_image_url ||
										"/placeholder.svg"
									}
									alt={selectedPrompt.title}
									fill
									className="object-contain"
								/>
							</div>
						</div>
					)}

					{/* Tags - Fixed with enhanced styling */}
					{selectedPrompt?.tags && selectedPrompt.tags.length > 0 && (
						<div className="px-6 pb-4 flex-shrink-0">
							<div className="flex flex-wrap gap-2">
								{selectedPrompt.tags.map((t) => (
									<Badge
										key={t}
										variant="outline"
										className="text-xs font-medium px-3 py-1 rounded-full border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 transition-colors duration-200"
									>
										{t}
									</Badge>
								))}
							</div>
						</div>
					)}

					{/* Paragraph Content - Scrollable with enhanced styling */}
					<div className="flex-1 min-h-0 px-6 pb-4 overflow-hidden">
						<div className="h-full rounded-xl border border-border/50 bg-muted/40 p-5 text-sm sm:text-base text-foreground/85 whitespace-pre-wrap break-words overflow-y-auto leading-relaxed shadow-inner">
							{selectedPrompt?.content}
						</div>
					</div>
				</div>

				{/* Footer - Fixed with enhanced styling */}
				<DialogFooter className="p-6 pt-5 flex-shrink-0 border-t border-border/50 bg-gradient-to-br from-background/95 to-background">
					<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
						{selectedPrompt && (
							<InteractionTracker
								promptId={selectedPrompt.id}
								action="copy"
							>
								<Button
									onClick={() =>
										handleModalCopy(
											selectedPrompt.content,
											selectedPrompt.id
										)
									}
									className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground w-full sm:w-auto font-semibold shadow-md hover:shadow-lg transition-all duration-200"
									size="sm"
								>
									<Copy className="h-4 w-4 mr-2" />
									{copiedId === selectedPrompt.id
										? "Copied! ✓"
										: "Copy prompt"}
								</Button>
							</InteractionTracker>
						)}
						{selectedPrompt?.slug && (
							<Link
								href={`/p/${selectedPrompt.slug}`}
								prefetch
								className="w-full sm:w-auto"
							>
								<Button
									variant="outline"
									size="sm"
									className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 font-semibold transition-all duration-200 bg-transparent"
								>
									Open details
								</Button>
							</Link>
						)}
						{selectedPrompt && (
							<InteractionTracker
								promptId={selectedPrompt.id}
								action="share"
							>
								<Button
									variant="outline"
									size="sm"
									onClick={handleShare}
									disabled={isSharing}
									className="w-full sm:w-auto border-border/50 text-muted-foreground hover:text-foreground hover:border-border font-semibold transition-all duration-200 disabled:opacity-50 bg-transparent"
								>
									<Share2 className="h-4 w-4 mr-2" />
									{isSharing ? "Sharing..." : "Share"}
								</Button>
							</InteractionTracker>
						)}
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
