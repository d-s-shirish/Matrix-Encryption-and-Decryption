#!/usr/bin/env python3
"""
Simple HTTP server for the AI Teddy Bear project.
This script starts a local server to serve the teddy bear website.
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

def main():
    # Configuration
    PORT = 8000
    DIRECTORY = Path(__file__).parent
    
    # Change to the project directory
    os.chdir(DIRECTORY)
    
    # Create server
    Handler = http.server.SimpleHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", PORT), Handler) as httpd:
            print("=" * 60)
            print("🤖 AI Teddy Bear Server")
            print("=" * 60)
            print(f"📁 Serving from: {DIRECTORY}")
            print(f"🌐 Server running at: http://localhost:{PORT}")
            print(f"📄 Main page: http://localhost:{PORT}/index.html")
            print(f"✨ Enhanced version: http://localhost:{PORT}/enhanced.html")
            print("=" * 60)
            print("💡 Tips:")
            print("   • Allow microphone access when prompted")
            print("   • Use Chrome/Edge for best speech recognition")
            print("   • Click 'Start Listening' to talk to Teddy")
            print("   • Press Ctrl+C to stop the server")
            print("=" * 60)
            
            # Try to open the browser automatically
            try:
                webbrowser.open(f'http://localhost:{PORT}/index.html')
                print("🚀 Opening browser automatically...")
            except:
                print("📋 Please open your browser and go to:")
                print(f"   http://localhost:{PORT}/index.html")
            
            print("\n🎯 Server started! Press Ctrl+C to stop.\n")
            
            # Start the server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user.")
        print("👋 Thanks for using AI Teddy Bear!")
        
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use!")
            print(f"💡 Try using a different port or stop the existing server.")
            print(f"🔧 Alternative: python server.py --port {PORT + 1}")
        else:
            print(f"❌ Error starting server: {e}")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # Check for command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("AI Teddy Bear Server")
        print("Usage: python server.py [--port PORT]")
        print("Default port: 8000")
        sys.exit(0)
    
    main()