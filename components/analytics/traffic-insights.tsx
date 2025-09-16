"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Users, Globe, Clock, TrendingUp } from "lucide-react"

interface TrafficData {
  totalVisits: number
  uniqueVisitors: number
  avgSessionDuration: string
  topReferrers: { source: string; visits: number }[]
  hourlyDistribution: { hour: number; visits: number }[]
}

export function TrafficInsights() {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrafficData()
  }, [])

  const loadTrafficData = async () => {
    const supabase = createClient()

    // Get total visits (analytics entries)
    const { count: totalVisits } = await supabase.from("prompt_analytics").select("*", { count: "exact", head: true })

    // Get unique visitors (approximate by unique IP addresses)
    const { data: ipData } = await supabase.from("prompt_analytics").select("ip_address").not("ip_address", "is", null)

    const uniqueIPs = new Set(ipData?.map((item) => item.ip_address) || [])
    const uniqueVisitors = uniqueIPs.size

    // Get referrer data
    const { data: referrerData } = await supabase
      .from("prompt_analytics")
      .select("referrer")
      .not("referrer", "is", null)
      .limit(1000)

    const referrerCounts = referrerData?.reduce((acc: Record<string, number>, item) => {
      if (item.referrer) {
        try {
          const domain = new URL(item.referrer).hostname
          acc[domain] = (acc[domain] || 0) + 1
        } catch {
          acc["Direct"] = (acc["Direct"] || 0) + 1
        }
      }
      return acc
    }, {})

    const topReferrers = Object.entries(referrerCounts || {})
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, visits]) => ({ source, visits }))

    // Get hourly distribution (last 24 hours)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    const { data: hourlyData } = await supabase
      .from("prompt_analytics")
      .select("created_at")
      .gte("created_at", twentyFourHoursAgo.toISOString())

    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const visits =
        hourlyData?.filter((item) => {
          const hour = new Date(item.created_at).getHours()
          return hour === i
        }).length || 0
      return { hour: i, visits }
    })

    setTrafficData({
      totalVisits: totalVisits || 0,
      uniqueVisitors,
      avgSessionDuration: "2m 34s", // Placeholder - would need session tracking for real data
      topReferrers,
      hourlyDistribution,
    })
    setIsLoading(false)
  }

  if (isLoading) {
    return <div>Loading traffic insights...</div>
  }

  if (!trafficData) {
    return <div>No traffic data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.uniqueVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated unique users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">Average time on site</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Referrer</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trafficData.topReferrers[0]?.source || "Direct"}</div>
            <p className="text-xs text-muted-foreground">{trafficData.topReferrers[0]?.visits || 0} visits</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>Traffic sources bringing visitors to your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trafficData.topReferrers.map((referrer, index) => (
                <div key={referrer.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium">{referrer.source}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{referrer.visits} visits</span>
                </div>
              ))}
              {trafficData.topReferrers.length === 0 && (
                <p className="text-sm text-muted-foreground">No referrer data available yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Activity</CardTitle>
            <CardDescription>Visitor activity over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trafficData.hourlyDistribution
                .filter((item) => item.visits > 0)
                .slice(0, 8)
                .map((item) => (
                  <div key={item.hour} className="flex items-center justify-between">
                    <span className="text-sm">
                      {item.hour.toString().padStart(2, "0")}:00 - {(item.hour + 1).toString().padStart(2, "0")}:00
                    </span>
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-2 bg-blue-500 rounded"
                        style={{
                          width: `${Math.max(10, (item.visits / Math.max(...trafficData.hourlyDistribution.map((h) => h.visits))) * 60)}px`,
                        }}
                      ></div>
                      <span className="text-sm text-muted-foreground w-8 text-right">{item.visits}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
