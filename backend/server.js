const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OpenAI Configuration
let openai = null;
let isOpenAIConfigured = false;

// Initialize OpenAI
function initializeOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.log('⚠️  OpenAI API key not found. Set OPENAI_API_KEY in environment variables.');
    console.log('💡 Falling back to basic error responses.');
    return;
  }

  try {
    openai = new OpenAI({
      apiKey: apiKey,
    });
    isOpenAIConfigured = true;
    console.log('✅ OpenAI service initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI service:', error.message);
    console.log('💡 Falling back to basic error responses.');
  }
}

// Initialize OpenAI on startup
initializeOpenAI();

// Simple fallback responses when OpenAI is not available
const fallbackResponses = [
  "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later!",
  "Oops! My AI service is taking a coffee break. I'll be back soon!",
  "I'm experiencing some technical difficulties. Please try again in a moment.",
  "My AI brain is temporarily offline. I'll be back to help you soon!",
  "I'm having connection issues. Please try again later!",
  "I'm currently unable to process your request. Please try again in a moment.",
  "My AI service is temporarily unavailable. I'll be back online soon!",
  "I'm sorry, I can't respond right now. Please try again later!"
];

// Function to get a random fallback response
function getFallbackResponse() {
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

// Function to generate OpenAI response
async function generateOpenAIResponse(message, conversationHistory = []) {
  if (!isOpenAIConfigured || !openai) {
    return null;
  }

  try {
    // Prepare conversation context
    const messages = [
      {
        role: "system",
        content: `You are a professional solar systems salesperson. You're friendly, knowledgeable, and focused on helping customers find the right solar solution.

        AVAILABLE SOLAR PACKAGES:
        1. STARTER PACK - 3kW system, 12 panels, $8,999 - Perfect for small homes
        2. FAMILY PACK - 6kW system, 24 panels, $15,999 - Ideal for medium families  
        3. PREMIUM PACK - 9kW system, 36 panels, $22,999 - Best for large homes
        4. BUSINESS PACK - 15kW system, 60 panels, $35,999 - Commercial solutions
        5. MEGA PACK - 20kW system, 80 panels, $45,999 - Maximum power & savings

        RESPONSE GUIDELINES:
        - Keep responses SHORT (under 50 words)
        - Be sales-focused but helpful
        - Mention specific packages when relevant
        - Use simple language
        - Ask qualifying questions
        - Focus on benefits: savings, eco-friendly, ROI
        - Always be ready to quote a package`
      },
      ...conversationHistory,
      {
        role: "user",
        content: message
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.1,
      presence_penalty: 0.1,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    
    if (response) {
      console.log('🤖 OpenAI response generated successfully');
      return response;
    } else {
      console.log('⚠️  Empty response from OpenAI');
      return null;
    }

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      console.log('💳 OpenAI quota exceeded. Please check your billing.');
    } else if (error.code === 'invalid_api_key') {
      console.log('🔑 Invalid OpenAI API key. Please check your configuration.');
    } else if (error.code === 'rate_limit_exceeded') {
      console.log('⏱️  OpenAI rate limit exceeded. Please try again later.');
    }
    
    return null;
  }
}

// Function to check if OpenAI is available
function isOpenAIAvailable() {
  return isOpenAIConfigured && openai !== null;
}

// Function to get OpenAI status
function getOpenAIStatus() {
  return {
    configured: isOpenAIConfigured,
    available: isOpenAIAvailable(),
    hasApiKey: !!process.env.OPENAI_API_KEY
  };
}

// API Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Solar Sales AI Chatbot API is running!',
    version: '2.0.0',
    description: 'AI-powered solar systems salesperson with 5 available packages',
    role: 'Professional Solar Systems Salesperson',
    packages: {
      'STARTER PACK': '3kW system, 12 panels, $8,999 - Small homes',
      'FAMILY PACK': '6kW system, 24 panels, $15,999 - Medium families',
      'PREMIUM PACK': '9kW system, 36 panels, $22,999 - Large homes',
      'BUSINESS PACK': '15kW system, 60 panels, $35,999 - Commercial',
      'MEGA PACK': '20kW system, 80 panels, $45,999 - Maximum power'
    },
    endpoints: {
      'POST /api/chat': 'Chat with the solar sales AI',
      'GET /api/health': 'Check API health status',
      'GET /api/openai/status': 'Check OpenAI service status',
      'GET /api/fallback-responses': 'View fallback responses (debug)'
    },
    features: {
      'Solar Sales Focus': 'Specialized in solar system sales',
      'Package Recommendations': '5 different solar packages available',
      'Short Responses': 'Concise, sales-focused communication',
      'Conversation Context': 'Maintains chat history for better sales'
    },
    status: {
      'OpenAI Available': isOpenAIAvailable(),
      'Fallback Mode': !isOpenAIAvailable()
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    openaiStatus: getOpenAIStatus()
  });
});

// OpenAI status endpoint
app.get('/api/openai/status', (req, res) => {
  res.json({
    openai: getOpenAIStatus(),
    timestamp: new Date().toISOString()
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }
    
    let response;
    let responseSource = 'fallback';
    
    // Try OpenAI first if available
    if (isOpenAIAvailable()) {
      try {
        console.log('🤖 Attempting OpenAI response...');
        const openaiResponse = await generateOpenAIResponse(message, conversationHistory);
        
        if (openaiResponse) {
          response = openaiResponse;
          responseSource = 'openai';
          console.log('✅ OpenAI response generated');
        } else {
          throw new Error('OpenAI returned empty response');
        }
      } catch (openaiError) {
        console.log('⚠️  OpenAI failed, using basic error response:', openaiError.message);
        // Fall back to basic fallback responses
        response = getFallbackResponse();
        responseSource = 'fallback';
      }
    } else {
      // Use fallback responses
      console.log('📝 Using basic error response (OpenAI not available)');
      response = getFallbackResponse();
      responseSource = 'fallback';
    }
    
    // Simulate thinking time (shorter for OpenAI, longer for fallback)
    const thinkingTime = responseSource === 'openai' 
      ? Math.random() * 500 + 200  // 200-700ms for OpenAI
      : Math.random() * 1000 + 500; // 500-1500ms for fallback
    
    setTimeout(() => {
      res.json({
        success: true,
        response: response,
        responseSource: responseSource,
        timestamp: new Date().toISOString(),
        userId: userId || 'anonymous',
        openaiStatus: getOpenAIStatus()
      });
    }, thinkingTime);
    
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your message',
      openaiStatus: getOpenAIStatus()
    });
  }
});

// Get fallback responses (for debugging)
app.get('/api/fallback-responses', (req, res) => {
  res.json({
    fallbackResponses: fallbackResponses,
    count: fallbackResponses.length,
    message: 'These are basic fallback responses used when OpenAI is not available'
  });
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

// Start HTTP server
app.listen(PORT, () => {
  console.log(`🚀 Chatbot server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
