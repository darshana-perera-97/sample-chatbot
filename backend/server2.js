const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Predefined responses database
const responses = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! What brings you here?",
    "Greetings! I'm here to assist you.",
    "Hey! Great to see you. What can I do for you?",
    "Welcome! I'm your AI assistant, ready to help."
  ],
  help: [
    "I'm here to help! What do you need assistance with?",
    "Sure! I'd be happy to help. What's the issue?",
    "I'm ready to assist. What can I do for you?",
    "How can I make your day better?",
    "I'm at your service! What do you need?"
  ],
  thanks: [
    "You're welcome!",
    "Happy to help!",
    "My pleasure!",
    "Glad I could assist!",
    "Anytime! That's what I'm here for."
  ],
  goodbye: [
    "Goodbye! Have a great day!",
    "See you later!",
    "Take care!",
    "Farewell!",
    "Until next time!"
  ],
  name: [
    "I'm an AI assistant created to help you.",
    "You can call me your AI assistant.",
    "I'm here to be your helpful AI companion.",
    "I'm your friendly neighborhood AI assistant!",
    "I'm a chatbot designed to assist and chat with you."
  ],
  weather: [
    "I don't have access to real-time weather data, but I can help you find weather information online.",
    "For current weather, I'd recommend checking a weather website or app.",
    "I can't check the weather, but I can help you with other things!",
    "Weather information isn't in my database, but I'm happy to help with other questions."
  ],
  time: [
    "I don't have access to the current time, but you can check your device's clock.",
    "For the current time, please check your system clock.",
    "I can't tell time, but I can help you with many other things!",
    "Time isn't something I can track, but I'm here for other assistance."
  ],
  jokes: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "What do you call a fake noodle? An impasta!",
    "Why did the scarecrow win an award? He was outstanding in his field!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why don't eggs tell jokes? They'd crack each other up!",
    "What do you call a fish wearing a bowtie? So-fish-ticated!",
    "Why did the math book look so sad? Because it had too many problems!",
    "What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!"
  ],
  howAreYou: [
    "I'm doing well, thank you for asking! How are you?",
    "I'm functioning perfectly! How can I help you today?",
    "I'm great! Ready to assist you with anything.",
    "I'm excellent! Thanks for asking. How are you doing?",
    "I'm fantastic! Always happy to chat. What about you?"
  ],
  capabilities: [
    "I can chat with you, answer questions, help with problems, tell jokes, and have conversations!",
    "I'm here to have conversations, answer questions, and help however I can.",
    "I can talk about various topics, help solve problems, and be your AI companion!",
    "I can help with questions, have friendly chats, tell jokes, and assist with various topics!",
    "I'm designed to be your helpful AI friend - I can chat, answer questions, and provide assistance!"
  ],
  default: [
    "That's interesting! Tell me more about that.",
    "I understand what you're saying. How can I help you further?",
    "Thanks for sharing that with me. What else would you like to know?",
    "I see. Is there anything specific you'd like me to help you with?",
    "That's a great question! Let me think about that for a moment.",
    "I appreciate you taking the time to explain that to me.",
    "That makes sense. What would you like to do next?",
    "I'm here to help! What other questions do you have?",
    "That's a good point. I hadn't considered that perspective.",
    "I'm learning from our conversation. What else can you tell me?",
    "That's fascinating! I'd love to hear more about your thoughts on this.",
    "I see what you mean. That's a really interesting perspective.",
    "Thanks for that insight! It gives me something to think about.",
    "That's a thoughtful observation. What made you think of that?",
    "I find that really interesting. Can you elaborate on that?"
  ]
};

// Keyword mapping for response selection
const keywordMap = {
  'hello': 'greetings',
  'hi': 'greetings',
  'hey': 'greetings',
  'good morning': 'greetings',
  'good afternoon': 'greetings',
  'good evening': 'greetings',
  'help': 'help',
  'assist': 'help',
  'support': 'help',
  'thank': 'thanks',
  'thanks': 'thanks',
  'appreciate': 'thanks',
  'bye': 'goodbye',
  'goodbye': 'goodbye',
  'see you': 'goodbye',
  'farewell': 'goodbye',
  'name': 'name',
  'who are you': 'name',
  'what are you': 'name',
  'weather': 'weather',
  'time': 'time',
  'joke': 'jokes',
  'funny': 'jokes',
  'laugh': 'jokes',
  'how are you': 'howAreYou',
  'how do you feel': 'howAreYou',
  'what can you do': 'capabilities',
  'abilities': 'capabilities',
  'features': 'capabilities'
};

// Function to find the best response category
function findResponseCategory(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for exact keyword matches first
  for (const [keyword, category] of Object.entries(keywordMap)) {
    if (lowerMessage.includes(keyword)) {
      return category;
    }
  }
  
  // Check for question patterns
  if (lowerMessage.includes('?')) {
    return 'default';
  }
  
  // Check for exclamation patterns
  if (lowerMessage.includes('!')) {
    return 'default';
  }
  
  return 'default';
}

// Function to get a random response from a category
function getRandomResponse(category) {
  const responseList = responses[category] || responses.default;
  return responseList[Math.floor(Math.random() * responseList.length)];
}

// Function to enhance response based on context
function enhanceResponse(response, originalMessage) {
  const lowerMessage = originalMessage.toLowerCase();
  
  // Add contextual prefixes
  if (lowerMessage.includes('?')) {
    response = "That's a great question! " + response;
  }
  
  if (lowerMessage.includes('!')) {
    response = "I can see you're excited about that! " + response;
  }
  
  if (lowerMessage.includes('please')) {
    response = "Of course! " + response;
  }
  
  if (lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
    response = "I understand this is important. " + response;
  }
  
  return response;
}

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Chatbot API is running!',
    version: '1.0.0',
    endpoints: {
      'POST /api/chat': 'Send a message to the chatbot',
      'GET /api/health': 'Check API health status'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/chat', (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }
    
    // Find the appropriate response category
    const category = findResponseCategory(message);
    
    // Get a random response from that category
    let response = getRandomResponse(category);
    
    // Enhance the response based on context
    response = enhanceResponse(response, message);
    
    // Simulate thinking time (optional)
    const thinkingTime = Math.random() * 1000 + 500; // 500-1500ms
    
    setTimeout(() => {
      res.json({
        success: true,
        response: response,
        category: category,
        timestamp: new Date().toISOString(),
        userId: userId || 'anonymous'
      });
    }, thinkingTime);
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your message'
    });
  }
});

// Get all available response categories
app.get('/api/categories', (req, res) => {
  res.json({
    categories: Object.keys(responses),
    keywordMap: keywordMap
  });
});

// Get responses for a specific category
app.get('/api/categories/:category', (req, res) => {
  const { category } = req.params;
  
  if (responses[category]) {
    res.json({
      category: category,
      responses: responses[category],
      count: responses[category].length
    });
  } else {
    res.status(404).json({
      error: 'Category not found',
      availableCategories: Object.keys(responses)
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'The requested endpoint does not exist'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chatbot server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
