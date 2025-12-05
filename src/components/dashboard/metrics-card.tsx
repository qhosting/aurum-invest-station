'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, Target, Activity } from 'lucide-react'
import { formatCurrency, formatPercentage } from '@/lib/utils'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  variant?: 'default' | 'success' | 'error' | 'secondary'
  icon?: React.ReactNode
  prefix?: string
  suffix?: string
  isPercentage?: boolean
}

export function MetricsCard({
  title,
  value,
  change,
  changeLabel,
  variant = 'default',
  icon,
  prefix = '',
  suffix = '',
  isPercentage = false
}: MetricsCardProps) {
  const getTrendIcon = () => {
    if (!change) return null
    return change > 0 ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-error" />
    )
  }

  const getTrendColor = () => {
    if (!change) return 'text-foreground'
    return change > 0 ? 'text-success' : 'text-error'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground-muted">
          {title}
        </CardTitle>
        {icon || <Activity className="h-4 w-4 text-foreground-muted" />}
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-foreground">
            {prefix}{typeof value === 'number' ? (
              isPercentage ? formatPercentage(value) : formatCurrency(value)
            ) : value}
            {suffix}
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}{change.toFixed(2)}{isPercentage ? '%' : ''}
              </span>
            </div>
          )}
        </div>
        {changeLabel && (
          <p className="text-xs text-foreground-muted mt-1">
            {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface TradingMetricsProps {
  winRate: number
  profitFactor: number
  totalPnL: number
  averageRR: number
  todayPnL?: number
  weeklyPnL?: number
  monthlyPnL?: number
}

export function TradingMetrics({
  winRate,
  profitFactor,
  totalPnL,
  averageRR,
  todayPnL,
  weeklyPnL,
  monthlyPnL
}: TradingMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="Tasa de Éxito"
        value={winRate}
        isPercentage={true}
        icon={<Target className="h-4 w-4" />}
        variant={winRate >= 60 ? 'success' : winRate >= 40 ? 'default' : 'error'}
      />
      
      <MetricsCard
        title="Profit Factor"
        value={profitFactor}
        icon={<TrendingUp className="h-4 w-4" />}
        variant={profitFactor >= 1.5 ? 'success' : profitFactor >= 1.0 ? 'default' : 'error'}
      />
      
      <MetricsCard
        title="PnL Total"
        value={totalPnL}
        icon={<DollarSign className="h-4 w-4" />}
        variant={totalPnL >= 0 ? 'success' : 'error'}
      />
      
      <MetricsCard
        title="R:R Promedio"
        value={averageRR}
        icon={<Activity className="h-4 w-4" />}
        variant={averageRR >= 2.0 ? 'success' : averageRR >= 1.5 ? 'default' : 'error'}
      />

      {/* Period-specific metrics */}
      {todayPnL !== undefined && (
        <MetricsCard
          title="PnL Hoy"
          value={todayPnL}
          variant={todayPnL >= 0 ? 'success' : 'error'}
          changeLabel="Últimas 24 horas"
        />
      )}
      
      {weeklyPnL !== undefined && (
        <MetricsCard
          title="PnL Semanal"
          value={weeklyPnL}
          variant={weeklyPnL >= 0 ? 'success' : 'error'}
          changeLabel="Esta semana"
        />
      )}
      
      {monthlyPnL !== undefined && (
        <MetricsCard
          title="PnL Mensual"
          value={monthlyPnL}
          variant={monthlyPnL >= 0 ? 'success' : 'error'}
          changeLabel="Este mes"
        />
      )}
    </div>
  )
}