import { z } from 'zod'

// User Schemas
export const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['SUPER_ADMIN', 'TRADER']).default('TRADER'),
})

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  role: z.enum(['SUPER_ADMIN', 'TRADER']).optional(),
})

// Trade Schemas
export const createTradeSchema = z.object({
  symbol: z.string().min(1, 'El símbolo es requerido'),
  type: z.enum(['BUY', 'SELL']),
  openPrice: z.number().positive('El precio debe ser positivo'),
  closePrice: z.number().positive('El precio debe ser positivo').optional(),
  sl: z.number().positive('El stop loss debe ser positivo').optional(),
  tp: z.number().positive('El take profit debe ser positivo').optional(),
  profit: z.number().optional(),
  strategy: z.string().optional(),
  notes: z.string().optional(),
})

export const updateTradeSchema = z.object({
  closePrice: z.number().positive('El precio debe ser positivo').optional(),
  sl: z.number().positive('El stop loss debe ser positivo').optional(),
  tp: z.number().positive('El take profit debe ser positivo').optional(),
  profit: z.number().optional(),
  status: z.enum(['OPEN', 'CLOSED', 'PENDING']).optional(),
  notes: z.string().optional(),
})

// Journal Entry Schemas
export const createJournalEntrySchema = z.object({
  tradeId: z.string().min(1, 'ID de trade requerido'),
  emotionalState: z.string().optional(),
  mistakes: z.string().optional(),
  learning: z.string().optional(),
  lessons: z.string().optional(),
  nextSteps: z.string().optional(),
})

export const updateJournalEntrySchema = createJournalEntrySchema.partial()

// MT5 Webhook Schema
export const mt5WebhookSchema = z.object({
  symbol: z.string().min(1, 'El símbolo es requerido'),
  type: z.enum(['BUY', 'SELL']),
  price: z.number().positive('El precio debe ser positivo'),
  sl: z.number().positive('El stop loss debe ser positivo').optional(),
  tp: z.number().positive('El take profit debe ser positivo').optional(),
  magic_number: z.number().optional(),
  volume: z.number().positive('El volumen debe ser positivo').optional(),
  strategy: z.string().optional(),
})

// System Settings Schema
export const systemSettingsSchema = z.object({
  chatwootToken: z.string().optional(),
  chatwootUrl: z.string().url('URL inválida').optional(),
  aiModel: z.string().optional(),
  n8nWebhookUrl: z.string().url('URL inválida').optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().positive('Puerto inválido').optional(),
  smtpUser: z.string().email('Email inválido').optional(),
  smtpPassword: z.string().optional(),
  defaultRisk: z.number().min(0).max(1, 'Riesgo debe estar entre 0 y 1').optional(),
  defaultRR: z.number().positive('R:R debe ser positivo').optional(),
})

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateTradeInput = z.infer<typeof createTradeSchema>
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>
export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>
export type MT5WebhookInput = z.infer<typeof mt5WebhookSchema>
export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>