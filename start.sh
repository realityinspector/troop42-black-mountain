#!/bin/sh
set -e

echo "=== Debug: directory listing ==="
ls -la /app/dist-server/ || echo "dist-server NOT FOUND"
echo "=== Debug: prisma client ==="
ls /app/node_modules/.prisma/client/ 2>/dev/null | head -5 || echo "prisma client NOT FOUND"
echo "=== Debug: node version ==="
node --version
echo "=== Running prisma db push ==="
npx prisma db push --skip-generate 2>&1
echo "=== Starting server ==="
exec node /app/dist-server/index.js 2>&1
