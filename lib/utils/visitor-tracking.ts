"use client"

// Simple visitor tracking utilities
export function getVisitorInfo() {
  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer || null,
    timestamp: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: screen.width,
      height: screen.height,
    },
  }
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem("visitor_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem("visitor_session_id", sessionId)
  }
  return sessionId
}

export function trackPageVisit(page: string) {
  const visitData = {
    page,
    sessionId: getSessionId(),
    ...getVisitorInfo(),
  }

  // Store in localStorage for potential batch sending
  const visits = JSON.parse(localStorage.getItem("page_visits") || "[]")
  visits.push(visitData)

  // Keep only last 50 visits to prevent storage bloat
  if (visits.length > 50) {
    visits.splice(0, visits.length - 50)
  }

  localStorage.setItem("page_visits", JSON.stringify(visits))
}
