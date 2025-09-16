"use client"

import { useCallback } from "react"
import { trackPromptAction } from "@/lib/database/analytics"

export function useAnalytics() {
  const trackView = useCallback(async (promptId: string) => {
    try {
      await trackPromptAction(promptId, "view")
    } catch (error) {
      console.error("Failed to track view:", error)
    }
  }, [])

  const trackCopy = useCallback(async (promptId: string) => {
    try {
      await trackPromptAction(promptId, "copy")
    } catch (error) {
      console.error("Failed to track copy:", error)
    }
  }, [])

  const trackLike = useCallback(async (promptId: string) => {
    try {
      await trackPromptAction(promptId, "like")
    } catch (error) {
      console.error("Failed to track like:", error)
    }
  }, [])

  const trackShare = useCallback(async (promptId: string) => {
    try {
      await trackPromptAction(promptId, "share")
    } catch (error) {
      console.error("Failed to track share:", error)
    }
  }, [])

  return {
    trackView,
    trackCopy,
    trackLike,
    trackShare,
  }
}
