# OpenAI Integration Setup Guide

This guide explains how to set up OpenAI integration for generating dynamic chatbot responses.

## Quick Start

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `sk-`)

### 2. Set Environment Variable

Create a `.env` file in the backend directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Other existing variables...
PORT=3000
HTTPS_PORT=3443
USE_HTTPS=false
NODE_ENV=development
CORS_ORIGIN=*
```

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# With HTTPS
npm run dev:https
```

## How It Works

### Response Generation Flow

1. **OpenAI First**: If API key is configured, tries OpenAI first
2. **Fallback**: If OpenAI fails, falls back to predefined responses
3. **Error Handling**: Graceful degradation with proper error messages

### API Response Format

```json
{
  "success": true,
  "response": "AI-generated response here",
  "responseSource": "openai", // or "predefined"
  "category": "default",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userId": "user_123",
  "openaiStatus": {
    "configured": true,
    "available": true,
    "hasApiKey": true
  }
}
```

## Configuration Options

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `NODE_ENV` - Environment (development/production)

### OpenAI Service Settings

The service is configured with these defaults:
- **Model**: `gpt-3.5-turbo`
- **Max Tokens**: 150
- **Temperature**: 0.7
- **Top P**: 1.0
- **Frequency Penalty**: 0.1
- **Presence Penalty**: 0.1

## API Endpoints

### Check OpenAI Status

```bash
GET /api/openai/status
```

Response:
```json
{
  "openai": {
    "configured": true,
    "available": true,
    "hasApiKey": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Health Check (includes OpenAI status)

```bash
GET /api/health
```

### Chat Endpoint

```bash
POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "userId": "user_123",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant", 
      "content": "Previous response"
    }
  ]
}
```

## Error Handling

### Common Issues

1. **Missing API Key**
   - Error: "OpenAI API key not found"
   - Solution: Set `OPENAI_API_KEY` in `.env` file

2. **Invalid API Key**
   - Error: "Invalid OpenAI API key"
   - Solution: Check your API key is correct

3. **Quota Exceeded**
   - Error: "OpenAI quota exceeded"
   - Solution: Check your OpenAI billing/usage

4. **Rate Limit**
   - Error: "OpenAI rate limit exceeded"
   - Solution: Wait and retry, or upgrade your plan

### Fallback Behavior

When OpenAI is unavailable:
- Automatically falls back to predefined responses
- Logs the error for debugging
- Continues serving requests normally
- Shows status in API responses

## Testing

### Test OpenAI Integration

```bash
# Check status
curl http://localhost:3000/api/openai/status

# Test chat with OpenAI
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, tell me a joke!", "userId": "test"}'
```

### Test Fallback

```bash
# Remove API key temporarily
export OPENAI_API_KEY=""

# Restart server and test
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "userId": "test"}'
```

## Cost Management

### Token Usage

- **Max Tokens**: 150 per response (configurable)
- **Model**: GPT-3.5-turbo (cost-effective)
- **Temperature**: 0.7 (balanced creativity)

### Estimated Costs

- **GPT-3.5-turbo**: ~$0.002 per 1K tokens
- **150 tokens**: ~$0.0003 per response
- **1000 responses**: ~$0.30

### Optimization Tips

1. **Limit max_tokens** for shorter responses
2. **Use conversation history** to reduce context
3. **Implement caching** for common questions
4. **Monitor usage** in OpenAI dashboard

## Security

### API Key Protection

- Store API key in `.env` file (not in code)
- Never commit `.env` to version control
- Use different keys for dev/prod
- Rotate keys regularly

### Rate Limiting

- OpenAI has built-in rate limits
- Consider implementing additional rate limiting
- Monitor usage patterns

## Monitoring

### Logs

The service logs:
- OpenAI initialization status
- API call success/failure
- Fallback usage
- Error details

### Metrics

Track:
- Response source (OpenAI vs predefined)
- Error rates
- Response times
- Token usage

## Troubleshooting

### Debug Mode

Enable detailed logging:
```bash
NODE_ENV=development npm run dev
```

### Common Solutions

1. **"OpenAI not available"**
   - Check API key is set correctly
   - Verify internet connection
   - Check OpenAI service status

2. **"Empty response"**
   - Check API key permissions
   - Verify account has credits
   - Check rate limits

3. **"Rate limit exceeded"**
   - Wait before retrying
   - Implement exponential backoff
   - Consider upgrading plan

## Production Deployment

### Environment Setup

```bash
# Production environment
NODE_ENV=production
OPENAI_API_KEY=sk-your-production-key
```

### Monitoring

- Set up logging aggregation
- Monitor API usage and costs
- Implement health checks
- Set up alerts for failures

### Scaling

- Consider response caching
- Implement request queuing
- Use multiple API keys (with rotation)
- Monitor and optimize token usage
