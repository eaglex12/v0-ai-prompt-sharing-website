import { createClient } from "@/lib/supabase/client"

export async function trackPromptAction(
  promptId: string,
  actionType: "view" | "copy" | "like" | "share",
  userAgent?: string,
  referrer?: string,
) {
  const supabase = createClient()

  const { error } = await supabase.from("prompt_analytics").insert({
    prompt_id: promptId,
    action_type: actionType,
    user_agent: userAgent || navigator.userAgent,
    referrer: referrer || document.referrer || null,
  })

  if (error) {
    console.error("Error tracking prompt action:", error)
  }

  // Also update the counter on the prompt
  if (actionType === "copy") {
    await supabase.rpc("increment_copies_count", { prompt_id: promptId })
  } else if (actionType === "view") {
    await supabase.rpc("increment_views_count", { prompt_id: promptId })
  } else if (actionType === "like") {
    await supabase.rpc("increment_likes_count", { prompt_id: promptId })
  }
}
