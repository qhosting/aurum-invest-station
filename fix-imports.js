const fs = require('fs')
const path = require('path')

// Fix imports for Docker build
function fixImports() {
  console.log('Fixing imports for Docker build...')
  
  // Files to fix
  const filesToFix = [
    'src/lib/validations.ts',
    'src/lib/utils.ts'
  ]
  
  // Replace @ imports with relative paths
  filesToFix.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8')
      
      // Fix @/lib imports in lib files
      content = content.replace(/@\/lib\/(\w+)/g, './$1')
      
      fs.writeFileSync(filePath, content)
      console.log(`Fixed: ${filePath}`)
    }
  })
  
  // Fix imports in all TS/TSX files
  const walkDir = (dir) => {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath)
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8')
        let modified = false
        
        // Replace @/lib imports
        if (content.includes('@/lib/validations')) {
          content = content.replace(/@\/lib\/validations/g, '../lib/validations')
          modified = true
        }
        if (content.includes('@/lib/utils')) {
          content = content.replace(/@\/lib\/utils/g, '../lib/utils')
          modified = true
        }
        
        if (modified) {
          fs.writeFileSync(filePath, content)
          console.log(`Fixed imports in: ${filePath}`)
        }
      }
    })
  }
  
  walkDir('src')
  
  console.log('Import fixes applied successfully')
}

fixImports()