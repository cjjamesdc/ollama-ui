# Charlie Llama 🦙 - Changelog

## Version 2.1 - Bug Fixes & Improvements (Nov 4, 2024)

### 🐛 Bug Fixes
- ✅ Fixed parameter type conversion (num_predict, temperature, top_p, repeat_penalty)
  - HTML sliders now properly convert string values to numbers/floats
  - Ollama API now receives correct data types for parameters
- ✅ Fixed auto-redirect from file:// protocol to http://localhost:8000
  - App now automatically serves via HTTP server when opened as local file
- ✅ Fixed model selection validation
  - App now validates that saved models still exist
  - Falls back to first available model if saved model is missing
- ✅ Improved error messages with detailed API response logging

### 🎨 Design Updates
- ✅ Removed Prism.js syntax highlighting (caused light mode visibility issues)
- ✅ Switched to custom CSS for code blocks using design-system colors
- ✅ Fixed user message box color from #D8E8ED to #E8E4D5 (warm theme match)
- ✅ Removed duplicate export button from header

### 💾 Chat Persistence
- ✅ Implemented localStorage-based chat saving
- ✅ Added sidebar "Save This Chat" button
- ✅ Saved chats list with title, model, and date
- ✅ Editable chat titles (click title or pencil icon to rename)
- ✅ Auto-save to sidebar after renaming
- ✅ Max 50 chats stored automatically

### 📊 Dynamic Token Limits
- ✅ Added modelTokenLimits object with 30+ Ollama models
- ✅ Token slider max updates based on selected model
- ✅ Intelligent model matching (exact + partial match fallback)
- ✅ Display shows "Maximum: X tokens (modelname)"

---

## Version 2.0 - Enhanced Edition (Nov 4, 2024)

### 🎨 Branding
- ✅ Renamed to "Charlie Llama" with 🦙 logo
- ✅ Added tagline: "Your personal AI companion"
- ✅ Updated all UI text and export filenames
- ✅ Professional warm color palette

### 🚀 Quick Win Features Added
1. **Chat Search & Filter**
   - Search box in sidebar
   - Real-time filtering of chat history

2. **Prompt Templates Library**
   - 6 pre-built templates (Code Helper, Tutor, Writer, etc.)
   - Quick-select dropdown in System Prompt section

3. **Message Action Buttons**
   - Copy button (all messages) - 📋
   - Regenerate button (AI messages) - 🔄
   - Edit button (user messages) - ✏️
   - Hover to reveal

### 🎨 Design Improvements
- ✅ Fixed syntax highlighting for light mode
- ✅ GitHub-style colors in light mode (high contrast)
- ✅ Dark mode uses Prism Tomorrow theme
- ✅ Changed export icon from 📤 to 💾

### 📁 Project Structure
- `ollama-ui-enhanced.html` - Main enhanced version
- `ollama-ui.html` - Original backup
- `saved-chats/` - Folder for exported chats
- `design-system.css` - Eye-strain friendly styling
- `FEATURE_ROADMAP.md` - Future feature ideas
- `README.md` - Documentation

### 🔧 Technical Details
- Integrated Prism.js for syntax highlighting
- Custom CSS overrides for dual-theme support
- localStorage for state persistence
- All features work client-side (no backend needed)

### 📊 Complete Feature List
- Model selection (dynamic from Ollama)
- Token counter with speed metrics
- Theme toggle (light/dark)
- Font size adjustment (Cmd +/-)
- Export (Markdown & JSON)
- System prompt editor with templates
- Settings modal with parameter sliders
- Keyboard shortcuts (Cmd+K, Cmd+N, Cmd+,)
- Code syntax highlighting (dual-theme)
- Chat search
- Message actions (copy/regenerate/edit)
- Auto-save conversations
- Responsive design

---

## Next Steps (See FEATURE_ROADMAP.md)
- Chat history sidebar with thumbnails
- Model comparison mode
- Multi-format export (PDF, HTML)
- Prompt engineering toolkit
