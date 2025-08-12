#!/bin/bash

# AI Teddy Bear - Quick Start Script
# This script starts the local server for the AI Teddy Bear project

echo "🤖 AI Teddy Bear - Quick Start"
echo "=============================="

# Check if Python is available
if command -v python3 &> /dev/null; then
    echo "✅ Python 3 found"
    python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found"
    python server.py
else
    echo "❌ Python not found!"
    echo "Please install Python 3 to run this project."
    echo ""
    echo "Alternative methods:"
    echo "• python -m http.server 8000"
    echo "• npx http-server"
    echo "• php -S localhost:8000"
    exit 1
fi