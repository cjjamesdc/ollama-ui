/*
====================================
OLLAMA GUI - APP TEMPLATE
Main Application Logic
====================================
*/

(function() {
    'use strict';

    // ===========================
    // STATE MANAGEMENT
    // ===========================
    const appState = {
        models: [],
        currentModel: null,
        conversationHistory: [],
        currentChatId: null,
        chats: {},
        settings: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2000,
            repeat_penalty: 1.1,
            theme: 'light',
            systemPrompt: 'You are a helpful assistant.'
        },
        ui: {
            isSidebarCollapsed: false,
            isSettingsModalOpen: false,
            isSystemPromptEditorOpen: false,
        },
        connection: {
            isOllamaRunning: false,
            lastCheck: null,
            retries: 0,
        },
        thinking: false,
    };

    // ===========================
    // DOM ELEMENTS
    // ===========================
    const elements = {
        // Sidebar
        sidebar: document.querySelector('.sidebar'),
        newChatBtn: document.querySelector('.new-chat-btn'),
        modelSelect: document.getElementById('model-select'),
        systemPromptToggle: document.querySelector('.system-prompt-toggle'),
        systemPromptEditor: document.querySelector('.system-prompt-editor'),
        systemPromptInput: document.getElementById('system-prompt-input'),
        resetPromptBtn: document.getElementById('reset-prompt-btn'),
        applyPromptBtn: document.getElementById('apply-prompt-btn'),
        chatHistory: document.querySelector('.chat-history'),
        temperatureSlider: document.getElementById('temperature'),
        temperatureValue: document.getElementById('temperatureValue'),
        topPSlider: document.getElementById('top_p'),
        topPValue: document.getElementById('top_pValue'),
        themeToggle: document.getElementById('theme-toggle'),

        // Main Content
        mainContent: document.querySelector('.main-content'),
        chatHeader: document.querySelector('.chat-header'),
        chatTitle: document.querySelector('.chat-title'),
        settingsBtn: document.getElementById('settings-btn'),
        exportBtn: document.getElementById('export-btn'),
        chatMessages: document.getElementById('chatMessages'),
        chatInputContainer: document.querySelector('.chat-input-container'),
        chatInput: document.getElementById('chatInput'),
        tokenCounter: document.getElementById('token-counter'),
        sendBtn: document.getElementById('sendBtn'),

        // Settings Modal
        settingsModal: document.getElementById('settingsModal'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        maxTokensSlider: document.getElementById('max_tokens'),
        maxTokensValue: document.getElementById('max_tokensValue'),
        repeatPenaltySlider: document.getElementById('repeat_penalty'),
        repeatPenaltyValue: document.getElementById('repeat_penaltyValue'),
        
        // Body & Container
        body: document.body,
        container: document.querySelector('.container'),
    };

    // ===========================
    // INITIALIZATION
    // ===========================

    function init() {
        console.log("Initializing Ollama GUI...");
        loadSettings();
        bindEventListeners();
        checkOllamaConnection();
        loadModels();
        loadChats();
        startNewChat();
        updateTheme();
        initSliders();
        setInterval(checkOllamaConnection, 30000); // Check connection every 30 seconds
    }

    // ===========================
    // EVENT LISTENERS
    // ===========================

    function bindEventListeners() {
        elements.newChatBtn.addEventListener('click', startNewChat);
        elements.sendBtn.addEventListener('click', handleSendMessage);
        elements.chatInput.addEventListener('keydown', handleInputKeyDown);
        elements.modelSelect.addEventListener('change', handleModelChange);
        elements.themeToggle.addEventListener('click', toggleTheme);
        elements.settingsBtn.addEventListener('click', toggleSettingsModal);
        elements.closeSettingsBtn.addEventListener('click', toggleSettingsModal);
        elements.systemPromptToggle.addEventListener('click', toggleSystemPromptEditor);
        elements.applyPromptBtn.addEventListener('click', applySystemPrompt);
        elements.resetPromptBtn.addEventListener('click', resetSystemPrompt);
        elements.chatTitle.addEventListener('blur', handleChatTitleChange);
        elements.chatTitle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                elements.chatTitle.blur();
            }
        });
        elements.exportBtn.addEventListener('click', exportCurrentChat);
    }

    // ===========================
    // OLLAMA CONNECTION
    // ===========================

    async function checkOllamaConnection() {
        try {
            const response = await fetch('http://localhost:11434');
            if (response.ok) {
                if (!appState.connection.isOllamaRunning) {
                    console.log("Ollama connection successful.");
                    appState.connection.isOllamaRunning = true;
                    appState.connection.retries = 0;
                    updateStatusIndicator(true, 'Ready');
                    loadModels();
                }
            } else {
                throw new Error('Ollama not responding');
            }
        } catch (error) {
            if (appState.connection.isOllamaRunning || appState.connection.retries === 0) {
                console.error("Ollama connection failed:", error.message);
                appState.connection.isOllamaRunning = false;
                updateStatusIndicator(false, `Connection failed. Retrying...`);
            }
            appState.connection.retries++;
        }
        appState.connection.lastCheck = new Date();
    }

    function updateStatusIndicator(isOnline, text) {
        // This is a placeholder. A more advanced status indicator can be built.
        const statusBadge = document.createElement('div');
        statusBadge.className = `badge ${isOnline ? 'badge-success' : 'badge-error'}`;
        statusBadge.textContent = text;
        
        const existingBadge = elements.chatHeader.querySelector('.badge');
        if (existingBadge) existingBadge.remove();
        
        elements.chatHeader.appendChild(statusBadge);
    }

    // ===========================
    // MODEL MANAGEMENT
    // ===========================

    async function loadModels() {
        if (!appState.connection.isOllamaRunning) return;
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            const data = await response.json();
            appState.models = data.models.map(model => model.name);
            console.log("Available models:", appState.models);
            renderModelSelector();
        } catch (error) {
            console.error("Failed to load models:", error);
        }
    }

    function renderModelSelector() {
        elements.modelSelect.innerHTML = '';
        appState.models.forEach(modelName => {
            const option = document.createElement('option');
            option.value = modelName;
            option.textContent = modelName;
            if (modelName === appState.currentModel) {
                option.selected = true;
            }
            elements.modelSelect.appendChild(option);
        });
        if (!appState.currentModel && appState.models.length > 0) {
            appState.currentModel = appState.models[0];
            elements.modelSelect.value = appState.currentModel;
        }
    }

    function handleModelChange(event) {
        appState.currentModel = event.target.value;
        saveSettings();
        console.log(`Model changed to: ${appState.currentModel}`);
    }

    // ===========================
    // CHAT MANAGEMENT
    // ===========================

    function startNewChat() {
        const newChatId = `chat_${Date.now()}`;
        appState.currentChatId = newChatId;
        appState.chats[newChatId] = {
            id: newChatId,
            title: 'New Chat',
            history: [],
            createdAt: new Date(),
            systemPrompt: appState.settings.systemPrompt,
        };
        appState.conversationHistory = [];
        renderChatHistory();
        renderMessages();
        updateChatTitle();
        elements.chatInput.focus();
        console.log(`Started new chat: ${newChatId}`);
    }

    function switchChat(chatId) {
        if (!appState.chats[chatId]) return;
        appState.currentChatId = chatId;
        appState.conversationHistory = appState.chats[chatId].history;
        renderMessages();
        renderChatHistory(); // To update the active state
        updateChatTitle();
        elements.systemPromptInput.value = appState.chats[chatId].systemPrompt;
        console.log(`Switched to chat: ${chatId}`);
    }

    function deleteChat(chatId) {
        if (confirm('Are you sure you want to delete this chat?')) {
            delete appState.chats[chatId];
            saveChats();
            if (appState.currentChatId === chatId) {
                startNewChat();
            } else {
                renderChatHistory();
            }
            console.log(`Deleted chat: ${chatId}`);
        }
    }

    function handleChatTitleChange(event) {
        const newTitle = event.target.textContent.trim();
        if (newTitle && appState.currentChatId) {
            appState.chats[appState.currentChatId].title = newTitle;
            saveChats();
            renderChatHistory(); // Update title in the sidebar
        }
    }

    function updateChatTitle() {
        if (appState.currentChatId) {
            elements.chatTitle.textContent = appState.chats[appState.currentChatId].title;
        }
    }

    function renderChatHistory() {
        elements.chatHistory.innerHTML = '';
        const sortedChats = Object.values(appState.chats).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        sortedChats.forEach(chat => {
            const chatItem = document.createElement('div');
            chatItem.className = 'chat-item';
            chatItem.textContent = chat.title;
            chatItem.dataset.chatId = chat.id;
            if (chat.id === appState.currentChatId) {
                chatItem.classList.add('active');
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.className = 'chat-item-action-btn delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteChat(chat.id);
            };

            const actions = document.createElement('div');
            actions.className = 'chat-item-actions';
            actions.appendChild(deleteBtn);

            chatItem.appendChild(actions);
            chatItem.addEventListener('click', () => switchChat(chat.id));
            elements.chatHistory.appendChild(chatItem);
        });
    }

    // ===========================
    // MESSAGE HANDLING
    // ===========================

    async function handleSendMessage() {
        const userInput = elements.chatInput.value.trim();
        if (!userInput || appState.thinking) return;

        appState.thinking = true;
        elements.sendBtn.disabled = true;
        elements.chatInput.value = '';

        addMessageToUI(userInput, 'user');
        appState.conversationHistory.push({ role: 'user', content: userInput });

        showTypingIndicator();

        try {
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    model: appState.currentModel,
                    messages: [
                        { role: 'system', content: appState.chats[appState.currentChatId].systemPrompt },
                        ...appState.conversationHistory
                    ],
                    stream: true,
                    options: {
                        temperature: appState.settings.temperature,
                        top_p: appState.settings.top_p,
                        num_predict: appState.settings.max_tokens,
                        repeat_penalty: appState.settings.repeat_penalty,
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let aiResponse = '';
            let aiMessageElement = addMessageToUI('', 'ai');

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    const parsedLine = JSON.parse(line);
                    if (parsedLine.message && parsedLine.message.content) {
                        aiResponse += parsedLine.message.content;
                        updateMessageContent(aiMessageElement, aiResponse);
                    }
                    if (parsedLine.done) {
                        appState.conversationHistory.push({ role: 'assistant', content: aiResponse });
                        saveCurrentChat();
                        break;
                    }
                }
            }

        } catch (error) {
            console.error("Error during chat fetch:", error);
            addMessageToUI(`Error: ${error.message}`, 'error');
        } finally {
            appState.thinking = false;
            elements.sendBtn.disabled = false;
            hideTypingIndicator();
            elements.chatInput.focus();
        }
    }

    function handleInputKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
        updateTokenCounter();
    }

    function addMessageToUI(content, role) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? 'U' : (role === 'ai' ? '🤖' : '⚠️');

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        const roleElement = document.createElement('div');
        roleElement.className = 'message-role';
        roleElement.textContent = role;

        const textElement = document.createElement('div');
        textElement.className = 'message-text';
        textElement.innerHTML = formatMessage(content);

        messageContent.appendChild(roleElement);
        messageContent.appendChild(textElement);
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);

        elements.chatMessages.appendChild(messageElement);
        scrollToBottom();
        return messageElement;
    }

    function updateMessageContent(messageElement, newContent) {
        const textElement = messageElement.querySelector('.message-text');
        if (textElement) {
            textElement.innerHTML = formatMessage(newContent);
        }
        scrollToBottom();
    }

    function formatMessage(content) {
        // Basic markdown for code blocks
        return content.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
            const language = lang || 'plaintext';
            return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
        }).replace(/`([^`]+)`/g, `<code>$1</code>`);
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'message ai';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-role">ai</div>
                <div class="message-text loading-dots">Thinking</div>
            </div>
        `;
        elements.chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }

    function renderMessages() {
        elements.chatMessages.innerHTML = '';
        appState.conversationHistory.forEach(msg => addMessageToUI(msg.content, msg.role));
    }

    function updateTokenCounter() {
        const count = elements.chatInput.value.length; // Simple character count
        elements.tokenCounter.textContent = `${count} chars`;
    }

    // ===========================
    // SETTINGS & DATA
    // ===========================

    function saveSettings() {
        localStorage.setItem('ollama_settings', JSON.stringify(appState.settings));
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem('ollama_settings');
        if (savedSettings) {
            Object.assign(appState.settings, JSON.parse(savedSettings));
        }
    }

    function saveChats() {
        localStorage.setItem('ollama_chats', JSON.stringify(appState.chats));
    }

    function loadChats() {
        const savedChats = localStorage.getItem('ollama_chats');
        if (savedChats) {
            appState.chats = JSON.parse(savedChats);
            const latestChatId = Object.keys(appState.chats).sort((a, b) => 
                new Date(appState.chats[b].createdAt) - new Date(appState.chats[a].createdAt)
            )[0];
            if (latestChatId) {
                switchChat(latestChatId);
            }
        }
    }

    function saveCurrentChat() {
        if (appState.currentChatId) {
            appState.chats[appState.currentChatId].history = appState.conversationHistory;
            saveChats();
        }
    }

    function exportCurrentChat() {
        if (!appState.currentChatId) return;
        const chatData = appState.chats[appState.currentChatId];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(chatData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${chatData.title.replace(/\s+/g, '_')}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // ===========================
    // UI & THEME
    // ===========================

    function toggleTheme() {
        appState.settings.theme = appState.settings.theme === 'light' ? 'dark' : 'light';
        updateTheme();
        saveSettings();
    }

    function updateTheme() {
        elements.body.dataset.theme = appState.settings.theme;
        elements.themeToggle.textContent = appState.settings.theme === 'light' ? '🌙' : '☀️';
    }

    function toggleSettingsModal() {
        appState.ui.isSettingsModalOpen = !appState.ui.isSettingsModalOpen;
        elements.settingsModal.classList.toggle('active', appState.ui.isSettingsModalOpen);
    }

    function toggleSystemPromptEditor() {
        appState.ui.isSystemPromptEditorOpen = !appState.ui.isSystemPromptEditorOpen;
        elements.systemPromptEditor.classList.toggle('active', appState.ui.isSystemPromptEditorOpen);
        elements.systemPromptToggle.classList.toggle('active', appState.ui.isSystemPromptEditorOpen);
    }

    function applySystemPrompt() {
        const newPrompt = elements.systemPromptInput.value.trim();
        if (appState.currentChatId) {
            appState.chats[appState.currentChatId].systemPrompt = newPrompt;
            saveChats();
            // Optionally, start a new chat with this prompt or clear current one
            if (confirm('System prompt applied. Do you want to start a new chat with this prompt?')) {
                startNewChat();
            }
        }
    }

    function resetSystemPrompt() {
        elements.systemPromptInput.value = 'You are a helpful assistant.';
    }

    function initSliders() {
        const sliders = [
            { slider: elements.temperatureSlider, valueEl: elements.temperatureValue, key: 'temperature' },
            { slider: elements.topPSlider, valueEl: elements.topPValue, key: 'top_p' },
            { slider: elements.maxTokensSlider, valueEl: elements.maxTokensValue, key: 'max_tokens' },
            { slider: elements.repeatPenaltySlider, valueEl: elements.repeatPenaltyValue, key: 'repeat_penalty' },
        ];

        sliders.forEach(({ slider, valueEl, key }) => {
            if (slider) {
                slider.value = appState.settings[key];
                valueEl.textContent = slider.value;
                slider.addEventListener('input', (e) => {
                    const value = e.target.value;
                    valueEl.textContent = value;
                    appState.settings[key] = parseFloat(value);
                    saveSettings();
                });
            }
        });
    }

    // ===========================
    // START THE APP
    // ===========================
    document.addEventListener('DOMContentLoaded', init);

})();
