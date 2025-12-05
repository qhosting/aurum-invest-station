'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TrendingUp, BarChart3, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session) {
    // Will redirect automatically
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold text-foreground">
                Aurum Invest
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-foreground-muted">
              Station
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
            Plataforma profesional de trading algorítmico. Analiza, registra y mejora 
            tu rendimiento con herramientas avanzadas de IA y análisis en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/signin">
                Iniciar Sesión
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/register">
                Crear Cuenta
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Análisis Avanzado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Métricas detalladas, curvas de capital y análisis de rendimiento en tiempo real
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Journal de Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Registra tus trades, emociones y aprendizajes con coaching de IA integrado
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <CardTitle>Automatización MT5</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Conecta tu MetaTrader 5 y registra trades automáticamente via webhook
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <Card="h-8Header>
              <TrendingUp className w-8 text-primary mx-auto" />
              <CardTitle>IA Coaching</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Feedback inteligente y sugerencias personalizadas basadas en tu historial
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            ¿Listo para mejorar tu trading?
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Únete a traders profesionales que utilizan Aurum Invest Station 
            para maximizar su rendimiento y desarrollar disciplina consistente.
          </p>
          <Button asChild size="lg">
            <Link href="/auth/register">
              Comenzar Gratis
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-foreground-muted">
            <p>&copy; 2024 Aurum Invest Station. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
