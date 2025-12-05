import { User, Trade, JournalEntry, SystemSettings } from '@prisma/client'

export interface UserWithRelations extends User {
  trades: Trade[]
  journalEntries: JournalEntry[]
}

export interface TradeWithRelations extends Trade {
  user: User
  journalEntries: JournalEntry[]
}

export interface JournalEntryWithRelations extends JournalEntry {
  trade: Trade
  user: User
}

export interface TradingStats {
  totalTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  profitFactor: number
  totalPnL: number
  averageRR: number
  largestWin: number
  largestLoss: number
  averageWin: number
  averageLoss: number
}

export interface EquityCurveData {
  date: string
  balance: number
  profit: number
  trades: number
}

export interface MT5TradePayload {
  symbol: string
  type: 'BUY' | 'SELL'
  price: number
  sl?: number
  tp?: number
  magic_number?: number
  volume?: number
  strategy?: string
}

export interface AIInsight {
  type: 'analysis' | 'suggestion' | 'warning' | 'success'
  message: string
  confidence: number
  actionable: boolean
}

export interface DashboardMetrics {
  today: {
    pnl: number
    trades: number
    winRate: number
  }
  thisWeek: {
    pnl: number
    trades: number
    winRate: number
  }
  thisMonth: {
    pnl: number
    trades: number
    winRate: number
  }
  total: {
    pnl: number
    trades: number
    winRate: number
    profitFactor: number
    averageRR: number
  }
}

export interface ChartConfig {
  type: 'line' | 'candlestick' | 'area'
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d'
  indicators: string[]
}