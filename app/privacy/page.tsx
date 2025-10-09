import type { Metadata } from "next";
import { Sparkles, Shield, Eye, Database, Cookie, Lock, Users, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
	title: "Privacy Policy - AI Prompts Hub Data Protection",
	description: "Read AI Prompts Hub's Privacy Policy to understand how we collect, use, and protect your personal information when using our AI prompt platform.",
	keywords: [
		"privacy policy",
		"AI prompts hub privacy",
		"data protection",
		"privacy rights",
		"personal information",
		"GDPR compliance",
	],
	openGraph: {
		title: "Privacy Policy - AI Prompts Hub",
		description: "Learn how we protect your privacy and handle your data on AI Prompts Hub.",
		type: "website",
	},
};

export default function PrivacyPage() {
	// Structured data for Privacy page
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "Privacy Policy - AI Prompts Hub",
		description: "Privacy policy and data protection information for AI Prompts Hub",
		url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://prompt.org.in"}/privacy`,
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
							<Shield className="h-3.5 w-3.5 text-primary" />
							<span>Your Privacy Matters</span>
						</div>
						<h1 className="text-4xl md:text-6xl font-heading font-extrabold tracking-tight text-foreground">
							Privacy Policy
						</h1>
						<p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
							We are committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
						</p>
					</div>
				</div>
			</section>

			<div className="md:max-w-[60vw] mx-auto px-4 py-8">
				{/* Privacy Overview */}
				<section className="mb-12">
					<Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
						<CardContent className="pt-6">
							<h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
								<Lock className="h-5 w-5 text-primary" />
								Privacy Overview
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-3">
									<h3 className="font-medium text-green-600">What We Do</h3>
									<ul className="space-y-2 text-sm text-muted-foreground">
										<li className="flex items-start gap-2">
											<span className="text-green-600 mt-1">✓</span>
											<span>Minimal data collection</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-green-600 mt-1">✓</span>
											<span>No personal information required</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-green-600 mt-1">✓</span>
											<span>Secure data handling</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-green-600 mt-1">✓</span>
											<span>Transparent practices</span>
										</li>
									</ul>
								</div>
								<div className="space-y-3">
									<h3 className="font-medium text-blue-600">Your Rights</h3>
									<ul className="space-y-2 text-sm text-muted-foreground">
										<li className="flex items-start gap-2">
											<span className="text-blue-600 mt-1">✓</span>
											<span>Access your data</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-600 mt-1">✓</span>
											<span>Request data deletion</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-600 mt-1">✓</span>
											<span>Opt-out of tracking</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-blue-600 mt-1">✓</span>
											<span>Contact us anytime</span>
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>

				{/* Privacy Content */}
				<div className="space-y-8">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Eye className="h-6 w-6 text-primary" />
								1. Information We Collect
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-4">
								<div>
									<h4 className="font-medium mb-2">Information You Provide</h4>
									<p className="text-muted-foreground text-sm">
										We collect minimal information that you voluntarily provide, such as:
									</p>
									<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
										<li>Contact form submissions (name, email, message)</li>
										<li>Feedback and suggestions</li>
										<li>Any communications you send to us</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium mb-2">Automatically Collected Information</h4>
									<p className="text-muted-foreground text-sm">
										We automatically collect certain information when you use our service:
									</p>
									<ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4 mt-2">
										<li>IP address and general location</li>
										<li>Browser type and version</li>
										<li>Device information</li>
										<li>Usage patterns and analytics data</li>
										<li>Cookies and similar technologies</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Database className="h-6 w-6 text-primary" />
								2. How We Use Your Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								We use the information we collect for the following purposes:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-3">
									<h4 className="font-medium">Service Operation</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Provide and maintain our service</li>
										<li>• Improve user experience</li>
										<li>• Analyze usage patterns</li>
										<li>• Troubleshoot technical issues</li>
									</ul>
								</div>
								<div className="space-y-3">
									<h4 className="font-medium">Communication</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Respond to your inquiries</li>
										<li>• Send important updates</li>
										<li>• Provide customer support</li>
										<li>• Share relevant information</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Cookie className="h-6 w-6 text-primary" />
								3. Cookies and Tracking Technologies
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								We use cookies and similar technologies to enhance your experience:
							</p>
							<div className="space-y-4">
								<div>
									<h4 className="font-medium mb-2">Essential Cookies</h4>
									<p className="text-sm text-muted-foreground">
										These cookies are necessary for the website to function properly and cannot be disabled.
									</p>
								</div>
								<div>
									<h4 className="font-medium mb-2">Analytics Cookies</h4>
									<p className="text-sm text-muted-foreground">
										We use analytics tools to understand how visitors interact with our website. 
										You can opt-out of analytics tracking.
									</p>
								</div>
								<div>
									<h4 className="font-medium mb-2">Advertising Cookies</h4>
									<p className="text-sm text-muted-foreground">
										We may use advertising cookies to show relevant ads. You can manage these preferences in your browser settings.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-6 w-6 text-primary" />
								4. Data Security
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								We implement appropriate security measures to protect your personal information:
							</p>
							<ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
								<li>Encryption of data in transit and at rest</li>
								<li>Regular security audits and updates</li>
								<li>Access controls and authentication</li>
								<li>Secure hosting infrastructure</li>
								<li>Regular backups and disaster recovery</li>
							</ul>
							<p className="text-muted-foreground leading-relaxed">
								However, no method of transmission over the Internet or electronic storage is 100% secure. 
								While we strive to protect your personal information, we cannot guarantee absolute security.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-6 w-6 text-primary" />
								5. Third-Party Services
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								We may use third-party services that collect information about you:
							</p>
							<div className="space-y-3">
								<div>
									<h4 className="font-medium">Analytics Services</h4>
									<p className="text-sm text-muted-foreground">
										We use analytics services like Google Analytics to understand website usage. 
										These services may collect information about your visits to our website.
									</p>
								</div>
								<div>
									<h4 className="font-medium">Advertising Services</h4>
									<p className="text-sm text-muted-foreground">
										We may use advertising services like Google AdSense to display relevant advertisements. 
										These services may use cookies and similar technologies.
									</p>
								</div>
								<div>
									<h4 className="font-medium">Hosting Services</h4>
									<p className="text-sm text-muted-foreground">
										Our website is hosted on secure cloud infrastructure. 
										These providers may have access to certain technical information.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe className="h-6 w-6 text-primary" />
								6. International Data Transfers
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								Your information may be transferred to and processed in countries other than your own. 
								We ensure that such transfers comply with applicable data protection laws and implement 
								appropriate safeguards to protect your personal information.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>7. Your Rights and Choices</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								Depending on your location, you may have certain rights regarding your personal information:
							</p>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="space-y-2">
									<h4 className="font-medium">Access and Portability</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Request access to your data</li>
										<li>• Receive a copy of your data</li>
										<li>• Data portability</li>
									</ul>
								</div>
								<div className="space-y-2">
									<h4 className="font-medium">Control and Deletion</h4>
									<ul className="space-y-1 text-sm text-muted-foreground">
										<li>• Request data deletion</li>
										<li>• Correct inaccurate data</li>
										<li>• Restrict processing</li>
									</ul>
								</div>
							</div>
							<p className="text-muted-foreground leading-relaxed">
								To exercise these rights, please contact us using the information provided in the Contact section.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>8. Children's Privacy</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								Our service is not intended for children under 13 years of age. We do not knowingly collect 
								personal information from children under 13. If you are a parent or guardian and believe 
								your child has provided us with personal information, please contact us.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>9. Changes to This Privacy Policy</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								We may update this Privacy Policy from time to time. We will notify you of any changes by 
								posting the new Privacy Policy on this page and updating the "Last updated" date.
							</p>
							<p className="text-muted-foreground leading-relaxed">
								We encourage you to review this Privacy Policy periodically for any changes. 
								Changes to this Privacy Policy are effective when they are posted on this page.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>10. Contact Us</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-muted-foreground leading-relaxed">
								If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
								Questions About Privacy?
							</h2>
							<p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
								We're committed to transparency and protecting your privacy. 
								If you have any questions or concerns, we're here to help.
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
