// GLM-4.6 Quick Enhancements for Ollama Interface
// Add this script to your existing HTML before </body>
// Usage: <script src="GLM-QUICK-ENHANCEMENTS.js"></script>

(function() {
    'use strict';
    
    // ======================================================
    // QUICK WIN 1: LOADING SKELETONS
    // ======================================================
    
    function showLoadingSkeleton(state = 'thinking') {
        if (appState.hideThinking) return;
        
        // Remove existing skeleton
        hideLoadingSkeleton();
        
        const stateIcons = {
            'thinking': '🤖',
            'connecting': '🔌',
            'error': '⚠️',
            'retrying': '🔄'
        };
        
        const stateColors = {
            'thinking': 'var(--accent-primary)',
            'connecting': 'var(--warning)',
            'error': 'var(--error)',
            'retrying': 'var(--warning)'
        };
        
        const skeletonHTML = `
            <div class="skeleton-loader skeleton-${state}" id="loading-skeleton">
                <div class="skeleton-avatar skeleton-avatar-${state}" style="background: ${stateColors[state] || 'var(--bg-tertiary)'}">
                    ${stateIcons[state] || '🤖'}
                </div>
                <div class="skeleton-message">
                    <div class="skeleton-line skeleton-line-${state} medium"></div>
                    <div class="skeleton-line skeleton-line-${state} long"></div>
                    <div class="skeleton-line skeleton-line-${state} short"></div>
                    <div class="skeleton-line skeleton-line-${state} medium"></div>
                </div>
            </div>
        `;
        
        elements.chatMessages.insertAdjacentHTML('beforeend', skeletonHTML);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    }
    
    function hideLoadingSkeleton() {
        const skeleton = document.getElementById('loading-skeleton');
        if (skeleton) {
            skeleton.style.opacity = '0';
            setTimeout(() => skeleton.remove(), 300);
        }
    }
    
    // ======================================================
    // QUICK WIN 2: MESSAGE COPY FUNCTIONALITY
    // ======================================================
    
    function addCopyButton(messageElement, messageText) {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'message-copy-btn';
        copyBtn.innerHTML = '📋';
        copyBtn.title = 'Copy message';
        copyBtn.onclick = () => copyToClipboard(messageText, copyBtn);
        
        const messageContent = messageElement.querySelector('.message-content');
        if (messageContent) {
            messageContent.style.position = 'relative';
            messageContent.appendChild(copyBtn);
        }
    }
    
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            button.innerHTML = '✅';
            button.classList.add('copy-success');
            playSound('notification');
            
            setTimeout(() => {
                button.innerHTML = '📋';
                button.classList.remove('copy-success');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        });
    }
    
    // ======================================================
    // QUICK WIN 3: KEYBOARD SHORTCUTS MENU
    // ======================================================
    
    function showKeyboardShortcuts() {
        const shortcutsHTML = `
            <div class="keyboard-shortcuts-modal" id="keyboard-shortcuts">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>⌨️ Keyboard Shortcuts</h2>
                        <button class="close-btn" onclick="closeKeyboardShortcuts()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="shortcut-list">
                            <div class="shortcut-item">
                                <kbd>Ctrl/Cmd</kbd><kbd>K</kbd>
                                <span>Focus input</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl/Cmd</kbd><kbd>N</kbd>
                                <span>New chat</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl/Cmd</kbd><kbd>S</kbd>
                                <span>Save chat</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl/Cmd</kbd><kbd>,</kbd>
                                <span>Open settings</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl/Cmd</kbd><kbd>/</kbd>
                                <span>Show shortcuts</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Escape</kbd>
                                <span>Close modals</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>↑</kbd>
                                <span>Previous message</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>↓</kbd>
                                <span>Next message</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', shortcutsHTML);
        setTimeout(() => {
            document.getElementById('keyboard-shortcuts').classList.add('active');
        }, 10);
    }
    
    function closeKeyboardShortcuts() {
        const modal = document.getElementById('keyboard-shortcuts');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    // ======================================================
    // QUICK WIN 4: QUICK REPLY TEMPLATES
    // ======================================================
    
    const quickReplies = [
        { icon: '💡', text: 'Give me ideas for...', category: 'brainstorm' },
        { icon: '🔧', text: 'How do I fix...', category: 'troubleshoot' },
        { icon: '📝', text: 'Explain this concept:', category: 'explain' },
        { icon: '💻', text: 'Write code to...', category: 'coding' },
        { icon: '🎨', text: 'Help me design...', category: 'creative' },
        { icon: '📊', text: 'Analyze this data:', category: 'analysis' }
    ];
    
    function addQuickReplyButtons() {
        if (document.querySelector('.quick-replies')) return; // Already added
        
        const quickReplyHTML = `
            <div class="quick-replies">
                <div class="quick-replies-header">💬 Quick Replies</div>
                <div class="quick-reply-buttons">
                    ${quickReplies.map(reply => `
                        <button class="quick-reply-btn" 
                                data-text="${reply.text}"
                                data-category="${reply.category}"
                                title="${reply.category}">
                            <span class="quick-reply-icon">${reply.icon}</span>
                            <span class="quick-reply-text">${reply.text.split(' ')[0]}...</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        elements.chatInputContainer.insertAdjacentHTML('beforebegin', quickReplyHTML);
        
        // Add click handlers
        document.querySelectorAll('.quick-reply-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const text = btn.getAttribute('data-text');
                elements.chatInput.value = text;
                elements.chatInput.focus();
                playSound('notification');
            });
        });
    }
    
    // ======================================================
    // QUICK WIN 5: ENHANCED CONNECTION STATUS
    // ======================================================
    
    function createEnhancedStatusBadge() {
        const enhancedHTML = `
            <div class="enhanced-status">
                <div class="status-dot" id="status-dot"></div>
                <span class="status-text" id="enhanced-status-text">● Ready</span>
                <div class="status-details" id="status-details">
                    <div class="status-detail-item">
                        <span class="detail-label">Response Time:</span>
                        <span class="detail-value" id="response-time">--</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="detail-label">Total Messages:</span>
                        <span class="detail-value" id="total-messages">0</span>
                    </div>
                    <div class="status-detail-item">
                        <span class="detail-label">Session Time:</span>
                        <span class="detail-value" id="session-time">0m</span>
                    </div>
                </div>
            </div>
        `;
        
        // Replace existing status badge
        const existingBadge = elements.statusBadge;
        if (existingBadge && existingBadge.parentNode) {
            existingBadge.insertAdjacentHTML('beforebegin', enhancedHTML);
            existingBadge.remove();
        }
    }
    
    // ======================================================
    // QUICK WIN 6: MESSAGE REACTIONS
    // ======================================================
    
    function addMessageReactions(messageElement) {
        if (messageElement.querySelector('.message-reactions')) return; // Already added
        
        const reactionsHTML = `
            <div class="message-reactions">
                <button class="reaction-btn" onclick="addReaction('${messageElement.dataset.messageId}', '👍')">👍</button>
                <button class="reaction-btn" onclick="addReaction('${messageElement.dataset.messageId}', '👎')">👎</button>
                <button class="reaction-btn" onclick="addReaction('${messageElement.dataset.messageId}', '❤️')">❤️</button>
                <button class="reaction-btn" onclick="addReaction('${messageElement.dataset.messageId}', '🤔')">🤔</button>
            </div>
        `;
        
        const messageContent = messageElement.querySelector('.message-content');
        if (messageContent) {
            messageContent.insertAdjacentHTML('beforeend', reactionsHTML);
        }
    }
    
    function addReaction(messageId, emoji) {
        // Store reactions in localStorage
        const reactions = JSON.parse(localStorage.getItem('message-reactions') || '{}');
        reactions[messageId] = emoji;
        localStorage.setItem('message-reactions', JSON.stringify(reactions));
        
        // Visual feedback
        playSound('notification');
        
        // Update button visual state
        document.querySelectorAll(`[data-message-id="${messageId}"] .reaction-btn`).forEach(btn => {
            btn.classList.toggle('reaction-active', btn.textContent === emoji);
        });
    }
    
    // ======================================================
    // QUICK WIN 7: SMART AUTO-SAVE
    // ======================================================
    
    function enableSmartAutoSave() {
        let saveTimeout;
        let lastSaveContent = '';
        
        function debouncedSave() {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const currentContent = JSON.stringify(appState.conversationHistory);
                if (currentContent !== lastSaveContent) {
                    localStorage.setItem('ollama-chat-autosave', currentContent);
                    lastSaveContent = currentContent;
                    
                    // Show subtle save indicator
                    showAutoSaveIndicator();
                }
            }, 2000); // Save after 2 seconds of inactivity
        }
        
        // Watch for changes
        const originalPush = appState.conversationHistory.push;
        appState.conversationHistory.push = function(...args) {
            const result = originalPush.apply(this, args);
            debouncedSave();
            return result;
        };
        
        // Initial save
        debouncedSave();
    }
    
    function showAutoSaveIndicator() {
        let indicator = document.getElementById('autosave-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'autosave-indicator';
            indicator.innerHTML = '💾 Auto-saved';
            indicator.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success);
                color: var(--bg-primary);
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(20px)';
        }, 1500);
    }
    
    // ======================================================
    // QUICK WIN 8: ENHANCED ERROR HANDLING
    // ======================================================
    
    function enhancedErrorHandling() {
        // Override existing error handler
        const originalConsoleError = console.error;
        console.error = function(...args) {
            originalConsoleError.apply(console, args);
            
            // Show user-friendly error toast
            showErrorToast(args.join(' '));
        };
        
        // Network error handling
        window.addEventListener('error', (e) => {
            if (e.message.includes('fetch') || e.message.includes('network')) {
                showErrorToast('Connection issue. Check if Ollama is running.');
            }
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            showErrorToast('Something went wrong. Try refreshing.');
        });
    }
    
    function showErrorToast(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.innerHTML = `⚠️ ${message}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--error);
            color: var(--bg-primary);
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
    
    // ======================================================
    // QUICK WIN 9: VIRTUAL SCROLLING - PRIORITY 13
    // ======================================================
    
    function createVirtualScrollManager() {
        const manager = {
            container: elements.chatMessages,
            messages: [],
            visibleRange: { start: 0, end: 0 },
            itemHeight: 120, // Estimated height per message
            buffer: 5, // Extra messages above/below viewport
            renderedElements: new Map(),
            
            init(messageArray) {
                this.messages = messageArray;
                this.container.innerHTML = ''; // Clear all messages
                
                // Set initial scroll container
                this.container.style.position = 'relative';
                this.container.style.height = `${this.messages.length * this.itemHeight}px`;
                
                // Add scroll listener
                this.container.addEventListener('scroll', () => this.onScroll());
                
                // Initial render
                this.onScroll();
            },
            
            onScroll() {
                const scrollTop = this.container.scrollTop;
                const containerHeight = this.container.clientHeight;
                
                // Calculate visible range
                const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
                const end = Math.min(
                    this.messages.length,
                    Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.buffer
                );
                
                // Only re-render if range changed
                if (start !== this.visibleRange.start || end !== this.visibleRange.end) {
                    this.renderVisibleMessages(start, end);
                    this.visibleRange = { start, end };
                }
            },
            
            renderVisibleMessages(start, end) {
                // Remove messages no longer visible
                for (const [index, element] of this.renderedElements) {
                    if (index < start || index >= end) {
                        element.remove();
                        this.renderedElements.delete(index);
                    }
                }
                
                // Add newly visible messages
                const fragment = document.createDocumentFragment();
                for (let i = start; i < end; i++) {
                    if (!this.renderedElements.has(i)) {
                        const messageElement = this.createMessageElement(this.messages[i], i);
                        fragment.appendChild(messageElement);
                        this.renderedElements.set(i, messageElement);
                    }
                }
                
                // Position absolutely
                fragment.style.position = 'absolute';
                fragment.style.top = `${start * this.itemHeight}px`;
                fragment.style.width = '100%';
                
                this.container.appendChild(fragment);
            },
            
            createMessageElement(message, index) {
                const div = document.createElement('div');
                div.className = 'message ' + message.role;
                div.style.position = 'absolute';
                div.style.top = `${index * this.itemHeight}px`;
                div.style.width = '100%';
                div.style.minHeight = `${this.itemHeight}px`;
                
                // Create avatar
                const avatar = document.createElement('div');
                avatar.className = 'message-avatar';
                avatar.textContent = message.role === 'user' ? 'U' : '🤖';
                
                // Create content
                const content = document.createElement('div');
                content.className = 'message-content';
                content.innerHTML = `
                    <div class="message-role">${message.role}</div>
                    <div class="message-text">${message.content}</div>
                `;
                
                div.appendChild(avatar);
                div.appendChild(content);
                
                return div;
            },
            
            addMessage(message) {
                this.messages.push(message);
                this.onScroll(); // Re-render to show new message
            },
            
            scrollToBottom() {
                const newHeight = this.messages.length * this.itemHeight;
                this.container.style.height = `${newHeight}px`;
                this.container.scrollTop = newHeight;
                this.onScroll();
            }
        };
        
        return manager;
    }
    
    // ======================================================
    // QUICK WIN 10: PERFORMANCE MONITOR
    // ======================================================
    
    function createPerformanceMonitor() {
        const monitor = {
            startTime: Date.now(),
            messagesCount: 0,
            responseTimes: [],
            
            recordResponse(time) {
                this.responseTimes.push(time);
                this.updateStats();
            },
            
            updateStats() {
                const avgTime = this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
                document.getElementById('response-time').textContent = `${avgTime.toFixed(0)}ms`;
            },
            
            incrementMessages() {
                this.messagesCount++;
                document.getElementById('total-messages').textContent = this.messagesCount;
            },
            
            updateSessionTime() {
                const elapsed = Date.now() - this.startTime;
                const minutes = Math.floor(elapsed / 60000);
                document.getElementById('session-time').textContent = `${minutes}m`;
            }
        };
        
        // Update session time every minute
        setInterval(() => monitor.updateSessionTime(), 60000);
        
        return monitor;
    }
    
    // ======================================================
    // STYLES FOR QUICK ENHANCEMENTS
    // ======================================================
    
    const quickEnhancementStyles = `
        <style>
        /* LOADING SKELETONS */
        .skeleton-loader {
            display: flex;
            gap: var(--space-md);
            margin-bottom: var(--space-lg);
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        .skeleton-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            flex-shrink: 0;
        }
        
        .skeleton-message {
            flex: 1;
            max-width: 800px;
        }
        
        .skeleton-line {
            height: 16px;
            background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--bg-secondary) 50%, var(--bg-tertiary) 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        
        .skeleton-line.short { width: 60%; }
        .skeleton-line.medium { width: 80%; }
        .skeleton-line.long { width: 100%; }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        /* COPY BUTTONS */
        .message-copy-btn {
            position: absolute;
            top: var(--space-sm);
            right: var(--space-sm);
            opacity: 0;
            transition: all 0.2s ease;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 4px 6px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .message:hover .message-copy-btn {
            opacity: 1;
        }
        
        .message-copy-btn:hover {
            background: var(--accent-light);
            transform: scale(1.1);
        }
        
        .copy-success {
            background: var(--success) !important;
            color: var(--bg-primary) !important;
        }
        
        /* KEYBOARD SHORTCUTS */
        .shortcut-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .shortcut-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 8px;
            border-radius: 6px;
            background: var(--bg-tertiary);
        }
        
        kbd {
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 4px 8px;
            font-family: var(--font-mono);
            font-size: 12px;
            font-weight: 500;
        }
        
        /* QUICK REPLIES */
        .quick-replies {
            margin: var(--space-md) 0;
            padding: var(--space-md);
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-sm);
        }
        
        .quick-replies-header {
            font-size: 12px;
            font-weight: 600;
            color: var(--text-tertiary);
            margin-bottom: var(--space-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .quick-reply-buttons {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 8px;
        }
        
        .quick-reply-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: left;
            font-size: 12px;
            color: var(--text-secondary);
        }
        
        .quick-reply-btn:hover {
            background: var(--accent-light);
            transform: translateY(-1px);
            box-shadow: 0 2px 4px var(--shadow);
        }
        
        .quick-reply-icon {
            font-size: 16px;
        }
        
        .quick-reply-text {
            flex: 1;
            font-weight: 500;
        }
        
        /* ENHANCED STATUS */
        .enhanced-status {
            position: relative;
            cursor: pointer;
        }
        
        .status-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        .status-dot.connected { background: var(--success); }
        .status-dot.thinking { background: var(--accent-primary); }
        .status-dot.error { background: var(--error); }
        
        .status-details {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 8px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            min-width: 180px;
            opacity: 0;
            transform: translateY(-10px);
            pointer-events: none;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-lg);
            z-index: 100;
        }
        
        .enhanced-status:hover .status-details {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
        
        .status-detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 12px;
        }
        
        .detail-label {
            color: var(--text-tertiary);
        }
        
        .detail-value {
            font-weight: 500;
            color: var(--text-primary);
            font-family: var(--font-mono);
        }
        
        /* MESSAGE REACTIONS */
        .message-reactions {
            display: flex;
            gap: 4px;
            margin-top: var(--space-sm);
        }
        
        .reaction-btn {
            background: none;
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 4px 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 14px;
        }
        
        .reaction-btn:hover {
            transform: scale(1.2);
            border-color: var(--accent-primary);
        }
        
        .reaction-btn.reaction-active {
            background: var(--accent-light);
            border-color: var(--accent-primary);
        }
        
        /* ERROR TOAST */
        .error-toast {
            box-shadow: var(--shadow-lg);
            border-radius: 8px;
        }
        
        /* PROFESSIONAL GUI CLEANUP */
        .container {
            gap: 0; /* Tighter spacing */
        }
        
        .sidebar {
            gap: 0; /* Remove internal gaps */
            padding: var(--space-lg); /* More breathing room */
        }
        
        .main-content {
            gap: 0; /* Tighter main area */
        }
        
        .chat-header {
            padding: var(--space-md) var(--space-lg); /* Better spacing */
            border-bottom: 2px solid var(--border); /* Stronger separator */
        }
        
        .header-actions {
            gap: var(--space-sm); /* Consistent spacing */
        }
        
        .chat-messages {
            padding: var(--space-lg); /* More room */
            gap: var(--space-lg); /* Better message spacing */
        }
        
        .message {
            margin-bottom: var(--space-lg); /* More separation */
            border-radius: var(--radius-lg); /* Consistent rounding */
        }
        
        .chat-input-container {
            padding: var(--space-lg); /* Better input area */
            border-top: 2px solid var(--border); /* Stronger top border */
        }
        
        .chat-input-wrapper {
            gap: var(--space-sm); /* Tighter input spacing */
        }
        
        .btn, .icon-btn {
            border-radius: var(--radius-md); /* Consistent buttons */
            border: 1px solid var(--border); /* All buttons bordered */
        }
        
        /* ENHANCED LOGO */
        .logo {
            font-size: var(--font-xl);
            font-weight: 600;
            margin: var(--space-md) 0;
            display: flex;
            align-items: center;
            gap: var(--space-md);
            padding: var(--space-sm);
        }
        
        .logo-icon {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-hover));
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-normal);
            position: relative;
            overflow: hidden;
        }
        
        .logo-icon::before {
            content: '🦙';
            animation: llamaBounce 2s ease-in-out infinite;
        }
        
        .logo-icon:hover {
            transform: scale(1.05);
            box-shadow: var(--shadow-lg);
        }
        
        @keyframes llamaBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        
        .logo-tagline {
            font-size: var(--font-sm);
            color: var(--text-tertiary);
            margin-top: var(--space-xs);
            font-weight: 400;
        }
        
        /* RESPONSIVE */
        @media (max-width: 768px) {
            .quick-reply-buttons {
                grid-template-columns: 1fr;
            }
            
            .status-details {
                right: -50px;
            }
        }
        </style>
    
    // ======================================================
    // INITIALIZATION - INTEGRATE WITH EXISTING CODE
    // ======================================================
    
    function initGLMEnhancements() {
        // Add styles
        document.head.insertAdjacentHTML('beforeend', quickEnhancementStyles);
        
        // Wait for existing elements to be available
        setTimeout(() => {
            // Add quick reply buttons
            addQuickReplyButtons();
            
            // Enhance status badge
            createEnhancedStatusBadge();
            
            // Start performance monitor
            const perfMonitor = createPerformanceMonitor();
            
            // Enable smart auto-save
            enableSmartAutoSave();
            
            // Enhanced error handling
            enhancedErrorHandling();
            
            // Override existing message rendering to add enhancements
            const originalAddMessage = window.addMessage || function() {};
            window.addMessage = function(message, isUser) {
                const result = originalAddMessage(message, isUser);
                
                // Add copy button after message is added
                setTimeout(() => {
                    const messages = document.querySelectorAll('.message');
                    messages.forEach(msg => {
                        if (!msg.querySelector('.message-copy-btn')) {
                            const msgText = msg.querySelector('.message-text')?.textContent || '';
                            if (msgText) {
                                addCopyButton(msg, msgText);
                                addMessageReactions(msg);
                            }
                        }
                    });
                }, 100);
                
                // Update performance stats
                perfMonitor.incrementMessages();
                
                return result;
            };
            
            // Override typing indicator to use skeleton
            const originalShowTyping = window.showTypingIndicator || function() {};
            window.showTypingIndicator = function() {
                showLoadingSkeleton();
                originalShowTyping();
            };
            
            const originalHideTyping = window.hideTypingIndicator || function() {};
            window.hideTypingIndicator = function() {
                hideLoadingSkeleton();
                originalHideTyping();
            };
            
            // Add keyboard shortcut handler
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + / to show shortcuts
                if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                    e.preventDefault();
                    showKeyboardShortcuts();
                }
            });
            
            console.log('🚀 GLM-4.6 Quick Enhancements loaded successfully!');
        }, 1000);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGLMEnhancements);
    } else {
        initGLMEnhancements();
    }
    
    // Export functions for global access
    window.GLMEnhancements = {
        showKeyboardShortcuts,
        copyToClipboard,
        addReaction,
        showErrorToast
    };
    
})();
