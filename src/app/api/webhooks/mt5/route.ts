import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { mt5WebhookSchema } from '@/lib/validations'
import bcrypt from 'bcrypt'
import { TradeType, TradeStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    // Verify API key in headers
    const apiKey = request.headers.get('X-API-KEY')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 401 }
      )
    }

    // Find user by API key
    const user = await prisma.user.findUnique({
      where: { apiKey: apiKey },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid API Key' },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = mt5WebhookSchema.parse(body)

    // Create new trade
    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        symbol: validatedData.symbol,
        type: validatedData.type as TradeType,
        openPrice: validatedData.price,
        sl: validatedData.sl,
        tp: validatedData.tp,
        magicNumber: validatedData.magic_number,
        strategy: validatedData.strategy,
        status: TradeStatus.OPEN,
        openTime: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            apiKey: true,
          },
        },
      },
    })

    // Log successful trade creation
    console.log(`Trade created for user ${user.name}:`, {
      tradeId: trade.id,
      symbol: trade.symbol,
      type: trade.type,
      openPrice: trade.openPrice,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Trade recorded successfully',
        data: {
          id: trade.id,
          symbol: trade.symbol,
          type: trade.type,
          openPrice: trade.openPrice,
          openTime: trade.openTime,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('MT5 Webhook Error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to process MT5 webhook'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify API key in headers
    const apiKey = request.headers.get('X-API-KEY')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 401 }
      )
    }

    // Find user by API key
    const user = await prisma.user.findUnique({
      where: { apiKey: apiKey },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid API Key' },
        { status: 401 }
      )
    }

    // Get recent trades for this user
    const trades = await prisma.trade.findMany({
      where: { userId: user.id },
      orderBy: { openTime: 'desc' },
      take: 50, // Limit to last 50 trades
      select: {
        id: true,
        symbol: true,
        type: true,
        openPrice: true,
        closePrice: true,
        profit: true,
        status: true,
        openTime: true,
        closeTime: true,
        strategy: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: trades,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

  } catch (error) {
    console.error('MT5 Webhook GET Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}