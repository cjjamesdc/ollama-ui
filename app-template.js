// ============================================
// OLLAMA GUI - JAVASCRIPT TEMPLATE
// Claude Code: Fill in the TODOs with your existing logic
// ============================================

// ============================================
// STATE MANAGEMENT
// ============================================

const appState = {
    currentModel: 'llama3.2:3b',
    chatHistory: [],
    systemPrompt: 'You are a helpful assistant.',
    params: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
        repeat_penalty: 1.1
    },
    theme: 'light'
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    // Chat
    chatMessages: document.getElementById('chatMessages'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    chatTitle: document.getElementById('chatTitle'),
    
    // Sidebar
    modelSelect: document.getElementById('modelSelect'),
    newChatBtn: document.getElementById('newChatBtn'),
    chatHistory: document.getElementById('chatHistory'),
    themeToggle: document.getElementById('themeToggle'),
    
    // System Prompt
    systemPromptToggle: document.getElementById('systemPromptToggle'),
    systemPromptEditor: document.getElementById('systemPromptEditor'),
    systemPromptInput: document.getElementById('systemPromptInput'),
    applyPromptBtn: document.getElementById('applyPromptBtn'),
    resetPromptBtn: document.getElementById('resetPromptBtn'),
    
    // Settings Modal
    settingsModal: document.getElementById('settingsModal'),
    settingsBtn: document.getElementById('settingsBtn'),
    closeSettingsBtn: document.getElementById('closeSettingsBtn'),
    
    // Export
    exportBtn: document.getElementById('exportBtn'),
    exportDropdown: document.getElementById('exportDropdown'),
    
    // Token Counter (you already have this)
    tokenCounter: document.getElementById('tokenCounter'),
    
    // Status Badge
    statusBadge: document.getElementById('statusBadge')
};

// ============================================
// INITIALIZATION
// ============================================

function init() {
    loadState();
    setupEventListeners();
    setupParameterSliders();
    autoResizeTextarea();
    
    // TODO: Claude Code - Add your existing initialization logic
    // - Connect to Ollama backend
    // - Load available models
    // - Restore previous chat if exists
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Send message
    elements.sendBtn.addEventListener('click', handleSendMessage);
    elements.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });
    
    // Model selector
    elements.modelSelect.addEventListener('change', (e) => {
        appState.currentModel = e.target.value;
        saveState();
        // TODO: Claude Code - Reload model if needed
    });
    
    // New chat
    elements.newChatBtn.addEventListener('click', handleNewChat);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // System prompt
    elements.systemPromptToggle.addEventListener('click', toggleSystemPrompt);
    elements.applyPromptBtn.addEventListener('click', applySystemPrompt);
    elements.resetPromptBtn.addEventListener('click', resetSystemPrompt);
    
    // Settings modal
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.closeSettingsBtn.addEventListener('click', closeSettings);
    elements.settingsModal.addEventListener('click', (e) => {
        if (e.target === elements.settingsModal) closeSettings();
    });
    
    // Export
    elements.exportBtn.addEventListener('click', toggleExportMenu);
    document.getElementById('exportMarkdown').addEventListener('click', exportAsMarkdown);
    document.getElementById('exportJSON').addEventListener('click', exportAsJSON);
}

// ============================================
// CHAT FUNCTIONS
// ============================================

async function handleSendMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // Clear input
    elements.chatInput.value = '';
    elements.chatInput.style.height = 'auto';
    
    // Add user message to UI
    addMessageToUI('user', message);
    
    // Add to chat history
    appState.chatHistory.push({
        role: 'user',
        content: message
    });
    
    // TODO: Claude Code - Replace with your Ollama API call
    try {
        showTypingIndicator();
        
        // Your existing API call here
        const response = await sendToOllama(message);
        
        hideTypingIndicator();
        
        // Add AI response to UI
        addMessageToUI('ai', response.content);
        
        // Add to chat history
        appState.chatHistory.push({
            role: 'assistant',
            content: response.content
        });
        
        saveState();
    } catch (error) {
        hideTypingIndicator();
        showError('Failed to send message: ' + error.message);
    }
}

// TODO: Claude Code - Replace with your actual Ollama API call
async function sendToOllama(message) {
    // This is a placeholder - use your existing Ollama integration
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: appState.currentModel,
            messages: [
                { role: 'system', content: appState.systemPrompt },
                ...appState.chatHistory,
                { role: 'user', content: message }
            ],
            options: appState.params
        })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
}

function addMessageToUI(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'A';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const roleDiv = document.createElement('div');
    roleDiv.className = 'message-role';
    roleDiv.textContent = role === 'user' ? 'You' : appState.currentModel;
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = formatMessage(content);
    
    contentDiv.appendChild(roleDiv);
    contentDiv.appendChild(textDiv);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function formatMessage(content) {
    // TODO: Claude Code - Add code syntax highlighting if needed
    // Basic formatting for now
    content = escapeHtml(content);
    
    // Format code blocks
    content = content.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
    });
    
    // Format inline code
    content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Format line breaks
    content = content.replace(/\n/g, '<br>');
    
    return content;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'message ai';
    indicator.innerHTML = `
        <div class="message-avatar">A</div>
        <div class="message-content">
            <div class="message-role">${appState.currentModel}</div>
            <div class="message-text">
                <span class="loading-dots">Thinking</span>
            </div>
        </div>
    `;
    elements.chatMessages.appendChild(indicator);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function handleNewChat() {
    if (appState.chatHistory.length > 0) {
        // TODO: Claude Code - Save current chat to history before clearing
    }
    
    appState.chatHistory = [];
    elements.chatMessages.innerHTML = '';
    elements.chatTitle.textContent = 'New Chat';
    saveState();
}

// ============================================
// SYSTEM PROMPT
// ============================================

function toggleSystemPrompt() {
    elements.systemPromptToggle.classList.toggle('active');
    elements.systemPromptEditor.classList.toggle('active');
}

function applySystemPrompt() {
    appState.systemPrompt = elements.systemPromptInput.value;
    saveState();
    toggleSystemPrompt();
    showSuccess('System prompt updated');
}

function resetSystemPrompt() {
    const defaultPrompt = 'You are a helpful assistant.';
    elements.systemPromptInput.value = defaultPrompt;
    appState.systemPrompt = defaultPrompt;
    saveState();
    showSuccess('System prompt reset');
}

// ============================================
// SETTINGS & PARAMETERS
// ============================================

function setupParameterSliders() {
    const sliders = document.querySelectorAll('.param-slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const param = e.target.id;
            const value = parseFloat(e.target.value);
            
            // Update display
            const valueDisplay = document.getElementById(`${param}Value`);
            if (valueDisplay) {
                if (param === 'font_size') {
                    valueDisplay.textContent = value + 'px';
                    document.documentElement.style.setProperty('--font-md', value + 'px');
                } else {
                    valueDisplay.textContent = value;
                    appState.params[param] = value;
                }
            }
            
            saveState();
        });
    });
}

function openSettings() {
    elements.settingsModal.classList.add('active');
}

function closeSettings() {
    elements.settingsModal.classList.remove('active');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function toggleExportMenu() {
    const dropdown = elements.exportDropdown;
    const rect = elements.exportBtn.getBoundingClientRect();
    
    dropdown.style.position = 'fixed';
    dropdown.style.top = rect.bottom + 8 + 'px';
    dropdown.style.right = window.innerWidth - rect.right + 'px';
    dropdown.style.opacity = '1';
    dropdown.style.pointerEvents = 'auto';
    
    // Close on click outside
    setTimeout(() => {
        document.addEventListener('click', closeExportMenu, { once: true });
    }, 0);
}

function closeExportMenu() {
    elements.exportDropdown.style.opacity = '0';
    elements.exportDropdown.style.pointerEvents = 'none';
}

function exportAsMarkdown() {
    let markdown = `# ${elements.chatTitle.textContent}\n\n`;
    markdown += `**Model:** ${appState.currentModel}\n`;
    markdown += `**Date:** ${new Date().toLocaleString()}\n\n---\n\n`;
    
    appState.chatHistory.forEach(msg => {
        const role = msg.role === 'user' ? '**You**' : `**${appState.currentModel}**`;
        markdown += `${role}:\n${msg.content}\n\n`;
    });
    
    downloadFile(markdown, 'chat-export.md', 'text/markdown');
    closeExportMenu();
    showSuccess('Chat exported as Markdown');
}

function exportAsJSON() {
    const data = {
        title: elements.chatTitle.textContent,
        model: appState.currentModel,
        timestamp: new Date().toISOString(),
        systemPrompt: appState.systemPrompt,
        params: appState.params,
        messages: appState.chatHistory
    };
    
    downloadFile(
        JSON.stringify(data, null, 2), 
        'chat-export.json', 
        'application/json'
    );
    closeExportMenu();
    showSuccess('Chat exported as JSON');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// THEME
// ============================================

function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    body.setAttribute('data-theme', newTheme);
    appState.theme = newTheme;
    
    // Update button text
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    
    if (newTheme === 'dark') {
        icon.textContent = '☀️';
        text.textContent = 'Light Mode';
    } else {
        icon.textContent = '🌙';
        text.textContent = 'Dark Mode';
    }
    
    saveState();
}

// ============================================
// UTILITIES
// ============================================

function autoResizeTextarea() {
    elements.chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        
        // TODO: Claude Code - Update token counter here if you have it
        // updateTokenCounter(this.value);
    });
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // TODO: Claude Code - Implement toast notifications if desired
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Simple alert for now
    const badge = elements.statusBadge;
    const originalText = badge.textContent;
    badge.textContent = message;
    badge.className = `badge badge-${type}`;
    
    setTimeout(() => {
        badge.textContent = originalText;
        badge.className = 'badge badge-success';
    }, 3000);
}

// ============================================
// STATE PERSISTENCE
// ============================================

function saveState() {
    try {
        localStorage.setItem('ollama-app-state', JSON.stringify(appState));
    } catch (error) {
        console.error('Failed to save state:', error);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('ollama-app-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(appState, parsed);
            
            // Restore UI state
            document.body.setAttribute('data-theme', appState.theme);
            elements.modelSelect.value = appState.currentModel;
            elements.systemPromptInput.value = appState.systemPrompt;
            
            // Restore parameters
            Object.keys(appState.params).forEach(key => {
                const slider = document.getElementById(key);
                if (slider) {
                    slider.value = appState.params[key];
                    const valueDisplay = document.getElementById(`${key}Value`);
                    if (valueDisplay) {
                        valueDisplay.textContent = appState.params[key];
                    }
                }
            });
            
            // Restore messages
            appState.chatHistory.forEach(msg => {
                addMessageToUI(msg.role, msg.content);
            });
        }
    } catch (error) {
        console.error('Failed to load state:', error);
    }
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K = Focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.chatInput.focus();
    }
    
    // Ctrl/Cmd + N = New chat
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewChat();
    }
    
    // Ctrl/Cmd + , = Open settings
    if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        openSettings();
    }
    
    // Escape = Close modals
    if (e.key === 'Escape') {
        closeSettings();
        closeExportMenu();
    }
});

// ============================================
// START APP
// ============================================

document.addEventListener('DOMContentLoaded', init);

// ============================================
// TODO: Claude Code - Additional features to integrate:
// ============================================
// 1. Your existing token counter logic
// 2. Your Ollama connection/status checking
// 3. Chat history persistence (save/load multiple chats)
// 4. Conversation branching (if implementing)
// 5. Image generation display (if implementing)
// 6. Code syntax highlighting (Prism.js integration)
// 7. Streaming responses (if using Ollama streaming)
// 8. Error handling for network issues
// 9. Model switching confirmation if chat in progress
// 10. Chat search/filter functionality
