"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react"

interface MetricsData {
  totalBalance: number
  winRate: number
  relativeDrawdown: number
  dailyPnL: number
}

interface MetricsBarProps {
  userId: string
}

export function MetricsBar({ userId }: MetricsBarProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // This would typically fetch from your API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
        
        setMetrics({
          totalBalance: 10500.00,
          winRate: 68.5,
          relativeDrawdown: -2.3,
          dailyPnL: +125.50,
        })
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [userId])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#12233A] border-gray-700">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center text-gray-400 py-8">
        Failed to load metrics
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Balance */}
      <Card className="bg-[#12233A] border-gray-700 hover:border-[#D4AF37] transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Balance</p>
              <p className="text-2xl font-bold text-white font-mono">
                ${metrics.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-[#D4AF37]/10 rounded-full">
              <DollarSign className="h-6 w-6 text-[#D4AF37]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Win Rate */}
      <Card className="bg-[#12233A] border-gray-700 hover:border-[#10B981] transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-[#10B981] font-mono">
                {metrics.winRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-[#10B981]/10 rounded-full">
              <Target className="h-6 w-6 text-[#10B981]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Relative Drawdown */}
      <Card className="bg-[#12233A] border-gray-700 hover:border-[#EF4444] transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Drawdown</p>
              <p className="text-2xl font-bold text-[#EF4444] font-mono">
                {metrics.relativeDrawdown.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-[#EF4444]/10 rounded-full">
              <TrendingDown className="h-6 w-6 text-[#EF4444]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily P&L */}
      <Card className="bg-[#12233A] border-gray-700 hover:border-[#10B981] transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Daily P&L</p>
              <p className={`text-2xl font-bold font-mono ${metrics.dailyPnL >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                {metrics.dailyPnL >= 0 ? '+' : ''}${metrics.dailyPnL.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${metrics.dailyPnL >= 0 ? 'bg-[#10B981]/10' : 'bg-[#EF4444]/10'}`}>
              <TrendingUp className={`h-6 w-6 ${metrics.dailyPnL >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}