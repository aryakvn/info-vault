#!/bin/bash

# Deploy Check Script for InfoVault
# This script helps verify the build process before deployment

set -e

echo "🚀 InfoVault Deploy Check"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check npm version
NPM_VERSION=$(npm --version)
echo "📦 npm version: $NPM_VERSION"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/ node_modules/

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Run tests (if available)
if npm run test 2>/dev/null; then
    echo "✅ Tests passed"
else
    echo "⚠️  No tests found or tests failed"
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output directory: dist/"
    echo "📊 Build size:"
    du -sh dist/
    
    # List main files
    echo "📋 Main files:"
    ls -la dist/
    
    # Check for critical files
    if [ -f "dist/index.html" ]; then
        echo "✅ index.html found"
    else
        echo "❌ index.html missing"
    fi
    
    if [ -d "dist/assets" ]; then
        echo "✅ assets directory found"
        echo "📊 Assets:"
        ls -la dist/assets/
    else
        echo "❌ assets directory missing"
    fi
    
else
    echo "❌ Build failed or dist directory is empty"
    exit 1
fi

# Check PWA files
echo "🔍 Checking PWA files..."
if [ -f "public/manifest.json" ]; then
    echo "✅ manifest.json found"
else
    echo "❌ manifest.json missing"
fi

if [ -f "public/sw.js" ]; then
    echo "✅ service-worker.js found"
else
    echo "❌ service-worker.js missing"
fi

# Check for common issues
echo "🔍 Checking for common issues..."

# Check if all components are imported
if grep -q "import.*from.*components" src/App.vue; then
    echo "✅ Component imports found"
else
    echo "⚠️  No component imports found in App.vue"
fi

# Check if service worker is registered
if grep -q "serviceWorker.register" index.html; then
    echo "✅ Service worker registration found"
else
    echo "❌ Service worker registration missing"
fi

echo ""
echo "🎉 Deploy check completed!"
echo ""
echo "Next steps:"
echo "1. Push your changes to trigger GitHub Actions"
echo "2. Check the Actions tab for deployment status"
echo "3. Verify your app is accessible at the deployed URL"
echo ""
echo "For manual deployment to pages branch:"
echo "git checkout -b pages"
echo "git add dist/*"
echo "git commit -m 'Deploy to pages branch'"
echo "git push origin pages"
