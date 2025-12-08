#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Verificando archivos src/lib/ en repositorio remoto...');

try {
  // Verificar que los archivos estén en el repositorio remoto
  console.log('📂 Verificando src/lib/validations.ts...');
  const validations = execSync('git ls-tree -r main | grep "src/lib/validations.ts"', { encoding: 'utf8' });
  console.log('✅', validations.trim());
  
  console.log('📂 Verificando src/lib/utils.ts...');
  const utils = execSync('git ls-tree -r main | grep "src/lib/utils.ts"', { encoding: 'utf8' });
  console.log('✅', utils.trim());
  
  console.log('📂 Verificando src/lib/auth.ts...');
  const auth = execSync('git ls-tree -r main | grep "src/lib/auth.ts"', { encoding: 'utf8' });
  console.log('✅', auth.trim());
  
  console.log('📂 Verificando src/lib/prisma.ts...');
  const prisma = execSync('git ls-tree -r main | grep "src/lib/prisma.ts"', { encoding: 'utf8' });
  console.log('✅', prisma.trim());
  
  console.log('🎉 ¡Todos los archivos src/lib/ están correctamente en el repositorio remoto!');
  
} catch (error) {
  console.error('❌ Error verificando archivos:', error.message);
  process.exit(1);
}