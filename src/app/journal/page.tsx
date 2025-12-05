'use client'

import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Tag
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { formatCurrency, formatNumber, timeAgo } from '@/lib/utils'
import { TradeType, TradeStatus } from '@prisma/client'
import Link from 'next/link'

// Mock journal entries
const mockJournalEntries = [
  {
    id: '1',
    tradeId: '1',
    trade: {
      symbol: 'EURUSD',
      type: 'BUY' as TradeType,
      openPrice: 1.0850,
      closePrice: 1.0900,
      profit: 50,
      openTime: new Date('2024-01-07T10:00:00Z'),
      closeTime: new Date('2024-01-07T14:30:00Z'),
      strategy: 'Scalping'
    },
    emotionalState: 'Confiado pero nervioso',
    mistakes: 'Entré un poco tarde, el momentum ya había disminuido',
    learning: 'Necesito esperar confirmaciones antes de entrar',
    lessons: 'La paciencia es clave en scalping',
    nextSteps: 'Mejorar timing de entrada y usar más confluence',
    createdAt: new Date('2024-01-07T15:00:00Z'),
    aiFeedback: 'Buen análisis. Considera usar indicadores de momentum para mejor timing.'
  },
  {
    id: '2',
    tradeId: '2',
    trade: {
      symbol: 'GBPUSD',
      type: 'SELL' as TradeType,
      openPrice: 1.2650,
      closePrice: 1.2600,
      profit: 50,
      openTime: new Date('2024-01-07T09:15:00Z'),
      closeTime: new Date('2024-01-07T11:45:00Z'),
      strategy: 'Day Trading'
    },
    emotionalState: 'Excelente, muy enfocado',
    mistakes: 'No respeté el SL inicial, lo moví',
    learning: 'Los SL son sagrados, no se mueven',
    lessons: 'Disciplina antes que profits',
    nextSteps: 'Trabajar en disciplina y no tocar SL',
    createdAt: new Date('2024-01-07T12:00:00Z'),
    aiFeedback: 'Excelente reconocimiento del problema. La disciplina es fundamental.'
  }
]

interface JournalEntry {
  id: string
  tradeId: string
  trade: {
    symbol: string
    type: TradeType
    openPrice: number
    closePrice?: number
    profit?: number
    openTime: Date
    closeTime?: Date
    strategy?: string
  }
  emotionalState?: string
  mistakes?: string
  learning?: string
  lessons?: string
  nextSteps?: string
  createdAt: Date
  aiFeedback?: string
}

export default function JournalPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStrategy, setFilterStrategy] = useState('')
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredEntries = mockJournalEntries.filter(entry => {
    const matchesSearch = entry.trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (entry.emotionalState?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
                         (entry.learning?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    
    const matchesStrategy = !filterStrategy || entry.trade.strategy === filterStrategy
    
    return matchesSearch && matchesStrategy
  })

  const getTypeIcon = (type: TradeType) => {
    return type === 'BUY' 
      ? <TrendingUp className="h-4 w-4 text-success" />
      : <TrendingDown className="h-4 w-4 text-error" />
  }

  const getTypeLabel = (type: TradeType) => {
    return type === 'BUY' ? 'Compra' : 'Venta'
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Cargando Journal...
          </h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Journal de Trading
            </h1>
            <p className="text-foreground-muted mt-2">
              Registra y analiza tus trades para mejorar tu rendimiento
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Entrada
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Entrada de Journal</DialogTitle>
                <DialogDescription>
                  Registra los detalles de tu trade y reflexiones
                </DialogDescription>
              </DialogHeader>
              <CreateJournalForm onSuccess={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
                  <Input
                    placeholder="Buscar por símbolo, estado emocional o aprendizaje..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStrategy}
                  onChange={(e) => setFilterStrategy(e.target.value)}
                  className="px-3 py-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">Todas las estrategias</option>
                  <option value="Scalping">Scalping</option>
                  <option value="Day Trading">Day Trading</option>
                  <option value="Swing Trading">Swing Trading</option>
                  <option value="Position Trading">Position Trading</option>
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="space-y-6">
          {filteredEntries.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-foreground-muted mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No hay entradas de journal
                </h3>
                <p className="text-foreground-muted text-center mb-4">
                  {searchTerm || filterStrategy 
                    ? 'No se encontraron entradas con los filtros aplicados'
                    : 'Comienza a registrar tus trades para desarrollar tu journal de trading'
                  }
                </p>
                {!searchTerm && !filterStrategy && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primera Entrada
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(entry.trade.type)}
                        <span className="font-bold text-lg">{entry.trade.symbol}</span>
                        <Badge variant="secondary">
                          {getTypeLabel(entry.trade.type)}
                        </Badge>
                      </div>
                      {entry.trade.strategy && (
                        <Badge variant="outline">
                          <Tag className="h-3 w-3 mr-1" />
                          {entry.trade.strategy}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        {formatCurrency(entry.trade.profit || 0)}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        {timeAgo(entry.createdAt)}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Trade Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-foreground-muted">Entrada</p>
                      <p className="font-medium">{formatNumber(entry.trade.openPrice)}</p>
                    </div>
                    {entry.trade.closePrice && (
                      <div>
                        <p className="text-foreground-muted">Salida</p>
                        <p className="font-medium">{formatNumber(entry.trade.closePrice)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-foreground-muted">Estado Emocional</p>
                      <p className="font-medium">{entry.emotionalState || 'No registrado'}</p>
                    </div>
                    <div>
                      <p className="text-foreground-muted">Fecha del Trade</p>
                      <p className="font-medium">
                        {new Date(entry.trade.openTime).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Key Insights */}
                  {entry.learning && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Aprendizaje Principal</h4>
                      <p className="text-sm text-foreground-muted">{entry.learning}</p>
                    </div>
                  )}

                  {entry.nextSteps && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Próximos Pasos</h4>
                      <p className="text-sm text-foreground-muted">{entry.nextSteps}</p>
                    </div>
                  )}

                  {/* AI Feedback */}
                  {entry.aiFeedback && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-2">💡 Feedback de IA</h4>
                      <p className="text-sm text-foreground">{entry.aiFeedback}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4 border-t border-border">
                    <Button variant="outline" size="sm">
                      Ver Trade Completo
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar Entrada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredEntries.length > 0 && (
          <div className="flex justify-center">
            <p className="text-sm text-foreground-muted">
              Mostrando {filteredEntries.length} de {mockJournalEntries.length} entradas
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function CreateJournalForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    symbol: '',
    type: 'BUY' as TradeType,
    openPrice: '',
    closePrice: '',
    strategy: '',
    emotionalState: '',
    mistakes: '',
    learning: '',
    lessons: '',
    nextSteps: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Trade Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="symbol">Símbolo</Label>
          <Input
            id="symbol"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            placeholder="EURUSD"
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as TradeType })}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
          >
            <option value="BUY">Compra</option>
            <option value="SELL">Venta</option>
          </select>
        </div>
        <div>
          <Label htmlFor="openPrice">Precio de Entrada</Label>
          <Input
            id="openPrice"
            type="number"
            step="0.00001"
            value={formData.openPrice}
            onChange={(e) => setFormData({ ...formData, openPrice: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="closePrice">Precio de Salida</Label>
          <Input
            id="closePrice"
            type="number"
            step="0.00001"
            value={formData.closePrice}
            onChange={(e) => setFormData({ ...formData, closePrice: e.target.value })}
          />
        </div>
      </div>

      {/* Strategy */}
      <div>
        <Label htmlFor="strategy">Estrategia</Label>
        <select
          id="strategy"
          value={formData.strategy}
          onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
        >
          <option value="">Seleccionar estrategia</option>
          <option value="Scalping">Scalping</option>
          <option value="Day Trading">Day Trading</option>
          <option value="Swing Trading">Swing Trading</option>
          <option value="Position Trading">Position Trading</option>
        </select>
      </div>

      {/* Journal Content */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="emotionalState">Estado Emocional</Label>
          <Textarea
            id="emotionalState"
            value={formData.emotionalState}
            onChange={(e) => setFormData({ ...formData, emotionalState: e.target.value })}
            placeholder="¿Cómo te sentiste durante el trade?"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="mistakes">Errores Identificados</Label>
          <Textarea
            id="mistakes"
            value={formData.mistakes}
            onChange={(e) => setFormData({ ...formData, mistakes: e.target.value })}
            placeholder="¿Qué errores cometiste?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="learning">Aprendizaje Principal</Label>
          <Textarea
            id="learning"
            value={formData.learning}
            onChange={(e) => setFormData({ ...formData, learning: e.target.value })}
            placeholder="¿Qué aprendiste de este trade?"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="lessons">Lecciones</Label>
          <Textarea
            id="lessons"
            value={formData.lessons}
            onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
            placeholder="¿Qué lecciones puedes extraer?"
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="nextSteps">Próximos Pasos</Label>
          <Textarea
            id="nextSteps"
            value={formData.nextSteps}
            onChange={(e) => setFormData({ ...formData, nextSteps: e.target.value })}
            placeholder="¿Cómo mejorarás en el futuro?"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit">
          Guardar Entrada
        </Button>
      </div>
    </form>
  )
}