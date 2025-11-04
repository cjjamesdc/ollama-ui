# 🚀 Quick Reference - Ollama GUI Template

## File Overview
```
├── design-system.css      → All styles & colors
├── template.html          → HTML structure
├── app-template.js        → JavaScript logic
├── FEATURE_ROADMAP.md     → Implementation guide
└── README.md              → Full documentation
```

## Essential CSS Variables

```css
/* Just change these for custom colors */
--bg-primary: #F5F1E8        /* Main background */
--accent-primary: #6B8E99    /* Buttons, links */
--text-primary: #2C2C2C      /* Main text */
```

## Quick Component Usage

### Button
```html
<button class="btn btn-primary">Click Me</button>
```

### Input
```html
<input class="input" placeholder="Type...">
```

### Message
```html
<div class="message user">
    <div class="message-avatar">U</div>
    <div class="message-content">
        <div class="message-role">You</div>
        <div class="message-text">Hello!</div>
    </div>
</div>
```

## JavaScript TODOs

Search for these in `app-template.js`:

```javascript
// TODO: Claude Code - Replace with your Ollama API call
// TODO: Claude Code - Add your existing initialization logic
// TODO: Claude Code - Update token counter here
// TODO: Claude Code - Add code syntax highlighting
```

## Theme Toggle (Built-in)

```javascript
toggleTheme(); // Switches light ↔ dark
```

## Export Functions (Built-in)

```javascript
exportAsMarkdown(); // Download chat as .md
exportAsJSON();     // Download chat as .json
```

## Integration Steps

1. **Copy design-system.css** to your project
2. **Link it** in your HTML head
3. **Add classes** to your existing elements
4. **Copy functions** you need from app-template.js
5. **Done!** Everything uses CSS variables

## Most Useful Functions

```javascript
addMessageToUI(role, content)   // Add message to chat
formatMessage(content)           // Format with code blocks
showSuccess(message)            // Show notification
saveState() / loadState()       // Persist data
```

## Priority Features (From Roadmap)

✅ **Week 1:**
- Code syntax highlighting
- Export (Markdown/JSON)

✅ **Week 2:**
- System prompt editor ← Already in template!
- Parameter sliders ← Already in template!

✅ **Week 3:**
- Image display
- Conversation branching

## Keyboard Shortcuts (Pre-coded)

- `Ctrl/Cmd + K` → Focus input
- `Ctrl/Cmd + N` → New chat
- `Ctrl/Cmd + ,` → Settings
- `Enter` → Send
- `Escape` → Close modal

## Testing Checklist

- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Theme toggle works
- [ ] Messages display correctly
- [ ] Buttons have hover states
- [ ] Export functions work
- [ ] Parameters save/load
- [ ] Responsive on mobile

## Colors at a Glance

**Light Mode:**
- Background: Warm cream (#F5F1E8)
- Accent: Muted teal (#6B8E99)
- Text: Soft black (#2C2C2C)

**Dark Mode:**
- Background: Soft black (#1E1E1E)
- Accent: Soft cyan (#88ADB8)
- Text: Warm off-white (#E8E6E3)

## Common Patterns

**Add a setting slider:**
```html
<div class="param-control">
    <label>
        Name: <span class="param-value" id="myValue">0.5</span>
    </label>
    <input type="range" class="param-slider" id="my_param" 
           min="0" max="1" step="0.1" value="0.5">
</div>
```

**Show loading state:**
```javascript
showTypingIndicator();  // Show "Thinking..."
// ... do async work ...
hideTypingIndicator();  // Remove indicator
```

**Add to dropdown menu:**
```html
<button class="dropdown-item" onclick="myFunction()">
    My Action
</button>
```

## Need Help?

1. Check **README.md** for full docs
2. Read **FEATURE_ROADMAP.md** for implementation details
3. Search for "TODO: Claude Code" in JavaScript files
4. Copy-paste code examples from roadmap

## Claude Code Commands

```
"Use the design system CSS in my existing index.html"

"Implement the export as markdown feature from the template"

"Add the system prompt editor from template.html to my app"

"Style my token counter using the design system"

"Implement Priority 1 Feature 2 from the roadmap"
```

---

**You're all set!** The template is ready for Claude Code to fill in. 🎉
