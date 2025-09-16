import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminStats } from "@/components/admin/admin-stats"
import { PromptsManager } from "@/components/admin/prompts-manager"
import { CategoriesManager } from "@/components/admin/categories-manager"
import { AnalyticsView } from "@/components/admin/analytics-view"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage your AI prompts library and view analytics</p>
        </div>

        <Suspense fallback={<div>Loading stats...</div>}>
          <AdminStats />
        </Suspense>

        <Tabs defaultValue="prompts" className="mt-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="prompts">Prompts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="prompts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Prompts</CardTitle>
                <CardDescription>Add, edit, and organize your AI prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading prompts...</div>}>
                  <PromptsManager />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Categories</CardTitle>
                <CardDescription>Organize prompts into categories</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading categories...</div>}>
                  <CategoriesManager />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>Track performance and user engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading analytics...</div>}>
                  <AnalyticsView />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure your prompts website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">Settings panel coming soon...</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
