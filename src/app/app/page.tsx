import { Suspense } from "react"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MetricsBar } from "@/components/dashboard/metrics-bar"
import { EquityChart } from "@/components/dashboard/equity-chart"
import { RecentTradesTable } from "@/components/dashboard/recent-trades-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-white">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Metrics Bar */}
        <MetricsBar userId={session.user.id} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Equity Chart - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2 bg-[#12233A] border-gray-700">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">Equity Curve</CardTitle>
              <CardDescription className="text-gray-400">
                Account performance over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<ChartSkeleton />}>
                <EquityChart userId={session.user.id} />
              </Suspense>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card className="bg-[#12233A] border-gray-700">
            <CardHeader>
              <CardTitle className="text-[#D4AF37]">Performance Summary</CardTitle>
              <CardDescription className="text-gray-400">
                Key trading metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Trades</span>
                  <span className="text-white font-mono">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Win Rate</span>
                  <span className="text-[#10B981] font-mono">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Profit Factor</span>
                  <span className="text-white font-mono">0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Max Drawdown</span>
                  <span className="text-[#EF4444] font-mono">0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Risk/Reward</span>
                  <span className="text-white font-mono">0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trades Table */}
        <Card className="mt-6 bg-[#12233A] border-gray-700">
          <CardHeader>
            <CardTitle className="text-[#D4AF37]">Recent Trades</CardTitle>
            <CardDescription className="text-gray-400">
              Latest trading activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TableSkeleton />}>
              <RecentTradesTable userId={session.user.id} />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

// Skeleton components for loading states
function ChartSkeleton() {
  return (
    <div className="h-[400px] w-full bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-gray-400">Loading chart...</div>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-800 animate-pulse rounded" />
      ))}
    </div>
  )
}