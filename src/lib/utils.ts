import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateWinRate(trades: Array<{ profit: number | null }>): number {
  const closedTrades = trades.filter(trade => trade.profit !== null)
  if (closedTrades.length === 0) return 0
  
  const winningTrades = closedTrades.filter(trade => (trade.profit || 0) > 0)
  return (winningTrades.length / closedTrades.length) * 100
}

export function calculateTotalProfit(trades: Array<{ profit: number | null }>): number {
  return trades.reduce((total, trade) => total + (trade.profit || 0), 0)
}

export function calculateProfitFactor(trades: Array<{ profit: number | null }>): number {
  const closedTrades = trades.filter(trade => trade.profit !== null)
  const winningTrades = closedTrades.filter(trade => (trade.profit || 0) > 0)
  const losingTrades = closedTrades.filter(trade => (trade.profit || 0) < 0)
  
  const grossProfit = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0)
  const grossLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0))
  
  return grossLoss === 0 ? grossProfit > 0 ? Infinity : 0 : grossProfit / grossLoss
}

export function calculateRiskRewardRatio(trades: Array<{ profit: number | null, sl: number | null, tp: number | null }>): number {
  const tradesWithSLTP = trades.filter(trade => trade.sl && trade.tp)
  
  if (tradesWithSLTP.length === 0) return 0
  
  const totalReward = tradesWithSLTP.reduce((sum, trade) => sum + (trade.tp || 0), 0)
  const totalRisk = tradesWithSLTP.reduce((sum, trade) => sum + (trade.sl || 0), 0)
  
  return totalRisk === 0 ? 0 : totalReward / totalRisk
}

export function generateApiKey(): string {
  return crypto.randomUUID()
}

export function hashPassword(password: string): Promise<string> {
  return import("bcryptjs").then(({ hash }) => hash(password, 10))
}

export function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return import("bcryptjs").then(({ compare }) => compare(password, hashedPassword))
}

export function getTimeAgo(date: Date | string): string {
  const now = new Date()
  const past = typeof date === "string" ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)
  
  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(past)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getTradeStatusColor(status: "OPEN" | "CLOSED"): string {
  switch (status) {
    case "OPEN":
      return "text-blue-400"
    case "CLOSED":
      return "text-gray-400"
    default:
      return "text-gray-400"
  }
}

export function getProfitColor(profit: number | null): string {
  if (profit === null) return "text-gray-400"
  return profit >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
}

export function getTradeTypeColor(type: "BUY" | "SELL"): string {
  switch (type) {
    case "BUY":
      return "text-[#10B981]"
    case "SELL":
      return "text-[#EF4444]"
    default:
      return "text-gray-400"
  }
}