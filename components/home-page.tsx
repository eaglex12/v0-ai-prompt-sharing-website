"use client"
import { PolicyCompliantAd } from "@/components/ads/policy-compliant-ad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAnalytics } from "@/hooks/use-analytics"
import type { Category, Prompt } from "@/lib/database/prompts-client"
import { getPromptsByCategory, searchPrompts } from "@/lib/database/prompts-client"
import { Search, Sparkles, TrendingUp, Grid3X3, ArrowRight, BookOpen, User, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import PromptCard from "./prompt-card"
import PromptModal from "./prompt-modal"

interface HomePageProps {
  initialPrompts: Prompt[]
  initialTrendingPrompts: Prompt[]
  initialCategories: Category[]
  initialFeaturedBlogPosts?: any[]
}

export function HomePage({
  initialPrompts,
  initialTrendingPrompts,
  initialCategories,
  initialFeaturedBlogPosts = [],
}: HomePageProps) {
  const [prompts, setPrompts] = useState<Prompt[]>(initialPrompts)
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>(initialTrendingPrompts)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { trackView } = useAnalytics()

  useEffect(() => {
    handleSearch()
  }, [searchQuery, selectedCategory])

  const handleSearch = async () => {
    try {
      let results: Prompt[]

      if (searchQuery.trim()) {
        results = await searchPrompts(searchQuery)
      } else if (selectedCategory === "All") {
        results = initialPrompts
      } else {
        const category = categories.find((cat) => cat.name === selectedCategory)
        if (category) {
          results = await getPromptsByCategory(category.slug)
        } else {
          results = initialPrompts
        }
      }

      setPrompts(results)
    } catch (error) {
      console.error("Error searching prompts:", error)
    }
  }

  const handleCopy = async (prompt: string, id: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handlePromptView = (promptId: string) => {
    trackView(promptId)
  }

  const categoryOptions = ["All", ...categories.map((cat) => cat.name)]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
        <div className={`md:max-w-[80vw] mx-auto px-4 py-5`}>
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity duration-300 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                AI Prompts Hub
              </span>
            </a>
            <nav className="hidden md:flex gap-8">
              <Link
                href="/"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                Prompts
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Blog
              </Link>
              <Link
                href="/categories"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Categories
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                About
              </Link>
            </nav>
            <div className="hidden md:block w-full max-w-lg ml-8">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50 hover:border-border focus:border-primary transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          {/* Enhanced gradient background with better blur */}
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-pulse animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className={`md:max-w-[60vw] mx-auto px-4 pt-16 pb-12`}>
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-4 py-2 text-xs text-muted-foreground backdrop-blur-md hover:border-border/80 transition-all duration-300 cursor-pointer">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="bg-gradient-to-r from-muted-foreground to-foreground bg-clip-text text-transparent">
                ✨ Discover, copy, and share the best AI prompts
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
              <span className="bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                Discover trending AI prompts
              </span>
              <br />
              <span className="text-foreground/80">to create with</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore curated prompts across art, photography, and 3D. Copy instantly and start creating within seconds.
            </p>
          </div>
        </div>
      </section>

      <div className={`md:max-w-[60vw] mx-auto px-4 py-12`}>
        {/* Main Content */}
        <div>
          {/* Trending Section */}
          {trendingPrompts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Trending Prompts</h2>
                  <p className="text-sm text-muted-foreground mt-1">Most popular this week</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    handlePromptView={handlePromptView}
                    handleCopy={handleCopy}
                    copiedId={copiedId}
                    setSelectedPrompt={setSelectedPrompt}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Categories Section */}
          {categories.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <Grid3X3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Browse Categories</h2>
                    <p className="text-sm text-muted-foreground mt-1">Explore by topic</p>
                  </div>
                </div>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.slice(0, 8).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 hover:bg-card/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center transform group-hover:scale-125 transition-transform duration-300"
                        style={{
                          backgroundColor: category.color + "20",
                        }}
                      >
                        <div
                          className="h-6 w-6 rounded-full"
                          style={{
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{category.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Featured Blog Posts */}
          {initialFeaturedBlogPosts.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">Latest Articles</h2>
                    <p className="text-sm text-muted-foreground mt-1">From our community</p>
                  </div>
                </div>
                <Link
                  href="/blog"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 hover:bg-card border border-border/50 hover:border-border text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialFeaturedBlogPosts.slice(0, 3).map((post) => (
                  <Card
                    key={post.id}
                    className="group overflow-hidden border-border/50 bg-card/40 backdrop-blur-sm hover:bg-card/60 hover:border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-3">
                        {post.blog_categories && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: post.blog_categories.color + "20",
                              color: post.blog_categories.color,
                            }}
                          >
                            {post.blog_categories.name}
                          </Badge>
                        )}
                        <Badge variant="default" className="text-xs">
                          Blog
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3 text-sm">{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        {post.author_name && (
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5" />
                            <span>{post.author_name}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {(() => {
                              const date = new Date(post.published_at || post.created_at)
                              const year = date.getFullYear()
                              const month = date.getMonth() + 1
                              const day = date.getDate()
                              return `${month}/${day}/${year}`
                            })()}
                          </span>
                        </div>
                      </div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-200 group/link"
                      >
                        Read more
                        <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          <section className="mb-16">
            <div className="mb-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-focus-within:text-primary transition-colors duration-200" />
                <Input
                  placeholder="Try: cyberpunk portrait, product render, isometric room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 bg-card/50 border-border/50 hover:border-border focus:border-primary text-base backdrop-blur-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-primary to-accent shadow-lg"
                      : "bg-card/50 border-border/50 hover:border-border hover:bg-card/60"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </section>

          {/* All Prompts Grid */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
              {selectedCategory === "All" ? "All Prompts" : selectedCategory}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  handlePromptView={handlePromptView}
                  handleCopy={handleCopy}
                  copiedId={copiedId}
                  setSelectedPrompt={setSelectedPrompt}
                  setIsDialogOpen={setIsDialogOpen}
                />
              ))}
            </div>

            {prompts.length === 0 && (
              <div className="text-center py-16">
                <Sparkles className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No prompts found matching your search.</p>
                <p className="text-muted-foreground/60 text-sm mt-2">Try different keywords or explore categories</p>
              </div>
            )}

            {prompts.length >= 3 && (
              <div className="mt-12">
                <PolicyCompliantAd adSlot="banner-ad-2" adFormat="auto" minContentHeight={800} position="bottom" />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Prompt Detail Modal */}
      <PromptModal
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedPrompt={selectedPrompt}
        handleCopy={handleCopy}
      />

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
              <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                About
              </a>
              <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Contact
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                Terms
              </a>
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
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
    </div>
  )
}

