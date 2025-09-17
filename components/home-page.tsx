"use client"

import { useState, useEffect } from "react"
import { Search, Heart, Copy, Share2, TrendingUp, Sparkles } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  getAllPrompts,
  getTrendingPrompts,
  getAllCategories,
  searchPrompts,
  getPromptsByCategory,
} from "@/lib/database/prompts-client"
import { useAnalytics } from "@/hooks/use-analytics"
import { InteractionTracker } from "@/components/analytics/interaction-tracker"
import { SidebarAd } from "@/components/ads/sidebar-ad"
import { BannerAd } from "@/components/ads/banner-ad"
import type { Prompt, Category } from "@/lib/database/prompts-client"

export function HomePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [trendingPrompts, setTrendingPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { trackView } = useAnalytics()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    handleSearch()
  }, [searchQuery, selectedCategory])

  const loadInitialData = async () => {
    try {
      const [allPrompts, trending, allCategories] = await Promise.all([
        getAllPrompts(),
        getTrendingPrompts(),
        getAllCategories(),
      ])

      setPrompts(allPrompts)
      setTrendingPrompts(trending)
      setCategories(allCategories)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    try {
      let results: Prompt[]

      if (searchQuery.trim()) {
        results = await searchPrompts(searchQuery)
      } else if (selectedCategory === "All") {
        results = await getAllPrompts()
      } else {
        const category = categories.find((cat) => cat.name === selectedCategory)
        if (category) {
          results = await getPromptsByCategory(category.slug)
        } else {
          results = await getAllPrompts()
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading AI prompts...</p>
        </div>
      </div>
    )
  }

  const categoryOptions = ["All", ...categories.map((cat) => cat.name)]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold text-foreground">AI Prompts Hub</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search prompts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-card border-border"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Ad Space - Left Sidebar */}
        <SidebarAd position="left" />

        {/* Ad Space - Right Sidebar */}
        <SidebarAd position="right" />

        {/* Main Content */}
        <div className="lg:mx-40">
          {/* Trending Section */}
          {trendingPrompts.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-accent" />
                <h2 className="text-3xl font-heading font-bold text-foreground">Trending Prompts</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingPrompts.map((prompt) => (
                  <Card
                    key={prompt.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
                    onMouseEnter={() => handlePromptView(prompt.id)}
                  >
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={prompt.reference_image_url || "/placeholder.svg?height=192&width=384"}
                          alt={prompt.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">Trending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        {prompt.categories && (
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: prompt.categories.color + "20",
                              color: prompt.categories.color,
                            }}
                          >
                            {prompt.categories.name}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Heart className="h-4 w-4" />
                          {prompt.likes_count}
                        </div>
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">{prompt.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{prompt.description}</p>
                      <p className="text-xs text-muted-foreground bg-muted p-2 rounded text-balance">
                        {prompt.content}
                      </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex gap-2">
                      <InteractionTracker promptId={prompt.id} action="copy">
                        <Button
                          size="sm"
                          onClick={() => handleCopy(prompt.content, prompt.id)}
                          className="flex-1 bg-primary hover:bg-primary/90"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedId === prompt.id ? "Copied!" : "Copy"}
                        </Button>
                      </InteractionTracker>
                      <InteractionTracker promptId={prompt.id} action="share">
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </InteractionTracker>
                      <InteractionTracker promptId={prompt.id} action="like">
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </InteractionTracker>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Banner Ad */}
          <BannerAd adSlot="banner-ad-1" />

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryOptions.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* All Prompts Grid */}
          <section>
            <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
              {selectedCategory === "All" ? "All Prompts" : selectedCategory}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prompts.map((prompt) => (
                <Card
                  key={prompt.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border"
                  onMouseEnter={() => handlePromptView(prompt.id)}
                >
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                      <Image
                        src={prompt.reference_image_url || "/placeholder.svg"}
                        alt={prompt.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {prompt.is_trending && (
                        <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">Trending</Badge>
                      )}
                      {prompt.is_featured && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">Featured</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      {prompt.categories && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: prompt.categories.color + "20",
                            color: prompt.categories.color,
                          }}
                        >
                          {prompt.categories.name}
                        </Badge>
                      )}
                      <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {prompt.likes_count}
                        </div>
                        <div className="flex items-center gap-1">
                          <Copy className="h-4 w-4" />
                          {prompt.copies_count}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2 text-card-foreground">{prompt.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{prompt.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {prompt.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground bg-muted p-2 rounded text-balance">{prompt.content}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <InteractionTracker promptId={prompt.id} action="copy">
                      <Button
                        size="sm"
                        onClick={() => handleCopy(prompt.content, prompt.id)}
                        className="flex-1 bg-primary hover:bg-primary/90"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copiedId === prompt.id ? "Copied!" : "Copy"}
                      </Button>
                    </InteractionTracker>
                    <InteractionTracker promptId={prompt.id} action="share">
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </InteractionTracker>
                    <InteractionTracker promptId={prompt.id} action="like">
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </InteractionTracker>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {prompts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No prompts found matching your search.</p>
              </div>
            )}

            {/* Bottom Banner Ad */}
            <BannerAd adSlot="banner-ad-2" />
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-heading font-semibold text-card-foreground">AI Prompts Hub</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/admin" className="hover:text-foreground transition-colors">
                Admin
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                About
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
