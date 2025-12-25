#!/bin/bash

OUTPUT_FILE="ollama-enhanced-by-G.html"
BACKUP_FILE="ollama-enhanced-by-G.html.backup"
TEMP_FILE="/tmp/merged_ollama.html"

# Extract parts from ollama-by-glm.htm 
# Lines 1-6: HTML head
sed -n '1,10p' "ollama-by-glm.htm" > "$TEMP_FILE"

# Add style tag start
echo "    <style>" >> "$TEMP_FILE"

# Extract warm color theme from ollama-enhanced-by-G.html (lines 462-700)
sed -n '462,700p' "ollama-enhanced-by-G.html" | grep -v "^    <style>" | grep -v "^/\*" | head -240 >> "$TEMP_FILE"

# Extract modern UI CSS from ollama-by-glm.htm (lines 12-1600, skip their color variables)
sed -n '95,1600p' "ollama-by-glm.htm" | grep -v "^        /\* Professional color system" | grep -v "^        /\* Semantic colors" | grep -v "^        /\* Neutral palette" | grep -v "^            --primary-" | grep -v "^            --success:" | grep -v "^            --warning:" | grep -v "^            --error:" | grep -v "^            --info:" | grep -v "^            --gray-" | head -1500 >> "$TEMP_FILE"

# Close style and head 
echo "    </style>" >> "$TEMP_FILE"
echo "</head>" >> "$TEMP_FILE"

# Extract body structure from ollama-by-glm.htm (lines 1603-1950)
sed -n '1603,1950p' "ollama-by-glm.htm" >> "$TEMP_FILE"

# Extract complete JavaScript from ollama-enhanced-by-G.html (lines 1686 to end)
sed -n '1686,$p' "ollama-enhanced-by-G.html" >> "$TEMP_FILE"

echo "Merge complete! Temporary file created at: $TEMP_FILE"
ls -lh "$TEMP_FILE"

