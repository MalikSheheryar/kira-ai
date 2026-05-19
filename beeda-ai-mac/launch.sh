#!/bin/bash

# Beeda AI Launcher for macOS
# This script launches Beeda AI using Electron

echo "🚀 Starting Kira Ai..."

# Check if electron is installed
if command -v electron &> /dev/null; then
    echo "✅ Electron found, launching app..."
    electron electron/main.js
else
    echo "❌ Electron not found!"
    echo ""
    echo "Please install Electron first:"
    echo "  npm install -g electron"
    echo ""
    echo "Or open dist/index.html in your browser."
fi
