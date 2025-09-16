import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Eye, Copy, Heart, TrendingUp } from "lucide-react"

export async function AdminStats() {
  const supabase = await createClient()

  // Get total prompts
  const { count: totalPrompts } = await supabase.from("prompts").select("*", { count: "exact", head: true })

  // Get total views
  const { data: viewsData } = await supabase.from("prompts").select("views_count")

  const totalViews = viewsData?.reduce((sum, prompt) => sum + prompt.views_count, 0) || 0

  // Get total copies
  const { data: copiesData } = await supabase.from("prompts").select("copies_count")

  const totalCopies = copiesData?.reduce((sum, prompt) => sum + prompt.copies_count, 0) || 0

  // Get total likes
  const { data: likesData } = await supabase.from("prompts").select("likes_count")

  const totalLikes = likesData?.reduce((sum, prompt) => sum + prompt.likes_count, 0) || 0

  const stats = [
    {
      title: "Total Prompts",
      value: totalPrompts || 0,
      description: "Active prompts in library",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Total Views",
      value: totalViews,
      description: "Prompt page views",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Total Copies",
      value: totalCopies,
      description: "Prompts copied by users",
      icon: Copy,
      color: "text-purple-600",
    },
    {
      title: "Total Likes",
      value: totalLikes,
      description: "Likes across all prompts",
      icon: Heart,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
