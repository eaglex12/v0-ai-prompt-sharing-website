import type { Metadata } from "next";
import { Sparkles, FileText, Shield, AlertTriangle, Users, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "Terms of Service - AI Prompts Hub Legal Terms",
	description: "Read the Terms of Service for AI Prompts Hub. Learn about your rights and responsibilities when using our AI prompt library and community platform.",
	keywords: [
		"terms of service",
		"AI prompts hub terms",
		"legal terms",
		"user agreement",
		"terms and conditions",
		"AI prompt platform terms",
	],
	openGraph: {
		title: "Terms of Service - AI Prompts Hub",
		description: "Terms and conditions for using AI Prompts Hub platform and services.",
		type: "website",
	},
};

export default function TermsPage() {
	// Structured data for Terms page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Terms of Service - AI Prompts Hub",
		description: "Terms and conditions for using AI Prompts Hub platform",
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/terms`,
		mainEntity: {
			"@type": "Organization",
			name: "AI Prompts Hub",
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
							<FileText className="h-3.5 w-3.5 text-primary" />
							<span>Legal Information</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							Terms of Service
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							Please read these terms carefully before using AI Prompts Hub. By using our service, you agree to these terms.
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					</div>
				</div>
			</section>

			<div className="md:max-w-[60vw] mx-auto px-4 py-8">
				{/* Quick Overview */}
				<section className="mb-12">
					<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="pt-6">
							<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<Shield className="h-5 w-5 text-primary" />
								Quick Overview
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
								<div className="flex items-start gap-2">
									<span className="text-green-600 mt-1">✓</span>
									<span>Free to use for personal and commercial projects</span>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-green-600 mt-1">✓</span>
									<span>No registration required</span>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-green-600 mt-1">✓</span>
									<span>Respectful community guidelines</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Terms Content */}
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-6 w-6 text-primary" />
								1. Acceptance of Terms
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								By accessing and using AI Prompts Hub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
								If you do not agree to abide by the above, please do not use this service.
							</p>
							<p className="text-muted-foreground leading-relaxed">
								These Terms of Service apply to all visitors, users, and others who access or use the Service.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe className="h-6 w-6 text-primary" />
								2. Use License
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								Permission is granted to temporarily access and use AI Prompts Hub for personal, non-commercial transitory viewing only. 
								This is the grant of a license, not a transfer of title, and under this license you may not:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Modify or copy the materials</li>
								<li>Use the materials for any commercial purpose or for any public display</li>
								<li>Attempt to reverse engineer any software contained on the website</li>
								<li>Remove any copyright or other proprietary notations from the materials</li>
							</ul>
							<p className="text-muted-foreground leading-relaxed">
								All AI prompts provided on this platform are free to use for both personal and commercial projects. 
								You may copy, modify, and distribute prompts as needed for your projects.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<AlertTriangle className="h-6 w-6 text-primary" />
								3. Disclaimer
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								The materials on AI Prompts Hub are provided on an 'as is' basis. AI Prompts Hub makes no warranties, expressed or implied, 
								and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of 
								merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
							</p>
							<p className="text-muted-foreground leading-relaxed">
								Further, AI Prompts Hub does not warrant or make any representations concerning the accuracy, likely results, 
								or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>4. Limitations</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								In no event shall AI Prompts Hub or its suppliers be liable for any damages (including, without limitation, 
								damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
								the materials on AI Prompts Hub, even if AI Prompts Hub or an authorized representative has been notified orally or in writing 
								of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, 
								or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>5. Accuracy of Materials</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								The materials appearing on AI Prompts Hub could include technical, typographical, or photographic errors. 
								AI Prompts Hub does not warrant that any of the materials on its website are accurate, complete, or current. 
								AI Prompts Hub may make changes to the materials contained on its website at any time without notice. 
								However, AI Prompts Hub does not make any commitment to update the materials.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>6. Links</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								AI Prompts Hub has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. 
								The inclusion of any link does not imply endorsement by AI Prompts Hub of the site. 
								Use of any such linked website is at the user's own risk.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>7. Modifications</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								AI Prompts Hub may revise these terms of service for its website at any time without notice. 
								By using this website you are agreeing to be bound by the then current version of these terms of service.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>8. Governing Law</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction 
								where AI Prompts Hub operates and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>9. User Conduct</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								Users agree to use AI Prompts Hub responsibly and in accordance with applicable laws. Prohibited activities include:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Attempting to gain unauthorized access to the platform</li>
								<li>Using the service for illegal or harmful purposes</li>
								<li>Interfering with the proper functioning of the platform</li>
								<li>Violating any applicable laws or regulations</li>
							</ul>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>10. Contact Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								If you have any questions about these Terms of Service, please contact us at:
							</p>
							<div className="bg-muted p-4 rounded-lg">
								<p className="font-medium">AI Prompts Hub</p>
								<p>Email: adivax143@gmail.com</p>
								<p>Website: <a href="/contact" className="text-primary hover:underline">Contact Us</a></p>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Call to Action */}
				<section className="mt-16">
					<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="pt-8 text-center">
							<h2 className="text-2xl font-heading font-bold mb-4">
								Questions About Our Terms?
							</h2>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								If you have any questions about these terms or need clarification on any point, 
								we're here to help. Contact us and we'll get back to you promptly.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<a
									href="/contact"
									className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
								>
									Contact Us
								</a>
								<a
									href="/"
									className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
								>
									<Sparkles className="h-4 w-4 mr-2" />
									Back to Prompts
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
