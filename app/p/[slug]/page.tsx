import Image from "next/image"
import { notFound } from "next/navigation"
import { getPromptBySlug } from "@/lib/database/prompts"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Eye, Zap, TrendingUp, Star } from "lucide-react"
import PromptActions from "@/components/prompt-actions"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import { AdSenseAd } from "@/components/ads/adsense-ad"
import { EnhancedBannerAd } from "@/components/ads/enhanced-banner-ad"
import { EnhancedSidebarAd } from "@/components/ads/enhanced-sidebar-ad"
import { PolicyCompliantAd } from "@/components/ads/policy-compliant-ad"
import BackButton from "@/components/back-button"

export default async function PromptPage({ params }: { params: { slug: string } }) {
  const prompt = await getPromptBySlug(params.slug)
  if (!prompt) return notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: prompt.title,
    description: prompt.description,
    datePublished: new Date(prompt.created_at as any).toISOString(),
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ... existing JSON-LD and analytics code ... */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageViewTracker promptId={prompt.id} />

      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold truncate">Prompt Details</h1>
              <p className="text-xs text-muted-foreground truncate">{prompt.title}</p>
            </div>
          </div>
          <BackButton />
        </div>
      </header>

      <main className="md:max-w-[80vw] mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {prompt.reference_image_url && (
              <div className="relative w-full aspect-video sm:aspect-[16/9] md:h-[500px] lg:h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden group">
                <Image
                  src={prompt.reference_image_url || "/placeholder.svg"}
                  alt={prompt.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {prompt.is_trending && (
                        <Badge className="flex items-center gap-1 bg-orange-500/20 text-orange-400 border-orange-500/30">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </Badge>
                      )}
                      {prompt.is_featured && (
                        <Badge className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-card-foreground leading-tight">
                      {prompt.title}
                    </h2>
                  </div>
                  {prompt.categories && (
                    <Badge
                      className="flex-shrink-0 text-sm px-4 py-2 border"
                      style={{
                        backgroundColor: prompt.categories.color + "15",
                        color: prompt.categories.color,
                        borderColor: prompt.categories.color + "40",
                      }}
                    >
                      {prompt.categories.name}
                    </Badge>
                  )}
                </div>
              </div>

              {prompt.description && (
                <div className="border-l-4 border-primary/50 pl-4">
                  <p className="text-base text-muted-foreground leading-relaxed">{prompt.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-accent" />
                  The Prompt
                </h3>
                <div className="rounded-lg bg-muted/30 border border-border/50 p-4 sm:p-6 text-sm sm:text-base text-muted-foreground whitespace-pre-wrap break-words max-h-[500px] overflow-y-auto font-mono leading-relaxed">
                  {prompt.content}
                </div>
              </div>

              {prompt.tags?.length ? (
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {prompt.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-xs font-medium">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              <PromptActions
                content={prompt.content}
                title={prompt.title}
                shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/p/${prompt.slug}`}
                promptId={prompt.id}
              />

              {prompt.seo_content ? (
                <article
                  className="prose prose-slate dark:prose-invert max-w-none border-t border-border/50 pt-6 prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{
                    __html: prompt.seo_content || "",
                  }}
                />
              ) : null}

              {/* ... existing ad code ... */}
              <div className="border-t border-border/50 pt-6">
                <EnhancedBannerAd adSlot="prompt-view-banner" className="my-4" />
              </div>
            </div>
          </div>

          {/* ... existing bottom ad code ... */}
          <PolicyCompliantAd adSlot="prompt-view-bottom" adFormat="auto" minContentHeight={800} position="bottom" />
        </section>

        <aside className="space-y-4">
          {/* Premium Stats Card */}
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/80 p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-foreground">Engagement</h3>
            <div className="space-y-4">
              {/* Views Stat */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-muted-foreground">Views</span>
                </div>
                <span className="font-semibold text-foreground">{prompt.views_count.toLocaleString()}</span>
              </div>

              {/* Copies Stat */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2">
                  <Copy className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-muted-foreground">Copies</span>
                </div>
                <span className="font-semibold text-foreground">{prompt.copies_count.toLocaleString()}</span>
              </div>

              {/* Status Indicators */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                {prompt.is_trending && (
                  <div className="flex items-center gap-2 text-orange-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                    Trending Now
                  </div>
                )}
                {prompt.is_featured && (
                  <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    Featured
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ... existing ad code ... */}
          <AdSenseAd
            adSlot="prompt-view-sidebar"
            adFormat="vertical"
            adStyle={{
              display: "block",
              width: "100%",
              height: "250px",
            }}
            className="w-full"
          />
        </aside>
      </main>

      {/* ... existing sidebar ads ... */}
      <EnhancedSidebarAd position="left" />
      <EnhancedSidebarAd position="right" />
    </div>
  )
}
