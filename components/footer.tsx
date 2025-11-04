import { Sparkles } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-card/50 backdrop-blur-sm border-t border-border/50 mt-20">
			<div className={`max-w-[80vw] mx-auto px-4 py-12`}>
				<div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
					<div className="flex items-center gap-2">
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
							<Sparkles className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="font-bold text-foreground">AI Prompts Hub</span>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
						<a
							href="/about"
							className="text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							About
						</a>
						<a
							href="/contact"
							className="text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							Contact
						</a>
						<a
							href="/terms"
							className="text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							Terms
						</a>
						<a
							href="/privacy"
							className="text-muted-foreground hover:text-foreground transition-colors duration-200"
						>
							Privacy
						</a>
					</div>
				</div>
				<div className="pt-8 border-t border-border/50">
					<p className="text-xs text-muted-foreground/60 text-center">
						© 2025 AI Prompts Hub. All rights reserved. Crafted with care.
					</p>
				</div>
			</div>
		</footer>
	);
}
