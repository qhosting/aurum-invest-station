const fs = require('fs');
const path = require('path');

console.log('🔧 Ultra fix: Inline content creation...');

// Inline content for lib files
const VALIDATIONS_CONTENT = `import { z } from "zod"

// User schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "TRADER"]).default("TRADER"),
})

// Trade schemas
export const createTradeSchema = z.object({
  symbol: z.string().min(1, "Symbol is required"),
  type: z.enum(["BUY", "SELL"]),
  entryPrice: z.number().positive("Entry price must be positive"),
  exitPrice: z.number().positive().optional(),
  sl: z.number().positive("Stop loss must be positive"),
  tp: z.number().positive("Take profit must be positive"),
  lotSize: z.number().positive("Lot size must be positive"),
  profit: z.number().optional(),
  status: z.enum(["OPEN", "CLOSED"]).default("OPEN"),
  setup: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
})

export const updateTradeSchema = z.object({
  symbol: z.string().min(1).optional(),
  type: z.enum(["BUY", "SELL"]).optional(),
  entryPrice: z.number().positive().optional(),
  exitPrice: z.number().positive().optional(),
  sl: z.number().positive().optional(),
  tp: z.number().positive().optional(),
  lotSize: z.number().positive().optional(),
  profit: z.number().optional(),
  status: z.enum(["OPEN", "CLOSED"]).optional(),
  setup: z.string().optional(),
  screenshotUrl: z.string().url().optional(),
})

// Journal Metric schemas
export const createJournalMetricSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  date: z.date(),
  balance: z.number(),
  equity: z.number(),
})

// MT5 Webhook schemas
export const mt5WebhookSchema = z.object({
  symbol: z.string().min(1),
  action: z.enum(["OPEN", "CLOSE"]),
  price: z.number().positive(),
  sl: z.number().positive(),
  tp: z.number().positive(),
  profit: z.number().optional(),
  lotSize: z.number().positive().default(0.01),
  type: z.enum(["BUY", "SELL"]).optional(),
  setup: z.string().optional(),
})

// Dashboard metrics schemas
export const dashboardMetricsSchema = z.object({
  totalBalance: z.number(),
  winRate: z.number().min(0).max(100),
  relativeDrawdown: z.number(),
  dailyPnL: z.number(),
  totalTrades: z.number().int().nonnegative(),
  profitFactor: z.number().positive(),
  maxDrawdown: z.number().negative(),
  riskRewardRatio: z.number().positive(),
})

// Equity data schemas
export const equityDataPointSchema = z.object({
  date: z.string(),
  equity: z.number(),
  balance: z.number(),
})

// API Response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const tradeListResponseSchema = apiResponseSchema.extend({
  data: z.array(z.object({
    id: z.string(),
    symbol: z.string(),
    type: z.enum(["BUY", "SELL"]),
    entryPrice: z.number(),
    exitPrice: z.number().nullable(),
    sl: z.number().nullable(),
    tp: z.number().nullable(),
    lotSize: z.number(),
    profit: z.number().nullable(),
    status: z.enum(["OPEN", "CLOSED"]),
    setup: z.string().nullable(),
    screenshotUrl: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
})`;

const UTILS_CONTENT = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

// Create lib directories and files
function createLibFiles() {
  console.log('📁 Creating lib directories and files...');
  
  // Create directories
  const dirs = ['src/lib', 'src/app/lib', 'src/components/lib'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Create original lib files
  fs.writeFileSync('src/lib/validations.ts', VALIDATIONS_CONTENT);
  fs.writeFileSync('src/lib/utils.ts', UTILS_CONTENT);
  console.log('✅ Created: src/lib/validations.ts');
  console.log('✅ Created: src/lib/utils.ts');
  
  // Create local lib files
  const localFiles = [
    { path: 'src/app/lib/validations.ts', content: VALIDATIONS_CONTENT },
    { path: 'src/app/lib/utils.ts', content: UTILS_CONTENT },
    { path: 'src/components/lib/validations.ts', content: VALIDATIONS_CONTENT },
    { path: 'src/components/lib/utils.ts', content: UTILS_CONTENT }
  ];
  
  localFiles.forEach(({ path: filePath, content }) => {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  });
}

// Fix imports in all files
function fixAllImports() {
  console.log('🔧 Fixing imports...');
  
  function processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Replace @/lib/validations with relative paths
      if (content.includes('@/lib/validations')) {
        if (filePath.includes('/app/')) {
          content = content.replace(/@\/lib\/validations/g, './lib/validations');
        } else if (filePath.includes('/components/')) {
          content = content.replace(/@\/lib\/validations/g, './lib/validations');
        } else {
          content = content.replace(/@\/lib\/validations/g, '../lib/validations');
        }
        modified = true;
        console.log(`✅ Fixed validations import in: ${filePath}`);
      }
      
      // Replace @/lib/utils with relative paths
      if (content.includes('@/lib/utils')) {
        if (filePath.includes('/app/')) {
          content = content.replace(/@\/lib\/utils/g, './lib/utils');
        } else if (filePath.includes('/components/')) {
          content = content.replace(/@\/lib\/utils/g, './lib/utils');
        } else {
          content = content.replace(/@\/lib\/utils/g, '../lib/utils');
        }
        modified = true;
        console.log(`✅ Fixed utils import in: ${filePath}`);
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  // Find and process all TS/TSX files
  function findTsFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          findTsFiles(filePath);
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        processFile(filePath);
      }
    }
  }
  
  findTsFiles('src');
}

// Main execution
function main() {
  console.log('🚀 Starting ultra Docker build fix...');
  
  try {
    // Step 1: Create lib files with inline content
    createLibFiles();
    
    // Step 2: Fix imports
    fixAllImports();
    
    console.log('🎉 Ultra Docker build fix completed!');
    
  } catch (error) {
    console.error('❌ Error during ultra fix:', error.message);
    process.exit(1);
  }
}

main();