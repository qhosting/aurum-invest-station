#!/usr/bin/env node

/**
 * Health Check Script for Aurora Invest Station
 * This script performs basic health checks on the application
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || 'localhost';

function checkHealth() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: '/api/health',
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Health check passed:', response);
          resolve(response);
        } catch (error) {
          console.log('⚠️ Health check response not JSON:', data);
          resolve({ status: 'unknown', message: 'Non-JSON response' });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Health check failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('❌ Health check timeout');
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
}

async function main() {
  console.log('🔍 Starting health check...');
  console.log(`📡 Checking ${HOST}:${PORT}/api/health`);

  try {
    const result = await checkHealth();
    process.exit(0);
  } catch (error) {
    console.error('💥 Health check failed:', error.message);
    process.exit(1);
  }
}

// Run health check if called directly
if (require.main === module) {
  main();
}

module.exports = { checkHealth };