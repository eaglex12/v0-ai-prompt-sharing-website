import type { Metadata } from "next";
import { Sparkles, Mail, MessageSquare, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Contact AI Prompts Hub - Get in Touch with Our Team",
	description: "Contact AI Prompts Hub for support, feedback, or collaboration. We're here to help you discover the best AI prompts and improve your AI tool experience.",
	keywords: [
		"contact AI prompts hub",
		"AI prompt support",
		"feedback AI prompts",
		"collaborate AI community",
		"AI prompt help",
		"contact form",
	],
	openGraph: {
		title: "Contact AI Prompts Hub - We'd Love to Hear from You",
		description: "Get in touch with our team for support, feedback, or collaboration opportunities.",
		type: "website",
	},
};

export default function ContactPage() {
	return (
		<div className="min-h-screen bg-background">
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
							<MessageSquare className="h-3.5 w-3.5 text-primary" />
							<span>We'd love to hear from you</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							Get in Touch
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							Have questions, feedback, or ideas? We're here to help and would love to hear from you.
						</p>
					</div>
				</div>
			</section>

			<div className="md:max-w-[60vw] mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					{/* Contact Information */}
					<div className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Mail className="h-6 w-6 text-primary" />
									Contact Information
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start gap-3">
									<Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="font-medium">Email</p>
										<p className="text-muted-foreground">adivax143@gmail.com</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="font-medium">Response Time</p>
										<p className="text-muted-foreground">Within 24 hours</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="font-medium">Location</p>
										<p className="text-muted-foreground">Global Community</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>What We Can Help With</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-3 text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">•</span>
										<span>Technical support and troubleshooting</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">•</span>
										<span>Feature requests and suggestions</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">•</span>
										<span>Partnership and collaboration opportunities</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">•</span>
										<span>Content submission and moderation</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary mt-1">•</span>
										<span>General feedback and questions</span>
									</li>
								</ul>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Frequently Asked Questions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<h4 className="font-medium mb-1">How do I submit a prompt?</h4>
									<p className="text-sm text-muted-foreground">
										Currently, prompts are curated by our team. Contact us if you'd like to suggest a prompt for inclusion.
									</p>
								</div>
								<div>
									<h4 className="font-medium mb-1">Is AI Prompts Hub free?</h4>
									<p className="text-sm text-muted-foreground">
										Yes! All prompts and features are completely free to use.
									</p>
								</div>
								<div>
									<h4 className="font-medium mb-1">Can I use prompts commercially?</h4>
									<p className="text-sm text-muted-foreground">
										Yes, all prompts on our platform are free to use for both personal and commercial projects.
									</p>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Additional Information */}
				<section className="mt-16">
					<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="pt-8 text-center">
							<h2 className="text-2xl font-heading font-bold mb-4">
								Join Our Community
							</h2>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								Stay updated with the latest AI prompts, tips, and community highlights by following us on social media.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a
									href="/"
									className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									<Sparkles className="h-4 w-4 mr-2" />
									Back to Prompts
								</a>
								<a
									href="/about"
									className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
								>
									Learn More About Us
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