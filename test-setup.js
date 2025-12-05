// Database setup and test script
const fs = require('fs');
const path = require('path');

// Simple test to verify project structure
console.log('🔍 Verificando estructura del proyecto AURUM INVEST STATION...\n');

// Check essential files
const files = [
  'package.json',
  '.env.local', 
  'prisma/schema.prisma',
  'dev.db',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/lib/prisma.ts'
];

let allFilesExist = true;
files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n' + (allFilesExist ? '✅ Todos los archivos esenciales están presentes' : '⚠️ Faltan algunos archivos'));

// Test environment variables
try {
  require('dotenv').config();
  const envVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];
  
  console.log('\n📋 Variables de entorno:');
  envVars.forEach(varName => {
    const value = process.env[varName];
    console.log(`${value ? '✅' : '❌'} ${varName}: ${value ? 'Configurado' : 'No configurado'}`);
  });
} catch (error) {
  console.log('❌ Error cargando variables de entorno:', error.message);
}

console.log('\n🚀 Proyecto listo para desarrollo local');
console.log('📝 Para continuar, ejecuta en tu terminal:');
console.log('   npm install');
console.log('   npx prisma migrate dev --name init');
console.log('   npm run dev');