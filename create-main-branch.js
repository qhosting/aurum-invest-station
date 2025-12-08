#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔄 Creando rama main correctamente...');

try {
  // Verificar ramas actuales
  console.log('📋 Ramas actuales:');
  const branches = execSync('git branch -a', { encoding: 'utf8' });
  console.log(branches);
  
  // Crear rama main local
  console.log('🌱 Creando rama main local...');
  execSync('git checkout -b main', { stdio: 'inherit' });
  
  // Push a main remota
  console.log('🚀 Pushando a main remota...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ ¡Rama main creada y sincronizada exitosamente!');
  
  // Verificar que los archivos están ahí
  console.log('🔍 Verificando archivos en rama main...');
  const libFiles = execSync('git ls-tree -r HEAD | grep "src/lib/"', { encoding: 'utf8' });
  console.log('📦 Archivos src/lib/ encontrados:');
  console.log(libFiles);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}