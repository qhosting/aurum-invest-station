#!/bin/bash

# Script para arreglar conflictos de nombres comunes en Next.js/React
set -e

echo "🔧 ARREGLANDO CONFLICTOS DE NOMBRES EN CÓDIGO"
echo "============================================"

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Buscar y arreglar conflictos de Terminal
log "🔍 Buscando conflictos de 'Terminal'..."

# Buscar archivos con conflictos potenciales
find /workspace -name "*.tsx" -o -name "*.ts" | while read file; do
    if grep -q "Terminal" "$file" 2>/dev/null; then
        log "📄 Archivo con Terminal: $file"
        
        # Verificar si tiene tanto import como definición de función
        if grep -q "import.*Terminal.*from 'lucide-react'" "$file" && grep -q "function Terminal" "$file"; then
            log "⚠️ CONFLICTO ENCONTRADO en $file"
            
            # Crear backup
            cp "$file" "$file.backup"
            
            # Reemplazar el import de Terminal con TerminalIcon
            sed -i 's/import { \([^,]*\), *Terminal, *\([^}]*\) } from '\''lucide-react'\''/import { \1, TerminalIcon, \2 } from '\''lucide-react'\''/g' "$file"
            sed -i 's/import { Terminal } from '\''lucide-react'\''/import { TerminalIcon } from '\''lucide-react'\''/g' "$file"
            
            # Reemplazar todas las referencias a Terminal (desde lucide-react) con TerminalIcon
            sed -i 's/Terminal,/TerminalIcon,/g' "$file"
            sed -i 's/Terminal\}/TerminalIcon\}/g' "$file"
            
            log "✅ Conflicto resuelto en $file"
        fi
    fi
done

# Buscar otros conflictos comunes
log "🔍 Buscando otros conflictos comunes..."

# Conflictos comunes: Server, Copy, CheckCircle
for component in Server Copy CheckCircle Trash2 RefreshCw Shield; do
    find /workspace -name "*.tsx" -o -name "*.ts" | while read file; do
        if grep -q "import.*$component.*from 'lucide-react'" "$file" && grep -q "function $component" "$file"; then
            log "⚠️ CONFLICTO ENCONTRADO: $component en $file"
            
            # Crear backup
            cp "$file" "$file.backup"
            
            # Renombrar import
            sed -i "s/import { \([^,]*\), *${component}, *\([^}]*\) } from 'lucide-react'/import { \1, ${component}Icon, \2 } from 'lucide-react'/g" "$file"
            sed -i "s/import { $component } from 'lucide-react'/import { ${component}Icon } from 'lucide-react'/g" "$file"
            
            # Reemplazar referencias
            sed -i "s/$component,/${component}Icon,/g" "$file"
            sed -i "s/$component\}/${component}Icon\}/g" "$file"
            
            log "✅ Conflicto $component resuelto en $file"
        fi
    done
done

log "✅ Proceso de resolución de conflictos completado"
log "📊 Backup files created with .backup extension"