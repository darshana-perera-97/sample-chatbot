# SSL/HTTPS Setup Guide

This guide explains how to set up SSL/HTTPS for the chatbot backend.

## Quick Start

### 1. Generate SSL Certificates

```bash
cd backend
npm run generate-ssl
```

This will create self-signed certificates in the `ssl/` directory.

### 2. Start with HTTPS

```bash
# Development mode with HTTPS
npm run dev:https

# Production mode with HTTPS
npm run start:https
```

### 3. Access the API

- **HTTP**: http://localhost:3000
- **HTTPS**: https://localhost:3443

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
HTTPS_PORT=3443
USE_HTTPS=true

# Environment
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*
```

## Available Scripts

- `npm start` - Start HTTP server only
- `npm run start:https` - Start both HTTP and HTTPS servers
- `npm run dev` - Development mode (HTTP only)
- `npm run dev:https` - Development mode (HTTP + HTTPS)
- `npm run generate-ssl` - Generate self-signed certificates

## SSL Certificate Files

The SSL setup creates these files in the `ssl/` directory:

- `server.key` - Private key
- `server.crt` - Self-signed certificate

## Browser Security Warning

When using self-signed certificates, your browser will show a security warning. This is normal for development:

1. Click "Advanced" or "Show Details"
2. Click "Proceed to localhost (unsafe)" or "Continue to this website"
3. The site will load normally

## Production SSL Setup

For production, replace the self-signed certificates with real SSL certificates:

1. Obtain SSL certificates from a trusted CA (Let's Encrypt, etc.)
2. Replace `ssl/server.key` and `ssl/server.crt` with your certificates
3. Set `USE_HTTPS=true` in your environment

## Troubleshooting

### Certificate Generation Fails

**Error**: `OpenSSL is not installed`

**Solution**: Install OpenSSL:
- Windows: Download from https://slproweb.com/products/Win32OpenSSL.html
- macOS: `brew install openssl`
- Linux: `sudo apt-get install openssl`

### HTTPS Server Won't Start

**Error**: `Error loading SSL certificates`

**Solution**: 
1. Run `npm run generate-ssl` to create certificates
2. Check that `ssl/server.key` and `ssl/server.crt` exist
3. Verify file permissions

### Frontend Can't Connect to HTTPS Backend

**Solution**: 
1. Make sure the frontend is served over HTTPS
2. Check that the backend is running on port 3443
3. Verify CORS settings allow the frontend origin

## Security Notes

- Self-signed certificates are for development only
- Never use self-signed certificates in production
- Always use HTTPS in production environments
- Keep your private key secure and never commit it to version control

## Testing HTTPS

Test the HTTPS endpoint:

```bash
# Test health endpoint
curl -k https://localhost:3443/api/health

# Test chat endpoint
curl -k -X POST https://localhost:3443/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!", "userId": "test_user"}'
```

Note: The `-k` flag ignores SSL certificate verification for self-signed certs.
