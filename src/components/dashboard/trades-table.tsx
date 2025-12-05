'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, timeAgo, formatNumber } from '@/lib/utils'
import { TradeType, TradeStatus } from '@prisma/client'
import { 
  Eye, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react'

interface Trade {
  id: string
  symbol: string
  type: TradeType
  openPrice: number
  closePrice?: number
  sl?: number
  tp?: number
  profit?: number
  openTime: Date
  closeTime?: Date
  status: TradeStatus
  strategy?: string
}

interface TradesTableProps {
  trades: Trade[]
  onViewTrade?: (tradeId: string) => void
  title?: string
}

export function TradesTable({ trades, onViewTrade, title = "Trades Recientes" }: TradesTableProps) {
  const getStatusIcon = (status: TradeStatus) => {
    switch (status) {
      case 'OPEN':
        return <Clock className="h-4 w-4 text-primary" />
      case 'CLOSED':
        return <CheckCircle className="h-4 w-4 text-success" />
      case 'PENDING':
        return <XCircle className="h-4 w-4 text-error" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: TradeStatus) => {
    switch (status) {
      case 'OPEN':
        return <Badge variant="secondary">Abierto</Badge>
      case 'CLOSED':
        return <Badge variant="default">Cerrado</Badge>
      case 'PENDING':
        return <Badge variant="destructive">Pendiente</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: TradeType) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="h-4 w-4 text-success" />
      case 'SELL':
        return <TrendingDown className="h-4 w-4 text-error" />
      default:
        return null
    }
  }

  const getProfitColor = (profit?: number) => {
    if (profit === undefined || profit === null) return 'text-foreground'
    return profit >= 0 ? 'text-success' : 'text-error'
  }

  const getRiskReward = (trade: Trade) => {
    if (!trade.sl || !trade.tp || !trade.profit) return 'N/A'
    
    const risk = Math.abs(trade.openPrice - trade.sl)
    const reward = Math.abs(trade.tp - trade.openPrice)
    const ratio = reward / risk
    
    return ratio.toFixed(2) + ':1'
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Estado</TableHead>
              <TableHead>Símbolo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Precio Entrada</TableHead>
              <TableHead>Precio Salida</TableHead>
              <TableHead>SL / TP</TableHead>
              <TableHead>PnL</TableHead>
              <TableHead>R:R</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-foreground-muted py-8">
                  No hay trades registrados
                </TableCell>
              </TableRow>
            ) : (
              trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(trade.status)}
                      {getStatusBadge(trade.status)}
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium">{trade.symbol}</TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(trade.type)}
                      <span className="font-medium">
                        {trade.type === 'BUY' ? 'Compra' : 'Venta'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>{formatNumber(trade.openPrice)}</TableCell>
                  
                  <TableCell>
                    {trade.closePrice ? formatNumber(trade.closePrice) : '-'}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>SL: {trade.sl ? formatNumber(trade.sl) : '-'}</div>
                      <div>TP: {trade.tp ? formatNumber(trade.tp) : '-'}</div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className={`font-medium ${getProfitColor(trade.profit)}`}>
                      {trade.profit !== undefined ? formatCurrency(trade.profit) : '-'}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-foreground-muted">
                      {getRiskReward(trade)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <div>{timeAgo(new Date(trade.openTime))}</div>
                      {trade.closeTime && (
                        <div className="text-foreground-muted">
                          {timeAgo(new Date(trade.closeTime))}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewTrade?.(trade.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {trades.length > 0 && (
        <div className="text-sm text-foreground-muted">
          Mostrando {trades.length} trades
        </div>
      )}
    </div>
  )
}