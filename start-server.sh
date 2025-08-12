#!/bin/bash

echo "🚀 Starting AI Teddy Bear Companion Server..."
echo ""

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 server.py
elif command -v python &> /dev/null; then
    python server.py
else
    echo "❌ Python is not installed or not in PATH"
    echo "💡 Please install Python 3.6+ and try again"
    exit 1
fi