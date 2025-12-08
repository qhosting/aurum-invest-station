const fs = require('fs');
const path = require('path');

console.log('🔧 Ultimate fix: Direct import modification...');

// Modify imports to use correct paths
function modifyImports() {
  console.log('🔧 Modifying imports to use correct paths...');
  
  function processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // For files in app directory
      if (filePath.includes('/app/')) {
        // @/lib/validations -> ../../lib/validations (app -> src -> lib)
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, '../../lib/validations');
          modified = true;
          console.log(`✅ Fixed validations import in: ${filePath}`);
        }
        // @/lib/utils -> ../../lib/utils (app -> src -> lib)
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, '../../lib/utils');
          modified = true;
          console.log(`✅ Fixed utils import in: ${filePath}`);
        }
      }
      // For files in components directory
      else if (filePath.includes('/components/')) {
        // @/lib/validations -> ../../lib/validations (components -> src -> lib)
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, '../../lib/validations');
          modified = true;
          console.log(`✅ Fixed validations import in: ${filePath}`);
        }
        // @/lib/utils -> ../../lib/utils (components -> src -> lib)
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, '../../lib/utils');
          modified = true;
          console.log(`✅ Fixed utils import in: ${filePath}`);
        }
      }
      // For other files
      else {
        // @/lib/validations -> ./lib/validations
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, './lib/validations');
          modified = true;
          console.log(`✅ Fixed validations import in: ${filePath}`);
        }
        // @/lib/utils -> ./lib/utils
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, './lib/utils');
          modified = true;
          console.log(`✅ Fixed utils import in: ${filePath}`);
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`📝 Updated: ${filePath}`);
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
  console.log('🚀 Starting ultimate Docker build fix...');
  
  try {
    // Verify src structure
    console.log('📁 Verifying src structure...');
    if (fs.existsSync('src')) {
      const srcContents = fs.readdirSync('src');
      console.log('✅ src/ directory contents:', srcContents);
    } else {
      console.log('❌ src/ directory not found');
      process.exit(1);
    }
    
    if (fs.existsSync('src/lib')) {
      const libContents = fs.readdirSync('src/lib');
      console.log('✅ src/lib/ directory contents:', libContents);
    } else {
      console.log('❌ src/lib/ directory not found');
      process.exit(1);
    }
    
    // Modify imports
    modifyImports();
    
    console.log('🎉 Ultimate Docker build fix completed!');
    
  } catch (error) {
    console.error('❌ Error during ultimate fix:', error.message);
    process.exit(1);
  }
}

main();