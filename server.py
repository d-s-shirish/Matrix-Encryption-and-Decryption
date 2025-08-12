#!/usr/bin/env python3
"""
Simple HTTP server for the AI Teddy Bear Companion project.
Run this script to serve the website locally.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def main():
    # Set the port
    PORT = 8000
    
    # Change to the directory containing this script
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Create the server
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print(f"🚀 AI Teddy Bear Companion server starting...")
            print(f"📁 Serving files from: {script_dir}")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"📱 Open your browser and navigate to the URL above")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}')
                print("✅ Browser opened automatically!")
            except:
                print("⚠️  Could not open browser automatically. Please open it manually.")
            
            # Start the server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print(f"💡 Try using a different port or stop the process using port {PORT}")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()