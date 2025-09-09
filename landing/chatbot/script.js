// Floating Chatbot JavaScript functionality
class FloatingChatbotCore {
    constructor() {
        this.chatMessages = document.getElementById('chatbotMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.attachBtn = document.getElementById('attachBtn');
        
        this.isTyping = false;
        this.messageCount = 0;
        this.apiUrl = this.detectApiUrl();
        this.userId = this.generateUserId();
        
        this.initializeEventListeners();
        this.initializeBot();
    }
    
    initializeEventListeners() {
        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize input
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });
        
        // Attach button
        this.attachBtn.addEventListener('click', () => this.showAttachOptions());
    }
    
    initializeBot() {
        // Generate a unique user ID for this session
        this.userId = this.generateUserId();
        
        // Test backend connection
        this.testBackendConnection();
    }
    
    generateUserId() {
        return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    detectApiUrl() {
        // Auto-detect if we're running on HTTPS or HTTP
        const protocol = window.location.protocol;
        const isHttps = protocol === 'https:';
        
        if (isHttps) {
            return 'https://localhost:3443/api/chat';
        } else {
            return 'http://localhost:3000/api/chat';
        }
    }
    
    getHealthUrl() {
        const protocol = window.location.protocol;
        const isHttps = protocol === 'https:';
        
        if (isHttps) {
            return 'https://localhost:3443/api/health';
        } else {
            return 'http://localhost:3000/api/health';
        }
    }
    
    async testBackendConnection() {
        const healthUrl = this.getHealthUrl();
        try {
            const response = await fetch(healthUrl);
            if (response.ok) {
                console.log('✅ Backend connected successfully');
                if (window.floatingChatbot) {
                    window.floatingChatbot.addSystemMessage(`Backend connected! Ready to chat with AI responses. (${window.location.protocol}//localhost:${window.location.protocol === 'https:' ? '3443' : '3000'})`);
                }
            } else {
                console.log('⚠️ Backend connection failed, using fallback responses');
                if (window.floatingChatbot) {
                    window.floatingChatbot.addSystemMessage('Backend offline. Using basic responses.');
                }
            }
        } catch (error) {
            console.log('⚠️ Backend not available, using fallback responses');
            if (window.floatingChatbot) {
                window.floatingChatbot.addSystemMessage('Backend offline. Using basic responses.');
            }
        }
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Try to get response from backend
            const response = await this.getBotResponse(message);
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Error getting bot response:', error);
            this.hideTypingIndicator();
            // Fallback to local response
            const fallbackResponse = this.getFallbackResponse(message);
            this.addMessage(fallbackResponse, 'bot');
        }
    }
    
    async getBotResponse(message) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: this.userId
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    }
    
    getFallbackResponse(message) {
        // Fallback responses when backend is not available
        const fallbackResponses = [
            "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!",
            "Oops! My backend is taking a coffee break. I'll be back soon!",
            "I'm experiencing some technical difficulties. Please try again in a moment.",
            "My AI brain is temporarily offline. I'll be back to help you soon!",
            "I'm having connection issues. Please try again later!"
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    addMessage(content, sender) {
        if (window.floatingChatbot) {
            window.floatingChatbot.addMessage(content, sender);
        }
    }
    
    showTypingIndicator() {
        if (window.floatingChatbot) {
            window.floatingChatbot.showTypingIndicator();
        }
    }
    
    hideTypingIndicator() {
        if (window.floatingChatbot) {
            window.floatingChatbot.hideTypingIndicator();
        }
    }
    
    showAttachOptions() {
        // Add file attachment functionality
        alert('File attachment feature would be implemented here!');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for floating chatbot to be initialized
    setTimeout(() => {
        window.floatingChatbotCore = new FloatingChatbotCore();
    }, 100);
});

// Add some fun interactions
document.addEventListener('keydown', (e) => {
    // Press Ctrl+Enter for new line in input
    if (e.ctrlKey && e.key === 'Enter') {
        const input = document.getElementById('messageInput');
        if (input) {
            input.value += '\n';
            input.focus();
        }
    }
});

// Add some Easter eggs
const easterEggs = {
    'konami': () => {
        const messages = [
            '🎮 Konami Code detected! You found the secret!',
            'Up, Up, Down, Down, Left, Right, Left, Right, B, A!',
            'You\'re a true gamer! 🎯'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        if (window.floatingChatbot) {
            window.floatingChatbot.addMessage(message, 'bot');
        }
    }
};

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        easterEggs.konami();
        konamiCode = [];
    }
});
