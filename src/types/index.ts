import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      apiKey: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    apiKey: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string
    apiKey: string
  }
}

// Additional types for the application
export interface Trade {
  id: string
  userId: string
  symbol: string
  type: "BUY" | "SELL"
  entryPrice: number
  exitPrice: number | null
  sl: number | null
  tp: number | null
  lotSize: number
  profit: number | null
  status: "OPEN" | "CLOSED"
  setup: string | null
  screenshotUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: "ADMIN" | "TRADER"
  apiKey: string
  createdAt: Date
  updatedAt: Date
}

export interface JournalMetric {
  id: string
  userId: string
  date: Date
  balance: number
  equity: number
  createdAt: Date
}

export interface DashboardMetrics {
  totalBalance: number
  winRate: number
  relativeDrawdown: number
  dailyPnL: number
  totalTrades: number
  profitFactor: number
  maxDrawdown: number
  riskRewardRatio: number
}

export interface EquityDataPoint {
  date: string
  equity: number
  balance: number
}

export interface MT5WebhookPayload {
  symbol: string
  action: "OPEN" | "CLOSE"
  price: number
  sl: number
  tp: number
  profit?: number
  lotSize?: number
  type?: "BUY" | "SELL"
  setup?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface TradeFilters {
  symbol?: string
  type?: "BUY" | "SELL"
  status?: "OPEN" | "CLOSED"
  setup?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface PerformanceMetrics {
  totalReturn: number
  annualizedReturn: number
  sharpeRatio: number
  maxDrawdown: number
  winRate: number
  profitFactor: number
  averageWin: number
  averageLoss: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
}