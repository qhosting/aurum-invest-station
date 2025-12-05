'use client'

import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface EquityCurveData {
  date: string
  balance: number
  profit: number
  trades: number
}

interface EquityCurveChartProps {
  data: EquityCurveData[]
  title?: string
  description?: string
  height?: number
  variant?: 'line' | 'area'
}

export function EquityCurveChart({
  data,
  title = "Curva de Capital",
  description = "Evolución del balance a lo largo del tiempo",
  height = 300,
  variant = 'area'
}: EquityCurveChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-surface p-3 shadow-md">
          <p className="text-sm font-medium text-foreground">{`Fecha: ${label}`}</p>
          <p className="text-sm text-foreground-muted">
            {`Balance: ${formatCurrency(payload[0].value)}`}
          </p>
          {payload[0].payload.profit !== undefined && (
            <p className="text-sm text-foreground-muted">
              {`Ganancia: ${formatCurrency(payload[0].payload.profit)}`}
            </p>
          )}
          {payload[0].payload.trades !== undefined && (
            <p className="text-sm text-foreground-muted">
              {`Trades: ${payload[0].payload.trades}`}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height }}>
          <ResponsiveContainer width="100%" height="100%">
            {variant === 'area' ? (
              <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243750" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, 'USD').replace('$', '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#D4AF37"
                  fill="url(#colorBalance)"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#243750" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatCurrency(value, 'USD').replace('$', '')}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#D4AF37"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#D4AF37' }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}