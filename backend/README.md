# Chatbot Backend

A Node.js backend API for the AI chatbot with predefined responses and intelligent keyword matching.

## Features

- 🤖 **Intelligent Response System** - Keyword-based response matching with contextual enhancement
- 📝 **Predefined Responses** - Organized response categories for different conversation types
- 🔄 **Real-time API** - RESTful API endpoints for frontend integration
- 🎯 **Context Awareness** - Responses adapt based on message context (questions, exclamations, etc.)
- 🛡️ **Error Handling** - Robust error handling and fallback responses
- 📊 **Health Monitoring** - Health check endpoints for monitoring

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

```bash
# HTTP only (default)
npm run dev
npm start

# With HTTPS support
npm run generate-ssl  # Generate certificates first
npm run dev:https
npm run start:https
```

**Server URLs:**
- HTTP: `http://localhost:3000`
- HTTPS: `https://localhost:3443`

### 3. Test the API

```bash
# Health check
curl http://localhost:3000/api/health

# Send a message
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "userId": "test_user"}'
```

## API Endpoints

### POST /api/chat
Send a message to the chatbot and get a response.

**Request Body:**
```json
{
  "message": "Hello! How are you?",
  "userId": "optional_user_id"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I'm doing well, thank you for asking! How are you?",
  "category": "howAreYou",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "optional_user_id"
}
```

### GET /api/health
Check the health status of the API.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

### GET /api/categories
Get all available response categories.

### GET /api/categories/:category
Get responses for a specific category.

## Response Categories

The chatbot has predefined responses for various conversation types:

- **greetings** - Hello, hi, hey, good morning/afternoon/evening
- **help** - Help, assist, support requests
- **thanks** - Thank you, thanks, appreciate
- **goodbye** - Bye, goodbye, see you, farewell
- **name** - Questions about the bot's identity
- **weather** - Weather-related questions
- **time** - Time-related questions
- **jokes** - Joke requests
- **howAreYou** - How are you questions
- **capabilities** - What can you do questions
- **default** - General conversation responses

## Configuration

The server can be configured using environment variables:

- `PORT` - HTTP server port (default: 3000)
- `HTTPS_PORT` - HTTPS server port (default: 3443)
- `USE_HTTPS` - Enable HTTPS server (default: false)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - CORS origin (default: *)

### SSL/HTTPS Setup

For HTTPS support, see [SSL_SETUP.md](SSL_SETUP.md) for detailed instructions.

**Quick SSL setup:**
```bash
npm run generate-ssl  # Generate self-signed certificates
npm run dev:https     # Start with HTTPS enabled
```

## Development

### Project Structure

```
backend/
├── server.js          # Main server file
├── config.js          # Configuration settings
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

### Adding New Responses

To add new responses, edit the `responses` object in `server.js`:

```javascript
const responses = {
  newCategory: [
    "Response 1",
    "Response 2",
    "Response 3"
  ]
};
```

Then add keyword mapping:

```javascript
const keywordMap = {
  'new_keyword': 'newCategory'
};
```

### Testing

Test the API using curl, Postman, or any HTTP client:

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me a joke"}'
```

## Integration with Frontend

The frontend automatically connects to the backend API. Make sure the backend is running on port 3000 before opening the chatbot frontend.

The frontend will:
1. Test the backend connection on load
2. Send messages to `/api/chat` endpoint
3. Display responses from the backend
4. Fall back to local responses if backend is unavailable

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure CORS is properly configured
2. **Port Already in Use**: Change the PORT in config.js or kill the process using port 3000
3. **Module Not Found**: Run `npm install` to install dependencies

### Logs

The server logs important information to the console:
- Server startup confirmation
- API request logs
- Error messages

## License

ISC
