"use client"

import React from "react"
import { useAnalytics } from "@/hooks/use-analytics"

interface InteractionTrackerProps {
  promptId: string
  action: "copy" | "like" | "share"
  children: React.ReactElement
}

export function InteractionTracker({ promptId, action, children }: InteractionTrackerProps) {
  const analytics = useAnalytics()

  const handleClick = async (e: React.MouseEvent) => {
    // Call the original onClick if it exists
    if (children.props.onClick) {
      children.props.onClick(e)
    }

    // Track the interaction
    switch (action) {
      case "copy":
        await analytics.trackCopy(promptId)
        break
      case "like":
        await analytics.trackLike(promptId)
        break
      case "share":
        await analytics.trackShare(promptId)
        break
    }
  }

  return React.cloneElement(children, {
    onClick: handleClick,
  })
}
