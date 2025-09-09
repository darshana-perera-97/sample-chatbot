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
        // Add some initial bot responses
        this.botResponses = [
            "That's interesting! Tell me more about that.",
            "I understand what you're saying. How can I help you further?",
            "Thanks for sharing that with me. What else would you like to know?",
            "I see. Is there anything specific you'd like me to help you with?",
            "That's a great question! Let me think about that for a moment.",
            "I appreciate you taking the time to explain that to me.",
            "That makes sense. What would you like to do next?",
            "I'm here to help! What other questions do you have?",
            "That's a good point. I hadn't considered that perspective.",
            "I'm learning from our conversation. What else can you tell me?"
        ];
        
        this.keywords = {
            'hello': ['Hello! How can I help you today?', 'Hi there! What brings you here?', 'Greetings! I\'m here to assist you.'],
            'help': ['I\'m here to help! What do you need assistance with?', 'Sure! I\'d be happy to help. What\'s the issue?', 'I\'m ready to assist. What can I do for you?'],
            'thank': ['You\'re welcome!', 'Happy to help!', 'My pleasure!', 'Glad I could assist!'],
            'bye': ['Goodbye! Have a great day!', 'See you later!', 'Take care!', 'Farewell!'],
            'name': ['I\'m an AI assistant created to help you.', 'You can call me your AI assistant.', 'I\'m here to be your helpful AI companion.'],
            'weather': ['I don\'t have access to real-time weather data, but I can help you find weather information online.', 'For current weather, I\'d recommend checking a weather website or app.'],
            'time': ['I don\'t have access to the current time, but you can check your device\'s clock.', 'For the current time, please check your system clock.'],
            'joke': ['Why don\'t scientists trust atoms? Because they make up everything!', 'What do you call a fake noodle? An impasta!', 'Why did the scarecrow win an award? He was outstanding in his field!'],
            'how are you': ['I\'m doing well, thank you for asking! How are you?', 'I\'m functioning perfectly! How can I help you today?', 'I\'m great! Ready to assist you with anything.'],
            'what can you do': ['I can chat with you, answer questions, help with problems, tell jokes, and have conversations!', 'I\'m here to have conversations, answer questions, and help however I can.', 'I can talk about various topics, help solve problems, and be your AI companion!']
        };
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate bot thinking time
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateBotResponse(message);
        }, 1000 + Math.random() * 2000);
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
    
    generateBotResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';
        
        // Check for keyword matches
        for (const [keyword, responses] of Object.entries(this.keywords)) {
            if (lowerMessage.includes(keyword)) {
                response = responses[Math.floor(Math.random() * responses.length)];
                break;
            }
        }
        
        // If no keyword match, use random response
        if (!response) {
            response = this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
        }
        
        // Add some contextual responses
        if (lowerMessage.includes('?')) {
            response = "That's a great question! " + response;
        }
        
        if (lowerMessage.includes('!')) {
            response = "I can see you're excited about that! " + response;
        }
        
        this.addMessage(response, 'bot');
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
