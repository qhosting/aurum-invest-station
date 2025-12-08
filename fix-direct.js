const fs = require('fs');
const path = require('path');

console.log('🔧 Direct import fix for Docker build...');

// Create lib directories and copy files
function createLocalLibStructure() {
  console.log('📁 Creating local lib structure...');
  
  // Create directories
  const dirs = ['src/app/lib', 'src/components/lib'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
  
  // Copy files
  const files = [
    { src: 'src/lib/validations.ts', dest: 'src/app/lib/validations.ts' },
    { src: 'src/lib/utils.ts', dest: 'src/app/lib/utils.ts' },
    { src: 'src/lib/validations.ts', dest: 'src/components/lib/validations.ts' },
    { src: 'src/lib/utils.ts', dest: 'src/components/lib/utils.ts' }
  ];
  
  files.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied: ${src} -> ${dest}`);
    }
  });
}

// Fix all imports to use local lib paths
function fixAllImports() {
  console.log('🔧 Fixing all imports...');
  
  function processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // For files in app directory
      if (filePath.includes('/app/')) {
        // Replace @/lib/validations with ./lib/validations
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, './lib/validations');
          modified = true;
          console.log(`✅ Fixed @/lib/validations in ${filePath}`);
        }
        // Replace @/lib/utils with ./lib/utils
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, './lib/utils');
          modified = true;
          console.log(`✅ Fixed @/lib/utils in ${filePath}`);
        }
      }
      // For files in components directory
      else if (filePath.includes('/components/')) {
        // Replace @/lib/validations with ./lib/validations
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, './lib/validations');
          modified = true;
          console.log(`✅ Fixed @/lib/validations in ${filePath}`);
        }
        // Replace @/lib/utils with ./lib/utils
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, './lib/utils');
          modified = true;
          console.log(`✅ Fixed @/lib/utils in ${filePath}`);
        }
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
  console.log('🚀 Starting direct Docker build fix...');
  
  try {
    // Step 1: Create local lib structure
    createLocalLibStructure();
    
    // Step 2: Fix all imports
    fixAllImports();
    
    console.log('🎉 Direct Docker build fix completed!');
    
  } catch (error) {
    console.error('❌ Error during build fix:', error.message);
    process.exit(1);
  }
}

main();