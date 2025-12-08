const fs = require('fs');
const path = require('path');

console.log('🔧 Starting import fix for Docker build...');

// Function to calculate relative path from source file to target
function getRelativePath(fromPath, toPath) {
  const fromDir = path.dirname(fromPath);
  const toFile = toPath.replace(/^\.\/src\//, 'src/');
  
  // Handle lib files
  if (toFile.startsWith('src/lib/')) {
    const relativeFromSrc = fromPath.replace(/^\.\/src\//, 'src/');
    const targetFromSrc = toFile;
    
    if (relativeFromSrc.startsWith('src/app/')) {
      // Files in src/app need to go up to src and then to lib
      const appDir = relativeFromSrc.replace(/^src\/app\/.*$/, 'src');
      return path.relative(path.dirname(appDir + '/' + path.basename(fromPath)), targetFromSrc);
    } else if (relativeFromSrc.startsWith('src/components/')) {
      // Files in src/components need to go up to src and then to lib
      const relative = path.relative(path.dirname('src/components/' + path.basename(fromPath)), targetFromSrc);
      return './' + relative;
    }
  }
  
  return toFile;
}

// Function to fix imports in a single file
function fixFileImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let newContent = content;

    // Replace @/lib/validations imports
    if (newContent.includes('@/lib/validations')) {
      newContent = newContent.replace(/from\s+["']@\/lib\/validations["']/g, 'from "./lib/validations"');
      newContent = newContent.replace(/import\s*\(["']@\/lib\/validations["']\)/g, 'import("./lib/validations")');
      modified = true;
      console.log(`✅ Fixed @/lib/validations in ${filePath}`);
    }

    // Replace @/lib/utils imports
    if (newContent.includes('@/lib/utils')) {
      newContent = newContent.replace(/from\s+["']@\/lib\/utils["']/g, 'from "./lib/utils"');
      newContent = newContent.replace(/import\s*\(["']@\/lib\/utils["']\)/g, 'import("./lib/utils")');
      modified = true;
      console.log(`✅ Fixed @/lib/utils in ${filePath}`);
    }

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to recursively process directory
function processDirectory(dir) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!item.startsWith('.') && item !== 'node_modules') {
          processDirectory(itemPath);
        }
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        fixFileImports(itemPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing directory ${dir}:`, error.message);
  }
}

// Main execution
console.log('📁 Processing src directory...');
processDirectory('src');

console.log('🎉 Import fixing completed!');