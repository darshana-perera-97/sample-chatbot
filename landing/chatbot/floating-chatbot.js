// Floating Chatbot JavaScript functionality
class FloatingChatbot {
    constructor() {
        this.chatbotToggle = document.getElementById('chatbotToggle');
        this.chatbotWidget = document.getElementById('chatbotWidget');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.notificationBadge = document.getElementById('notificationBadge');
        
        this.isOpen = false;
        this.isMinimized = false;
        this.hasNewMessage = false;
        
        this.initializeEventListeners();
        this.initializeChatbot();
    }
    
    initializeEventListeners() {
        // Toggle chatbot
        this.chatbotToggle.addEventListener('click', () => this.toggleChatbot());
        
        // Minimize chatbot
        this.minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeChatbot();
        });
        
        // Close chatbot
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeChatbot();
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatbotWidget.contains(e.target) && !this.chatbotToggle.contains(e.target)) {
                this.closeChatbot();
            }
        });
        
        // Prevent widget clicks from closing
        this.chatbotWidget.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    initializeChatbot() {
        // Show notification badge initially
        this.showNotification();
        
        // Auto-open after 3 seconds
        setTimeout(() => {
            if (!this.isOpen) {
                this.showNotification();
            }
        }, 3000);
    }
    
    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }
    
    openChatbot() {
        this.chatbotWidget.classList.add('show');
        this.isOpen = true;
        this.isMinimized = false;
        this.hideNotification();
        
        // Focus on input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            setTimeout(() => messageInput.focus(), 300);
        }
        
        // Add opening animation
        this.chatbotWidget.style.transform = 'translateY(20px) scale(0.9)';
        this.chatbotWidget.style.opacity = '0';
        
        setTimeout(() => {
            this.chatbotWidget.style.transform = 'translateY(0) scale(1)';
            this.chatbotWidget.style.opacity = '1';
        }, 50);
    }
    
    closeChatbot() {
        this.chatbotWidget.classList.remove('show');
        this.isOpen = false;
        this.isMinimized = false;
        
        // Add closing animation
        this.chatbotWidget.style.transform = 'translateY(20px) scale(0.9)';
        this.chatbotWidget.style.opacity = '0';
        
        setTimeout(() => {
            this.chatbotWidget.style.transform = 'translateY(20px)';
            this.chatbotWidget.style.opacity = '0';
        }, 200);
    }
    
    minimizeChatbot() {
        if (this.isMinimized) {
            // Restore
            this.chatbotWidget.style.height = '500px';
            this.minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
            this.isMinimized = false;
        } else {
            // Minimize
            this.chatbotWidget.style.height = '60px';
            this.minimizeBtn.innerHTML = '<i class="fas fa-plus"></i>';
            this.isMinimized = true;
        }
    }
    
    showNotification() {
        this.notificationBadge.style.display = 'flex';
        this.hasNewMessage = true;
        
        // Add pulse animation
        this.chatbotToggle.style.animation = 'pulse 1s infinite';
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (this.hasNewMessage) {
                this.hideNotification();
            }
        }, 10000);
    }
    
    hideNotification() {
        this.notificationBadge.style.display = 'none';
        this.hasNewMessage = false;
        this.chatbotToggle.style.animation = 'none';
    }
    
    // Method to add new message (called by main chatbot)
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
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
        
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        
        // Show notification if chatbot is closed
        if (!this.isOpen && sender === 'bot') {
            this.showNotification();
        }
        
        // Remove new-message class after animation
        setTimeout(() => {
            messageDiv.classList.remove('new-message');
        }, 300);
    }
    
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
    
    // Method to show typing indicator
    showTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.add('show');
            this.scrollToBottom();
        }
    }
    
    // Method to hide typing indicator
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('show');
        }
    }
    
    // Method to add system message
    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-bubble system-bubble">
                    <p><i class="fas fa-info-circle"></i> ${message}</p>
                </div>
            </div>
        `;
        messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }
}

// Initialize floating chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.floatingChatbot = new FloatingChatbot();
});
