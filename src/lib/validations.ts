import { z } from "zod"

// User schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "TRADER"]).default("TRADER"),
})

// Trade schemas
export const createTradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  type: z.enum(["BUY", "SELL"]),
  entryPrice: z.number().positive("Entry price must be positive"),
  exitPrice: z.number().positive().optional(),
  sl: z.number().positive("Stop loss must be positive"),
  tp: z.number().positive("Take profit must be positive"),
  lotSize: z.number().positive("Lot size must be positive"),
  profit: z.number().optional(),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
  setup: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
})

export const updateTradeSchema = z.object({
  symbol: z.string().min(1).optional(),
  type: z.enum(["BUY", "SELL"]).optional(),
  entryPrice: z.number().positive().optional(),
  exitPrice: z.number().positive().optional(),
  sl: z.number().positive().optional(),
  tp: z.number().positive().optional(),
  lotSize: z.number().positive().optional(),
  profit: z.number().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  setup: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
})

// Journal Metric schemas
export const createJournalMetricSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  date: z.date(),
  balance: z.number(),
  equity: z.number(),
})

// MT5 Webhook schemas
export const mt5WebhookSchema = z.object({
  symbol: z.string().min(1),
  action: z.enum(["OPEN", "CLOSE"]),
  price: z.number().positive(),
  sl: z.number().positive(),
  tp: z.number().positive(),
  profit: z.number().optional(),
  lotSize: z.number().positive().default(0.01),
  type: z.enum(["BUY", "SELL"]).optional(),
  setup: z.string().optional(),
})

// Dashboard metrics schemas
export const dashboardMetricsSchema = z.object({
  totalBalance: z.number(),
  winRate: z.number().min(0).max(100),
  relativeDrawdown: z.number(),
  dailyPnL: z.number(),
  totalTrades: z.number().int().nonnegative(),
  profitFactor: z.number().positive(),
  maxDrawdown: z.number().negative(),
  riskRewardRatio: z.number().positive(),
})

// Equity data schemas
export const equityDataPointSchema = z.object({
  date: z.string(),
  equity: z.number(),
  balance: z.number(),
})

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const tradeListResponseSchema = apiResponseSchema.extend({
  data: z.array(z.object({
    id: z.string(),
    symbol: z.string(),
    type: z.enum(["BUY", "SELL"]),
    entryPrice: z.number(),
    exitPrice: z.number().nullable(),
    sl: z.number().nullable(),
    tp: z.number().nullable(),
    lotSize: z.number(),
    profit: z.number().nullable(),
    status: z.enum(["OPEN", "CLOSED"]),
    setup: z.string().nullable(),
    screenshotUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
})