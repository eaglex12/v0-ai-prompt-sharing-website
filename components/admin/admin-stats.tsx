import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { Eye, Copy, Users, Globe, TrendingUp } from "lucide-react"

export async function AdminStats() {
  const supabase = await createClient()

  // Get total prompts
  const { count: totalPrompts } = await supabase.from("prompts").select("*", { count: "exact", head: true })

  // Get live analytics data from prompt_analytics table
  const { data: analyticsData } = await supabase
    .from("prompt_analytics")
    .select("action_type, created_at, country, device, browser")

  // Calculate live metrics
  const totalViews = analyticsData?.filter(item => item.action_type === "view").length || 0
  const totalCopies = analyticsData?.filter(item => item.action_type === "copy").length || 0
  const totalShares = analyticsData?.filter(item => item.action_type === "share").length || 0

  // Get unique visitors (based on unique combinations of IP and user agent)
  const uniqueVisitors = new Set(
    analyticsData?.map(item => `${item.created_at}-${item.country}-${item.device}`) || []
  ).size

  // Get unique countries
  const uniqueCountries = new Set(
    analyticsData?.map(item => item.country).filter(Boolean) || []
  ).size

  const stats = [
    {
      title: "Total Prompts",
      value: totalPrompts || 0,
      description: "Active prompts in library",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Live Views",
      value: totalViews,
      description: "Real-time page views",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Live Copies",
      value: totalCopies,
      description: "Real-time copies made",
      icon: Copy,
      color: "text-purple-600",
    },
    {
      title: "Unique Visitors",
      value: uniqueVisitors,
      description: "Distinct visitors tracked",
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Countries",
      value: uniqueCountries,
      description: "Geographic reach",
      icon: Globe,
      color: "text-cyan-600",
    },
    {
      title: "Shares",
      value: totalShares,
      description: "Social shares tracked",
      icon: Copy,
      color: "text-pink-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
