// GLM-4.6 Production-Level Enhancements
// Add this script to your existing HTML before </body>
// Usage: <script src="GLM-PRODUCTION-ENHANCEMENTS.js"></script>

(function() {
    'use strict';
    
    // ======================================================
    // PRODUCTION ENHANCEMENT 1: HAMBURGER MENU
    // ======================================================
    
    function initHamburgerMenu() {
        // Create hamburger button
        const hamburgerBtn = document.createElement('button');
        hamburgerBtn.className = 'hamburger-btn';
        hamburgerBtn.innerHTML = `
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
            <div class="hamburger-line"></div>
        `;
        
        // Create hamburger menu
        const hamburgerMenu = document.createElement('div');
        hamburgerMenu.className = 'hamburger-menu';
        hamburgerMenu.innerHTML = `
            <div class="menu-header">
                <div class="menu-title">📋 Quick Actions</div>
                <button class="close-hamburger" onclick="closeHamburgerMenu()">×</button>
            </div>
            <div class="menu-sections">
                <div class="menu-section">
                    <div class="section-title">💬 Chat</div>
                    <button onclick="GLMEnhancements.newChat()">💬 New Chat</button>
                    <button onclick="GLMEnhancements.clearChat()">🗑️ Clear Chat</button>
                    <button onclick="GLMEnhancements.saveCurrentChat()">💾 Save Chat</button>
                    <button onclick="GLMEnhancements.exportChat()">📥 Export Chat</button>
                </div>
                <div class="menu-section">
                    <div class="section-title">🔧 Tools</div>
                    <button onclick="GLMEnhancements.showKeyboardShortcuts()">⌨️ Keyboard Shortcuts</button>
                    <button onclick="GLMEnhancements.openSearch()">🔍 Search Messages</button>
                    <button onclick="GLMEnhancements.openBranchManager()">🌿 Conversation Branches</button>
                </div>
                <div class="menu-section">
                    <div class="section-title">⚙️ Settings</div>
                    <button onclick="GLMEnhancements.openSettings()">⚙️ Settings</button>
                    <button onclick="GLMEnhancements.toggleTheme()">🌙 Toggle Theme</button>
                    <button onclick="GLMEnhancements.toggleSidebar()">📂 Toggle Sidebar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(hamburgerBtn);
        document.body.appendChild(hamburgerMenu);
        
        hamburgerBtn.addEventListener('click', () => {
            hamburgerMenu.classList.add('active');
        });
    }
    
    function closeHamburgerMenu() {
        const menu = document.querySelector('.hamburger-menu');
        if (menu) {
            menu.classList.remove('active');
        }
    }
    
    // ======================================================
    // PRODUCTION ENHANCEMENT 2: ENHANCED SYSTEM PROMPT BOX
    // ======================================================
    
    function enhanceSystemPromptBox() {
        const promptEditor = document.getElementById('systemPromptEditor');
        if (!promptEditor) return;
        
        // Add icons to prompt template selector
        const templateButtons = document.createElement('div');
        templateButtons.className = 'prompt-template-buttons';
        templateButtons.innerHTML = `
            <button class="template-btn" data-template="assistant" onclick="applyTemplate('assistant')">
                🤖 Assistant
            </button>
            <button class="template-btn" data-template="coder" onclick="applyTemplate('coder')">
                💻 Coder
            </button>
            <button class="template-btn" data-template="tutor" onclick="applyTemplate('tutor')">
                👨‍🏫 Tutor
            </button>
            <button class="template-btn" data-template="writer" onclick="applyTemplate('writer')">
                ✍️ Writer
            </button>
            <button class="template-btn" data-template="explainer" onclick="applyTemplate('explainer')">
                💡 Explainer
            </button>
            <button class="template-btn" data-template="brainstorm" onclick="applyTemplate('brainstorm')">
                🧠 Brainstorm
            </button>
        `;
        
        const promptContainer = document.getElementById('systemPromptEditor');
        if (promptContainer) {
            promptContainer.insertBefore(templateButtons, promptContainer.firstChild);
        }
        
        // Add template application function
        window.applyTemplate = function(templateName) {
            const templates = {
                'assistant': 'You are a helpful assistant.',
                'coder': 'You are an expert programmer and coding assistant. Help the user write clean, efficient code.',
                'tutor': 'You are a patient and encouraging tutor. Break down complex concepts into simple explanations.',
                'writer': 'You are a creative writing assistant. Help the user craft engaging stories or content.',
                'explainer': 'You are a technical explainer who specializes in breaking down complex concepts.',
                'brainstorm': 'You are a creative brainstorming partner. Generate innovative ideas and explore possibilities.'
            };
            
            const promptInput = document.getElementById('systemPromptInput');
            if (promptInput && templates[templateName]) {
                promptInput.value = templates[templateName];
                promptInput.dispatchEvent(new Event('input'));
            }
        };
    }
    
    // ======================================================
    // PRODUCTION ENHANCEMENT 3: MESSAGE SEARCH
    // ======================================================
    
    function initMessageSearch() {
        const searchHTML = `
            <div class="search-container" id="message-search">
                <div class="search-header">
                    <div class="search-title">🔍 Search Messages</div>
                    <button class="search-close" onclick="closeSearch()">×</button>
                </div>
                <div class="search-input-wrapper">
                    <input type="text" id="search-input" placeholder="Search messages..." />
                    <button class="search-filter-btn" onclick="toggleSearchFilters()">⚙️</button>
                </div>
                <div class="search-filters" id="search-filters">
                    <div class="filter-group">
                        <label>
                            <input type="checkbox" id="filter-user" checked>
                            <span>👤 User Messages</span>
                        </label>
                        <label>
                            <input type="checkbox" id="filter-ai" checked>
                            <span>🤖 AI Messages</span>
                        </label>
                        <label>
                            <input type="checkbox" id="filter-with-code" checked>
                            <span>💻 Contains Code</span>
                        </label>
                    </div>
                    <div class="filter-group">
                        <label>Date Range:</label>
                        <input type="date" id="filter-start-date" />
                        <span>to</span>
                        <input type="date" id="filter-end-date" />
                    </div>
                </div>
                <div class="search-results" id="search-results">
                    <div class="results-count">No results found</div>
                    <div class="results-list"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', searchHTML);
    }
    
    window.openSearch = initMessageSearch;
    
    function closeSearch() {
        const searchContainer = document.getElementById('message-search');
        if (searchContainer) {
            searchContainer.remove();
        }
    }
    
    function toggleSearchFilters() {
        const filters = document.getElementById('search-filters');
        if (filters) {
            filters.classList.toggle('active');
        }
    }
    
    // ======================================================
    // PRODUCTION ENHANCEMENT 4: BRANCH MANAGER
    // ======================================================
    
    function initBranchManager() {
        const branchHTML = `
            <div class="branch-manager" id="branch-manager">
                <div class="branch-header">
                    <div class="branch-title">🌿 Conversation Branches</div>
                    <button class="branch-close" onclick="closeBranchManager()">×</button>
                </div>
                <div class="branch-actions">
                    <button onclick="createBranch('current')">🌿 Create Branch</button>
                    <button onclick="switchBranch('main')">↩️ Switch to Main</button>
                    <button onclick="mergeBranch()">🔀 Merge Branches</button>
                </div>
                <div class="branch-list" id="branch-list">
                    <div class="branch-item active">
                        <div class="branch-name">main</div>
                        <div class="branch-info">Current conversation</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', branchHTML);
    }
    
    window.openBranchManager = initBranchManager;
    
    function closeBranchManager() {
        const branchManager = document.getElementById('branch-manager');
        if (branchManager) {
            branchManager.remove();
        }
    }
    
    // ======================================================
    // INITIALIZATION
    // ======================================================
    
    function initProductionEnhancements() {
        // Initialize hamburger menu
        initHamburgerMenu();
        
        // Enhance system prompt box
        enhanceSystemPromptBox();
        
        console.log('🎨 Production enhancements loaded!');
    }
    
    // Global exports
    window.GLMProduction = {
        initProductionEnhancements,
        closeHamburgerMenu,
        applyTemplate,
        openSearch,
        closeSearch,
        openBranchManager,
        closeBranchManager
    };
    
    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductionEnhancements);
    } else {
        initProductionEnhancements();
    }
    
    // ======================================================
    // PRODUCTION STYLES
    // ======================================================
    
    const productionStyles = `
        <style>
        /* HAMBURGER MENU - PRODUCTION LEVEL */
        .hamburger-menu {
            position: fixed;
            top: var(--space-lg);
            right: var(--space-lg);
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            padding: var(--space-md);
            box-shadow: var(--shadow-xl);
            z-index: 1000;
            max-width: 320px;
            opacity: 0;
            transform: translateY(-20px);
            transition: all var(--transition-normal);
        }
        
        .hamburger-menu.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hamburger-btn {
            width: 32px;
            height: 32px;
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 3px;
            transition: all var(--transition-fast);
            position: fixed;
            top: var(--space-lg);
            right: var(--space-lg);
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            z-index: 1001;
        }
        
        .hamburger-line {
            width: 100%;
            height: 2px;
            background: var(--text-primary);
            border-radius: 1px;
            transition: all var(--transition-fast);
        }
        
        .hamburger-btn:hover .hamburger-line {
            background: var(--accent-primary);
        }
        
        .menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
            padding-bottom: var(--space-sm);
            border-bottom: 1px solid var(--border);
        }
        
        .menu-title {
            font-size: var(--font-lg);
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .close-hamburger {
            background: none;
            border: none;
            font-size: var(--font-xl);
            cursor: pointer;
            color: var(--text-secondary);
            transition: color var(--transition-fast);
        }
        
        .close-hamburger:hover {
            color: var(--text-primary);
        }
        
        .menu-sections {
            display: flex;
            flex-direction: column;
            gap: var(--space-lg);
        }
        
        .menu-section {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
        }
        
        .section-title {
            font-size: var(--font-sm);
            font-weight: 600;
            color: var(--text-tertiary);
            margin-bottom: var(--space-sm);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .menu-section button {
            background: none;
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-sm) var(--space-md);
            cursor: pointer;
            transition: all var(--transition-normal);
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            font-size: var(--font-sm);
            color: var(--text-primary);
            text-align: left;
        }
        
        .menu-section button:hover {
            background: var(--accent-light);
            border-color: var(--accent-primary);
            transform: translateX(4px);
        }
        
        /* PROMPT TEMPLATE BUTTONS */
        .prompt-template-buttons {
            display: flex;
            gap: var(--space-xs);
            margin-bottom: var(--space-md);
            flex-wrap: wrap;
        }
        
        .template-btn {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: 4px 8px;
            cursor: pointer;
            transition: all var(--transition-normal);
            font-size: var(--font-xs);
            color: var(--text-secondary);
        }
        
        .template-btn:hover,
        .template-btn.active {
            background: var(--accent-primary);
            color: var(--bg-primary);
            border-color: var(--accent-primary);
        }
        
        /* SEARCH INTERFACE */
        .search-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            z-index: 1002;
            max-width: 400px;
            margin: 20px;
            display: flex;
            flex-direction: column;
            box-shadow: var(--shadow-xl);
        }
        
        .search-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-md);
            border-bottom: 1px solid var(--border);
        }
        
        .search-title {
            font-size: var(--font-lg);
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .search-close {
            background: none;
            border: none;
            font-size: var(--font-xl);
            cursor: pointer;
            color: var(--text-secondary);
        }
        
        .search-input-wrapper {
            display: flex;
            padding: var(--space-md);
            gap: var(--space-sm);
        }
        
        #search-input {
            flex: 1;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-sm);
            color: var(--text-primary);
            font-size: var(--font-sm);
        }
        
        .search-filter-btn {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: var(--radius-sm);
            padding: var(--space-sm);
            cursor: pointer;
        }
        
        .search-filters {
            padding: 0 var(--space-md);
            border-bottom: 1px solid var(--border);
            max-height: 200px;
            overflow-y: auto;
            opacity: 0;
            transform: translateY(-10px);
            transition: all var(--transition-normal);
        }
        
        .search-filters.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        .filter-group {
            display: flex;
            flex-direction: column;
            gap: var(--space-sm);
            margin-bottom: var(--space-md);
        }
        
        .filter-group label {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            cursor: pointer;
        }
        
        .search-results {
            padding: var(--space-md);
        }
        
        /* BRANCH MANAGER */
        .branch-manager {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 1003;
            max-width: 400px;
            width: 90%;
        }
        
        .branch-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-md);
            border-bottom: 1px solid var(--border);
        }
        
        .branch-actions {
            display: flex;
            gap: var(--space-sm);
            padding: var(--space-md);
        }
        
        .branch-actions button {
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: var(--space-sm) var(--space-md);
            cursor: pointer;
            transition: all var(--transition-normal);
        }
        
        .branch-actions button:hover {
            background: var(--accent-light);
            border-color: var(--accent-primary);
        }
        
        .branch-list {
            padding: var(--space-md);
        }
        
        .branch-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-sm) var(--space-md);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            margin-bottom: var(--space-sm);
            background: var(--bg-primary);
        }
        
        .branch-item.active {
            border-color: var(--accent-primary);
            background: var(--accent-light);
        }
        
        .branch-name {
            font-weight: 600;
            color: var(--text-primary);
        }
        
        .branch-info {
            font-size: var(--font-xs);
            color: var(--text-tertiary);
        }
        
        /* RESPONSIVE */
        @media (max-width: 768px) {
            .hamburger-btn {
                display: block;
            }
            
            .hamburger-menu {
                max-width: 280px;
            }
            
            .search-container {
                max-width: 320px;
                margin: 10px;
            }
            
            .branch-manager {
                width: 90%;
                max-width: 320px;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', productionStyles);
    
})();
