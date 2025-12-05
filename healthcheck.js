// Health Check Script para Docker Container
// Verifica que la aplicación Next.js esté respondiendo correctamente

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 2000
};

const req = http.request(options, (res) => {
  console.log(`Health check status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    console.log('✅ Application is healthy');
    process.exit(0);
  } else {
    console.log(`❌ Application returned status: ${res.statusCode}`);
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.log(`❌ Health check failed: ${err.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Health check timeout');
  req.destroy();
  process.exit(1);
});

req.end();