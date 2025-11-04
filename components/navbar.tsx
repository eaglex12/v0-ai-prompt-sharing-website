"use client";

import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function Navbar() {
	const pathname = usePathname();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState("");

	// Determine active link based on pathname
	const isActive = (path: string) => {
		if (path === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(path);
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			// Navigate to home page with search query if not already there
			if (pathname !== "/") {
				router.push(`/?search=${encodeURIComponent(searchQuery)}`);
			} else {
				// Trigger search on home page
				window.dispatchEvent(
					new CustomEvent("navbar-search", { detail: searchQuery })
				);
			}
			setSearchQuery("");
		}
	};

	return (
		<header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
			<div className="md:max-w-[80vw] mx-auto px-4 py-5">
				<div className="flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300 group"
					>
						<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center transform group-hover:scale-110 transition-transform">
							<Sparkles className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
							AI Prompts Hub
						</span>
					</Link>
					<nav className="hidden md:flex gap-8">
						<Link
							href="/"
							className={`text-sm font-medium transition-colors duration-200 ${
								isActive("/") && pathname === "/"
									? "text-foreground"
									: "text-muted-foreground hover:text-primary"
							}`}
						>
							Prompts
						</Link>
						<Link
							href="/blog"
							className={`text-sm transition-colors duration-200 ${
								isActive("/blog")
									? "font-medium text-foreground"
									: "text-muted-foreground hover:text-primary"
							}`}
						>
							Blog
						</Link>
						<Link
							href="/categories"
							className={`text-sm transition-colors duration-200 ${
								isActive("/categories")
									? "font-medium text-foreground"
									: "text-muted-foreground hover:text-primary"
							}`}
						>
							Categories
						</Link>
						<Link
							href="/about"
							className={`text-sm transition-colors duration-200 ${
								isActive("/about")
									? "font-medium text-foreground"
									: "text-muted-foreground hover:text-primary"
							}`}
						>
							About
						</Link>
					</nav>
					<div className="hidden md:block w-full max-w-lg ml-8">
						<form onSubmit={handleSearch} className="relative group">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
							<Input
								placeholder="Search prompts..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-card/50 border-border/50 hover:border-border focus:border-primary transition-all duration-200 backdrop-blur-sm"
							/>
						</form>
					</div>
				</div>
			</div>
		</header>
	);
}
