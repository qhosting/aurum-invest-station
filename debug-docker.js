const fs = require('fs');
const path = require('path');

console.log('🔍 Docker Build Debug Script');
console.log('=====================================');

// Check current working directory
console.log('📍 Current working directory:', process.cwd());

// Check if src directory exists
console.log('\n📁 Checking src directory...');
if (fs.existsSync('src')) {
  console.log('✅ src directory exists');
  
  const srcContents = fs.readdirSync('src');
  console.log('📋 src directory contents:', srcContents);
  
  // Check for lib directory
  if (fs.existsSync('src/lib')) {
    console.log('✅ src/lib directory exists');
    const libContents = fs.readdirSync('src/lib');
    console.log('📋 src/lib contents:', libContents);
  } else {
    console.log('❌ src/lib directory does NOT exist');
  }
  
  // Check for app directory
  if (fs.existsSync('src/app')) {
    console.log('✅ src/app directory exists');
    const appContents = fs.readdirSync('src/app');
    console.log('📋 src/app contents:', appContents);
    
    // Check for app/lib directory
    if (fs.existsSync('src/app/lib')) {
      console.log('✅ src/app/lib directory exists');
      const appLibContents = fs.readdirSync('src/app/lib');
      console.log('📋 src/app/lib contents:', appLibContents);
    } else {
      console.log('❌ src/app/lib directory does NOT exist');
    }
  } else {
    console.log('❌ src/app directory does NOT exist');
  }
  
  // Check for components directory
  if (fs.existsSync('src/components')) {
    console.log('✅ src/components directory exists');
    const componentsContents = fs.readdirSync('src/components');
    console.log('📋 src/components contents:', componentsContents);
    
    // Check for components/lib directory
    if (fs.existsSync('src/components/lib')) {
      console.log('✅ src/components/lib directory exists');
      const compLibContents = fs.readdirSync('src/components/lib');
      console.log('📋 src/components/lib contents:', compLibContents);
    } else {
      console.log('❌ src/components/lib directory does NOT exist');
    }
  } else {
    console.log('❌ src/components directory does NOT exist');
  }
} else {
  console.log('❌ src directory does NOT exist');
}

// Check if fix-ultra.js exists
console.log('\n🔧 Checking fix-ultra.js...');
if (fs.existsSync('fix-ultra.js')) {
  console.log('✅ fix-ultra.js exists');
  const stats = fs.statSync('fix-ultra.js');
  console.log('📊 fix-ultra.js size:', stats.size, 'bytes');
  console.log('📅 fix-ultra.js modified:', stats.mtime);
} else {
  console.log('❌ fix-ultra.js does NOT exist');
}

// Check for .dockerignore
console.log('\n🚫 Checking .dockerignore...');
if (fs.existsSync('.dockerignore')) {
  console.log('✅ .dockerignore exists');
  const dockerignoreContent = fs.readFileSync('.dockerignore', 'utf8');
  console.log('📋 .dockerignore contents:');
  console.log(dockerignoreContent);
} else {
  console.log('ℹ️ .dockerignore does not exist (this is normal)');
}

console.log('\n🏁 Debug script completed.');