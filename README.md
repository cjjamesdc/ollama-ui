# Ollama GUI Template Package

Complete design system and feature roadmap for your Ollama GUI. Ready for Claude Code to fill in the blanks!

## 📦 What's Included

### 1. **design-system.css** - Complete Style Guide
- Eye-strain friendly color palette (light + dark mode)
- All UI components pre-styled
- Spacing, typography, and design tokens
- Just drop it in and use the classes!

### 2. **template.html** - HTML Structure
- Full page layout with sidebar, chat, input area
- All components wired up with IDs
- Settings modal included
- System prompt editor built-in
- Ready for your JavaScript logic

### 3. **app-template.js** - JavaScript Framework
- State management structure
- Event handlers for all buttons
- Export functions (Markdown & JSON)
- Theme switching
- Parameter sliders
- TODOs marked where you add your Ollama logic

### 4. **FEATURE_ROADMAP.md** - Implementation Plan
- Priority-ordered features
- Code examples for each feature
- Step-by-step implementation guide
- Best practices and tips

## 🚀 Quick Start

### Option 1: Start Fresh
```bash
# Copy all files to your project
cp design-system.css template.html app-template.js your-project/

# Rename template files
mv template.html index.html
mv app-template.js app.js

# Start building!
```

### Option 2: Integrate into Existing App

**Step 1: Add the CSS**
```html
<!-- Add to your <head> -->
<link rel="stylesheet" href="design-system.css">
```

**Step 2: Use the Color Variables**
```css
/* In your existing CSS, just use the variables! */
.my-button {
    background-color: var(--accent-primary);
    color: var(--bg-primary);
    border-radius: var(--radius-md);
}
```

**Step 3: Cherry-Pick Components**
Look through `template.html` and grab the HTML for components you want:
- System prompt editor
- Settings modal
- Export dropdown
- Parameter sliders

**Step 4: Add JavaScript Functions**
Copy functions from `app-template.js` that you need:
- `exportAsMarkdown()` / `exportAsJSON()`
- `setupParameterSliders()`
- `toggleTheme()`
- `formatMessage()` (for code highlighting)

## 🎨 Using the Design System

### Colors
```css
/* Backgrounds */
var(--bg-primary)    /* Main background */
var(--bg-secondary)  /* Cards, sidebar */
var(--bg-tertiary)   /* Borders, elevated surfaces */

/* Text */
var(--text-primary)   /* Main text */
var(--text-secondary) /* Subtext */
var(--text-tertiary)  /* Hints, labels */

/* Accents */
var(--accent-primary) /* Buttons, links */
var(--accent-hover)   /* Hover states */
var(--success)        /* Success messages */
var(--error)          /* Error messages */
```

### Components

**Buttons:**
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="icon-btn">⚙️</button>
```

**Inputs:**
```html
<input class="input" placeholder="Type here...">
<textarea class="input"></textarea>
<select class="input">...</select>
```

**Messages:**
```html
<div class="message user">
    <div class="message-avatar">U</div>
    <div class="message-content">
        <div class="message-role">You</div>
        <div class="message-text">Hello!</div>
    </div>
</div>
```

**Badges:**
```html
<span class="badge badge-success">● Connected</span>
<span class="badge badge-warning">⚠ Warning</span>
```

**Cards:**
```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Title</h3>
    </div>
    <div class="card-body">Content here</div>
</div>
```

### Spacing
Use the spacing variables for consistency:
```css
padding: var(--space-sm);   /* 8px */
padding: var(--space-md);   /* 16px */
padding: var(--space-lg);   /* 24px */
padding: var(--space-xl);   /* 32px */
```

## 🔧 Integrating Your Existing Code

### 1. Token Counter (You Already Have This!)
```javascript
// Find where you update tokens and style it:
document.getElementById('tokenCounter').textContent = `${count} tokens`;
```

### 2. Model Switcher (You Already Have This!)
```javascript
// Your existing model switch logic, just style the dropdown:
document.getElementById('modelSelect').className = 'input';
```

### 3. Ollama API Calls
Replace the `sendToOllama()` function in `app-template.js` with your existing API logic:

```javascript
async function sendToOllama(message) {
    // YOUR EXISTING CODE HERE
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        body: JSON.stringify({
            model: appState.currentModel,
            messages: [...],
            stream: false
        })
    });
    return await response.json();
}
```

## 📋 Implementation Roadmap

Follow the **FEATURE_ROADMAP.md** for the complete implementation plan. Here's the quick version:

### Week 1: Polish What You Have ✨
1. Apply the new design system
2. Add code syntax highlighting (Prism.js)
3. Add export functionality (Markdown/JSON)

### Week 2: User Control 🎛️
4. System prompt editor (already in template!)
5. Parameter sliders (already in template!)

### Week 3: Advanced Features 🚀
6. Image generation display
7. Conversation branching

## 🎯 Theme Switching

The template includes automatic theme switching:

```javascript
// Toggle between light and dark
toggleTheme(); // Changes data-theme attribute

// All colors automatically update via CSS variables!
```

Users can switch with:
- The theme toggle button in sidebar
- Keyboard shortcut: `Ctrl/Cmd + Shift + T` (add this if you want)

## ⌨️ Keyboard Shortcuts (Built-in)

- `Ctrl/Cmd + K` - Focus input
- `Ctrl/Cmd + N` - New chat
- `Ctrl/Cmd + ,` - Open settings
- `Escape` - Close modals
- `Enter` - Send message
- `Shift + Enter` - New line

## 📱 Responsive Design

The design system includes mobile breakpoints:

```css
@media (max-width: 768px) {
    /* Sidebar becomes a slide-out menu */
    /* Font sizes adjust */
    /* Spacing reduces */
}
```

## 🧩 Component Checklist

Copy this to track what you've integrated:

- [ ] Applied design-system.css
- [ ] Updated color scheme
- [ ] Styled existing token counter
- [ ] Styled existing model switcher
- [ ] Added system prompt editor
- [ ] Added settings modal
- [ ] Added parameter sliders
- [ ] Added export (Markdown)
- [ ] Added export (JSON)
- [ ] Added code syntax highlighting
- [ ] Implemented theme toggle
- [ ] Added keyboard shortcuts
- [ ] Tested on mobile

## 💡 Tips for Claude Code

When working with Claude Code to implement features:

1. **Be Specific:** Point to exact file and function
   ```
   "In app.js, update the sendToOllama function to include the temperature parameter"
   ```

2. **Reference the Roadmap:**
   ```
   "Implement Priority 1, Feature 2 from FEATURE_ROADMAP.md"
   ```

3. **Test Incrementally:**
   - Add one feature at a time
   - Test in browser after each change
   - Check both light and dark mode

4. **Keep the Style Consistent:**
   - Always use the CSS variables
   - Follow the spacing system
   - Use the provided component classes

## 🐛 Common Issues

**Issue:** Colors not showing up
**Fix:** Make sure `data-theme="light"` is on `<body>` tag

**Issue:** Sliders not updating
**Fix:** Check that slider IDs match the JavaScript event listeners

**Issue:** Export not working
**Fix:** Make sure `downloadFile()` function is defined

**Issue:** Theme toggle stuck
**Fix:** Verify `data-theme` attribute is being set correctly

## 📚 Next Steps

1. **Read FEATURE_ROADMAP.md** for detailed implementation guide
2. **Start with Priority 1 features** (easiest wins)
3. **Use Claude Code** to fill in the TODOs in app-template.js
4. **Test frequently** in both light and dark mode
5. **Customize** the colors if needed (edit CSS variables at top of design-system.css)

## 🎨 Customizing Colors

To adjust the color palette, edit the CSS variables in `design-system.css`:

```css
:root {
    --bg-primary: #YOUR_COLOR;
    --accent-primary: #YOUR_COLOR;
    /* etc... */
}
```

Keep the same structure, just change the hex values!

## 🙏 Credits

Design System: Claude (Anthropic)
Eye-Strain Principles: Warm tones, reduced contrast, no pure black/white
Inspired by: Modern chat interfaces with focus on readability

---

**Ready to build?** Start with the FEATURE_ROADMAP.md and let Claude Code help you implement each feature! 🚀
