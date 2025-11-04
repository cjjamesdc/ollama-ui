
# Ollama Setup and Custom UI Build Notes

This document summarizes the process of setting up local LLMs with Ollama and building a custom web UI to interact with them.

## 1. Key Concepts

- **Model Size vs. Speed:** The biggest factor in performance is the model's parameter count. For an M3 MacBook with 18GB of RAM, models in the 7B-8B range provide the best balance of speed and capability.
- **Model Format (GGUF):** For local models to run efficiently on Mac hardware, they should be in the GGUF format. This is more important than the model family (Llama, Gemma, Qwen, etc.).
- **Instruct-Tuned Models:** For chatbot or assistant-like behavior, always choose a model with an `-instruct` or `-chat` tag. Base models are not trained to follow commands.
- **Ollama as an API Server:** Ollama runs as a background server that listens for API requests on `http://localhost:11434`. This allows any application, including a custom web UI, to interact with it.
- **CORS Policy:** Browsers have a security feature (CORS) that can block web pages from talking to the Ollama API. The two solutions are:
    1. Configure the main Ollama app to allow connections (we did this with `launchctl setenv`).
    2. Serve the UI file from a local web server to make its origin trusted (our final, working solution).

## 2. Final Working Startup Process

This is the repeatable process to run your custom UI:

1.  **Start the Ollama App:** Make sure the main Ollama application is running (the llama icon is visible in your top menu bar).
2.  **Start the UI Web Server:** Open a terminal and run the following command from your `~/Desktop/Coding` directory to serve the UI file:
    ```sh
    python3 -m http.server 8080 &
    ```
3.  **Access the UI:** Open a web browser (like Chrome) and go to this URL:
    ```
    http://localhost:8080/ollama-ui.html
    ```

## 3. Recommended Local Models

- **Best Overall:** `llama3:8b-instruct-q4_K_M`
- **Newest:** `qwen3:8b`
- **Fastest:** `phi-3:mini-instruct-q4_K_M`

## 4. Custom UI Code (`ollama-ui.html`)

Here is the full code for the UI we built. You can modify this file to change the style or add new features.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ollama Custom UI</title>
    <style>
        body {
            font-family: 'Monaco', 'Courier New', Courier, monospace;
            background-color: #000000;
            color: #00FF00;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        #app-container {
            width: 100%;
            max-width: 700px;
            height: 90vh;
            border: 1px solid #00FF00;
            display: flex;
            flex-direction: column;
            background-color: #0a0a0a;
        }
        #chat-window {
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            border-bottom: 1px solid #00FF00;
        }
        .message {
            margin-bottom: 10px;
            line-height: 1.3;
            white-space: pre-wrap;
        }
        .user-message::before {
            content: 'USER> ';
        }
        .assistant-message::before {
            content: 'ASSISTANT> ';
        }
        #controls {
            padding: 10px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #input-area {
            display: flex;
            gap: 10px;
        }
        #prompt-input {
            flex-grow: 1;
            padding: 5px;
            border: 1px solid #00FF00;
            background-color: #000;
            color: #00FF00;
            font-family: inherit;
            font-size: 16px;
        }
        #send-button {
            padding: 5px 10px;
            border: 1px solid #00FF00;
            background-color: #00FF00;
            color: #000;
            cursor: pointer;
            font-family: inherit;
            font-size: 16px;
        }
        #send-button:hover {
            background-color: #000;
            color: #00FF00;
        }
        #status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #model-selector {
            padding: 5px;
            border: 1px solid #00FF00;
            background-color: #000;
            color: #00FF00;
            font-family: inherit;
        }
        #status {
            font-size: 12px;
            color: #00FF00;
            text-align: right;
        }
    </style>
</head>
<body>

<div id="app-container">
    <div id="chat-window"></div>
    <div id="controls">
        <div id="status-bar">
            <select id="model-selector"></select>
            <div id="status">Select a model to begin.</div>
        </div>
        <div id="input-area">
            <input type="text" id="prompt-input" placeholder="Type your message...">
            <button id="send-button">Send</button>
        </div>
    </div>
</div>

<script>
    const sendButton = document.getElementById('send-button');
    const promptInput = document.getElementById('prompt-input');
    const chatWindow = document.getElementById('chat-window');
    const statusDiv = document.getElementById('status');
    const modelSelector = document.getElementById('model-selector');

    const OLLAMA_API_URL = 'http://localhost:11434';
    let conversationHistory = [];

    // --- 1. Fetch and Populate Models on Load ---
    async function populateModels() {
        try {
            const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
            const data = await response.json();
            data.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.name;
                modelSelector.appendChild(option);
            });
            statusDiv.textContent = 'Ready.';
        } catch (error) {
            console.error('Error fetching models:', error);
            statusDiv.textContent = 'Error: Could not connect to Ollama. Make sure it is running.';
        }
    }

    // --- 2. Main Function to Handle Chat ---
    async function handleChat() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        const selectedModel = modelSelector.value;
        if (!selectedModel) {
            statusDiv.textContent = 'Please select a model first.';
            return;
        }

        conversationHistory.push({ role: 'user', content: prompt });
        addMessageToChat(prompt, 'user-message');
        promptInput.value = '';
        statusDiv.textContent = 'Model is thinking...';
        sendButton.disabled = true;

        try {
            const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: conversationHistory,
                    stream: false
                }),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            conversationHistory.push(data.message);
            addMessageToChat(data.message.content, 'assistant-message');

            // --- 3. Updated Token Information Display ---
            const promptTokens = data.prompt_eval_count;
            const responseTokens = data.eval_count;
            const evalDurationInSeconds = data.eval_duration / 1e9; // Convert nanoseconds to seconds
            const tokensPerSecond = (evalDurationInSeconds > 0) ? (responseTokens / evalDurationInSeconds).toFixed(2) : 0;

            statusDiv.textContent = `Ready | Prompt: ${promptTokens} | Response: ${responseTokens} | Speed: ${tokensPerSecond} tok/s`;

        } catch (error) {
            console.error('Error during chat:', error);
            statusDiv.textContent = 'Error communicating with Ollama API.';
            addMessageToChat('Sorry, there was an error. Make sure Ollama is running and accessible.', 'assistant-message');
        } finally {
            sendButton.disabled = false;
            promptInput.focus();
        }
    }

    // --- Helper function to add messages to the UI ---
    function addMessageToChat(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${className}`;
        messageDiv.textContent = text;
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to bottom
    }

    // --- Event Listeners ---
    sendButton.addEventListener('click', handleChat);
    promptInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChat();
        }
    });

    // --- Initial Load ---
    document.addEventListener('DOMContentLoaded', populateModels);

</script>
</body>
</html>
```
