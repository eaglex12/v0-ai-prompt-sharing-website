import { createClient } from "@/lib/supabase/client"

interface Demographics {
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
  screen_resolution?: string
  language?: string
}

export async function trackPromptAction(
  promptId: string,
  actionType: "view" | "copy" | "share",
  userAgent?: string,
  referrer?: string,
  demographics?: Demographics,
) {
  const supabase = createClient()

  // Get client IP and additional info
  const clientInfo = await getClientInfo()
  
  const { error } = await supabase.from("prompt_analytics").insert({
    prompt_id: promptId,
    action_type: actionType,
    user_agent: userAgent || navigator.userAgent,
    referrer: referrer || document.referrer || null,
    ip_address: clientInfo.ip,
    country: demographics?.country || clientInfo.country,
    city: demographics?.city || clientInfo.city,
    device: demographics?.device || clientInfo.device,
    browser: demographics?.browser || clientInfo.browser,
    os: demographics?.os || clientInfo.os,
    screen_resolution: demographics?.screen_resolution || clientInfo.screenResolution,
    language: demographics?.language || clientInfo.language,
  })

  if (error) {
    console.error("Error tracking prompt action:", error)
  }

  // Also update the counter on the prompt
  if (actionType === "copy") {
    await supabase.rpc("increment_copies_count", { prompt_id: promptId })
  } else if (actionType === "view") {
    await supabase.rpc("increment_views_count", { prompt_id: promptId })
  }
}

async function getClientInfo() {
  try {
    // Get basic client info
    const userAgent = navigator.userAgent
    const language = navigator.language
    const screenResolution = `${screen.width}x${screen.height}`
    
    // Parse user agent for device, browser, and OS info
    const device = getDeviceType(userAgent)
    const browser = getBrowserInfo(userAgent)
    const os = getOSInfo(userAgent)
    
    // Try to get IP and location info (this would need a service like ipapi.co)
    let ip = "unknown"
    let country = "unknown"
    let city = "unknown"
    
    try {
      const response = await fetch("https://ipapi.co/json/")
      const data = await response.json()
      ip = data.ip || "unknown"
      country = data.country_name || "unknown"
      city = data.city || "unknown"
    } catch (e) {
      console.log("Could not fetch location data")
    }
    
    return {
      ip,
      country,
      city,
      device,
      browser,
      os,
      screenResolution,
      language,
    }
  } catch (error) {
    console.error("Error getting client info:", error)
    return {
      ip: "unknown",
      country: "unknown",
      city: "unknown",
      device: "unknown",
      browser: "unknown",
      os: "unknown",
      screenResolution: "unknown",
      language: "unknown",
    }
  }
}

function getDeviceType(userAgent: string): string {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return "tablet"
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return "mobile"
  }
  return "desktop"
}

function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  if (userAgent.includes("Opera")) return "Opera"
  return "Other"
}

function getOSInfo(userAgent: string): string {
  if (userAgent.includes("Windows")) return "Windows"
  if (userAgent.includes("Mac")) return "macOS"
  if (userAgent.includes("Linux")) return "Linux"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iOS")) return "iOS"
  return "Other"
}
