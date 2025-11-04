#!/bin/bash

# Launch Ollama UI
# This script starts a local web server and opens the UI in your browser

echo "Starting Ollama UI..."
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Change to the script's directory
cd "$(dirname "$0")"

# Open browser after a short delay (gives server time to start)
(sleep 2 && open "http://localhost:8888/ollama-ui.html") &

# Start the web server
python3 -m http.server 8888
