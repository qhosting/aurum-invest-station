const fs = require('fs');
const path = require('path');

console.log('🔧 Simple import fix for Docker build...');

// Simple and direct replacement approach
function simpleFixImports() {
  console.log('📁 Scanning for TypeScript files...');
  
  // Find all TS/TSX files recursively
  function findTsFiles(dir) {
    const files = fs.readdirSync(dir);
    const tsFiles = [];
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!file.startsWith('.') && file !== 'node_modules') {
          tsFiles.push(...findTsFiles(filePath));
        }
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        tsFiles.push(filePath);
      }
    }
    
    return tsFiles;
  }
  
  const allTsFiles = findTsFiles('src');
  console.log(`📄 Found ${allTsFiles.length} TypeScript files`);
  
  let fixedCount = 0;
  
  allTsFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;
      let fileModified = false;
      
      // Replace @/lib/validations with relative path
      if (newContent.includes('@/lib/validations')) {
        // For app files, use ../../../lib/validations (app -> src -> lib)
        if (filePath.includes('/app/')) {
          newContent = newContent.replace(/@\/lib\/validations/g, '../../../lib/validations');
        }
        // For component files, use ../../lib/validations (components -> src -> lib)
        else if (filePath.includes('/components/')) {
          newContent = newContent.replace(/@\/lib\/validations/g, '../../lib/validations');
        }
        // For other files, use ../lib/validations
        else {
          newContent = newContent.replace(/@\/lib\/validations/g, '../lib/validations');
        }
        fileModified = true;
      }
      
      // Replace @/lib/utils with relative path
      if (newContent.includes('@/lib/utils')) {
        // For app files, use ../../../lib/utils (app -> src -> lib)
        if (filePath.includes('/app/')) {
          newContent = newContent.replace(/@\/lib\/utils/g, '../../../lib/utils');
        }
        // For component files, use ../../lib/utils (components -> src -> lib)
        else if (filePath.includes('/components/')) {
          newContent = newContent.replace(/@\/lib\/utils/g, '../../lib/utils');
        }
        // For other files, use ../lib/utils
        else {
          newContent = newContent.replace(/@\/lib\/utils/g, '../lib/utils');
        }
        fileModified = true;
      }
      
      if (fileModified) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        fixedCount++;
        console.log(`✅ Fixed: ${filePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`🎉 Fixed imports in ${fixedCount} files!`);
}

simpleFixImports();