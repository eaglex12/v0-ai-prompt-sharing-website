"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalyticsData {
  totalActions: number
  actionsByType: { name: string; value: number; color: string }[]
  topPrompts: { title: string; views: number; copies: number; likes: number }[]
  recentActivity: { date: string; actions: number }[]
}

export function AnalyticsView() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    const supabase = createClient()

    // Get total actions
    const { count: totalActions } = await supabase.from("prompt_analytics").select("*", { count: "exact", head: true })

    // Get actions by type
    const { data: actionsData } = await supabase.from("prompt_analytics").select("action_type")

    const actionCounts =
      actionsData?.reduce((acc: Record<string, number>, action) => {
        acc[action.action_type] = (acc[action.action_type] || 0) + 1
        return acc
      }, {}) || {}

    const actionsByType = [
      { name: "Views", value: actionCounts.view || 0, color: "#3b82f6" },
      { name: "Copies", value: actionCounts.copy || 0, color: "#8b5cf6" },
      { name: "Likes", value: actionCounts.like || 0, color: "#ef4444" },
      { name: "Shares", value: actionCounts.share || 0, color: "#10b981" },
    ]

    // Get top prompts
    const { data: topPromptsData } = await supabase
      .from("prompts")
      .select("title, views_count, copies_count, likes_count")
      .order("views_count", { ascending: false })
      .limit(5)

    const topPrompts =
      topPromptsData?.map((prompt) => ({
        title: prompt.title.length > 30 ? prompt.title.substring(0, 30) + "..." : prompt.title,
        views: prompt.views_count,
        copies: prompt.copies_count,
        likes: prompt.likes_count,
      })) || []

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: recentData } = await supabase
      .from("prompt_analytics")
      .select("created_at")
      .gte("created_at", sevenDaysAgo.toISOString())

    const recentActivity = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const actions = recentData?.filter((item) => item.created_at.startsWith(dateStr)).length || 0
      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        actions,
      }
    }).reverse()

    setAnalytics({
      totalActions: totalActions || 0,
      actionsByType,
      topPrompts,
      recentActivity,
    })
    setIsLoading(false)
  }

  if (isLoading) {
    return <div>Loading analytics...</div>
  }

  if (!analytics) {
    return <div>No analytics data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions by Type</CardTitle>
            <CardDescription>Distribution of user interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.actionsByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.actionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {analytics.actionsByType.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>User actions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.recentActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="actions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Prompts</CardTitle>
          <CardDescription>Most viewed prompts with engagement metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topPrompts} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="title" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="views" fill="#3b82f6" name="Views" />
              <Bar dataKey="copies" fill="#8b5cf6" name="Copies" />
              <Bar dataKey="likes" fill="#ef4444" name="Likes" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
