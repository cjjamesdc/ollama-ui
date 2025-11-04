#!/bin/bash

# Start Ollama Chat Server
cd "$(dirname "$0")"
echo "Starting Ollama Chat Server on http://localhost:8000..."
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!
sleep 1

# Open in browser
open "http://localhost:8000/ollama-enhanced-by-G.html"

echo "Server running. Close this window to stop."
wait $SERVER_PID
