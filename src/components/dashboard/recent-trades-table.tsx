"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Trade {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  entryPrice: number
  exitPrice: number | null
  lotSize: number
  profit: number | null
  status: 'OPEN' | 'CLOSED'
  setup: string | null
  createdAt: string
}

interface RecentTradesTableProps {
  userId: string
}

export function RecentTradesTable({ userId }: RecentTradesTableProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        // This would typically fetch from your API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call
        
        const mockTrades: Trade[] = [
          {
            id: '1',
            symbol: 'EURUSD',
            type: 'BUY',
            entryPrice: 1.0845,
            exitPrice: 1.0867,
            lotSize: 0.1,
            profit: 22.00,
            status: 'CLOSED',
            setup: 'Aurum V33',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            symbol: 'GBPUSD',
            type: 'SELL',
            entryPrice: 1.2654,
            exitPrice: 1.2631,
            lotSize: 0.05,
            profit: 11.50,
            status: 'CLOSED',
            setup: 'Breakout Strategy',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          },
          {
            id: '3',
            symbol: 'USDJPY',
            type: 'BUY',
            entryPrice: 148.25,
            exitPrice: null,
            lotSize: 0.08,
            profit: null,
            status: 'OPEN',
            setup: 'Swing Trade',
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          },
        ]
        
        setTrades(mockTrades)
      } catch (error) {
        console.error("Failed to fetch trades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrades()
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-800 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No trades found. Start trading to see your activity here.
      </div>
    )
  }

  const getStatusColor = (status: Trade['status']) => {
    return status === 'OPEN' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }

  const getProfitColor = (profit: number | null) => {
    if (profit === null) return 'text-gray-400'
    return profit >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 hover:bg-gray-800/50">
            <TableHead className="text-gray-400">Symbol</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
            <TableHead className="text-gray-400">Entry Price</TableHead>
            <TableHead className="text-gray-400">Exit Price</TableHead>
            <TableHead className="text-gray-400">Lot Size</TableHead>
            <TableHead className="text-gray-400">Profit</TableHead>
            <TableHead className="text-gray-400">Status</TableHead>
            <TableHead className="text-gray-400">Setup</TableHead>
            <TableHead className="text-gray-400">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="border-gray-700 hover:bg-gray-800/50">
              <TableCell className="font-mono text-white">{trade.symbol}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={trade.type === 'BUY' ? 'border-[#10B981] text-[#10B981]' : 'border-[#EF4444] text-[#EF4444]'}
                >
                  {trade.type}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-white">{trade.entryPrice.toFixed(5)}</TableCell>
              <TableCell className="font-mono text-white">
                {trade.exitPrice ? trade.exitPrice.toFixed(5) : '-'}
              </TableCell>
              <TableCell className="font-mono text-white">{trade.lotSize}</TableCell>
              <TableCell className={`font-mono ${getProfitColor(trade.profit)}`}>
                {trade.profit ? `$${trade.profit.toFixed(2)}` : '-'}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(trade.status)}>
                  {trade.status}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-300">
                {trade.setup || '-'}
              </TableCell>
              <TableCell className="text-gray-400 text-sm">
                {formatDate(trade.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}