"use client"

import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Share2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InteractionTracker } from "@/components/analytics/interaction-tracker"
import type { Prompt } from "@/lib/database/prompts-client"
import { useState } from "react"

export default function PromptCard({
  prompt,
  handlePromptView,
  handleCopy,
  copiedId,
  setSelectedPrompt,
  setIsDialogOpen,
}: {
  prompt: Prompt
  handlePromptView: (id: string) => void
  handleCopy: (content: string, id: string) => void
  copiedId: string | null
  setSelectedPrompt: (prompt: Prompt) => void
  setIsDialogOpen: (isOpen: boolean) => void
}) {
  const [isSharing, setIsSharing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      const shareUrl = prompt.slug ? `${window.location.origin}/p/${prompt.slug}` : window.location.href

      const shareData = {
        title: prompt.title,
        text: prompt.description || prompt.title,
        url: shareUrl,
      }

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareUrl)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      try {
        const shareUrl = prompt.slug ? `${window.location.origin}/p/${prompt.slug}` : window.location.href
        await navigator.clipboard.writeText(shareUrl)
        alert("Link copied to clipboard!")
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError)
        alert("Unable to share. Please copy the URL manually.")
      }
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Card
      key={prompt.id}
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-card border-border p-0 h-full flex flex-col"
      onMouseEnter={() => {
        handlePromptView(prompt.id)
        setIsHovered(true)
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="relative overflow-hidden rounded-t-lg aspect-video bg-muted">
          <img
            src={
              prompt.reference_image_url ||
              "/placeholder.svg?height=192&width=384&query=ai%20prompt%20visualization" ||
              "/placeholder.svg"
            }
            alt={prompt.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg backdrop-blur-sm bg-opacity-90">
              <Sparkles className="w-3 h-3 mr-1" />
              Trending
            </Badge>
            {prompt.categories && (
              <Badge
                variant="secondary"
                className="text-xs shadow-md backdrop-blur-sm"
                style={{
                  backgroundColor: prompt.categories.color + "22",
                  color: prompt.categories.color,
                  border: `1px solid ${prompt.categories.color}40`,
                }}
              >
                {prompt.categories.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 py-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-snug text-card-foreground truncate group-hover:text-accent transition-colors duration-300">
              {prompt.title}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium whitespace-nowrap">
            <Copy className="h-4 w-4" />
            <span>{prompt.copies_count}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{prompt.description}</p>

        <div className="mt-auto pt-2 px-3 py-2 rounded-md bg-muted/50 border border-border/50 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground line-clamp-2 font-mono">{prompt.content}</p>
        </div>
      </CardContent>

      <CardFooter className="px-5 py-3 gap-2 mt-auto flex items-center justify-between border-t border-border/40 bg-muted/20 backdrop-blur-sm">
        <div className="flex gap-2 flex-1">
          <InteractionTracker promptId={prompt.id} action="copy">
            <Button
              size="sm"
              onClick={() => handleCopy(prompt.content, prompt.id)}
              className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Copy className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{copiedId === prompt.id ? "Copied!" : "Copy"}</span>
            </Button>
          </InteractionTracker>

          <InteractionTracker promptId={prompt.id} action="share">
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              disabled={isSharing}
              className="transition-all duration-300 bg-transparent"
            >
              <Share2 className="h-4 w-4" />
              {isSharing && <span className="ml-1 text-xs">...</span>}
            </Button>
          </InteractionTracker>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedPrompt(prompt)
            setIsDialogOpen(true)
          }}
          className="transition-all duration-300 hover:bg-accent/10"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  )
}
