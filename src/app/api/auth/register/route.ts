import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createUserSchema } from '@/lib/validations'
import bcrypt from 'bcrypt'
import { UserRole } from '@prisma/client'
import { generateApiKey } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input data
    const validatedData = createUserSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El usuario ya existe con este email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Generate unique API key for MT5 integration
    const apiKey = generateApiKey()

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role as UserRole,
        apiKey: apiKey,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        apiKey: true,
        createdAt: true,
      },
    })

    // Log user creation
    console.log(`User created: ${user.email} (${user.role})`)

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          apiKey: user.apiKey,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('User Registration Error:', error)

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.message 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: 'No se pudo crear el usuario'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  // This endpoint could be used to get user info or check system health
  return NextResponse.json(
    { 
      message: 'User registration API',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  )
}