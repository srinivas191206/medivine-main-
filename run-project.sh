#!/bin/bash

echo "🏥 Health Horizon Profile UI - Starting Development Server"
echo "========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js first:"
    echo "  1. Visit https://nodejs.org/"
    echo "  2. Download and install the LTS version"
    echo "  3. Or use: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "npm should come with Node.js. Please reinstall Node.js."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Navigate to project directory
cd "$(dirname "$0")"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully!"
    echo ""
fi

echo "🚀 Starting development server..."
echo "📱 The app will open at: http://localhost:5173"
echo "🔐 Authentication features ready!"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the development server
npm run dev