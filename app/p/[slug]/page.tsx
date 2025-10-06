import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPromptBySlug } from "@/lib/database/prompts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Sparkles } from "lucide-react";

type PageProps = {
	params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const prompt = await getPromptBySlug(params.slug);
	if (!prompt) {
		return {
			title: "Prompt not found | AI Prompts Hub",
		};
	}
	const title = `${prompt.title} | AI Prompts Hub`;
	const description = prompt.description || prompt.content.slice(0, 160);
	const ogImage = prompt.reference_image_url || "/placeholder.jpg";
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [ogImage],
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function PromptPage({ params }: PageProps) {
	const prompt = await getPromptBySlug(params.slug);
	if (!prompt) return notFound();

	return (
		<div className="min-h-screen bg-background">
			<header className="border-b border-border">
				<div className="max-w-[80vw] mx-auto px-4 py-6 flex items-center gap-2">
					<Sparkles className="h-6 w-6 text-primary" />
					<h1 className="text-xl font-semibold">Prompt Details</h1>
				</div>
			</header>

			<main className="max-w-[80vw] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
				<section className="lg:col-span-2">
					<div className="rounded-xl border border-border bg-card overflow-hidden">
						<div className="relative w-full h-72">
							<Image
								src={prompt.reference_image_url || "/placeholder.svg"}
								alt={prompt.title}
								fill
								className="object-cover"
							/>
						</div>
						<div className="p-6 space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-2xl font-bold text-card-foreground">
									{prompt.title}
								</h2>
								{prompt.categories && (
									<Badge
										variant="secondary"
										className="text-xs"
										style={{
											backgroundColor:
												prompt.categories.color + "20",
											color: prompt.categories.color,
										}}
									>
										{prompt.categories.name}
									</Badge>
								)}
							</div>
							{prompt.description && (
								<p className="text-muted-foreground">
									{prompt.description}
								</p>
							)}
							<div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground whitespace-pre-wrap">
								{prompt.content}
							</div>
							{prompt.tags?.length ? (
								<div className="flex flex-wrap gap-2">
									{prompt.tags.map((t) => (
										<Badge
											key={t}
											variant="outline"
											className="text-xs"
										>
											{t}
										</Badge>
									))}
								</div>
							) : null}
							<div className="flex gap-2 pt-2">
								<Button
									onClick={async () => {
										try {
											await navigator.clipboard.writeText(
												prompt.content
											);
										} catch {}
									}}
								>
									<Copy className="h-4 w-4 mr-2" /> Copy
								</Button>
								<Button variant="outline">
									<Share2 className="h-4 w-4 mr-2" /> Share
								</Button>
							</div>

							{prompt.seo_content ? (
								<article
									className="prose prose-slate dark:prose-invert max-w-none border-t border-border pt-6"
									dangerouslySetInnerHTML={{
										__html: prompt.seo_content || "",
									}}
								/>
							) : null}
						</div>
					</div>
				</section>

				<aside className="space-y-4">
					<div className="rounded-xl border border-border bg-card p-4">
						<h3 className="font-semibold mb-2">About this prompt</h3>
						<div className="text-sm text-muted-foreground space-y-1">
							<p>Views: {prompt.views_count}</p>
							<p>Copies: {prompt.copies_count}</p>
							{prompt.is_trending ? <p>Trending now</p> : null}
							{prompt.is_featured ? <p>Featured</p> : null}
						</div>
					</div>
				</aside>
			</main>
		</div>
	);
}
