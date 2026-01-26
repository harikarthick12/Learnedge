#!/bin/bash
# Render build script for the backend

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building NestJS application..."
npm run build

echo "Build complete!"
