# Ollama GUI Feature Roadmap & Implementation Plan

## ✅ COMPLETED FEATURES
- [x] Token counter
- [x] Model switcher
- [x] Basic chat interface

---

## 🎯 PRIORITY 1 - Core Features

### 1. Chat Export
**Purpose:** Save conversations for later reference

**Implementation:**
```javascript
// Add export buttons to UI
function exportAsMarkdown() {
  const messages = getChatHistory();
  let markdown = '# Chat Export\n\n';
  messages.forEach(msg => {
    markdown += `**${msg.role}:** ${msg.content}\n\n`;
  });
  downloadFile(markdown, 'chat.md', 'text/markdown');
}

function exportAsJSON() {
  const data = {
    timestamp: new Date().toISOString(),
    model: currentModel,
    messages: getChatHistory()
  };
  downloadFile(JSON.stringify(data, null, 2), 'chat.json', 'application/json');
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

**UI Location:** Add to chat header as dropdown menu
- Button with three dots (•••)
- Dropdown: "Export as Markdown" | "Export as JSON"

---

### 2. Code Syntax Highlighting
**Purpose:** Make code blocks readable and professional

**Library:** Prism.js or Highlight.js

**Implementation:**
```html
<!-- Add to HTML head -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
```

```javascript
// Process messages before displaying
function formatMessage(content) {
  // Match code blocks: ```language\ncode\n```
  return content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'plaintext';
    const highlighted = Prism.highlight(code, Prism.languages[language], language);
    return `<pre><code class="language-${language}">${highlighted}</code></pre>`;
  });
}
```

**Custom Theme Colors (match eye-strain palette):**
```css
/* Override Prism colors */
.dark pre[class*="language-"] {
  background: var(--bg-tertiary);
}
.dark .token.comment { color: #8A8784; }
.dark .token.string { color: #88ADB8; }
.dark .token.keyword { color: #D4A574; }
.dark .token.function { color: #9DBEC8; }
```

---

### 3. System Prompt Editor
**Purpose:** Customize model behavior

**Implementation:**
```html
<!-- Collapsible panel above chat input -->
<div class="system-prompt-container">
  <button class="system-prompt-toggle">
    <span>System Prompt</span>
    <span class="toggle-icon">▼</span>
  </button>
  <div class="system-prompt-editor hidden">
    <textarea 
      class="system-prompt-input" 
      placeholder="You are a helpful assistant..."
    ></textarea>
    <div class="system-prompt-actions">
      <button class="btn-secondary">Reset to Default</button>
      <button class="btn-primary">Apply</button>
    </div>
  </div>
</div>
```

```javascript
let systemPrompt = "You are a helpful assistant.";

function updateSystemPrompt(newPrompt) {
  systemPrompt = newPrompt;
  // Include in Ollama API calls
}

function sendMessage(userMessage) {
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory,
    { role: 'user', content: userMessage }
  ];
  // Send to Ollama
}
```

**UI Design:**
- Collapsible section (starts collapsed)
- Smooth slide animation
- Character counter
- Preset templates dropdown (optional)

---

## 🎯 PRIORITY 2 - Advanced Features

### 4. Temperature & Parameter Sliders
**Purpose:** Fine-tune model responses

**Parameters:**
- Temperature (0.0 - 2.0)
- Top P (0.0 - 1.0)
- Max Tokens (100 - 4000)
- Repeat Penalty (1.0 - 2.0)

**Implementation:**
```html
<!-- Add to sidebar or settings panel -->
<div class="parameters-panel">
  <h3>Generation Parameters</h3>
  
  <div class="param-control">
    <label>
      Temperature: <span class="param-value">0.7</span>
    </label>
    <input type="range" min="0" max="2" step="0.1" value="0.7" 
           class="param-slider" id="temperature">
    <small>Higher = more creative, Lower = more focused</small>
  </div>
  
  <div class="param-control">
    <label>
      Top P: <span class="param-value">0.9</span>
    </label>
    <input type="range" min="0" max="1" step="0.05" value="0.9" 
           class="param-slider" id="top_p">
  </div>
  
  <div class="param-control">
    <label>
      Max Tokens: <span class="param-value">2000</span>
    </label>
    <input type="range" min="100" max="4000" step="100" value="2000" 
           class="param-slider" id="max_tokens">
  </div>
</div>
```

```javascript
const params = {
  temperature: 0.7,
  top_p: 0.9,
  max_tokens: 2000,
  repeat_penalty: 1.1
};

// Update on slider change
document.querySelectorAll('.param-slider').forEach(slider => {
  slider.addEventListener('input', (e) => {
    const param = e.target.id;
    params[param] = parseFloat(e.target.value);
    document.querySelector(`#${param}`).nextElementSibling.textContent = e.target.value;
  });
});

// Include in Ollama API call
const response = await ollama.chat({
  model: currentModel,
  messages: messages,
  options: params
});
```

**Styling:**
```css
.param-slider {
  width: 100%;
  height: 6px;
  background: var(--bg-tertiary);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-primary);
  border-radius: 50%;
  cursor: pointer;
}

.param-slider:hover::-webkit-slider-thumb {
  background: var(--accent-hover);
}
```

---

### 5. Image Generation Display
**Purpose:** Show generated images inline

**Implementation:**
```javascript
function displayMessage(message) {
  const messageDiv = document.createElement('div');
  
  // Check if message contains image
  if (message.images && message.images.length > 0) {
    message.images.forEach(imgData => {
      const img = document.createElement('img');
      img.src = `data:image/png;base64,${imgData}`;
      img.className = 'generated-image';
      messageDiv.appendChild(img);
    });
  }
  
  // Add text content
  const textDiv = document.createElement('div');
  textDiv.className = 'message-text';
  textDiv.innerHTML = formatMessage(message.content);
  messageDiv.appendChild(textDiv);
  
  return messageDiv;
}
```

**Styling:**
```css
.generated-image {
  max-width: 100%;
  border-radius: 12px;
  margin: 16px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-controls {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.image-controls button {
  padding: 6px 12px;
  background: var(--bg-tertiary);
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}
```

**Features:**
- Lightbox on click
- Download button
- Copy to clipboard
- Zoom controls

---

### 6. Conversation Branching
**Purpose:** Explore different conversation paths

**Data Structure:**
```javascript
class ConversationTree {
  constructor() {
    this.nodes = new Map();
    this.currentNode = 'root';
  }
  
  addMessage(parentId, message) {
    const nodeId = generateId();
    this.nodes.set(nodeId, {
      id: nodeId,
      parentId: parentId,
      message: message,
      children: [],
      timestamp: Date.now()
    });
    
    if (parentId) {
      this.nodes.get(parentId).children.push(nodeId);
    }
    
    return nodeId;
  }
  
  getBranch(nodeId) {
    const branch = [];
    let current = nodeId;
    
    while (current) {
      const node = this.nodes.get(current);
      branch.unshift(node.message);
      current = node.parentId;
    }
    
    return branch;
  }
  
  switchBranch(nodeId) {
    this.currentNode = nodeId;
    return this.getBranch(nodeId);
  }
}
```

**UI Implementation:**
```html
<!-- Show branch selector when multiple branches exist -->
<div class="branch-selector">
  <button class="branch-btn" data-branch="0">
    Branch 1: "Explain more about..."
  </button>
  <button class="branch-btn" data-branch="1">
    Branch 2: "Give me an example..."
  </button>
</div>
```

**Visual Indicator:**
- Small icon next to messages with multiple branches
- Dropdown to select branch
- Visual tree view (optional advanced feature)

---

## 🎨 UI ADDITIONS NEEDED

### Header Enhancements
```html
<div class="chat-header">
  <h1 class="chat-title">Chat Title</h1>
  <div class="header-actions">
    <button class="icon-btn" title="Settings">⚙️</button>
    <button class="icon-btn" title="Export">📤</button>
    <div class="status-badge">● Connected</div>
  </div>
</div>
```

### Settings Modal
```html
<div class="modal" id="settings-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2>Settings</h2>
      <button class="close-btn">×</button>
    </div>
    <div class="modal-body">
      <div class="settings-section">
        <h3>Appearance</h3>
        <!-- Theme selector, font size, etc -->
      </div>
      <div class="settings-section">
        <h3>Generation</h3>
        <!-- Parameter sliders -->
      </div>
      <div class="settings-section">
        <h3>Advanced</h3>
        <!-- API endpoint, timeout, etc -->
      </div>
    </div>
  </div>
</div>
```

---

## 📋 IMPLEMENTATION ORDER

**Week 1:** Core Polish
1. Code syntax highlighting
2. Chat export (Markdown/JSON)

**Week 2:** User Control
3. System prompt editor
4. Parameter sliders

**Week 3:** Advanced
5. Image display support
6. Conversation branching

---

## 🔧 TECHNICAL NOTES

### State Management
```javascript
// Consider using a simple state object
const appState = {
  currentModel: 'llama3.2',
  chatHistory: [],
  systemPrompt: '',
  params: {},
  conversationTree: new ConversationTree()
};

// Save to localStorage periodically
function saveState() {
  localStorage.setItem('ollama-state', JSON.stringify(appState));
}

function loadState() {
  const saved = localStorage.getItem('ollama-state');
  if (saved) {
    Object.assign(appState, JSON.parse(saved));
  }
}
```

### Error Handling
```javascript
async function sendMessage(content) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content, params: appState.params })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    showError('Failed to send message: ' + error.message);
    console.error(error);
  }
}
```

### Performance Optimization
- Virtualize long chat histories (only render visible messages)
- Debounce parameter slider changes
- Use Web Workers for heavy processing
- Lazy load syntax highlighting for code blocks

---

## 🎯 FUTURE IDEAS (Low Priority)

- Voice input/output
- Multi-language support
- Plugins/extensions system
- Collaborative chat (multi-user)
- Chat templates library
- Message search/filter
- Conversation analytics
- Custom themes
- Keyboard shortcuts
- Mobile responsive design
- Offline mode
