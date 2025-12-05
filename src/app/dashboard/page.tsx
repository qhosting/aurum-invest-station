'use client'

import React, { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { TradingMetrics } from '@/components/dashboard/metrics-card'
import { EquityCurveChart } from '@/components/dashboard/equity-curve-chart'
import { TradesTable } from '@/components/dashboard/trades-table'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, Download } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatCurrency } from '@/lib/utils'
import { Trade } from '@prisma/client'
import Link from 'next/link'

// Mock data - replace with actual API calls
const mockEquityData = [
  { date: '2024-01-01', balance: 10000, profit: 0, trades: 0 },
  { date: '2024-01-02', balance: 10200, profit: 200, trades: 2 },
  { date: '2024-01-03', balance: 10150, profit: 150, trades: 3 },
  { date: '2024-01-04', balance: 10400, profit: 400, trades: 5 },
  { date: '2024-01-05', balance: 10300, profit: 300, trades: 4 },
  { date: '2024-01-06', balance: 10600, profit: 600, trades: 6 },
  { date: '2024-01-07', balance: 10750, profit: 750, trades: 7 },
]

const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'BUY',
    openPrice: 1.0850,
    closePrice: 1.0900,
    sl: 1.0800,
    tp: 1.0950,
    profit: 50,
    openTime: new Date('2024-01-07T10:00:00Z'),
    closeTime: new Date('2024-01-07T14:30:00Z'),
    status: 'CLOSED',
    strategy: 'Scalping'
  },
  {
    id: '2',
    symbol: 'GBPUSD',
    type: 'SELL',
    openPrice: 1.2650,
    closePrice: 1.2600,
    sl: 1.2700,
    tp: 1.2550,
    profit: 50,
    openTime: new Date('2024-01-07T09:15:00Z'),
    closeTime: new Date('2024-01-07T11:45:00Z'),
    status: 'CLOSED',
    strategy: 'Day Trading'
  },
  {
    id: '3',
    symbol: 'XAUUSD',
    type: 'BUY',
    openPrice: 2040.00,
    closePrice: 2045.00,
    sl: 2030.00,
    tp: 2060.00,
    profit: 500,
    openTime: new Date('2024-01-07T08:30:00Z'),
    closeTime: new Date('2024-01-07T16:00:00Z'),
    status: 'CLOSED',
    strategy: 'Swing Trading'
  }
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [equityData, setEquityData] = useState(mockEquityData)
  const [recentTrades, setRecentTrades] = useState<Trade[]>(mockTrades)

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleViewTrade = (tradeId: string) => {
    // Navigate to trade detail page
    console.log('View trade:', tradeId)
  }

  // Calculate metrics from trades
  const calculateMetrics = () => {
    const closedTrades = recentTrades.filter(trade => trade.status === 'CLOSED')
    const totalTrades = closedTrades.length
    const winningTrades = closedTrades.filter(trade => (trade.profit || 0) > 0).length
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0
    
    const totalProfit = closedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0)
    const grossProfit = closedTrades.filter(trade => (trade.profit || 0) > 0)
      .reduce((sum, trade) => sum + (trade.profit || 0), 0)
    const grossLoss = Math.abs(closedTrades.filter(trade => (trade.profit || 0) < 0)
      .reduce((sum, trade) => sum + (trade.profit || 0), 0))
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0

    // Calculate average risk-reward ratio
    const rrRatios = closedTrades
      .filter(trade => trade.sl && trade.tp && trade.profit !== undefined)
      .map(trade => {
        const risk = Math.abs(trade.openPrice - trade.sl!)
        const reward = Math.abs(trade.tp! - trade.openPrice)
        return reward / risk
      })
    const averageRR = rrRatios.length > 0 
      ? rrRatios.reduce((sum, ratio) => sum + ratio, 0) / rrRatios.length 
      : 0

    return {
      winRate,
      profitFactor,
      totalPnL: totalProfit,
      averageRR
    }
  }

  const metrics = calculateMetrics()

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Cargando Dashboard...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Bienvenido, {session.user?.name}
            </h1>
            <p className="text-foreground-muted mt-2">
              Resumen de tu actividad de trading
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            
            <Button asChild>
              <Link href="/journal/new">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Trade
              </Link>
            </Button>
          </div>
        </div>

        {/* Metrics Section */}
        <TradingMetrics
          winRate={metrics.winRate}
          profitFactor={metrics.profitFactor}
          totalPnL={metrics.totalPnL}
          averageRR={metrics.averageRR}
          todayPnL={recentTrades
            .filter(trade => trade.status === 'CLOSED')
            .filter(trade => {
              const today = new Date()
              const tradeDate = new Date(trade.closeTime!)
              return tradeDate.toDateString() === today.toDateString()
            })
            .reduce((sum, trade) => sum + (trade.profit || 0), 0)}
        />

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-1">
          <EquityCurveChart
            data={equityData}
            title="Curva de Capital"
            description="Evolución de tu balance y ganancias acumuladas"
            height={400}
          />
        </div>

        {/* Recent Trades Section */}
        <TradesTable
          trades={recentTrades.slice(0, 10)} // Show only recent 10 trades
          onViewTrade={handleViewTrade}
          title="Últimos Trades"
        />

        {/* Footer Stats */}
        <div className="bg-surface rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Resumen del Período
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-foreground-muted">Balance Actual</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(equityData[equityData.length - 1]?.balance || 0)}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Total de Trades</p>
              <p className="text-xl font-bold text-foreground">
                {recentTrades.length}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Trades Ganadores</p>
              <p className="text-xl font-bold text-success">
                {recentTrades.filter(trade => (trade.profit || 0) > 0).length}
              </p>
            </div>
            <div>
              <p className="text-foreground-muted">Mejor Trade</p>
              <p className="text-xl font-bold text-success">
                {formatCurrency(Math.max(...recentTrades.map(trade => trade.profit || 0)))}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}