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
	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogContent className="sm:max-w-2xl">
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
				</div>
				<DialogFooter>
					<Button
						onClick={() =>
							selectedPrompt &&
							handleCopy(selectedPrompt.content, selectedPrompt.id)
						}
						className="bg-primary hover:bg-primary/90"
						size="sm"
					>
						<Copy className="h-4 w-4 mr-2" /> Copy prompt
					</Button>
					{selectedPrompt?.slug && (
						<Link href={`/p/${selectedPrompt.slug}`} prefetch>
							<Button variant="secondary" size="sm">
								Open details
							</Button>
						</Link>
					)}
					<Button variant="outline" size="sm">
						<Share2 className="h-4 w-4 mr-2" /> Share
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
