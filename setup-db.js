const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Creando base de datos SQLite...');

  // Test connection
  await prisma.$connect();
  console.log('✅ Conexión a base de datos exitosa');

  // Create initial system settings
  const settings = await prisma.systemSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      aiModel: 'gpt-4',
      defaultRisk: 0.02,
      defaultRR: 2.0,
      smtpPort: 587
    }
  });

  console.log('✅ Configuración del sistema creada');
  console.log('📊 Base de datos SQLite lista para usar');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });