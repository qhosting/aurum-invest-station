const fs = require('fs');
const path = require('path');

console.log('🔧 Docker build fix: Creating temporary file structure...');

// Create lib directories in app and components
function createLibDirectories() {
  console.log('📁 Creating lib directories...');
  
  // Create lib dirs where needed
  const libDirs = [
    'src/app/lib',
    'src/components/lib'
  ];
  
  libDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created: ${dir}`);
    }
  });
  
  // Copy lib files to temporary locations
  const libFiles = [
    { src: 'src/lib/validations.ts', dest: 'src/app/lib/validations.ts' },
    { src: 'src/lib/validations.ts', dest: 'src/components/lib/validations.ts' },
    { src: 'src/lib/utils.ts', dest: 'src/app/lib/utils.ts' },
    { src: 'src/lib/utils.ts', dest: 'src/components/lib/utils.ts' }
  ];
  
  libFiles.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`✅ Copied: ${src} -> ${dest}`);
    } else {
      console.log(`⚠️  Source file not found: ${src}`);
    }
  });
}

// Fix imports in all TS/TSX files
function fixImports() {
  console.log('🔧 Fixing imports...');
  
  // Function to find and fix TS files
  function findAndFixFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          findAndFixFiles(filePath);
        }
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          let modified = false;
          
          // Fix imports based on location
          if (filePath.includes('/app/')) {
            // App files should use ./lib/validations and ./lib/utils
            if (content.includes('@/lib/validations')) {
              content = content.replace(/@\/lib\/validations/g, './lib/validations');
              modified = true;
            }
            if (content.includes('@/lib/utils')) {
              content = content.replace(/@\/lib\/utils/g, './lib/utils');
              modified = true;
            }
          } else if (filePath.includes('/components/')) {
            // Component files should use ./lib/validations and ./lib/utils
            if (content.includes('@/lib/validations')) {
              content = content.replace(/@\/lib\/validations/g, './lib/validations');
              modified = true;
            }
            if (content.includes('@/lib/utils')) {
              content = content.replace(/@\/lib\/utils/g, './lib/utils');
              modified = true;
            }
          }
          
          if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed imports in: ${filePath}`);
          }
          
        } catch (error) {
          console.error(`❌ Error processing ${filePath}:`, error.message);
        }
      }
    }
  }
  
  findAndFixFiles('src');
}

function main() {
  try {
    console.log('🚀 Starting Docker build preparation...');
    
    // Step 1: Create temporary lib directories
    createLibDirectories();
    
    // Step 2: Fix imports
    fixImports();
    
    console.log('🎉 Docker build preparation completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during build preparation:', error.message);
    process.exit(1);
  }
}

main();