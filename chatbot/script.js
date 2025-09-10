// Chatbot JavaScript functionality
class Chatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.attachBtn = document.getElementById('attachBtn');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.closeBtn = document.getElementById('closeBtn');
        
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
        
        // Header button events
        this.minimizeBtn.addEventListener('click', () => this.minimizeChat());
        this.closeBtn.addEventListener('click', () => this.closeChat());
        this.attachBtn.addEventListener('click', () => this.showAttachOptions());
        
        // Focus input on load
        this.messageInput.focus();
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
        return "http://93.127.136.228:5000/api/chat";
        // return "https://sample-chatbot-a4wo.onrender.com/api/chat";
        // return 'http://localhost:3000/api/chat';
    }
    
    getHealthUrl() {
        return "http://93.127.136.228:5000/api/health";
        // return "https://sample-chatbot-a4wo.onrender.com/api/health";
        // return 'http://localhost:3000/api/health';
    }
    
    async testBackendConnection() {
        const healthUrl = this.getHealthUrl();
        try {
            const response = await fetch(healthUrl);
            if (response.ok) {
                console.log('✅ Backend connected successfully');
                this.addSystemMessage('Ready to chat with AI responses.');
            } else {
                console.log('⚠️ Backend connection failed, using fallback responses');
                this.addSystemMessage('Backend offline. Using basic responses.');
            }
        } catch (error) {
            console.log('⚠️ Backend not available, using fallback responses');
            this.addSystemMessage('Backend offline. Using basic responses.');
        }
    }
    
    addSystemMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble system-bubble">
                    <p><i class="fas fa-info-circle"></i> ${message}</p>
                </div>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
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
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message new-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        messageBubble.innerHTML = `<p>${this.escapeHtml(content)}</p>`;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();
        
        messageContent.appendChild(messageBubble);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Remove new-message class after animation
        setTimeout(() => {
            messageDiv.classList.remove('new-message');
        }, 300);
    }
    
    
    showTypingIndicator() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.typingIndicator.classList.remove('show');
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
    
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    minimizeChat() {
        // Add minimize functionality
        const container = document.querySelector('.chatbot-container');
        container.style.transform = 'scale(0.8)';
        container.style.opacity = '0.7';
        
        setTimeout(() => {
            container.style.transform = 'scale(1)';
            container.style.opacity = '1';
        }, 200);
    }
    
    closeChat() {
        // Add close functionality
        if (confirm('Are you sure you want to close the chat?')) {
            document.body.style.display = 'none';
        }
    }
    
    showAttachOptions() {
        // Add file attachment functionality
        alert('File attachment feature would be implemented here!');
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

// Add some fun interactions
document.addEventListener('keydown', (e) => {
    // Press Ctrl+Enter for new line in input
    if (e.ctrlKey && e.key === 'Enter') {
        const input = document.getElementById('messageInput');
        input.value += '\n';
        input.focus();
    }
});

// Add click outside to focus input
document.addEventListener('click', (e) => {
    if (!e.target.closest('.chatbot-container')) {
        document.getElementById('messageInput').focus();
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
        document.getElementById('chatMessages').innerHTML += `
            <div class="message bot-message new-message">
                <div class="message-avatar"><i class="fas fa-robot"></i></div>
                <div class="message-content">
                    <div class="message-bubble"><p>${message}</p></div>
                    <div class="message-time">${new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        `;
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
