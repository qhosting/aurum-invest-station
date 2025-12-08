"use client"

import { useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface EquityDataPoint {
  date: string
  equity: number
  balance: number
}

interface EquityChartProps {
  userId: string
}

export function EquityChart({ userId }: EquityChartProps) {
  const [data, setData] = useState<EquityDataPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEquityData = async () => {
      try {
        // This would typically fetch from your API
        // For now, we'll generate mock data for the last 30 days
        const mockData: EquityDataPoint[] = []
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        
        let currentEquity = 10000 // Starting balance
        let currentBalance = 10000
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(startDate)
          date.setDate(date.getDate() + i)
          
          // Simulate some daily changes
          const change = (Math.random() - 0.5) * 200 // Random change between -100 and +100
          currentEquity += change
          currentBalance += change * 0.8 // Balance changes less dramatically
          
          mockData.push({
            date: date.toISOString().split('T')[0],
            equity: currentEquity,
            balance: currentBalance,
          })
        }
        
        setData(mockData)
      } catch (error) {
        console.error("Failed to fetch equity data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEquityData()
  }, [userId])

  if (loading) {
    return (
      <div className="h-[400px] w-full bg-gray-800 animate-pulse rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-[400px] w-full bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">No equity data available</div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#12233A] border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-gray-400 text-sm">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white font-mono">
              {`${entry.dataKey === 'equity' ? 'Equity' : 'Balance'}: $${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#D4AF37"
            strokeWidth={2}
            fill="url(#equityGradient)"
            fillOpacity={0.3}
          />
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}