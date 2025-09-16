"use client"

import { useEffect } from "react"
import { useAnalytics } from "@/hooks/use-analytics"

interface PageViewTrackerProps {
  promptId?: string
}

export function PageViewTracker({ promptId }: PageViewTrackerProps) {
  const { trackView } = useAnalytics()

  useEffect(() => {
    if (promptId) {
      // Track view after a short delay to ensure user actually viewed the content
      const timer = setTimeout(() => {
        trackView(promptId)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [promptId, trackView])

  return null
}
