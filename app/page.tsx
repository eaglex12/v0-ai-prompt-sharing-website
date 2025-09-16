import { Suspense } from "react"
import { HomePage } from "@/components/home-page"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"

export default function Page() {
  return (
    <>
      <PageViewTracker />
      <Suspense fallback={<div>Loading...</div>}>
        <HomePage />
      </Suspense>
    </>
  )
}
