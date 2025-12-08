import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const webhookSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey = request.headers.get("x-api-key")
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required in x-api-key header" },
        { status: 401 }
      )
    }

    // Validate API key and get user
    const user = await prisma.user.findUnique({
      where: { apiKey },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = webhookSchema.parse(body)

    if (validatedData.action === "OPEN") {
      // Create new trade
      const trade = await prisma.trade.create({
        data: {
          userId: user.id,
          symbol: validatedData.symbol,
          type: validatedData.type || "BUY", // Default to BUY if not specified
          entryPrice: validatedData.price,
          sl: validatedData.sl,
          tp: validatedData.tp,
          lotSize: validatedData.lotSize,
          status: "OPEN",
          setup: validatedData.setup,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Trade opened successfully",
        trade,
      })
    } else if (validatedData.action === "CLOSE") {
      // Find the most recent open trade for this symbol
      const openTrade = await prisma.trade.findFirst({
        where: {
          userId: user.id,
          symbol: validatedData.symbol,
          status: "OPEN",
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (!openTrade) {
        return NextResponse.json(
          { error: "No open trade found for this symbol" },
          { status: 404 }
        )
      }

      // Calculate profit if not provided
      let calculatedProfit = validatedData.profit
      if (!calculatedProfit) {
        if (openTrade.type === "BUY") {
          calculatedProfit = (validatedData.price - openTrade.entryPrice) * openTrade.lotSize * 100000 // Standard lot calculation
        } else {
          calculatedProfit = (openTrade.entryPrice - validatedData.price) * openTrade.lotSize * 100000
        }
      }

      // Update trade with exit price and profit
      const trade = await prisma.trade.update({
        where: { id: openTrade.id },
        data: {
          exitPrice: validatedData.price,
          profit: calculatedProfit,
          status: "CLOSED",
        },
      })

      // Update daily journal metrics
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Calculate current balance and equity (simplified calculation)
      const userTrades = await prisma.trade.findMany({
        where: {
          userId: user.id,
          status: "CLOSED",
        },
      })

      const totalProfit = userTrades.reduce((sum, t) => sum + (t.profit || 0), 0)
      const currentBalance = 10000 + totalProfit // Assuming starting balance of $10,000
      const currentEquity = currentBalance // Simplified - in reality this would include floating P&L

      // Update or create journal metric for today
      await prisma.journalMetric.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {
          balance: currentBalance,
          equity: currentEquity,
        },
        create: {
          userId: user.id,
          date: today,
          balance: currentBalance,
          equity: currentEquity,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Trade closed successfully",
        trade,
      })
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Webhook error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get API key from headers
    const apiKey = request.headers.get("x-api-key")
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required in x-api-key header" },
        { status: 401 }
      )
    }

    // Validate API key and get user
    const user = await prisma.user.findUnique({
      where: { apiKey },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      )
    }

    // Get recent trades for this user
    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to recent 50 trades
    })

    return NextResponse.json({
      success: true,
      trades,
    })
  } catch (error) {
    console.error("Get trades error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}