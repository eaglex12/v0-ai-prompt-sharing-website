"use client";

import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { useState } from "react";

export default function PromptActions({
	content,
	title,
	shareUrl,
}: {
	content: string;
	title: string;
	shareUrl: string;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};

	const handleShare = async () => {
		try {
			if (navigator.share) {
				await navigator.share({ title, text: title, url: shareUrl });
			} else {
				await navigator.clipboard.writeText(shareUrl);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			}
		} catch {}
	};

	return (
		<div className="flex gap-2 pt-2">
			<Button onClick={handleCopy}>
				<Copy className="h-4 w-4 mr-2" /> {copied ? "Copied" : "Copy"}
			</Button>
			<Button variant="outline" onClick={handleShare}>
				<Share2 className="h-4 w-4 mr-2" /> Share
			</Button>
		</div>
	);
}
