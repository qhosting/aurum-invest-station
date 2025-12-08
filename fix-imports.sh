#!/bin/bash
# fix-imports.sh - Temporary fix for Docker path resolution

echo "Fixing imports for Docker build..."

# Backup original files
cp src/lib/validations.ts src/lib/validations.ts.backup
cp src/lib/utils.ts src/lib/utils.ts.backup

# Replace @ imports with relative paths in critical files
find src/ -name "*.tsx" -o -name "*.ts" | while read file; do
  if grep -q "@/lib/validations" "$file"; then
    sed -i 's|@/lib/validations|../lib/validations|g' "$file"
  fi
  if grep -q "@/lib/utils" "$file"; then
    sed -i 's|@/lib/utils|../lib/utils|g' "$file"
  fi
done

# Replace @ imports in the lib files themselves
sed -i 's|@/lib/validations|./validations|g' src/lib/utils.ts
sed -i 's|@/lib/utils|./utils|g' src/lib/validations.ts

echo "Imports fixed. Running build..."
npm run build

# Restore original files after build
cp src/lib/validations.ts.backup src/lib/validations.ts
cp src/lib/utils.ts.backup src/lib/utils.ts

# Restore all other files
find src/ -name "*.tsx" -o -name "*.ts" | while read file; do
  if [ -f "$file.backup" ]; then
    cp "$file.backup" "$file"
    rm "$file.backup"
  fi
done

echo "Build complete. Files restored."