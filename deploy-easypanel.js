const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying commit 579864d to EasyPanel...');

// Configuration
const REPO_URL = 'https://github.com/qhosting/aurum-invest-station.git';
const COMMIT_SHA = '579864d';
const TARGET_BRANCH = 'master';

console.log(`📋 Deployment Configuration:`);
console.log(`   Repository: ${REPO_URL}`);
console.log(`   Commit: ${COMMIT_SHA}`);
console.log(`   Branch: ${TARGET_BRANCH}`);

// Verify we're in the right directory
if (!fs.existsSync('.git')) {
  console.log('❌ Error: Not in a git repository');
  process.exit(1);
}

// Check current commit
try {
  const currentCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  console.log(`📍 Current commit: ${currentCommit}`);
  
  if (currentCommit !== COMMIT_SHA) {
    console.log(`⚠️  Warning: Current commit doesn't match target commit`);
    console.log(`   Expected: ${COMMIT_SHA}`);
    console.log(`   Current:  ${currentCommit}`);
    console.log(`   Switching to target commit...`);
    
    execSync(`git checkout ${COMMIT_SHA}`, { stdio: 'inherit' });
    console.log(`✅ Switched to commit ${COMMIT_SHA}`);
  } else {
    console.log(`✅ Already on target commit ${COMMIT_SHA}`);
  }
} catch (error) {
  console.error('❌ Error checking current commit:', error.message);
  process.exit(1);
}

// Clean up any existing temporary files
function cleanup() {
  console.log('🧹 Cleaning up temporary files...');
  
  const tempDirs = ['src/app/lib', 'src/components/lib'];
  tempDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`✅ Removed: ${dir}`);
    }
  });
  
  const tempFiles = ['fix-docker-build.js'];
  tempFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`✅ Removed: ${file}`);
    }
  });
}

// Perform cleanup
cleanup();

console.log('🎉 Deployment preparation completed!');
console.log('');
console.log('📋 Next Steps:');
console.log('1. Go to your EasyPanel dashboard');
console.log('2. Navigate to your AURUM INVEST STATION project');
console.log('3. Click "Deploy" or "Redeploy"');
console.log('4. The system will automatically pull the latest changes from the master branch');
console.log('5. The Docker build will use the fixed commit 579864d');
console.log('');
console.log('🔧 What was fixed in commit 579864d:');
console.log('   ✅ Removed invalid TypeScript ESLint rules from .eslintrc.js');
console.log('   ✅ Fixed ESLint configuration to work with Next.js core only');
console.log('   ✅ Resolved "Definition for rule was not found" errors');
console.log('');
console.log('📊 Expected Build Result:');
console.log('   - No more ESLint rule errors');
console.log('   - Successful compilation');
console.log('   - All module resolution issues resolved');
console.log('   - Clean deployment without warnings');