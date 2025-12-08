#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔄 Sincronizando repositorio...');

try {
  // Verificar estado actual
  console.log('📊 Estado actual del repositorio:');
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  console.log(status);
  
  // Forzar push de la rama master a main
  console.log('🚀 Forzando push a rama main...');
  execSync('git push origin master:main --force', { stdio: 'inherit' });
  
  console.log('✅ ¡Repositorio sincronizado exitosamente!');
  console.log('📦 Los archivos src/lib/ ahora deberían estar disponibles en GitHub');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}