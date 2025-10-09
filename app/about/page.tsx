import type { Metadata } from "next";
import { Sparkles, Users, Target, Zap, Heart, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
	title: "About AI Prompts Hub - Your Ultimate AI Prompt Library",
	description: "Learn about AI Prompts Hub - the leading platform for discovering, sharing, and exploring trending AI prompts for ChatGPT, Midjourney, DALL-E, Gemini and more AI tools.",
	keywords: [
		"about AI prompts hub",
		"AI prompt library",
		"AI prompt sharing platform",
		"ChatGPT prompts community",
		"Midjourney prompts",
		"AI tools community",
		"prompt engineering platform",
	],
	openGraph: {
		title: "About AI Prompts Hub - Discover the Future of AI Prompts",
		description: "Learn about our mission to democratize AI prompt engineering and help creators discover the best prompts for all AI tools.",
		type: "website",
	},
};

export default function AboutPage() {
	// Structured data for About page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "AboutPage",
		name: "About AI Prompts Hub",
		description: "Learn about AI Prompts Hub - the leading platform for discovering and sharing AI prompts",
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/about`,
		mainEntity: {
			"@type": "Organization",
			name: "AI Prompts Hub",
			description: "The ultimate platform for discovering, sharing, and exploring AI prompts",
			foundingDate: "2024",
			url: process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in",
		},
	};

	return (
		<div className="min-h-screen bg-background">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			
			{/* Header */}
			<header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
				<div className="md:max-w-[80vw] mx-auto px-4 py-4">
					<a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
						<Sparkles className="h-7 w-7 text-primary" />
						<span className="text-xl font-heading font-bold text-foreground">
							AI Prompts Hub
						</span>
					</a>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="pointer-events-none absolute inset-0 -z-10">
					<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
					<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
				</div>
				<div className="md:max-w-[60vw] mx-auto px-4 pt-12 pb-8">
					<div className="text-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-4">
							<Heart className="h-3.5 w-3.5 text-primary" />
							<span>Built by creators, for creators</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							About AI Prompts Hub
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							We're on a mission to democratize AI prompt engineering and help creators discover the most effective prompts for all AI tools.
						</p>
					</div>
				</div>
			</section>

			<div className="md:max-w-[60vw] mx-auto px-4 py-8">
				{/* Our Story */}
				<section className="mb-16">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Sparkles className="h-6 w-6 text-primary" />
								Our Story
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								AI Prompts Hub was born from a simple observation: while AI tools like ChatGPT, Midjourney, and DALL-E are incredibly powerful, 
								finding the right prompts to unlock their full potential can be challenging and time-consuming.
							</p>
							<p className="text-muted-foreground leading-relaxed">
								We noticed creators spending hours experimenting with different prompt variations, often reinventing the wheel. 
								That's when we realized the need for a centralized platform where the AI community could discover, share, and refine the most effective prompts.
							</p>
							<p className="text-muted-foreground leading-relaxed">
								Today, AI Prompts Hub serves as the go-to destination for creators, developers, artists, and AI enthusiasts who want to 
								leverage the power of AI tools with proven, effective prompts.
							</p>
						</CardContent>
					</Card>
				</section>

				{/* Our Mission */}
				<section className="mb-16">
					<h2 className="text-3xl font-heading font-bold mb-8 text-center">Our Mission</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card>
							<CardHeader className="text-center">
								<Target className="h-12 w-12 text-primary mx-auto mb-4" />
								<CardTitle>Democratize AI</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-center">
									Make AI tools accessible to everyone by providing high-quality prompts that work out of the box.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="text-center">
								<Users className="h-12 w-12 text-primary mx-auto mb-4" />
								<CardTitle>Build Community</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-center">
									Foster a collaborative environment where creators share knowledge and learn from each other.
								</CardDescription>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="text-center">
								<Zap className="h-12 w-12 text-primary mx-auto mb-4" />
								<CardTitle>Accelerate Creation</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-center">
									Help creators focus on their vision rather than spending time crafting the perfect prompt.
								</CardDescription>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* What We Offer */}
				<section className="mb-16">
					<h2 className="text-3xl font-heading font-bold mb-8 text-center">What We Offer</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<Card>
							<CardHeader>
								<CardTitle>Curated Prompt Library</CardTitle>
								<CardDescription>
									Thousands of hand-picked prompts across multiple categories
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li>• Trending prompts updated daily</li>
									<li>• Categories: Art, Photography, Writing, Productivity</li>
									<li>• Support for ChatGPT, Midjourney, DALL-E, Gemini</li>
									<li>• Quality-tested and community-verified</li>
								</ul>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Smart Discovery</CardTitle>
								<CardDescription>
									Find the perfect prompt with our intelligent search
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li>• Advanced search and filtering</li>
									<li>• Trending and featured prompts</li>
									<li>• Category-based browsing</li>
									<li>• Personalized recommendations</li>
								</ul>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Community Features</CardTitle>
								<CardDescription>
									Engage with fellow creators and share your discoveries
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li>• Like and save your favorite prompts</li>
									<li>• Share prompts with attribution</li>
									<li>• Community-driven quality ratings</li>
									<li>• Regular prompt challenges and contests</li>
								</ul>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Free & Accessible</CardTitle>
								<CardDescription>
									No barriers to accessing great AI prompts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2 text-muted-foreground">
									<li>• Completely free to use</li>
									<li>• No registration required</li>
									<li>• Mobile-optimized experience</li>
									<li>• Regular updates and new content</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Our Values */}
				<section className="mb-16">
					<h2 className="text-3xl font-heading font-bold mb-8 text-center">Our Values</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
								<Heart className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-semibold mb-2">Passion</h3>
							<p className="text-sm text-muted-foreground">
								We're passionate about AI and its potential to transform creativity.
							</p>
						</div>
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
								<Globe className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-semibold mb-2">Accessibility</h3>
							<p className="text-sm text-muted-foreground">
								AI tools should be accessible to everyone, regardless of technical expertise.
							</p>
						</div>
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
								<Users className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-semibold mb-2">Community</h3>
							<p className="text-sm text-muted-foreground">
								We believe in the power of community-driven knowledge sharing.
							</p>
						</div>
						<div className="text-center">
							<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
								<Zap className="h-8 w-8 text-primary" />
							</div>
							<h3 className="font-semibold mb-2">Innovation</h3>
							<p className="text-sm text-muted-foreground">
								We continuously innovate to improve the prompt discovery experience.
							</p>
						</div>
					</div>
				</section>

				{/* Call to Action */}
				<section className="text-center">
					<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="pt-8">
							<h2 className="text-2xl font-heading font-bold mb-4">
								Ready to Discover Amazing AI Prompts?
							</h2>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								Join thousands of creators who are already using AI Prompts Hub to unlock the full potential of AI tools.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a
									href="/"
									className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									<Sparkles className="h-4 w-4 mr-2" />
									Explore Prompts
								</a>
								<a
									href="/contact"
									className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
								>
									Get in Touch
								</a>
							</div>
						</CardContent>
					</Card>
				</section>
			</div>

			{/* Footer */}
			<footer className="bg-card border-t border-border mt-16">
				<div className="max-w-[80vw] mx-auto px-4 py-8">
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
