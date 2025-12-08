#!/bin/bash

# Force commit to trigger clean deployment
git add .
git commit -m "trigger: force clean dependencies deployment

This commit forces EasyPanel to clean its dependency cache
and install the correct @next-auth/prisma-adapter package
instead of the previous @auth/prisma-adapter that was causing
TypeScript type conflicts.

Changes:
- Added clean-install script to package.json
- Forces cache invalidation on deployment"

git push origin master
