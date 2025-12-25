@echo off
REM Start Ollama Chat Server for Windows
cd /d "%~dp0"
echo Starting Ollama Chat Server on http://localhost:8000...
start "" "http://localhost:8000/ollama-enhanced-by-G.html"
python -m http.server 8000
