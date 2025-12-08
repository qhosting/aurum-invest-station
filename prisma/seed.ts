import { PrismaClient, TradeType, TradeStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeding de base de datos...');

  // Crear super admin
  const superAdminEmail = 'admin@auruminvest.mx';
  const superAdminPassword = 'AURUM2024!SuperAdmin';
  const hashedSuperAdminPassword = await bcrypt.hash(superAdminPassword, 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      name: 'Super Admin AURUM',
      password: hashedSuperAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Super Admin creado: ${superAdmin.email}`);
  console.log(`🔑 Password: ${superAdminPassword}`);

  // Crear usuario administrador demo
  const adminEmail = 'trader@auruminvest.mx';
  const adminPassword = 'AURUM2024!Trader';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Trader Demo AURUM',
      password: hashedAdminPassword,
      role: 'TRADER',
    },
  });

  console.log(`✅ Usuario Trader creado: ${adminUser.email}`);
  console.log(`🔑 Password: ${adminPassword}`);

  // Crear algunos datos de ejemplo para el dashboard
  const today = new Date();
  const journalMetrics = [];

  // Generar datos de los últimos 30 días
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const balance = 10000 + (Math.random() * 5000) + (i * 100); // Balance creciente
    const equity = balance + (Math.random() * 2000 - 1000); // Equity con variación

    journalMetrics.push({
      userId: adminUser.id,
      balance,
      equity,
      date,
    });
  }

  await prisma.journalMetric.createMany({
    data: journalMetrics,
  });

  console.log('📊 Datos de ejemplo de JournalMetric creados');

  // Crear algunos trades de ejemplo
  const sampleTrades: Array<{
    userId: string;
    symbol: string;
    type: TradeType;
    entryPrice: number;
    exitPrice: number | null;
    sl: number;
    tp: number;
    lotSize: number;
    profit: number | null;
    status: TradeStatus;
    setup: string;
    openedAt: Date;
    closedAt: Date | null;
  }> = [
    {
      userId: adminUser.id,
      symbol: 'EURUSD',
      type: TradeType.BUY,
      entryPrice: 1.0850,
      exitPrice: 1.0920,
      sl: 1.0800,
      tp: 1.0950,
      lotSize: 0.1,
      profit: 70.00,
      status: TradeStatus.CLOSED,
      setup: 'AURUM V33',
      openedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      symbol: 'GBPUSD',
      type: TradeType.SELL,
      entryPrice: 1.2650,
      exitPrice: 1.2580,
      sl: 1.2700,
      tp: 1.2550,
      lotSize: 0.05,
      profit: 35.00,
      status: TradeStatus.CLOSED,
      setup: 'AURUM Scalping',
      openedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      userId: adminUser.id,
      symbol: 'XAUUSD',
      type: TradeType.BUY,
      entryPrice: 2040.50,
      exitPrice: null,
      sl: 2030.00,
      tp: 2060.00,
      lotSize: 0.01,
      profit: null,
      status: TradeStatus.OPEN,
      setup: 'AURUM Gold Strategy',
      openedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      closedAt: null,
    },
  ];

  await prisma.trade.createMany({
    data: sampleTrades,
  });

  console.log('💹 Trades de ejemplo creados');

  console.log('🎉 Seeding completado exitosamente!');
  console.log('');
  console.log('🔐 CREDENCIALES DE ACCESO:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👑 SUPER ADMIN:');
  console.log(`   Email: ${superAdminEmail}`);
  console.log(`   Password: ${superAdminPassword}`);
  console.log('');
  console.log('👤 TRADER DEMO:');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('⚠️  IMPORTANTE: Cambia estas passwords después del primer login!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });