#!/bin/bash

# PodBrief Deployment Script
# This script helps you deploy PodBrief to your server

set -e

echo "🚀 PodBrief Deployment Script"
echo "=============================="

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "❌ Environment file not found!"
    echo "Please create server/.env file with your OpenAI API key:"
    echo ""
    echo "PORT=5000"
    echo "OPENAI_API_KEY=your_openai_api_key_here"
    echo "NODE_ENV=production"
    echo ""
    echo "You can copy from server/env.example"
    exit 1
fi

# Check if OpenAI API key is set
if ! grep -q "OPENAI_API_KEY=" server/.env; then
    echo "❌ OPENAI_API_KEY not found in server/.env"
    echo "Please add your OpenAI API key to server/.env"
    exit 1
fi

echo "✅ Environment configuration found"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Build the application
echo "🔨 Building the application..."
cd client && npm run build && cd ..

# Start the application
echo "🚀 Starting PodBrief..."
echo ""
echo "The application will be available at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:5000"
echo "  - Health Check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Start the development servers
npm run dev 