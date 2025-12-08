const fs = require('fs');
const path = require('path');

console.log('🔧 Radical fix: Direct file modification...');

// Read original lib files
function getOriginalLibs() {
  let validationsContent = '';
  let utilsContent = '';
  
  try {
    if (fs.existsSync('src/lib/validations.ts')) {
      validationsContent = fs.readFileSync('src/lib/validations.ts', 'utf8');
      console.log('✅ Loaded validations.ts');
    }
    
    if (fs.existsSync('src/lib/utils.ts')) {
      utilsContent = fs.readFileSync('src/lib/utils.ts', 'utf8');
      console.log('✅ Loaded utils.ts');
    }
    
  } catch (error) {
    console.error('❌ Error loading lib files:', error.message);
  }
  
  return { validationsContent, utilsContent };
}

// Create local lib files with all necessary content
function createLocalLibs(validationsContent, utilsContent) {
  console.log('📁 Creating local lib files...');
  
  // Create directories
  const dirs = ['src/app/lib', 'src/components/lib'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  });
  
  // Create validations.ts in both locations
  if (validationsContent) {
    const appValidationsPath = 'src/app/lib/validations.ts';
    const componentsValidationsPath = 'src/components/lib/validations.ts';
    
    fs.writeFileSync(appValidationsPath, validationsContent);
    fs.writeFileSync(componentsValidationsPath, validationsContent);
    
    console.log(`✅ Created: ${appValidationsPath}`);
    console.log(`✅ Created: ${componentsValidationsPath}`);
  }
  
  // Create utils.ts in both locations
  if (utilsContent) {
    const appUtilsPath = 'src/app/lib/utils.ts';
    const componentsUtilsPath = 'src/components/lib/utils.ts';
    
    fs.writeFileSync(appUtilsPath, utilsContent);
    fs.writeFileSync(componentsUtilsPath, utilsContent);
    
    console.log(`✅ Created: ${appUtilsPath}`);
    console.log(`✅ Created: ${componentsUtilsPath}`);
  }
}

// Fix imports in all files
function fixAllImports() {
  console.log('🔧 Fixing imports...');
  
  function processFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Replace @/lib/validations with ./lib/validations
      if (content.includes('@/lib/validations')) {
        content = content.replace(/@\/lib\/validations/g, './lib/validations');
        modified = true;
        console.log(`✅ Fixed validations import in: ${filePath}`);
      }
      
      // Replace @/lib/utils with ./lib/utils
      if (content.includes('@/lib/utils')) {
        content = content.replace(/@\/lib\/utils/g, './lib/utils');
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
  console.log('🚀 Starting radical Docker build fix...');
  
  try {
    // Step 1: Get original lib content
    const { validationsContent, utilsContent } = getOriginalLibs();
    
    // Step 2: Create local lib files
    createLocalLibs(validationsContent, utilsContent);
    
    // Step 3: Fix imports
    fixAllImports();
    
    console.log('🎉 Radical Docker build fix completed!');
    
  } catch (error) {
    console.error('❌ Error during radical fix:', error.message);
    process.exit(1);
  }
}

main();